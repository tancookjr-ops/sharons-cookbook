/**
 * backup.js — full export / import / restore + automatic backups.
 *
 * Backup file format (stable, documented in docs/IMPORT_SPEC.md §Backups):
 * {
 *   schemaVersion: 1,
 *   exportDate:    ISO timestamp,
 *   exportedBy:    "Sharon's Cookbook",
 *   applicationVersion: "x.y.z",
 *   kind: "FULL_BACKUP",
 *   data: { recipes: [...], mealPlans: [...], pantry: [...],
 *           shoppingHousehold: [...], shoppingBotanicals: [...], garden: [...] },
 *   settings: { ...preferences }
 * }
 *
 * Automatic backups: once per calendar day (if enabled in settings) the app
 * writes a full snapshot into the `backups` object store and keeps the most
 * recent KEEP_AUTO. Restoring is always preceded by a safety snapshot.
 */

import { DATA_STORES, dbGetAll, dbBulkPut, dbClear, dbPut, dbDelete, logActivity } from './database.js';
import {
  uid, nowISO, todayISO, downloadFile, getSettings, saveSettings, toast,
} from './utilities.js';

export const SCHEMA_VERSION = 1;
export const APP_VERSION = '1.0.0';
const KEEP_AUTO = 7;

/* ------------------------------------------------------------------ *
 *  Export
 * ------------------------------------------------------------------ */

/** Snapshot every data store + settings into a plain object. */
export async function exportEverything() {
  const data = {};
  for (const store of DATA_STORES) data[store] = await dbGetAll(store);
  return {
    schemaVersion: SCHEMA_VERSION,
    exportDate: nowISO(),
    exportedBy: "Sharon's Cookbook",
    applicationVersion: APP_VERSION,
    kind: 'FULL_BACKUP',
    data,
    settings: getSettings(),
  };
}

/** Download a full backup as JSON. */
export async function downloadBackup() {
  const snapshot = await exportEverything();
  downloadFile(`sharons-cookbook-backup-${todayISO()}.json`, JSON.stringify(snapshot, null, 2));
  await logActivity('backup', 'Exported full backup');
}

/* ------------------------------------------------------------------ *
 *  Import / restore
 * ------------------------------------------------------------------ */

/**
 * Validate a parsed backup object. Returns a list of problems (empty = ok).
 * Forward-compatibility: a newer schemaVersion is refused with a clear
 * message rather than half-imported.
 */
export function validateBackup(obj) {
  const problems = [];
  if (!obj || typeof obj !== 'object') return ['Not a JSON object.'];
  if (obj.schemaVersion == null) problems.push('Missing schemaVersion.');
  else if (obj.schemaVersion > SCHEMA_VERSION) problems.push(`Backup schema v${obj.schemaVersion} is newer than this app understands (v${SCHEMA_VERSION}). Update the app first.`);
  if (!obj.data || typeof obj.data !== 'object') problems.push('Missing data section.');
  else {
    for (const store of Object.keys(obj.data)) {
      if (!DATA_STORES.includes(store)) problems.push(`Unknown data section “${store}” (ignored).`);
      else if (!Array.isArray(obj.data[store])) problems.push(`Section “${store}” is not a list.`);
    }
  }
  return problems;
}

/**
 * Apply a backup.
 * @param {'replace'|'merge'} mode  replace: wipe stores first;
 *                                  merge: incoming records win on ID clash,
 *                                  everything else is kept.
 * Always takes a safety snapshot first so the operation can be rolled back
 * from Settings → Backups.
 */
export async function applyBackup(obj, mode) {
  await saveSnapshot('pre-restore', `Before ${mode} restore`);
  let count = 0;
  for (const store of DATA_STORES) {
    const incoming = obj.data[store];
    if (!Array.isArray(incoming)) continue;
    if (mode === 'replace') await dbClear(store);
    if (incoming.length) { await dbBulkPut(store, incoming); count += incoming.length; }
  }
  if (obj.settings && typeof obj.settings === 'object') {
    // Preferences restore too, but never clobber the auto-backup bookkeeping.
    const { lastAutoBackup, ...prefs } = obj.settings;
    saveSettings(prefs);
  }
  await logActivity('backup', `Restored backup (${mode}, ${count} records)`);
  return count;
}

/* ------------------------------------------------------------------ *
 *  Snapshots in IndexedDB (automatic + safety)
 * ------------------------------------------------------------------ */

/** Write a full snapshot into the backups store. */
export async function saveSnapshot(kind, label) {
  const snapshot = await exportEverything();
  await dbPut('backups', {
    backupId: uid('bak'),
    createdAt: nowISO(),
    kind,             // 'auto' | 'pre-restore' | 'pre-import' | 'manual'
    label,
    payload: snapshot,
  });
  await pruneSnapshots();
}

/** Keep automatic snapshots bounded; safety snapshots keep the last 5. */
async function pruneSnapshots() {
  const all = (await dbGetAll('backups')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const autos = all.filter(b => b.kind === 'auto').slice(KEEP_AUTO);
  const safety = all.filter(b => b.kind !== 'auto').slice(5);
  for (const b of [...autos, ...safety]) await dbDelete('backups', b.backupId);
}

/** Called at boot: writes today's automatic backup if it hasn't happened. */
export async function runAutoBackupIfDue() {
  const settings = getSettings();
  if (!settings.autoBackup) return;
  if (settings.lastAutoBackup === todayISO()) return;
  try {
    await saveSnapshot('auto', `Automatic backup ${todayISO()}`);
    saveSettings({ lastAutoBackup: todayISO() });
  } catch (err) {
    console.warn('Automatic backup failed:', err);
  }
}

/** List stored snapshots, newest first (Settings UI). */
export async function listSnapshots() {
  return (await dbGetAll('backups')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Restore a stored snapshot (full replace, with its own safety snapshot). */
export async function restoreSnapshot(snapshot) {
  const count = await applyBackup(snapshot.payload, 'replace');
  toast(`Restored ${count} records from ${snapshot.label}`, 'success');
  return count;
}

export { dbDelete as deleteSnapshotRecord };
