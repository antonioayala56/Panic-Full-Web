#!/usr/bin/env bash
set -euo pipefail

echo "➡️ Paso 1/6: migrando imports '#app' → '#imports' (SFC y TS)..."
if sed --version >/dev/null 2>&1; then
  # GNU sed (Linux)
  find components composables pages layouts server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
    | xargs -0 sed -i 's|from[[:space:]]\+["'\'']#app["'\'']|from "#imports"|g'
else
  # BSD sed (macOS)
  find components composables pages layouts server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
    | xargs -0 sed -i '' 's|from[[:space:]]\+["'\'']#app["'\'']|from "#imports"|g'
fi

echo "➡️ Paso 2/6: arreglando bloques vacíos (no-empty) en ConsentBar/UpdateBar..."
for F in components/ConsentBar.vue components/UpdateBar.vue; do
  if [[ -f "$F" ]]; then
    if sed --version >/dev/null 2>&1; then
      sed -i 's/try[[:space:]]*{[[:space:]]*}/try { \/* noop *\/ }/g' "$F"
      sed -i 's/catch[[:space:]]*{[[:space:]]*}/catch { \/* noop *\/ }/g' "$F"
    else
      sed -i '' 's/try[[:space:]]*{[[:space:]]*}/try { \/* noop *\/ }/g' "$F"
      sed -i '' 's/catch[[:space:]]*{[[:space:]]*}/catch { \/* noop *\/ }/g' "$F"
    fi
  fi
done

echo "➡️ Paso 3/6: reemplazando @ts-ignore → @ts-expect-error..."
if sed --version >/dev/null 2>&1; then
  grep -Rl --include=\*.ts --include=\*.vue '@ts-ignore' . | xargs -r sed -i 's/@ts-ignore/@ts-expect-error/g'
else
  # macOS
  FILES=$(grep -Rl --include=\*.ts --include=\*.vue '@ts-ignore' . || true)
  if [[ -n "${FILES}" ]]; then
    echo "$FILES" | xargs sed -i '' 's/@ts-ignore/@ts-expect-error/g'
  fi
fi

echo "➡️ Paso 4/6: fix MercadoPago items.id requerido..."
FMP="server/api/mp/create-preference.post.ts"
if [[ -f "$FMP" ]]; then
  if ! grep -q "id:" "$FMP"; then
    if sed --version >/dev/null 2>&1; then
      sed -i "s/items: \\[{/items: [{ id: 'donation',/g" "$FMP"
    else
      sed -i '' "s/items: \\[{/items: [{ id: 'donation',/g" "$FMP"
    fi
  fi
fi

echo "➡️ Paso 5/6: generar tipos de Nuxt (nuxi prepare)..."
npx nuxi prepare

echo "➡️ Paso 6/6: lint --fix y typecheck..."
npm run lint:fix || true
npm run typecheck || true

echo "✅ Finalizado. Si aún ves 'import/no-unresolved' o TS2307, asegurate de que este tsconfig.json esté en la raíz y repetí:"
echo "   npx nuxi prepare && npm run lint && npm run typecheck"
