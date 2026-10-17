const CACHE_NAME = 'hymn-companion-v8';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/projector.html',
  '/hc-icon.svg',
  '/hc-icon-premium-512.png',
  '/hc-icon-premium-192.png',
  '/creator-card-qr.svg',
  '/en-ZA.hymns.json',
  '/af-ZA.hymns.json'
];

const isSameOriginHttpRequest = (request) => {
  try {
    const url = new URL(request.url);
    return url.origin === self.location.origin && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return false;
  }
};

const extractBuiltAssetUrls = (html) => {
  const urls = new Set();
  const attrPattern = /(?:src|href)=["']([^"']+)["']/gi;
  let match;

  while ((match = attrPattern.exec(html)) !== null) {
    const value = match[1];
    if (!value || value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
      continue;
    }

    try {
      const resolved = new URL(value, self.location.origin);
      if (resolved.origin === self.location.origin && resolved.pathname.startsWith('/assets/')) {
        urls.add(resolved.pathname + resolved.search);
      }
    } catch {
      // Ignore malformed asset references.
    }
  }

  return [...urls];
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Core shell and both complete hymn packs must be present for first cold offline launch.
    await cache.addAll(CORE_ASSETS);

    // Vite fingerprints JS/CSS filenames at build time. Discover those generated
    // assets from the deployed HTML and cache them during service-worker install.
    try {
      const response = await fetch('/', { cache: 'no-store' });
      if (response.ok) {
        const html = await response.text();
        const builtAssets = extractBuiltAssetUrls(html);
        if (builtAssets.length > 0) {
          await cache.addAll(builtAssets);
        }
      }
    } catch (error) {
      console.warn('Built asset discovery failed during service-worker install:', error);
    }
  })());

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET' || !isSameOriginHttpRequest(request)) {
    return;
  }

  const url = new URL(request.url);

  // Home-screen launches and projector navigations each need their own cached fallback.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const isProjectorRoute = url.pathname === '/projector.html';

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);

          if (isProjectorRoute) {
            // Keep projector navigation isolated from the main app shell cache.
            await cache.put('/projector.html', networkResponse.clone());
          } else {
            await cache.put('/', networkResponse.clone());
            await cache.put('/index.html', networkResponse.clone());
          }
        }
        return networkResponse;
      } catch {
        if (isProjectorRoute) {
          return (await caches.match('/projector.html')) || Response.error();
        }

        return (await caches.match(request)) ||
          (await caches.match('/')) ||
          (await caches.match('/index.html')) ||
          Response.error();
      }
    })());
    return;
  }

  // Static assets and hymn datasets: serve cached immediately, refresh opportunistically.
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.hymns.json') ||
    CORE_ASSETS.includes(url.pathname)
  ) {
    event.respondWith((async () => {
      const cached = await caches.match(request);

      const refreshPromise = fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(refreshPromise);
        return cached;
      }

      const networkResponse = await refreshPromise;
      return networkResponse || Response.error();
    })());
    return;
  }

  // Other same-origin requests: network first, cache fallback.
  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse && networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
