# TODO — Sharon's Cookbook

Planned work, roughly prioritized. Content additions don't belong here —
they arrive through imports.

## Next (1.1)

- [ ] PDF export with proper page layout (currently: print → save as PDF)
- [ ] Recipe import from Markdown files (inverse of the Markdown export)
- [ ] Explicit related-recipes picker in the editor (schema field exists)
- [ ] Cook-mode view: step-by-step full screen with built-in timers
       (timerMinutes is already captured per step)
- [ ] Pantry purchase history (append-only log per item for "years of
       pantry history" reporting)

## Later

- [ ] Weather card on the dashboard (optional online enhancement — must
       degrade gracefully offline; placeholder is in place)
- [ ] Barcode scanning for pantry items (field reserved in schema)
- [ ] Batch-cooking planner view (flag exists per meal-plan entry)
- [ ] Nutrition auto-totals for a planned day/week
- [ ] Additional languages (strings are routed for it; needs a string table)
- [ ] Share/import recipes between devices via file (works today through
       backup files; a single-recipe share format would be friendlier)
- [ ] Optional encrypted export

## Engineering

- [ ] Automated smoke tests (Playwright) around the import engine and both
       shopping systems' separation
- [ ] A tiny release script: bump APP_VERSION + sw CACHE_VERSION together
