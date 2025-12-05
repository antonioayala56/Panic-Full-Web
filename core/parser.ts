// core/parser.ts
import { analyzePanicLog } from "~/server/engine/panic.engine"
import { Relations } from "./relations"
import { ProductMap } from "./product-map"

export async function buildParsedResult(text: string) {
  const base = await analyzePanicLog(text)

  // traducir modelos internos tipo "iPhone14,2"
  const humanModel =
    ProductMap[base.summary.model] ??
    base.summary.model

  const physicalRisk =
    base.detected.some(e => Relations.physicalDamageIndicators.includes(e.code))

  return {
    summary: {
      ...base.summary,
      model: humanModel,
      physicalRisk
    },
    grouped: base.grouped,
    detected: base.detected
  }
}
