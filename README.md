# Sharon's Cookbook (myCookbook)

Offline-first recipe book, meal planner, pantry, shopping lists and garden —
an installable phone app (PWA). Live at
`https://tancookjr-ops.github.io/sharons-cookbook/` (staging at `/staging/`).

- **Working in this repo (people and Claude):** start at `CLAUDE.md`.
- **How releases work** (Develop → staging → phone check → Production, GitHub Pages / FTP):
  `_shared/release-process.md`.
- **Adding a recipe:** `work/recipes/01_draft/CONTEXT.md`.

---

## Install on the phone (Sharon, ~1 minute)

### iPhone / iPad (Safari)
1. Open the URL in **Safari**.
2. Tap **Share** (square with arrow) → **Add to Home Screen** → **Add**.
3. Launch from the new home-screen icon. It opens full-screen,
   works offline, and keeps her data on the device.

### Android (Chrome)
1. Open the URL in **Chrome**.
2. Tap **⋮ → Add to Home screen** (or the "Install app" prompt) → **Install**.

Install once. Never reinstall for updates.

---

## Shipping an update

See `work/release/` — merge into `Develop`, check staging on the phone, then run
**Promote staging → production** in GitHub Actions. Bump `VERSION` in `sw.js`
so installed phones see "Update ready — tap to reload".

---

## Data & troubleshooting

- **Where's the data?** On the device (browser localStorage), saved
  automatically a moment after every change. Updates never touch it.
- **Backup:** Import → Backup saves the whole account as a JSON file and
  restores it (a restore replaces all of that account's data).
- **Factory reset:** Settings → Danger zone → *Erase all data* (asks to
  confirm, then reloads with the starter content).
- **Update banner never appears:** confirm you bumped `VERSION` in
  `sw.js`; the check runs when the app launches with a connection.
- **Page is blank after a bad deploy:** fix the file, bump `VERSION`,
  push again; if a phone is stuck, remove the icon, clear the site from
  browser settings, and re-add — data survives unless the site data is
  cleared explicitly.
- **Custom domain later:** Settings → Pages → Custom domain; nothing in
  the app needs to change.

## Files

| file | role |
|---|---|
| `index.html` | app shell, PWA meta, service-worker registration |
| `manifest.webmanifest` | name, icons, standalone display |
| `sw.js` | offline cache + update delivery — **bump `VERSION` here per release** |
| `app.jsx`, `screens-*.jsx` | application code (React) |
| `units.js` | measurement engine (metric/imperial, volume/weight, specific gravity) |
| `data.js`, `recipes/` | starter content |
| `styles.css` + `tokens/`, `base/components/patterns.css` | design system |
| `icons/` | home-screen icons |

Dev track (other update strategies considered): see `design-system/ui_kits/cookbook/DEV-TRACK.md` in the
design-system project.
