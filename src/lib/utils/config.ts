import { dev } from "$app/environment"

export interface AppConfig {
  apiUrl:        string
  timeout:       number
  usernameRegex: RegExp
}

const DEFAULTS = {
  API_URL:    "https://ghfetch.carlosranara.workers.dev",
  TIMEOUT_MS: 10_000,
  MAX_TIMEOUT_MS: 30_000,
} as const

const USERNAME_REGEX = /^[a-zA-Z0-9-]{1,39}$/

// ── Env helpers ───────────────────────────────────────────────────────────────

type Env = Record<string, string | undefined>

function readEnv(): Env {
  return typeof import.meta !== "undefined"
    ? (import.meta.env as Env)
    : {}
}

function resolveApiUrl(env: Env): string {
  const url = env.VITE_API_URL ?? (dev ? env.PUBLIC_API_URL : undefined)
  return typeof url === "string" && url.length > 0 ? url : DEFAULTS.API_URL
}

function resolveTimeout(env: Env): number {
  const raw    = env.VITE_API_TIMEOUT
  const parsed = typeof raw === "string" ? parseInt(raw, 10) : NaN

  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, DEFAULTS.MAX_TIMEOUT_MS)
    : DEFAULTS.TIMEOUT_MS
}

// ── Public API ────────────────────────────────────────────────────────────────

function buildConfig(): AppConfig {
  const env = readEnv()
  return {
    apiUrl:        resolveApiUrl(env),
    timeout:       resolveTimeout(env),
    usernameRegex: USERNAME_REGEX,
  }
}

export const config = buildConfig()

export function validateUsername(username: unknown): username is string {
  return (
    typeof username === "string"
    && username.length > 0
    && username.length <= 39
    && USERNAME_REGEX.test(username)
  )
}
