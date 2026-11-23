#!/usr/bin/env bash
# sync-mirrors.sh — keep the design-system copies identical to the live app.
#
#   scripts/sync-mirrors.sh           copy root → every mirror (prints what changed)
#   scripts/sync-mirrors.sh --check   report drift and exit 1 if any (used by CI)
#
# The ROOT app files are the one source of truth (the BorealCodex lesson: two
# trees drift). These folders hold copies that must stay byte-identical:
#   design-system/                  styles.css base.css components.css patterns.css tokens/
#   design-system/deploy/           the whole deploy package (not index.html / README.md)
#   design-system/ui_kits/cookbook/ app code + recipes (not index.html / README / DEV-TRACK)
# Their own index.html files differ on purpose and are never touched.
set -euo pipefail
cd "$(dirname "$0")/.."

CHECK=0; [ "${1:-}" = "--check" ] && CHECK=1
shopt -s nullglob

css=(styles.css base.css components.css patterns.css tokens/*.css)
code=(app.jsx auth.js data.js import-parse.js import-web.js screens-main.jsx screens-more.jsx units.js recipes/*.js)

pairs=()
for f in "${css[@]}"; do pairs+=("$f design-system/$f"); done
for f in manifest.webmanifest sw.js "${css[@]}" "${code[@]}" icons/*.png; do pairs+=("$f design-system/deploy/$f"); done
for f in "${code[@]}"; do pairs+=("$f design-system/ui_kits/cookbook/$f"); done

drift=0
for p in "${pairs[@]}"; do
  src="${p%% *}"; dst="${p#* }"
  cmp -s "$src" "$dst" 2>/dev/null && continue
  drift=$((drift + 1))
  if [ "$CHECK" = 1 ]; then
    echo "✖ drift: $dst differs from $src"
  else
    mkdir -p "$(dirname "$dst")"; cp "$src" "$dst"; echo "↻ $src → $dst"
  fi
done

if [ "$CHECK" = 1 ]; then
  [ "$drift" = 0 ] && { echo "✔ mirrors match the live app (${#pairs[@]} files)"; exit 0; }
  echo "✖ $drift mirrored file(s) out of date — run scripts/sync-mirrors.sh and commit" >&2
  exit 1
fi
echo "✔ synced: $drift file(s) updated, ${#pairs[@]} checked"
