// ═════════ 镜6 呼和浩特 · 草原蓝调 (86–104) ═════════
// a horse, side view facing right, silhouette; phase = gallop phase
function horse(x, y, s, phase, t, o = {}) {
  const k = s / 100, c = o.col || '#26284A';
  ctx.save(); ctx.translate(x, y); ctx.scale((o.flip ? -1 : 1) * k, k);
  const bob = Math.sin(phase * TAU * 2) * 2;
  ctx.translate(0, bob);
  const leg = (hx, off, back) => { const p = (phase + off) * TAU, a1 = Math.sin(p) * .7, a2 = (Math.cos(p) > 0 ? 1 : 0) * .9 * (back ? -1 : 1); const kx = hx + Math.sin(a1) * 26, ky = -52 + Math.cos(a1) * 26; limb([[hx, -56], [kx, ky], [kx + Math.sin(a1 + a2) * 26, ky + Math.cos(a1 + a2) * 26]], 6, c); };
  leg(-28, .1, true); leg(24, .6, false);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, -66, 40, 17, 0, 0, TAU); ctx.fill();
  limb([[28, -72], [48, -104]], 18, c);
  ctx.save(); ctx.translate(50, -106); ctx.rotate(.9); ctx.beginPath(); ctx.ellipse(10, 0, 16, 7, 0, 0, TAU); ctx.fill(); ctx.restore();
  poly([[44, -118], [40, -130], [50, -120]], c, 1);
  for (let i = 0; i < 6; i++) { const u = i / 5, px = lerp(46, 26, u), py = lerp(-116, -76, u), w = Math.sin(t * 9 + i) * 6; limb([[px, py], [px - 16 - w, py - 4 + w * .5]], 3, c, .9); }
  for (let i = 0; i < 4; i++) limb([[-38, -72], [-58 - i * 3, -70 + Math.sin(t * 8 + i) * 8 + i * 4], [-72 - i * 2, -60 + Math.sin(t * 8 + i + 1) * 10 + i * 5]], 3.5, c, .9);
  leg(-20, .35, true); leg(32, .85, false);
  ctx.restore();
}
function temple(sky = true) {
  if (sky) bandsL('hhsky', -400, -300, 2720, 1700, ['#1C2660', '#2E3A7A', '#4A5A98', '#7078AE'], .08);
  layer('hhtemple', -400, -300, 2720, 1700, () => {
    wcRect('hhwall', 380, 640, 1160, 500, '#8A2A2A', { a: .13, spread: .03 });
    for (let i = 0; i < 7; i++) wcRect('hhwin' + i, 460 + i * 150, 720, 70, 120, '#E8A050', { a: .1, spread: .05, mul: false });
    wcRect('hhbeam', 360, 610, 1200, 36, '#2E5A6A', { a: .14, spread: .03 });
    wc('hhroof', [[240, 640], [1680, 640], [1760, 600], [1600, 520], [1500, 400], [420, 400], [320, 520], [160, 600]], '#D9A441', { a: .14, spread: .03, edge: .45, mul: false });
    for (let x = 260; x < 1680; x += 26) limb([[lerp(440, 1480, (x - 260) / 1420), 404], [x, 634]], 3.5, 'rgba(150,100,30,.45)');
    wcStroke('hhridge', [[400, 398], [1520, 398]], 22, 22, '#C08A2A', { a: .16, mul: false });
    // the dharma wheel between two deer on the ridge
    wcAt('hhwheel', UNIT(18), '#F0C050', 960, 340, 44, { a: .16, mul: false, edge: .5 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; limb([[960, 340], [960 + Math.cos(a) * 40, 340 + Math.sin(a) * 40]], 3, 'rgba(160,110,30,.7)'); }
    for (const sd of [-1, 1]) { ctx.save(); ctx.translate(960 + sd * 80, 392); ctx.scale(-sd * .9, .9); ctx.fillStyle = '#E8B84A'; ctx.beginPath(); ctx.ellipse(0, -22, 20, 12, 0, 0, TAU); ctx.fill(); limb([[12, -28], [22, -50]], 7, '#E8B84A'); ctx.beginPath(); ctx.arc(26, -52, 7, 0, TAU); ctx.fill(); ctx.restore(); }
    for (const x of [470, 1450]) { wcRect('hhbanner' + x, x - 14, 300, 28, 100, '#E8B84A', { a: .15, mul: false }); wcAt('hhbt' + x, UNIT(10), '#E8B84A', x, 296, 18, { a: .16, mul: false }); }
  });
}
function prayerFlags(x0, y0, x1, y1, n, t, key) {
  limb([[x0, y0], [(x0 + x1) / 2, Math.max(y0, y1) + 40], [x1, y1]], 1.5, 'rgba(40,40,60,.7)');
  const cols = ['#3A6AC8', '#F4F0E6', '#C8322E', '#3A9A5A', '#F2C23A'];
  for (let i = 0; i < n; i++) {
    const u = (i + .5) / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * Math.PI) * 40, w = 36, h = 44, fl = Math.sin(t * 6 + i * .8) * 8;
    poly([[x - w / 2, y], [x + w / 2, y], [x + w / 2 + fl, y + h], [x - w / 2 + fl * .6, y + h]], cols[i % 5], .9);
  }
}
function skylight(glow0, t, o = {}) {
  const cx = 960, cy = 540, r0 = 200;
  // the night sky through the crown, the moon in it
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r0, 0, TAU); ctx.clip();
  bandsL('hhsl', 700, 280, 520, 520, ['#18204E', '#23306A', '#2E3C7A'], .1);
  stars('hhslst', 30, 760, 340, 400, 400, t);
  if (o.moon) o.moon();
  ctx.restore();
  // felt ceiling and the roof poles (乌尼)
  layer('hhfelt', -800, -800, 3520, 2680, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-800, -800, 3520, 2680); ctx.arc(cx, cy, r0 + 30, 0, TAU, true); ctx.clip();
    const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, 1500); g.addColorStop(0, '#5A4038'); g.addColorStop(1, '#241A1C'); ctx.fillStyle = g; ctx.fillRect(-800, -800, 3520, 2680);
    wcBands('hhfb', -800, -800, 3520, 2680, ['#6A4A40', '#7A5446', '#6A4A40'], { a: .04 });
    ctx.restore();
  });
  for (let i = 0; i < 56; i++) {
    const a = i / 56 * TAU, lit = o.lit ? o.lit(i, a) : 0, col = mix('#B0482E', '#F6CC60', lit);
    limb([[cx + Math.cos(a) * (r0 + 26), cy + Math.sin(a) * (r0 + 26)], [cx + Math.cos(a) * 1600, cy + Math.sin(a) * 1600]], 13, col, .95);
    if (lit > .05) glow(cx + Math.cos(a) * 360, cy + Math.sin(a) * 360, 60, '#FFC060', .2 * lit);
  }
  wcAt('hhring', UNIT(40), '#C8522E', cx, cy, r0 + 18, { a: 0, layers: 1, edge: 1, edgeW: 36, gran: 0 });
  limb(arcPts(cx, cy, r0 + 18, 0, TAU, 60), 30, '#B8482A');
  for (const s of [-1, 1]) { limb(arcPts(cx + s * r0 * 1.4, cy, r0 * 1.2, Math.PI * (s > 0 ? .78 : -.22), Math.PI * (s > 0 ? 1.22 : .22), 20), 10, '#B8482A'); limb(arcPts(cx, cy + s * r0 * 1.4, r0 * 1.2, Math.PI * (s > 0 ? 1.28 : .28), Math.PI * (s > 0 ? 1.72 : .72), 20), 10, '#B8482A'); }
  if (glow0) glow(cx, cy, 260, '#FFE6A0', glow0);
}
// a mooncake from above (painted once into a sprite), cut into five pieces that drift apart
function mooncakeTop(x, y, r, cuts = 0, spread = 0, a = 1) {
  const S = 700, c = spriteC('mctop', S, S, () => {
    const m = S / 2, R = 300;
    const P = []; for (let i = 0; i < 96; i++) { const an = i / 96 * TAU, rr = R * (1 + .045 * Math.cos(an * 16)); P.push([m + Math.cos(an) * rr, m + Math.sin(an) * rr]); }
    wc('mct-b', P, '#C98A48', { a: .16, spread: .02, edge: .5, mul: false });
    wcAt('mct-in', UNIT(40), '#DDA25A', m, m, R * .82, { a: .12, spread: .03, mul: false });
    ctx.strokeStyle = 'rgba(130,70,30,.55)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(m, m, R * .8, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(m, m, R * .66, 0, TAU); ctx.stroke();
    for (let i = 0; i < 32; i++) { const an = i / 32 * TAU; ctx.beginPath(); ctx.arc(m + Math.cos(an) * R * .73, m + Math.sin(an) * R * .73, 6, 0, TAU); ctx.stroke(); }
    for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; ctx.beginPath(); ctx.ellipse(m + Math.cos(an) * R * .3, m + Math.sin(an) * R * .3, R * .26, R * .1, an, 0, TAU); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(m, m, R * .1, 0, TAU); ctx.stroke();
    glow(m - R * .3, m - R * .35, R * .6, '#FFF0C8', .25);
  });
  const sc = r / 300;
  ctx.save(); ctx.globalAlpha *= a;
  if (spread <= 0 && cuts <= 0) { ctx.drawImage(c, x - S / 2 * sc, y - S / 2 * sc, S * sc, S * sc); ctx.restore(); return; }
  for (let i = 0; i < 5; i++) {
    const a0 = -Math.PI / 2 + i / 5 * TAU, a1 = a0 + TAU / 5, am = (a0 + a1) / 2, dx = Math.cos(am) * spread, dy = Math.sin(am) * spread;
    ctx.save(); ctx.translate(dx, dy); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * 1.2, a0, a1); ctx.closePath(); ctx.clip();
    ctx.drawImage(c, x - S / 2 * sc, y - S / 2 * sc, S * sc, S * sc); ctx.restore();
  }
  ctx.strokeStyle = 'rgba(90,50,20,.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const k = clamp(cuts * 5 - i); if (k <= 0 || spread > 0) continue; const an = -Math.PI / 2 + i / 5 * TAU; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * r * 1.05 * k, y + Math.sin(an) * r * 1.05 * k); ctx.stroke(); }
  ctx.restore();
}
function S6(lt, t) {
  if (lt < 3) {                                   // 86–89 a white yurt at blue hour; its smoke rises and curls into a cloud (tilt up)
    const cy = kf(lt, [[-.5, 640], [3, 240]], easeIO);
    camBegin(960, cy, 1);
    bandsL('hhblue', -400, -700, 2720, 1500, ['#1E2A66', '#34448A', '#5A68A8', '#8E92C0'], .08);
    stars('hhst', 70, -400, -700, 2720, 900, t);
    bandsL('hhgrass', -400, 760, 2720, 700, ['#2E4A5A', '#2A4050', '#223440'], .09);
    yurt('hhyurt', 960, 840, 240, t, { lit: 1 });
    glow(960, 800, 60, '#FFB060', .6);
    bunny(1070, 846, 56, t, { flip: true, glow: .25 });
    for (let i = 0; i < 26; i++) {
      const born = -1 + i * .16, k = (lt - born) / 3.2; if (k <= 0 || k >= 1) continue;
      const x = 1015 + Math.sin(k * 5 + i * .3) * 50 * k + k * 160, y = 548 - k * 720, r = 20 + k * 90;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(220,226,240,${.28 * (1 - k * .6)})`); g.addColorStop(1, 'rgba(220,226,240,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    cloudWC('hhcloud', 1160, -120, 260, '#D8DCEE', seg(lt, 1.4, 3) * .9);
    camEnd();
  } else if (lt < 6) {                            // 89–92 horses cross the ridge, manes flying (pan left)
    const cx = kf(lt, [[3, 1700], [6, 700]], easeIO);
    camBegin(cx, 540, 1);
    bandsL('hhridge-s', -600, -300, 3600, 1300, ['#2A3A7A', '#4E5E9E', '#8A8EC0', '#C0B0D0'], .08);
    layer('hhridge-g', -600, 500, 3600, 1000, () => { wc('hhrl', [[-600, 760], [0, 700], [700, 650], [1300, 690], [2000, 640], [3000, 720], [3000, 1500], [-600, 1500]], '#2A3050', { a: .14, spread: .1 }); });
    for (let i = 0; i < 5; i++) { const x = lerp(2500, 300, seg(lt, 3 + i * .08, 6.4)) + i * 150 - (i % 2) * 40, y = 700 - Math.sin(x / 700) * 30 + (i % 2) * 14; horse(x, y, 150 + (i % 2) * 20, lt * 2.2 + i * .23, t, { flip: true }); if (!i) bunny(x + 4, y - 122 + Math.sin((lt * 2.2) * TAU * 2) * 3, 40, t, { flip: true, glow: .3 }); }
    camEnd();
  } else if (lt < 9) {                            // 92–95 大召寺: prayer flags lift in the wind, the moon rises behind the golden roof
    camBegin(960, 540, 1);
    bandsL('hhsky', -400, -300, 2720, 1700, ['#1C2660', '#2E3A7A', '#4A5A98', '#7078AE'], .08);
    moonWC(1260, lerp(640, 180, easeOut(seg(lt, 6.2, 9))), 90, { glow: .9 });
    temple(false);
    prayerFlags(470, 300, -200, 700, 11, t, 'pf1'); prayerFlags(1450, 300, 2120, 720, 11, t + 1, 'pf2');
    bunny(1000, 400, 40, t, { glow: .25 });
    camEnd();
  } else if (lt < 18) {                           // 95–98 inside the yurt: the moon slides into the skylight; 98–101 the poles light like clock hands; 101–104 the ring becomes a mooncake
    const z = lt < 12 ? 1 : lt < 15 ? kf(lt, [[12, 1], [15, 1.12]], ease) : kf(lt, [[15, 1.12], [18, 1.75]], easeIn);
    camBegin(960, 540, z);
    const mx = lerp(1300, 960, easeOut(seg(lt, 9.2, 11.8)));
    skylight(lt > 11.8 ? .15 * seg(lt, 11.8, 12.5) : 0, t, { moon: () => moonWC(mx, 540, 120, { glow: .6 }), lit: (i, a) => { const hand = ((a + Math.PI / 2) / TAU + 1) % 1; return seg(lt, 12 + hand * 2.8, 12.3 + hand * 2.8); } });
    bunny(960, 752, 60, t, { glow: .25 });
    camEnd();
    fillScreen('#E0502E', .55 * easeIn(seg(lt, 16.6, 18)));
  }
}

// ═════════ 镜7 从前慢 (104–128) ═════════
const SCROLL_W = 7600;
function scrollLayer() {
  layer('scroll', -400, -200, SCROLL_W + 800, 1480, () => {
    const skyCols = [['#F6E2C0', '#F8ECD8'], ['#F2D0A8', '#F6E2C8'], ['#EFC09A', '#F4D8B8'], ['#D8B8C8', '#EED6D0'], ['#B8B0D0', '#E0D4DC']];
    for (let i = 0; i < 16; i++) { const u = i / 15, c = skyCols[Math.min(4, Math.floor(u * 5))]; wcBands('scs' + i, -400 + i * (SCROLL_W + 800) / 16 - 200, -200, (SCROLL_W + 800) / 16 + 400, 900, c, { a: .05 }); }
    wcRect('scground', -400, 780, SCROLL_W + 800, 500, '#C8B890', { a: .08, wet: true });
    // Singapore: palms, shophouses, the Sands
    for (let i = 0; i < 6; i++) { const x = 60 + i * 220, h = 300 + hash('palm', i) * 120; wcStroke('scpt' + i, [[x, 800], [x + 20, 800 - h * .5], [x + 10, 800 - h]], 12, 7, '#7A6040', { a: .14 }); for (let j = 0; j < 7; j++) { const a = -Math.PI / 2 + (j - 3) * .45; wcStroke('scpf' + i + ':' + j, [[x + 10, 800 - h], [x + 10 + Math.cos(a) * 60, 800 - h + Math.sin(a) * 30 + 10], [x + 10 + Math.cos(a) * 110, 800 - h + 50]], 10, 2, '#4A8A5A', { a: .13 }); } }
    for (let i = 0; i < 5; i++) { wcRect('scsh' + i, 280 + i * 120, 640, 116, 160, SG_COL[i], { a: .14, spread: .04, mul: false }); for (let j = 0; j < 2; j++) wcRect('scshw' + i + j, 300 + i * 120 + j * 44, 670, 24, 50, '#5A7A8A', { a: .14 }); }
    for (let i = 0; i < 3; i++) wc('scmbs' + i, [[1180 + i * 60, 800], [1220 + i * 60, 800], [1216 + i * 60, 560], [1184 + i * 60, 560]], '#8A8AA8', { a: .12, spread: .03 }); wc('scmbsb', [[1160, 556], [1360, 548], [1380, 540], [1170, 546]], '#8A8AA8', { a: .14 });
    // Xi'an: the wall with lanterns, the pagoda
    wcRect('scxw', 1600, 660, 1300, 140, '#8A7068', { a: .12, spread: .03 }); for (let x = 1600; x < 2900; x += 44) wcRect('scxm' + x, x, 636, 28, 28, '#8A7068', { a: .12 });
    for (let i = 0; i < 12; i++) lanternWC(1660 + i * 105, 700, 16, 1, 0, 'scxl' + i);
    { let y = 640; for (let i = 0; i < 7; i++) { const w = 150 - i * 15, h = 48 - i * 3; wcRect('scpg' + i, 2440 - w / 2, y - h, w, h, '#A07A60', { a: .13, spread: .03 }); wcRect('scpgc' + i, 2440 - w / 2 - 8, y - h - 6, w + 16, 7, '#5A4040', { a: .15 }); y -= h + 6; } wc('scpgr', [[2400, y], [2480, y], [2440, y - 40]], '#5A4040', { a: .15 }); }
    // the Yellow River and its iron bridge
    wc('scriver', [[2900, 810], [3300, 790], [3700, 800], [4100, 790], [4400, 810], [4400, 1100], [2900, 1100]], '#C9A060', { a: .12, spread: .1, wet: true });
    for (let i = 0; i < 8; i++) wcStroke('scrl' + i, [[3000 + i * 170, 900 + (i % 3) * 40], [3080 + i * 170, 902 + (i % 3) * 40]], 3, 2, '#FFF0C0', { a: .2, mul: false, layers: 4 });
    // grassland: yurts, a temple roof
    wcRect('scgrass', 4400, 760, 1400, 140, '#8AA070', { a: .1, wet: true });
    for (let i = 0; i < 4; i++) yurt('scy' + i, 4550 + i * 260, 800, 44 + (i % 2) * 10, 0);
    wc('sctemple', [[5480, 740], [5760, 740], [5740, 700], [5500, 700]], '#D9A441', { a: .15, mul: false }); wcRect('sctw', 5500, 740, 240, 60, '#8A2A2A', { a: .13 });
    // Beijing: grey roofs, the white dagoba, the station
    for (let i = 0; i < 9; i++) { const x = 5850 + i * 160; wcRect('scbw' + i, x, 720, 140, 80, '#B0AEB0', { a: .1 }); wc('scbr' + i, [[x - 8, 724], [x + 148, 724], [x + 130, 690], [x + 10, 690]], '#7A7E8A', { a: .13 }); }
    whiteDagoba('scdag', 6250, 700, 220, '#F4F0EC');
    wcRect('scstation', 6900, 700, 420, 100, '#B8A488', { a: .12, spread: .03 }); wc('scstr', [[6880, 704], [7340, 704], [7300, 670], [6920, 670]], '#6A4A3A', { a: .15 });
    wcRect('scplat', 6700, 800, 800, 22, '#A89880', { a: .14 });
    // the track across the whole scroll
    wcRect('sctrackbed', -400, 822, SCROLL_W + 800, 18, '#8A7A68', { a: .14, spread: .02 });
    limb([[-400, 824], [SCROLL_W + 400, 824]], 3, 'rgba(60,50,50,.8)');
    ctx.strokeStyle = 'rgba(80,60,50,.5)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = -400; x < SCROLL_W + 400; x += 22) { ctx.moveTo(x, 826); ctx.lineTo(x - 4, 840); } ctx.stroke();
    // the bridge trusses (drawn over the track)
    ctx.strokeStyle = 'rgba(60,60,80,.75)'; ctx.lineWidth = 5; ctx.beginPath();
    for (let x = 3400; x < 3900; x += 100) { ctx.moveTo(x, 824); ctx.lineTo(x + 50, 740); ctx.lineTo(x + 100, 824); }
    ctx.moveTo(3400, 740); ctx.lineTo(3900, 740); ctx.stroke();
    for (let x = 3400; x <= 3900; x += 100) limb([[x, 830], [x, 1000]], 10, 'rgba(70,60,70,.6)');
  });
}
function greenTrain(x, y, t, d) {                  // x = front of the train, y = rail; d = distance run (wheels)
  const cars = 5, L = 210;
  for (let i = 0; i < cars; i++) {
    const x1 = x - i * (L + 8), x0 = x1 - L;
    ctx.fillStyle = '#2E5A40'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y - 78, L, 66, 10) : ctx.rect(x0, y - 78, L, 66); ctx.fill();
    ctx.fillStyle = '#E8C860'; ctx.fillRect(x0, y - 26, L, 5);
    ctx.fillStyle = '#23463A'; ctx.fillRect(x0 + 4, y - 84, L - 8, 8);
    for (let j = 0; j < (i ? 7 : 3); j++) { ctx.fillStyle = 'rgba(255,220,140,.9)'; ctx.fillRect(x0 + 14 + j * 27 + (i ? 0 : 90), y - 66, 18, 22); }
    for (const wx of [x0 + 30, x0 + 58, x1 - 58, x1 - 30]) { ctx.fillStyle = '#20202A'; ctx.beginPath(); ctx.arc(wx, y - 6, 9, 0, TAU); ctx.fill(); ctx.strokeStyle = '#8A8A90'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(wx, y - 6); ctx.lineTo(wx + Math.cos(d / 9) * 8, y - 6 + Math.sin(d / 9) * 8); ctx.stroke(); }
  }
  glow(x - 4, y - 50, 60, '#FFE6A0', .5);
}
function postBox(x, y) {
  wcRect('pbbody', x - 70, y - 300, 140, 300, '#1E6A40', { a: .16, spread: .02, edge: .45, mul: false });
  wcAt('pbcap', UNIT(20), '#1A5A38', x, y - 300, 84, { sy: .35, a: .16, mul: false });
  ctx.fillStyle = '#0E2418'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 44, y - 252, 88, 12, 5) : ctx.rect(x - 44, y - 252, 88, 12); ctx.fill();
  wcAt('pbmark', UNIT(12), '#E8C040', x, y - 170, 22, { a: .16, mul: false });
  ctx.fillStyle = '#153A28'; ctx.fillRect(x - 78, y - 14, 156, 14);
  glow(x - 40, y - 240, 60, '#FFFFFF', .08);
}
const LETTER_FROM = [[200, 300, '#E8762A'], [1720, 360, '#C8322E'], [420, 120, '#7CC3A2'], [1500, 130, '#D9A25A'], [960, 60, '#4A6FB0']];
function postScene(skyK, t, lt) {
  const day = ['#8CB4E4', '#B4CEEC', '#DCE8F2'], night = ['#161C44', '#232A5E', '#3A4078'];
  bandsL('pbday', -400, -300, 2720, 1100, day, .08);
  if (skyK > 0) { ctx.save(); ctx.globalAlpha = skyK; bandsL('pbnight', -400, -300, 2720, 1100, night, .09); stars('pbst', 60, -200, -200, 2300, 700, t); ctx.restore(); }
  if (skyK >= 0 && lt !== undefined && lt > 15) {
    const p = (lt - 15), a = (p % 1) * Math.PI, sunUp = Math.floor(p) % 2 === 0;
    const bx = 960 - Math.cos(a) * 1100, by = 600 - Math.sin(a) * 520;
    if (sunUp) { glow(bx, by, 200, '#FFD890', .6); wcAt('pbsun', UNIT(16), '#F6B040', bx, by, 60, { a: .16, mul: false }); }
    else moonWC(bx, by, 56, { glow: .7 });
  }
  layer('pbwall', -400, 300, 2720, 1200, () => {
    { const g = ctx.createLinearGradient(0, 380, 0, 980); g.addColorStop(0, '#CFC8C0'); g.addColorStop(1, '#B8B0A8'); ctx.fillStyle = g; ctx.fillRect(-400, 380, 2720, 600); }
    wcRect('pbw', -400, 380, 2720, 600, '#B4AEA8', { a: .025, spread: .04 });
    ctx.fillStyle = '#5A5E6C'; ctx.fillRect(-400, 350, 2720, 44); for (let x = -400; x < 2320; x += 26) limb([[x, 354], [x + 3, 392]], 5, 'rgba(40,44,56,.4)');
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; for (let y = 410, r = 0; y < 980; y += 26, r++) { ctx.strokeStyle = 'rgba(120,112,108,.24)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); for (let x = -400 + (r % 2) * 28; x < 2320; x += 56) { ctx.moveTo(x, y); ctx.lineTo(x, y + 26); } ctx.stroke(); } ctx.restore();
    // an osmanthus branch leaning over the wall, in flower
    wcStroke('pbbr', [[1900, 300], [1560, 390], [1300, 430], [1100, 500]], 30, 8, '#4A3A34', { a: .15 });
    wcStroke('pbbr2', [[1460, 410], [1360, 330], [1250, 310]], 14, 5, '#4A3A34', { a: .15 });
    for (let i = 0; i < 46; i++) { const u = hash('iv', i), x = lerp(1100, 1800, u), y = lerp(500, 330, u) + (hash('iv', i, 1) - .5) * 130; wcAt('pbivy' + i, UNIT(8), i % 2 ? '#3D7A62' : '#4F8C6C', x, y, 26, { sy: .45, rot: hash('iv', i, 2) * 3, a: .13 }); }
    for (let i = 0; i < 60; i++) floret(lerp(1100, 1800, hash('pf', i)), lerp(500, 330, hash('pf', i)) + (hash('pf', i, 1) - .5) * 120, 6, i, .95);
    { const g = ctx.createLinearGradient(0, 960, 0, 1500); g.addColorStop(0, '#CFC4B2'); g.addColorStop(1, '#B8AC98'); ctx.fillStyle = g; ctx.fillRect(-400, 960, 2720, 540); }
  });
  if (skyK > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#3A4288', .55 * skyK); ctx.fillRect(-400, 300, 2720, 1200); ctx.restore(); }
  postBox(960, 970);
}
function brassLock(k, turn, t) {                   // k: shackle open 0..1, turn: key rotation 0..1
  layer('lockdoor', -400, -300, 2720, 1700, () => {
    wcRect('ldoor', -400, -300, 2720, 1700, '#A8302A', { a: .12, spread: .02 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = 'rgba(110,30,30,.18)'; ctx.lineWidth = 2; for (let i = 0; i < 90; i++) { const x = hash('grain', i) * 2720 - 400; ctx.beginPath(); ctx.moveTo(x, -300); ctx.bezierCurveTo(x + 20, 200, x - 20, 800, x + 10, 1400); ctx.stroke(); } ctx.restore();
    limb([[960, -300], [960, 1400]], 5, 'rgba(60,16,16,.7)');
    for (const s of [-1, 1]) { wcAt('lplate' + s, UNIT(20), '#B58436', 960 + s * 160, 420, 70, { a: .15, mul: false, edge: .45 }); limb(arcPts(960 + s * 160, 500, 58, 0, TAU, 30), 12, '#A57A34'); }
  });
  // the hasp and the lock body (广锁): a long bar with flared ends
  limb([[900, 420], [1020, 420]], 14, '#8A6A2A');
  const sy = -k * 40;
  ctx.save(); ctx.translate(0, sy);
  limb([[900, 420], [900, 520]], 12, '#9A7A30'); limb([[1020, 420], [1020, 470]], 12, '#9A7A30');
  ctx.restore();
  wc('lbody', [[860, 520], [1180, 520], [1220, 500], [1240, 540], [1220, 580], [1180, 560], [860, 560], [820, 580], [800, 540], [820, 500]], '#C9953E', { a: .16, spread: .02, edge: .5, mul: false });
  for (let i = 0; i < 5; i++) limb([[880 + i * 70, 526], [880 + i * 70, 554]], 3, 'rgba(120,80,20,.5)');
  glow(900, 520, 80, '#FFF0C0', .2);
  wcAt('lhole', UNIT(10), '#2A1A10', 1238, 540, 9, { sy: 1.8, a: .2 });
  // the key: slides into the end of the lock, then turns
  const ki = seg(t, 0, 1);
  ctx.save(); ctx.translate(1238 + lerp(260, 0, ease(ki)), 540); ctx.rotate(turn * Math.PI / 2); ctx.scale(1, lerp(1, .25, turn));
  limb([[0, 0], [150, 0]], 10, '#B08A3A'); ctx.strokeStyle = '#B08A3A'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(190, 0, 38, 0, TAU); ctx.stroke(); limb([[20, 0], [20, 18], [40, 18]], 7, '#B08A3A');
  ctx.restore();
}
function S7(lt, t) {
  if (lt < 3) {                                   // 104–107 a mooncake on paper, cut into five pieces
    camBegin(960, 540, 1.75 * 218 / 300 * 1.0);
    const cuts = seg(lt, .3, 2.2), sp = ease(seg(lt, 2.2, 3)) * 16;
    mooncakeTop(960, 540, 300, cuts, sp);
    bunny(1330, 700, 70, t, { flip: true });
    if (cuts > 0 && cuts < 1) { const i = Math.floor(cuts * 5), k = cuts * 5 - i, an = -Math.PI / 2 + i / 5 * TAU; ctx.save(); ctx.translate(960 + Math.cos(an) * 320 * k, 540 + Math.sin(an) * 320 * k); ctx.rotate(an); poly([[-10, -8], [150, -4], [150, 4], [-10, 8]], '#9AA0B0', .9, 'rgba(60,60,70,.6)', 1.5); limb([[150, 0], [240, 0]], 22, '#6A4A3A'); ctx.restore(); }
    camEnd();
  } else if (lt < 12) {                           // 107–116 a slow green train crosses a long painted scroll of the five cities (pan right, following)
    const k = seg(lt, 3, 12), cx = lerp(960, SCROLL_W - 780, easeIO(k) * .15 + k * .85 - (lt > 11 ? 0 : 0));
    const cam = Math.min(cx, SCROLL_W - 780);
    camBegin(cam, 540, 1);
    scrollLayer();
    const tx = lt < 11.2 ? cam + 380 : lerp(cam + 380, 7280, ease(seg(lt, 11.2, 12)));
    greenTrain(Math.min(tx, 7280), 824, t, tx);
    bunny(Math.min(tx, 7280) - 70, 740, 34, t, { glow: .2 });
    // birds startled off the river as the train crosses the bridge
    for (let i = 0; i < 14; i++) { const b = seg(lt, 6.6 + hash('bb', i) * .6, 9); if (b <= 0 || b >= 1) continue; const x = 3500 + hash('bb', i, 1) * 400 + b * 300, y = 900 - b * (300 + hash('bb', i, 2) * 300); pigeon(x, y, 22, lt * 4 + i * .3, { col: '#4A4A5A' }); }
    const lamp = seg(lt, 11.3, 11.6);
    limb([[6860, 800], [6860, 660]], 5, '#3A3A40'); if (lamp > 0) glow(6860, 650, 90, '#FFD890', .6 * lamp); ctx.fillStyle = lamp > 0 ? '#FFE8B0' : '#5A5A60'; ctx.beginPath(); ctx.arc(6860, 652, 9, 0, TAU); ctx.fill();
    camEnd();
  } else if (lt < 18) {                           // 116–119 five letters fly into one post box; 119–122 sun and moon race across the sky
    camBegin(960, 600, 1.35);
    const cyc = lt > 15 ? (1 - Math.cos((lt - 15) * Math.PI)) / 2 : 0;
    postScene(cyc, t, lt);
    const look = lt > 15 ? hop(lt, 15.5 + Math.floor(lt - 15) , 15.8 + Math.floor(lt - 15), Math.floor(lt - 15) % 2 ? 16 : 0).dy : 0;
    bunny(960, 648 + look, 52, t, { flip: lt > 15 && ((lt - 15) % 1) > .5 });
    if (lt < 15) LETTER_FROM.forEach(([x0, y0, c], i) => {
      const k = seg(lt, 12.1 + i * .48, 13.5 + i * .48); if (k <= 0 || k >= 1) return;
      const [x, y] = arcPt([x0, y0], [960, 720], lerp(200, -100, i / 4), easeIO(k));
      letter(x, y, lerp(110, 50, easeIn(k)), { rot: (1 - k) * (i - 2) * .4, stamp: c, sy: .7 });
    });
    camEnd();
  } else if (lt < 21) {                           // 122–125 an old brass lock on the red door: the key turns, the shackle springs open (slow push)
    const z = kf(lt, [[18, 1], [21, 1.1]], ease);
    camBegin(1020, 520, z);
    const turn = ease(seg(lt, 19.3, 20)), op = backOut(seg(lt, 20, 20.4));
    brassLock(op, turn, lt - 18);
    bunny(1010, 522, 54, t);
    camEnd();
  } else {                                        // 125–128 moonlight pours out of the keyhole and fills the frame (push)
    const z = kf(lt, [[21, 1.1], [24, 6]], easeIn);
    camBegin(lerp(1020, 1238, seg(lt, 21, 22.5)), 540, z);
    brassLock(1, 1, 3);
    bunny(1150, 522, 54, t, { alpha: 1 - seg(lt, 21.3, 22) });
    const g = seg(lt, 21.6, 24);
    glow(1238, 540, 60 + 400 * g, '#FFE6A0', .7 * g);
    camEnd();
    fillScreen('#F6DE9E', ease(seg(lt, 22.8, 24)));
  }
}

// ═════════ 镜8 向阳门第·夜 (128–152) ═════════
const nightSky = () => bandsL('night', -400, -600, 2720, 1500, ['#141A44', '#1E2658', '#2E3670', '#44487C'], .08);
function gateNight(lt, t, o = {}) {
  nightSky(); stars('gnst', 90, -400, -600, 2720, 800, t);
  moonWC(420, 150, 64, { glow: .8 });
  gateLayer(); gateDoors(o.open || 0, o.light || 0);
  plaqueChars('pl', 1, { glow: false });
  nightGlaze(.55);
  if (o.open) { glow(960, 760, 460, '#FFC070', .5 * (o.light || 0)); wcAt('gspill', [[-1, 0], [1, 0], [2.2, 1], [-2.2, 1]], '#FFD090', 960, 905, 250, { a: .1 * (o.light || 0), mul: false, wet: true }); }
  for (const [x, i] of [[560, 0], [1360, 1]]) { limb([[x, 360], [x, 400]], 2, 'rgba(20,20,30,.7)'); lanternWC(x, 450, 44, 1, Math.sin(t * 1.2 + i) * .05, 'gnl' + i); }
  wcGlow(PLAQUE.x + PLAQUE.w / 2, PLAQUE.cy, 300, '#FFD27A', .12);
}
function porcelainCup(key, x, y, r, tea = 1) {
  wcAt(key + 'sh', UNIT(18), '#1A1420', x + r * .1, y + r * .95, r * 1.05, { sy: .16, a: .1, wet: true });
  wc(key + 'c', [...arcPts(x, y, r, 0, Math.PI, 16, r * .95), [x - r, y]], '#F4F0E8', { a: .2, spread: .05, edge: .5, mul: false });
  wc(key + 'band', [...arcPts(x, y + r * .35, r * .93, .15, Math.PI - .15, 12, r * .5), ...arcPts(x, y + r * .22, r * .96, Math.PI - .12, .12, 12, r * .5)], '#3F63A8', { a: .14, spread: .05, mul: false });
  wcAt(key + 'sd', UNIT(14), '#9A9AB0', x + r * .5, y + r * .5, r * .4, { sy: 1.1, a: .06, wet: true });
  wcAt(key + 'rim', UNIT(24), '#E8E2D6', x, y, r, { sy: .22, a: .2, spread: .03, edge: .5, mul: false });
  if (tea > 0) wcAt(key + 'tea', UNIT(20), '#B8822E', x, y + r * .02, r * .86, { sy: .19, a: .18 * tea, spread: .03, mul: false });
}
const RIDGE_CRANES = [720, 840, 960, 1080, 1200];
function yardLayer() {
  bandsL('yards', -400, -300, 3000, 800, ['#141A44', '#1E2658', '#2E3670']);
  layer('yard', -400, -300, 3000, 1700, () => {
    const g = ctx.createLinearGradient(0, 420, 0, 840); g.addColorStop(0, '#4A4C6E'); g.addColorStop(1, '#3A3A5A'); ctx.fillStyle = g; ctx.fillRect(-400, 420, 3000, 420);
    wcRect('yardwall', -400, 420, 3000, 420, '#5A5A7A', { a: .04, spread: .03 });
    ctx.fillStyle = '#20243A'; ctx.fillRect(-400, 392, 3000, 40);
    const g2 = ctx.createRadialGradient(1500, 660, 20, 1500, 660, 170); g2.addColorStop(0, '#F2C07A'); g2.addColorStop(1, '#8A6A60'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(1500, 660, 160, 0, TAU); ctx.fill();
    wcAt('yardmgr', UNIT(30), '#2A2A40', 1500, 660, 166, { a: 0, layers: 1, edge: .9, edgeW: 14, gran: 0 });
    const g3 = ctx.createLinearGradient(0, 820, 0, 1400); g3.addColorStop(0, '#4A4666'); g3.addColorStop(1, '#2A2A44'); ctx.fillStyle = g3; ctx.fillRect(-400, 820, 3000, 900);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = 'rgba(40,40,70,.25)'; ctx.lineWidth = 2; for (let y = 860; y < 1400; y += 50) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2600, y); ctx.stroke(); } ctx.restore();
  });
}
function S8(lt, t) {
  if (lt < 3) {                                   // 128–131 the gate at night, framed as at dawn; moonlight moves across the plaque, the gold glints
    camBegin(960, 540, 1);
    gateNight(lt, t);
    const bx = lerp(200, 1800, seg(lt, .2, 2.8));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(bx - 160, 0, bx + 160, 0); g.addColorStop(0, 'rgba(200,210,255,0)'); g.addColorStop(.5, 'rgba(200,210,255,.18)'); g.addColorStop(1, 'rgba(200,210,255,0)'); ctx.fillStyle = g; ctx.fillRect(bx - 160, PLAQUE.y - 20, 320, PLAQUE.h + 40); ctx.restore();
    PLAQUE.chars.forEach(([ch, x]) => { const d = Math.abs(bx - x); if (d < 120) glow(x, PLAQUE.cy, 70, '#FFE6A0', .35 * (1 - d / 120)); });
    bunny(1070, 912, 42, t, { flip: true, glow: .3 });
    camEnd();
  } else if (lt < 6) {                            // 131–134 five paper cranes glide down and settle on the eave one by one
    camBegin(960, 300, 1.5);
    gateNight(lt, t);
    RIDGE_CRANES.forEach((x, i) => {
      const k = ease(seg(lt, 3.2 + i * .5, 4.3 + i * .5)), from = [x + (i - 2) * 500, -300 - (i % 2) * 120];
      const [cx, cy] = arcPt(from, [x, 182], -80, k);
      if (k > 0) crane(cx, cy, 60, k < 1 ? lt * 2.4 + i : .25, { fold: k >= 1, flip: from[0] > x, rot: (1 - k) * .2 });
    });
    camEnd();
  } else if (lt < 9) {                            // 134–137 the doors swing inward; warm light spills down the steps (slow push)
    const z = kf(lt, [[6, 1], [9, 1.2]], ease);
    camBegin(960, 620, z);
    const op = ease(seg(lt, 6.3, 8.5));
    gateNight(lt, t, { open: op, light: seg(lt, 6.5, 8) });
    RIDGE_CRANES.forEach(x => crane(x, 182, 60, .25, { fold: true }));
    const rp = hopPath(lt, [[7.6, 1070, 912], [8.1, 1010, 898], [8.6, 962, 886]], 30), ra = 1 - seg(lt, 8.6, 9);
    bunnyAt(rp, lerp(42, 34, seg(lt, 7.6, 8.6)), t, { alpha: ra, glow: .3 * ra });
    camEnd();
  } else if (lt < 12) {                           // 137–140 the courtyard: osmanthus, a round table, a cut mooncake, tea; the lanterns in the tree light up (pan right)
    const cx = kf(lt, [[9, 700], [12, 1250]], easeIO);
    camBegin(cx, 540, 1);
    yardLayer();
    stars('yst', 40, -400, -300, 3000, 500, t);
    moonWC(1500, 120, 60, { glow: .7 });
    osmanthusWC('ytree', 520, 980, 820, t, 1);
    const LAN = [[260, 330], [470, 250], [700, 300], [880, 380], [380, 470]];
    LAN.forEach(([x, y], i) => { limb([[x, y - 60], [x, y - 36]], 2, 'rgba(30,20,20,.7)'); lanternWC(x, y, 34, seg(lt, 9.4 + i * .35, 9.7 + i * .35), Math.sin(t * 1.3 + i) * .05, 'yl' + i); });
    wcRect('ytleg', 1190, 860, 120, 170, '#6A5A58', { a: .16, mul: false });
    wcAt('ytable', UNIT(26), '#A89488', 1250, 860, 300, { sy: .22, a: .18, mul: false, edge: .4 });
    for (const sx of [900, 1600]) { wcAt('ystool' + sx, UNIT(16), '#7A6A64', sx, 960, 60, { sy: .3, a: .14, mul: false }); wcRect('ystl' + sx, sx - 36, 960, 72, 70, '#5A4A48', { a: .14 }); }
    ctx.save(); ctx.translate(1250, 842); ctx.scale(1, .3); mooncakeTop(0, 0, 80, 0, 8); ctx.restore();
    porcelainCup('yc1', 1090, 836, 26, 1); porcelainCup('yc2', 1160, 852, 26, 1); teapotWC('ypot', 1420, 830, 40);
    glow(1250, 850, 300, '#FFC070', .15);
    bunnyAt(hopPath(lt, [[9.3, 560, 1010], [9.9, 780, 1020], [10.5, 1000, 1010], [11.2, 1150, 842]], 60), 46, t, { glow: .25 });
    camEnd();
  } else {                                        // 140–143 a floret falls into a cup; 143–146 the moon moves from one cup into the other; 146–152 the steam twines, tilt up to the moon
    let z = 1, cx = 960, cy = 600;
    if (lt < 15) { z = kf(lt, [[12, 1.7], [15, 1.85]], ease); cx = 660; cy = 610; }
    else if (lt < 18) { z = 1; cy = 600; }
    else if (lt < 21) cy = kf(lt, [[18, 600], [21, 100]], easeIO);
    else cy = kf(lt, [[21, 100], [24, -480]], easeIO);
    camBegin(cx, cy, z);
    bandsL('cupsky', -400, -1200, 2720, 2700, ['#10163C', '#1A2250', '#283064', '#3A3E70', '#4E4A70'], .08);
    stars('cupst', 80, -400, -1200, 2720, 1400, t);
    moonWC(960, -620, 300, { glow: 1.1 });
    layer('cupbr', -400, -400, 2720, 900, () => {
      wcStroke('cupbr1', [[-400, -120], [200, -60], [700, 40], [1100, 60]], 40, 10, '#2A2030', { a: .15 });
      wcStroke('cupbr2', [[2320, -200], [1800, -80], [1400, 10]], 36, 10, '#2A2030', { a: .15 });
      for (let i = 0; i < 40; i++) wcAt('cuplf' + i, UNIT(10), i % 2 ? '#2E4A40' : '#243C36', hash('cl', i) * 2600 - 300, -160 + hash('cl', i, 1) * 260, 50 + hash('cl', i, 2) * 30, { sy: .5, rot: hash('cl', i, 3) * 3, a: .13 });
      for (let i = 0; i < 70; i++) floret(hash('cf', i) * 2600 - 300, -150 + hash('cf', i, 1) * 250, 6, i, .95);
    });
    layer('cuptable', -400, 640, 2720, 900, () => { const g = ctx.createLinearGradient(0, 640, 0, 1540); g.addColorStop(0, '#7A6268'); g.addColorStop(1, '#3A2E38'); ctx.fillStyle = g; ctx.fillRect(-400, 640, 2720, 900); for (let i = 0; i < 10; i++) wcStroke('cuptg' + i, [[-400, 700 + i * 60], [2320, 690 + i * 62]], 2, 2, '#4A3A40', { a: .08 }); });
    glow(960, 720, 800, '#FFB060', .18);
    const C = [[700, 660], [1240, 660]], R = 170;
    C.forEach(([x, y], i) => porcelainCup('bigcup' + i, x, y, R, 1));
    // the moon on the tea: in the left cup, then across into the right one (it vanishes on the table in between)
    const mk = ease(seg(lt, 15.4, 17.2)), mx = lerp(740, 1280, mk);
    C.forEach(([x, y]) => { ctx.save(); ctx.beginPath(); ctx.ellipse(x, y + 3, R * .84, R * .19, 0, 0, TAU); ctx.clip(); ctx.save(); ctx.translate(mx, y); ctx.scale(1, .3); moonWC(0, 0, 40, { glow: .5 }); ctx.restore(); ctx.restore(); });
    // the floret into the left cup
    const fk = seg(lt, 12.4, 13.4);
    if (fk < 1) { const [x, y] = arcPt([420, 200], [680, 662], -60, easeIn(fk)); floret(x, y, 12, fk * 6); } else floret(680 + Math.sin(t) * 3, 662, 12, 6);
    ripples(680, 664, lt, [13.4, 13.9], 110, .22, '#FFE6B0', .6);
    if (lt < 15) { const lean = hop(lt, 13.5, 13.8, 10); bunny(900, 704 + lean.dy, 64, t, { flip: true, glow: .2 }); }
    else bunny(970, 704, 64, t, { flip: lt < 15.6, glow: .2 });
    // two wisps of steam, twining
    const sa = seg(lt, 17.6, 19);
    if (sa > 0) for (let w = 0; w < 2; w++) {
      const x0 = C[w][0], dir = w ? -1 : 1;
      ctx.save(); ctx.lineCap = 'round';
      for (let j = 0; j < 3; j++) {
        ctx.strokeStyle = `rgba(240,236,230,${(.16 - j * .04) * sa})`; ctx.lineWidth = 26 - j * 8; ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40, y = 620 - u * 900 * sa, meet = lerp(x0, 970, ease(clamp(u * 1.6))), x = meet + Math.sin(u * 9 + t * 1.6 + w * Math.PI) * 60 * u * dir;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    camEnd();
  }
}

// ═════════ 镜9 背影 · 赏月 (152–172) ═════════
// by family, left to right
const FAMILY = [['eryi', 'rere'], ['sanyi', 'sanyifu', 'tongtong'], ['daju', 'doudou'], ['laolao', 'laoye'], ['mama', 'baba'], ['wo', 'lulu'], ['erjiu', 'erjiumu', 'daidai']];
const BACKS = []; { let x = 90; FAMILY.forEach((f, g) => { f.forEach((r, i) => { BACKS.push({ role: r, x, g }); x += 104; }); x += 44; }); }
function familyBacks(lt, t, o = {}) {
  BACKS.forEach(({ role, x }, i) => {
    let dy = 0, rot = 0, dx = 0;
    if (role === 'rere') dy = -Math.max(0, Math.sin(seg(lt, 4, 4.8) * Math.PI)) * 18;
    if (role === 'lulu') { const k = ease(seg(lt, 5.6, 6.6)); rot = -.05 * k; dx = -8 * k; }
    if (role === 'wo') rot = .012 * ease(seg(lt, 6.1, 6.9));
    puppet(role, 'back', x + dx, 1190 + (i % 2) * 14, 560, { t, rot, dy, alpha: o.alpha ?? 1, tint: ['#1A2050', .28], light: ['#FFF0C0', .25], shadow: false });
  });
}
// the rabbit in front of the family; then it hops up a moonbeam and back into the moon
function s9Rabbit(lt, t) {
  if (lt < 7) { bunny(960, 1072, 70, t, { glow: .3 }); return; }
  if (lt > 10.8) return;
  const K = [[7.3, 1320, 800], [7.9, 1250, 740], [8.5, 1180, 690], [9.1, 1110, 640], [9.7, 1040, 600], [10.3, 970, 560], [10.8, 900, 510]];
  const p = hopPath(lt, K, 40, .45), sz = lerp(62, 20, seg(lt, 7.3, 10.8));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,240,200,${.08 * seg(lt, 7, 7.5)})`; ctx.lineWidth = 60; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1400, 860); ctx.lineTo(890, 500); ctx.stroke(); ctx.restore();
  bunnyAt(p, sz, t, { flip: true, glow: .35, alpha: 1 - seg(lt, 10.5, 10.8) });
}
function moonCourt(t, o = {}) {
  bandsL('mcsky', -400, -300, 2720, 1800, ['#0E1438', '#18204C', '#262E62', '#3A3C70'], .08);
  stars('mcst', 70, -400, -300, 2720, 800, t, .6);
  moonWC(960, 400, 330, { glow: 1.3, colours: o.colours || 0, t });
  layer('mceave', -400, 600, 2720, 900, () => {
    wc('mcroofL', [[-400, 720], [300, 700], [520, 740], [520, 780], [-400, 800]], '#141830', { a: .15 });
    wc('mcroofR', [[1400, 740], [1620, 700], [2320, 720], [2320, 800], [1400, 780]], '#141830', { a: .15 });
    wcRect('mcwall', -400, 780, 2720, 400, '#262A48', { a: .12 });
    wcRect('mcstep', -400, 1000, 2720, 500, '#3A3A5A', { a: .1, wet: true });
  });
}
// the reverse angle, as the moon sees them: sixteen faces in its light, by family (mirrored: their left is our right)
const FACES = []; { let x = 98; [...FAMILY].reverse().forEach(f => { [...f].reverse().forEach(r => { FACES.push({ role: r, x }); x += 104; }); x += 28; }); }
function facesCourt(t, camX, o = {}) {
  bandsL('fcsky', -400, -300, 2720, 900, ['#10163E', '#1C2454', '#2C3468']);
  stars('fcst', 60, -400, -300, 2720, 500, t, .7);
  layer('fcyard', -400, 150, 2720, 1300, () => {
    ctx.fillStyle = '#20243A'; ctx.fillRect(-400, 300, 2720, 34);
    const g = ctx.createLinearGradient(0, 330, 0, 820); g.addColorStop(0, '#3E4064'); g.addColorStop(1, '#30304E'); ctx.fillStyle = g; ctx.fillRect(-400, 330, 2720, 500);
    wcRect('fcwall', -400, 330, 2720, 500, '#5A5A7A', { a: .04 });
    for (const x of [300, 1620]) { const g2 = ctx.createRadialGradient(x, 560, 20, x, 560, 150); g2.addColorStop(0, '#F2C07A'); g2.addColorStop(1, '#7A5A58'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, 560, 140, 0, TAU); ctx.fill(); }
    const g3 = ctx.createLinearGradient(0, 820, 0, 1450); g3.addColorStop(0, '#4E4A6A'); g3.addColorStop(1, '#2A2A44'); ctx.fillStyle = g3; ctx.fillRect(-400, 820, 2720, 630);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = 'rgba(40,40,70,.25)'; ctx.lineWidth = 2; for (let y = 860; y < 1450; y += 44) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); ctx.stroke(); } ctx.restore();
  });
  osmanthusWC('fctree', 1780, 900, 700, t, 1);
  [[140, 250], [620, 210], [1100, 230], [1560, 260]].forEach(([x, y], i) => { limb([[x, y - 60], [x, y - 36]], 2, 'rgba(30,20,20,.7)'); lanternWC(x, y, 30, 1, Math.sin(t * 1.3 + i) * .05, 'fcl' + i); });
  // moonlight from in front of them; each face brightens as the camera (the moon's gaze) reaches it
  FACES.forEach(({ role, x }, i) => {
    const near = camX === undefined ? .6 : clamp(1 - Math.abs(x - camX) / 380), k = .12 + .3 * ease(near) + (o.all || 0) * .2;
    puppet(role, 'main', x, 1140 + (i % 2) * 10, 560, { t, tint: ['#1A2050', .22 - .12 * near], light: ['#FFF0C8', Math.min(.55, k)], shadowCol: '#20203A' });
  });
  glow(camX ?? 960, 700, 700, '#FFF0C8', .08);
}
function S9(lt, t) {
  if (lt < 3) {                                   // 152–155 a huge moon; the family's backs appear in its light, the rabbit in front of them
    camBegin(960, 540, 1);
    moonCourt(t);
    familyBacks(lt, t, { alpha: ease(seg(lt, -.4, 2.4)) });
    s9Rabbit(lt, t);
    camEnd();
  } else if (lt < 7) {                            // 155–159 along the row of backs, family by family: 热热 rises on tiptoe; 璐璐 leans toward 我
    const cx = kf(lt, [[3, 420], [7, 1560]], k => k);
    camBegin(cx, 700, 1.6);
    moonCourt(t);
    familyBacks(lt, t);
    s9Rabbit(lt, t);
    camEnd();
  } else if (lt < 10) {                           // 159–162 the rabbit hops up a moonbeam (slow push)
    const z = kf(lt, [[7, 1.3], [10, 1.45]], ease);
    camBegin(960, 440, z);
    moonCourt(t);
    floretRain('s9fl2', 200, 1720, -100, 1100, 18, t, { s: 9 });
    s9Rabbit(lt, t);
    camEnd();
  } else if (lt < 12) {                           // 162–164 into the moon: its rabbit is back, the five cities' colours surface
    camBegin(960, 480, 1.25);
    MOONRAB = ease(seg(lt, 10.8, 11.6));
    moonCourt(t, { colours: .5 * ease(seg(lt, 11, 12)) });
    s9Rabbit(lt, t);
    const f = seg(lt, 10.7, 11.5); if (f > 0 && f < 1) glow(890, 505, 260 * f + 20, '#FFF6D8', .6 * Math.sin(f * Math.PI));
    camEnd();
  } else if (lt < 18.5) {                         // 164–170.5 the reverse angle, from the moon: along the sixteen faces (pan right)
    const cx = kf(lt, [[12, 360], [18.5, 1500]], k => k * k * (3 - 2 * k) * .25 + k * .75);
    camBegin(cx, 740, 1.85);
    facesCourt(t, cx);
    floretRain('s9fl3', cx - 700, cx + 700, 400, 1100, 26, t, { s: 7 });
    camEnd();
  } else {                                        // 170.5–173 all of them together, like a family photo (pull back); the moonlight turns to gold
    const z = kf(lt, [[18.5, 1.35], [21, 1]], ease);
    camBegin(960, 640, z);
    facesCourt(t, undefined, { all: seg(lt, 18.5, 20) });
    floretRain('s9fl4', 0, 1920, -100, 1100, 44, t, { s: 8 });
    camEnd();
    fillScreen('#F8E4B0', .5 * ease(seg(lt, 19.6, 21)));
  }
}

// ═════════ 镜10 纸 (172–180) ═════════
function S10(lt, t) {
  lt *= 8 / 7;                                    // (seven seconds, paced as eight)
  camBegin(960, 470, 1.6);
  const board = 1 - ease(seg(lt, .2, 2.2)), chars = 1 - ease(seg(lt, 1.6, 3));
  if (board > 0) { ctx.save(); ctx.globalAlpha = board; wcRect('p-frame', PLAQUE.x - 12, PLAQUE.y - 10, PLAQUE.w + 24, PLAQUE.h + 20, '#B98A3A', { a: .14, spread: .05, edge: .4 }); wcRect('p-board', PLAQUE.x, PLAQUE.y, PLAQUE.w, PLAQUE.h, '#26283A', { a: .2, spread: .04, mul: false }); ctx.restore(); }
  wcGlow(960, 434, 500, '#FFE8B0', .25 * (1 - seg(lt, 3, 6)));
  plaqueChars('pl', 1, { dim: board > .05, glow: false, except: 'ri', exceptA: 0, fade: chars });
  const riA = 1 - seg(lt, 5.4, 6.4);
  if (riA > 0) glyph('pl', '阳', 1024, PLAQUE.cy, PLAQUE.size, 1, { only: 'ri', dim: board > .05, glow: false, fade: riA });
  const dk = seg(lt, 3.4, 4.6), bx = 1024 + 16 * .84, y0 = PLAQUE.cy + 40;
  if (lt > 3.2 && dk < 1) { const s = lt < 3.4 ? seg(lt, 3.2, 3.4) : 1; drop(bx, lerp(y0, 700, easeIn(dk)), 7 * s, t, { sy: 1.3, glowA: .2 }); }
  if (dk >= 1) { wcBloom('p-bloom', bx, 700, 90, GOLD, seg(lt, 4.6, 5.6), { a: .07 }); glow(bx, 700, 160, '#FFD27A', .3 * seg(lt, 4.6, 5.4) * (1 - seg(lt, 6.4, 8))); drop(bx, 690, 12, t, { glowA: .2 }); }
  camEnd();
  paperCover(ease(seg(lt, 6, 8)));
}

const SHOTS = [
  [0, S1, '向阳门第·晨'],
  [14, S2, '北京', { d: .8, type: 'dissolve' }],
  [32, S5, '包头', { d: .8, type: 'dissolve' }],
  [50, S6, '呼和浩特', { d: .8, type: 'dissolve' }],
  [68, S3, '西安'],
  [86, S4, '新加坡', { d: 1.4, type: 'ripple', x: 960, y: 177 }],
  [104, S7, '从前慢'],
  [128, S8, '向阳门第·夜', { d: .8, type: 'dissolve' }],
  [152, S9, '背影·赏月', { d: 1, type: 'dissolve' }],
  [173, S10, '纸', { d: 1, type: 'dissolve' }],
];
VIEWS.cast = (t) => { Object.keys(ROLE).forEach((r, i) => puppet(r, 'back', 120 + i * 112, 1000, 700, { t })); };
VIEWS.mains = (t) => { const R = ['daidai', 'erjiumu', 'erjiu', 'lulu', 'wo', 'baba', 'mama', 'laoye', 'laolao', 'doudou', 'daju', 'tongtong', 'sanyifu', 'sanyi', 'rere', 'eryi']; R.forEach((r, i) => puppet(r, 'main', 70 + i * 118, 1000, 560, { t })); };
