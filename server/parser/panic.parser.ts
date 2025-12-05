// server/parser/panic.parser.ts
import { analyzePanicLog } from "~/server/engine/panic.engine"

export async function runParser(text: string) {
  const analysis = await analyzePanicLog(text)

  return {
    summary: analysis.summary,
    grouped: analysis.grouped,
    detected: analysis.detected
  }
}
