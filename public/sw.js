// Service Worker pour Au Roi Lion
// Améliore les performances et le SEO mobile

const CACHE_NAME = 'au-roi-lion-v1';
const STATIC_CACHE = 'au-roi-lion-static-v1';
const DYNAMIC_CACHE = 'au-roi-lion-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/assets/logo.png',
  '/assets/salon.jpeg',
  '/assets/chambre.jpeg',
  '/assets/cuisine.jpeg',
  '/assets/vue.jpeg',
  '/manifest.json',
  // Ajoutez d'autres assets critiques ici
];

// Ressources à mettre en cache dynamiquement
const CACHE_STRATEGIES = {
  images: {
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
  },
  fonts: {
    pattern: /\.(woff|woff2|ttf|eot)$/,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
  },
  api: {
    pattern: /\/api\//,
    strategy: 'networkFirst',
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  pages: {
    pattern: /\.(html|htm)$/,
    strategy: 'networkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
  },
};

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Suppression ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;

  // Ignorer les requêtes vers des domaines externes (sauf fonts et images)
  if (url.origin !== location.origin && !isCacheableExternal(url)) return;

  event.respondWith(handleRequest(request));
});

// Gestion des requêtes
async function handleRequest(request) {
  const url = new URL(request.url);
  const strategy = getStrategy(url.pathname);

  switch (strategy.name) {
    case 'cacheFirst':
      return cacheFirst(request, strategy);
    case 'networkFirst':
      return networkFirst(request, strategy);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request, strategy);
    default:
      return fetch(request);
  }
}

// Stratégie Cache First
async function cacheFirst(request, strategy) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Vérifier si le cache n'est pas expiré
    const cacheTime = await getCacheTime(request);
    if (cacheTime && (Date.now() - cacheTime) < strategy.maxAge) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Network First
async function networkFirst(request, strategy) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request, strategy) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cacheResponse(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cachedResponse || networkPromise;
}

// Mise en cache d'une réponse
async function cacheResponse(request, response) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.put(request, response);
  await setCacheTime(request, Date.now());
}

// Obtenir le timestamp de mise en cache
async function getCacheTime(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const timeKey = `${request.url}-time`;
  const timeResponse = await cache.match(timeKey);
  if (timeResponse) {
    return parseInt(await timeResponse.text());
  }
  return null;
}

// Définir le timestamp de mise en cache
async function setCacheTime(request, time) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const timeKey = `${request.url}-time`;
  await cache.put(timeKey, new Response(time.toString()));
}

// Déterminer la stratégie de cache
function getStrategy(pathname) {
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(pathname)) {
      return { name: config.strategy, maxAge: config.maxAge };
    }
  }
  return { name: 'networkFirst', maxAge: 24 * 60 * 60 * 1000 };
}

// Vérifier si une ressource externe peut être mise en cache
function isCacheableExternal(url) {
  const cacheableHosts = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
  ];
  
  return cacheableHosts.some(host => url.hostname.includes(host));
}

// Nettoyage périodique du cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  const now = Date.now();
  
  for (const request of requests) {
    const cacheTime = await getCacheTime(request);
    if (cacheTime && (now - cacheTime) > (7 * 24 * 60 * 60 * 1000)) { // 7 jours
      await cache.delete(request);
    }
  }
} 