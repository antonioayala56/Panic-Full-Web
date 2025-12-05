import { c as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { p as panicDB } from '../../_/panic_db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const severityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};
function autoSeverity(list) {
  var _a;
  let max = 0;
  let level = "low";
  for (const c of list) {
    const w = (_a = severityWeight[c.severity]) != null ? _a : 1;
    if (w > max) {
      max = w;
      level = c.severity;
    }
  }
  return level;
}
function matchCodes(text) {
  const found = [];
  const lowerText = text.toLowerCase();
  for (const item of panicDB) {
    if (!item.code) continue;
    const code = item.code;
    const lowerCode = code.toLowerCase();
    const matches = [
      // Matching exacto
      text.includes(code),
      // Case insensitive
      lowerText.includes(lowerCode),
      // Con espacios alrededor
      text.includes(` ${code} `),
      lowerText.includes(` ${lowerCode} `),
      // Al inicio de línea
      text.includes(`
${code}`),
      lowerText.includes(`
${lowerCode}`),
      // Seguido de dos puntos
      text.includes(`${code}:`),
      lowerText.includes(`${lowerCode}:`),
      // Para códigos hex, buscar sin 0x también
      code.startsWith("0x") && (text.includes(code) || text.includes(code.substring(2)) || lowerText.includes(code.substring(2).toLowerCase()))
    ].some((match) => match);
    if (matches) {
      found.push(item);
    }
  }
  return found;
}
function groupByCategory(list) {
  const out = {};
  for (const item of list) {
    const cat = item.component || "General";
    if (!out[cat]) out[cat] = [];
    out[cat].push(item);
  }
  return out;
}
function extractModelFromPanic(text) {
  try {
    const jsonBlocks = text.match(/\{[^}]*\}/g);
    if (jsonBlocks) {
      for (const block of jsonBlocks) {
        try {
          const jsonData = JSON.parse(block);
          if (jsonData.product) {
            const productMap = {
              "iPhone10,1": "8",
              "iPhone10,2": "8 Plus",
              "iPhone10,3": "X",
              "iPhone10,4": "8",
              "iPhone10,5": "8 Plus",
              "iPhone10,6": "X",
              "iPhone11,2": "XS",
              "iPhone11,4": "XS Max",
              "iPhone11,6": "XS Max",
              "iPhone11,8": "XR",
              "iPhone12,1": "11",
              "iPhone12,3": "11 Pro",
              "iPhone12,5": "11 Pro Max",
              "iPhone12,8": "SE (2nd gen)",
              "iPhone13,1": "12 Mini",
              "iPhone13,2": "12",
              "iPhone13,3": "12 Pro",
              "iPhone13,4": "12 Pro Max",
              "iPhone14,2": "13",
              "iPhone14,3": "13",
              "iPhone14,4": "13 Pro",
              "iPhone14,5": "13 Pro Max",
              "iPhone14,6": "SE (3rd gen)",
              "iPhone14,7": "14",
              "iPhone14,8": "14 Plus",
              "iPhone15,2": "14 Pro",
              "iPhone15,3": "14 Pro Max",
              "iPhone15,4": "15",
              "iPhone15,5": "15 Plus",
              "iPhone16,1": "15 Pro",
              "iPhone16,2": "15 Pro Max",
              "iPhone17,1": "16",
              "iPhone17,2": "16 Plus",
              "iPhone17,3": "16 Pro",
              "iPhone17,4": "16 Pro Max"
            };
            return productMap[jsonData.product] || jsonData.product.replace("iPhone", "").replace(",", " ");
          }
        } catch (e) {
          continue;
        }
      }
    }
  } catch (e) {
  }
  return null;
}
function predictModel(text, list) {
  const extractedModel = extractModelFromPanic(text);
  if (extractedModel) return extractedModel;
  const all = list.flatMap((l) => l.models || []);
  if (all.length === 0) return "Desconocido";
  const count = {};
  for (const m of all) {
    count[m] = (count[m] || 0) + 1;
  }
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}
async function analyzePanicLog(text) {
  const detected = matchCodes(text);
  const model = predictModel(text, detected);
  const filteredCodes = model && model !== "Desconocido" ? detected.filter((code) => {
    var _a;
    return (_a = code.models) == null ? void 0 : _a.some(
      (m) => m.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(m.toLowerCase())
    );
  }).map((code) => ({
    ...code,
    models: [model]
    // Solo mostrar el modelo detectado
  })) : detected;
  const grouped = groupByCategory(filteredCodes);
  const severity = autoSeverity(filteredCodes);
  return {
    summary: {
      severity,
      model,
      total: filteredCodes.length
    },
    grouped,
    detected: filteredCodes
  };
}

async function runParser(text) {
  const analysis = await analyzePanicLog(text);
  return {
    summary: analysis.summary,
    grouped: analysis.grouped,
    detected: analysis.detected
  };
}

const parse_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || !body.text) {
      return {
        success: false,
        error: "No se recibi\xF3 ning\xFAn texto para analizar."
      };
    }
    const result = await runParser(body.text);
    return {
      success: true,
      data: result
    };
  } catch (err) {
    console.error("PARSER ERROR:", err);
    return {
      success: false,
      error: "Error interno analizando el archivo."
    };
  }
});

export { parse_post as default };
//# sourceMappingURL=parse.post.mjs.map
