# Data Schema — Sharon's Cookbook

**Schema version: 1** (`schemaVersion` in every export/import file).

## The stability contract

- Field names listed here are **permanent**. They are never renamed.
- IDs (`recipeId`, `mealPlanId`, …) are never changed once assigned.
- Fields are never removed; new optional fields may be added at any time.
- Any breaking change requires a schemaVersion bump **and** a migration in
  `database.js`, plus import-side handling of every older version.
- Unknown fields in imported records are preserved, not rejected — forward
  compatibility beats strictness.

Dates: `created`/`modified` are ISO-8601 timestamps; calendar dates
(`date`, `expiry`, `plantDate`, …) are local `"YYYY-MM-DD"` strings.

## Recipe (`recipes` store, key `recipeId`)

```jsonc
{
  "recipeId": "rec_…",            // permanent unique id
  "title": "",                    // required
  "subtitle": "",
  "description": "",
  "category": "Mains",            // see vocabulary in recipes.js
  "cuisine": "Canadian",
  "mealType": "Dinner",           // Breakfast | Lunch | Dinner | Snack
  "difficulty": "Easy",           // Easy | Medium | Involved
  "prepMinutes": 0,
  "cookMinutes": 0,
  "totalMinutes": 0,              // derived = prep + cook
  "servings": 4,
  "yield": "",                    // e.g. "12 muffins"
  "ingredients": [ Ingredient ],
  "instructions": [ Instruction ],
  "nutrition": { "calories": null, "protein": null, "fat": null,
                  "carbs": null, "fibre": null, "sugar": null }, // per serving
  "notes": "",
  "eoeNotes": "",
  "bloodSugarNotes": "",
  "antiInflammatoryNotes": "",
  "storage": "",
  "freezer": "",
  "reheating": "",
  "source": "",
  "author": "",
  "rating": 0,                    // 0–5 personal rating
  "favourite": false,
  "photo": null,                  // data:image/jpeg;base64,… or null
  "tags": ["vegan", "garden"],    // lowercase; health tags included
  "created": "ISO", "modified": "ISO",
  "version": 1,
  "versionHistory": [ { "version": 1, "modified": "ISO", "note": "" } ],
  "searchKeywords": [],
  "relatedRecipeIds": [],
  "status": "active"
}
```

### Ingredient

```jsonc
{
  "ingredientId": "ing_…",
  "name": "",                     // required
  "amount": null,                 // number or null ("to taste")
  "unit": "",
  "optional": false,
  "notes": "",
  "pantryCategory": "",
  "shoppingCategory": "Pantry",   // household shopping category hint
  "substitutions": []
}
```

### Instruction

```jsonc
{
  "stepNumber": 1,                // maintained by the editor on reorder
  "title": "",
  "instruction": "",              // required
  "timerMinutes": null,
  "temperature": "",
  "equipment": "",
  "notes": ""
}
```

## Meal plan (`mealPlans` store, key `mealPlanId`)

```jsonc
{
  "mealPlanId": "mp_…",
  "date": "YYYY-MM-DD",
  "mealType": "Dinner",
  "recipeId": "rec_…",
  "servings": 4,
  "notes": "",
  "completed": false,
  "batch": false,                 // batch-cooking flag
  "leftovers": false              // skipped by grocery generation
}
```

## Pantry item (`pantry` store, key `pantryItemId`)

```jsonc
{
  "pantryItemId": "pan_…",
  "name": "",
  "category": "Other",
  "quantity": 0,
  "unit": "",
  "minimum": null,                // low-stock alert at quantity ≤ minimum
  "maximum": null,                // restock target
  "expiry": null,                 // "YYYY-MM-DD"
  "location": "Pantry",           // Pantry | Fridge | Freezer | Garden harvest | Bulk storage
  "purchaseDate": null,
  "cost": null,
  "supplier": "",
  "notes": "",                    // (barcode: reserved for a future field)
  "created": "ISO", "modified": "ISO"
}
```

## Shopping item (two stores: `shoppingHousehold`, `shoppingBotanicals`; key `itemId`)

> The two systems are permanently separate. `type` is redundant with the
> store but kept on every record so exported data is self-describing.

```jsonc
{
  "itemId": "shp_…",
  "type": "HOUSEHOLD",            // or "BOTANICALS" — must match its store
  "name": "",
  "category": "Pantry",           // system-specific category lists, see shopping.js
  "quantity": null,
  "unit": "",
  "checked": false,
  "notes": "",
  "priority": "normal",           // "normal" | "high"
  "recurring": false,             // survives "clear checked"
  "created": "ISO"
}
```

Household categories: Produce, Bakery, Frozen, Pantry, Dairy, Meat & fish,
Cleaning, Household, Personal care, Other.
Botanicals categories: Soap oils, Essential oils, Wax, Wicks, Fragrance, Lye,
Packaging, Labels, Jars, Bottles, Shipping, Office, Equipment.

## Garden entry (`garden` store, key `gardenItemId`)

```jsonc
{
  "gardenItemId": "gar_…",
  "plantName": "",
  "variety": "",
  "location": "",
  "plantDate": null,              // "YYYY-MM-DD"
  "harvestDate": null,            // expected harvest
  "quantity": 0,                  // season total (derived from harvests)
  "unit": "",
  "notes": "",
  "preservation": ["Freezing"],   // Freezing | Drying | Fermentation | Canning | Root cellar
  "harvests": [ { "date": "YYYY-MM-DD", "quantity": 0, "unit": "", "notes": "" } ],
  "created": "ISO", "modified": "ISO"
}
```

## Activity (`activity` store, key `activityId`) — internal

`{ activityId, time, type, summary }` — capped at the 200 most recent.

## Backup snapshot (`backups` store, key `backupId`) — internal

`{ backupId, createdAt, kind: "auto"|"manual"|"pre-import"|"pre-restore",
   label, payload: <full backup file> }`

## Settings (LocalStorage `sc.settings`)

`{ theme, fontScale, units, autoBackup, language, seeded, lastAutoBackup }` —
preferences only; never data.
