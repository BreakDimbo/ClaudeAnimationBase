// ───────────────────────── props: Mid-Autumn things in watercolour ─────────────────────────
let MOONRAB = 0;            // how much of the rabbit is in the moon (0 while it travels)
const GOLD = '#E8B23A', GOLD_DK = '#C7862A', MOON = '#F6DE94', INDIGO = '#2E3A73', NIGHT = '#1F2652';

// the five cities' colours (persimmon, lantern red, shophouse mint and pink, river ochre, grassland blue); [time from which present, colour]
const PICKUPS = [[0, '#E8762A'], [0, '#C8322E'], [0, '#7CC3A2'], [0, '#EF8FA8'], [0, '#D9A25A'], [0, '#4A6FB0']];

// the drop of moon: a wobbling bead of gold paint with the colours it has picked up swirling inside
function drop(x, y, r, t, o = {}) {
  r *= o.scale ?? 1.45;
  if (r < .5) return;
  const wobx = 1 + .06 * Math.sin(t * 9.1), woby = 1 - .06 * Math.sin(t * 9.1);
  if (o.glow !== false) wcGlow(x, y, r * 3.2, '#FFD27A', (o.glowA ?? .25));
  ctx.save(); ctx.translate(x, y); ctx.scale(wobx * (o.sx ?? 1), woby * (o.sy ?? 1));
  wcAt('drop-body', UNIT(16), GOLD, 0, 0, r, { spread: .35, a: .16, layers: 10, edge: .45, opaque: false, mul: false });
  // gathered colours, swirling slowly
  const got = PICKUPS.filter(p => (o.until ?? t) >= p[0]);
  got.forEach(([t0, c], i) => {
    const a = t * .7 + i * 2.1, d = r * (.25 + .12 * (i % 3));
    ctx.save(); ctx.globalAlpha = .75 * seg(o.until ?? t, t0, t0 + .8);
    wcAt('drop-in' + i, UNIT(10), c, Math.cos(a) * d, Math.sin(a) * d, r * (.28 + .05 * (i % 2)), { spread: .6, a: .14, layers: 7, mul: false, wet: true, gran: 0 });
    ctx.restore();
  });
  wcAt('drop-rim', UNIT(16), GOLD_DK, 0, 0, r * 1.02, { spread: .2, a: 0, layers: 1, edge: .8, edgeW: 2.2, gran: 0 });
  // wet highlight
  ctx.fillStyle = 'rgba(255,252,240,.85)'; ctx.beginPath(); ctx.ellipse(-r * .38, -r * .42, r * .2, r * .11, -.6, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,252,240,.5)'; ctx.beginPath(); ctx.ellipse(r * .3, r * .38, r * .08, r * .05, -.6, 0, TAU); ctx.fill();
  ctx.restore();
}

// the moon: gouache body, gold washes, the faint tree and rabbit
function moonWC(x, y, r, o = {}) {
  wcGlow(x, y, r * (o.halo ?? 2.6), '#FFE0A0', .3 * (o.glow ?? 1));
  wcGlow(x, y, r * 1.35, '#FFF3D0', .3 * (o.glow ?? 1));
  wcAt('moon-body', UNIT(28), '#FBEFC8', x, y, r, { opaque: true, a: .2, layers: 12, spread: .12 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .98, 0, TAU); ctx.clip();
  wcAt('moon-wash1', UNIT(18), MOON, x - r * .1, y - r * .05, r * .9, { a: .03, spread: .35, wet: true });
  wcAt('moon-wash2', UNIT(14), '#EFC870', x + r * .3, y + r * .25, r * .45, { a: .025, spread: .5, wet: true });
  { const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, 'rgba(255,252,236,.35)'); g.addColorStop(1, 'rgba(255,252,236,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = .12;
  wcAt('moon-tree', UNIT(12), '#D8A860', x + r * .28, y - r * .12, r * .3, { a: .1, spread: .7, gran: .2 });
  ctx.restore();
  // the rabbit's silhouette: gone all day (it is down on earth), back at the end
  const rk = o.rabbit ?? MOONRAB;
  if (rk > 0) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .98, 0, TAU); ctx.clip(); ctx.globalAlpha = .5 * rk;
    ctx.translate(x - r * .22, y + r * .32); ctx.scale(r / 260, r / 260);
    ctx.fillStyle = '#C8904A'; ctx.beginPath(); ctx.ellipse(0, -42, 58, 40, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(52, -80, 28, 24, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(34, -126, 9, 36, -.35, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(58, -128, 8, 33, .05, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-56, -52, 12, 0, TAU); ctx.fill();
    ctx.restore();
  }
  if (o.colours) {   // the family's colours inside the full moon
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .97, 0, TAU); ctx.clip(); ctx.globalAlpha = o.colours;
    PICKUPS.forEach(([_, c], i) => { const a = i / PICKUPS.length * TAU + (o.t || 0) * .05; wcAt('moon-c' + i, UNIT(12), c, x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .5, r * .45, { a: .018, spread: .9, wet: true, gran: 0, mul: false, layers: 10 }); });
    ctx.restore();
  }
}

// the jade rabbit: a little watercolour animal made of washes and one pencil eye. facing right; hop k 0..1 arcs.
function rabbit(x, y, s, t, o = {}) {
  const k = o.hop ?? 0, dy = -Math.sin(clamp(k) * Math.PI) * s * .9, stretch = Math.sin(clamp(k) * Math.PI) * .12;
  ctx.save(); ctx.translate(x, y + dy); ctx.scale((o.flip ? -1 : 1) * s / 100, s / 100 * (1 - stretch * .3));
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const body = '#FBFAF6', shade = '#A8B2D4', ink = 'rgba(70,66,100,.85)', lw = Math.max(1.6, 150 / s);
  const line = (P, close = true) => { ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); if (close) ctx.closePath(); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); };
  wcAt('rab-shadow', UNIT(10), '#6C6A90', 0, 2 - dy * 100 / s, 55, { sy: .15, a: .06, wet: true, gran: 0 });
  const ear = Math.sin(t * 5 + (o.ph || 0)) * .08;
  // far ear, body, tail, head, near ear: opaque white paint so it reads on dark washes too
  ctx.save(); ctx.translate(58, -98); ctx.rotate(.08 - ear); const E2 = ellPts(0, -30, 8, 31, 14); wc('rab-ear2', E2, mix(body, shade, .25), { a: .2, spread: .15, mul: false, edge: 0 }); line(E2); ctx.restore();
  const B = ellPts(0, -40, 56, 39, 22); wc('rab-body', B, body, { a: .2, spread: .15, mul: false, edge: 0 });
  wc('rab-bshade', ellPts(-6, -24, 46, 18, 14), shade, { a: .06, spread: .35, wet: true });
  line(B);
  const T = ellPts(-55, -50, 11, 10, 10); wc('rab-tail', T, body, { a: .2, mul: false, edge: 0 }); line(T);
  limb([[-10, -30], [-4, -12], [-26, -2]], lw, ink);                 // haunch
  limb([[34, -18], [38, -2], [48, -1]], lw, ink);                     // front paw
  const Hd = ellPts(54, -76, 27, 23, 16); wc('rab-head', Hd, body, { a: .2, spread: .15, mul: false, edge: 0 }); line(Hd);
  ctx.save(); ctx.translate(42, -94); ctx.rotate(-.3 + ear); const E1 = ellPts(0, -34, 9, 34, 14); wc('rab-ear1', E1, body, { a: .2, spread: .15, mul: false, edge: 0 }); wc('rab-ear1i', ellPts(0, -30, 4, 24, 10), '#F2A7B4', { a: .12, spread: .3, wet: true, mul: false }); line(E1); ctx.restore();
  ctx.fillStyle = '#2A2233'; ctx.beginPath(); ctx.arc(62, -81, 3.6, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(63.2, -82.4, 1.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#F29BB0'; ctx.beginPath(); ctx.arc(80, -73, 3, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(242,155,176,.35)'; ctx.beginPath(); ctx.arc(62, -68, 6, 0, TAU); ctx.fill();
  ctx.restore();
}
// rabbit on a hop cycle between two points (period in s)
function rabbitRun(x0, x1, y, s, t, t0, t1, hopsPerSec = 2.2, o = {}) {
  const k = seg(t, t0, t1), x = lerp(x0, x1, k), running = t > t0 && t < t1;
  rabbit(x, y, s, t, { ...o, hop: running ? (t * hopsPerSec) % 1 : 0, flip: x1 < x0 });
}

// an osmanthus floret (four gold petals)
function floret(x, y, s, rot = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  for (let i = 0; i < 4; i++) { const an = i / 4 * TAU; ctx.fillStyle = i % 2 ? '#F2B53A' : '#F6C95A'; ctx.beginPath(); ctx.ellipse(Math.cos(an) * s * .55, Math.sin(an) * s * .55, s * .5, s * .32, an, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#C9802A'; ctx.beginPath(); ctx.arc(0, 0, s * .2, 0, TAU); ctx.fill();
  ctx.restore();
}
// falling florets over an area, looping (fixed per key)
function floretRain(key, x0, x1, y0, y1, n, t, o = {}) {
  for (let i = 0; i < n; i++) {
    const sp = .12 + hash(key, i) * .1, ph = (hash(key, i, 1) + t * sp) % 1;
    const x = lerp(x0, x1, hash(key, i, 2)) + Math.sin(t * 1.3 + i) * 30, y = lerp(y0, y1, ph);
    floret(x, y, (o.s ?? 7) * (.7 + hash(key, i, 3) * .6), t * 2 + i, o.a ?? 1);
  }
}

// osmanthus tree: trunk strokes, foliage washes, gold blossoms; grow 0..1 draws it from the ground up
function osmanthusWC(key, x, y, s, t, grow = 1) {
  if (grow <= 0) return;
  ctx.save();
  ctx.beginPath(); ctx.rect(x - s * 1.5, y - s * 1.7 * grow - 10, s * 3, s * 1.7 * grow + 40); ctx.clip();
  wcStroke(key + 'trunk', [[x, y], [x - s * .04, y - s * .4], [x + s * .05, y - s * .75]], s * .12, s * .05, '#3E2C2C', { a: .16, mul: false });
  wcStroke(key + 'br1', [[x - s * .02, y - s * .45], [x - s * .28, y - s * .72], [x - s * .45, y - s * .82]], s * .05, s * .015, '#3E2C2C', { a: .16, mul: false });
  wcStroke(key + 'br2', [[x + s * .03, y - s * .58], [x + s * .3, y - s * .85], [x + s * .5, y - s * .9]], s * .045, s * .015, '#3E2C2C', { a: .16, mul: false });
  const cl = [[0, -1.08, .42], [-.38, -.9, .34], [.38, -.94, .36], [-.14, -1.34, .3], [.22, -1.32, .3], [-.55, -.7, .24], [.58, -.72, .25]];
  cl.forEach(([dx, dy, r], i) => { wcAt(key + 'leaf' + i, UNIT(14), i % 2 ? '#2E4E44' : '#26443C', x + dx * s, y + dy * s, r * s, { sy: .82, a: .12, spread: .5, edge: .3, mul: false }); });
  cl.forEach(([dx, dy, r], i) => { wcAt(key + 'leafL' + i, UNIT(10), '#5E8468', x + dx * s - r * s * .25, y + dy * s - r * s * .25, r * s * .5, { sy: .7, a: .07, spread: .6, wet: true, mul: false }); });
  for (let i = 0; i < 120; i++) {
    const c = cl[i % cl.length], a = hash(key, i) * TAU, rr = Math.sqrt(hash(key, i, 1)) * c[2] * s * .85;
    floret(x + c[0] * s + Math.cos(a) * rr, y + c[1] * s + Math.sin(a) * rr * .8, s * .009 + 2, i + t * .3, .8);
  }
  ctx.restore();
}

function lanternWC(x, y, s, lit = 1, swing = 0, key = 'lan') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(swing);
  if (lit > 0) wcGlow(0, 0, s * 3, '#FF8A3D', .35 * lit);
  ctx.strokeStyle = 'rgba(60,40,40,.6)'; ctx.lineWidth = Math.max(1, s * .04); ctx.beginPath(); ctx.moveTo(0, -s * 1.3); ctx.lineTo(0, -s * .7); ctx.stroke();
  wcAt(key + 'cap', rectPts(-.3, -.08, .6, .16), '#D9A441', 0, -s * .72, s, { a: .18, layers: 6, spread: .2 });
  wcAt(key + 'body', UNIT(18), lit > 0 ? '#E0462E' : '#B8392E', 0, 0, s * .7, { sy: .92, a: .14, spread: .35, edge: .35, mul: false });
  if (lit > 0) wcAt(key + 'hot', UNIT(12), '#FFB24A', -s * .1, -s * .05, s * .38, { a: .12 * lit, spread: .5, wet: true, mul: false, gran: 0 });
  for (const k of [-.5, 0, .5]) { ctx.strokeStyle = 'rgba(140,30,30,.35)'; ctx.lineWidth = Math.max(1, s * .03); ctx.beginPath(); ctx.ellipse(0, 0, s * .7 * Math.abs(k) + .5, s * .64, 0, -Math.PI / 2, Math.PI / 2, k < 0); ctx.stroke(); }
  wcAt(key + 'base', rectPts(-.28, -.07, .56, .14), '#D9A441', 0, s * .66, s, { a: .18, layers: 6, spread: .2 });
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = 'rgba(210,50,40,.7)'; ctx.lineWidth = Math.max(1, s * .03); ctx.beginPath(); ctx.moveTo(-s * .12 + i * s * .06, s * .76); ctx.lineTo(-s * .14 + i * s * .07 + Math.sin(swing * 3) * s * .05, s * 1.2); ctx.stroke(); }
  ctx.restore();
}
function rabbitLanternWC(x, y, s, lit, t, key = 'rl') {
  if (lit > 0) wcGlow(x, y - s * .5, s * 2, '#FF9A5A', .35 * lit);
  wcAt(key + 'b', UNIT(14), '#F6F0E6', x, y - s * .55, s * .8, { sy: .6, a: .16, mul: false, spread: .3, edge: .3 });
  wcAt(key + 'h', UNIT(12), '#F6F0E6', x + s * .72, y - s * .92, s * .32, { a: .16, mul: false, spread: .3, edge: .3 });
  wcAt(key + 'e1', UNIT(8), '#F6F0E6', x + s * .6, y - s * 1.4, s * .1, { sy: 3.2, a: .16, mul: false, spread: .2, rot: -.2 });
  wcAt(key + 'e2', UNIT(8), '#F6F0E6', x + s * .8, y - s * 1.42, s * .1, { sy: 3.2, a: .16, mul: false, spread: .2, rot: .15 });
  wcStroke(key + 'st', [[x - s * .55, y - s * .7], [x - s * .1, y - s * .45], [x + s * .35, y - s * .72]], s * .06, s * .04, '#E0453A', { a: .2 });
  ctx.fillStyle = '#D8342E'; ctx.beginPath(); ctx.arc(x + s * .86, y - s * .95, s * .05, 0, TAU); ctx.fill();
  if (lit > 0) wcGlow(x, y - s * .55, s * .7, '#FFD49A', .4 * lit);
}

// mooncake seen at a slant (sq = vertical squash), with a rabbit relief
function mooncakeWC(key, x, y, r, sq = .5, o = {}) {
  wcAt(key + 'side', UNIT(20), '#B77638', x, y + r * .22, r, { sy: sq, a: .12, spread: .2 });
  wcAt(key + 'top', UNIT(28), '#DDA25A', x, y, r, { sy: sq, a: .13, spread: .15, edge: .4 });
  ctx.save(); ctx.translate(x, y); ctx.scale(1, sq); ctx.strokeStyle = 'rgba(140,80,30,.5)'; ctx.lineWidth = Math.max(1, r * .035);
  ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.stroke();
  if (o.rabbit !== false) { ctx.beginPath(); ctx.ellipse(-r * .05, r * .1, r * .3, r * .22, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(r * .24, -r * .05, r * .13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r * .22, -r * .16); ctx.lineTo(r * .12, -r * .5); ctx.moveTo(r * .3, -r * .16); ctx.lineTo(r * .34, -r * .52); ctx.stroke(); }
  ctx.restore();
  if (o.glow) wcGlow(x, y, r * 2.5, '#FFD27A', .4 * o.glow);
}
function pomelo(key, x, y, r) {
  wcAt(key + 'p', UNIT(16), '#C9D65A', x, y, r, { a: .12, spread: .3, edge: .35 });
  wcAt(key + 'hi', UNIT(10), '#F2E98A', x - r * .3, y - r * .35, r * .4, { a: .1, wet: true, mul: false });
  wcStroke(key + 'stem', [[x, y - r], [x + r * .1, y - r * 1.25]], r * .1, r * .06, '#6B7A3A', { a: .2 });
  wcAt(key + 'leaf', UNIT(8), '#5E9A5A', x + r * .32, y - r * 1.15, r * .3, { sy: .45, rot: -.4, a: .12 });
}
function bowlWC(key, x, y, r, col = '#F3EEE3', o = {}) {
  wc(key + 'sh', [...arcPts(x + r * .08, y + r * .06, r, 0, Math.PI, 14, r * .62), [x - r, y]], '#8A8FB0', { a: .06, spread: .2, wet: true });
  wc(key + 'b', [...arcPts(x, y, r, 0, Math.PI, 14, r * .62), [x - r, y]], col, { a: .16, spread: .15, edge: .7, edgeW: 2.4, mul: false });
  wcAt(key + 'rim', UNIT(16), '#E7DCC8', x, y, r, { sy: .22, a: .12, spread: .1, edge: .4, mul: o.mul });
  wcAt(key + 'band', [[-1, .06], [1, .06], [.92, .22], [-.92, .22]], '#4A6FB0', x, y + r * .08, r, { a: .12, spread: .1 });
}
function cupWC(key, x, y, r, tea = 1) {
  wc(key + 'c', [...arcPts(x, y, r, 0, Math.PI, 12, r * .9), [x - r, y]], '#F1ECE2', { a: .13, spread: .12, edge: .45 });
  wcAt(key + 'rim', UNIT(16), '#E8DECB', x, y, r, { sy: .28, a: .13, spread: .08, edge: .4 });
  if (tea > 0) wcAt(key + 'tea', UNIT(14), '#C9923A', x, y + r * .02, r * .86, { sy: .22, a: .12 * tea, spread: .08 });
}
function teapotWC(key, x, y, s, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  wc(key + 'body', ellPts(0, 0, s, s * .78, 20), '#E4D8C2', { a: .12, spread: .2, edge: .4 });
  wcStroke(key + 'spout', [[s * .8, s * .1], [s * 1.25, -s * .2], [s * 1.45, -s * .45]], s * .22, s * .1, '#D8CBB2', { a: .14 });
  wcStroke(key + 'hand', [[-s * .8, -s * .35], [-s * 1.3, -s * .1], [-s * .85, s * .35]], s * .12, s * .12, '#C9B998', { a: .14 });
  wcAt(key + 'lid', UNIT(12), '#C9B998', 0, -s * .75, s * .45, { sy: .3, a: .14 });
  wcAt(key + 'knob', UNIT(8), '#8C6A4A', 0, -s * .92, s * .12, { a: .2 });
  wcAt(key + 'blue', [[-1, 0], [1, 0], [1, .15], [-1, .15]], '#3F63A8', 0, s * .05, s * .9, { a: .12 });
  ctx.restore();
}
// houndstooth tile (doudou's trousers)
let HT = null;
function houndPattern() {
  if (HT) return HT;
  const c = document.createElement('canvas'); c.width = c.height = 16; const g = c.getContext('2d');
  g.fillStyle = '#E8E4DC'; g.fillRect(0, 0, 16, 16); g.fillStyle = '#26262E';
  g.beginPath(); g.moveTo(0, 0); g.lineTo(8, 0); g.lineTo(8, 4); g.lineTo(12, 8); g.lineTo(8, 8); g.lineTo(4, 12); g.lineTo(4, 8); g.lineTo(0, 8); g.closePath(); g.fill();
  g.fillRect(8, 8, 8, 8);
  HT = ctx.createPattern(c, 'repeat'); return HT;
}
// a houndstooth bird: flapping wings (phase), body in the check
function houndBird(x, y, s, phase, rot = 0) {
  const f = Math.sin(phase * TAU);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s / 20, s / 20);
  ctx.fillStyle = houndPattern(); ctx.strokeStyle = 'rgba(40,40,50,.8)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-4, -14 * f, -20, -18 * f - 2); ctx.quadraticCurveTo(-6, -4, 0, 1);
  ctx.quadraticCurveTo(6, -4, 20, -18 * f - 2); ctx.quadraticCurveTo(4, -14 * f, 10, 0); ctx.quadraticCurveTo(0, 6, -10, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#26262E'; ctx.beginPath(); ctx.ellipse(0, 1, 4, 3, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
function paperBoat(x, y, s, rock = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rock);
  wc('boat-hull', [[-s, -s * .25], [s, -s * .25], [s * .7, s * .25], [-s * .7, s * .25]], '#F4EFE4', { a: .16, spread: .1, edge: .5, mul: false });
  wc('boat-sail', [[-s * .45, -s * .25], [0, -s * .95], [s * .45, -s * .25]], '#EAE3D2', { a: .16, spread: .1, edge: .5, mul: false });
  wc('boat-shade', [[0, -s * .95], [s * .45, -s * .25], [0, -s * .25]], '#B7B2C8', { a: .1, spread: .1, wet: true });
  ctx.restore();
}
function oldCamera(x, y, s, blink) {
  wc('cam-legs', [[x - s * .05, y], [x + s * .05, y], [x + s * .5, y + s * 2.2], [x + s * .42, y + s * 2.2], [x, y + s * .3], [x - s * .42, y + s * 2.2], [x - s * .5, y + s * 2.2]], '#6B4A3A', { a: .14, spread: .1 });
  wc('cam-box', rectPts(x - s * .7, y - s * .9, s * 1.4, s * 1), '#3B3340', { a: .16, spread: .1, edge: .4 });
  wc('cam-bellows', [[x - s * .5, y - s * .8], [x - s * 1.2, y - s * .95], [x - s * 1.2, y - s * .05], [x - s * .5, y - s * .2]], '#5A4A58', { a: .14, spread: .1 });
  wcAt('cam-lens', UNIT(14), '#20202A', x - s * 1.25, y - s * .5, s * .32, { a: .18 });
  ctx.fillStyle = 'rgba(200,210,240,.6)'; ctx.beginPath(); ctx.arc(x - s * 1.32, y - s * .6, s * .08, 0, TAU); ctx.fill();
  if (blink) { wcGlow(x + s * .4, y - s * .8, s * .6, '#FF3A2A', .6); ctx.fillStyle = '#FF4A3A'; ctx.beginPath(); ctx.arc(x + s * .4, y - s * .8, s * .07, 0, TAU); ctx.fill(); }
}

function steamer(key, x, y, r, open = 0) {
  for (let i = 0; i < 3; i++) {
    const yy = y - i * r * .42 - (i === 2 ? open * r * .5 : 0);
    wc(key + 'band' + i, [...arcPts(x, yy, r, 0, Math.PI, 16, r * .22), ...arcPts(x, yy - r * .38, r, Math.PI, 0, 16, r * .22)], i === 2 ? '#C99A55' : '#D9B36B', { a: .1, spread: .08, edge: .45 });
    for (let j = -3; j <= 3; j++) { ctx.strokeStyle = 'rgba(140,100,50,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + j * r * .27, yy - r * .34 + Math.abs(j) * 2); ctx.lineTo(x + j * r * .27, yy + r * .2 - Math.abs(j) * 3); ctx.stroke(); }
  }
  wcAt(key + 'lidtop', UNIT(18), '#C99A55', x, y - r * 1.22 - open * r * .5, r, { sy: .22, a: .12, spread: .08 });
}
