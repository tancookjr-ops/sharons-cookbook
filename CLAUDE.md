# Sharon's Cookbook

The myCookbook phone app (offline-first recipes, planner, pantry, shopping, garden)
and the workspace that adds recipes to it, updates it, and releases it.

Built on ICM: folders carry sequencing, hierarchy carries context, files carry state.
If something needs explaining, it goes in that folder's `CONTEXT.md`.
`AGENTS.md` is a pointer to this file — one map for every assistant.

## Where things live

| Path | What it holds |
|---|---|
| root app files (`index.html`, `*.jsx`, `*.js`, `*.css`, `tokens/`, `icons/`, `sw.js`) | the live app — **the one source of truth**; served as-is; paths must not move |
| `recipes/` | the built-in recipe collection (`recipes/CONTEXT.md`) |
| `work/recipes/` | pipeline: a recipe goes from inbox → draft → into `recipes/` |
| `work/release/` | pipeline: Develop → staging → phone check → Production |
| `work/major-update/` | the future direction (v2 rewrite) — reference only |
| `work/LEDGER.md` | session handoffs, newest first |
| `design-system/` | design tools + mirrored copies of the app's CSS — own `CLAUDE.md` |
| `_shared/` | factory: **rules**, working practices, secrets, recipe structure, release process |
| `_templates/` · `_archive/` | blank starters · what is retired and why |
| `.github/` 🔒 · `scripts/` 🔒 | deploy automation and checks — guarded (own `CONTEXT.md`) |

## Route by job

| Job | Go to | Then stop at |
|---|---|---|
| add a recipe (most common) | `work/recipes/01_draft/CONTEXT.md` | CHECK 1: owner confirms the draft matches the recipe structure |
| update the app | edit root app files on a branch → PR into `Develop`, then `work/release/01_staging/` | CHECK 2 |
| change the design | edit root CSS/tokens, `scripts/sync-mirrors.sh`, `design-system/CLAUDE.md` to check | CHECK 2 |
| release a version | `work/release/02_production/CONTEXT.md` | CHECK 3: owner presses Promote |
| deploys, CI, scripts 🔒 | `.github/CONTEXT.md` / `scripts/CONTEXT.md` | owner's yes to the impact summary |
| secrets, FTP details | `_shared/secrets.md` | owner enters values in GitHub |
| plan the v2 rewrite | `work/major-update/CONTEXT.md` | — |
| set up another repo the same way | `.claude/skills/repo-onboard/SKILL.md` (the patch) | owner approves the proposal |
| "pickup" / "handoff" | `_shared/working-practices.md` → Pickup / handoff | — |
| asked for status | `CONTEXT.md` → "Status" | report what exists |

## The laws (full text, and how each is enforced: `_shared/rules.md`)

1. Sharon's saved data is the production database — never rename a storage key or change its shape without a migration.
2. Root app files are the one source; `design-system/` copies are synced, never edited alone.
3. Every recipe is vegan. Canadian spelling.
4. Work lands on `Develop` through a pull request from a `claude/<topic>` branch, one concern each, Conventional Commits. `Production` is promote-only.
5. `.github/`, `scripts/`, `sw.js` versioning are guarded: only when asked, impact summary first.
6. Actions SHA-pinned, Dependabot 7-day cooldown, tools via `npm ci --ignore-scripts`, no new CDN or service without a yes.
7. No secret in the repo, a file, a prompt or a chat.
8. Nothing moves past a CHECK until the owner has looked at it.

How Claude works with the owner (plain language, one step at a time, iPad-friendly
steps, impact before change, honest reports): `_shared/working-practices.md`.
Lost? Ask — don't wander.
