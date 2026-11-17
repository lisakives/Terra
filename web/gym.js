/* ---------- GymTrack inside Terra ----------
   The gym log (programs, sets, PRs, rest timer, body, food) runs as its own little app in a full-screen
   layer, so its look and code stay separate from Terra's. It keeps its data under its own key on this device,
   and every finished gym session is added to Terra's workouts, so it counts toward the weekly goal and streak. */
const GYM_KEY = 'gymtrack.v1';
function gymState() { try { return JSON.parse(localStorage.getItem(GYM_KEY) || 'null'); } catch (e) { return null; } }
function syncGym(quiet) {
  const g = gymState(); if (!g || !Array.isArray(g.sessions)) return 0;
  const have = new Set((S.workouts || []).filter(w => w.gt).map(w => w.gt)); let added = 0;
  for (const s of g.sessions) {
    if (!s.endedAt || have.has(s.id)) continue;
    const st = new Date(s.startedAt), mins = clamp(Math.round((new Date(s.endedAt) - st) / 60000) || 30, 1, 600);
    const name = (g.workouts || []).find(w => w.id === s.workoutId)?.name || '';
    (S.workouts ||= []).push({ id: uid(), gt: s.id, d: dayKey(st), type: 'Gym', mins, effort: 'Medium', name });
    addXP(XP.workout); added++;
  }
  if (added) { S.workouts.sort((a, b) => a.d.localeCompare(b.d)); save(); if (!quiet) toast(LANG === 'fi' ? `🏋️ ${added} salitreeni${added > 1 ? 'ä' : ''} lisätty treeneihisi · +${added * XP.workout} XP` : `🏋️ ${added} gym session${added > 1 ? 's' : ''} added to your workouts · +${added * XP.workout} XP`); }
  return added;
}
/* What's next in the gym program, for the card on the Workouts tab */
function gymNext() {
  const g = gymState(); if (!g) return null;
  const wOf = id => (g.workouts || []).find(w => w.id === id);
  const t = (new Date().getDay() + 6) % 7, sch = g.plan?.schedule || [];
  const doneToday = (g.sessions || []).some(s => s.endedAt && dayKey(new Date(s.startedAt)) === dayKey());
  const active = g.activeSessionId && (g.sessions || []).find(s => s.id === g.activeSessionId);
  if (active) return { label: tr('In progress'), w: wOf(active.workoutId), live: true };
  if (sch[t] && wOf(sch[t]) && !doneToday) return { label: tr('Today'), w: wOf(sch[t]) };
  for (let i = 1; i <= 7; i++) { const w = wOf(sch[(t + i) % 7]); if (w) return { label: i === 1 ? tr('Tomorrow') : new Date(Date.now() + i * 864e5).toLocaleDateString(LOC(), { weekday: 'long' }), w, rest: true }; }
  return null;
}
function gymCard() {
  const g = gymState(), nx = gymNext();
  const last = g ? (g.sessions || []).filter(s => s.endedAt).sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0] : null;
  const lastW = last && (g.workouts || []).find(w => w.id === last.workoutId);
  return `<button class="card gym-card" type="button" data-act="gymOpen" aria-label="${tr('Open GymTrack')}">
    <span class="gym-logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg></span>
    <span class="gym-txt"><span class="gym-word">GYM<b>TRACK</b></span>
      <b>${nx?.w ? `${esc(nx.label)}: ${esc(nx.w.name)}${nx.w.subtitle ? ` <small>${esc(nx.w.subtitle)}</small>` : ''}` : tr('Your gym log')}</b>
      <small>${nx?.live ? tr('A workout is in progress. Tap to continue.') : lastW ? `${tr('Last:')} ${esc(lastW.name)} · ${new Date(last.startedAt).toLocaleDateString(LOC(), { day: 'numeric', month: 'numeric' })}` : tr('Programs, sets, records and a rest timer.')}</small></span>
    <span class="gym-go">${nx?.live ? '●' : IC.arrow}</span></button>`;
}
function openGym() {
  if (document.getElementById('gym')) return;
  const o = document.createElement('div'); o.id = 'gym'; o.className = 'gym-layer'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'GymTrack');
  o.innerHTML = `<div class="gym-bar"><button type="button" class="gym-back" data-act="gymClose">${IC.back}<span>Terra</span></button><span class="gym-title">GYM<b>TRACK</b></span><span style="width:76px"></span></div><iframe title="GymTrack" class="gym-frame"></iframe>`;
  document.body.appendChild(o); document.documentElement.classList.add('gym-open');
  o.querySelector('iframe').srcdoc = GYM_HTML;
}
function closeGym() {
  const o = document.getElementById('gym'); if (!o) return;
  o.classList.add('out'); document.documentElement.classList.remove('gym-open'); setTimeout(() => o.remove(), 300);
  syncGym(); render();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (b.dataset.act === 'gymOpen') openGym();
  if (b.dataset.act === 'gymClose') closeGym();
});
/* A session finished inside GymTrack shows up in Terra right away */
window.addEventListener('storage', e => { if (e.key === GYM_KEY && syncGym(true)) { if (!document.getElementById('gym')) render(); } });
setTimeout(() => { if (S.onboarded && syncGym(true)) render(); }, 1500);
