/**
 * settings.js — preferences, backups, storage statistics, danger zone.
 *
 * Route: #/settings
 *
 * Preferences live in LocalStorage (utilities.js getSettings/saveSettings);
 * data lives in IndexedDB. This page is also the UI for backup.js.
 */

import { DATA_STORES, dbCount, dbClear, dbDelete } from './database.js';
import {
  esc, getSettings, saveSettings, applySettings, toast, confirmDialog,
  readFileText, sentenceCase,
} from './utilities.js';
import {
  downloadBackup, validateBackup, applyBackup, listSnapshots, restoreSnapshot,
  saveSnapshot, APP_VERSION, SCHEMA_VERSION,
} from './backup.js';

export async function renderSettings(main) {
  const settings = getSettings();
  const counts = {};
  for (const store of DATA_STORES) counts[store] = await dbCount(store);
  const snapshots = await listSnapshots();
  const estimate = navigator.storage?.estimate ? await navigator.storage.estimate() : null;

  const storeLabels = {
    recipes: 'Recipes', mealPlans: 'Meal plans', pantry: 'Pantry items',
    shoppingHousehold: 'Household shopping items', shoppingBotanicals: 'Botanicals shopping items',
    garden: 'Garden entries',
  };

  main.innerHTML = `
    <header class="page-head"><h1>Settings</h1></header>

    <div class="settings-grid">

      <section class="form-card">
        <h2>Appearance</h2>
        <fieldset class="radio-fieldset"><legend>Theme</legend>
          ${[['auto', 'Match device'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) =>
            `<label class="check-label"><input type="radio" name="theme" value="${v}" ${settings.theme === v ? 'checked' : ''}> ${l}</label>`).join('')}
        </fieldset>
        <label>Text size
          <select class="input" id="set-fontScale">
            ${[[0.9, 'Compact'], [1, 'Default'], [1.1, 'Comfortable'], [1.2, 'Large']].map(([v, l]) =>
              `<option value="${v}" ${Number(settings.fontScale) === v ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </label>
        <label>Measurements
          <select class="input" id="set-units">
            <option value="metric" ${settings.units === 'metric' ? 'selected' : ''}>Metric (g, ml, °C)</option>
            <option value="imperial" ${settings.units === 'imperial' ? 'selected' : ''}>Imperial (oz, lb, cups)</option>
          </select>
        </label>
        <label>Language
          <select class="input" id="set-language">
            <option value="en" selected>English</option>
          </select>
          <small class="hint">More languages can be added without code changes — the UI is language-ready.</small>
        </label>
      </section>

      <section class="form-card">
        <h2>Backup &amp; restore</h2>
        <p class="hint">Everything — recipes, plans, pantry, both shopping lists, garden, preferences — in one JSON file you can keep anywhere.</p>
        <div class="btn-col">
          <button class="btn btn-primary" id="bk-export">⇩ Export full backup</button>
          <label class="btn btn-ghost">⇧ Import backup… <input type="file" id="bk-import" accept=".json,application/json" hidden></label>
          <button class="btn btn-ghost" id="bk-snapshot">Save snapshot now</button>
        </div>
        <label class="check-label"><input type="checkbox" id="set-autoBackup" ${settings.autoBackup ? 'checked' : ''}> Automatic daily snapshot (kept on this device)</label>

        <h3>Stored snapshots</h3>
        <ul class="snapshot-list" id="snapshot-list">
          ${snapshots.length ? snapshots.map(s => `
            <li data-id="${esc(s.backupId)}">
              <span>${esc(s.label || s.kind)} <small>${new Date(s.createdAt).toLocaleString('en-CA')}</small></span>
              <span class="row-btns">
                <button class="btn btn-ghost btn-sm snap-restore">Restore</button>
                <button class="icon-btn snap-del" aria-label="Delete snapshot">✕</button>
              </span>
            </li>`).join('') : '<li class="hint">No snapshots yet.</li>'}
        </ul>
      </section>

      <section class="form-card">
        <h2>Storage</h2>
        <table class="stats-table"><tbody>
          ${DATA_STORES.map(s => `<tr><th scope="row">${storeLabels[s]}</th><td>${counts[s]}</td></tr>`).join('')}
          ${estimate ? `<tr><th scope="row">Device storage used</th><td>${(estimate.usage / 1048576).toFixed(1)} MB of ${(estimate.quota / 1048576 / 1024).toFixed(1)} GB</td></tr>` : ''}
        </tbody></table>
        <p class="hint">All data stays on this device. Nothing is ever sent anywhere.</p>
      </section>

      <section class="form-card danger-card">
        <h2>Danger zone</h2>
        <button class="btn btn-danger" id="wipe-all">Erase all data on this device</button>
        <p class="hint">Export a backup first — this cannot be undone.</p>
      </section>

      <section class="form-card">
        <h2>About</h2>
        <p>Sharon's Cookbook v${APP_VERSION} · data schema v${SCHEMA_VERSION}</p>
        <p class="hint">An offline-first cookbook that grows through AI-generated imports — see the AI import page.</p>
      </section>
    </div>
  `;

  /* --- preferences ------------------------------------------------------ */
  main.querySelectorAll('input[name=theme]').forEach(r => r.addEventListener('change', () => {
    applySettings(saveSettings({ theme: r.value }));
  }));
  main.querySelector('#set-fontScale').addEventListener('change', e => {
    applySettings(saveSettings({ fontScale: Number(e.target.value) }));
  });
  main.querySelector('#set-units').addEventListener('change', e => {
    saveSettings({ units: e.target.value });
    toast('Measurement preference saved', 'success');
  });
  main.querySelector('#set-language').addEventListener('change', e => saveSettings({ language: e.target.value }));
  main.querySelector('#set-autoBackup').addEventListener('change', e => saveSettings({ autoBackup: e.target.checked }));

  /* --- backups ---------------------------------------------------------- */
  main.querySelector('#bk-export').addEventListener('click', downloadBackup);

  main.querySelector('#bk-import').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    let obj;
    try { obj = JSON.parse(await readFileText(file)); }
    catch { toast('That file is not valid JSON', 'error'); return; }
    const problems = validateBackup(obj).filter(p => !p.includes('ignored'));
    if (problems.length) { toast(problems[0], 'error'); return; }

    // Merge keeps existing data; replace wipes first. Ask explicitly.
    const replace = await confirmDialog(
      'How should this backup be applied? “Replace” erases current data first; Cancel then choose merge if unsure.',
      { confirmLabel: 'Replace everything', danger: true });
    const mode = replace ? 'replace' : (await confirmDialog('Merge the backup into your current data instead? (Incoming records win when IDs clash.)', { confirmLabel: 'Merge' })) ? 'merge' : null;
    if (!mode) return;
    const count = await applyBackup(obj, mode);
    toast(`Restored ${count} records (${mode})`, 'success');
    location.reload();
  });

  main.querySelector('#bk-snapshot').addEventListener('click', async () => {
    await saveSnapshot('manual', `Manual snapshot`);
    toast('Snapshot saved', 'success');
    renderSettings(main);
  });

  main.querySelector('#snapshot-list').addEventListener('click', async e => {
    const li = e.target.closest('li[data-id]'); if (!li) return;
    const snap = snapshots.find(s => s.backupId === li.dataset.id);
    if (e.target.closest('.snap-restore')) {
      if (!await confirmDialog(`Restore “${snap.label}”? Current data is snapshotted first, then replaced.`, { confirmLabel: 'Restore', danger: true })) return;
      await restoreSnapshot(snap);
      location.reload();
    } else if (e.target.closest('.snap-del')) {
      await dbDelete('backups', snap.backupId);
      renderSettings(main);
    }
  });

  /* --- danger zone ------------------------------------------------------- */
  main.querySelector('#wipe-all').addEventListener('click', async () => {
    if (!await confirmDialog('Erase ALL recipes, plans, pantry, shopping lists, garden data and snapshots from this device?', { confirmLabel: 'Erase everything', danger: true })) return;
    if (!await confirmDialog('Really erase everything? This is the last confirmation.', { confirmLabel: 'Yes, erase it all', danger: true })) return;
    for (const store of [...DATA_STORES, 'activity', 'backups']) await dbClear(store);
    localStorage.removeItem('sc.settings');
    location.reload();
  });
}
