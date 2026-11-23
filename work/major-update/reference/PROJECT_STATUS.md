# Project Status — Sharon's Cookbook

**Version:** 1.0.0 · **Schema:** 1 · **Updated:** 2026-07-08

## Handover state

This folder is packaged for **total handover to its own repository** —
see `HANDOVER.md` for the session record, binding decisions, extraction
commands and the briefing path for a new AI assistant. The end-to-end test
suite lives in `tests/`, icon tooling in `tools/`, and the founding
specification in `docs/SPEC.md`. Nothing references the host repo.

## Where things stand

Version 1 is feature-complete against the project specification and verified
end-to-end in a browser (Chromium): offline PWA shell, recipes (CRUD, search,
scaling, exports), meal planner (day/week/month, drag-and-drop, grocery
generation), pantry with alerts, two fully separated shopping systems
(Household + Tancook Island Botanicals), garden with harvest log and seasonal
calendar, dashboard, settings, full backup/restore with automatic snapshots,
and the AI Import Engine with validation, preview, rollback and undo.

Starter content (6 recipes, 5 pantry items, 2 garden entries) seeds on first
run **through the import engine itself**, so the seed file doubles as living
documentation of the import format.

## Layer discipline

- **Layer 1 (application)** — this codebase. Expected to change rarely from
  here; releases bump `APP_VERSION` (js/backup.js) and `CACHE_VERSION` (sw.js).
- **Layer 2 (content)** — grows via `#/import` using files that follow
  `docs/IMPORT_SPEC.md`. No code changes required.

## Known limitations (tracked in TODO.md)

- PDF export uses the browser's print-to-PDF rather than a generated file.
- Weather card is a placeholder by design (app is offline-first).
- Barcode field is reserved but scanning is not implemented.
- No automated test suite yet; verification is manual + scripted browser
  smoke checks.

## How to pick this up

1. Read `README.md`, then `docs/ARCHITECTURE.md`.
2. Any schema question → `docs/SCHEMA.md`; import question → `docs/IMPORT_SPEC.md`.
3. Serve `sharons-cookbook/` statically and open it; DevTools → Application
   shows the service worker, cache and IndexedDB stores.
