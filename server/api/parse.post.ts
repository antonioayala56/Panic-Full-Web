// server/api/parse.post.ts
import { defineEventHandler, readBody } from 'h3'

import { runParser } from '~/server/parser/panic.parser'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.text) {
      return {
        success: false,
        error: 'No se recibió ningún texto para analizar.'
      }
    }

    const result = await runParser(body.text)

    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('PARSER ERROR:', err)
    return {
      success: false,
      error: 'Error interno analizando el archivo.'
    }
  }
})
