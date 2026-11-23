# Rules — the laws of this repo

Adapted from BorealCodex's agent files (`AGENTS.md`, `.github/claude-repo-brief.md`,
floor maps, `SECRETS.md`, `docs/SECURITY-RUNBOOK.md`) for a static, offline-first
phone app. Each law says where it is **enforced**; a law with no enforcement says
so. One home per fact: other files link here, they don't restate.

## 1. Sharon's data is the production database
The app keeps everything on the phone (localStorage). There is no server copy.
1. **Never rename or reuse a storage key** (`mycookbook-users`, `mycookbook-session`,
   `mycookbook-data:<email>`, legacy `sharons-cookbook-v1`). Renaming one silently
   empties the app for that person.
2. **Changing the saved data's shape needs a migration**, in code, that reads the old
   shape and keeps every field. Test it on staging with a backup restored first.
3. New storage or cache keys start with `mycookbook-`, so the staging sandbox
   renames them. *Enforced:* `scripts/package-site.sh` fails staging if an original key survives.
4. Never ship a change that can erase data without the app asking first.

## 2. One source of truth — no second tree
BorealCodex's biggest lesson: two copies of the design drifted until they disagreed.
1. **The root app files are the source.** `design-system/` holds copies of the CSS,
   tokens, app code and recipes (`design-system/`, `deploy/`, `ui_kits/cookbook/`).
   Edit the root file, then run `scripts/sync-mirrors.sh`.
   *Enforced:* the staging deploy runs `sync-mirrors.sh --check` and stops on drift.
2. **Recipe structure** has one definition: `recipes/build.js` (summarised in
   `_shared/recipe-structure.md`). Never add a second recipe format or builder.
   *Enforced:* `scripts/check-recipes.mjs` in the staging deploy.
3. **Colours, type, spacing, radius live in `tokens/*.css`.** New code uses
   `var(--token)`; never hardcode a hex in a component. *Not enforced.* Existing
   exceptions: `index.html` theme-color meta (must be a literal) and update-banner
   colours; a fallback inside `var(--warn, #b98424)` in `screens-more.jsx`.
4. Facts live in one file; everywhere else links to it.

## 3. Content
1. **Every recipe is vegan.** No meat, fish, animal dairy, eggs or honey.
   *Enforced:* `R()` adds the tag; `scripts/check-recipes.mjs` warns on animal-product words.
2. **Canadian spelling** in everything people read: colour, flavour, fibre,
   favourite, centre, litre. The app is `en-CA`. *Not enforced.*
3. Imported recipes keep ingredients and steps **word-for-word**; only the
   description is rewritten.
4. Brand rules: **none set yet** (owner, 2026-11-23). Propose one before relying on it.

## 4. Branches, pull requests, commits
1. **`Develop`** is where all work lands (default branch = staging).
   **`Production`** is promote-only: never commit to it, never open a pull request
   into it, never push to it — only the Promote workflow moves it.
2. Work on a branch named **`claude/<topic>`** (Claude) or any name (owner);
   **one concern per branch**; open a pull request into `Develop`.
3. **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` + a
   plain-English line. Recipes: `feat(recipes): add <title>`.
4. **One change at a time to production.** Promote, look at it on the phone, then the next.

## 5. Guarded floors 🔒
Changing these can break deploys or weaken security. Touch them **only when the
task explicitly says so**, show the owner an impact summary first, and get a yes.
- `.github/` — workflows and Dependabot (`.github/CONTEXT.md`)
- `scripts/` — packaging, staging sandbox, checks (`scripts/CONTEXT.md`)
- `sw.js` `VERSION` and cache names — they control every installed phone

## 6. Supply chain
1. **GitHub Actions are pinned to a full commit SHA** (with the version as a
   comment), never a tag. Workflows run with `contents: read` unless a job needs
   more, and then only that job gets it.
2. **Dependabot** proposes updates with a **7-day cooldown**; nothing auto-merges.
3. **The design-system tools install with `npm ci --ignore-scripts`** from the
   committed `design-system/tools/package-lock.json`. Never `npm install` without a
   reason, never `npx --yes`, never `npm audit fix --force` without reading its plan.
4. **Third-party scripts in the app**: exact version + `integrity` hash +
   `crossorigin`. No new CDN, web service or relay without the owner's yes.
   *Known exceptions:* pdf.js and tesseract.js (`import-parse.js`, `import-web.js`)
   are version-pinned but have no `integrity`; the web importer sends recipe URLs
   through public relays (allorigins, codetabs, corsproxy.io, r.jina.ai) and
   noembed. Google Fonts loads from `tokens/fonts.css`.
5. **Prefer plain HTML/CSS/JS over a new dependency.** The app has no build step;
   keep it that way unless the owner decides otherwise.

## 7. Secrets
See `_shared/secrets.md`. Short form: no secret ever goes in this repo, a file,
a prompt or a chat.

## 8. Deploys
1. A failed deploy never takes the site down — Pages keeps serving the last good
   publish. Fix forward on `Develop`.
2. Phones only update when `sw.js` `VERSION` changes — bump it for any release
   that should reach installed phones.
3. Staging is checked on the phone before every promote (CHECK 2). No exceptions.
