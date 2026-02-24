// server/engine/panic.engine.ts - FUNCIÓN CORREGIDA

// Función para extraer códigos hex específicos del texto (CORREGIDA)
function extractHexCodes(text: string): string[] {
  // Solo buscar en la sección relevante del panic (hasta "EOF" o final de sección útil)
  const relevantSection = text.split(/EOF|last started kext|loaded kexts:/i)[0] || text
  
  // Buscar códigos hex que aparecen en contextos de error reales
  const hexPattern = /0x[0-9a-fA-F]{2,8}\b/g
  const matches = relevantSection.match(hexPattern) || []
  
  // Filtrar duplicados y códigos que son obviamente ejemplos (muy cortos o muy largos)
  const uniqueCodes = [...new Set(matches)].filter(code => {
    const len = code.length - 2 // sin el 0x
    // Ignorar códigos de 1-2 dígitos (probablemente ejemplos) y más de 6 (raro)
    return len >= 3 && len <= 6
  })
  
  return uniqueCodes
}

// Función mejorada para determinar si un código es "explícito" vs "por keyword"
function isExplicitCode(code: string, text: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerCode = code.toLowerCase()
  
  // Buscar el código en contextos que sugieren que es el error real, no un ejemplo
  const contexts = [
    `smc error: ${lowerCode}`,
    `sensor array: ${lowerCode}`,
    `assertion failed: ${lowerCode}`,
    `value: ${lowerCode}`,
    `status: ${lowerCode}`,
    `${lowerCode} -`,
    `error ${lowerCode}`,
    `panic.*${lowerCode}`,
    `0x[0-9a-f]+.*${lowerCode}` // cerca de otros hex en sección de error
  ]
  
  return contexts.some(ctx => {
    const regex = new RegExp(ctx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    return regex.test(lowerText)
  })
}

// Función matchCodes CORREGIDA
function matchCodes(text: string): PanicEntry[] {
  const found: PanicEntry[] = []
  const lowerText = text.toLowerCase()
  
  // Extraer solo los hex que son errores reales, no ejemplos
  const relevantHexCodes = extractHexCodes(text)
  
  for (const item of panicDB) {
    if (!item.code) { continue }
    
    let matched = false
    const code = item.code
    const lowerCode = code.toLowerCase()
    
    // 1. Verificar si es un código hex explícito del error (no ejemplo)
    if (code.startsWith('0x') && relevantHexCodes.includes(code)) {
      // Solo marcar como match si aparece en contexto de error real
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
        lowerText.includes(`${lowerCode}:`),
        text.includes(`${code}\n`),
        lowerText.includes(`${lowerCode}\n`)
      ].some(Boolean)
      
      if (codeMatches) matched = true
    }
    
    // 3. Buscar en keywords (solo si no hay match previo)
    if (!matched && item.keywords?.length) {
      const keywordMatch = item.keywords.some(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        // Solo aceptar keywords que no sean subcadenas de otras palabras
        const regex = new RegExp(`\\b${lowerKeyword}\\b`, 'i')
        return regex.test(lowerText)
      })
      if (keywordMatch) matched = true
    }
    
    if (matched) {
      found.push(item)
    }
  }
  
  return found
}
