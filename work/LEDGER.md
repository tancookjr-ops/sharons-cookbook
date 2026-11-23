# Ledger — session handoffs (newest first)

Append-only. One entry per "handoff" (see `_shared/working-practices.md`).
Status is never stored here — it is read from the files (`CONTEXT.md` → Status).

## 2026-11-23 — repo-onboard patch

**Changed**
- The repo-onboard patch, now at https://github.com/tancookjr-ops/repo-onboard: installs
  this whole setup on another repo — intake rounds (AskUserQuestion), inventory, renderer, verify against real branches,
  design-backup import with the known fixes, one PR, auto-merge, deploy watch, fix loop.
- Dry-run on a pristine copy of this repo: staging package byte-identical to the hand-built one.

- Security alert checked: esbuild 0.24.2 in `design-system/tools` (GHSA-67mh-4wv8-2f99,
  moderate; affects only esbuild's dev server, which the tools never start). Dependabot
  PR #15 upgrades to 0.28.2 — tested: identical bundle, check 0 errors, audit clean.

**Waiting on the owner**
- Merge Dependabot PR #15 (esbuild). PR #14 (actions majors) — review before merging.

## 2026-11-23 — workspace, deploys, rules

**Changed**
- Design system imported from the design-tool backup into `design-system/`; its
  check passes; `upload-v*` duplicates removed.
- Repo restructured as an ICM workspace (`CLAUDE.md`, `CONTEXT.md`, `work/`, `_shared/`).
- Deploy workflows adapted from BorealCodex; GitHub Pages hosts production `/`,
  sandboxed staging `/staging/` and the UI kit — tancookjr-ops/sharons-cookbook#11, #12.
- BorealCodex rules and working practices adapted (`_shared/rules.md`,
  `_shared/working-practices.md`, `_shared/secrets.md`), with mirror-drift check,
  SHA-pinned actions, Dependabot cooldown, committed tools lockfile.

**Waiting on the owner**
- Turn on Dependabot (Settings → Code security).
- Promote when ready — fixes the live site's icons.
- FTP secrets, when the server is ready.

**Next**
- Known gap: new built-in recipes don't reach a phone that already has saved data
  (`CONTEXT.md`). Decide: app update to merge new recipes, or wait for v2.
