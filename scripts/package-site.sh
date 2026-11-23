#!/usr/bin/env bash
# package-site.sh — build the publishable web app from a checkout of this repo.
#
#   scripts/package-site.sh <checkout-dir> <out-dir> [production|staging]
#
# The package has the same shape as design-system/deploy/ (the design tool's
# deploy package): the root app files only — never design-system/, work/,
# _shared/, scripts/ or any other workspace folder.
#
# production  copies the app unchanged.
# staging     also SANDBOXES the copy so it can share a web address (origin)
#             with production without touching Sharon's real data:
#               - every storage/cache key prefix  mycookbook-       → cbstaging-
#                                                 sharons-cookbook- → cbstaging-legacy-
#               - app name/title get " STAGING" so the phone shows which one it is
#             The build FAILS if any original prefix survives, so a new key that
#             skips the sandbox can never ship to staging.
set -euo pipefail

SRC="${1:?usage: package-site.sh <checkout-dir> <out-dir> [production|staging]}"
OUT="${2:?usage: package-site.sh <checkout-dir> <out-dir> [production|staging]}"
MODE="${3:-production}"

case "$MODE" in production|staging) ;; *) echo "✖ mode must be production or staging" >&2; exit 2 ;; esac
[ -f "$SRC/index.html" ] || { echo "✖ $SRC has no index.html — not an app checkout" >&2; exit 1; }

mkdir -p "$OUT"
shopt -s nullglob
# Root app files (same set as design-system/deploy/).
for f in "$SRC"/index.html "$SRC"/manifest.webmanifest "$SRC"/*.css "$SRC"/*.js "$SRC"/*.jsx; do
  cp "$f" "$OUT/"
done
for d in tokens icons images; do
  [ -d "$SRC/$d" ] && cp -R "$SRC/$d" "$OUT/"
done
mkdir -p "$OUT/recipes" && cp "$SRC"/recipes/*.js "$OUT/recipes/"   # code only — not recipes/CONTEXT.md
rm -f "$OUT/images/.gitkeep"

# Every file the app shell and service worker ask for must exist.
missing=0
for ref in $(grep -o "'\./[^']*'" "$OUT/sw.js" | tr -d "'" | sed 's#^\./##' | grep -v '^$'); do
  [ -e "$OUT/$ref" ] || { echo "✖ sw.js caches $ref but it is not in the package"; missing=1; }
done
for ref in $(grep -o '"src": *"[^"]*"' "$OUT/manifest.webmanifest" | sed 's/.*"\([^"]*\)"$/\1/'); do
  [ -e "$OUT/$ref" ] || { echo "✖ manifest lists $ref but it is not in the package"; missing=1; }
done
# Staging is the gate: a missing file stops it. Production only warns — it is
# republishing what is already live, and refusing would also block staging,
# which is published in the same Pages run.
if [ "$missing" != 0 ]; then
  if [ "$MODE" = staging ]; then exit 1; fi
  echo "⚠ production has the missing files above — fix them on Develop and promote" >&2
  [ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "⚠ Production is missing files the app asks for (see the Package step log)." >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$MODE" = staging ]; then
  for f in "$OUT"/*.js "$OUT"/*.jsx; do
    sed -i -e "s/mycookbook-/cbstaging-/g" -e "s/sharons-cookbook-/cbstaging-legacy-/g" "$f"
  done
  sed -i -e 's#<title>\([^<]*\)</title>#<title>\1 STAGING</title>#' \
         -e 's#\(apple-mobile-web-app-title" content="\)\([^"]*\)"#\1\2 STAGING"#' "$OUT/index.html"
  # A badge on every screen, so the phone check can never mistake staging for live.
  sed -i 's|</body>|<div aria-hidden="true" style="position:fixed;z-index:9999;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));padding:3px 9px;border-radius:999px;background:#b3261e;color:#fff;font:700 11px/1.4 system-ui,sans-serif;letter-spacing:.06em;pointer-events:none">STAGING</div>\n</body>|' "$OUT/index.html"
  grep -q '>STAGING</div>' "$OUT/index.html" || { echo "✖ could not add the STAGING badge to index.html" >&2; exit 1; }
  sed -i -e 's#"name": *"\([^"]*\)"#"name": "\1 STAGING"#' \
         -e 's#"short_name": *"\([^"]*\)"#"short_name": "\1 STG"#' "$OUT/manifest.webmanifest"
  if grep -n "mycookbook-\|sharons-cookbook-" "$OUT"/*.js "$OUT"/*.jsx; then
    echo "✖ staging sandbox incomplete: the keys above would share Sharon's real data" >&2
    exit 1
  fi
  grep -q "cbstaging-" "$OUT/auth.js" || { echo "✖ staging sandbox found no storage keys in auth.js — did the key names change?" >&2; exit 1; }
fi

echo "✔ packaged $MODE: $(find "$OUT" -type f | wc -l) files → $OUT"
