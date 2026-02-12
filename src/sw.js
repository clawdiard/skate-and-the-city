/**
 * Service Worker — Skate And the City PWA
 * Workbox-style caching with precache + runtime strategies
 */

const CACHE_VERSION = 'v2';
const PRECACHE_NAME = `skate-city-precache-${CACHE_VERSION}`;
const RUNTIME_NAME = `skate-city-runtime-${CACHE_VERSION}`;
const TILE_CACHE_NAME = `skate-city-tiles-${CACHE_VERSION}`;

const MAX_TILE_ENTRIES = 500;

// Precache: app shell + data
const PRECACHE_URLS = [
  '/skate-and-the-city/',
  '/skate-and-the-city/assets/css/style.css',
  '/skate-and-the-city/assets/js/search.js',
  '/skate-and-the-city/spots/',
  '/skate-and-the-city/routes/',
  '/skate-and-the-city/map/',
  '/skate-and-the-city/search-index.json',
  '/skate-and-the-city/manifest.json',
  '/skate-and-the-city/offline/',
  '/skate-and-the-city/data/spots.json',
  '/skate-and-the-city/data/routes.json'
];

// ─── Install: precache core assets ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: clean old caches ───
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE_NAME, RUNTIME_NAME, TILE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !currentCaches.includes(key))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Helpers ───
function isMapTile(url) {
  return url.hostname.includes('tile.openstreetmap.org') ||
         url.hostname.includes('tiles.') ||
         url.pathname.match(/\/\d+\/\d+\/\d+\.\w+$/);
}

function isImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/i.test(url.pathname);
}

function isDataJson(url) {
  return url.pathname.includes('/data/') && url.pathname.endsWith('.json');
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Evict oldest entries (FIFO)
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map(req => cache.delete(req)));
  }
}

// ─── Strategies ───

// Cache-first (for tiles)
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      // Trim tile cache
      if (cacheName === TILE_CACHE_NAME) {
        trimCache(TILE_CACHE_NAME, MAX_TILE_ENTRIES);
      }
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}

// Stale-while-revalidate (for images)
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(RUNTIME_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network-first (for HTML pages)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PRECACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/skate-and-the-city/offline/');
    }
    return new Response('Offline', { status: 503 });
  }
}

// ─── Fetch handler ───
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET
  if (event.request.method !== 'GET') return;

  // Map tiles: cache-first
  if (isMapTile(url)) {
    event.respondWith(cacheFirst(event.request, TILE_CACHE_NAME));
    return;
  }

  // Images: stale-while-revalidate
  if (isImage(url)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Data JSON: cache-first (spot/route data)
  if (isDataJson(url)) {
    event.respondWith(cacheFirst(event.request, PRECACHE_NAME));
    return;
  }

  // Everything else (HTML, CSS, JS): network-first
  event.respondWith(networkFirst(event.request));
});

// ─── Background sync (placeholder for future community features) ───
self.addEventListener('sync', event => {
  if (event.tag === 'sync-community') {
    // Future: sync community contributions when back online
    event.waitUntil(Promise.resolve());
  }
});

// ─── Listen for skip-waiting message from clients ───
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
