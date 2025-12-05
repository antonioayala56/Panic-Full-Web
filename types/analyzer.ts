// types/analyzer.ts — Tipos centrales del motor de análisis

export interface MatchResult {
  id: string
  title?: string
  summary?: string
  score?: number
  certainty?: number
  status?: string
  solution?: string
  notes?: string
  type?: string
  models?: string[]
  products?: string[]
}

export interface AnalyzeOut {
  ok: boolean
  top: MatchResult[]
  product?: string
  modelName?: string
  hex: string[]
  words: string[]
}
