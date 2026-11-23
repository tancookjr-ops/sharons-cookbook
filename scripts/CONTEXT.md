# 🔒 scripts/ — packaging and checks (guarded)

One job: build what gets published and refuse anything that breaks the rules.
Touch only when the task explicitly says so; give the owner an impact summary first.

| Script | Does | Run by |
|---|---|---|
| `package-site.sh <checkout> <out> [production\|staging]` | builds the publishable app (same file set as `design-system/deploy/`); staging mode sandboxes storage keys and adds the STAGING badge | `pages.yml`, `ftp.yml` |
| `check-recipes.mjs` | loads every recipe like the app does; checks it against `_shared/recipe-structure.md`; warns on animal-product words | staging gate · 02_add |
| `sync-mirrors.sh [--check]` | copies root app files into the `design-system/` mirrors · `--check` fails on drift | staging gate · after any root CSS/code/recipe edit |
| `CONTEXT.md` | this file | — |

## Inputs
- Reference (every run): `../_shared/rules.md` §1–2, §5–6

Do NOT load: recipe contents, `design-system/` internals, workflow files (unless the change spans both).

## Laws here
- The staging sandbox (`mycookbook-` → `cbstaging-`) must fail loudly, never pass silently.
- A check that warns today may become an error only with the owner's yes.
- Test every change locally on the real branches before pushing (see each script's header).

**Not a scripts task?** Return to `../CLAUDE.md`.
