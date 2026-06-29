const CACHE_NAME = 'eduflow-v3';
const STATIC_CACHE = 'eduflow-static-v3';
const DYNAMIC_CACHE = 'eduflow-dynamic-v3';

const PRECACHE_URLS = [
    '/',
    '/offline',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
                .map((k) => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    if (request.url.includes('/api/') || request.url.includes('/login') || request.url.includes('/register')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    if (request.destination === 'document') {
                        return caches.match('/offline');
                    }
                    return new Response('Offline', { status: 503, statusText: 'Offline' });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            const networkFetch = fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    if (request.destination === 'document') {
                        return caches.match('/offline');
                    }
                    return cached;
                });

            return cached || networkFetch;
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/dashboard');
            }
        })
    );
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'EduFlow', body: 'إشعار جديد' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-72.png',
            vibrate: [100, 50, 100],
            data: { url: data.url || '/dashboard' },
        })
    );
});
