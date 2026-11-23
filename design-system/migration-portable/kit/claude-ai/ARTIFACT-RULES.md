# Artifact rules — building {{NAME}} designs in Claude.ai

No compiler, no project files inside an artifact. Every artifact is ONE
self-contained file.

## 1. Start from the starter
`{{STARTER}}` is a working artifact that renders the components. Copy it
whole, then replace only the `DEMO` list / `<div id="app">` mount. Never
retype the token CSS or component code from memory: copy them byte for byte
from `tokens.inline.css` and `ds-components.js.txt`.

## 2. Structure (in this order)
1. `<meta name="color-scheme" content="light">`.
2. `<style>`: the full `tokens.inline.css`, then your page rules.
3. React 18.3.1 UMD from
   `https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js`
   and `…/react-dom/18.3.1/umd/react-dom.production.min.js`. cdnjs only.
<!--if:ds-->4. `<script>` with `ds-components.js.txt` pasted inline. It defines
   `window.{{NS}}` = { {{COMPONENTS}} }.
<!--/if:ds-->5. Your mount script with `React.createElement` (no JSX without Babel).

## 3. Props
Read the component's `.d.ts` (and `.prompt.md` if present) before using it.
Never invent a prop. If a `.d.ts` is not in knowledge, ask for it by path.

## 4. Fonts
The tokens `@import` web fonts. If the artifact blocks them, the fallbacks
render. Say "fonts fell back" rather than hiding it.

## 5. Images
Project images are not available. Use a plain bordered box with a caption
saying what goes there. Never draw imagery in SVG; the only inline SVG allowed
is a brand mark named in the invariants, copied from its file.

## 6. Done
Done = it renders in the artifact pane with no visible error. That is all you
can claim; the real file still needs `npm run preview` in Claude Code.
