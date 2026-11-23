# 🔒 .github/ — deploy automation (guarded)

One job: turn a push to `[[branches.staging]]`, or a Promote, into a published site.
Touch only when the task explicitly says so; give the owner an impact summary first.

| File | Does | Human gate |
|---|---|---|
| `workflows/deploy-staging.yml` | push to `[[branches.staging]]` → `scripts/check-*` + mirror check → FTP staging + Pages | staging check after it |
| `workflows/promote.yml` | manual → fast-forward `[[branches.production]]` to `[[branches.staging]]` → deploy | release check = pressing it |
| `workflows/deploy.yml` | manual → re-deploy current `[[branches.production]]` (emergency) | owner presses it |
| `workflows/pages.yml` · `ftp.yml` | reusable: build + publish Pages · upload to FTP | — |
| `dependabot.yml` | weekly update PRs into `[[branches.staging]]`, 7-day cooldown | owner (or auto-merge policy) |

## Inputs
- Reference (every run): `../_shared/rules.md` §5–6, `../_shared/release-process.md`, `../_shared/secrets.md`

Do NOT load: app code, content, mirrored copies.

## Laws here
- Every `uses:` is pinned to a full commit SHA with the version as a comment.
- Workflow-wide `permissions: contents: read`; widen only on the one job that needs it.
- Secrets come from `${{ secrets.* }}` only — never a value in a file.
- `promote.yml` keeps its fast-forward-only safety check.

**Not a CI task?** Return to `../CLAUDE.md`.
