<script lang="ts">
  import type { MostStarredRepo } from "$lib/utils/types"
  import { formatNumber } from "$lib/utils/format"
  import { Star, ArrowUpRight } from "lucide-svelte"
  import { Badge } from "$lib/components/ui/badge"

  let { repo }: { repo: MostStarredRepo } = $props()
</script>

{#if repo}
  <a
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    class="
      group block no-underline glass rounded-2xl p-5
      hover:border-gold/32
      hover:shadow-[0_0_0_1px_rgba(246,193,119,0.10),0_16px_40px_-12px_rgba(0,0,0,0.5)]
      hover:-translate-y-px
      transition-[border-color,box-shadow,transform] duration-[180ms] ease-out
    "
  >
    <div class="flex items-start justify-between gap-4">

      <!-- Left: label, name, star count -->
      <div class="flex flex-col gap-2 min-w-0 flex-1">
        <span class="text-[9px] font-mono uppercase tracking-[0.2em] text-muted">
          ★ most starred repo
        </span>

        <span class="text-lg leading-tight font-semibold truncate font-serif text-rp-text">
          {repo.name}
        </span>

        <div class="flex items-center gap-2 mt-1">
          <Badge variant="outline" class="
            star-badge flex items-center gap-1.5 px-2.5 py-1 rounded-lg
            bg-gold/10 border-gold/20 text-gold
            group-hover:shadow-[0_0_12px_rgba(246,193,119,0.3)]
            transition-shadow duration-[180ms]
          ">
            <Star size={12} class="fill-gold" />
            <span class="text-sm font-mono font-semibold">
              {formatNumber(repo.stars)}
            </span>
          </Badge>
          <span class="text-[10px] font-mono text-muted">stars</span>
        </div>
      </div>

      <!-- Arrow icon -->
      <span class="
        mt-1 w-8 h-8 rounded-xl shrink-0
        flex items-center justify-center
        bg-highlight-med/60 text-muted
        group-hover:bg-gold/14 group-hover:text-gold
        transition-[background,color] duration-200
      ">
        <ArrowUpRight size={15} />
      </span>

    </div>
  </a>
{/if}
