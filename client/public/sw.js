// Minimal Service Worker (sw.js)
// This file is required to prevent a 404 error and enable basic PWA features.
// For full offline support, more complex caching logic would be needed.

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  // Claim control of all clients (tabs)
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // We are not implementing any caching logic here,
  // so the service worker will just let all requests go to the network.
  // This prevents the reported 404 error for sw.js.
});
