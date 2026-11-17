/* Terra service worker: push reminders, and the app opens offline after the first visit */
const CACHE = 'terra-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/manifest.webmanifest', '/icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/') || u.pathname.startsWith('/v1/')) return;
  // Network first, so updates show up right away; the saved copy is there when offline
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
});
self.addEventListener('push', e => {
  let m = {}; try { m = e.data.json(); } catch (x) { m = { title: 'Terra', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(m.title || 'Terra', { body: m.body || '', tag: m.tag, icon: '/icon-192.png', badge: '/icon-96.png', data: { k: m.k || 'today' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const k = e.notification.data?.k || 'today';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => new URL(x.url).origin === location.origin);
    if (c) { c.postMessage({ type: 'open', k }); return c.focus(); }
    return self.clients.openWindow('/#' + k);
  }));
});
