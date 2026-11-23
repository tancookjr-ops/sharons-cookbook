#!/usr/bin/env python3
"""apply.py — render the repo-onboard kit into a repo from an answers file.

    python3 -I apply.py <answers.json> <repo-dir> [--dry-run] [--force]

Never deletes. A file that already exists with different content is NOT
overwritten: the new version is written next to it as `<file>.onboard-new` and
listed as a conflict for Claude to merge by hand (or pass --force to overwrite,
e.g. on a fresh repo). Prints a JSON report as the last line.

Placeholders: [[a.b]] = answers value; [[@block]] = computed text. A line whose
only content is `[[@block]]` (optionally after "| ") is replaced whole.
"""
import datetime, json, os, re, shutil, stat, sys

KIT = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.join(KIT, 'templates')
TOKEN = re.compile(r'\[\[(@?[a-z_][a-z0-9_.]*)\]\]')
WHOLE = re.compile(r'^\|?\s*\[\[@([a-z_]+)\]\]\s*$')


def get(d, dotted, default=''):
    cur = d
    for k in dotted.split('.'):
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur


def blocks(a):
    """Computed placeholders."""
    st, pr = get(a, 'branches.staging'), get(a, 'branches.production')
    jobs = a.get('jobs', [])
    olds = [p.split('=', 1)[0] for p in get(a, 'site.sandbox_replace', [])]
    checks, n = [], 0
    for j in jobs:
        for s in j['stages']:
            if s.get('check'):
                n += 1
                checks.append(f"| CHECK {n} | end of `work/{j['slug']}/{s['slug']}` | {s['check']} |")
    checks.append(f"| CHECK {n + 1} | end of `work/release/01_staging` | opens staging on {get(a, 'environment.device')} and looks at what changed |")
    checks.append(f"| CHECK {n + 2} | `work/release/02_production` | presses **Promote staging → production** in GitHub Actions |")
    content = list(a['project'].get('content_rules', []))
    if a['project'].get('language_rule'):
        content.append(f"{a['project']['language_rule']} in everything people read.")
    brand = a['project'].get('brand_rules') or []
    content += brand if brand else [f"Brand rules: **none set yet** (owner, {datetime.date.today()}). Propose one before relying on it."]
    mirror_dirs = sorted({d for _, d in a.get('mirrors', [])})
    ftp = get(a, 'hosting.ftp', 'later')
    todo = [f"- Pages source → GitHub Actions: https://github.com/{a['project']['repo']}/settings/pages" if not get(a, 'hosting.pages_switched') else None,
            f"- Turn on Dependabot: https://github.com/{a['project']['repo']}/settings/security_analysis",
            "- FTP secrets when the server is ready (`_shared/secrets.md`)." if ftp == 'later' else None,
            "- Promote when ready (CHECKs pass on staging first)."]
    first = lambda j: j['stages'][0]
    return {
        'where_rows': '\n'.join([f"| {r['path']} | {r['what']} |" for r in a.get('where_extra', [])] +
                                [f"| `work/{j['slug']}/` | pipeline: {' → '.join(s['slug'] for s in j['stages'])} |" for j in jobs]),
        'route_rows': '\n'.join(f"| {j['name'].lower()} | `work/{j['slug']}/{first(j)['slug']}/CONTEXT.md` | {first(j).get('check') or 'next stage'} |" for j in jobs),
        'jobs_rows': '\n'.join(f"| {j['name']} | " + ' → '.join(f"`work/{j['slug']}/{s['slug']}`" for s in j['stages']) + " | release |" for j in jobs),
        'check_rows': '\n'.join(checks),
        'laws': '\n'.join(f"{i}. {t}" for i, t in enumerate([
            'Real saved data is the production database — never rename a storage key or change its shape without a migration.',
            'Live files are the one source; mirrored copies are synced, never edited alone.',
            ' '.join(c.rstrip('.') + '.' for c in content[:3]),
            f"Work lands on `{st}` through a pull request from a `{get(a, 'branches.work_prefix')}<topic>` branch, one concern each, Conventional Commits. `{pr}` is promote-only.",
            '`.github/` and `scripts/` are guarded: only when asked, impact summary first.',
            'Actions SHA-pinned, Dependabot 7-day cooldown, npm via `npm ci --ignore-scripts`, no new CDN or service without a yes.',
            'No secret in the repo, a file, a prompt or a chat.',
            'Nothing moves past a CHECK until the owner has looked at it.'], 1)),
        'content_rules': '\n'.join(f"{i}. {c}" for i, c in enumerate(content, 1)),
        'prefix_list': ', '.join(f'`{o}`' for o in olds) or '*(none — no storage found; add them to `scripts/site.conf` if the app starts saving data)*',
        'mirror_list': ', '.join(f'`{d}/`' for d in mirror_dirs) or '*(none)*',
        'guarded_extra': '\n'.join(f'- {g}' for g in a.get('guarded_extra', [])),
        'merge_clause': f', and merging pull requests into `{st}`' if get(a, 'automation.auto_merge') else '',
        'ftp_sentence': '' if ftp == 'never' else ('; FTP is the primary host once its secrets are set, with Pages as the fallback' if ftp == 'later' else '; FTP is the primary host, Pages the fallback'),
        'dependabot_npm': '\n'.join(f'''  - package-ecosystem: "npm"
    directory: "{d}"
    target-branch: "{st}"
    schedule:
      interval: "weekly"
    cooldown:
      default-days: 7
    open-pull-requests-limit: 5
    groups:
      npm-dependencies:
        patterns: ["*"]''' for d in a.get('dependabot_npm_dirs', [])),
        'owner_todo': '\n'.join(t for t in todo if t),
        'archive_rows': '\n'.join(f"| {r['was']} | {r['status']} | {r['where']} |" for r in a.get('archive', [])) or '| *(nothing yet)* | | |',
        'kept_rows': '\n'.join(f"| `{r['path']}` | {r['why']} |" for r in a.get('kept', [])) or '| *(nothing)* | |',
    }


def render(text, a, b, extra=None):
    out = []
    for line in text.split('\n'):
        m = WHOLE.match(line)
        if m and m.group(1) in b:
            if b[m.group(1)]:
                out.append(b[m.group(1)])
            continue
        out.append(line)
    text = '\n'.join(out)

    def sub(m):
        k = m.group(1)
        if k.startswith('@'):
            return b.get(k[1:], m.group(0))
        if extra and k in extra:
            return str(extra[k])
        v = get(a, k, None)
        return m.group(0) if v is None else str(v)
    return TOKEN.sub(sub, text)


def main():
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    if len(args) != 2:
        sys.exit(__doc__)
    dry, force = '--dry-run' in sys.argv, '--force' in sys.argv
    a = json.load(open(args[0]))
    repo = os.path.abspath(args[1])
    owner, name = a['project']['repo'].split('/')
    a['pages'] = {'url': f'https://{owner.lower()}.github.io/{name}/'}
    a['today'] = str(datetime.date.today())
    b = blocks(a)
    planned = {}   # rel path -> content (str) or ('copy', src)

    for root, _, files in os.walk(TPL):
        for f in files:
            src = os.path.join(root, f)
            rel = os.path.relpath(src, TPL).replace(os.sep, '/')
            if rel == '_stage-CONTEXT.md':
                continue
            planned[rel] = render(open(src).read(), a, b)
    stage_tpl = open(os.path.join(TPL, '_stage-CONTEXT.md')).read()
    for j in a.get('jobs', []):
        prev = None
        for s in j['stages']:
            inp = s.get('input') or (f"`../{prev}/output/` (approved files only)" if prev else '{{FILL: where new work arrives — e.g. `inbox/`}}')
            planned[f"work/{j['slug']}/{s['slug']}/CONTEXT.md"] = render(stage_tpl, a, b, {
                'stage.slug': s['slug'], 'stage.job': s['job'], 'stage.input': inp, 'stage.up': '../../../',
                'stage.check': s.get('check') or 'None — the next stage reads whatever is in `output/`.'})
            planned[f"work/{j['slug']}/{s['slug']}/output/.gitkeep"] = ''
            prev = s['slug']
    planned['work/release/02_production/output/.gitkeep'] = ''
    planned['_templates/.gitkeep'] = ''
    for sc in ('package-site.sh', 'sync-mirrors.sh'):
        planned[f'scripts/{sc}'] = open(os.path.join(KIT, 'scripts', sc)).read()
    q = lambda xs: ' '.join(f"'{x}'" for x in xs)
    site = a['site']
    planned['scripts/site.conf'] = f"""# scripts/site.conf — what package-site.sh publishes. Generated by repo-onboard; edit freely.
# Paths are globs relative to the repo root; directories copy whole.
APP_PATHS=({q(site['app_paths'])})
# Published with PRODUCTION only (e.g. a standalone kit), taken from the production branch.
EXTRA_PATHS=({q(site.get('extra_paths', []))})
# Staging sandbox: "old=new" literal replacements in SANDBOX_GLOBS files of the staging copy.
SANDBOX_REPLACE=({q(site.get('sandbox_replace', []))})
SANDBOX_GLOBS=({q(site.get('sandbox_globs', ['*.js']))})
SANDBOX_GUARD_FILE='{site.get('sandbox_guard_file', '')}'   # must contain the first "new" after sandboxing
SW_FILE='{site.get('sw_file', '')}'
MANIFEST_FILE='{site.get('manifest_file', '')}'
STAGING_LABEL='{site.get('staging_label', 'STAGING')}'
STAGING_BADGE={1 if site.get('staging_badge', True) else 0}
"""
    planned['scripts/mirrors.conf'] = '# scripts/mirrors.conf — <source-glob> <mirror-dir>, one pair per line. Generated by repo-onboard.\n' + \
        ''.join(f'{g} {d}\n' for g, d in a.get('mirrors', []))
    planned['_shared/onboarding.json'] = json.dumps({k: v for k, v in a.items() if k not in ('pages', 'today')}, indent=2) + '\n'

    report = {'written': [], 'unchanged': [], 'conflicts': [], 'unfilled_placeholders': []}
    for rel, content in sorted(planned.items()):
        for m in TOKEN.finditer(content):
            report['unfilled_placeholders'].append(f'{rel}: {m.group(0)}')
        dst = os.path.join(repo, rel)
        if os.path.exists(dst):
            if open(dst, encoding='utf-8', errors='replace').read() == content:
                report['unchanged'].append(rel); continue
            if not force:
                report['conflicts'].append(rel)
                if not dry:
                    open(dst + '.onboard-new', 'w').write(content)
                continue
        report['written'].append(rel)
        if dry:
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        open(dst, 'w').write(content)
        if rel.endswith('.sh'):
            os.chmod(dst, os.stat(dst).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    gi = os.path.join(repo, '.gitignore')
    if not dry and (not os.path.exists(gi) or '*.onboard-new' not in open(gi).read()):
        with open(gi, 'a') as fh:
            fh.write('\n# repo-onboard conflict copies — merge by hand, then delete\n*.onboard-new\n')
    print(f"{'(dry run) ' if dry else ''}written {len(report['written'])}, unchanged {len(report['unchanged'])}, "
          f"conflicts {len(report['conflicts'])}, unfilled placeholders {len(report['unfilled_placeholders'])}")
    for c in report['conflicts']:
        print(f'  conflict: {c} → {c}.onboard-new')
    for u in report['unfilled_placeholders']:
        print(f'  unfilled: {u}')
    print(json.dumps(report))


if __name__ == '__main__':
    main()
