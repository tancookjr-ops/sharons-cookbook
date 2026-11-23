# AlertPill

A pill-shaped status badge for inline alert strips — pantry expiry warnings, low-stock notices, dashboard alerts. Wrap a group in a flex `.alert-strip` container.

```jsx
<div className="alert-strip">
  <AlertPill tone="danger">2 expired</AlertPill>
  <AlertPill tone="warn">3 expiring soon</AlertPill>
  <AlertPill tone="info">1 low on stock</AlertPill>
</div>
```

- **tone**: `danger` | `warn` | `info`
