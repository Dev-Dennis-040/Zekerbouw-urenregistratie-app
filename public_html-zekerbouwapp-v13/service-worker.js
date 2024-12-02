const CACHE_NAME = 'urenCalculator-cache-v13'; // Nieuwe versie van de cache
const urlsToCache = [
    '/', // Root van je applicatie
    '/index.html',
    '/style.css',
    '/script.js',
    // Voeg alle andere benodigde bestanden toe die je wilt cachen
];

// Installeren van de Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker geïnstalleerd.');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching nieuwe bestanden');
            return cache.addAll(urlsToCache);
        }).then(() => {
            return self.skipWaiting(); // Forceer de nieuwe service worker om de oude onmiddellijk te vervangen
        })
    );
});

// Activeren van de Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker geactiveerd');
    const cacheWhitelist = [CACHE_NAME]; // De cache die we willen behouden

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Verwijderen van oude cache:', cacheName);
                        return caches.delete(cacheName); // Verwijder oude caches
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Zorg ervoor dat de nieuwe service worker onmiddellijk de controle over de pagina overneemt
        })
    );
});

// Fetch event voor het ophalen van gecachte bestanden (Network-First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Indien er een succesvol netwerkantwoord is, cache het bestand opnieuw
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Indien het netwerk faalt, gebruik de cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Voeg een fallback naar een offline pagina toe, indien nodig
                    return caches.match('/offline.html');
                });
            })
    );
});

// Controleer voor nieuwe versie van de Service Worker
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting(); // Forceer de nieuwe service worker om onmiddellijk de oude te vervangen
    }
});

