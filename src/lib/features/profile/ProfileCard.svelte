<script lang="ts">
  import type { GithubStats } from "$lib/utils/types"
  import { accountAge, formatNumber } from "$lib/utils/format"
  import { ExternalLink, Calendar, Users } from "lucide-svelte"
  import { Card, CardContent } from "$lib/components/ui/card"
  import { cn } from "$lib/utils"

  let { stats, login }: { stats: GithubStats; login: string } = $props()
  let displayName = $derived(stats.displayName || login)
</script>

<Card class={cn("glass relative overflow-hidden rounded-2xl")}>
  <div aria-hidden="true" class="absolute -top-12 -left-12 w-44 h-44 rounded-full pointer-events-none blur-[36px]"
    style="background:radial-gradient(circle, color-mix(in srgb, var(--iris) 14%, transparent) 0%, transparent 70%)">
  </div>
  <div aria-hidden="true" class="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none blur-[28px]"
    style="background:radial-gradient(circle, color-mix(in srgb, var(--foam) 10%, transparent) 0%, transparent 70%)">
  </div>

  <CardContent class={cn("relative flex items-start gap-3 sm:gap-5 p-4 sm:p-6")}>
    <div class="shrink-0 w-[64px] h-[64px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden"
      style="border:1px solid color-mix(in srgb, var(--iris) 28%, transparent);
             box-shadow:0 8px 24px -6px rgba(0,0,0,0.5), 0 0 0 4px color-mix(in srgb, var(--iris) 5%, transparent);">
      <img
        src={stats.avatarUrl}
        alt="{displayName}'s GitHub avatar"
        width="80" height="80"
        class="w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
    </div>

    <div class="flex flex-col gap-1.5 min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2 flex-wrap">
        <h2 class="text-lg sm:text-2xl leading-tight font-semibold truncate font-serif"
          style="color: var(--text)">
          {displayName}
        </h2>
        <div class="shrink-0 flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded-md"
          style="background:color-mix(in srgb, var(--foam) 8%, transparent);
                 border:1px solid color-mix(in srgb, var(--foam) 18%, transparent);
                 color:var(--foam);">
          <Calendar size={9} />
          {accountAge(stats.accountCreatedAt)}
        </div>
      </div>

      {#if stats.bio}
        <p class="text-xs sm:text-sm leading-relaxed line-clamp-2"
          style="color: var(--subtle)">{stats.bio}</p>
      {/if}

      <div class="flex items-center justify-between gap-2 mt-1 flex-wrap">
        <a  
          href="https://github.com/{login}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View {displayName} on GitHub"
          class="flex items-center gap-1 text-xs font-mono transition-colors duration-150"
          style="color: var(--subtle)"
        >
          <span class="w-1.5 h-1.5 rounded-full" style="background:var(--foam)" aria-hidden="true"></span>
          github.com/{login}
          <ExternalLink size={9} aria-hidden="true" />
        </a>

        <div class="flex items-center gap-3 text-[10px] font-mono" style="color: var(--subtle)">
          <span class="flex items-center gap-1">
            <Users size={9} aria-hidden="true" />
            <span class="font-medium" style="color: var(--text)">{formatNumber(stats.followers)}</span>
            followers
          </span>
          <span>
            <span class="font-medium" style="color: var(--text)">{formatNumber(stats.following)}</span>
            following
          </span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
