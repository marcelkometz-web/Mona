const CACHE_NAME = 'ramonas-garten-v7';

// 1. ZWINGEND ERFORDERLICH: Ohne diese Dateien darf die Installation nicht gelingen
const CORE_ASSETS = [
  './',
  './index.html'
];

// 2. OPTIONALE ASSETS: Fehlende Icons oder Dokumente blockieren die App nicht
const OPTIONAL_ASSETS = [
  './manifest.webmanifest',
  './Read.txt',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// Installation: Harte Trennung zwischen Core und Optional
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Schritt A: Kern-Dateien zwingend cachen
      await cache.addAll(CORE_ASSETS);

      // Schritt B: Optionale Assets fehlertolerant nachladen
      await Promise.allSettled(
        OPTIONAL_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Optionales Asset ${asset} nicht geladen:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Aktivierung: Sicheres Löschen veralteter Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (currentCache) => {
      const hasCore = (await currentCache.match('./index.html')) || (await currentCache.match('./'));
      if (!hasCore) {
        console.warn('[SW] Neuer Cache ist unvollständig. Alte Caches werden geschont.');
        return;
      }

      // Alte ramonas-garten-Caches löschen
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name.startsWith('ramonas-garten-') && name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch-Strategie
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Nur Anfragen der eigenen Domain/Origin abfangen
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Navigation / HTML: Network-First (immer frisch, bei Funkloch Cache)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy
