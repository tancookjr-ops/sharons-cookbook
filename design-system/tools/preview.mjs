// Replaces the preview pane. Renders pages in headless Chromium, writes PNGs, reports console errors.
// npm run preview -- <file.html> [more…]     full-page PNG at 1280 wide (override: --width=390)
// npm run preview -- --cards                  every @dsCard file at its declared viewport
// Exit code 1 if any page logged an error, threw, or failed to load a local file.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, serve } from './serve.mjs';
import { walk, parseCard } from './walk.mjs';

const args = process.argv.slice(2);
const flag = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const width = Number(flag('width')) || 1280, height = Number(flag('height')) || 800;
const port = 4173 + Math.floor(Math.random() * 500);
let targets = args.filter(a => !a.startsWith('--')).map(p => ({ path: p.replace(/^\.?\//, ''), card: null }));
if (args.includes('--cards')) for (const f of walk(ROOT, ROOT).filter(f => f.endsWith('.html'))) {
  const card = parseCard(readFileSync(join(ROOT, f), 'utf8').split(/\r?\n/, 1)[0]);
  if (card) targets.push({ path: f, card });
}
if (!targets.length) { console.log('usage: npm run preview -- <file.html …> | --cards'); process.exit(2); }

const outDir = join(ROOT, 'screenshots', 'preview');
mkdirSync(outDir, { recursive: true });
const srv = await serve(port);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let bad = 0;
for (const t of targets) {
  const vp = t.card?.viewport || { width, height };
  const page = await browser.newPage({ viewport: vp });
  const issues = [];
  page.on('console', m => { if (m.type() === 'error') issues.push('console: ' + m.text()); });
  page.on('pageerror', e => issues.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(`http://localhost:${port}/`)) issues.push(`${r.status()} ${decodeURIComponent(r.url().slice(`http://localhost:${port}`.length))}`); });
  const url = `http://localhost:${port}/` + t.path.split('/').map(encodeURIComponent).join('/');
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); } catch (e) { issues.push('load: ' + e.message.split('\n')[0]); }
  await page.waitForTimeout(600);
  const png = join(outDir, t.path.replace(/[\/\\ ]+/g, '__') + '.png');
  await page.screenshot({ path: png, fullPage: !t.card });
  console.log(`${issues.length ? 'FAIL' : 'ok  '}  ${t.path}  →  ${png.slice(ROOT.length + 1)}  · console errors: ${issues.length}`);
  for (const i of issues) console.log('      ' + i);
  if (issues.length) bad++;
  await page.close();
}
await browser.close(); srv.close();
console.log(`${targets.length} rendered · ${bad} with errors · open the PNGs to look at them`);
process.exit(bad ? 1 : 0);
