// server/engine/panic.engine.ts
import panicDB from '~/server/assets/panic_db.json'
import { ProductMap } from '~/core/product-map'

export interface PanicEntry {
  code: string
  keywords?: string[]
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

function autoSeverity(list: PanicEntry[]) {
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

function matchCodes(text: string): PanicEntry[] {
  const found: PanicEntry[] = []
  const lowerText = text.toLowerCase()

  for (const item of panicDB) {
    if (!item.code) { continue }

    let matched = false
    const code = item.code
    const lowerCode = code.toLowerCase()

    // 1. Matching exacto del código (hex o texto)
    const codeMatches = [
      text.includes(code),
      lowerText.includes(lowerCode),
      text.includes(` ${code} `),
      lowerText.includes(` ${lowerCode} `),
      text.includes(`\n${code}`),
      lowerText.includes(`\n${lowerCode}`),
      text.includes(`${code}:`),
      lowerText.includes(`${lowerCode}:`),
      // Para códigos hex, buscar sin 0x también
      code.startsWith('0x') && (
        text.includes(code) ||
        text.includes(code.substring(2)) ||
        lowerText.includes(code.substring(2).toLowerCase())
      )
    ].some(match => match)

    if (codeMatches) {
      matched = true
    }

    // 2. Buscar en keywords (NUEVO - para cuando no hay código hex visible)
    if (!matched && item.keywords && item.keywords.length > 0) {
      const keywordMatch = item.keywords.some(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        return lowerText.includes(lowerKeyword) ||
               text.includes(keyword)
      })
      if (keywordMatch) {
        matched = true
      }
    }

    // 3. Buscar en notes si existe (para casos especiales)
    if (!matched && item.notes) {
      const lowerNotes = item.notes.toLowerCase()
      // Extraer palabras clave de notes y buscarlas
      const notesKeywords = lowerNotes.split(/\s+/).filter(w => w.length > 5)
      const notesMatch = notesKeywords.some(word => lowerText.includes(word))
      if (notesMatch) {
        matched = true
      }
    }

    // 4. Buscar componente en el texto (fallback)
    if (!matched && item.component) {
      const componentKeywords = item.component.toLowerCase()
        .replace(/[\/\(\)]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4)
      
      const componentMatch = componentKeywords.some(word => 
        lowerText.includes(word) && text.length > 100
      )
      if (componentMatch) {
        matched = true
      }
    }

    if (matched) {
      found.push(item)
    }
  }

  return found
}

function groupByCategory(list: PanicEntry[]) {
  const out: Record<string, PanicEntry[]> = {}

  for (const item of list) {
    const cat = item.component || 'General'

    if (!out[cat]) { out[cat] = [] }
    out[cat].push(item)
  }

  return out
}

function extractModelFromPanic(text: string) {
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

// Función para extraer códigos hex específicos del texto (nuevo)
function extractHexCodes(text: string): string[] {
  const hexPattern = /0x[0-9a-fA-F]{2,8}\b/g
  return text.match(hexPattern) || []
}

// Función para extraer patrones de texto clave (nuevo)
function extractTextPatterns(text: string): string[] {
  const patterns = [
    /missing sensor[s]?\s*:?\s*(\w+)/gi,
    /(\w+)\s*failed/gi,
    /(\w+)\s*error/gi,
    /(\w+)\s*timeout/gi,
    /(\w+)\s*panic/gi,
    /assertion failed/gi,
    /external device/gi,
    /watchdog timeout/gi
  ]
  
  const matches: string[] = []
  for (const pattern of patterns) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }
  return matches
}

export function analyzePanicLog(text: string) {
  // 1. Extraer metadata del texto
  const hexCodesFound = extractHexCodes(text)
  const textPatterns = extractTextPatterns(text)
  
  // 2. Detectar códigos basados en el texto completo
  const detected = matchCodes(text)
  
  // 3. Extraer modelo para INFO, no para filtrar
  const model = extractModelFromPanic(text) || 'Desconocido'

  // 4. Ordenar por relevancia (códigos hex encontrados primero)
  const sortedDetected = detected.sort((a, b) => {
    const aHex = hexCodesFound.includes(a.code) ? 1 : 0
    const bHex = hexCodesFound.includes(b.code) ? 1 : 0
    return bHex - aHex
  })

  // 5. Agrupar TODOS los detectados (sin filtrar por modelo)
  const grouped = groupByCategory(sortedDetected)
  const severity = autoSeverity(sortedDetected)

  // 6. Generar resumen inteligente
  const summary = {
    severity,
    model,
    total: sortedDetected.length,
    hexCodesFound: hexCodesFound.length > 0 ? hexCodesFound : null,
    textPatternsFound: textPatterns.length > 0 ? textPatterns : null,
    confidence: sortedDetected.length > 0 
      ? Math.round(sortedDetected.reduce((acc, item) => acc + (item.certainty || 50), 0) / sortedDetected.length)
      : 0
  }

  return {
    summary,
    grouped,
    detected: sortedDetected,
    metadata: {
      hexCodes: hexCodesFound,
      patterns: textPatterns,
      analysisDate: new Date().toISOString()
    }
  }
}
