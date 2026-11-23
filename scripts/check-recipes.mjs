// check-recipes.mjs — load the built-in recipe collection the way the app does
// and check every recipe against _shared/recipe-structure.md.
//
//   node scripts/check-recipes.mjs            → counts per file, errors, warnings
//
// Exit 1 on any error. Warnings (possible non-vegan words) are for CHECK 1 to look at.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'recipes');
const CATEGORIES = ['Mains', 'Salads', 'Breakfast', 'Drinks', 'Soups & stews', 'Sides', 'Snacks',
  'Sauces & dressings', 'Breads & baking', 'Desserts', 'Preserves'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
const UNITS = ['', 'ml', 'l', 'g', 'kg', 'clove'];
const REQUIRED = ['title', 'subtitle', 'category', 'cuisine', 'mealType', 'description', 'servings'];
// Words that usually mean an animal product unless a plant word sits right before them.
const ANIMAL = /\b(beef|pork|chicken|turkey|lamb|bacon|ham|fish|salmon|tuna|shrimp|prawn|anchov\w*|gelatin|honey|eggs?|butter(?! ?beans?| ?nut| ?squash| ?lettuce)|milk|cream|cheese|yogh?urt|ghee)\b/i;
const PLANT = /\b(vegan|plant|oat|soy|almond|coconut|cashew|rice|hemp|pea|nut|seed|peanut|sunflower|cocoa|apple|flax|chia)[- ]*$/i;

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(DIR, 'build.js'), 'utf8'), ctx, { filename: 'build.js' });

const errors = [], warns = [], perFile = {};
for (const f of readdirSync(DIR).filter((f) => f.endsWith('.js') && f !== 'build.js').sort()) {
  const before = ctx.window.CB.recipes.length;
  try { vm.runInContext(readFileSync(join(DIR, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { errors.push(`${f}: does not load — ${e.message}`); continue; }
  for (const r of ctx.window.CB.recipes.slice(before)) r.__file = f;
  perFile[f] = ctx.window.CB.recipes.length - before;
}

const seen = new Map();
for (const r of ctx.window.CB.recipes) {
  const at = `${r.__file}: "${r.title}"`;
  for (const k of REQUIRED) if (r[k] === undefined || r[k] === '') errors.push(`${at} missing ${k}`);
  if (seen.has(r.recipeId)) errors.push(`${at} duplicates the id of ${seen.get(r.recipeId)}`); else seen.set(r.recipeId, at);
  if (!CATEGORIES.includes(r.category)) errors.push(`${at} unknown category "${r.category}"`);
  if (!MEALS.includes(r.mealType)) errors.push(`${at} unknown mealType "${r.mealType}"`);
  if (!r.ingredients.length) errors.push(`${at} has no ingredients`);
  if (!r.instructions.length) errors.push(`${at} has no steps`);
  for (const i of r.ingredients) {
    if (!UNITS.includes(i.unit)) errors.push(`${at} ingredient "${i.name}" uses unit "${i.unit}" (allowed: ${UNITS.map((u) => u || "''").join(', ')})`);
    const m = ANIMAL.exec(i.name || '');
    if (m && !PLANT.test(i.name.slice(0, m.index))) warns.push(`${at} ingredient "${i.name}" — is this the plant-based version?`);
  }
  for (const s of r.instructions) if (!s.instruction) errors.push(`${at} has a step with no instruction`);
}

for (const [f, n] of Object.entries(perFile)) console.log(`${String(n).padStart(4)}  ${f}`);
console.log(`${String(ctx.window.CB.recipes.length).padStart(4)}  recipes in total`);
for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
