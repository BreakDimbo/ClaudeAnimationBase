// ═════════ 镜3 西安 · 城墙夜 (32–50) ═════════
const xaSky = key => bandsL(key, -700, -600, 4600, 1500, ['#141A42', '#1F2658', '#333A72', '#4E4A7C'], .08);
const XA_LAN = Array.from({ length: 20 }, (_, i) => -560 + i * 230);
function xaWall() {
  layer('xawall', -700, 200, 4600, 1200, () => {
    // the arrow tower behind the wall
    const tx = 2500;
    wcRect('xat-b', tx - 330, 250, 660, 320, '#3A3050', { a: .11, spread: .04 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) wcRect('xat-w' + r + ':' + c, tx - 300 + c * 56, 290 + r * 66, 20, 26, '#1A1830', { a: .16, spread: .1 });
    wc('xat-r1', [[tx - 420, 260], [tx + 420, 260], [tx + 360, 200], [tx - 360, 200]], '#241E36', { a: .14, spread: .04 });
    wc('xat-r2', [[tx - 380, 200], [tx + 380, 200], [tx + 300, 120], [tx + 250, 60], [tx - 250, 60], [tx - 300, 120]], '#241E36', { a: .14, spread: .04 });
    // the wall: merlons, face, brick courses
    { const g = ctx.createLinearGradient(0, 560, 0, 1400); g.addColorStop(0, '#4A3E52'); g.addColorStop(1, '#2A2436'); ctx.fillStyle = g; ctx.fillRect(-700, 560, 4600, 840); }
    wcRect('xa-face', -700, 560, 4600, 840, '#6A5A6A', { a: .05, spread: .03 });
    for (let x = -700; x < 3900; x += 84) wcRect('xa-mer' + x, x, 500, 54, 64, '#5A4A5A', { a: .1, spread: .04 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    for (let y = 580, r = 0; y < 1400; y += 30, r++) { ctx.strokeStyle = 'rgba(40,30,50,.28)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-700, y); ctx.lineTo(3900, y); for (let x = -700 + (r % 2) * 32; x < 3900; x += 64) { ctx.moveTo(x, y); ctx.lineTo(x, y + 30); } ctx.stroke(); }
    ctx.restore();
    wcRect('xa-cord', -700, 556, 4600, 12, '#3A2E40', { a: .14, spread: .03 });
    XA_LAN.forEach((x, i) => limb([[x, 568], [x, 598]], 2, 'rgba(30,20,30,.7)'));
  });
}
function xaLanterns(lit, t) { XA_LAN.forEach((x, i) => lanternWC(x, 640, 40, lit(i, x), Math.sin(t * 1.3 + i * .7) * .04, 'xal' + i)); }
function bellTower(key) {
  bandsL(key + 's', -400, -400, 2720, 1880, ['#141A42', '#1F2658', '#333A72', '#4E4A7C']);
  layer(key, -400, -400, 2720, 1880, () => {
    const x = 960, c = '#2A2440', d = '#1C1830';
    wcRect(key + 'plat', x - 360, 700, 720, 300, '#3E3450', { a: .12, spread: .03 });
    wc(key + 'arch', [...arcPts(x, 860, 90, Math.PI, TAU, 10), [x + 90, 1000], [x - 90, 1000]], '#16122A', { a: .16, spread: .05 });
    wcRect(key + 'hall', x - 230, 520, 460, 180, c, { a: .12, spread: .03 });
    for (let i = 0; i < 6; i++) wcRect(key + 'win' + i, x - 200 + i * 72, 560, 40, 110, '#E8A050', { a: .1, spread: .08, mul: false });
    wc(key + 'e1', [[x - 360, 540], [x + 360, 540], [x + 400, 510], [x + 250, 460], [x - 250, 460], [x - 400, 510]], d, { a: .15, spread: .03 });
    wcRect(key + 'hall2', x - 170, 380, 340, 90, c, { a: .12, spread: .03 });
    for (let i = 0; i < 5; i++) wcRect(key + 'win2' + i, x - 150 + i * 64, 400, 34, 56, '#E8A050', { a: .1, spread: .08, mul: false });
    wc(key + 'e2', [[x - 280, 400], [x + 280, 400], [x + 310, 372], [x + 170, 330], [x - 170, 330], [x - 310, 372]], d, { a: .15, spread: .03 });
    wc(key + 'top', [[x - 230, 340], [x + 230, 340], [x + 250, 318], [x, 190], [x - 250, 318]], d, { a: .15, spread: .03 });
    wcAt(key + 'fin', UNIT(10), '#D9A441', x, 180, 16, { sy: 1.6, a: .18 });
    wcRect(key + 'grd', -400, 990, 2720, 500, '#2A2640', { a: .1, wet: true });
    for (let i = 0; i < 26; i++) { const lx = -300 + i * 100 + hash(key, i) * 40; glow(lx, 1000 + hash(key, i, 1) * 60, 40, '#FFB060', .25); }
  });
}
const PAGODA_TIP = 47;
function wildGoosePagoda(key, sky = true) {
  if (sky) bandsL(key + 's', -400, -500, 2720, 1980, ['#10163A', '#1A2150', '#2C3268', '#48467A'], .08);
  layer(key, -400, -500, 2720, 1980, () => {
    const x = 960; let y = 1000;
    wcRect(key + 'base', x - 330, y - 90, 660, 90, '#4A3E4E', { a: .12, spread: .03 });
    y -= 90;
    for (let i = 0; i < 7; i++) {
      const w = 440 - i * 44, h = 118 - i * 7;
      wcRect(key + 'st' + i, x - w / 2, y - h, w, h, '#6A5460', { a: .12, spread: .03 });
      wc(key + 'arch' + i, [...arcPts(x, y - h * .45, w * .09, Math.PI, TAU, 8), [x + w * .09, y - h * .1], [x - w * .09, y - h * .1]], '#1A1428', { a: .16, spread: .05 });
      wcRect(key + 'cor' + i, x - w / 2 - 16, y - h - 12, w + 32, 14, '#3A2E40', { a: .14, spread: .03 });
      y -= h + 12;
    }
    wc(key + 'roof', [[x - 110, y + 2], [x + 110, y + 2], [x, y - 70]], '#3A2E40', { a: .14, spread: .04 });
    wcAt(key + 'fin', UNIT(10), '#8A7040', x, y - 90, 12, { sy: 2, a: .16 });
    for (let i = 0; i < 18; i++) wcAt(key + 'tr' + i, UNIT(12), '#1E2A34', -300 + i * 150 + hash(key, i) * 60, 990 - hash(key, i, 1) * 40, 90 + hash(key, i, 2) * 60, { sy: .9, a: .1, spread: .5 });
    wcRect(key + 'grd', -400, 1000, 2720, 500, '#1E2230', { a: .12, wet: true });
  });
}
function eaveTwo(key) {
  bandsL(key + 's', -400, -300, 2720, 1700, ['#141A42', '#1F2658', '#2E3468']);
  layer(key, -400, -300, 2720, 1700, () => {
    for (let i = 0; i < 30; i++) glow(hash(key, i) * 2400 - 200, 500 + hash(key, i, 1) * 700, 30 + hash(key, i, 2) * 60, i % 3 ? '#FF9A50' : '#FFD080', .2);
    wc(key + 'eave', [[-400, -300], [2320, -300], [2320, 90], [-400, 150]], '#171326', { a: .16, spread: .02 });
    for (let x = -380; x < 2320; x += 60) wcAt(key + 'raf' + x, UNIT(8), '#2A2030', x, 150 - (x + 400) / 2720 * 60 + 10, 16, { a: .18 });
    wcRect(key + 'beam', -400, 110, 2720, 26, '#6A2A2A', { a: .14, spread: .02 });
  });
}
function S3(lt, t) {
  if (lt < 6) {                                   // 32–35 one lantern fills the frame, the camera draws back to the whole row; 35–38 they light up left to right
    const first = lt < 3, z = first ? kf(lt, [[0, 7], [3, 1]], easeOut) : 1, cx = first ? 960 + (1 - seg(z, 1, 7)) * 0 : kf(lt, [[3, 960], [6, 2100]], easeIO);
    camBegin(first ? XA_LAN[7] : cx, first ? lerp(560, 640, seg(z, 1, 7)) : 560, z);
    xaSky('xasky'); stars('xast', 80, -700, -600, 4600, 1000, t);
    xaWall();
    const rx = lerp(60, 2700, seg(lt, 3, 6)), ph = (rx - 60) / 300;
    xaLanterns((i, x) => i === 7 ? 1 : lt < 3 ? 0 : clamp((rx - x) / 90), t);
    if (first) bunny(XA_LAN[7], 606, 22, t, { glow: .25 });
    else bunny(rx, 500 - Math.abs(Math.sin(ph * Math.PI)) * 70, 60, t, { glow: .25 });
    camEnd();
  } else if (lt < 9) {                            // 38–41 the bell rings: its sound spreads through the sky in rings of wash
    camBegin(960, 540, 1);
    bellTower('xabt'); stars('xast2', 60, 0, 0, 1920, 400, t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const t0 of [6.3, 7.3, 8.3]) for (let j = 0; j < 4; j++) {
      const k = (lt - t0 - j * .12) / 2.2; if (k <= 0 || k >= 1) continue;
      ctx.strokeStyle = rgba('#F2C890', .35 * (1 - k) * (1 - j * .2)); ctx.lineWidth = 6 * (1 - k) + 1;
      ctx.beginPath(); ctx.ellipse(960, 250, 60 + 1100 * easeOut(k), (60 + 1100 * easeOut(k)) * .55, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    const jump = hop(lt, 6.35, 6.7, 40);
    bunny(560, 1010 + jump.dy, 80, t, { glow: .25 });
    camEnd();
  } else if (lt < 12) {                           // 41–44 two lanterns in the wind: they touch, touch again, and stay together (slow push)
    const z = kf(lt, [[9, 1], [12, 1.12]], ease);
    camBegin(960, 520, z);
    eaveTwo('xaeave');
    const Ls = 360, R = 150 * .7, d = 210, aT = Math.asin((d - R) / Ls);
    // the gust: they swing toward each other, bump at 10.2, fall back, bump at 10.9, and stay
    const k = lt - 9.4;
    let A = 0;
    if (k > 0) { A = aT * Math.min(1, Math.sin(Math.min(k / .8, 1) * Math.PI / 2) * 1.15); if (k > .8 && k < 1.5) A = aT * (1 - .45 * Math.sin((k - .8) / .7 * Math.PI)); if (k >= 1.5) A = aT; }
    const sway = k > 1.5 ? Math.sin((lt - 10.9) * 1.1) * .05 : 0;
    const p1 = [960 - d, 140], p2 = [960 + d, 140];
    for (const [p, a, key] of [[p1, A + sway, 'xa2a'], [p2, -A + sway, 'xa2b']]) {
      const x = p[0] + Math.sin(a) * Ls, y = p[1] + Math.cos(a) * Ls;
      limb([p, [x, y - 150 * .7]], 2.5, 'rgba(40,20,20,.8)');
      lanternWC(x, y, 150, 1, a * .3, key);
    }
    if (k > .75 && k < 1.2) glow(960 + Math.sin(sway) * Ls, 140 + Ls, 120, '#FFD090', .25 * Math.sin(seg(k, .75, 1.2) * Math.PI));
    bunny(960, 111, 46, t, { glow: .25 });
    camEnd();
  } else if (lt < 15) {                           // 44–47 大雁塔: the moon rises and comes to rest on the spire (tilt up)
    const cy = kf(lt, [[12, 760], [15, 300]], easeIO);
    camBegin(960, cy, 1);
    bandsL('xapags', -400, -500, 2720, 1980, ['#10163A', '#1A2150', '#2C3268', '#48467A'], .08);
    { const k = easeOut(seg(lt, 12, 14.6)), [mx, my] = arcPt([1500, 900], [960, PAGODA_TIP - 110], -120, k); moonWC(mx, my, 84, { glow: .8 }); }
    wildGoosePagoda('xapag', false);
    const reach = Math.max(hop(lt, 14.5, 14.8, 16).dy, hop(lt, 14.95, 15.25, 20).dy);
    bunny(962, 54 + reach, 30, t, { glow: .3 });
    camEnd();
  } else {                                        // 47–50 a raindrop falls onto the moon; ripples spread across the frame (→ Singapore)
    camBegin(960, 300, 1);
    bandsL('xapags', -400, -500, 2720, 1980, ['#10163A', '#1A2150', '#2C3268', '#48467A'], .08);
    moonWC(960, PAGODA_TIP - 110, 84, { glow: .8 });
    wildGoosePagoda('xapag', false);
    bunny(962, 54, 30, t, { glow: .3 });
    const k = seg(lt, 15.2, 16);
    if (k < 1) { ctx.fillStyle = 'rgba(220,235,250,.8)'; ctx.beginPath(); ctx.ellipse(975, lerp(-300, PAGODA_TIP - 110, easeIn(k)), 5, 11, 0, 0, TAU); ctx.fill(); }
    ripples(960, PAGODA_TIP - 110, lt, [16, 16.5, 17], 700, .6, '#E8F0FF', .5, 2);
    camEnd();
  }
}

// ═════════ 镜4 新加坡 · 雨 (50–68) ═════════
const SG_COL = ['#A8D8C4', '#F2B8C4', '#F4D88E', '#A9C8E6', '#F6C3A0', '#C8B8E0'];
const SG_N = 16, SG_W = 320, SG_X0 = -600;
const sgHouse = i => ({ x: SG_X0 + i * SG_W, col: SG_COL[i % SG_COL.length], win: [0, 1, 2].map(j => SG_X0 + i * SG_W + 58 + j * 90) });
const SPR = new Map();
function spriteC(key, w, h, fn) { let c = SPR.get(key); if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; const m = ctx; ctx = c.getContext('2d'); fn(); ctx = m; SPR.set(key, c); } return c; }
function shutter(col, x, y, open, side) {       // one leaf; hinge on the outer edge of the window; open 0..1 folds it out flat to the wall
  const c = spriteC('shut' + col, 40, 190, () => { wcRect('shl' + col, 2, 2, 36, 186, mix(col, '#3A6A5A', .45), { a: .16, spread: .04, edge: .4, mul: false }); ctx.strokeStyle = 'rgba(40,50,50,.35)'; ctx.lineWidth = 2; for (let yy = 12; yy < 184; yy += 10) { ctx.beginPath(); ctx.moveTo(6, yy); ctx.lineTo(34, yy + 3); ctx.stroke(); } });
  const sx = lerp(1, -.55, ease(open));
  ctx.save(); ctx.translate(x, y); ctx.scale(sx * side, 1); ctx.drawImage(c, 0, 0, 36, 180); ctx.restore();
}
function sgStreet() {
  layer('sgst', -700, -400, 5800, 2000, () => {
    wcBands('sgsky', -700, -400, 5800, 800, ['#4E5C8C', '#6E7CA6', '#98A4C2'], { a: .08 });
    for (let i = 0; i < SG_N; i++) {
      const h = sgHouse(i), x = h.x, c = h.col;
      wc('sgpar' + i, [[x + 10, 250], [x + 110, 250], [x + 160, 205], [x + 210, 250], [x + SG_W - 10, 250], [x + SG_W - 10, 300], [x + 10, 300]], c, { a: .12, spread: .04, edge: .35 });
      wcRect('sgcor' + i, x, 296, SG_W, 26, mix(c, '#FFFFFF', .4), { a: .14, spread: .03, edge: .35, mul: false });
      wcRect('sgup' + i, x + 4, 320, SG_W - 8, 330, c, { a: .12, spread: .03 });
      for (const wx of h.win) { wcRect('sgwin' + i + ':' + wx, wx, 380, 72, 180, '#F2C87A', { a: .14, spread: .05, mul: false }); wc('sgfan' + i + ':' + wx, [...arcPts(wx + 36, 380, 36, Math.PI, TAU, 8)], mix(c, '#FFFFFF', .5), { a: .15, spread: .05, edge: .4, mul: false }); }
      for (const px of [x + 4, x + SG_W - 20]) wcRect('sgpil' + i + ':' + px, px, 320, 16, 580, mix(c, '#FFFFFF', .35), { a: .12, spread: .03, mul: false });
      wcRect('sgmid' + i, x, 648, SG_W, 22, mix(c, '#FFFFFF', .4), { a: .14, spread: .03, edge: .35, mul: false });
      wcRect('sggr' + i, x + 4, 668, SG_W - 8, 232, mix(c, '#6A6A80', .25), { a: .12, spread: .03 });
      wc('sgarch' + i, [[x + 40, 900], ...arcPts(x + SG_W / 2, 760, SG_W / 2 - 40, Math.PI, TAU, 10), [x + SG_W - 40, 900]], '#3A3448', { a: .15, spread: .04 });
    }
    wcRect('sgfloor', -700, 900, 5800, 40, '#A0685A', { a: .12, spread: .03 });
    wcRect('sgroad', -700, 940, 5800, 700, '#4A5068', { a: .1, spread: .05, wet: true });
    for (let i = 0; i < SG_N; i++) {       // wet asphalt: each lamp and each facade colour smeared down in the water
      const x = SG_X0 + i * SG_W + SG_W / 2;
      for (const [dx, c, a, w] of [[0, '#F6C87A', .22, 34], [-100, SG_COL[i % 6], .16, 60], [100, SG_COL[i % 6], .12, 50]]) {
        ctx.save(); ctx.translate(x + dx, 1040); ctx.scale(1, 5); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(-w, -w, w * 2, w * 2); ctx.restore();
      }
    }
    // the puddle
    wcAt('sgpud', UNIT(24), '#2A3050', 1040, 1200, 230, { sy: .3, a: .12, spread: .08, edge: .4 });
  });
}
function sgShutters(open) { for (let i = 0; i < SG_N; i++) { const h = sgHouse(i); h.win.forEach((wx, j) => { const o = open(i, j); shutter(h.col, wx, 380, o, 1); shutter(h.col, wx + 72, 380, o, -1); }); } }
function sgLamps(lit, t) { for (let i = 0; i < SG_N; i++) { const x = SG_X0 + i * SG_W + SG_W / 2, a = lit(i); if (a > 0) { glow(x, 700, 160, '#FFB868', .45 * a); ctx.fillStyle = rgba('#FFE0A0', a); ctx.beginPath(); ctx.arc(x, 692, 7, 0, TAU); ctx.fill(); } limb([[x, 672], [x, 686]], 2, 'rgba(40,40,40,.6)'); } }
const flick = (lt, t0) => lt < t0 ? 0 : lt < t0 + .35 ? (Math.floor((lt - t0) * 20) % 3 === 1 ? 0 : 1) : 1;
function puddleMoon(t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.ellipse(1040, 1200, 226, 66, 0, 0, TAU); ctx.clip();
  const g = ctx.createLinearGradient(0, 1134, 0, 1266); g.addColorStop(0, '#1E2448'); g.addColorStop(1, '#4A5480'); ctx.fillStyle = g; ctx.fillRect(800, 1130, 480, 140);
  if (o.moon !== false) { ctx.save(); ctx.translate(1080, 1190); ctx.scale(1, .55); moonWC(0, 0, 44, { glow: .6 }); ctx.restore(); }
  if (o.inside) o.inside();
  ctx.restore();
}
function frangipani(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; ctx.save(); ctx.rotate(a); ctx.fillStyle = '#FBF7EE'; ctx.beginPath(); ctx.ellipse(s * .55, s * .12, s * .55, s * .3, .35, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(160,140,110,.35)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * .6); g.addColorStop(0, '#F4C040'); g.addColorStop(1, 'rgba(244,192,64,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s * .6, 0, TAU); ctx.fill();
  ctx.restore();
}
function bayNight() {
  bandsL('sgbs', -400, -300, 2720, 1700, ['#1C1A48', '#2E2A64', '#4E3E7C', '#7A5A90']);
  layer('sgbay', -400, -300, 2720, 1700, () => {
    // Marina Bay Sands: three towers, each two slabs leaning together, and the boat across the top
    for (let i = 0; i < 3; i++) { const x = 1330 + i * 150; wc('mbs' + i, [[x - 40, 800], [x + 40, 800], [x + 30, 340], [x - 30, 340]], '#2E2A58', { a: .15, spread: .02 }); wc('mbsl' + i, [[x - 40, 800], [x - 70, 800], [x - 30, 340]], '#3A3468', { a: .14, spread: .02 }); }
    wc('mbsboat', [[1240, 326], [1660, 318], [1780, 300], [1790, 312], [1700, 334], [1250, 340]], '#2E2A58', { a: .16, spread: .02 });
    for (let i = 0; i < 70; i++) glow(1300 + (i % 3) * 150 + hash('mbw', i) * 60, 360 + hash('mbw', i, 1) * 420, 5, '#FFD890', .5);
    // city behind
    for (let i = 0; i < 9; i++) { const x = -300 + i * 170, h = 180 + hash('sgc', i) * 260; wcRect('sgcity' + i, x, 800 - h, 120, h, '#342E5E', { a: .1, spread: .03 }); }
    wcRect('sgwater', -400, 800, 2720, 700, '#1C1E44', { a: .16, wet: true });
    for (let i = 0; i < 30; i++) { const x = 1300 + hash('mbr', i) * 450; wcStroke('mbref' + i, [[x, 830 + i * 12], [x + 40, 832 + i * 12]], 3, 2, '#F6D890', { a: .2, mul: false, layers: 3 }); }
  });
}
const SUPERTREES = [[200, 320, 1.3], [470, 200, 1.7], [760, 360, 1.2], [1000, 260, 1.5], [1180, 420, 1]];
function supertree(x, top, s, lit, t, i) {
  const base = 800, cw = 150 * s;
  const c = mix('#3A3060', '#6A4A8A', lit * .4);
  const H = base - top;
  wc('stt' + i, [[x - 14 * s, base], [x + 14 * s, base], [x + 16 * s, top + H * .45], [x + cw * .22, top + H * .16], [x + cw / 2, top + 4], [x - cw / 2, top + 4], [x - cw * .22, top + H * .16], [x - 16 * s, top + H * .45]], c, { a: .15, spread: .02 });
  ctx.save(); ctx.strokeStyle = rgba(mix(c, '#000000', .3), .5); ctx.lineWidth = 1.5; ctx.beginPath();
  for (let j = -4; j <= 4; j++) { ctx.moveTo(x + j * 3 * s, base); ctx.quadraticCurveTo(x + j * 4 * s, top + H * .4, x + j / 4 * cw / 2, top + 6); }
  ctx.stroke(); ctx.restore();
  wcAt('stc' + i, UNIT(20), mix(c, '#20183A', .3), x, top + 4, cw / 2 + 4, { sy: .14, a: .16, spread: .03 });
  if (lit > 0) {
    for (let j = 0; j < 36; j++) {
      const u = hash('stl', i, j), v = hash('stl', j, i), yy = lerp(top + 8, base - 20, Math.pow(u, 1.6)), half = lerp(cw / 2, 15 * s, Math.pow((yy - top) / (base - top), .4));
      const xx = x + (v * 2 - 1) * half * .9, col = ['#E070E0', '#FF8AC8', '#A080FF', '#70C0FF'][j % 4];
      glow(xx, yy, 12, col, .5 * lit * (.7 + .3 * Math.sin(t * 3 + j)));
    }
    glow(x, top, cw * .8, '#D070E0', .3 * lit);
  }
}
function S4(lt, t) {
  const rainA = 1 - seg(lt, 8.5, 10);
  if (lt < 3) {                                   // 50–53 pastel shophouses in the rain; the arcade lamps flicker on (pan left)
    const cx = kf(lt, [[-1, 1700], [3, 900]], easeIO);
    camBegin(cx, 540, 1);
    sgStreet(); sgShutters(() => 0);
    sgLamps(i => flick(lt, 3.2 - (i * SG_W) / 1900), t);
    craneRider(lerp(2500, 300, seg(lt, -1, 3)), 760 + Math.sin(lt * 2) * 20, 100, lt * 2.4, t, { flip: true, wet: .5 });
    rain('sgr1', 260, t, cx - 1100, cx + 1100, -100, 1200, { a: .3 });
    camEnd();
  } else if (lt < 6) {                            // 53–56 the five-foot way: shutters open one after another, rabbit lanterns light up
    camBegin(1360, 560, 1.7);
    sgStreet(); sgShutters((i, j) => seg(lt, 3.3 + (i - 4) * .7 + j * .22, 3.9 + (i - 4) * .7 + j * .22));
    sgLamps(() => 1, t);
    for (let i = 0; i < 4; i++) { const x = 1100 + i * 170; limb([[x, 672], [x, 730]], 1.5, 'rgba(40,30,30,.6)'); rabbitLanternWC(x, 820, 60, seg(lt, 4.4 + i * .3, 4.8 + i * .3), t, 'sgrl' + i); }
    bunny(1352, 824, 46, t, { glow: .2 });
    rain('sgr2', 160, t, 700, 2000, 0, 1100, { a: .28 });
    camEnd();
  } else if (lt < 9) {                            // 56–59 down to a puddle holding the moon; a frangipani spirals down onto it
    const cy = kf(lt, [[6, 600], [9, 1060]], easeIO);
    camBegin(1000, cy, 1);
    sgStreet(); sgShutters(() => 1); sgLamps(() => 1, t);
    const k = seg(lt, 6.2, 8.4);
    puddleMoon(t, { inside: () => { if (k >= 1) ripples(1080, 1190, lt, [8.4, 8.8], 120, .3, '#FFFFFF', .5); } });
    const a = k * TAU * 2.2, [x, y] = [lerp(760, 1080, easeIO(k)) + Math.cos(a) * 80 * (1 - k), lerp(620, 1185, easeIn(k) * .6 + k * .4) + Math.sin(a) * 30 * (1 - k)];
    frangipani(x, y, 26, a * .5);
    bunny(770, 1214, 54, t);
    rain('sgr3', 120, t, 300, 1700, cy - 600, cy + 600, { a: .25 * rainA });
    camEnd();
  } else if (lt < 12) {                           // 59–62 under the eave: the wet crane and a rabbit lantern; the rain stops, the crane shuffles closer
    const z = kf(lt, [[9, 2.6], [12, 2.9]], ease);
    camBegin(1360, 610, z);
    sgStreet(); sgShutters(() => 1); sgLamps(() => 1, t);
    rabbitLanternWC(1420, 648, 56, 1, t, 'sgeave');
    crane(1236, 646, 60, .25, { fold: true, wet: 1 - seg(lt, 10, 11) * .6 });
    const shake = lt > 10 && lt < 10.6 ? Math.sin(lt * 70) * 2.5 : 0, hopK = seg(lt, 10.9, 11.4), cx = lerp(1310, 1366, ease(hopK)), cy = 648 - Math.sin(hopK * Math.PI) * 12;
    bunny(cx + shake, cy, 34, t, { glow: .2 });
    if (lt > 10 && lt < 10.7) spatter('sgshake' + Math.floor(lt * 12), cx + 10, cy - 20, 40, 10, '#E8F0F8', { size: 1.4, a: .8, mul: false });
    rain('sgr4', 60, t, 1000, 1700, 380, 900, { a: .3 * rainA, len: 30 });
    for (let i = 0; i < 5; i++) { const ph = (t * .9 + hash('drip', i)) % 1; if (rainA > .2 || ph < .3) { ctx.fillStyle = 'rgba(230,240,250,.7)'; ctx.beginPath(); ctx.ellipse(1190 + i * 80, 672 + ph * 260, 2, 4, 0, 0, TAU); ctx.fill(); } }
    camEnd();
  } else if (lt < 15) {                           // 62–65 Gardens by the Bay: the Supertrees light up, the moon behind
    camBegin(960, 540, 1);
    bayNight();
    moonWC(760, 230, 74, { glow: .7 });
    SUPERTREES.forEach(([x, top, s], i) => supertree(x, top, s, ease(seg(lt, 12.5 + i * .25, 13.1 + i * .25)), t, i));
    const ck = seg(lt, 12, 15); craneRider(lerp(200, 1500, ck), 250 + Math.sin(ck * 5) * 20, 90, lt * 2.4, t);
    ctx.save(); ctx.globalAlpha = .35; ctx.translate(0, 1600); ctx.scale(1, -1); SUPERTREES.forEach(([x, top, s], i) => { if (lt > 12.5 + i * .25) glow(x, top, 90, '#C060D0', .3); }); ctx.restore();
    camEnd();
  } else {                                        // 65–68 the puddle moon, close: a drop breaks it into gold glints that stretch into lines (→ the Yellow River)
    const z = kf(lt, [[15, 2.6], [18, 7]], easeIn);
    camBegin(lerp(1070, 1080, seg(lt, 15, 16)), 1192, z);
    sgStreet(); sgLamps(() => 1, t);
    puddleMoon(t, { inside: () => ripples(1080, 1190, lt, [15.8, 16.2], 120, .3, '#FFFFFF', .6) });
    if (lt < 15.8) { const k = seg(lt, 15.2, 15.8); ctx.fillStyle = 'rgba(230,240,250,.85)'; ctx.beginPath(); ctx.ellipse(1080, lerp(1000, 1190, easeIn(k)), 3, 6, 0, 0, TAU); ctx.fill(); }
    camEnd();
    blend(ease(seg(lt, 16.9, 18)), () => { camBegin(960, 540, 1.27); mooncakeTop(960, 540, 300); camEnd(); });
  }
}

// ═════════ 镜5 包头 · 鹿城与黄河 (68–86) ═════════
// a sika deer, side view facing right; (x, y) = ground under the body; s = body length; head: 0 up .. 1 drinking; run = gait phase or null
function deer(x, y, s, o = {}) {
  const hd = o.head ?? 0, run = o.run, k = s / 100;
  ctx.save(); ctx.translate(x, y); ctx.scale((o.flip ? -1 : 1) * k, k); if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const body = o.col || '#A8663A', dark = mix(body, '#3A2418', .45), lw = 1 / k;
  const legs = [[-24, -56, 0], [-18, -56, .5], [24, -56, .25], [29, -56, .75]];
  const legP = ([hx, hy, off], far) => {
    let a1 = .05, a2 = 0;
    if (run !== undefined && run !== null) { const p = (run + off) * TAU; a1 = Math.sin(p) * .75; a2 = Math.max(0, -Math.cos(p)) * 1.1 * (hx < 0 ? -1 : 1); }
    const kx = hx + Math.sin(a1) * 28, ky = hy + Math.cos(a1) * 28, fx = kx + Math.sin(a1 + a2) * 28, fy = ky + Math.cos(a1 + a2) * 28;
    return [[hx, hy], [kx, ky], [fx, fy]];
  };
  legs.forEach((L, i) => { if (i % 2 === 1) { const P = legP(L); limb(P, 6, mix(dark, '#1A1A2A', .3)); } });
  wcAt('deer-body', UNIT(18), body, 0, -64, 18, { sx: 38 / 18, a: .16, spread: .12, edge: .4, mul: false });
  wcAt('deer-belly', UNIT(14), '#EED2A8', 2, -52, 7, { sx: 26 / 7, a: .14, spread: .2, mul: false, wet: true });
  wcAt('deer-rump', UNIT(10), '#F4E6D0', -34, -66, 8, { sx: .8, sy: 1.1, a: .16, mul: false });
  for (let i = 0; i < 9; i++) { ctx.fillStyle = 'rgba(250,240,220,.8)'; ctx.beginPath(); ctx.arc(-24 + i * 6, -72 + (i % 2) * 5 + Math.sin(i) * 2, 1.6, 0, TAU); ctx.fill(); }
  limb([[-37, -70], [-43, -64]], 4, dark);
  legs.forEach((L, i) => { if (i % 2 === 0) { const P = legP(L); limb(P, 6.5, dark); ctx.fillStyle = '#2A1A14'; ctx.beginPath(); ctx.arc(P[2][0], P[2][1], 3, 0, TAU); ctx.fill(); } });
  // neck and head: neck angle from up (-1.25) to drinking (+.95)
  const na = lerp(-1.25, .95, hd), sh = [28, -72], ne = [sh[0] + Math.cos(na) * 34, sh[1] + Math.sin(na) * 34];
  limb([sh, ne], 15, body); limb([[sh[0] + 2, sh[1] + 4], [ne[0] + 2, ne[1] + 3]], 5, '#EED2A8', .6);
  const ha = lerp(.25, 1.55, hd);
  ctx.save(); ctx.translate(ne[0], ne[1]); ctx.rotate(ha);
  wcAt('deer-head', UNIT(14), body, 8, 0, 7.5, { sx: 13 / 7.5, a: .16, spread: .12, edge: .4, mul: false });
  ctx.fillStyle = '#1E1410'; ctx.beginPath(); ctx.arc(20, 1, 2.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(6, -2.5, 1.6, 0, TAU); ctx.fill();
  ctx.save(); ctx.rotate(-ha); const ear = Math.sin((o.t || 0) * 3) * .1;
  ctx.restore();
  poly([[-2, -4], [-12, -12 + ear * 20], [-4, -8]], body, 1); poly([[0, -5], [-6, -15], [2, -8]], mix(body, '#FFFFFF', .2), 1);
  // antlers stay upright whatever the head does
  ctx.rotate(-ha - na * .15);
  const ant = (sx, sc) => { const c = mix('#D8C8A8', '#6A5040', .2); limb([[sx, -6], [sx - 6 * sc, -26], [sx - 2 * sc, -44], [sx + 6 * sc, -58]], 2.6, c); limb([[sx - 5 * sc, -22], [sx + 6 * sc, -30]], 2, c); limb([[sx - 3 * sc, -40], [sx - 14 * sc, -50]], 2, c); limb([[sx - 1 * sc, -48], [sx + 8 * sc, -48]], 1.8, c); };
  ant(-2, 1); ant(4, -.8);
  ctx.restore();
  // world position of the gap between the antlers (for the moon)
  const hx = x + (o.flip ? -1 : 1) * k * ne[0], hy = y + k * (ne[1] - 40);
  ctx.restore();
  return { antlers: [hx, hy], muzzle: [x + (o.flip ? -1 : 1) * k * (ne[0] + Math.cos(ha) * 22), y + k * (ne[1] + Math.sin(ha) * 22)] };
}
// a gradient sky down to the horizon, a gradient ground below it, a light wash of texture over both
function landL(key, x, y, w, h, skyCols, groundCols, hy) {
  layer(key, x, y, w, h, () => {
    const g = ctx.createLinearGradient(0, y, 0, hy); skyCols.forEach((c, i) => g.addColorStop(i / (skyCols.length - 1), c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, hy - y);
    for (let i = 0; i < 7; i++) { const cx = x + (i + .3) * w / 7 + hash(key, i) * 200, cy = y + (hy - y) * (.25 + hash(key, i, 1) * .4); ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .22); const r = 260 + hash(key, i, 2) * 220, gg = ctx.createRadialGradient(0, 0, 0, 0, 0, r); gg.addColorStop(0, rgba(mix(skyCols[skyCols.length - 1], '#FFFFFF', .35), .35)); gg.addColorStop(1, rgba(skyCols[skyCols.length - 1], 0)); ctx.fillStyle = gg; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
    // two soft ranges of distant hills
    for (const [k, dy, amp, c] of [[0, -46, 40, mix(skyCols[skyCols.length - 1], groundCols[0], .45)], [1, -14, 26, mix(skyCols[skyCols.length - 1], groundCols[0], .75)]]) {
      ctx.beginPath(); ctx.moveTo(x, hy + 10); for (let xx = x; xx <= x + w; xx += 40) ctx.lineTo(xx, hy + dy - amp * (.5 + .5 * Math.sin(xx * .0021 + k * 2 + hash(key, k) * 6)) * (.6 + .4 * Math.sin(xx * .0007 + k))); ctx.lineTo(x + w, hy + 10); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    }
    const g2 = ctx.createLinearGradient(0, hy, 0, y + h); groundCols.forEach((c, i) => g2.addColorStop(i / (groundCols.length - 1), c)); ctx.fillStyle = g2; ctx.fillRect(x, hy, w, y + h - hy);
    for (let i = 0; i < 40; i++) { const gx = x + hash(key, i) * w, gy = hy + 30 + Math.pow(hash(key, i, 1), 1.5) * (y + h - hy); wcStroke(key + 'gs' + i, [[gx, gy], [gx + 80 + (gy - hy) * .3, gy + 2]], 6 + (gy - hy) * .02, 2, mix(groundCols[1], '#000000', .12), { a: .05, wet: true }); }
  });
}
const BT_RIVER = [[-700, 600], [-100, 612], [500, 600], [1000, 640], [1350, 720], [1150, 820], [800, 900], [1000, 1040], [1800, 1130], [2700, 1080], [3400, 1000], [4000, 960]];
function btRiver() {
  layer('btriver', -700, -400, 4800, 1900, () => {
    { const g = ctx.createLinearGradient(0, -400, 0, 600); g.addColorStop(0, '#E0885A'); g.addColorStop(.55, '#F2B87E'); g.addColorStop(1, '#FBE2BC'); ctx.fillStyle = g; ctx.fillRect(-700, -400, 4800, 1000); }
    wcBands('btsky', -700, -400, 4800, 1000, ['#F0A070', '#F6C590', '#FAE0BC'], { a: .03 });
    wc('btmount', [[-700, 560], [-300, 470], [100, 510], [500, 440], [900, 500], [1400, 430], [1900, 490], [2500, 420], [3100, 480], [3700, 440], [4100, 520], [4100, 600], [-700, 600]], '#9A7A8A', { a: .08, spread: .2 });
    { const g = ctx.createLinearGradient(0, 560, 0, 1500); g.addColorStop(0, '#D8AE74'); g.addColorStop(1, '#A87A4A'); ctx.fillStyle = g; ctx.fillRect(-700, 560, 4800, 940); }
    wc('btmount2', [[-700, 600], [-300, 540], [200, 570], [700, 520], [1200, 575], [1800, 530], [2500, 570], [3200, 525], [4100, 560], [4100, 620], [-700, 620]], '#A07A7A', { a: .09, spread: .15 });
    wcBands('btplain', -700, 580, 4800, 920, ['#E0B880', '#C99A5A', '#B98A50'], { a: .03 });
    for (let i = 0; i < BT_RIVER.length - 1; i++) {
      const [a, b] = [BT_RIVER[i], BT_RIVER[i + 1]], w = y => lerp(12, 150, clamp((y - 600) / 520));
      wcStroke('btriv' + i, [a, b], w(a[1]), w(b[1]), '#F2D4A0', { a: .16, spread: .06, wet: true, mul: false, layers: 10 });
      wcStroke('btrivh' + i, [[a[0], a[1] - w(a[1]) * .1], [b[0], b[1] - w(b[1]) * .1]], w(a[1]) * .35, w(b[1]) * .35, '#FFF2D6', { a: .12, mul: false, wet: true, layers: 8 });
    }
    for (let i = 0; i < 14; i++) wcAt('btsh' + i, UNIT(10), '#8A6A4A', -500 + hash('bts', i) * 4400, 700 + hash('bts', i, 1) * 600, 40 + hash('bts', i, 2) * 60, { sy: .3, a: .07, wet: true });
  });
}
function riverPoint(k) {           // a point along the river, k 0..1
  const P = BT_RIVER, d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = d[d.length - 1] * clamp(k); let i = 1; while (i < P.length - 1 && d[i] < L) i++;
  const u = (L - d[i - 1]) / (d[i] - d[i - 1]); return [lerp(P[i - 1][0], P[i][0], u), lerp(P[i - 1][1], P[i][1], u)];
}
function reedClump(key, x, y, h, n, t, col = '#8A6A3A') {
  for (let i = 0; i < n; i++) {
    const dx = (hash(key, i) - .5) * 180, hh = h * (.6 + hash(key, i, 1) * .5), bend = Math.sin(t * 1.3 + i) * 10 + hash(key, i, 2) * 30 - 15;
    const top = [x + dx + bend, y - hh];
    limb([[x + dx, y], [x + dx + bend * .4, y - hh * .5], top], 3, rgba(col, .8));
    ctx.save(); ctx.translate(top[0], top[1]); ctx.rotate(bend * .01 - .2); ctx.fillStyle = rgba('#E8D2A8', .8); ctx.beginPath(); ctx.ellipse(0, -18, 7, 22, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
}
function flower(x, y, s, k, col) {
  if (k <= 0) return;
  const r = s * easeOut(clamp(k));
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; ctx.fillStyle = col; ctx.globalAlpha = .9; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .3, r * .45, r * .28, a, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1; ctx.fillStyle = '#F6D04A'; ctx.beginPath(); ctx.arc(x, y, r * .22, 0, TAU); ctx.fill();
}
function steelworks() {
  layer('btsteel', -400, -300, 2720, 1700, () => {
    wcBands('btss', -400, -300, 2720, 1100, ['#4E4A7A', '#8A6A8A', '#C98A7A', '#E8A878'], { a: .08 });
    wcRect('btsgr', -400, 780, 2720, 720, '#3E3448', { a: .12, wet: true });
    const sil = '#2A2438';
    for (const [x, h] of [[520, 360], [600, 400], [1320, 330], [1420, 380], [1500, 300]]) wcRect('btch' + x, x, 780 - h, 26, h, sil, { a: .15, spread: .02 });
    wc('btfur', [[860, 780], [1100, 780], [1080, 500], [1040, 440], [920, 440], [880, 500]], sil, { a: .15, spread: .02 });
    wcRect('btfurtop', 950, 360, 60, 90, sil, { a: .15, spread: .02 });
    for (const x of [300, 1700]) wc('btct' + x, [[x - 110, 780], [x + 110, 780], [x + 70, 640], [x + 90, 560], [x - 90, 560], [x - 70, 640]], '#342C44', { a: .14, spread: .02 });
    limb([[1000, 520], [1300, 600], [1600, 640]], 10, sil); limb([[700, 700], [880, 620]], 8, sil);
  });
}
function S5(lt, t) {
  if (lt < 3) {                                   // 68–71 the Yellow River bend at sunset; gold light slides along it (pan right)
    const cx = kf(lt, [[-.5, 800], [3, 1700]], easeIO);
    camBegin(cx, 600, 1);
    btRiver();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 12; j++) { const [x, y] = riverPoint(seg(lt, -.5, 3) * .9 + .05 - j * .012); glow(x, y, 90 - j * 5, '#FFD890', .28 - j * .02); }
    ctx.restore();
    wcGlow(1100, 380, 300, '#FFE0A0', .35);
    { const [x, y] = riverPoint(seg(lt, -.5, 3) * .9 + .05); craneRider(x + 60, y - 170, 110, lt * 2.3, t); }
    camEnd();
  } else if (lt < 6) {                            // 71–74 reeds on the bank; a deer steps out and drinks; rings spread
    camBegin(960, 540, 1);
    layer('btbank', -400, -300, 2720, 1700, () => {
      wcBands('btbs', -400, -300, 2720, 800, ['#EFA468', '#F4C08A', '#F7DCB4'], { a: .08 });
      wc('btbfar', [[-400, 470], [600, 450], [1400, 470], [2320, 455], [2320, 500], [-400, 500]], '#8A7A6A', { a: .1, spread: .1 });
      wcBands('btbw', -400, 490, 2720, 400, ['#E8B478', '#D9A060', '#C98E58'], { a: .08 });
      wc('btbshore', [[-400, 820], [500, 790], [1300, 800], [2320, 780], [2320, 1400], [-400, 1400]], '#9A7A4A', { a: .12, spread: .1 });
      for (let i = 0; i < 20; i++) wcStroke('btbwl' + i, [[hash('wl', i) * 2200 - 200, 540 + hash('wl', i, 1) * 240], [hash('wl', i) * 2200 - 80, 541 + hash('wl', i, 1) * 240]], 3, 2, '#FFF0D0', { a: .15, mul: false, layers: 4 });
    });
    const step = seg(lt, 3, 4.2), hd = ease(seg(lt, 4, 4.8)), x = lerp(640, 860, ease(step));
    ctx.save(); ctx.translate(0, 1580); ctx.scale(1, -1); ctx.globalAlpha = .25; deer(x, 790, 330, { head: hd, t, run: step > 0 && step < 1 ? lt * 1.6 : null }); ctx.restore();
    const d = deer(x, 790, 330, { head: hd, t, run: step > 0 && step < 1 ? lt * 1.6 : null });
    ripples(d.muzzle[0], 800, lt, [4.8, 5.4], 110, .25, '#FFF6E0', .6);
    crane(1330, 800, 70, .25, { fold: true });
    bunnyAt(hopPath(lt, [[3.3, 1330, 780], [3.9, 1210, 806], [4.5, 1120, 806]], 50), 50, t);
    reedClump('btr1', 180, 900, 360, 14, t); reedClump('btr2', 1700, 920, 420, 16, t); reedClump('btr3', 1150, 860, 240, 6, t, '#9A7A4A');
    camEnd();
  } else if (lt < 9) {                            // 74–77 the steelworks: the furnace opens like a second sunset, sparks drift up (slow pull back)
    const z = kf(lt, [[6, 1.25], [9, 1]], ease);
    camBegin(980, 560, z);
    steelworks();
    const g = ease(seg(lt, 6.4, 7.6));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(0, 400, 0, 800); gr.addColorStop(0, 'rgba(255,120,50,0)'); gr.addColorStop(1, `rgba(255,120,50,${.35 * g})`); ctx.fillStyle = gr; ctx.fillRect(-400, 400, 2720, 400);
    ctx.restore();
    glow(980, 480, 520 * g + 1, '#FF8A40', .55 * g); glow(980, 470, 160, '#FFE0A0', .6 * g);
    for (let i = 0; i < 70; i++) {
      const born = 6.6 + hash('sp', i) * 2.2, k = (lt - born) / 2.6; if (k <= 0 || k >= 1) continue;
      const x = 980 + (hash('sp', i, 1) - .5) * 200 + Math.sin(k * 6 + i) * 40 * k, y = 460 - k * (300 + hash('sp', i, 2) * 300);
      glow(x, y, 10, '#FFC060', .9 * (1 - k) * (.6 + .4 * Math.sin(lt * 20 + i)));
    }
    wc('btmound', [[200, 1100], [400, 930], [700, 900], [950, 1000], [1000, 1100]], '#2A2232', { a: .15, spread: .1 });
    bunny(640, 912, 80, t, { glow: .25 });
    camEnd();
  } else if (lt < 12) {                           // 77–80 the deer lifts its head; the moon rises between its antlers (tilt up)
    const cy = kf(lt, [[9, 700], [12, 400]], easeIO);
    camBegin(960, cy, 1);
    landL('btdusk', -400, -500, 2720, 1900, ['#2E3068', '#6A5A90', '#C8A0A8', '#EABA9C'], ['#5A4A58', '#3A3040'], 1060);
    wcRect('btdg', -400, 1060, 2720, 500, '#4A4050', { a: .12, wet: true });
    const hd = 1 - ease(seg(lt, 9.2, 10.4));
    const DX = 1250, DY = 1250, DS = 720, k = DS / 100, ax = DX - k * 40, ay = DY - k * 150;
    moonWC(ax, lerp(1250, ay, easeOut(seg(lt, 10, 12))), 64, { glow: .8 });
    const dd = deer(DX, DY, DS, { head: hd, flip: true, t, col: '#7A5040' });
    bunny(dd.antlers[0] + 6, dd.antlers[1] + 34, 92, t, { flip: true, glow: .25 });
    camEnd();
  } else if (lt < 15) {                           // 80–83 the deer runs across the grass; a flower opens in every hoofprint (pan right, following)
    const dx = lerp(200, 2600, seg(lt, 12, 15));
    camBegin(dx + 200, 560, 1);
    landL('btgr', -1000, -300, 4800, 1700, ['#5A5E98', '#9A8CBC', '#E0B8C0'], ['#7E9A64', '#4E6E4A'], 700);
    const gy = 900;
    for (let i = 0; ; i++) { const px = 260 + i * 110; if (px > dx - 20) break; const tb = 12 + (px - 200) / 2400 * 3; flower(px + (i % 2) * 30, gy + 20 + (i % 2) * 18, 16, seg(lt, tb + .15, tb + .6), ['#F6E0F0', '#FFF4D0', '#E8C8F0'][i % 3]); }
    deer(dx, gy, 300, { run: lt * 2.2, t });
    bunny(dx - 6, gy - 238 + Math.sin(lt * 2.2 * TAU * 2) * 4, 46, t);
    camEnd();
  } else {                                        // 83–86 the trail of flowers leads to a white yurt on the horizon (push in)
    const z = kf(lt, [[15, 1], [18, 1.5]], easeIn);
    camBegin(960, 560, z);
    landL('btgr2', -400, -300, 2720, 1700, ['#4A4E8A', '#8A80B0', '#D8B0BC'], ['#6E8A5A', '#3E5A40'], 610);
    for (let i = 0; i < 40; i++) { const u = i / 40, y = lerp(1100, 610, Math.pow(u, .5)), x = 960 + Math.sin(u * 7) * 300 * (1 - u); flower(x, y, lerp(22, 4, Math.pow(u, .5)), 1, ['#F6E0F0', '#FFF4D0', '#E8C8F0'][i % 3]); }
    yurt('btyurt', 960, 600, 80, t);
    { const u = seg(lt, 15, 18) * .75, x = 960 + Math.sin(u * 7) * 300 * (1 - u), y = lerp(1100, 610, Math.pow(u, .5)), sz = lerp(70, 16, Math.pow(u, .5)); bunny(x, y - Math.abs(Math.sin(lt * 2.6 * Math.PI)) * sz * .5, sz, t, { flip: Math.cos(u * 7) < 0 }); }
    camEnd();
  }
}
// a white yurt (ger): lattice wall, domed roof, patterned band, chimney
function yurt(key, x, y, s, t, o = {}) {
  wc(key + 'wall', [[x - s, y], [x + s, y], [x + s, y - s * .55], [x - s, y - s * .55]], '#F4F0E6', { a: .15, spread: .04, edge: .35, mul: false });
  wc(key + 'roof', [[x - s * 1.04, y - s * .55], ...arcPts(x, y - s * .55, s * 1.04, Math.PI, TAU, 12, s * .5)], '#FAF6EE', { a: .15, spread: .04, edge: .35, mul: false });
  wcRect(key + 'band', x - s, y - s * .5, s * 2, s * .1, '#3A5E9A', { a: .15, spread: .03 });
  wcRect(key + 'door', x - s * .14, y - s * .42, s * .28, s * .42, '#C0442E', { a: .16, spread: .03 });
  wcRect(key + 'pipe', x + s * .2, y - s * 1.2, s * .07, s * .2, '#5A5050', { a: .16, spread: .03 });
  if (o.lit) glow(x, y - s * .2, s * 1.2, '#FFC070', .3 * o.lit);
}
