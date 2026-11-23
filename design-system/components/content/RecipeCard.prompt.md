# RecipeCard

The cookbook's signature tile, used on the dashboard, recipe list, and "related recipes" rails. A 16:10 photo — or, with no photo, a sage→sea-glass gradient showing the title's first letter in the display serif — above the title (with an optional ★), subtitle, and a `category · total min · difficulty` meta line. Lifts 2px on hover.

```jsx
<RecipeCard
  href="#/recipe/rec_starter_chili"
  recipe={{
    title: 'Three-Bean Garden Chili',
    subtitle: 'A big, freezer-friendly pot',
    category: 'Soups & stews',
    totalMinutes: 65,
    difficulty: 'Easy',
    favourite: true,
  }}
/>
```

Lay several out in a `.recipe-grid` (or `.recipe-grid-sm` for the compact rail).
