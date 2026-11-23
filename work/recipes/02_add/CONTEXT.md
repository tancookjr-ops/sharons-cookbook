# 02_add — put approved drafts into the app

One job: append each approved draft's `R({ … })` block to the right `recipes/*.js` file on `Develop`.

## Inputs
- Working (this run): `../01_draft/output/*.md` with `status: approved` (only those)
- Reference (every run): `../../../_shared/recipe-structure.md` → "Which file a recipe goes in"
- Working (this run): the one target file, e.g. `../../../recipes/soups.js`

Do NOT load: other recipe files, app code, drafts still marked `draft`.

## Process
1. For each approved draft, append its code block to the end of the target file.
2. Run `node scripts/check-recipes.mjs`: it must print `0 errors`, and the count for
   the target file must have gone up by one. Read any `warn` lines (possible
   non-vegan words). The staging deploy runs the same check and stops on an error.
3. Run `scripts/sync-mirrors.sh` — it copies the changed file into the design-system
   mirrors (the staging deploy refuses drift).
4. Delete the draft from `../01_draft/output/` (its home is now `recipes/`).
5. Commit on a `claude/<topic>` branch as `feat(recipes): add <title>`, open a pull
   request into `Develop`. Merging it deploys staging.

## Outputs
- the changed `recipes/<file>.js` on `Develop` → hands off to `work/release/01_staging`

## Human check
Merging the pull request is the owner's call. The recipe is then checked on the phone
at CHECK 2 (staging). Remember the known gap in `../../../CONTEXT.md`: an existing
phone with saved data won't show built-in additions.
