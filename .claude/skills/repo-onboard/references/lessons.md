# Lessons — why each step of repo-onboard exists

From onboarding `tancookjr-ops/sharons-cookbook` (2026-11-23): what the first, by-hand
run cost, and what the patch does instead.

| # | What happened by hand | Cost | The patch does |
|---|---|---|---|
| 1 | Setup commands assumed a laptop; owner was on an iPad in a cloud session | ~4 round trips, a dead end (Remote Control needs a Mac/PC) | Round A asks device/session first; every owner step is written for that device |
| 2 | Upload tried the web uploader (25 MB limit) before a Release (2 GB) | 2 round trips | Uploads always go through a Release asset; public repos are downloaded directly |
| 3 | Design tools fixed by trial: build.mjs syntax error, browser path, check errors from old snapshots and Babel pages, screenshots in the wrong .gitignore | ~6 tool runs | `import-design-backup.sh` applies every known fix only when its symptom is present |
| 4 | Questions asked across many turns (scope, jobs, checkpoints, branches, duplicates, rules) | many round trips | One intake (rounds A–D) prefilled from the inventory, then one approval |
| 5 | Workspace built first, BorealCodex rules adopted later → CLAUDE.md, contracts and scripts rewritten | rework, an extra PR | Rules, practices and structure rendered together from one answers file |
| 6 | Packaging tested on the working tree only; the live Production branch still had misnamed icons → first deploy failed and blocked staging | a failed deploy + fix PR | `verify.sh` packages the live production branch too; production warns, staging fails |
| 7 | Pages actions used tags, pinned to SHAs later; tools lockfile was git-ignored | rework | Templates ship SHA-pinned; lockfiles un-ignored and committed at import |
| 8 | Duplicates found in the first inventory, but the mirror sync and its gate were added last | late rework | Inventory reports mirror candidates; Round D decides; `mirrors.conf` + gate installed with everything else |
| 9 | Three pull requests, each merged by hand, deploy checked by asking the owner | 3 manual merges, waiting | One PR; auto-merge (if allowed) → watch the run → read logs → fix loop |
| 10 | actionlint install blocked by the session's safety check | none, but unverified | Not attempted; `verify.sh` checks YAML parse + SHA pins instead and says so |
| 11 | Recipes added to code don't reach phones with saved data (found late) | owner surprise | Rule §1 + the proposal call out "saved data wins" for any app with local storage |

The order that would have been fastest — and is the patch's order:
**device → inventory → one intake → one approval → apply everything → verify against real
branches → one PR → merge → watch → fix → hand over.** The only owner actions left are
the ones GitHub cannot delegate: the Pages source switch, Dependabot, secrets, the staging
check and Promote.
