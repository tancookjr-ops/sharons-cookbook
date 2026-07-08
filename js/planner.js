/**
 * planner.js — meal planner: day / week / month views.
 *
 * Route: #/planner
 *
 * Features:
 *  - four meal slots per day (Breakfast, Lunch, Dinner, Snack)
 *  - click a slot to pick a recipe, or drag a recipe from the tray onto it
 *  - per-entry servings, notes, completed / batch-cooking / leftovers flags
 *  - auto grocery generation: aggregates ingredients for a date range,
 *    subtracts what the pantry already holds, and writes the remainder to
 *    the HOUSEHOLD shopping list (never Botanicals).
 *
 * Meal plan schema (stable): { mealPlanId, date "YYYY-MM-DD", mealType,
 *   recipeId, servings, notes, completed, batch, leftovers }
 */

import { dbGet, dbGetAll, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, esc, norm, todayISO, addDays, weekStart, fromDateISO, toDateISO, fmtDate,
  scaleAmount, fmtAmount, sortBy, toast, openDialog, closeDialog, debounce,
} from './utilities.js';
import { MEAL_TYPES, findPantryMatch } from './recipes.js';
import { addItemsToShoppingList } from './shopping.js';

/** View state survives route changes within a session. */
const state = {
  mode: 'week',          // 'day' | 'week' | 'month'
  anchor: todayISO(),    // the date the view is centred on
};

/* ------------------------------------------------------------------ *
 *  Data helpers
 * ------------------------------------------------------------------ */

/** Meal plan entries for [start, end] inclusive, with recipes attached. */
export async function plansInRange(start, end) {
  const [plans, recipes] = await Promise.all([dbGetAll('mealPlans'), dbGetAll('recipes')]);
  const byId = new Map(recipes.map(r => [r.recipeId, r]));
  return plans
    .filter(p => p.date >= start && p.date <= end)
    .map(p => ({ ...p, recipe: byId.get(p.recipeId) || null }));
}

async function createEntry(date, mealType, recipe, servings) {
  const entry = {
    mealPlanId: uid('mp'), date, mealType,
    recipeId: recipe.recipeId,
    servings: Number(servings) || Number(recipe.servings) || 2,
    notes: '', completed: false, batch: false, leftovers: false,
  };
  await dbPut('mealPlans', entry);
  await logActivity('planner', `Planned “${recipe.title}” for ${fmtDate(date)}`);
  return entry;
}

/* ------------------------------------------------------------------ *
 *  Main view
 * ------------------------------------------------------------------ */

export async function renderPlanner(main) {
  const range = viewRange();
  const [entries, recipes] = await Promise.all([
    plansInRange(range.start, range.end),
    dbGetAll('recipes'),
  ]);

  main.innerHTML = `
    <header class="page-head">
      <h1>Meal planner</h1>
      <div class="page-actions">
        <button class="btn btn-ghost" id="gen-groceries" title="Add missing ingredients for this ${state.mode} to household shopping">🧺 Generate groceries</button>
      </div>
    </header>

    <div class="planner-toolbar" role="toolbar" aria-label="Planner navigation">
      <div class="seg" role="group" aria-label="View mode">
        ${['day', 'week', 'month'].map(m =>
          `<button class="seg-btn ${state.mode === m ? 'active' : ''}" data-mode="${m}" aria-pressed="${state.mode === m}">${m[0].toUpperCase() + m.slice(1)}</button>`).join('')}
      </div>
      <div class="planner-nav">
        <button class="icon-btn" id="nav-prev" aria-label="Previous ${state.mode}">‹</button>
        <button class="btn btn-ghost btn-sm" id="nav-today">Today</button>
        <button class="icon-btn" id="nav-next" aria-label="Next ${state.mode}">›</button>
        <span class="planner-range" aria-live="polite">${rangeLabel(range)}</span>
      </div>
    </div>

    <div class="planner-layout">
      <div class="planner-grid-wrap" id="planner-grid">${gridHTML(range, entries)}</div>

      <aside class="recipe-tray no-print" aria-label="Recipe tray — drag recipes onto the plan">
        <h2>Recipes <small class="hint">drag onto a slot</small></h2>
        <input type="search" class="input" id="tray-search" placeholder="Filter recipes…" aria-label="Filter recipe tray">
        <ul class="tray-list" id="tray-list"></ul>
      </aside>
    </div>
  `;

  /* --- recipe tray ---------------------------------------------------- */
  const trayList = main.querySelector('#tray-list');
  function paintTray(q = '') {
    const shown = sortBy(recipes.filter(r => !q || norm(r.title).includes(norm(q))), r => norm(r.title)).slice(0, 60);
    trayList.innerHTML = shown.map(r => `
      <li class="tray-item" draggable="true" data-rid="${esc(r.recipeId)}">
        <span class="tray-title">${esc(r.title)}</span>
        <small>${esc(r.mealType)} · ${r.totalMinutes || 0} min</small>
      </li>`).join('') || '<li class="hint">No recipes match.</li>';
  }
  paintTray();
  main.querySelector('#tray-search').addEventListener('input', debounce(e => paintTray(e.target.value), 120));

  trayList.addEventListener('dragstart', e => {
    const item = e.target.closest('.tray-item'); if (!item) return;
    e.dataTransfer.setData('text/recipe-id', item.dataset.rid);
    e.dataTransfer.effectAllowed = 'copy';
  });

  /* --- grid: drop targets + slot clicks -------------------------------- */
  const grid = main.querySelector('#planner-grid');

  grid.addEventListener('dragover', e => {
    const slot = e.target.closest('.plan-slot');
    if (slot) { e.preventDefault(); slot.classList.add('drop-target'); }
  });
  grid.addEventListener('dragleave', e => e.target.closest('.plan-slot')?.classList.remove('drop-target'));
  grid.addEventListener('drop', async e => {
    const slot = e.target.closest('.plan-slot'); if (!slot) return;
    e.preventDefault();
    slot.classList.remove('drop-target');
    const rid = e.dataTransfer.getData('text/recipe-id'); if (!rid) return;
    const recipe = recipes.find(r => r.recipeId === rid); if (!recipe) return;
    await createEntry(slot.dataset.date, slot.dataset.meal, recipe);
    renderPlanner(main);
  });

  grid.addEventListener('click', async e => {
    const chip = e.target.closest('.plan-entry');
    if (chip) { entryDialog(chip.dataset.eid, () => renderPlanner(main)); return; }
    const addBtn = e.target.closest('.plan-add');
    if (addBtn) {
      const slot = addBtn.closest('.plan-slot');
      pickRecipeDialog(recipes, slot.dataset.date, slot.dataset.meal, () => renderPlanner(main));
      return;
    }
    const dayCell = e.target.closest('.month-day');
    if (dayCell) { state.mode = 'day'; state.anchor = dayCell.dataset.date; renderPlanner(main); }
  });

  /* --- toolbar ---------------------------------------------------------- */
  main.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode; renderPlanner(main);
  }));
  const step = { day: 1, week: 7, month: 0 }[state.mode];
  main.querySelector('#nav-prev').addEventListener('click', () => { shiftAnchor(-1, step); renderPlanner(main); });
  main.querySelector('#nav-next').addEventListener('click', () => { shiftAnchor(1, step); renderPlanner(main); });
  main.querySelector('#nav-today').addEventListener('click', () => { state.anchor = todayISO(); renderPlanner(main); });

  main.querySelector('#gen-groceries').addEventListener('click', () => generateGroceries(range));
}

function shiftAnchor(dir, step) {
  if (step) { state.anchor = addDays(state.anchor, dir * step); return; }
  const d = fromDateISO(state.anchor);       // month mode
  d.setMonth(d.getMonth() + dir, 1);
  state.anchor = toDateISO(d);
}

/** Start/end dates for the current view. */
function viewRange() {
  if (state.mode === 'day') return { start: state.anchor, end: state.anchor };
  if (state.mode === 'week') { const s = weekStart(state.anchor); return { start: s, end: addDays(s, 6) }; }
  const d = fromDateISO(state.anchor);
  const start = toDateISO(new Date(d.getFullYear(), d.getMonth(), 1));
  const end = toDateISO(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  return { start, end };
}

function rangeLabel({ start, end }) {
  if (state.mode === 'day') return fmtDate(start, true);
  if (state.mode === 'week') return `${fmtDate(start)} – ${fmtDate(end)}`;
  return fromDateISO(start).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
}

/* ------------------------------------------------------------------ *
 *  Grid rendering
 * ------------------------------------------------------------------ */

function entryChip(p) {
  const flags = [p.batch ? '🍲×' : '', p.leftovers ? '↩' : '', p.completed ? '✓' : ''].filter(Boolean).join(' ');
  return `
    <button class="plan-entry ${p.completed ? 'done' : ''}" data-eid="${esc(p.mealPlanId)}"
            title="${esc(p.recipe ? p.recipe.title : 'Missing recipe')}${p.notes ? ` — ${esc(p.notes)}` : ''}">
      <span class="plan-entry-title">${esc(p.recipe ? p.recipe.title : '(recipe removed)')}</span>
      <small>${p.servings} serv${flags ? ` · ${flags}` : ''}</small>
    </button>`;
}

function slotHTML(date, meal, entries) {
  const inSlot = entries.filter(p => p.date === date && p.mealType === meal);
  return `
    <div class="plan-slot" data-date="${date}" data-meal="${meal}">
      ${inSlot.map(entryChip).join('')}
      <button class="plan-add" aria-label="Add ${meal} on ${fmtDate(date)}">＋</button>
    </div>`;
}

function gridHTML(range, entries) {
  if (state.mode === 'month') return monthHTML(range, entries);
  const days = [];
  for (let d = range.start; d <= range.end; d = addDays(d, 1)) days.push(d);
  const today = todayISO();
  return `
    <table class="planner-grid" role="grid">
      <thead><tr>
        <th scope="col" class="meal-col-head"><span class="sr-only">Meal</span></th>
        ${days.map(d => `<th scope="col" class="${d === today ? 'is-today' : ''}">${fmtDate(d)}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${MEAL_TYPES.map(meal => `
          <tr>
            <th scope="row" class="meal-row-head">${meal}</th>
            ${days.map(d => `<td class="${d === today ? 'is-today' : ''}">${slotHTML(d, meal, entries)}</td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function monthHTML(range, entries) {
  const first = fromDateISO(range.start);
  const lead = (first.getDay() + 6) % 7; // blanks before the 1st (Mon start)
  const daysInMonth = fromDateISO(range.end).getDate();
  const today = todayISO();
  let cells = '<div class="month-blank"></div>'.repeat(lead);
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toDateISO(new Date(first.getFullYear(), first.getMonth(), day));
    const dayEntries = entries.filter(p => p.date === iso);
    cells += `
      <button class="month-day ${iso === today ? 'is-today' : ''}" data-date="${iso}" aria-label="${fmtDate(iso, true)}, ${dayEntries.length} meals planned">
        <span class="month-num">${day}</span>
        ${dayEntries.slice(0, 3).map(p => `<span class="month-dot" title="${esc(p.recipe?.title || '')}">${esc((p.recipe?.title || '?').slice(0, 14))}</span>`).join('')}
        ${dayEntries.length > 3 ? `<span class="month-more">+${dayEntries.length - 3}</span>` : ''}
      </button>`;
  }
  return `
    <div class="month-grid">
      ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="month-head">${d}</div>`).join('')}
      ${cells}
    </div>
    <p class="hint">Click a day to open it in the day view.</p>`;
}

/* ------------------------------------------------------------------ *
 *  Dialogs
 * ------------------------------------------------------------------ */

/** Recipe picker for a slot (search + click). */
function pickRecipeDialog(recipes, date, meal, onDone) {
  const dlg = openDialog(`
    <div class="dialog-body">
      <h2 class="dialog-title">${esc(meal)} — ${fmtDate(date, true)}</h2>
      <input type="search" class="input" id="pick-search" placeholder="Search recipes…" autofocus>
      <ul class="pick-list" id="pick-list"></ul>
      <div class="dialog-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button></div>
    </div>`, { wide: true });

  const list = dlg.querySelector('#pick-list');
  const paint = (q = '') => {
    const shown = sortBy(recipes.filter(r => !q || norm(r.title).includes(norm(q))), r => norm(r.title)).slice(0, 40);
    list.innerHTML = shown.map(r => `
      <li><button class="pick-item" data-rid="${esc(r.recipeId)}">
        <strong>${esc(r.title)}</strong> <small>${esc(r.category)} · ${r.totalMinutes || 0} min · serves ${esc(r.servings)}</small>
      </button></li>`).join('') || '<li class="hint">No matches.</li>';
  };
  paint();
  dlg.querySelector('#pick-search').addEventListener('input', debounce(e => paint(e.target.value), 120));
  list.addEventListener('click', async e => {
    const btn = e.target.closest('.pick-item'); if (!btn) return;
    const recipe = recipes.find(r => r.recipeId === btn.dataset.rid);
    await createEntry(date, meal, recipe);
    closeDialog();
    onDone();
  });
}

/** Edit one planned meal: servings, notes, flags, remove. */
async function entryDialog(mealPlanId, onDone) {
  const entry = await dbGet('mealPlans', mealPlanId);
  if (!entry) return;
  const recipe = entry.recipeId ? await dbGet('recipes', entry.recipeId) : null;

  const dlg = openDialog(`
    <form class="dialog-body" id="entry-form">
      <h2 class="dialog-title">${esc(recipe?.title || 'Planned meal')}</h2>
      <p class="hint">${esc(entry.mealType)} · ${fmtDate(entry.date, true)}
        ${recipe ? ` · <a href="#/recipe/${esc(recipe.recipeId)}" data-close>open recipe</a>` : ''}</p>
      <div class="dialog-row">
        <label>Servings <input class="input" type="number" name="servings" min="1" value="${esc(entry.servings)}"></label>
        <label>Date <input class="input" type="date" name="date" value="${esc(entry.date)}"></label>
      </div>
      <label>Meal <select class="input" name="mealType">${MEAL_TYPES.map(m => `<option ${m === entry.mealType ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
      <label>Notes <textarea class="input" name="notes" rows="2" placeholder="e.g. double batch for the freezer">${esc(entry.notes)}</textarea></label>
      <div class="flag-row">
        <label class="check-label"><input type="checkbox" name="completed" ${entry.completed ? 'checked' : ''}> Cooked ✓</label>
        <label class="check-label"><input type="checkbox" name="batch" ${entry.batch ? 'checked' : ''}> Batch cooking</label>
        <label class="check-label"><input type="checkbox" name="leftovers" ${entry.leftovers ? 'checked' : ''}> Leftovers meal</label>
      </div>
      <p class="hint">Leftovers meals are skipped by grocery generation.</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-danger-ghost" id="entry-remove">Remove</button>
        <span class="spacer"></span>
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </form>`);

  dlg.querySelector('#entry-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    Object.assign(entry, {
      servings: Number(f.get('servings')) || 1,
      date: f.get('date'), mealType: f.get('mealType'),
      notes: String(f.get('notes')).trim(),
      completed: f.get('completed') === 'on',
      batch: f.get('batch') === 'on',
      leftovers: f.get('leftovers') === 'on',
    });
    await dbPut('mealPlans', entry);
    closeDialog();
    onDone();
  });
  dlg.querySelector('#entry-remove').addEventListener('click', async () => {
    await dbDelete('mealPlans', mealPlanId);
    closeDialog();
    onDone();
  });
}

/* ------------------------------------------------------------------ *
 *  Auto grocery generation
 * ------------------------------------------------------------------ */

/**
 * Aggregate every ingredient needed for planned (non-leftover, non-completed)
 * meals in the range, scaled to planned servings; subtract pantry stock where
 * units match; add the shortfall to the HOUSEHOLD shopping list.
 */
async function generateGroceries(range) {
  const [entries, pantry] = await Promise.all([plansInRange(range.start, range.end), dbGetAll('pantry')]);
  const toCook = entries.filter(p => p.recipe && !p.leftovers && !p.completed);
  if (!toCook.length) { toast('No planned meals to shop for in this view', 'warn'); return; }

  // Aggregate by (normalized name, unit).
  const needed = new Map();
  for (const p of toCook) {
    const factor = (Number(p.servings) || 1) / (Number(p.recipe.servings) || 1);
    for (const ing of p.recipe.ingredients || []) {
      if (!ing.name?.trim() || ing.optional) continue;
      const key = `${norm(ing.name)}|${norm(ing.unit)}`;
      const cur = needed.get(key) || { name: ing.name, unit: ing.unit, category: ing.shoppingCategory || 'Pantry', quantity: 0, hasAmount: false };
      if (ing.amount != null) { cur.quantity += Number(scaleAmount(ing.amount, factor)) || 0; cur.hasAmount = true; }
      needed.set(key, cur);
    }
  }

  // Subtract pantry stock (only when the unit matches — no unit guessing).
  const items = [];
  let skipped = 0;
  for (const need of needed.values()) {
    const match = findPantryMatch(pantry, need.name);
    if (match && norm(match.unit) === norm(need.unit) && need.hasAmount && Number(match.quantity) >= need.quantity) {
      skipped++;
      continue; // fully covered by pantry
    }
    const shortfall = match && norm(match.unit) === norm(need.unit) && need.hasAmount
      ? Math.max(0, need.quantity - (Number(match.quantity) || 0))
      : need.quantity;
    items.push({
      name: need.name, unit: need.unit, category: need.category,
      quantity: need.hasAmount ? Math.round(shortfall * 100) / 100 : null,
      notes: 'From meal plan',
    });
  }

  if (!items.length) { toast('Pantry already covers everything planned 🎉', 'success'); return; }
  const added = await addItemsToShoppingList('HOUSEHOLD', items);
  toast(`${added} item${added === 1 ? '' : 's'} added to household shopping${skipped ? ` (${skipped} already in pantry)` : ''}`, 'success');
}
