/**
 * utilities.js — shared helpers for Sharon's Cookbook.
 *
 * Pure functions + small UI primitives (toast, dialog) used by every module.
 * Nothing in here touches IndexedDB; nothing in here knows about routes.
 * Keep this file dependency-free — every other module imports from it.
 */

/* ------------------------------------------------------------------ *
 *  IDs, strings, escaping
 * ------------------------------------------------------------------ */

/**
 * Generate a stable unique id with a readable prefix, e.g. "rec_k3v9x2a1b".
 * IDs are permanent once assigned (see SCHEMA.md — never change IDs).
 * @param {string} prefix short type prefix ("rec", "mp", "pan", "shp", "gar")
 */
export function uid(prefix = 'id') {
  const rand = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}_${Date.now().toString(36)}${rand[0].toString(36)}${rand[1].toString(36)}`;
}

/** Escape a value for safe interpolation into HTML template strings. */
export function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Escape a value for use inside an HTML attribute (alias, reads better). */
export const escAttr = esc;

/** Title-case a short label ("soap oils" → "Soap oils"). */
export function sentenceCase(s) {
  s = String(s ?? '').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Normalize a string for searching/matching: lowercase, trimmed, no accents. */
export function norm(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

/* ------------------------------------------------------------------ *
 *  Dates
 * ------------------------------------------------------------------ */

/** Current timestamp in ISO-8601 (what all `created`/`modified` fields use). */
export function nowISO() { return new Date().toISOString(); }

/** Today's date as "YYYY-MM-DD" in the *local* timezone (planner key format). */
export function todayISO() { return toDateISO(new Date()); }

/** Format a Date as local "YYYY-MM-DD". */
export function toDateISO(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" into a local Date (avoids UTC off-by-one). */
export function fromDateISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Add n days to a "YYYY-MM-DD" string, returns "YYYY-MM-DD". */
export function addDays(iso, n) {
  const d = fromDateISO(iso);
  d.setDate(d.getDate() + n);
  return toDateISO(d);
}

/** Monday of the week containing the given "YYYY-MM-DD". */
export function weekStart(iso) {
  const d = fromDateISO(iso);
  const shift = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  d.setDate(d.getDate() - shift);
  return toDateISO(d);
}

/** Human date, e.g. "Tue 8 Jul" or "Tuesday 8 July 2026" (long). */
export function fmtDate(iso, long = false) {
  if (!iso) return '';
  const d = iso.length > 10 ? new Date(iso) : fromDateISO(iso);
  return d.toLocaleDateString('en-CA', long
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Relative time for activity feeds: "just now", "3 h ago", "2 d ago". */
export function relTime(isoTimestamp) {
  const ms = Date.now() - new Date(isoTimestamp).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} d ago`;
  return fmtDate(isoTimestamp);
}

/** Days between today and a "YYYY-MM-DD" date (negative = past). */
export function daysUntil(iso) {
  return Math.round((fromDateISO(iso) - fromDateISO(todayISO())) / 86400000);
}

/** Northern-hemisphere season for a date (used on the dashboard + garden). */
export function seasonOf(d = new Date()) {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'Spring';
  if (m >= 6 && m <= 8) return 'Summer';
  if (m >= 9 && m <= 11) return 'Autumn';
  return 'Winter';
}

/* ------------------------------------------------------------------ *
 *  Quantities, units, scaling
 * ------------------------------------------------------------------ */

/** Common unicode fractions for pretty ingredient amounts. */
const FRACTIONS = [[0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.667, '⅔'], [0.75, '¾']];

/**
 * Format a numeric amount for display: 0.5 → "½", 1.5 → "1½", 2 → "2",
 * 1.333 → "1⅓", anything awkward falls back to 2 decimals.
 */
export function fmtAmount(n) {
  if (n == null || n === '' || isNaN(n)) return '';
  n = Number(n);
  const whole = Math.floor(n);
  const frac = n - whole;
  if (frac < 0.05) return String(whole || 0);
  for (const [v, glyph] of FRACTIONS) {
    if (Math.abs(frac - v) < 0.05) return (whole ? whole : '') + glyph;
  }
  return String(Math.round(n * 100) / 100);
}

/**
 * Scale an ingredient amount by a factor. Amounts are stored as numbers
 * (or null for "to taste"); scaling never mutates the stored recipe.
 */
export function scaleAmount(amount, factor) {
  if (amount == null || amount === '' || isNaN(amount)) return amount;
  return Math.round(Number(amount) * factor * 1000) / 1000;
}

/**
 * Metric ⇄ imperial display conversion for the most common kitchen units.
 * Data is *stored* in whatever unit the recipe uses; this only converts
 * for display when the user's measurement preference differs.
 * Returns { amount, unit } — unchanged when no sensible conversion exists.
 */
export function convertUnit(amount, unit, target /* 'metric' | 'imperial' */) {
  if (amount == null || isNaN(amount)) return { amount, unit };
  const u = norm(unit);
  const conv = {
    metric: { 'lb': [453.6, 'g'], 'lbs': [453.6, 'g'], 'oz': [28.35, 'g'], 'fl oz': [29.57, 'ml'], 'quart': [946, 'ml'], 'qt': [946, 'ml'] },
    imperial: { 'kg': [2.205, 'lb'], 'g': [0.0353, 'oz'], 'l': [33.8, 'fl oz'], 'ml': [0.0338, 'fl oz'] },
  }[target]?.[u];
  if (!conv) return { amount, unit };
  return { amount: Math.round(amount * conv[0] * 100) / 100, unit: conv[1] };
}

/* ------------------------------------------------------------------ *
 *  Collections
 * ------------------------------------------------------------------ */

/** Group an array into a Map keyed by fn(item), preserving insertion order. */
export function groupBy(arr, fn) {
  const map = new Map();
  for (const item of arr) {
    const key = fn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

/** Non-mutating sort by a key-extractor, with optional descending order. */
export function sortBy(arr, fn, desc = false) {
  return [...arr].sort((a, b) => {
    const av = fn(a), bv = fn(b);
    const r = av < bv ? -1 : av > bv ? 1 : 0;
    return desc ? -r : r;
  });
}

/** Debounce (used by instant search so typing stays smooth at 10k recipes). */
export function debounce(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ------------------------------------------------------------------ *
 *  Files: download / read / images
 * ------------------------------------------------------------------ */

/** Trigger a client-side file download (used by backup + exports). */
export function downloadFile(filename, content, mime = 'application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Read a File as text (import flows). */
export function readFileText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

/**
 * Read an image File, downscale it on a canvas (max 1280px edge) and return
 * a JPEG data-URL. Keeps recipe photos small enough to live inside IndexedDB
 * records without bloating backups.
 */
export function readImageResized(file, maxEdge = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

/* ------------------------------------------------------------------ *
 *  Toasts
 * ------------------------------------------------------------------ */

/**
 * Show a transient toast notification.
 * @param {string} message
 * @param {'info'|'success'|'warn'|'error'} kind
 */
export function toast(message, kind = 'info', ms = 3200) {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.textContent = message;
  region.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, ms);
}

/* ------------------------------------------------------------------ *
 *  Dialogs
 * ------------------------------------------------------------------ */

/**
 * Open the shared <dialog> with arbitrary HTML content.
 * Returns the dialog element; caller wires its own buttons/forms.
 * A `[data-close]` attribute on any child closes the dialog.
 */
export function openDialog(html, { wide = false } = {}) {
  const dlg = document.getElementById('app-dialog');
  dlg.classList.toggle('dialog-wide', wide);
  dlg.innerHTML = html;
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  if (!dlg.open) dlg.showModal();
  return dlg;
}

export function closeDialog() {
  const dlg = document.getElementById('app-dialog');
  if (dlg.open) dlg.close();
}

/** Accessible confirm dialog. Resolves true/false. */
export function confirmDialog(message, { confirmLabel = 'Confirm', danger = false } = {}) {
  return new Promise(resolve => {
    const dlg = openDialog(`
      <form method="dialog" class="dialog-body">
        <p class="dialog-message">${esc(message)}</p>
        <div class="dialog-actions">
          <button value="no" class="btn btn-ghost">Cancel</button>
          <button value="yes" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" autofocus>${esc(confirmLabel)}</button>
        </div>
      </form>`);
    dlg.addEventListener('close', () => resolve(dlg.returnValue === 'yes'), { once: true });
  });
}

/* ------------------------------------------------------------------ *
 *  Settings (LocalStorage — preferences only, per architecture rules)
 * ------------------------------------------------------------------ */

const SETTINGS_KEY = 'sc.settings';

export const DEFAULT_SETTINGS = Object.freeze({
  theme: 'auto',          // 'auto' | 'light' | 'dark'
  fontScale: 1,           // 0.9 | 1 | 1.1 | 1.2
  units: 'metric',        // 'metric' | 'imperial'
  autoBackup: true,       // daily automatic backup into IndexedDB
  language: 'en',         // language-ready: all UI strings route through here later
  seeded: false,          // starter content loaded on first run
  lastAutoBackup: null,   // "YYYY-MM-DD" of last automatic backup
});

/** Read merged settings (defaults ⊕ stored). */
export function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

/** Persist a partial settings patch and return the merged result. */
export function saveSettings(patch) {
  const merged = { ...getSettings(), ...patch };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}

/** Apply visual settings (theme + font scale) to the document root. */
export function applySettings(settings = getSettings()) {
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.style.setProperty('--font-scale', settings.fontScale);
}
