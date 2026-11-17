/* ============ Terra app ============ */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/* ---------- icons ---------- */
const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const IC = {
  today: I('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
  routines: I('<path d="M4 6.5 5.5 8 8.5 5M4 13.5 5.5 15l3-3M11 6.5h9M11 13.5h9M11 19.5h9M5 19.5h2"/>'),
  moment: I('<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>'),
  terra: I('<path d="M12 3c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z"/><path d="M19 15c.3 1.5 1 2.2 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.3 2.2-1 2.5-2.5Z"/>'),
  prefs: I('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
  you: I('<circle cx="12" cy="8" r="3.6"/><path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6"/>'),
  workouts: I('<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>'),
  more: I('<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="2.8"'),
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  target: I('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>'),
  flame: I('<path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-3.4-2.4-5.6-3.6-8.3-.4 2-1.4 3.2-2.6 3.8.2-3-1.2-5.8-3.8-7.3.3 3.2-1.4 5.3-2.9 7.3-1 1.4-1.6 2.9-1.6 4.5C4 18.4 7 21 12 21Z" fill="currentColor" stroke="none"/>'),
  bulb: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  trash: I('<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>'),
  snooze: I('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 4v4.5h4.5M12 8v4.5l3 2"/>'),
  sun: I('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/>'),
  leaf: I('<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>'),
  moon: I('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>'),
  wind: I('<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7"/>'),
  play: I('<path d="M7 4.5v15l12.5-7.5Z" fill="currentColor"/>'),
  pause: I('<path d="M8 5v14M16 5v14" stroke-width="3"/>'),
  reset: I('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>'),
  send: I('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  lock: I('<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  sunrise: I('<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 3v6M9 6l3-3 3 3"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 21h4"/>'),
  calendar: I('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  shield: I('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6Z"/><path d="m9 12 2 2 4-4"/>'),
  heart: I('<path d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.2 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>'),
  chat: I('<path d="M4.5 5.5h15v10h-9l-4.5 4v-4h-1.5Z"/>'),
  gift: I('<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8C10 4 6.5 4.5 7.5 7c.5 1 2.5 1 4.5 1Zm0 0c2-4 5.5-3.5 4.5-1-.5 1-2.5 1-4.5 1Z"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  edit: I('<path d="M4 20h4L19 9l-4-4L4 16Z"/>'),
  track: I('<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>'),
};

/* ---------- plans ---------- */
const PLANS = {
  free: { name: 'Free', routines: 3, ai: false, mem: 0, durations: [1], patterns: ['calm'] },
  pro: { name: 'Pro', routines: Infinity, ai: true, mem: 12, durations: [1, 3], patterns: ['calm'] },
  ultimate: { name: 'Ultimate', routines: Infinity, ai: true, mem: 40, durations: [1, 3, 5, 10], patterns: ['calm', 'box'] },
};
/* Test codes for the preview. Before an App Store release, replace with Apple Offer Codes. */
const PROMO = { SECRETPRO: 'pro', SECRETULTIMET: 'ultimate', SECRETULTIMATE: 'ultimate' };

const SLOTS = { morning: { label: 'Morning', icon: 'sunrise', color: 'var(--sage)', order: 0 }, day: { label: 'Daytime', icon: 'leaf', color: 'var(--sage)', order: 1 }, evening: { label: 'Evening', icon: 'moon', color: 'var(--accent)', order: 2 } };

const TIPS = [
  'Put the thing you need where you will see it. A visible cue does the remembering for you.',
  'Make the step so small it feels almost silly. Two minutes is enough to start.',
  'Link a new habit to one you already have: after I ___, I will ___.',
  'Never miss twice. One off day is normal. Just come back tomorrow.',
  'Make it pleasant. Pair a habit with music, tea or a cozy spot.',
  'Get things ready the night before. Tomorrow-you will thank you.',
  'Every small step is a vote for the person you want to be.',
  'Remove one obstacle. Fewer steps between you and the habit means less friction.',
  'Start, then decide. Once you begin, continuing is much easier.',
  'Track it where you can see it. Seeing progress makes you want to keep it going.',
];
const WINS = ['Nice. That counts.', 'One step done. That is a real win.', 'Small and done beats big and someday.', 'Look at you go.', 'Your future self says thanks.', 'Done. Breathe it in for a second.', 'That is how routines are built.'];

/* ---------- state ---------- */
const LS = 'terra.v1';
function freshState() {
  return { v: 1, updatedAt: 0, onboarded: false, name: '', profile: { struggles: [], dayStart: '', windDown: '', goals: [], nudges: '', energy: '' },
    plan: 'free', routines: [], reminders: [], log: {}, skip: {}, chat: [], settings: { sound: true, calm: false, banners: true },
    tab: 'today', moment: { dur: 1, pat: 'calm' }, notified: {}, workouts: [], wGoal: 3, trackSec: 'workouts' };
}
let S = freshState();
try { const raw = localStorage.getItem(LS); if (raw) S = Object.assign(freshState(), JSON.parse(raw)); } catch (e) {}
/* 14-day Ultimate trial. Set the real monthly price here. */
const TRIAL_DAYS = 14;
/* Prices shown in the preview. In the iOS app, show the localized prices from StoreKit instead. */
const PRICES = { pro: { m: 4.99, y: 39.99 }, ultimate: { m: 7.99, y: 59.99 } };
const money = n => new Intl.NumberFormat(LANG === 'fi' ? 'fi-FI' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(n);
const saving = k => Math.round((1 - PRICES[k].y / (PRICES[k].m * 12)) * 100);
const ULTIMATE_PRICE = money(PRICES.ultimate.m);
const trialActive = () => S.plan === 'free' && !!S.trial && Date.now() < S.trial.end;
const trialUsed = () => !!S.trial;
const trialDaysLeft = () => S.trial ? Math.max(0, Math.ceil((S.trial.end - Date.now()) / 864e5)) : 0;
const planKey = () => trialActive() ? 'ultimate' : (PLANS[S.plan] ? S.plan : 'free');
const plan = () => PLANS[planKey()];

let DOC = null, writing = Promise.resolve(), saveTimer = null;
function save() {
  S.updatedAt = Date.now();
  prune();
  const blob = JSON.stringify(S);
  try { localStorage.setItem(LS, blob); } catch (e) {}
  syncNativeReminders();
  syncNativeWidget();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!DOC) return;
    const payload = { blob: JSON.stringify(S), updatedAt: S.updatedAt };
    writing = writing.then(() => DOC.set(payload)).catch(() => {});
  }, 900);
}
function prune() {
  const keys = Object.keys(S.log).sort();
  while (keys.length > 70) delete S.log[keys.shift()];
  const sk = Object.keys(S.skip); sk.forEach(k => { if (k !== dayKey()) delete S.skip[k]; });
  if (S.chat.length > 80) S.chat = S.chat.slice(-80);
}

/* ---------- launch screen: shown once per open, then fades into the app ---------- */
(function splash() {
  const el = document.getElementById('splash'); if (!el) return;
  const quick = matchMedia('(prefers-reduced-motion: reduce)').matches || (() => { try { return JSON.parse(localStorage.getItem('terra.v1') || '{}').settings?.calm; } catch (e) { return false; } })();
  const hide = () => { el.classList.add('out'); setTimeout(() => el.remove(), 700); };
  el.addEventListener('click', hide);
  setTimeout(hide, quick ? 350 : 3900);
})();

/* ---------- the sky follows the time of day: dawn, day, dusk, night ---------- */
function setTimeOfDay() { const h = new Date().getHours(); document.documentElement.dataset.tod = h >= 5 && h < 11 ? 'dawn' : h >= 11 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'dusk' : 'night'; }
setTimeOfDay(); setInterval(setTimeOfDay, 5 * 60 * 1000);

/* ---------- iPhone app bridge (only active inside the native Terra app) ---------- */
const NATIVE = window.webkit?.messageHandlers?.terra || null;
const nativeWait = {};
function nativeCall(type, payload = {}, wait = 20000) {
  return new Promise(res => {
    const id = 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    nativeWait[id] = res; NATIVE.postMessage({ id, type, ...payload });
    setTimeout(() => { if (nativeWait[id]) { delete nativeWait[id]; res(null); } }, wait);
  });
}
window.terraNativeReply = (id, value) => { const r = nativeWait[id]; if (r) { delete nativeWait[id]; r(value); } };
let nativeRemSig = '';
/* The wake-up alarm uses the phone's real alarm (AlarmKit, iOS 26+) when it can; otherwise a notification. */
let NATIVE_ALARMKIT = false, nativeAlarmSig = '';
function syncNativeAlarm() {
  if (!NATIVE) return;
  let on = false, time = '';
  try { on = !!S.alarm?.on; time = on ? alarmTime() : ''; } catch (e) { return; }
  const sig = on + time + LANG; if (sig === nativeAlarmSig) return; nativeAlarmSig = sig;
  nativeCall('alarm', { on, time, title: tr('Good morning. Open Terra and do the task.') }).then(ok => { const was = NATIVE_ALARMKIT; NATIVE_ALARMKIT = !!ok && on; if (was !== NATIVE_ALARMKIT) { nativeRemSig = ''; syncNativeReminders(); } });
}
/* Reminders become real iPhone notifications, so they arrive even when Terra is closed. */
/* Home screen and lock screen widgets (iOS): today's next step and progress. */
let nativeWidgetSig = '';
/* The widget shows a different next step depending on the time of day (dawn, day, dusk, night). */
const BAND_SLOT = { dawn: 'morning', day: 'day', dusk: 'evening', night: 'evening' };
function nextStepFor(slot) {
  const skipped = S.skip[dayKey()] || [];
  let fallback = null;
  const rs = [...S.routines].sort((a, b) => (b.slot === slot) - (a.slot === slot));
  for (const r of rs) for (const st of r.steps) {
    if (stepDone(st.id)) continue;
    if (skipped.includes(st.id)) { fallback ||= { r, st }; continue; }
    return { r, st };
  }
  return fallback;
}
/* The next few undone steps (skipped ones last), so the widget can tick one off and show the following one. */
function upcomingFor(slot, n = 8) {
  const skipped = S.skip[dayKey()] || [];
  const rs = slot ? [...S.routines].sort((a, b) => (b.slot === slot) - (a.slot === slot)) : orderedRoutines();
  const now = [], later = [];
  for (const r of rs) for (const st of r.steps) {
    if (stepDone(st.id)) continue;
    (skipped.includes(st.id) ? later : now).push({ id: st.id, text: tr(st.text), routine: tr(r.name) });
  }
  return now.concat(later).slice(0, n);
}
function partsByTime() {
  const out = {};
  for (const band of Object.keys(BAND_SLOT)) { const list = upcomingFor(BAND_SLOT[band]); const x = list[0]; out[band] = { next: x ? x.text : '', routine: x ? x.routine : '', id: x ? x.id : '', list }; }
  return out;
}
/* Steps ticked off in the iOS widget arrive here when Terra opens. */
window.terraWidgetDone = ids => {
  try {
    let n = 0;
    for (const id of ids || []) if (S.routines.some(r => r.steps.some(st => st.id === id)) && !stepDone(id)) { setStep(id, true); n++; }
    if (n) { render(); syncNativeWidget(); }
  } catch (e) {}
};
function syncNativeWidget() {
  if (!NATIVE || !S.onboarded) return;
  try {
    const n = nextStep(); const { done, total } = totals();
    const now = new Date(); const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const rem = [...S.reminders].filter(r => !remDone(r.id) && remAt(r) >= hm).sort((a, b) => remAt(a).localeCompare(remAt(b)))[0];
    const d = { day: dayKey(), lang: LANG, name: S.name || '', why: S.profile?.why || '', next: n ? tr(n.st.text) : '', routine: n ? tr(n.r.name) : '', done, total, streak: streak(), grown: S.grown || 0,
      rem: rem ? (rem.emoji ? rem.emoji + ' ' : '') + tr(rem.text) : '', remTime: rem ? remAt(rem) : '' };
    d.nextId = n ? n.st.id : ''; d.list = upcomingFor(null); d.parts = partsByTime(); const sig = JSON.stringify(d); if (sig === nativeWidgetSig) return; nativeWidgetSig = sig;
    NATIVE.postMessage({ type: 'widget', data: sig });
  } catch (e) {}
}
function syncNativeReminders() {
  if (!NATIVE) { if (window.TERRA_HOSTED) schedulePushSync(); return; }
  const list = remList();
  syncNativeAlarm();
  if (S.alarm?.on && !NATIVE_ALARMKIT) { try { list.push({ id: 'alarm', title: tr('Good morning'), text: tr('Open Terra to switch off your alarm.'), time: alarmTime() }); } catch (e) {} }
  const sig = JSON.stringify(list); if (sig === nativeRemSig) return; nativeRemSig = sig;
  try { NATIVE.postMessage({ type: 'reminders', reminders: list, title: 'Terra' }); } catch (e) {}
}
/* Today's reminders as notifications: used by the iPhone app and by the push server of the web app */
function remList() {
  /* The reminder itself is the notification's heading; a short, kind line goes underneath */
  const line = t => { const h = +t.slice(0, 2); return tr(h < 11 ? 'A small start is enough.' : h < 17 ? 'Just the first step. The rest can wait.' : 'One small thing, then you can rest.'); };
  /* The body names the routine's first step, and the afternoon one quotes why you started, in your own words */
  const why = (S.profile?.why || '').trim();
  const body = r => { const rt = r.rid && S.routines.find(x => x.id === r.rid); const first = rt?.steps?.[0]?.text; const h = +r.time.slice(0, 2);
    if (why && h >= 11 && h < 17) return `${tr('Remember why you started')}: “${why}”`;
    return first ? `${tr('First:')} ${tr(first)}. ${line(r.time)}` : line(r.time); };
  const list = S.settings?.notify === 'on' ? (S.reminders || []).map(r => { const o = { id: String(r.id), title: (r.emoji ? r.emoji + ' ' : '') + tr(r.text), text: body(r), time: r.time }; const t = remAt(r); if (t !== r.time) o.once = wakeWeek(r.time, t); return o; }) : [];
  return list;
}

/* ---------- Terra AI ---------- */
/* Terra AI talks only to Terra's own server (see terra-server/). The server holds the API key;
   the app never has one. Put the deployed server address here, for example
   'https://terra-ai.yourname.workers.dev'. Empty = Terra AI shows as not connected yet. */
const AI_ENDPOINT = window.TERRA_AI_SERVER || ''; // set in the hosted web app when a Terra AI server is running
const AI_ENABLED = true;
/* In the iPhone app, Terra AI can also run through the app itself when a key was added in Xcode
   (Secrets.plist). The key stays in the native code and never reaches this page. */
let NATIVE_AI = false;
if (NATIVE) setTimeout(() => nativeCall('aiAvailable').then(ok => { NATIVE_AI = !!ok; if (NATIVE_AI && S.onboarded) render(); }), 0);
const aiReady = () => !!AI_ENDPOINT || NATIVE_AI;
async function aiRequest(input, opts = {}) {
  if (!aiReady()) throw Object.assign(new Error('unavailable'), { code: 'unavailable' });
  const isStr = typeof input === 'string';
  const system = isStr ? undefined : input[0].content;
  const msgs = isStr ? [{ role: 'user', content: input }] : input.slice(1).map(m => ({ ...m }));
  const defs = opts.tools || [];
  const tools = defs.map(t => ({ name: t.name, description: t.description, input_schema: t.inputSchema }));
  const tier = opts.modelTier === 'quick' ? 'quick' : 'default';
  let text = '';
  for (let turn = 0; turn < 4; turn++) {
    const req = { tier, system, messages: msgs, tools: tools.length ? tools : undefined };
    let status, data;
    if (AI_ENDPOINT) {
      const r = await fetch(AI_ENDPOINT.replace(/\/$/, '') + '/v1/chat', { method: 'POST', signal: opts.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify(req) });
      status = r.status; data = r.ok ? await r.json() : null;
    } else {
      const out = await nativeCall('ai', { request: JSON.stringify(req) }, 90000);
      if (opts.signal?.aborted) throw Object.assign(new Error('cancelled'), { code: 'cancelled' });
      status = out?.status || 0; data = out?.data || null;
    }
    if (status !== 200 || !data) throw Object.assign(new Error('ai ' + status), { code: status === 429 ? 'rate_limited' : 'failed' });
    const blocks = data.content || [];
    text += blocks.filter(x => x.type === 'text').map(x => x.text).join('');
    opts.onText?.({ text });
    const uses = blocks.filter(x => x.type === 'tool_use');
    if (!uses.length || data.stop_reason !== 'tool_use') break;
    msgs.push({ role: 'assistant', content: blocks });
    const results = [];
    for (const u of uses) {
      const def = defs.find(t => t.name === u.name);
      try { results.push({ type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(def ? await def.execute(u.input) : { error: 'unknown tool' }) }); }
      catch (e) { results.push({ type: 'tool_result', tool_use_id: u.id, is_error: true, content: String(e?.message || e) }); }
    }
    msgs.push({ role: 'user', content: results });
  }
  return { text };
}
(async () => {
  if (!window.claude?.use) return;
  try {
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    if (!db || !user) return;
    const id = await user.id();
    if (!id) return;
    const ref = db.doc('data/users/' + id + '/state');
    const snap = await ref.get();
    DOC = ref;
    if (snap.exists) {
      const d = snap.data();
      if (d && typeof d.blob === 'string' && Number(d.updatedAt) > (S.updatedAt || 0)) {
        S = Object.assign(freshState(), JSON.parse(d.blob));
        try { localStorage.setItem(LS, d.blob); } catch (e) {}
        boot();
      }
    } else if (S.updatedAt) { save(); }
  } catch (e) { /* stays on this device only */ }
})();

/* ---------- helpers on data ---------- */
const dayLog = (k = dayKey()) => (S.log[k] ||= { s: [], r: [], m: 0 });
const peekLog = (k = dayKey()) => S.log[k] || { s: [], r: [], m: 0 };
const stepDone = id => peekLog().s.includes(id);
const remDone = id => peekLog().r.includes(id);
/* How a routine has gone lately: days counted from when it was made, today left out so a morning never counts as missed. */
function routineStats(r, days = 7) {
  const keys = []; for (let i = 1; i <= days; i++) { const k = addDays(dayKey(), -i); if (!r.created || k >= r.created) keys.push(k); }
  const n = r.steps.length; let done = 0, full = 0; const hours = [];
  for (const k of keys) { const l = S.log[k]; if (!l) continue; const d = r.steps.filter(s => l.s?.includes(s.id)); done += d.length; if (d.length === n) full++; for (const s of d) if (l.t?.[s.id]) { const t = new Date(l.t[s.id]); hours.push(t.getHours() + t.getMinutes() / 60); } }
  const avgH = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : null;
  return { days: keys.length, ratio: keys.length ? done / (n * keys.length) : null, perDay: keys.length ? done / keys.length : 0, full, n, at: avgH == null ? null : String(Math.floor(avgH)).padStart(2, '0') + ':' + String(Math.round((avgH % 1) * 60) % 60).padStart(2, '0') };
}
function strugglingRoutine() {
  const snooze = S.rcheck || {};
  return S.routines.map(r => ({ r, st: routineStats(r) })).find(({ r, st }) => st.days >= 4 && st.ratio != null && st.ratio < .34 && r.steps.length >= 2 && !(snooze[r.id] > Date.now()));
}
function routineCheckCard() {
  const hit = strugglingRoutine(); if (!hit) return '';
  const { r, st } = hit; const per = Math.max(0, Math.round(st.perDay));
  return `<section class="card rcheck"><div class="rc-ic" aria-hidden="true">🌱</div><div class="rc-body"><p class="eyebrow">A gentle check</p><h2 class="h2" style="font-size:20px">Is “${esc(r.name)}” feeling like a lot?</h2>
    <p class="small">Lately you've done about ${per} of ${r.steps.length} steps on most days. That's okay. Smaller often sticks better.</p>
    <div class="rc-btns"><button class="btn small primary" type="button" data-act="rcSmaller" data-id="${r.id}">Make it smaller</button>${aiReady() && plan().ai ? `<button class="btn small" type="button" data-act="rcAsk" data-id="${r.id}">Talk it through</button>` : ''}<button class="btn small ghost" type="button" data-act="rcFine" data-id="${r.id}">It's fine</button></div></div></section>`;
}
function setStep(id, on) { const l = dayLog(); const had = l.s.includes(id); l.s = l.s.filter(x => x !== id); if (on) { l.s.push(id); if (!had) (l.t ||= {})[id] = Date.now(); } else if (l.t) delete l.t[id]; if (on && !had) addXP(XP.step); if (!on && had) addXP(-XP.step); save(); }
function setRem(id, on) { const l = dayLog(); const had = l.r.includes(id); l.r = l.r.filter(x => x !== id); if (on) l.r.push(id); if (on && !had) addXP(XP.reminder); if (!on && had) addXP(-XP.reminder); save(); }
function slotNow() { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'day' : 'evening'; }
function orderedRoutines() {
  const cur = SLOTS[slotNow()].order;
  return [...S.routines].sort((a, b) => ((SLOTS[a.slot]?.order ?? 1) - cur + 3) % 3 - ((SLOTS[b.slot]?.order ?? 1) - cur + 3) % 3);
}
function nextStep() {
  const skipped = S.skip[dayKey()] || [];
  let fallback = null;
  for (const r of orderedRoutines()) for (const st of r.steps) {
    if (stepDone(st.id)) continue;
    if (skipped.includes(st.id)) { fallback ||= { r, st }; continue; }
    return { r, st };
  }
  return fallback;
}
function totals(k = dayKey()) {
  const l = peekLog(k);
  const ids = new Set(S.routines.flatMap(r => r.steps.map(s => s.id)));
  const rids = new Set(S.reminders.map(r => r.id));
  const total = ids.size + rids.size;
  const done = l.s.filter(x => ids.has(x)).length + l.r.filter(x => rids.has(x)).length;
  return { total, done };
}
function activeDay(k) { const l = S.log[k]; return !!l && (l.s.length + l.r.length + (l.m || 0)) > 0; }
function streak() {
  const d = new Date(); let n = 0, gap = 0;
  if (!activeDay(dayKey(d))) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 400; i++) {
    if (activeDay(dayKey(d))) { n++; gap = 0; }
    else { gap++; if (gap > 1) break; }
    d.setDate(d.getDate() - 1);
  }
  return n;
}
function weekData() {
  const now = new Date(); const dow = (now.getDay() + 6) % 7;
  const mon = new Date(now); mon.setDate(now.getDate() - dow);
  return WD().map((lbl, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const k = dayKey(d); const { total, done } = totals(k);
    const ratio = total ? done / total : 0;
    return { lbl, k, ratio: (S.log[k]?.m && ratio < .15) ? .15 : ratio, future: i > dow, today: i === dow };
  });
}
function greet() { const h = new Date().getHours(); return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
const tipToday = () => TIPS[Math.floor(Date.now() / 864e5) % TIPS.length];

/* ---------- UI primitives ---------- */
let toastTimer;
function toast(msg, action) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  if (action) t.querySelector('button').onclick = () => { action.fn(); t.remove(); };
  document.body.appendChild(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), action ? 6000 : 2600);
}
const still = () => S.settings.calm || matchMedia('(prefers-reduced-motion: reduce)').matches;
function burst(el, n = 18) {
  if (still() || !el) return;
  const r = el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const cols = [getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7fb3e8', '#f2856b', '#f7c46c', '#8fcba4', '#c9b0ff'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'petal';
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
    p.style.background = cols[i % cols.length];
    p.style.setProperty('--x0', cx + 'px'); p.style.setProperty('--y0', cy + 'px');
    p.style.setProperty('--x1', cx + Math.cos(a) * d + 'px'); p.style.setProperty('--y1', cy + Math.sin(a) * d - 40 + 'px');
    p.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
    p.style.animationDelay = (Math.random() * .08) + 's';
    document.body.appendChild(p); setTimeout(() => p.remove(), 1500);
  }
}
let AC = null;
function chime(kind = 'done') {
  if (!S.settings.sound) return;
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === 'big' ? [523.25, 659.25, 783.99, 1046.5] : kind === 'soft' ? [392] : [587.33, 880];
    notes.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(); const t = AC.currentTime + i * .11;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(kind === 'soft' ? .05 : .09, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + (kind === 'soft' ? 1.4 : .9));
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 1.5);
    });
  } catch (e) {}
}
function celebrate(title, sub, after) {
  chime('big');
  const c = document.createElement('div'); c.className = 'celebrate'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', title);
  c.innerHTML = `<div class="box">${CH.cheer()}<h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p><button class="btn light block" type="button" style="margin-top:8px">Continue</button></div>`;
  document.body.appendChild(c);
  setTimeout(() => burst(c.querySelector('.char'), 30), 250);
  const close = () => { c.remove(); after && after(); };
  c.querySelector('button').onclick = close;
  c.addEventListener('click', e => { if (e.target === c) close(); });
  c.querySelector('button').focus();
}
function openSheet(html, onMount) {
  closeSheet();
  const b = document.createElement('div'); b.className = 'sheet-back'; b.id = 'sheet';
  b.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  b.addEventListener('click', e => { if (e.target === b) closeSheet(); });
  document.body.appendChild(b); onMount && onMount(b);
  const f = b.querySelector('input,textarea'); if (f) setTimeout(() => f.focus(), 350);
}
function closeSheet() { $('#sheet')?.remove(); }
const ring = (done, total, color) => {
  const C = 2 * Math.PI * 16, p = total ? done / total : 0;
  return `<div class="ring" style="--rc:${color}"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16"/><circle class="fg" cx="20" cy="20" r="16" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}"/></svg><span class="tnum">${done}/${total}</span></div>`;
};

/* ---------- render: shell ---------- */
const TABS = [['today', 'Today'], ['routines', 'Routines'], ['workouts', 'Workouts'], ['you', 'You']];
const ROUTE = { track: 'you', moment: 'mindful', calm: 'mindful', prefs: 'you' };
function renderTabs() {
  const cur = S.tab === 'terra' ? 'today' : S.tab;
  $('#tabs').innerHTML = TABS.map(([k, l]) => `<button type="button" data-act="tab" data-k="${k}" ${cur === k ? 'aria-current="page"' : ''}>${IC[k]}<span>${l}</span></button>`).join('');
}
function render() {
  if (S.onboarded) ensureRoutineReminders();
  document.documentElement.classList.add('theme-blue');
  document.documentElement.classList.toggle('still', !!S.settings.calm);
  if (!S.onboarded) { $('#tabbar').hidden = true; $('#view').innerHTML = ''; $('#composer').hidden = true; renderOnboarding(); return; }
  if (S.tab === 'prefs') S.youSec = 'settings';
  if (ROUTE[S.tab]) S.tab = ROUTE[S.tab];
  if (S.tab === 'you' && S.youSec === 'workouts') { S.tab = 'workouts'; S.youSec = null; }
  if (!TABS.some(t => t[0] === S.tab) && S.tab !== 'terra' && S.tab !== 'mindful') S.tab = 'today';
  $('#tabbar').hidden = false;
  renderTabs();
  if (S.tab !== 'today') stopBreath(true);
  const v = { today: viewToday, routines: viewRoutines, workouts: viewWorkouts, you: viewYou, terra: viewTerra, mindful: viewMindful }[S.tab] || viewToday;
  $('#view').innerHTML = `<div class="view">${v()}</div>`;
  $('#composer').hidden = !(S.tab === 'terra' && plan().ai && aiReady());
  if (S.tab === 'terra') { const m = $('#msgs'); if (m) requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight })); }
  if (S.tab === 'today' || S.tab === 'mindful') paintBreath();
}

/* ---------- Today ---------- */
function viewToday() {
  const d = new Date(); const h = d.getHours();
  const tod = h >= 5 && h < 11 ? 'dawn' : h < 17 && h >= 11 ? 'day' : h >= 17 && h < 21 ? 'dusk' : 'night';
  const dateStr = d.toLocaleDateString(LOC(), { weekday: 'long', day: 'numeric', month: 'long' });
  const nx = nextStep(); const { total, done } = totals();
  const pct = total ? Math.round(done / total * 100) : 0;
  const grown = worldCount(); const seen = typeof S.worldSeen === 'number' ? Math.min(S.worldSeen, grown) : grown; S.worldSeen = grown;
  const hero = `<section class="today-top"><div class="scene" data-act="world" role="button" tabindex="0" aria-label="Your world: ${grown} small steps have grown it">${SCENE(tod, { count: grown, seen })}<div class="scene-char">${tod === 'night' ? CH.sleep() : CH.sit()}</div>
    <button class="ai-pill" type="button" data-act="tab" data-k="terra" aria-label="Open Terra AI">${IC.terra}<span>Terra AI</span></button></div>
    <div class="greet-row"><div><span class="eyebrow">${esc(dateStr)}</span><h1 class="h1">${S.name ? `<span class="greet">${esc(greet())},</span><br>${esc(S.name)}` : 'Today'}</h1>${alarmCheckPill()}${wakeNote()}${DARK_SEASON() ? `<button class="dark-note" type="button" data-act="world">${IC.moon || ''}<span>Dark season: a smaller day is enough</span></button>` : ''}</div></div></section>`;
  let card;
  if (!S.routines.length) {
    card = `<section class="card next"><p class="eyebrow">Start here</p><p class="step">Create your first tiny routine</p><button class="btn-done" type="button" data-act="tab" data-k="routines"><span class="l">${IC.plus} New routine</span>${IC.arrow}</button></section>`;
  } else if (!nx) {
    card = `<section class="card next"><div class="all-done"><span class="done-emo" aria-hidden="true">🌿</span><div><p class="eyebrow">All steps done</p><p class="step" style="font-size:23px">That's your rhythm for today.</p><p class="meta">Rest counts too. See you tomorrow.</p></div></div>
      ${progressBlock(done, total, pct)}</section>`;
  } else {
    card = `<section class="card next" id="nextCard">
      <div class="label"><span class="eyebrow">${IC.leaf.replace('<svg', '<svg width="16" height="16"')} Your next tiny step</span><span class="routine-name" title="Routine: ${esc(nx.r.name)}"><i style="background:${(SLOTS[nx.r.slot] || SLOTS.day).color}"></i>${esc(nx.r.name)} · step ${nx.r.steps.indexOf(nx.st) + 1} of ${nx.r.steps.length}</span></div>
      <div class="step-row"><div><p class="step" id="stepText">${esc(nx.st.text)}</p><p class="meta">About ${nx.st.mins || 1} min · ${esc(nx.r.anchor || SLOTS[nx.r.slot]?.label || '')}</p></div>
        <button class="done-round" type="button" data-act="doneNext" data-id="${nx.st.id}" aria-label="Mark this step done">${IC.check}<span>Done</span></button></div>
      <button class="skip" type="button" data-act="skipNext" data-id="${nx.st.id}">Not now, show me another</button>
      ${progressBlock(done, total, pct)}
    </section>`;
  }
  return hero + card + whyCard(!!nx, done) + todayNotes() + smartCard() + `<button class="card notes-btn" type="button" data-act="tab" data-k="mindful"><span class="nb-ic" aria-hidden="true">🌬️</span><span class="nb-txt"><b>Mindfulness</b><small>A one-minute breath, whenever you need it</small></span></button>`;
}
function viewMindful() {
  return `<section class="hero mind-hero"><div><span class="eyebrow">Rest</span><h1 class="h1">Mindfulness</h1><p class="sub">Pause for a breath or two.</p></div>${CH3.mindful()}</section>${viewMoment()}<div class="btns"><button class="btn" type="button" data-act="tab" data-k="today">Back to Today</button></div>`;
}
/* One important thing and three wins for today, saved per day in S.notes */
/* Why I started: the person's own reason, written in the personalisation. It sits under the next step,
   and speaks up a little more on harder moments (nothing done yet in the afternoon, or after "not now"). */
const WHY_IDEAS = ['I want to have more energy', 'I want my days to stop falling apart', 'I want to feel good in my body', 'I want to be there for the people I love'];
function whyCard(hasNext, done) {
  const w = (S.profile?.why || '').trim();
  if (!w) return S.whyHide ? '' : `<div class="why-card empty"><button class="why-add" type="button" data-act="whyEdit"><span aria-hidden="true">✍️</span><span><b>${tr('Why did you start?')}</b><small>${tr('Write it down. Terra reminds you on hard days.')}</small></span></button><button class="icon-btn" type="button" data-act="whyHide" aria-label="${tr('Hide')}">✕</button></div>`;
  const h = new Date().getHours();
  const hard = hasNext && ((done === 0 && h >= 13) || (S.skip && S.skip[dayKey()]?.length));
  return `<button class="why-card ${hard ? 'hard' : ''}" type="button" data-act="whyEdit" aria-label="${tr('Why I started')}: ${esc(w)}">
    <span class="eyebrow">${hard ? tr('Remember why you started') : tr('Why I started')}</span>
    <q>${esc(w)}</q></button>`;
}
function whySheet() {
  openSheet(`<h2 class="h2">${tr('Why did you start?')}</h2>
    <p class="sub" style="margin-top:-6px">${tr('Write it in your own words. Terra reminds you of it on the days when it feels hard.')}</p>
    <textarea id="whyText" class="why-input" maxlength="140" rows="3" placeholder="${tr('E.g. I want my days to stop falling apart')}">${esc(S.profile?.why || '')}</textarea>
    <button class="btn primary block" type="button" data-act="whySave" style="margin-top:12px">${tr('Save')}</button>
    <button class="skip" type="button" data-act="sheetClose">${tr('Close')}</button>`);
}
function todayNotes() {
  const n = (S.notes && S.notes[dayKey()]) || { imp: '', wins: [] };
  const w = (n.wins || []).length;
  return `<button class="card notes-btn" type="button" data-act="dayNotesOpen" id="dayNotes">
    <span class="nb-ic" aria-hidden="true">🎯</span>
    <span class="nb-txt"><b>${n.imp ? esc(n.imp) : 'One thing and three wins'}</b><small>${n.imp ? `Today's one thing · ${w} of 3 wins` : 'Write today\'s one important thing and what went well'}</small></span>
    ${IC.arrow}</button>`;
}
function dayNotesSheet() {
  const n = (S.notes && S.notes[dayKey()]) || { imp: '', wins: [] };
  openSheet(`<h2 class="h2">One thing and three wins</h2>
    <p class="sub" style="margin-top:-6px">Pick the one thing that matters most today. In the evening, write down three things that went well.</p>
    <div class="field"><label for="noteImp">The one important thing</label><div class="row" style="gap:8px"><input id="noteImp" type="text" maxlength="120" value="${esc(n.imp || '')}" placeholder="E.g. send the invoice" style="flex:1;min-width:0"><button class="btn small" type="button" data-act="dayNoteImp">Save</button></div></div>
    ${[0, 1, 2].map(i => `<div class="field"><label for="noteWin${i}">Win ${i + 1}</label><input id="noteWin${i}" type="text" maxlength="120" value="${esc(n.wins?.[i] || '')}" placeholder="Something that went well"></div>`).join('')}
    <button class="btn primary block" type="button" data-act="dayNotes">Save</button>
    <button class="skip" type="button" data-act="sheetClose">Close</button>`);
}
/* Your world: a running count of everything you've done. It only ever grows (old days are pruned from the log, the world isn't). */
function worldCount() {
  const c = Object.values(S.log).reduce((a, l) => a + (l.s?.length || 0) + (l.r?.length || 0) + (l.m ? 1 : 0), 0);
  if (typeof S.grown !== 'number') { S.grown = c; S.worldLast = c; }
  if (c > (S.worldLast || 0)) S.grown += c - (S.worldLast || 0);
  S.worldLast = c;
  return S.grown;
}
const SEASON_NAME = { autumn: 'Autumn', winter: 'Winter', spring: 'Spring', summer: 'Summer' };
const SEASON_LINE = {
  autumn: 'The hills turn to autumn colours and leaves drift down.',
  winter: 'Snow settles on the hills and the trees.',
  spring: 'Blossoms open and petals float by.',
  summer: 'Everything is green and the light stays long.',
};
function worldSheet() {
  const n = worldCount(); const nx = WORLD_NEXT(n); const season = SEASON_OF();
  const items = WORLD.filter(w => w[0] <= n).length;
  openSheet(`<h2 class="h2">Your world</h2>
    <p class="sub" style="margin-top:6px">Every small step you finish grows something here, and the path climbs a little further.</p>
    <div class="world-stats"><div><b class="tnum">${n}</b><span>small steps</span></div><div><b class="tnum">${items}</b><span>things growing</span></div></div>
    ${nx ? `<p class="world-next">${nx - n === 1 ? 'One more step and something new grows.' : `${nx - n} more steps and something new grows.`}</p>` : `<p class="world-next">Your world is in full bloom.</p>`}
    <ul class="world-notes">
      <li>${IC.leaf}<span>Nothing ever wilts. A missed day is just a quiet day.</span></li>
      <li>${IC.sun || IC.leaf}<span>${SEASON_NAME[season]}: ${SEASON_LINE[season]}</span></li>
      ${DARK_SEASON() ? `<li>${IC.moon || IC.leaf}<span>It's the dark season. Less light means less energy for many people, so a smaller day is enough. Even one step counts.</span></li>` : ''}
    </ul>
    <button class="btn block" type="button" data-act="sheetClose" style="margin-top:14px">Close</button>`);
}
/* Today shows one extra card at most: whichever matters most right now */
function smartCard() {
  const late = new Date().getHours() >= 17;
  if (H.consent.mood && !slotDone(feelSlot())) return checkinCard();
  const rc = routineCheckCard(); if (rc) return rc;
  if (H.consent.mood && !H.moods.some(m => m.d === dayKey())) return stressMini();
  return stressMini();
}
function progressBlock(done, total, pct) {
  return `<div class="progress"><div class="row between"><span>Today's progress</span><span class="tnum" style="color:var(--fg)">${done} / ${total}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
}

function completeStep(id, btn) {
  const r = S.routines.find(r => r.steps.some(s => s.id === id)); if (!r) return;
  const wasDone = r.steps.every(s => stepDone(s.id));
  setStep(id, true);
  chime(); burst(btn);
  const nowDone = r.steps.every(s => stepDone(s.id));
  const card = $('#nextCard');
  if (card && S.tab === 'today') {
    btn.classList.add('done-anim'); card.classList.add('leaving');
    setTimeout(() => { render(); if (!wasDone && nowDone) celebrate(`${r.name} done`, 'Every step you took today counts. Be proud of that.'); else toast(WINS[Math.floor(Math.random() * WINS.length)]); }, 380);
  } else {
    render(); if (!wasDone && nowDone) celebrate(`${r.name} done`, 'Every step you took today counts. Be proud of that.');
  }
}

/* ---------- Routines ---------- */
let openAdd = null, confirmDel = null, editRoutine = null, editStep = null;
function stepTools(r, s, i, all) {
  return `<span class="step-tools" style="display:flex;flex-wrap:wrap;margin-left:auto;gap:0"><button class="icon-btn" type="button" data-act="moveStep" data-r="${r.id}" data-id="${s.id}" data-dir="-1" aria-label="Move step up" ${i === 0 ? 'disabled' : ''}>▲</button><button class="icon-btn" type="button" data-act="moveStep" data-r="${r.id}" data-id="${s.id}" data-dir="1" aria-label="Move step down" ${i === all.length - 1 ? 'disabled' : ''}>▼</button><button class="icon-btn" type="button" data-act="editStep" data-id="${s.id}" aria-label="Edit step">${IC.more}</button><button class="icon-btn" type="button" data-act="delStep" data-r="${r.id}" data-id="${s.id}" aria-label="Remove step">${IC.close}</button></span>`;
}
function stepForm(s) {
  return `<form class="add-step" data-form="editStep" data-id="${s.id}" style="flex:1;min-width:0"><input type="text" name="t" value="${esc(s.text)}" maxlength="80" required aria-label="Step text"><button class="btn primary small" type="submit">Save</button></form>`;
}
function viewRoutines() {
  const p = plan(); const n = S.routines.length;
  const limitNote = p.routines !== Infinity ? `<div class="plan-note"><span>${n} of ${p.routines} routines on Free</span><button class="link-btn" type="button" data-act="paywall" style="color:var(--hair3)">Upgrade</button></div>` : '';
  const cardOf = r => {
    const sl = SLOTS[r.slot] || SLOTS.day; const dn = r.steps.filter(s => stepDone(s.id)).length; const ed = editRoutine === r.id;
    return `<article class="card routine ${ed ? 'editing' : ''}" style="--rc:${sl.color}">
      <header><div class="r-icon">${IC[sl.icon]}</div><div style="min-width:0"><h3>${esc(r.name)}</h3><p class="anchor">${esc(r.anchor || sl.label)}</p></div>${ring(dn, r.steps.length, sl.color)}${ed ? '' : `<button class="r-more" type="button" data-act="editR" data-id="${r.id}" aria-label="Edit ${esc(r.name)}">${IC.more}</button>`}</header>
      <ul class="steps">${r.steps.map((s, i, all) => `<li class="${stepDone(s.id) ? 'done' : ''}"><button class="check ${stepDone(s.id) ? 'on' : ''}" type="button" data-act="togStep" data-id="${s.id}" aria-label="Mark ${esc(s.text)} done" aria-pressed="${stepDone(s.id)}">${IC.check}</button>${editStep === s.id ? stepForm(s) : `<span>${esc(s.text)}</span>`}${ed && editStep !== s.id ? stepTools(r, s, i, all) : ''}</li>`).join('')}</ul>
      ${openAdd === r.id ? `<form class="add-step" data-form="addStep" data-r="${r.id}"><input type="text" id="newStep-${r.id}" name="t" placeholder="A step under 2 minutes" maxlength="80" required><button class="btn primary small" type="submit">Add</button></form>` : ''}
      ${ed ? `<footer>${confirmDel === r.id
        ? `<div class="confirm">Delete this routine? <button class="btn small danger" type="button" data-act="delRoutine" data-id="${r.id}">Delete</button><button class="btn small ghost" type="button" data-act="cancelDel">Keep</button></div>`
        : `<button class="link-btn" type="button" data-act="openAdd" data-id="${r.id}" style="font-size:14px">${IC.plus} Add step</button><button class="link-btn" type="button" data-act="editRDetails" data-id="${r.id}" style="font-size:14px">Name and time</button><span class="row" style="gap:0"><button class="icon-btn" type="button" data-act="cal" data-kind="routine" data-id="${r.id}" aria-label="Add to calendar">${IC.calendar}</button><button class="icon-btn" type="button" data-act="askDel" data-id="${r.id}" aria-label="Delete routine">${IC.trash}</button><button class="link-btn" type="button" data-act="editR" data-id="${r.id}" style="font-size:14px;margin-left:6px">Done</button></span>`}</footer>`
        : ''}
    </article>`;
  };
  const fi = LANG === 'fi', now = slotNow();
  const slotOf = r => SLOTS[r.slot] ? r.slot : 'day';
  const stat = k => { const st = S.routines.filter(r => !k || slotOf(r) === k).flatMap(r => r.steps); return [st.filter(x => stepDone(x.id)).length, st.length]; };
  const HOURS = { morning: 'Until 11:00', day: '11:00–17:00', evening: 'From 17:00' };
  const EMPTY_ADD = { morning: 'Add a morning routine', day: 'Add a daytime routine', evening: 'Add an evening routine' };
  const cards = Object.keys(SLOTS).map(k => {
    const rs = S.routines.filter(r => slotOf(r) === k);
    return `<div class="slot-group ${k === now ? 'is-now' : ''}" id="slot-${k}">
      <div class="slot-head"><span class="slot-ic" aria-hidden="true">${IC[SLOTS[k].icon] || ''}</span><div class="slot-txt"><h3>${SLOTS[k].label}</h3><small>${HOURS[k]}</small></div>${k === now ? '<span class="now-badge">Now</span>' : ''}<button class="pill-add" type="button" data-act="newRoutine" data-k="${k}" aria-label="${EMPTY_ADD[k]}">${IC.plus}</button></div>
      ${rs.length ? `<div class="stack">${rs.map(cardOf).join('')}</div>` : `<button class="slot-empty" type="button" data-act="newRoutine" data-k="${k}">${IC.plus}<span>${EMPTY_ADD[k]}</span></button>`}</div>`;
  }).join('');
  const [dAll, nAll] = stat();
  const summary = `<section class="card rt-sum">
      <div class="rt-sum-top"><div><p class="eyebrow">Today's rhythm</p><p class="rt-big"><b class="tnum">${dAll}</b><span> / ${nAll} ${fi ? 'askelta' : 'steps'}</span></p></div>${ring(dAll, nAll, 'var(--accent)')}</div>
      <div class="rt-slots">${Object.keys(SLOTS).map(k => { const [d, n] = stat(k); return `<button class="rt-slot ${k === now ? 'now' : ''} ${n && d === n ? 'full' : ''}" type="button" data-act="slotJump" data-k="${k}"><span class="rs-ic" aria-hidden="true">${IC[SLOTS[k].icon]}</span><span class="rs-l">${SLOTS[k].label}</span><small class="tnum">${n ? `${d}/${n}` : '–'}</small></button>`; }).join('')}</div>
    </section>`;
  const rems = [...S.reminders].sort((a, b) => remAt(a).localeCompare(remAt(b)));
  const remList = `<section class="card rem-card"><div class="rem-head"><h2 class="h2"><span class="rh-ic" aria-hidden="true">${IC.bell}</span>Reminders</h2><button class="pill-add wide" type="button" data-act="addRem">${IC.plus}<span>Add</span></button></div>
    <p class="small rem-sub">They arrive as notifications, even when Terra is closed. Tap a time to change it.</p>
    <div class="list">${rems.length ? rems.map(r => `<div class="item rem-item">
      <label class="time-chip rem-time" aria-label="Change time">${IC.snooze}<span class="tnum">${esc(r.time)}</span><input type="time" value="${esc(r.time)}" data-input="remTime" data-id="${r.id}"></label>
      <div class="txt"><b>${r.emoji ? `<span class="r-emoji" aria-hidden="true">${esc(r.emoji)}</span> ` : ''}${esc(r.text)}</b>${remAt(r) !== r.time ? `<small class="rem-today">☀️ ${tr('Today at')} <span class="tnum">${remAt(r)}</span></small>` : ''}</div>
      <button class="icon-btn" type="button" data-act="editRem" data-id="${r.id}" aria-label="Edit reminder">${IC.more}</button>
    </div>`).join('') : `<p class="empty">No reminders yet. Add one for something you tend to forget.</p>`}</div></section>`;
  return `${remList}
    <section class="rt-section"><div class="section-head"><h2 class="h2">Routines</h2></div>
    ${summary}${limitNote}
    <div class="slot-groups">${cards}</div>
    <button class="card ai-build" type="button" data-act="tab" data-k="terra"><span class="ai-ic" aria-hidden="true">${IC.terra}</span><span class="ai-t"><b>Build with Terra AI</b><small>Tell Terra your goal and it makes the routine for you.</small></span>${IC.arrow}</button></section>`;
}
function routineSheet(rid, slot) {
  const ex = rid ? S.routines.find(x => x.id === rid) : null;
  if (!ex && S.routines.length >= plan().routines) { openPaywall('Free includes 3 routines. Pro gives you as many as you need.'); return; }
  const sel = ex?.slot || (SLOTS[slot] ? slot : 'morning');
  const SLOT_AT = { morning: slotTime('morning'), day: slotTime('day'), evening: slotTime('evening') };
  const linked = ex ? S.reminders.find(x => x.rid === ex.id) : null;
  const remAt = ex ? (linked?.time || '') : SLOT_AT[sel];
  const tpls = ex ? '' : `<div class="field"><label>Start from an idea, or write your own below</label><div class="tpl-list">${Object.keys(TEMPLATES).map(k => `<button type="button" class="btn small ghost" data-tpl="${esc(k)}">${esc(tr(k))}</button>`).join('')}</div></div>`;
  const steps = ex ? '' : `<div class="field"><label for="rStepIn">Steps</label><p class="small" style="margin:-2px 0 4px">Write each step as one clear thing to do.</p>
      <ol class="step-build" id="rStepList"></ol>
      <div class="step-add"><input type="text" id="rStepIn" placeholder="E.g. Drink a glass of water" maxlength="80" enterkeyhint="done" autocomplete="off"><button type="button" class="btn small primary" id="rStepAdd">${IC.plus} Add</button></div>
      <p class="small step-warn" id="rStepWarn" hidden>Add at least one step.</p>
      <input type="hidden" name="steps" id="rStepsVal"></div>`;
  openSheet(`<div class="sheet-head"><h2 class="h2">${ex ? 'Edit routine' : 'New routine'}</h2><button class="icon-btn" type="button" data-sheet-close aria-label="Close">${IC.close}</button></div>
    <form class="stack" data-form="${ex ? 'editRoutine' : 'newRoutine'}"${ex ? ` data-id="${ex.id}"` : ''}>
      ${tpls}
      <div class="field"><label for="rName">Name</label><input type="text" id="rName" name="name" placeholder="Morning start" maxlength="40" required value="${esc(ex?.name || '')}"></div>
      <div class="field"><label>When</label><div class="seg" id="rSlot">${Object.entries(SLOTS).map(([k, s]) => `<button type="button" data-slot="${k}" class="${k === sel ? 'on' : ''}">${s.label}</button>`).join('')}</div></div>
      <div class="field"><label for="rAnchor">Link it to something you already do</label><input type="text" id="rAnchor" name="anchor" placeholder="After I turn off my alarm" maxlength="60" value="${esc(ex?.anchor || '')}"></div>
      ${steps}
      <div class="field"><label for="rRemind">Reminder</label><div class="rem-at"><input type="time" id="rRemind" name="remind" value="${esc(remAt)}"><button type="button" class="link-btn" id="rRemClear">No reminder</button></div><p class="small" style="margin:4px 0 0">Terra reminds you when it is time for this routine.</p></div>
      <div class="sheet-btns"><button class="btn ghost" type="button" data-sheet-close>Cancel</button><button class="btn primary" type="submit">${ex ? 'Save changes' : 'Save routine'}</button></div>
    </form>`, b => {
    b.querySelectorAll('[data-sheet-close]').forEach(x => x.addEventListener('click', closeSheet));
    const rem = b.querySelector('#rRemind'); let remTouched = !!ex;
    rem.addEventListener('input', () => { remTouched = true; });
    b.querySelector('#rRemClear').addEventListener('click', () => { rem.value = ''; remTouched = true; });
    b.querySelector('#rSlot').addEventListener('click', e => { const t = e.target.closest('[data-slot]'); if (!t) return; b.querySelectorAll('#rSlot button').forEach(x => x.classList.toggle('on', x === t)); if (!remTouched) rem.value = SLOT_AT[t.dataset.slot]; });
    if (ex) return;
    let list = [];
    const ul = b.querySelector('#rStepList'), inp = b.querySelector('#rStepIn'), val = b.querySelector('#rStepsVal'), warn = b.querySelector('#rStepWarn');
    const paint = () => {
      val.value = list.join('\n');
      ul.innerHTML = list.length ? list.map((t, i) => `<li><span class="sb-n">${i + 1}</span><span class="sb-t">${esc(t)}</span>
        <button type="button" class="icon-btn" data-up="${i}" aria-label="Move step up" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button type="button" class="icon-btn" data-rm="${i}" aria-label="Remove step">${IC.close}</button></li>`).join('')
        : `<li class="sb-empty">${tr('No steps yet. Add the first one below.')}</li>`;
      if (list.length) warn.hidden = true;
    };
    const add = () => { const t = inp.value.trim(); if (!t) { inp.focus(); return; } if (list.length >= 10) { toast(tr('Up to 10 steps')); return; } list.push(t.slice(0, 80)); inp.value = ''; paint(); inp.focus(); };
    b.querySelector('#rStepAdd').addEventListener('click', add);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    ul.addEventListener('click', e => {
      const rm = e.target.closest('[data-rm]'), up = e.target.closest('[data-up]');
      if (rm) { list.splice(Number(rm.dataset.rm), 1); paint(); }
      if (up) { const i = Number(up.dataset.up); if (i > 0) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; paint(); } }
    });
    b.querySelectorAll('[data-tpl]').forEach(btn => btn.addEventListener('click', () => {
      const t = TEMPLATES[btn.dataset.tpl]; if (!t) return;
      b.querySelector('#rName').value = tr(t.name); b.querySelector('#rAnchor').value = tr(t.anchor);
      b.querySelectorAll('#rSlot button').forEach(x => x.classList.toggle('on', x.dataset.slot === t.slot)); if (!remTouched) rem.value = SLOT_AT[t.slot];
      b.querySelectorAll('[data-tpl]').forEach(x => x.classList.toggle('on', x === btn));
      list = t.steps.map(x => tr(x)); paint();
    }));
    paint();
  });
}
/* A routine's own reminder: created, moved or removed together with the routine */
/* Every routine gets its own reminder at the time its part of the day starts, unless the person turned it off */
const slotTime = slot => ({ morning: START_AT[S.profile?.dayStart] || '08:00', day: '13:00', evening: S.profile?.goals?.includes('Better sleep') ? (WIND_AT[S.profile?.windDown] || '21:30') : '19:00' })[slot] || '09:00';
function ensureRoutineReminders() {
  let changed = false;
  for (const r of S.routines || []) {
    if (r.noRem || S.reminders.some(x => x.rid === r.id)) continue;
    S.reminders.push({ id: uid(), rid: r.id, text: r.name, time: slotTime(r.slot), emoji: { morning: '🌅', day: '☀️', evening: '🌙' }[r.slot] || '⏰' }); changed = true;
  }
  if (changed) save();
}
function linkReminder(r, time) {
  const i = S.reminders.findIndex(x => x.rid === r.id);
  if (!/^\d{2}:\d{2}$/.test(time)) { if (i >= 0) S.reminders.splice(i, 1); r.noRem = true; save(); return; }
  r.noRem = false;
  const emoji = { morning: '🌅', day: '☀️', evening: '🌙' }[r.slot] || '⏰';
  if (i >= 0) Object.assign(S.reminders[i], { text: r.name, time, emoji }); else S.reminders.push({ id: uid(), rid: r.id, text: r.name, time, emoji });
  save();
}
function addRoutine({ name, slot, anchor, steps }) {
  const r = { id: uid(), created: dayKey(), name: String(name || 'New routine').slice(0, 40), slot: SLOTS[slot] ? slot : 'day', anchor: String(anchor || '').slice(0, 60),
    steps: (steps || []).map(s => typeof s === 'string' ? { text: s } : s).filter(s => s && String(s.text || '').trim()).slice(0, 10).map(s => ({ id: uid(), text: String(s.text).trim().slice(0, 80), mins: clamp(Math.round(Number(s.mins) || 1), 1, 10) })) };
  if (!r.steps.length) return null;
  S.routines.push(r); save(); return r;
}

/* ---------- Moment (breathing) ---------- */
const PATTERNS = {
  calm: { name: 'Calm', phases: [['Breathe in', 4, 1], ['Hold', 2, 1], ['Breathe out', 6, .62]], desc: 'In for 4 · hold for 2 · out for 6' },
  box: { name: 'Box breathing', phases: [['Breathe in', 4, 1], ['Hold', 4, 1], ['Breathe out', 4, .62], ['Hold', 4, .62]], desc: 'In 4 · hold 4 · out 4 · hold 4' },
};
const BR = { running: false, paused: false, elapsed: 0, phaseIdx: 0, phaseLeft: 0, timer: null, last: 0, finished: false, lock: null };
function viewMoment() {
  const p = plan(); const m = S.moment;
  if (!p.durations.includes(m.dur)) m.dur = 1; if (!p.patterns.includes(m.pat)) m.pat = 'calm';
  return `<section class="card soft moment-hero" style="display:grid;grid-template-columns:1fr 168px;align-items:center;gap:8px;padding:20px 8px 12px 22px;overflow:hidden">
      <div><span class="eyebrow">Moment</span><h1 class="h1" style="font-size:clamp(30px, 8.6vw, 38px);line-height:1.05;margin-top:8px">Drop your shoulders</h1><p class="sub" style="font-size:17px;margin-top:8px">This moment is for you.</p></div>${BONSAI()}</section>
    <section class="card breath">
      <div class="clock" id="brClock">0:00 / ${m.dur}:00</div>
      <h2 id="brTitle">Ready to begin?</h2>
      <div class="orb-wrap"><div class="orb-glow"></div><div class="orb" id="orb"><div>${IC.wind}<div class="ph" id="brPh">breathe</div><div class="ct" id="brCt"></div></div></div></div>
      <div class="seg" role="group" aria-label="Length">${[1, 3, 5, 10].map(n => `<button type="button" data-act="dur" data-n="${n}" class="${m.dur === n ? 'on' : ''}">${p.durations.includes(n) ? '' : IC.lock.replace('<svg', '<svg class="lock"')}${n} min</button>`).join('')}</div>
      <div class="seg" role="group" aria-label="Breathing pattern">${Object.entries(PATTERNS).map(([k, pt]) => `<button type="button" data-act="pat" data-k="${k}" class="${m.pat === k ? 'on' : ''}">${p.patterns.includes(k) ? '' : IC.lock.replace('<svg', '<svg class="lock"')}${pt.name}</button>`).join('')}</div>
      <div class="controls"><button class="btn light" type="button" data-act="brToggle" id="brBtn">${IC.play} Start</button><button class="round-btn" type="button" data-act="brReset" aria-label="Start over">${IC.reset}</button></div>
      <p class="small" id="brDesc">${PATTERNS[m.pat].desc}</p>
    </section>`;
}
function paintBreath() {
  const btn = $('#brBtn'); if (!btn) return;
  const m = S.moment; const total = m.dur * 60; const pat = PATTERNS[m.pat];
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  $('#brClock').textContent = `${fmt(BR.elapsed)} / ${fmt(total)}`;
  btn.innerHTML = BR.running && !BR.paused ? `${IC.pause} Pause` : `${IC.play} ${BR.elapsed > 0 && !BR.finished ? 'Continue' : 'Start'}`;
  const orb = $('#orb');
  if (BR.finished) { $('#brTitle').textContent = 'Well done. Notice how you feel.'; $('#brPh').textContent = 'done'; $('#brCt').textContent = ''; orb.style.transitionDuration = '2s'; orb.style.transform = 'scale(.78)'; return; }
  if (!BR.running) { $('#brTitle').textContent = BR.elapsed ? 'Paused' : 'Ready to begin?'; $('#brPh').textContent = 'breathe'; $('#brCt').textContent = ''; if (!BR.elapsed) { orb.style.transitionDuration = '1s'; orb.style.transform = 'scale(.78)'; } return; }
  const ph = pat.phases[BR.phaseIdx];
  $('#brTitle').textContent = BR.paused ? 'Paused' : ph[0];
  $('#brPh').textContent = ph[0].toLowerCase(); $('#brCt').textContent = Math.ceil(BR.phaseLeft);
}
function startPhase() {
  const ph = PATTERNS[S.moment.pat].phases[BR.phaseIdx];
  BR.phaseLeft = ph[1];
  const orb = $('#orb'); if (orb) { orb.style.transitionDuration = ph[1] + 's'; orb.style.transform = `scale(${ph[2]})`; }
  if (ph[0] !== 'Hold') chime('soft');
}
function tickBreath() {
  const now = performance.now(); const dt = (now - BR.last) / 1000; BR.last = now;
  if (BR.paused) return;
  BR.elapsed += dt; BR.phaseLeft -= dt;
  if (BR.elapsed >= S.moment.dur * 60) { finishBreath(); return; }
  if (BR.phaseLeft <= 0) { BR.phaseIdx = (BR.phaseIdx + 1) % PATTERNS[S.moment.pat].phases.length; startPhase(); }
  paintBreath();
}
function toggleBreath() {
  if (BR.finished) resetBreath();
  if (!BR.running) {
    BR.running = true; BR.paused = false; BR.phaseIdx = 0; BR.last = performance.now(); startPhase();
    BR.timer = setInterval(tickBreath, 200);
    try { navigator.wakeLock?.request('screen').then(l => BR.lock = l).catch(() => {}); } catch (e) {}
  } else if (BR.paused) { BR.paused = false; BR.last = performance.now(); startPhase(); }
  else { BR.paused = true; const orb = $('#orb'); if (orb) { const cs = getComputedStyle(orb).transform; orb.style.transitionDuration = '0s'; orb.style.transform = cs; } }
  paintBreath();
}
function finishBreath() {
  stopBreath(); BR.finished = true; BR.elapsed = S.moment.dur * 60;
  const l = dayLog(); l.m = (l.m || 0) + S.moment.dur; addXP(XP.moment); save();
  paintBreath(); celebrate('Moment complete', `${S.moment.dur} calm minute${S.moment.dur > 1 ? 's' : ''} for you. That counts toward your rhythm.`, () => setTimeout(moodAfterMoment, 250));
}
function stopBreath(silent) {
  clearInterval(BR.timer); BR.timer = null; BR.running = false; BR.paused = false;
  try { BR.lock?.release(); } catch (e) {} BR.lock = null;
  if (silent) { BR.elapsed = 0; BR.finished = false; }
}
function resetBreath() { stopBreath(); BR.elapsed = 0; BR.finished = false; BR.phaseIdx = 0; paintBreath(); }

/* ---------- Terra AI ---------- */
let aiBusy = false, aiCtl = null;
function viewTerra() {
  const p = plan();
  const head = `<button class="back-btn" type="button" data-act="tab" data-k="today">${IC.back}<span>Today</span></button><section class="hero"><div><span class="eyebrow">Terra AI</span><h1 class="h1">Think out loud</h1><p class="sub">Tell me about your day. We'll shape it together.</p></div>${CH.lean()}</section>`;
  if (!p.ai) {
    return head + `<section class="card ai-intro"><div class="locked"><span class="plan-badge pro">Pro</span><h2 class="h2">Let Terra build routines with you</h2><p class="sub">Tell Terra about your day in your own words. It creates tiny steps and reminders that fit you.</p><button class="btn primary" type="button" data-act="paywall">See plans</button></div></section>
      <div class="suggest" aria-hidden="true" style="opacity:.5">${suggestions(true)}</div>`;
  }
  if (!aiReady()) {
    return head + `<section class="card ai-intro"><div class="stack"><h2 class="h2">Terra AI isn't connected yet</h2><p class="sub">It wakes up as soon as Terra's server is online. Your routines, reminders and Moments work without it.</p></div></section>`;
  }
  const msgs = S.chat.map(m => `<div class="msg ${m.role === 'user' ? 'user' : 'ai'}">${esc(m.content)}${m.added ? `<span class="added">${esc(m.added)}</span>` : ''}</div>`).join('');
  return head + (S.chat.length ? '' : `<section class="card ai-intro"><div><h2 class="h2" style="font-size:19px">Let's take it slow</h2><p class="sub" style="margin-top:6px">Try saying: "Remember that my mornings are busy."</p></div></section>
      <div><p class="eyebrow" style="color:var(--muted);margin-bottom:10px">Try these</p><div class="suggest">${suggestions(false)}</div></div>`)
    + `<div class="msgs" id="msgs">${msgs}${aiBusy ? `<div class="msg ai thinking" id="aiLive"><span class="typing"><i></i><i></i><i></i></span></div>` : ''}</div>
      <p class="scope">Terra helps with routines, reminders and calm. ${p.mem >= 40 ? 'Extended memory is on.' : 'Short memory.'}</p>
      ${S.chat.length ? '<button class="skip" type="button" data-act="clearChat">Start a new conversation</button>' : ''}`;
}
function suggestions(disabled) {
  const g = S.profile?.own?.goal, fi = LANG === 'fi';
  const s = [g ? ['sunrise', fi ? 'Rutiini omaan tavoitteeseesi' : 'A routine for your own goal', fi ? `Tee minulle rutiini, joka auttaa tavoitteessani: ${g}` : `Make me a routine that helps with my goal: ${g}`] : ['sunrise', 'Create a morning routine', 'Help me create a calm, simple morning routine.'], ['bell', 'Add a reminder', 'Add a reminder to drink water every morning at 10.'], ['wind', 'Help me calm down', 'I feel overwhelmed right now. Help me calm down.']];
  return s.map(([ic, l, q]) => `<button type="button" ${disabled ? 'disabled tabindex="-1"' : `data-act="aiAsk" data-q="${esc(q)}"`}>${IC[ic]}<span>${l}</span>${IC.arrow}</button>`).join('');
}
function aiContext() {
  const r = S.routines.map(r => { const st = routineStats(r); return `- ${r.name} (${r.slot}, ${r.anchor || 'no anchor'}): ${r.steps.map(s => s.text + (stepDone(s.id) ? ' [done today]' : '')).join('; ')}${st.days ? ` [last ${st.days} days: ${Math.round(st.ratio * 100)}% of steps done${st.at ? ', usually around ' + st.at : ''}]` : ''}`; }).join('\n') || '(none)';
  const rm = S.reminders.map(x => `- ${x.time} ${x.text}`).join('\n') || '(none)';
  const pf = S.profile;
  return `Name: ${S.name || '(not given)'}\nLocal time: ${new Date().toLocaleString('en-GB', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}\nPlan: ${plan().name} (routine limit: ${plan().routines === Infinity ? 'none' : plan().routines})\nCheck-in: hardest = ${pf.struggles.join(', ') || '?'}; day starts = ${pf.dayStart || '?'}; bedtime = ${pf.windDown || '?'}; reminders = ${pf.nudges || '?'}; wants = ${pf.goals.join(', ') || '?'}; energy for new habits = ${pf.energy || '?'}${pf.own?.struggle ? `\nIn their own words, what trips them up: "${pf.own.struggle}"` : ''}${pf.own?.goal ? `\nIn their own words, what they want: "${pf.own.goal}"` : ''}${pf.train ? `\nTraining: likes ${pf.train.kind.join(', ') || '?'}; ${pf.train.freq || '?'}; best time ${pf.train.when || '?'}; weekly workout goal ${S.wGoal || 3}` : ''}\nRoutines:\n${r}\nReminders:\n${rm}${healthSummary()}`;
}
const AI_RULES_T = () => `You are Terra, the calm companion inside the Terra app. Terra helps people who find routines and everyday structure hard (for example people with ADHD or ADD) build tiny habits, based on research on how habits form.
Voice: warm, calm, concrete and short (1 to 4 short sentences). No guilt, no lectures, no lists longer than 4 items, at most one question. Plain text only, no markdown.
Language: reply in the language the person writes in. The app is set to ${LANG_NAME()}, so use that if unsure.
Scope: daily routines, reminders, habits, workouts and movement, focus, rest and calming down. For anything else, kindly say you can only help with everyday routines and calm.
You are not a doctor or therapist: no diagnoses and no medication advice. If someone mentions wanting to hurt themselves or being in danger, respond with care and urge them to contact emergency services (112 in Finland and the EU) or someone they trust right away.
When you create or suggest routines and reminders, they must really move the person toward their goal: turn the goal into the real action (more muscle = a strength workout in the day or evening, with the workout itself as a step and protein after; better fitness = cardio sessions; better sleep = a fixed wind-down). Getting-started steps make it easy to begin, but the main step is the real thing. Base them on the person's check-in answers above, and above all on what they wrote in their own words: name which of their goals each one serves. If you need one more detail to make it fit (for example what time works), ask that one question first. If the person tells you they worked out, log it with log_workout. When the person wants a routine or reminder, actually create it with the tools (do not only describe it). Steps must be real tasks that move the goals the person named, and never filler: do not suggest breathing, drinking water, opening curtains or stretching unless they asked for it or it is the point of the routine. Keep steps specific and doable, 2 to 5 steps, and link the routine to something they already do (anchor, like "After I brush my teeth"). Add at most 3 reminders for a new person, and only ones they asked for. After a tool runs, confirm briefly what you added.
For calming down: guide one slow breath at a time and suggest the Moment tab.
If a routine's recent completion is low (under about 40%), kindly ask once whether it feels too complex or badly timed, and offer to make it smaller or move it. Never blame, never mention numbers as a judgement.`;
async function askAI(text) {
  text = String(text || '').trim(); if (!text || aiBusy || !aiReady()) return;
  S.chat.push({ role: 'user', content: text }); aiBusy = true; save(); render();
  const mem = plan().mem;
  const hist = S.chat.slice(-mem).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
  while (hist.length && hist[0].role !== 'user') hist.shift();
  const input = [{ role: 'user', content: AI_RULES_T() + '\n\nCurrent app data:\n' + aiContext() + '\n\nThe conversation follows.' }, ...hist];
  const added = [];
  const tools = [
    { name: 'add_reminder', description: 'Adds a daily reminder to the app. Returns the saved reminder. Add one emoji that fits the reminder, for example a glass of water for drinking water or a walking person for a walk.', inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'Short reminder text, under 60 characters' }, time: { type: 'string', description: '24h time HH:MM' }, emoji: { type: 'string', description: 'One emoji that fits the reminder. Optional.' } }, required: ['text', 'time'] },
      execute: (a) => { const t = /^\d{1,2}:\d{2}$/.test(String(a.time)) ? String(a.time).padStart(5, '0') : '09:00'; const e = String(a.emoji || '').trim().slice(0, 8); const r = { id: uid(), text: String(a.text || '').slice(0, 60) || 'Reminder', time: t, ...(e ? { emoji: e } : {}) }; S.reminders.push(r); save(); added.push(`Added reminder: ${r.text} at ${r.time}`); return r; } },
    { name: 'add_routine', description: 'Creates a routine of tiny steps in the app. Fails if the plan routine limit is reached. Returns the saved routine.', inputSchema: { type: 'object', properties: { name: { type: 'string' }, slot: { type: 'string', enum: ['morning', 'day', 'evening'] }, anchor: { type: 'string', description: 'Existing habit it follows, e.g. "After I brush my teeth"' }, steps: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, mins: { type: 'number' } }, required: ['text'] } } }, required: ['name', 'slot', 'steps'] },
      execute: (a) => { if (S.routines.length >= plan().routines) throw new Error('Routine limit reached on the Free plan.'); const r = addRoutine(a); if (!r) throw new Error('A routine needs at least one step.'); added.push(`Added routine: ${r.name} (${r.steps.length} steps)`); return { name: r.name, steps: r.steps.map(s => s.text) }; } },
    { name: 'log_workout', description: 'Logs a workout the person did today in the Track tab. Returns the saved workout.', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: WTYPES.map(w => w[0]) }, mins: { type: 'number' }, effort: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] } }, required: ['type', 'mins'] },
      execute: (a) => { const w = { id: uid(), d: dayKey(), type: WTYPES.some(x => x[0] === a.type) ? a.type : 'Other', mins: clamp(Math.round(Number(a.mins) || 30), 1, 600), effort: ['Easy', 'Medium', 'Hard'].includes(a.effort) ? a.effort : 'Medium' }; (S.workouts ||= []).push(w); addXP(XP.workout); save(); added.push(`Logged workout: ${w.type}, ${w.mins} min`); return w; } },
  ];
  aiCtl = new AbortController();
  try {
    const opts = { modelTier: 'quick', signal: aiCtl.signal, onText: ({ text }) => { const el = $('#aiLive'); if (el) { el.classList.remove('thinking'); el.textContent = text; } } };
    opts.tools = tools;
    const res = await aiRequest(input, opts);
    S.chat.push({ role: 'assistant', content: res.text.trim(), added: added.join('\n') || undefined });
  } catch (e) {
    const msg = { rate_limited: 'Terra needs a short pause. Try again in a little while.', refused: 'Let\'s keep to routines, reminders and calm. What would help your day right now?', not_granted: 'Terra AI isn\'t allowed in this view yet. You can allow it from the page permissions.', sampling_disabled: 'Claude isn\'t available for this account, so Terra AI can\'t reply here.', session_expired: 'Please sign in again to keep chatting.', cancelled: '' }[e?.code];
    if (msg !== '') S.chat.push({ role: 'assistant', content: (e?.code !== 'refused' && e?.text) ? e.text + '\n\n(The reply was interrupted.)' : (msg || 'Something interrupted the reply. Try sending it again.'), added: added.join('\n') || undefined });
  }
  aiBusy = false; aiCtl = null; save(); if (S.tab === 'terra') render();
  if (added.length) toast(added[added.length - 1]);
}

/* ---------- Settings ---------- */
let promoMsg = null, confirmReset = false;
function viewPrefs() {
  const p = plan(); const pf = S.profile;
  const nx = nextStep(); const { total, done } = totals(); const pct = total ? Math.round(done / total * 100) : 0;
  const tog = (k, label, sub) => `<div class="set-row"><div><b>${label}</b><small>${sub}</small></div><button class="toggle" type="button" role="switch" aria-checked="${!!S.settings[k]}" aria-label="${label}" data-act="setTog" data-k="${k}"></button></div>`;
  return `<section class="hero"><div><span class="eyebrow">You</span><h1 class="h1">Settings</h1></div></section>
  <section class="card set-group"><p class="eyebrow">Plan</p>
    <div class="set-row"><div><b>${trialActive() ? 'Ultimate free trial' : 'Current plan'}</b><small>${trialActive() ? `${trialDaysLeft()} day${trialDaysLeft() === 1 ? '' : 's'} left, ends ${new Date(S.trial.end).toLocaleDateString(LOC(), { day: 'numeric', month: 'long' })}. Then ${ULTIMATE_PRICE}/month unless you cancel.` : planKey() === 'free' ? '3 routines, reminders, widget and 1-minute breathing' : planKey() === 'pro' ? (aiReady() ? 'Unlimited routines, Terra AI and 3-minute Moments' : 'Unlimited routines and 3-minute Moments') : (aiReady() ? 'Everything, with extended AI memory and longer Moments' : 'Everything, with longer Moments and box breathing')}</small></div><span class="plan-badge ${planKey()}">${trialActive() ? 'Trial' : p.name}</span></div>
    <div class="set-row"><div><b>Prices</b><small>Pro from ${money(PRICES.pro.y / 12)}/month · Ultimate from ${money(PRICES.ultimate.y / 12)}/month, billed yearly</small></div></div>
    <div class="set-row"><button class="btn block" type="button" data-act="paywall">${IC.gift} See plans</button></div>
  </section>
  <section class="card set-group"><p class="eyebrow">Profile</p>
    <div class="field"><label for="nameIn">Your name</label><input type="text" id="nameIn" value="${esc(S.name)}" maxlength="30" data-input="name" placeholder="What should Terra call you?"></div>
    <div class="set-row"><div><b>Your answers</b><small>Change what Terra knows about your day</small></div><button class="btn small" type="button" data-act="retake">${IC.reset} Retake</button></div>
  </section>
  <section class="card set-group"><p class="eyebrow">Experience</p>
    <div class="set-row"><div><b>Notifications</b><small>${S.settings.notify === 'on' ? 'On. Gentle nudges for your reminders and next steps' : 'Off. Turn on to get reminders when they are due'}</small></div>${S.settings.notify === 'on' ? '<button class="btn small ghost" type="button" data-act="notifyOff">Turn off</button>' : '<button class="btn small primary" type="button" data-act="notifyOn">Turn on</button>'}</div>
    ${tog('banners', 'Reminder banners', 'Shows a gentle banner when a reminder is due while Terra is open')}
    <div class="set-row"><div><b>Language</b><small>App language</small></div>${langSwitch()}</div>
    ${tog('sound', 'Soft sounds', 'Chimes for finished steps and breathing')}
    ${tog('calm', 'Still mode', 'Turns off animations for a quieter screen')}
    <div class="set-row"><div><b>App tour</b><small>A 30-second look at what everything does</small></div><button class="btn small" type="button" data-act="tour">Replay</button></div>
  </section>
  ${alarmSettings()}
  ${privacyCenter()}`;
}
function promoForm(id) {
  return `<form class="stack" data-form="promo" style="gap:8px"><label for="${id}" class="small" style="font-weight:600">${IC.gift.replace('<svg', '<svg width="16" height="16" style="vertical-align:-3px;margin-right:4px"')}Promo code</label>
    <div class="promo"><input type="text" id="${id}" name="code" placeholder="Enter code" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn primary" type="submit">Redeem</button></div>
    ${promoMsg ? `<p class="${promoMsg.ok ? 'ok' : 'err'}" role="status">${esc(promoMsg.text)}</p>` : ''}</form>`;
}
function redeem(code) {
  const c = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
  const pl = PROMO[c];
  if (!c) { promoMsg = { ok: false, text: 'Type a code first.' }; return false; }
  if (!pl) { promoMsg = { ok: false, text: 'That code doesn\'t match an active offer. Check the spelling and try again.' }; return false; }
  S.plan = pl; S.planSource = 'promo'; save();
  promoMsg = { ok: true, text: `${PLANS[pl].name} is unlocked.` };
  return pl;
}

/* ---------- Paywall ---------- */
let pwState = { billing: 'yearly', sel: 'pro', note: '', after: null };
function openPaywall(note, after) {
  pwState = { billing: pwState.billing, sel: (planKey() === 'ultimate' || !trialUsed()) ? 'ultimate' : 'pro', note: note || '', after: after || null };
  promoMsg = null; renderPaywall();
}
function renderPaywall() {
  let o = $('#paywall'); if (!o) { o = document.createElement('div'); o.className = 'overlay'; o.id = 'paywall'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Plans'); document.body.appendChild(o); }
  const feat = (arr) => `<ul>${arr.map(f => `<li>${IC.check}<span>${f}</span></li>`).join('')}</ul>`;
  const cur = planKey(); const canTrial = !trialUsed() && S.plan !== 'ultimate';
  o.innerHTML = `<div class="ambient"><i></i><i></i><i></i></div><div class="inner">
    <div class="ob-top"><button class="btn small" type="button" data-act="pwClose">Close</button><b>Plans</b><span style="width:60px"></span></div>
    
    <div style="text-align:center" class="stack"><h1 class="h1" style="font-size:34px">Choose your rhythm</h1><p class="sub">${esc(pwState.note || 'Start free. Upgrade when you want more.')}</p></div>
    <div class="seg"><button type="button" data-act="bill" data-k="monthly" class="${pwState.billing === 'monthly' ? 'on' : ''}">Monthly</button><button type="button" data-act="bill" data-k="yearly" class="${pwState.billing === 'yearly' ? 'on' : ''}">Yearly<small>Save up to ${Math.max(saving('pro'), saving('ultimate'))}%</small></button></div>
    <button class="plan ${pwState.sel === 'pro' ? 'sel' : ''}" type="button" data-act="pwSel" data-k="pro"><div class="row between"><h3>Pro</h3><span class="price">${cur === 'pro' ? 'Your plan' : priceLabel('pro')}</span></div>${cur === 'pro' ? '' : priceSub('pro')}${feat(aiReady() ? ['Everything in Free', 'Unlimited routines', 'Terra AI with short memory', '3-minute Moments'] : ['Everything in Free', 'Unlimited routines', '3-minute Moments'])}</button>
    <button class="plan ultimate ${pwState.sel === 'ultimate' ? 'sel' : ''}" type="button" data-act="pwSel" data-k="ultimate"><div class="row between"><h3>Ultimate</h3>${canTrial ? '<span class="plan-badge ultimate">14 days free</span>' : `<span class="price">${trialActive() ? `Trial · ${trialDaysLeft()} days left` : cur === 'ultimate' ? 'Your plan' : priceLabel('ultimate')}</span>`}</div>${canTrial ? `<p class="price" style="margin-top:-4px">Free for ${TRIAL_DAYS} days, then ${thenPrice()}</p>` : (cur === 'ultimate' || trialActive() ? '' : priceSub('ultimate'))}${feat(aiReady() ? ['Everything in Pro', 'Extended AI memory and conversation context', '5 and 10-minute Moments', 'Box breathing'] : ['Everything in Pro', '5 and 10-minute Moments', 'Box breathing'])}</button>
    <details class="promo-mini" ${promoMsg ? 'open' : ''}><summary>Have a promo code?</summary>${promoForm('promoP')}</details>
    <div class="free-note">${IC.check}<span>Free stays free: 3 routines, reminders, widget and short breathing Moments.</span></div>
    <div class="stack" style="gap:10px">
      ${canTrial
        ? `<button class="btn primary block" type="button" data-act="startTrial" style="padding:16px">Start ${TRIAL_DAYS}-day free trial</button>
           <p class="small" style="text-align:center">Ultimate is free for ${TRIAL_DAYS} days, then ${thenPrice()}. Cancel anytime before the trial ends and you won't be charged.</p>`
        : `<button class="btn primary block" type="button" disabled style="padding:16px">${trialActive() ? `Ultimate trial active · ${trialDaysLeft()} days left` : 'Purchases open with the App Store release'}</button>`}
      <button class="btn light block" type="button" data-act="pwClose" style="padding:16px">${trialActive() ? 'Continue with your trial' : cur === 'free' ? 'Continue with Free' : 'Continue with ' + PLANS[cur].name}</button>
      <p class="small" style="text-align:center">Subscriptions will be billed and managed through your Apple ID.</p>
    </div></div>`;
}
function priceLabel(k) { return pwState.billing === 'yearly' ? `${money(PRICES[k].y)}/year` : `${money(PRICES[k].m)}/month`; }
function priceSub(k) { return pwState.billing === 'yearly' ? `<p class="price-sub"><s>${money(PRICES[k].m * 12)}</s> ${money(PRICES[k].y / 12)}/month · <b>Save ${saving(k)}%</b> vs. monthly</p>` : `<p class="price-sub">Or ${money(PRICES[k].y)}/year and save ${saving(k)}%</p>`; }
function thenPrice() { return pwState.billing === 'yearly' ? `${money(PRICES.ultimate.y)}/year` : `${ULTIMATE_PRICE}/month`; }
function closePaywall() { $('#paywall')?.remove(); const a = pwState.after; pwState.after = null; render(); a && a(); }

/* ---------- Onboarding ---------- */
const OBQ = {
  /* Four quick answers, then the person's own words for anything else */
  struggles: { q: 'What tends to trip you up?', sub: 'Pick everything that sounds like you. No judging.', multi: true, opts: [
    ['Getting started', 'Even small things are hard to begin'], ['Remembering things', 'Things slip my mind'], ['Keeping it going', 'I start strong, then it fades'], ['Losing track of time', 'Time just disappears']] },
  dayStart: { q: 'What time do you usually get up?', sub: 'Pick the time closest to a normal morning. Your first steps start from here.', multi: false, opts: [['Before 07:00'], ['07:00 to 09:00'], ['09:00 to 11:00'], ['After 11:00, or it varies']] },
  windDown: { q: 'And when do you usually go to bed?', sub: 'Terra reminds you to wind down about 45 minutes before.', multi: false, opts: [['Before 22:00'], ['22:00 to 23:30'], ['After 23:30'], ['It varies a lot']] },
  /* Four quick answers; anything else (more muscle, a tidier home, eating regularly...) goes in their own words */
  goals: { q: 'What would make the biggest difference?', sub: 'Pick up to three, or write your own below.', multi: true, max: 3, opts: [['Calmer mornings'], ['Better sleep'], ['Less stress'], ['Better fitness']] },
  nudges: { q: 'How much should Terra remind you?', sub: 'Reminders help most when there are just enough of them.', multi: false, opts: [['A few gentle nudges', 'About two a day'], ['Keep me on track', 'Up to four a day, at the moments that matter'], ['Only what I set myself', 'Terra won\'t add any reminders for you']] },
  trainKind: { q: 'What kind of training suits you?', sub: 'Pick what you enjoy, or what you would like to try.', multi: true, opts: [['Walking'], ['Gym'], ['Running'], ['Home workouts'], ['Sports or classes'], ['Yoga or stretching']] },
  trainFreq: { q: 'How often do you want to train?', sub: 'Terra sets your weekly goal from this. Start with what feels doable.', multi: false, opts: [['1–2 times a week'], ['3 times a week'], ['4 or more times a week']] },
  trainWhen: { q: 'When does training fit your day best?', sub: 'Your workout routine and its reminder go there.', multi: false, opts: [['Morning'], ['After work or school'], ['Evening']] },
  /* When the day is already spoken for: mornings before work stay short, and the daytime routine fits around it */
  work: { q: 'When does your work or school day start?', sub: 'Terra keeps mornings short enough to fit before it.', multi: false, opts: [['Before 08:00'], ['08:00 to 09:00'], ['09:00 to 10:00'], ['Later, or it varies'], ['I don’t work or study right now']] },
  /* Things you already do every day: new steps hook onto them, which is how habits stick */
  anchors: { q: 'What do you already do every day?', sub: 'New steps go right after these, so you don’t have to remember them. Pick up to three.', multi: true, max: 3, opts: [['Morning coffee or tea'], ['Breakfast'], ['A shower'], ['Brushing my teeth'], ['The commute'], ['Lunch'], ['Dinner']] },
  energy: { q: 'How big should we start?', sub: 'Smaller is easier to keep. You can always add more later.', multi: false, opts: [['Tiny', 'Two steps per routine'], ['Small', 'Three steps per routine'], ['A bit more', 'Up to four steps per routine']] },
};
const OB_ICONS = { 'Getting started': '🚀', 'Remembering things': '🧠', 'Losing track of time': '⏳', 'Too much at once': '🌀', 'Keeping it going': '🔁', 'Forgetting to eat or drink': '🥪', 'Evenings and sleep': '🌙',
  'Before 07:00': '🌅', '07:00 to 09:00': '☀️', '09:00 to 11:00': '🌤️', 'After 11:00, or it varies': '🌙',
  'Before 22:00': '🌆', '22:00 to 23:30': '🌙', 'After 23:30': '🦉', 'It varies a lot': '🔀',
  'Calmer mornings': '🌅', 'Eating and drinking regularly': '🥗', 'Less stress': '🫧', 'Cleaner home': '🧺', 'Better sleep': '😴', 'Focus for work or study': '💡', 'Moving my body': '🏃', 'Better fitness': '🏃', 'Building muscle': '💪',
  'A few gentle nudges': '🔔', 'Keep me on track': '🧭', 'Only what I set myself': '✋',
  'Walking': '🚶', 'Gym': '🏋️', 'Running': '🏃', 'Home workouts': '🏠', 'Sports or classes': '⚽', 'Yoga or stretching': '🧘', '1–2 times a week': '1️⃣', '3 times a week': '3️⃣', '4 or more times a week': '🔥', 'Morning': '🌅', 'After work or school': '🏙️', 'Evening': '🌙',
  'Before 08:00': '⏰', '08:00 to 09:00': '🏢', '09:00 to 10:00': '☕', 'Later, or it varies': '🔀', 'I don’t work or study right now': '🏡',
  'Morning coffee or tea': '☕', 'Breakfast': '🥣', 'A shower': '🚿', 'Brushing my teeth': '🪥', 'The commute': '🚌', 'Lunch': '🥪', 'Dinner': '🍽️',
  'Tiny': '🌱', 'Small': '🌿', 'A bit more': '🌳', 'Just a little': '🌱', 'Some': '🌿', 'Quite a lot': '🌳' };
const QSTEPS = ['name', 'struggles', 'day', 'work', 'anchors', 'goals', 'trainKind', 'trainFreq', 'trainWhen', 'energy', 'why'];
const isTrainStep = st => /^train/.test(st);
const RUSH_LINES = ['Speed run? 🏃 Remember Mia and her 06:30 run alarm at her desk.', 'Whoa, quick fingers. Terra can only fit your day if it knows it.', 'That was fast! Take a breath, this one shapes your mornings.', 'Still speedrunning? Your plan will be as random as these answers.'];
const TRAIN_GOALS = ['Better fitness', 'Building muscle', 'Moving my body'];
/* The training questions only appear when training was picked (or written in their own words). */
function wantsTraining(a) { return a.goals.some(g => TRAIN_GOALS.includes(g)) || ownGoals(a).some(g => TRAIN_GOALS.includes(g)); }
const OB_STEPS = ['welcome', 'intro', 'demoBad', 'demoGood', ...QSTEPS, 'building', 'preview'];
const OB_EMPTY = () => ({ name: '', struggles: [], dayStart: '', windDown: '', goals: [], nudges: '', energy: '', own_struggles: '', own_goals: '', trainKind: [], trainFreq: '', trainWhen: '', why: '', work: '', anchors: [] });
let OB = { i: 0, a: OB_EMPTY(), plan: null, err: '', more: {}, rush: 0, rushMsg: '', t0: 0 };
function dayPart(fresh, grp) {
  const phase = OB.a.dayStart && !OB.dayEdit && !OB.dayHold ? 'bed' : 'wake';
  const anim = fresh || OB.dayShown !== phase; OB.dayShown = phase;
  if (phase === 'wake') return grp('dayStart', 'I usually get up', anim);
  return `<button class="day-chip ${anim ? 'day-in' : ''}" type="button" data-act="dayEdit"><span class="dc-l">I usually get up</span><b>${esc(OB.a.dayStart)}</b><span class="dc-e" aria-hidden="true">${IC.edit || '✎'}</span><span class="sr">Change</span></button>` + grp('windDown', 'I usually go to bed', anim);
}
/* A free-text answer under the struggles and goals questions: the person's own words, kept with the plan. */
function ownField(step) {
  const k = 'own_' + step;
  return `<label class="own-field" style="display:grid;gap:6px;margin-top:14px"><span class="small">Something else, in your own words (optional)</span><input type="text" id="obOwn-${step}" maxlength="80" value="${esc(OB.a[k] || '')}" data-input="obOwn" data-k="${step}" placeholder="${step === 'goals' ? 'E.g. I want more muscle' : 'E.g. I forget to take my meds'}" autocomplete="off"></label>`;
}
function renderOnboarding() {
  let o = $('#ob'); if (!o) { o = document.createElement('div'); o.className = 'overlay'; o.id = 'ob'; document.body.appendChild(o); }
  for (const [k, v] of Object.entries(OB_EMPTY())) if (OB.a[k] === undefined) OB.a[k] = v; // answers saved by an older version
  const step = OB_STEPS[OB.i]; const fresh = OB.shown !== step; OB.shown = step; const qVis = QSTEPS.filter(x => !isTrainStep(x) || wantsTraining(OB.a)); const qIdx = qVis.indexOf(step); const qN = qVis.length, bIdx = OB_STEPS.indexOf('building');
  const top = step === 'welcome' ? `<div class="ob-top"><span></span><span></span>${langSwitch('mini')}</div>` : `<div class="ob-top">${OB.i > 0 && OB.i < bIdx ? `<button class="icon-btn" type="button" data-act="obBack" aria-label="Back">${IC.back}</button>` : '<span style="width:36px"></span>'}
    <span></span>
    ${OB.i > 1 && OB.i < bIdx && step !== 'name' && !step.startsWith('demo') && step !== 'intro' ? '<button class="skip" type="button" data-act="obSkip">Skip questions</button>' : '<span style="width:36px"></span>'}</div>`;
  let body = '', foot = '';
  if (step === 'welcome') {
    body = `<div class="ob-art">${CH.stand()}</div><div class="ob-body"><span class="eyebrow">Welcome to Terra</span><h1 class="h1">Hi, I'm Terra.</h1><p class="lead">I help you build small routines that stick, one tiny step at a time. No guilt, no pressure.</p>
      <ul class="ob-notes"><li>${IC.shield}<span>Your answers stay private. Delete them anytime.</span></li><li>${IC.heart}<span>Support for daily life, not medical care.</span></li></ul></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext">Let's start</button>`;
  } else if (step === 'intro') {
    body = `<div class="ob-art intro-art">${CH3.you()}</div><div class="ob-body ob-intro ${fresh ? 'go' : ''}"><span class="eyebrow">Before the questions</span><h1 class="h1">Let’s get to know your everyday life a little.</h1>
      <p class="lead">Terra builds your routines from your real day: when you wake up, when work starts, what you already do. First, two quick examples of why your answers matter.</p></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext">Show me</button>`;
  } else if (step === 'demoBad') {
    body = `<div class="ob-body demo bad-demo ${fresh ? 'go' : ''}"><span class="eyebrow">How not to do it</span><h1 class="h1" style="font-size:30px">Meet Mia. She answered in 9 seconds.</h1>
      <div class="demo-taps" aria-hidden="true"><span>Before 07:00</span><span>Better fitness</span><span>A bit more</span><span>Skip</span></div>
      <div class="demo-scene"><div class="demo-clock tnum">07:50</div><div class="demo-art">${CH3.run()}</div>
        <div class="demo-phone"><div class="demo-notif n1"><b>TERRA · 06:30</b>🏃 Time for your 45-minute morning run!</div><div class="demo-notif n2"><b>TERRA · 07:50</b>Still time for that run? Go go go!</div></div>
        <div class="demo-stamp">Doesn’t fit my day</div></div>
      <p class="lead">At 07:50 Mia is already at her desk. The plan never had a chance, because Terra never learned her day.</p></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext">Show me the good way</button>`;
  } else if (step === 'demoGood') {
    body = `<div class="ob-body demo good-demo ${fresh ? 'go' : ''}"><span class="eyebrow">How to do it</span><h1 class="h1" style="font-size:30px">Same Mia. This time, three calm minutes.</h1>
      <p class="demo-said">She told Terra work starts at 08:00, she always has coffee at 07:15, and walks help her focus.</p>
      <div class="demo-scene"><div class="demo-clock tnum">12:30</div><div class="demo-art">${CH3.mindful()}</div>
        <div class="demo-phone"><div class="demo-notif n1"><b>TERRA · 07:15</b>☕ After your coffee: a glass of water and a 2-minute stretch</div><div class="demo-notif n2"><b>TERRA · 12:30</b>🚶 You said walking helps you focus. 10 minutes outside?</div></div>
        <div class="demo-stamp ok">Fits my day ✓</div></div>
      <p class="lead">That’s why Terra asks a few more questions. It takes about three minutes, and the plan is only as good as your answers.</p></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext">Let’s do it properly</button>`;
  } else if (step === 'name') {
    body = `<div class="ob-body q-body"><span class="q-num ${fresh ? 'enter' : ''}">${qIdx + 1}<small>/${qN}</small></span><h1 class="h1 ${fresh ? 'q-in' : ''}" style="font-size:32px">What should I call you?</h1><p class="lead">Just a first name or nickname is fine. Terra uses it to greet you.</p>
      <input type="text" id="obName" value="${esc(OB.a.name)}" maxlength="30" placeholder="Your name" autocomplete="given-name" data-input="obName" required aria-required="true"></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext" ${OB.a.name.trim() ? '' : 'disabled'}>Continue</button>`;
  } else if (step === 'day') {
    const grp = (k, label, anim) => { const q = OBQ[k], val = OB.a[k]; return `<div class="day-grp ${anim ? 'day-in' : ''}"><p class="day-l">${label}</p><div class="choices grid2 ${anim ? 'enter' : ''}">${q.opts.map(([l], idx) => { const on = val === l; return `<button class="choice ic compact ${OB.justPicked === l ? (on ? 'pop' : 'unpop') : ''}" style="--i:${idx}" type="button" aria-pressed="${on}" data-act="obPick" data-k="${k}" data-v="${esc(l)}"><span class="c-emo" aria-hidden="true">${OB_ICONS[l] || '✨'}</span><span>${esc(l)}</span></button>`; }).join('')}</div></div>`; };
    body = `<div class="ob-body q-body"><span class="q-num ${fresh ? 'enter' : ''}">${qIdx + 1}<small>/${qN}</small></span><h1 class="h1 ${fresh ? 'q-in' : ''}" style="font-size:32px">What does your day look like?</h1><p class="lead ${fresh ? 'q-in2' : ''}">Pick the closest times. Terra plans your steps and reminders around them.</p>
      ${dayPart(fresh, grp)}</div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext" ${OB.a.dayStart && OB.a.windDown ? '' : 'disabled'}>Continue</button>`;
  } else if (step === 'why') {
    body = `<div class="ob-body q-body"><span class="q-num ${fresh ? 'enter' : ''}">${qIdx + 1}<small>/${qN}</small></span><h1 class="h1 ${fresh ? 'q-in' : ''}" style="font-size:32px">Why are you starting?</h1><p class="lead ${fresh ? 'q-in2' : ''}">Write it in your own words. Terra reminds you of it on the days when it feels hard.</p>
      <textarea id="obWhy" class="why-input" maxlength="140" rows="3" data-input="obWhy" placeholder="E.g. I want my days to stop falling apart">${esc(OB.a.why || '')}</textarea>
      <div class="why-ideas ${fresh ? 'enter' : ''}">${WHY_IDEAS.map(t => `<button class="chip" type="button" data-act="obWhyIdea" data-k="${esc(t)}">${t}</button>`).join('')}</div></div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext">${(OB.a.why || '').trim() ? 'Continue' : 'Skip for now'}</button>`;
  } else if (step === 'train') {
    const grp = (k, i) => { const q = OBQ[k], val = OB.a[k]; return `<div class="day-grp ${fresh ? 'day-in' : ''}" style="--i:${i}"><p class="day-l">${q.q}</p><div class="choices grid2">${q.opts.map(([l], idx) => { const on = q.multi ? val.includes(l) : val === l; return `<button class="choice ic compact ${OB.justPicked === l ? (on ? 'pop' : 'unpop') : ''}" style="--i:${idx}" type="button" aria-pressed="${on}" data-act="obPick" data-k="${k}" data-v="${esc(l)}"><span class="c-emo" aria-hidden="true">${OB_ICONS[l] || '✨'}</span><span>${esc(l)}</span></button>`; }).join('')}</div></div>`; };
    body = `<div class="ob-body q-body"><span class="q-num ${fresh ? 'enter' : ''}">${qIdx + 1}<small>/${qN}</small></span><h1 class="h1 ${fresh ? 'q-in' : ''}" style="font-size:32px">Let's fit training into your week</h1><p class="lead ${fresh ? 'q-in2' : ''}">Terra builds your workout routine and weekly goal from these.</p><div class="train-art">${CH3.stretch()}</div>
      ${grp('trainKind', 0)}${grp('trainFreq', 1)}${grp('trainWhen', 2)}</div>`;
    foot = `<button class="btn primary block" type="button" data-act="obNext" ${OB.a.trainFreq && OB.a.trainWhen ? '' : 'disabled'}>Continue</button>`;
  } else if (OBQ[step]) {
    const q = OBQ[step]; const val = OB.a[step];
    body = `<div class="ob-body q-body"><span class="q-num ${fresh ? 'enter' : ''}">${qIdx + 1}<small>/${qN}</small></span><h1 class="h1 ${fresh ? 'q-in' : ''}" style="font-size:32px">${q.q}</h1><p class="lead ${fresh ? 'q-in2' : ''}">${q.sub}</p>
      <div class="choices ${fresh ? 'enter' : ''}">${(q.show && !OB.more[step] ? q.opts.filter((o, i) => i < q.show || (q.multi ? val.includes(o[0]) : val === o[0])) : q.opts).map(([l, s], idx) => { const on = q.multi ? val.includes(l) : val === l; const isNew = OB.moreJust === step && q.show && idx >= q.show; return `<button class="choice ic ${OB.justPicked === l ? (on ? 'pop' : 'unpop') : ''} ${isNew ? 'more-in' : ''}" style="--i:${isNew ? idx - q.show : idx}" type="button" aria-pressed="${on}" data-act="obPick" data-k="${step}" data-v="${esc(l)}"><span class="c-emo" aria-hidden="true">${OB_ICONS[l] || '✨'}</span><span>${esc(l)}${s ? `<small>${esc(s)}</small>` : ''}</span><span class="tick">${IC.check}</span></button>`; }).join('')}
      ${q.show && !OB.more[step] && q.opts.length > q.show ? `<button class="more-btn" type="button" data-act="obMore" data-k="${step}" aria-expanded="false"><span class="mb-ic" aria-hidden="true">${IC.plus}</span><span class="mb-t">Show ${q.opts.length - q.show} more</span><span class="mb-chev" aria-hidden="true">⌄</span></button>` : ''}</div></div>`;
    if (step === 'struggles' || step === 'goals') body += ownField(step);
    if (step === 'trainKind') body = body.replace('<div class="choices', `<div class="train-art">${CH3.stretch()}</div><div class="choices`);
    const ok = q.multi ? (val.length > 0 || !!(OB.a['own_' + step] || '').trim()) : !!val;
    foot = `<button class="btn primary block" type="button" data-act="obNext" ${ok ? '' : 'disabled'}>Continue</button>`;
  } else if (step === 'building') {
    body = `<div class="ob-art">${CH.hug()}</div><div class="ob-body building" style="text-align:left"><h1 class="h1" style="font-size:32px"><span class="b-pre">Got it, thank you.</span><span class="b-go">Building your rhythm…</span></h1><p class="lead">Take one slow breath while Terra puts it together.</p>
      <ul><li id="b1">${IC.check} Reading your answers</li><li id="b2">${IC.check} Making each step small enough</li><li id="b3">${IC.check} Linking steps to your day</li><li id="b4">${IC.check} Choosing gentle reminders</li></ul>
      ${OB.err ? `<p class="small">${esc(OB.err)}</p>` : ''}</div>`;
  } else if (step === 'preview') {
    const pl = OB.plan;
    body = `<div class="ob-body ${fresh ? 'pv-enter' : ''}"><span class="eyebrow">${pl.ai ? 'Made for you by Terra AI' : 'Made from your answers'}</span><h1 class="h1" style="font-size:32px">Here's your starting rhythm</h1><p class="lead">${esc(pl.note || 'Small on purpose. You can change everything later.')}</p>
      ${OB.rush >= 3 ? `<div class="ob-rush-card"><b>That was a speed run 🏃</b><p class="small">Several answers took under two seconds. If this plan doesn’t feel like your day, remember Mia and her 06:30 run.</p><button class="btn small" type="button" data-act="obAdjust" data-k="answers">Answer again, calmly</button></div>` : ''}
      ${pl.insights?.length ? `<div class="ob-insight"><p class="eyebrow">${IC.terra} What Terra noticed in your answers</p><ul>${pl.insights.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
      <div class="stack">${pl.routines.map((r, ri) => { const sl = SLOTS[r.slot] || SLOTS.day; return `<div class="preview-r" style="--rc:${sl.color};--i:${ri}"><div class="r-icon">${IC[sl.icon]}</div><div><b>${esc(r.name)}</b><p class="small">${esc(r.anchor)}</p>${r.why ? `<p class="small r-why">${esc(r.why)}</p>` : ''}<ul>${r.steps.map((s, si) => `<li style="--j:${si}">${esc(s.text)}</li>`).join('')}</ul></div></div>`; }).join('')}
      ${pl.reminders.length ? `<div class="preview-r" style="--rc:var(--coral);--i:${pl.routines.length}"><div class="r-icon">${IC.bell}</div><div><b>Reminders</b><ul>${pl.reminders.map((r, si) => `<li style="--j:${si}">${esc(r.time)} · ${esc(r.text)}</li>`).join('')}</ul></div></div>` : ''}</div></div>`;
    foot = OB.unsure
      ? `<div class="stack" style="gap:10px"><p class="small" style="font-weight:600;color:var(--fg)">That's okay. What would feel easier?</p>
          <button class="choice" type="button" data-act="obAdjust" data-k="smaller"><span>Make it even smaller<small>Two tiny steps per routine</small></span><span class="tick">${IC.check}</span></button>
          <button class="choice" type="button" data-act="obAdjust" data-k="one"><span>Start with just one routine<small>Add more when it feels easy</small></span><span class="tick">${IC.check}</span></button>
          <button class="choice" type="button" data-act="obAdjust" data-k="answers"><span>Change my answers<small>Go back to the questions</small></span><span class="tick">${IC.check}</span></button>
          <button class="skip" type="button" data-act="obUnsureClose">Keep this plan</button></div>`
      : `<button class="btn primary block ${fresh ? 'pv-btn' : ''}" type="button" data-act="obAccept">Start my rhythm</button><button class="btn block ${fresh ? 'pv-btn2' : ''}" type="button" data-act="obUnsure" style="padding:15px">I'm not sure</button>`;
  }
  if (OB.rushMsg && OB.rushAt === step) body = body.replace('<div class="ob-body', `<p class="ob-rush" role="status">${esc(tr(OB.rushMsg))}</p><div class="ob-body`);
  if (fresh) OB.t0 = Date.now();
  o.innerHTML = `<div class="ambient"><i></i><i></i><i></i></div><div class="inner">${top}${body}<div class="ob-foot">${foot}</div></div>`;
  if (fresh) o.scrollTop = 0;
  OB.justPicked = null; OB.moreJust = null;
  if (step === 'building') runBuilding();
}
function obGo(i) {
  const dir = i >= OB.i ? 1 : -1; i = clamp(i, 0, OB_STEPS.length - 1);
  while (isTrainStep(OB_STEPS[i]) && !wantsTraining(OB.a)) i = clamp(i + dir, 0, OB_STEPS.length - 1);
  OB.i = i; renderOnboarding();
}

/* local fallback personalization */
const TEMPLATES = {
  'Calmer mornings': { name: 'Gentle morning', slot: 'morning', anchor: 'After I turn off my alarm', steps: ['Get dressed and leave the bedroom', 'Eat something before checking your phone', 'Choose today\'s one most important task', 'Write the day\'s plan on a sticky note'] },
  'Eating and drinking regularly': { name: 'Fuel up', slot: 'day', anchor: 'When I sit down to work', steps: ['Fill your water bottle', 'Eat something small before noon', 'Drink a glass of water with lunch', 'Put a snack where you can see it'] },
  'Cleaner home': { name: 'Ten-minute reset', slot: 'evening', anchor: 'After dinner', steps: ['Put five things back where they belong', 'Clear one surface', 'Wash three dishes', 'Take out one bag of trash'] },
  'Better sleep': { name: 'Evening wind-down', slot: 'evening', anchor: 'After I brush my teeth', steps: ['Dim the lights', 'Put your phone to charge away from the bed', 'Write down one thing that went well', 'Lights off at the same time'] },
  'Focus for work or study': { name: 'Focus start', slot: 'day', anchor: 'When I open my laptop', steps: ['Write the one task on a sticky note', 'Put your phone in another room', 'Set a 10-minute timer and begin', 'Take a short break when it rings'] },
  'Moving my body': { name: 'Daily walk', slot: 'day', anchor: 'After lunch', steps: ['Put on your shoes', 'Walk for 20 minutes', 'Log it in Workouts'] },
  'Better fitness': { name: 'Fitness workout', slot: 'day', anchor: 'When I get home', steps: ['Put on your training clothes', 'Do 30 minutes of cardio', 'Log it in Workouts'] },
  'Building muscle': { name: 'Strength training', slot: 'day', anchor: 'When I get home', steps: ['Change into training clothes', 'Do a 30-minute strength workout', 'Eat a meal with protein', 'Log it in Workouts'] },
  'Less stress': { name: 'Lighter load', slot: 'day', anchor: 'After lunch', steps: ['Write down what is weighing on you', 'Pick the one task that matters most', 'Postpone or drop one small task', 'Step outside for five minutes'] },
};
const WORK_AT = { 'Before 08:00': '07:30', '08:00 to 09:00': '08:30', '09:00 to 10:00': '09:30' };
const START_AT = { 'Before 07:00': '06:45', '07:00 to 09:00': '08:00', '09:00 to 11:00': '09:30', 'After 11:00, or it varies': '10:30' };
const WIND_AT = { 'Before 22:00': '21:00', '22:00 to 23:30': '22:00', 'After 23:30': '23:00', 'It varies a lot': '21:45' };
const STEPS_N = { 'Tiny': 2, 'Just a little': 2, 'Small': 3, 'Some': 3, 'A bit more': 4, 'Quite a lot': 4 };
const NUDGES_N = { 'A few gentle nudges': 2, 'Keep me on track': 4, 'Only what I set myself': 0 };
/* a struggle hints at a routine when fewer than two goals were picked */
const STRUGGLE_GOAL = { 'Evenings and sleep': 'Better sleep', 'Getting started': 'Calmer mornings', 'Too much at once': 'Less stress', 'Forgetting to eat or drink': 'Eating and drinking regularly', 'Losing track of time': 'Focus for work or study', 'Keeping it going': 'Calmer mornings' };
function addMin(t, m) { const [h, mi] = t.split(':').map(Number); const v = clamp(h * 60 + mi + m, 0, 23 * 60 + 59); return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0'); }
/* Training: a workout routine built from the kind, time and frequency the person chose */
const TRAIN_STEPS = { 'Strength': ['Change into training clothes', 'Do a 30-minute strength workout', 'Log it in Workouts'], 'Fitness': ['Put on your training clothes', 'Do 30 minutes of cardio', 'Log it in Workouts'], 'Walking': ['Put on your shoes', 'Walk briskly for 20 minutes', 'Log it in Workouts'], 'Gym': ['Pack your gym bag', 'Go to the gym', 'Do your planned workout', 'Log it in Workouts'],
  'Running': ['Put on your running clothes', 'Warm up with a 5-minute walk', 'Run for 20 minutes', 'Log it in Workouts'], 'Home workouts': ['Lay out your mat', 'Do a 15-minute home workout', 'Log it in Workouts'],
  'Sports or classes': ['Check the time of your next session', 'Pack your things', 'Go to your session', 'Log it in Workouts'], 'Yoga or stretching': ['Lay out your mat', 'Do 15 minutes of yoga or stretching', 'Log it in Workouts'] };
const TRAIN_AT = { 'Morning': ['morning', 'After breakfast'], 'After work or school': ['day', 'When I get home'], 'Evening': ['evening', 'After dinner'] };
function trainRoutine(a, goal) {
  if (!wantsTraining(a)) return null;
  const muscle = goal === 'Building muscle' || (!goal && (a.goals.includes('Building muscle') || ownGoals(a).includes('Building muscle')));
  const kind = a.trainKind?.[0] || (muscle ? 'Strength' : goal === 'Moving my body' ? 'Walking' : 'Fitness');
  const [slot, anchor] = TRAIN_AT[a.trainWhen] || ['day', 'When I get home'];
  let steps = [...(TRAIN_STEPS[kind] || TRAIN_STEPS.Fitness)];
  if (muscle && !steps.some(x => /protein/i.test(x))) steps.splice(steps.length - 1, 0, 'Eat a meal with protein'); // muscle grows from training plus food
  return { name: muscle ? 'Strength training' : a.trainKind?.length ? 'Workout time' : goal === 'Moving my body' ? 'Daily walk' : 'Fitness workout', slot, anchor, steps: steps.slice(0, 5) };
}
const TRAIN_GOAL_N = { '1–2 times a week': 2, '3 times a week': 3, '4 or more times a week': 4 };
/* Without Terra AI, the person's own words still steer the plan: simple word hints pick the matching routines. */
const OWN_HINTS = [[/aamu|morning|herä|hera|wake|lääk|laak|meds|medic|pill/i, 'Calmer mornings'], [/uni|unta|nukk|sleep|väsy|vasy|tired|insomn/i, 'Better sleep'], [/syö|syo|syöm|ruoka|eat|food|meal|juo|drink|nälk/i, 'Eating and drinking regularly'],
  [/keskit|focus|työ|tyo|töi|toi|opisk|study|work|viivyt|procrast|aikaiseksi/i, 'Focus for work or study'], [/stress|ahdist|kuormit|overwhelm|anx|jaksa|uupu|burn/i, 'Less stress'], [/siivo|clean|koti|kodin|home|tidy|sotku|mess|pyykk|laundry|tiski|dishes/i, 'Cleaner home'],
  [/treen|sali|liiku|urheil|kunto|exercise|gym|workout|juoks|run\b|fitness/i, 'Better fitness'], [/lihas|muscle|voima|strength/i, 'Building muscle']];
const MEDS_RE = /lääk|laak|meds|medic|pill|vitamiin|vitamin|tablet/i;
function ownGoals(a) { const t = `${a.own_goals || ''} ${a.own_struggles || ''}`; return OWN_HINTS.filter(([re]) => re.test(t)).map(([, g]) => g); }
function localPlan(a) {
  const n = STEPS_N[a.energy] || 3;
  const own = ownGoals(a); const goals = [...new Set([...own, ...a.goals])];
  /* Struggles stand in only when no goal was given at all */
  const fromStruggle = {};
  if (!goals.length) for (const st of a.struggles) { const g = STRUGGLE_GOAL[st]; if (g && !goals.includes(g) && goals.length < 2) { goals.push(g); fromStruggle[g] = st; } }
  const fiW = LANG === 'fi';
  const ownFor = g => { const re = (OWN_HINTS.find(h => h[1] === g) || [])[0]; if (!re) return ''; return [a.own_goals, a.own_struggles].map(x => (x || '').trim()).find(x => x && re.test(x)) || ''; };
  const whyOf = g => { const ot = ownFor(g); return ot && !a.goals.includes(g) ? `"${ot.slice(0, 40)}"` : fromStruggle[g] ? (fiW ? tr(fromStruggle[g]).toLowerCase() : fromStruggle[g].toLowerCase()) : (fiW ? tr(g).toLowerCase() : g.toLowerCase()); };
  /* Always three clear routines: morning, day and evening. Each goal's steps go to the time of day where they belong. */
  const R = { morning: { name: 'Morning routine', slot: 'morning', anchor: 'After I turn off my alarm', steps: [], goals: [] },
    day: { name: 'Daytime routine', slot: 'day', anchor: 'After lunch', steps: [], goals: [] },
    evening: { name: 'Evening routine', slot: 'evening', anchor: 'After dinner', steps: [], goals: [] } };
  const add = (slot, steps, g, cap) => { const r = R[slot]; for (const t of steps.slice(0, cap)) if (!r.steps.includes(t)) r.steps.push(t); if (g && !r.goals.includes(g)) r.goals.push(g); };
  const medsTxt = [a.own_struggles, a.own_goals].map(x => (x || '').trim()).find(x => x && MEDS_RE.test(x));
  if (medsTxt) { add('morning', ['Take your medicine'], null, 1); R.morning.own = `"${medsTxt.slice(0, 40)}"`; }
  for (const g of goals.slice(0, 3)) {
    if (TRAIN_GOALS.includes(g)) { const t = trainRoutine(a, g) || TEMPLATES[g]; add(t.slot, t.steps, g, 5); R[t.slot].train = true; R[t.slot].anchor = t.anchor; continue; }
    const t = TEMPLATES[g]; if (!t) continue; add(t.slot, t.steps, g, n);
    if (g === 'Better sleep' && !R.evening.train) R.evening.anchor = 'After I brush my teeth';
  }
  const BASE = { morning: ['Get dressed and leave the bedroom', "Choose today's one most important task"],
    day: ["Start the day's most important task", 'Take a short break away from the screen'],
    evening: ['Lay out what you need for tomorrow', 'Put your phone to charge away from the bed'] };
  /* Hook new steps onto what the person already does, and keep mornings short when work starts soon after waking */
  const anc = a.anchors || [];
  const ANCH = { morning: [['Morning coffee or tea', 'After my morning coffee'], ['Breakfast', 'After breakfast'], ['A shower', 'After my shower'], ['Brushing my teeth', 'After I brush my teeth']], day: [['Lunch', 'After lunch'], ['The commute', 'When I get to work or school']], evening: [['Dinner', 'After dinner'], ['Brushing my teeth', 'After I brush my teeth']] };
  for (const k of ['morning', 'day', 'evening']) { if (R[k].train) continue; const hit = ANCH[k].find(([q]) => anc.includes(q) && (k !== 'evening' || q !== 'Brushing my teeth' || !anc.includes('Dinner'))); if (hit && !(k === 'morning' && hit[0] === 'Brushing my teeth' && anc.some(x => ['Morning coffee or tea', 'Breakfast', 'A shower'].includes(x)))) R[k].anchor = hit[1]; }
  const workAt = WORK_AT[a.work] || '';
  const tight = workAt && hmMin(workAt) - hmMin(START_AT[a.dayStart] || '08:00') < 90;
  const routines = ['morning', 'day', 'evening'].map(k => {
    const r = R[k]; if (k === 'morning' && tight && !r.train) r.steps = r.steps.slice(0, 2); for (const t of BASE[k]) if (r.steps.length < Math.min(n, 2) || (!r.goals.length && r.steps.length < n)) { if (!r.steps.includes(t)) r.steps.push(t); }
    const cap = r.train ? 6 : k === 'morning' && tight ? 2 : Math.max(n, 2) + (r.goals.length > 1 ? 1 : 0);
    const parts = [...(r.own ? [r.own] : []), ...r.goals.map(whyOf)];
    const uniq = [...new Set(parts)];
    const why = uniq.length ? (fiW ? 'Tavoitteeseesi: ' : 'For: ') + uniq.join(fiW ? ' ja ' : ' and ') : (fiW ? 'Tasainen pohja päivällesi' : 'A steady base for your day');
    return { name: r.name, slot: k, anchor: r.anchor, why, train: !!r.train, hasGoal: parts.length > 0, steps: r.steps.slice(0, cap).map(text => ({ text, mins: /\d+-minute|\d+ minutes/.test(text) ? 10 : 1 })) };
  });
  const start = START_AT[a.dayStart] || '08:00', wind = WIND_AT[a.windDown] || '21:30';
  /* Reminders come from the routines: one at the time each routine starts */
  const afterWork = workAt ? minHM(Math.min(Math.max(hmMin(workAt) + 510, 16 * 60), 19 * 60)) : '17:00';
  const trainAt = a.trainWhen === 'Morning' ? addMin(start, 60) : a.trainWhen === 'Evening' ? '19:00' : afterWork;
  const at = { morning: start, day: routines[1].train ? trainAt : anc.includes('Lunch') || workAt ? '12:15' : '13:00', evening: routines[2].train ? trainAt : goals.includes('Better sleep') ? wind : '19:00' };
  if (routines[2].train && !a.trainWhen) at.evening = '19:00';
  const max = a.nudges in NUDGES_N ? NUDGES_N[a.nudges] : 3;
  const reminders = routines.map((r, i) => ({ text: r.name, time: at[r.slot], slot: r.slot, emoji: ['🌅', '☀️', '🌙'][i], pri: (r.hasGoal ? 0 : 2) + i * 0.1 }))
    .sort((x, y) => x.pri - y.pri).slice(0, Math.min(max, 3)).map(({ pri, ...r }) => r).sort((x, y) => x.time.localeCompare(y.time));
  return { routines, reminders, ai: false, note: planNote(a, n, start, wind), insights: localInsights(a, routines) };
}
/* A short read of the person's answers, shown above the plan (used when Terra AI isn't available or gave none). */
function localInsights(a, routines) {
  const fi = LANG === 'fi', out = [];
  const ownS = (a.own_struggles || '').trim(), ownG = (a.own_goals || '').trim();
  const first = routines[0] ? tr(routines[0].name) : '';
  const wAt = WORK_AT[a.work];
  if (wAt && hmMin(wAt) - hmMin(START_AT[a.dayStart] || '08:00') < 90) out.push(fi ? `Työ tai koulu alkaa noin klo ${wAt}, joten aamussa on vain kaksi askelta.` : `Work or school starts around ${wAt}, so your morning has just two steps.`);
  else if (a.anchors?.length) out.push(fi ? `Uudet askeleet tulevat sen perään, mitä teet jo: ${a.anchors.slice(0, 2).map(x => tr(x).toLowerCase()).join(' ja ')}.` : `New steps come right after what you already do: ${a.anchors.slice(0, 2).map(x => x.toLowerCase()).join(' and ')}.`);
  if (ownS) out.push(fi ? `Kerroit omin sanoin: "${ownS}". Suunnitelma alkaa siitä.` : `In your own words: "${ownS}". Your plan starts there.`);
  else if (a.struggles?.length) out.push(fi ? `Vaikeinta nyt: ${a.struggles.slice(0, 2).map(x => tr(x).toLowerCase()).join(' ja ')}.${first ? ` Siksi ${first} tulee ensin.` : ''}` : `Hardest right now: ${a.struggles.slice(0, 2).map(x => x.toLowerCase()).join(' and ')}.${first ? ` So ${first} comes first.` : ''}`);
  if (ownG) out.push(fi ? `Haluat: "${ownG}". Jokainen rutiini vie sitä kohti.` : `You want: "${ownG}". Every routine moves toward it.`);
  else if (a.goals?.length) out.push(fi ? `Tavoitteesi: ${a.goals.slice(0, 2).map(x => tr(x).toLowerCase()).join(' ja ')}.` : `Your goals: ${a.goals.slice(0, 2).map(x => x.toLowerCase()).join(' and ')}.`);
  if (['Tiny', 'Just a little'].includes(a.energy)) out.push(fi ? 'Energiaa uusille tavoille on nyt vähän, joten askeleet pidetään lyhyinä.' : 'You have little energy for new habits right now, so the steps stay short.');
  else if (a.windDown) out.push(fi ? 'Illan rauhoittuminen on mukana, koska uni tukee kaikkea muuta.' : 'Winding down is included, because sleep supports everything else.');
  return out.slice(0, 3);
}
function planNote(a, n, start, wind) {
  const fi = LANG === 'fi';
  const num = fi ? ['', '', 'Kaksi', 'Kolme', 'Neljä'][n] : ['', '', 'Two', 'Three', 'Four'][n];
  let t = fi ? `${num} pientä askelta per rutiini. Aamu alkaa klo ${start}` : `${num} small steps per routine. Mornings start at ${start}`;
  if (a.windDown) t += fi ? `, rauhoittuminen klo ${wind}.` : `, wind-down at ${wind}.`; else t += '.';
  if (a.nudges === 'Only what I set myself') t += fi ? ' Muistutuksia ei lisätty puolestasi.' : ' No reminders added for you.';
  return t;
}
async function aiPlan(a) {
  const prompt = `${AI_RULES_T()}

Create a personalized starting plan for a new Terra user from their check-in.
Check-in:
- Name: ${a.name || '(not given)'}
- Hardest right now: ${a.struggles.join(', ') || '(skipped)'}
- In their own words, what trips them up: ${(a.own_struggles || '').trim() || '(none)'}
- Day usually starts: ${a.dayStart || '(skipped)'}
- Work or school starts: ${a.work || '(skipped)'}
- Already does every day (hook new steps onto these as anchors): ${(a.anchors || []).join(', ') || '(skipped)'}
- Why they are starting, in their own words: ${(a.why || '').trim() || '(none)'}
- Usually goes to bed: ${a.windDown || '(skipped)'}
- Reminder preference: ${a.nudges || '(skipped)'}
- Wants: ${a.goals.join(', ') || '(skipped)'}
- In their own words, what they want: ${(a.own_goals || '').trim() || '(none)'}
- Energy for new habits: ${a.energy || '(skipped)'}${wantsTraining(a) ? `\n- Training they like: ${(a.trainKind || []).join(', ') || '(not said)'}; how often: ${a.trainFreq || '(not said)'}; best time: ${a.trainWhen || '(not said)'}` : ''}

Rules: every routine must really move them toward a goal they named, not only symbolic tiny steps. Translate the goal into the real action: for example \"I want more muscle\" means a strength training routine in the day or evening whose steps include the workout itself (like \"Do a 30-minute strength workout\") and eating protein; \"better sleep\" means a real evening wind-down at a fixed time. Small steps lower the start (getting changed, packing the bag), the main step is the real thing. If they want to train, one routine is a workout routine built for their kind of training, at their best time, with steps like getting ready, the workout itself and logging it. What they wrote in their own words matters most: at least one routine (and a reminder if it fits, for example for medicine) must directly answer it. Reminders come from the routines: one reminder per routine at the time that routine starts, its text is the routine's name and \"slot\" is that routine's slot (respect their reminder preference: fewer if they want only a few, none if they only want what they set themselves). Make exactly three routines: a morning one (slot morning), a daytime one (slot day) and an evening one (slot evening), named clearly for the time of day. Put each goal's real action into the time of day where it belongs (for example a strength workout into the day or evening routine at their best training time, a wind-down into the evening). Do not invent goals they did not pick or write; a time of day with no goal gets a short, useful base routine for the day. In \"why\", name the goal(s) that routine serves. Each has 2 to 4 steps (2 if energy is low). Every step is a specific task that moves one of their wanted goals forward, under 50 characters, starts with a verb. No filler such as breathing, drinking water, opening curtains or stretching unless they wanted it. Each routine has an anchor that links it to an existing habit, under 40 characters, like "After I brush my teeth". Reminder times are realistic 24h times matched to when their day starts and when they go to bed. "note" is one warm sentence (under 120 characters) telling them why this plan fits them. "insights" is 2 or 3 short observations (each under 110 characters) about their answers: what you noticed, especially in their own words, and how the plan answers it. Practical and kind, about their days and routines only: no diagnoses and no guesses about the reasons behind their struggles. Each routine also gets "why": under 70 characters, which of their answers it answers. Write the note and every routine name, anchor, step and reminder text in ${LANG_NAME()}.
Reply with only JSON in this shape:
{"insights":["..."],"routines":[{"name":"Gentle morning","slot":"morning","anchor":"After I turn off my alarm","why":"...","steps":[{"text":"Drink a glass of water","mins":1}]}],"reminders":[{"text":"Morning routine","time":"08:00","slot":"morning"}],"note":"..."}`;
  const r = await aiRequest(prompt, { modelTier: 'default' });
  const m = r.text.match(/\{[\s\S]*\}/);
  const out = m ? JSON.parse(m[0]) : null;
  const routines = (Array.isArray(out?.routines) ? out.routines : []).slice(0, 3).map(r => ({
    name: String(r.name || '').slice(0, 40), slot: SLOTS[r.slot] ? r.slot : 'day', anchor: String(r.anchor || '').slice(0, 60), why: String(r.why || '').slice(0, 90),
    steps: (Array.isArray(r.steps) ? r.steps : []).slice(0, 4).map(s => ({ text: String(s?.text || s || '').slice(0, 80), mins: clamp(Number(s?.mins) || 1, 1, 5) })).filter(s => s.text) })).filter(r => r.name && r.steps.length);
  const reminders = (Array.isArray(out?.reminders) ? out.reminders : []).slice(0, 4).map(r => ({ text: String(r.text || '').slice(0, 60), time: /^\d{1,2}:\d{2}$/.test(String(r.time)) ? String(r.time).padStart(5, '0') : '09:00', ...(SLOTS[r.slot] ? { slot: r.slot } : {}) })).filter(r => r.text);
  if (!routines.length) throw new Error('empty');
  const insights = (Array.isArray(out?.insights) ? out.insights : []).map(x => String(x || '').trim().slice(0, 140)).filter(Boolean).slice(0, 3);
  return { routines, reminders, ai: true, note: String(out?.note || '').slice(0, 160), insights: insights.length ? insights : localInsights(a, routines) };
}
async function runBuilding() {
  const marks = ['b1', 'b2', 'b3', 'b4']; let k = 0, iv = null;
  /* a short, calm pause before Terra starts building */
  const pause = setTimeout(() => { $('#ob .building')?.classList.add('go'); iv = setInterval(() => { const el = document.getElementById(marks[k]); if (el) el.classList.add('on'); k++; if (k >= marks.length) clearInterval(iv); }, 900); }, 1300);
  const minWait = new Promise(r => setTimeout(r, 5100));
  let result = null;
  if (aiReady()) { try { result = await aiPlan(OB.a); } catch (e) { result = null; } }
  if (!result) result = localPlan(OB.a);
  await minWait; clearTimeout(pause); clearInterval(iv);
  OB.plan = result; if (OB_STEPS[OB.i] === 'building') obGo(OB.i + 1);
}
function acceptPlan() {
  const a = OB.a; S.name = a.name.trim(); S.profile = { struggles: a.struggles, dayStart: a.dayStart, windDown: a.windDown, goals: a.goals, nudges: a.nudges, energy: a.energy, why: (a.why || '').trim().slice(0, 140), work: a.work || '', anchors: a.anchors || [], own: { struggle: (a.own_struggles || '').trim(), goal: (a.own_goals || '').trim() }, train: wantsTraining(a) ? { kind: a.trainKind || [], freq: a.trainFreq || '', when: a.trainWhen || '' } : null };
  if (wantsTraining(a) && TRAIN_GOAL_N[a.trainFreq]) S.wGoal = TRAIN_GOAL_N[a.trainFreq];
  S.routines = []; const bySlot = {}; OB.plan.routines.forEach(r => { const x = addRoutine(r); if (x && !bySlot[x.slot]) bySlot[x.slot] = x.id; });
  S.reminders = OB.plan.reminders.map(({ slot, ...r }) => ({ id: uid(), ...r, ...(bySlot[slot] ? { rid: bySlot[slot] } : {}) }));
  save();
  askNotify().catch(() => false).then(() => finishOnboarding(true));
}
function finishOnboarding(withPaywall = true) {
  S.onboarded = true; S.tab = 'today'; save();
  $('#ob')?.remove(); render();
  if (withPaywall && planKey() === 'free') openPaywall('', maybeTour); else maybeTour();
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a || a.disabled) return;
  const k = a.dataset.k, id = a.dataset.id;
  switch (a.dataset.act) {
    case 'dayNotes': {
      const val = id => (document.getElementById(id)?.value || '').trim().slice(0, 120);
      S.notes ||= {};
      S.notes[dayKey()] = { imp: val('noteImp'), wins: [0, 1, 2].map(i => val('noteWin' + i)).filter(Boolean) };
      const keys = Object.keys(S.notes); while (keys.length > 60) delete S.notes[keys.shift()];
      save(); closeSheet(); toast('Saved for today'); render(); break;
    }
    case 'dayNotesOpen': dayNotesSheet(); break;
    case 'dayNoteImp': {
      const imp = (document.getElementById('noteImp')?.value || '').trim().slice(0, 120);
      S.notes ||= {};
      const prev = S.notes[dayKey()] || { imp: '', wins: [] };
      S.notes[dayKey()] = { ...prev, imp };
      save(); toast('Saved for today'); render(); break;
    }
    case 'tab': S.tab = k; S.youSec = a.dataset.sec || null; editRoutine = null; openAdd = null; confirmDel = null; confirmReset = false; promoMsg = null; privConfirm = null; save(); render(); window.scrollTo({ top: 0 }); break;
    case 'gear': if (S.tab === 'prefs') { S.tab = S.prevTab && S.prevTab !== 'prefs' ? S.prevTab : 'today'; } else { S.prevTab = S.tab; S.tab = 'prefs'; } confirmReset = false; promoMsg = null; save(); render(); window.scrollTo({ top: 0 }); break;
    case 'doneNext': completeStep(id, a); break;
    case 'world': worldSheet(); break;
    case 'editR': editRoutine = editRoutine === id ? null : id; openAdd = null; confirmDel = null; editStep = null; render(); break;
    case 'editStep': editStep = editStep === id ? null : id; render(); setTimeout(() => document.querySelector('[data-form="editStep"] input')?.focus(), 50); break;
    case 'moveStep': { const r = S.routines.find(x => x.id === a.dataset.r); const i = r ? r.steps.findIndex(s => s.id === id) : -1; const j = i + Number(a.dataset.dir); if (r && i >= 0 && j >= 0 && j < r.steps.length) { [r.steps[i], r.steps[j]] = [r.steps[j], r.steps[i]]; save(); render(); } break; }
    case 'editRDetails': routineSheet(id); break;
    case 'slotJump': document.getElementById('slot-' + k)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
    case 'skipNext': { const l = (S.skip[dayKey()] ||= []); if (!l.includes(id)) l.push(id); save(); const c = $('#nextCard'); c?.classList.add('leaving'); setTimeout(render, 300); break; }
    case 'togRem': { const on = !remDone(id); setRem(id, on); if (on) { chime(); burst(a, 10); } render(); break; }
    case 'delRem': { closeSheet(); const r = S.reminders.find(x => x.id === id); S.reminders = S.reminders.filter(x => x.id !== id); save(); render(); toast('Reminder deleted', { label: 'Undo', fn: () => { S.reminders.push(r); save(); render(); } }); break; }
    case 'addRem': case 'editRem': remSheet(id); break;
    case 'togStep': { const on = !stepDone(id); if (on) completeStep(id, a); else { setStep(id, false); render(); } break; }
    case 'delStep': { const r = S.routines.find(x => x.id === a.dataset.r); if (!r) break; if (r.steps.length <= 1) { confirmDel = r.id; render(); break; } r.steps = r.steps.filter(s => s.id !== id); save(); render(); break; }
    case 'openAdd': openAdd = openAdd === id ? null : id; render(); setTimeout(() => document.getElementById('newStep-' + id)?.focus(), 50); break;
    case 'askDel': confirmDel = id; render(); break;
    case 'cancelDel': confirmDel = null; render(); break;
    case 'delRoutine': S.routines = S.routines.filter(r => r.id !== id); S.reminders = S.reminders.filter(x => x.rid !== id); confirmDel = null; save(); render(); toast('Routine deleted'); break;
    case 'newRoutine': routineSheet(null, a.dataset.k); break;
    case 'aiRoutine': S.tab = 'terra'; save(); render(); if (plan().ai && aiReady()) askAI(tr('Help me create a new routine that fits my day.')); break;
    case 'dur': { const n = +a.dataset.n; if (!plan().durations.includes(n)) { openPaywall(n === 3 ? '3-minute Moments are part of Pro.' : 'Longer Moments are part of Ultimate.'); break; } S.moment.dur = n; save(); resetBreath(); render(); break; }
    case 'pat': if (!plan().patterns.includes(k)) { openPaywall('Box breathing is part of Ultimate.'); break; } S.moment.pat = k; save(); resetBreath(); render(); break;
    case 'brToggle': toggleBreath(); break;
    case 'brReset': resetBreath(); break;
    case 'aiAsk': askAI(tr(a.dataset.q)); break;
    case 'clearChat': S.chat = []; save(); render(); break;
    case 'paywall': openPaywall(); break;
    case 'bill': pwState.billing = k; renderPaywall(); break;
    case 'pwSel': pwState.sel = k; renderPaywall(); break;
    case 'pwClose': closePaywall(); break;
    case 'startTrial': { if (trialUsed()) break; S.trial = { start: Date.now(), end: Date.now() + TRIAL_DAYS * 864e5 }; save(); pwState.after = null; $('#paywall')?.remove(); render(); celebrate('Ultimate trial started', `Everything is open for ${TRIAL_DAYS} days. After that it's ${ULTIMATE_PRICE}/month, and you can cancel anytime before.`); break; }
    case 'setTog': S.settings[k] = !S.settings[k]; save(); render(); break;
    case 'retake': OB = { i: OB_STEPS.indexOf('name'), a: { ...OB_EMPTY(), ...S.profile, name: S.name, struggles: [...(S.profile.struggles || [])], goals: [...(S.profile.goals || [])], own_struggles: S.profile.own?.struggle || '', own_goals: S.profile.own?.goal || '', trainKind: [...(S.profile.train?.kind || [])], trainFreq: S.profile.train?.freq || '', trainWhen: S.profile.train?.when || '' }, plan: null, err: '', more: {} }; S.onboarded = false; render(); break;
    case 'askReset': confirmReset = true; render(); break;
    case 'cancelReset': confirmReset = false; render(); break;
    case 'resetAll': { const keepPlan = S.plan, keepTrial = S.trial; S = freshState(); S.plan = keepPlan; S.trial = keepTrial; confirmReset = false; H = freshHealth(); saveH(); OB = { i: 0, a: OB_EMPTY(), plan: null, err: '', more: {} }; save(); render(); break; }
    case 'obNext': {
      const st = OB_STEPS[OB.i]; if (st === 'name' && !OB.a.name.trim()) { $('#obName')?.focus(); break; }
      /* Answering in under two seconds a few times gets a friendly nudge (and a note on the plan) */
      if (OBQ[st] && Date.now() - OB.t0 < 2000) { OB.rush++; OB.rushMsg = RUSH_LINES[(OB.rush - 1) % RUSH_LINES.length]; }
      else OB.rushMsg = '';
      obGo(OB.i + 1); OB.rushAt = OB_STEPS[OB.i]; if (OB.rushMsg) renderOnboarding(); break;
    }
    case 'obBack': obGo(OB.i - 1); break;
    case 'obSkip': obGo(OB.a.name.trim() ? OB_STEPS.indexOf('building') : OB_STEPS.indexOf('name')); break;
    case 'obPick': { const q = OBQ[k]; const v = a.dataset.v; if (q.multi) { const arr = OB.a[k]; const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else { if (q.max && arr.length >= q.max) arr.shift(); arr.push(v); } } else OB.a[k] = v; OB.justPicked = v; if (k === 'dayStart') { OB.dayEdit = false; OB.dayHold = true; setTimeout(() => { OB.dayHold = false; if (OB_STEPS[OB.i] === 'day') renderOnboarding(); }, 450); } renderOnboarding(); setTimeout(() => $('#ob [data-act=obNext]')?.classList.add('nudge'), 30); break; }
    case 'obAccept': acceptPlan(); break;
    case 'obWhyIdea': { const ta = $('#obWhy'); OB.a.why = tr(a.dataset.k); if (ta) { ta.value = OB.a.why; ta.focus(); } const fb = $('#ob .ob-foot .btn'); if (fb) fb.textContent = tr('Continue'); break; }
    case 'whyEdit': whySheet(); break;
    case 'whySave': { S.profile.why = ($('#whyText')?.value || '').trim().slice(0, 140); S.whyHide = false; save(); closeSheet(); render(); syncNativeWidget(); toast(tr(S.profile.why ? 'Saved. Terra will remind you.' : 'Removed.')); break; }
    case 'whyHide': S.whyHide = true; save(); render(); break;
    case 'rcSmaller': { const r = S.routines.find(x => x.id === id); if (r && r.steps.length > 1) { const cut = r.steps.length > 2 ? 2 : 1; const gone = r.steps.slice(cut); r.steps = r.steps.slice(0, cut); (S.rcheck ||= {})[r.id] = Date.now() + 5 * 864e5; save(); render(); toast(tr('Smaller now. Two tiny steps is plenty.'), { label: tr('Undo'), fn: () => { r.steps = [...r.steps, ...gone]; save(); render(); } }); } break; }
    case 'rcFine': (S.rcheck ||= {})[id] = Date.now() + 7 * 864e5; save(); render(); break;
    case 'rcAsk': { const r = S.routines.find(x => x.id === id); (S.rcheck ||= {})[id] = Date.now() + 7 * 864e5; S.tab = 'terra'; save(); render(); if (r) askAI(tr('My routine') + ' "' + tr(r.name) + '" ' + tr('feels hard to keep up with lately. Can you help me make it easier?')); break; }
    case 'dayEdit': OB.dayEdit = true; renderOnboarding(); break;
    case 'obMore': OB.more[k] = true; OB.moreJust = k; renderOnboarding(); break;
    case 'obUnsure': OB.unsure = true; renderOnboarding(); requestAnimationFrame(() => { const o = $('#ob'); if (o) o.scrollTop = o.scrollHeight; }); break;
    case 'obUnsureClose': OB.unsure = false; renderOnboarding(); break;
    case 'obAdjust': {
      OB.unsure = false;
      if (k === 'answers') { obGo(OB_STEPS.indexOf('struggles')); break; }
      if (k === 'smaller') { OB.plan.routines = OB.plan.routines.map(r => ({ ...r, steps: r.steps.slice(0, 2) })); OB.plan.reminders = OB.plan.reminders.slice(0, 2); OB.plan.note = 'Even smaller. Two tiny steps each is plenty to start.'; }
      if (k === 'one') { OB.plan.routines = OB.plan.routines.slice(0, 1); OB.plan.reminders = OB.plan.reminders.slice(0, 1); OB.plan.note = 'One routine to begin with. You can add more whenever it feels easy.'; }
      renderOnboarding(); break;
    }
    case 'notifyOn': askNotify().then(ok => { toast(ok ? 'Notifications are on.' : 'Notifications are blocked here. You can allow them in your device or browser settings.'); render(); }); break;
    case 'notifyOff': S.settings.notify = 'off'; S.settings.banners = false; save(); render(); break;
  }
});
document.addEventListener('input', e => {
  const t = e.target.dataset?.input; if (!t) return;
  if (t === 'name') { S.name = e.target.value.slice(0, 30); save(); }
  if (t === 'obName') { OB.a.name = e.target.value.slice(0, 30); const b = $('#ob .ob-foot .btn'); if (b) b.disabled = !OB.a.name.trim(); }
  if (t === 'obWhy') { OB.a.why = e.target.value.slice(0, 140); const b = $('#ob .ob-foot .btn'); if (b) b.textContent = tr(OB.a.why.trim() ? 'Continue' : 'Skip for now'); }
  if (t === 'obOwn') { const k = e.target.dataset.k; OB.a['own_' + k] = e.target.value.slice(0, 80); const b = $('#ob .ob-foot .btn'); if (b) b.disabled = !((OB.a[k] || []).length || OB.a['own_' + k].trim()); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('scene')) { e.preventDefault(); worldSheet(); return; }
  if (e.key === 'Enter' && e.target.id === 'obName') { e.preventDefault(); if (OB.a.name.trim()) obGo(OB.i + 1); }
  if (e.key === 'Escape') { if ($('#sheet')) closeSheet(); else if ($('#paywall')) closePaywall(); else $('.celebrate button')?.click(); }
});
document.addEventListener('submit', e => {
  const f = e.target; const k = f.dataset.form; if (!k) return; e.preventDefault();
  const fd = new FormData(f);
  if (k === 'promo') {
    const pl = redeem(fd.get('code'));
    if ($('#paywall')) renderPaywall(); else render();
    if (pl) celebrate(`${PLANS[pl].name} unlocked`, pl === 'ultimate' ? (aiReady() ? 'Everything is open: Terra AI with extended memory, longer Moments and box breathing.' : 'Everything is open: longer Moments and box breathing.') : (aiReady() ? 'Unlimited routines, Terra AI and 3-minute Moments are yours.' : 'Unlimited routines and 3-minute Moments are yours.'));
  }
  if (k === 'editStep') { const id = f.dataset.id; const t = String(fd.get('t') || '').trim(); const r = S.routines.find(x => x.steps.some(s => s.id === id)); const st = r?.steps.find(s => s.id === id); if (st && t) { st.text = t.slice(0, 80); save(); } editStep = null; render(); }
  if (k === 'editRoutine') {
    const r = S.routines.find(x => x.id === f.dataset.id);
    if (r) { const slot = f.querySelector('#rSlot .on')?.dataset.slot; r.name = String(fd.get('name') || '').trim().slice(0, 40) || r.name; if (SLOTS[slot]) r.slot = slot; r.anchor = String(fd.get('anchor') || '').trim().slice(0, 60); linkReminder(r, String(fd.get('remind') || '')); save(); }
    closeSheet(); render(); toast('Routine updated');
  }
  if (k === 'addStep') { const r = S.routines.find(x => x.id === f.dataset.r); const t = String(fd.get('t') || '').trim(); if (r && t) { r.steps.push({ id: uid(), text: t.slice(0, 80), mins: 1 }); save(); } openAdd = null; render(); }
  if (k === 'newRoutine') {
    const slot = f.querySelector('#rSlot .on')?.dataset.slot || 'morning';
    const steps = String(fd.get('steps') || '').split('\n').map(s => s.trim()).filter(Boolean);
    const pend = f.querySelector('#rStepIn')?.value.trim(); if (pend) steps.push(pend); // a step typed but not yet added still counts
    if (!steps.length) { const w = f.querySelector('#rStepWarn'); if (w) w.hidden = false; f.querySelector('#rStepIn')?.focus(); return; }
    const r = addRoutine({ name: fd.get('name'), slot, anchor: fd.get('anchor'), steps });
    if (!r) return; linkReminder(r, String(fd.get('remind') || '')); closeSheet(); render(); toast(`${r.name} added`);
  }
  if (k === 'rem') {
    const text = String(fd.get('text') || '').trim(); const time = String(fd.get('time') || '09:00');
    if (!text) return;
    if (f.dataset.id) { const r = S.reminders.find(x => x.id === f.dataset.id); if (r) { r.text = text.slice(0, 60); r.time = time; delete S.notified[r.id]; } }
    else S.reminders.push({ id: uid(), text: text.slice(0, 60), time });
    save(); closeSheet(); render();
  }
  if (k === 'chat') { const inp = f.querySelector('input'); const v = inp.value; inp.value = ''; askAI(v); }
});
async function askNotify() {
  let res = 'granted';
  try {
    if (NATIVE) res = (await nativeCall('notifyPermission')) ? 'granted' : 'denied';
    else if (window.TERRA_HOSTED) res = await pushEnable();
    else if ('Notification' in window && Notification.permission !== 'granted') res = await Notification.requestPermission();
  } catch (e) { res = 'granted'; }
  const ok = res !== 'denied';
  S.settings.notify = ok ? 'on' : 'off'; S.settings.banners = ok; save(); return ok;
}
function remSheet(id) {
  const r = S.reminders.find(x => x.id === id);
  openSheet(`<h2 class="h2">${r ? 'Edit reminder' : 'New reminder'}</h2>
    <form class="stack" data-form="rem" ${r ? `data-id="${r.id}"` : ''}>
      <div class="field"><label for="remText">Reminder</label><input type="text" id="remText" name="text" maxlength="60" value="${esc(r?.text || '')}" placeholder="Take vitamins" required></div>
      <div class="field"><label for="remTime">Time</label><input type="time" id="remTime" name="time" value="${esc(r?.time || '09:00')}" required></div>
      <button class="btn primary block" type="submit">Save reminder</button>
      ${r ? `<button class="btn block danger" type="button" data-act="delRem" data-id="${r.id}">Delete reminder</button>` : ''}
    </form>`);
}

/* reminder banners while open */
setInterval(() => {
  if (!S.onboarded || !S.settings.banners) return;
  const now = new Date(); const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; const dk = dayKey();
  for (const r of S.reminders) {
    if (remAt(r) === hm && !remDone(r.id) && S.notified[r.id] !== dk) {
      S.notified[r.id] = dk; save(); chime('soft');
      toast(`${remAt(r)} · ${r.emoji ? r.emoji + ' ' : ''}${r.text}`, { label: 'Done', fn: () => { setRem(r.id, true); render(); } });
      break;
    }
  }
}, 20000);

function boot() {
  if (!S.settings.lang) S.settings.lang = LANG; else LANG = S.settings.lang;
  initXP(); S.workouts ||= []; S.wGoal ||= 3;
  $('#ob')?.remove(); $('#paywall')?.remove(); startTranslator(); render();
  maybeTour();
  if (S.trial && !trialActive() && !S.trial.endNotified && S.plan === 'free') { S.trial.endNotified = true; save(); setTimeout(() => toast('Your Ultimate trial has ended. You\'re back on Free.', { label: 'See plans', fn: () => openPaywall() }), 600); }
}
boot();

/* ---------- reminder time chip: tap the time, pick a new one, saved at once ---------- */
document.addEventListener('click', e => { const el = e.target.closest('.time-chip'); if (!el) return; const inp = el.querySelector('input'); try { inp.showPicker?.(); } catch (err) { inp.focus(); } });
document.addEventListener('change', e => {
  const el = e.target; if (el.dataset?.input !== 'remTime') return;
  const r = S.reminders.find(x => x.id === el.dataset.id); if (!r || !/^\d{2}:\d{2}$/.test(el.value) || el.value === r.time) return;
  r.time = el.value; save(); render(); toast(`${tr('Reminder moved to')} ${r.time}`);
});

/* ---------- Alarm: one daily alarm. It only goes quiet when the tasks are done, and then Terra checks
   a few minutes later that you're really up: you type a short phrase, or it rings again. ---------- */
const AL_TYPES = { maths: ['Maths', '🧮'], spell: ['Spelling', '✍️'], puzzle: ['Puzzle', '🧩'], photo: ['Photo of an object', '📷'] };
const AL_LEVELS = [['super', 'Super easy', 'Tosi helppo'], ['easy', 'Easy', 'Helppo'], ['normal', 'Normal', 'Normaali'], ['hard', 'Hard', 'Vaikea']];
const AL_WINDOWS = [1, 3, 5, 10];
const AL_BGS = { night: ['#0b1020', 'Night'], dawn: ['#3b2a5a', 'Dawn'], sky: ['#cfe3f7', 'Sky'], sand: ['#f1e4cf', 'Sand'], forest: ['#14301f', 'Forest'], coral: ['#f2856b', 'Coral'] };
const AL_Q_SECS = 30, AL_CONFIRM_SECS = 60, AL_MAX_DROPS = 5;
function alarmCfg() {
  const a = (S.alarm ||= { on: false, mode: 'auto', time: '07:00', done: '' });
  if (!a.tasks) a.tasks = { maths: a.twist === 'sum' || !a.twist ? 2 : 0, spell: 1, puzzle: a.twist === 'tap' ? 1 : 0, photo: 0 };
  a.level ||= 'easy'; a.win ||= 3; a.bg ||= 'night'; a.text ||= 'light';
  if (!Object.entries(a.tasks).some(([k, n]) => n > 0 && (k !== 'photo' || alarmImg().ref))) a.tasks.maths = 1;
  return a;
}
function alarmTime() { const a = alarmCfg(); return a.mode === 'custom' ? a.time : (START_AT[S.profile?.dayStart] || '07:30'); }
/* Pictures live apart from the rest of Terra's data, so they don't slow every save down */
const AL_IMG_KEY = 'terra.alarm.img';
let AL_IMG = null;
function alarmImg() { if (AL_IMG) return AL_IMG; try { AL_IMG = JSON.parse(localStorage.getItem(AL_IMG_KEY) || '{}'); } catch (e) { AL_IMG = {}; } return AL_IMG; }
function saveAlarmImg() { try { localStorage.setItem(AL_IMG_KEY, JSON.stringify(AL_IMG || {})); } catch (e) { toast(tr('That picture is too big to keep. Try another one.')); } }
function readImage(file, max) {
  return new Promise((ok, bad) => {
    const url = URL.createObjectURL(file); const im = new Image();
    im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok(c); };
    im.onerror = () => { URL.revokeObjectURL(url); bad(new Error('image')); }; im.src = url;
  });
}
/* A small fingerprint of a photo: its colours and its light-and-dark layout. Good enough to tell your
   coffee machine from your pillow, without sending anything anywhere. */
function photoSig(canvas) {
  const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d');
  const s = Math.min(canvas.width, canvas.height); g.drawImage(canvas, (canvas.width - s) / 2, (canvas.height - s) / 2, s, s, 0, 0, 24, 24);
  const d = g.getImageData(0, 0, 24, 24).data; const hist = new Array(64).fill(0); const lum = [];
  for (let i = 0; i < d.length; i += 4) { hist[(d[i] >> 6) * 16 + (d[i + 1] >> 6) * 4 + (d[i + 2] >> 6)]++; lum.push(.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]); }
  const n = lum.length, m = lum.reduce((x, y) => x + y, 0) / n, sd = Math.sqrt(lum.reduce((x, y) => x + (y - m) ** 2, 0) / n) || 1;
  return { h: hist.map(v => +(v / n).toFixed(4)), l: lum.map(v => +((v - m) / sd).toFixed(2)) };
}
function photoMatch(a, b) {
  if (!a || !b) return 0;
  const hist = a.h.reduce((s, v, i) => s + Math.min(v, b.h[i]), 0);
  const corr = a.l.reduce((s, v, i) => s + v * b.l[i], 0) / a.l.length;
  return hist * .55 + Math.max(0, corr) * .45;
}
const alTasksText = a => Object.entries(a.tasks).filter(([k, n]) => n > 0).map(([k, n]) => (k === 'photo' ? '' : n + ' × ') + tr(AL_TYPES[k][0]).toLowerCase()).join(', ');
/* Wake-up alarm card in Settings. Everything else is in the alarm sheet. */
function alarmSettings() {
  const a = alarmCfg(), t = alarmTime();
  return `<section class="card set-group alarm-set"><p class="eyebrow">Alarm</p>
    <div class="set-row"><div><b>Wake-up alarm</b><small>${a.on ? `${tr('Rings every day at')} ${t}` : tr('Terra wakes you up and shows your first step.')}</small></div><button class="toggle" type="button" role="switch" aria-checked="${a.on}" aria-label="${tr('Wake-up alarm')}" data-act="alarmOn"></button></div>
    ${a.on ? `<div class="set-row"><span>${tr('Time')}</span><span class="row" style="gap:8px"><button class="btn small primary" type="button" id="alarmSave" data-act="alarmSave" hidden>${tr('Set')}</button><label class="time-chip big" aria-label="${tr('Change time')}">${IC.snooze}<span class="tnum">${t}</span><input type="time" id="alarmDraft" value="${t}" data-input="alarmDraft"></label></span></div>
    <button class="al-sum" type="button" data-act="alarmSheet"><span><b>${tr('To switch it off')}</b><small>${esc(alTasksText(a))} · ${tr('awake check after')} ${a.win} min</small></span><span class="al-sw" style="background:${a.bg === 'photo' && alarmImg().bg ? `url(${alarmImg().bg}) center/cover` : (AL_BGS[a.bg] || AL_BGS.night)[0]};color:${a.text === 'dark' ? '#111' : '#fff'}">7:00</span>${IC.arrow}</button>
    <button class="link-btn" type="button" data-act="alarmTry" style="font-size:14px">${tr('Try it now')}</button>` : ''}
    ${NATIVE ? `<button class="link-btn" type="button" data-act="openClock" style="margin-top:6px;font-size:14px">⏰ ${tr('More alarms in the Clock app')}</button>` : ''}
  </section>`;
}
function alarmSheet() {
  const a = alarmCfg(), img = alarmImg();
  const cnt = k => `<div class="al-cnt" role="group" aria-label="${tr(AL_TYPES[k][0])}">${[0, 1, 2, 3].map(n => `<button type="button" class="chip ${a.tasks[k] === n ? 'on' : ''}" aria-pressed="${a.tasks[k] === n}" data-act="alCount" data-k="${k}" data-n="${n}">${n ? n : tr('Off')}</button>`).join('')}</div>`;
  const html = `<h2 class="h2">${tr('Your alarm')}</h2>
    <p class="sub" style="margin-top:-6px">${tr('It keeps ringing until the tasks are done. Each question has 30 seconds.')}</p>
    <div class="al-block"><p class="al-h">${tr('Tasks to switch it off')}</p>
      ${['maths', 'spell', 'puzzle'].map(k => `<div class="al-line"><span>${AL_TYPES[k][1]} ${tr(AL_TYPES[k][0])}</span>${cnt(k)}</div>`).join('')}
      ${a.tasks.maths ? `<div class="al-line"><span>${tr('Maths level')}</span><div class="al-cnt">${AL_LEVELS.map(([k, l, f]) => `<button type="button" class="chip ${a.level === k ? 'on' : ''}" aria-pressed="${a.level === k}" data-act="alLevel" data-k="${k}" data-notr>${LANG === 'fi' ? f : l}</button>`).join('')}</div></div>` : ''}
      <div class="al-line"><span>📷 ${tr('Photo of an object')}</span><div class="al-cnt"><button type="button" class="chip ${!a.tasks.photo ? 'on' : ''}" aria-pressed="${!a.tasks.photo}" data-act="alPhoto" data-n="0">${tr('Off')}</button><button type="button" class="chip ${a.tasks.photo ? 'on' : ''}" aria-pressed="${!!a.tasks.photo}" data-act="alPhoto" data-n="1">${tr('On')}</button></div></div>
      ${a.tasks.photo || !img.ref ? `<div class="al-ref">${img.ref ? `<img src="${img.ref}" alt="${tr('Your object')}">` : '<span class="al-ref-empty" aria-hidden="true">📷</span>'}<div><b>${img.ref ? tr('Your object') : tr('Pick an object far from your bed')}</b><small>${tr('Every morning you take a photo of it to switch the alarm off. The coffee machine works well.')}</small>
        <label class="btn small">${img.ref ? tr('Change photo') : tr('Take a photo')}<input type="file" accept="image/*" capture="environment" data-input="alRef" hidden></label></div></div>` : ''}
    </div>
    <div class="al-block"><p class="al-h">${tr('Am I really awake?')}</p><p class="small">${tr('After the tasks, Terra waits this long and then asks you to type a short phrase. If you don’t, the alarm rings again.')}</p>
      <div class="al-cnt">${AL_WINDOWS.map(m => `<button type="button" class="chip ${a.win === m ? 'on' : ''}" aria-pressed="${a.win === m}" data-act="alWin" data-n="${m}">${m} min</button>`).join('')}</div></div>
    <div class="al-block"><p class="al-h">${tr('Look')}</p>
      <div class="al-cnt">${Object.entries(AL_BGS).map(([k, [c, n]]) => `<button type="button" class="al-swatch ${a.bg === k ? 'on' : ''}" aria-pressed="${a.bg === k}" aria-label="${tr(n)}" data-act="alBg" data-k="${k}" style="background:${c}"></button>`).join('')}
        <label class="al-swatch al-swatch-photo ${a.bg === 'photo' ? 'on' : ''}" aria-label="${tr('Your photo')}" ${img.bg ? `style="background:url(${img.bg}) center/cover"` : ''}>${img.bg ? '' : '＋'}<input type="file" accept="image/*" data-input="alBgImg" hidden></label></div>
      <div class="al-line"><span>${tr('Text')}</span><div class="al-cnt"><button type="button" class="chip ${a.text === 'light' ? 'on' : ''}" aria-pressed="${a.text === 'light'}" data-act="alText" data-k="light">${tr('White')}</button><button type="button" class="chip ${a.text === 'dark' ? 'on' : ''}" aria-pressed="${a.text === 'dark'}" data-act="alText" data-k="dark">${tr('Black')}</button></div></div>
      <div class="al-preview" style="${alarmLook()}"><span class="tnum">${alarmTime()}</span><small>${tr('Good morning')}</small></div>
    </div>
    <button class="btn primary block" type="button" data-act="alarmTry">${tr('Try it now')}</button>
    <button class="skip" type="button" data-act="sheetClose">${tr('Done')}</button>`;
  /* Changing a setting redraws the open sheet in place, so it doesn't slide in again or lose its scroll */
  const open = document.querySelector('#sheet .sheet.al-sheet');
  if (open) { const y = open.scrollTop; open.innerHTML = `<div class="grab"></div>${html}`; open.scrollTop = y; return; }
  openSheet(html, b => b.querySelector('.sheet').classList.add('al-sheet'));
}
function alarmLook() {
  const a = alarmCfg(), img = alarmImg(); const fg = a.text === 'dark' ? '#10131a' : '#f5f7fb';
  const bg = a.bg === 'photo' && img.bg ? `linear-gradient(rgba(0,0,0,${a.text === 'dark' ? 0 : .25}),rgba(0,0,0,${a.text === 'dark' ? 0 : .35})),url(${img.bg}) center/cover` : (AL_BGS[a.bg] || AL_BGS.night)[0];
  return `--al-fg:${fg};background:${bg};color:${fg}`;
}

/* ---------- Ringing ---------- */
const AL_WORDS = { en: ['window', 'kitchen', 'morning', 'breakfast', 'toothbrush', 'sunlight', 'slippers', 'blanket', 'kettle', 'curtain', 'shower', 'orange'],
  fi: ['ikkuna', 'keittiö', 'aamupala', 'hammasharja', 'auringonvalo', 'tossut', 'peitto', 'vedenkeitin', 'verho', 'suihku', 'appelsiini', 'kahvikuppi'] };
const AL_PHRASE = () => tr("I'm up and I'm full of energy");
const rndI = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const normTxt = s => String(s).toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
function alMaths(level) {
  if (level === 'super') { const x = rndI(1, 9), y = rndI(1, 9); return { q: `${x} + ${y}`, a: x + y }; }
  if (level === 'easy') { if (Math.random() < .5) { const x = rndI(11, 49), y = rndI(11, 49); return { q: `${x} + ${y}`, a: x + y }; } const x = rndI(30, 90), y = rndI(11, x - 10); return { q: `${x} − ${y}`, a: x - y }; }
  if (level === 'normal') { if (Math.random() < .5) { const x = rndI(3, 9), y = rndI(6, 12); return { q: `${x} × ${y}`, a: x * y }; } const x = rndI(120, 480), y = rndI(35, 99); return { q: `${x} + ${y}`, a: x + y }; }
  const r = Math.random();
  if (r < .34) { const x = rndI(12, 19), y = rndI(7, 13); return { q: `${x} × ${y}`, a: x * y }; }
  if (r < .67) { const d = rndI(6, 13), q = rndI(12, 24); return { q: `${d * q} ÷ ${d}`, a: q }; }
  const x = rndI(4, 9), y = rndI(6, 12), z = rndI(15, 60); return { q: `${x} × ${y} + ${z}`, a: x * y + z };
}
let ALARM = null;
function alQueue() { const a = alarmCfg(), img = alarmImg(); return ['photo', 'maths', 'spell', 'puzzle'].filter(k => a.tasks[k] > 0 && (k !== 'photo' || img.ref)).map(k => ({ t: k, need: k === 'photo' ? 1 : a.tasks[k], done: 0, drops: 0, fails: 0 })); }
function alNewItem() {
  const s = ALARM.sets[ALARM.idx]; if (!s) return;
  const lang = LANG === 'fi' ? 'fi' : 'en';
  if (s.t === 'maths') s.item = alMaths(alarmCfg().level);
  if (s.t === 'spell') { let w; do { w = AL_WORDS[lang][rndI(0, AL_WORDS[lang].length - 1)]; } while (w === s.item?.word); s.item = { word: w }; }
  if (s.t === 'puzzle') s.item = { order: [1, 2, 3, 4, 5, 6].sort(() => Math.random() - .5), at: 0 };
  if (s.t === 'photo') s.item = { tries: s.item?.tries || 0 };
  ALARM.deadline = s.t === 'photo' ? 0 : Date.now() + AL_Q_SECS * 1000;
  ALARM.wrong = false;
}
function ringAlarm(test) {
  if (ALARM && ALARM.phase !== 'stay') return; document.getElementById('alarm')?.remove();
  ALARM = { test, phase: 'tasks', sets: alQueue(), idx: 0, msg: '' };
  if (!test) { const a = alarmCfg(); a.check = null; save(); }
  alNewItem();
  const o = document.createElement('div'); o.id = 'alarm'; o.className = 'alarm'; o.setAttribute('role', 'alertdialog'); o.setAttribute('aria-label', tr('Wake-up alarm'));
  document.body.appendChild(o); renderAlarm(); alSound(true);
}
function alSound(on) {
  clearInterval(ALARM?.timer); if (!on || !ALARM) return;
  const ring = () => { if (!ALARM || ALARM.phase === 'stay') return; const keep = S.settings.sound; S.settings.sound = true; chime('big'); S.settings.sound = keep; };
  ring(); ALARM.timer = setInterval(ring, 2600);
}
function renderAlarm() {
  const o = document.getElementById('alarm'); if (!o || !ALARM) return;
  o.setAttribute('style', alarmLook());
  const now = new Date(); const clock = `<p class="al-time tnum">${now.toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit' })}</p>`;
  const msg = ALARM.msg ? `<p class="al-msg ${ALARM.msgKind || ''}" role="status">${esc(ALARM.msg)}</p>` : '<p class="al-msg" role="status"></p>';
  if (ALARM.phase === 'confirm') {
    o.innerHTML = `<div class="al-in">${clock}<h1 class="h1">${tr('Am I really awake?')}</h1>
      <div class="al-card"><div class="al-top"><span>${tr('Type this to confirm')}</span><span class="al-cd tnum" id="alCd">${AL_CONFIRM_SECS} s</span></div>
      <p class="al-phrase">“${esc(AL_PHRASE())}”</p>
      <form data-form="alConfirm" class="al-form" autocomplete="off"><input type="text" id="alAns" autocomplete="off" autocapitalize="sentences" spellcheck="false" aria-label="${tr('Type this to confirm')}"><button class="btn primary" type="submit">${tr('Confirm')}</button></form></div>
      ${msg}<p class="small al-note2">${tr('If the time runs out, the alarm rings again.')}</p></div>`;
    setTimeout(() => document.getElementById('alAns')?.focus(), 60); return;
  }
  const s = ALARM.sets[ALARM.idx];
  const prog = ALARM.sets.map((x, i) => `<span class="al-pill ${i < ALARM.idx ? 'done' : i === ALARM.idx ? 'now' : ''}">${AL_TYPES[x.t][1]} ${x.t === 'photo' ? '' : `${Math.min(x.done, x.need)}/${x.need}`}</span>`).join('');
  let task = '';
  if (s.t === 'maths') task = `<div class="al-top"><span>${tr('Solve it')}</span><span class="al-cd tnum" id="alCd">${AL_Q_SECS} s</span></div><p class="al-q tnum">${s.item.q} = ?</p>
    <form data-form="alAnswer" class="al-form" autocomplete="off"><input type="text" inputmode="numeric" pattern="[0-9]*" id="alAns" autocomplete="off" aria-label="${tr('Your answer')}"><button class="btn primary" type="submit">${tr('Check')}</button></form>`;
  if (s.t === 'spell') task = `<div class="al-top"><span>${tr('Spell this word')}</span><span class="al-cd tnum" id="alCd">${AL_Q_SECS} s</span></div><p class="al-q al-word">${esc(s.item.word.toUpperCase().split('').join(' '))}</p>
    <form data-form="alAnswer" class="al-form" autocomplete="off"><input type="text" id="alAns" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="${tr('Your answer')}"><button class="btn primary" type="submit">${tr('Check')}</button></form>`;
  if (s.t === 'puzzle') task = `<div class="al-top"><span>${tr('Tap 1 to 6 in order')}</span><span class="al-cd tnum" id="alCd">${AL_Q_SECS} s</span></div>
    <div class="al-taps three">${s.item.order.map(n => `<button type="button" class="al-tap ${n <= s.item.at ? 'ok' : ''}" data-act="alTap" data-k="${n}">${n}</button>`).join('')}</div>`;
  if (s.t === 'photo') { const img = alarmImg(); task = `<div class="al-top"><span>${tr('Take a photo of your object')}</span></div>
    <div class="al-photo"><img src="${img.ref}" alt="${tr('Your object')}"><p class="small">${tr('Walk to it and take a photo from about the same angle.')}</p></div>
    <label class="btn primary block">${tr('Take a photo')}<input type="file" accept="image/*" capture="environment" data-input="alShot" hidden></label>
    ${s.item.tries >= 3 ? `<button type="button" class="skip" data-act="alPhotoSkip">${tr('It doesn’t recognise it. Give me 3 sums instead')}</button>` : ''}`; }
  o.innerHTML = `<div class="al-in">${clock}<h1 class="h1">${tr('Good morning')}${S.name ? ', ' + esc(S.name) : ''}</h1>
    <div class="al-pills">${prog}</div><div class="al-card ${ALARM.wrong ? 'shake' : ''}">${task}</div>${msg}
    ${ALARM.test ? `<button type="button" class="skip" data-act="alQuit">${tr('End the test')}</button>` : ''}</div>`;
  if (s.t !== 'puzzle' && s.t !== 'photo') setTimeout(() => document.getElementById('alAns')?.focus(), 60);
}
function alSay(m, kind) { ALARM.msg = tr(m); ALARM.msgKind = kind || ''; }
function alRight() {
  const s = ALARM.sets[ALARM.idx]; s.done++;
  if (s.done >= s.need) { ALARM.idx++; alSay('Nice. Next one.', 'ok'); if (ALARM.idx >= ALARM.sets.length) return alTasksDone(); }
  else alSay('Yes! Keep going.', 'ok');
  alNewItem(); renderAlarm();
}
/* Time ran out: the first question just starts over; after that you lose one from the count. The count can only drop a few times, so it never gets stuck. */
function alMiss() {
  const s = ALARM.sets[ALARM.idx]; if (!s) return;
  if (s.done === 0) alSay('Time ran out. This one starts again.', 'bad');
  else if (s.drops < AL_MAX_DROPS) { s.done--; s.drops++; alSay('Time ran out. One back.', 'bad'); }
  else alSay('Time ran out. Here’s a new one.', 'bad');
  alNewItem(); renderAlarm();
}
function alTasksDone() {
  clearInterval(ALARM.timer); const a = alarmCfg();
  chime('soft');
  if (ALARM.test) { ALARM.phase = 'confirm'; ALARM.deadline = Date.now() + AL_CONFIRM_SECS * 1000; ALARM.msg = ''; renderAlarm(); return; } // a test goes straight to the check
  const end = Date.now() + a.win * 60000;
  a.check = { day: dayKey(), end, wokeAt: Date.now() }; save();
  try { NATIVE?.postMessage({ type: 'alarmHold', seconds: a.win * 60 + AL_CONFIRM_SECS }); } catch (e) {}
  ALARM.phase = 'stay'; const o = document.getElementById('alarm'); if (o) { o.id = ''; o.classList.add('out'); setTimeout(() => o.remove(), 500); }
  const nx = nextStep(); toast(`${tr('Nice! Awake check in')} ${a.win} min.${nx ? ' ' + tr('First step:') + ' ' + tr(nx.st.text) : ''}`);
  S.tab = 'today'; render();
}
function alConfirmOpen() {
  if (ALARM && ALARM.phase !== 'stay') return;
  document.getElementById('alarm')?.remove();
  ALARM = { test: false, phase: 'confirm', sets: [], idx: 0, msg: '', deadline: Date.now() + AL_CONFIRM_SECS * 1000 };
  const o = document.createElement('div'); o.id = 'alarm'; o.className = 'alarm'; o.setAttribute('role', 'alertdialog'); o.setAttribute('aria-label', tr('Am I really awake?'));
  document.body.appendChild(o); renderAlarm(); chime('soft');
}
function alAwake() {
  const test = ALARM.test; clearInterval(ALARM.timer); ALARM = null;
  const o = document.getElementById('alarm'); if (o) { o.id = ''; o.classList.add('out'); setTimeout(() => o.remove(), 500); }
  if (test) { toast(tr('That’s how it works. The real one rings at') + ' ' + alarmTime()); return; }
  const a = alarmCfg(); const woke = a.check?.wokeAt || Date.now(); a.check = null; a.done = dayKey();
  /* You're up for real: the morning moves to when you actually woke (the evening stays, for sleep) */
  const at = new Date(woke); const hm = minHM(at.getHours() * 60 + at.getMinutes());
  let mins = Math.round((hmMin(hm) - hmMin(alarmTime())) / 5) * 5; mins = Math.max(-90, Math.min(150, mins));
  S.wake = { day: dayKey(), at: hm, mins: Math.abs(mins) >= 15 ? mins : 0 };
  save(); try { NATIVE?.postMessage({ type: 'alarmDone' }); } catch (e) {}
  syncNativeReminders(); syncNativeWidget(); chime('soft'); S.tab = 'today'; render();
  toast(S.wake.mins ? `${tr('You’re up! Morning moved')} ${S.wake.mins > 0 ? '+' : '−'}${Math.abs(S.wake.mins)} min.` : tr('You’re up! Have a good morning.'));
}
/* Timers: a per-question countdown while ringing, then the awake check */
setInterval(() => {
  const t = Date.now();
  if (ALARM && ALARM.phase !== 'stay' && ALARM.deadline) {
    const left = Math.ceil((ALARM.deadline - t) / 1000);
    const el = document.getElementById('alCd'); if (el) { el.textContent = Math.max(0, left) + ' s'; el.classList.toggle('low', left <= 10); }
    if (left <= 0) { if (ALARM.phase === 'confirm') { if (ALARM.test) { ALARM.deadline = Date.now() + AL_CONFIRM_SECS * 1000; alSay('Time ran out. In the real one, the alarm would ring again now.', 'bad'); renderAlarm(); } else { ALARM = null; ringAlarm(false); ALARM.msg = tr('No answer, so the alarm rings again.'); ALARM.msgKind = 'bad'; renderAlarm(); } } else alMiss(); }
  }
  const c = S.alarm?.check;
  if (c && c.day === dayKey() && !document.hidden && (!ALARM || ALARM.phase === 'stay')) {
    if (t >= c.end + AL_CONFIRM_SECS * 1000) { ALARM = null; ringAlarm(false); alSay('You didn’t confirm, so the alarm rings again.', 'bad'); renderAlarm(); }
    else if (t >= c.end) alConfirmOpen();
  }
  const pill = document.getElementById('alCheck');
  if (pill) { if (c && t < c.end) pill.querySelector('b').textContent = fmtMS(Math.ceil((c.end - t) / 1000)); else pill.remove(); }
}, 500);
const fmtMS = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
/* A small badge on Today while Terra waits to check you're really up */
function alarmCheckPill() {
  const c = S.alarm?.check; if (!c || c.day !== dayKey() || Date.now() >= c.end) return '';
  return `<div class="al-check" id="alCheck" role="status"><span aria-hidden="true">⏳</span><span>${tr('Awake check in')} <b class="tnum">${fmtMS(Math.ceil((c.end - Date.now()) / 1000))}</b></span></div>`;
}
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f || !ALARM) return;
  if (f.dataset.form === 'alAnswer') {
    e.preventDefault(); const s = ALARM.sets[ALARM.idx]; const v = document.getElementById('alAns')?.value || '';
    if (!v.trim()) return;
    const ok = s.t === 'maths' ? +v.replace(/\D/g, '') === s.item.a : normTxt(v) === normTxt(s.item.word);
    if (ok) alRight(); else { ALARM.wrong = true; alSay('Not quite. Try again.', 'bad'); renderAlarm(); }
  }
  if (f.dataset.form === 'alConfirm') {
    e.preventDefault(); const v = document.getElementById('alAns')?.value || '';
    if (normTxt(v) === normTxt(AL_PHRASE())) alAwake(); else { alSay('Almost. Type it exactly as shown.', 'bad'); const keep = v; renderAlarm(); const i = document.getElementById('alAns'); if (i) i.value = keep; }
  }
});
document.addEventListener('change', async e => {
  const k = e.target.dataset?.input; if (!['alRef', 'alBgImg', 'alShot'].includes(k)) return;
  const file = e.target.files?.[0]; if (!file) return;
  try {
    const img = alarmImg();
    if (k === 'alBgImg') { const c = await readImage(file, 900); img.bg = c.toDataURL('image/jpeg', .72); saveAlarmImg(); alarmCfg().bg = 'photo'; save(); alarmSheet(); render(); }
    if (k === 'alRef') { const c = await readImage(file, 600); const th = await readImage(file, 220); img.ref = th.toDataURL('image/jpeg', .8); img.sig = photoSig(c); saveAlarmImg(); alarmCfg().tasks.photo = 1; save(); alarmSheet(); render(); toast(tr('Got it. That’s your morning object.')); }
    if (k === 'alShot' && ALARM) {
      const c = await readImage(file, 600); const s = ALARM.sets[ALARM.idx];
      const score = photoMatch(img.sig, photoSig(c));
      if (score >= .42) { alSay('That’s it! Found it.', 'ok'); alRight(); }
      else { s.item.tries = (s.item.tries || 0) + 1; ALARM.wrong = true; alSay('That doesn’t look like your object. Try again from the same angle.', 'bad'); renderAlarm(); }
    }
  } catch (err) { toast(tr('That picture couldn’t be opened. Try another one.')); }
  e.target.value = '';
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const k = b.dataset.k, n = +b.dataset.n, a = alarmCfg();
  switch (b.dataset.act) {
    case 'alarmOn': a.on = !a.on; if (a.on && S.settings.notify !== 'on') askNotify(); save(); render(); if (a.on) toast(`${tr('Alarm set for')} ${alarmTime()}`); break;
    case 'alarmMode': a.mode = k; save(); render(); break;
    case 'alarmSheet': alarmSheet(); break;
    case 'alarmTry': closeSheet?.(); ringAlarm(true); break;
    case 'alQuit': clearInterval(ALARM?.timer); ALARM = null; document.getElementById('alarm')?.remove(); break;
    case 'alCount': a.tasks[k] = n; if (!Object.values(a.tasks).some(x => x > 0)) a.tasks[k] = 1; save(); alarmSheet(); render(); break;
    case 'alPhoto': if (n && !alarmImg().ref) { toast(tr('First take a photo of your object.')); break; } a.tasks.photo = n; if (!Object.values(a.tasks).some(x => x > 0)) a.tasks.maths = 1; save(); alarmSheet(); render(); break;
    case 'alLevel': a.level = k; save(); alarmSheet(); break;
    case 'alWin': a.win = n; save(); alarmSheet(); render(); break;
    case 'alBg': a.bg = k; save(); alarmSheet(); render(); break;
    case 'alText': a.text = k; save(); alarmSheet(); render(); break;
    case 'alarmSave': { const v = document.getElementById('alarmDraft')?.value; if (/^\d{2}:\d{2}$/.test(v)) { a.time = v; a.mode = 'custom'; a.done = ''; save(); render(); toast(`${tr('Alarm set for')} ${v}`); } break; }
    case 'alTap': { if (!ALARM) break; const s = ALARM.sets[ALARM.idx]; const v = +k; if (v === s.item.at + 1) { s.item.at = v; if (v === 6) return alRight(); ALARM.msg = ''; } else { s.item.at = 0; ALARM.wrong = true; alSay('Wrong order. From 1 again.', 'bad'); } renderAlarm(); break; }
    case 'alPhotoSkip': { const s = ALARM.sets[ALARM.idx]; s.t = 'maths'; s.need = 3; s.done = 0; alNewItem(); alSay('Okay, three sums instead.', ''); renderAlarm(); break; }
  }
});
/* The iPhone wheel reports every turn as a change, so the new time is only a draft until "Set" is pressed */
['input', 'change'].forEach(ev => document.addEventListener(ev, e => { if (e.target.dataset?.input !== 'alarmDraft') return; const v = e.target.value; const l = e.target.closest('label')?.querySelector('.tnum'); if (l && /^\d{2}:\d{2}$/.test(v)) l.textContent = v; const b = document.getElementById('alarmSave'); if (b) b.hidden = !/^\d{2}:\d{2}$/.test(v) || v === alarmTime(); }));
/* it rings when the time comes while Terra is open, or when you open Terra later that morning (for example from the alarm) */
function checkAlarm() {
  const a = alarmCfg(); if (!a.on || !S.onboarded || a.done === dayKey() || ALARM || (a.check && a.check.day === dayKey())) return;
  const [h, m] = alarmTime().split(':').map(Number); const now = new Date(); const diff = (now.getHours() * 60 + now.getMinutes()) - (h * 60 + m);
  if (diff >= 0 && diff <= 180) ringAlarm(false);
}
setInterval(checkAlarm, 15000); document.addEventListener('visibilitychange', () => { if (!document.hidden) checkAlarm(); }); setTimeout(checkAlarm, 3000);

/* "Did you just wake up?" The first time Terra opens in the morning it asks, and a yes moves today's
   morning a little (and the afternoon half as much) to match when you actually got up. Evenings stay put, for sleep. */
const WAKE_F = { morning: 1, day: .5, evening: 0 };
const hmMin = t => (+t.slice(0, 2)) * 60 + (+t.slice(3, 5));
const minHM = m => { m = Math.max(0, Math.min(23 * 60 + 59, Math.round(m))); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
function wakeToday() { const w = S.wake; return w && w.day === dayKey() && w.mins ? w : null; }
function plannedWake() { return S.alarm?.on ? alarmTime() : slotTime('morning'); }
function remSlot(r) { const rt = r.rid && S.routines.find(x => x.id === r.rid); if (rt && WAKE_F[rt.slot] != null) return rt.slot; const h = +r.time.slice(0, 2); return h < 11 ? 'morning' : h < 17 ? 'day' : 'evening'; }
/* Today's time for a reminder: its usual time, moved with the wake-up when there is one */
function remAt(r) {
  const w = wakeToday(); if (!w || !/^\d{2}:\d{2}$/.test(r.time || '')) return r.time;
  const slot = remSlot(r), f = WAKE_F[slot] || 0; if (!f) return r.time;
  let m = hmMin(r.time) + Math.round(w.mins * f / 5) * 5;
  if (slot === 'morning') m = Math.max(m, hmMin(w.at) + 10); // a gentle 10 minutes to wake up first
  return minHM(m);
}
/* iPhone notifications: today at the moved time, the next six days at the usual time (Terra refreshes them when it opens) */
function wakeWeek(base, today) {
  const out = []; const d = new Date();
  for (let i = 0; i < 7; i++) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); out.push({ d: dayKey(x), t: i ? base : today }); }
  return out;
}
function wakeNote() {
  const w = wakeToday(); if (!w) return '';
  return `<button class="dark-note wake-note" type="button" data-act="wakeUndo"><span aria-hidden="true">☀️</span><span>${tr('Morning moved')} ${w.mins > 0 ? '+' : '−'}${Math.abs(w.mins)} min · ${tr('Undo')}</span></button>`;
}
function maybeAskWake() {
  if (!S.onboarded || ALARM || document.getElementById('sheet') || document.getElementById('alarm') || document.hidden) return;
  const now = new Date(), h = now.getHours(), dk = dayKey();
  if (h < 4 || h >= 13 || S.wakeAsked === dk || !S.routines.length) return;
  if (S.alarm?.on && S.alarm.done === dk) { S.wakeAsked = dk; save(); return; } // woke up with Terra's alarm: right on time
  if (totals().done > 0) { S.wakeAsked = dk; save(); return; } // already under way
  S.wakeAsked = dk; save();
  openSheet(`<div class="wake-ask"><div class="wa-sun" aria-hidden="true">🌅</div><h2 class="h2">${tr('Did you just wake up?')}</h2>
    <p class="small">${tr('I can fit today’s routines to when you got up.')}</p>
    <div class="stack" style="margin-top:14px"><button class="btn primary block" type="button" data-act="wakeYes">${tr('Yes, just now')}</button>
    <button class="btn ghost block" type="button" data-act="wakeNo">${tr('No, I’ve been up a while')}</button></div></div>`);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (b.dataset.act === 'wakeYes') {
    const now = new Date(); const at = minHM(now.getHours() * 60 + now.getMinutes());
    let mins = Math.round((hmMin(at) - hmMin(plannedWake())) / 5) * 5; mins = Math.max(-90, Math.min(150, mins));
    closeSheet();
    if (Math.abs(mins) < 15) { S.wake = { day: dayKey(), at, mins: 0 }; save(); render(); toast(tr('Right on time! Today stays as planned.')); }
    else { S.wake = { day: dayKey(), at, mins }; save(); render(); syncNativeReminders(); syncNativeWidget(); toast(`${tr('Morning moved')} ${mins > 0 ? '+' : '−'}${Math.abs(mins)} min. ${tr('Evening stays the same.')}`); }
  }
  if (b.dataset.act === 'wakeNo') closeSheet();
  if (b.dataset.act === 'wakeUndo') { S.wake = null; save(); render(); syncNativeReminders(); syncNativeWidget(); toast(tr('Back to your usual times.')); }
});
/* The morning question is gone: Terra knows you're up when you finish the alarm and its awake check. */

/* Terra suggests the alarm itself: a small card while it's off, snoozed for 3 days on "Not now" */
function alarmPrompt() {
  const a = alarmCfg(); if (a.on || (a.askAt || 0) > Date.now() || !S.routines.length) return '';
  return `<section class="card alarm-ask"><div class="aa-ic" aria-hidden="true">⏰</div><div class="aa-body"><p class="eyebrow">Alarm</p><h2 class="h2" style="font-size:19px">Set an alarm for tomorrow?</h2>
    <p class="small">Your first routine starts at ${alarmTime()}. A small twist switches it off, so you really get up.</p>
    <div class="rc-btns"><button class="btn small primary" type="button" data-act="alarmQuick">Set alarm for ${alarmTime()}</button><button class="btn small ghost" type="button" data-act="alarmLater">Not now</button></div></div></section>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = alarmCfg();
  if (b.dataset.act === 'alarmQuick') { a.on = true; a.mode = 'auto'; if (S.settings.notify !== 'on') askNotify(); save(); render(); toast(`${tr('Alarm set for')} ${alarmTime()}`); }
  if (b.dataset.act === 'alarmLater') { a.askAt = Date.now() + 3 * 864e5; save(); render(); }
  if (b.dataset.act === 'openClock') { try { NATIVE?.postMessage({ type: 'openClock' }); } catch (err) {} }
});

/* Coming back to Today (from the background, an alarm or a notification) starts at the top, so the scene is never cut off under the status bar. */
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.onboarded && S.tab === 'today') window.scrollTo({ top: 0 }); });

/* Leaving the app: make sure the widget shows the latest step. */
document.addEventListener('visibilitychange', () => { if (document.hidden) { nativeWidgetSig = ''; syncNativeWidget(); } });

/* Quick buttons in the iOS widget open Terra straight at the right place (terra://add-reminder and friends). */
window.terraOpen = k => {
  try {
    if (!S.onboarded) return;
    closeSheet();
    const go = t => { S.tab = t; S.youSec = null; save(); render(); window.scrollTo({ top: 0 }); };
    if (k === 'add-reminder') { go('routines'); remSheet(); }
    else if (k === 'new-routine') { go('routines'); routineSheet(); }
    else if (k === 'log-workout') { go('workouts'); workoutSheet(); }
    else if (k === 'breathe') go('mindful');
    else if (k === 'routines') go('routines');
    else go('today');
  } catch (e) {}
};
