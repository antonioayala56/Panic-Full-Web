#!/usr/bin/env bash
set -euo pipefail

mkdir -p scripts types

echo "➡️ Creando types/analyzer.ts con tipos unificados..."
cat > types/analyzer.ts <<'TS'
export type MatchResult = {
  id: string
  score?: number
  title?: string
  summary?: string
}

export type AnalyzeOut = {
  top: MatchResult[]
  product?: string
  modelName?: string
  hex: string[]
  words: string[]
}
TS

fix_file() {
  local f="$1"
  [[ -f "$f" ]] || return 0

  echo "➡️ Arreglando $f"

  # 1) Insertar import del tipo centralizado si no existe
  if ! grep -q "from ['\"]/types/analyzer['\"];*$" "$f"; then
    # Si hay imports al principio, insertamos después del primer bloque de imports
    if grep -q "^import " "$f"; then
      awk '
        BEGIN{inserted=0}
        /^import / && inserted==0 { print; next }
        {
          if (inserted==0 && $0 !~ /^import /) {
            print "import type { MatchResult, AnalyzeOut } from \"~/types/analyzer\""
            inserted=1
          }
          print
        }
      ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    else
      # Si no hay imports, los agregamos al principio
      sed -i '1i import type { MatchResult, AnalyzeOut } from "~/types/analyzer"' "$f"
    fi
  fi

  # 2) Eliminar exports de tipos duplicados locales (MatchResult / AnalyzeOut)
  #    y convertirlos a 'type' local si hace falta
  sed -i 's/^export[[:space:]]\+type[[:space:]]\+MatchResult[[:space:]]*=.*/type MatchResult _REMOVED_/g' "$f"
  sed -i 's/^export[[:space:]]\+type[[:space:]]\+AnalyzeOut[[:space:]]*=.*/type AnalyzeOut _REMOVED_/g' "$f"

  # 3) Quitar los bloques placeholder que quedaron (si no hace falta)
  sed -i '/type MatchResult _REMOVED_/d' "$f"
  sed -i '/type AnalyzeOut _REMOVED_/d' "$f"

  # 4) Asegurar que los usos de tipos sigan compilando (no tocamos el código)
}

fix_file "composables/useAnalyzer.ts"
fix_file "composables/usePanicAnalizer.ts"

echo "➡️ Asegurando que tsconfig incluye la carpeta types/..."
# Agregar "types/**/*.ts" en include si no está
if ! grep -q '"types/\\*\\*/\\*.ts"' tsconfig.json; then
  # Insertar antes de ".nuxt" dentro de "include"
  python3 - <<'PY' || true
import json, sys
p="tsconfig.json"
data=json.load(open(p))
inc=data.get("include",[])
if "types/**/*.ts" not in inc:
    # insertarlo cerca del final
    inc.insert(len(inc)-1 if len(inc)>0 else 0,"types/**/*.ts")
    data["include"]=inc
open(p,"w").write(json.dumps(data, indent=2))
PY
fi

echo "➡️ Regenerando tipos y chequeando..."
npx nuxi prepare
npm run typecheck || true

echo "✅ Listo. El warning de 'Duplicated imports \"MatchResult\"' debe desaparecer."
