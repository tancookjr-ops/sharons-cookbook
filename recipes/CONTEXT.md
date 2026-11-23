# recipes/ — the built-in recipe collection

One job: hold the app's built-in recipes, one file per category group.

- `build.js` defines the structure (`R()`, `ing()`, `step()`, `nut()`) — the one
  definition; summary in `../_shared/recipe-structure.md`. Changing it is an app update.
- The other files each call `R({ … })` once per recipe. Which file: the table in
  `../_shared/recipe-structure.md`.
- Copies live in `design-system/deploy/recipes/` and `design-system/ui_kits/cookbook/recipes/`
  — never edit those; run `../scripts/sync-mirrors.sh` after any change here.

Adding a recipe? Don't start here — start at `../work/recipes/01_draft/CONTEXT.md`.
Checks: `node scripts/check-recipes.mjs` (from the repo root) → `0 errors`.

**Not a recipe task?** Return to `../CLAUDE.md`.
