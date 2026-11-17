/* ---------- Push reminders for the web app, through GymTrack's Cloudflare push server ----------
   Only in the hosted web app (window.TERRA_HOSTED): the artifact preview can't run a service worker.
   Terra talks to the same server as GymTrack, with the same protocol (vapid, subscribe, sync), under its
   own id. It sends only the reminder list, the time zone and which reminders are already done today,
   so a reminder whose routine is finished stays quiet. The evening nudge is one more reminder that
   is marked done as soon as any step of the day is done. */
const PUSH_SERVER = window.TERRA_PUSH_SERVER || '';
const PUSH_ID_KEY = 'terra.push.id';
const pb64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const punb64u = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
function pushId() {
  let p = null; try { p = JSON.parse(localStorage.getItem(PUSH_ID_KEY) || 'null'); } catch (e) {}
  if (!p || !p.userId) { const r = n => pb64u(crypto.getRandomValues(new Uint8Array(n))); p = { userId: 'u_' + r(16), secret: r(24) }; try { localStorage.setItem(PUSH_ID_KEY, JSON.stringify(p)); } catch (e) {} }
  return p;
}
async function pushApi(path, body, method = 'POST') {
  const r = await fetch(PUSH_SERVER.replace(/\/+$/, '') + path, method === 'GET' ? {} : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pushId(), ...body }) });
  let d = {}; try { d = await r.json(); } catch (e) {} if (!r.ok) throw new Error(d.error || 'server ' + r.status); return d;
}
const IOS_WEB = /iP(hone|ad|od)/.test(navigator.userAgent) && !NATIVE;
const STANDALONE = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
/* What the server needs, in GymTrack's format */
const NUDGE_LINES = { fi: s => s > 0 ? `Putkesi on vaarassa 😬 Yksi askel pelastaa ${s} päivän putken!` : 'Yksi pieni askel ennen unta? 🌙', en: s => s > 0 ? `Your streak is in danger 😬 One step saves your ${s}-day streak!` : 'One small step before bed? 🌙' };
function pushState() {
  const t = dayKey(), y = dayKey(new Date(Date.now() - 864e5));
  const { total, done } = totals(); const why = (S.profile?.why || '').trim();
  const reminders = remList().map(r => ({ id: 't_' + r.id, time: r.time, title: r.title, body: r.text, days: [], enabled: true, notify: true, kind: 'task' }));
  if (S.alarm?.on) reminders.push({ id: 't_alarm', time: alarmTime(), title: tr('Good morning'), body: tr('Open Terra to switch off your alarm.'), days: [], enabled: true, notify: true, kind: 'task' });
  reminders.push({ id: 't_nudge', time: '20:30', title: S.name ? `Terra · ${S.name}` : 'Terra', body: why && new Date().getDate() % 2 ? `${tr('Remember why you started')}: “${why}”` : NUDGE_LINES[LANG === 'fi' ? 'fi' : 'en'](streak()), days: [], enabled: total > 0, notify: true, kind: 'task' });
  const doneIds = [...(S.reminders || []).filter(r => remDone(r.id)).map(r => 't_' + r.id), ...(done > 0 || !total ? ['t_nudge'] : []), ...(S.alarm?.done === t ? ['t_alarm'] : [])];
  let tz = 'Europe/Helsinki'; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch (e) {}
  return { tz, trip: null, reminders, done: { [y]: [], [t]: doneIds }, summary: { date: t, kcal: 0, protein: 0, goalKcal: 0, goalProtein: 0, tasksDone: done, tasksTotal: total } };
}
async function pushEnable() {
  if (!PUSH_SERVER) { toast(tr('Reminders on this page need the Terra web app. Open it from the home screen.')); return 'default'; }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    if (IOS_WEB && !STANDALONE()) toast(tr('On iPhone: tap Share → Add to Home Screen, then open Terra from there to get reminders.'));
    return 'denied';
  }
  const perm = await Notification.requestPermission(); if (perm !== 'granted') return perm;
  try {
    const reg = await navigator.serviceWorker.ready;
    const { publicKey } = await pushApi('/api/vapid', null, 'GET');
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: punb64u(publicKey) });
    await pushApi('/api/subscribe', { subscription: sub.toJSON(), ua: navigator.userAgent, state: pushState() });
    pushSig = JSON.stringify(pushState());
    return 'granted';
  } catch (e) { toast(tr('Reminders could not be switched on. Try again in a moment.')); return 'default'; }
}
let pushSig = '', pushT = null;
function schedulePushSync() { clearTimeout(pushT); pushT = setTimeout(() => pushSync().catch(() => {}), 2000); }
async function pushSync() {
  if (!window.TERRA_HOSTED || !PUSH_SERVER || !S.onboarded || S.settings?.notify !== 'on' || !('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready; if (!(await reg.pushManager.getSubscription())) return;
  const state = pushState(); const sig = JSON.stringify(state); if (sig === pushSig) return;
  await pushApi('/api/sync', { state }); pushSig = sig;
}
if (window.TERRA_HOSTED && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('message', e => { if (e.data?.type === 'open') window.terraOpen?.(e.data.k || 'today'); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { pushSig = ''; schedulePushSync(); } });
  setTimeout(schedulePushSync, 3000);
}
