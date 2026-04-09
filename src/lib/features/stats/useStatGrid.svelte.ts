import type { GithubStats } from "$lib/utils/types"
import { neutralTilt, applyTilt, type TiltState } from "$lib/utils/tilt"
import {
  GitFork, Star, Users, GitCommit,
  GitPullRequest, CircleDot, BookOpen, Activity,
} from "lucide-svelte"

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatItem = {
  label:  string
  value:  number
  icon:   unknown
  accent: string
}

// ─── Stat definitions ─────────────────────────────────────────────────────────

export function heroItems(s: GithubStats): StatItem[] {
  return [
    { label: "Contributions", value: s.totalContributions, icon: Activity,  accent: "#9ccfd8" },
    { label: "Commits",       value: s.totalCommits,       icon: GitCommit, accent: "#c4a7e7" },
  ]
}

export function detailItems(s: GithubStats): StatItem[] {
  return [
    { label: "Stars",     value: s.totalStars,  icon: Star,           accent: "#f6c177" },
    { label: "Repos",     value: s.totalRepos,  icon: BookOpen,       accent: "#c4a7e7" },
    { label: "Followers", value: s.followers,   icon: Users,          accent: "#ebbcba" },
    { label: "PRs",       value: s.totalPrs,    icon: GitPullRequest, accent: "#eb6f92" },
    { label: "Issues",    value: s.totalIssues, icon: CircleDot,      accent: "#f6c177" },
  ]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const CARD_COUNT = 8

export function useStatGrid() {
  let tilts = $state<TiltState[]>(Array.from({ length: CARD_COUNT }, neutralTilt))

  return {
    get tilts() { return tilts },
    onMove(e: MouseEvent, i: number) {
      tilts[i] = applyTilt(e, e.currentTarget as HTMLElement)
    },
    onLeave(_e: MouseEvent, i: number) {
      tilts[i] = neutralTilt()
    },
  }
}
