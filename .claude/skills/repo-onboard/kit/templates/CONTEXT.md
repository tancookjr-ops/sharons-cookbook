# [[project.name]] — the jobs and the checkpoints

The jobs, most frequent first. All of them end in the same release line.

| Job | Stages | Ends in |
|---|---|---|
| [[@jobs_rows]]
| Release | `work/release/01_staging` → `02_production` | live site |

## The checkpoints (human gates)

| # | Where | The owner does |
|---|---|---|
| [[@check_rows]]

## Hosting

GitHub Pages hosts production (`[[pages.url]]`) and a sandboxed staging
(`[[pages.url]]staging/`)[[@ftp_sentence]]. Details: `_shared/release-process.md`.

## Status — derive it, don't store it

- Work waiting at a checkpoint: files in each stage's `output/`.
- On staging but not live: `git log origin/[[branches.production]]..origin/[[branches.staging]]`.
- Released versions: files in `work/release/02_production/output/`.
