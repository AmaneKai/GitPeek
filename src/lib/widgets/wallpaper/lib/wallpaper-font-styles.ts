import type { ThemeTokens } from '$lib/entities/theme/model/theme-manager'

export const WALLPAPER_MONO_FONT_STACK = "'JetBrains Mono', 'Noto Sans JP', monospace"
export const WALLPAPER_SERIF_FONT_STACK = "'Gelasio', 'Noto Serif JP', serif"

export function buildWallpaperStyles(theme: ThemeTokens): string {
  return `
    .text-main { font-family: ${WALLPAPER_MONO_FONT_STACK}; fill: ${theme.text}; }
    .text-serif { font-family: ${WALLPAPER_SERIF_FONT_STACK}; fill: ${theme.text}; }
  `
}
