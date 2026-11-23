# Sharon's Cookbook Design System — Claude Code agent map  (replaces the design-tool agent map)

You are in `design-system/` of the local `sharon-s-cookbook` repo. This was a design-tool
project. The original agent map is preserved as `CLAUDE.design-tool.md`: its
routing table, verbs and invariants still apply EXCEPT what this file translates.

## Every session
1. Read `MIGRATE/START-HERE.md` §§ 0–4 once per session.
2. the routing table in `CLAUDE.design-tool.md`, if present. Load ONLY the
   matching law files BEFORE acting.
3. If `tools/node_modules/` is missing: `cd tools && npm ci && npx playwright install chromium`.

## The compiler and preview you now own (`tools/`)
| Command | Replaces | When |
|---|---|---|
| `npm run check` | `check_design_system` | after EVERY edit; must print `0 errors`; also writes `gallery.html` |
| `npm run build` | the auto-compiler | after any component change; writes `_ds_bundle.components.js` |
| `npm run build -- --replace` | the auto-compiler | make cards use the new build (backs up `_ds_bundle.js` once) |
| `npm run preview -- <file …>` | preview + screenshot | after editing any HTML; writes `screenshots/preview/*.png` + console errors. READ the PNG. |
| `npm run preview -- --cards` | the DS tab review | all `@dsCard` files at their declared viewport |
| `npm run serve` | live preview for the owner | `http://localhost:4173/` |

Run them from `tools/`; they treat the parent folder as the project root.
`tools/ds.config.json` holds the namespace (`SharonSCookbookDesignSystem_c765c0`).

## Translations that matter
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` were tool
  output. `_ds_bundle.js` now comes ONLY from `npm run build -- --replace`;
  the other two are frozen history.
- Never `<script src>` a `.jsx` in a card. Cards read `window.SharonSCookbookDesignSystem_c765c0`
  from `_ds_bundle.js`.
- `.dc.html` templates: edit as text, inline styles only, keep the `@template`
  comment first; never delete the `support.js` beside it.
- Copy docs: unchanged; run any pre-ship gate with `node` before reporting.

## Definition of done
`npm run check` → 0 errors. Every touched HTML file previewed and its PNG
looked at. Console errors 0. Report the commands and their output lines.

## Invariants
(No invariants section was found in CLAUDE.md or readme.md. Ask the owner for the brand rules before designing anything.)
