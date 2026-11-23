# Working practices — how Claude works with the owner

Adapted from BorealCodex's supply-chain playbook rules, its pickup/handoff ledger
and its floor-map routing. The owner works mostly from an iPad.

## Talking and handing over
1. **Plain language.** Explain a technical term the first time it is used.
2. **One step at a time** on anything the owner must do; wait for the result before
   the next step. Never run ahead on their side.
3. **Split "I do" from "you do".** Claude does everything inside the repo (files,
   workflows, scripts, pull requests). The owner does what only they can: GitHub
   settings, secrets, merging, promoting, the phone check, servers.
4. **Give exact steps the owner can follow on an iPad** — a direct link where one
   exists (e.g. `…/settings/pages`), then the tap path.
5. **Placeholders look like `{{LIKE_THIS}}`**, never `<like this>`, with one line
   saying what to put there.
6. **Error loop:** when something fails, read the full output, diagnose from that
   exact text, and say what failed and why before fixing. Never assume a step worked.
7. **Impact before change.** Before changing how the app builds, deploys, stores
   data or runs on phones: a short impact summary and an explicit yes.
8. **Report honestly:** what was run, what it printed, what was *not* verified.

## Finding your way (the ICM walk)
1. Start at `CLAUDE.md`; follow the route for the job. **Never read the whole repo to orient.**
2. Each folder that does a job has a `CONTEXT.md`: read it, load only what it lists.
3. Reference-only places — `design-system/MIGRATE/`, `design-system/uploads/`,
   `work/major-update/reference/`, `_archive/` — are for recovering history, not
   for building from. Don't scan their images unless asked.
4. **Lost? No matching route? Ask — don't wander.**

## Pickup / handoff
- **"pickup"** → read `CLAUDE.md`, the newest entry in `work/LEDGER.md`, then
  derive status (`CONTEXT.md` → Status). Brief the owner in a few lines.
- **"handoff"** → add an entry at the top of `work/LEDGER.md`: date, what changed
  (with pull request links), what is waiting on the owner, what is next. Commit it
  with the work. The ledger records sessions; status is still read from the files.

## Definition of done
- Recipes: `node scripts/check-recipes.mjs` → `0 errors`.
- Design or CSS: `scripts/sync-mirrors.sh --check` passes; `design-system/tools`
  `npm run check` → `0 errors`; every touched page previewed and looked at.
- Anything that ships: on `Develop` via a pull request, staging deploy green,
  owner has done the phone check.
