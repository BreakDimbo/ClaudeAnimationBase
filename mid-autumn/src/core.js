// ───────────────────────── core: seeded random, time helpers, pencil painting, camera ─────────────────────────
const W = 1920, H = 1080, FPS = 24, DUR = 120, STORY = 180, BOIL = 12;   // DUR: the film; STORY: the storyboard timeline the shots are written on
const cv = document.getElementById('cv');
let ctx = cv.getContext('2d');
const TAU = Math.PI * 2;

// ── seeded randomness ──
function ihash(x) { x |= 0; x = Math.imul(x ^ (x >>> 16), 0x7feb352d); x = Math.imul(x ^ (x >>> 15), 0x846ca68b); return (x ^ (x >>> 16)) >>> 0; }
function skey(s) { if (typeof s === 'number') return s | 0; let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
// stable per-object value in [0,1)
function hash(a, b = 0, c = 0) { return ihash(ihash(ihash(skey(a)) + skey(b) * 7919) + skey(c) * 104729) / 4294967296; }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let BF = 0;                       // boil frame: 12 drawings a second
let R = mulberry(1);
function seed(key) { R = mulberry(ihash(BF * 7919 + skey(key) * 31)); }
const jit = a => (R() * 2 - 1) * a;

// ── math & easing ──
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = k => k * k * (3 - 2 * k);
const easeIn = k => k * k * k;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const backOut = (k, s = 1.7) => { k -= 1; return 1 + k * k * ((s + 1) * k + s); };
const elasticOut = k => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * TAU / 3) + 1;
const wob = (t, f = 1, p = 0) => Math.sin((t * f + p) * TAU);
// keyframes: [[t, v], ...]; v may be a number or array
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [t0, v0] = keys[i - 1], [t1, v1] = keys[i], k = e((t - t0) / (t1 - t0));
    return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k);
  }
  return keys[keys.length - 1][1];
}
// damped wobble after an event (follow-through)
const spring = (t, t0, f = 3, d = 5) => t < t0 ? 0 : Math.exp(-(t - t0) * d) * Math.sin((t - t0) * f * TAU);
// point on a thrown arc
const arcPt = (p0, p1, h, k) => [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k) - h * 4 * k * (1 - k)];
// hop: anticipation squash, arc, landing squash → {dy, sq}
function hop(t, t0, t1, h) {
  if (t < t0 - .12 || t > t1 + .2) return { dy: 0, sq: 0 };
  if (t < t0) { const k = seg(t, t0 - .12, t0); return { dy: 0, sq: .12 * Math.sin(k * Math.PI / 2) }; }
  if (t < t1) { const k = seg(t, t0, t1); return { dy: -h * 4 * k * (1 - k), sq: -.1 * Math.cos(k * Math.PI) }; }
  const k = seg(t, t1, t1 + .2); return { dy: 0, sq: .14 * Math.sin(k * Math.PI) * (1 - k) };
}

// ── colour ──
const PAL = {
  paper: '#F3E9D4', paper2: '#EADCC0', ink: '#1F2A52', inkSoft: '#4A4F6E',
  red: '#D8452E', redDk: '#A8322A', rose: '#EE7D86', pink: '#F29BB0',
  gold: '#F2B845', moon: '#FBE3A0', moonHi: '#FFF4D6', amber: '#E9953A',
  jade: '#5E9E8C', jadeDk: '#3F7467', sage: '#9DB99A',
  night: '#27305A', nightDk: '#1B2142', indigo: '#34437A', dusk: '#8D7EA8', duskHi: '#E6A887',
  wall: '#E8DCC6', wallDk: '#C9B89C', tile: '#5B6380', tileDk: '#3E4461', wood: '#8A5A3C', woodLt: '#B98459',
  skin: '#F1C6A4', skinDk: '#D9A07E', skinOld: '#E8B996',
};
function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function toHex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, k) { const A = hex(a), B = hex(b); return toHex(lerp(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k)); }
function rgba(c, a) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; }

// ── scene tint: every shot sets a light colour; fills are mixed toward it (dusk, night, lantern) ──
let LIGHT = null, LIGHTK = 0;
function setLight(col, k) { LIGHT = col; LIGHTK = k; }
const lit = c => LIGHT && LIGHTK > 0 ? mix(c, LIGHT, Math.round(LIGHTK * 20) / 20) : c;

// ── pencil textures: one tile per colour, cached; diagonal colour-pencil strokes with paper tooth ──
const PAT = new Map();
function pencilTile(col, kind = 'fill') {
  // colour-pencil / crayon tile like the reference portraits: tone strokes of the local colour,
  // plus stray warm and cool strokes, plus paper tooth
  const S = 192, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  const r = mulberry(skey(col + kind) ^ 0x51ed);
  const L = lum(col);
  if (kind === 'fill') { g.fillStyle = col; g.fillRect(0, 0, S, S); }
  const dk = mix(col, '#1E2A5A', .38), lt = mix(col, '#FFF4DC', .34);
  const warm = L < .3 ? '#C9793A' : '#F0A23A', cool = L < .3 ? '#5A7AC0' : '#3F74B8', rose = '#E8604A';
  const passes = kind === 'fill'
    ? [[dk, 800, -.72, 4, 12, .1, .24], [lt, 520, -1.1, 4, 11, .1, .24], [warm, 170, -.8, 6, 14, .08, .2], [cool, 150, -.62, 6, 14, .08, .2], [rose, 80, -.95, 5, 12, .06, .16], [dk, 180, -.72, 12, 22, .06, .12]]
    : kind === 'shade'
    ? [[mix(col, '#1C2A66', .55), 900, -.75, 5, 13, .18, .34], [cool, 260, -.6, 5, 12, .12, .24], [rose, 60, -.9, 5, 10, .08, .16]]
    : [[mix(col, '#FFE08A', .6), 700, -1.0, 5, 12, .14, .28], [mix(col, '#FFF8E8', .6), 300, -.8, 4, 9, .12, .24], [rose, 50, -1.1, 4, 9, .06, .12]];
  g.lineCap = 'round';
  for (const [colr, n, ang, L0, L1, a0, a1] of passes) {
    for (let i = 0; i < n; i++) {
      const x = r() * S, y = r() * S, len = L0 + r() * L1, an = ang + (r() - .5) * .25, dx = Math.cos(an) * len, dy = Math.sin(an) * len;
      g.strokeStyle = rgba(colr, a0 + r() * (a1 - a0)); g.lineWidth = .7 + r() * 1.2;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { g.beginPath(); g.moveTo(x + ox, y + oy); g.lineTo(x + dx + ox, y + dy + oy); g.stroke(); }
    }
  }
  if (kind === 'fill') for (let i = 0; i < 1100; i++) { g.fillStyle = rgba(r() < .7 ? '#FFF8EA' : '#1E2A5A', .05 + r() * .14); g.fillRect(r() * S, r() * S, 1 + r() * 1.4, 1); }
  return ctx.createPattern(c, 'repeat');
}
function lum(h) { const [r, g, b] = hex(h); return (r * .3 + g * .59 + b * .11) / 255; }
function pencil(col, sc = 1, ax = 0, ay = 0, kind = 'fill') {
  const key = col + kind;
  let p = PAT.get(key); if (!p) { if (PAT.size > 900) PAT.clear(); p = pencilTile(col, kind); PAT.set(key, p); }
  // the hatching itself boils: each drawing shifts the tile a little
  const o = (BF % 3) * 23;
  p.setTransform(new DOMMatrix().translate(ax + o, ay + o * .6).scale(sc));
  return p;
}
// current zoom compensation so hatch looks the same size everywhere
let HATCH = 1;

// ── paths ──
function wobblePts(pts, a) { return a ? pts.map(([x, y]) => [x + jit(a), y + jit(a)]) : pts; }
function tracePath(P, closed, curv) {
  ctx.beginPath();
  if (!curv || P.length < 3) { ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); if (closed) ctx.closePath(); return; }
  const n = P.length;
  if (closed) {
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let s = m(P[n - 1], P[0]); ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const q = m(P[i], P[(i + 1) % n]); ctx.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
    ctx.closePath();
  } else {
    ctx.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < n - 1; i++) { const q = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2]; ctx.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
    ctx.lineTo(P[n - 1][0], P[n - 1][1]);
  }
}
// paint a closed shape: pencil fill, riso offset rim, wobbly ink outline
// o: {fill, flat, alpha, ink, sw, rim, rimCol, curv, wob, sc, ax, ay}
// paint a closed shape the way the reference portraits are drawn: two misregistered colour rims (coral, gold),
// colour-pencil fill, a warm light edge (top-left) and a cool hatched shadow edge (bottom-right), a dark-blue ink line.
// o: {fill, flat, alpha, ink, sw, rim, rimCol, curv, wob, sc, ax, ay, band}
function shape(pts, o = {}) {
  const wa = o.wob ?? 1.2, P = wobblePts(pts, wa), curv = o.curv ?? 1;
  const a = o.alpha ?? 1;
  if (o.rim) {
    const rx = o.rimX ?? 3.2, ry = o.rimY ?? 2.4, w = o.rimW ?? (o.sw ?? 2) * 1.5;
    ctx.save(); ctx.globalAlpha = a * .85; ctx.translate(rx, ry); tracePath(P, true, curv); ctx.lineWidth = w; ctx.strokeStyle = o.rimCol || '#E8563E'; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a * .55; ctx.translate(rx * .2, ry * 1.2); tracePath(P, true, curv); ctx.lineWidth = w * .8; ctx.strokeStyle = '#3F6BC0'; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a * .7; ctx.translate(-rx * .8, -ry * .7); tracePath(P, true, curv); ctx.lineWidth = w * .9; ctx.strokeStyle = o.rimCol2 || '#F2B53A'; ctx.stroke(); ctx.restore();
  }
  if (o.fill) {
    const col = lit(o.fill);
    tracePath(P, true, curv);
    ctx.globalAlpha = a;
    ctx.fillStyle = o.flat ? col : pencil(col, (o.sc ?? 1) * HATCH, o.ax ?? 0, o.ay ?? 0);
    ctx.fill();
    // light and shadow edges
    let b = o.band;
    if (b === undefined && !o.flat) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of P) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } b = clamp(Math.min(x1 - x0, y1 - y0) * .16, 0, 60); if (b < 3) b = 0; }
    if (b > 0 && !o.flat) {
      ctx.save(); tracePath(P, true, curv); ctx.clip();
      const off = (dx, dy, kind, al) => {
        ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5);
        const Q = P.map(([x, y]) => [x + dx, y + dy]); tracePathAppend(Q, curv);
        ctx.globalAlpha = a * al; ctx.fillStyle = pencil(col, (o.sc ?? 1) * HATCH, o.ax ?? 0, o.ay ?? 0, kind); ctx.fill('evenodd');
      };
      off(-b, -b * .9, 'shade', 1);
      off(b * .7, b * .7, 'light', .75);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  if (o.ink !== null && o.ink !== undefined || o.sw) {
    const ink = o.ink ?? PAL.ink;
    if (ink) {
      tracePath(P, true, curv);
      ctx.globalAlpha = a * (o.inkA ?? .92); ctx.lineWidth = o.sw ?? 2; ctx.strokeStyle = ink; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}
// the same path as tracePath, appended to the current path (for even-odd bands)
function tracePathAppend(P, curv) {
  const n = P.length;
  if (!curv || n < 3) { ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath(); return; }
  const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const s0 = m(P[n - 1], P[0]); ctx.moveTo(s0[0], s0[1]);
  for (let i = 0; i < n; i++) { const q = m(P[i], P[(i + 1) % n]); ctx.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
  ctx.closePath();
}
// wobbly pencil line; double-struck like a real pencil
function line(pts, sw = 2, col = PAL.ink, o = {}) {
  const P = wobblePts(pts, o.wob ?? 1), curv = o.curv ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = o.alpha ?? .9; ctx.strokeStyle = col; ctx.lineWidth = sw;
  tracePath(P, false, curv); ctx.stroke();
  if (o.double !== false && sw > 1.2) {
    ctx.globalAlpha = (o.alpha ?? .9) * .35; ctx.lineWidth = sw * .55;
    ctx.save(); ctx.translate(jit(1.2) + .8, jit(1.2) + .6); tracePath(P, false, curv); ctx.stroke(); ctx.restore();
  }
  ctx.globalAlpha = 1;
}
// a thick tube (arms, legs, poles) = outline stroke + pencil stroke
function tube(pts, w, col, o = {}) {
  const P = wobblePts(pts, o.wob ?? .6);
  ctx.lineCap = o.cap || 'round'; ctx.lineJoin = 'round';
  if (o.rim) { ctx.save(); ctx.translate(3, 2.2); ctx.globalAlpha = .7; ctx.strokeStyle = o.rimCol || PAL.red; ctx.lineWidth = w + 2.5; tracePath(P, false, 1); ctx.stroke(); ctx.restore(); }
  ctx.globalAlpha = 1;
  if (o.ink !== null) { ctx.strokeStyle = o.ink || PAL.ink; ctx.lineWidth = w + (o.sw ?? 2) * 2; tracePath(P, false, 1); ctx.stroke(); }
  ctx.strokeStyle = o.flat ? lit(col) : pencil(lit(col), (o.sc ?? 1) * HATCH); ctx.lineWidth = w; tracePath(P, false, 1); ctx.stroke();
}
// flat fill without outline (backgrounds): pencil texture, soft
function wash(pts, col, o = {}) { shape(pts, { fill: col, ink: null, wob: o.wob ?? 2, curv: o.curv ?? 1, alpha: o.alpha, sc: o.sc, flat: o.flat }); }

// ── point generators ──
function ellPts(cx, cy, rx, ry, n = 20, rot = 0) { const P = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; P.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return P; }
function rectPts(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
function rrPts(x, y, w, h, r, n = 3) {
  const P = [], c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  for (const [cx, cy, a0] of c) for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return P;
}
function arcPts(cx, cy, r, a0, a1, n = 12, ry = r) { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * ry]); } return P; }

// a tapered ribbon along a path, as one closed outline (limbs, scarves, tails)
function ribbonPts(P, w0, w1, cap = 3) {
  const n = P.length, L = [], Rr = [];
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = lerp(w0, w1, i / (n - 1)) / 2;
    L.push([P[i][0] + nx * w, P[i][1] + ny * w]); Rr.push([P[i][0] - nx * w, P[i][1] - ny * w]);
  }
  const end = P[n - 1], pe = P[n - 2], ae = Math.atan2(end[1] - pe[1], end[0] - pe[0]);
  const st = P[0], ps = P[1], as = Math.atan2(st[1] - ps[1], st[0] - ps[0]);
  const capE = [], capS = [];
  for (let i = 1; i < cap; i++) { const a = ae + Math.PI / 2 - i / cap * Math.PI; capE.push([end[0] + Math.cos(a) * w1 / 2, end[1] + Math.sin(a) * w1 / 2]); }
  for (let i = 1; i < cap; i++) { const a = as + Math.PI / 2 - i / cap * Math.PI; capS.push([st[0] + Math.cos(a) * w0 / 2, st[1] + Math.sin(a) * w0 / 2]); }
  return [...L, ...capE, ...Rr.reverse(), ...capS];
}

// ── light: additive glow, under the grain ──
function glow(x, y, r, col = PAL.gold, a = .5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(.35, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
// soft shade (multiply) for night and shadows
function shade(x, y, r, col, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}

// ── camera: world point (cx, cy) at screen centre ──
let CAM = { x: W / 2, y: H / 2, z: 1 };
function camBegin(x, y, z = 1) { CAM = { x, y, z }; ctx.save(); ctx.setTransform(z, 0, 0, z, W / 2 - x * z, H / 2 - y * z); HATCH = 1 / Math.sqrt(z); }
function camEnd() { ctx.restore(); HATCH = 1; }
function toScreen(x, y) { return [(x - CAM.x) * CAM.z + W / 2, (y - CAM.y) * CAM.z + H / 2]; }
function shakeXY(t, t0, amt = 10, d = 7) { if (t < t0) return [0, 0]; const k = Math.exp(-(t - t0) * d); return [Math.sin((t - t0) * 91) * amt * k, Math.cos((t - t0) * 73) * amt * k * .7]; }

// ── paper: generated once (seeded), drawn under every frame; grain multiplied over the top ──
let PAPER, GRAIN;
function makePaper() {
  PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H;
  const g = PAPER.getContext('2d'), r = mulberry(20260925);
  g.fillStyle = PAL.paper; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { // soft blotches
    const x = r() * W, y = r() * H, rr = 60 + r() * 260, gr = g.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, rgba(r() < .5 ? PAL.paper2 : '#F8F0DE', .35)); gr.addColorStop(1, rgba(PAL.paper, 0)); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  g.lineCap = 'round';
  for (let i = 0; i < 2600; i++) { // fibres
    const x = r() * W, y = r() * H, a = r() * TAU, L = 3 + r() * 14;
    g.strokeStyle = rgba(r() < .5 ? '#CDBB98' : '#FFF9EC', .12 + r() * .18); g.lineWidth = .6 + r() * .8;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .5) * L * .5, y + Math.sin(a + .5) * L * .5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  GRAIN = document.createElement('canvas'); GRAIN.width = W; GRAIN.height = H;
  const q = GRAIN.getContext('2d'), id = q.createImageData(W, H), d = id.data;
  for (let i = 0; i < W * H; i++) {
    const v = 238 + r() * 17 | 0, big = r() < .004 ? -40 : 0;
    d[i * 4] = v + big; d[i * 4 + 1] = v - 3 + big; d[i * 4 + 2] = v - 10 + big; d[i * 4 + 3] = 255;
  }
  q.putImageData(id, 0, 0);
  // soft vignette baked into the grain
  const vg = q.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05);
  vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(120,100,90,.55)');
  q.globalCompositeOperation = 'multiply'; q.fillStyle = vg; q.fillRect(0, 0, W, H);
}
function paperUnder() { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(PAPER, 0, 0); }
function grainOver() { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(GRAIN, 0, 0); ctx.restore(); }

// ── full-frame helpers (screen space) ──
function fillScreen(col, a = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// paper-textured cover (fades "to paper" rather than to flat colour)
function paperCover(a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.drawImage(PAPER, 0, 0); ctx.restore(); }
// iris: everything outside the circle painted over
function iris(cx, cy, r, col = PAL.nightDk) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(-10, -10, W + 20, H + 20);
  seed('iris'); const P = ellPts(cx, cy, Math.max(r, 0.1), Math.max(r, 0.1), 48).map(([x, y]) => [x + jit(r * .01 + 1), y + jit(r * .01 + 1)]);
  ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath();
  ctx.fillStyle = col; ctx.fill('evenodd');
  ctx.strokeStyle = rgba(PAL.gold, .8); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath(); if (r > 1) ctx.stroke();
  ctx.restore();
}
// pencil-stroke wipe: fat strokes sweep across (p 0→.5 cover, .5→1 uncover)
function strokeWipe(p, col = PAL.nightDk, dir = 1) {
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); seed('wipe');
  const n = 9, bh = H / n * 1.5;
  for (let i = 0; i < n; i++) {
    const d = hash('wd', i) * .18, k0 = ease(seg(p, d, .5)), k1 = ease(seg(p, .5 + d * .6, 1));
    const x0 = dir > 0 ? lerp(-200, W + 200, k1) - 200 : W + 200 - lerp(-200, W + 200, k1) + 200;
    const x1 = dir > 0 ? lerp(-200, W + 400, k0) : W - lerp(-200, W + 400, k0) + 200;
    const y = (i + .5) * H / n + jit(6);
    ctx.lineCap = 'round'; ctx.strokeStyle = pencil(col, 1.5); ctx.lineWidth = bh;
    ctx.beginPath(); ctx.moveTo(Math.min(x0, x1), y); ctx.lineTo(Math.max(x0, x1), y + jit(20)); ctx.stroke();
  }
  ctx.restore();
}
