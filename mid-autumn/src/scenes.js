// ───────────────────────── scenes: 《日色变得慢》, ten shots on one 180-second timeline ─────────────────────────
// Every shot is fn(lt, t, dur); lt = time inside the shot (negative while it dissolves in). One camera move per row.
const VIEWS = {};

// ── shared pieces ──
// a wet-in-wet sky (or any band stack) painted once into a cached layer
// night skies get a clean gradient under the washes (dark multiply washes alone turn grey on the paper)
const bandsL = (key, x, y, w, h, cols, a = .07) => layer(key, x, y, w, h, () => {
  if (lum(cols[0]) < .3) {
    const g = ctx.createLinearGradient(0, y, 0, y + h); cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    wcBands(key, x, y, w, h, cols.map(c => mix(c, '#8A90C0', .35)), { a: .035 });
  } else wcBands(key, x, y, w, h, cols, { a });
});
// draw another drawing over the frame at alpha a (dissolves inside a shot)
const BUF2 = document.createElement('canvas'); BUF2.width = W; BUF2.height = H;
function blend(a, fn) {
  if (a <= 0) return;
  const main = ctx; ctx = BUF2.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  paperUnder(); fn(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx = main;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.drawImage(BUF2, 0, 0); ctx.restore();
}
// a wet front travelling down the paper: fn is only painted above it (screen space)
function wetFront(key, y, fn) {
  const P = []; for (let x = W + 40; x >= -40; x -= 40) P.push([x, y + (hash(key, x) * 2 - 1) * 26 + Math.sin(x * .007) * 30]);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(W + 40, -40); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.clip();
  fn(); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineJoin = 'round';
  for (const [w, a] of [[10, .06], [3, .12]]) { ctx.strokeStyle = `rgba(200,140,80,${a})`; ctx.lineWidth = w; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  ctx.restore();
}
// circle reveal with a wet rim (ripples, keyholes): fn painted inside a wobbly circle, screen space
function circleReveal(key, cx, cy, r, fn, rim = '#FFFFFF') {
  if (r <= 0) return;
  const P = ellPts(cx, cy, r, r, 60).map(([x, y], i) => [x + (hash(key, i) - .5) * r * .03, y + (hash(key, i, 1) - .5) * r * .03]);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.clip();
  fn(); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const [w, a] of [[16, .12], [4, .35]]) { ctx.strokeStyle = rgba(rim, a); ctx.lineWidth = w; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
}
// ripple rings on water (x, y centre, squash sy), each ring born at t0s[i]
function ripples(x, y, t, t0s, rMax, sy = .3, col = '#FFFFFF', a = .5, life = 1.6) {
  ctx.save(); ctx.lineCap = 'round';
  for (const t0 of t0s) for (let j = 0; j < 3; j++) {
    const k = (t - t0 - j * .18) / life; if (k <= 0 || k >= 1) continue;
    ctx.strokeStyle = rgba(col, a * (1 - k) * (1 - j * .25)); ctx.lineWidth = 2.5 * (1 - k) + .8;
    ctx.beginPath(); ctx.ellipse(x, y, rMax * easeOut(k), rMax * easeOut(k) * sy, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}
// a soft polygon (for things that change shape every frame: wings, flags, legs)
function poly(P, fill, a = 1, stroke, lw = 1) {
  ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (fill) { ctx.globalAlpha *= a; ctx.fillStyle = fill; ctx.fill(); ctx.globalAlpha /= a; }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
}
function limb(P, w, col, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore(); }
// falling rain streaks (fixed per key), in the current space
function rain(key, n, t, x0, x1, y0, y1, o = {}) {
  const len = o.len ?? 60, sp = o.speed ?? 1.6, sl = o.slant ?? .18;
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(o.col || '#F4F8FA', o.a ?? .35); ctx.lineWidth = o.w ?? 1.6; ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const ph = (hash(key, i) + t * sp * (.8 + hash(key, i, 1) * .4)) % 1, y = lerp(y0 - len, y1, ph), x = lerp(x0, x1, hash(key, i, 2)) - (y - y0) * sl;
    ctx.moveTo(x, y); ctx.lineTo(x + len * sl, y + len);
  }
  ctx.stroke(); ctx.restore();
}
// a cloud of soft washes
function cloudWC(key, x, y, s, col = '#FFFFFF', a = 1, mul = false) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 7; i++) { const u = i / 6 - .5; wcAt(key + i, UNIT(14), col, x + u * s * 2.2 + hash(key, i) * s * .2, y - (1 - 4 * u * u) * s * .22 + hash(key, i, 3) * s * .12, s * (.3 + .16 * hash(key, i, 1)), { sx: 1.9, sy: .6, mul, a: .055, spread: .8, wet: true, gran: .15 }); }
  wcAt(key + 'base', UNIT(14), col, x, y + s * .08, s * 1.1, { sy: .16, mul, a: .05, spread: .7, wet: true, gran: 0 });
  ctx.restore();
}
function stars(key, n, x0, y0, w, h, t, a = 1) { for (let i = 0; i < n; i++) { const tw = .6 + .4 * Math.sin(t * (1 + hash(key, i, 4) * 2) + i); ctx.fillStyle = `rgba(255,244,210,${(.25 + hash(key, i) * .55) * tw * a})`; ctx.beginPath(); ctx.arc(x0 + hash(key, i, 1) * w, y0 + hash(key, i, 2) * h, .8 + hash(key, i, 3) * 1.8, 0, TAU); ctx.fill(); } }

// ── the paper crane (the letter, folded): side view facing right; flap = wing phase (0 up, .5 down) ──
function crane(x, y, s, flap = .25, o = {}) {
  if (s < 1) return;
  const w = o.fold ? .12 : Math.cos(flap * TAU);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale((o.flip ? -1 : 1) * s / 100, s / 100);
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const ink = 'rgba(110,96,80,.8)', lw = 100 / s * 1.3;
  if (o.shadow) { ctx.save(); ctx.globalAlpha *= .25; ctx.fillStyle = '#50466A'; ctx.beginPath(); ctx.ellipse(0, o.shadow, 60, 8, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const wet = o.wet || 0, paper = mix('#FBF6EA', '#D8D4CC', wet), paper2 = mix('#E6DCC8', '#BDB6AC', wet), shade = mix('#CBBFA8', '#A09A94', wet);
  poly([[-26, -2], [20, -2], [-8 + 10 * w, -88 * w - 6]], shade, 1, ink, lw);            // far wing
  poly([[-30, -1], [-80, -58], [-60, -54], [-20, 5]], paper2, 1, ink, lw);               // tail
  poly([[22, 3], [68, -56], [58, -52], [30, -4]], paper2, 1, ink, lw);                   // neck
  poly([[68, -56], [88, -46], [62, -50]], paper2, 1, ink, lw);                           // head
  poly([[-42, 0], [0, -16], [42, 0], [0, 18]], paper, 1, ink, lw);                       // body
  poly([[0, -16], [42, 0], [0, 18]], shade, .35);
  poly([[-20, 2], [28, 2], [2 + 8 * w, -92 * w]], paper, 1, ink, lw);                    // near wing
  // the envelope's red postcode boxes, still printed on the near wing
  ctx.save(); ctx.globalAlpha *= .75; ctx.strokeStyle = '#C8392E'; ctx.lineWidth = lw * 1.1;
  for (let i = 0; i < 3; i++) { const k = .25 + i * .16, bx = lerp(-10, 2 + 8 * w, k), by = lerp(0, -92 * w, k); ctx.strokeRect(bx - 5, by - 5, 10, 10); }
  ctx.restore();
  if (o.glow) glow(0, 0, 160, '#FFE2A0', o.glow);
  ctx.restore();
}
// the letter: an envelope with the red postcode boxes and a stamp
function letter(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s / 100 * (o.sx ?? 1), s / 100 * (o.sy ?? 1));
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  poly([[-50, -32], [50, -32], [50, 32], [-50, 32]], '#FBF6EA', 1, 'rgba(110,96,80,.7)', 1.4);
  ctx.strokeStyle = 'rgba(200,57,46,.8)'; ctx.lineWidth = 1.6; for (let i = 0; i < 6; i++) ctx.strokeRect(-44 + i * 10, -26, 8, 8);
  poly([[30, -26], [44, -26], [44, -10], [30, -10]], o.stamp || '#5A8A6A', .8);
  ctx.fillStyle = 'rgba(90,80,70,.35)'; for (let i = 0; i < 3; i++) ctx.fillRect(-20, 2 + i * 8, 44 - i * 10, 2);
  ctx.restore();
}

// ── 向阳门第: four characters written stroke by stroke (no font), 0–100 grid; plaques read right to left ──
const GLYPH = {
  '向': [[[52, 2], [42, 16], 11, 5], [[20, 24], [20, 98], 10, 9], [[20, 24], [82, 24], [82, 90], [72, 98], 10, 9], [[38, 44], [38, 74], 9, 8], [[38, 44], [64, 44], [64, 74], 9, 8], [[38, 72], [64, 72], 8, 8]],
  '阳': [[[14, 8], [32, 8], [22, 30], [34, 48], [22, 62], 9, 7], [[14, 8], [14, 98], 10, 8], [[46, 14], [46, 90], 9, 9, 'ri'], [[46, 14], [86, 14], [86, 90], 9, 9, 'ri'], [[46, 50], [86, 50], 8, 8, 'ri'], [[46, 88], [86, 88], 9, 9, 'ri']],
  '门': [[[22, 4], [30, 16], 10, 7], [[16, 24], [16, 98], 10, 9], [[34, 18], [84, 18], [84, 92], [74, 99], 9, 9]],
  '第': [[[24, 2], [10, 20], 9, 4], [[18, 10], [42, 10], 7, 7], [[28, 12], [32, 22], 7, 5], [[66, 2], [54, 20], 9, 4], [[60, 10], [88, 10], 7, 7], [[72, 12], [76, 22], 7, 5],
    [[20, 34], [78, 34], [78, 54], 8, 8], [[22, 54], [78, 54], 8, 8], [[24, 54], [22, 72], [82, 72], [80, 94], [70, 90], 8, 8], [[50, 26], [50, 100], 9, 9], [[46, 72], [16, 96], 8, 3]],
};
// k: gold 0..1; o.only: 'ri' draws just the 日 of 阳; o.fade multiplies everything
function glyph(key, ch, cx, cy, size, k, o = {}) {
  const S = size / 100, X = p => [cx + (p[0] - 50) * S, cy + (p[1] - 50) * S];
  GLYPH[ch].forEach((st, i) => {
    const tag = typeof st[st.length - 1] === 'string' ? st[st.length - 1] : null, nums = st.filter(v => typeof v === 'number');
    if (o.only && tag !== o.only) return;
    const P = st.filter(v => Array.isArray(v)).map(X), w0 = nums[0] * S * 1.15, w1 = nums[1] * S * 1.15;
    const a = (o.fade ?? 1) * (o.except && tag === o.except ? (o.exceptA ?? 1) : 1);
    if (a <= 0) return;
    for (let j = 0; j < P.length - 1; j++) {
      const ww0 = lerp(w0, w1, j / (P.length - 1)), ww1 = lerp(w0, w1, (j + 1) / (P.length - 1)), sk = `${key}:${ch}:${i}:${j}`;
      ctx.save(); ctx.globalAlpha *= a;
      if (o.dim !== false) wcStroke(sk + 'd', [P[j], P[j + 1]], ww0, ww1, o.dimCol || '#7A5C34', { a: .16, mul: false, spread: .18, gran: .3 });
      if (k > 0) { ctx.globalAlpha *= clamp(k); wcStroke(sk + 'g', [P[j], P[j + 1]], ww0, ww1, '#F2C24E', { a: .17, mul: false, spread: .14, gran: .2, edge: .35 }); }
      ctx.restore();
    }
  });
  if (k > 0 && o.glow !== false) wcGlow(cx, cy, size * .9, '#FFD27A', .18 * clamp(k) * (o.fade ?? 1));
}
const PLAQUE = { x: 706, y: 382, w: 508, h: 104, chars: [['向', 1150], ['阳', 1024], ['门', 897], ['第', 770]], cy: 434, size: 84 };
function plaqueChars(key, gold, o = {}) { PLAQUE.chars.forEach(([ch, x], i) => glyph(key, ch, x, PLAQUE.cy, PLAQUE.size, typeof gold === 'function' ? gold(i) : gold, o)); }

// ── the gate: grey brick gatehouse, tiled roof, plaque board, red doors (drawn live so they can open) ──
function gateLayer() {
  layer('gate', -400, -300, 2720, 1700, () => {
    wcRect('g-grd', -400, 930, 2720, 480, '#B9A58A', { a: .07, spread: .25, wet: true });
    for (const [x0, x1] of [[-400, 430], [1490, 2320]]) {                       // courtyard walls with tile caps
      wcRect('g-wall' + x0, x0, 540, x1 - x0, 395, '#ADA7A3', { a: .08, spread: .1 });
      wc('g-cap' + x0, [[x0, 492], [x1, 492], [x1 + (x0 < 0 ? 20 : 0), 548], [x0 - (x0 > 0 ? 20 : 0), 548]], '#4E5260', { a: .11, spread: .06 });
      for (let x = x0; x < x1; x += 26) wcStroke('g-capt' + x0 + ':' + x, [[x, 500], [x + 4, 544]], 5, 5, '#3A3E4C', { a: .1, layers: 4 });
    }
    wcRect('g-pierL', 428, 330, 282, 600, '#A29D9A', { a: .09, spread: .08 });
    wcRect('g-pierR', 1210, 330, 282, 600, '#A29D9A', { a: .09, spread: .08 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    for (let y = 560, r = 0; y < 930; y += 24, r++) {                           // brick courses
      ctx.strokeStyle = 'rgba(120,112,108,.28)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(430, y); ctx.moveTo(1490, y); ctx.lineTo(2320, y); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,112,108,.2)'; ctx.beginPath();
      for (let x = -400 + (r % 2) * 26; x < 2320; x += 52) if (x < 430 || x > 1490 || (x > 428 && x < 710) || (x > 1210 && x < 1492)) { ctx.moveTo(x, y); ctx.lineTo(x, y + 24); }
      ctx.stroke();
    }
    for (let y = 350, r = 0; y < 930; y += 24, r++) { ctx.strokeStyle = 'rgba(120,112,108,.26)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(428, y); ctx.lineTo(710, y); ctx.moveTo(1210, y); ctx.lineTo(1492, y); ctx.stroke(); }
    ctx.restore();
    // roof with upturned corners, tile rows, ridge
    wc('g-roof', [[470, 214], [1450, 214], [1500, 256], [1552, 318], [1590, 292], [1560, 350], [360, 350], [330, 292], [368, 318], [420, 256]], '#454A58', { a: .12, spread: .05, edge: .4 });
    for (let x = 440; x <= 1480; x += 22) wcStroke('g-tile' + x, [[lerp(470, 1450, (x - 440) / 1040), 222], [x + (x - 960) * .1, 344]], 7, 9, '#2E3240', { a: .08, layers: 4 });
    wcStroke('g-ridge', [[455, 212], [960, 208], [1465, 212]], 22, 22, '#2B2F3C', { a: .14 });
    wcStroke('g-kissL', [[462, 212], [448, 176], [470, 168]], 16, 8, '#2B2F3C', { a: .14 });
    wcStroke('g-kissR', [[1458, 212], [1472, 176], [1450, 168]], 16, 8, '#2B2F3C', { a: .14 });
    // painted eave board (彩画) and lintel
    wcRect('g-eave', 400, 350, 1120, 30, '#6A3A34', { a: .13, spread: .05 });
    for (let i = 0; i < 12; i++) wcRect('g-cai' + i, 420 + i * 92, 355, 60, 20, i % 2 ? '#3E7C74' : '#2F5B8A', { a: .12, spread: .1 });
    // the plaque board: gold frame, dark lacquer
    wcRect('g-pframe', PLAQUE.x - 12, PLAQUE.y - 10, PLAQUE.w + 24, PLAQUE.h + 20, '#B98A3A', { a: .14, spread: .05, edge: .4 });
    wcRect('g-plaque', PLAQUE.x, PLAQUE.y, PLAQUE.w, PLAQUE.h, '#26283A', { a: .2, spread: .04, mul: false });
    // door frame, threshold, steps, stone drums
    wcRect('g-postL', 690, 486, 24, 420, '#7A2E28', { a: .15, spread: .05 }); wcRect('g-postR', 1206, 486, 24, 420, '#7A2E28', { a: .15, spread: .05 });
    wcRect('g-lintel', 690, 486, 540, 20, '#7A2E28', { a: .15, spread: .05 });
    wcRect('g-sill', 700, 884, 520, 26, '#6A3A2E', { a: .15, spread: .05, edge: .4 });
    wcRect('g-step1', 630, 910, 660, 30, '#CFC6B6', { a: .1, spread: .05, edge: .4 });
    wcRect('g-step2', 570, 940, 780, 34, '#C4BBAA', { a: .1, spread: .05, edge: .4 });
    for (const x of [650, 1270]) { wcAt('g-drum' + x, UNIT(18), '#BDB7AC', x, 832, 46, { a: .12, spread: .1, edge: .4 }); wcRect('g-drumb' + x, x - 44, 872, 88, 40, '#B0AA9E', { a: .12, spread: .06, edge: .4 }); }
  });
}
// the doors: open 0..1 (swing inward), light = warm light from inside
function gateDoors(open = 0, light = 0) {
  const x0 = 712, x1 = 1208, y0 = 506, y1 = 884, mid = 960;
  if (open > 0) {
    ctx.save(); ctx.fillStyle = mix('#2A2030', '#F2B060', light * .6); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    glow(mid, 760, 420, '#FFC070', .55 * light); ctx.restore();
  }
  const a = ease(open) * 1.25, sx = Math.max(.08, Math.cos(a));
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side < 0 ? x0 : x1, 0); ctx.scale(sx * (side < 0 ? 1 : -1), 1);
    const w = mid - x0;
    wcRect('g-door', 0, y0, w, y1 - y0, '#B8322C', { a: .15, spread: .03, edge: .4 });
    wcRect('g-doorsh', 0, y0, w * .15, y1 - y0, '#6A1E1C', { a: .08, spread: .1, wet: true });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 44 + c * 52, y = y0 + 52 + r * 58; ctx.fillStyle = '#C9983E'; ctx.beginPath(); ctx.arc(x, y, 8.5, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,240,190,.7)'; ctx.beginPath(); ctx.arc(x - 2.5, y - 2.5, 3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#B58436'; ctx.beginPath(); ctx.arc(w - 40, 700, 18, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#A57A34'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(w - 40, 736, 26, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  if (open <= 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(60,20,20,.55)'; ctx.fillRect(mid - 2, y0, 4, y1 - y0); ctx.restore(); }
}
// the gate at night: the same painting, glazed with blue, the moon's light raking across
function nightGlaze(a = .6) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#3A4288', a); ctx.fillRect(-600, -600, 3200, 2400); ctx.restore(); }

// ═════════ 镜1 向阳门第·晨 (0–14) ═════════
const dawnSky = () => bandsL('dawn', -400, -600, 2720, 1500, ['#F4C99A', '#F7DDBA', '#F8EBD6', '#F7F0E4'], .07);
function gateMorning(lt, gold) {
  dawnSky();
  wcGlow(1700, 120, 700, '#FFD9A0', .35);
  cloudWC('g-cl1', 380, 120, 220, '#FFF6E6', .9); cloudWC('g-cl2', 1560, 60, 260, '#FFF1DE', .8);
  gateLayer(); gateDoors(0);
  plaqueChars('pl', gold);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(250,210,160,.16)'; ctx.fillRect(-600, -600, 3200, 2400); ctx.restore();
}
// the sunbeam: a soft slanted band crossing from the right (world x of its centre)
function sunbeam(x, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(x - 220, 0, x + 220, 0);
  g.addColorStop(0, 'rgba(255,220,150,0)'); g.addColorStop(.5, `rgba(255,220,150,${.28 * a})`); g.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 220 + 300, -300); ctx.lineTo(x + 220 + 300, -300); ctx.lineTo(x + 220 - 500, 1300); ctx.lineTo(x - 220 - 500, 1300); ctx.closePath(); ctx.fill();
  ctx.restore();
}
const LIGHT_AT = [4.5, 6.6, 7.4, 8.2];            // 向 阳 门 第 turn gold (s)
function S1(lt, t) {
  const gold = i => ease(seg(lt, LIGHT_AT[i], LIGHT_AT[i] + .6));
  if (lt < 3) {                                   // 0–3 the dawn wash runs down the paper
    camBegin(960, 540, 1);
    camEnd();
    wetFront('s1front', lerp(-80, 1180, easeIO(seg(lt, .2, 3))), () => { camBegin(960, 540, 1); gateMorning(lt, 0); camEnd(); });
  } else if (lt < 9) {                            // 3–9 push in; the sunbeam crosses and the characters turn gold one by one
    const z = kf(lt, [[3, 1], [9, 1.55]], easeIO), cy = lerp(540, 470, seg(z, 1, 1.55));
    camBegin(960, cy, z);
    gateMorning(lt, gold);
    sunbeam(lerp(1900, 500, seg(lt, 3.4, 8.8)), Math.sin(seg(lt, 3.4, 8.8) * Math.PI));
    camEnd();
  } else if (lt < 11.5) {                         // 9–11.5 tilt down to the threshold: the letter slides out under the door
    const cy = kf(lt, [[9, 660], [11.5, 830]], easeIO);
    camBegin(960, cy, 1.9);
    gateMorning(lt, 1);
    const k = ease(seg(lt, 9.8, 11.3));
    ctx.save(); ctx.beginPath(); ctx.rect(600, 895, 800, 200); ctx.clip();
    letter(960 + k * 10, lerp(870, 936, k), 70, { sy: .5, rot: .03 * k });
    ctx.restore();
    camEnd();
  } else {                                        // 11.5–14 it folds itself into a crane and flies up into the clouds (tilt up)
    const cy = kf(lt, [[12, 830], [14, 150]], easeIO);
    camBegin(960, cy, 1.9);
    gateMorning(lt, 1);
    const f = seg(lt, 11.5, 12.3), fly = seg(lt, 12.3, 14);
    if (f < .5) letter(970, 936, 70, { sy: .5 * (1 - ease(f * 2) * .9), sx: 1 - f * .4, rot: .03 });
    else {
      const [x, y] = arcPt([970, 925], [1120, 100], 80, easeIn(fly) * .7 + fly * .3);
      crane(x, y, lerp(30, 70, ease(seg(f, .5, 1))), lt * 2.4, { rot: -.25 * fly });
      if (f < 1) spatter('s1fold', 970, 930, 60, 14, '#F2C24E', { size: 2.4, a: .5 * (1 - f), mul: false });
    }
    cloudWC('s1cl', 1000, 120, 300, '#FFFFFF', seg(lt, 13, 14));
    camEnd();
  }
}

// ═════════ 镜2 北京 · 秋天的蓝 (14–32) ═════════
const bjSky = () => bandsL('bjsky', -600, -500, 4600, 2000, ['#7FA6D6', '#9CBBE0', '#BCD2EA', '#DCE7F0'], .075);
// a pigeon: grey, dark head, flapping (phase), facing right
function pigeon(x, y, s, phase, o = {}) {
  const w = Math.cos(phase * TAU);
  ctx.save(); ctx.translate(x, y); ctx.scale((o.flip ? -1 : 1) * s / 40, s / 40); if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const g = o.col || '#7E8494';
  if (!o.perch) poly([[-6, -2], [10, -2], [-2 + 4 * w, -26 * w]], mix(g, '#FFFFFF', .2), .9);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 16, 7, -.1, 0, TAU); ctx.fill();
  poly([[-14, 0], [-26, -4], [-26, 5]], mix(g, '#2A2A36', .3), .9);
  ctx.fillStyle = mix(g, '#2A2E40', .45); ctx.beginPath(); ctx.arc(14, -5, 5.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#C9A040'; ctx.beginPath(); ctx.moveTo(19, -5); ctx.lineTo(23, -4); ctx.lineTo(19, -3); ctx.fill();
  if (o.perch) { poly([[-10, -3], [8, -3], [-6, 3]], mix(g, '#FFFFFF', .15), 1); limb([[-2, 6], [-2, 12]], 1.6, '#B0605A'); limb([[3, 6], [3, 12]], 1.6, '#B0605A'); }
  else poly([[-4, -1], [12, -1], [2 + 4 * w, -30 * w]], mix(g, '#FFFFFF', .35), 1);
  ctx.restore();
}
// hutong roofs: three receding rows of grey tiled roofs, and one near ridge the pigeons land on
const ROOFS = [];
for (let r = 0; r < 3; r++) for (let i = 0; i < 10; i++) {
  const w = 330 + hash('rf', r, i) * 160, x = -560 + i * 310 + (r % 2) * 150 + hash('rf', r, i + 9) * 40, y = 610 + r * 90, h = 44 + r * 14;
  ROOFS.push({ r, x, y, w, h });
}
const RIDGE = { x0: 560, x1: 1380, y: 850 };       // the near ridge the pigeons land on
function whiteDagoba(key, x, y, s, col = '#F4F1EA') {
  const sh = '#AFAEC0', O = { a: .14, spread: .05, edge: .35, mul: false };
  wcRect(key + 'b', x - s * .38, y - s * .2, s * .76, s * .2, col, O);
  wcRect(key + 'b2', x - s * .28, y - s * .3, s * .56, s * .1, col, O);
  wcAt(key + 'bulb', UNIT(22), col, x, y - s * .47, s * .25, { ...O, sy: 1.05 });
  wcAt(key + 'bsh', UNIT(16), sh, x + s * .1, y - s * .45, s * .16, { sy: 1.4, a: .08, wet: true });
  wcRect(key + 'door', x - s * .05, y - s * .5, s * .1, s * .1, '#A83A2E', { a: .14, spread: .1 });
  wc(key + 'sp', [[x - s * .07, y - s * .7], [x + s * .07, y - s * .7], [x + s * .035, y - s * .9], [x - s * .035, y - s * .9]], col, O);
  wcRect(key + 'bsh2', x + s * .12, y - s * .3, s * .26, s * .3, sh, { a: .06, wet: true });
  for (let i = 0; i < 6; i++) { const yy = y - s * (.72 + i * .03); limb([[x - s * (.07 - i * .006), yy], [x + s * (.07 - i * .006), yy]], 1.2, 'rgba(140,138,160,.6)'); }
  wcAt(key + 'can', UNIT(16), '#C9A040', x, y - s * .92, s * .09, { sy: .3, a: .15, spread: .1 });
  wcAt(key + 'fin', UNIT(10), '#D9AE48', x, y - s * .97, s * .025, { sy: 1.6, a: .18 });
}
function roofsLayer() {
  layer('bjroofs', -600, 200, 3200, 1100, () => {
    wc('bjhill', [[-400, 640], [-100, 520], [300, 470], [620, 540], [900, 640]], '#7E9A7A', { a: .07, spread: .3, wet: true });
    whiteDagoba('bjdag', 250, 560, 420, '#F3F0EA');
    wcRect('bjband', -600, 575, 3200, 700, '#C9C8CC', { a: .15, spread: .02, mul: false });
    ROOFS.forEach((f, j) => {
      const c = mix('#B4B7C2', '#8A8E9C', f.r / 2), dk = mix(c, '#30323C', .3);
      if (f.r === 0 && j % 3 === 1) wcAt('bjgk' + j, UNIT(12), '#E2B84A', f.x + f.w * .5, f.y - f.h - 40, 80, { sy: .8, a: .07, spread: .6, wet: true });
      wcRect('bjwall' + j, f.x + 20, f.y - 4, f.w - 40, 120, mix('#D8D4D0', '#B4B0B2', f.r / 2), { a: .15, spread: .04, mul: false });
      wc('bjroof' + j, [[f.x + 30, f.y - f.h], [f.x + f.w - 30, f.y - f.h], [f.x + f.w + 10, f.y], [f.x - 10, f.y]], c, { a: .15, spread: .03, edge: .3, mul: false });
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = rgba(dk, .3); ctx.lineWidth = 2.5; ctx.beginPath();
      for (let x = f.x + 8; x < f.x + f.w - 8; x += 14) { ctx.moveTo(lerp(f.x + 30, f.x + f.w - 30, (x - f.x) / f.w), f.y - f.h + 4); ctx.lineTo(x, f.y - 2); }
      ctx.stroke(); ctx.restore();
      wcStroke('bjridge' + j, [[f.x + 22, f.y - f.h], [f.x + f.w - 22, f.y - f.h]], 8 + f.r * 2, 8 + f.r * 2, dk, { a: .12 });
    });
    // the near roof, seen from just above its ridge
    wc('bjnear', [[-600, RIDGE.y], [2600, RIDGE.y], [2600, 1300], [-600, 1300]], '#9EA2B0', { a: .16, spread: .02, mul: false });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = 'rgba(80,84,100,.25)'; ctx.lineWidth = 8; ctx.beginPath();
    for (let x = -600; x < 2600; x += 30) { ctx.moveTo(x, RIDGE.y + 14); ctx.lineTo(x + (x - 960) * .25, 1300); }
    ctx.stroke(); ctx.restore();
    wcStroke('bjnearR', [[-600, RIDGE.y], [2600, RIDGE.y]], 22, 22, '#5A5E6C', { a: .12 });
  });
}
function persimmonTree(key, t, ripe) {
  layer(key + 'bg', -400, -300, 2720, 1700, () => {
    wcBands(key + 'sky', -400, -300, 2720, 1100, ['#7FA6D6', '#A6C2E3', '#CFDDEB'], { a: .075 });
    wcRect(key + 'wall', -400, 700, 2720, 700, '#A9A7AA', { a: .09, spread: .08 });
    wc(key + 'cap', [[-400, 640], [2320, 640], [2320, 712], [-400, 712]], '#4E5260', { a: .12, spread: .05 });
    for (let x = -400; x < 2320; x += 26) wcStroke(key + 'ct' + x, [[x, 646], [x + 3, 708]], 6, 6, '#3A3E4C', { a: .1, layers: 4 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; for (let y = 740, r = 0; y < 1400; y += 26, r++) { ctx.strokeStyle = 'rgba(120,112,108,.25)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); for (let x = -400 + (r % 2) * 28; x < 2320; x += 56) { ctx.moveTo(x, y); ctx.lineTo(x, y + 26); } ctx.stroke(); } ctx.restore();
    const B = [[[300, 1100], [420, 720], [640, 420], [980, 240], [1500, 170]], [[640, 420], [760, 180], [900, 60]], [[980, 240], [1200, 330], [1480, 520], [1660, 700]], [[520, 560], [300, 380], [120, 300]], [[1220, 200], [1420, 40], [1600, -60]]];
    B.forEach((b, i) => wcStroke(key + 'br' + i, b, i ? 26 : 60, 8, '#4A3A34', { a: .14 }));
    for (let i = 0; i < 26; i++) wcAt(key + 'lf' + i, UNIT(8), i % 3 ? '#B79A3A' : '#8A8A40', 150 + hash(key, i) * 1500, 60 + hash(key, i, 1) * 560, 26 + hash(key, i, 2) * 16, { sy: .5, rot: hash(key, i, 3) * 3, a: .12 });
  });
  PERSIMMONS.forEach(([x, y, r], i) => {
    const k = Math.round(clamp(ripe(i)) * 8) / 8, col = mix('#9AAE4E', '#EE7424', k);
    wcAt(key + 'p' + i, UNIT(16), col, x, y, r, { a: .15, spread: .18, edge: .4, mul: false });
    wcAt(key + 'ph' + i, UNIT(10), mix(col, '#FFF4D8', .5), x - r * .3, y - r * .3, r * .35, { a: .12, wet: true, mul: false, gran: 0 });
    wcAt(key + 'pc' + i, UNIT(6), '#4A5A2A', x, y - r * .92, r * .32, { sy: .4, a: .2, spread: .3 });
  });
}
const PERSIMMONS = [[520, 470, 30], [700, 350, 34], [820, 250, 28], [960, 300, 36], [1100, 230, 30], [1240, 330, 32], [1380, 440, 30], [1520, 560, 34], [380, 380, 28], [760, 120, 26], [1340, 110, 28], [1600, 660, 28], [640, 540, 26], [1180, 420, 26]];
// a bicycle, side view, ink lines; x = centre, gy = ground; d = distance rolled (turns the wheels)
function bicycle(x, gy, s, d, o = {}) {
  const r = s * .34, fx = x + s * .55, bx = x - s * .55, wy = gy - r;
  const draw = (col, lw) => {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const cx of [bx, fx]) { ctx.beginPath(); ctx.arc(cx, wy, r, 0, TAU); ctx.stroke(); ctx.save(); ctx.lineWidth = lw * .35; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI - d / r; ctx.moveTo(cx - Math.cos(a) * r, wy - Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a) * r, wy + Math.sin(a) * r); } ctx.stroke(); ctx.restore(); }
    const seat = [x - s * .2, wy - s * .5], bar = [x + s * .42, wy - s * .56], crank = [x, wy];
    ctx.beginPath(); ctx.moveTo(bx, wy); ctx.lineTo(crank[0], crank[1]); ctx.lineTo(seat[0], seat[1]); ctx.lineTo(bx, wy);
    ctx.moveTo(seat[0] + s * .03, seat[1] + s * .05); ctx.lineTo(bar[0], bar[1] + s * .08); ctx.lineTo(crank[0], crank[1]);
    ctx.moveTo(fx, wy); ctx.lineTo(bar[0], bar[1]); ctx.lineTo(bar[0] - s * .1, bar[1] - s * .06);
    ctx.moveTo(seat[0] - s * .1, seat[1] - s * .02); ctx.lineTo(seat[0] + s * .08, seat[1] - s * .02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx + s * .02, bar[1] + s * .04); ctx.lineTo(fx + s * .32, bar[1] + s * .04); ctx.lineTo(fx + s * .28, bar[1] + s * .26); ctx.lineTo(fx + s * .04, bar[1] + s * .26); ctx.closePath(); ctx.stroke();
  };
  ctx.save(); ctx.translate(0, gy); ctx.transform(1, 0, 1.5, -.3, 0, 0); ctx.translate(0, -gy); ctx.globalAlpha *= .22; draw('#4A4A70', s * .05); ctx.restore();
  draw('#2E2A36', Math.max(2, s * .022));
  return [fx + s * .17, wy - s * .56 + s * .02];     // the basket
}
function hutongLayer() {
  layer('hutong', -600, -300, 4400, 1700, () => {
    wcBands('hts', -600, -300, 4400, 800, ['#8FB0DA', '#B4CBE6', '#D8E4EE'], { a: .075 });
    wcRect('htwall', -600, 380, 4400, 540, '#A8A6AA', { a: .09, spread: .06 });
    wc('htcap', [[-600, 340], [3800, 340], [3800, 396], [-600, 396]], '#4E5260', { a: .12, spread: .04 });
    for (let x = -600; x < 3800; x += 24) wcStroke('htct' + x, [[x, 344], [x + 3, 392]], 6, 6, '#3A3E4C', { a: .1, layers: 4 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; for (let y = 410, r = 0; y < 920; y += 26, r++) { ctx.strokeStyle = 'rgba(120,112,108,.24)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(3800, y); for (let x = -600 + (r % 2) * 28; x < 3800; x += 56) { ctx.moveTo(x, y); ctx.lineTo(x, y + 26); } ctx.stroke(); } ctx.restore();
    for (const dx of [700, 2300]) { wcRect('htdoor' + dx, dx, 520, 200, 400, '#B03A30', { a: .15, spread: .04, edge: .4 }); wcRect('htdf' + dx, dx - 16, 500, 232, 22, '#5A3A34', { a: .15, spread: .04 }); for (const s of [0, 1]) { ctx.fillStyle = '#C9983E'; ctx.beginPath(); ctx.arc(dx + 80 + s * 40, 720, 7, 0, TAU); ctx.fill(); } }
    for (let i = 0; i < 5; i++) { const x = -100 + i * 900; wcStroke('htsh' + i, [[x, 380], [x + 120, 600], [x + 160, 900]], 26, 10, '#6A6A90', { a: .05, wet: true }); for (let j = 0; j < 14; j++) wcAt('htsl' + i + ':' + j, UNIT(8), '#6A6A90', x - 160 + hash('hs', i, j) * 520, 400 + hash('hs', j, i) * 260, 30 + hash('hs', i + j) * 30, { sy: .6, a: .05, wet: true }); }
    wcRect('htgrd', -600, 916, 4400, 500, '#BDB2A0', { a: .08, spread: .15, wet: true });
    for (let i = 0; i < 30; i++) wcAt('htlf' + i, UNIT(6), i % 2 ? '#E0B040' : '#C98A30', -500 + hash('hl', i) * 4200, 940 + hash('hl', i, 1) * 180, 9, { sy: .5, rot: i, a: .2 });
  });
}
function S2(lt, t) {
  if (lt < 3) {                                   // 14–17 pigeons circle through the blue; the crane joins them (pan right)
    const cx = kf(lt, [[-1, 900], [3, 1500]], easeIO);
    camBegin(cx, 540, 1);
    bjSky();
    cloudWC('bjc1', 700, 300, 280, '#FFFFFF', .9); cloudWC('bjc2', 1900, 180, 360, '#FFFFFF', .8); cloudWC('bjc3', 2500, 420, 240, '#FFFFFF', .7);
    const C = [lerp(900, 1700, seg(lt, -1, 3)), 520];
    for (let i = 0; i < 14; i++) {
      const a = lt * 1.4 + i / 14 * TAU + hash('pg', i) * .4, R = 260 + hash('pg', i, 1) * 160;
      const x = C[0] + Math.cos(a) * R, y = C[1] + Math.sin(a) * R * .38 + hash('pg', i, 2) * 60, d = .75 + .25 * Math.sin(a);
      pigeon(x, y, 96 * d, lt * 3.4 + hash('pg', i, 3), { flip: Math.sin(a) > 0 });
    }
    const k = seg(lt, -1, 2), [x, y] = k < 1 ? arcPt([500, 820], [C[0] - 180, C[1] + 60], 200, easeOut(k)) : [C[0] + Math.cos(lt * 1.4) * 200, C[1] + 60 + Math.sin(lt * 1.4) * 60];
    crane(x, y, 130, lt * 2.2, { rot: -.1 });
    camEnd();
  } else if (lt < 6) {                            // 17–20 the pigeons land on the ridge one by one; the crane lands last
    camBegin(960, 540, 1);
    bjSky(); cloudWC('bjc4', 1500, 180, 300, '#FFFFFF', .8);
    roofsLayer();
    for (let i = 0; i < 9; i++) {
      const t0 = 3 + i * .24, k = ease(seg(lt, t0, t0 + .9)), px = RIDGE.x0 - 60 + i * 96 + (i > 4 ? 120 : 0), py = RIDGE.y - 26;
      const [x, y] = arcPt([px - 700 + i * 40, 60 + hash('pl', i) * 120], [px, py], -60, k);
      pigeon(x, y, 80, k < 1 ? lt * 3.6 + i * .3 : 0, { perch: k >= 1, flip: k >= 1 && i % 3 === 0 });
    }
    const k = ease(seg(lt, 4.8, 5.8)), [x, y] = arcPt([1700, 80], [960, RIDGE.y - 26], -40, k);
    crane(x, y, 90, k < 1 ? lt * 2.4 : .25, { fold: k >= 1, rot: (1 - k) * .15 });
    camEnd();
  } else if (lt < 9) {                            // 20–23 persimmons ripen from green to orange one by one (slow push)
    const z = kf(lt, [[6, 1], [9, 1.12]], ease);
    camBegin(960, 480, z);
    persimmonTree('bjper', t, i => seg(lt, 6.2 + i * .17, 6.8 + i * .17));
    camEnd();
  } else if (lt < 12) {                           // 23–26 a bicycle rolls along the hutong wall; the crane rides in its basket (pan with it)
    const bx = lerp(300, 2600, seg(lt, 9, 12)), cx = bx + 60;
    camBegin(cx, 540, 1);
    hutongLayer();
    const [kx, ky] = bicycle(bx, 930, 300, bx);
    crane(kx - 10, ky - 26, 80, .25, { fold: true });
    camEnd();
  } else if (lt < 15) {                           // 26–29 北海白塔 at dusk: the sky blushes, the crane circles the spire
    camBegin(960, 540, 1);
    const p = seg(lt, 12, 14.5);
    bandsL('bjdusk0', -200, -200, 2320, 1480, ['#9CB4DA', '#B8C8E4', '#D8DEEC'], .075);
    ctx.save(); ctx.globalAlpha = ease(p); bandsL('bjdusk1', -200, -200, 2320, 1480, ['#C7A2C8', '#EBB1B8', '#F6D2B8'], .075); ctx.restore();
    layer('bjbeihai', -200, 300, 2320, 1100, () => {
      wc('bhisle', [[250, 800], [520, 700], [800, 650], [1120, 650], [1420, 700], [1700, 800]], '#6A7A6A', { a: .09, spread: .2 });
      for (let i = 0; i < 16; i++) { const x = 330 + i * 86 + hash('bh', i) * 30, y = 770 - Math.sin((x - 250) / 1450 * Math.PI) * 120; wcAt('bhtr' + i, UNIT(12), i % 3 ? '#4E6A56' : '#6A7E4E', x, y, 50 + hash('bh', i, 1) * 50, { sy: 1.1, a: .08, spread: .5 }); }
      wcRect('bhwater', -200, 780, 2320, 620, '#8C9CC0', { a: .08, spread: .1, wet: true });
      ctx.save(); ctx.translate(0, 1560); ctx.scale(1, -1); ctx.globalAlpha = .25; whiteDagoba('bhdagR', 960, 780, 560, '#E8E4EC'); ctx.restore();
    });
    const a = seg(lt, 12.4, 14.8) * TAU * 1.05 + Math.PI, cx0 = 960, cy0 = 190, far = Math.sin(a) < 0;
    const cr = () => crane(cx0 + Math.cos(a) * 200, cy0 + Math.sin(a) * 50, 70 * (1 + .25 * Math.sin(a)), lt * 2.6, { flip: Math.cos(a + Math.PI / 2) < 0 });
    if (far) cr();
    whiteDagoba('bhdag', 960, 780, 560, '#F4F0EC');
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#F0B4A8', .18 * p); ctx.fillRect(-200, -200, 2320, 1480); ctx.restore();
    if (!far) cr();
    camEnd();
  } else {                                        // 29–32 one persimmon drops and falls toward the lens until it fills the frame
    const z = kf(lt, [[15, 1], [18, 1.25]], easeIn);
    camBegin(960, 540, z);
    bandsL('bjdusk1', -200, -200, 2320, 1480, ['#C7A2C8', '#EBB1B8', '#F6D2B8'], .075);
    wcStroke('bjlast-br', [[-100, 120], [400, 260], [900, 330], [1300, 300]], 30, 8, '#4A3A34', { a: .14 });
    wcAt('bjlast-lf', UNIT(8), '#B79A3A', 1040, 360, 40, { sy: .45, rot: .6, a: .13 });
    const k = seg(lt, 15.6, 18), r = 44 * Math.pow(40, easeIn(k)), y = 380 + 60 * Math.sin(k * Math.PI);
    wcAt('bjlast-p', UNIT(20), '#EE6A24', 960 + k * 10, y, r, { a: .16, spread: .18, edge: .4, mul: false });
    wcAt('bjlast-ph', UNIT(12), '#FFD0A0', 960 - r * .3, y - r * .3, r * .35, { a: .12, wet: true, mul: false, gran: 0 });
    if (k < .1) wcAt('bjlast-pc', UNIT(6), '#4A5A2A', 960, y - r * .92, r * .32, { sy: .4, a: .2 });
    camEnd();
  }
}
