---
name: sharons-cookbook-design
description: Use this skill to generate well-branded interfaces and assets for Sharon's Cookbook — an offline-first recipe, meal-planner, pantry, dual-shopping and garden PWA with a warm "coastal Nova Scotia meets a Mediterranean kitchen" look — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colours, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Where things are

- `readme.md` — the full design guide: content voice, visual foundations, iconography, component list, manifest. **Start here.**
- `styles.css` — the single stylesheet to link; it `@import`s all tokens, base styles, primitives (`components.css`) and feature compositions (`patterns.css`). Everything is driven by CSS custom properties (see `tokens/`).
- `components/` — React components (`Button`, `Chip`, `RecipeCard`, `Card`, `Logo`, form fields, …), each with a `.d.ts` contract and a `.prompt.md` usage note. They are thin wrappers over the CSS classes, so plain HTML with the same class names works identically.
- `guidelines/` — foundation specimen cards (colours, type, spacing, brand glyphs).
- `templates/` — copy-ready starting points (a recipe one-pager, a recipe collection grid).
- `ui_kits/cookbook/` — a full interactive recreation of the product; read its screens for faithful layout patterns.
- `assets/brand/` — the herb-leaf app icons (PNG). The brand mark is also an inline SVG in `components/brand/Logo.jsx`.

## House rules (quick reference)

- Cream (`--cream`) backgrounds, white card surfaces, sage (`--primary`) as the lead colour, sea glass (`--accent`) for info, terracotta (`--danger`) + amber (`--warn`) for status. Never pure-white pages or pure-grey borders.
- Two fonts only: a warm old-style **serif** for all headings/titles (`--font-display`) and **system-ui** for body. Sentence case everywhere. Canadian spelling (colour, favourite, fibre).
- Pill buttons and chips (999px), 12px cards, 8px inputs. Two soft ink-tinted shadows. Quick, restrained motion; respect `prefers-reduced-motion`.
- Iconography is monochrome **Unicode glyphs**, not an icon font. Emoji only for the dashboard season glyph. Never redraw the brand leaf.
- Support light and dark (`data-theme="dark"`/`"auto"`). Keyboard focus uses a sea-glass ring.

Ground work in the real product when you can: `tancookjr-ops/sharons-cookbook` — <https://github.com/tancookjr-ops/sharons-cookbook>.
