# SETUP — put {{NAME}} into a repo and give Claude Code a compiler and a preview

Run on a computer. Each block is one paste into a terminal, in order. Pass and
stop signals are under each block.
<!--if:repo-->

## 1. Unzip the backup into the repo
```
cd ~/code            # wherever {{REPO_NAME}} is cloned
git -C {{REPO_NAME}} fetch && git -C {{REPO_NAME}} switch {{BRANCH}} && git -C {{REPO_NAME}} pull
git -C {{REPO_NAME}} switch -c chore/{{SLUG}}-import
mkdir -p {{REPO_NAME}}/{{DS_FOLDER}}
unzip -q ~/Downloads/<backup-zip-name>.zip -d {{REPO_NAME}}/{{DS_FOLDER}}
ls {{REPO_NAME}}/{{DS_FOLDER}}/{{OUT}}/START-HERE.md
```
- Pass: the path prints.
- Stop: "No such file or directory" on `git -C` → run `git clone https://github.com/{{REPO}}.git` in `~/code` first. If the zip unpacked into a sub-folder, move its contents up one level.

## 2. Install the agent map and the tools
```
cd {{REPO_NAME}}/{{DS_FOLDER}}
[ -f CLAUDE.md ] && mv CLAUDE.md CLAUDE.design-tool.md
cp {{OUT}}/claude-code/CLAUDE.md.txt CLAUDE.md
cp -R {{OUT}}/claude-code/tools tools
for f in tools/*.mjs.txt; do mv "$f" "${f%.txt}"; done
cat {{OUT}}/claude-code/EXCLUDE.txt >> .gitignore
printf "node_modules/\nscreenshots/preview/\n" >> tools/.gitignore
```
- Pass: `ls tools` shows `build.mjs check.mjs ds.config.json package.json preview.mjs serve.mjs walk.mjs`.
<!--/if:repo--><!--if:norepo-->

## 1. Unzip the backup into a new local repo
```
mkdir -p ~/code/{{SLUG}}
cd ~/code/{{SLUG}}
git init -b main
mkdir -p {{DS_FOLDER}}
unzip -q ~/Downloads/<backup-zip-name>.zip -d {{DS_FOLDER}}
ls {{DS_FOLDER}}/{{OUT}}/START-HERE.md
```
- Pass: the path prints.
- Stop: if the zip unpacked into a sub-folder, move its contents up one level.

## 2. Install the agent map and the tools
```
cd {{DS_FOLDER}}
[ -f CLAUDE.md ] && mv CLAUDE.md CLAUDE.design-tool.md
cp {{OUT}}/claude-code/CLAUDE.md.txt CLAUDE.md
cp -R {{OUT}}/claude-code/tools tools
for f in tools/*.mjs.txt; do mv "$f" "${f%.txt}"; done
cat {{OUT}}/claude-code/EXCLUDE.txt >> .gitignore
printf "node_modules/\nscreenshots/preview/\n" >> tools/.gitignore
```
- Pass: `ls tools` shows `build.mjs check.mjs ds.config.json package.json preview.mjs serve.mjs walk.mjs`.
<!--/if:norepo-->

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
<!--if:repo-->

## 5. Commit (never to prod)
```
cd ..
git add -A
git commit -m "chore: import {{SLUG}} from design tool"
git push -u origin chore/{{SLUG}}-import
```
- Pass: GitHub shows the branch. Open a PR into `{{BRANCH}}`; merging is your call.

## 6. Start Claude Code
```
cd ~/code/{{REPO_NAME}}/{{DS_FOLDER}}
claude
```
First message: `Read {{OUT}}/START-HERE.md and CLAUDE.md, then pickup.`
<!--/if:repo--><!--if:norepo-->

## 5. Commit locally
```
cd ../..
git add -A
git commit -m "chore: import {{SLUG}} from design tool"
```
- Pass: `git log --oneline -1` shows the commit. To back it up, create a PRIVATE GitHub repo and push when ready.

## 6. Start Claude Code
```
cd ~/code/{{SLUG}}/{{DS_FOLDER}}
claude
```
First message: `Read {{OUT}}/START-HERE.md and CLAUDE.md, then pickup.`
<!--/if:norepo-->
