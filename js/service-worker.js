// service-worker.js
const CACHE_NAME = 'to-do-list-cache-v1';
const urlsToCache = [
  '/',
  '../index.html',
  '../css/styles.css',
  '/script.js',
  '../manifest.json',
  '../media/to-do-list.png',
  '../media/ding-sound-effect_2.mp3',
  '../media/annie-spratt-Ki0-ea-Hgx4-unsplash.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});