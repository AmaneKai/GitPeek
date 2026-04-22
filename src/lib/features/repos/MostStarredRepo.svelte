<script lang="ts">
  import type { MostStarredRepo } from "$lib/utils/types"
  import { formatNumber } from "$lib/utils/format"
  import { Star, ArrowUpRight } from "lucide-svelte"
  import { Badge } from "$lib/components/ui/badge"
  import { Button } from "$lib/components/ui/button"
  import { Card, CardContent } from "$lib/components/ui/card"

  let { repo }: { repo: MostStarredRepo } = $props()
</script>

{#if repo}
  <Card class="glass rounded-2xl hover:-translate-y-px transition-[border-color,box-shadow,transform] duration-[180ms] ease-out overflow-hidden">
   <a 
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      class="block no-underline"
    >
      <CardContent class="p-5">
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
              <Badge
                variant="outline"
                class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono"
                style="background:color-mix(in srgb, var(--gold) 10%, transparent);
                       border-color:color-mix(in srgb, var(--gold) 20%, transparent);
                       color:var(--gold);"
              >
                <Star size={12} style="fill:var(--gold)" />
                {formatNumber(repo.stars)}
              </Badge>
              <span class="text-[10px] font-mono" style="color:var(--muted)">stars</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            class="mt-1 w-8 h-8 rounded-xl shrink-0"
            style="background:color-mix(in srgb, var(--highlight-med) 60%, transparent); color:var(--muted);"
          >
            <ArrowUpRight size={15} />
          </Button>
        </div>
      </CardContent>
    </a>
  </Card>
{/if}
