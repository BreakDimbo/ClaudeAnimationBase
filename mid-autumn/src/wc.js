// ───────────────────────── wc: watercolour painting on cold-pressed paper ─────────────────────────
// A wash is one polygon deformed by seeded midpoint displacement, painted as many faint layers
// (each deformed again), with pigment pooling at the edge and granulation inside. Geometry is cached
// by key, so a wash is identical in every frame (frames stay pure functions of t).

// ── cold-pressed paper (replaces core's paper) ──
function makeWCPaper() {
  PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H;
  const g = PAPER.getContext('2d'), r = mulberry(8150915);
  g.fillStyle = '#F7F2E8'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i++) {            // tooth: soft light and dark cells
    const x = r() * W, y = r() * H, rr = 3 + r() * 12, gr = g.createRadialGradient(x, y, 0, x, y, rr);
    const dark = r() < .5; gr.addColorStop(0, dark ? 'rgba(150,135,110,.10)' : 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  for (let i = 0; i < 60; i++) {              // large soft sizing blotches
    const x = r() * W, y = r() * H, rr = 80 + r() * 300, gr = g.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, `rgba(${r() < .5 ? '236,226,206' : '252,249,242'},.3)`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  GRAIN = document.createElement('canvas'); GRAIN.width = W; GRAIN.height = H;
  const q = GRAIN.getContext('2d'), id = q.createImageData(W, H), d = id.data;
  // cold-press tooth multiplied over everything: bumps lit from the top-left
  const N = 256, bump = new Float32Array(N * N);
  for (let i = 0; i < 2600; i++) { const cx = r() * N, cy = r() * N, rad = 1.5 + r() * 4, s = r() < .5 ? 1 : -.6; for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { const dd = Math.hypot(x, y); if (dd < rad) bump[((Math.floor(cy + y) + N) % N) * N + ((Math.floor(cx + x) + N) % N)] += s * (1 - dd / rad); } }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, b0 = bump[(y % N) * N + (x % N)], b1 = bump[((y + 1) % N) * N + ((x + 1) % N)];
    const v = 246 + (b0 - b1) * 7 + (r() - .5) * 5;
    d[i * 4] = v; d[i * 4 + 1] = v - 1; d[i * 4 + 2] = v - 4; d[i * 4 + 3] = 255;
  }
  q.putImageData(id, 0, 0);
  const vg = q.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.1);
  vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(170,150,130,.35)');
  q.fillStyle = vg; q.fillRect(0, 0, W, H);
}

// ── geometry ──
function deform(P, depth, amp, rnd, vars) {
  let Q = P, V = vars || P.map(() => .5 + rnd());
  for (let d = 0; d < depth; d++) {
    const N = [], NV = [];
    for (let i = 0; i < Q.length; i++) {
      const a = Q[i], b = Q[(i + 1) % Q.length], va = V[i], vb = V[(i + 1) % Q.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), gv = (va + vb) / 2;
      // gaussian-ish displacement, larger where the vertex variance is high
      const g1 = (rnd() + rnd() + rnd() - 1.5) * 1.2, g2 = (rnd() + rnd() + rnd() - 1.5) * 1.2;
      N.push(a, [(a[0] + b[0]) / 2 + g1 * len * amp * gv, (a[1] + b[1]) / 2 + g2 * len * amp * gv]);
      NV.push(va, gv * (.7 + rnd() * .5));
    }
    Q = N; V = NV;
  }
  return { P: Q, V };
}
function pathOf(P) { const p = new Path2D(); p.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) p.lineTo(P[i][0], P[i][1]); p.closePath(); return p; }

const WCG = new Map();       // key → {layers: Path2D[], edge: Path2D, base: Path2D}
function wcGeom(key, pts, o) {
  let G = WCG.get(key); if (G) return G;
  const rnd = mulberry(skey(key) ^ 0x3c1f);
  const spread = o.spread ?? .45, n = o.layers ?? 14;
  const base = deform(pts, o.depth ?? 3, spread * .35, rnd);
  const layers = [];
  for (let i = 0; i < n; i++) layers.push(pathOf(deform(base.P, 2, spread * .22, rnd, base.V).P));
  G = { layers, base: pathOf(base.P), edge: pathOf(deform(base.P, 1, spread * .06, rnd, base.V).P) };
  if (WCG.size > 4000) WCG.clear();
  WCG.set(key, G); return G;
}
// granulation tile per colour: pigment settling in the paper's hollows
const GRAN = new Map();
function granTile(col) {
  let p = GRAN.get(col); if (p) return p;
  const S = 128, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'), r = mulberry(skey(col));
  const dk = mix(col, '#1A1830', .25);
  for (let i = 0; i < 900; i++) { g.fillStyle = rgba(dk, .05 + r() * .18); const s = .6 + r() * 1.6; g.fillRect(r() * S, r() * S, s, s); }
  for (let i = 0; i < 40; i++) { const x = r() * S, y = r() * S, rr = 3 + r() * 8, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, rgba(dk, .12)); gr.addColorStop(1, rgba(dk, 0)); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  p = ctx.createPattern(c, 'repeat'); GRAN.set(col, p); return p;
}

// ── a wash. pts in the current coordinate space; key must name this exact geometry ──
// o: layers, a (per-layer alpha), spread, depth, edge (pooling strength), gran, mul (multiply glaze), wet (softer, no edge)
function wc(key, pts, col, o = {}) {
  const G = wcGeom(key, pts, o), a = (o.a ?? .07) * .75;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha; const ga = ctx.globalAlpha;
  ctx.globalCompositeOperation = o.mul === false ? 'source-over' : 'multiply';
  ctx.fillStyle = rgba(col, a);
  for (const L of G.layers) ctx.fill(L);
  if (!o.wet) {             // pigment pools at the drying edge
    ctx.strokeStyle = rgba(mix(col, '#2A1E30', .25), (o.edge ?? .22) * ga); ctx.lineWidth = o.edgeW ?? 1.6; ctx.lineJoin = 'round'; ctx.stroke(G.edge);
    ctx.strokeStyle = rgba(col, (o.edge ?? .22) * .6 * ga); ctx.lineWidth = (o.edgeW ?? 1.6) * 3; ctx.stroke(G.edge);
  }
  if (o.gran !== 0) { ctx.globalAlpha = ga * (o.gran ?? .55); ctx.fillStyle = granTile(col); ctx.fill(G.base); }
  ctx.restore();
}
// opaque body colour (gouache-like, for light things over dark washes: the moon, lanterns, petals)
function wcOpaque(key, pts, col, o = {}) {
  const G = wcGeom(key, pts, o);
  ctx.save(); if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
  ctx.fillStyle = rgba(col, o.a ?? .16); for (const L of G.layers) ctx.fill(L);
  ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = rgba(mix(col, '#6A4A30', .35), .25 * (o.alpha ?? 1)); ctx.lineWidth = o.edgeW ?? 1.6; ctx.stroke(G.edge);
  ctx.restore();
}
// shapes around the origin, drawn moved/scaled (for things that travel: the drop, petals, bowls)
function wcAt(key, pts, col, x, y, s = 1, o = {}) { ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(s * (o.sx ?? 1), s * (o.sy ?? 1)); (o.opaque ? wcOpaque : wc)(key, pts, col, { ...o, edgeW: (o.edgeW ?? 1.6) / s }); ctx.restore(); }
const UNIT = n => ellPts(0, 0, 1, 1, n);
function wcCircle(key, x, y, r, col, o = {}) { wcAt(key, UNIT(o.n ?? 14), col, x, y, r, { spread: .5, ...o }); }
function wcRect(key, x, y, w, h, col, o = {}) { wc(key, [[x, y], [x + w / 2, y], [x + w, y], [x + w, y + h / 2], [x + w, y + h], [x + w / 2, y + h], [x, y + h], [x, y + h / 2]], col, o); }
// a brush stroke along a path
function wcStroke(key, P, w0, w1, col, o = {}) { wc(key, ribbonPts(P, w0, w1), col, { spread: .25, depth: 2, layers: 8, a: .12, ...o }); }
// wet-in-wet sky or ground: overlapping horizontal bands that bleed into each other
function wcBands(key, x, y, w, h, cols, o = {}) {
  const n = cols.length;
  // soft wet-in-wet: each band bleeds far into its neighbours, then a few back-runs and plenty of paper left
  for (let i = 0; i < n; i++) {
    const y0 = y + h * i / n - h / n * .7, y1 = y + h * (i + 1) / n + h / n * .7;
    wcRect(key + ':b' + i, x - 80, y0, w + 160, y1 - y0, cols[i], { spread: .7, a: (o.a ?? .09) * .7, wet: true, layers: 16, gran: o.gran ?? .35 });
  }
  const nb = Math.round(w / 900);
  for (let i = 0; i < nb; i++) {
    const c = cols[Math.floor(hash(key, i) * n)], bx = x + hash(key, i, 1) * w, by = y + hash(key, i, 2) * h;
    wcBloom(key + ':bl' + i, bx, by, 120 + hash(key, i, 3) * 260, c, 1, { a: .025, wet: hash(key, i, 4) < .7, edge: .15 });
  }
}
// a bloom (back-run): pigment pushed out to a cauliflower edge, growing with k
function wcBloom(key, x, y, r, col, k = 1, o = {}) {
  if (k <= 0) return;
  const P = []; const rnd = mulberry(skey(key));
  for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, rr = .75 + rnd() * .4; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  wcAt(key, P, col, x, y, r * easeOut(clamp(k)), { spread: .6, a: (o.a ?? .1), edge: .35, ...o });
}
// splatter: flicked drops, fixed per key
function spatter(key, x, y, r, n, col, o = {}) {
  ctx.save(); ctx.globalCompositeOperation = o.mul === false ? 'source-over' : 'multiply';
  for (let i = 0; i < n; i++) {
    const a = hash(key, i) * TAU, d = Math.pow(hash(key, i, 1), .6) * r, s = (o.size ?? 4) * (.3 + hash(key, i, 2) * 1.2);
    ctx.fillStyle = rgba(col, (o.a ?? .5) * (.4 + hash(key, i, 3) * .6));
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * (o.sy ?? 1), s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// cached layer: paint once into an offscreen canvas (world coords x,y,w,h), then blit every frame
const LAYERS = new Map();
function layer(key, x, y, w, h, fn, sc = 1) {
  let L = LAYERS.get(key);
  if (!L) {
    const c = document.createElement('canvas'); c.width = Math.ceil(w * sc); c.height = Math.ceil(h * sc);
    const main = ctx; ctx = c.getContext('2d'); ctx.scale(sc, sc); ctx.translate(-x, -y);
    fn(); ctx = main; L = c; LAYERS.set(key, L);
  }
  ctx.drawImage(L, x, y, w, h);
}
// soft light for lanterns and the moon (additive, stays warm on dark washes)
function wcGlow(x, y, r, col, a) { glow(x, y, r, col, a); }
