const CACHE_NAME = 'my-game-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Alon Shaul Logo.png',
  '/logo512.png'
  // הוסיפו כאן קבצים נוספים (CSS, JS, תמונות) לפי הצורך
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
