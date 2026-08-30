const MONO_ADVANCE_EM = 0.6

export function monoNameBudget(rowWidth: number, fontSize: number, percentage: number): number {
  return Math.floor(rowWidth / (fontSize * MONO_ADVANCE_EM)) - `${percentage}%`.length - 1
}

export function fitLegendName(
  name: string,
  percentage: number,
  rowWidth: number,
  fontSize: number,
): string {
  const maxNameChars = monoNameBudget(rowWidth, fontSize, percentage)

  if (name.length <= maxNameChars) return name

  return `${name.slice(0, Math.max(1, maxNameChars - 1))}…`
}

export function wrapName(name: string, maxChars: number, maxLines = 2): string[] {
  const budget = Math.max(1, maxChars)
  const lines: string[] = []
  let rest = name.trim()

  while (rest.length > budget && lines.length < maxLines - 1) {
    const window = rest.slice(0, budget + 1)
    const breakAt = Math.max(window.lastIndexOf(' '), window.lastIndexOf('-'))

    if (breakAt <= 0) {
      lines.push(rest.slice(0, budget))
      rest = rest.slice(budget)
    } else {
      lines.push(rest.slice(0, rest[breakAt] === '-' ? breakAt + 1 : breakAt))
      rest = rest.slice(breakAt + 1)
    }
  }

  lines.push(rest.length > budget ? `${rest.slice(0, Math.max(1, budget - 1))}…` : rest)

  return lines
}
