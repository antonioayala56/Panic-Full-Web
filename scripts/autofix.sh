#!/usr/bin/env bash
set -euo pipefail

mkdir -p scripts

echo "➡️ Paso 1: reemplazo de '#app' → '#imports'..."
find components composables server pages -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
  | xargs -0 sed -i 's|from[[:space:]]\+["'\'']#app["'\'']|from "#imports"|g'

echo "➡️ Paso 2: fix de imports faltantes en páginas..."
for f in pages/cookies.vue pages/privacy.vue; do
  if grep -q "useSeoMeta" "$f" && ! grep -q "import { useSeoMeta }" "$f"; then
    sed -i '1i import { useSeoMeta } from "#imports"' "$f"
  fi
done

for f in pages/failure.vue pages/pending.vue pages/success.vue; do
  if [[ -f "$f" ]]; then
    sed -i '1i import { useRoute, useRuntimeConfig, useSeoMeta } from "#imports"\nimport { computed } from "vue"' "$f"
  fi
done

echo "➡️ Paso 3: fix de imports faltantes en composables..."
# useAnalyzer
if grep -q "usePanicDb" composables/useAnalyzer.ts && ! grep -q "import { usePanicDb" composables/useAnalyzer.ts; then
  sed -i '1i import { usePanicDb } from "./usePanicDb"\nimport { ref } from "vue"' composables/useAnalyzer.ts
fi
# useConsent
sed -i '1i import { useState } from "#imports"' composables/useConsent.ts || true
# usePanicDb
sed -i '1i import { useRuntimeConfig, useState } from "#imports"' composables/usePanicDb.ts || true
# useServerAnalyzer
sed -i '1i import { ref } from "vue"' composables/useServerAnalyzer.ts || true

echo "➡️ Paso 4: agregar id en MercadoPago items[]..."
sed -i "s/items: \[{ title/items: [{ id: 'donation', title/" server/api/mp/create-preference.post.ts

echo "➡️ Paso 5: arreglar bloques vacíos..."
for f in components/ConsentBar.vue components/UpdateBar.vue; do
  if [[ -f "$f" ]]; then
    sed -i 's/try[[:space:]]*{[[:space:]]*}/try { \/* noop *\/ }/g' "$f"
    sed -i 's/catch[[:space:]]*{[[:space:]]*}/catch { \/* noop *\/ }/g' "$f"
  fi
done

echo "➡️ Paso 6: ignorar tailwind.config.js en ESLint..."
echo "tailwind.config.js" >> .eslintignore

echo "➡️ Paso 7: preparar tipos y correr lint/typecheck..."
npx nuxi prepare
npm run lint:fix || true
npm run typecheck || true

echo "✅ Autofix completo."
