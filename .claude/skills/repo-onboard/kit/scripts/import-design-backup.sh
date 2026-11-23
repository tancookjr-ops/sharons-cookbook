#!/usr/bin/env bash
# import-design-backup.sh — unpack a design-tool backup ("MIGRATE/START-HERE.md"
# package) into design-system/ and give it a working compiler + preview.
# Installed by repo-onboard. Does MIGRATE/claude-code/SETUP.md steps 2–4 for a
# repo that already exists, plus every fix sharons-cookbook needed by hand:
#   - build.mjs stray-comma syntax error           (only if `node --check` fails)
#   - preview.mjs CHROME_PATH (pre-installed browser in cloud sessions)
#   - check.mjs/walk.mjs: skip upload-v* snapshots; allow ui_kits/ Babel pages
#   - screenshots ignored in the right .gitignore; tools lockfile committed
#   - installs with npm --ignore-scripts (supply-chain rule)
#
#   bash import-design-backup.sh <repo-dir> <zip-file-or-https-url>
set -euo pipefail
REPO="$(cd "${1:?repo dir}" && pwd)"; SRC="${2:?zip path or URL}"
DS="$REPO/design-system"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

if [ -e "$DS" ] && [ -n "$(ls -A "$DS" 2>/dev/null)" ]; then
  echo "✖ $DS already exists and is not empty — refusing to overwrite" >&2; exit 1
fi
case "$SRC" in
  https://*) curl -fsSL -o "$TMP/backup.zip" "$SRC" ;;
  *) cp "$SRC" "$TMP/backup.zip" ;;
esac
echo "▶ backup: $(du -h "$TMP/backup.zip" | cut -f1)"

mkdir -p "$DS"
unzip -q "$TMP/backup.zip" -d "$TMP/x"
rm -rf "$TMP/x/__MACOSX"; find "$TMP/x" -name .DS_Store -delete
# If everything sits in one top-level folder, lift it up.
inner="$TMP/x"; [ "$(ls -A "$inner" | wc -l)" = 1 ] && [ -d "$inner/$(ls -A "$inner")" ] && inner="$inner/$(ls -A "$inner")"
cp -a "$inner"/. "$DS"/
[ -f "$DS/MIGRATE/START-HERE.md" ] || { echo "✖ not a design-tool backup (no MIGRATE/START-HERE.md)" >&2; exit 1; }
echo "✔ unpacked → design-system/"

# SETUP step 2 — agent map + tools
cd "$DS"
[ -f CLAUDE.md ] && mv CLAUDE.md CLAUDE.design-tool.md
[ -f MIGRATE/claude-code/CLAUDE.md.txt ] && cp MIGRATE/claude-code/CLAUDE.md.txt CLAUDE.md
cp -R MIGRATE/claude-code/tools tools
for f in tools/*.mjs.txt; do [ -e "$f" ] && mv "$f" "${f%.txt}"; done
[ -f MIGRATE/claude-code/EXCLUDE.txt ] && cat MIGRATE/claude-code/EXCLUDE.txt >> .gitignore
printf "screenshots/preview/\n" >> .gitignore                 # SETUP put this in tools/ — wrong folder
printf "node_modules/\n" >> tools/.gitignore

# Known fixes (each applied only when its symptom is present)
python3 -I - "$DS/tools" <<'PY'
import os, re, subprocess, sys
t = sys.argv[1]
def edit(name, old, new, why):
    p = os.path.join(t, name)
    if not os.path.exists(p): return
    s = open(p).read()
    if old in s and new not in s:
        open(p, 'w').write(s.replace(old, new, 1)); print(f'  fix {name}: {why}')
# build.mjs: '})),' where '}));' belongs
p = os.path.join(t, 'build.mjs')
if os.path.exists(p) and subprocess.run(['node', '--check', p], capture_output=True).returncode != 0:
    edit('build.mjs', "          : 'module.exports = window.React;',\n    })),", "          : 'module.exports = window.React;',\n    }));", 'stray comma (syntax error)')
edit('preview.mjs', 'chromium.launch()', 'chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})', 'optional CHROME_PATH')
edit('walk.mjs', 'if (s.isDirectory()) { if (!SKIP.has(n)) walk(p, root, out); }',
     'if (s.isDirectory()) { if (!SKIP.has(n) && !SKIP_RE.test(n)) walk(p, root, out); }', 'skip upload-v* snapshots')
p = os.path.join(t, 'walk.mjs')
if os.path.exists(p) and 'SKIP_RE.test' in open(p).read() and 'export const SKIP_RE' not in open(p).read():
    edit('walk.mjs', 'export function walk(', "// Version snapshots (upload-v1.2.3 …) are partial copies kept as history.\nexport const SKIP_RE = /^upload-v\\d/;\n\nexport function walk(", 'define SKIP_RE')
edit('check.mjs', "if (/<script[^>]+src=\"[^\"]+\\.(jsx|tsx)\"/.test(body)) errors.push",
     "// ui_kits/ are full-app click-throughs that compile their own screens with in-browser Babel.\n  const appKit = f.startsWith('ui_kits/') && !/<script(?![^>]*type=\"text\\/babel\")[^>]+src=\"[^\"]+\\.(jsx|tsx)\"/.test(body);\n  if (!appKit && /<script[^>]+src=\"[^\"]+\\.(jsx|tsx)\"/.test(body)) errors.push",
     'ui_kits Babel pages allowed')
PY

# Lockfile must be committable (supply-chain rule)
gi="$REPO/.gitignore"
if [ -f "$gi" ] && grep -qE '^\s*(package-lock\.json|package\.json)\s*$' "$gi" && ! grep -q '!design-system/tools/package-lock.json' "$gi"; then
  printf '\n# design-system tools commit their manifest + lockfile (npm ci --ignore-scripts)\n!design-system/tools/package.json\n!design-system/tools/package-lock.json\n' >> "$gi"
  echo "  fix .gitignore: tools lockfile un-ignored"
fi

# SETUP step 3 — install without lifecycle scripts
cd tools
if [ -f package-lock.json ]; then npm ci --ignore-scripts --no-audit --no-fund >/dev/null
else npm install --ignore-scripts --no-audit --no-fund >/dev/null; echo "  created package-lock.json (commit it)"; fi
echo "✔ tools installed (--ignore-scripts)"

# SETUP step 4 — prove it
npm run -s check | tail -4 || true
echo "▶ next: npm run preview -- --cards (set CHROME_PATH in cloud sessions), npm run build"
