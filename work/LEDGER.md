# Ledger — session handoffs (newest first)

Append-only. One entry per "handoff" (see `_shared/working-practices.md`).
Status is never stored here — it is read from the files (`CONTEXT.md` → Status).

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
