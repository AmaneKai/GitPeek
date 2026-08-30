import { ACCENT_COLORS } from '$lib/shared/lib/accent-cycle'
import { buildPieSlices, type PieSlice, type ProportionDatum } from '$lib/shared/lib/pie-geometry'

const ACCENT_TOKEN_KEYS = ACCENT_COLORS.map((cssVariable) => cssVariable.slice('var(--'.length, -1))

export function buildThemedSlices(
  languages: ProportionDatum[],
  themeTokens: Record<string, string>,
): PieSlice[] {
  return buildPieSlices(languages).map((slice, index) => ({
    ...slice,
    color: themeTokens[ACCENT_TOKEN_KEYS[index % ACCENT_TOKEN_KEYS.length]],
  }))
}

export interface LegendGrouping {
  displayed: PieSlice[]
  otherPercent: number
  otherCount: number
}

export function groupSlicesForLegend(
  slices: PieSlice[],
  minPercent = 3,
  maxDisplayed = 7,
): LegendGrouping {
  const aboveThreshold = slices.filter((slice) => slice.percentage >= minPercent)
  const displayed = aboveThreshold.slice(0, maxDisplayed)
  const rest = slices.filter((slice) => !displayed.includes(slice))
  const otherPercent = rest.reduce((sum, slice) => sum + slice.percentage, 0)

  return { displayed, otherPercent, otherCount: rest.length }
}
