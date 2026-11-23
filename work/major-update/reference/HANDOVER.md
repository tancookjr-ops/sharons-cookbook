# HANDOVER — Sharon's Cookbook → its own repository

**Date:** 2026-07-08 · **App version:** 1.0.0 · **Schema:** 1
**Built on branch:** `claude/sharons-cookbook-pwa-ajynqg` of `tancookjr-ops/BorealCodex`

This document is the complete transfer package. Everything a new
repository — and a new AI assistant session — needs is inside this folder.
Nothing in the app references BorealCodex; the folder is designed to become
a repository root as-is.

---

## 1. What this folder contains

| Path | Purpose |
|---|---|
| `index.html`, `sw.js`, `manifest.webmanifest` | PWA shell |
| `css/` (9 files), `js/` (12 ES modules) | the application (Layer 1) |
| `icons/`, `images/` | generated app icons; reserved imagery folder |
| `data/starter-import.json` | first-run seed content — loaded through the import engine |
| `data/sample-import.json` | worked example of the AI import format |
| `docs/SPEC.md` | **the founding project specification** (the contract) |
| `docs/ARCHITECTURE.md` | two-layer design, module map, data flow, safety model |
| `docs/SCHEMA.md` | every stable record shape; the never-rename rules |
| `docs/IMPORT_SPEC.md` | the AI import format an assistant generates against |
| `tests/smoke.mjs` | 17-step Playwright end-to-end suite (see `tests/README.md`) |
| `tools/make-icons.py` | pure-stdlib Python icon generator (no PIL needed) |
| `README.md`, `CHANGELOG.md`, `TODO.md`, `PROJECT_STATUS.md` | living project docs |
| `AGENTS.md` | working rules for AI assistants / contributors |
| `.gitignore` | ready for standalone repo use |

## 2. Session record (how v1.0.0 came to be)

One build session, 2026-07-08, by an AI coding assistant working from the
specification now preserved at `docs/SPEC.md`:

1. **Scoped** — the spec mandates a framework-free vanilla-JS PWA, so it was
   built as a self-contained folder rather than inside the host repo's
   Next.js app. No npm, no build step, no dependencies.
2. **Built** — 12 JS modules, 9 stylesheets, PWA shell, icons (generated
   programmatically because the environment had no image libraries), starter
   content, and the full documentation set. ~6,000 lines.
3. **Verified** — served with `python3 -m http.server`, driven end-to-end in
   headless Chromium via Playwright: seeding, search, scaling, recipe CRUD,
   planner + grocery generation, **shopping-system separation**, AI import
   preview → apply → undo, snapshot restore, dark theme, **offline reload
   through the service worker**, and mobile navigation. All 17 checks passed
   with zero console errors.
4. **One real bug found and fixed during verification**: the update banner's
   `display:flex` rule overrode the `hidden` attribute, so the invisible
   banner swallowed clicks near the bottom-right corner. Fix: a global
   `[hidden] { display: none !important; }` rule in `css/app.css`. Lesson
   kept: any new always-in-DOM overlay must respect `[hidden]`.
5. **Committed and pushed** as `dda98a5` ("feat: add Sharon's Cookbook —
   offline-first vanilla-JS PWA (v1.0.0)"), followed by this handover
   package.

## 3. Key decisions and their rationale

These are binding unless deliberately revisited (update this list if so):

1. **Two layers, hard split.** Application code (Layer 1) changes rarely;
   content (Layer 2) arrives via `#/import` files per `docs/IMPORT_SPEC.md`.
   Version 1 is meant to be close to the last big code change.
2. **Schema fields and IDs are permanent.** Additions only; any breaking
   change needs a `schemaVersion` bump + migration in `js/database.js`
   `upgrade()` + import-side translation of older files.
3. **`database.js` is the only module that touches IndexedDB.** Everything
   goes through its promisified helpers. Preferences (and only preferences)
   live in LocalStorage under `sc.settings`.
4. **Household and Botanicals shopping never merge.** Separate object stores
   (`shoppingHousehold`, `shoppingBotanicals`), separate routes; only the
   rendering code is shared (parameterized by the `SYSTEMS` registry in
   `js/shopping.js`). The smoke test asserts the separation.
5. **Every risky data operation is snapshot-guarded** in the `backups`
   store: daily auto-backup, `pre-import` (enables rollback-on-failure and
   one-click undo), `pre-restore`, manual.
6. **First-run seeding goes through the import engine itself**
   (`data/starter-import.json`), so the seed doubles as living documentation
   of the format and exercises the engine on every fresh install.
7. **Rendering model:** hash router in `app.js`; views render HTML strings
   into `#main` with event delegation; every dynamic value passes through
   `esc()`. No virtual DOM — at 10k recipes, in-memory filter/sort is
   milliseconds.
8. **Photos** are canvas-downscaled to ≤1280 px JPEG data-URLs stored inside
   recipe records — keeps backups single-file and IndexedDB lean.
9. **PDF export = browser print-to-PDF** for v1 (a dedicated generator is in
   `TODO.md`). Markdown export is native.
10. **Unit conversion is display-only** (metric ⇄ imperial in
    `utilities.js convertUnit`); stored data keeps the recipe's units.
    Grocery generation only nets pantry stock when units match exactly — no
    unit guessing.
11. **Icons** come from `tools/make-icons.py` (pure stdlib, supersampled
    leaf motif). Re-run it if the brand changes; keep sizes 512/192/maskable
    512/apple 180 in sync with `manifest.webmanifest` and `sw.js` SHELL.
12. **Release ritual:** bump `APP_VERSION` (`js/backup.js`) **and**
    `CACHE_VERSION` (`sw.js`) together, update `CHANGELOG.md`, and keep
    `sw.js` SHELL in sync with any added/renamed files — that list is the
    offline contract.
13. **Language & tone:** Canadian spelling in all user-visible strings
    ("favourite", "fibre", "colour"). UI strings are plain literals for now;
    the settings scaffold is language-ready for a future string table.

## 4. The move — completed 2026-07-08

This repository (`tancookjr-ops/sharons-cookbook`) **is** the new home. The
app was extracted from `tancookjr-ops/BorealCodex` (branch
`claude/sharons-cookbook-pwa-ajynqg`) as a fresh-history import onto the
`Develop` branch, with the folder contents at the repo root. The original
build history remains in BorealCodex on that branch if ever needed.

Remaining owner decisions:

- [ ] Remove the `sharons-cookbook/` folder and its row in the root
      `AGENTS.md` from BorealCodex once satisfied with this repo — the old
      copy is now a duplicate, not the source of truth.
- [ ] Optionally enable GitHub Pages (or any static host) — the app is pure
      static files; serve the repo root. HTTPS is required for the service
      worker, which Pages provides.
- [ ] Add a LICENSE if the repo will be public (deliberately not chosen at
      handover — owner's call).

## 5. Briefing a new AI assistant (pickup)

Reading order for a fresh session in the new repo:

1. `AGENTS.md` — the working rules (laws of the codebase)
2. `HANDOVER.md` (this file) — history + decisions
3. `README.md` → `docs/ARCHITECTURE.md` — orientation
4. `docs/SPEC.md` — the founding contract, for any feature question
5. `docs/SCHEMA.md` + `docs/IMPORT_SPEC.md` — before touching any data shape

To verify any change: `python3 -m http.server 8080` in the repo root, then
run `tests/smoke.mjs` (see `tests/README.md`). The bar set by this handover:
**all smoke steps green, zero console errors** before any push.

For the *content* workflow (the app's whole point): the assistant converses
with Sharon, emits an import file per `docs/IMPORT_SPEC.md`, and she pastes
it into **AI import** in the app. No code changes.

## 6. Open items at handover

See `TODO.md` for the full list. Highest-value next steps: cook-mode view
with step timers, dedicated PDF layout, pantry purchase history, and wiring
`tests/smoke.mjs` into CI in the new repo.
