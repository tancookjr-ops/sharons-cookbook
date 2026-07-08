# Sharon's Cookbook

An **offline-first Progressive Web App**: personal cookbook, meal planner,
pantry inventory, dual shopping lists, and garden companion — with a focus on
raw-vegan-friendly meal planning, ingredient shopping, pantry stocktaking and
bulk cooking, updatable and maintainable through a ChatGPT voice assistant.
Built with plain HTML, CSS and vanilla JavaScript (ES2023) — no frameworks,
no build step, no server, no internet required.

## Highlights

- **Works completely offline.** All data lives on-device in IndexedDB; the app
  shell is cached by a service worker. Installable on Windows, macOS, Linux,
  Android and iPhone/iPad.
- **Recipe database** with rich metadata (nutrition, EoE / blood-sugar /
  anti-inflammatory notes, storage & freezer instructions, photos, tags,
  ratings, version history), instant search, deep filtering, scaling,
  duplication, print/PDF and Markdown export.
- **Meal planner** — day / week / month views, drag-and-drop recipes, batch
  cooking and leftover flags, and one-click grocery generation that subtracts
  what the pantry already holds.
- **Pantry** across five locations (pantry, fridge, freezer, garden harvest,
  bulk storage) with expiry and low-stock alerts; recipes show live "in your
  pantry" checkmarks per ingredient.
- **Two fully separate shopping systems**: Household groceries and **Tancook
  Island Botanicals** business supplies. Separate object stores, separate
  lists — they can never mix.
- **Garden** — plant database, planting/harvest dates, harvest log,
  preservation plans, a seasonal calendar, and "cook with it" recipe links.
- **AI Import Engine** — the app grows through structured JSON imports
  generated from natural conversation with an AI assistant, with validation,
  preview, conflict resolution, rollback and undo. See
  [`docs/IMPORT_SPEC.md`](docs/IMPORT_SPEC.md).
- **Backups** — one-file JSON export/import of everything, plus automatic
  daily on-device snapshots with restore.
- Light & dark themes, mobile-first responsive layout, keyboard navigation,
  screen-reader-friendly markup, metric/imperial display conversion.

## Running it

It's a static site — serve the folder over HTTP(S) and open it:

```bash
cd sharons-cookbook
python3 -m http.server 8080
# → http://localhost:8080
```

(Service workers require `localhost` or HTTPS; opening `index.html` from
`file://` runs the app but without offline caching.)

Install it from the browser's "Install app" / "Add to Home Screen" action.
On first run a small set of starter recipes, pantry items and garden entries
is loaded through the import engine (`data/starter-import.json`).

## Project layout

```
index.html            app shell (nav, outlet, dialog, toasts)
manifest.webmanifest  PWA manifest
sw.js                 service worker (precache, update flow)
css/                  design system + per-feature styles
js/                   ES modules — see docs/ARCHITECTURE.md
icons/                generated PNG app icons
images/               (reserved for future bundled imagery)
data/                 starter content + sample AI import file
docs/                 SPEC, ARCHITECTURE, SCHEMA, IMPORT_SPEC
tests/                Playwright end-to-end smoke suite (test-only tooling)
tools/                icon generator (pure-stdlib Python)
```

## Documentation

| File | What it covers |
|---|---|
| [`HANDOVER.md`](HANDOVER.md) | session record, binding decisions, repo-extraction guide |
| [`docs/SPEC.md`](docs/SPEC.md) | the founding project specification (the contract) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | two-layer design, modules, data flow |
| [`docs/SCHEMA.md`](docs/SCHEMA.md) | every stable record shape + field rules |
| [`docs/IMPORT_SPEC.md`](docs/IMPORT_SPEC.md) | the AI import format, operations, examples |
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | where the project stands |
| [`TODO.md`](TODO.md) | planned work |
| [`CHANGELOG.md`](CHANGELOG.md) | release history |

## Principles

1. **Application ≠ content.** The software (Layer 1) changes rarely; the
   cookbook's content (Layer 2) grows continuously through imports.
2. **Stable schema.** Field names and IDs are permanent. New fields may be
   added; nothing is renamed or removed without a schema version bump.
3. **Local-only.** No accounts, no network calls, no telemetry. The only way
   data leaves the device is the user exporting it.
