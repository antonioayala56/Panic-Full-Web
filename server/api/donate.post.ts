// server/api/donate.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { amount } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid amount'
      })
    }

    // Placeholder for MercadoPago integration
    // Replace with actual MercadoPago SDK when access_token is provided
    const preferenceId = `DONATION_${amount}_${Date.now()}`
    const initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`

    return {
      init_point: initPoint,
      id: preferenceId
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating payment preference'
    })
  }
})