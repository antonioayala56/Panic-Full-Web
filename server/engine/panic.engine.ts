// server/engine/panic.engine.ts
import panicDB from "~/server/assets/panic_db.json"

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

function autoSeverity(list: PanicEntry[]) {
  let max = 0
  let level: string = "low"

  for (const c of list) {
    const w = severityWeight[c.severity] ?? 1
    if (w > max) {
      max = w
      level = c.severity
    }
  }
  return level
}

function matchCodes(text: string) {
  const found: PanicEntry[] = []
  const lowerText = text.toLowerCase()

  for (const item of panicDB) {
    if (!item.code) continue

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

function groupByCategory(list: PanicEntry[]) {
  const out: Record<string, PanicEntry[]> = {}

  for (const item of list) {
    const cat = item.component || "General"

    if (!out[cat]) out[cat] = []
    out[cat].push(item)
  }

  return out
}

function extractModelFromPanic(text: string) {
  try {
    // Buscar todos los bloques JSON en el texto
    const jsonBlocks = text.match(/\{[^}]*\}/g)
    if (jsonBlocks) {
      for (const block of jsonBlocks) {
        try {
          const jsonData = JSON.parse(block)
          if (jsonData.product) {
            // Mapear product a modelo legible
            const productMap: Record<string, string> = {
              'iPhone10,1': '8',
              'iPhone10,2': '8 Plus',
              'iPhone10,3': 'X',
              'iPhone10,4': '8',
              'iPhone10,5': '8 Plus',
              'iPhone10,6': 'X',
              'iPhone11,2': 'XS',
              'iPhone11,4': 'XS Max',
              'iPhone11,6': 'XS Max',
              'iPhone11,8': 'XR',
              'iPhone12,1': '11',
              'iPhone12,3': '11 Pro',
              'iPhone12,5': '11 Pro Max',
              'iPhone12,8': 'SE (2nd gen)',
              'iPhone13,1': '12 Mini',
              'iPhone13,2': '12',
              'iPhone13,3': '12 Pro',
              'iPhone13,4': '12 Pro Max',
              'iPhone14,2': '13',
              'iPhone14,3': '13',
              'iPhone14,4': '13 Pro',
              'iPhone14,5': '13 Pro Max',
              'iPhone14,6': 'SE (3rd gen)',
              'iPhone14,7': '14',
              'iPhone14,8': '14 Plus',
              'iPhone15,2': '14 Pro',
              'iPhone15,3': '14 Pro Max',
              'iPhone15,4': '15',
              'iPhone15,5': '15 Plus',
              'iPhone16,1': '15 Pro',
              'iPhone16,2': '15 Pro Max',
              'iPhone17,1': '16',
              'iPhone17,2': '16 Plus',
              'iPhone17,3': '16 Pro',
              'iPhone17,4': '16 Pro Max'
            }
            return productMap[jsonData.product] || jsonData.product.replace('iPhone', '').replace(',', ' ')
          }
        } catch (e) {
          // Este bloque no es JSON válido, continuar
          continue
        }
      }
    }
  } catch (e) {
    // Error general
  }
  return null
}

function predictModel(text: string, list: PanicEntry[]) {
  // Primero intentar extraer modelo del JSON del panic
  const extractedModel = extractModelFromPanic(text)
  if (extractedModel) return extractedModel

  // Fallback a predicción basada en códigos detectados
  const all = list.flatMap(l => l.models || [])
  if (all.length === 0) return "Desconocido"

  const count: Record<string, number> = {}

  for (const m of all) {
    count[m] = (count[m] || 0) + 1
  }

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])[0][0]
}

export async function analyzePanicLog(text: string) {
  const detected = matchCodes(text)
  const model = predictModel(text, detected)

  // Filtrar códigos por modelo detectado si hay uno específico
  const filteredCodes = model && model !== "Desconocido"
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
