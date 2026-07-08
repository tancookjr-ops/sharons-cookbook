/**
 * sw.js — service worker: full offline support for Sharon's Cookbook.
 *
 * Strategy:
 *  - Precache the entire application shell on install (it's small — the
 *    data lives in IndexedDB, not in the cache).
 *  - Cache-first for everything in the shell: the app opens instantly and
 *    works with no network at all.
 *  - Update flow: bump CACHE_VERSION on every release → new worker installs
 *    in the background → app.js shows the "Update now" banner → user clicks
 *    → SKIP_WAITING → controllerchange → reload. Old caches are deleted on
 *    activate.
 */

const CACHE_VERSION = 'sc-v1.0.0';

/** Every file the app needs to run offline. Keep in sync with the repo. */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './css/layout.css',
  './css/forms.css',
  './css/dashboard.css',
  './css/recipes.css',
  './css/planner.css',
  './css/pantry.css',
  './css/shopping.css',
  './css/garden.css',
  './js/app.js',
  './js/utilities.js',
  './js/database.js',
  './js/recipes.js',
  './js/planner.js',
  './js/pantry.js',
  './js/shopping.js',
  './js/garden.js',
  './js/settings.js',
  './js/backup.js',
  './js/importer.js',
  './js/dashboard.js',
  './data/starter-import.json',
  './data/sample-import.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Drop caches from previous versions.
    for (const key of await caches.keys()) {
      if (key !== CACHE_VERSION) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return; // never touch cross-origin

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);

    // Cache-first: the shell never changes within a version.
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      // Opportunistically cache same-origin GETs (e.g. future data files).
      if (response.ok) cache.put(request, response.clone());
      return response;
    } catch {
      // Offline and not cached: navigations fall back to the app shell.
      if (request.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
