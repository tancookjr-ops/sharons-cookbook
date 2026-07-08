/**
 * garden.js — plant database, planting schedule, harvest tracker,
 * preservation notes, seasonal calendar and "recipes by harvest".
 *
 * Route: #/garden
 *
 * Garden entry schema (stable): { gardenItemId, plantName, variety, location,
 *   plantDate, harvestDate, quantity, unit, notes, preservation[],
 *   harvests: [{ date, quantity, unit, notes }], created, modified }
 *
 * `harvests` is the running log; `quantity` mirrors the season total so the
 * simple AI-import shape ("Harvested six tomatoes") stays valid.
 */

import { dbGetAll, dbGet, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, esc, norm, nowISO, todayISO, fmtDate, fmtAmount, fromDateISO,
  sortBy, toast, confirmDialog, openDialog, closeDialog, seasonOf,
} from './utilities.js';

export const PRESERVATION_METHODS = ['Freezing', 'Drying', 'Fermentation', 'Canning', 'Root cellar'];

/* ------------------------------------------------------------------ *
 *  Helpers (dashboard uses recentHarvests)
 * ------------------------------------------------------------------ */

/** Flattened harvest log entries across all plants, newest first. */
export function recentHarvests(gardenItems, limit = 6) {
  const all = [];
  for (const g of gardenItems) {
    for (const h of g.harvests || []) all.push({ plant: g.plantName, ...h });
  }
  return sortBy(all, h => h.date, true).slice(0, limit);
}

/** Recipes whose ingredient list mentions this plant. */
function recipesUsing(recipes, plantName) {
  const n = norm(plantName);
  if (!n) return [];
  return recipes.filter(r => (r.ingredients || []).some(i => {
    const inorm = norm(i.name);
    return inorm.includes(n) || n.includes(inorm.replace(/s$/, ''));
  })).slice(0, 6);
}

/* ------------------------------------------------------------------ *
 *  View
 * ------------------------------------------------------------------ */

const state = { tab: 'plants' }; // 'plants' | 'calendar'

export async function renderGarden(main) {
  const [items, recipes] = await Promise.all([dbGetAll('garden'), dbGetAll('recipes')]);
  const season = seasonOf();

  main.innerHTML = `
    <header class="page-head">
      <div>
        <h1>Garden</h1>
        <p class="page-sub">It's ${season.toLowerCase()} — ${seasonHint(season)}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="garden-add">＋ Add planting</button>
      </div>
    </header>

    <div class="seg" role="tablist" aria-label="Garden views">
      <button class="seg-btn ${state.tab === 'plants' ? 'active' : ''}" role="tab" aria-selected="${state.tab === 'plants'}" data-tab="plants">Plants &amp; harvests</button>
      <button class="seg-btn ${state.tab === 'calendar' ? 'active' : ''}" role="tab" aria-selected="${state.tab === 'calendar'}" data-tab="calendar">Seasonal calendar</button>
    </div>

    <div id="garden-body"></div>
  `;

  const body = main.querySelector('#garden-body');

  function paintPlants() {
    if (!items.length) {
      body.innerHTML = `<div class="empty-state"><p>No plantings yet. Add what's in the ground (or planned) and log harvests as they come in.</p></div>`;
      return;
    }
    body.innerHTML = `<div class="garden-grid">` + sortBy(items, g => norm(g.plantName)).map(g => {
      const total = (g.harvests || []).reduce((s, h) => s + (Number(h.quantity) || 0), 0);
      const linked = recipesUsing(recipes, g.plantName);
      return `
        <article class="garden-card" data-id="${esc(g.gardenItemId)}">
          <header class="garden-card-head">
            <h2>${esc(g.plantName)}${g.variety ? ` <small>${esc(g.variety)}</small>` : ''}</h2>
            <div class="row-btns">
              <button class="icon-btn g-edit" aria-label="Edit ${esc(g.plantName)}">✎</button>
              <button class="icon-btn g-del" aria-label="Delete ${esc(g.plantName)}">✕</button>
            </div>
          </header>
          <dl class="garden-facts">
            ${g.location ? `<div><dt>Location</dt><dd>${esc(g.location)}</dd></div>` : ''}
            ${g.plantDate ? `<div><dt>Planted</dt><dd>${fmtDate(g.plantDate)}</dd></div>` : ''}
            ${g.harvestDate ? `<div><dt>Expected harvest</dt><dd>${fmtDate(g.harvestDate)}</dd></div>` : ''}
            <div><dt>Harvested</dt><dd>${total ? `${fmtAmount(total)} ${esc(g.unit || '')}` : '—'}</dd></div>
          </dl>
          ${(g.preservation || []).length ? `<p class="garden-chips">${g.preservation.map(p => `<span class="chip chip-tag">${esc(p)}</span>`).join('')}</p>` : ''}
          ${g.notes ? `<p class="garden-notes">${esc(g.notes)}</p>` : ''}
          ${(g.harvests || []).length ? `
            <details class="garden-log"><summary>Harvest log (${g.harvests.length})</summary>
              <ul>${sortBy(g.harvests, h => h.date, true).map(h =>
                `<li>${fmtDate(h.date)} — ${fmtAmount(h.quantity)} ${esc(h.unit || g.unit || '')}${h.notes ? ` · ${esc(h.notes)}` : ''}</li>`).join('')}</ul>
            </details>` : ''}
          ${linked.length ? `
            <p class="garden-recipes"><strong>Cook with it:</strong>
              ${linked.map(r => `<a href="#/recipe/${esc(r.recipeId)}">${esc(r.title)}</a>`).join(' · ')}</p>` : ''}
          <button class="btn btn-ghost btn-sm g-harvest">＋ Log harvest</button>
        </article>`;
    }).join('') + `</div>`;
  }

  function paintCalendar() {
    // 12-month strip per plant: ▒ planted-to-harvest window, ● logged harvests.
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const rows = sortBy(items, g => norm(g.plantName)).map(g => {
      const plantM = g.plantDate ? fromDateISO(g.plantDate).getMonth() : null;
      const harvM = g.harvestDate ? fromDateISO(g.harvestDate).getMonth() : null;
      const harvestMonths = new Set((g.harvests || []).map(h => fromDateISO(h.date).getMonth()));
      const cells = months.map((m, idx) => {
        const inWindow = plantM != null && harvM != null && idx >= plantM && idx <= harvM;
        const cls = harvestMonths.has(idx) ? 'cal-harvest' : inWindow ? 'cal-window' : plantM === idx ? 'cal-window' : '';
        return `<td class="${cls}" title="${esc(g.plantName)} — ${['January','February','March','April','May','June','July','August','September','October','November','December'][idx]}">${harvestMonths.has(idx) ? '●' : ''}</td>`;
      }).join('');
      return `<tr><th scope="row">${esc(g.plantName)}</th>${cells}</tr>`;
    }).join('');
    body.innerHTML = items.length ? `
      <div class="table-scroll">
        <table class="cal-table">
          <thead><tr><th scope="col">Plant</th>${months.map(m => `<th scope="col">${m}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="hint">Shaded = planting-to-harvest window · ● = logged harvest</p>`
      : `<div class="empty-state"><p>Add plantings with dates to see the seasonal calendar.</p></div>`;
  }

  const paint = () => state.tab === 'plants' ? paintPlants() : paintCalendar();
  paint();

  main.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    state.tab = b.dataset.tab; renderGarden(main);
  }));
  main.querySelector('#garden-add').addEventListener('click', () => plantDialog(null, () => renderGarden(main)));

  body.addEventListener('click', async e => {
    const card = e.target.closest('.garden-card'); if (!card) return;
    const g = items.find(x => x.gardenItemId === card.dataset.id);
    if (e.target.closest('.g-edit')) plantDialog(g, () => renderGarden(main));
    else if (e.target.closest('.g-harvest')) harvestDialog(g, () => renderGarden(main));
    else if (e.target.closest('.g-del')) {
      if (!await confirmDialog(`Delete “${g.plantName}” and its harvest log?`, { confirmLabel: 'Delete', danger: true })) return;
      await dbDelete('garden', g.gardenItemId);
      await logActivity('garden', `Removed garden entry “${g.plantName}”`);
      renderGarden(main);
    }
  });
}

function seasonHint(season) {
  return {
    Spring: 'time to start seeds and plan the beds.',
    Summer: 'peak growing — log harvests as they come in.',
    Autumn: 'harvest, preserve, and put the beds to rest.',
    Winter: 'plan next year and cook from the freezer.',
  }[season];
}

/* ------------------------------------------------------------------ *
 *  Dialogs
 * ------------------------------------------------------------------ */

function plantDialog(item, onDone) {
  const isNew = !item;
  const g = item || {
    gardenItemId: uid('gar'), plantName: '', variety: '', location: '',
    plantDate: null, harvestDate: null, quantity: 0, unit: '',
    notes: '', preservation: [], harvests: [],
    created: nowISO(), modified: nowISO(),
  };

  const dlg = openDialog(`
    <form class="dialog-body" id="plant-form">
      <h2 class="dialog-title">${isNew ? 'Add planting' : `Edit “${esc(g.plantName)}”`}</h2>
      <div class="dialog-row">
        <label>Plant <input class="input" name="plantName" required value="${esc(g.plantName)}" placeholder="Tomato"></label>
        <label>Variety <input class="input" name="variety" value="${esc(g.variety)}" placeholder="San Marzano"></label>
      </div>
      <label>Location <input class="input" name="location" value="${esc(g.location)}" placeholder="Bed 2, greenhouse…"></label>
      <div class="dialog-row">
        <label>Planted <input class="input" name="plantDate" type="date" value="${esc(g.plantDate ?? '')}"></label>
        <label>Expected harvest <input class="input" name="harvestDate" type="date" value="${esc(g.harvestDate ?? '')}"></label>
      </div>
      <label>Harvest unit <input class="input" name="unit" value="${esc(g.unit)}" placeholder="kg, bunches, count…"></label>
      <fieldset class="check-fieldset"><legend>Preservation plans</legend>
        ${PRESERVATION_METHODS.map(p => `<label class="check-label"><input type="checkbox" name="pres" value="${p}" ${(g.preservation || []).includes(p) ? 'checked' : ''}> ${p}</label>`).join('')}
      </fieldset>
      <label>Notes <textarea class="input" name="notes" rows="2">${esc(g.notes)}</textarea></label>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary">${isNew ? 'Add planting' : 'Save'}</button>
      </div>
    </form>`);

  dlg.querySelector('#plant-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    Object.assign(g, {
      plantName: String(f.get('plantName')).trim(),
      variety: String(f.get('variety')).trim(), location: String(f.get('location')).trim(),
      plantDate: f.get('plantDate') || null, harvestDate: f.get('harvestDate') || null,
      unit: String(f.get('unit')).trim(), notes: String(f.get('notes')).trim(),
      preservation: f.getAll('pres'), modified: nowISO(),
    });
    if (!g.plantName) return;
    await dbPut('garden', g);
    await logActivity('garden', `${isNew ? 'Added' : 'Updated'} garden entry “${g.plantName}”`);
    closeDialog();
    onDone();
  });
}

function harvestDialog(g, onDone) {
  const dlg = openDialog(`
    <form class="dialog-body" id="harvest-form">
      <h2 class="dialog-title">Log harvest — ${esc(g.plantName)}</h2>
      <div class="dialog-row">
        <label>Date <input class="input" name="date" type="date" value="${todayISO()}" required></label>
        <label>Quantity <input class="input" name="quantity" type="number" step="any" min="0" required autofocus></label>
      </div>
      <label>Unit <input class="input" name="unit" value="${esc(g.unit)}" placeholder="kg, bunches, count…"></label>
      <label>Notes <input class="input" name="notes" placeholder="e.g. best of the season"></label>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary">Log harvest</button>
      </div>
    </form>`);

  dlg.querySelector('#harvest-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    g.harvests = g.harvests || [];
    g.harvests.push({
      date: f.get('date'), quantity: Number(f.get('quantity')) || 0,
      unit: String(f.get('unit')).trim(), notes: String(f.get('notes')).trim(),
    });
    g.quantity = g.harvests.reduce((s, h) => s + (Number(h.quantity) || 0), 0);
    g.modified = nowISO();
    await dbPut('garden', g);
    await logActivity('garden', `Harvested ${f.get('quantity')} ${f.get('unit') || ''} ${g.plantName}`.trim());
    closeDialog();
    toast('Harvest logged', 'success');
    onDone();
  });
}
