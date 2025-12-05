// core/relations.ts
// 🔥 Relaciones entre product-codes, familias y modelos

import { ProductMap } from "./product-map";

export function resolveModel(productCode: string): string {
  return ProductMap[productCode] || "Modelo desconocido";
}

export function sameFamily(m1: string, m2: string): boolean {
  const normalize = (s: string) =>
    s.replace(" mini", "")
     .replace(" Pro Max", "")
     .replace(" Pro", "");

  return normalize(m1) === normalize(m2);
}

export function groupByFamily(models: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const m of models) {
    const base = m.replace(" mini", "").replace(" Pro Max", "").replace(" Pro", "");
    if (!out[base]) out[base] = [];
    out[base].push(m);
  }
  return out;
}

export const Relations = {
  physicalDamageIndicators: [
    "Kernel data abort",
    "ANS2",
    "nvme",
    "apcie",
    "0x20000",
    "0x710000"
  ]
};
