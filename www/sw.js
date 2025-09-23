// Versão do cache - atualizada automaticamente
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `scientific-lectures-v${CACHE_VERSION}`;

// Recursos para cache
const STATIC_RESOURCES = [
    './index.html',
    './manifest.json',
    './js/auth-system.js',
    './js/preferences-system.js',
    './js/advanced-pdf-analyzer.js',
    './js/lecture-library.js',
    './icons/icon-192.svg',
    './icons/icon-512.svg',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
];

// Recursos dinâmicos que serão cacheados
const DYNAMIC_RESOURCES = [
    '/api/',
    '.pdf',
    '.html'
];

// Configuração de cache
const cacheConfig = {
    staticCache: {
        name: `static-${CACHE_NAME}`,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
    },
    dynamicCache: {
        name: `dynamic-${CACHE_NAME}`,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        maxItems: 100
    },
    offlineCache: {
        name: `offline-${CACHE_NAME}`,
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 dias
    }
};

// Estado do service worker
let isOnline = true;
let isLoggedIn = false;
let pendingSync = [];

// Instalação do service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache estático
            caches.open(cacheConfig.staticCache.name)
                .then(cache => cache.addAll(STATIC_RESOURCES)),
            
            // Cache offline
            caches.open(cacheConfig.offlineCache.name)
                .then(cache => cache.add('/offline.html')),
            
            // Força ativação imediata
            self.skipWaiting()
        ])
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Limpa caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!Object.values(cacheConfig).some(config => cacheName.includes(config.name))) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Atualiza recursos estáticos se necessário
            updateStaticResources(),
            
            // Toma controle imediatamente
            self.clients.claim()
        ])
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    // Ignora requisições não GET
    if (event.request.method !== 'GET') return;
    
    // Estratégia de cache baseada no tipo de recurso
    if (isStaticResource(event.request.url)) {
        event.respondWith(handleStaticRequest(event.request));
    } else if (isDynamicResource(event.request.url)) {
        event.respondWith(handleDynamicRequest(event.request));
    } else {
        event.respondWith(handleNetworkRequest(event.request));
    }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-lectures') {
        event.waitUntil(syncLectures());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon-192.svg',
        badge: '/icons/badge.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver aula',
                icon: '/icons/checkmark.svg'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/close.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Nova Aula Disponível', options)
    );
});

// Clique em notificações
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/lectures/latest')
        );
    }
});

// Funções auxiliares
async function handleStaticRequest(request) {
    const cache = await caches.open(cacheConfig.staticCache.name);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Atualiza em background
        event.waitUntil(updateStaticCache(request, cache));
        return cachedResponse;
    }
    
    return fetchAndCache(request, cache);
}

async function handleDynamicRequest(request) {
    const cache = await caches.open(cacheConfig.dynamicCache.name);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            event.waitUntil(cache.put(request, response.clone()));
        }
        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        
        // Fallback para offline
        return await handleOfflineFallback(request);
    }
}

async function handleNetworkRequest(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return await handleOfflineFallback(request);
    }
}

async function handleOfflineFallback(request) {
    const cache = await caches.open(cacheConfig.offlineCache.name);
    
    if (request.headers.get('Accept').includes('text/html')) {
        return cache.match('/offline.html');
    }
    
    return new Response('', {
        status: 408,
        statusText: 'Conexão offline'
    });
}

async function updateStaticCache(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response);
        }
    } catch (error) {
        console.error('Erro ao atualizar cache:', error);
    }
}

async function updateStaticResources() {
    const cache = await caches.open(cacheConfig.staticCache.name);
    return Promise.all(
        STATIC_RESOURCES.map(url => updateStaticCache(new Request(url), cache))
    );
}

async function syncLectures() {
    const lectures = await getLecturesForSync();
    
    for (const lecture of lectures) {
        try {
            await syncLecture(lecture);
        } catch (error) {
            pendingSync.push(lecture);
        }
    }
}

function isStaticResource(url) {
    return STATIC_RESOURCES.some(resource => url.includes(resource));
}

function isDynamicResource(url) {
    return DYNAMIC_RESOURCES.some(pattern => {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            return new RegExp(pattern.slice(1, -1)).test(url);
        }
        return url.includes(pattern);
    });
}

// Sistema de cache avançado
class CacheManager {
    constructor(config) {
        this.config = config;
        this.queue = new Map();
    }
    
    async get(request) {
        const cache = await caches.open(this.config.name);
        const response = await cache.match(request);
        
        if (!response) return null;
        
        // Verifica idade do cache
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
            const age = Date.now() - new Date(dateHeader).getTime();
            if (age > this.config.maxAge) {
                await cache.delete(request);
                return null;
            }
        }
        
        return response;
    }
    
    async set(request, response) {
        const cache = await caches.open(this.config.name);
        
        // Limita número de itens
        if (this.config.maxItems) {
            const keys = await cache.keys();
            if (keys.length >= this.config.maxItems) {
                await cache.delete(keys[0]);
            }
        }
        
        // Adiciona data
        const headers = new Headers(response.headers);
        headers.set('date', new Date().toUTCString());
        
        const modifiedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
        
        await cache.put(request, modifiedResponse);
    }
    
    async clear() {
        await caches.delete(this.config.name);
    }
}

// Gerenciadores de cache
const staticCache = new CacheManager(cacheConfig.staticCache);
const dynamicCache = new CacheManager(cacheConfig.dynamicCache);
const offlineCache = new CacheManager(cacheConfig.offlineCache);

// Sistema de atualização automática
class UpdateManager {
    constructor() {
        this.version = CACHE_VERSION;
        this.checking = false;
    }
    
    async checkForUpdates() {
        if (this.checking) return;
        this.checking = true;
        
        try {
            const response = await fetch('/version.json?_=' + Date.now());
            const data = await response.json();
            
            if (data.version !== this.version) {
                await this.update(data.version);
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
        } finally {
            this.checking = false;
        }
    }
    
    async update(newVersion) {
        // Limpa caches
        await Promise.all([
            staticCache.clear(),
            dynamicCache.clear()
        ]);
        
        // Atualiza versão
        this.version = newVersion;
        
        // Recarrega recursos
        await updateStaticResources();
        
        // Notifica clientes
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'UPDATE_AVAILABLE'
            });
        });
    }
}

// Inicializa gerenciador de atualizações
const updateManager = new UpdateManager();

// Verifica atualizações periodicamente
setInterval(() => {
    updateManager.checkForUpdates();
}, 60 * 60 * 1000); // 1 hora

// Monitora status da conexão
self.addEventListener('online', () => {
    isOnline = true;
    syncPendingData();
});

self.addEventListener('offline', () => {
    isOnline = false;
});

// Sincroniza dados pendentes
async function syncPendingData() {
    if (pendingSync.length > 0) {
        const sync = [...pendingSync];
        pendingSync = [];
        
        for (const item of sync) {
            try {
                await syncLecture(item);
            } catch (error) {
                pendingSync.push(item);
            }
        }
    }
}