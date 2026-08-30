import {
  Star,
  Users,
  GitCommitHorizontal,
  GitPullRequest,
  CircleDot,
  BookOpen,
  Activity,
} from 'lucide-svelte'
import type { GithubStats } from './github-stats'

export type StatItem = {
  label: string
  value: number
  icon: unknown
  accentVar: string
}

export function heroItems(stats: GithubStats): StatItem[] {
  return [
    { label: 'Contributions', value: stats.totalContributions, icon: Activity, accentVar: 'foam' },
    { label: 'Commits', value: stats.totalCommits, icon: GitCommitHorizontal, accentVar: 'iris' },
  ]
}

export function detailItems(stats: GithubStats): StatItem[] {
  return [
    { label: 'Stars', value: stats.totalStars, icon: Star, accentVar: 'gold' },
    { label: 'Repos', value: stats.totalRepos, icon: BookOpen, accentVar: 'iris' },
    { label: 'Followers', value: stats.followers, icon: Users, accentVar: 'rose' },
    { label: 'PRs', value: stats.totalPrs, icon: GitPullRequest, accentVar: 'love' },
    { label: 'Issues', value: stats.totalIssues, icon: CircleDot, accentVar: 'gold' },
  ]
}
