/* Service Worker — Team Rando */
const CACHE = 'team-rando-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/db.js', '/pwa.js',
  '/firebase-config.js', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Ne jamais mettre en cache Firebase / météo / polices distantes
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic') || url.includes('open-meteo')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
