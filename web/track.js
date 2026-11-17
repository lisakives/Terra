/* ============ Terra: Track — workouts, mood, privacy ============ */
/* Health data (mood check-ins) lives ONLY in this browser/device.
   It is never written to the account sync and never sent to Terra AI, except the optional
   high-level summary the person turns on in Settings → Privacy (workouts + mood totals). */
const HLS = 'terra.health.v1';
function freshHealth() {
  return { v: 1, consent: { mood: false, aiSummary: false }, asked: { mood: false }, moods: [], fb: {} };
}
let H = freshHealth();
try {
  const raw = localStorage.getItem(HLS);
  if (raw) { const p = JSON.parse(raw); const f = freshHealth(); H = Object.assign(f, p); H.consent = Object.assign(f.consent, p.consent || {}); H.asked = Object.assign({ mood: false }, p.asked || {}); delete H.cycle; delete H.screen; H.fb ||= {}; }
} catch (e) {}
function saveH() {
  const cut = Date.now() - 400 * 864e5;
  H.moods = H.moods.filter(m => m.t > cut).slice(-1500);
  try { localStorage.setItem(HLS, JSON.stringify(H)); } catch (e) {}
}

/* ---------- dates ---------- */
const p2 = n => String(n).padStart(2, '0');
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dayKey(d); };
const fmtDay = k => parseKey(k).toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' });
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
function weekStart(d = new Date()) { const x = new Date(d); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return dayKey(x); }

/* ---------- rank / XP ---------- */
/* Rename the ladder here. Top rank is the last entry. */
const RANKS = [['Beginner', 0, '🌱'], ['Starter', 100, '🌿'], ['Builder', 300, '🪴'], ['Steady', 600, '🌳'], ['Athlete', 1000, '⚡️'], ['Warrior', 1600, '🔥'], ['Legend', 2500, '👑']];
const XP = { step: 5, reminder: 3, workout: 20, moment: 10, checkin: 2 };
const rankOf = xp => RANKS.reduce((i, r, j) => xp >= r[1] ? j : i, 0);
function addXP(n) {
  const before = rankOf(S.xp || 0);
  S.xp = Math.max(0, (S.xp || 0) + n);
  const after = rankOf(S.xp);
  if (after > before) setTimeout(() => celebrate(`You're now ${RANKS[after][0]} ${RANKS[after][2]}`, `${S.xp} XP, all from small steps. Every one of them counted.`), 1100);
}
function initXP() {
  if (typeof S.xp === 'number') return;
  S.xp = Object.values(S.log).reduce((a, l) => a + (l.s?.length || 0) * XP.step + (l.r?.length || 0) * XP.reminder + (l.m ? XP.moment : 0), 0) + (S.workouts || []).length * XP.workout;
}
/* ---------- workouts ---------- */
const WTYPES = [['Walk', '🚶'], ['Run', '🏃'], ['Gym', '🏋️'], ['Yoga', '🧘'], ['Cycling', '🚴'], ['Swim', '🏊'], ['Home workout', '🤸'], ['Other', '✨']];
const wEmoji = t => (WTYPES.find(w => w[0] === t) || WTYPES[7])[1];
const wDays = () => new Set((S.workouts || []).map(w => w.d));
function wStats() {
  const W = S.workouts || []; const ws = weekStart(); const now = new Date();
  const mk = `${now.getFullYear()}-${p2(now.getMonth() + 1)}`;
  const week = W.filter(w => w.d >= ws).length; const month = W.filter(w => w.d.startsWith(mk)).length;
  const goal = S.wGoal || 3;
  let streakW = 0; let k = ws; if (week < goal) k = addDays(ws, -7);
  for (let i = 0; i < 104; i++) { const end = addDays(k, 7); const c = W.filter(w => w.d >= k && w.d < end).length; if (c >= goal) { streakW++; k = addDays(k, -7); } else break; }
  return { week, month, total: W.length, goal, streakW, mins: W.filter(w => w.d.startsWith(mk)).reduce((a, w) => a + w.mins, 0) };
}
function logWorkout(w) {
  const before = wStats().week;
  const rec = { id: uid(), d: dayKey(new Date(Date.now() - (w.ago || 0) * 864e5)), type: w.type, mins: clamp(Number(w.mins) || 30, 1, 600), effort: w.effort || 'Medium' };
  (S.workouts ||= []).push(rec); S.workouts.sort((a, b) => a.d.localeCompare(b.d));
  addXP(XP.workout); save(); closeSheet(); chime(); render();
  const st = wStats();
  if (before < st.goal && st.week >= st.goal) celebrate('Weekly goal reached', `${st.week} workout${st.week > 1 ? 's' : ''} this week. Your body says thanks.`);
  else toast(`${wEmoji(rec.type)} ${rec.type} logged · +${XP.workout} XP`);
  if (H.consent.mood) setTimeout(() => moodSheet('workout'), 900);
  return rec;
}
function workoutSheet() {
  const last = (S.workouts || []).at(-1);
  const ti = last ? Math.max(0, WTYPES.findIndex(x => x[0] === last.type)) : 0;
  openSheet(`<h2 class="h2">Log a workout</h2>
    ${last ? `<button class="btn block" type="button" data-act="wSame">${IC.reset} Same as last time · ${esc(last.type)}, ${last.mins} min</button>` : ''}
    <form class="stack" data-form="workout">
      <div class="field"><label>What did you do?</label><div class="chips" data-group="type">${WTYPES.map(([t, e], i) => `<button type="button" class="chip ${i === ti ? 'on' : ''}" data-v="${t}">${e} ${t}</button>`).join('')}</div></div>
      <div class="field"><label>How long?</label><div class="chips" data-group="mins">${[10, 20, 30, 45, 60, 90].map(n => `<button type="button" class="chip ${n === (last?.mins || 30) ? 'on' : ''}" data-v="${n}">${n} min</button>`).join('')}</div>
        <div class="dur-pick"><span class="small">Or set the exact time</span><label class="time-chip big" aria-label="Workout duration, hours and minutes">${IC.snooze}<span class="tnum" id="wDurTxt"></span><input type="time" id="wDur" value="${durHM(last?.mins || 30)}" step="60"></label></div></div>
      <div class="field"><label>How did it feel?</label><div class="seg" data-group="effort">${['Easy', 'Medium', 'Hard'].map(x => `<button type="button" class="${x === 'Medium' ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div></div>
      <div class="field"><label>When?</label><div class="seg" data-group="ago"><button type="button" class="on" data-v="0">Today</button><button type="button" data-v="1">Yesterday</button><button type="button" data-v="2">2 days ago</button></div></div>
      <button class="btn primary block" type="submit">Save workout</button>
    </form>`, b => {
    groupPicker(b);
    /* The exact duration uses the phone's own wheel picker (hours and minutes) */
    const inp = b.querySelector('#wDur'), txt = b.querySelector('#wDurTxt');
    const paint = () => { const m = hmMins(inp.value); txt.textContent = durLabel(m); };
    b.querySelector('[data-group="mins"]').addEventListener('click', e => { const t = e.target.closest('[data-v]'); if (t) { inp.value = durHM(Number(t.dataset.v)); paint(); } });
    const own = () => { b.querySelectorAll('[data-group="mins"] > [data-v]').forEach(x => x.classList.remove('on')); paint(); };
    inp.addEventListener('input', own); inp.addEventListener('change', own);
    paint();
  });
}
const durHM = m => `${p2(Math.floor(m / 60))}:${p2(m % 60)}`;
const hmMins = v => { const [h, m] = String(v || '0:30').split(':').map(Number); return clamp((h || 0) * 60 + (m || 0), 1, 600); };
const durLabel = m => { const h = Math.floor(m / 60), mm = m % 60, fi = LANG === 'fi'; return h ? `${h} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
function groupPicker(b) {
  b.addEventListener('click', e => { const t = e.target.closest('[data-group] > [data-v]'); if (!t) return; t.parentElement.querySelectorAll(':scope > [data-v]').forEach(x => x.classList.toggle('on', x === t)); });
}
const groupVal = (f, g) => f.querySelector(`[data-group="${g}"] > .on`)?.dataset.v;
function monthGrid() {
  const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1); const lead = (first.getDay() + 6) % 7; const n = new Date(y, m + 1, 0).getDate();
  const wd = wDays(); const today = dayKey();
  let cells = WD().map(l => `<i class="hd">${l}</i>`).join('') + '<i class="blank"></i>'.repeat(lead);
  for (let d = 1; d <= n; d++) { const k = `${y}-${p2(m + 1)}-${p2(d)}`; cells += `<i class="${wd.has(k) ? 'on' : ''} ${k === today ? 'today' : ''} ${k > today ? 'fut' : ''}">${wd.has(k) ? wEmoji(S.workouts.filter(w => w.d === k).at(-1).type) : d}</i>`; }
  return `<div class="month" aria-label="${now.toLocaleDateString(LOC(), { month: 'long' })} workouts">${cells}</div>`;
}
function secWorkouts() {
  const st = wStats(); const W = [...(S.workouts || [])].reverse().slice(0, 8);
  return `<section class="card stack" style="gap:16px">
      <div class="row between"><div><p class="eyebrow">This week</p><h2 class="h2 tnum" style="font-size:26px">${st.week} <span class="small" style="font-size:15px">of ${st.goal} workouts</span></h2></div>${ring(Math.min(st.week, st.goal), st.goal, 'var(--sage)')}</div>
      <button class="btn-done" type="button" data-act="wLog"><span class="l">${IC.plus} Log a workout</span>${IC.arrow}</button>
      <div class="stats"><div class="stat"><b class="tnum">${st.month}</b><small>this month</small></div><div class="stat"><b class="tnum">${st.mins}</b><small>minutes this month</small></div><div class="stat"><b class="tnum">${st.streakW}</b><small>week${st.streakW === 1 ? '' : 's'} on goal</small></div></div>
      <div class="row between"><span class="small">Weekly goal</span><div class="stepper"><button class="icon-btn" type="button" data-act="wGoal" data-k="-1" aria-label="Lower goal">−</button><b class="tnum">${st.goal}×</b><button class="icon-btn" type="button" data-act="wGoal" data-k="1" aria-label="Raise goal">+</button></div></div>
    </section>
    <section class="card"><div class="section-head"><h2 class="h2">${new Date().toLocaleDateString(LOC(), { month: 'long' })}</h2><span class="small tnum">${st.total} in total</span></div>${monthGrid()}</section>
    <section><div class="section-head"><h2 class="h2">Recent</h2></div><div class="list">${W.length ? W.map(w => `<div class="item wrow"><span class="w-ic">${wEmoji(w.type)}</span><div class="txt"><b>${esc(w.type)} · ${w.mins} min</b><small>${fmtDay(w.d)} · ${esc(w.effort)}</small></div><button class="icon-btn" type="button" data-act="wDel" data-id="${w.id}" aria-label="Delete workout">${IC.trash}</button></div>`).join('') : `<p class="empty">No workouts yet. A 10-minute walk counts.</p>`}</div></section>`;
}

/* ---------- mood check-ins ---------- */
const MOODS = [['energized', '⚡️', 'Energized', 5], ['happy', '😊', 'Happy', 5], ['calm', '😌', 'Calm', 4], ['tired', '😴', 'Tired', 2], ['scattered', '😵‍💫', 'Scattered', 2], ['low', '😔', 'Low', 1]];
const MOOD = Object.fromEntries(MOODS.map(m => [m[0], { e: m[1], l: m[2], s: m[3] }]));
const MOOD_REPLY = { energized: 'Love that energy. Use it on one small thing.', happy: 'Nice. Notice what helped today.', calm: 'Calm is a good place to be.', tired: 'Thanks for noticing. Rest counts too.', scattered: 'Okay. Pick just one tiny next step.', low: 'Thanks for telling me. Be gentle with yourself today.' };
/* Five-level feeling scale, asked in the morning, midday and evening, and after a workout */
const LEVELS = [[1, '😣', 'Very heavy'], [2, '😕', 'Heavy'], [3, '😐', 'Okay'], [4, '🙂', 'Good'], [5, '😄', 'Very good']];
const LEVEL_REPLY = { 1: 'That is heavy. Be gentle with yourself today.', 2: 'Thanks for telling me. One small thing is plenty.', 3: 'Okay is a fine place to be.', 4: 'Nice. Notice what helped.', 5: 'Love that. Keep it going, one small step at a time.' };
const SLOT_LBL = { morning: 'Morning', midday: 'Midday', evening: 'Evening', workout: 'After workout' };
const LOAD_V = { 1: 90, 2: 70, 3: 40, 4: 20, 5: 10 };
function feelSlot() { const h = new Date().getHours(); return h >= 5 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'midday' : 'evening'; }
function faceOf(e) { return e.v ? LEVELS[e.v - 1][1] : (MOOD[e.m]?.e || '·'); }
function scoreOf(e) { return e.v || (MOOD[e.m]?.s ?? 3); }
function loadOf(e) { return e.v ? LOAD_V[e.v] : LOAD_W[e.m]; }
function slotDone(sl) { return H.moods.some(m => m.d === dayKey() && m.slot === sl); }
function logLevel(v, src) {
  if (!LEVELS[v - 1]) return;
  const slot = src === 'workout' ? 'workout' : feelSlot();
  H.moods.push({ t: Date.now(), d: dayKey(), v, slot, src: src || 'manual' }); saveH();
  addXP(XP.checkin); save(); closeSheet(); render(); toast(`${LEVELS[v - 1][1]} ${LEVEL_REPLY[v]}`);
}
function levelRow(src) {
  return `<div class="level-row">${LEVELS.map(([v, e, l]) => `<button type="button" class="level" data-act="level" data-v="${v}" data-src="${src}" aria-label="${l}"><span aria-hidden="true">${e}</span><small>${l}</small></button>`).join('')}</div>`;
}
/* Today: the question for this part of the day, until it has been answered */
function checkinCard() {
  const sl = feelSlot();
  return `<section class="card stack checkin" style="gap:12px"><p class="eyebrow">${SLOT_LBL[sl]} check-in</p><h2 class="h2" style="font-size:22px">How do you feel right now?</h2>${levelRow(sl)}<p class="small">${IC.lock.replace('<svg', '<svg width="13" height="13" style="vertical-align:-2px"')} Saved only on this device</p></section>`;
}
function moodConsentSheet(src) {
  openSheet(`<div class="stack" style="gap:14px"><span class="eyebrow">Check-ins</span><h2 class="h2">Track how you feel?</h2>
    <p class="sub">Terra can ask how you feel, for example after a Moment. Over time you'll see what lifts your mood and energy.</p>
    <div><div class="promise"><div class="ic">${IC.lock}</div><div><b>Only on this device</b><p class="small">Check-ins are not synced and not sent to Terra AI.</p></div></div>
    <div class="promise"><div class="ic">${IC.shield}</div><div><b>Yours to stop</b><p class="small">Turn it off in Settings → Privacy. That also deletes your check-ins.</p></div></div></div>
    <button class="btn primary block" type="button" data-act="moodYes" data-k="${esc(src || '')}">Yes, save my check-ins</button>
    <button class="skip" type="button" data-act="moodNo">Not now</button></div>`);
}
function moodSheet(src) {
  if (!H.consent.mood) { moodConsentSheet(src); return; }
  openSheet(`<div class="stack" style="gap:14px"><span class="eyebrow">${src === 'moment' ? 'After your Moment' : src === 'workout' ? 'After your workout' : 'Check-in'}</span><h2 class="h2">How do you feel right now?</h2>
    ${levelRow(esc(src || 'manual'))}
    <p class="small" style="text-align:center">${IC.lock.replace('<svg', '<svg width="13" height="13" style="vertical-align:-2px"')} Saved only on this device</p>
    <button class="skip" type="button" data-act="sheetClose">Skip</button></div>`);
}
function logMood(k, src) {
  if (!MOOD[k]) return;
  H.moods.push({ t: Date.now(), d: dayKey(), m: k, src: src || 'manual' }); saveH();
  addXP(XP.checkin); save(); closeSheet(); render(); toast(`${MOOD[k].e} ${MOOD_REPLY[k]}`);
}
function moodAfterMoment() { if (H.consent.mood) moodSheet('moment'); else if (!H.asked.mood) moodConsentSheet('moment'); }
function dayMood(k) { const a = H.moods.filter(m => m.d === k); return a.length ? a.at(-1) : null; }
/* ---------- stress load: an honest estimate from the person's own check-ins (never a medical measurement) ---------- */
const LOAD_W = { scattered: 85, low: 80, tired: 70, energized: 35, happy: 25, calm: 15 };
function loadEstimate() {
  const now = Date.now(), win = 3 * 864e5;
  const recent = H.moods.filter(m => m.t > now - win && loadOf(m) != null);
  if (!recent.length) return null;
  let sum = 0, wsum = 0;
  for (const m of recent) { const w = 1 / (1 + (now - m.t) / 864e5); sum += loadOf(m) * w; wsum += w; }
  let v = sum / wsum; const why = [];
  const heavy = recent.filter(m => loadOf(m) >= 60).length, light = recent.length - heavy;
  if (heavy) why.push(['+', 'Feeling scattered, low or tired']);
  if (light) why.push(['−', 'Feeling calm or good']);
  const last3 = [0, 1, 2].map(i => addDays(dayKey(), -i));
  const momentDays = last3.filter(k => S.log[k]?.m).length;
  if (momentDays) { v -= Math.min(18, momentDays * 7 + (S.log[dayKey()]?.m ? 4 : 0)); why.push(['−', 'Breathing breaks']); }
  if ((S.workouts || []).some(w => last3.includes(w.d))) { v -= 6; why.push(['−', 'Movement']); }
  if (S.routines.length) {
    const prev = [1, 2, 3].map(i => addDays(dayKey(), -i)); const total = S.routines.reduce((a, r) => a + r.steps.length, 0) * prev.length;
    const done = prev.reduce((a, k) => a + S.routines.reduce((b, r) => b + r.steps.filter(s => S.log[k]?.s?.includes(s.id)).length, 0), 0);
    const rr = total ? done / total : 0;
    if (rr >= .7) { v -= 6; why.push(['−', 'Routines on track']); } else if (rr < .25) { v += 5; why.push(['+', 'Routines hard to keep up with']); }
  }
  v = Math.round(clamp(v, 0, 100));
  const level = v >= 65 ? 'high' : v >= 35 ? 'mid' : 'low';
  return { v, level, why, n: recent.length };
}
/* Today: a small stress meter with one-tap check-in. An estimate from the person's own entries, never a lab value. */
function stressMini() {
  if (!H.consent.mood) return `<section class="card stress-mini"><div class="sm-row"><div class="sm-txt"><p class="eyebrow">Stress meter</p><p class="sm-t">See how much is weighing on you</p><p class="small">One tap a day about how you feel. Saved only on this device.</p></div></div><button class="btn small primary" type="button" data-act="moodConsent">Turn on</button></section>`;
  const e = loadEstimate(); const today = H.moods.some(m => m.d === dayKey());
  const L = { low: 'Light', mid: 'Moderate', high: 'High' };
  const v = e ? e.v : 0, len = 125.7;
  const ang = Math.PI * (1 - v / 100), nx = 50 + 40 * Math.cos(ang), ny = 50 - 40 * Math.sin(ang);
  const top = e?.why.find(w => w[0] === '+') || e?.why[0];
  return `<section class="card stress-mini"><div class="sm-row">
    <svg class="sm-gauge" viewBox="0 0 100 58" role="img" aria-label="${e ? 'Stress load ' + v + ' of 100' : 'Stress load'}">
      <defs><linearGradient id="smGrad" x1="0" x2="1"><stop offset="0" stop-color="#8fcba4"/><stop offset=".55" stop-color="#f5c35b"/><stop offset="1" stop-color="#f2856b"/></linearGradient></defs>
      <path d="M10,50 A40,40 0 0 1 90,50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/>
      ${e ? `<path class="g-val" d="M10,50 A40,40 0 0 1 90,50" fill="none" stroke="url(#smGrad)" stroke-width="9" stroke-linecap="round" style="--val:${(len * v / 100).toFixed(1)}"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5.5" fill="#fff" stroke="#07060b" stroke-width="2"/><text x="50" y="49" text-anchor="middle" class="sm-num">${v}</text>` : `<text x="50" y="48" text-anchor="middle" class="sm-num sm-empty">?</text>`}
    </svg>
    <div class="sm-txt"><p class="eyebrow">Stress meter</p><p class="sm-t">${e ? L[e.level] : 'How are you today?'}</p><p class="small">${e ? (top ? top[1] : 'Based on the last 3 days') : 'Tap how you feel to start the meter.'}</p></div>
    <button class="icon-btn" type="button" data-act="tab" data-k="you" data-sec="mood" aria-label="Open stress details">${IC.arrow}</button></div>
    ${today ? '' : `<p class="sm-ask">${e ? 'How are you right now?' : ''}</p>`}
    <div class="sm-moods ${today ? 'done' : ''}">${LEVELS.map(([v, em, l]) => `<button type="button" class="sm-mood" data-act="level" data-v="${v}" data-src="${feelSlot()}" aria-label="${l}"><span aria-hidden="true">${em}</span></button>`).join('')}</div>
    ${e?.level === 'high' ? `<button class="btn small block" type="button" data-act="tab" data-k="today">Take a 1-minute Moment</button>` : ''}
  </section>`;
}
function loadCard() {
  const e = loadEstimate();
  const L = { low: ['Light', 'Steady. Keep doing what works.'], mid: ['Moderate', 'Some things are adding up. One small thing at a time.'], high: ['High', 'A lot on you right now. A one-minute Moment can help you reset.'] };
  const len = 251.3, val = e ? e.v : 0;
  const ang = Math.PI * (1 - val / 100), nx = 100 + 80 * Math.cos(ang), ny = 100 - 80 * Math.sin(ang);
  return `<section class="card load"><div class="row between"><div><p class="eyebrow">Stress load</p><h2 class="h2">${e ? L[e.level][0] : 'Not enough check-ins yet'}</h2></div>${e ? `<span class="small">Based on the last 3 days</span>` : ''}</div>
    <svg class="gauge ${e ? '' : 'empty'}" viewBox="0 0 200 116" role="img" aria-label="${e ? 'Stress load ' + val + ' of 100' : 'Stress load'}">
      <defs><linearGradient id="loadGrad" x1="0" x2="1"><stop offset="0" stop-color="#8fcba4"/><stop offset=".55" stop-color="#f5c35b"/><stop offset="1" stop-color="#f2856b"/></linearGradient></defs>
      <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="16" stroke-linecap="round"/>
      ${e ? `<path class="g-val" d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="url(#loadGrad)" stroke-width="16" stroke-linecap="round" style="--len:${len};--val:${(len * val / 100).toFixed(1)}"/>
      <circle class="g-dot" cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="9" fill="#fff" stroke="#07060b" stroke-width="3"/>
      <text x="100" y="96" text-anchor="middle" class="g-num">${val}</text>` : `<text x="100" y="94" text-anchor="middle" class="g-empty">?</text>`}
    </svg>
    ${e ? `<p class="sub" style="margin-top:2px">${L[e.level][1]}</p>
      ${e.why.length ? `<ul class="load-why">${e.why.map(([s, t]) => `<li class="${s === '+' ? 'up' : 'down'}"><b aria-hidden="true">${s === '+' ? '▲' : '▼'}</b><span>${t}</span></li>`).join('')}</ul>` : ''}
      ${e.level === 'high' ? `<button class="btn primary block" type="button" data-act="tab" data-k="today" style="margin-top:12px">Take a 1-minute Moment</button>` : ''}`
    : `<p class="sub">Check in a few times, and Terra shows how much seems to be weighing on you.</p>`}
    <p class="small load-note">An estimate from your own check-ins, not a measurement of cortisol or your health.</p></section>`;
}
function secMood() {
  if (!H.consent.mood) return `<section class="card stack"><span class="eyebrow">Check-ins</span><h2 class="h2">See what lifts you</h2><p class="sub">Three quick check-ins a day, morning, midday and evening, plus one after a workout. Saved only on this device.</p><button class="btn primary" type="button" data-act="moodNow">Turn on check-ins</button></section>`;
  const today = dayKey(), wd = wDays(), range = S.moodRange || 'week';
  const span = { day: 1, week: 7, month: 30, year: 365 }[range];
  const from = addDays(today, -(span - 1));
  const inRange = H.moods.filter(m => m.d >= from && m.d <= today);
  const wsIn = (S.workouts || []).filter(w => w.d >= from && w.d <= today);
  const avgOf = arr => arr.length ? arr.reduce((a, e) => a + scoreOf(e), 0) / arr.length : null;
  const dayAvg = k => avgOf(H.moods.filter(m => m.d === k));
  const tabs = [['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['year', 'Year']];
  const seg = `<div class="seg" role="group" aria-label="Range">${tabs.map(([k, l]) => `<button type="button" data-act="moodRange" data-k="${k}" class="${range === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const avg = avgOf(inRange);
  const summary = `<p class="small tnum">${avg != null ? `Average ${avg.toFixed(1)} of 5` : 'No check-ins in this range yet'} · ${inRange.length} check-ins · ${wsIn.length} workout${wsIn.length === 1 ? '' : 's'}</p>`;
  let body = '';
  if (range === 'day') {
    const es = inRange.slice().sort((a, b) => a.t - b.t);
    const ws = wsIn;
    body = (es.length || ws.length) ? `<div class="list">${es.map(e => `<div class="item"><span class="w-ic">${faceOf(e)}</span><div class="txt"><b>${esc(SLOT_LBL[e.slot] || 'Check-in')}</b><small>${new Date(e.t).toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit' })}${e.v ? ' · ' + LEVELS[e.v - 1][2] : ''}</small></div></div>`).join('')}${ws.map(w => `<div class="item"><span class="w-ic">${wEmoji(w.type)}</span><div class="txt"><b>${esc(w.type)} · ${w.mins} min</b><small>Workout</small></div></div>`).join('')}</div>` : '<p class="empty">Nothing yet today. A question appears here at morning, midday and evening.</p>';
  } else if (range === 'week') {
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    body = `<div class="mchart">${days.map(k => { const a = dayAvg(k); return `<div class="mcol ${k === today ? 'today' : ''}"><span class="mface">${a ? LEVELS[Math.round(a) - 1][1] : '·'}</span><div class="mbar"><i style="height:${a ? Math.round(a / 5 * 100) : 0}%"></i></div><small>${parseKey(k).toLocaleDateString(LOC(), { weekday: 'short' })}</small><i class="mw">${wd.has(k) ? '🏃' : ''}</i></div>`; }).join('')}</div>`;
  } else if (range === 'month') {
    const days = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29));
    body = `<div class="mgrid">${days.map(k => { const a = dayAvg(k); return `<div class="mcell ${k === today ? 'today' : ''}" style="--s:${a ? ((a - 1) / 4).toFixed(2) : 0}"><small>${parseKey(k).getDate()}</small>${a ? `<b>${a.toFixed(1)}</b>` : ''}${wd.has(k) ? '<i>🏃</i>' : ''}</div>`; }).join('')}</div>`;
  } else {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 11 + i, 1));
    body = `<div class="mchart year">${months.map(d => { const pre = dayKey(d).slice(0, 7); const a = avgOf(H.moods.filter(m => m.d.startsWith(pre))); const ws = (S.workouts || []).filter(w => w.d.startsWith(pre)).length; return `<div class="mcol ${pre === today.slice(0, 7) ? 'today' : ''}"><span class="mface">${a ? LEVELS[Math.round(a) - 1][1] : '·'}</span><div class="mbar"><i style="height:${a ? Math.round(a / 5 * 100) : 0}%"></i></div><small>${d.toLocaleDateString(LOC(), { month: 'short' })}</small><i class="mw">${ws ? '🏃' + ws : ''}</i></div>`; }).join('')}</div>`;
  }
  return loadCard() + `<section class="card stack" style="gap:14px"><div class="row between"><div><p class="eyebrow">Check-in</p><h2 class="h2">How are you right now?</h2></div></div>${levelRow('manual')}</section>
    <section class="card stack" style="gap:12px"><div class="section-head"><h2 class="h2">Your feeling over time</h2><span class="small">🏃 = workouts</span></div>${seg}${summary}${body}</section>`;
}

/* ---------- insights ---------- */
function moodDays(sinceDays = 42) {
  const since = Date.now() - sinceDays * 864e5; const days = {};
  H.moods.filter(m => m.t > since).forEach(m => (days[m.d] ||= []).push(MOOD[m.m]?.s || 3));
  return days;
}
function insights() {
  if (!H.consent.mood) return [];
  const out = []; const now = Date.now();
  const recent = H.moods.filter(m => m.t > now - 14 * 864e5);
  if (recent.length >= 6 && recent.filter(m => m.m === 'low').length / recent.length >= .6)
    out.push({ id: 'support', kind: 'support', title: 'You\'ve felt low on many days lately', text: 'That\'s worth talking about with someone you trust or a doctor. In Finland, MIELI\'s Crisis Helpline is open around the clock at 09 2525 0111. If you are in danger right now, call 112.' });
  return out.filter(i => !(H.fb[i.id] && now < H.fb[i.id]));
}
function insightCard(i) {
  return `<section class="card insight ${i.kind || ''}"><p class="eyebrow">${i.kind === 'support' ? IC.heart.replace('<svg', '<svg width="14" height="14" style="vertical-align:-2px"') + ' A gentle note' : IC.terra.replace('<svg', '<svg width="14" height="14" style="vertical-align:-2px"') + ' Terra noticed'}</p>
    <h2 class="h2" style="margin-top:6px">${esc(i.title)}</h2><p class="sub" style="margin-top:6px">${esc(i.text)}</p>
    ${i.sugg ? `<div class="chips" style="margin-top:12px"><button class="chip" type="button" data-act="restAdd" data-k="walk">🚶 10-minute walk</button><button class="chip" type="button" data-act="restAdd" data-k="stretch">🤸 Gentle stretch</button><button class="chip" type="button" data-act="restAdd" data-k="breathe">🌬️ Short Moment</button></div>` : ''}
    <div class="row" style="margin-top:14px;flex-wrap:wrap;gap:6px 18px">${i.kind === 'support' ? '' : `<button class="link-btn" type="button" data-act="insNo" data-k="${i.id}">Not quite right</button>`}
    ${i.kind !== 'support' && plan().ai && aiReady() ? `<button class="link-btn" type="button" data-act="insAsk" data-k="${i.id}">${IC.chat} Talk it through</button>` : ''}
    <button class="link-btn" type="button" data-act="insHide" data-k="${i.id}" style="color:var(--muted)">Hide for a week</button></div></section>`;
}
const REST = { walk: ['Put on your shoes', 'Walk outside for 10 minutes'], stretch: ['Roll out a mat or towel', 'Stretch slowly for 5 minutes'], breathe: ['Open the Moment tab', 'Breathe slowly for one minute'] };

/* ---------- calendar ---------- */
function calTime(r) {
  if (r.time) return r.time;
  const start = { 'Before 07:00': '06:45', '07:00 to 09:00': '08:00', '09:00 to 11:00': '09:30', 'After 11:00, or it varies': '10:30' }[S.profile.dayStart] || '08:00';
  return r.slot === 'morning' ? start : r.slot === 'evening' ? '21:00' : '12:00';
}
function gcalLink(title, details, time, mins) {
  const d = new Date(); const [h, m] = time.split(':').map(Number); d.setHours(h, m, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1);
  const e = new Date(d.getTime() + Math.max(5, mins) * 60000);
  const f = x => `${x.getFullYear()}${p2(x.getMonth() + 1)}${p2(x.getDate())}T${p2(x.getHours())}${p2(x.getMinutes())}00`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, details: details + '\n\nAdded from Terra', dates: `${f(d)}/${f(e)}`, ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Helsinki', recur: 'RRULE:FREQ=DAILY' });
  return 'https://calendar.google.com/calendar/render?' + q;
}
function calSheet(kind, id) {
  let title, details, time, mins;
  if (kind === 'routine') { const r = S.routines.find(x => x.id === id); if (!r) return; title = `Terra · ${r.name}`; details = `${r.anchor ? r.anchor + '\n' : ''}${r.steps.map(s => '• ' + s.text).join('\n')}`; time = calTime(r); mins = r.steps.reduce((a, s) => a + (s.mins || 1), 0); }
  else { const r = S.reminders.find(x => x.id === id); if (!r) return; title = `Terra · ${r.text}`; details = 'Daily reminder'; time = r.time; mins = 5; }
  openSheet(`<div class="stack" style="gap:14px"><span class="eyebrow">Calendar</span><h2 class="h2">Add to your calendar</h2>
    <p class="sub">${esc(title.replace('Terra · ', ''))} · every day at ${esc(time)}</p>
    <a class="btn primary block" href="${esc(gcalLink(title, details, time, mins))}" target="_blank" rel="noopener noreferrer">${IC.calendar} Open in Google Calendar</a>
    <p class="small">Google Calendar opens with a daily event filled in. Check it and tap Save there. Terra never reads your calendar.</p>
    <div class="card soon"><div class="row between"><b>Apple Calendar</b><span class="tag">iOS app</span></div><p class="small" style="margin-top:6px">Arrives with the iPhone app, together with automatic two-way sync and a shared calendar with a partner.</p></div>
    <button class="skip" type="button" data-act="sheetClose">Close</button></div>`);
}

/* ---------- Track view ---------- */
const TSECS = [['workouts', 'Workouts'], ['mood', 'Mood']];
/* ---------- You: a calm summary; every detail opens on its own ---------- */
const YOU_ROWS = [['mood', '🙂', 'Mood and stress', 'Check-ins and stress load'], ['settings', '⚙️', 'Settings', 'Plan, alarm, privacy, language']];
/* Workouts have their own tab in the bottom bar. */
function viewWorkouts() {
  const kind = S.profile?.train?.kind?.[0];
  const ch = { 'Gym': 'gym', 'Running': 'run', 'Walking': 'walk', 'Home workouts': 'home', 'Yoga or stretching': 'yoga', 'Sports or classes': 'sport' }[kind] || 'sport';
  return `<section class="hero"><div><span class="eyebrow">Move</span><h1 class="h1">Workouts</h1><p class="sub">Log what you did. Every bit of movement counts.</p></div>${CH3[ch]()}</section>` + gymCard() + secWorkouts() + secBody();
}
function viewYou() {
  const sec = S.youSec;
  const back = `<button class="back-btn" type="button" data-act="tab" data-k="you">${IC.back}<span>You</span></button>`;
  if (sec === 'settings') return back + viewPrefs();
  if (TSECS.some(t => t[0] === sec)) { const label = YOU_ROWS.find(r => r[0] === sec)[2]; return back + `<section class="hero"><div><span class="eyebrow">You</span><h1 class="h1">${label}</h1></div></section>` + { workouts: secWorkouts, mood: secMood }[sec](); }
  const st = streak(); const wk = weekData(); const ins = insights()[0];
  return `<section class="hero"><div><span class="eyebrow">Your progress</span><h1 class="h1">You</h1><p class="sub">Notice what does you good. No judging.</p></div>${CH3.you()}</section>
    <section class="card"><div class="section-head"><div><h2 class="h2" style="font-size:20px">Week rhythm</h2><p class="small">Small steps add up to a direction.</p></div><span class="chip-count">${IC.flame} ${st}</span></div>
      <div class="week">${wk.map(w => `<div class="d ${w.today ? 'today' : ''}"><i class="pill ${w.future ? 'future' : w.ratio === 0 ? 'zero' : ''}" style="height:${Math.round(8 + w.ratio * 56)}px"></i><span>${w.lbl}</span></div>`).join('')}</div></section>
    ${ins ? insightCard(ins) : ''}
    <section class="card nav-list">${YOU_ROWS.map(([k, ic, l, sub]) => `<button class="nav-row" type="button" data-act="tab" data-k="you" data-sec="${k}"><span class="nr-ic" aria-hidden="true">${ic}</span><span class="nr-t"><b>${l}</b><small>${sub}</small></span>${IC.arrow}</button>`).join('')}</section>`;
}

/* ---------- AI summary (opt-in) ---------- */
function healthSummary() {
  if (!H.consent.aiSummary) return '';
  const W = (S.workouts || []).filter(w => daysBetween(w.d, dayKey()) < 28);
  const M = H.consent.mood ? H.moods.filter(m => m.t > Date.now() - 28 * 864e5) : [];
  const c = MOODS.map(([k, , l]) => `${l} ${M.filter(m => m.m === k).length}`).join(', ');
  return `\nSummary the person chose to share (last 4 weeks): ${W.length} workouts (goal ${S.wGoal || 3}/week)${M.length ? `; mood check-ins: ${c}` : ''}.`;
}

/* ---------- privacy center ---------- */
let privConfirm = null;
function privacyCenter() {
  const row = (k, label, sub) => `<div class="set-row"><div><b>${label}</b><small>${sub}</small></div><button class="toggle" type="button" role="switch" aria-checked="${!!H.consent[k]}" aria-label="${label}" data-act="hTog" data-k="${k}"></button></div>
    ${privConfirm === k ? `<div class="confirm" style="padding:0 0 12px">Turning this off deletes all your check-ins from this device. <button class="btn small danger" type="button" data-act="hOff" data-k="${k}">Turn off and delete</button><button class="btn small ghost" type="button" data-act="hKeep">Keep</button></div>` : ''}`;
  return `<section class="card set-group"><p class="eyebrow">Privacy and your data</p>
    <div class="where"><div><b>${IC.shield} Synced to your account</b><p class="small">Name, check-in answers, routines, reminders, workouts, XP and plan.</p></div>
    <div><b>${IC.lock} Only on this device</b><p class="small">Mood check-ins. Never synced. Kept for up to 400 days.</p></div></div>
    ${row('mood', 'Mood check-ins', 'One-tap "How do you feel?" after Moments')}
    ${AI_ENABLED ? row('aiSummary', 'Share a summary with Terra AI', 'Sends workout count and mood totals with your messages.') : ''}
    <div class="set-row" style="gap:10px;flex-wrap:wrap"><button class="btn" type="button" data-act="export">${IC.arrow.replace('<svg', '<svg style="transform:rotate(90deg)"')} Export my data</button>
    ${privConfirm === 'health' ? `<div class="confirm">Delete all mood check-ins from this device? <button class="btn small danger" type="button" data-act="hWipe">Delete</button><button class="btn small ghost" type="button" data-act="hKeep">Cancel</button></div>` : `<button class="btn danger" type="button" data-act="hAsk">Delete health data</button>`}</div>
    <p class="small" style="line-height:1.55">Terra AI only receives what it needs to reply. Terra supports daily life. It isn't medical care or a replacement for treatment. Questions about your data: contact the Terra team.</p>
    <div class="set-row">${confirmReset ? `<div class="confirm">This deletes your routines, reminders, workouts and all health data. <button class="btn small danger" type="button" data-act="resetAll">Delete everything</button><button class="btn small ghost" type="button" data-act="cancelReset">Cancel</button></div>` : `<button class="btn danger" type="button" data-act="askReset">${IC.trash} Delete all my data</button>`}</div>
  </section>`;
}
async function exportData() {
  const data = JSON.stringify({ exportedAt: new Date().toISOString(), app: 'Terra', account: { ...S, chat: S.chat }, thisDevice: H }, null, 2);
  if (NATIVE) { NATIVE.postMessage({ type: 'share', filename: `terra-data-${dayKey()}.json`, data }); return; }
  let dl = null; try { dl = window.claude?.use ? await claude.use('downloads') : null; } catch (e) {}
  if (!dl) { toast('Export works when Terra is opened in the Claude app.'); return; }
  try { await dl.save({ filename: `terra-data-${dayKey()}.json`, data: new Blob([data], { type: 'application/json' }) }); toast('Your data is ready.'); }
  catch (e) { if (e?.code !== 'declined') toast(e?.code === 'rate_limited' ? 'One moment, then try again.' : 'Export isn\'t available in this view.'); }
}
function wipeHealth() { const keep = { ...H.consent, mood: false }; H = freshHealth(); H.consent = { ...keep }; saveH(); }

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a || a.disabled) return;
  const k = a.dataset.k, id = a.dataset.id;
  switch (a.dataset.act) {
    case 'tsec': S.trackSec = k; save(); render(); break;
    case 'wLog': workoutSheet(); break;
    case 'wSame': { const l = (S.workouts || []).at(-1); if (l) logWorkout({ type: l.type, mins: l.mins, effort: l.effort, ago: 0 }); break; }
    case 'wDel': { const w = S.workouts.find(x => x.id === id); S.workouts = S.workouts.filter(x => x.id !== id); addXP(-XP.workout); save(); render(); toast('Workout deleted', { label: 'Undo', fn: () => { S.workouts.push(w); S.workouts.sort((x, y) => x.d.localeCompare(y.d)); addXP(XP.workout); save(); render(); } }); break; }
    case 'wGoal': S.wGoal = clamp((S.wGoal || 3) + Number(k), 1, 7); save(); render(); break;
    case 'moodNow': moodSheet('manual'); break;
    case 'moodYes': H.consent.mood = true; H.asked.mood = true; saveH(); moodSheet(k || 'manual'); render(); break;
    case 'moodNo': H.asked.mood = true; saveH(); closeSheet(); break;
    case 'mood': logMood(k, a.dataset.src); break;
    case 'level': logLevel(+a.dataset.v, a.dataset.src); break;
    case 'moodRange': S.moodRange = k; save(); render(); break;
    case 'moodConsent': moodConsentSheet('today'); break;
    case 'sheetClose': closeSheet(); break;
    case 'insNo': H.fb[k] = Date.now() + 30 * 864e5; saveH(); render(); toast('Thanks. Terra will look at that differently.'); break;
    case 'insHide': H.fb[k] = Date.now() + 7 * 864e5; saveH(); render(); break;
    case 'insAsk': { const i = insights().find(x => x.id === k); if (!i) break; S.tab = 'terra'; save(); render(); askAI(LANG === 'fi' ? `Terra huomasi minusta tämän: ${tr(i.text)} Voisitko auttaa minua yhdellä pienellä idealla?` : `Terra noticed this about me: ${i.text} Can you help me with one small idea?`); break; }
    case 'restAdd': {
      if (S.routines.length >= plan().routines) { openPaywall('Free includes 3 routines. Pro gives you as many as you need.'); break; }
      const r = addRoutine({ name: 'Rest-day lift', slot: 'day', anchor: 'On days I don\'t work out', steps: REST[k] || REST.walk });
      if (r) { H.fb.trainrest = Date.now() + 14 * 864e5; saveH(); render(); toast('Rest-day lift added to Routines'); }
      break;
    }
    case 'cal': calSheet(a.dataset.kind, id); break;
    case 'hTog': if (H.consent[k] && k === 'mood') { privConfirm = k; render(); break; }
      H.consent[k] = !H.consent[k]; if (k === 'mood' && H.consent.mood) H.asked.mood = true; saveH(); render(); break;
    case 'hOff': H.consent[k] = false; if (k === 'mood') H.moods = []; privConfirm = null; saveH(); render(); toast('Check-ins are off and deleted.'); break;
    case 'hKeep': privConfirm = null; render(); break;
    case 'hAsk': privConfirm = 'health'; render(); break;
    case 'hWipe': wipeHealth(); privConfirm = null; render(); toast('Health data deleted from this device.'); break;
    case 'export': exportData(); break;
  }
});
document.addEventListener('submit', e => {
  const f = e.target; const k = f.dataset.form; if (!k) return;
  if (k === 'workout') { e.preventDefault(); logWorkout({ type: groupVal(f, 'type') || 'Other', mins: groupVal(f, 'mins') || hmMins(f.querySelector('#wDur')?.value), effort: groupVal(f, 'effort') || 'Medium', ago: Number(groupVal(f, 'ago') || 0) }); }
});
