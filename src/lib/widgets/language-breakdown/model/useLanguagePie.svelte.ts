import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import type { GitHubLanguage } from '$lib/entities/github-stats/model/github-stats'
import { buildPieSlices, getDimensions } from '$lib/shared/lib/pie-geometry'

export function useLanguagePie(getLanguages: () => GitHubLanguage[]) {
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 640
  const dimensions = getDimensions(isMobileDevice)

  let hoveredIndex = $state<number | null>(null)
  const sweepDegrees = new Tween(-90, { duration: 1200, easing: cubicOut })
  sweepDegrees.target = 270
  const slices = $derived(buildPieSlices(getLanguages()))

  const animatedSlices = $derived(
    slices
      .filter((slice) => sweepDegrees.current > slice.startAngleDegrees)
      .map((slice) => ({
        ...slice,
        endAngleDegrees: Math.min(slice.endAngleDegrees, sweepDegrees.current),
      })),
  )

  return {
    dimensions,
    get hoveredIndex() {
      return hoveredIndex
    },
    get slices() {
      return slices
    },
    get animatedSlices() {
      return animatedSlices
    },
    onEnter(index: number) {
      hoveredIndex = index
    },
    onLeave() {
      hoveredIndex = null
    },
  }
}
