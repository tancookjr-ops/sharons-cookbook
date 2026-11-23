# Recipe structure — what a complete recipe contains

The app's own definition lives in `recipes/build.js` (the `R()`, `ing()`, `step()`,
`nut()` helpers) and the recipe detail screen (`screens-main.jsx`). This file
summarises it; if they ever disagree, the code wins — update this file the same day.

## Hard rules

- **Vegan, always.** No meat, fish, animal dairy, eggs or honey. Dairy-style items
  are the plant-based version (e.g. "oat milk", "vegan butter"). `R()` adds the
  `vegan` tag automatically.
- **Metric units** as written in the collection: `ml`, `l`, `g`, `kg`, `clove`, or
  `''` for a count (e.g. `[2,'','onion']`). Spoons are written in ml (5 ml = 1 tsp, 15 ml = 1 tbsp).
- Ingredients and steps are kept **word-for-word** from the source when importing;
  only the description is rewritten as a short factual line.

## Fields

| Field | Required | Shape / allowed values |
|---|---|---|
| `title` | yes | the recipe's name; becomes the id `rec_<title_slug>` |
| `subtitle` | yes | a short tagline, e.g. "Silk in a bowl" |
| `category` | yes | Mains · Salads · Breakfast · Drinks · Soups & stews · Sides · Snacks · Sauces & dressings · Breads & baking · Desserts · Preserves |
| `cuisine` | yes | e.g. Canadian, Mediterranean, Other |
| `mealType` | yes | Breakfast · Lunch · Dinner · Dessert · Snack |
| `description` | yes | one or two plain sentences |
| `prepMinutes`, `cookMinutes` | yes | whole minutes (total is computed) |
| `servings` | yes | number of servings |
| `ingredients` | yes | list of `[amount, unit, name, notes?, extra?]` — amount `''` = "to taste"; extra `{optional:true}` or `{substitutions:[…]}` |
| `instructions` | yes | list of `[title, instruction, extra?]` — extra `{t: minutes, temp: '200 °C', eq: 'Blender'}` |
| `nutrition` | yes | `nut(calories, protein, fat, carbs, fibre, sugar)` per serving |
| `tags` | yes | from the vocabulary below |
| `difficulty` | no | Easy (default) · Medium · Involved |
| `yield`, `servingSize` | no | e.g. "24 oatcakes", "125 g" |
| `eoeNotes` | when relevant | texture/tolerance notes for EoE (most recipes have one) |
| `bloodSugarNotes`, `antiInflammatoryNotes` | when relevant | short health notes |
| `storage`, `freezer`, `reheating` | no | storage notes |
| `favourite`, `rating` | no | `true`; 1–5 |

## Tag vocabulary (in use across the collection)

garden · eoe-friendly · raw · anti-inflammatory · high-protein · summer · autumn ·
winter · spring · freezer-friendly · quick · batch-cooking · blood-sugar-friendly ·
gluten-free · high-fibre · comfort · fermentation · maritime · mediterranean · low-carb

## Which file a recipe goes in

| category | file |
|---|---|
| Breakfast | `recipes/breakfast.js` |
| Mains | `recipes/mains.js` |
| Soups & stews | `recipes/soups.js` |
| Salads | `recipes/salads.js` |
| Sides, Breads & baking | `recipes/sides-breads.js` |
| Sauces & dressings, Preserves | `recipes/sauces-preserves.js` |
| Snacks, Desserts | `recipes/snacks-desserts.js` |
| Drinks | `recipes/drinks.js` |
