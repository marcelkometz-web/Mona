const CACHE_NAME = 'ramonas-garten-v5';

// 1. ZWINGEND ERFORDERLICH: Ohne diese Dateien DARF die Installation nicht gelingen!
const CORE_ASSETS = [
  './',
  './index.html'
];

// 2. OPTIONALE ASSETS: Fehlt hier etwas, soll die App trotzdem offline starten
const OPTIONAL_ASSETS = [
  './manifest.webmanifest',
  './Read.txt',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// Installation: Harte Trennung zwischen lebenswichtig und optional
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Schritt A: Kern-Dateien MÜSSEN erfolgreich sein
      await cache.addAll(CORE_ASSETS);

      // Schritt B: Optionale Assets tolerant nachladen
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

// Aktivierung: Sicheres Löschen alter Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (currentCache) => {
      // Prüfen, ob die index.html im aktuellen Cache wirklich existiert
      const hasCore = (await currentCache.match('./index.html')) || (await currentCache.match('./'));
      if (!hasCore) {
        console.warn('[SW] Neuer Cache ist unvollständig. Alte Caches werden geschont.');
        return;
      }

      // Veraltete ramonas-garten-Caches aufräumen
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

  // Nur Anfragen des eigenen Ursprungs abfangen
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Navigation / HTML: Network-First (frische Version laden, bei Funkloch Cache)
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
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match('./index.html')) || (await caches.match('./'));
        })
    );
    return;
  }

  // 2. Statische Dateien (Read.txt, Icons, Manifest): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      // Liefert Cache sofort, falls vorhanden – sonst wartet er auf das Netzwerk
      return cachedResponse || fetchPromise.then((res) => res || new Response('', { status: 404, statusText: 'Not Found' }));
    })
  );
});
