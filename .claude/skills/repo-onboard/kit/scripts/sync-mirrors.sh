#!/usr/bin/env bash
# sync-mirrors.sh — keep copies of the live files identical to the source. Installed by repo-onboard.
#
#   scripts/sync-mirrors.sh           copy source → every mirror (prints what changed)
#   scripts/sync-mirrors.sh --check   report drift and exit 1 if any (used by the staging gate)
#
# Pairs come from scripts/mirrors.conf, one per line:   <source-glob>  <mirror-dir>
#   tokens/*.css   design-system        → tokens/a.css is mirrored at design-system/tokens/a.css
# Blank lines and lines starting with # are ignored. No conf, or an empty one = nothing to do.
set -euo pipefail
cd "$(dirname "$0")/.."

CHECK=0; [ "${1:-}" = "--check" ] && CHECK=1
CONF="scripts/mirrors.conf"
shopt -s nullglob

pairs=()
if [ -f "$CONF" ]; then
  while read -r glob dir _; do
    [ -z "${glob:-}" ] && continue
    case "$glob" in \#*) continue ;; esac
    for f in $glob; do [ -f "$f" ] && pairs+=("$f $dir/$f"); done
  done < "$CONF"
fi

drift=0
for p in "${pairs[@]}"; do
  src="${p%% *}"; dst="${p#* }"
  cmp -s "$src" "$dst" 2>/dev/null && continue
  drift=$((drift + 1))
  if [ "$CHECK" = 1 ]; then echo "✖ drift: $dst differs from $src"
  else mkdir -p "$(dirname "$dst")"; cp "$src" "$dst"; echo "↻ $src → $dst"; fi
done

if [ "$CHECK" = 1 ]; then
  [ "$drift" = 0 ] && { echo "✔ mirrors match the source (${#pairs[@]} files)"; exit 0; }
  echo "✖ $drift mirrored file(s) out of date — run scripts/sync-mirrors.sh and commit" >&2
  exit 1
fi
echo "✔ synced: $drift file(s) updated, ${#pairs[@]} checked"
