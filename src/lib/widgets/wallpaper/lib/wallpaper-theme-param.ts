import {
  DEFAULT_PRESET_NAME,
  PRESET_THEMES,
  TOKEN_LABELS,
  type ThemeTokens,
} from '$lib/entities/theme/model/theme-manager'

const THEME_TOKEN_KEYS = Object.keys(TOKEN_LABELS)
const HEX_COLOR_PATTERN = /^[0-9a-fA-F]{3,8}$/
const TOKEN_SEPARATOR = '-'

export function packThemeTokens(tokens: ThemeTokens): string {
  return THEME_TOKEN_KEYS.map((key) => stripLeadingHash(tokens[key] ?? '')).join(TOKEN_SEPARATOR)
}

export function parseThemeParameter(packed: string | null): ThemeTokens | null {
  if (!packed) return null

  const values = packed.split(TOKEN_SEPARATOR)
  if (values.length !== THEME_TOKEN_KEYS.length) return null

  const tokens: ThemeTokens = {}
  for (const [index, key] of THEME_TOKEN_KEYS.entries()) {
    const value = values[index]
    if (!HEX_COLOR_PATTERN.test(value)) return null
    tokens[key] = `#${value}`
  }

  return tokens
}

export function resolveWallpaperTheme(
  presetName: string | null,
  packedCustomTokens: string | null,
): ThemeTokens {
  return (
    parseThemeParameter(packedCustomTokens) ??
    PRESET_THEMES[presetName ?? ''] ??
    PRESET_THEMES[DEFAULT_PRESET_NAME]
  )
}

function stripLeadingHash(value: string): string {
  return value.trim().replace(/^#/, '')
}
