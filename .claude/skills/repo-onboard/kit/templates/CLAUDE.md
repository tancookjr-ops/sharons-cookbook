# [[project.name]]

[[project.summary]]

Built on ICM: folders carry sequencing, hierarchy carries context, files carry state.
If something needs explaining, it goes in that folder's `CONTEXT.md`.
`AGENTS.md` is a pointer to this file — one map for every assistant.

## Where things live

| Path | What it holds |
|---|---|
| [[@where_rows]]
| `work/release/` | pipeline: [[branches.staging]] → staging → owner check → [[branches.production]] |
| `work/LEDGER.md` | session handoffs, newest first |
| `_shared/` | factory: **rules**, working practices, secrets, release process |
| `_templates/` · `_archive/` | blank starters · what is retired and why |
| `.github/` 🔒 · `scripts/` 🔒 | deploy automation and checks — guarded (own `CONTEXT.md`) |

## Route by job

| Job | Go to | Then stop at |
|---|---|---|
| [[@route_rows]]
| release a version | `work/release/02_production/CONTEXT.md` | owner presses Promote |
| deploys, CI, scripts 🔒 | `.github/CONTEXT.md` / `scripts/CONTEXT.md` | owner's yes to the impact summary |
| secrets, server details | `_shared/secrets.md` | owner enters values in GitHub |
| "pickup" / "handoff" | `_shared/working-practices.md` → Pickup / handoff | — |
| asked for status | `CONTEXT.md` → "Status" | report what exists |

## The laws (full text, and how each is enforced: `_shared/rules.md`)

[[@laws]]

How Claude works with the owner: `_shared/working-practices.md`. Lost? Ask — don't wander.
