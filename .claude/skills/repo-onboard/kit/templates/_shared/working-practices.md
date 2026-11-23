# Working practices — how Claude works with the owner

Installed by repo-onboard. The owner works mostly from: **[[environment.device]]**.

## Talking and handing over
1. **Plain language.** Explain a technical term the first time it is used.
2. **One step at a time** on anything the owner must do; wait for the result.
3. **Split "I do" from "you do".** Claude does everything inside the repo (files,
   workflows, scripts, pull requests[[@merge_clause]]). The owner does what only they can:
   GitHub settings, secrets, promoting, the staging check, servers.
4. **Exact steps for the owner's device** — a direct link where one exists
   (e.g. `https://github.com/[[project.repo]]/settings/pages`), then the tap path.
5. **Placeholders look like `{{LIKE_THIS}}`**, never `<like this>`, with one line on what goes there.
6. **Error loop:** read the full failure output, diagnose from that exact text, say what
   failed and why, then fix. Never assume a step worked.
7. **Impact before change.** Before changing how the app builds, deploys, stores data or
   runs on devices: a short impact summary and an explicit yes.
8. **Report honestly:** what was run, what it printed, what was *not* verified.

## Finding your way (the ICM walk)
1. Start at `CLAUDE.md`; follow the route for the job. **Never read the whole repo to orient.**
2. Each folder that does a job has a `CONTEXT.md`: read it, load only what it lists.
3. Reference-only places (`_archive/`, anything marked reference) are for history, not building.
4. **Lost? No matching route? Ask — don't wander.**

## Pickup / handoff
- **"pickup"** → read `CLAUDE.md`, the newest entry in `work/LEDGER.md`, then derive status
  (`CONTEXT.md` → Status). Brief the owner in a few lines.
- **"handoff"** → add an entry at the top of `work/LEDGER.md`: date, what changed (with pull
  request links), what waits on the owner, what is next. Commit it with the work.

## Definition of done
- Every `scripts/check-*` passes; `scripts/sync-mirrors.sh --check` passes.
- Anything that ships: on `[[branches.staging]]` via a pull request, staging deploy green,
  owner has checked staging.
