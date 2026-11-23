# IconButton

A borderless, circular button (2.2em) for a single glyph or SVG — topbar menu/theme toggles, table row actions, the ± servings stepper. Always pass `label` for screen readers, since there's no visible text.

```jsx
<IconButton label="Toggle theme">☀</IconButton>
<IconButton label="More servings">＋</IconButton>
<IconButton label="Remove ingredient">✕</IconButton>
```

Icon content can be a unicode glyph (the app's convention) or an inline SVG. Hover fills with `--surface-2`.
