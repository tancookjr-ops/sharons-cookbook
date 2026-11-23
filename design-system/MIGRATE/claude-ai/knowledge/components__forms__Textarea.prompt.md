# Textarea

A multi-line text field that resizes vertically only. Used for descriptions, notes, storage/health notes, and the AI-import JSON box (add `font-family: var(--font-mono)` for the latter).

```jsx
<Field label="Description">
  <Textarea rows={2} placeholder="A short description…" />
</Field>
```
