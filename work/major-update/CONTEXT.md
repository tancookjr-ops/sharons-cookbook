# major-update — the future direction (v2)

One job: hold the plan for the next generation of the app, so it can be picked up later.

The v2 code lives on the branch `major_update/ui-logic-editable-data-and-central-serving-and-dev`
(originally `sharons-cookbook/` in BorealCodex, handed over 2026-07). It is a separate
history: a rewrite into `js/` + `css/` modules with a real import engine, backup/restore,
tests, and docs. `reference/` holds a read-only copy of its docs taken at commit `aac133e`;
the branch stays the one home for the code.

## Why it matters to the current workspace
- **Content without code changes:** v2 adds recipes through import files that follow
  `reference/docs/IMPORT_SPEC.md` — this closes today's known gap (new recipes not
  reaching phones that already have saved data).
- **Schema:** `reference/docs/SCHEMA.md` is v2's recipe schema; compare with
  `_shared/recipe-structure.md` before any migration.

## Inputs (when this work starts)
- `reference/PROJECT_STATUS.md`, `reference/HANDOVER.md`, `reference/TODO.md` first
- `reference/docs/SPEC.md`, `ARCHITECTURE.md`, `SCHEMA.md`, `IMPORT_SPEC.md` as needed

## Human check
The owner decides when v2 work starts and what it replaces. Until then nothing here ships.
