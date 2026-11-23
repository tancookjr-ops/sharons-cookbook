# Card

The neutral surface container used everywhere — dashboard tiles, panels, settings, garden cards. Cream-white with a hairline border, soft shadow, and 12px radius. Add an `accent` edge to carry meaning, or `flush` for full-bleed media.

```jsx
<Card title="Today's meals" accent="left">
  <ul className="dash-meal-list">…</ul>
</Card>

<Card title="Pantry alerts" accent="warn">…</Card>
<Card flush><img src="…" /></Card>
```

- **accent**: `top` (garden style) | `left` | `warn` | `info`
- **flush**: removes padding and clips children (media, tables)
