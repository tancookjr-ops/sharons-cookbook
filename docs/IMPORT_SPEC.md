# AI Import Specification — Sharon's Cookbook

**Format version: `schemaVersion: 1`.**

This is the contract between the application and any AI assistant (or human)
producing update files. It is designed so that an LLM can reliably generate
valid files from natural conversation, without ever writing JavaScript.

## Envelope

```jsonc
{
  "schemaVersion": 1,                    // required
  "exportDate": "2026-07-08T15:30:00Z",  // recommended
  "exportedBy": "ChatGPT",               // recommended
  "applicationVersion": "1.0.0",         // optional
  "operations": [ /* applied in order */ ]
}
```

Rules for generators:

- Emit **plain JSON** (no comments, no trailing commas) in a single document.
- Only include fields you know; omitted fields get sensible defaults.
  Never invent field names — unknown fields are tolerated but ignored.
- Operations apply **in order**: create a recipe before planning it.
- Dates are local `"YYYY-MM-DD"`; times/durations are integer minutes.
- Amounts are plain numbers (`1.5`, not `"1 ½"`); use `null` for "to taste".

## How the app applies a file

1. **Validate** — every operation is checked; broken ones are listed and
   skipped, valid ones still run.
2. **Preview** — the user sees a human-readable plan; ID/name conflicts offer
   *merge / replace / skip*.
3. **Snapshot** — a full pre-import backup is stored automatically.
4. **Apply** — sequentially; any unexpected failure **rolls back** to the
   snapshot. Afterwards the whole import can be **undone** in one click.

## Operations

### Recipes

| op | required | notes |
|---|---|---|
| `CREATE_RECIPE` | `title` | full shape in `SCHEMA.md`; `ingredients` items may be plain strings (`"2 cups flour"` style is discouraged — prefer objects); provide `recipeId` only to make the recipe addressable later |
| `UPDATE_RECIPE` | `recipeId` **or** `title` | patch semantics: only supplied fields change; lists (`ingredients`, `instructions`, `tags`) are replaced whole |
| `DELETE_RECIPE` | `recipeId` **or** `title` | |

```json
{ "op": "CREATE_RECIPE", "title": "Classic Hummus", "category": "Sauces & dressings",
  "servings": 6, "prepMinutes": 10,
  "ingredients": [ { "name": "chickpeas", "amount": 540, "unit": "ml" } ],
  "instructions": [ { "instruction": "Blend everything until smooth." } ],
  "tags": ["vegan"] }
```

### Meal plans

| op | required | notes |
|---|---|---|
| `CREATE_MEAL_PLAN` | `date`, and `recipeId` **or** `recipeTitle` | `mealType` defaults to `"Dinner"`; optional `servings`, `notes`, `batch`, `leftovers` |
| `UPDATE_MEAL_PLAN` | `mealPlanId` | patch semantics |
| `DELETE_MEAL_PLAN` | `mealPlanId` **or** `date` (+ optional `mealType`) | date form clears matching entries |

"Put chili on Friday" →
```json
{ "op": "CREATE_MEAL_PLAN", "date": "2026-07-10", "mealType": "Dinner",
  "recipeTitle": "Three-Bean Garden Chili" }
```

### Pantry

| op | required | notes |
|---|---|---|
| `ADD_PANTRY_ITEM` | `name` | optional `quantity`, `unit`, `location`, `category`, `minimum`, `maximum`, `expiry`, `cost`, `supplier`, `notes`; name-conflicts offer merge (adds quantities) |
| `UPDATE_PANTRY_ITEM` | `pantryItemId` **or** `name` | patch semantics |
| `REMOVE_PANTRY_ITEM` | `pantryItemId` **or** `name` | |

### Shopping — always state the system

`type` is **required** and must be `"HOUSEHOLD"` or `"BOTANICALS"`.
The two lists are permanently separate; there is no operation that moves
items between them.

| op | required | notes |
|---|---|---|
| `ADD_SHOPPING_ITEM` | `type`, `name` | optional `category`, `quantity`, `unit`, `notes`, `priority` (`"high"`), `recurring` |
| `REMOVE_SHOPPING_ITEM` | `type`, and `itemId` **or** `name` | |

### Garden

| op | required | notes |
|---|---|---|
| `CREATE_GARDEN_ENTRY` | `plantName` | optional `variety`, `location`, `plantDate`, `harvestDate`, `unit`, `preservation`, `notes` |
| `UPDATE_GARDEN_ENTRY` | `gardenItemId` **or** `plantName` | patch semantics; special key `harvest` appends to the harvest log |
| `DELETE_GARDEN_ENTRY` | `gardenItemId` **or** `plantName` | |

"Harvested six tomatoes" →
```json
{ "op": "UPDATE_GARDEN_ENTRY", "plantName": "Tomato",
  "harvest": { "date": "2026-07-08", "quantity": 6 } }
```

### Settings / images / whole-database

| op | required | notes |
|---|---|---|
| `UPDATE_SETTINGS` | `settings` object | accepted keys: `theme`, `fontScale`, `units`, `autoBackup`, `language` |
| `IMPORT_IMAGES` | `images: [{ recipeId, photo }]` | `photo` must be a `data:image/...` URL; attaches to existing recipes |
| `MERGE_DATABASE` | `backup` object | merges a full backup file (incoming wins on ID clash) |

## Conversation → operations (reference examples)

| Sharon says | Assistant emits |
|---|---|
| "Add a hummus recipe." | `CREATE_RECIPE` |
| "Put chili on Friday." | `CREATE_MEAL_PLAN` with next Friday's date |
| "Remove onions from pantry." | `REMOVE_PANTRY_ITEM { name: "Onions" }` |
| "Add olive oil to shopping." | `ADD_SHOPPING_ITEM { type: "HOUSEHOLD", … }` |
| "Order more lavender oil for the business." | `ADD_SHOPPING_ITEM { type: "BOTANICALS", … }` |
| "Harvested six tomatoes." | `UPDATE_GARDEN_ENTRY` with `harvest` |

A complete worked file lives at [`data/sample-import.json`](../data/sample-import.json).

## Backups

A file with `"kind": "FULL_BACKUP"` (produced by Settings → Export) is also
accepted by the import page directly — it is treated as a single
`MERGE_DATABASE` operation. Restores with *replace* semantics happen through
Settings → Import backup.

## Versioning promises

- Field names and operation names in this document are permanent.
- New operations and new optional fields may appear in later versions.
- If `schemaVersion` in a file is **newer** than the app understands, the app
  refuses the whole file with a clear message (never a partial import).
- If it is **older**, the app remains responsible for translating it.
