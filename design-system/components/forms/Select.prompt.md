# Select

A native dropdown styled to match `Input`. Pass `options` as strings or `{value, label}` objects.

```jsx
<Field label="Cuisine">
  <Select options={['Canadian', 'Mediterranean', 'Greek', 'Maritime']} />
</Field>

<Select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  options={[{ value: '', label: 'All recipes' }, { value: 'favourite', label: '★ Favourites' }]}
/>
```
