# Sharon's Cookbook — hosted app (GitHub Pages)

Offline-first recipe book, meal planner, pantry and shopping lists.
This folder is the complete, deploy-ready web app. Push it to GitHub,
turn on Pages, install once on the phone — every future `git push`
updates all installed copies automatically.

---

## 1 · One-time setup (you, ~10 minutes)

### Create the repo
1. Sign in at github.com → **New repository**.
2. Name it (e.g. `sharons-cookbook`), set **Public**
   (private works too but Pages on private repos needs a paid plan).
3. Don't add any starter files. Create the repository.

### Push this folder
With git installed, from inside this `deploy/` folder:

```bash
git init
git add .
git commit -m "Sharon's Cookbook v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sharons-cookbook.git
git push -u origin main
```

(No git? On the repo page choose **uploading an existing file** and drag
this folder's entire contents in, keeping the folder structure.)

### Turn on GitHub Pages
1. Repo → **Settings → Pages**.
2. Under *Build and deployment*: Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)** → Save.
3. Wait ~1 minute. Your app is live at:
   `https://tancookjr-ops.github.io/sharons-cookbook/`

Open that URL in a browser and confirm it loads.

---

## 2 · Install on the phone (Sharon, ~1 minute)

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

## 3 · Shipping an update (you, ~1 minute)

1. Edit the app files in this folder.
2. **Bump the version** — open `sw.js` and change the first line:
   `const VERSION = 'v1.0.0';` → `'v1.0.1'` (any new string works).
   *No bump = phones keep the old cached version.*
3. Commit and push:
   ```bash
   git add . && git commit -m "v1.0.1 — what changed" && git push
   ```
4. Next time the app is opened (online), it downloads the new version in
   the background and shows **"Update ready — tap to reload"**. One tap
   and she's current. Her recipes, pantry, plans and settings are
   untouched — they live in the phone's local storage, not in the app.

---

## 4 · Data & troubleshooting

- **Where's the data?** On the device (browser localStorage), saved
  automatically a moment after every change. Updates never touch it.
- **Backup:** Settings → Backup (export/import flows are stubs for now —
  a good next milestone).
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

Dev track (other update strategies considered): see `DEV-TRACK.md` in the
design-system project.
