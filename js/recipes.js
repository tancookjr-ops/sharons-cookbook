/**
 * recipes.js — recipe database: list/search, detail view, full editor.
 *
 * Routes owned:
 *   #/recipes              searchable, filterable list
 *   #/recipe/:id           detail view (scaling, pantry check, exports)
 *   #/recipe-edit/:id?     create / edit form
 *
 * Recipe records follow the stable schema in docs/SCHEMA.md. Field names are
 * permanent — the AI import engine (importer.js) writes the same shape.
 */

import { dbGet, dbGetAll, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, esc, norm, nowISO, fmtDate, fmtAmount, scaleAmount, convertUnit,
  sortBy, debounce, toast, confirmDialog, openDialog, closeDialog,
  downloadFile, readImageResized, readFileText, getSettings, sentenceCase,
} from './utilities.js';
import { addItemsToShoppingList } from './shopping.js';

/* ------------------------------------------------------------------ *
 *  Vocabulary (content-level, editable lists — not schema)
 * ------------------------------------------------------------------ */

export const CATEGORIES = ['Mains', 'Sides', 'Soups & stews', 'Salads', 'Breads & baking', 'Breakfast', 'Sauces & dressings', 'Preserves', 'Snacks', 'Desserts', 'Drinks'];
export const CUISINES = ['Canadian', 'Mediterranean', 'Italian', 'Greek', 'Middle Eastern', 'Mexican', 'Indian', 'Thai', 'Chinese', 'Japanese', 'French', 'Maritime', 'Other'];
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Involved'];
export const HEALTH_TAGS = ['vegan', 'vegetarian', 'eoe-friendly', 'blood-sugar-friendly', 'anti-inflammatory', 'gluten-free', 'dairy-free', 'nut-free', 'raw', 'freezer-friendly', 'garden', 'high-protein'];

/* ------------------------------------------------------------------ *
 *  Data helpers (also used by planner, dashboard, importer)
 * ------------------------------------------------------------------ */

/** A new empty recipe with every stable field present. */
export function blankRecipe() {
  const now = nowISO();
  return {
    recipeId: uid('rec'),
    title: '', subtitle: '', description: '',
    category: 'Mains', cuisine: 'Canadian', mealType: 'Dinner', difficulty: 'Easy',
    prepMinutes: 0, cookMinutes: 0, totalMinutes: 0,
    servings: 4, yield: '',
    ingredients: [], instructions: [],
    nutrition: { calories: null, protein: null, fat: null, carbs: null, fibre: null, sugar: null },
    notes: '', eoeNotes: '', bloodSugarNotes: '', antiInflammatoryNotes: '',
    storage: '', freezer: '', reheating: '',
    source: '', author: '', rating: 0, favourite: false,
    photo: null, tags: [],
    created: now, modified: now,
    version: 1, versionHistory: [],
    searchKeywords: [], relatedRecipeIds: [],
    status: 'active',
  };
}

/** Blank ingredient row (stable field names — see SCHEMA.md). */
export function blankIngredient() {
  return { ingredientId: uid('ing'), name: '', amount: null, unit: '', optional: false, notes: '', pantryCategory: '', shoppingCategory: 'Pantry', substitutions: [] };
}

/** Blank instruction step. */
export function blankStep(n = 1) {
  return { stepNumber: n, title: '', instruction: '', timerMinutes: null, temperature: '', equipment: '', notes: '' };
}

/** Save a recipe, bumping version + history. `note` describes the change. */
export async function saveRecipeRecord(recipe, note = 'Edited') {
  recipe.modified = nowISO();
  recipe.totalMinutes = (Number(recipe.prepMinutes) || 0) + (Number(recipe.cookMinutes) || 0);
  recipe.versionHistory = [...(recipe.versionHistory || []), { version: recipe.version, modified: recipe.modified, note }].slice(-25);
  recipe.version = (recipe.version || 1) + 1;
  await dbPut('recipes', recipe);
  return recipe;
}

/** Full-text haystack for instant search. */
function haystack(r) {
  return norm([r.title, r.subtitle, r.description, r.category, r.cuisine, r.mealType,
    (r.tags || []).join(' '), (r.searchKeywords || []).join(' '),
    (r.ingredients || []).map(i => i.name).join(' ')].join(' '));
}

/** Does the pantry hold an ingredient with a matching name? */
export function findPantryMatch(pantryItems, ingredientName) {
  const n = norm(ingredientName);
  if (!n) return null;
  return pantryItems.find(p => {
    const pn = norm(p.name);
    return pn && (pn === n || n.includes(pn) || pn.includes(n));
  }) || null;
}

/* ------------------------------------------------------------------ *
 *  List view + instant search
 * ------------------------------------------------------------------ */

/** Persistent-per-session filter state for the list view. */
const listState = {
  q: '', category: '', cuisine: '', mealType: '', difficulty: '',
  maxPrep: '', maxCook: '', special: '', sort: 'modified',
};

const SPECIAL_FILTERS = [
  ['', 'All recipes'],
  ['favourite', '★ Favourites'],
  ['recent', 'Recently added'],
  ['freezer', 'Freezer friendly'],
  ['garden', 'From the garden'],
  ['high-protein', 'High protein (≥20 g)'],
  ['raw', 'Raw'],
  ['cooked', 'Cooked'],
];

function matchesFilters(r, pantrySet) {
  const s = listState;
  if (s.q) {
    // Every space-separated term must appear (ingredient search included).
    const hay = haystack(r);
    for (const term of norm(s.q).split(/\s+/)) if (!hay.includes(term)) return false;
  }
  if (s.category && r.category !== s.category) return false;
  if (s.cuisine && r.cuisine !== s.cuisine) return false;
  if (s.mealType && r.mealType !== s.mealType) return false;
  if (s.difficulty && r.difficulty !== s.difficulty) return false;
  if (s.maxPrep && (Number(r.prepMinutes) || 0) > Number(s.maxPrep)) return false;
  if (s.maxCook && (Number(r.cookMinutes) || 0) > Number(s.maxCook)) return false;
  switch (s.special) {
    case 'favourite': if (!r.favourite) return false; break;
    case 'recent': if (Date.now() - new Date(r.created).getTime() > 14 * 86400000) return false; break;
    case 'freezer': if (!(r.tags || []).includes('freezer-friendly') && !r.freezer) return false; break;
    case 'garden': if (!(r.tags || []).includes('garden')) return false; break;
    case 'high-protein': if ((Number(r.nutrition?.protein) || 0) < 20) return false; break;
    case 'raw': if ((Number(r.cookMinutes) || 0) !== 0) return false; break;
    case 'cooked': if ((Number(r.cookMinutes) || 0) === 0) return false; break;
  }
  return true;
}

/** One recipe card (shared with dashboard). */
export function recipeCardHTML(r) {
  const img = r.photo
    ? `<img class="recipe-card-img" src="${esc(r.photo)}" alt="" loading="lazy">`
    : `<div class="recipe-card-img recipe-card-placeholder" aria-hidden="true">${esc((r.title || '?')[0].toUpperCase())}</div>`;
  return `
    <a class="recipe-card" href="#/recipe/${esc(r.recipeId)}">
      ${img}
      <div class="recipe-card-body">
        <h3 class="recipe-card-title">${esc(r.title)}${r.favourite ? ' <span class="fav-star" aria-label="favourite">★</span>' : ''}</h3>
        ${r.subtitle ? `<p class="recipe-card-sub">${esc(r.subtitle)}</p>` : ''}
        <p class="recipe-card-meta">
          <span>${esc(r.category)}</span>
          ${r.totalMinutes ? `<span>· ${r.totalMinutes} min</span>` : ''}
          <span>· ${esc(r.difficulty)}</span>
        </p>
      </div>
    </a>`;
}

export async function renderRecipeList(main) {
  const recipes = await dbGetAll('recipes');
  const active = recipes.filter(r => r.status !== 'deleted');

  const opts = (list, sel) => list.map(v => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');

  main.innerHTML = `
    <header class="page-head">
      <h1>Recipes</h1>
      <div class="page-actions">
        <a class="btn btn-primary" href="#/recipe-edit/new">＋ New recipe</a>
      </div>
    </header>

    <div class="recipe-toolbar">
      <input type="search" id="recipe-search" class="input search-input" placeholder="Search recipes, ingredients, tags…"
             value="${esc(listState.q)}" aria-label="Search recipes">
      <select id="f-special" class="input" aria-label="Quick filter">
        ${SPECIAL_FILTERS.map(([v, l]) => `<option value="${v}" ${v === listState.special ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
      <button class="btn btn-ghost" id="filter-toggle" aria-expanded="false">Filters</button>
    </div>

    <div class="filter-panel" id="filter-panel" hidden>
      <label>Category <select id="f-category" class="input"><option value="">Any</option>${opts(CATEGORIES, listState.category)}</select></label>
      <label>Cuisine <select id="f-cuisine" class="input"><option value="">Any</option>${opts(CUISINES, listState.cuisine)}</select></label>
      <label>Meal <select id="f-mealType" class="input"><option value="">Any</option>${opts(MEAL_TYPES, listState.mealType)}</select></label>
      <label>Difficulty <select id="f-difficulty" class="input"><option value="">Any</option>${opts(DIFFICULTIES, listState.difficulty)}</select></label>
      <label>Max prep (min) <input type="number" id="f-maxPrep" class="input" min="0" value="${esc(listState.maxPrep)}"></label>
      <label>Max cook (min) <input type="number" id="f-maxCook" class="input" min="0" value="${esc(listState.maxCook)}"></label>
      <label>Sort by
        <select id="f-sort" class="input">
          <option value="modified" ${listState.sort === 'modified' ? 'selected' : ''}>Recently updated</option>
          <option value="title" ${listState.sort === 'title' ? 'selected' : ''}>Title A–Z</option>
          <option value="time" ${listState.sort === 'time' ? 'selected' : ''}>Total time</option>
          <option value="rating" ${listState.sort === 'rating' ? 'selected' : ''}>Rating</option>
        </select>
      </label>
      <button class="btn btn-ghost" id="filter-clear">Clear filters</button>
    </div>

    <p class="result-count" id="result-count" role="status"></p>
    <div class="recipe-grid" id="recipe-grid"></div>
  `;

  const grid = main.querySelector('#recipe-grid');
  const count = main.querySelector('#result-count');

  function paint() {
    let shown = active.filter(r => matchesFilters(r));
    shown = {
      modified: () => sortBy(shown, r => r.modified, true),
      title: () => sortBy(shown, r => norm(r.title)),
      time: () => sortBy(shown, r => Number(r.totalMinutes) || 0),
      rating: () => sortBy(shown, r => Number(r.rating) || 0, true),
    }[listState.sort]();
    count.textContent = `${shown.length} recipe${shown.length === 1 ? '' : 's'}`;
    grid.innerHTML = shown.length
      ? shown.map(recipeCardHTML).join('')
      : `<div class="empty-state">
           <p>${active.length ? 'No recipes match those filters.' : 'Your cookbook is empty.'}</p>
           <a class="btn btn-primary" href="#/recipe-edit/new">Add your first recipe</a>
         </div>`;
  }

  // Instant search (debounced so 10k-recipe libraries stay smooth).
  main.querySelector('#recipe-search').addEventListener('input', debounce(e => {
    listState.q = e.target.value; paint();
  }, 120));

  for (const key of ['special', 'category', 'cuisine', 'mealType', 'difficulty', 'maxPrep', 'maxCook', 'sort']) {
    main.querySelector(`#f-${key}`).addEventListener('change', e => { listState[key] = e.target.value; paint(); });
  }
  const panel = main.querySelector('#filter-panel');
  main.querySelector('#filter-toggle').addEventListener('click', e => {
    panel.hidden = !panel.hidden;
    e.target.setAttribute('aria-expanded', String(!panel.hidden));
  });
  main.querySelector('#filter-clear').addEventListener('click', () => {
    Object.assign(listState, { q: '', category: '', cuisine: '', mealType: '', difficulty: '', maxPrep: '', maxCook: '', special: '' });
    renderRecipeList(main);
  });

  paint();
  main.querySelector('#recipe-search').focus();
}

/* ------------------------------------------------------------------ *
 *  Detail view
 * ------------------------------------------------------------------ */

export async function renderRecipeDetail(main, { id }) {
  const r = await dbGet('recipes', id);
  if (!r) { main.innerHTML = `<p class="empty-state">Recipe not found. <a href="#/recipes">Back to recipes</a></p>`; return; }
  const pantryItems = await dbGetAll('pantry');
  const all = await dbGetAll('recipes');
  const settings = getSettings();

  // Scaling is view-state only; the stored recipe never changes.
  let scaleServings = Number(r.servings) || 1;

  // Related: explicit links first, then same-tag/category suggestions.
  const related = [
    ...(r.relatedRecipeIds || []).map(rid => all.find(x => x.recipeId === rid)).filter(Boolean),
    ...all.filter(x => x.recipeId !== r.recipeId &&
      (x.category === r.category || (x.tags || []).some(t => (r.tags || []).includes(t)))),
  ].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 4);

  function ingredientRows(factor) {
    return (r.ingredients || []).map(i => {
      let amount = scaleAmount(i.amount, factor);
      let unit = i.unit;
      ({ amount, unit } = convertUnit(amount, unit, settings.units));
      const inPantry = findPantryMatch(pantryItems, i.name);
      return `
        <li class="ing-row ${i.optional ? 'ing-optional' : ''}">
          <span class="ing-amount">${fmtAmount(amount)} ${esc(unit)}</span>
          <span class="ing-name">${esc(i.name)}${i.optional ? ' <em>(optional)</em>' : ''}
            ${i.notes ? `<small class="ing-note">${esc(i.notes)}</small>` : ''}
            ${(i.substitutions || []).length ? `<small class="ing-note">Substitute: ${esc(i.substitutions.join(', '))}</small>` : ''}
          </span>
          <span class="ing-pantry ${inPantry ? 'in-pantry' : ''}" title="${inPantry ? `In ${esc(inPantry.location)}: ${esc(fmtAmount(inPantry.quantity))} ${esc(inPantry.unit)}` : 'Not in pantry'}">
            ${inPantry ? '✓' : '·'}
          </span>
        </li>`;
    }).join('');
  }

  const nutrition = r.nutrition || {};
  const nutriRows = [['Calories', nutrition.calories, ''], ['Protein', nutrition.protein, 'g'], ['Fat', nutrition.fat, 'g'],
    ['Carbs', nutrition.carbs, 'g'], ['Fibre', nutrition.fibre, 'g'], ['Sugar', nutrition.sugar, 'g']]
    .filter(([, v]) => v != null && v !== '');

  const healthNotes = [['EoE notes', r.eoeNotes], ['Blood sugar', r.bloodSugarNotes], ['Anti-inflammatory', r.antiInflammatoryNotes]]
    .filter(([, v]) => v);
  const storageNotes = [['Storage', r.storage], ['Freezer', r.freezer], ['Reheating', r.reheating]].filter(([, v]) => v);

  main.innerHTML = `
    <article class="recipe-detail printable">
      <nav class="crumbs no-print"><a href="#/recipes">← Recipes</a></nav>

      <header class="recipe-hero">
        ${r.photo ? `<img class="recipe-hero-img" src="${esc(r.photo)}" alt="Photo of ${esc(r.title)}">` : ''}
        <div class="recipe-hero-text">
          <h1>${esc(r.title)}</h1>
          ${r.subtitle ? `<p class="recipe-subtitle">${esc(r.subtitle)}</p>` : ''}
          ${r.description ? `<p class="recipe-desc">${esc(r.description)}</p>` : ''}
          <p class="recipe-meta-chips">
            <span class="chip">${esc(r.category)}</span>
            <span class="chip">${esc(r.cuisine)}</span>
            <span class="chip">${esc(r.mealType)}</span>
            <span class="chip">${esc(r.difficulty)}</span>
            ${(r.tags || []).map(t => `<span class="chip chip-tag">${esc(t)}</span>`).join('')}
          </p>
          <dl class="recipe-times">
            <div><dt>Prep</dt><dd>${r.prepMinutes || 0} min</dd></div>
            <div><dt>Cook</dt><dd>${r.cookMinutes || 0} min</dd></div>
            <div><dt>Total</dt><dd>${r.totalMinutes || 0} min</dd></div>
            <div><dt>Serves</dt><dd>${esc(r.servings)}${r.yield ? ` · ${esc(r.yield)}` : ''}</dd></div>
            ${r.rating ? `<div><dt>Rating</dt><dd>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</dd></div>` : ''}
          </dl>
        </div>
      </header>

      <div class="recipe-actions no-print" role="toolbar" aria-label="Recipe actions">
        <button class="btn ${r.favourite ? 'btn-primary' : 'btn-ghost'}" id="act-fav">${r.favourite ? '★ Favourite' : '☆ Favourite'}</button>
        <a class="btn btn-ghost" href="#/recipe-edit/${esc(r.recipeId)}">Edit</a>
        <button class="btn btn-ghost" id="act-duplicate">Duplicate</button>
        <button class="btn btn-ghost" id="act-plan">Add to plan</button>
        <button class="btn btn-ghost" id="act-shop">＋ Shopping list</button>
        <button class="btn btn-ghost" id="act-print" title="Print, or choose “Save as PDF” in the print dialog">Print / PDF</button>
        <button class="btn btn-ghost" id="act-md">Markdown</button>
        <button class="btn btn-danger-ghost" id="act-delete">Delete</button>
      </div>

      <div class="recipe-columns">
        <section class="recipe-ingredients" aria-labelledby="ing-h">
          <div class="section-head">
            <h2 id="ing-h">Ingredients</h2>
            <div class="scale-control no-print">
              <button class="icon-btn" id="scale-down" aria-label="Fewer servings">−</button>
              <span id="scale-label" aria-live="polite">${scaleServings} servings</span>
              <button class="icon-btn" id="scale-up" aria-label="More servings">＋</button>
            </div>
          </div>
          <ul class="ing-list" id="ing-list">${ingredientRows(1)}</ul>
          <p class="pantry-legend no-print"><span class="in-pantry">✓</span> = in your pantry</p>
        </section>

        <section class="recipe-instructions" aria-labelledby="steps-h">
          <h2 id="steps-h">Instructions</h2>
          <ol class="step-list">
            ${(r.instructions || []).map(s => `
              <li class="step">
                ${s.title ? `<h3 class="step-title">${esc(s.title)}</h3>` : ''}
                <p>${esc(s.instruction)}</p>
                <p class="step-meta">
                  ${s.timerMinutes ? `<span class="chip">⏱ ${s.timerMinutes} min</span>` : ''}
                  ${s.temperature ? `<span class="chip">🌡 ${esc(s.temperature)}</span>` : ''}
                  ${s.equipment ? `<span class="chip">${esc(s.equipment)}</span>` : ''}
                </p>
                ${s.notes ? `<p class="step-note">${esc(s.notes)}</p>` : ''}
              </li>`).join('')}
          </ol>
        </section>
      </div>

      ${nutriRows.length ? `
      <section class="recipe-panel">
        <h2>Nutrition <small>per serving</small></h2>
        <table class="nutri-table"><tbody>
          ${nutriRows.map(([k, v, u]) => `<tr><th scope="row">${k}</th><td>${esc(v)} ${u}</td></tr>`).join('')}
        </tbody></table>
      </section>` : ''}

      ${healthNotes.length ? `
      <section class="recipe-panel recipe-health">
        <h2>Health notes</h2>
        ${healthNotes.map(([k, v]) => `<h3>${k}</h3><p>${esc(v)}</p>`).join('')}
      </section>` : ''}

      ${storageNotes.length ? `
      <section class="recipe-panel">
        <h2>Storage &amp; leftovers</h2>
        ${storageNotes.map(([k, v]) => `<h3>${k}</h3><p>${esc(v)}</p>`).join('')}
      </section>` : ''}

      ${r.notes ? `<section class="recipe-panel"><h2>Notes</h2><p>${esc(r.notes)}</p></section>` : ''}

      <footer class="recipe-foot">
        ${r.source || r.author ? `<p>Source: ${esc(r.source)}${r.author ? ` — ${esc(r.author)}` : ''}</p>` : ''}
        <p>Added ${fmtDate(r.created, true)} · Updated ${fmtDate(r.modified, true)} · v${r.version}</p>
        ${(r.versionHistory || []).length ? `
          <details class="no-print"><summary>Version history</summary>
            <ul>${r.versionHistory.slice().reverse().map(h => `<li>v${h.version} — ${esc(h.note)} <small>(${fmtDate(h.modified)})</small></li>`).join('')}</ul>
          </details>` : ''}
      </footer>

      ${related.length ? `
      <section class="no-print">
        <h2>Related recipes</h2>
        <div class="recipe-grid recipe-grid-sm">${related.map(recipeCardHTML).join('')}</div>
      </section>` : ''}
    </article>
  `;

  /* --- interactions ------------------------------------------------ */
  const repaintIngredients = () => {
    main.querySelector('#ing-list').innerHTML = ingredientRows(scaleServings / (Number(r.servings) || 1));
    main.querySelector('#scale-label').textContent = `${scaleServings} servings`;
  };
  main.querySelector('#scale-down').addEventListener('click', () => { if (scaleServings > 1) { scaleServings--; repaintIngredients(); } });
  main.querySelector('#scale-up').addEventListener('click', () => { scaleServings++; repaintIngredients(); });

  main.querySelector('#act-fav').addEventListener('click', async () => {
    r.favourite = !r.favourite;
    await dbPut('recipes', r);
    toast(r.favourite ? 'Added to favourites' : 'Removed from favourites', 'success');
    renderRecipeDetail(main, { id });
  });

  main.querySelector('#act-duplicate').addEventListener('click', async () => {
    const copy = structuredClone(r);
    copy.recipeId = uid('rec');
    copy.title = `${r.title} (copy)`;
    copy.created = copy.modified = nowISO();
    copy.version = 1; copy.versionHistory = []; copy.favourite = false;
    await dbPut('recipes', copy);
    await logActivity('recipe', `Duplicated recipe “${r.title}”`);
    toast('Recipe duplicated', 'success');
    location.hash = `#/recipe/${copy.recipeId}`;
  });

  main.querySelector('#act-delete').addEventListener('click', async () => {
    if (!await confirmDialog(`Delete “${r.title}”? This cannot be undone.`, { confirmLabel: 'Delete', danger: true })) return;
    await dbDelete('recipes', r.recipeId);
    await logActivity('recipe', `Deleted recipe “${r.title}”`);
    toast('Recipe deleted', 'info');
    location.hash = '#/recipes';
  });

  main.querySelector('#act-print').addEventListener('click', () => window.print());

  main.querySelector('#act-md').addEventListener('click', () => {
    downloadFile(`${r.title.replace(/[^\w-]+/g, '-').toLowerCase() || 'recipe'}.md`, recipeToMarkdown(r), 'text/markdown');
  });

  main.querySelector('#act-shop').addEventListener('click', async () => {
    const items = (r.ingredients || []).filter(i => !i.optional).map(i => ({
      name: i.name, category: i.shoppingCategory || 'Pantry',
      quantity: scaleAmount(i.amount, scaleServings / (Number(r.servings) || 1)), unit: i.unit,
      notes: `For: ${r.title}`,
    }));
    const added = await addItemsToShoppingList('HOUSEHOLD', items);
    toast(`${added} ingredient${added === 1 ? '' : 's'} added to household shopping`, 'success');
  });

  main.querySelector('#act-plan').addEventListener('click', () => quickAddToPlan(r));
}

/** Small dialog: pick a date + meal to plan this recipe (used from detail). */
function quickAddToPlan(recipe) {
  const dlg = openDialog(`
    <form class="dialog-body" id="quick-plan-form">
      <h2 class="dialog-title">Plan “${esc(recipe.title)}”</h2>
      <label>Date <input class="input" type="date" name="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
      <label>Meal
        <select class="input" name="mealType">${MEAL_TYPES.map(m => `<option ${m === recipe.mealType ? 'selected' : ''}>${m}</option>`).join('')}</select>
      </label>
      <label>Servings <input class="input" type="number" name="servings" min="1" value="${esc(recipe.servings || 2)}"></label>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary">Add to plan</button>
      </div>
    </form>`);
  dlg.querySelector('#quick-plan-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    await dbPut('mealPlans', {
      mealPlanId: uid('mp'), date: f.get('date'), mealType: f.get('mealType'),
      recipeId: recipe.recipeId, servings: Number(f.get('servings')) || recipe.servings,
      notes: '', completed: false, batch: false, leftovers: false,
    });
    await logActivity('planner', `Planned “${recipe.title}” for ${f.get('date')}`);
    closeDialog();
    toast('Added to meal plan', 'success');
  });
}

/* ------------------------------------------------------------------ *
 *  Markdown export
 * ------------------------------------------------------------------ */

export function recipeToMarkdown(r) {
  const lines = [`# ${r.title}`];
  if (r.subtitle) lines.push(`*${r.subtitle}*`);
  if (r.description) lines.push('', r.description);
  lines.push('', `**${r.category} · ${r.cuisine} · ${r.difficulty}** — prep ${r.prepMinutes || 0} min, cook ${r.cookMinutes || 0} min, serves ${r.servings}${r.yield ? ` (${r.yield})` : ''}`);
  lines.push('', '## Ingredients', '');
  for (const i of r.ingredients || []) {
    lines.push(`- ${fmtAmount(i.amount)} ${i.unit} ${i.name}${i.optional ? ' *(optional)*' : ''}${i.notes ? ` — ${i.notes}` : ''}`);
  }
  lines.push('', '## Instructions', '');
  (r.instructions || []).forEach((s, idx) => {
    lines.push(`${idx + 1}. ${s.title ? `**${s.title}** — ` : ''}${s.instruction}${s.timerMinutes ? ` *(${s.timerMinutes} min)*` : ''}`);
  });
  const n = r.nutrition || {};
  if (n.calories != null) lines.push('', '## Nutrition (per serving)', '', `Calories ${n.calories} · Protein ${n.protein ?? '–'} g · Fat ${n.fat ?? '–'} g · Carbs ${n.carbs ?? '–'} g · Fibre ${n.fibre ?? '–'} g · Sugar ${n.sugar ?? '–'} g`);
  for (const [h, v] of [['Notes', r.notes], ['EoE notes', r.eoeNotes], ['Blood sugar notes', r.bloodSugarNotes], ['Anti-inflammatory notes', r.antiInflammatoryNotes], ['Storage', r.storage], ['Freezer', r.freezer], ['Reheating', r.reheating]]) {
    if (v) lines.push('', `## ${h}`, '', v);
  }
  if (r.source) lines.push('', `Source: ${r.source}${r.author ? ` — ${r.author}` : ''}`);
  return lines.join('\n') + '\n';
}

/* ------------------------------------------------------------------ *
 *  Editor (create + edit)
 * ------------------------------------------------------------------ */

export async function renderRecipeEditor(main, { id }) {
  const isNew = !id || id === 'new';
  const recipe = isNew ? blankRecipe() : structuredClone(await dbGet('recipes', id));
  if (!recipe) { main.innerHTML = `<p class="empty-state">Recipe not found.</p>`; return; }
  if (!recipe.ingredients.length) recipe.ingredients.push(blankIngredient());
  if (!recipe.instructions.length) recipe.instructions.push(blankStep());

  const opt = (list, sel) => list.map(v => `<option ${v === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');

  main.innerHTML = `
    <form class="recipe-editor" id="recipe-form" novalidate>
      <header class="page-head">
        <h1>${isNew ? 'New recipe' : `Edit: ${esc(recipe.title)}`}</h1>
        <div class="page-actions">
          <a class="btn btn-ghost" href="${isNew ? '#/recipes' : `#/recipe/${esc(recipe.recipeId)}`}">Cancel</a>
          <button class="btn btn-primary" type="submit">Save recipe</button>
        </div>
      </header>

      <div class="form-grid">
        <fieldset class="form-card span-2">
          <legend>Basics</legend>
          <label class="span-2">Title <input class="input" name="title" required value="${esc(recipe.title)}" placeholder="e.g. Roasted squash soup"></label>
          <label class="span-2">Subtitle <input class="input" name="subtitle" value="${esc(recipe.subtitle)}" placeholder="A short tagline"></label>
          <label class="span-2">Description <textarea class="input" name="description" rows="2">${esc(recipe.description)}</textarea></label>
          <label>Category <select class="input" name="category">${opt(CATEGORIES, recipe.category)}</select></label>
          <label>Cuisine <select class="input" name="cuisine">${opt(CUISINES, recipe.cuisine)}</select></label>
          <label>Meal type <select class="input" name="mealType">${opt(MEAL_TYPES, recipe.mealType)}</select></label>
          <label>Difficulty <select class="input" name="difficulty">${opt(DIFFICULTIES, recipe.difficulty)}</select></label>
          <label>Prep (min) <input class="input" type="number" min="0" name="prepMinutes" value="${esc(recipe.prepMinutes)}"></label>
          <label>Cook (min) <input class="input" type="number" min="0" name="cookMinutes" value="${esc(recipe.cookMinutes)}"></label>
          <label>Servings <input class="input" type="number" min="1" name="servings" value="${esc(recipe.servings)}"></label>
          <label>Yield <input class="input" name="yield" value="${esc(recipe.yield)}" placeholder="e.g. 12 muffins"></label>
        </fieldset>

        <fieldset class="form-card span-2">
          <legend>Photo</legend>
          <div class="photo-edit">
            <div class="photo-preview" id="photo-preview">
              ${recipe.photo ? `<img src="${esc(recipe.photo)}" alt="Recipe photo">` : '<span>No photo</span>'}
            </div>
            <div class="photo-btns">
              <label class="btn btn-ghost">Upload photo <input type="file" id="photo-input" accept="image/*" hidden></label>
              <button type="button" class="btn btn-ghost" id="photo-remove" ${recipe.photo ? '' : 'disabled'}>Remove</button>
            </div>
          </div>
        </fieldset>

        <fieldset class="form-card span-2">
          <legend>Ingredients</legend>
          <div id="ing-editor" class="ing-editor"></div>
          <button type="button" class="btn btn-ghost" id="ing-add">＋ Add ingredient</button>
        </fieldset>

        <fieldset class="form-card span-2">
          <legend>Instructions <small class="hint">drag ⠿ to reorder</small></legend>
          <ol id="step-editor" class="step-editor"></ol>
          <button type="button" class="btn btn-ghost" id="step-add">＋ Add step</button>
        </fieldset>

        <fieldset class="form-card">
          <legend>Nutrition (per serving)</legend>
          ${['calories', 'protein', 'fat', 'carbs', 'fibre', 'sugar'].map(k => `
            <label>${sentenceCase(k)}${k === 'calories' ? '' : ' (g)'}
              <input class="input" type="number" step="0.1" min="0" name="n-${k}" value="${esc(recipe.nutrition?.[k] ?? '')}">
            </label>`).join('')}
        </fieldset>

        <fieldset class="form-card">
          <legend>Health notes</legend>
          <label>EoE notes <textarea class="input" name="eoeNotes" rows="2">${esc(recipe.eoeNotes)}</textarea></label>
          <label>Blood sugar notes <textarea class="input" name="bloodSugarNotes" rows="2">${esc(recipe.bloodSugarNotes)}</textarea></label>
          <label>Anti-inflammatory notes <textarea class="input" name="antiInflammatoryNotes" rows="2">${esc(recipe.antiInflammatoryNotes)}</textarea></label>
        </fieldset>

        <fieldset class="form-card">
          <legend>Storage</legend>
          <label>Storage <textarea class="input" name="storage" rows="2">${esc(recipe.storage)}</textarea></label>
          <label>Freezer instructions <textarea class="input" name="freezer" rows="2">${esc(recipe.freezer)}</textarea></label>
          <label>Reheating <textarea class="input" name="reheating" rows="2">${esc(recipe.reheating)}</textarea></label>
        </fieldset>

        <fieldset class="form-card">
          <legend>Extras</legend>
          <label>Notes <textarea class="input" name="notes" rows="2">${esc(recipe.notes)}</textarea></label>
          <label>Tags <input class="input" name="tags" value="${esc((recipe.tags || []).join(', '))}" placeholder="vegan, freezer-friendly, garden">
            <small class="hint">Comma separated. Health tags: ${HEALTH_TAGS.join(', ')}</small></label>
          <label>Search keywords <input class="input" name="searchKeywords" value="${esc((recipe.searchKeywords || []).join(', '))}"></label>
          <label>Source <input class="input" name="source" value="${esc(recipe.source)}"></label>
          <label>Author <input class="input" name="author" value="${esc(recipe.author)}"></label>
          <label>Personal rating
            <select class="input" name="rating">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${n === (recipe.rating || 0) ? 'selected' : ''}>${n ? '★'.repeat(n) : '—'}</option>`).join('')}</select>
          </label>
          <label class="check-label"><input type="checkbox" name="favourite" ${recipe.favourite ? 'checked' : ''}> Favourite</label>
        </fieldset>
      </div>

      <div class="form-footer">
        <button class="btn btn-primary btn-lg" type="submit">Save recipe</button>
      </div>
    </form>
  `;

  /* --- ingredients repeater ---------------------------------------- */
  const ingHost = main.querySelector('#ing-editor');

  function ingRowHTML(i, idx) {
    return `
      <div class="ing-edit-row" data-idx="${idx}">
        <input class="input" data-f="amount" type="number" step="any" min="0" placeholder="Amt" value="${esc(i.amount ?? '')}" aria-label="Amount">
        <input class="input" data-f="unit" placeholder="Unit" value="${esc(i.unit)}" aria-label="Unit" list="unit-list">
        <input class="input ing-name-in" data-f="name" placeholder="Ingredient" value="${esc(i.name)}" aria-label="Ingredient name">
        <input class="input" data-f="notes" placeholder="Notes" value="${esc(i.notes)}" aria-label="Ingredient notes">
        <select class="input" data-f="shoppingCategory" aria-label="Shopping category">
          ${['Produce', 'Bakery', 'Frozen', 'Pantry', 'Dairy', 'Meat & fish', 'Other'].map(c => `<option ${c === (i.shoppingCategory || 'Pantry') ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <label class="check-label sm"><input type="checkbox" data-f="optional" ${i.optional ? 'checked' : ''}> opt.</label>
        <button type="button" class="icon-btn ing-del" aria-label="Remove ingredient">✕</button>
      </div>`;
  }

  function paintIngredients() {
    ingHost.innerHTML = `<datalist id="unit-list">${['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'cups', 'oz', 'lb', 'clove', 'bunch', 'pinch', 'can'].map(u => `<option value="${u}">`).join('')}</datalist>`
      + recipe.ingredients.map(ingRowHTML).join('');
  }
  paintIngredients();

  ingHost.addEventListener('input', e => {
    const row = e.target.closest('.ing-edit-row'); if (!row) return;
    const i = recipe.ingredients[Number(row.dataset.idx)];
    const f = e.target.dataset.f; if (!f) return;
    if (f === 'optional') i.optional = e.target.checked;
    else if (f === 'amount') i.amount = e.target.value === '' ? null : Number(e.target.value);
    else i[f] = e.target.value;
  });
  ingHost.addEventListener('click', e => {
    if (!e.target.closest('.ing-del')) return;
    recipe.ingredients.splice(Number(e.target.closest('.ing-edit-row').dataset.idx), 1);
    if (!recipe.ingredients.length) recipe.ingredients.push(blankIngredient());
    paintIngredients();
  });
  main.querySelector('#ing-add').addEventListener('click', () => {
    recipe.ingredients.push(blankIngredient());
    paintIngredients();
    ingHost.querySelector('.ing-edit-row:last-child .ing-name-in')?.focus();
  });

  /* --- instructions repeater with drag-and-drop reorder ------------- */
  const stepHost = main.querySelector('#step-editor');
  let dragIdx = null;

  function stepRowHTML(s, idx) {
    return `
      <li class="step-edit-row" draggable="true" data-idx="${idx}">
        <span class="drag-handle" aria-hidden="true" title="Drag to reorder">⠿</span>
        <span class="step-num">${idx + 1}</span>
        <div class="step-fields">
          <input class="input" data-f="title" placeholder="Step title (optional)" value="${esc(s.title)}" aria-label="Step ${idx + 1} title">
          <textarea class="input" data-f="instruction" rows="2" placeholder="What to do…" aria-label="Step ${idx + 1} instruction">${esc(s.instruction)}</textarea>
          <div class="step-extra">
            <input class="input" data-f="timerMinutes" type="number" min="0" placeholder="Timer (min)" value="${esc(s.timerMinutes ?? '')}" aria-label="Timer minutes">
            <input class="input" data-f="temperature" placeholder="Temp (e.g. 200 °C)" value="${esc(s.temperature)}" aria-label="Temperature">
            <input class="input" data-f="equipment" placeholder="Equipment" value="${esc(s.equipment)}" aria-label="Equipment">
          </div>
        </div>
        <div class="step-btns">
          <button type="button" class="icon-btn step-up" aria-label="Move step up">↑</button>
          <button type="button" class="icon-btn step-down" aria-label="Move step down">↓</button>
          <button type="button" class="icon-btn step-del" aria-label="Remove step">✕</button>
        </div>
      </li>`;
  }

  function paintSteps() {
    recipe.instructions.forEach((s, i) => { s.stepNumber = i + 1; });
    stepHost.innerHTML = recipe.instructions.map(stepRowHTML).join('');
  }
  paintSteps();

  stepHost.addEventListener('input', e => {
    const row = e.target.closest('.step-edit-row'); if (!row) return;
    const s = recipe.instructions[Number(row.dataset.idx)];
    const f = e.target.dataset.f; if (!f) return;
    s[f] = f === 'timerMinutes' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value;
  });
  stepHost.addEventListener('click', e => {
    const row = e.target.closest('.step-edit-row'); if (!row) return;
    const idx = Number(row.dataset.idx);
    if (e.target.closest('.step-del')) {
      recipe.instructions.splice(idx, 1);
      if (!recipe.instructions.length) recipe.instructions.push(blankStep());
      paintSteps();
    } else if (e.target.closest('.step-up') && idx > 0) {
      [recipe.instructions[idx - 1], recipe.instructions[idx]] = [recipe.instructions[idx], recipe.instructions[idx - 1]];
      paintSteps();
    } else if (e.target.closest('.step-down') && idx < recipe.instructions.length - 1) {
      [recipe.instructions[idx + 1], recipe.instructions[idx]] = [recipe.instructions[idx], recipe.instructions[idx + 1]];
      paintSteps();
    }
  });
  // HTML5 drag-and-drop reorder (keyboard users have the ↑/↓ buttons above).
  stepHost.addEventListener('dragstart', e => {
    const row = e.target.closest('.step-edit-row'); if (!row) return;
    dragIdx = Number(row.dataset.idx);
    e.dataTransfer.effectAllowed = 'move';
    row.classList.add('dragging');
  });
  stepHost.addEventListener('dragover', e => {
    e.preventDefault();
    const row = e.target.closest('.step-edit-row');
    if (!row || dragIdx === null) return;
    const overIdx = Number(row.dataset.idx);
    if (overIdx === dragIdx) return;
    const [moved] = recipe.instructions.splice(dragIdx, 1);
    recipe.instructions.splice(overIdx, 0, moved);
    dragIdx = overIdx;
    paintSteps();
    stepHost.querySelector(`[data-idx="${dragIdx}"]`)?.classList.add('dragging');
  });
  stepHost.addEventListener('dragend', () => {
    dragIdx = null;
    stepHost.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  });
  main.querySelector('#step-add').addEventListener('click', () => {
    recipe.instructions.push(blankStep(recipe.instructions.length + 1));
    paintSteps();
    stepHost.querySelector('.step-edit-row:last-child textarea')?.focus();
  });

  /* --- photo -------------------------------------------------------- */
  main.querySelector('#photo-input').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      recipe.photo = await readImageResized(file);
      main.querySelector('#photo-preview').innerHTML = `<img src="${esc(recipe.photo)}" alt="Recipe photo">`;
      main.querySelector('#photo-remove').disabled = false;
    } catch { toast('Could not read that image', 'error'); }
  });
  main.querySelector('#photo-remove').addEventListener('click', e => {
    recipe.photo = null;
    main.querySelector('#photo-preview').innerHTML = '<span>No photo</span>';
    e.target.disabled = true;
  });

  /* --- save ---------------------------------------------------------- */
  main.querySelector('#recipe-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const title = String(f.get('title')).trim();
    if (!title) { toast('A recipe needs a title', 'warn'); main.querySelector('[name=title]').focus(); return; }

    Object.assign(recipe, {
      title,
      subtitle: f.get('subtitle').trim(), description: f.get('description').trim(),
      category: f.get('category'), cuisine: f.get('cuisine'), mealType: f.get('mealType'), difficulty: f.get('difficulty'),
      prepMinutes: Number(f.get('prepMinutes')) || 0, cookMinutes: Number(f.get('cookMinutes')) || 0,
      servings: Number(f.get('servings')) || 1, yield: f.get('yield').trim(),
      notes: f.get('notes').trim(), eoeNotes: f.get('eoeNotes').trim(),
      bloodSugarNotes: f.get('bloodSugarNotes').trim(), antiInflammatoryNotes: f.get('antiInflammatoryNotes').trim(),
      storage: f.get('storage').trim(), freezer: f.get('freezer').trim(), reheating: f.get('reheating').trim(),
      source: f.get('source').trim(), author: f.get('author').trim(),
      rating: Number(f.get('rating')) || 0, favourite: f.get('favourite') === 'on',
      tags: String(f.get('tags')).split(',').map(t => norm(t)).filter(Boolean),
      searchKeywords: String(f.get('searchKeywords')).split(',').map(t => t.trim()).filter(Boolean),
      nutrition: Object.fromEntries(['calories', 'protein', 'fat', 'carbs', 'fibre', 'sugar']
        .map(k => [k, f.get(`n-${k}`) === '' ? null : Number(f.get(`n-${k}`))])),
    });
    recipe.ingredients = recipe.ingredients.filter(i => i.name.trim());
    recipe.instructions = recipe.instructions.filter(s => s.instruction.trim());

    await saveRecipeRecord(recipe, isNew ? 'Created' : 'Edited');
    await logActivity('recipe', `${isNew ? 'Added' : 'Updated'} recipe “${recipe.title}”`);
    toast('Recipe saved', 'success');
    location.hash = `#/recipe/${recipe.recipeId}`;
  });
}
