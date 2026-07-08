/**
 * app.js — application entry point: boot, hash router, shell behaviour.
 *
 * Responsibilities:
 *  - open the database, apply preferences, seed starter content on first run
 *  - hash-based routing (#/dashboard, #/recipes, #/recipe/:id, …)
 *  - sidebar / theme toggle / online indicator / keyboard shortcuts
 *  - service-worker registration + "update available" banner
 *  - daily automatic backup trigger
 *
 * Feature modules own their routes' rendering; this file only dispatches.
 */

import { openDatabase } from './database.js';
import {
  getSettings, saveSettings, applySettings, toast,
} from './utilities.js';
import { renderDashboard } from './dashboard.js';
import { renderRecipeList, renderRecipeDetail, renderRecipeEditor } from './recipes.js';
import { renderPlanner } from './planner.js';
import { renderPantry } from './pantry.js';
import { renderHouseholdShopping, renderBotanicalsShopping } from './shopping.js';
import { renderGarden } from './garden.js';
import { renderImporter, analyseImport, applyImport } from './importer.js';
import { renderSettings } from './settings.js';
import { runAutoBackupIfDue, APP_VERSION } from './backup.js';

/* ------------------------------------------------------------------ *
 *  Routes
 * ------------------------------------------------------------------ */

/** pattern → handler. ":name" segments become params. */
const ROUTES = [
  ['dashboard', renderDashboard],
  ['recipes', renderRecipeList],
  ['recipe/:id', renderRecipeDetail],
  ['recipe-edit/:id', renderRecipeEditor],
  ['planner', renderPlanner],
  ['pantry', renderPantry],
  ['shopping', renderHouseholdShopping],
  ['botanicals', renderBotanicalsShopping],
  ['garden', renderGarden],
  ['import', renderImporter],
  ['settings', renderSettings],
];

/** Match "recipe/abc" against "recipe/:id" → { id: "abc" } or null. */
function matchRoute(pattern, path) {
  const pSegs = pattern.split('/');
  const aSegs = path.split('/');
  if (pSegs.length !== aSegs.length) return null;
  const params = {};
  for (let i = 0; i < pSegs.length; i++) {
    if (pSegs[i].startsWith(':')) params[pSegs[i].slice(1)] = decodeURIComponent(aSegs[i]);
    else if (pSegs[i] !== aSegs[i]) return null;
  }
  return params;
}

async function dispatch() {
  const main = document.getElementById('main');
  const path = (location.hash.replace(/^#\/?/, '') || 'dashboard').replace(/\/$/, '');

  for (const [pattern, handler] of ROUTES) {
    const params = matchRoute(pattern, path);
    if (params) {
      highlightNav(pattern.split('/')[0]);
      closeSidebar();
      try {
        await handler(main, params);
      } catch (err) {
        console.error('View failed:', err);
        main.innerHTML = `<div class="empty-state"><p>Something went wrong loading this page.</p><p class="hint">${String(err.message || err)}</p></div>`;
      }
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/dashboard';
}

function highlightNav(section) {
  // recipe/recipe-edit routes highlight the Recipes nav entry.
  const key = section.startsWith('recipe') ? 'recipes' : section;
  document.querySelectorAll('#nav-list a').forEach(a => {
    const active = a.dataset.nav === key;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

/* ------------------------------------------------------------------ *
 *  Shell: sidebar, theme, online status, shortcuts
 * ------------------------------------------------------------------ */

function closeSidebar() {
  document.getElementById('app-shell').classList.remove('nav-open');
  document.getElementById('sidebar-scrim').hidden = true;
  document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
}

function initShell() {
  const shell = document.getElementById('app-shell');
  const scrim = document.getElementById('sidebar-scrim');

  document.getElementById('nav-toggle').addEventListener('click', e => {
    const open = shell.classList.toggle('nav-open');
    scrim.hidden = !open;
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
  scrim.addEventListener('click', closeSidebar);

  // Theme toggle: explicit light ⇄ dark (auto users get switched to explicit).
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const cur = getSettings().theme;
    const effectiveDark = cur === 'dark' || (cur === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    applySettings(saveSettings({ theme: effectiveDark ? 'light' : 'dark' }));
  });

  // Online / offline indicator — informational only; the app works either way.
  const net = document.getElementById('net-status');
  const paintNet = () => {
    net.textContent = navigator.onLine ? '' : 'Offline';
    net.classList.toggle('offline', !navigator.onLine);
  };
  addEventListener('online', paintNet);
  addEventListener('offline', paintNet);
  paintNet();

  // Keyboard shortcuts: "/" focuses the page's search box if there is one.
  addEventListener('keydown', e => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) {
      const search = document.querySelector('#main input[type=search]');
      if (search) { e.preventDefault(); search.focus(); }
    }
  });

  document.getElementById('app-version').textContent = `v${APP_VERSION} · offline-first`;
}

/* ------------------------------------------------------------------ *
 *  Service worker + update detection
 * ------------------------------------------------------------------ */

async function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('sw.js');

    const showBanner = worker => {
      const banner = document.getElementById('update-banner');
      banner.hidden = false;
      document.getElementById('update-reload').onclick = () => {
        worker.postMessage({ type: 'SKIP_WAITING' });
      };
      document.getElementById('update-dismiss').onclick = () => { banner.hidden = true; };
    };

    if (reg.waiting) showBanner(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showBanner(worker);
      });
    });
    // Reload once the new worker takes control.
    let refreshed = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshed) { refreshed = true; location.reload(); }
    });
  } catch (err) {
    console.warn('Service worker registration failed:', err);
  }
}

/* ------------------------------------------------------------------ *
 *  First-run starter content — loaded through the AI import engine so the
 *  seed file is also living documentation of the import format.
 * ------------------------------------------------------------------ */

async function seedIfFirstRun() {
  const settings = getSettings();
  if (settings.seeded) return;
  try {
    const res = await fetch('data/starter-import.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { plan, errors } = await analyseImport(await res.text());
    if (!errors.length) {
      await applyImport(plan.filter(s => !s.problems.length));
      toast('Welcome! Starter recipes were added to get you going.', 'success', 5000);
    }
  } catch (err) {
    console.warn('Starter content not loaded:', err);
  } finally {
    saveSettings({ seeded: true }); // never retry-loop a failing seed
  }
}

/* ------------------------------------------------------------------ *
 *  Boot
 * ------------------------------------------------------------------ */

async function boot() {
  applySettings();
  await openDatabase();
  initShell();
  await seedIfFirstRun();
  addEventListener('hashchange', dispatch);
  await dispatch();
  // Non-blocking housekeeping after first paint.
  runAutoBackupIfDue();
  initServiceWorker();
  // Ask the browser to protect our data from eviction where supported.
  navigator.storage?.persist?.().catch(() => {});
}

boot();
