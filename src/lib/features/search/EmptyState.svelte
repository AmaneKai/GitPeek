<script lang="ts">
  import { UserX } from "lucide-svelte"

  let { username }: { username: string } = $props()
</script>

<div class="
  glass w-full max-w-sm rounded-2xl px-8 py-12
  flex flex-col items-center text-center gap-4 fade-in-up
">
  <div class="
    w-12 h-12 rounded-full flex items-center justify-center mb-2
    bg-surface border border-highlight-med
  ">
    <UserX class="w-6 h-6 text-muted" />
  </div>
  <div>
    <h3 class="text-lg font-medium mb-1 text-rp-text">User not found</h3>
    <p class="text-sm font-mono leading-relaxed text-subtle">
      No GitHub profile for
      <span class="font-semibold text-rp-text">@{username}</span>.
      Check the spelling and try again.
    </p>
  </div>
</div>
