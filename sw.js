const CACHE_NAME = 'ramonas-garten-v4';

const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './Read.txt',
    './manifest.webmanifest',
    './apple-touch-icon.png',
    './icon.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
