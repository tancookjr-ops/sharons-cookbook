#!/usr/bin/env python3
"""inventory.py — read-only survey of a repo before onboarding. Installed by repo-onboard.

    python3 -I inventory.py <repo-dir> [--json out.json]

Never writes inside the repo. Prints a readable report; --json also saves the
facts the onboarding answers are prefilled from (branches, site shape, storage
keys to sandbox, mirror candidates, CDN use, risks).
"""
import collections, hashlib, json, os, re, subprocess, sys

SKIP_DIRS = {'.git', 'node_modules', '.next', 'dist', 'build', '__pycache__', 'screenshots'}
TEXT_EXT = {'.js', '.jsx', '.mjs', '.ts', '.tsx', '.html', '.htm', '.css', '.json', '.md', '.yml', '.yaml', '.webmanifest', '.txt', '.sh', '.py'}


def git(repo, *args):
    try:
        return subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, timeout=120).stdout.strip()
    except Exception:
        return ''


def walk(repo):
    for root, dirs, files in os.walk(repo):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            p = os.path.join(root, f)
            yield os.path.relpath(p, repo).replace(os.sep, '/'), p


def read(p, limit=2_000_000):
    try:
        if os.path.getsize(p) > limit:
            return ''
        with open(p, encoding='utf-8', errors='replace') as fh:
            return fh.read()
    except OSError:
        return ''


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    repo = os.path.abspath(sys.argv[1])
    out_json = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    facts = {'repo_dir': repo}

    # ---- git ---------------------------------------------------------------
    facts['remote'] = git(repo, 'remote', 'get-url', 'origin')
    m = re.search(r'github\.com[:/]([^/]+)/([^/.]+)', facts['remote'] or '')
    facts['github'] = f'{m.group(1)}/{m.group(2)}' if m else ''
    facts['branches'] = sorted(l.split('refs/heads/')[1] for l in git(repo, 'ls-remote', '--heads', 'origin').splitlines() if 'refs/heads/' in l)
    head = git(repo, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD')
    if '/' in head:
        facts['default_branch'] = head.split('/', 1)[1]
    else:
        m2 = re.search(r'ref: refs/heads/(\S+)\s+HEAD', git(repo, 'ls-remote', '--symref', 'origin', 'HEAD'))
        facts['default_branch'] = m2.group(1) if m2 else ''
    low = {b.lower(): b for b in facts['branches']}
    facts['guess_staging_branch'] = next((low[k] for k in ('develop', 'dev', 'staging') if k in low), facts['default_branch'])
    facts['guess_production_branch'] = next((low[k] for k in ('production', 'prod', 'main', 'master') if k in low and low[k] != facts['guess_staging_branch']), '')

    files = list(walk(repo))
    rels = {r for r, _ in files}

    # ---- site shape ----------------------------------------------------------
    facts['static_site'] = 'index.html' in rels
    facts['package_json'] = sorted(r for r in rels if r.endswith('package.json'))
    facts['service_worker'] = next((r for r in ('sw.js', 'service-worker.js', 'serviceworker.js') if r in rels), '')
    facts['manifest'] = next((r for r in ('manifest.webmanifest', 'manifest.json', 'site.webmanifest') if r in rels), '')
    facts['existing_agent_files'] = sorted(r for r in rels if os.path.basename(r) in ('CLAUDE.md', 'AGENTS.md'))
    facts['existing_workflows'] = sorted(r for r in rels if r.startswith('.github/workflows/'))
    facts['design_backup'] = sorted(r for r in rels if r.endswith('MIGRATE/START-HERE.md'))
    root_dirs = sorted({r.split('/')[0] for r in rels if '/' in r and not r.startswith('.')})
    facts['root_dirs'] = root_dirs

    # ---- storage keys (what the staging sandbox must rename) -----------------
    key_re = re.compile(r"""['"`]([a-z][a-z0-9]*(?:[-_][a-z0-9]+)*[-:_])['"`]|['"`]([a-z][a-z0-9]*(?:[-_][a-z0-9]+)+)['"`]""")
    prefixes = collections.Counter()
    for r, p in files:
        if os.path.splitext(r)[1] not in ('.js', '.jsx', '.mjs', '.ts', '.tsx') or '/' in r and r.split('/')[0] in ('design-system', 'tests'):
            continue
        for line in read(p).splitlines():
            if not re.search(r'localStorage|sessionStorage|indexedDB|caches\.|CACHE|_KEY|Key\b|dataKey', line):
                continue
            for a, b in key_re.findall(line):
                lit = a or b
                cut = max(lit.rfind('-'), lit.rfind(':'), lit.rfind('_'))
                if cut > 0:
                    prefixes[lit[: cut + 1]] += 1
    # keep the shortest prefixes: 'app-' covers 'app-data:'
    keep = [p for p in prefixes if not any(o != p and p.startswith(o) for o in prefixes)]
    facts['storage_prefixes'] = sorted(keep, key=lambda p: -prefixes[p])[:6]

    # ---- duplicates → mirror candidates ---------------------------------------
    by_hash = collections.defaultdict(list)
    for r, p in files:
        try:
            if os.path.getsize(p) < 64:
                continue
            with open(p, 'rb') as fh:
                by_hash[hashlib.sha1(fh.read()).hexdigest()].append(r)
        except OSError:
            pass
    mirror_dirs = collections.Counter()
    for paths in by_hash.values():
        if len(paths) < 2:
            continue
        shortest = min(paths, key=lambda s: (s.count('/'), len(s)))
        for q in paths:
            if q != shortest and q.endswith('/' + shortest):
                mirror_dirs[q[: -len(shortest) - 1]] += 1
    facts['mirror_candidates'] = [{'dir': d, 'identical_files': n} for d, n in mirror_dirs.most_common(10)]

    # ---- third-party scripts, secrets, personal data, big files -------------
    cdn, risky, emails, big = [], [], set(), []
    cdn_re = re.compile(r'<script[^>]+src="(https://[^"]+)"[^>]*>')
    secret_re = re.compile(r'(AKIA[0-9A-Z]{16}|sk_live_[0-9a-zA-Z]{10,}|ghp_[0-9A-Za-z]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[bp]-[0-9A-Za-z-]{10,})')
    mail_re = re.compile(r'[A-Za-z0-9._%+-]+@(?:gmail|outlook|hotmail|yahoo|icloud)\.com')
    for r, p in files:
        size = os.path.getsize(p)
        if size > 20_000_000:
            big.append({'path': r, 'mb': round(size / 1e6, 1)})
        if os.path.splitext(r)[1] not in TEXT_EXT:
            continue
        text = read(p)
        for mt in cdn_re.finditer(text):
            cdn.append({'file': r, 'src': mt.group(1), 'integrity': 'integrity=' in mt.group(0)})
        if secret_re.search(text):
            risky.append(r)
        if r.split('/')[0] not in ('design-system',):
            emails.update(f'{r}' for _ in mail_re.findall(text))
    facts['cdn_scripts'] = cdn[:30]
    facts['possible_secrets'] = sorted(set(risky))
    facts['files_with_personal_emails'] = sorted(emails)
    facts['big_files'] = big
    gi = read(os.path.join(repo, '.gitignore'))
    facts['lockfiles_ignored'] = bool(re.search(r'^\s*package-lock\.json\s*$', gi, re.M))

    # ---- report --------------------------------------------------------------
    w = sys.stdout.write
    w(f"Repo {facts['github'] or repo}\n")
    w(f"  branches: {', '.join(facts['branches']) or '(none on origin)'}  · default: {facts['default_branch'] or '?'}\n")
    w(f"  guess: staging = {facts['guess_staging_branch'] or '?'}, production = {facts['guess_production_branch'] or '?'}\n")
    w(f"  static site: {facts['static_site']} · service worker: {facts['service_worker'] or '-'} · manifest: {facts['manifest'] or '-'}\n")
    w(f"  package.json: {', '.join(facts['package_json']) or '-'} · lockfiles ignored by .gitignore: {facts['lockfiles_ignored']}\n")
    w(f"  agent files: {', '.join(facts['existing_agent_files']) or '-'} · workflows: {len(facts['existing_workflows'])}\n")
    w(f"  storage key prefixes (sandbox candidates): {', '.join(facts['storage_prefixes']) or '-'}\n")
    for mc in facts['mirror_candidates']:
        w(f"  mirror candidate: {mc['dir']}/ ({mc['identical_files']} files identical to the root)\n")
    no_sri = [c for c in cdn if not c['integrity']]
    w(f"  CDN <script> tags: {len(cdn)} ({len(no_sri)} without integrity)\n")
    if facts['design_backup']:
        w(f"  design-tool backup present: {', '.join(facts['design_backup'])}\n")
    for k, label in (('possible_secrets', 'POSSIBLE SECRETS'), ('files_with_personal_emails', 'personal emails in'), ('big_files', 'files over 20 MB')):
        if facts[k]:
            w(f"  ⚠ {label}: {facts[k]}\n")
    if out_json:
        with open(out_json, 'w') as fh:
            json.dump(facts, fh, indent=2)
        w(f"facts → {out_json}\n")


if __name__ == '__main__':
    main()
