# 02_production — promote the checked staging build to live

One job: after CHECK 2 passes, make the staging build the live app and record it.

## Inputs
- Working (this run): CHECK 2 passed on the current `Develop` tip
- Reference (every run): `../../../_shared/release-process.md`

Do NOT load: anything else — this step is a button and a note.

## Process
1. GitHub → Actions → **Promote staging → production** → Run workflow (from `Develop`).
2. If it stops with "Production has commits that are not on Develop": merge `Production`
   into `Develop`, let staging redeploy, re-check, then promote again.
3. Write `output/<VERSION>.md`: date, version, commit, one line per change.

## Outputs
- `Production` = `Develop`; live site updated (Pages, plus FTP once configured)
- `output/<VERSION>.md` — the release note (these files are the release history)

## Human check — CHECK 3
Pressing **Run workflow** is the owner's decision and nobody else's. Afterwards, open the
live app on the phone; an installed copy shows "Update ready" if `VERSION` was bumped.
