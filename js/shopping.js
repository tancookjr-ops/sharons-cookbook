/**
 * shopping.js — TWO completely separate shopping systems.
 *
 *   1. HOUSEHOLD  → object store `shoppingHousehold`  → route #/shopping
 *   2. BOTANICALS → object store `shoppingBotanicals` → route #/botanicals
 *      (Tancook Island Botanicals — soap/candle making supplies)
 *
 * HARD RULE (product requirement): these systems are never merged, never
 * share a store, never share a list. They share only this rendering code,
 * parameterized by SYSTEMS below — the data paths stay 100% separate.
 *
 * Item schema (stable, see docs/SCHEMA.md):
 *   { itemId, type: 'HOUSEHOLD'|'BOTANICALS', name, category, quantity,
 *     unit, checked, notes, priority, recurring, created }
 */

import { dbGetAll, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, esc, norm, nowISO, fmtAmount, groupBy, sortBy, toast,
  openDialog, closeDialog,
} from './utilities.js';

/* ------------------------------------------------------------------ *
 *  System registry — the ONLY place the two systems are configured.
 * ------------------------------------------------------------------ */

export const SYSTEMS = Object.freeze({
  HOUSEHOLD: {
    type: 'HOUSEHOLD',
    store: 'shoppingHousehold',
    route: 'shopping',
    title: 'Household shopping',
    blurb: 'Groceries and everything for the house.',
    categories: ['Produce', 'Bakery', 'Frozen', 'Pantry', 'Dairy', 'Meat & fish', 'Cleaning', 'Household', 'Personal care', 'Other'],
  },
  BOTANICALS: {
    type: 'BOTANICALS',
    store: 'shoppingBotanicals',
    route: 'botanicals',
    title: 'Tancook Island Botanicals',
    blurb: 'Business supplies — kept completely separate from household shopping.',
    categories: ['Soap oils', 'Essential oils', 'Wax', 'Wicks', 'Fragrance', 'Lye', 'Packaging', 'Labels', 'Jars', 'Bottles', 'Shipping', 'Office', 'Equipment'],
  },
});

/* ------------------------------------------------------------------ *
 *  Data API (used by recipes.js “add to shopping” and planner.js
 *  auto-grocery generation — HOUSEHOLD only by design; importer.js may
 *  target either system explicitly).
 * ------------------------------------------------------------------ */

/** Build a new item record for a system. */
export function newShoppingItem(systemType, fields = {}) {
  const sys = SYSTEMS[systemType];
  return {
    itemId: uid('shp'),
    type: sys.type,
    name: '', category: sys.categories[0],
    quantity: null, unit: '',
    checked: false, notes: '', priority: 'normal', recurring: false,
    created: nowISO(),
    ...fields,
  };
}

/**
 * Add several items to a list, merging duplicates by (name, unit):
 * an unchecked existing item just gets its quantity increased.
 * Returns the number of items added or merged.
 */
export async function addItemsToShoppingList(systemType, items) {
  const sys = SYSTEMS[systemType];
  const existing = await dbGetAll(sys.store);
  let count = 0;
  for (const raw of items) {
    if (!raw.name?.trim()) continue;
    const match = existing.find(x => !x.checked && norm(x.name) === norm(raw.name) && norm(x.unit) === norm(raw.unit || ''));
    if (match && raw.quantity != null && match.quantity != null) {
      match.quantity = Math.round((Number(match.quantity) + Number(raw.quantity)) * 100) / 100;
      await dbPut(sys.store, match);
    } else if (!match) {
      const item = newShoppingItem(systemType, {
        name: raw.name.trim(),
        category: sys.categories.includes(raw.category) ? raw.category : sys.categories[0],
        quantity: raw.quantity ?? null, unit: raw.unit || '', notes: raw.notes || '',
      });
      await dbPut(sys.store, item);
      existing.push(item);
    }
    count++;
  }
  if (count) await logActivity('shopping', `Added ${count} item${count === 1 ? '' : 's'} to ${sys.title}`);
  return count;
}

/* ------------------------------------------------------------------ *
 *  Views
 * ------------------------------------------------------------------ */

export function renderHouseholdShopping(main) { return renderList(main, SYSTEMS.HOUSEHOLD); }
export function renderBotanicalsShopping(main) { return renderList(main, SYSTEMS.BOTANICALS); }

async function renderList(main, sys) {
  const items = await dbGetAll(sys.store);
  const open = items.filter(i => !i.checked);
  const done = items.filter(i => i.checked);

  main.innerHTML = `
    <header class="page-head">
      <div>
        <h1>${esc(sys.title)}</h1>
        <p class="page-sub">${esc(sys.blurb)}</p>
      </div>
      <div class="page-actions no-print">
        <button class="btn btn-ghost" id="shop-print">Print</button>
        <button class="btn btn-ghost" id="shop-share">Share</button>
      </div>
    </header>

    <form class="shop-add no-print" id="shop-add-form">
      <input class="input" name="name" placeholder="Add an item…" required aria-label="Item name">
      <input class="input shop-qty" name="quantity" type="number" step="any" min="0" placeholder="Qty" aria-label="Quantity">
      <input class="input shop-unit" name="unit" placeholder="Unit" aria-label="Unit">
      <select class="input shop-cat" name="category" aria-label="Category">
        ${sys.categories.map(c => `<option>${esc(c)}</option>`).join('')}
      </select>
      <button class="btn btn-primary" aria-label="Add item">Add</button>
    </form>

    <p class="result-count" role="status">${open.length} to buy · ${done.length} done</p>

    <div class="shop-groups printable" id="shop-groups"></div>

    <div class="shop-footer no-print">
      ${done.length ? `<button class="btn btn-ghost" id="shop-clear-done">Clear checked (${done.length})</button>` : ''}
    </div>
  `;

  const groupsHost = main.querySelector('#shop-groups');

  function itemRow(i) {
    return `
      <li class="shop-item ${i.checked ? 'checked' : ''} ${i.priority === 'high' ? 'priority-high' : ''}" data-id="${esc(i.itemId)}">
        <label class="shop-check">
          <input type="checkbox" ${i.checked ? 'checked' : ''} aria-label="Mark ${esc(i.name)} as ${i.checked ? 'not bought' : 'bought'}">
          <span class="shop-name">${esc(i.name)}
            ${i.recurring ? '<span class="chip chip-sm" title="Recurring — re-added when you clear checked items">↻</span>' : ''}
            ${i.priority === 'high' ? '<span class="chip chip-sm chip-warn">priority</span>' : ''}
          </span>
        </label>
        <span class="shop-item-qty">${i.quantity != null ? `${fmtAmount(i.quantity)} ${esc(i.unit)}` : esc(i.unit)}</span>
        ${i.notes ? `<span class="shop-item-note">${esc(i.notes)}</span>` : ''}
        <span class="shop-item-btns no-print">
          <button class="icon-btn shop-edit" aria-label="Edit ${esc(i.name)}">✎</button>
          <button class="icon-btn shop-del" aria-label="Delete ${esc(i.name)}">✕</button>
        </span>
      </li>`;
  }

  function paint() {
    // Group unchecked items by category (in the system's category order),
    // checked items collapse into a single "In the basket" group.
    const byCat = groupBy(sortBy(open, i => norm(i.name)), i => i.category);
    let html = '';
    for (const cat of sys.categories) {
      const list = byCat.get(cat);
      if (!list?.length) continue;
      html += `
        <section class="shop-group">
          <h2 class="shop-group-title">${esc(cat)} <small>${list.length}</small></h2>
          <ul class="shop-list">${list.map(itemRow).join('')}</ul>
        </section>`;
    }
    // Anything in a category we no longer know about still shows up.
    for (const [cat, list] of byCat) {
      if (!sys.categories.includes(cat)) {
        html += `<section class="shop-group"><h2 class="shop-group-title">${esc(cat)}</h2><ul class="shop-list">${list.map(itemRow).join('')}</ul></section>`;
      }
    }
    if (done.length) {
      html += `
        <section class="shop-group shop-group-done no-print">
          <h2 class="shop-group-title">In the basket <small>${done.length}</small></h2>
          <ul class="shop-list">${sortBy(done, i => norm(i.name)).map(itemRow).join('')}</ul>
        </section>`;
    }
    groupsHost.innerHTML = html || `<div class="empty-state"><p>Nothing on the list. Add something above${sys.type === 'HOUSEHOLD' ? ', or generate groceries from the meal planner' : ''}.</p></div>`;
  }
  paint();

  /* --- add form ----------------------------------------------------- */
  main.querySelector('#shop-add-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const item = newShoppingItem(sys.type, {
      name: String(f.get('name')).trim(),
      quantity: f.get('quantity') === '' ? null : Number(f.get('quantity')),
      unit: String(f.get('unit')).trim(),
      category: f.get('category'),
    });
    if (!item.name) return;
    await dbPut(sys.store, item);
    renderList(main, sys);
    // Restore focus to keep rapid entry flowing.
    setTimeout(() => main.querySelector('#shop-add-form [name=name]')?.focus(), 0);
  });

  /* --- item interactions (delegated) --------------------------------- */
  groupsHost.addEventListener('change', async e => {
    if (e.target.type !== 'checkbox') return;
    const id = e.target.closest('.shop-item').dataset.id;
    const item = items.find(x => x.itemId === id);
    item.checked = e.target.checked;
    await dbPut(sys.store, item);
    renderList(main, sys);
  });

  groupsHost.addEventListener('click', async e => {
    const row = e.target.closest('.shop-item'); if (!row) return;
    const item = items.find(x => x.itemId === row.dataset.id);
    if (e.target.closest('.shop-del')) {
      await dbDelete(sys.store, item.itemId);
      renderList(main, sys);
    } else if (e.target.closest('.shop-edit')) {
      editItemDialog(sys, item, () => renderList(main, sys));
    }
  });

  /* --- clear checked (recurring items respawn unchecked) ------------- */
  main.querySelector('#shop-clear-done')?.addEventListener('click', async () => {
    for (const i of done) {
      if (i.recurring) { i.checked = false; await dbPut(sys.store, i); }
      else await dbDelete(sys.store, i.itemId);
    }
    toast('Checked items cleared', 'success');
    renderList(main, sys);
  });

  /* --- print / share -------------------------------------------------- */
  main.querySelector('#shop-print').addEventListener('click', () => window.print());
  main.querySelector('#shop-share').addEventListener('click', async () => {
    const text = `${sys.title} — ${new Date().toLocaleDateString('en-CA')}\n\n` +
      sys.categories.map(cat => {
        const list = open.filter(i => i.category === cat);
        return list.length ? `${cat}:\n${list.map(i => `  • ${i.name}${i.quantity != null ? ` (${fmtAmount(i.quantity)} ${i.unit})` : ''}`).join('\n')}` : '';
      }).filter(Boolean).join('\n\n');
    if (navigator.share) {
      try { await navigator.share({ title: sys.title, text }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast('List copied to clipboard', 'success');
    }
  });
}

/** Edit dialog for a single item (name, qty, category, priority, recurring…). */
function editItemDialog(sys, item, onSaved) {
  const dlg = openDialog(`
      <form class="dialog-body" id="shop-edit-form">
        <h2 class="dialog-title">Edit item</h2>
        <label>Name <input class="input" name="name" required value="${esc(item.name)}"></label>
        <div class="dialog-row">
          <label>Quantity <input class="input" name="quantity" type="number" step="any" min="0" value="${esc(item.quantity ?? '')}"></label>
          <label>Unit <input class="input" name="unit" value="${esc(item.unit)}"></label>
        </div>
        <label>Category
          <select class="input" name="category">${sys.categories.map(c => `<option ${c === item.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
        </label>
        <label>Notes <input class="input" name="notes" value="${esc(item.notes)}"></label>
        <label>Priority
          <select class="input" name="priority">
            <option value="normal" ${item.priority !== 'high' ? 'selected' : ''}>Normal</option>
            <option value="high" ${item.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </label>
        <label class="check-label"><input type="checkbox" name="recurring" ${item.recurring ? 'checked' : ''}> Recurring item (stays on the list after clearing)</label>
        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" data-close>Cancel</button>
          <button class="btn btn-primary">Save</button>
        </div>
      </form>`);
  dlg.querySelector('#shop-edit-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    Object.assign(item, {
      name: String(f.get('name')).trim(),
      quantity: f.get('quantity') === '' ? null : Number(f.get('quantity')),
      unit: String(f.get('unit')).trim(),
      category: f.get('category'), notes: String(f.get('notes')).trim(),
      priority: f.get('priority'), recurring: f.get('recurring') === 'on',
    });
    await dbPut(sys.store, item);
    closeDialog();
    onSaved();
  });
}
