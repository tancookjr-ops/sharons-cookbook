/**
 * smoke.mjs — end-to-end smoke test for Sharon's Cookbook.
 *
 * Drives the real app in headless Chromium: seeding, search, recipe CRUD,
 * planner + grocery generation, BOTH shopping systems' separation, AI
 * import apply + undo, offline reload via the service worker, dark theme,
 * and mobile navigation. Fails on any console error.
 *
 * The app itself has zero dependencies — Playwright is a test-only tool.
 * See tests/README.md for how to run this.
 *
 * Env vars:
 *   PLAYWRIGHT_DIR directory whose node_modules contains playwright
 *                  (default: resolve normally from this file's location)
 *   BASE_URL       app origin        (default http://localhost:8080)
 *   CHROMIUM_PATH  chromium binary   (default: Playwright's own resolution)
 */
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Playwright is intentionally NOT a dependency of this repo; resolve it from
// wherever the runner installed it (see tests/README.md).
const require = createRequire(
  process.env.PLAYWRIGHT_DIR ? join(process.env.PLAYWRIGHT_DIR, 'x.js') : import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const shots = join(dirname(fileURLToPath(import.meta.url)), 'shots');
mkdirSync(shots, { recursive: true });

const errors = [];
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));

const step = async (name, fn) => {
  try { await fn(); console.log(`✓ ${name}`); }
  catch (e) { console.log(`✕ ${name}: ${e.message.split('\n')[0]}`); errors.push(`step ${name}: ${e.message}`); }
};

await step('load + seed', async () => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.waitForSelector('.dash-grid');
});
await page.screenshot({ path: `${shots}/01-dashboard.png` });

await step('recipes list shows starter recipes', async () => {
  await page.goto(`${BASE}/#/recipes`);
  await page.waitForSelector('.recipe-card');
  const n = await page.locator('.recipe-card').count();
  if (n < 6) throw new Error(`expected ≥6 recipe cards, got ${n}`);
});
await page.screenshot({ path: `${shots}/02-recipes.png` });

await step('instant search filters', async () => {
  await page.fill('#recipe-search', 'chowder');
  await page.waitForTimeout(300);
  const n = await page.locator('.recipe-card').count();
  if (n !== 1) throw new Error(`expected 1 result for "chowder", got ${n}`);
});

await step('recipe detail + scaling + pantry check', async () => {
  await page.click('.recipe-card');
  await page.waitForSelector('.recipe-detail');
  await page.click('#scale-up');
  await page.waitForTimeout(100);
  const label = await page.textContent('#scale-label');
  if (!label.includes('5')) throw new Error(`scaling label wrong: ${label}`);
});
await page.screenshot({ path: `${shots}/03-recipe-detail.png` });

await step('create recipe via editor', async () => {
  await page.goto(`${BASE}/#/recipe-edit/new`);
  await page.fill('[name=title]', 'Smoke Test Tea');
  await page.fill('.ing-edit-row [data-f=name]', 'mint');
  await page.fill('.step-edit-row textarea', 'Steep mint in hot water.');
  await page.click('.form-footer button[type=submit]');
  await page.waitForSelector('.recipe-detail');
  const h1 = await page.textContent('.recipe-detail h1');
  if (!h1.includes('Smoke Test Tea')) throw new Error('recipe not created');
});

await step('planner week view + entry via dialog', async () => {
  await page.goto(`${BASE}/#/planner`);
  await page.waitForSelector('.planner-grid');
  await page.locator('.plan-add').first().click();
  await page.waitForSelector('#pick-list .pick-item');
  await page.locator('#pick-list .pick-item').first().click();
  await page.waitForSelector('.plan-entry');
});
await page.screenshot({ path: `${shots}/04-planner.png` });

await step('grocery generation adds to household', async () => {
  await page.click('#gen-groceries');
  await page.waitForTimeout(600);
  await page.goto(`${BASE}/#/shopping`);
  await page.waitForSelector('.shop-item');
});
await page.screenshot({ path: `${shots}/05-shopping.png` });

await step('household add item', async () => {
  await page.fill('#shop-add-form [name=name]', 'Sea salt');
  await page.click('#shop-add-form .btn-primary');
  await page.waitForTimeout(300);
  const txt = await page.textContent('#shop-groups');
  if (!txt.includes('Sea salt')) throw new Error('item not added');
});

await step('botanicals is separate', async () => {
  await page.goto(`${BASE}/#/botanicals`);
  await page.waitForTimeout(300);
  const txt = await page.textContent('#main');
  if (txt.includes('Sea salt')) throw new Error('LEAK: household item visible in botanicals!');
  if (!txt.includes('Tancook')) throw new Error('botanicals page missing');
});

await step('pantry renders with alerts logic', async () => {
  await page.goto(`${BASE}/#/pantry`);
  await page.waitForSelector('.pantry-table');
});
await page.screenshot({ path: `${shots}/06-pantry.png` });

await step('garden + seasonal calendar', async () => {
  await page.goto(`${BASE}/#/garden`);
  await page.waitForSelector('.garden-card');
  await page.click('[data-tab=calendar]');
  await page.waitForSelector('.cal-table');
});
await page.screenshot({ path: `${shots}/07-garden.png` });

await step('AI import: preview + apply sample file', async () => {
  const sample = await (await fetch(`${BASE}/data/sample-import.json`)).text();
  await page.goto(`${BASE}/#/import`);
  await page.fill('#import-text', sample);
  await page.click('#import-preview');
  await page.waitForSelector('#import-apply');
  await page.click('#import-apply');
  await page.waitForSelector('.import-preview h2:has-text("Import complete")');
  const txt = await page.textContent('.import-plan');
  if (!txt.includes('Bruschetta')) throw new Error('bruschetta not created');
});
await page.screenshot({ path: `${shots}/08-import.png` });

await step('import undo restores', async () => {
  await page.click('#undo-import');
  await page.waitForSelector('.app-dialog[open]');
  await page.click('.app-dialog .btn-danger');
  await page.waitForTimeout(1500); // restore triggers a reload
  await page.goto(`${BASE}/#/recipes`);
  await page.fill('#recipe-search', 'bruschetta');
  await page.waitForTimeout(400);
  const n = await page.locator('.recipe-card').count();
  if (n !== 0) throw new Error(`undo failed: bruschetta still present (${n})`);
});

await step('settings + snapshots list', async () => {
  await page.goto(`${BASE}/#/settings`);
  await page.waitForSelector('.settings-grid');
  const txt = await page.textContent('.settings-grid');
  if (!txt.includes('Recipes')) throw new Error('stats missing');
});
await page.screenshot({ path: `${shots}/09-settings.png` });

await step('dark theme toggle', async () => {
  await page.click('#theme-toggle');
  await page.waitForTimeout(200);
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (theme !== 'dark') throw new Error(`theme is ${theme}`);
  await page.goto(`${BASE}/#/dashboard`);
  await page.waitForTimeout(400);
});
await page.screenshot({ path: `${shots}/10-dark-dashboard.png` });

await step('service worker + offline reload', async () => {
  await page.waitForTimeout(1200); // let the SW finish precaching
  const swState = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return reg?.active?.state;
  });
  if (swState !== 'activated') throw new Error(`sw state: ${swState}`);
  const ctx = page.context();
  await ctx.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.dash-grid', { timeout: 8000 });
  await ctx.setOffline(false);
});
await page.screenshot({ path: `${shots}/11-offline-dashboard.png` });

await step('mobile layout', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/#/recipes`);
  await page.waitForTimeout(400);
  await page.click('#nav-toggle');
  await page.waitForTimeout(300);
});
await page.screenshot({ path: `${shots}/12-mobile-nav.png` });

await browser.close();

const real = errors.filter(e => !/favicon/.test(e));
if (real.length) {
  console.log('\n=== ERRORS ===');
  for (const e of real) console.log(' -', e);
  process.exit(1);
}
console.log('\nALL CHECKS PASSED, no console errors.');
