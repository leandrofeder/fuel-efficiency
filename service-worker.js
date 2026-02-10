const CACHE_NAME = 'fuel-calc-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
        .then(() => {
            return self.skipWaiting();
        })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                .filter((name) => name !== CACHE_NAME)
                .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Retorna do cache se encontrado
            if (response) {
                return response;
            }

            // Caso contrário, faz a requisição de rede
            return fetch(event.request)
                .then((networkResponse) => {
                    // Não cacheia requisições não-GET ou erros
                    if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
                        return networkResponse;
                    }

                    // Clona a resposta para cachear
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // Fallback para offline (página inicial)
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});

// Sincronização em background (para futuras funcionalidades)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-historico') {
        event.waitUntil(syncHistorico());
    }
});

async function syncHistorico() {
    // Implementação futura para sincronização de histórico
    console.log('Sincronizando histórico...');
}