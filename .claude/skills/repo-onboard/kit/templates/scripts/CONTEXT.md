# 🔒 scripts/ — packaging and checks (guarded)

One job: build what gets published and refuse anything that breaks the rules.
Touch only when the task explicitly says so; give the owner an impact summary first.

| File | Does | Run by |
|---|---|---|
| `package-site.sh <checkout> <out> [production\|staging]` | builds the publishable site from `site.conf`; staging mode sandboxes storage keys and adds the badge | `pages.yml`, `ftp.yml` |
| `site.conf` | what is published (`APP_PATHS`, `EXTRA_PATHS`) and how staging is sandboxed | `package-site.sh` |
| `sync-mirrors.sh [--check]` | copies live files into their mirrors (`mirrors.conf`) · `--check` fails on drift | staging gate · after any edit to a mirrored file |
| `mirrors.conf` | `<source-glob> <mirror-dir>` pairs | `sync-mirrors.sh` |
| `check-*` | project content checks; every one runs in the staging gate and must exit 0 | staging gate |

## Inputs
- Reference (every run): `../_shared/rules.md` §1–2, §5–6

## Laws here
- The staging sandbox must fail loudly, never pass silently.
- Test every change on the real branches before pushing: the repo-onboard `verify.sh`
  packages the working tree as staging and the live branch as production.

**Not a scripts task?** Return to `../CLAUDE.md`.
