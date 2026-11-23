# SETUP — put Sharon's Cookbook Design System into a repo and give Claude Code a compiler and a preview

Run on a computer. Each block is one paste into a terminal, in order. Pass and
stop signals are under each block.

## 1. Unzip the backup into a new local repo
```
mkdir -p ~/code/sharon-s-cookbook
cd ~/code/sharon-s-cookbook
git init -b main
mkdir -p design-system
unzip -q ~/Downloads/<backup-zip-name>.zip -d design-system
ls design-system/MIGRATE/START-HERE.md
```
- Pass: the path prints.
- Stop: if the zip unpacked into a sub-folder, move its contents up one level.

## 2. Install the agent map and the tools
```
cd design-system
[ -f CLAUDE.md ] && mv CLAUDE.md CLAUDE.design-tool.md
cp MIGRATE/claude-code/CLAUDE.md.txt CLAUDE.md
cp -R MIGRATE/claude-code/tools tools
for f in tools/*.mjs.txt; do mv "$f" "${f%.txt}"; done
cat MIGRATE/claude-code/EXCLUDE.txt >> .gitignore
printf "node_modules/\nscreenshots/preview/\n" >> tools/.gitignore
```
- Pass: `ls tools` shows `build.mjs check.mjs ds.config.json package.json preview.mjs serve.mjs walk.mjs`.

## 3. Install the compiler and the browser
```
cd tools
npm install
npx playwright install chromium
```
- Pass: no `ERR!` lines.
- Stop: `npm` missing → install Node 20 LTS from nodejs.org and redo this block.

## 4. Prove it works
```
npm run check
npm run preview -- --cards
npm run build
```
- Pass: `check` ends with `0 errors`; `preview` lists one PNG per card with `console errors: 0`; `build` prints a `components:` line with no error after it.
- Stop: send the first error line to Claude Code and say "fix the migration check".

## 5. Commit locally
```
cd ../..
git add -A
git commit -m "chore: import sharon-s-cookbook from design tool"
```
- Pass: `git log --oneline -1` shows the commit. To back it up, create a PRIVATE GitHub repo and push when ready.

## 6. Start Claude Code
```
cd ~/code/sharon-s-cookbook/design-system
claude
```
First message: `Read MIGRATE/START-HERE.md and CLAUDE.md, then pickup.`

