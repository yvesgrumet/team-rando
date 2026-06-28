/* Service Worker — Team Rando */
const CACHE = 'team-rando-v2';
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
  // Ne jamais mettre en cache Firebase / météo / polices / API
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic') || url.includes('open-meteo') || url.includes('/api/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

/* ── Notifications push (fonctionne même appli fermée) ── */
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}
  const title = data.title || 'Team Rando';
  const opts = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'team-rando',
    renotify: true,
    data: { url: data.url || '/' }
  };
  e.waitUntil((async () => {
    await self.registration.showNotification(title, opts);
    try { if (self.navigator && self.navigator.setAppBadge) await self.navigator.setAppBadge(); } catch (err) {}
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) { c.navigate(target).catch(()=>{}); return c.focus(); } }
    if (clients.openWindow) return clients.openWindow(target);
  })());
});
