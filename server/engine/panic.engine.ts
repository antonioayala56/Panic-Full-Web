// server/engine/panic.engine.ts - VERSIÓN COMPLETA Y CORREGIDA
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

// Función para extraer códigos hex específicos del texto (CORREGIDA)
function extractHexCodes(text: string): string[] {
  // Solo buscar en la sección relevante del panic
  const relevantSection = text.split(/EOF|last started kext|loaded kexts:/i)[0] || text
  
  const hexPattern = /0x[0-9a-fA-F]{2,8}\b/g
  const matches = relevantSection.match(hexPattern) || []
  
  // Filtrar duplicados y códigos muy cortos/largos
  const uniqueCodes = [...new Set(matches)].filter(code => {
    const len = code.length - 2
    return len >= 3 && len <= 6
  })
  
  return uniqueCodes
}

// Función para determinar si un código es "explícito" vs "por keyword"
function isExplicitCode(code: string, text: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerCode = code.toLowerCase()
  
  const contexts = [
    `smc error: ${lowerCode}`,
    `sensor array: ${lowerCode}`,
    `assertion failed.*${lowerCode}`,
    `value: ${lowerCode}`,
    `status: ${lowerCode}`,
    `${lowerCode} -`,
    `error ${lowerCode}`,
    `panic.*${lowerCode}`
  ]
  
  return contexts.some(ctx => {
    try {
      const regex = new RegExp(ctx, 'i')
      return regex.test(lowerText)
    } catch {
      return lowerText.includes(ctx.replace(/[.*]/g, ''))
    }
  })
}

function matchCodes(text: string): PanicEntry[] {
  const found: PanicEntry[] = []
  const lowerText = text.toLowerCase()
  
  const relevantHexCodes = extractHexCodes(text)
  
  for (const item of panicDB) {
    if (!item.code) { continue }
    
    let matched = false
    const code = item.code
    const lowerCode = code.toLowerCase()
    
    // 1. Verificar si es un código hex explícito del error
    if (code.startsWith('0x') && relevantHexCodes.includes(code)) {
      if (isExplicitCode(code, text)) {
        matched = true
      }
    }
    
    // 2. Matching exacto para códigos de texto (no hex)
    if (!matched && !code.startsWith('0x')) {
      const codeMatches = [
        text.includes(code),
        lowerText.includes(lowerCode),
        text.includes(` ${code} `),
        lowerText.includes(` ${lowerCode} `),
        text.includes(`${code}:`),
        lowerText.includes(`${lowerCode}:`)
      ].some(Boolean)
      
      if (codeMatches) matched = true
    }
    
    // 3. Buscar en keywords
    if (!matched && item.keywords?.length) {
      const keywordMatch = item.keywords.some(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        return lowerText.includes(lowerKeyword)
      })
      if (keywordMatch) matched = true
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

// FUNCIÓN PRINCIPAL - EXPORTADA
export function analyzePanicLog(text: string) {
  const detected = matchCodes(text)
  const model = extractModelFromPanic(text) || 'Desconocido'
  const hexCodesFound = extractHexCodes(text)
  const textPatterns = extractTextPatterns(text)
  
  const sortedDetected = detected.sort((a, b) => {
    const aHex = hexCodesFound.includes(a.code) ? 1 : 0
    const bHex = hexCodesFound.includes(b.code) ? 1 : 0
    return bHex - aHex
  })

  const grouped = groupByCategory(sortedDetected)
  const severity = autoSeverity(sortedDetected)

  return {
    summary: {
      severity,
      model,
      total: sortedDetected.length,
      hexCodesFound: hexCodesFound.length > 0 ? hexCodesFound : null,
      textPatternsFound: textPatterns.length > 0 ? textPatterns : null,
      confidence: sortedDetected.length > 0 
        ? Math.round(sortedDetected.reduce((acc, item) => acc + (item.certainty || 50), 0) / sortedDetected.length)
        : 0
    },
    grouped,
    detected: sortedDetected,
    metadata: {
      hexCodes: hexCodesFound,
      patterns: textPatterns,
      analysisDate: new Date().toISOString()
    }
  }
}
