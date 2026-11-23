# Architecture — Sharon's Cookbook

## The two layers

The system is deliberately split so that **software changes are rare** and
**content changes are constant**:

| Layer | What | How it changes |
|---|---|---|
| **1 — Application** | UI, router, IndexedDB access, search, planner, pantry, shopping, garden, settings, import/export, backup | code releases (version bump + service-worker cache bump) |
| **2 — Content** | recipes, meal plans, pantry data, shopping items, garden entries, tags, images, preferences | **structured imports** (`docs/IMPORT_SPEC.md`) and in-app editing — never code |

The long-term workflow: Sharon talks to an AI assistant ("add a hummus
recipe", "put chili on Friday"), the assistant emits an import file, the app
validates/previews/applies it. Version 1 should be the last time most of this
code changes.

## Technology

- HTML5 + CSS3 + vanilla JavaScript (ES2023 modules). No frameworks, no build
  step — files are served as authored.
- **IndexedDB** for all data (via the thin promise wrapper in `database.js`).
- **LocalStorage** for preferences only (`sc.settings`).
- Service worker (`sw.js`) precaches the app shell → full offline.

## Module map (`js/`)

```
app.js         entry point: boot, hash router, shell (sidebar/theme/net),
               service-worker registration + update banner, first-run seed
utilities.js   pure helpers + UI primitives (toast, dialog); no DB, no routes
database.js    THE IndexedDB layer: schema, stores, promisified CRUD,
               activity log. No other module opens IndexedDB.
recipes.js     recipe list/search/filters, detail (scaling, pantry check,
               exports), full editor (drag-reorder steps, photo upload)
planner.js     day/week/month planner, drag-and-drop, grocery generation
pantry.js      inventory by location, expiry/low-stock alerts
shopping.js    BOTH shopping systems, parameterized by SYSTEMS registry;
               data paths (object stores) stay 100 % separate
garden.js      plantings, harvest log, seasonal calendar, recipe links
settings.js    preferences UI + backup/restore UI + storage stats
backup.js      full export/import, snapshots (auto/manual/safety), restore
importer.js    AI Import Engine: parse → validate → preview → apply,
               with pre-import snapshot, rollback and undo
dashboard.js   home screen composed from the other modules' helpers
```

**Dependency direction** (no cycles):
`utilities.js` ← everything; `database.js` ← everything except utilities;
feature modules ← `app.js`. Cross-feature reuse goes through exported
helpers (`recipes.recipeCardHTML`, `shopping.addItemsToShoppingList`,
`pantry.pantryAlerts`, `garden.recentHarvests`, `planner.plansInRange`).

## Rendering model

- Hash routing (`#/recipes`, `#/recipe/:id`, …) dispatched by `app.js`;
  each view renders HTML strings into `#main` and wires events with
  delegation. All dynamic values pass through `esc()`.
- No virtual DOM: views re-render themselves after mutations. At the target
  scale (10k recipes) list rendering stays comfortably under a frame budget
  because search/filter runs on in-memory arrays fetched once per view via
  `getAll()`.

## Data stores (IndexedDB `sharons-cookbook` v1)

`recipes`, `mealPlans`, `pantry`, `shoppingHousehold`, `shoppingBotanicals`,
`garden`, `activity` (recent-activity feed, capped at 200), `backups`
(snapshots). Record shapes: `docs/SCHEMA.md`.

Two hard rules enforced in code and documentation:

1. **Household and Botanicals shopping never merge.** Different object
   stores, different routes; only the rendering code is shared.
2. **Schema fields are permanent.** Migrations only ever add; renames/removals
   require a `DB_VERSION` bump with an explicit upgrade path in
   `database.js upgrade()`.

## Offline & updates

- `sw.js` precaches every shell file under a versioned cache name
  (`sc-vX.Y.Z`). Cache-first serving → instant offline startup.
- Releases bump `CACHE_VERSION` (and `APP_VERSION` in `backup.js`); the
  waiting worker triggers the in-app "Update now" banner; activation deletes
  old caches and reloads once.

## Safety model for data changes

Every risky operation is snapshot-guarded in the `backups` store:

- daily automatic snapshot (opt-out in Settings; keeps 7)
- `pre-import` snapshot before every AI import (enables **undo**; a mid-import
  failure triggers automatic **rollback**)
- `pre-restore` snapshot before any backup restore
- manual snapshots on demand

## Performance notes

- Photos are canvas-downscaled to ≤1280 px JPEG data-URLs before storage.
- Instant search is debounced and matches a precomputed haystack string per
  recipe; filtering 10k records is a few ms.
- Bulk writes (imports, restores) go through single-transaction `dbBulkPut`.
