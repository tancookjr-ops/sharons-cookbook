#!/usr/bin/env bash
# package-site.sh — build the publishable site from a checkout. Installed by repo-onboard.
#
#   scripts/package-site.sh <checkout-dir> <out-dir> [production|staging]
#
# What goes in the package, and how staging is sandboxed, is set in
# scripts/site.conf (read from THIS script's repo, applied to <checkout-dir>).
#
# production  copies APP_PATHS (+ EXTRA_PATHS) unchanged.
# staging     copies APP_PATHS, then SANDBOXES them so staging can share a web
#             address with production without touching real saved data:
#               - each SANDBOX_REPLACE "old=new" is applied to SANDBOX_GLOBS files
#               - title / app name get the STAGING label, plus an on-screen badge
#             The build FAILS if any "old" survives, or if SANDBOX_GUARD_FILE
#             shows no replacement happened (keys renamed without updating the conf).
# Missing files referenced by the service worker / manifest: staging fails,
# production warns (it is republishing what is already live).
set -euo pipefail

SRC="${1:?usage: package-site.sh <checkout-dir> <out-dir> [production|staging]}"
OUT="${2:?usage: package-site.sh <checkout-dir> <out-dir> [production|staging]}"
MODE="${3:-production}"
case "$MODE" in production|staging) ;; *) echo "✖ mode must be production or staging" >&2; exit 2 ;; esac

HERE="$(cd "$(dirname "$0")" && pwd)"
APP_PATHS=(); EXTRA_PATHS=(); SANDBOX_REPLACE=(); SANDBOX_GLOBS=()
SANDBOX_GUARD_FILE=""; SW_FILE=""; MANIFEST_FILE=""; STAGING_LABEL="STAGING"; STAGING_BADGE=1
# shellcheck source=/dev/null
source "$HERE/site.conf"

[ -f "$SRC/index.html" ] || { echo "✖ $SRC has no index.html — not a site checkout" >&2; exit 1; }
mkdir -p "$OUT"
shopt -s nullglob

copy_globs() {   # copy_globs <path-glob>... — files keep their relative path; dirs copy whole
  local g p
  for g in "$@"; do
    for p in "$SRC"/$g; do
      [ -e "$p" ] || continue          # a literal path that is not on this branch (yet)
      local rel="${p#"$SRC"/}"
      if [ -d "$p" ]; then mkdir -p "$OUT/$(dirname "$rel")"; cp -R "$p" "$OUT/$rel"
      else mkdir -p "$OUT/$(dirname "$rel")"; cp "$p" "$OUT/$rel"; fi
    done
  done
}
copy_globs "${APP_PATHS[@]}"
[ "$MODE" = production ] && [ ${#EXTRA_PATHS[@]} -gt 0 ] && copy_globs "${EXTRA_PATHS[@]}"
find "$OUT" -name .gitkeep -delete

# Every file the service worker caches and the manifest lists must exist.
missing=0
if [ -n "$SW_FILE" ] && [ -f "$OUT/$SW_FILE" ]; then
  for ref in $(grep -o "'\./[^']*'" "$OUT/$SW_FILE" | tr -d "'" | sed 's#^\./##' | grep -v '^$' || true); do
    [ -e "$OUT/$ref" ] || { echo "✖ $SW_FILE caches $ref but it is not in the package"; missing=1; }
  done
fi
if [ -n "$MANIFEST_FILE" ] && [ -f "$OUT/$MANIFEST_FILE" ]; then
  for ref in $(grep -o '"src": *"[^"]*"' "$OUT/$MANIFEST_FILE" | sed 's/.*"\([^"]*\)"$/\1/' || true); do
    [ -e "$OUT/$ref" ] || { echo "✖ $MANIFEST_FILE lists $ref but it is not in the package"; missing=1; }
  done
fi
if [ "$missing" != 0 ]; then
  [ "$MODE" = staging ] && exit 1
  echo "⚠ production has the missing files above — fix them on the staging branch and promote" >&2
  [ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "⚠ Production is missing files the app asks for (see the Package step log)." >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$MODE" = staging ]; then
  files=(); for g in "${SANDBOX_GLOBS[@]}"; do for f in "$OUT"/$g; do [ -f "$f" ] && files+=("$f"); done; done
  for pair in "${SANDBOX_REPLACE[@]}"; do
    old="${pair%%=*}"; new="${pair#*=}"
    [ ${#files[@]} -gt 0 ] && sed -i "s|$old|$new|g" "${files[@]}"
  done
  for pair in "${SANDBOX_REPLACE[@]}"; do
    old="${pair%%=*}"
    if [ ${#files[@]} -gt 0 ] && grep -n -- "$old" "${files[@]}"; then
      echo "✖ staging sandbox incomplete: the keys above would share real saved data" >&2; exit 1
    fi
  done
  if [ -n "$SANDBOX_GUARD_FILE" ] && [ ${#SANDBOX_REPLACE[@]} -gt 0 ]; then
    first_new="${SANDBOX_REPLACE[0]#*=}"
    grep -q -- "$first_new" "$OUT/$SANDBOX_GUARD_FILE" || { echo "✖ sandbox made no replacement in $SANDBOX_GUARD_FILE — did the storage keys change? update scripts/site.conf" >&2; exit 1; }
  fi
  if [ -f "$OUT/index.html" ]; then
    sed -i -e "s|<title>\([^<]*\)</title>|<title>\1 $STAGING_LABEL</title>|" \
           -e "s|\(apple-mobile-web-app-title\" content=\"\)\([^\"]*\)\"|\1\2 $STAGING_LABEL\"|" "$OUT/index.html"
    if [ "$STAGING_BADGE" = 1 ]; then
      sed -i "s|</body>|<div aria-hidden=\"true\" style=\"position:fixed;z-index:9999;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));padding:3px 9px;border-radius:999px;background:#b3261e;color:#fff;font:700 11px/1.4 system-ui,sans-serif;letter-spacing:.06em;pointer-events:none\">$STAGING_LABEL</div>\n</body>|" "$OUT/index.html"
      grep -q ">$STAGING_LABEL</div>" "$OUT/index.html" || { echo "✖ could not add the $STAGING_LABEL badge to index.html" >&2; exit 1; }
    fi
  fi
  if [ -n "$MANIFEST_FILE" ] && [ -f "$OUT/$MANIFEST_FILE" ]; then
    sed -i -e "s|\"name\": *\"\([^\"]*\)\"|\"name\": \"\1 $STAGING_LABEL\"|" \
           -e "s|\"short_name\": *\"\([^\"]*\)\"|\"short_name\": \"\1 STG\"|" "$OUT/$MANIFEST_FILE"
  fi
fi

echo "✔ packaged $MODE: $(find "$OUT" -type f | wc -l) files → $OUT"
