import { config, validateUsername } from "./config"
import { ok, err, type Result } from "./types"
import type { GithubStats } from "./types"

type WorkerResponse =
  | { ok: true;  data:  GithubStats }
  | { ok: false; error: string      }

const buildUrl = (username: string): string =>
  `${config.apiUrl}?username=${encodeURIComponent(username.trim().toLowerCase())}&_t=${Date.now()}`

const fetchWithTimeout = (url: string, ms: number): Promise<Response> => {
  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { signal: ctrl.signal, cache: "no-store" })
    .finally(() => clearTimeout(timer))
}

const HTTP_ERRORS: Array<[(s: number) => boolean, string]> = [
  [s => s === 404,              "GitHub user not found"],
  [s => s === 429,              "Rate limited — try again in a moment"],
  [s => s === 502 || s === 503, "Service is unavailable, try again shortly"],
  [s => s >= 500,               "Something went wrong on our end, try again shortly"],
  [s => s >= 400,               "Bad request — check the username and try again"],
]

const friendlyHttpError = (status: number): string =>
  HTTP_ERRORS.find(([pred]) => pred(status))?.[1] ?? "Unexpected error, please try again"

const isUserNotFound = (status: number, body: string): boolean =>
  status === 404 || (status === 502 && body.toLowerCase().includes("null"))

const isValidStats = (s: GithubStats): boolean =>
  Boolean(s?.avatarUrl && s?.displayName)

const parseErrorResponse = async (res: Response): Promise<Result<GithubStats>> => {
  const body = await res.text().catch(() => "")
  return err(isUserNotFound(res.status, body)
    ? "GitHub user not found"
    : friendlyHttpError(res.status)
  )
}

const parseJsonResponse = async (res: Response): Promise<Result<GithubStats>> => {
  const json: WorkerResponse = await res.json().catch(() => null)
  if (!json)                  return err("Response was not valid JSON")
  if (!json.ok)               return err("Could not load this profile — try again")
  if (!isValidStats(json.data)) return err("Response is missing required fields")
  return ok(json.data)
}

const parseResponse = (res: Response): Promise<Result<GithubStats>> =>
  res.ok ? parseJsonResponse(res) : parseErrorResponse(res)

const friendlyNetworkError = (e: unknown): string => {
  const msg = e instanceof Error ? e.message : ""
  return msg.includes("abort")
    ? "Request timed out"
    : "Network error — check your connection"
}

export const fetchStats = async (username: string): Promise<Result<GithubStats>> => {
  if (!validateUsername(username))
    return err("Username must be 1–39 alphanumeric characters or hyphens")

  return fetchWithTimeout(buildUrl(username), config.timeout)
    .then(parseResponse)
    .catch(e => err(friendlyNetworkError(e)))
}
