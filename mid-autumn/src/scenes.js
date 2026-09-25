// ───────────────────────── scenes: 《一滴月亮》, twelve shots on one 180-second timeline ─────────────────────────
// Every shot is fn(lt, t, dur); lt = time inside the shot. One camera move per storyboard row.
const VIEWS = {};

// ── shared pieces ──
// a round watercolour window with a close-up inside (expressions are small on the cards, so close-ups live in these)
function moonWindow(key, role, from, to, k, x, y, r, col, t, o = {}) {
  if (r < 2) return;
  wcAt(key + 'bg', UNIT(22), col, x, y, r * 1.02, { a: .1, spread: .25, edge: .4 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .97, 0, TAU); ctx.clip();
  wcAt(key + 'bg2', UNIT(16), mix(col, '#FFFFFF', .4), x - r * .3, y - r * .35, r * .6, { a: .08, wet: true, mul: false });
  bust(role, from, to, k, x + (o.dx || 0), y + r * (o.bottom ?? 1.02), r * (o.size ?? 1.62));
  if (o.inside) o.inside();
  ctx.restore();
  wcAt(key + 'rim', UNIT(22), mix(col, '#302040', .3), x, y, r, { a: 0, layers: 1, edge: .7, edgeW: 3 });
}
const sky = (key, cols, o = {}) => layer(key, -200, -200, W + 400, H + 400, () => {
  wcBands(key, -200, -200, W + 400, o.h ?? 900, cols, { a: o.a ?? .06 });
  if (o.ground) wcRect(key + 'g', -240, o.gy ?? 760, W + 480, 700, o.ground, { a: .06, spread: .3, wet: true });
});

// ═════════ 镜1 纸 (0–10) ═════════
function S1(lt, t) {
  const z = kf(lt, [[3, 1], [6, 1.18]], ease), cx = kf(lt, [[6, 960], [10, 1560]], easeIO);
  camBegin(cx, 540, z);
  const fall = seg(lt, .6, 2.6), land = lt > 2.6;
  if (!land) {
    const y = lerp(-80, 560, easeIn(fall));
    ctx.save(); ctx.globalAlpha = .5 * fall; wcStroke('s1trail', [[960, y - 180], [960, y - 20]], 1, 10, GOLD, { a: .05, layers: 5 }); ctx.restore();
    drop(960, y, 22, t, { sy: 1.25, sx: .85, glowA: .12 });
  } else {
    wcBloom('s1bloom', 960, 572, 120, GOLD, seg(lt, 2.6, 3.5), { a: .06 });
    spatter('s1sp', 960, 572, 190 * easeOut(seg(lt, 2.6, 3)), 36, GOLD, { size: 4, a: .45, sy: .5 });
    const roll = seg(lt, 6.8, 10), wob = lt < 6.8 ? spring(lt, 6, 2.5, 3) * .25 : 0;
    const x = lerp(960, 2560, easeIn(roll) * .6 + roll * .4), sq = lt < 3.2 ? .35 * (1 - seg(lt, 2.6, 3.2)) : 0;
    drop(x, 548 - sq * 20, 26 + 4 * seg(lt, 2.6, 4), t, { sx: 1 + sq + wob, sy: 1 - sq - wob, glowA: .2 });
    if (lt > 7) {           // the rabbit bleeds out of the white of the paper and gives chase
      const a = seg(lt, 7, 7.8);
      wcBloom('s1rb', 1100, 560, 90, '#B7C4E2', a, { a: .05 });
      rabbitRun(1100, 2300, 580, 62, lt, 7.9, 10.2, 2.4, { alpha: a });
    }
  }
  camEnd();
  paperCover(1 - ease(seg(lt, 0, .7)));
}

// ═════════ 镜2 二舅 · 二舅妈 · 袋袋 (10–22) · 淡蓝 ═════════
function S2(lt, t) {
  const blue = ['#AFC6E6', '#C8D8EC', '#E6EDF2'];
  if (lt < 3) {                                   // 10–13 the drop rolls in and bounces at 袋袋's feet
    camBegin(960, 540, 1);
    sky('s2sky', blue, { ground: '#C9D3DF', gy: 820 });
    puppet('erjiu', 'main', 640, 1010, 800, { t });
    puppet('erjiumu', 'main', 1300, 1010, 800, { t });
    puppet('daidai', 'main', 970, 1010, 800, { t });
    const k = seg(lt, 0, 2.4), x = lerp(-60, 860, easeOut(k)), b = hop(lt, 2.3, 2.75, 70);
    drop(x, 975 + b.dy, 24, t, { sx: 1 + b.sq, sy: 1 - b.sq });
    rabbitRun(-200, 420, 1000, 55, lt, .3, 2.6);
    camEnd();
  } else if (lt < 6) {                            // 13–16 袋袋 in a round window: the drop lands between her V fingers, she smiles
    const z = kf(lt, [[3, 1], [6, 1.08]], ease);
    camBegin(960, 540, z);
    sky('s2sky', blue, { ground: '#C9D3DF', gy: 820 });
    const k = backOut(seg(lt, 3, 3.6));
    moonWindow('s2w', 'daidai', 'e0', 'e1', seg(lt, 4.4, 5.1), 960, 520, 380 * k, '#AFC6E6', t, { size: 1.8, bottom: 1.08 });
    const up = seg(lt, 3.4, 4.3), [x, y] = arcPt([700, 1000], [960 + 330, 250], 200, easeOut(up));
    drop(x, y, 24, t);
    camEnd();
  } else if (lt < 9) {                            // 16–19 二舅 and 二舅妈 stand back to back and, at the same moment, lean back a little
    camBegin(960, 540, 1);
    sky('s2sky', blue, { ground: '#C9D3DF', gy: 820 });
    const lean = ease(seg(lt, 6.8, 7.8));
    puppet('erjiu', 'side', 880 - lean * 10, 1010, 820, { t, flip: true, rot: .05 * lean });
    puppet('erjiumu', 'side', 1060 + lean * 10, 1010, 820, { t, rot: -.05 * lean });
    puppet('daidai', 'main', 1480, 1030, 700, { t });
    drop(1290, 360 + Math.sin(t * 2) * 10, 24, t);
    camEnd();
  } else {                                        // 19–22 the drop falls into a puddle at their feet; the blue spreads into a river (tilt down)
    const cy = kf(lt, [[9, 440], [12, 900]], easeIO);
    camBegin(960, cy, 1.2);
    sky('s2sky', blue, { ground: '#C9D3DF', gy: 820 });
    puppet('erjiu', 'side', 870, 1010, 820, { t, flip: true, rot: .05 });
    puppet('erjiumu', 'side', 1070, 1010, 820, { t, rot: -.05 });
    puppet('daidai', 'main', 1480, 1030, 700, { t });
    const k = seg(lt, 9.2, 10.8);
    if (k < 1) drop(lerp(1290, 1180, k), lerp(360, 1000, easeIn(k)), 24, t);
    wcBloom('s2pud', 1180, 1020, 160, '#6D8BC4', seg(lt, 10.8, 11.3), { a: .08 });
    const fl = seg(lt, 10.9, 12);
    if (fl > 0) { wcBloom('s2flood', 1180, 950, 900, '#2D4A8A', fl, { a: .09 }); wcBloom('s2flood2', 900, 1000, 700, '#1F356E', seg(lt, 11.2, 12), { a: .09 }); }
    camEnd();
  }
}
// where the lenses sit on the 'face' sprites: [x offset, height from the bottom] as fractions of the sprite
const GLASSES = { rere: [.17, .58], wo: [.19, .62] };

// ═════════ 镜3 我 & 璐璐 (22–34) · 靛蓝 ═════════
function riverBG(key) {
  layer(key, -600, -900, W + 1400, H + 1100, () => {
    wcBands(key + 'sky', -600, -900, W + 1400, 1400, ['#6F7FB8', '#98A6CF', '#C5CDE3'], { a: .07 });
    wcBands(key + 'water', -600, 640, W + 1400, 640, ['#2D3A7A', '#23306A', '#1B2659'], { a: .09 });
    for (let i = 0; i < 18; i++) { const y = 700 + i * 22 + (i % 3) * 7, x = -500 + hash(key, i) * (W + 1200); wcStroke(key + 'rip' + i, [[x, y], [x + 120 + hash(key, i, 1) * 200, y + 4]], 3, 1, '#C8D2EE', { a: .12, layers: 5, mul: false }); }
  });
}
function S3(lt, t) {
  const KEYS = 6, keyX = i => 620 + i * 190, keyY = 880;
  if (lt < 7) {                                   // 22–25 the boat drifts in (pan); 25–29 his stripes become keys
    const cx = lt < 3 ? kf(lt, [[0, 420], [3, 960]], easeOut) : 960;
    camBegin(cx, 540, 1);
    riverBG('s3r');
    const bx = lt < 3 ? lerp(-100, 400, easeOut(seg(lt, 0, 3))) : 400, rock = Math.sin(t * 1.6) * .03;
    puppet('wo', 'main', bx - 70, 930, 640, { t, rot: rock, shadow: false });
    puppet('lulu', 'main', bx + 80, 930, 640, { t, rot: rock, shadow: false });
    paperBoat(bx, 950, 270, rock);
    const peel = seg(lt, 3.2, 4.6);
    for (let i = 0; i < KEYS; i++) {
      const k = clamp(peel * 1.6 - i * .12), sx = bx - 60, sy = 560 + i * 24;
      const x = lerp(sx, keyX(i), easeIO(k)), y = lerp(sy, keyY, easeIO(k)) - Math.sin(k * Math.PI) * 120;
      const hit = lt > 4.6 && Math.abs(lt - (4.8 + i * .38)) < .12;
      if (k > 0) { wcStroke('s3keyc' + i, [[x - 80, y], [x + 80, y + 2]], 30, 28, hit ? '#FFE2A0' : '#F4ECD6', { a: .2, mul: false }); wcStroke('s3key' + i, [[x - 76, y + 4], [x + 76, y + 6]], 8, 7, hit ? '#E8A33A' : '#2D3A6A', { a: .2, mul: false }); }
      if (hit) spatter('s3hit' + i, x, y, 60, 14, GOLD, { size: 3, a: .6, mul: false });
    }
    if (lt > 4.6) {
      const i = Math.min(KEYS - 1, Math.floor((lt - 4.6) / .38)), k = ((lt - 4.6) / .38) % 1;
      const [x, y] = i < KEYS - 1 ? arcPt([keyX(i), keyY - 26], [keyX(i + 1), keyY - 26], 110, k) : [keyX(KEYS - 1), keyY - 26];
      drop(x, y, 20, t);
    } else drop(bx + 200, 860, 20, t);
    rabbit(bx + 190, 915, 36, t, { alpha: .95 });
    camEnd();
  } else if (lt < 10) {                           // 29–32 two round windows side by side: he smiles, then she does
    const z = kf(lt, [[7, 1], [10, 1.08]], ease);
    camBegin(960, 540, z);
    riverBG('s3r');
    moonWindow('s3w', 'wo', 'e0', 'e1', seg(lt, 7.6, 8.3), 700, 520, 300, '#6F7FB8', t, { size: 1.75, bottom: 1.08 });
    moonWindow('s3w2', 'lulu', 'e0', 'e1', seg(lt, 8.5, 9.2), 1240, 520, 300, '#98A6CF', t, { size: 1.85, bottom: 1.08 });
    camEnd();
  } else {                                        // 32–34 the last key flings the drop up; stripes become lines in the sky
    const cy = kf(lt, [[10, 540], [12, 60]], easeIO);
    camBegin(960, cy, 1);
    riverBG('s3r');
    for (let i = 0; i < KEYS; i++) { wcStroke('s3keyc' + i, [[keyX(i) - 80, keyY], [keyX(i) + 80, keyY + 2]], 30, 28, '#F4ECD6', { a: .2, mul: false }); wcStroke('s3key' + i, [[keyX(i) - 76, keyY + 4], [keyX(i) + 76, keyY + 6]], 8, 7, '#2D3A6A', { a: .2, mul: false }); }
    const k = seg(lt, 10, 11.6), [x, y] = arcPt([keyX(KEYS - 1), keyY - 26], [1200, -420], 200, easeOut(k));
    drop(x, y, 22, t);
    for (let i = 0; i < 5; i++) { const a = seg(lt, 10.6 + i * .15, 11.6 + i * .15); if (a > 0) wcStroke('s3sl' + i, [[300, -120 - i * 60], [300 + 1300 * a, -118 - i * 60]], 12, 8, '#2D3A6A', { a: .12 }); }
    camEnd();
  }
}

// ═════════ 镜4 大舅 & 兜兜 (34–46) · 红白灰 ═════════
function S4(lt, t) {
  const grey = ['#C8C8D2', '#DEDDE2', '#EFE9E2'];
  const birds = (lt0) => { for (let i = 0; i < 14; i++) { const k = seg(lt, lt0 + i * .08, lt0 + 2.4 + i * .08); if (k <= 0) continue; const sx = 1080 + (hash('s4b', i) - .5) * 70, sy = 820 + hash('s4b', i, 1) * 200; const [x, y] = arcPt([sx, sy], [1300 + (hash('s4b', i, 2) - .5) * 360, 260 + hash('s4b', i, 3) * 110], 120, easeOut(k)); houndBird(x, y, 34 + hash('s4b', i, 4) * 18, t * 3 + i * .3, (hash('s4b', i, 5) - .5) * .5); } };
  if (lt < 10) {
    const z = lt < 3 ? 1.12 : lt < 7 ? kf(lt, [[3, 1.12], [7, 1]], ease) : 1;
    camBegin(960, 560, z);
    sky('s4sky', grey, { ground: '#D9C7C0', gy: 800 });
    const lean = ease(seg(lt, 7.2, 8.4));
    puppet('daju', 'front', 740, 1060, 900, { t });
    puppet('doudou', 'front', 1080 - lean * 130, 1060, 900, { t, rot: -.06 * lean });
    const fall = seg(lt, .3, 2.8), fx = 1300, fy = lt < 2.8 ? lerp(-100, 330, easeIn(fall)) : 330 + Math.sin(t * 2) * 10;
    birds(3);
    drop(fx, fy, 24, t);
    camEnd();
  } else {                                        // 44–46 pan: the flock carries the drop over roofs; feathers turn to gold
    const cx = kf(lt, [[10, 960], [12, 1900]], easeIO);
    camBegin(cx, 540, 1);
    layer('s4roofs', -200, -200, 3400, 1480, () => {
      wcBands('s4sky2', -200, -200, 3400, 900, grey, { a: .06 });
      for (let i = 0; i < 9; i++) { const x = 300 + i * 330, h = 180 + hash('rf', i) * 120; wc('s4roof' + i, [[x - 190, 1080], [x - 190, 1080 - h], [x - 150, 1080 - h - 50], [x + 150, 1080 - h - 50], [x + 190, 1080 - h], [x + 190, 1080]], i % 2 ? '#6C7394' : '#8A8FAA', { a: .07, spread: .15 }); }
    });
    const fx = lerp(1300, 2700, easeIO(seg(lt, 10, 12)));
    for (let i = 0; i < 14; i++) houndBird(fx - 150 + (hash('s4c', i) - .5) * 420, 300 + hash('s4c', i, 1) * 160 + Math.sin(t * 3 + i) * 10, 34 + hash('s4c', i, 2) * 18, t * 3 + i * .3);
    drop(fx, 330, 24, t);
    floretRain('s4fl', fx - 400, fx + 200, 350, 1100, 26, t, { a: seg(lt, 10.5, 11.5) });
    camEnd();
  }
}

// ═════════ 镜5 桐桐 · 三姨 · 三姨夫 (46–58) · 桂花金 ═════════
function S5(lt, t) {
  const warm = ['#F3D9A4', '#F6E6C2', '#F2E9D6'];
  const TX = 700;
  const scene = (grow, shift) => {
    sky('s5sky', warm, { ground: '#D8C590', gy: 830, h: 1000 });
    osmanthusWC('s5tree', TX, 1000, 820, t, grow);
    puppet('tongtong', 'front', lerp(TX + 60, 1330, shift), lerp(1060, 1010, shift), 880, { t, rot: Math.sin(shift * Math.PI) * .05 });
    puppet('sanyifu', 'front', 1150, 1060, 900, { t });
    puppet('sanyi', 'main', 1500, 1060, 880, { t });
  };
  if (lt < 3) {                                   // 46–49 tilt up: the pale branches on 桐桐's sweater grow into the tree
    const cy = kf(lt, [[0, 760], [3, 330]], easeIO);
    camBegin(960, cy, 1);
    scene(easeOut(seg(lt, .2, 3)), 0);
    camEnd();
  } else if (lt < 9) {                            // 49–52 the drop in the treetop turns gold; 52–55 桐桐 steps over to shield his parents from the petals
    camBegin(960, 330, 1);
    scene(1, ease(seg(lt, 6.2, 7.4)));
    rabbit(1780, 1010, 46, t, { hop: lt > 5 ? (lt * 1.5) % 1 : 0, flip: true });
    const settle = seg(lt, 3, 4.4), [x, y] = arcPt([1500, -120], [TX + 40, -120], -60, easeOut(settle));
    drop(x, y, 24 + 4 * seg(lt, 4, 6), t);
    floretRain('s5fl', 900, 1600, -300, 1000, 30, t, { s: 8 });
    camEnd();
  } else {                                        // 55–58 三姨 smiles; the petals fall into pink
    const z = kf(lt, [[9, 1], [12, 1.1]], ease);
    camBegin(960, 330, z);
    scene(1, 1);
    moonWindow('s5w', 'sanyi', 'e0', 'e1', seg(lt, 9.6, 10.4), 1700, 90, 210, '#F3D9A4', t, { size: 1.85, bottom: 1.08 });
    floretRain('s5fl2', 800, 1700, -300, 900, 20, t, { s: 9 });
    if (lt > 11.2) wcBloom('s5pink', 1300, 400, 1200, '#EF6E96', seg(lt, 11.2, 12), { a: .08 });
    camEnd();
  }
}

// ═════════ 镜6 二姨 (58–72) · 桃粉 ═════════
function scarfRiver(key, x0, y0, len, grow, t) {
  const P = []; for (let i = 0; i <= 24; i++) { const k = i / 24; P.push([x0 + k * len, y0 + Math.sin(k * 5) * 40 + k * 180]); }
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 50, -400, len * grow + 60, 2400); ctx.clip();
  wc(key + 'rib', ribbonPts(P, 70, 150), '#EF4E86', { a: .1, spread: .12, edge: .35, mul: false });
  for (let i = 0; i < 40; i++) { const k = hash(key, i), p = P[Math.floor(k * 24)]; wcAt(key + 'fl' + i, UNIT(8), ['#3657B0', '#F3C443', '#86CDB0'][i % 3], p[0] + (hash(key, i, 1) - .5) * 60, p[1] + (hash(key, i, 2) - .5) * 60 * (1 + k), 12 + hash(key, i, 3) * 14, { a: .12, mul: false, spread: .6 }); }
  ctx.restore();
  return P;
}
function S6(lt, t) {
  const pink = ['#F6C9D6', '#F9DDE4', '#F4ECE8'];
  if (lt < 3) {                                   // 58–61 二姨's phone lights with sixteen little circles; 热热 beside her
    camBegin(960, 540, 1);
    sky('s6sky', pink, { ground: '#E7C4C8', gy: 830 });
    puppet('eryi', 'main', 760, 1010, 800, { t });
    puppet('rere', 'main', 1250, 1010, 800, { t });
    const a = seg(lt, .6, 1.2);
    wcGlow(840, 640, 140, '#9FD3F0', .35 * a);
    for (let i = 0; i < 16; i++) { const k = backOut(seg(lt, .9 + i * .08, 1.3 + i * .08)), an = -Math.PI * .9 + i / 15 * Math.PI * .8, r = 170; if (k > 0) wcCircle('s6dot' + i, 840 + Math.cos(an) * r, 600 + Math.sin(an) * r * .8, 12 * k, PICKUPS[i % PICKUPS.length][1], { mul: false, a: .2 }); }
    drop(1560, 700, 24, t);
    camEnd();
  } else if (lt < 7) {                            // 61–65 the drop hops onto 热热's glasses: two little moons
    const z = kf(lt, [[3, 1], [7, 1.08]], ease);
    camBegin(960, 540, z);
    sky('s6sky', pink, { ground: '#E7C4C8', gy: 830 });
    wcAt('s6vig', UNIT(20), '#E9A8BE', 900, 600, 470, { a: .05, wet: true });
    const im = spriteOf('rere', 'face'), fh = 720, fw = fh * im.width / im.height;
    bust('rere', 'face', 'face', 0, 860, 1090, fh);
    const up = seg(lt, 3.2, 4.2);
    if (up < 1) { const [x, y] = arcPt([1500, 900], [860, 480], 260, easeOut(up)); drop(x, y, 20, t); }
    else {
      const a = seg(lt, 4.2, 4.6);
      for (const s of [-1, 1]) { const lx = 860 + s * fw * GLASSES.rere[0], ly = 1090 - fh * GLASSES.rere[1]; wcGlow(lx, ly, 60, '#FFD27A', .3 * a); ctx.save(); ctx.globalAlpha = .8 * a; drop(lx, ly, 15, t + s, { glow: false }); ctx.restore(); }
    }
    camEnd();
  } else if (lt < 11) {                           // 65–69 the end of 二姨's scarf floats over and settles round 热热's shoulders; he smiles
    camBegin(960, 540, 1);
    sky('s6sky', pink, { ground: '#E7C4C8', gy: 830 });
    puppet('eryi', 'main', 760, 1010, 800, { t });
    puppet('rere', 'main', 1250, 1010, 800, { t });
    const d = ease(seg(lt, 7.2, 9));
    ctx.save(); ctx.globalAlpha = .85;
    wc('s6drape' + Math.round(d * 12), ribbonPts([[840, 470], [1000, 420 - (1 - d) * 160], [1150 + d * 20, 400 + d * 40], [1250, 440 + d * 20], [1340, 470 + d * 30]], 34, 46), '#EF4E86', { a: .1, spread: .12, mul: false });
    ctx.restore();
    moonWindow('s6w', 'rere', 'e0', 'e1', seg(lt, 9.3, 10), 1640, 300, 170 * backOut(seg(lt, 8.8, 9.4)), '#F6C9D6', t, { size: 1.9, bottom: 1.1 });
    drop(1060, 300 + Math.sin(t * 2) * 10, 24, t);
    camEnd();
  } else {                                        // 69–72 push in on the drop: it darkens into a red button (match cut to 姥姥's jacket)
    const z = kf(lt, [[11, 1], [14, 3]], easeIn);
    camBegin(1060, 300, z);
    sky('s6sky', pink, { ground: '#E7C4C8', gy: 830 });
    puppet('eryi', 'main', 760, 1010, 800, { t });
    puppet('rere', 'main', 1250, 1010, 800, { t });
    const r = seg(lt, 12.4, 14);
    if (r < 1) drop(1060, 300, 24, t, { glowA: .25 * (1 - r) });
    wcCircle('s6btn', 1060, 300, 38 * r, '#5E1822', { mul: false, a: .25 * r });
    camEnd();
  }
}

// ═════════ 镜7 姥姥 & 姥爷 (72–86) · 暗红 ═════════
function lattice(x, y, w, h, cell, a, col = '#2A2A36') {
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = -8; i < 22; i++) {
    wcStroke('lat1:' + i, [[x + i * cell, y], [x + i * cell + h, y + h]], 7, 5, col, { a: .1, layers: 5, spread: .15 });
    wcStroke('lat2:' + i, [[x + i * cell + h, y], [x + i * cell, y + h]], 7, 5, col, { a: .1, layers: 5, spread: .15 });
  }
  ctx.restore();
}
function S7(lt, t) {
  const red = ['#C98A86', '#DDB2A8', '#EBD6C8'];
  if (lt < 3) {                                   // 72–75 a button lifts off her jacket like a small moon
    const z = kf(lt, [[0, 2.4], [3, 1.7]], ease);
    camBegin(1150, 600, z);
    sky('s7sky', red, { ground: '#C7A49A', gy: 860 });
    puppet('laolao', 'main', 1150, 1060, 860, { t });
    const k = seg(lt, .6, 2.6), [x, y] = arcPt([1152, 560], [1260, 330], 40, easeOut(k));
    wcGlow(x, y, 50, '#FFD27A', .3 * k);
    wcCircle('s7btn', x, y, 12 + 6 * k, '#5E1822', { mul: false, a: .25 });
    camEnd();
  } else if (lt < 11) {                           // 75–79 his quilted vest opens into a lattice window; 79–83 he turns to look at her
    camBegin(960, 540, 1);
    sky('s7sky', red, { ground: '#C7A49A', gy: 860 });
    const open = ease(seg(lt, 3.4, 5.6));
    ctx.save(); ctx.beginPath(); ctx.arc(960, 430, 700 * open + 1, 0, TAU); ctx.clip();
    wcRect('s7win', 0, -100, W, 1000, '#E8C9A0', { a: .07, wet: true });
    wcGlow(960, 400, 700, '#FFD9A0', .35);
    lattice(-400, -100, 2700, 1000, 170, .8);
    ctx.restore();
    const k = seg(lt, 4.6, 7), [x, y] = arcPt([960, -80], [960, 360], -40, easeOut(k));
    drop(x, y, 26, t);
    puppet('laoye', lt > 7.3 ? 'side' : 'front', 760, 1030, 820, { t });
    puppet('laolao', 'front', 1180, 1030, 820, { t });
    camEnd();
  } else {                                        // 83–86 push into the lattice: steam
    const z = kf(lt, [[11, 1], [14, 2.2]], easeIn);
    camBegin(960, 400, z);
    sky('s7sky', red, { ground: '#C7A49A', gy: 860 });
    wcRect('s7win', 0, -100, W, 1000, '#E8C9A0', { a: .07, wet: true });
    lattice(-400, -100, 2700, 1000, 170, .8);
    puppet('laoye', 'side', 760, 1030, 820, { t });
    puppet('laolao', 'front', 1180, 1030, 820, { t });
    drop(960, 360, 26, t);
    for (let i = 0; i < 8; i++) wcBloom('s7st' + i, 700 + i * 70, 420 - seg(lt, 11 + i * .1, 14) * 200, 120 + i * 20, '#FFFFFF', seg(lt, 11.5 + i * .12, 13.6), { a: .12, mul: false });
    camEnd();
    paperCover(seg(lt, 13.4, 14) * .8);
  }
}

// ═════════ 镜8 云里的厨房 (86–106) · 蒸汽白 ═════════
function cloudPuff(key, x, y, s, col = '#FFFFFF', a = 1) { ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 5; i++) wcAt(key + i, UNIT(12), col, x + (i - 2) * s * .45, y - Math.sin(i / 4 * Math.PI) * s * .35, s * (.45 + .1 * (i % 2)), { mul: false, a: .12, spread: .5, edge: .15 }); ctx.restore(); }
function kitchenBG() {
  layer('s8bg', -200, -200, 4400, 1480, () => {
    wcBands('s8sky', -200, -200, 4400, 1100, ['#DCE4EE', '#EEF0F2', '#F5EFE6'], { a: .06 });
    wcRect('s8floor', -200, 880, 4400, 500, '#D8C6A8', { a: .07, spread: .2 });
    wcRect('s8counter', -200, 860, 4400, 60, '#B98A5E', { a: .08, spread: .1 });
    for (let i = 0; i < 16; i++) cloudPuff('s8c' + i, -100 + i * 290, 1000 + (i % 3) * 30, 180);
  });
}
function S8(lt, t) {
  const Y = 1000, H0 = 740;
  if (lt < 3) {                                   // 86–89 steam parts: a steamer, a kitchen afloat on clouds
    const z = kf(lt, [[0, 1.5], [3, 1]], ease);
    camBegin(960, 560, z);
    kitchenBG();
    steamer('s8st', 960, 860, 230, seg(lt, .3, 1.4));
    for (let i = 0; i < 6; i++) cloudPuff('s8puff' + i, 960 + (i - 2.5) * 80, 600 - (lt * 60 + i * 60) % 400, 140, '#FFFFFF', 1 - seg(lt, 1, 3) * .6);
    drop(960, 420, 26, t);
    camEnd();
  } else if (lt < 11) {                           // 89–93 pan: a bowl floats daju → baba → mama; 93–97 the biggest bowl goes back and forth
    const cx = lt < 7 ? kf(lt, [[3, 700], [7, 1250]], easeIO) : 1250;
    camBegin(cx, 540, 1);
    kitchenBG();
    puppet('daju', 'front', 520, Y, H0, { t });
    puppet('baba', 'front', 980, Y, H0, { t });
    puppet('mama', 'front', 1440, Y, H0, { t });
    const k = seg(lt, 3.6, 6.8), bx = lerp(560, 1400, easeIO(k)), by = 600 - Math.sin(k * Math.PI * 2) * 30;
    bowlWC('s8b1', bx, by, 44);
    const push = lt < 7 ? 0 : lt < 8.6 ? ease(seg(lt, 7, 8.4)) : 1 - ease(seg(lt, 8.8, 10.4));
    bowlWC('s8big', lerp(1060, 1360, push), 800, 78);
    drop(1210, 430 + Math.sin(t * 2) * 12, 26, t);
    camEnd();
  } else if (lt < 18) {                           // 97–101 pan: beads roll, a pomelo, the drop pressed into a mould; 101–104 back to back
    const cx = lt < 15 ? kf(lt, [[11, 2200], [15, 2900]], easeIO) : 2900;
    camBegin(cx, 540, 1);
    kitchenBG();
    puppet('sanyifu', 'front', 2050, Y, H0, { t });
    puppet('sanyi', 'front', 2420, Y, H0, { t });
    puppet('erjiu', 'front', 3060, Y, H0, { t });
    puppet('erjiumu', 'front', 3300, Y, H0, { t });
    for (let i = 0; i < 10; i++) { const k = seg(lt, 11 + i * .12, 14 + i * .12), x = lerp(1700, 2600 - i * 26, easeOut(k)); if (k > 0) { wcGlow(x, 848, 24, '#FFB24A', .3); wcCircle('s8bead' + i, x, 848, 11, '#EB8E2C', { mul: false, a: .22 }); } }
    pomelo('s8pom', 2240, 840, 46);
    const press = seg(lt, 12.8, 13.6), lift = seg(lt, 13.9, 14.6), pressed = lt > 13.6;
    if (!pressed) drop(2700, lerp(430, 810, easeIn(seg(lt, 11.6, 12.9))), 24, t);
    mooncakeWC('s8mc', 2700, 840, 60, .45, { glow: pressed ? .8 : 0 });
    const my = lerp(560, 790, easeIn(press)) - lift * 220;
    wc('s8mould', [[2640, my - 70], [2760, my - 70], [2770, my + 10], [2630, my + 10]], '#9C6A45', { a: .12, spread: .1, edge: .4 });
    wcStroke('s8handle', [[2700, my - 70], [2700, my - 220]], 22, 18, '#8A5A3C', { a: .14 });
    camEnd();
  } else {                                        // 104–106 tilt up: the clouds rise and go orange
    const cy = kf(lt, [[18, 540], [20, -300]], easeIO);
    camBegin(2900, cy, 1);
    kitchenBG();
    ctx.save(); ctx.globalAlpha = seg(lt, 18.2, 20);
    wcBands('s8dusk', 1800, -900, 2200, 900, ['#E9895A', '#F1A77A', '#F6C9A0'], { a: .08 });
    ctx.restore();
    for (let i = 0; i < 6; i++) cloudPuff('s8up' + i, 2500 + i * 160, 200 - (lt - 18) * 260 - i * 40, 160, mix('#FFFFFF', '#F4A06A', seg(lt, 18.4, 20)));
    camEnd();
  }
}

// ═════════ 镜9 黄昏的路 (106–124) · 橙紫 ═════════
const WALK = ['mama', 'baba', 'lulu', 'wo', 'daju', 'doudou', 'erjiu', 'erjiumu', 'daidai', 'sanyi', 'tongtong', 'eryi', 'rere'];
const ROUNDS = ['bowl', 'teapot', 'cake', 'lantern', 'bead', 'lantern', 'pomelo', 'cake', 'bowl', 'cake', 'pomelo', 'rlantern', 'rlantern'];
function roundThing(kind, x, y, s, t, i) {
  const k = 'rt' + i;
  if (kind === 'bowl') bowlWC(k, x, y, s * .8);
  if (kind === 'cake') mooncakeWC(k, x, y, s * .8, .5);
  if (kind === 'pomelo') pomelo(k, x, y, s * .7);
  if (kind === 'teapot') teapotWC(k, x, y, s * .6);
  if (kind === 'lantern') lanternWC(x, y, s * .7, .6, Math.sin(t * 2 + i) * .08, k + 'l');
  if (kind === 'rlantern') rabbitLanternWC(x, y + s * .5, s * .9, .5, t, k);
  if (kind === 'button') wcCircle(k, x, y, s * .35, '#5E1822', { mul: false, a: .25 });
  if (kind === 'bead') wcCircle(k, x, y, s * .35, '#EB8E2C', { mul: false, a: .25 });
}
function duskBG() {
  layer('s9bg', -2600, -300, 9600, 1700, () => {
    wcBands('s9sky', -2600, -300, 9600, 1100, ['#7C6FA8', '#C98AA0', '#F2A77A', '#F8CFA0'], { a: .065 });
    for (let i = 0; i < 16; i++) { const x = i * 620 - 2400; wc('s9hill' + i, [[x - 500, 1400], [x - 300, 860 - hash('h', i) * 80], [x, 800 - hash('h', i, 1) * 120], [x + 300, 870], [x + 520, 1400]], i % 2 ? '#8C6F9C' : '#A07AA0', { a: .06, spread: .3 }); }
    wcRect('s9road', -2600, 960, 9600, 400, '#C8A08A', { a: .06, spread: .2, wet: true });
  });
}
function S9(lt, t) {
  const walkX = (i, l = lt) => 1400 + l * 150 - i * 260;       // everyone walks right at the same pace
  const dusk = ['#6A4A8A', .12];
  if (lt < 12) {                                  // 106–118 one long pan along the procession
    const cx = lerp(300, 2500, easeIO(seg(lt, 0, 12)));
    camBegin(cx, 540, 1);
    duskBG();
    rabbit(walkX(-1.2), 1000, 44, t, { hop: (t * 2.4) % 1 });
    WALK.forEach((r, i) => { const x = walkX(i); puppet(r, 'side', x, 1000, 640, { t, walk: lt * 1.1 + i * .37, tint: dusk }); roundThing(ROUNDS[i], x + 10, 300 + Math.sin(t * 1.5 + i) * 12, 95, t, i); });
    const c3 = walkX(10.6);          // 三姨夫 rides a little cloud behind 三姨 and 桐桐
    cloudPuff('s9ride3', c3, 1010, 150, '#F4E9E2');
    puppet('sanyifu', 'side', c3, 980, 640, { t, dy: Math.sin(t * 1.4 + 2) * 6, shadow: false, tint: dusk });
    const cxl = walkX(13.6);          // 姥姥 and 姥爷 ride a cloud at the back
    cloudPuff('s9ride', cxl, 1010, 200, '#F4E9E2');
    puppet('laoye', 'side', cxl - 90, 980, 640, { t, dy: Math.sin(t * 1.4) * 6, shadow: false, tint: dusk });
    puppet('laolao', 'side', cxl + 110, 1000, 640, { t, dy: Math.sin(t * 1.4 + 1) * 6, shadow: false, tint: dusk });
    drop(walkX(5) + 80, 180 + Math.sin(t) * 16, lerp(40, 90, seg(lt, 6, 12)), t);
    camEnd();
  } else if (lt < 15) {                           // 118–121 rere, at the back, stops and looks back to wait
    const stopX = walkX(12, 12.4);
    camBegin(stopX - 300, 540, 1);
    duskBG();
    const waiting = lt > 12.4;
    puppet('rere', 'side', waiting ? stopX : walkX(12), 1000, 640, { t, flip: lt > 13, walk: waiting ? undefined : lt * 1.1, tint: dusk });
    const cx2 = stopX - 820 + (lt - 12) * 110;           // grandpa's cloud drifts up to him
    cloudPuff('s9ride', cx2, 1010, 200, '#F4E9E2');
    puppet('laoye', 'side', cx2 - 90, 980, 640, { t, dy: Math.sin(t * 1.4) * 6, shadow: false, tint: dusk });
    puppet('laolao', 'side', cx2 + 110, 1000, 640, { t, dy: Math.sin(t * 1.4 + 1) * 6, shadow: false, tint: dusk });
    camEnd();
  } else {                                        // 121–124 tilt up: the round things light up as lanterns
    const cy = kf(lt, [[15, 540], [18, 60]], easeIO);
    camBegin(2300, cy, 1);
    duskBG();
    ctx.save(); ctx.globalAlpha = seg(lt, 15, 17.5); wcBands('s9night', 1000, -700, 2800, 900, ['#1F2652', '#2E3A73', '#5E5A8E'], { a: .09 }); ctx.restore();
    WALK.concat(['laolao']).forEach((r, i) => { const x = 2600 - i * 170; lanternWC(x, 200 - (i % 3) * 90 - seg(lt, 15, 18) * 120, 34, seg(lt, 15.5 + i * .12, 16.2 + i * .12), Math.sin(t * 2 + i) * .08, 's9l' + i); });
    camEnd();
  }
}

// ═════════ 镜10 圆桌 (124–148) · 夜靛与灯金 ═════════
const TABLE_ROW = ['sanyi', 'sanyifu', 'daju', 'mama', 'baba', 'laolao', 'laoye', 'erjiu', 'erjiumu', 'eryi'];
const TABLE_FRONT = ['tongtong', 'doudou', 'wo', 'lulu', 'daidai', 'rere'];
function courtyardNight() {
  layer('s10bg', -200, -1000, 2320, 2380, () => {
    wcBands('s10sky', -200, -1000, 2320, 1600, ['#1B2250', '#27306A', '#3A4580'], { a: .1 });
    for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,240,200,${.3 + hash('st', i) * .5})`; ctx.beginPath(); ctx.arc(hash('st', i, 1) * 2300 - 200, hash('st', i, 2) * 1200 - 950, 1 + hash('st', i, 3) * 2, 0, TAU); ctx.fill(); }
    wc('s10roof', [[-200, 480], [400, 380], [1500, 380], [2100, 480], [2100, 560], [-200, 560]], '#1C2040', { a: .1, spread: .1 });
    wcRect('s10wall', -200, 540, 2320, 360, '#6A5A70', { a: .07, spread: .15 });
    wcRect('s10floor', -200, 880, 2320, 600, '#5A5070', { a: .08, spread: .2, wet: true });
  });
}
function tableWC(y, t, o = {}) {
  ctx.save(); ctx.fillStyle = '#6A4A3A'; ctx.beginPath(); ctx.moveTo(240, y); ctx.lineTo(1680, y); ctx.lineTo(1700, y + 240); ctx.lineTo(220, y + 240); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9C6E4E'; ctx.beginPath(); ctx.ellipse(960, y, 720, 108, 0, 0, TAU); ctx.fill(); ctx.restore();
  wc('s10cloth', [[240, y], [1680, y], [1700, y + 240], [220, y + 240]], '#8A5A3C', { a: .1, spread: .08 });
  wcAt('s10tabletop', UNIT(30), '#C99466', 960, y, 720, { sy: .15, a: .1, spread: .08, edge: .45 });
  wcAt('s10runner', UNIT(24), '#C63B33', 960, y, 420, { sy: .09, a: .1, spread: .1 });
  mooncakeWC('s10mc', 960, y - 14, 90, .35, { glow: o.glow || 0 });
  pomelo('s10pom', 700, y - 30, 40); pomelo('s10pom2', 1260, y - 26, 34);
  for (let i = 0; i < 8; i++) cupWC('s10cup' + i, 380 + i * 165, y + 20 + (i % 2) * 14, 22, o.tea ? seg(o.tea, i * .3, i * .3 + .3) : 0);
}
function S10(lt, t) {
  const Y = 880;
  const drawTable = (o = {}) => {
    courtyardNight();
    for (let i = 0; i < 7; i++) { const k = seg(lt, i * .35, 2.4 + i * .35); lanternWC(360 + i * 200, lerp(-200, 160 + (i % 2) * 40, easeOut(k)), 38, 1, Math.sin(t * 1.5 + i) * .05, 's10l' + i); }
    const seat = o.seat ?? 1;
    // the far side of the table: everyone standing behind it, cut at the waist by the tabletop
    TABLE_ROW.forEach((r, i) => { const a = seg(seat, i * .08, i * .08 + .3); if (a > 0) puppet(r, 'front', 300 + i * 147, Y + 140 - (1 - a) * 30, 600, { t, alpha: a, tint: ['#FFB070', .08], shadow: false }); });
    tableWC(Y, t, o);
    // the near side: the young ones, seen from behind, on stools
    TABLE_FRONT.forEach((r, i) => { const a = seg(seat, .6 + i * .06, .9 + i * .06); if (a > 0) puppet(r, 'back', 380 + i * 232, 1320 + (1 - a) * 40, 640, { t, alpha: a, tint: ['#1F2652', .25], shadow: false }); });
  };
  if (lt < 4) { camBegin(960, 540, 1); drawTable({ seat: 0 }); camEnd(); }
  else if (lt < 8) { const z = kf(lt, [[4, 1], [8, 1.1]], ease); camBegin(960, 560, z); drawTable({ seat: seg(lt, 4, 7.5) }); camEnd(); }
  else if (lt < 12) {                             // 132–136 the teapot pours, grandpa's cup first
    camBegin(960, 620, 1.35);
    drawTable({ tea: lt - 8.5 });
    const k = seg(lt, 8.2, 12), x = lerp(1010, 1320, k);
    teapotWC('s10pot', x, 700 + Math.sin(k * 20) * 6, 44, -.4 * Math.sin(k * Math.PI * 4) ** 2);
    camEnd();
  } else if (lt < 16) {                           // 136–140 a pan along round windows: one smile after another
    const cx = kf(lt, [[12, 500], [16, 3100]], easeIO);
    camBegin(cx, 540, 1);
    layer('s10strip', -200, -200, 4000, 1480, () => wcBands('s10strip', -200, -200, 4000, 1480, ['#1B2250', '#27306A', '#1B2250'], { a: .1 }));
    const ALL = ['laoye', 'laolao', 'mama', 'baba', 'wo', 'lulu', 'daju', 'doudou', 'erjiu', 'erjiumu', 'daidai', 'sanyi', 'sanyifu', 'tongtong', 'eryi', 'rere'];
    ALL.forEach((r, i) => { const x = 300 + i * 190, tt = 12 + (x - 300) / 2800 * 4; moonWindow('s10w' + i, r, 'e0', 'e1', seg(lt, tt, tt + .5), x, 540 + (i % 2 ? -110 : 110), 120, '#F2C877', t, { size: 1.75, bottom: 1.1 }); });
    camEnd();
  } else if (lt < 20) {                           // 140–144 the drop falls into the big mooncake; it glows
    const z = kf(lt, [[16, 1.1], [20, 1.6]], ease);
    camBegin(960, 800, z);
    const g = seg(lt, 17.6, 18.4);
    drawTable({ glow: g, tea: 10 });
    if (g < 1) drop(960, lerp(-100, Y - 20, easeIn(seg(lt, 16.2, 17.6))), 30, t, { glowA: .3 });
    camEnd();
  } else {                                        // 144–148 everyone looks up: tilt up to the sky
    const cy = kf(lt, [[20, 560], [24, -200]], easeIO);
    camBegin(960, cy, 1);
    drawTable({ glow: 1, tea: 10 });
    camEnd();
  }
}

// ═════════ 镜11 全家福 (148–168) · 满月金 ═════════
const PHOTO = [
  ['sanyifu', 180, 900], ['sanyi', 380, 940], ['erjiu', 560, 930], ['erjiumu', 760, 950], ['laoye', 960, 900], ['laolao', 1180, 920],
  ['mama', 1400, 930], ['baba', 1640, 930], ['daju', 1840, 900],
  ['tongtong', 440, 780], ['daidai', 640, 800], ['eryi', 860, 780], ['rere', 1080, 770], ['lulu', 1300, 790], ['wo', 1500, 800], ['doudou', 1700, 790],
];
function S11(lt, t) {
  const warm = ['#FFB070', .06];
  const group = (squeezeK, woK) => {
    [...PHOTO].sort((a, b) => a[2] - b[2]).forEach(([r, x, y], i) => {
      if (r === 'wo') {
        if (woK <= 0) return;
        const done = woK >= 1, xx = lerp(2300, x, easeOut(woK));
        puppet(r, done ? 'main' : 'side', xx, y + 120, 520, { t, flip: !done, walk: done ? undefined : lt * 2.5, tint: warm });
        return;
      }
      const sq = ease(clamp(squeezeK * 1.3 - i * .02)), dx = (x - 960) * .14 * (1 - sq);
      puppet(r, 'main', x + dx, y + 120, 520, { t, tint: warm });
    });
  };
  if (lt < 8) {                                   // 148–152 they squeeze in, the timer blinks; 152–156 "I" run in last
    camBegin(960, 540, 1);
    layer('s11bg', -200, -200, 2320, 1480, () => { wcBands('s11sky', -200, -200, 2320, 900, ['#1F2652', '#2E3A73', '#4A5288'], { a: .1 }); wcRect('s11fl', -200, 860, 2320, 600, '#5A5070', { a: .08, wet: true }); });
    moonWC(960, 170, 80, { glow: .6 });
    group(seg(lt, .4, 3.4), seg(lt, 4.2, 6.2));
    oldCamera(1780, 900, 90, Math.floor(lt * 2) % 2 === 0);
    camEnd();
  } else if (lt < 11) {                           // 156–159 the flash
    camBegin(960, 540, 1);
    layer('s11bg', -200, -200, 2320, 1480, () => {});
    moonWC(960, 170, 80, { glow: .6 });
    group(1, 1);
    oldCamera(1780, 900, 90, false);
    camEnd();
    fillScreen('#FFF8E6', lt < 8.25 ? seg(lt, 8, 8.25) : 1);
  } else if (lt < 16) {                           // 159–164 their backs; the flash stays in the sky as a full moon
    const z = kf(lt, [[11, 1.15], [16, 1]], ease);
    camBegin(960, 540, z);
    layer('s11bg2', -200, -200, 2320, 1480, () => { wcBands('s11sky2', -200, -200, 2320, 1000, ['#141A40', '#1F2652', '#2E3A73'], { a: .12 }); wcRect('s11fl2', -200, 900, 2320, 600, '#3A3860', { a: .09, wet: true }); });
    moonWC(960, 340, 260, { colours: .55, t, glow: 1.2 });
    const backs = ['sanyifu', 'sanyi', 'tongtong', 'erjiu', 'erjiumu', 'daidai', 'eryi', 'rere', 'laoye', 'laolao', 'mama', 'baba', 'lulu', 'wo', 'daju', 'doudou'];
    backs.forEach((r, i) => puppet(r, 'back', 110 + i * 113, 1080 + (i % 2) * 30, 480, { t, tint: ['#141A40', .35], shadow: false }));
    rabbit(960, 1060, 50, t, { alpha: .9 });
    camEnd();
    fillScreen('#FFF8E6', 1 - seg(lt, 11, 12.5));
  } else {                                        // 164–168 the moon, petals drifting; then it shrinks into a cup
    camBegin(960, 540, 1);
    layer('s11bg2', -200, -200, 2320, 1480, () => {});
    moonWC(960, 540, 420, { colours: .55, t, glow: 1.2 });
    floretRain('s11fl', 200, 1700, -100, 1100, 30, t, { s: 10 });
    camEnd();
    const shrink = seg(lt, 18.8, 20);
    if (shrink > 0) iris(960, 540, lerp(1300, 60, easeIn(shrink)), '#F7F2E8');
  }
}

// ═════════ 镜12 茶杯 (168–180) · 纸白 ═════════
function S12(lt, t) {
  if (lt < 8) {                                   // 168–172 the teacup with the moon on the tea; 172–176 a drop runs down the rim (tilt down)
    const cy = lt < 4 ? 540 : kf(lt, [[4, 540], [8, 820]], easeIO);
    camBegin(960, cy, 1);
    layer('s12bg', -200, -200, 2320, 1880, () => wcBands('s12bg', -200, -200, 2320, 1880, ['#F4E9D8', '#F7F2E8', '#F4EDE2'], { a: .05 }));
    ctx.save(); ctx.globalAlpha = .5; bust('laolao', 'face', 'face', 0, 1420, 720, 540); ctx.restore();
    const cx = 880, cyy = 700 - ease(seg(lt, 1, 3)) * 30;
    wc('s12cup', [...arcPts(cx, cyy, 260, 0, Math.PI, 18, 220), [cx - 260, cyy]], '#EFE8DA', { a: .1, spread: .08, edge: .45 });
    wcAt('s12tea', UNIT(24), '#C9923A', cx, cyy, 240, { sy: .24, a: .1, spread: .06 });
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cyy, 238, 56, 0, 0, TAU); ctx.clip(); moonWC(cx + 30, cyy, 44, { glow: .5 }); ctx.restore();
    wcAt('s12rim', UNIT(24), '#D8CDB8', cx, cyy, 262, { sy: .25, a: 0, layers: 1, edge: .7, edgeW: 3 });
    if (lt > 4) { const k = seg(lt, 4.2, 7.6), y = lerp(cyy + 20, cyy + 480, easeIn(k)), x = cx + 250 - k * 10; drop(x, y, 14, t, { sy: 1.3, glowA: .15 }); }
    camEnd();
  } else {                                        // 176–180 back on the blank paper: the drop lands and blooms, as at the start
    camBegin(960, 540, 1);
    const k = seg(lt, 8, 8.9);
    if (lt < 8.9) drop(960, lerp(-40, 560, easeIn(k)), 20, t, { sy: 1.25 });
    else { wcBloom('s12bloom', 960, 572, 120, GOLD, seg(lt, 8.9, 9.8), { a: .06 }); drop(960, 552, 24, t, { glowA: .15 }); }
    camEnd();
    paperCover(seg(lt, 10.4, 12));
  }
}

const SHOTS = [
  [0, S1, '纸'], [10, S2, '二舅二舅妈袋袋'], [22, S3, '我和璐璐'], [34, S4, '大舅兜兜'], [46, S5, '三姨一家'], [58, S6, '二姨热热'],
  [72, S7, '姥姥姥爷'], [86, S8, '厨房'], [106, S9, '黄昏的路'], [124, S10, '圆桌'], [148, S11, '全家福'], [168, S12, '茶杯'],
];
VIEWS.cast = (t) => { Object.keys(ROLE).forEach((r, i) => puppet(r, 'front', 120 + i * 112, 1000, 700, { t })); };
