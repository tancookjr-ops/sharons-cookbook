---
title: 
category:          # see _shared/recipe-structure.md
source:            # URL, book + page, or "Sharon"
status: draft      # draft → approved (set by the owner at CHECK 1)
---

# {title}

## Fields
- subtitle: 
- cuisine: 
- mealType: 
- description: 
- prepMinutes: 
- cookMinutes: 
- servings: 
- tags: 
- eoeNotes: 

## Ingredients  (amount · unit · name · notes)
- 

## Steps  (title · instruction · timer/temp/equipment)
1. 

## Nutrition per serving  (calories, protein, fat, carbs, fibre, sugar)
- 

## Vegan check
- [ ] no meat, fish, animal dairy, eggs or honey (or swapped — list swaps here)

## Code block for recipes/{file}.js  (written by 01_draft from the fields above)
```js
R({ title: '', subtitle: '', category: '', cuisine: '', mealType: '',
  description: '',
  prepMinutes: 0, cookMinutes: 0, servings: 4,
  ingredients: [],
  instructions: [],
  nutrition: nut(0,0,0,0,0,0), tags: [] });
```
