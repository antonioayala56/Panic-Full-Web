// core/model-map.ts
// 🔥 Mapeo comercial → familias de modelos
// Sirve para agrupar reparaciones, compatibilidad y predicción

export const MODEL_FAMILIES: Record<string, string[]> = {
  'iPhone X': ['iPhone X'],
  'iPhone XS': ['iPhone XS', 'iPhone XS Max'],
  'iPhone XR': ['iPhone XR'],

  'iPhone 11': ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'],
  'iPhone 12': ['iPhone 12 mini', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'],
  'iPhone 13': ['iPhone 13 mini', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max'],
  'iPhone 14': ['iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max'],
  'iPhone 15': ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],

  // ⚡ NUEVA FAMILIA — SERIE 16
  'iPhone 16': [
    'iPhone 16',
    'iPhone 16 Plus',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max'
  ]
}
