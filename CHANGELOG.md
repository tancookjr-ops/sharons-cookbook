# Changelog — Sharon's Cookbook

All notable changes to the application layer. Content changes (recipes,
plans, …) happen through imports and are not tracked here.

## [Unreleased]

### Added
- Handover package for extraction to a standalone repository:
  `HANDOVER.md` (session record, decisions, extraction guide),
  `docs/SPEC.md` (founding specification), `tests/smoke.mjs` +
  `tests/README.md` (17-step Playwright end-to-end suite),
  `tools/make-icons.py` (icon generator), `.gitignore`.
  No application-code changes (no version bump needed).

## [1.0.0] — 2026-07-08

First full release.

### Added
- Offline-first PWA shell: service worker precache, installability,
  update-available banner, generated app icons, manifest with shortcuts.
- Recipe database: instant search, filters (ingredient, category, cuisine,
  meal, times, difficulty, favourites, freezer/garden/high-protein/raw/
  cooked/recent), detail view with serving scaling, per-ingredient pantry
  checkmarks, nutrition, health notes (EoE / blood sugar / anti-inflammatory),
  storage/freezer/reheating, version history, related recipes.
- Recipe editor: full CRUD, repeaters for ingredients and instructions,
  drag-and-drop step reordering (with keyboard fallback buttons), photo
  upload with automatic downscaling, duplication, Markdown export,
  print / save-as-PDF.
- Meal planner: day/week/month views, drag-and-drop from a searchable recipe
  tray, per-entry servings/notes/completed/batch/leftovers, grocery
  generation that nets out pantry stock into the household list.
- Pantry: five locations, categories, min/max stock, expiry & low-stock
  alerts, quick ± stepper, "shop low stock" action.
- Shopping: two permanently separate systems (Household, Tancook Island
  Botanicals) with their own stores/categories; recurring items, priorities,
  grouping, printing, sharing.
- Garden: plantings with varieties/locations/dates, harvest log, preservation
  plans, seasonal calendar, recipes-by-harvest links.
- Dashboard: today's meals, favourites, recent recipes, pantry alerts,
  shopping summaries, harvests, season, weather placeholder, quick actions,
  statistics, recent activity feed.
- AI Import Engine: schemaVersion-ed JSON operations with validation,
  preview, conflict resolution (merge/replace/skip), pre-import snapshot,
  rollback on failure, one-click undo; starter content seeds through it.
- Backups: full JSON export/import (merge or replace), automatic daily
  snapshots, manual snapshots, restore, storage statistics.
- Settings: theme (light/dark/auto), text size, metric/imperial display,
  language-ready scaffold, danger-zone wipe.
- Documentation: README, ARCHITECTURE, SCHEMA, IMPORT_SPEC, PROJECT_STATUS,
  TODO.
