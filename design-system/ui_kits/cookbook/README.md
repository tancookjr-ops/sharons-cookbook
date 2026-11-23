# Cookbook — UI kit

An interactive, click-through recreation of **Sharon's Cookbook**, the offline-first recipe/planner/pantry/garden PWA. Built entirely from this design system's CSS classes (`styles.css`) so it stays pixel-faithful to the product.

## Run it

Open `index.html`. It boots on the **Dashboard**; use the sidebar to move between the nine sections. Everything is fake but wired:

- **Theme toggle** (top-right sun/moon) flips light ↔ dark; Settings also offers Light / Dark / Auto.
- **Recipes** — live search + quick-filter; click any card to open its **detail** (favourite toggle, ± servings scaling that recomputes amounts, pantry ✓ checks, action toolbar with toasts).
- **Meal planner** — Day / Week / Month segmented views; week grid with batch/leftover flags and today highlighted.
- **Pantry** — location segments, low-stock + expiry alerts, grouped tables.
- **Household shopping** ↔ **Tancook Botanicals** — two *separate* lists (a hard product rule); check items off.
- **Garden** — plant cards + a seasonal calendar.
- **AI import** — paste JSON → preview a change plan → apply.
- **Settings** — appearance, measurements, backup, danger zone.

## Files

| File | Contents |
|---|---|
| `index.html` | Shell: links `styles.css`, React + Babel, mounts the app |
| `data.js` | Seed content (the product's real starter recipes, pantry, garden, shopping, plans) → `window.CookbookData` |
| `screens-main.jsx` | Helpers + Dashboard, Recipe list, Recipe detail |
| `screens-more.jsx` | Planner, Pantry, Shopping, Garden, AI import, Settings |
| `app.jsx` | Topbar + sidebar + router + theme/toast state |

## Notes

- Screens use the real class names (`.recipe-card`, `.plan-entry`, `.pantry-table`, …). The design system's React components (`Button`, `Chip`, `RecipeCard`, …) wrap these same classes — either can be used in production.
- The herb-leaf brand mark is the app's own SVG, reproduced verbatim.
- This is a visual + interaction recreation, not the production app: data is in-memory, there is no IndexedDB, service worker, or real import validation.
