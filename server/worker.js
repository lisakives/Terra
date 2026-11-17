/*
 * Terra server (one Cloudflare Worker)
 *  - serves the Terra web app (public/, installable on the home screen)
 *  - Terra AI: keeps the Anthropic API key secret            POST /v1/chat
 *  - push reminders while Terra is closed (Web Push, VAPID)    /api/*
 *    A cron runs every minute and sends what is due in each person's own time zone.
 *
 * Storage (KV, binding TERRA): the VAPID key pair, and per person only what reminders need:
 * the reminder list, the time zone, and today's step count / streak / "why" for the evening nudge.
 */
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5' };
const MAX_BODY = 200_000;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    try {
      if (url.pathname === '/v1/chat' && req.method === 'POST') return await chat(req, env, cors);
      if (url.pathname.startsWith('/api/')) return await api(url, req, env, cors);
    } catch (e) { return json({ error: String(e.message || e) }, 500, cors); }
    return env.ASSETS ? env.ASSETS.fetch(req) : json({ error: 'not_found' }, 404, cors);
  },
  async scheduled(event, env, ctx) { ctx.waitUntil(tick(env)); },
};

/* ---------------- Terra AI ---------------- */
async function chat(req, env, cors) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503, cors);
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: 'too_large' }, 413, cors);
  let body; try { body = JSON.parse(raw); } catch { return json({ error: 'bad_json' }, 400, cors); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-40) : [];
  if (!messages.length) return json({ error: 'no_messages' }, 400, cors);
  const payload = { model: MODELS[body.tier] || MODELS.default, max_tokens: 1024, messages };
  if (typeof body.system === 'string') payload.system = body.system.slice(0, 20_000);
  if (Array.isArray(body.tools) && body.tools.length) payload.tools = body.tools.slice(0, 5);
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(payload) });
  const status = r.status === 401 || r.status === 403 ? 502 : r.status;
  return new Response(await r.text(), { status, headers: { ...cors, 'content-type': 'application/json' } });
}

/* ---------------- Push API ---------------- */
async function api(url, req, env, cors) {
  if (!env.TERRA) return json({ error: 'kv_missing' }, 503, cors);
  const p = url.pathname;
  if (p === '/api/vapid') { const v = await vapid(env); await env.TERRA.put('origin', url.origin); return json({ publicKey: v.publicKey }, 200, cors); }
  if (req.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
  const raw = await req.text(); if (raw.length > 60_000) return json({ error: 'too_large' }, 413, cors);
  let b; try { b = JSON.parse(raw); } catch { return json({ error: 'bad_json' }, 400, cors); }
  if (!/^u[0-9a-f]{20}$/.test(b.id || '') || typeof b.secret !== 'string' || b.secret.length < 32) return json({ error: 'bad_id' }, 400, cors);
  const key = 'u:' + b.id; let u = await env.TERRA.get(key, 'json');
  if (u && u.secret !== b.secret) return json({ error: 'forbidden' }, 403, cors);
  if (!u) { if (p !== '/api/subscribe') return json({ error: 'unknown' }, 404, cors); u = { secret: b.secret, subs: [], items: [], sent: {} }; }

  if (p === '/api/subscribe') {
    const s = b.subscription; if (!s?.endpoint || !s.keys?.p256dh || !s.keys?.auth || !/^https:\/\//.test(s.endpoint)) return json({ error: 'bad_subscription' }, 400, cors);
    u.subs = [s, ...u.subs.filter(x => x.endpoint !== s.endpoint)].slice(0, 5);
    await env.TERRA.put(key, JSON.stringify(u)); await addToIndex(env, b.id);
    return json({ ok: true }, 200, cors);
  }
  if (p === '/api/sync') {
    u.tz = validTz(b.tz) ? b.tz : 'UTC'; u.lang = b.lang === 'fi' ? 'fi' : 'en';
    u.items = (Array.isArray(b.items) ? b.items : []).slice(0, 40).map(i => ({ id: String(i.id).slice(0, 40), title: String(i.title || '').slice(0, 120), text: String(i.text || '').slice(0, 240), time: /^\d\d:\d\d$/.test(i.time) ? i.time : '', once: Array.isArray(i.once) ? i.once.slice(0, 8).filter(o => /^\d{4}-\d\d-\d\d$/.test(o.d) && /^\d\d:\d\d$/.test(o.t)) : undefined })).filter(i => i.time);
    const pr = b.progress || {};
    u.progress = { day: String(pr.day || ''), done: +pr.done || 0, total: +pr.total || 0, streak: +pr.streak || 0, name: String(pr.name || '').slice(0, 30), why: String(pr.why || '').slice(0, 140), nudgeAt: /^\d\d:\d\d$/.test(pr.nudgeAt) ? pr.nudgeAt : '20:30' };
    await env.TERRA.put(key, JSON.stringify(u));
    return json({ ok: true, items: u.items.length }, 200, cors);
  }
  if (p === '/api/test') {
    const n = await deliver(env, b.id, u, { title: 'Terra', body: u.lang === 'fi' ? 'Muistutukset toimivat 🌱' : 'Reminders are working 🌱', tag: 'test', k: 'today' });
    await env.TERRA.put(key, JSON.stringify(u));
    return json({ ok: n > 0, sent: n }, 200, cors);
  }
  if (p === '/api/unsubscribe') { await env.TERRA.delete(key); await removeFromIndex(env, b.id); return json({ ok: true }, 200, cors); }
  return json({ error: 'not_found' }, 404, cors);
}
const validTz = tz => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; } };
async function addToIndex(env, id) { const ix = (await env.TERRA.get('index', 'json')) || []; if (!ix.includes(id)) { ix.push(id); await env.TERRA.put('index', JSON.stringify(ix)); } }
async function removeFromIndex(env, id) { const ix = (await env.TERRA.get('index', 'json')) || []; await env.TERRA.put('index', JSON.stringify(ix.filter(x => x !== id))); }

/* ---------------- Every minute: what is due now? ---------------- */
function localNow(tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hm: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` };
}
const NUDGE = {
  fi: { risk: s => [`Putkesi on vaarassa 😬 Yksi askel pelastaa ${s} päivän putken!`, `Vielä ehtii! ${s} päivän putki odottaa 🔥`], none: ['Yksi pieni askel ennen unta? 🌙', 'Aloitetaan uusi putki tänään 🌱'], why: w => `Muista miksi aloitit: “${w}”` },
  en: { risk: s => [`Your streak is in danger 😬 One step saves your ${s}-day streak!`, `There's still time! Your ${s}-day streak is waiting 🔥`], none: ['One small step before bed? 🌙', "Let's start a new streak tonight 🌱"], why: w => `Remember why you started: “${w}”` },
};
async function tick(env) {
  if (!env.TERRA) return;
  const ix = (await env.TERRA.get('index', 'json')) || [];
  for (const id of ix) {
    const key = 'u:' + id; const u = await env.TERRA.get(key, 'json'); if (!u || !u.subs?.length) continue;
    const { day, hm } = localNow(u.tz || 'UTC'); let changed = false;
    for (const it of u.items || []) {
      const t = it.once?.length ? (it.once.find(o => o.d === day)?.t || it.time) : it.time;
      if (t !== hm || u.sent[it.id] === day) continue;
      u.sent[it.id] = day; changed = true;
      await deliver(env, id, u, { title: it.title || 'Terra', body: it.text, tag: 'r-' + it.id, k: it.id === 'alarm' ? 'today' : 'today' });
    }
    /* Duolingo-style evening nudge: only when nothing is done yet today */
    const pr = u.progress || {};
    if (pr.nudgeAt === hm && u.sent.nudge !== day && pr.total > 0 && (pr.day !== day || pr.done === 0)) {
      const L = NUDGE[u.lang] || NUDGE.en; const h = +hm.slice(0, 2) + new Date().getUTCDate();
      const text = pr.why && h % 2 ? L.why(pr.why) : pr.streak > 0 ? L.risk(pr.streak)[h % 2] : L.none[h % 2];
      u.sent.nudge = day; changed = true;
      await deliver(env, id, u, { title: pr.name ? `Terra · ${pr.name}` : 'Terra', body: text, tag: 'nudge', k: 'today' });
    }
    if (changed) await env.TERRA.put(key, JSON.stringify(u));
  }
}
/* Sends to every device the person turned reminders on; drops subscriptions the browser has retired */
async function deliver(env, id, u, msg) {
  const v = await vapid(env); const origin = (await env.TERRA.get('origin')) || 'https://terra.workers.dev';
  let ok = 0; const keep = [];
  for (const s of u.subs) {
    const r = await webPush(s, JSON.stringify(msg), v, origin).catch(() => null);
    if (r && (r.status === 404 || r.status === 410)) continue;
    keep.push(s); if (r && r.ok) ok++;
  }
  if (keep.length !== u.subs.length) { u.subs = keep; if (!keep.length) await removeFromIndex(env, id); }
  return ok;
}

/* ---------------- Web Push (RFC 8291 aes128gcm + VAPID RFC 8292), WebCrypto only ---------------- */
const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
async function hmac(key, data) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, data)); }

/* The server's VAPID key pair is made once, on first use, and kept in KV */
async function vapid(env) {
  let v = await env.TERRA.get('vapid', 'json');
  if (!v) {
    const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    v = { publicKey: b64u(await crypto.subtle.exportKey('raw', kp.publicKey)), jwk: await crypto.subtle.exportKey('jwk', kp.privateKey) };
    await env.TERRA.put('vapid', JSON.stringify(v));
  }
  return v;
}
async function vapidAuth(endpoint, v, subject) {
  const aud = new URL(endpoint).origin;
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const sub = /^https:|^mailto:/.test(subject) ? subject : 'mailto:terra@example.com';
  const body = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub })));
  const key = await crypto.subtle.importKey('jwk', v.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + body));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${v.publicKey}`;
}
async function webPush(sub, payload, v, origin) {
  const uaPublic = unb64u(sub.keys.p256dh), authSecret = unb64u(sub.keys.auth);
  const as = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', as.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, as.privateKey, 256));
  const prkKey = await hmac(authSecret, ecdh);
  const ikm = await hmac(prkKey, cat(enc.encode('WebPush: info\0'), uaPublic, asPublic, new Uint8Array([1])));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode('Content-Encoding: nonce\0'), new Uint8Array([1])))).slice(0, 12);
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, cat(enc.encode(payload), new Uint8Array([2]))));
  const header = cat(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPublic.length]), asPublic);
  return fetch(sub.endpoint, { method: 'POST', headers: { 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '3600', Urgency: 'high', Authorization: await vapidAuth(sub.endpoint, v, origin) }, body: cat(header, ct) });
}

function json(obj, status, headers) { return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'content-type': 'application/json' } }); }
