export const ACCENT_COLORS = [
  'var(--love)',
  'var(--gold)',
  'var(--rose)',
  'var(--pine)',
  'var(--foam)',
  'var(--iris)',
]

export const COLORS = ACCENT_COLORS

export function pickAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length]
}
