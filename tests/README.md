# Tests — Sharon's Cookbook

The app itself has **zero dependencies** (a hard law of this codebase — no
`package.json` in the repo root, ever). Playwright is a *test-only* tool
you install somewhere outside the repo, or ad hoc.

## Running the smoke test

```bash
# 1. Serve the app (repo root)
python3 -m http.server 8080 &

# 2. Get Playwright + Chromium available
mkdir -p /tmp/sc-tests && (cd /tmp/sc-tests && npm i playwright && npx playwright install chromium)

# 3. Run, pointing the test at that install
PLAYWRIGHT_DIR=/tmp/sc-tests node tests/smoke.mjs
```

Environment variables:

- `PLAYWRIGHT_DIR` — directory whose `node_modules` contains playwright
  (omit if playwright is resolvable from the repo's parent directories)
- `BASE_URL` — app origin (default `http://localhost:8080`)
- `CHROMIUM_PATH` — explicit Chromium binary if you don't want Playwright's
  managed download (e.g. a preinstalled `/opt/pw-browsers/...` build)

Each run starts from a fresh browser profile, so first-run seeding is
exercised every time. The run **must end** with
`ALL CHECKS PASSED, no console errors.` — that's the bar before any push.

Screenshots land in `tests/shots/` (gitignored) — 12 captures covering
light/dark, desktop/mobile, and the offline reload, useful for visual
review after styling changes.

## What it covers

1. First-run seeding through the AI import engine
2. Recipe list, instant search, detail scaling, editor CRUD
3. Planner entry creation + grocery generation into household shopping
4. **Separation of the two shopping systems** (asserts no leakage)
5. Pantry and garden rendering (incl. seasonal calendar)
6. AI import: preview → apply → verify → **undo** → verify rollback
7. Settings/statistics, dark theme
8. Service worker activation and a **fully offline reload**
9. Mobile viewport with off-canvas navigation
