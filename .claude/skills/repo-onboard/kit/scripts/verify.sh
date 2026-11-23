#!/usr/bin/env bash
# verify.sh — prove an onboarded repo will deploy BEFORE opening the pull request.
#
#   bash verify.sh <repo-dir> <staging-branch> <production-branch>
#
# Lesson baked in: the first deploy of sharons-cookbook failed because packaging
# was only tested on the working tree, not on the real production branch.
# So this packages the WORKING TREE as staging (what the PR will land) and the
# LIVE production branch as production (what Pages republishes in the same run),
# using the working tree's scripts — exactly what pages.yml does.
set -uo pipefail
REPO="$(cd "${1:?repo dir}" && pwd)"; STAGING="${2:?staging branch}"; PRODUCTION="${3:?production branch}"
cd "$REPO"
TMP="$(mktemp -d)"; trap 'git -C "$REPO" worktree remove --force "$TMP/prod" >/dev/null 2>&1; rm -rf "$TMP"' EXIT
fail=0; ok() { echo "✔ $*"; }; bad() { echo "✖ $*"; fail=1; }

git fetch -q origin "$PRODUCTION" "$STAGING" 2>/dev/null || bad "could not fetch $PRODUCTION / $STAGING from origin"

if [ -f scripts/package-site.sh ]; then
  if git worktree add -q --detach "$TMP/prod" "origin/$PRODUCTION" 2>/dev/null; then
    bash scripts/package-site.sh "$TMP/prod" "$TMP/site" production >/dev/null 2>"$TMP/p.err" \
      && ok "production ($PRODUCTION) packages$(grep -q '⚠' "$TMP/p.err" && echo ' — with warnings (see below)')" \
      || bad "production ($PRODUCTION) does not package"
    sed 's/^/    /' "$TMP/p.err"
  else bad "no origin/$PRODUCTION to package"; fi
  bash scripts/package-site.sh . "$TMP/site/staging" staging >"$TMP/s.out" 2>&1 \
    && ok "staging (working tree) packages and sandboxes" || { bad "staging does not package"; sed 's/^/    /' "$TMP/s.out"; }
fi

shopt -s nullglob
for c in scripts/check-*; do
  case "$c" in *.mjs|*.js) cmd=(node "$c") ;; *.sh) cmd=(bash "$c") ;; *.py) cmd=(python3 -I "$c") ;; *) continue ;; esac
  "${cmd[@]}" >"$TMP/c.out" 2>&1 && ok "$c: $(tail -1 "$TMP/c.out" | sed "s/^✔ //")" || { bad "$c failed"; tail -15 "$TMP/c.out" | sed 's/^/    /'; }
done
[ -f scripts/sync-mirrors.sh ] && { bash scripts/sync-mirrors.sh --check >"$TMP/m.out" 2>&1 && ok "$(tail -1 "$TMP/m.out" | sed "s/^✔ //")" || { bad "mirrors drifted"; sed 's/^/    /' "$TMP/m.out"; }; }

python3 -I - "$REPO" <<'PY' || fail=1
import glob, os, re, sys
repo = sys.argv[1]; os.chdir(repo); bad = 0
try:
    import yaml
    for f in sorted(glob.glob('.github/*.yml') + glob.glob('.github/workflows/*.yml')):
        d = yaml.safe_load(open(f))
        for job in (d.get('jobs') or {}).values():
            for st in job.get('steps') or []:
                u = st.get('uses', '')
                if u and not u.startswith('./') and not re.search(r'@[0-9a-f]{40}$', u):
                    print(f'✖ {f}: action not SHA-pinned: {u}'); bad = 1
    print('✔ workflow YAML parses; third-party actions SHA-pinned' if not bad else '')
except ImportError:
    print('⚠ PyYAML missing — workflow YAML not checked')
n = sum(1 for _ in open('CLAUDE.md')) if os.path.exists('CLAUDE.md') else 0
print(f"{'✔' if 0 < n <= 60 else '✖'} CLAUDE.md is {n} lines (target ≤ 60)"); bad |= not (0 < n <= 60)
# walk test: paths named in the catalog files exist (warnings only)
docs = ['CLAUDE.md', 'CONTEXT.md'] + glob.glob('_shared/*.md') + glob.glob('work/**/CONTEXT.md', recursive=True) + glob.glob('*/CONTEXT.md') + glob.glob('.github/CONTEXT.md')
miss = []
for f in docs:
    if not os.path.exists(f): continue
    for p in re.findall(r'`((?:\.\./)*[_a-zA-Z0-9.][_a-zA-Z0-9./-]*/?)`', open(f).read()):
        if '/' not in p or '<' in p or p.startswith('http'): continue
        if not any(os.path.exists(os.path.normpath(os.path.join(b, p))) for b in (os.path.dirname(f), '.')):
            miss.append(f'{f}: {p}')
print(f"✔ walk test: every path in the catalog exists" if not miss else f"⚠ walk test: {len(miss)} path(s) not found (check they are meant to be):\n    " + "\n    ".join(miss[:20]))
sys.exit(bad)
PY

if [ -d design-system/tools/node_modules ]; then
  (cd design-system/tools && npm run -s check 2>&1 | tail -1) | grep -q "^0 errors" && ok "design-system check: 0 errors" || bad "design-system check has errors"
fi

echo; [ "$fail" = 0 ] && echo "VERIFY: PASS" || echo "VERIFY: FAIL"
exit "$fail"
