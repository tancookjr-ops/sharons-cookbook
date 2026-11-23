# Secrets — a pointer, never a folder

Installed by repo-onboard (adapted from BorealCodex `SECRETS.md`). There is
intentionally **no `secrets/` folder in this repo, and there must never be one.**

## Where secrets live
| Secret | Lives in | Used by |
|---|---|---|
| `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_PRODUCTION_DIR`, `FTP_STAGING_DIR` (+ optional `FTP_PROTOCOL`, `FTP_PORT`) | GitHub → Settings → Secrets and variables → Actions (`https://github.com/[[project.repo]]/settings/secrets/actions`) | `.github/workflows/ftp.yml` |

`GITHUB_TOKEN` is issued per run by GitHub; nothing to store.

## Laws
- **Never write a secret** into a file, commit, issue, pull request, prompt or chat.
  To give Claude a key, use the environment's secure credential form, never a message.
- The owner enters secret **values** in GitHub settings; Claude only names them.
- Personal details (names, emails) are not secrets but may be **public** — add no more
  of them to code or docs than the project needs.

## Rotating
| Secret | How | Side effects |
|---|---|---|
| `FTP_PASSWORD` (or user/host) | change it on the server, then update the GitHub secret | none — a deploy in between fails harmlessly (Pages keeps serving) |

If a secret may have leaked: rotate it first, then check the Actions run history.
