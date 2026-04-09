/**
 * Tilt — mouse-follow 3-D card effect.
 *
 * Pure functions → no Svelte reactivity, easy to unit-test.
 * Automatically no-ops on coarse-pointer (touch) devices.
 */

export interface TiltState {
  rotX:   number
  rotY:   number
  /** Cursor X position as a percentage (0-100) inside the element */
  px:     number
  /** Cursor Y position as a percentage (0-100) inside the element */
  py:     number
  active: boolean
}

const TILT_MAX_DEG = 12

export function neutralTilt(): TiltState {
  return { rotX: 0, rotY: 0, px: 50, py: 50, active: false }
}

/** Returns an updated TiltState from a mousemove event. */
export function applyTilt(e: MouseEvent, target: HTMLElement): TiltState {
  if (isTouchDevice()) return neutralTilt()

  const rect = target.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return neutralTilt()

  const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
  const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)

  return {
    rotX:   -dy * TILT_MAX_DEG,
    rotY:    dx * TILT_MAX_DEG,
    px: ((e.clientX - rect.left) / rect.width)  * 100,
    py: ((e.clientY - rect.top)  / rect.height) * 100,
    active: true,
  }
}

/**
 * Returns the inline `style` string for a tilt card.
 * The glass base styles live in app.css (.glass); only the
 * dynamic parts (transform, shadow, border-alpha) are computed here.
 */
export function tiltStyle(t: TiltState): string {
  if (!t.active) {
    return [
      "border-color: rgba(144,140,170,0.15)",
      "box-shadow: 0 1px 0 0 rgba(224,222,244,0.05) inset, 0 4px 16px -4px rgba(0,0,0,0.35)",
      "transform: perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)",
      "will-change: transform",
      "transition: transform 0.10s ease, box-shadow 0.10s ease, border-color 0.10s ease",
    ].join(";")
  }

  const shadowX = (-t.rotY * 1.6).toFixed(1)
  const shadowY = ( t.rotX * 1.6).toFixed(1)

  return [
    "border-color: rgba(144,140,170,0.28)",
    `box-shadow: ${shadowX}px ${shadowY}px 28px rgba(0,0,0,0.4),`
      + " 0 0 0 1px rgba(196,167,231,0.14)",
    `transform: perspective(600px) rotateX(${t.rotX}deg)`
      + ` rotateY(${t.rotY}deg) translateZ(8px)`,
    "will-change: transform",
    "transition: transform 0.10s ease, box-shadow 0.10s ease, border-color 0.10s ease",
  ].join(";")
}

/** Radial shine overlay positioned at the cursor — used as a child div style. */
export function shineStyle(t: TiltState): string {
  if (!t.active) return ""
  return (
    `background: radial-gradient(circle at ${t.px}% ${t.py}%,`
    + " rgba(255,255,255,0.09) 0%, transparent 55%)"
  )
}

// ── Private helpers ───────────────────────────────────────────────────────────

function isTouchDevice(): boolean {
  return (
    typeof window !== "undefined"
    && window.matchMedia("(pointer: coarse)").matches
  )
}
