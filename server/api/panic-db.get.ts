// server/api/panic-db.get.ts
import { defineEventHandler, createError } from 'h3'
import panicDB from '~/server/assets/panic_db.json'

export default defineEventHandler(async (event) => {
  try {
    return panicDB
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error loading panic database'
    })
  }
})