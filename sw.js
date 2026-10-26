// Retire the old /Mona/ app without touching the current apps or their sessions.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const scope = new URL(self.registration.scope);
    if (scope.pathname !== '/Mona/') {
      await self.registration.unregister();
      return;
    }
    // This exact cache was created only from the former Mona CORE_ASSETS.
    await caches.delete('ramonas-garten-v4');
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window' });
    await self.registration.unregister();
    await Promise.allSettled(windows.filter(client => {
      const url = new URL(client.url);
      return url.origin === scope.origin &&
        (url.pathname === '/Mona' || url.pathname.startsWith('/Mona/'));
    }).map(client => client.navigate(client.url)));
  })());
});
