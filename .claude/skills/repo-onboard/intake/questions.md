# Intake — question rounds and how answers map to answers.json

Ask with AskUserQuestion: one round per call, ≤4 questions, 2–4 options each, the
recommended option first and labelled "(Recommended)". Free text ("Other") is always
available. Prefill defaults from `inventory.py` facts; skip a question whose answer the
inventory already settles beyond doubt, and say so in the proposal instead.

## Round A — where and how (always first)
| Question | Options | → answers |
|---|---|---|
| Which device will you use to follow along and do the GitHub steps? | iPad/phone (Safari) · Laptop/desktop | `environment.device` (free text kept as written) |
| How much should run without asking you? | **Full: I open, merge and watch the staging deploy, and fix failures (Recommended)** · Open pull requests, you merge · Prepare locally, don't push | `automation.auto_merge`, `automation.watch_deploy` |
| What should the patch install? (multi-select) | ICM workspace + rules · Deploy workflows (Pages + FTP) · Design-tool backup import · Supply-chain guards (Dependabot, pins, lockfiles) | which phases/templates run |
| Have you set Settings → Pages → Source to "GitHub Actions" for this repo? (link it) | Done · Not yet (show me) · Not using GitHub Pages | `hosting.pages_switched` |

## Round B — branches and hosting
| Question | Options | → answers |
|---|---|---|
| Which branch is staging (where all work lands)? | `<inventory guess>` (Recommended) · other branches · Create `Develop` | `branches.staging` |
| Which branch is production (promote-only)? | `<inventory guess>` (Recommended) · others · Create `Production` | `branches.production` |
| Where is the live site hosted? | **GitHub Pages now, FTP later (Recommended)** · FTP now (I'll add the secrets) · GitHub Pages only | `hosting.ftp` = later / now / never |
| Work-branch prefix for Claude? | `claude/` (Recommended) · other | `branches.work_prefix` |

## Round C — the work (ICM: surface the structure, don't impose it)
| Question | Options | → answers |
|---|---|---|
| What do you do here most often? | 2–3 guesses from README/inventory · Other | `jobs[0]` (name, slug) |
| Walk me through it: where do you stop and check before going on? | guesses (e.g. "content is accurate", "looks right on my phone") · Other | each stop = a stage boundary + `check` |
| Rules every piece of content must follow? (multi-select) | guesses from content (e.g. dietary, tone) · spelling variant (Canadian/US/UK) · none | `project.content_rules`, `project.language_rule` |
| Any brand rules (fonts, colours, voice) that must never change? | None yet (Recommended if unsure) · I'll describe them | `project.brand_rules` |
Ask a follow-up round only for jobs 2–3 if the owner listed more than one.

## Round D — data, duplicates, uploads (from the inventory)
| Question | Options | → answers |
|---|---|---|
| The app saves data under keys starting `<prefixes>`. Sandbox these on staging? | **Yes (Recommended)** · Different prefixes · App saves nothing | `site.sandbox_replace` (`old=cbstaging-…`), `site.sandbox_guard_file` |
| `<dir>/` holds N files identical to the live ones. What is it? (one question per folder, max 4) | **Mirror — keep in sync (Recommended)** · Archive (old) · Delete (genuine duplicate) | `mirrors` / `archive` / deletion list |
| Do you have a design-tool backup zip to import? | Yes — upload as a GitHub Release (any size, works on iPad) · It's already in the repo · No | `design_backup.source` |
| Anything else that must be published with production (e.g. a standalone kit)? | none · paths from inventory | `site.extra_paths` |

## Round E — approval (Phase 3)
Show the proposal first, then: **Approve and run everything (Recommended)** · Change something.

## Derived without asking
`project.repo`, `project.name`/`summary` (README; confirm in the proposal), `site.app_paths`
(root files the app shell loads + their folders), `site.sw_file`, `site.manifest_file`,
`dependabot_npm_dirs` (folders with package.json), `where_extra`, `guarded_extra`
(service-worker version if present), `kept` (from mirror answers).
