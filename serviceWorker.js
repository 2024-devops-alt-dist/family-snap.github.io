const CACHE_NAME = `family-snap`;
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/src/assets/icon-book.png",
	"/src/assets/screenshot-mobile.png",
	"/src/assets/screenshot-wide.png",
	"/src/css/christmas.css",
	"/src/css/style.css",
	"/src/js/authentification.js",
	"/src/js/images-handler.js",
	"/src/js/main.js",
	"/src/js/photo.js",
	"/src/js/qrGenerator.js",
	"/src/js/supabase-config.js",
	"/src/js/translations.js",
	"https://cdn.jsdelivr.net/npm/@supabase/supabase-js",
	"https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
];

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
	console.log("[Service Worker] Installation en cours...");
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then(async (cache) => {
			for (const url of urlsToCache) {
				try {
					const response = await fetch(url);
					if (!response.ok) {
						console.error(
							`Erreur avec ${url} : ${response.statusText}`
						);
					} else {
						console.log(
							"[Service Worker] Mise en cache des ressources :",
							url
						);
						await cache.put(url, response);
					}
				} catch (error) {
					console.error(`Échec de récupération pour ${url} :`, error);
				}
			}
		})
	);
});

// Use the activate event to remove old caches.
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log(
							`[Service Worker] Suppression du cache obsolète : ${cacheName}`
						);

						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	clients.claim();
});

// Use the fetch event to return cached resources or fetch from the network.
self.addEventListener("fetch", (event) => {
	console.log(
		`[Service Worker] Interception de la requête : ${event.request.url}`
	);

	if (
		event.request.url.startsWith("chrome-extension://") ||
		event.request.url.startsWith("ws://")
	) {
		return;
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			// Cache hit - return response
			if (response) {
				console.log(
					`[Service Worker] Ressource trouvée dans le cache : ${event.request.url}`
				);

				return response;
			} else {
				console.log(
					`[Service Worker] Ressource non trouvée dans le cache, tentative réseau : ${event.request.url}`
				);
			}

			// Sinon, on essaie de récupérer la ressource depuis le réseau
			return fetch(event.request)
				.then((networkResponse) => {
					// On ajoute la ressource au cache pour les prochaines fois
					return caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, networkResponse.clone());
						return networkResponse;
					});
				})
				.catch((e) => {
					console.error(
						`Échec de récupération pour ${event.request.url} :`,
						e
					);
				});
		})
	);
});
