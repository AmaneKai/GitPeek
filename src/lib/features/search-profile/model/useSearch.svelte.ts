import { createQuery } from '@tanstack/svelte-query'
import { createGithubClient } from '$lib/entities/github-stats/api/github-client'
import { GHFETCH_STATS_URL } from '$lib/entities/github-stats/api/config'
import { warmServerStats } from '$lib/entities/github-stats/api/warm-server-stats'

const STATS_REQUEST_TIMEOUT_MILLISECONDS = 8000
const STATS_STALE_TIME_MILLISECONDS = 60 * 1000

const client = createGithubClient({
  apiUrl: GHFETCH_STATS_URL,
  requestTimeoutMilliseconds: STATS_REQUEST_TIMEOUT_MILLISECONDS,
})

export function useSearch() {
  let currentUsername = $state('')

  const query = createQuery(() => ({
    queryKey: ['github-stats', currentUsername],
    queryFn: async () => {
      const result = await client.fetchStats(currentUsername)

      if (!result.ok) throw new Error(result.error.message)

      warmServerStats(currentUsername, result.value)

      return result.value
    },
    enabled: currentUsername.length > 0,
    staleTime: STATS_STALE_TIME_MILLISECONDS,
  }))

  function onSearch(username: string) {
    if (!username) return

    if (currentUsername === username) {
      query.refetch()
    } else {
      currentUsername = username
    }
  }

  return {
    get currentUsername() {
      return currentUsername
    },
    get loading() {
      return query.isLoading
    },
    get error() {
      return query.error?.message ?? null
    },
    get stats() {
      return query.data ?? null
    },
    get noResults() {
      return query.isError
    },
    onSearch,
  }
}
