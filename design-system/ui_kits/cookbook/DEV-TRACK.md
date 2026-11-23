# Dev track — centralised app updates

## v1.2.0 (2026-07-22) — myCookbook
- Renamed app **myCookbook**; the topbar reads "<username>'s Cookbook".
- Local multi-user accounts (auth.js): login/create-account gate, SHA-256
  hashed passwords, per-account data keys `mycookbook-data:<email>`.
  Sharon's account is seeded; her pre-account save migrates automatically
  on first load. New accounts start with 25 staples (5 breakfasts /
  lunches / dinners / desserts / snacks) and an empty pantry/planner.
- Web recipes import (import-web.js): multiple URLs at once, each queued
  into its own recipe. schema.org JSON-LD → microdata/plugin markup →
  heuristic fallback; CORS relay fallback. Ingredients/steps/times kept
  **word-for-word**; editorial prose replaced by a self-written factual
  one-liner; source URL + photo linked. Dietary substitutions are opt-in
  only (bulk import defaults also flipped to no-changes).
- Photo import: real on-device OCR (tesseract.js, lazy-loaded) with
  progress, editable text review, then the shared recipe extractor.
- YouTube import: real metadata via noembed + the watch page's embedded
  description through a relay; description parsed for the recipe; paste
  fallback. Thumbnail + source link stored.
- New recipe screen — the "+ New recipe" buttons now work.
- SW cache renamed mycookbook-, VERSION v1.2.0.

Four candidate solutions for delivering updates to Sharon's Cookbook,
recorded 2026-07-10. **Option 1 is in progress** (see `deploy/README.md`).

## Option 1 — Hosted web app (GitHub Pages)  ← CHOSEN
Host the app at a URL; install once from the browser (Add to Home Screen).
Every push to the repo updates all installed copies on next launch via a
service worker. Data lives on-device (localStorage), untouched by updates.
- Effort: low · true central updates · no reinstalling files
- Stack: GitHub repo + GitHub Pages + service worker + web manifest

## Option 2 — App shell + data/version push
Extends option 1: app checks a `version.json` / `recipes.json` on launch,
so content (recipes, densities, stores) can be pushed without shipping app
code. Shows an "update available" prompt.
- Effort: medium · best when content changes more often than features

## Option 3 — Single file via shared folder
Distribute the standalone HTML through Dropbox/Drive/iCloud; reinstall on
each update. No infrastructure, but manual and easy to run stale.
- Effort: none · what we did pre-hosting

## Option 4 — Native wrap (Capacitor / PWABuilder)
Wrap for App Store / Play Store; store-managed updates.
- Effort: high (accounts, review, signing) · only if store presence or
  deeper device APIs are needed

## Migration path
1 → 2 when content pushes matter; 4 stays optional later. Data persistence
(localStorage) is prerequisite for all — implemented with option 1.
