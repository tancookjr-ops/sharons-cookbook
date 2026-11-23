# START HERE — Sharon's Cookbook Design System migration package

You are an AI (or a human) opening a backup of **Sharon's Cookbook Design System**. It was built in a
design tool that closed on 2026-12-14. That tool had two things you do NOT
have: a **live preview** of project files and an **automatic design-system
compiler**. This package replaces both. Read this whole file before touching
anything.

## 0. Non-negotiables
1. **Do not "clean up", rename, reformat or delete anything** in this
   package. The history in the files is evidence.
2. **The project's own laws still apply.** The root `CLAUDE.md` is the
   original agent map, written for the old tool. Your surface has its own
   instruction file:
   - Claude Code → `MIGRATE/claude-code/CLAUDE.md.txt` (SETUP copies it to the root as `CLAUDE.md`;
     the original becomes `CLAUDE.design-tool.md`).
   - Claude.ai → `MIGRATE/claude-ai/PROJECT-INSTRUCTIONS.md`.
   Anything that names a tool you do not have is translated in § 3.
3. **Never claim you previewed, compiled or checked something you did not.**
   If you cannot render it, say "not rendered".
4. **The owner decides every production release.** Nothing here deploys.
5. **Project invariants** (verbatim from (none found)):

(No invariants section was found in CLAUDE.md or readme.md. Ask the owner for the brand rules before designing anything.)

## 0b. What happened to the original
The original tool closed on 2026-12-14. Anthropic's "Move to Claude" may have turned
the design system into a **design-system artifact** in Claude.ai
(`MIGRATE/claude-ai/MOVED.md` records it if so). That artifact holds the files as
they were at the move. Chats and comments did NOT move: their surviving
record is `MIGRATE/chats/COMMENTS.md`.

Flag disagreements; never silently pick one.

## 1. Where things are
- `MIGRATE/PROFILE.json`: what the migration detected about this project.
- `MIGRATE/INVENTORY.md`: every file, its class and size, and the secret-risk list.
- `MIGRATE/offline/INDEX.html`: every screen, card and deliverable as one
  self-contained HTML file. Double-click, works offline.
- `MIGRATE/chats/`: how to recover chat history, which chats still need closing.

## 2. Orientation order (every session)
1. This file. 2. Your surface's instruction file (§ 0.2).
3. the routing table in the root agent map, if one exists.
4. ONLY the files those point at. Never read the whole tree to orient.

## 3. Translation table: old tool → you
| Old instruction says | You do |
|---|---|
| `check_design_system` | Claude Code: `npm run check`. Claude.ai: not available, state "unchecked". |
| "the compiler regenerates `_ds_bundle.js`" | Claude Code: `npm run build -- --replace` after any component change. Claude.ai: never edit components; propose a patch. |
| `show_html` / screenshot / verifier | Claude Code: `npm run preview -- <path>`, then READ the PNG and the console report. Claude.ai: one self-contained HTML artifact (`ARTIFACT-RULES.md`). |
| Design System tab / `@dsCard` | `gallery.html` (written by `npm run check`) · Claude.ai: `brand-reference.html` |
| `dc_write` / `.dc.html` | Edit the `.dc.html` as text; its `support.js` sits beside it. Inline styles only. |
| `present_fs_item_for_download` | Claude Code: give the file path. Claude.ai: an artifact or a fenced block. |
| `run_script` | Claude Code: a `node` script. Claude.ai: not available. |
| GitHub tools | Claude Code: `git` / `gh`. Claude.ai: the GitHub integration (read only). |
| `ask_user` form | Ask in chat: one numbered list, a default for every item, a free-text line. |

## 4. Verification standard (replaces the old background verifier)
A change is "ready" ONLY when:
1. Claude Code: `npm run check` prints `0 errors`. Claude.ai: say "unchecked".
2. Every touched HTML file was previewed (`npm run preview -- <file>`), the
   PNG looked at, console errors 0.
3. If components changed: `npm run build -- --replace`, then
   `npm run preview -- --cards` shows no regressions.
4. You report exactly what you ran and what it printed.
