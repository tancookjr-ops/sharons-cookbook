# Project notes

## Deploy workflow (user's repo)
- GitHub Pages does NOT build from direct commits to `Develop`. Every deploy instruction must end with: **create a PR from Develop into the Pages-serving branch and merge it** — only the merge triggers the Pages rebuild.
- User uploads files from their phone via github.com in desktop-site mode (Add file → Upload files). The GitHub app can't upload.
- To ship an update: bump `VERSION` in `deploy/sw.js`, include `sw.js` in the upload set, list exactly which changed files to upload.
- `icons/app-icon-512.png` may still be missing in the repo — SW caches tolerate it now (v1.2.3) but install/manifest icons need it.

## Recipe content policy (user instruction)
Imported recipes keep ingredients, amounts, and instructions VERBATIM from the source — never alter amounts, ingredients, times, or steps except when applying the user's explicit dietary substitutions. Editorial prose is summarized to one short paragraph; original imagery is not copied.
