/**
 * pantry.js — pantry / fridge / freezer / garden-harvest / bulk inventory.
 *
 * Route: #/pantry
 *
 * Item schema (stable): { pantryItemId, name, category, quantity, unit,
 *   minimum, maximum, expiry "YYYY-MM-DD"|null, location, purchaseDate,
 *   cost, supplier, notes, created, modified }
 *
 * Alert logic (shared with the dashboard via pantryAlerts()):
 *  - expired:   expiry < today
 *  - expiring:  expiry within 7 days
 *  - low stock: quantity <= minimum (when a minimum is set)
 */

import { dbGetAll, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, esc, norm, nowISO, todayISO, daysUntil, fmtDate, fmtAmount,
  sortBy, groupBy, toast, confirmDialog, openDialog, closeDialog, debounce,
} from './utilities.js';
import { addItemsToShoppingList } from './shopping.js';

export const LOCATIONS = ['Pantry', 'Fridge', 'Freezer', 'Garden harvest', 'Bulk storage'];
export const PANTRY_CATEGORIES = ['Produce', 'Dairy', 'Meat & fish', 'Grains', 'Legumes', 'Baking', 'Spices', 'Oils & vinegars', 'Canned', 'Frozen', 'Preserves', 'Other'];

/* ------------------------------------------------------------------ *
 *  Alerts (exported for the dashboard)
 * ------------------------------------------------------------------ */

/** Classify pantry items into alert buckets. */
export function pantryAlerts(items) {
  const alerts = { expired: [], expiring: [], low: [] };
  for (const i of items) {
    if (i.expiry) {
      const d = daysUntil(i.expiry);
      if (d < 0) alerts.expired.push(i);
      else if (d <= 7) alerts.expiring.push(i);
    }
    if (i.minimum != null && i.minimum !== '' && Number(i.quantity) <= Number(i.minimum)) alerts.low.push(i);
  }
  return alerts;
}

/* ------------------------------------------------------------------ *
 *  View
 * ------------------------------------------------------------------ */

const state = { location: 'Pantry', q: '' };

export async function renderPantry(main) {
  const items = await dbGetAll('pantry');
  const alerts = pantryAlerts(items);

  main.innerHTML = `
    <header class="page-head">
      <h1>Pantry</h1>
      <div class="page-actions">
        ${alerts.low.length ? `<button class="btn btn-ghost" id="low-to-shop">🧺 Shop low stock (${alerts.low.length})</button>` : ''}
        <button class="btn btn-primary" id="pantry-add">＋ Add item</button>
      </div>
    </header>

    ${(alerts.expired.length || alerts.expiring.length || alerts.low.length) ? `
    <div class="alert-strip" role="status">
      ${alerts.expired.length ? `<span class="alert-pill alert-danger">⚠ ${alerts.expired.length} expired</span>` : ''}
      ${alerts.expiring.length ? `<span class="alert-pill alert-warn">${alerts.expiring.length} expiring soon</span>` : ''}
      ${alerts.low.length ? `<span class="alert-pill alert-info">${alerts.low.length} low stock</span>` : ''}
    </div>` : ''}

    <div class="pantry-toolbar">
      <div class="seg" role="tablist" aria-label="Storage location">
        ${LOCATIONS.map(loc => {
          const n = items.filter(i => i.location === loc).length;
          return `<button class="seg-btn ${state.location === loc ? 'active' : ''}" role="tab" aria-selected="${state.location === loc}" data-loc="${esc(loc)}">${esc(loc)}${n ? ` <small>${n}</small>` : ''}</button>`;
        }).join('')}
      </div>
      <input type="search" class="input" id="pantry-search" placeholder="Search pantry…" value="${esc(state.q)}" aria-label="Search pantry items">
    </div>

    <div id="pantry-body"></div>
  `;

  const body = main.querySelector('#pantry-body');

  function statusBadge(i) {
    if (i.expiry) {
      const d = daysUntil(i.expiry);
      if (d < 0) return `<span class="chip chip-danger">expired ${fmtDate(i.expiry)}</span>`;
      if (d <= 7) return `<span class="chip chip-warn">expires in ${d} d</span>`;
    }
    if (i.minimum != null && i.minimum !== '' && Number(i.quantity) <= Number(i.minimum)) {
      return `<span class="chip chip-info">low stock</span>`;
    }
    return '';
  }

  function paint() {
    let shown = items.filter(i => i.location === state.location);
    if (state.q) shown = shown.filter(i => norm(`${i.name} ${i.category} ${i.supplier || ''}`).includes(norm(state.q)));
    const byCat = groupBy(sortBy(shown, i => norm(i.name)), i => i.category || 'Other');

    if (!shown.length) {
      body.innerHTML = `<div class="empty-state"><p>Nothing in ${esc(state.location.toLowerCase())}${state.q ? ' matching your search' : ''}.</p></div>`;
      return;
    }

    body.innerHTML = [...byCat.entries()].map(([cat, list]) => `
      <section class="pantry-group">
        <h2 class="pantry-group-title">${esc(cat)}</h2>
        <table class="pantry-table">
          <thead><tr>
            <th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Status</th>
            <th scope="col" class="col-hide-sm">Expiry</th><th scope="col"><span class="sr-only">Actions</span></th>
          </tr></thead>
          <tbody>
            ${list.map(i => `
              <tr data-id="${esc(i.pantryItemId)}">
                <td><strong>${esc(i.name)}</strong>${i.notes ? `<br><small class="hint">${esc(i.notes)}</small>` : ''}</td>
                <td class="pantry-qty">
                  <button class="icon-btn qty-dec" aria-label="Decrease ${esc(i.name)}">−</button>
                  <span>${fmtAmount(i.quantity)} ${esc(i.unit)}</span>
                  <button class="icon-btn qty-inc" aria-label="Increase ${esc(i.name)}">＋</button>
                </td>
                <td>${statusBadge(i)}</td>
                <td class="col-hide-sm">${i.expiry ? fmtDate(i.expiry) : '—'}</td>
                <td class="row-btns">
                  <button class="icon-btn row-edit" aria-label="Edit ${esc(i.name)}">✎</button>
                  <button class="icon-btn row-del" aria-label="Delete ${esc(i.name)}">✕</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </section>`).join('');
  }
  paint();

  /* --- interactions ---------------------------------------------------- */
  main.querySelectorAll('[data-loc]').forEach(b => b.addEventListener('click', () => {
    state.location = b.dataset.loc; renderPantry(main);
  }));
  main.querySelector('#pantry-search').addEventListener('input', debounce(e => { state.q = e.target.value; paint(); }, 120));

  body.addEventListener('click', async e => {
    const row = e.target.closest('tr[data-id]'); if (!row) return;
    const item = items.find(x => x.pantryItemId === row.dataset.id);
    if (e.target.closest('.qty-inc') || e.target.closest('.qty-dec')) {
      const step = item.unit && ['g', 'ml'].includes(norm(item.unit)) ? 100 : 1;
      item.quantity = Math.max(0, (Number(item.quantity) || 0) + (e.target.closest('.qty-inc') ? step : -step));
      item.modified = nowISO();
      await dbPut('pantry', item);
      renderPantry(main);
    } else if (e.target.closest('.row-edit')) {
      itemDialog(item, () => renderPantry(main));
    } else if (e.target.closest('.row-del')) {
      if (!await confirmDialog(`Remove “${item.name}” from the pantry?`, { confirmLabel: 'Remove', danger: true })) return;
      await dbDelete('pantry', item.pantryItemId);
      await logActivity('pantry', `Removed “${item.name}” from pantry`);
      renderPantry(main);
    }
  });

  main.querySelector('#pantry-add').addEventListener('click', () => itemDialog(null, () => renderPantry(main)));

  main.querySelector('#low-to-shop')?.addEventListener('click', async () => {
    const toBuy = alerts.low.map(i => ({
      name: i.name, category: 'Pantry', unit: i.unit,
      quantity: i.maximum != null && i.maximum !== '' ? Math.max(0, Number(i.maximum) - Number(i.quantity)) : null,
      notes: 'Low stock',
    }));
    const added = await addItemsToShoppingList('HOUSEHOLD', toBuy);
    toast(`${added} low-stock item${added === 1 ? '' : 's'} added to household shopping`, 'success');
  });
}

/* ------------------------------------------------------------------ *
 *  Add / edit dialog
 * ------------------------------------------------------------------ */

function itemDialog(item, onDone) {
  const isNew = !item;
  const i = item || {
    pantryItemId: uid('pan'), name: '', category: 'Other', quantity: 1, unit: '',
    minimum: null, maximum: null, expiry: null, location: state.location,
    purchaseDate: todayISO(), cost: null, supplier: '', notes: '',
    created: nowISO(), modified: nowISO(),
  };

  const dlg = openDialog(`
    <form class="dialog-body" id="pantry-form">
      <h2 class="dialog-title">${isNew ? 'Add pantry item' : `Edit “${esc(i.name)}”`}</h2>
      <label>Name <input class="input" name="name" required value="${esc(i.name)}" autofocus></label>
      <div class="dialog-row">
        <label>Quantity <input class="input" name="quantity" type="number" step="any" min="0" value="${esc(i.quantity ?? '')}"></label>
        <label>Unit <input class="input" name="unit" value="${esc(i.unit)}" placeholder="g, ml, jars…"></label>
      </div>
      <div class="dialog-row">
        <label>Location <select class="input" name="location">${LOCATIONS.map(l => `<option ${l === i.location ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label>Category <select class="input" name="category">${PANTRY_CATEGORIES.map(c => `<option ${c === i.category ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      </div>
      <div class="dialog-row">
        <label>Minimum stock <input class="input" name="minimum" type="number" step="any" min="0" value="${esc(i.minimum ?? '')}" placeholder="alert at ≤"></label>
        <label>Maximum stock <input class="input" name="maximum" type="number" step="any" min="0" value="${esc(i.maximum ?? '')}" placeholder="restock to"></label>
      </div>
      <div class="dialog-row">
        <label>Expiry <input class="input" name="expiry" type="date" value="${esc(i.expiry ?? '')}"></label>
        <label>Purchased <input class="input" name="purchaseDate" type="date" value="${esc(i.purchaseDate ?? '')}"></label>
      </div>
      <div class="dialog-row">
        <label>Cost ($) <input class="input" name="cost" type="number" step="0.01" min="0" value="${esc(i.cost ?? '')}"></label>
        <label>Supplier <input class="input" name="supplier" value="${esc(i.supplier)}"></label>
      </div>
      <label>Notes <input class="input" name="notes" value="${esc(i.notes)}"></label>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary">${isNew ? 'Add item' : 'Save'}</button>
      </div>
    </form>`);

  dlg.querySelector('#pantry-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const num = k => f.get(k) === '' ? null : Number(f.get(k));
    Object.assign(i, {
      name: String(f.get('name')).trim(),
      quantity: num('quantity') ?? 0, unit: String(f.get('unit')).trim(),
      location: f.get('location'), category: f.get('category'),
      minimum: num('minimum'), maximum: num('maximum'),
      expiry: f.get('expiry') || null, purchaseDate: f.get('purchaseDate') || null,
      cost: num('cost'), supplier: String(f.get('supplier')).trim(),
      notes: String(f.get('notes')).trim(), modified: nowISO(),
    });
    if (!i.name) return;
    await dbPut('pantry', i);
    await logActivity('pantry', `${isNew ? 'Added' : 'Updated'} pantry item “${i.name}”`);
    closeDialog();
    onDone();
  });
}
