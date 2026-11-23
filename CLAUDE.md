# Sharon's Cookbook

The myCookbook phone app (offline-first recipes, planner, pantry, shopping, garden)
and the workspace that adds recipes to it, updates it, and releases it.

Built on ICM: folders carry sequencing, hierarchy carries context, files carry state.
If something needs explaining, it goes in that folder's `CONTEXT.md`.

## Where things live

| Path | What it holds |
|---|---|
| root app files (`index.html`, `*.jsx`, `*.js`, `*.css`, `tokens/`, `icons/`, `sw.js`) | the live app — served as-is; paths must not move |
| `recipes/` | the built-in recipe collection, one file per category |
| `work/recipes/` | pipeline: a recipe goes from inbox → draft → into `recipes/` |
| `work/release/` | pipeline: Develop → staging → phone check → Production |
| `work/major-update/` | the future direction (v2 rewrite) — read-only reference |
| `design-system/` | colours, type, components, UI kit — has its own `CLAUDE.md` |
| `_shared/` | factory: recipe structure, release process (stable, every job) |
| `_templates/` | blank starters — copy, don't start from nothing |
| `_archive/` | what is old, duplicated or superseded, and why |
| `.github/workflows/`, `scripts/` | deploy automation (adapted from BorealCodex) |

## Route by job

| Job | Go to | Then stop at |
|---|---|---|
| add a recipe (most common) | `work/recipes/01_draft/CONTEXT.md` | CHECK 1: owner confirms the draft matches the recipe structure |
| update the app | edit root app files on `Develop`, then `work/release/01_staging/` | CHECK 2 |
| change the design | `design-system/CLAUDE.md`, then `work/release/01_staging/` | CHECK 2 |
| release a version | `work/release/02_production/CONTEXT.md` | CHECK 3: owner presses Promote |
| plan the v2 rewrite | `work/major-update/CONTEXT.md` | — |
| asked for status | `CONTEXT.md` → "Status" | report what exists |

## Rules that always apply

- Branches: work on `Develop` (default, = staging). `Production` = live. Never commit to `Production` directly.
- Everything in `recipes/` is vegan. No exceptions.
- Nothing moves past a CHECK until the owner has looked at it.
- Never commit secrets. FTP details live only in GitHub repository secrets.
