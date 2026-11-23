# Sharon's Cookbook — Working Rules

A **self-contained, offline-first vanilla-JS PWA**. This folder is designed
to stand alone as its own repository (see `HANDOVER.md`); while it lives
inside another repo it shares **nothing** with its neighbours — no tokens,
no components, no npm. This codebase is deliberately framework-free
(plain HTML/CSS/ES-modules, no build step).

## Orientation

- New here? Read `HANDOVER.md` (history + binding decisions), then
  `README.md`, then `docs/ARCHITECTURE.md`.
- The founding contract is `docs/SPEC.md` — feature questions resolve there.
- Record shapes are a **stable contract**: `docs/SCHEMA.md`. Never rename
  fields or IDs; additions only, versioned via `schemaVersion`.
- The app grows through structured imports (`docs/IMPORT_SPEC.md`), not code.

## Laws of this codebase

1. No frameworks, no dependencies, no `package.json` in the repo. Ever.
   (Playwright for tests lives *outside* the repo — `tests/README.md`.)
2. `js/database.js` is the only file that touches IndexedDB.
3. Household shopping and Tancook Island Botanicals are **separate stores and
   lists — never merge them** (hard product requirement).
4. Preferences → LocalStorage; data → IndexedDB. Never mix.
5. Every release bumps `APP_VERSION` (js/backup.js) **and** `CACHE_VERSION`
   (sw.js) together, updates `CHANGELOG.md`, and keeps the `SHELL` list in
   `sw.js` in sync with any added/renamed files.
6. All user-visible strings use Canadian spelling.
7. Any always-in-DOM overlay must respect `[hidden]` (a global
   `[hidden] { display:none !important }` guards this — don't remove it).

## Verify changes

```bash
python3 -m http.server 8080        # from the app root
NODE_PATH=<playwright-tree> node tests/smoke.mjs
```

Service worker + IndexedDB need `http://localhost`, not `file://`.
The bar before any push: **all smoke steps green, zero console errors.**
