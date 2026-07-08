/**
 * database.js — the single IndexedDB access layer.
 *
 * Every module reads and writes through the promisified helpers here.
 * No feature module ever opens IndexedDB itself — this file owns the
 * schema, versioning and store names (see docs/SCHEMA.md).
 *
 * Design rules:
 *  - Household shopping and Tancook Island Botanicals are SEPARATE object
 *    stores and must never be merged (hard product requirement).
 *  - Store names and key fields are part of the stable schema: never rename
 *    without bumping DB_VERSION and writing a migration in `upgrade()`.
 */

const DB_NAME = 'sharons-cookbook';
const DB_VERSION = 1;

/**
 * Canonical store registry: name → { keyPath, indexes }.
 * Exported so backup.js / importer.js can iterate every store generically.
 */
export const STORES = Object.freeze({
  recipes:            { keyPath: 'recipeId',      indexes: ['category', 'favourite', 'modified'] },
  mealPlans:          { keyPath: 'mealPlanId',    indexes: ['date'] },
  pantry:             { keyPath: 'pantryItemId',  indexes: ['location', 'category'] },
  shoppingHousehold:  { keyPath: 'itemId',        indexes: ['category', 'checked'] },
  shoppingBotanicals: { keyPath: 'itemId',        indexes: ['category', 'checked'] },
  garden:             { keyPath: 'gardenItemId',  indexes: ['plantName'] },
  activity:           { keyPath: 'activityId',    indexes: ['time'] },
  backups:            { keyPath: 'backupId',      indexes: ['createdAt', 'kind'] },
});

/** Stores that hold user content (everything exported/imported by backup.js). */
export const DATA_STORES = ['recipes', 'mealPlans', 'pantry', 'shoppingHousehold', 'shoppingBotanicals', 'garden'];

let _db = null;

/** Open (or return the cached) database connection. Called once at boot. */
export function openDatabase() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => upgrade(req.result, e.oldVersion);
    req.onsuccess = () => {
      _db = req.result;
      // If another tab upgrades the DB, close so it can proceed.
      _db.onversionchange = () => { _db.close(); _db = null; };
      resolve(_db);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Create/upgrade object stores. Future schema versions add migration steps
 * here keyed off `oldVersion` — existing stores and keys are never renamed.
 */
function upgrade(db, oldVersion) {
  if (oldVersion < 1) {
    for (const [name, def] of Object.entries(STORES)) {
      const store = db.createObjectStore(name, { keyPath: def.keyPath });
      for (const idx of def.indexes) store.createIndex(idx, idx);
    }
  }
}

/* ------------------------------------------------------------------ *
 *  Promisified primitives
 * ------------------------------------------------------------------ */

/** Run `fn(store)` in a transaction and resolve with the request result. */
function withStore(storeName, mode, fn) {
  return openDatabase().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const req = fn(tx.objectStore(storeName));
    tx.oncomplete = () => resolve(req?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

/** Get one record by primary key. */
export function dbGet(store, key) {
  return withStore(store, 'readonly', s => s.get(key));
}

/** Get every record in a store (views sort/filter in memory — fast to 10k+). */
export function dbGetAll(store) {
  return withStore(store, 'readonly', s => s.getAll());
}

/** Insert or replace one record. Returns the record for chaining. */
export async function dbPut(store, record) {
  await withStore(store, 'readwrite', s => s.put(record));
  return record;
}

/** Insert or replace many records in ONE transaction (imports, restores). */
export function dbBulkPut(store, records) {
  return openDatabase().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const s = tx.objectStore(store);
    for (const r of records) s.put(r);
    tx.oncomplete = () => resolve(records.length);
    tx.onerror = () => reject(tx.error);
  }));
}

/** Delete one record by key. */
export function dbDelete(store, key) {
  return withStore(store, 'readwrite', s => s.delete(key));
}

/** Delete every record in a store (restore-with-replace, wipe). */
export function dbClear(store) {
  return withStore(store, 'readwrite', s => s.clear());
}

/** Count records in a store (settings → storage statistics). */
export function dbCount(store) {
  return withStore(store, 'readonly', s => s.count());
}

/* ------------------------------------------------------------------ *
 *  Activity log
 * ------------------------------------------------------------------ */

/**
 * Record a user-visible activity entry ("Added recipe Hummus", …) shown on
 * the dashboard. Keeps only the most recent 200 entries.
 */
export async function logActivity(type, summary) {
  const entry = {
    activityId: `act_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    time: new Date().toISOString(),
    type,
    summary,
  };
  await dbPut('activity', entry);
  // Opportunistic trim — cheap enough to do inline.
  const all = await dbGetAll('activity');
  if (all.length > 200) {
    const stale = all.sort((a, b) => a.time.localeCompare(b.time)).slice(0, all.length - 200);
    for (const s of stale) await dbDelete('activity', s.activityId);
  }
  return entry;
}
