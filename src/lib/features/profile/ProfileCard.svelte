<script lang="ts">
import type { GithubStats } from "$lib/utils/types"
import { accountAge, formatNumber } from "$lib/utils/format"
import { ExternalLink, Calendar, Users } from "lucide-svelte"
import { Card, CardContent } from "$lib/components/ui/card"
import { Badge } from "$lib/components/ui/badge"
import { cn } from "$lib/utils"

let { stats, login }: { stats: GithubStats; login: string } = $props()

let displayName = $derived(stats.displayName || login)
</script>

<Card class={cn("glass relative overflow-hidden rounded-2xl")}>
  <div aria-hidden="true" class={cn(
    "absolute -top-12 -left-12 w-44 h-44 rounded-full pointer-events-none",
    "bg-[radial-gradient(circle,rgba(196,167,231,0.14)_0%,transparent_70%)] blur-[36px]"
  )}></div>

  <div aria-hidden="true" class={cn(
    "absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none",
    "bg-[radial-gradient(circle,rgba(156,207,216,0.10)_0%,transparent_70%)] blur-[28px]"
  )}></div>

  <CardContent class={cn("relative flex items-start gap-3 sm:gap-5 p-4 sm:p-6")}>
    <!--
      Explicit width + height attributes fix the "Image elements have explicit
      width and height" Lighthouse warning and prevent CLS.
    -->
    <div class="shrink-0 w-[64px] h-[64px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden
      border border-iris/28
      shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5),0_0_0_4px_rgba(196,167,231,0.05)]">
      <img
        src={stats.avatarUrl}
        alt="{displayName}'s GitHub avatar"
        width="80"
        height="80"
        class="w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
    </div>

    <div class={cn("flex flex-col gap-1.5 min-w-0 flex-1")}>
      <div class={cn("flex items-start justify-between gap-2 flex-wrap")}>
        <h2 class={cn(
          "text-lg sm:text-2xl leading-tight font-semibold",
          "truncate font-serif text-[var(--text)]"
        )}>
          {displayName}
        </h2>
        <Badge variant="outline" class={cn(
          "shrink-0 font-mono text-[10px] px-2 py-1",
          "bg-foam/8 border-foam/18 text-foam gap-1"
        )}>
          <Calendar size={9} />
          {accountAge(stats.accountCreatedAt)}
        </Badge>
      </div>

      {#if stats.bio}
        <p class={cn("text-xs sm:text-sm leading-relaxed line-clamp-2 text-subtle")}>{stats.bio}</p>
      {/if}

      <div class={cn("flex items-center justify-between gap-2 mt-1 flex-wrap")}>

        <a
          href="https://github.com/{login}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View {displayName} on GitHub"
          class={cn(
            "flex items-center gap-1 text-xs font-mono text-subtle",
            "hover:text-iris transition-colors duration-150"
          )}
        >
          <span class={cn("w-1.5 h-1.5 rounded-full bg-foam")} aria-hidden="true"></span>
          github.com/{login}
          <ExternalLink size={9} aria-hidden="true" />
        </a>

        <div class={cn("flex items-center gap-3 text-[10px] font-mono text-subtle")}>
          <span class={cn("flex items-center gap-1")}>
            <Users size={9} class={cn("text-subtle")} aria-hidden="true" />
            <span class={cn("text-[var(--text)] font-medium")}>{formatNumber(stats.followers)}</span>
            followers
          </span>
          <span>
            <span class={cn("text-[var(--text)] font-medium")}>{formatNumber(stats.following)}</span>
            following
          </span>
        </div>
      </div>

    </div>
  </CardContent>
</Card>
