# 01_staging — get Develop onto staging and look at it on the phone

One job: make sure what's on `Develop` is on staging, ready for the phone check.

## Inputs
- Working (this run): the merged change on `Develop` (`git log origin/Production..origin/Develop`)
- Reference (every run): `../../../_shared/release-process.md`

Do NOT load: recipe drafts, `design-system/` internals, `work/major-update/`.

## Process
1. If this release should reach installed phones, bump `VERSION` in `sw.js` on `Develop`.
2. Pushing to `Develop` runs **Deploy to Staging** automatically (or run it by hand in Actions).
3. Confirm the run is green; the summary lists the staging commit and whether FTP ran or was skipped.

## Outputs
- staging updated at `https://tancookjr-ops.github.io/sharons-cookbook/staging/` (and the FTP staging folder once configured)

## Human check — CHECK 2
The owner opens staging **on the phone** and looks at exactly what changed: the new
recipe's detail page (title, chips, times, ingredients, steps, notes), or the updated
screen. Staging starts with empty data — that is the sandbox, not a bug.
