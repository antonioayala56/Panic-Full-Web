#!/usr/bin/env bash
set -euo pipefail

echo "➡️ Preparando tipos de Nuxt..."
npx nuxi prepare

if [[ "${1-}" == "--migrar" ]]; then
  echo "🛠 Migrando '#imports' → '#app' en .vue/.ts ..."
  if sed --version >/dev/null 2>&1; then
    # GNU sed (Linux)
    find components composables pages layouts server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
      | xargs -0 sed -i 's|from[[:space:]]\+["'\'']#imports["'\'']|from "#app"|g'
  else
    # BSD sed (macOS)
    find components composables pages layouts server -type f \( -name "*.vue" -o -name "*.ts" \) -print0 \
      | xargs -0 sed -i '' 's|from[[:space:]]\+["'\'']#imports["'\'']|from "#app"|g'
  fi
fi

echo "🧹 Corriendo ESLint (auto-fix)..."
npm run lint:fix || true

echo "🧪 Corriendo Typecheck..."
npm run typecheck || true

echo "✅ Doctor terminado."
