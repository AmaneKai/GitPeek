<script lang="ts">
  import type { MostStarredRepo } from "$lib/utils/types"
  import { formatNumber } from "$lib/utils/format"
  import { Star, ArrowUpRight } from "lucide-svelte"

  let { repo }: { repo: MostStarredRepo } = $props()
</script>

{#if repo}
  <a 
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    class="
      group block no-underline glass rounded-2xl p-5
      hover:-translate-y-px
      transition-[border-color,box-shadow,transform] duration-[180ms] ease-out
    "
    style="
      --hover-border: color-mix(in srgb, var(--gold) 32%, transparent);
    "
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-2 min-w-0 flex-1">
        <span class="text-[9px] font-mono uppercase tracking-[0.2em]"
          style="color: var(--muted)">
          ★ most starred repo
        </span>
        <span class="text-lg leading-tight font-semibold truncate font-serif"
          style="color: var(--text)">
          {repo.name}
        </span>
        <div class="flex items-center gap-2 mt-1">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style="background:color-mix(in srgb, var(--gold) 10%, transparent);
                   border:1px solid color-mix(in srgb, var(--gold) 20%, transparent);
                   color:var(--gold);">
            <Star size={12} style="fill:var(--gold)" />
            <span class="text-sm font-mono font-semibold">
              {formatNumber(repo.stars)}
            </span>
          </div>
          <span class="text-[10px] font-mono" style="color:var(--muted)">stars</span>
        </div>
      </div>
      <span
        class="mt-1 w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-[background,color] duration-200"
        style="background:color-mix(in srgb, var(--highlight-med) 60%, transparent); color:var(--muted);"
      >
        <ArrowUpRight size={15} />
      </span>
    </div>
  </a>
{/if}
