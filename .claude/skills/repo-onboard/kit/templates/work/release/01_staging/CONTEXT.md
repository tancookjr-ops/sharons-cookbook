# 01_staging — get [[branches.staging]] onto staging and check it

One job: make sure what's on `[[branches.staging]]` is on staging, ready for the owner's check.

## Inputs
- Working (this run): the merged change (`git log origin/[[branches.production]]..origin/[[branches.staging]]`)
- Reference (every run): `../../../_shared/release-process.md`

Do NOT load: drafts in other pipelines, mirrored copies, reference folders.

## Process
1. If this release should reach installed copies, bump the version in `[[site.sw_file]]`.
2. A push to `[[branches.staging]]` runs **Deploy to Staging** (or run it by hand in Actions).
3. Confirm the run is green; its summary lists the staging commit and whether FTP ran.

## Outputs
- staging updated at `[[pages.url]]staging/` (and the FTP staging folder once configured)

## Human check — staging check
The owner opens staging on **[[environment.device]]** and looks at exactly what changed.
Staging starts with empty saved data — that is the sandbox, not a bug.
