# Rules — the laws of this repo

Installed by repo-onboard (adapted from BorealCodex's agent files). Each law says
where it is **enforced**; a law with no enforcement says so. One home per fact:
other files link here, they don't restate.

## 1. Real saved data is the production database
[[site.data_description]]
1. **Never rename or reuse a storage/cache key** (prefixes: [[@prefix_list]]).
   Renaming one silently empties the app for everyone who uses it.
2. **Changing the saved data's shape needs a migration**, in code, that reads the old
   shape and keeps every field. Test it on staging with a backup restored first.
3. New storage or cache keys start with one of the prefixes above, so the staging
   sandbox renames them. *Enforced:* `scripts/package-site.sh` fails staging if an original key survives.
4. Never ship a change that can erase data without the app asking first.

## 2. One source of truth — no second tree
1. **The live files are the source.** Copies kept elsewhere: [[@mirror_list]].
   Edit the source, then run `scripts/sync-mirrors.sh`.
   *Enforced:* the staging deploy runs `sync-mirrors.sh --check` and stops on drift.
2. Each kind of content has one format and one checker (`scripts/check-*`).
   *Enforced:* every `scripts/check-*` runs in the staging deploy.
3. Design values (colour, type, spacing, radius) live in the token files; new code
   uses them instead of hard-coded values. *Not enforced.*
4. Facts live in one file; everywhere else links to it.

## 3. Content
[[@content_rules]]

## 4. Branches, pull requests, commits
1. **`[[branches.staging]]`** is where all work lands (= staging).
   **`[[branches.production]]`** is promote-only: never commit to it, never open a pull
   request into it, never push to it — only the Promote workflow moves it.
2. Work on a branch named **`[[branches.work_prefix]]<topic>`**; **one concern per branch**;
   open a pull request into `[[branches.staging]]`.
3. **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` + a plain-English line.
4. **One change at a time to production.** Promote, check it, then the next.

## 5. Guarded floors 🔒
Touch these **only when the task explicitly says so**, show the owner an impact
summary first, and get a yes.
- `.github/` — workflows and Dependabot (`.github/CONTEXT.md`)
- `scripts/` — packaging, staging sandbox, checks (`scripts/CONTEXT.md`)
[[@guarded_extra]]

## 6. Supply chain
1. **GitHub Actions are pinned to a full commit SHA** (version as a comment), never a tag.
   Workflows run with `contents: read` unless a job needs more, and then only that job.
2. **Dependabot** proposes updates with a **7-day cooldown**; nothing auto-merges.
3. **npm installs use `npm ci --ignore-scripts`** from a committed lockfile. Never
   `npx --yes`, never `npm audit fix --force` without reading its plan.
4. **Third-party scripts**: exact version + `integrity` hash + `crossorigin`. No new
   CDN, web service or relay without the owner's yes.
5. **Prefer plain HTML/CSS/JS over a new dependency.**

## 7. Secrets
See `_shared/secrets.md`. No secret ever goes in this repo, a file, a prompt or a chat.

## 8. Deploys
1. A failed deploy never takes the site down — Pages keeps the last good publish. Fix forward.
2. Installed copies only update when the service-worker version changes — bump it to ship.
3. Staging is checked by the owner before every promote. No exceptions.
