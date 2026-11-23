# 01_draft — turn a raw recipe into a checked draft

One job: turn whatever arrived in `inbox/` into a draft in the app's recipe structure.

## Inputs
- Working (this run): `inbox/<anything>` — pasted text, a link, a photo, notes from Sharon
- Reference (every run): `../../../_shared/recipe-structure.md`
- Reference (every run): `../../../_templates/recipe-draft.md`
- Reference (only to avoid duplicates): `grep -i "title: '<name>" ../../../recipes/*.js`

Do NOT load: the whole `recipes/` files, app code, `design-system/`, other drafts.

## Process
1. Copy `_templates/recipe-draft.md` to `output/<recipe-slug>.md`.
2. Fill every required field from the inbox item. Keep ingredients and steps word-for-word
   from the source; convert units to the metric set in the structure file.
3. Make it vegan; list every swap in "Vegan check". If it can't be made vegan, stop and say so.
4. Write the `R({ … })` code block at the bottom from the fields.
5. Move the inbox item to `inbox/done/` (or delete it if it was only a link).

## Outputs
- `output/<recipe-slug>.md` with `status: draft`

## Human check — CHECK 1
The owner reads the draft against `_shared/recipe-structure.md`: amounts, units, step
order, category, tags, vegan swaps. Edit it in place; set `status: approved` when right.
Nothing goes to `02_add` while it says `draft`.
