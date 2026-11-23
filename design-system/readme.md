# Sharon's Cookbook — Design System

The design language of **Sharon's Cookbook**: an offline-first Progressive Web
App that is at once a personal cookbook, meal planner, pantry inventory, dual
shopping list and garden companion — with a focus on raw-vegan-friendly meal
planning, ingredient shopping, pantry stocktaking and bulk cooking, all
maintainable through a ChatGPT voice assistant.

The palette and voice come from one place: **coastal Nova Scotia meets a
Mediterranean kitchen.** Herbs, sea glass, driftwood, cream linen, a little
terracotta. Warm, calm, practical, and completely at home offline.

This project packages that language as tokens, reusable components, foundation
specimen cards, starting-point templates, and a full interactive recreation of
the product, so new work stays true to it.

## Source of truth

Everything here is grounded in the product's real code — values are copied
verbatim, never guessed:

- **GitHub:** `tancookjr-ops/sharons-cookbook` (branch `Develop`) —
  <https://github.com/tancookjr-ops/sharons-cookbook>
  - `css/app.css` — tokens, base styles, buttons, chips, dialog, toasts
  - `css/layout.css`, `css/forms.css`, and per-feature CSS (recipes, planner,
    pantry, shopping, garden, dashboard)
  - `js/*.js` — the render functions the components mirror (e.g.
    `recipes.js → recipeCardHTML`)
  - `docs/SPEC.md`, `docs/SCHEMA.md` — the product contract and data shapes
  - `data/starter-import.json` — the real starter recipes/pantry/garden used
    throughout this kit
  - `icons/` — the app's PNG launcher icons (the herb-leaf mark)

Explore that repository to build richer, more accurate designs than this
summary alone allows — the CSS and JS are the definitive reference.

---

## CONTENT FUNDAMENTALS

The product speaks like a trusted friend who happens to be an excellent cook:
warm, plain-spoken, confident, never fussy or salesy.

- **Voice:** direct and encouraging. It addresses the cook by name
  ("Good morning, Sharon") and reassures rather than instructs sternly.
  Occasional dry warmth is welcome ("Really — that's it.", "Never boil.").
- **Person:** speaks *to* the user ("your pantry", "in your pantry"); the app
  refers to itself only as "Sharon's Cookbook".
- **Casing:** sentence case everywhere — headings, buttons, nav, labels.
  Never Title Case UI. ("New recipe", "Add to plan", "Meal planner".)
- **Canadian spelling — mandatory** for every user-visible string:
  *colour, favourite, fibre, flavour, standardise*. (The codebase enforces
  this; `--danger` is even named for terracotta, but copy says "colour".)
- **Units:** metric first, with imperial available on display. Temperatures in
  °C, weights in g/kg, volumes in ml/l.
- **Recipe subtitles** are short and evocative, a hair poetic:
  "Autumn in a bowl", "Breakfast that makes itself", "No lettuce, all crunch",
  "The way the coast makes it".
- **Step titles** are terse imperative verbs: *Blitz · Soften · Bloom the
  spices · Simmer · Season and rest.*
- **Body copy** is concrete and unhurried, favouring real cooking detail over
  marketing ("Like most chilis, it is even better the next day.").
- **Empty & helper states** are gentle and specific: "No harvests logged yet.",
  "Your cookbook is empty.", "Two separate lists — they never mix."
- **Emoji:** essentially avoided. The *only* sanctioned use is the season
  glyph in the dashboard greeting (🌱 🌿 🍂 ❄). Everywhere else, monochrome
  Unicode glyphs stand in for icons (see ICONOGRAPHY). Never decorate UI with
  emoji.
- **Health framing** is factual and kind, never alarmist: EoE, blood-sugar and
  anti-inflammatory notes are offered as helpful context ("Smooth texture —
  generally easy for EoE; check tolerance for sesame.").

---

## VISUAL FOUNDATIONS

### Colour
A warm, organic, low-saturation palette built on natural materials.

- **Backgrounds are cream linen** (`--cream #faf6ef`), not white. Surfaces
  (cards, inputs) are true white `--paper`; the second surface is warm
  `--sand #ede5d8` (chips, segmented tracks, trays).
- **Primary is sage** (`--sage #6e8b63`) with a deep variant for links/hover
  (`--sage-deep #4c6644`) and a soft tint (`--sage-soft #e4ebdf`) for chips,
  active states and focus rings.
- **Accent is sea glass** (`--seaglass #63a294`) — a soft coastal teal for
  info, meal-type labels and health-note panels.
- **Terracotta** (`--terracotta #c05f36`) is the single warm accent, reserved
  for danger/destructive and "expired". **Amber** (`--warn #b98a2e`) is low
  stock / "soon" / priority. Each pairs with a soft wash for chips/panels.
- **Text is ink** (`--ink #2c332d`), a near-black green-grey, with a softer
  `--ink-soft #5d675e` for meta.
- **Hairlines** are a warm `--border #ddd4c4`, never pure grey.
- **Dark theme** swaps to deep herb-charcoal surfaces
  (`#1d2521 → #273129 → #303b32`); sage and sea glass *lighten* so they still
  read as accents; text warms to `#e9e5d9`. Set `data-theme="dark"` (or
  `"auto"`) on the root; `--on-primary` flips to dark ink so text on sage
  fills stays legible.

### Typography
Two families, no more.

- **Display:** a warm old-style serif — `Iowan Old Style` (Apple),
  `Palatino Linotype` (Windows), then `Gelasio`/`Georgia`. Used for every
  heading, recipe titles, the brand wordmark, and numbered step markers.
  Weight 600, line-height 1.2, tracking 0.01em.
- **Body:** the platform UI sans (`system-ui`). Line-height 1.55. Labels are
  0.9em/600 in soft ink; eyebrows are uppercase, 0.72em, tracking 0.06em, often
  in the accent colour.
- **Numerals** are tabular (`font-variant-numeric: tabular-nums`) in nutrition,
  times, quantities and tables.
- A single `--font-scale` knob (0.9–1.3 in Settings) multiplies the base size.

### Shape, depth & borders
- **Corner radii:** 12px cards/dialogs/panels (`--radius`), 8px inputs/tiles
  (`--radius-sm`), 999px pills for buttons/chips/segmented controls.
- **Cards** = white surface + 1px warm hairline + `--shadow-card` + 12px
  radius. Meaning is added with a 4px coloured edge: left-sage (today's
  meals), left-terracotta (warnings), left-sea-glass (health), **top**-sage
  (garden cards).
- **Elevation** is two soft, *ink-tinted* shadows (not black): `--shadow-card`
  at rest, `--shadow-pop` when lifted (hover, dialogs, toasts, the open
  sidebar). Recipe cards lift `translateY(-2px)` on hover.
- **Borders** carry a lot of the structure — dashed hairlines separate list
  rows (meals, ingredients, alerts); solid hairlines frame tables and inputs.

### Motion
Restrained and quick. Colour/border transitions ~0.15s; hover lifts ~0.12s;
the mobile sidebar slides ~0.22s ease. Buttons depress `translateY(1px)` on
`:active`. No bounces, no long or looping animations. `prefers-reduced-motion`
is fully honoured (all animation/transition disabled).

### States
- **Hover:** buttons deepen (sage → sage-deep); ghost buttons gain a sage
  border + sage-deep text; icon buttons fill with `--surface-2`; cards lift.
- **Press:** a 1px downward nudge.
- **Focus:** a 2px sea-glass outline (offset 2px) for keyboard nav; inputs get
  a sage border plus a 3px `--primary-soft` halo. Keyboard access is a
  first-class concern.
- **Disabled:** 0.5 opacity, `not-allowed`.

### Backgrounds, imagery & texture
- No gradients as backgrounds — surfaces are flat cream/white. The *one*
  gradient in the system is the recipe-card photo **placeholder**
  (sage-soft → sea-glass-soft, 135°) behind a serif initial.
- No repeating patterns, textures, grain or blur washes on content. The only
  blur is functional: the sticky top bar is a translucent `--bg` with
  `backdrop-filter: blur(10px)`, and the dialog backdrop is a light ink wash
  with a 2px blur.
- **Photography**, when present, is warm and natural (real food, garden, coast)
  at 16:10 on cards and 4:3 in recipe heroes, `object-fit: cover`, rounded.
  This kit ships no stock photos — real imagery is the user's to add; use the
  gradient-initial placeholder until then.

### Layout
- Mobile-first. A sticky translucent top bar; an off-canvas sidebar that
  **docks** permanently at ≥900px (`--sidebar-w 15.5rem`). Content is a single
  centred column capped at `--main-max 74rem`.
- Generous, consistent rhythm in rem (0.3 / 0.5 / 0.8 / 1 / 1.2 / 1.6 / 2).
  Cards pad 1.1rem × 1.2rem; grids gap 1rem.
- Safe-area insets are respected throughout (installed PWA).

---

## ICONOGRAPHY

Sharon's Cookbook uses **no icon font and no SVG icon set.** Its iconography is
deliberately low-tech and consistent:

- **Navigation & UI glyphs are plain Unicode characters**, styled with CSS:
  Dashboard `◐`, Recipes `✎`, Meal planner `▦`, Pantry `▤`, Household `☰`,
  Tancook Botanicals `✦`, Garden `❀`, AI import `⇪`, Settings `⚙`. Action and
  meta glyphs follow the same approach: favourite `★`/`☆` (amber), timer `⏱`,
  temperature `🌡`, add `＋`, remove `−`, delete `✕`, drag `⠿`, reorder `↑↓`,
  in-pantry `✓` (sage). See the two "Iconography" cards in the **Brand** group.
- **The one true SVG is the brand mark** — an herb leaf (a sage leaf with a
  cream midrib and veins), inline in the app's `index.html` and reproduced by
  the `Logo` component. Its colours are token-driven so it adapts to the theme.
- **The mark also ships as raster PNGs** (the app's launcher/PWA icons):
  `assets/brand/app-icon-512.png`, `app-icon-192.png`,
  `app-icon-maskable-512.png`, `apple-touch-icon.png` — cream leaf on a sage
  field. Use these for favicons and install icons; use `Logo` in the UI.
- **Emoji** are reserved for the dashboard season glyph only (🌱 🌿 🍂 ❄).

**If you need a broader icon set**, prefer a simple, humanist, low-weight line
set (e.g. a light-stroke open-source family) and keep it monochrome in
`--text-soft` / `--primary-deep` — but the house style is these Unicode glyphs,
and matching them keeps designs recognizable. Never hand-draw the brand leaf or
substitute another mark.

---

## ⚠️ Font substitution — needs your input

The product relies on **system serifs** for display type — `Iowan Old Style`
(Apple), `Palatino Linotype` (Windows), falling back to `Georgia`. There is no
shippable font file for these. For consistent cross-platform rendering of this
design system, `tokens/fonts.css` loads **Gelasio** (a Georgia-metric-compatible
Google font) as the fallback before Georgia. On Apple/Windows the native faces
still win, exactly as in the product.

**Please confirm the intended display face**, or upload a licensed font file if
you want a specific serif baked in. Until then, the token stays pointed at
`Iowan Old Style` with the fallback chain above.

---

## Components

Thin React wrappers over the design-system CSS classes, so the component API
and the product's markup stay identical. Import from
`window.SharonSCookbookDesignSystem_c765c0`. Each lives beside its `.d.ts`,
`.prompt.md`, and a demo card in the **Design System → Components** tab.

- **Controls** (`components/controls/`): **Button**, **IconButton**,
  **SegmentedControl**
- **Forms** (`components/forms/`): **Field**, **Input**, **Textarea**,
  **Select**, **Checkbox**
- **Feedback** (`components/feedback/`): **Chip**, **AlertPill**,
  **EmptyState**, **Toast**
- **Surfaces** (`components/surfaces/`): **Card**, **Dialog**
- **Brand** (`components/brand/`): **Logo**
- **Content** (`components/content/`): **RecipeCard**

These mirror the primitives the product actually shares across features
(`css/app.css`, `css/forms.css`). Feature compositions (recipe detail, planner
grid, pantry tables, garden cards, …) are provided as CSS classes in
`patterns.css` and demonstrated in the UI kit rather than as separate
components.

### Intentional additions
`Logo` and `RecipeCard` are packaged as components for convenience — the app
renders the mark and the recipe tile inline rather than as shared widgets, but
both are iconic and reused, so they earn a stable API here.

## Templates (starting points)

Copy-ready layouts under `templates/`, each a Design Component that loads the
system via `ds-base.js`:

- **Recipe page** (`templates/recipe-page/`) — a single-recipe one-pager: hero,
  scalable ingredients with pantry checks, method, nutrition, health notes.
- **Recipe collection** (`templates/recipe-collection/`) — a searchable recipe
  index: page header, toolbar, responsive card grid.

## UI kit

`ui_kits/cookbook/` — a full, interactive click-through recreation of the
product (dashboard, recipes + detail, planner, pantry, dual shopping lists,
garden, AI import, settings) with working theme toggle, search, favourites,
serving scaling and list checks. Open `ui_kits/cookbook/index.html`. See its
own README for details.

---

## Index / manifest

Root layout of this project:

| Path | What it is |
|---|---|
| `styles.css` | **Entry point** — `@import`s everything below. Consumers link this one file. |
| `tokens/colors.css` | Palette: brand hues, semantic aliases, light + dark themes |
| `tokens/typography.css` | Font families, type ramp, weights, tracking |
| `tokens/spacing.css` | Spacing scale + layout metrics |
| `tokens/shape.css` | Radii, borders, elevation, motion tokens |
| `tokens/fonts.css` | Webfont load (Gelasio display fallback) |
| `base.css` | Reset + base element styles (body, headings, links, focus) |
| `components.css` | Shared UI primitives (buttons, chips, inputs, cards, seg, alerts, toasts, dialog, tables) |
| `patterns.css` | Feature compositions (shell, recipe cards + detail, planner, pantry, shopping, garden) |
| `components/` | React components — `controls/`, `forms/`, `feedback/`, `surfaces/`, `brand/`, `content/` |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `templates/` | Copy-ready starting points (Recipe page, Recipe collection) |
| `ui_kits/cookbook/` | Interactive full-app recreation |
| `assets/brand/` | The herb-leaf PNG app icons |
| `icons/` | Original app launcher icons (as imported) |
| `SKILL.md` | Agent-Skill manifest for downloading this system into Claude Code |

The **Design System** tab renders every `@dsCard`-tagged file: 6 Colors,
4 Type, 3 Spacing, 3 Brand, 6 Components, and the Cookbook app preview.
