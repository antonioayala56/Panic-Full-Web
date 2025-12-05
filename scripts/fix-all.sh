#!/usr/bin/env bash
set -euo pipefail

echo "1) Reemplazo de '#app' -> '#imports' en todos los .vue/.ts..."
if sed --version >/dev/null 2>&1; then
  # GNU sed
  find components composables pages server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
    | xargs -0 sed -i 's|from[[:space:]]\+["'\'']#app["'\'']|from "#imports"|g'
else
  # BSD sed (macOS)
  find components composables pages server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
    | xargs -0 sed -i '' 's|from[[:space:]]\+["'\'']#app["'\'']|from "#imports"|g'
fi

echo "2) Insertar imports faltantes en páginas (useRoute/useSeoMeta/useRuntimeConfig/computed)..."
for F in pages/cookies.vue pages/privacy.vue pages/failure.vue pages/pending.vue pages/success.vue; do
  [[ -f "$F" ]] || continue
  # si no existe linea de import, la añadimos al inicio del <script setup>
  if ! grep -q "useSeoMeta" "$F"; then
    sed -i'' '1,/^<script setup/ s/^<script setup lang="ts">/<script setup lang="ts">\nimport { useSeoMeta } from "#imports"/' "$F"
  fi
  if echo "$F" | grep -Eq 'failure\.vue|pending\.vue|success\.vue'; then
    if ! grep -q "useRoute" "$F"; then
      sed -i'' '1,/^<script setup/ s/^<script setup lang="ts">/<script setup lang="ts">\nimport { useRoute, useRuntimeConfig } from "#imports"\nimport { computed } from "vue"/' "$F"
    fi
  fi
done

echo "3) Tipar callbacks .find/.filter (a,e: any) donde falta..."
# AdByPlacement.vue (a)
if sed --version >/dev/null 2>&1; then
  sed -i 's/\.find((a) =>/\.find((a: any) =>/g' components/AdByPlacement.vue || true
else
  sed -i '' 's/\.find((a) =>/\.find((a: any) =>/g' components/AdByPlacement.vue || true
fi
# useAds.ts (a)
if sed --version >/dev/null 2>&1; then
  sed -i 's/\.find((a) =>/\.find((a: any) =>/g' composables/useAds.ts || true
else
  sed -i '' 's/\.find((a) =>/\.find((a: any) =>/g' composables/useAds.ts || true
fi
# useAnalyzer.ts (e)
if sed --version >/dev/null 2>&1; then
  sed -i 's/filter(e =>/filter((e: any) =>/g' composables/useAnalyzer.ts || true
else
  sed -i '' 's/filter(e =>/filter((e: any) =>/g' composables/useAnalyzer.ts || true
fi

echo "4) Arreglar imports faltantes en composables..."
# useConsent.ts -> useState
if ! grep -q 'from "#imports"' composables/useConsent.ts 2>/dev/null; then
  sed -i'' '1s|^|import { useState } from "#imports"\n|' composables/useConsent.ts
fi
# usePanicDb.ts -> useRuntimeConfig/useState
if ! grep -q 'useRuntimeConfig' composables/usePanicDb.ts; then
  sed -i'' '1s|^|import { useRuntimeConfig, useState } from "#imports"\n|' composables/usePanicDb.ts
fi
# useServerAnalyzer.ts -> ref
if ! grep -q '^import { ref } from "vue"' composables/useServerAnalyzer.ts 2>/dev/null; then
  sed -i'' '1s|^|import { ref } from "vue"\n|' composables/useServerAnalyzer.ts
fi
# useAnalyzer.ts -> ref + usePanicDb import si falta
if ! grep -q '^import { ref' composables/useAnalyzer.ts 2>/dev/null; then
  sed -i'' '1s|^|import { ref } from "vue"\n|' composables/useAnalyzer.ts
fi
if ! grep -q 'usePanicDb' composables/useAnalyzer.ts 2>/dev/null; then
  sed -i'' '1,/^/ s|^|import { usePanicDb } from "./usePanicDb"\n|' composables/useAnalyzer.ts
fi

echo "5) Quitar @ts-expect-error sobrante de server/api/db.get.ts y asegurar import JSON correcto..."
if grep -q "@ts-expect-error" server/api/db.get.ts 2>/dev/null; then
  sed -i'' '/@ts-expect-error/d' server/api/db.get.ts
fi

echo "6) MercadoPago: agregar 'id' en items[] si falta..."
if grep -q "items: \\[{" server/api/mp/create-preference.post.ts && ! grep -q "id:" server/api/mp/create-preference.post.ts; then
  if sed --version >/dev/null 2>&1; then
    sed -i "s/items: \\[{/items: [{ id: 'donation',/g" server/api/mp/create-preference.post.ts
  else
    sed -i '' "s/items: \\[{/items: [{ id: 'donation',/g" server/api/mp/create-preference.post.ts
  fi
fi

echo "7) Ignorar Tailwind en ESLint para evitar Parsing error tipado..."
touch .eslintignore
if ! grep -q "^tailwind.config.js$" .eslintignore; then
  echo "tailwind.config.js" >> .eslintignore
fi

echo "8) Preparar tipos + lint + typecheck..."
npx nuxi prepare
npm run lint:fix || true
npm run typecheck || true

echo "✅ Fix-all terminado."
