const CACHE_NAME = 'ramonas-garten-v8';

// Dateien, die für den vollen Offline-Betrieb benötigt werden
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './Read.txt',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// Installation: Fehlertolerantes Vorab-Caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[Service Worker] Vorab-Cache für ${asset} übersprungen:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Aktivierung: Nur veraltete Caches dieser App aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name.startsWith('ramonas-garten-') && name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Abfragen verarbeiten
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Nur GET-Requests cachen
  if (request.method !== 'GET') return;

  // 1. Navigation / HTML: Network-First (Updates sofort laden, Offline aus Cache)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // 2. Statische Assets (Bilder, Manifest, Textdateien): Cache-First mit Netzwerk-Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      });
    })
  );
});
