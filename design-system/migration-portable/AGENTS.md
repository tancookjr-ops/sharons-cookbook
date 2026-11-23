# migration-portable/ — the off-ramp kit for ANY project

Brand-neutral copy of Boreal Codex's migration sweep. Other projects copy this
folder in and run `LAW.md`. Start at `README.md`.

- `LAW.md` — the procedure (phases, gates, tool calls).
- `scripts/*.js.txt` — the derivations, run through the loader in `LAW.md`.
- `kit/` — templates with `{{PLACEHOLDERS}}` and `<!--if:flag-->` blocks,
  filled per project by `scripts/20-fill-kit.js.txt`.

Rules:
- **Every script and tool stays `.txt`.** A `.js`/`.mjs` anywhere outside
  `templates/` and `uploads/` is compiled into the design-system bundle, and
  `.mjs` breaks it (measured 2026-11-22). Never rename them in any project.
- Edit the kit HERE (Boreal Codex project), never inside a copy. After any
  edit, rebuild `dist/` (snippet in `dist/BUILD.md`): projects get the kit
  as the one attachable file `dist/migration-kit-v<N>.txt`, and projects on
  an older version get `dist/migration-patch-v<N>.txt`.
- `dist/` is output: never hand-edit it, and it is never inside the bundle.
- No Boreal-specific value may appear in `kit/` or `scripts/` — everything is
  detected into `MIGRATE/PROFILE.json` by `scripts/00-profile.js.txt`.
