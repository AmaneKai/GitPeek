export interface GitHubLanguage {
  name: string
  percentage: number
  color: string
}

export interface MostStarredRepo {
  name: string
  stars: number
  url: string
}

export interface GithubStats {
  totalRepos: number
  totalContributions: number
  totalStars: number
  followers: number
  following: number
  totalCommits: number
  totalPrs: number
  totalIssues: number
  accountCreatedAt: string
  mostStarredRepo: MostStarredRepo | null
  avatarUrl: string
  displayName: string
  bio: string
  languages: GitHubLanguage[]
}

export type Ok<T>    = { ok: true;  data:  T      }
export type Err      = { ok: false; error: string }
export type Result<T> = Ok<T> | Err

export const ok  = <T>(data:  T):      Ok<T> => ({ ok: true,  data  })
export const err = (error: string):    Err   => ({ ok: false, error })
