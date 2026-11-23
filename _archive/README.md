# _archive — what is old, duplicated or superseded

Nothing is moved here silently. Each entry says what it was, why it is retired,
and where the original can still be found.

| Was | Status | Where it still lives |
|---|---|---|
| `design-system/upload-v1.2.3` … `upload-v1.2.8` | **removed** (owner, 2026-11-23): partial snapshots of old app versions, genuine duplicates | the design-system backup zip, release `design-system-backup` on GitHub; git history |
| root `README.md` first-time setup guide (push "from this `deploy/` folder", Pages from `main`) | **replaced**: out of date — Pages now publishes via Actions from `Production` + `Develop` | git history; current process in `_shared/release-process.md` |
| `icons/icon-192.png`, `icons/App-icon-512.png` | **renamed** to `app-icon-192.png`, `app-icon-512.png` — the manifest and `sw.js` ask for those names, and Pages is case-sensitive, so the live icons were missing | same images, new names |

## Kept on purpose (look like duplicates, aren't)

| Path | Why it stays |
|---|---|
| `design-system/deploy/` | the design tool's deploy package; defines the shape `scripts/package-site.sh` builds; kept identical to the root by `scripts/sync-mirrors.sh` |
| `design-system/ui_kits/cookbook/` | the offline standalone version of the app, published at `/design-system/ui_kits/cookbook/`; code + recipes kept identical by `scripts/sync-mirrors.sh` |
| `design-system/MIGRATE/` | the backup's own migration record — its rule is "do not delete or rename" |
