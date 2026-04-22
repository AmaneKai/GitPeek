<script lang="ts">
  import type { GithubStats } from "$lib/utils/types"
  import { formatNumber } from "$lib/utils/format"
  import { tiltStyle, shineStyle } from "$lib/utils/tilt"
  import { useStatGrid, heroItems, detailItems } from "./useStatGrid.svelte"
  import * as Card from "$lib/components/ui/card"

  let { stats }: { stats: GithubStats } = $props()
  const grid = useStatGrid()

  let isTouch = $state(false)
  $effect(() => {
    if (typeof window !== "undefined") {
      isTouch = window.matchMedia("(pointer: coarse)").matches
    }
  })
</script>

<div class="flex flex-col gap-3">

  <!-- Hero cards (2-col) -->
  <div class="grid grid-cols-2 gap-3">
    {#each heroItems(stats) as item, i}
      {@const Icon   = item.icon as any}
      {@const t      = grid.tilts[i]}
      {@const accent = `var(--${item.accentVar})`}
      <Card.Root
        role="presentation"
        class="tilt-card glass relative overflow-hidden rounded-2xl cursor-default select-none border-0 shadow-none bg-transparent"
        style="{tiltStyle(t)}; animation-delay: {i * 50}ms"
        onmousemove={!isTouch ? (e: any) => grid.onMove(e, i) : undefined}
        onmouseleave={!isTouch ? (e: any) => grid.onLeave(e, i) : undefined}
      >
        <div class="tilt-shine"
          style="background:radial-gradient(ellipse at 100% 0%, color-mix(in srgb, {accent} 9%, transparent) 0%, transparent 60%);"></div>
        {#if !isTouch}
          <div class="tilt-shine" style={shineStyle(t)}></div>
        {/if}

        <Card.Content class="relative z-10 flex flex-col gap-3 sm:gap-4 p-[14px_16px] sm:p-[18px_20px]">
          <div class="flex items-center justify-between">
            <span class="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest"
              style="color: var(--subtle)">
              {item.label}
            </span>
            <span class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center"
              style="background:color-mix(in srgb, {accent} 10%, transparent); color:{accent};">
              <Icon size={12} />
            </span>
          </div>

          <span class="leading-none tracking-tight font-serif font-bold"
            style="font-size: clamp(1.8rem, 5vw, 2.6rem); color: var(--text);">
            {formatNumber(item.value)}
          </span>

          <div class="h-0.5 rounded-full transition-all duration-200" style="
            width:48px;
            transform:scaleX({t.active ? 1 : 0.58});
            transform-origin:left center;
            background:{accent};
            opacity:{t.active ? 0.8 : 0.5};
            box-shadow:{t.active ? `0 0 8px ${accent}` : 'none'};
          "></div>
        </Card.Content>
      </Card.Root>
    {/each}
  </div>

  <!-- Detail cards (3-col) -->
  <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
    {#each detailItems(stats) as item, i}
      {@const Icon   = item.icon as any}
      {@const idx    = i + 2}
      {@const t      = grid.tilts[idx]}
      {@const accent = `var(--${item.accentVar})`}
      <Card.Root
        role="presentation"
        class="tilt-card glass relative overflow-hidden rounded-[14px] cursor-default select-none border-0 shadow-none bg-transparent"
        style="{tiltStyle(t)}; animation-delay: {idx * 50}ms"
        onmousemove={!isTouch ? (e: any) => grid.onMove(e, idx) : undefined}
        onmouseleave={!isTouch ? (e: any) => grid.onLeave(e, idx) : undefined}
      >
        <div class="tilt-shine" style="background:radial-gradient(ellipse at 100% 0%,
          color-mix(in srgb, {accent} 7%, transparent) 0%, transparent 60%);"></div>
        {#if !isTouch}
          <div class="tilt-shine" style={shineStyle(t)}></div>
        {/if}

        <Card.Content class="relative z-10 flex flex-col gap-1.5 sm:gap-2 p-[10px_12px] sm:p-[12px_14px]">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest truncate"
              style="color: var(--subtle)">
              {item.label}
            </span>
            <span class="w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center shrink-0"
              style="background:color-mix(in srgb, {accent} 9%, transparent); color:{accent};">
              <Icon size={9} />
            </span>
          </div>

          <span class="leading-none tracking-tight font-serif font-bold"
            style="font-size: clamp(1.1rem, 4vw, 1.6rem); color: var(--text);">
            {formatNumber(item.value)}
          </span>

          <div class="h-px rounded-full" style="
            width:36px;
            transform:scaleX({t.active ? 1 : 0.55});
            transform-origin:left center;
            background:{accent};
            opacity:{t.active ? 0.7 : 0.4};
            transition:width 0.2s ease, opacity 0.2s ease;
          "></div>
        </Card.Content>
      </Card.Root>
    {/each}
  </div>

</div>
