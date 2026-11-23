# migration-portable — the design-tool off-ramp for any project  (kit v2.1 · 2026-11-22)

Built from Boreal Codex's own migration. The tool closes **2026-12-14**;
chats and comments are deleted after that. Nothing here is Boreal-specific:
name, namespace, components, colours, repo, continuity files and invariants
are detected per project.

## Use it — a project that has not started
1. In Boreal Codex, download `migration-portable/dist/migration-kit-v2.1.txt`
   (download card in the chat, or from the full backup).
2. In the other project: new chat → attach that file → paste:
```
I attached migration-kit-v2.1.txt. Unpack it with the steps at the top of the file, then read migration-portable/LAW.md and migrate the project to the best solution.
```
Swap "the best solution" for "Claude ai" or "Claude code" to run one side only.
The kit travels as one attached file because cross-project copy
(`/projects/<id>/…`) failed in some projects.

## A project that already started (on v1 or v2)
Attach `migration-patch-v2.1.txt` instead and paste:
```
I attached migration-patch-v2.1.txt. Follow the steps at the top of the file.
```
The patch is cumulative: it carries every file changed since v1.

## What v2 changed
- **Knowledge upload = one folder.** `MIGRATE/claude-ai/knowledge/` holds
  exactly the files to upload (flattened names, because Claude.ai knowledge
  has no folders, plus `00-FILE-MAP.md`). It has its own download card:
  unzip, select all, upload.
- **Account export step fixed.** The Claude phone app has no export (web or
  desktop only); on Team plans only the owner can export. It is now best
  effort with clicks from `claude.ai`, not a deep link.
- **One-file delivery** (above).
- Text is copied as text: a Blob save stamps a provenance block into images.
- Names with `&`, `(`… can't be read by scripts → logged as MANUAL and
  copied with the copy tool.

## What v2.1 changed
- The kit stopped at `kit file missing: claude-code/CLAUDE.md` in another
  design system: `CLAUDE.md` is a protected name there, so it couldn't be
  copied in. The file is now `CLAUDE.md.txt`, and SETUP renames it on the
  computer. The optional routing-row edit to a project's own `CLAUDE.md` is
  skipped when that file is protected.

## What it builds in that project
- `MIGRATE/PROFILE.json` — what was detected (name, namespace, accent, repo…).
- `MIGRATE/INVENTORY.*`, `MIGRATE/MOVE-PREFLIGHT.md` — every file, secrets flagged.
- `MIGRATE/offline/INDEX.html` — every screen, card and deliverable, offline.
- `MIGRATE/claude-ai/` — instructions, tokens, components, starter, brand
  reference, and `knowledge/` (the upload folder).
- `MIGRATE/claude-code/` — agent map, SETUP blocks, compiler + preview tools.
- `MIGRATE/chats/` — unclosed chats, comment dump.
- A copy doc with numbered steps (in `assets/copy/` if the project has one,
  else `MIGRATE/`).

Parts a project doesn't have (no component bundle, no repo, no STATE.md, no
ledger) are reported **not applicable** — never failed.

## Roster (from the founder's screenshots, 2026-11-22)
Design systems: Wishing Stones Design System · Tancook Island Botanicals Design
System · Classical · Sharon's Cookbook Design System.
Projects (not design systems; DS-only parts are skipped): Untitled · Boreal
Codex Business plan · Boreal Codex Customer Personas · Reset:Marketing · The
Boreal Codex wireframes · Boreal Codex snag list · Canadian fantasy artists.
Built-in samples (Modernist, Nocturne, Organic, Broadsheet, Industry) are not
the founder's and are skipped.
Boreal Codex itself keeps its own `laws/migrate.md` (already run 2026-11-22).
Founder checklist for the whole roster: `assets/copy/migrate-roster-v2.html`.

## Dry runs (on Boreal Codex, in scratch folders, deleted after)
- v1: every script ran and every gate passed. G4 found the Google Fonts
  `@import` bug (unstyled starter) — fixed.
- v2: every gate passed, including G6 (50 files listed = 50 in the map),
  49/49 knowledge copies identical to their sources (after the Blob-stamp
  fix), the 41 re-run guard, and reuse of the recorded cleared list. Phase 3
  (offline copies) was proven live in the Boreal sweep the same day.
