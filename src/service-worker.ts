/// <reference lib="WebWorker" />

import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching"
import { StaleWhileRevalidate } from "workbox-strategies"
import { registerRoute } from "workbox-routing"
import { clientsClaim } from "workbox-core"

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// Cached static resources
const cachedPaths = [
	// Miscellaneous
	{ url: "/manifest.json", revision: "0" },

	// App Icons
	{ url: "/icon.svg", revision: "0" },
	{ url: "/icon.png", revision: "0" },
	{ url: "/icon-256.webp", revision: "0" },
	{ url: "/maskable-128.png", revision: "0" },
	{ url: "/maskable-512.png", revision: "0" },

	// Fonts
	{ url: "/fonts.css", revision: "0" },
	{ url: "/fonts/inter-bold.woff2", revision: "0" },
	{ url: "/fonts/inter.woff2", revision: "0" },
	{ url: "/fonts/roboto-bold.woff2", revision: "0" },
	{ url: "/fonts/roboto-italic.woff2", revision: "0" },
	{ url: "/fonts/roboto-mono.woff2", revision: "0" },
	{ url: "/fonts/roboto.woff2", revision: "0" },
]

precacheAndRoute(self.__WB_MANIFEST, { cleanURLs: true })
precacheAndRoute(cachedPaths, { cleanURLs: true })

registerRoute(({ request }: { request: Request; url: URL }) => {
	if (request.mode !== "navigate") {
		return false
	}

	return true
}, createHandlerBoundToURL("/index.html"))

registerRoute(
	({ url }) => url.origin === self.location.origin,
	new StaleWhileRevalidate({
		cacheName: "runtime",
	})
)

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") {
		self.skipWaiting()
	}
})
