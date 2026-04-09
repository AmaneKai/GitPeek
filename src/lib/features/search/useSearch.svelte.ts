import { toast } from "svelte-sonner"
import { fetchStats } from "$lib/utils/api"
import type { GithubStats } from "$lib/utils/types"

export function useSearch() {
  let stats           = $state<GithubStats | null>(null)
  let loading         = $state(false)
  let searched        = $state(false)
  let currentUsername = $state("")

  async function onSearch(username: string) {
    loading         = true
    stats           = null
    searched        = true
    currentUsername = username

    const result = await fetchStats(username)
    loading = false

    if (result.ok) {
      stats = result.data
    } else {
      toast.error(result.error)
    }
  }

  return {
    get stats()           { return stats           },
    get loading()         { return loading         },
    get searched()        { return searched        },
    get currentUsername() { return currentUsername },
    get noResults()       { return searched && !loading && !stats },
    onSearch,
  }
}
