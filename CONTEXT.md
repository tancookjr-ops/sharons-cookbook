# Sharon's Cookbook — the jobs and the checkpoints

Three jobs, most frequent first. All of them end in the same release line.

| Job | Stages | Ends in |
|---|---|---|
| Add a recipe | `work/recipes/01_draft` → `02_add` | release |
| Update the app | edit root app files on `Develop` | release |
| Change the design | `design-system/` (its own tools: check / build / preview) | release |
| Release | `work/release/01_staging` → `02_production` | live site |

## The three checkpoints (human gates)

| # | Where | The owner does |
|---|---|---|
| CHECK 1 | end of `work/recipes/01_draft` | reads the draft against `_shared/recipe-structure.md` — amounts, units, steps, tags, vegan |
| CHECK 2 | end of `work/release/01_staging` | opens the staging site **on the phone** and looks at what changed |
| CHECK 3 | `work/release/02_production` | presses **Promote staging → production** in GitHub Actions |

## Hosting

GitHub Pages hosts production and staging until an FTP server is configured;
then FTP is the host and Pages stays as the fallback. Details: `_shared/release-process.md`.

## Status — derive it, don't store it

- Recipes waiting for CHECK 1: files in `work/recipes/01_draft/output/`.
- Recipes not yet drafted: files in `work/recipes/01_draft/inbox/`.
- On staging but not live: `git log origin/Production..origin/Develop`.
- Released versions: files in `work/release/02_production/output/`.

## Known gap

A phone that already has saved data keeps its own recipe list: recipes added to
`recipes/*.js` reach new installs and staging, but **not** an existing phone.
Until the app merges new built-ins (an app update) or the v2 import engine lands
(`work/major-update/`), get a new recipe onto Sharon's phone with the app's own
import (web link, photo) or by typing it into "+ New recipe".
