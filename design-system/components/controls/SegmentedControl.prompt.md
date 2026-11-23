# SegmentedControl

A pill-shaped strip of mutually-exclusive options — the app's tab pattern for planner day/week/month, pantry locations, and garden sections. The active option gets a raised white pill (`--shadow-card`).

```jsx
const [view, setView] = React.useState('week');
<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>
```

Each option is `{ value, label, hint? }`. Use `hint` for a dimmed suffix such as a count.
