/* ==================================================================
   sw.js — myCookbook service worker.
   Cache-first offline shell. To SHIP AN UPDATE: bump VERSION below and
   push — installed phones see "Update ready" on next launch.
   ================================================================== */

const VERSION = 'v1.2.1';
const CACHE = 'mycookbook-' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css', './base.css', './components.css', './patterns.css',
  './tokens/fonts.css', './tokens/colors.css', './tokens/typography.css', './tokens/spacing.css', './tokens/shape.css',
  './units.js', './data.js', './import-parse.js', './import-web.js', './auth.js',
  './app.jsx', './screens-main.jsx', './screens-more.jsx',
  './recipes/build.js', './recipes/breakfast.js', './recipes/mains.js', './recipes/soups.js',
  './recipes/salads.js', './recipes/sides-breads.js', './recipes/sauces-preserves.js',
  './recipes/snacks-desserts.js', './recipes/drinks.js',
  './icons/app-icon-192.png', './icons/app-icon-512.png', './icons/app-icon-maskable-512.png', './icons/apple-touch-icon.png',
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && (k.indexOf('mycookbook-') === 0 || k.indexOf('sharons-cookbook-') === 0)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request))
  );
});
