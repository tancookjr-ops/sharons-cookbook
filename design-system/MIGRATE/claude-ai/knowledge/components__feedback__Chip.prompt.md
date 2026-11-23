# Chip

A small rounded label for tags, recipe metadata, pantry alert states, and step timers. Neutral by default; `variant="tag"` is the sage health-tag style used on recipes.

```jsx
<Chip>Soups & stews</Chip>
<Chip variant="tag">vegan</Chip>
<Chip variant="danger">expired</Chip>
<Chip variant="warn">soon</Chip>
<Chip variant="info">⏱ 35 min</Chip>
```

- **variant**: `default` | `tag` | `danger` | `warn` | `info`
- **size**: `sm` for the compact chip
