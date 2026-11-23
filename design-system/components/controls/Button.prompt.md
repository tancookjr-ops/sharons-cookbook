# Button

The primary action control — a pill-shaped button in four brand variants and three sizes. Use `variant="primary"` (sage fill) for the main action on a view, `variant="ghost"` for secondary actions, and the danger variants for destructive ones. Renders an `<a>` when `href` is set.

```jsx
<Button variant="primary" icon="＋" href="#/recipe-edit/new">New recipe</Button>
<Button variant="ghost">Plan meals</Button>
<Button variant="danger-ghost" size="sm">Delete</Button>
```

- **variant**: `primary` | `ghost` | `danger` | `danger-ghost`
- **size**: `sm` | `md` (default) | `lg`
- **icon**: optional leading glyph, rendered before the label
- **href**: renders a link styled as a button (used for hash-routing across the app)
