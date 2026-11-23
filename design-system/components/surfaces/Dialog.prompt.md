# Dialog

The shared modal surface — a rounded panel with a title, message body, and a right-aligned action row. Backdrop is a blurred ink wash. Used for confirmations and small forms (plan a recipe, resolve an import conflict).

```jsx
<Dialog
  title="Delete “Garden Greek Salad”?"
  actions={<>
    <Button variant="ghost">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </>}
>
  This cannot be undone.
</Dialog>
```

By default the panel renders inline (handy for cards/preview). Pass `open` to mount a real `<dialog>` with a backdrop; use `wide` for form dialogs.
