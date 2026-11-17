/* ---------- Push reminders for the web app (Cloudflare) ----------
   Only in the hosted web app (window.TERRA_HOSTED, served by Terra's own Cloudflare Worker).
   The page registers a service worker, subscribes to Web Push, and sends the server what it needs to
   remind you while Terra is closed: today's reminder list, the time zone, and a tiny progress note
   (steps done today, streak, your "why") so the evening nudge only comes when the day is still empty.
   The server never gets routines in full, moods, workouts or anything else. */
const PUSH_ID_KEY = 'terra.push.id';
function pushId() {
  let p = null; try { p = JSON.parse(localStorage.getItem(PUSH_ID_KEY) || 'null'); } catch (e) {}
  if (!p) { const r = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => b.toString(16).padStart(2, '0')).join(''); p = { id: 'u' + r(10), secret: r(24) }; try { localStorage.setItem(PUSH_ID_KEY, JSON.stringify(p)); } catch (e) {} }
  return p;
}
const b64u = b => { const s = atob(b.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b.length + 3) % 4)); return Uint8Array.from(s, c => c.charCodeAt(0)); };
async function pushApi(path, body) {
  const r = await fetch(path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify({ ...pushId(), ...body }) : undefined });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'server ' + r.status); return d;
}
const IOS_WEB = /iP(hone|ad|od)/.test(navigator.userAgent) && !NATIVE;
const STANDALONE = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
async function pushEnable() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    if (IOS_WEB && !STANDALONE()) toast(tr('On iPhone: tap Share → Add to Home Screen, then open Terra from there to get reminders.'));
    return 'denied';
  }
  const perm = await Notification.requestPermission(); if (perm !== 'granted') return perm;
  try {
    const reg = await navigator.serviceWorker.ready;
    const { publicKey } = await pushApi('/api/vapid');
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(publicKey) });
    await pushApi('/api/subscribe', { subscription: sub.toJSON() });
    pushSig = ''; await pushSync();
    return 'granted';
  } catch (e) { toast(tr('Reminders could not be switched on. Try again in a moment.')); return 'default'; }
}
let pushSig = '', pushT = null;
function schedulePushSync() { clearTimeout(pushT); pushT = setTimeout(() => pushSync().catch(() => {}), 1500); }
async function pushSync() {
  if (!window.TERRA_HOSTED || !S.onboarded || S.settings?.notify !== 'on' || !('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready; if (!(await reg.pushManager.getSubscription())) return;
  const items = remList(); const a = S.alarm;
  if (a?.on) items.push({ id: 'alarm', title: tr('Good morning'), text: tr('Open Terra to switch off your alarm.'), time: alarmTime() });
  const { total, done } = totals();
  const body = { tz: Intl.DateTimeFormat().resolvedOptions().timeZone, lang: LANG, items,
    progress: { day: dayKey(), done, total, streak: streak(), name: S.name || '', why: (S.profile?.why || '').slice(0, 140), nudgeAt: '20:30' } };
  const sig = JSON.stringify(body); if (sig === pushSig) return; pushSig = sig;
  await pushApi('/api/sync', body);
}
if (window.TERRA_HOSTED && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  /* A tap on a notification opens Terra on the right page */
  navigator.serviceWorker.addEventListener('message', e => { if (e.data?.type === 'open' && e.data.k) window.terraOpen?.(e.data.k); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { pushSig = ''; schedulePushSync(); } });
  setTimeout(schedulePushSync, 3000);
}
