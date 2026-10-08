const CACHE_NAME = 'ramonas-garten-v9';

// Alle Dateien, die für den vollständigen Offline-Betrieb nötig sind
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
            console.warn(`[SW] Vorab-Cache für ${asset} übersprungen:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Aktivierung: Alte Versionen dieses Projekts löschen, fremde Caches unberührt lassen
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

// Abfragen behandeln
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Nur GET-Anfragen verarbeiten
  if (request.method !== 'GET') return;

  // 1. Navigation & HTML: Network-First (für unmittelbare Updates auf dem iPhone)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // 2. Statische Assets (Icons, Read.txt, Manifest): Cache-First mit Netzwerk-Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const copy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return networkResponse;
      });
    })
  );
});
