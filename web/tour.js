/* ============ Terra: guided tour with a moving spotlight ============ */
const TOUR = [
  { t: null, title: 'A 30-second tour', text: 'Let me show you around. You can skip anytime.' },
  { t: '.card.next', title: 'Your next tiny step', text: 'One small thing at a time. Tap Done when it\'s done, or "Not now" to see another step.' },
  { t: '.ai-pill', title: 'Terra AI', text: 'Tell Terra about your day in your own words. It builds routines and reminders with you.' },
  { t: '#tabs [data-k=routines]', title: 'Routines', text: 'Your routines and reminders, all in one place.' },
  { t: '#tabs [data-k=calm]', title: 'Calm', text: 'A breathing break and your stress meter, whenever things feel like too much.' },
  { t: '#tabs [data-k=you]', title: 'You', text: 'Every step earns *XP*. See your rank and progress here. Settings live here too.' },
  { t: null, title: 'You\'re all set', text: 'Start with one tiny step. That\'s all it takes.' },
];
let TR = null;
function startTour() {
  if (!S.onboarded) return;
  closeSheet(); $('#paywall')?.remove(); document.querySelectorAll('.celebrate').forEach(c => c.remove());
  S.tab = 'today'; save(); render(); window.scrollTo({ top: 0 });
  $('#tour')?.remove();
  const o = document.createElement('div'); o.id = 'tour'; o.className = 'tour'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'App tour');
  o.innerHTML = `<div class="spot"></div><div class="tip"></div>`;
  document.body.appendChild(o);
  TR = { i: 0 };
  requestAnimationFrame(() => { o.classList.add('on'); tourShow(); });
}
function tourTarget(step) { if (!step.t) return null; const el = $(step.t); if (!el) return null; const r = el.getBoundingClientRect(); return r.width ? el : null; }
function tourShow() {
  const o = $('#tour'); if (!o || !TR) return;
  let step = TOUR[TR.i];
  while (step.t && !tourTarget(step) && TR.i < TOUR.length - 1) { TR.i += TR.dir === -1 ? -1 : 1; if (TR.i < 0) { TR.i = 0; break; } step = TOUR[TR.i]; }
  const el = tourTarget(step);
  const spot = o.querySelector('.spot'), tip = o.querySelector('.tip');
  const vw = innerWidth, vh = innerHeight;
  if (el) {
    const fixed = getComputedStyle(el.closest('.tabbar') || el).position === 'fixed' || !!el.closest('.tabbar');
    if (!fixed) { const r0 = el.getBoundingClientRect(); if (r0.top < 70 || r0.bottom > vh - 120) window.scrollTo({ top: Math.max(0, scrollY + r0.top - vh * .28) }); }
  }
  const r = el ? el.getBoundingClientRect() : null;
  const pad = el && el.closest('.tabbar') ? 4 : 8;
  if (r) {
    Object.assign(spot.style, { top: r.top - pad + 'px', left: r.left - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px', borderRadius: (el.closest('.tabbar') ? 22 : el.classList.contains('gear') ? 16 : 28) + 'px', opacity: 1 });
    spot.classList.remove('center');
  } else {
    Object.assign(spot.style, { top: vh / 2 + 'px', left: vw / 2 + 'px', width: '0px', height: '0px', borderRadius: '50%', opacity: 1 });
    spot.classList.add('center');
  }
  const last = TR.i === TOUR.length - 1, first = TR.i === 0;
  const n = TOUR.length;
  tip.classList.remove('in'); void tip.offsetWidth;
  tip.innerHTML = `${step.char ? `<div class="tip-art">${CH[step.char]()}</div>` : ''}
    <div class="row between"><span class="eyebrow">${first || last ? 'Terra' : `${TR.i} of ${n - 2}`}</span>${last ? '' : '<button class="skip" type="button" data-tour="skip">Skip tour</button>'}</div>
    <h2 class="h2 tw" aria-label="${esc(tr(step.title).replace(/\*/g, ''))}">${words(tr(step.title), .18, .07)}</h2><p class="sub tw" aria-label="${esc(tr(step.text).replace(/\*/g, ''))}">${words(tr(step.text), .42, .028)}</p>
    <div class="tip-dots" aria-hidden="true">${TOUR.map((_, j) => `<i class="${j === TR.i ? 'on' : j < TR.i ? 'done' : ''}"></i>`).join('')}</div>
    <div class="row" style="gap:10px">${!first && !last ? '<button class="btn" type="button" data-tour="back">Back</button>' : ''}<button class="btn primary" type="button" data-tour="next" style="flex:1">${first ? 'Show me' : last ? 'Let\'s go' : 'Next'} ${last ? '' : IC.arrow}</button></div>`;
  const tw = Math.min(340, vw - 32); tip.style.width = tw + 'px';
  requestAnimationFrame(() => {
    const th = tip.offsetHeight;
    let top, left;
    if (!r) { top = (vh - th) / 2; left = (vw - tw) / 2; }
    else {
      const cx = r.left + r.width / 2;
      left = clamp(cx - tw / 2, 16, vw - tw - 16);
      top = (r.top + r.height / 2 > vh / 2) ? r.top - pad - th - 18 : r.bottom + pad + 18;
      top = clamp(top, 16, vh - th - 16);
      tip.style.setProperty('--ax', clamp(cx - left, 28, tw - 28) + 'px');
      tip.dataset.side = (r.top + r.height / 2 > vh / 2) ? 'above' : 'below';
    }
    if (!r) delete tip.dataset.side;
    tip.style.top = top + 'px'; tip.style.left = left + 'px';
    tip.classList.add('in');
    tip.querySelector('[data-tour=next]')?.focus({ preventScroll: true });
    if (!first) chime('soft');
  });
}
function words(t, start, step) {
  return String(t).split(' ').map((w, i) => { const hl = /^\*.+\*[.,!]?$/.test(w); const txt = w.replace(/\*/g, ''); return `<span class="w${hl ? ' xp' : ''}" aria-hidden="true" style="animation-delay:${(start + i * step).toFixed(3)}s">${esc(txt)}</span>`; }).join(' ');
}
function tourGo(d) { if (!TR) return; TR.dir = d; const ni = TR.i + d; if (ni >= TOUR.length) { endTour(true); return; } TR.i = Math.max(0, ni); tourShow(); }
function endTour(done) {
  const o = $('#tour'); TR = null; S.toured = true; save();
  if (!o) return;
  o.classList.remove('on'); setTimeout(() => o.remove(), 450);
  window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' });
  if (done) setTimeout(() => { const c = $('.card.next'); if (c) burst(c, 22); }, 300);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-tour]'); if (b) { e.stopPropagation(); const k = b.dataset.tour; if (k === 'next') tourGo(1); else if (k === 'back') tourGo(-1); else endTour(false); return; }
  if (e.target.closest('[data-act=tour]')) startTour();
}, true);
document.addEventListener('keydown', e => {
  if (!TR) return;
  if (e.key === 'Escape') { e.stopImmediatePropagation(); endTour(false); }
  if (e.key === 'ArrowRight') tourGo(1);
  if (e.key === 'ArrowLeft') tourGo(-1);
}, true);
addEventListener('resize', () => { if (TR) tourShow(); });
function maybeTour() { if (S.onboarded && !S.toured && !TR) setTimeout(() => { if (!$('#paywall') && !$('.celebrate') && !$('#sheet') && !$('#ob')) startTour(); }, 700); }
