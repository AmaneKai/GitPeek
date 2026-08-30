import { SvelteMap } from 'svelte/reactivity'
import { neutralTilt, applyTilt, type TiltState } from '$lib/shared/lib/mouse-tilt'

const CARD_COUNT = 8

export function useStatGrid() {
  const tilts = $state<TiltState[]>(Array.from({ length: CARD_COUNT }, neutralTilt))
  const cachedRects = new SvelteMap<number, DOMRect>()
  let activeRafId: number | null = null

  return {
    get tilts() {
      return tilts
    },
    onEnter(e: MouseEvent, index: number) {
      cachedRects.set(index, (e.currentTarget as HTMLElement).getBoundingClientRect())
    },
    onMove(e: MouseEvent, index: number) {
      const target = e.currentTarget as HTMLElement
      const clientX = e.clientX
      const clientY = e.clientY
      if (activeRafId !== null) return

      activeRafId = requestAnimationFrame(() => {
        activeRafId = null
        let rect = cachedRects.get(index)
        if (!rect) {
          rect = target.getBoundingClientRect()
          cachedRects.set(index, rect)
        }
        tilts[index] = applyTilt({ clientX, clientY } as MouseEvent, target, rect)
      })
    },
    onLeave(_e: MouseEvent, index: number) {
      if (activeRafId !== null) {
        cancelAnimationFrame(activeRafId)
        activeRafId = null
      }
      cachedRects.delete(index)
      tilts[index] = neutralTilt()
    },
  }
}
