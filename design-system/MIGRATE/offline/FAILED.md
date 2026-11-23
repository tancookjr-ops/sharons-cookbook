# OFFLINE — FAILED · 2026-11-22

Targets 29 · written 29 · failed 1.

- `upload-v1.2.3/index.html` — partial upload set: 17 sibling assets (app.jsx, recipes/*.js, styles.css, icons) are not in upload-v1.2.3/ — they live in deploy/. Use offline/deploy/index.html instead.

## Copied as-is (already self-contained)
None.

## Bundler warnings that are not failures
`asset not found: %23…` lines are in-page SVG references (`url(#noise)` etc.), not files. They still work.

Chats and comments are deleted after 2026-12-14. Close every chat before then.
