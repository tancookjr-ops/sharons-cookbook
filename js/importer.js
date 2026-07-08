/**
 * importer.js — the AI Import Engine.
 *
 * Route: #/import
 *
 * This is how the cookbook grows without code changes: an AI assistant (or a
 * person) produces a structured JSON document and this module validates,
 * previews and applies it. The format is documented in docs/IMPORT_SPEC.md
 * and is intentionally simple enough for an LLM to emit reliably from a
 * conversation ("Add a hummus recipe", "Put chili on Friday", …).
 *
 * Document shape:
 * {
 *   "schemaVersion": 1,
 *   "exportDate": "2026-07-08T12:00:00Z",
 *   "exportedBy": "ChatGPT",
 *   "applicationVersion": "1.0.0",
 *   "operations": [ { "op": "CREATE_RECIPE", ...payload }, ... ]
 * }
 *
 * Safety model:
 *   validate → preview (with per-conflict resolution) → snapshot → apply.
 *   Any failure mid-apply restores the snapshot (rollback). The snapshot is
 *   kept as "pre-import" so the whole import can be undone afterwards.
 */

import { dbGetAll, dbPut, dbDelete, logActivity } from './database.js';
import {
  esc, norm, uid, nowISO, toast, readFileText, confirmDialog,
  saveSettings, applySettings,
} from './utilities.js';
import { blankRecipe, blankIngredient, blankStep } from './recipes.js';
import { SYSTEMS, newShoppingItem } from './shopping.js';
import { saveSnapshot, listSnapshots, restoreSnapshot, applyBackup, validateBackup, SCHEMA_VERSION } from './backup.js';

/* ------------------------------------------------------------------ *
 *  Operation registry
 * ------------------------------------------------------------------ */

/**
 * Each entry: {
 *   validate(payload, ctx) → string[] problems (empty = valid),
 *   conflict(payload, ctx) → null | description (lets the user pick skip/replace/merge),
 *   describe(payload)      → human line for the preview,
 *   apply(payload, resolution, ctx) → summary string
 * }
 * ctx carries pre-loaded store contents for id/name lookups.
 */
const OPS = {

  /* ---- recipes ---- */
  CREATE_RECIPE: {
    validate: p => {
      const errs = [];
      if (!p.title?.trim()) errs.push('recipe needs a title');
      if (p.ingredients && !Array.isArray(p.ingredients)) errs.push('ingredients must be a list');
      if (p.instructions && !Array.isArray(p.instructions)) errs.push('instructions must be a list');
      return errs;
    },
    conflict: (p, ctx) => p.recipeId && ctx.recipes.some(r => r.recipeId === p.recipeId)
      ? `a recipe with id ${p.recipeId} already exists` : null,
    describe: p => `Create recipe “${p.title}”`,
    apply: async (p, resolution, ctx) => {
      const existing = p.recipeId ? ctx.recipes.find(r => r.recipeId === p.recipeId) : null;
      if (existing && resolution === 'skip') return `Skipped “${p.title}” (already exists)`;
      const base = existing && resolution === 'merge' ? structuredClone(existing) : blankRecipe();
      const recipe = normalizeRecipe({ ...base, ...p, recipeId: p.recipeId || base.recipeId });
      recipe.modified = nowISO();
      await dbPut('recipes', recipe);
      return `${existing ? 'Replaced' : 'Created'} recipe “${recipe.title}”`;
    },
  },

  UPDATE_RECIPE: {
    validate: (p, ctx) => {
      if (!p.recipeId && !p.title) return ['needs recipeId or title to find the recipe'];
      return findRecipe(ctx, p) ? [] : [`no recipe found matching ${p.recipeId || `title “${p.title}”`}`];
    },
    describe: p => `Update recipe ${p.recipeId || `“${p.title}”`}`,
    apply: async (p, _res, ctx) => {
      const target = findRecipe(ctx, p);
      const patch = { ...p };
      delete patch.recipeId;
      const merged = normalizeRecipe({ ...target, ...patch, recipeId: target.recipeId, created: target.created });
      merged.modified = nowISO();
      merged.version = (target.version || 1) + 1;
      merged.versionHistory = [...(target.versionHistory || []), { version: target.version || 1, modified: merged.modified, note: 'AI import update' }].slice(-25);
      await dbPut('recipes', merged);
      return `Updated recipe “${merged.title}”`;
    },
  },

  DELETE_RECIPE: {
    validate: (p, ctx) => findRecipe(ctx, p) ? [] : [`no recipe found matching ${p.recipeId || `title “${p.title}”`}`],
    describe: p => `Delete recipe ${p.recipeId || `“${p.title}”`}`,
    apply: async (p, _res, ctx) => {
      const target = findRecipe(ctx, p);
      await dbDelete('recipes', target.recipeId);
      return `Deleted recipe “${target.title}”`;
    },
  },

  /* ---- meal plans ---- */
  CREATE_MEAL_PLAN: {
    validate: (p, ctx) => {
      const errs = [];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) errs.push('date must be "YYYY-MM-DD"');
      if (!p.recipeId && !p.recipeTitle) errs.push('needs recipeId or recipeTitle');
      else if (!findRecipe(ctx, { recipeId: p.recipeId, title: p.recipeTitle })) errs.push('recipe not found — create it first (order operations CREATE_RECIPE before CREATE_MEAL_PLAN)');
      return errs;
    },
    describe: p => `Plan ${p.recipeTitle || p.recipeId} on ${p.date} (${p.mealType || 'Dinner'})`,
    apply: async (p, _res, ctx) => {
      const recipe = findRecipe(ctx, { recipeId: p.recipeId, title: p.recipeTitle });
      const entry = {
        mealPlanId: p.mealPlanId || uid('mp'),
        date: p.date, mealType: p.mealType || 'Dinner',
        recipeId: recipe.recipeId,
        servings: Number(p.servings) || Number(recipe.servings) || 2,
        notes: p.notes || '', completed: !!p.completed, batch: !!p.batch, leftovers: !!p.leftovers,
      };
      await dbPut('mealPlans', entry);
      return `Planned “${recipe.title}” for ${p.date}`;
    },
  },

  UPDATE_MEAL_PLAN: {
    validate: (p, ctx) => p.mealPlanId && ctx.mealPlans.some(m => m.mealPlanId === p.mealPlanId) ? [] : ['needs a valid mealPlanId'],
    describe: p => `Update meal plan ${p.mealPlanId}`,
    apply: async (p, _res, ctx) => {
      const target = ctx.mealPlans.find(m => m.mealPlanId === p.mealPlanId);
      await dbPut('mealPlans', { ...target, ...p });
      return `Updated meal plan for ${target.date}`;
    },
  },

  DELETE_MEAL_PLAN: {
    validate: (p, ctx) => {
      if (p.mealPlanId) return ctx.mealPlans.some(m => m.mealPlanId === p.mealPlanId) ? [] : ['mealPlanId not found'];
      if (p.date) return [];
      return ['needs mealPlanId, or date (+ optional mealType) to clear'];
    },
    describe: p => p.mealPlanId ? `Delete meal plan ${p.mealPlanId}` : `Clear plan on ${p.date}${p.mealType ? ` (${p.mealType})` : ''}`,
    apply: async (p, _res, ctx) => {
      const victims = p.mealPlanId
        ? ctx.mealPlans.filter(m => m.mealPlanId === p.mealPlanId)
        : ctx.mealPlans.filter(m => m.date === p.date && (!p.mealType || m.mealType === p.mealType));
      for (const v of victims) await dbDelete('mealPlans', v.mealPlanId);
      return `Removed ${victims.length} planned meal${victims.length === 1 ? '' : 's'}`;
    },
  },

  /* ---- pantry ---- */
  ADD_PANTRY_ITEM: {
    validate: p => p.name?.trim() ? [] : ['pantry item needs a name'],
    conflict: (p, ctx) => ctx.pantry.some(i => norm(i.name) === norm(p.name)) ? `pantry already has “${p.name}”` : null,
    describe: p => `Add pantry item “${p.name}”${p.quantity != null ? ` (${p.quantity} ${p.unit || ''})` : ''}`,
    apply: async (p, resolution, ctx) => {
      const existing = ctx.pantry.find(i => norm(i.name) === norm(p.name));
      if (existing && resolution === 'skip') return `Skipped “${p.name}” (already in pantry)`;
      if (existing && resolution === 'merge') {
        existing.quantity = (Number(existing.quantity) || 0) + (Number(p.quantity) || 0);
        existing.modified = nowISO();
        await dbPut('pantry', existing);
        return `Topped up “${p.name}” to ${existing.quantity} ${existing.unit || ''}`;
      }
      const item = {
        pantryItemId: p.pantryItemId || existing?.pantryItemId || uid('pan'),
        name: p.name.trim(), category: p.category || 'Other',
        quantity: Number(p.quantity) || 0, unit: p.unit || '',
        minimum: p.minimum ?? null, maximum: p.maximum ?? null,
        expiry: p.expiry || null, location: p.location || 'Pantry',
        purchaseDate: p.purchaseDate || null, cost: p.cost ?? null,
        supplier: p.supplier || '', notes: p.notes || '',
        created: nowISO(), modified: nowISO(),
      };
      await dbPut('pantry', item);
      return `Added “${item.name}” to ${item.location}`;
    },
  },

  UPDATE_PANTRY_ITEM: {
    validate: (p, ctx) => findByIdOrName(ctx.pantry, 'pantryItemId', p) ? [] : ['pantry item not found (give pantryItemId or exact name)'],
    describe: p => `Update pantry item ${p.pantryItemId || `“${p.name}”`}`,
    apply: async (p, _res, ctx) => {
      const target = findByIdOrName(ctx.pantry, 'pantryItemId', p);
      await dbPut('pantry', { ...target, ...p, pantryItemId: target.pantryItemId, modified: nowISO() });
      return `Updated pantry item “${target.name}”`;
    },
  },

  REMOVE_PANTRY_ITEM: {
    validate: (p, ctx) => findByIdOrName(ctx.pantry, 'pantryItemId', p) ? [] : ['pantry item not found (give pantryItemId or exact name)'],
    describe: p => `Remove pantry item ${p.pantryItemId || `“${p.name}”`}`,
    apply: async (p, _res, ctx) => {
      const target = findByIdOrName(ctx.pantry, 'pantryItemId', p);
      await dbDelete('pantry', target.pantryItemId);
      return `Removed “${target.name}” from pantry`;
    },
  },

  /* ---- shopping (type routes to the correct, separate store) ---- */
  ADD_SHOPPING_ITEM: {
    validate: p => {
      const errs = [];
      if (!p.name?.trim()) errs.push('shopping item needs a name');
      if (!SYSTEMS[p.type]) errs.push('type must be "HOUSEHOLD" or "BOTANICALS"');
      return errs;
    },
    describe: p => `Add “${p.name}” to ${p.type === 'BOTANICALS' ? 'Tancook Botanicals' : 'household'} shopping`,
    apply: async p => {
      const sys = SYSTEMS[p.type];
      const item = newShoppingItem(p.type, {
        itemId: p.itemId || uid('shp'),
        name: p.name.trim(),
        category: sys.categories.includes(p.category) ? p.category : sys.categories[0],
        quantity: p.quantity ?? null, unit: p.unit || '',
        notes: p.notes || '', priority: p.priority === 'high' ? 'high' : 'normal',
        recurring: !!p.recurring,
      });
      await dbPut(sys.store, item);
      return `Added “${item.name}” to ${sys.title}`;
    },
  },

  REMOVE_SHOPPING_ITEM: {
    validate: (p, ctx) => {
      if (!SYSTEMS[p.type]) return ['type must be "HOUSEHOLD" or "BOTANICALS"'];
      return findByIdOrName(ctx[SYSTEMS[p.type].store], 'itemId', p) ? [] : ['shopping item not found (give itemId or exact name)'];
    },
    describe: p => `Remove “${p.name || p.itemId}” from ${p.type === 'BOTANICALS' ? 'Tancook Botanicals' : 'household'} shopping`,
    apply: async (p, _res, ctx) => {
      const sys = SYSTEMS[p.type];
      const target = findByIdOrName(ctx[sys.store], 'itemId', p);
      await dbDelete(sys.store, target.itemId);
      return `Removed “${target.name}” from ${sys.title}`;
    },
  },

  /* ---- garden ---- */
  CREATE_GARDEN_ENTRY: {
    validate: p => p.plantName?.trim() ? [] : ['garden entry needs a plantName'],
    describe: p => `Add garden entry “${p.plantName}”`,
    apply: async p => {
      const g = {
        gardenItemId: p.gardenItemId || uid('gar'),
        plantName: p.plantName.trim(), variety: p.variety || '', location: p.location || '',
        plantDate: p.plantDate || null, harvestDate: p.harvestDate || null,
        quantity: Number(p.quantity) || 0, unit: p.unit || '',
        notes: p.notes || '', preservation: Array.isArray(p.preservation) ? p.preservation : [],
        harvests: Array.isArray(p.harvests) ? p.harvests : [],
        created: nowISO(), modified: nowISO(),
      };
      await dbPut('garden', g);
      return `Added “${g.plantName}” to the garden`;
    },
  },

  UPDATE_GARDEN_ENTRY: {
    validate: (p, ctx) => findGarden(ctx, p) ? [] : ['garden entry not found (give gardenItemId or plantName)'],
    describe: p => p.harvest ? `Log harvest for “${p.plantName || p.gardenItemId}”` : `Update garden entry ${p.gardenItemId || `“${p.plantName}”`}`,
    apply: async (p, _res, ctx) => {
      const g = findGarden(ctx, p);
      // Special convenience: { harvest: { date, quantity, unit, notes } }
      // appends to the harvest log ("Harvested six tomatoes").
      if (p.harvest && typeof p.harvest === 'object') {
        g.harvests = g.harvests || [];
        g.harvests.push({
          date: p.harvest.date || nowISO().slice(0, 10),
          quantity: Number(p.harvest.quantity) || 0,
          unit: p.harvest.unit || g.unit || '', notes: p.harvest.notes || '',
        });
        g.quantity = g.harvests.reduce((s, h) => s + (Number(h.quantity) || 0), 0);
      } else {
        const patch = { ...p };
        delete patch.gardenItemId; delete patch.harvest;
        Object.assign(g, patch);
      }
      g.modified = nowISO();
      await dbPut('garden', g);
      return p.harvest ? `Logged harvest for “${g.plantName}”` : `Updated “${g.plantName}”`;
    },
  },

  DELETE_GARDEN_ENTRY: {
    validate: (p, ctx) => findGarden(ctx, p) ? [] : ['garden entry not found'],
    describe: p => `Delete garden entry ${p.gardenItemId || `“${p.plantName}”`}`,
    apply: async (p, _res, ctx) => {
      const g = findGarden(ctx, p);
      await dbDelete('garden', g.gardenItemId);
      return `Deleted garden entry “${g.plantName}”`;
    },
  },

  /* ---- settings / images / whole-database merge ---- */
  UPDATE_SETTINGS: {
    validate: p => p.settings && typeof p.settings === 'object' ? [] : ['needs a "settings" object'],
    describe: p => `Update settings: ${Object.keys(p.settings || {}).join(', ')}`,
    apply: async p => {
      // Only known preference keys are accepted; unknown keys are ignored so
      // future exports stay importable (forward compatibility).
      const allowed = ['theme', 'fontScale', 'units', 'autoBackup', 'language'];
      const patch = Object.fromEntries(Object.entries(p.settings).filter(([k]) => allowed.includes(k)));
      applySettings(saveSettings(patch));
      return `Updated settings (${Object.keys(patch).join(', ') || 'nothing recognised'})`;
    },
  },

  IMPORT_IMAGES: {
    validate: (p, ctx) => {
      if (!Array.isArray(p.images)) return ['needs an "images" list of { recipeId, photo }'];
      const errs = [];
      for (const img of p.images) {
        if (!img.recipeId || !ctx.recipes.some(r => r.recipeId === img.recipeId)) errs.push(`image target recipe ${img.recipeId || '(missing id)'} not found`);
        if (typeof img.photo !== 'string' || !img.photo.startsWith('data:image/')) errs.push('photo must be a data:image/... URL');
      }
      return errs;
    },
    describe: p => `Attach ${p.images?.length ?? 0} photo(s) to recipes`,
    apply: async (p, _res, ctx) => {
      for (const img of p.images) {
        const r = ctx.recipes.find(x => x.recipeId === img.recipeId);
        r.photo = img.photo;
        r.modified = nowISO();
        await dbPut('recipes', r);
      }
      return `Attached ${p.images.length} photo(s)`;
    },
  },

  MERGE_DATABASE: {
    validate: p => p.backup ? validateBackup(p.backup).filter(m => !m.includes('ignored')) : ['needs a "backup" object (a full export)'],
    describe: p => `Merge a full database export (${Object.values(p.backup?.data || {}).reduce((s, a) => s + (a?.length || 0), 0)} records)`,
    apply: async p => {
      const count = await applyBackup(p.backup, 'merge');
      return `Merged ${count} records`;
    },
  },
};

/* ------------------------------------------------------------------ *
 *  Lookup + normalization helpers
 * ------------------------------------------------------------------ */

function findRecipe(ctx, p) {
  if (p.recipeId) return ctx.recipes.find(r => r.recipeId === p.recipeId) || null;
  if (p.title) return ctx.recipes.find(r => norm(r.title) === norm(p.title)) || null;
  return null;
}
function findByIdOrName(list, idField, p) {
  if (p[idField]) return list.find(x => x[idField] === p[idField]) || null;
  if (p.name) return list.find(x => norm(x.name) === norm(p.name)) || null;
  return null;
}
function findGarden(ctx, p) {
  if (p.gardenItemId) return ctx.garden.find(g => g.gardenItemId === p.gardenItemId) || null;
  if (p.plantName) return ctx.garden.find(g => norm(g.plantName) === norm(p.plantName)) || null;
  return null;
}

/** Coerce an imported recipe payload into the full stable shape. */
function normalizeRecipe(r) {
  const base = blankRecipe();
  const out = { ...base, ...r };
  delete out.recipeTitle; delete out.op;
  out.ingredients = (Array.isArray(r.ingredients) ? r.ingredients : []).map(i =>
    typeof i === 'string' ? { ...blankIngredient(), name: i } : { ...blankIngredient(), ...i, ingredientId: i.ingredientId || uid('ing') });
  out.instructions = (Array.isArray(r.instructions) ? r.instructions : []).map((s, idx) =>
    typeof s === 'string' ? { ...blankStep(idx + 1), instruction: s } : { ...blankStep(idx + 1), ...s, stepNumber: idx + 1 });
  out.nutrition = { ...base.nutrition, ...(r.nutrition || {}) };
  out.tags = Array.isArray(r.tags) ? r.tags.map(t => norm(t)) : [];
  out.prepMinutes = Number(out.prepMinutes) || 0;
  out.cookMinutes = Number(out.cookMinutes) || 0;
  out.totalMinutes = Number(out.totalMinutes) || (out.prepMinutes + out.cookMinutes);
  out.servings = Number(out.servings) || 1;
  return out;
}

/* ------------------------------------------------------------------ *
 *  Parse + validate a whole document
 * ------------------------------------------------------------------ */

/**
 * Parse and validate import text.
 * Returns { errors: string[], doc, plan: [{op, payload, problems, conflict, resolution}] }
 */
export async function analyseImport(text) {
  let doc;
  try { doc = JSON.parse(text); }
  catch (e) { return { errors: [`Not valid JSON: ${e.message}`], plan: [] }; }

  const errors = [];
  // A full backup pasted directly is welcomed as a MERGE_DATABASE.
  if (doc.kind === 'FULL_BACKUP' && !doc.operations) {
    doc = { schemaVersion: doc.schemaVersion, operations: [{ op: 'MERGE_DATABASE', backup: doc }] };
  }
  if (doc.schemaVersion == null) errors.push('Missing "schemaVersion".');
  else if (doc.schemaVersion > SCHEMA_VERSION) errors.push(`This file uses schema v${doc.schemaVersion}; the app understands up to v${SCHEMA_VERSION}.`);
  if (!Array.isArray(doc.operations)) errors.push('Missing "operations" list.');
  if (errors.length) return { errors, doc, plan: [] };

  // Context for lookups — refreshed once, ops validate against live data.
  const ctx = {};
  for (const store of ['recipes', 'mealPlans', 'pantry', 'shoppingHousehold', 'shoppingBotanicals', 'garden']) {
    ctx[store] = await dbGetAll(store);
  }

  const plan = doc.operations.map((raw, idx) => {
    const { op, ...payload } = raw || {};
    const def = OPS[op];
    if (!def) return { op: op || '(missing op)', payload, idx, problems: [`unknown operation "${op}"`], conflict: null, resolution: 'skip' };
    const problems = def.validate(payload, ctx);
    const conflict = problems.length ? null : (def.conflict ? def.conflict(payload, ctx) : null);
    return { op, payload, idx, problems, conflict, resolution: conflict ? 'merge' : 'apply', describe: def.describe(payload) };
  });

  return { errors, doc, plan, ctx };
}

/** Apply a validated plan. Rolls back everything if any step throws. */
export async function applyImport(plan) {
  await saveSnapshot('pre-import', `Before AI import (${plan.length} operations)`);
  const results = [];
  try {
    for (const step of plan) {
      if (step.problems.length || step.resolution === 'skip') {
        results.push({ ...step, result: step.problems.length ? `✕ skipped (${step.problems.join('; ')})` : '– skipped' });
        continue;
      }
      // Fresh context per step so later ops see earlier ops' writes.
      const ctx = {};
      for (const store of ['recipes', 'mealPlans', 'pantry', 'shoppingHousehold', 'shoppingBotanicals', 'garden']) {
        ctx[store] = await dbGetAll(store);
      }
      const summary = await OPS[step.op].apply(step.payload, step.resolution, ctx);
      results.push({ ...step, result: `✓ ${summary}` });
    }
  } catch (err) {
    // Rollback on failure: restore the snapshot we just took.
    const snaps = await listSnapshots();
    const pre = snaps.find(s => s.kind === 'pre-import');
    if (pre) await restoreSnapshot(pre);
    throw new Error(`Import failed at operation ${results.length + 1} (${err.message}). All changes were rolled back.`);
  }
  const applied = results.filter(r => r.result.startsWith('✓')).length;
  await logActivity('import', `AI import applied ${applied} operation${applied === 1 ? '' : 's'}`);
  return results;
}

/* ------------------------------------------------------------------ *
 *  View
 * ------------------------------------------------------------------ */

export function renderImporter(main) {
  main.innerHTML = `
    <header class="page-head">
      <h1>AI import</h1>
      <div class="page-actions">
        <button class="btn btn-ghost" id="undo-import">↶ Undo last import</button>
      </div>
    </header>

    <p class="page-sub">
      Paste an update file generated by your AI assistant (or any valid import
      JSON). Nothing is changed until you review the preview and confirm —
      and every import can be undone. Format reference:
      <code>docs/IMPORT_SPEC.md</code>, sample: <code>data/sample-import.json</code>.
    </p>

    <div class="import-input">
      <textarea class="input import-textarea" id="import-text" rows="12"
        placeholder='{"schemaVersion": 1, "operations": [ { "op": "ADD_SHOPPING_ITEM", "type": "HOUSEHOLD", "name": "Olive oil", "category": "Pantry" } ]}'
        aria-label="Import JSON"></textarea>
      <div class="import-btns">
        <label class="btn btn-ghost">Open file… <input type="file" id="import-file" accept=".json,application/json" hidden></label>
        <button class="btn btn-primary" id="import-preview">Preview import</button>
      </div>
    </div>

    <div id="import-result" aria-live="polite"></div>
  `;

  const textArea = main.querySelector('#import-text');
  const resultHost = main.querySelector('#import-result');

  main.querySelector('#import-file').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    textArea.value = await readFileText(file);
    toast(`Loaded ${file.name}`, 'info');
  });

  main.querySelector('#import-preview').addEventListener('click', async () => {
    const text = textArea.value.trim();
    if (!text) { toast('Paste an import file first', 'warn'); return; }
    const analysis = await analyseImport(text);

    if (analysis.errors.length) {
      resultHost.innerHTML = `<div class="import-errors"><h2>Cannot import</h2><ul>${analysis.errors.map(e2 => `<li>${esc(e2)}</li>`).join('')}</ul></div>`;
      return;
    }

    const okCount = analysis.plan.filter(s => !s.problems.length).length;
    resultHost.innerHTML = `
      <section class="import-preview">
        <h2>Preview — ${okCount} of ${analysis.plan.length} operations ready</h2>
        <ol class="import-plan">
          ${analysis.plan.map(s => `
            <li class="import-step ${s.problems.length ? 'step-error' : s.conflict ? 'step-conflict' : 'step-ok'}">
              <span class="import-step-desc">${esc(s.describe || s.op)}</span>
              ${s.problems.length ? `<span class="import-step-msg">✕ ${esc(s.problems.join('; '))}</span>` : ''}
              ${s.conflict ? `
                <span class="import-step-msg">⚠ ${esc(s.conflict)}</span>
                <select class="input input-sm conflict-res" data-idx="${s.idx}" aria-label="Conflict resolution">
                  <option value="merge" selected>Merge with existing</option>
                  <option value="apply">Replace existing</option>
                  <option value="skip">Skip</option>
                </select>` : ''}
            </li>`).join('')}
        </ol>
        <div class="dialog-actions">
          <button class="btn btn-primary" id="import-apply" ${okCount ? '' : 'disabled'}>Apply ${okCount} operation${okCount === 1 ? '' : 's'}</button>
        </div>
      </section>`;

    resultHost.querySelector('#import-apply')?.addEventListener('click', async ev => {
      ev.target.disabled = true;
      resultHost.querySelectorAll('.conflict-res').forEach(sel => {
        const step = analysis.plan.find(s => s.idx === Number(sel.dataset.idx));
        if (step) step.resolution = sel.value;
      });
      try {
        const results = await applyImport(analysis.plan);
        resultHost.innerHTML = `
          <section class="import-preview">
            <h2>Import complete</h2>
            <ol class="import-plan">
              ${results.map(r => `<li class="import-step ${r.result.startsWith('✓') ? 'step-ok' : 'step-error'}"><span class="import-step-desc">${esc(r.result)}</span></li>`).join('')}
            </ol>
            <p class="hint">Changed your mind? Use “Undo last import” above.</p>
          </section>`;
        toast('Import applied', 'success');
      } catch (err) {
        resultHost.innerHTML = `<div class="import-errors"><h2>Import rolled back</h2><p>${esc(err.message)}</p></div>`;
        toast('Import failed — rolled back', 'error');
      }
    });
  });

  main.querySelector('#undo-import').addEventListener('click', async () => {
    const snaps = await listSnapshots();
    const pre = snaps.find(s => s.kind === 'pre-import');
    if (!pre) { toast('No import to undo', 'warn'); return; }
    if (!await confirmDialog(`Restore the snapshot taken ${new Date(pre.createdAt).toLocaleString('en-CA')} (before the last import)? Changes made since then will be lost.`, { confirmLabel: 'Undo import', danger: true })) return;
    await restoreSnapshot(pre);
    location.reload();
  });
}
