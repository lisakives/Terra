/* ============ Terra: calm illustrations (eucalyptus, bell, rank stairs) ============ */
function EUCA() {
  const L = [[150, -1, 13, 'a'], [138, 1, 12.5, 'b'], [124, -1, 12, 'c'], [110, 1, 11.5, 'a'], [96, -1, 11, 'b'], [82, 1, 10, 'c'], [68, -1, 9.5, 'a'], [55, 1, 8.5, 'b'], [43, -1, 7.5, 'c'], [32, 1, 6.5, 'a'], [22, -1, 5.5, 'b']];
  const col = { a: '#9CC8B6', b: '#7FAE9C', c: '#B9DACB' };
  const stemX = y => 100 + Math.sin((166 - y) / 34) * 7 + (166 - y) * .06;
  const leaves = L.map(([y, side, r, c], i) => { const x = stemX(y); const cx = x + side * (r * .95); const rot = side * (18 + i * 2);
    return `<g class="eu-leaf" style="--d:${(i * .35).toFixed(2)}s;transform-origin:${x.toFixed(1)}px ${y}px"><ellipse cx="${cx.toFixed(1)}" cy="${(y - 2).toFixed(1)}" rx="${r}" ry="${(r * .82).toFixed(1)}" transform="rotate(${rot} ${cx.toFixed(1)} ${y - 2})" fill="${col[c]}" stroke="rgba(29,25,36,.55)" stroke-width="1.4"/><path d="M${x.toFixed(1)},${y} Q${(x + side * r * .9).toFixed(1)},${(y - 4).toFixed(1)} ${(x + side * r * 1.7).toFixed(1)},${(y - 3).toFixed(1)}" fill="none" stroke="rgba(29,25,36,.3)" stroke-width="1"/></g>`; }).join('');
  const stem = Array.from({ length: 30 }, (_, i) => { const y = 168 - i * 5.2; return `${i ? 'L' : 'M'}${stemX(y).toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  return `<svg class="char euca" viewBox="0 0 200 172" role="img" aria-label="A eucalyptus sprig swaying gently while soft breath drifts past" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="euGlow" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#9CC8B6" stop-opacity=".35"/><stop offset="1" stop-color="#9CC8B6" stop-opacity="0"/></radialGradient></defs>
    <circle class="eu-glow" cx="104" cy="96" r="78" fill="url(#euGlow)"/>
    <g class="eu-wisps" fill="none" stroke-linecap="round">
      <path class="wisp" d="M8,70 C40,58 62,82 92,70 S150,56 192,66" stroke="rgba(201,176,255,.55)" stroke-width="2.2"/>
      <path class="wisp" style="--d:1.6s" d="M4,104 C34,94 60,114 94,104 S154,92 196,100" stroke="rgba(155,200,182,.55)" stroke-width="2"/>
      <path class="wisp" style="--d:3.2s" d="M14,134 C44,126 70,142 100,134 S152,124 188,132" stroke="rgba(201,176,255,.4)" stroke-width="1.8"/>
    </g>
    <g class="eu-sway"><path d="${stem}" fill="none" stroke="#5F8474" stroke-width="3.2" stroke-linecap="round"/>${leaves}</g>
    <circle class="c-spark" cx="44" cy="40" r="2" fill="#B9DACB"/><circle class="c-spark" style="animation-delay:1.2s" cx="164" cy="30" r="1.8" fill="#c9b0ff"/><circle class="c-spark" style="animation-delay:2.1s" cx="168" cy="146" r="2" fill="#B9DACB"/>
  </svg>`;
}
/* Moment: a bonsai whose leaf clouds breathe slowly */
function BONSAI() {
  const pad = (x, y, k, d) => {
    const s = k;
    const dark = [[-12, 3, 13], [0, -2, 16], [13, 3, 12], [4, 7, 12]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#5e9a7f"/>`).join('');
    const mid = [[-9, -1, 10], [2, -6, 12], [12, -1, 9]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#7fbf9c"/>`).join('');
    const lite = [[-4, -8, 6], [8, -9, 5]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#b4e0c6" opacity=".9"/>`).join('');
    return `<g class="bs-pad" style="--d:${d}s;transform-origin:${x}px ${y + 8 * s}px">${dark}${mid}${lite}</g>`;
  };
  return `<svg class="char bonsai" viewBox="0 0 200 172" role="img" aria-label="A bonsai tree whose leaves breathe slowly" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="bsGlow" cx="50%" cy="50%" r="50%"><stop offset="0" style="stop-color:var(--accent)" stop-opacity=".35"/><stop offset="1" style="stop-color:var(--accent)" stop-opacity="0"/></radialGradient></defs>
    <circle class="bs-glow" cx="102" cy="80" r="78" fill="url(#bsGlow)"/>
    <g class="bs-tree">
      <path d="M86,70 C76,64 62,64 52,70" fill="none" stroke="#6e4c3a" stroke-width="5" stroke-linecap="round"/>
      <path d="M106,92 C120,86 134,86 146,92" fill="none" stroke="#6e4c3a" stroke-width="5" stroke-linecap="round"/>
      <path d="M86,62 C88,50 98,42 110,40" fill="none" stroke="#6e4c3a" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M92,142 C89,126 104,117 100,103 C96,91 80,88 79,74 C78,66 84,60 91,61 C86,69 92,79 104,85 C117,92 115,110 109,123 C106,131 108,137 111,142 Z" fill="#7a5640"/>
      <path d="M96,138 C95,128 104,120 103,108" fill="none" stroke="#a07558" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      ${pad(52, 64, 1, 0)}${pad(146, 86, .95, .8)}${pad(110, 36, 1.12, 1.6)}
    </g>
    <ellipse cx="100" cy="142" rx="42" ry="4.5" fill="#3d302c"/>
    <rect x="50" y="139" width="100" height="9" rx="4.5" fill="#e0916f"/>
    <path d="M58,148 L142,148 L134,163 L66,163 Z" fill="#c9785a"/>
    <path d="M62,151 L138,151" stroke="#e7a283" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    <rect x="70" y="163" width="10" height="4" rx="1.5" fill="#a85f45"/><rect x="120" y="163" width="10" height="4" rx="1.5" fill="#a85f45"/>
    <circle class="c-spark" cx="34" cy="40" r="2.2" fill="#f5c35b"/><circle class="c-spark" style="animation-delay:1.4s" cx="168" cy="52" r="1.8" fill="#c9b0ff"/><circle class="c-spark" style="animation-delay:2.6s" cx="158" cy="24" r="1.6" fill="#8fcba4"/>
  </svg>`;
}
/* Today's scene: four times of day, drawn like the characters (dark outlines, soft flat colours).
   It is also your world: every small step grows something on the hills, the path climbs a little further,
   and the land follows the real seasons. Nothing ever wilts or disappears. */
const SEASON_OF = (d = new Date()) => { const m = d.getMonth(); return m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn'; };
const DARK_SEASON = (d = new Date()) => { const m = d.getMonth(); return m === 10 || m === 11 || m === 0; };
function mixHex(a, b, t) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
/* [steps needed, kind, x, layer (b = far hill, f = near hill, s = sky), size, sky y] */
const WORLD = [
  [1, 'tuft', 48, 'f', 1], [2, 'flower', 70, 'f', 1], [3, 'tuft', 160, 'f', 1], [4, 'bush', 28, 'b', 1],
  [6, 'flower', 112, 'f', 1], [8, 'tree', 60, 'b', .9], [10, 'tuft', 96, 'f', 1], [13, 'flower', 182, 'f', .9],
  [16, 'pine', 155, 'b', .9], [20, 'bird', 165, 's', 1, 34], [24, 'bush', 192, 'f', .9], [28, 'tree', 182, 'b', .8],
  [33, 'flower', 30, 'f', .9], [38, 'pine', 92, 'b', .8], [44, 'bird', 186, 's', .8, 24], [50, 'tree', 36, 'f', 1.1],
  [57, 'flower', 86, 'f', .8], [65, 'bush', 205, 'b', .8], [75, 'bird', 148, 's', .7, 50], [85, 'tuft', 62, 'f', .9],
  [100, 'cabin', 126, 'b', 1], [120, 'flower', 125, 'f', .8], [140, 'tuft', 172, 'f', .9], [170, 'pine', 20, 'b', .9],
];
const WORLD_NEXT = n => (WORLD.find(w => w[0] > n) || [null])[0];
const HILL_B = [[[-5, 104], [60, 80], [140, 82], [210, 94]], [[210, 94], [262, 102], [312, 90], [365, 78]]];
const HILL_F = [[[-5, 128], [80, 108], [170, 112], [250, 124]], [[250, 124], [300, 132], [340, 122], [365, 114]]];
function hillY(segs, x) {
  const s = segs.find(g => x >= g[0][0] && x <= g[3][0]) || segs[0];
  const b = (t, i) => { const u = 1 - t; return u * u * u * s[0][i] + 3 * u * u * t * s[1][i] + 3 * u * t * t * s[2][i] + t * t * t * s[3][i]; };
  let lo = 0, hi = 1;
  for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (b(m, 0) < x) lo = m; else hi = m; }
  return b((lo + hi) / 2, 1);
}
function SCENE(tod, world = {}) {
  const O = '#241a3a', W = 'stroke="' + O + '" stroke-width="2.2" stroke-linejoin="round"', w = 'stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"';
  const season = world.season || SEASON_OF();
  const n = world.count || 0, seen = world.seen ?? n;
  const night = tod === 'night';
  const tint = { autumn: ['#d9893a', night ? .14 : .32], winter: [night ? '#9aa3c8' : '#f1f5fa', night ? .3 : .62], spring: ['#c4ec8e', .16], summer: ['#4fb68a', 0] }[season];
  const land = c => mixHex(c, tint[0], tint[1]);
  const shade = c => night ? mixHex(c, '#2a2150', .62) : tod === 'dusk' ? mixHex(c, '#3f2f5e', .28) : c;
  const foliage = i => shade({ autumn: ['#e8893a', '#d4553a', '#f2c14e'][i % 3], winter: '#eef3f8', spring: ['#7fcf8f', '#f5b3c8'][i % 2], summer: '#5fbf84' }[season]);
  const grass = shade(season === 'winter' ? '#dfe7f0' : season === 'autumn' ? '#b98a3e' : '#3f9a6c');
  const pineC = shade('#2f7a5c');
  const draw = (kind, x, y, k, i) => {
    switch (kind) {
      case 'tuft': return `<path d="M${x - 4},${y} c1,-5 1,-7 -1,-${9 * k} M${x},${y} c0,-6 1,-9 2,-${11 * k} M${x + 4},${y} c-1,-5 0,-7 2,-${8 * k}" fill="none" stroke="${grass}" stroke-width="2.2" stroke-linecap="round"/>`;
      case 'flower':
        if (season === 'winter') return `<path d="M${x - 6 * k},${y} q${6 * k},-${8 * k} ${12 * k},0Z" fill="${shade('#f4f8fc')}" ${w}/>`;
        { const c = shade(season === 'autumn' ? '#f2a03d' : ['#f7a8c4', '#ffd36e', '#c9b0ff'][i % 3]); const cy = y - 10 * k;
          const pet = [0, 72, 144, 216, 288].map(a => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * 3.2 * k).toFixed(1)}" cy="${(cy + Math.sin(a * Math.PI / 180) * 3.2 * k).toFixed(1)}" r="${2.4 * k}" fill="${c}" ${w.replace('1.6', '1.1')}/>`).join('');
          return `<path d="M${x},${y} L${x},${cy}" stroke="${grass}" stroke-width="1.8" stroke-linecap="round"/>${pet}<circle cx="${x}" cy="${cy}" r="${1.7 * k}" fill="#fff1c4"/>`; }
      case 'bush': return `<path d="M${x - 10 * k},${y} a${6 * k},${6 * k} 0 0 1 ${5 * k},-${9 * k} a${7 * k},${7 * k} 0 0 1 ${11 * k},-${2 * k} a${6 * k},${6 * k} 0 0 1 ${4 * k},${11 * k}Z" fill="${foliage(i)}" ${w}/>`;
      case 'tree': {
        const top = y - 16 * k, crown = season === 'winter' ? `<circle cx="${x}" cy="${top - 7 * k}" r="${11 * k}" fill="${foliage(i)}" ${w}/>` : `<circle cx="${x}" cy="${top - 7 * k}" r="${11 * k}" fill="${foliage(i)}" ${w}/><circle cx="${x - 4 * k}" cy="${top - 11 * k}" r="${3.2 * k}" fill="#fff" opacity=".22"/>`;
        return `<rect x="${x - 2 * k}" y="${top}" width="${4 * k}" height="${16 * k}" rx="1.5" fill="${shade('#7a5640')}" ${w}/>${crown}`;
      }
      case 'pine': {
        const h = 26 * k;
        const snow = season === 'winter' ? `<path d="M${x},${y - h} l${4 * k},${7 * k} l-${8 * k},0Z" fill="#fff"/>` : '';
        return `<path d="M${x},${y - h} l${8 * k},${12 * k} l-${3 * k},0 l${6 * k},${10 * k} l-${22 * k},0 l${6 * k},-${10 * k} l-${3 * k},0Z" fill="${season === 'winter' ? mixHex(pineC, '#dfe7f0', .25) : pineC}" ${w}/>${snow}<rect x="${x - 1.5 * k}" y="${y - 4 * k}" width="${3 * k}" height="${4 * k}" fill="${shade('#7a5640')}"/>`;
      }
      case 'bird': return night ? '' : `<path class="sc-bird" d="M${x - 6 * k},${y} c${3 * k},-${3 * k} ${5 * k},-${3 * k} ${6 * k},0 c${1 * k},-${3 * k} ${3 * k},-${3 * k} ${6 * k},0" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>`;
      case 'cabin': {
        const c = shade('#b5422f'), t = shade('#fff4e0'), roof = season === 'winter' ? '#f4f8fc' : shade('#4a3a4e');
        const win = night || tod === 'dusk' ? '#ffd36e' : shade('#9fd3f0');
        return `<rect x="${x - 10}" y="${y - 13}" width="20" height="13" fill="${c}" ${w}/><path d="M${x - 13},${y - 12} L${x},${y - 22} L${x + 13},${y - 12}Z" fill="${roof}" ${w}/><rect x="${x - 6}" y="${y - 9}" width="5" height="5" fill="${win}" stroke="${t}" stroke-width="1.2"/><rect x="${x + 2}" y="${y - 8}" width="4" height="8" fill="${t}" ${w.replace('1.6', '1')}/><path class="sc-smoke" d="M${x + 7},${y - 20} q-3,-4 0,-7 q3,-3 0,-7" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`;
      }
    }
    return '';
  };
  const grown = WORLD.filter(g => g[0] <= n);
  const place = layer => grown.map((g, i) => {
    if (g[3] !== layer) return '';
    const [thr, kind, x, , k, sy] = g;
    const y = layer === 's' ? sy : hillY(layer === 'b' ? HILL_B : HILL_F, x) + 1.5;
    const fresh = thr > seen;
    return `<g class="w-item${fresh ? ' w-new' : ''}" ${fresh ? `style="animation-delay:${(.5 + i % 4 * .25).toFixed(2)}s"` : ''}>${draw(kind, x, +y.toFixed(1), k, i)}</g>`;
  }).join('');
  const p = v => (.26 + .74 * Math.sqrt(Math.min(1, v / 150))).toFixed(3);
  const pathD = 'M150,156 C154,142 128,138 134,127 C140,116 152,112 142,104 C134,97 120,99 126,90';
  const pathCol = night ? mixHex(season === 'winter' ? '#c9d6e6' : '#fff3d6', '#2a2150', .45) : season === 'winter' ? '#c9d6e6' : '#fff3d6';
  const path = `<g class="w-path" style="--o0:${(1 - p(seen)).toFixed(3)};--o1:${(1 - p(n)).toFixed(3)}"><path d="${pathD}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - p(n)).toFixed(3)}" fill="none" stroke="${O}" stroke-width="7" stroke-linecap="round"/><path d="${pathD}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - p(n)).toFixed(3)}" fill="none" stroke="${pathCol}" stroke-width="4.2" stroke-linecap="round"/></g>`;
  const hills = (b, f) => `<path class="sc-h1" d="M-5,104 C60,80 140,82 210,94 C262,102 312,90 365,78 L365,155 L-5,155Z" fill="${land(b)}" ${W}/>${place('b')}
    <path class="sc-h2" d="M-5,128 C80,108 170,112 250,124 C300,132 340,122 365,114 L365,155 L-5,155Z" fill="${land(f)}" ${W}/>${path}${place('f')}${place('s')}`;
  const star = (x, y, s, d) => `<path class="sc-star" style="animation-delay:${d}s" d="M${x},${y - s} L${x + s * .28},${y - s * .28} L${x + s},${y} L${x + s * .28},${y + s * .28} L${x},${y + s} L${x - s * .28},${y + s * .28} L${x - s},${y} L${x - s * .28},${y - s * .28}Z" fill="#fff4cf"/>`;
  const cloud = (x, y, k, d) => `<g class="sc-cloud" style="animation-delay:${d}s"><path d="M${x},${y} a${10 * k},${10 * k} 0 0 1 ${12 * k},${-12 * k} a${15 * k},${15 * k} 0 0 1 ${27 * k},${-3 * k} a${11 * k},${11 * k} 0 0 1 ${13 * k},${15 * k} Z" fill="#ffffff" ${W}/></g>`;
  const leaf = (x, y, c, d) => `<g class="c-leaf" style="animation-delay:${d}s"><path d="M${x},${y} c4,-7 13,-8 18,-4 c-4,7 -12,9 -18,4Z" fill="${c}" ${W.replace('2.2', '1.6')}/></g>`;
  /* the season in the air: falling leaves, snow, or petals */
  const air = season === 'autumn' ? [[40, '#e8893a', 0], [150, '#d4553a', 2.6], [250, '#f2c14e', 5.1], [320, '#e8893a', 7.4]].map(([x, c, d]) => `<g class="sc-fall" style="animation-delay:${d}s"><path d="M${x},-8 c3,-5 9,-6 12,-3 c-3,5 -8,6 -12,3Z" fill="${shade(c)}" ${w.replace('1.6', '1.1')}/></g>`).join('')
    : season === 'winter' ? [[30, 0], [90, 1.8], [140, 4.2], [205, .9], [262, 3.1], [330, 5.4], [175, 6.6]].map(([x, d]) => `<circle class="sc-snow" style="animation-delay:${d}s" cx="${x}" cy="-6" r="2.2" fill="#fff"/>`).join('')
    : season === 'spring' ? [[60, 0], [200, 3], [300, 5.5]].map(([x, d]) => `<g class="sc-fall" style="animation-delay:${d}s"><circle cx="${x}" cy="-6" r="3" fill="#f7c4d6" ${w.replace('1.6', '1')}/></g>`).join('') : '';
  let sky, body;
  if (tod === 'dawn') {
    sky = ['#a98bd6', '#f2a3a4', '#ffd6aa'];
    body = `<circle class="sc-sun rise" cx="118" cy="98" r="30" fill="#ffd36e" ${W}/>${hills('#8fd2a8', '#4fae86')}${season === 'summer' ? leaf(232, 40, '#8fd2a8', 0) + leaf(300, 66, '#ffb37a', 1.8) : ''}`;
  } else if (tod === 'day') {
    sky = season === 'winter' ? ['#8cc2ec', '#c4e2f7', '#eef7ff'] : ['#6fb9f0', '#a9dcfb', '#e2f4ff'];
    const rays = Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M${70 + Math.cos(a) * 30},${40 + Math.sin(a) * 30} L${70 + Math.cos(a) * 38},${40 + Math.sin(a) * 38}" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
    body = `<g class="sc-rays">${rays}</g><circle class="sc-sun" cx="70" cy="40" r="21" fill="#ffd95e" ${W}/>${cloud(170, 48, 1.15, 0)}${cloud(268, 70, .9, 3)}${hills('#9be0b6', '#4fb68a')}`;
  } else if (tod === 'dusk') {
    sky = ['#56408f', '#c26f93', '#ffb27a'];
    body = `${star(52, 24, 4, 0)}${star(250, 18, 3.4, 1.2)}${star(318, 40, 3, 2.1)}<circle class="sc-sun" cx="96" cy="100" r="28" fill="#ff9a5c" ${W}/>${hills('#6f9e8a', '#3f6e63')}`;
  } else {
    sky = ['#100c22', '#1f1840', '#35296b'];
    body = `${star(40, 30, 4, 0)}${star(118, 18, 3, .8)}${star(205, 40, 3.6, 1.6)}${star(262, 22, 3, 2.4)}${star(330, 50, 4, .4)}${star(160, 64, 2.6, 2)}
      <g class="sc-moon"><path d="M84,24 a26,26 0 1 0 22,40 a20,20 0 1 1 -22,-40Z" fill="#fff1c4" ${W}/></g>${hills('#3d3266', '#2a2150')}`;
  }
  return `<svg class="scene-art sc-${tod} se-${season}" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="sky-${tod}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient></defs>
    <rect x="0" y="0" width="360" height="150" fill="url(#sky-${tod})"/>${body}${air}</svg>`;
}
function BELL() {
  const O = '#2a1f3d';
  return `<svg class="char bell" viewBox="0 0 220 160" role="img" aria-label="A softly ringing bell with small leaves" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bellGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F7C46C" stop-opacity=".45"/><stop offset="1" stop-color="#F7C46C" stop-opacity="0"/></radialGradient>
      <linearGradient id="bellBody" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#FFD98A"/><stop offset=".55" stop-color="#F7C46C"/><stop offset="1" stop-color="#E3A64A"/></linearGradient>
    </defs>
    <circle class="bell-glow" cx="110" cy="78" r="70" fill="url(#bellGlow)"/>
    <g class="bell-waves" fill="none" stroke="#c9b0ff" stroke-width="3.2" stroke-linecap="round"><path class="bw" d="M52,56 C42,68 42,92 52,104"/><path class="bw" style="--d:.5s" d="M36,44 C20,64 20,96 36,116"/><path class="bw" d="M168,56 C178,68 178,92 168,104"/><path class="bw" style="--d:.5s" d="M184,44 C200,64 200,96 184,116"/></g>
    <g class="bell-swing">
      <g class="bell-clap"><path d="M110,104 L110,118" stroke="${O}" stroke-width="3" stroke-linecap="round"/><circle cx="110" cy="124" r="9" fill="#F2856B" stroke="${O}" stroke-width="2.6"/><circle cx="107" cy="121" r="2.6" fill="#fff" opacity=".55"/></g>
      <path d="M103,26 C103,14 117,14 117,26" fill="none" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
      <path d="M103,26 C103,14 117,14 117,26" fill="none" stroke="#E3A64A" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M78,100 C78,64 86,32 110,30 C134,32 142,64 142,100 L146,108 L74,108 Z" fill="url(#bellBody)" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="64" y="104" width="92" height="13" rx="6.5" fill="#E3A64A" stroke="${O}" stroke-width="3"/>
      <rect x="70" y="107" width="40" height="3.2" rx="1.6" fill="#FFE6A8" opacity=".8"/>
      <path d="M92,92 C90,70 94,50 104,42" fill="none" stroke="#FFF3CF" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      <circle cx="96" cy="99" r="2.4" fill="#FFF3CF" opacity=".85"/>
    </g>
    <g class="c-leaf"><g transform="translate(150 132) rotate(-20) scale(1.3)"><path d="M0,0 C3,-6 11,-7 16,-4 C12,2 5,4 0,0Z" fill="#7DBF68" stroke="${O}" stroke-width="1.2"/></g></g>
    <g class="c-leaf" style="animation-delay:1.2s"><g transform="translate(62 140) rotate(200) scale(1.3)"><path d="M0,0 C3,-6 11,-7 16,-4 C12,2 5,4 0,0Z" fill="#E9853C" stroke="${O}" stroke-width="1.2"/></g></g>
    <circle class="c-spark" cx="172" cy="26" r="2.6" fill="#F7C46C"/><circle class="c-spark" style="animation-delay:1s" cx="46" cy="24" r="2.2" fill="#c9b0ff"/>
  </svg>`;
}
function rankStairs(xp, i) {
  const n = RANKS.length, W = 320, base = 132, sw = 44, gap = 2;
  const nx = RANKS[i + 1]; const part = nx ? (xp - RANKS[i][1]) / (nx[1] - RANKS[i][1]) : 1;
  const cols = ['#8FCBA4', '#86C3A8', '#7DB8B4', '#8FA8DA', '#9B7BF0', '#C784C9', '#F2856B'];
  let steps = '', labels = '';
  RANKS.forEach((r, j) => {
    const h = 20 + j * 16, x = 4 + j * (sw + gap), y = base - h;
    const got = j <= i;
    steps += `<g class="st ${got ? 'got' : ''} ${j === i ? 'cur' : ''}" style="--d:${(j * .07).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="${sw}" height="${h}" rx="8" fill="${got ? cols[j] : 'rgba(255,255,255,.05)'}" ${got ? '' : 'stroke="rgba(255,255,255,.18)" stroke-dasharray="4 4"'} stroke-width="1.5"/>
      ${got ? `<rect x="${x}" y="${y}" width="${sw}" height="6" rx="3" fill="rgba(255,255,255,.35)"/>` : ''}
      ${j === i + 1 ? `<rect x="${x}" y="${base - 4}" width="${(sw * Math.max(.06, part)).toFixed(1)}" height="4" rx="2" fill="${cols[j]}"/>` : ''}
    </g>`;
    labels += `<text x="${x + sw / 2}" y="${y - 10}" text-anchor="middle" font-size="${j === i ? 0 : 17}" class="st-e ${got ? 'got' : ''}">${r[2]}</text>`;
  });
  const cx = 4 + i * (sw + gap) + sw / 2, cy = base - (20 + i * 16);
  const me = `<g class="st-me" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy - 22}" r="17" fill="#12101a" stroke="${cols[i]}" stroke-width="2.5"/><text x="${cx}" y="${cy - 16}" text-anchor="middle" font-size="18">${RANKS[i][2]}</text><path d="M${cx - 5},${cy - 6} L${cx},${cy - 1} L${cx + 5},${cy - 6}Z" fill="${cols[i]}"/></g>`;
  return `<svg class="stairs" viewBox="0 0 ${W} 140" role="img" aria-label="Rank stairs: you are on step ${i + 1} of ${n}, ${RANKS[i][0]}" xmlns="http://www.w3.org/2000/svg">${steps}${labels}${me}</svg>`;
}
