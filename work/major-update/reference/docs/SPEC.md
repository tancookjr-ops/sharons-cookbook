# Project Specification — Sharon's Cookbook (founding brief)

> This is the original project specification the application was built
> against, preserved verbatim in structure and intent. It is the contract
> for every future version: when in doubt, this document plus
> `SCHEMA.md` / `IMPORT_SPEC.md` win. Reproduced at handover, 2026-07-08.

## Mission

Build a production-quality offline-first Progressive Web App (PWA) called
**Sharon's Cookbook**. This is NOT a demonstration or prototype. This is
intended to become a real application that will continue to grow over many
versions. The goal is a maintainable, modular, well-documented application
with clean architecture and excellent UX. Do not simplify. Do not create
placeholder pages unless specifically instructed. Implement working
functionality.

## Primary requirements

The application must:

- Work completely offline
- Be installable as a Progressive Web App
- Run on Windows, macOS, Linux, Android, iPhone/iPad
- Store data locally
- Include import/export backups
- Never require an internet connection
- Be responsive, mobile-first, with a modern polished interface

## Technical requirements

- HTML5, CSS3, Vanilla JavaScript (ES2023)
- **No frameworks** — no React, Vue, Angular, Bootstrap, Tailwind. Only pure JavaScript
- IndexedDB for storage; LocalStorage only for preferences/settings
- Organized into modules (css/, js/, icons/, images/, data/)
- Heavily documented code, clean architecture, no duplicated logic

## Design

- Colour palette: natural, warm, modern, organic — inspired by herbs, sea
  glass, driftwood, gardens, Mediterranean cooking, coastal Nova Scotia
- Rounded corners, soft shadows, excellent typography
- Dark mode and light mode
- Accessibility compliant: keyboard navigation, screen reader support

## Dashboard

Displays: today's meals, favourite recipes, recently added recipes, pantry
alerts, low stock items, shopping summary, garden harvest, season, weather
placeholder (future), quick actions, statistics, recent activity.

## Recipe database

Each recipe contains: unique ID, title, subtitle, description, category,
cuisine, meal type, difficulty, prep/cook/total time, servings, yield,
ingredients, instructions, nutrition (calories, protein, fat, carbs, fibre,
sugar), notes, EoE notes, blood sugar notes, anti-inflammatory notes,
storage, freezer instructions, reheating, source, author, personal rating,
favourite, photo, tags, created/modified dates, version history, search
keywords, related recipes.

## Recipe editor

Full CRUD, ingredient editor, instruction editor, drag-and-drop instruction
ordering, ingredient scaling, photo upload, recipe duplication, print
recipe, PDF export, Markdown export, import recipes.

## Search

Instant search. Filter by: ingredient, category, cuisine, meal, prep time,
cook time, difficulty, nutrition, raw, cooked, freezer friendly, garden,
high protein, favourite, recently added.

## Meal planner

Daily, weekly, monthly. Drag-and-drop recipes. Multiple meals/day
(breakfast, lunch, dinner, snack). Notes. Auto grocery generation. Batch
cooking planning. Leftover planning.

## Pantry

Track: pantry, fridge, freezer, garden harvest, bulk storage.
Fields: quantity, units, location, expiry, minimum stock, maximum stock,
purchase date, cost, supplier, barcode (future).
Recipes automatically detect pantry ingredients.

## Shopping — IMPORTANT

There must always be **TWO completely separate shopping systems. Never mix
them.**

**Household shopping** — categories: produce, bakery, frozen, pantry,
cleaning, household, personal care, other. Supports recurring items,
checklists, sorting, grouping, printing, sharing.

**Tancook Island Botanicals** — separate database, separate storage,
separate lists. Categories: soap oils, essential oils, wax, wicks,
fragrance, lye, packaging, labels, jars, bottles, shipping, office,
equipment. **Never merge with household shopping.**

## Garden

Plant database, planting schedule, harvest tracker, recipes by harvest,
preservation (freezing, drying, fermentation), seasonal calendar.

## Health

Support: vegan recipes, EoE, blood sugar, anti-inflammatory, food
sensitivities, custom dietary tags, recipe warnings.

## Settings

Theme, backup, restore, export, import, fonts, measurements
(metric/imperial), language ready.

## Backup

Export everything. Import everything. JSON. Automatic backups. Version
compatibility.

## PWA

Offline support, installable, app icon, splash screen, manifest, service
worker, offline cache, update detection.

## Performance

Must comfortably support: 10,000 recipes, 100 meal plans, years of pantry
history, thousands of shopping items. Fast searching. No lag.

## AI Integration & Structured Import System (Mandatory)

The software and the cookbook content are completely separate. The
application should rarely require software updates after Version 1. Almost
all future changes occur through structured imports.

**Layer 1 — Application**: UI, database, search, planner, pantry, shopping,
garden, settings, import/export, backup. Changes infrequently.

**Layer 2 — Content**: recipes, meal plans, shopping lists, pantry data,
garden data, tags, categories, settings, images, templates. Updateable
without modifying application code.

**AI Import Engine**: an import system intended to receive structured text
generated by an AI assistant. The assistant never writes JavaScript — only
structured data. The application parses and validates the import.

**Import format**: human-readable JSON; stable field names never changed
without versioning. Top level: `schemaVersion`, `exportDate`, `exportedBy`,
`applicationVersion`, `operations`.

**Operations**: CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE,
CREATE_MEAL_PLAN, UPDATE_MEAL_PLAN, DELETE_MEAL_PLAN, ADD_PANTRY_ITEM,
UPDATE_PANTRY_ITEM, REMOVE_PANTRY_ITEM, ADD_SHOPPING_ITEM,
REMOVE_SHOPPING_ITEM, CREATE_GARDEN_ENTRY, UPDATE_GARDEN_ENTRY,
DELETE_GARDEN_ENTRY, UPDATE_SETTINGS, IMPORT_IMAGES, MERGE_DATABASE.

**Schemas** (recipe, ingredient, instruction, meal plan, pantry, shopping,
garden): see `SCHEMA.md` — those field names implement this spec exactly.

**Import behaviour**: add, replace, merge, update, delete, conflict
resolution, undo, preview before import, rollback on failure, validation
before commit.

**Voice workflow**: an AI assistant generates update files from natural
conversation ("Add a hummus recipe", "Put chili on Friday", "Remove onions
from pantry", "Add olive oil to shopping", "Harvested six tomatoes")
without modifying application code.

**Stable field names**: never rename schema fields, never change IDs, never
remove fields without schema versioning. Future compatibility beats
short-term convenience.

## Git workflow (mandatory)

Feature branches; commit after every completed milestone. Maintain:
README.md, TODO.md, CHANGELOG.md, PROJECT_STATUS.md, SCHEMA.md,
IMPORT_SPEC.md, API.md (if future APIs are added). Clear commit messages.

## AI compatibility

The import format must be simple enough that a chat assistant can reliably
generate it from voice conversations. Prioritize readability, stability,
backward compatibility, forward compatibility, minimal ambiguity, low risk
of parsing errors. The long-term objective: the user rarely edits data
manually — they converse naturally with an AI assistant, which generates
import files the application validates and applies safely.
