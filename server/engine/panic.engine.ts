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
      text.includes(code),
      lowerText.includes(lowerCode),
      text.includes(` ${code} `),
      lowerText.includes(` ${lowerCode} `),
      text.includes(`\n${code}`),
      lowerText.includes(`\n${lowerCode}`),
      text.includes(`${code}:`),
      lowerText.includes(`${lowerCode}:`),
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
    const productMatch = text.match(/"product"\s*:\s*"([^"]+)"/)
    if (productMatch) {
      const product = productMatch[1]
      return ProductMap[product] || product.replace('iPhone', 'iPhone ').replace(',', ' ')
    }

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

export function analyzePanicLog (text: string) {
  // 1. Detectar SOLO los códigos que aparecen en el archivo
  const detected = matchCodes(text)
  
  // 2. Extraer modelo para INFO, no para filtrar
  const model = extractModelFromPanic(text) || 'Desconocido'

  // 3. Agrupar TODOS los detectados (sin filtrar por modelo)
  const grouped = groupByCategory(detected)
  const severity = autoSeverity(detected)

  return {
    summary: {
      severity,
      model,
      total: detected.length
    },
    grouped,
    detected
  }
}
