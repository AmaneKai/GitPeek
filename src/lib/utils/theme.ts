/**
 * Rose Piné color tokens — single source of truth.
 *
 * These mirror the `--color-*` CSS vars in app.css so that TS code
 * (e.g. SVG fills, dynamic accent styles) can reference them without
 * duplicating raw hex values everywhere.
 *
 * Rule: if a color is static, use a Tailwind utility (text-iris, bg-foam …).
 *       Only reach for these tokens when the value must be computed at runtime
 *       (e.g. `background: ${COLORS.iris}1a` for a data-driven accent card).
 */
export const COLORS = {
  base:    "#191724",
  surface: "#1f1d2e",
  overlay: "#26233a",
  muted:   "#6e6a86",
  subtle:  "#908caa",
  text:    "#e0def4",
  love:    "#eb6f92",
  gold:    "#f6c177",
  rose:    "#ebbcba",
  pine:    "#31748f",
  foam:    "#9ccfd8",
  iris:    "#c4a7e7",
} as const

export type ColorToken = keyof typeof COLORS

/**
 * Resolves a language color string that may arrive from the API as either:
 *   - a "rose-pine-*" / "primary" key  →  mapped to COLORS
 *   - a bare hex string                →  returned as-is
 *   - anything unknown                 →  falls back to COLORS.subtle
 */
const ALIAS: Record<string, ColorToken> = {
  "rose-pine-foam":   "foam",
  "rose-pine-gold":   "gold",
  "rose-pine-iris":   "iris",
  "rose-pine-rose":   "rose",
  "rose-pine-love":   "love",
  "rose-pine-pine":   "pine",
  "rose-pine-subtle": "subtle",
  "primary":          "text",
}

export function resolveColor(color: string): string {
  if (!color) return COLORS.subtle

  const alias = ALIAS[color]
  if (alias)            return COLORS[alias]
  if (color.startsWith("#")) return color

  return COLORS.subtle
}
