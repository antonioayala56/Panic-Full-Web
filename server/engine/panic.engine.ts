// server/engine/panic.engine.ts
import panicDB from '~/server/assets/panic_db.json'
import { ProductMap } from '~/core/product-map'

export interface PanicEntry {
  code: string
  component: string
  models?: string[]
  severity: string
  solution: string
  notes?: string
  products?: string[]
  certainty?: number
  status?: string
  type?: string
}

const severityWeight: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
}

function autoSeverity (list: PanicEntry[]) {
  let max = 0
  let level: string = 'low'

  for (const c of list) {
    const w = severityWeight[c.severity] ?? 1
    if (w > max) {
      max = w
      level = c.severity
    }
  }
  return level
}

function matchCodes (text: string) {
  const found: PanicEntry[] = []
  const lowerText = text.toLowerCase()

  for (const item of panicDB) {
    if (!item.code) { continue }

    const code = item.code
    const lowerCode = code.toLowerCase()

    // Múltiples formas de matching para mejor detección
    const matches = [
      // Matching exacto
      text.includes(code),
      // Case insensitive
      lowerText.includes(lowerCode),
      // Con espacios alrededor
      text.includes(` ${code} `),
      lowerText.includes(` ${lowerCode} `),
      // Al inicio de línea
      text.includes(`\n${code}`),
      lowerText.includes(`\n${lowerCode}`),
      // Seguido de dos puntos
      text.includes(`${code}:`),
      lowerText.includes(`${lowerCode}:`),
      // Para códigos hex, buscar sin 0x también
      code.startsWith('0x') && (
        text.includes(code) ||
        text.includes(code.substring(2)) ||
        lowerText.includes(code.substring(2).toLowerCase())
      )
    ].some(match => match)

    if (matches) {
      found.push(item)
    }
  }

  return found
}

function groupByCategory (list: PanicEntry[]) {
  const out: Record<string, PanicEntry[]> = {}

  for (const item of list) {
    const cat = item.component || 'General'

    if (!out[cat]) { out[cat] = [] }
    out[cat].push(item)
  }

  return out
}

function extractModelFromPanic (text: string) {
  try {
    // Buscar el product directamente en el texto usando regex más robusto
    const productMatch = text.match(/"product"\s*:\s*"([^"]+)"/)
    if (productMatch) {
      const product = productMatch[1]
      // Usar el ProductMap centralizado para mapear product a modelo legible
      return ProductMap[product] || product.replace('iPhone', 'iPhone ').replace(',', ' ')
    }

    // Fallback: buscar en bloques JSON
    const jsonBlocks = text.match(/\{[^}]*\}/g)
    if (jsonBlocks) {
      for (const block of jsonBlocks) {
        try {
          const jsonData = JSON.parse(block)
          if (jsonData.product) {
            return ProductMap[jsonData.product] || jsonData.product.replace('iPhone', 'iPhone ').replace(',', ' ')
          }
        } catch {
          continue
        }
      }
    }
  } catch {
    // Error general
  }
  return null
}

function predictModel (text: string, list: PanicEntry[]) {
  // Primero intentar extraer modelo del JSON del panic
  const extractedModel = extractModelFromPanic(text)
  if (extractedModel) { return extractedModel }

  // Fallback a predicción basada en códigos detectados
  const all = list.flatMap(l => l.models || [])
  if (all.length === 0) { return 'Desconocido' }

  const count: Record<string, number> = {}

  for (const m of all) {
    count[m] = (count[m] || 0) + 1
  }

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])[0][0]
}

export function analyzePanicLog (text: string) {
  const detected = matchCodes(text)
  const model = predictModel(text, detected)

  // Filtrar códigos por modelo detectado si hay uno específico
  const filteredCodes = model && model !== 'Desconocido'
    ? detected.filter(code => code.models?.some(m =>
      m.toLowerCase().includes(model.toLowerCase()) ||
        model.toLowerCase().includes(m.toLowerCase())
    )).map(code => ({
      ...code,
      models: [model] // Solo mostrar el modelo detectado
    }))
    : detected

  const grouped = groupByCategory(filteredCodes)
  const severity = autoSeverity(filteredCodes)

  return {
    summary: {
      severity,
      model,
      total: filteredCodes.length
    },
    grouped,
    detected: filteredCodes
  }
}
