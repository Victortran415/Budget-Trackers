const staticCache = "site-static";

const assets = ["/", "/index.html", "/index.js", "/styles.css"];

self.addEventListener("install", (event) => {
	//NOTE: Making sure service worker has been installed
	console.log("Service Worker installed");

	const preCache = async () => {
		try {
			const cache = await caches.open(staticCache);
			cache.addAll(assets);
		} catch (err) {
			console.log("Something went wrong!");
		}
	};
	event.waitUntil(preCache());
});

self.addEventListener("activate", (event) => {
	//NOTE: Grabbing keys from cache

	const getKeys = async () => {
		try {
			const keys = await caches.leys();
			console.log(keys);
			return keys
				.filter((key) => key != staticCache)
				.map((key) => caches.delete(key));
		} catch (err) {
			console.log(err);
		}
	};
	event.waitUntil(getKeys());
});

self.addEventListener("fetch", (event) => {
	console.log("Fetch: ", event);
	const cacheResponse = async () => {
		try {
			const catchResponse = await caches.match(event.request);
			return catchResponse || fetch(event.request);
		} catch (err) {
			console.log(err);
		}
	};
	event.respondWith(cacheResponse());
});
