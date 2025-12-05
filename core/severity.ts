// core/severity.ts
export const SeverityWeights = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
} as const

export type SeverityLevel = keyof typeof SeverityWeights

export function compareSeverity(a: SeverityLevel, b: SeverityLevel): number {
  return SeverityWeights[a] - SeverityWeights[b]
}

export function maxSeverity(list: SeverityLevel[]): SeverityLevel {
  let max: SeverityLevel = "low"

  for (const s of list) {
    if (SeverityWeights[s] > SeverityWeights[max]) {
      max = s
    }
  }
  return max
}
