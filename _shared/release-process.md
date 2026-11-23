# Release process — branches, hosting, automation

Adapted from BorealCodex's deploy workflows for a static app (no server build).

## Branches

| Branch | Role | Who writes to it |
|---|---|---|
| `Develop` | default branch; every change starts here; = staging | you / Claude (via pull request) |
| `Production` | the live app | only the **Promote** workflow |

## Workflows (`.github/workflows/`)

| Workflow | Runs | Does |
|---|---|---|
| Deploy to Staging (`deploy-staging.yml`) | every push to `Develop`, or by hand | recipe check (`scripts/check-recipes.mjs`), then FTP staging folder (if configured) + GitHub Pages `/staging/` |
| Promote staging → production (`promote.yml`) | by hand only — this is CHECK 3 | fast-forwards `Production` to `Develop`, then FTP production + Pages |
| Deploy production (emergency) (`deploy.yml`) | by hand only | re-deploys current `Production` without promoting |
| Publish to GitHub Pages (`pages.yml`) | called by the three above | builds one Pages site from both branches |
| Upload to FTP server (`ftp.yml`) | called by the three above | skips cleanly until FTP secrets exist |

Promote refuses to run if `Production` has commits `Develop` lacks — merge
`Production` into `Develop` first. Production never silently loses a commit.

## Hosting

| Address (GitHub Pages) | What |
|---|---|
| `https://tancookjr-ops.github.io/sharons-cookbook/` | production |
| `https://tancookjr-ops.github.io/sharons-cookbook/staging/` | staging (Develop) |
| `https://tancookjr-ops.github.io/sharons-cookbook/design-system/ui_kits/cookbook/` | offline standalone UI kit (+ `parser-test.html`) |

**Staging is sandboxed.** It shares a web address with production, so
`scripts/package-site.sh` renames every storage and cache key in the staging copy
(`mycookbook-` → `cbstaging-`). Staging starts empty and can never read or change
Sharon's real data. It installs as "myCookbook STAGING". If you ever add a storage
key, start it with `mycookbook-` so the sandbox catches it — the build fails if an
original key survives.

The UI kit is the same app code without the offline worker, so on the same
address it **shares production's saved data** (that is how the app can open it).

## One-time setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   (It is "Deploy from a branch: Production" today; the workflows replace that.)
2. If a Pages run fails with "branch is not allowed to deploy": Settings →
   Environments → `github-pages` → add `Develop` to the allowed branches.
3. Later, FTP: Settings → Secrets and variables → Actions → add
   `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_PRODUCTION_DIR`, `FTP_STAGING_DIR`
   (optional `FTP_PROTOCOL` = ftps · sftp · ftp, default ftps; optional `FTP_PORT`).
   No other change is needed — the next deploy uploads. Uploads never delete
   files already on the server.

## Shipping an update to installed phones

Phones only notice a new version when `VERSION` in `sw.js` changes
(e.g. `v1.2.8` → `v1.2.9`). Bump it in the release's staging step; phones then
show "Update ready — tap to reload".
