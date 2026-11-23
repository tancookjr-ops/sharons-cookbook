# Field

A labelled form-control wrapper following the app's `<label>` pattern — bold dimmed label above, control below, optional hint beneath. Wrap any Input, Select, Textarea, or Checkbox.

```jsx
<Field label="Category">
  <Select options={['Mains', 'Salads', 'Soups & stews']} />
</Field>

<Field label="Tags" hint="Comma separated. e.g. vegan, garden">
  <Input placeholder="vegan, freezer-friendly" />
</Field>
```
