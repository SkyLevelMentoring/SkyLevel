/**
 * SKYLEVEL AVIATION - Progressive Web App Service Worker
 * Version: 1.1.0
 */

const CACHE_NAME = 'skylevel-cache-v2';
const DYNAMIC_CACHE_NAME = 'skylevel-dynamic-v2';

// Critical core assets required for offline app shell execution
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/data.js',
  '/js/app.js',
  '/manifest.json',
  '/favicon.ico'
];

/* ==========================================================================
   1. INSTALL EVENT
   Pre-caches static application shell resources and forces immediate activation.
   ========================================================================== */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching SkyLevel App Shell');
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => console.error('[Service Worker] Pre-cache failed:', err))
  );
});

/* ==========================================================================
   2. ACTIVATE EVENT
   Purges stale cache versions from storage and claims client control immediately.
   ========================================================================== */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/* ==========================================================================
   3. FETCH EVENT
   ========================================================================== */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // STRATEGY 1: Network-First Strategy for Flight Data & APIs
  // Intercepts ADS-B Exchange, weather APIs, or local flight data queries
  if (isFlightDataRequest(request.url)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If network fetch succeeds, cache a copy dynamically and return fresh data
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failure / Offline: Fall back to last cached telemetry data
          console.warn('[Service Worker] Offline: Serving cached flight data for', request.url);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback response if no cache exists yet
            return new Response(
              JSON.stringify({
                offline: true,
                message: "Flight data currently unavailable offline. Reconnect to sync."
              }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // STRATEGY 2: Cache-First Strategy for Static Local Assets
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // STRATEGY 3: Standard Navigation / Stale-While-Revalidate Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
      return cachedResponse || fetchPromise;
    })
  );
});

/**
 * Checks if a request URL belongs to flight telemetry or dynamic API feeds
 */
function isFlightDataRequest(url) {
  return url.includes('adsbexchange.com') ||
         url.includes('/api/flights') ||
         url.includes('data.js') ||
         url.includes('weather');
}

/**
 * Helper to identify static local assets
 */
function isStaticAsset(url) {
  return STATIC_ASSETS.some((asset) => url.endsWith(asset)) ||
         /\.(css|js|png|jpg|jpeg|svg|ico|woff2?)$/i.test(url);
}
