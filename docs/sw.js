/* Terra service worker (GitHub Pages): push reminders from the push server, and offline start */
const CACHE = 'terra-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './manifest.webmanifest', './icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./'))));
});
self.addEventListener('push', e => {
  let m = {}; try { m = e.data.json(); } catch (x) { m = { title: 'Terra', body: e.data ? e.data.text() : '' }; }
  const n = m.notification || m;
  e.waitUntil(self.registration.showNotification(n.title || 'Terra', { body: n.body || '', tag: n.tag || m.rid, icon: './icon-192.png', badge: './icon-96.png', data: { k: 'today' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.startsWith(self.registration.scope));
    if (c) { c.postMessage({ type: 'open', k: 'today' }); return c.focus(); }
    return self.clients.openWindow(self.registration.scope);
  }));
});
