# Release process — branches, hosting, automation

Installed by repo-onboard (adapted from BorealCodex's deploy workflows, for a static site).

## Branches
| Branch | Role | Who writes to it |
|---|---|---|
| `[[branches.staging]]` | every change starts here; = staging | pull requests |
| `[[branches.production]]` | the live site | only the **Promote** workflow |

## Workflows (`.github/workflows/`)
| Workflow | Runs | Does |
|---|---|---|
| Deploy to Staging | every push to `[[branches.staging]]`, or by hand | every `scripts/check-*` + mirror check, then FTP staging (if configured) + GitHub Pages `/staging/` |
| Promote staging → production | by hand only — the release check | fast-forwards `[[branches.production]]` to `[[branches.staging]]`, then FTP production + Pages |
| Deploy production (emergency) | by hand only | re-deploys current `[[branches.production]]` without promoting |
| Publish to GitHub Pages / Upload to FTP | called by the three above | build + publish one Pages site · FTP upload (skips until secrets exist) |

Promote refuses to run if `[[branches.production]]` has commits `[[branches.staging]]` lacks —
merge it into `[[branches.staging]]` first. Production never silently loses a commit.

## Hosting
| Address | What |
|---|---|
| `[[pages.url]]` | production |
| `[[pages.url]]staging/` | staging — sandboxed: own storage keys, "[[site.staging_label]]" badge |

## One-time owner setup
1. **Pages source → GitHub Actions:** `https://github.com/[[project.repo]]/settings/pages`
   (do this BEFORE the first merge, or the first deploy fails).
2. If a deploy says "branch is not allowed to deploy": `https://github.com/[[project.repo]]/settings/environments`
   → `github-pages` → allow `[[branches.staging]]`.
3. **Dependabot:** `https://github.com/[[project.repo]]/settings/security_analysis` → Dependabot version updates.
4. Later, FTP: add the secrets in `_shared/secrets.md`. No other change needed.

## Shipping to installed devices
Installed copies only notice a new version when the service-worker version
(`[[site.sw_file]]`) changes. Bump it in the staging step of a release.
