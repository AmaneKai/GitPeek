import { pickAccentColor } from './accent-cycle'

export interface ProportionDatum {
  name: string
  percentage: number
}

export type PieSlice = ProportionDatum & {
  color: string
  startAngleDegrees: number
  endAngleDegrees: number
  midAngleDegrees: number
}

const GAP_DEGREES = 1.8
const PUSH_PIXELS = 7

export function getDimensions(isMobileDevice: boolean) {
  const sizePixels = isMobileDevice ? 160 : 200
  const outerRadiusPixels = isMobileDevice ? 75 : 90
  const innerRadiusPixels = isMobileDevice ? 48 : 57

  return {
    sizePixels,
    centerX: sizePixels / 2,
    centerY: sizePixels / 2,
    outerRadiusPixels,
    innerRadiusPixels,
  }
}

export function polarToCoordinates(
  centerX: number,
  centerY: number,
  radius: number,
  degrees: number,
) {
  const radians = (degrees * Math.PI) / 180

  return {
    positionX: centerX + radius * Math.cos(radians),
    positionY: centerY + radius * Math.sin(radians),
  }
}

export function generateArcPath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  offsetX = 0,
  offsetY = 0,
): string {
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  const outerStart = polarToCoordinates(centerX, centerY, outerRadius, startAngle)
  const outerEnd = polarToCoordinates(centerX, centerY, outerRadius, endAngle)
  const innerStart = polarToCoordinates(centerX, centerY, innerRadius, endAngle)
  const innerEnd = polarToCoordinates(centerX, centerY, innerRadius, startAngle)

  return [
    `M ${outerStart.positionX + offsetX} ${outerStart.positionY + offsetY}`,
    `A ${outerRadius} ${outerRadius}
    0 ${largeArcFlag} 1 ${outerEnd.positionX + offsetX} ${outerEnd.positionY + offsetY}`,
    `L ${innerStart.positionX + offsetX} ${innerStart.positionY + offsetY}`,
    `A ${innerRadius} ${innerRadius}
    0 ${largeArcFlag} 0 ${innerEnd.positionX + offsetX} ${innerEnd.positionY + offsetY}`,
    'Z',
  ].join(' ')
}

export function calculateSegmentOffset(slice: PieSlice): { offsetX: number; offsetY: number } {
  const radians = (slice.midAngleDegrees * Math.PI) / 180

  return {
    offsetX: Math.cos(radians) * PUSH_PIXELS,
    offsetY: Math.sin(radians) * PUSH_PIXELS,
  }
}

export function buildPieSlices(items: ProportionDatum[]): PieSlice[] {
  if (!items?.length) return []

  let cursorDegrees = -90

  return items.map((item, index) => {
    const spanDegrees = (item.percentage / 100) * 360
    const startAngleDegrees = cursorDegrees + GAP_DEGREES / 2
    const endAngleDegrees = cursorDegrees + spanDegrees - GAP_DEGREES / 2
    const midAngleDegrees = cursorDegrees + spanDegrees / 2

    cursorDegrees += spanDegrees

    return {
      name: item.name,
      percentage: item.percentage,
      color: pickAccentColor(index),
      startAngleDegrees,
      endAngleDegrees,
      midAngleDegrees,
    }
  })
}
