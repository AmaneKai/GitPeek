import {
  DEFAULT_PRESET_NAME,
  getSavedPresetName,
  PRESET_THEMES,
  type ThemeTokens,
} from './theme-manager'

let presetName = $state<string | null>(typeof window === 'undefined' ? null : getSavedPresetName())
let activeThemeTokens = $state<ThemeTokens>({ ...PRESET_THEMES[DEFAULT_PRESET_NAME] })

export function getActivePresetName(): string | null {
  return presetName
}

export function setActivePresetName(name: string | null): void {
  presetName = name
}

export function getActiveThemeTokens(): ThemeTokens {
  return activeThemeTokens
}

export function setActiveThemeTokens(tokens: ThemeTokens): void {
  activeThemeTokens = { ...tokens }
}
