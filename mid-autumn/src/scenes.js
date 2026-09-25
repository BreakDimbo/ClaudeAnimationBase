// ───────────────────────── scenes: fourteen shots on one 180-second timeline ─────────────────────────
// Every shot is fn(lt, t, dur): lt = time inside the shot. Camera rule: one move per storyboard row.
const C = CAST;
const P = (id, pose) => person(C[id], pose);
const VIEWS = {};
const kitchenLight = '#FFB86B';

// ═════════ Act I · 等 ═════════

// 镜1 空院 (0–12): dusk courtyard; the moon rises; grandma hangs a lantern, looks up, walks to the kitchen
function S1(lt, t) {
  const night = lerp(0, .38, seg(lt, 0, 12));
  // camera: 0–6 slow push; 6–9 hold; 9–12 pan right after grandma
  const z = kf(lt, [[0, 1], [6, 1.1]], ease), cx = kf(lt, [[9, 960], [12, 1420]], easeIO);
  camBegin(cx, 560, z);
  const moonY = kf(lt, [[0, 262], [5.5, 175]], easeOut);
  const lanternOn = ease(seg(lt, 5.2, 5.6));
  courtyard(t, {
    night, lamps: lanternOn * .45, moon: [1395, moonY, 58], moonA: .85, kitchenLit: seg(lt, 9, 10.5) * .8,
    eaveLanterns: key => key === 'L2' ? lanternOn : 0,
  });
  // grandma: out of the hall door, to the lantern pole, lifts it, looks up, walks to the kitchen
  const walk1 = seg(lt, 3, 4.6), walk2 = seg(lt, 9.2, 12);
  let gx = lerp(960, 1120, ease(walk1));
  gx = lerp(gx, 1880, easeIn(walk2) * .6 + walk2 * .4);
  const walking = (lt > 3 && lt < 4.6) || lt > 9.2;
  const lift = ease(seg(lt, 4.6, 5.25)) - ease(seg(lt, 6.2, 6.8));
  const lookUp = ease(seg(lt, 6.4, 7.2)) * (1 - ease(seg(lt, 9, 9.4)));
  const settle = spring(lt, 5.3, 2.2, 5) * .04;
  const pole = lift > .02 || lt < 6.8;
  const lanternHeld = lt < 5.25;
  const hold = (k, LW) => {
    if (!pole) return;
    seed('pole'); line([[0, 0], [lerp(8, 18, lift), lerp(-40, -150, lift)]], 1.6, '#A0794A', { double: false });
    if (lanternHeld) { ctx.save(); ctx.translate(lerp(8, 18, lift), lerp(-40, -150, lift)); ctx.scale(1 / 3.1, 1 / 3.1); lantern(0, 38, 46, 0, Math.sin(lt * 4) * .15, { key: 'held' }); ctx.restore(); }
  };
  const blossomK = seg(lt, 6.8, 8.4);
  P('nai', {
    x: gx, y: 860, k: 3.1, t, walk: walking ? lt * 1.6 : undefined, stride: 6,
    face: lt < 3.6 ? 0 : lt < 9.3 ? .45 : .7, tilt: -lookUp * .12, look: [lookUp * .6, -lookUp],
    eyes: lookUp > .5 && lt > 8.2 && lt < 8.8 ? 'closed' : 'open', mouth: lookUp > .3 ? 'soft' : 'smile',
    handR: pole ? [14 + lift * 4, -70 - lift * 22] : undefined, holdR: hold,
    handL: lookUp > .1 ? [-12, -38] : undefined, bendL: 1,
    alpha: seg(lt, 2.9, 3.3), lean: settle,
  });
  // the round table waits, empty
  roundTable(960, 930, 540, { key: 'S1', flat: .16 });
  // the blossom drifts from the tree onto her shoulder
  if (blossomK > 0) {
    const [bx, by] = arcPt([1450, 560], [gx + 26, 860 - 3.1 * 68], -60, easeOut(blossomK));
    blossom(bx + Math.sin(lt * 5) * 14 * (1 - blossomK), by, 7, lt * 3 * (1 - blossomK));
  }
  camEnd();
  // transitions: from paper in; a pillar sweeps past as she enters the kitchen
  paperCover(1 - ease(seg(lt, 0, 1.4)));
  if (lt > 11.3) doorWipe(seg(lt, 11.3, 12.6));
}
// a dark red pillar sweeping right→left across the frame (door-frame wipe); p .5 = full cover
function doorWipe(p) {
  if (p <= 0 || p >= 1) return;
  const x = lerp(W + 700, -700, easeIO(p));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); seed('doorwipe');
  shape(rectPts(x - 560, -40, 1120, H + 80), { fill: '#7E2A2C', sw: 4, curv: 0, wob: 2, rim: true, rimCol: PAL.gold });
  for (const dx of [-420, -140, 140, 420]) line([[x + dx, -20], [x + dx, H + 20]], 5, '#5E1E24', { alpha: .6 });
  ctx.restore();
}

// kitchen interior (shared by 镜2, 镜5, 镜8): tiled wall, window with the moon, shelves, stove
function kitchenBack(t, o = {}) {
  const w0 = o.x0 ?? -200, w1 = o.x1 ?? 2200;
  seed('kwall'); shape(rectPts(w0, -200, w1 - w0, 1100), { fill: o.wall || '#E9DCC0', ink: null, wob: 2, curv: 0 });
  // tiles
  for (let y = 520; y < 900; y += 46) line([[w0, y], [w1, y]], 1.2, '#CDBE9E', { alpha: .6, double: false });
  for (let x = w0; x < w1; x += 62) for (let y = 520; y < 900; y += 92) { line([[x, y], [x, y + 46]], 1.2, '#CDBE9E', { alpha: .5, double: false }); line([[x + 31, y + 46], [x + 31, y + 92]], 1.2, '#CDBE9E', { alpha: .5, double: false }); }
  if (o.window) { const [wx, wy, ww, wh] = o.window; windowWithMoon(wx, wy, ww, wh, t, o); }
  // shelf with jars, a string of garlic and chillies
  if (o.shelf !== false) {
    const sx = o.shelfX ?? 150;
    seed('shelf'); shape(rectPts(sx, 300, 380, 18), { fill: PAL.wood, sw: 2, curv: 0 });
    const jars = [['#C9834B', 50], ['#6E9A7C', 42], ['#E3C27A', 56], ['#B64B3C', 40]];
    jars.forEach(([c, h], i) => shape(rrPts(sx + 20 + i * 90, 300 - h, 60, h, 12), { fill: c, sw: 2, wob: .6, rim: true, rimCol: PAL.gold }));
    seed('garlic'); line([[sx + 420, 180], [sx + 430, 420]], 2, '#A0794A', { double: false });
    for (let i = 0; i < 6; i++) shape(ellPts(sx + 425 + (i % 2 ? 12 : -12), 220 + i * 36, 16, 18, 10), { fill: i % 3 === 2 ? '#D8452E' : '#F1E8D6', sw: 1.8, wob: .6 });
  }
}
function windowWithMoon(wx, wy, ww, wh, t, o = {}) {
  seed('kwin');
  const sky = o.winSky || '#2A3566';
  shape(rectPts(wx, wy, ww, wh), { fill: sky, ink: null, curv: 0 });
  ctx.save(); tracePath(rectPts(wx, wy, ww, wh), true, 0); ctx.clip();
  if (o.moonIn) moon(o.moonIn[0], o.moonIn[1], o.moonIn[2], { key: 'win', glow: .8 });
  if (o.cloudIn) o.cloudIn();
  seed('winroofs'); shape([[wx - 20, wy + wh], [wx - 20, wy + wh * .8], [wx + ww * .3, wy + wh * .72], [wx + ww * .7, wy + wh * .78], [wx + ww + 20, wy + wh * .7], [wx + ww + 20, wy + wh]], { fill: '#1E2548', ink: null, wob: 1.5 });
  ctx.restore();
  // lattice frame
  for (let i = 1; i < 3; i++) line([[wx + ww * i / 3, wy], [wx + ww * i / 3, wy + wh]], 5, '#6D3F2A', { double: false, curv: 0 });
  line([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 5, '#6D3F2A', { double: false, curv: 0 });
  shape(rectPts(wx - 10, wy - 10, ww + 20, wh + 20), { ink: '#6D3F2A', sw: 14, curv: 0, wob: 1 });
  shape(rectPts(wx - 20, wy + wh + 6, ww + 40, 18), { fill: PAL.wood, sw: 2, curv: 0 });
}
function counterTop(y, x0 = -200, x1 = 2200, col = '#B98459') {
  seed('counter' + y);
  shape(rectPts(x0, y, x1 - x0, 1200 - y), { fill: col, ink: null, wob: 1.5, curv: 0 });
  line([[x0, y], [x1, y]], 3, PAL.ink, { alpha: .8 });
  for (let i = 0; i < 6; i++) line([[x0, y + 30 + i * 40], [x1, y + 34 + i * 40 + Math.sin(i) * 6]], 1.4, mix(col, PAL.ink, .25), { alpha: .35, double: false, wob: 3 });
}

// 镜2 十六个月饼 (12–26): pressing, the knock, the tray fills, counting, flour
function S2(lt, t) {
  setLight(kitchenLight, .08);
  if (lt < 6) {                       // 12–18: grandma at the board, the mould
    const [sx, sy] = shakeXY(lt, 4.2, 12);
    camBegin(1000 - sx, 660 - sy, 1.3);
    kitchenBack(t, { window: [1230, 110, 420, 300], moonIn: [1520, 200, 46] });
    const press = lt < 3 ? Math.max(0, Math.sin(lt * 5.2)) * (1 - seg(lt, 2.6, 3)) : 0;
    const lift = ease(seg(lt, 3.3, 3.9)), knock = ease(seg(lt, 4.0, 4.2));
    const mouldY = 830 + press * 16 - lift * 150 + knock * 150;
    const hx = 900;
    P('nai', { x: hx, y: 1100, k: 7, t, face: -.15, look: [.1, .9], eyes: press > .2 ? 'down' : 'open', mouth: lt > 4.3 ? 'smile' : 'soft',
      handL: [-6, (mouldY - 1100) / 7 - 3], handR: [10, (mouldY - 1100) / 7 - 5], bendL: -1, bendR: 1, lean: -.04 });
    counterTop(880);
    // dough balls in a bowl, the tray at the right
    seed('bowl'); shape([...arcPts(420, 900, 150, 0, Math.PI, 12, 70), [270, 900]], { fill: '#E7E0D2', sw: 2.4, rim: true, rimCol: PAL.red });
    for (let i = 0; i < 5; i++) shape(ellPts(330 + i * 45, 890 - (i % 2) * 14, 30, 22, 12), { fill: '#F2DDB0', sw: 1.8, wob: .8 });
    tray(1260, 900, 620, 260);
    for (let i = 0; i < 9; i++) mooncake(1340 + (i % 4) * 148, 950 + Math.floor(i / 4) * 60, 46, { sq: .45, key: 'tr' + i, sw: 1.8 });
    mould(hx + 20, mouldY + 40, 150, lift * -.1);
    // the cake pops out and hops into the tray
    if (lt > 4.2) {
      const k = seg(lt, 4.3, 5.1), [mx, my] = arcPt([hx + 20, 880], [1340 + (9 % 4) * 148, 950 + 2 * 60], 240, easeOut(k));
      const land = hop(lt, 5.1, 5.25, 0);
      mooncake(mx, my, 46, { sq: .45 + land.sq, key: 'pop', rim: true, sw: 1.8 });
      if (lt > 4.2 && lt < 4.6) { seed('dust'); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .3, r = 40 + seg(lt, 4.2, 4.6) * 90; shape(ellPts(hx + 20 + Math.cos(a) * r, 880 + Math.sin(a) * r * .6, 5, 5, 6), { fill: '#FFF6E6', ink: null, alpha: 1 - seg(lt, 4.2, 4.6), flat: 1 }); } }
    }
    camEnd();
    if (lt < .7) doorWipe(.5 + lt / 1.4);
  } else if (lt < 10) {               // 18–22: the tray from above, pan along it; the 16th lands
    const cx = kf(lt, [[6, 760], [10, 1160]], easeIO);
    camBegin(cx, 540, 1);
    seed('boardtop'); shape(rectPts(-200, -200, 2400, 1500), { fill: '#B98459', ink: null, curv: 0, wob: 2 });
    for (let i = 0; i < 12; i++) line([[-200, i * 110 + 20], [2200, i * 110 + 40 + Math.sin(i) * 10]], 1.4, '#9C6B45', { alpha: .4, double: false, wob: 3 });
    tray(330, 110, 1300, 860);
    const land = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6.3, 6.9, 7.5, 8.0, 8.5, 9.2];
    for (let i = 0; i < 16; i++) {
      const gx = 330 + 14 + (1300 - 28) * ((i % 4) + .5) / 4, gy = 110 + 14 + (860 - 28) * (Math.floor(i / 4) + .5) / 4;
      if (lt < land[i] - .35) continue;
      const k = seg(lt, land[i] - .35, land[i]), s = land[i] ? backOut(k) : 1;
      mooncakeTop(gx, gy - (1 - easeOut(k)) * 60, 120 * s, { key: 'tt' + i, rim: i === 15, sw: 2.6 });
    }
    // the hand placing the last one
    if (lt > 8.6 && lt < 9.8) { const hk = ease(seg(lt, 8.6, 9.2)) - ease(seg(lt, 9.3, 9.8)); seed('hand16'); const hx = 330 + 14 + (1300 - 28) * 3.5 / 4 + 40, hy = lerp(-200, 800, hk); shape(ribbonPts([[hx + 60, hy - 500], [hx + 20, hy - 60], [hx, hy]], 120, 90), { fill: '#B3313B', sw: 3, rim: true, rimCol: PAL.gold }); shape(ellPts(hx, hy + 10, 54, 50, 12), { fill: PAL.skinOld, sw: 3 }); }
    camEnd();
  } else {                            // 22–26: counting on fingers, the clap, flour
    const z = kf(lt, [[10, 1], [14, 1.14]], ease);
    camBegin(960, 520, z);
    kitchenBack(t, { window: [1180, 60, 520, 380], moonIn: [1500, 180, 60], shelf: false });
    const count = Math.floor(seg(lt, 10.2, 12.2) * 5.99), tap = (lt - 10.2) * 3 % 1;
    const clap = seg(lt, 12.9, 13.2), done = lt > 12.3;
    const hands = lt < 12.6 ? { handR: [17, -64 - (tap < .3 && lt < 12.2 ? 3 : 0)], holdR: fingers(Math.min(5, count + 1)), handL: [-6, -46] }
      : { handR: [lerp(18, 3, clap), -54], handL: [lerp(-18, -3, clap), -54], holdR: openHand(PAL.skinOld, Math.PI + .3), holdL: openHand(PAL.skinOld, -.3) };
    P('nai', { x: 960, y: 1640, k: 12.5, t, face: .05, nod: lt < 12.2 ? Math.sin((lt - 10.2) * 3 * TAU) * .8 : 0, eyes: done ? 'happy' : 'open', look: [.6, -.3], mouth: done ? 'grin' : (Math.floor(lt * 6) % 2 ? 'o' : 'soft'), ...hands, bendR: 1, bendL: -1 });
    camEnd();
    // flour burst → white
    if (lt > 13) { const k = seg(lt, 13, 13.9); seed('flour'); for (let i = 0; i < 70; i++) { const a = hash('fa', i) * TAU, r = easeOut(k) * (300 + hash('fr', i) * 1100); shape(ellPts(960 + Math.cos(a) * r, 540 + Math.sin(a) * r * .8, 30 + k * 90, 30 + k * 90, 8), { fill: '#FFF8EC', ink: null, flat: 1, alpha: .8 }); } paperCover(ease(seg(lt, 13.4, 14))); }
  }
}

// 镜3 十六把椅子 (26–36)
function S3(lt, t) {
  if (lt < 3) {                        // 26–29: grandpa sets chairs around the table
    camBegin(960, 700, 1.45);
    courtyard(t, { night: .45, lamps: .45, moon: [1395, 175, 58], eaveLanterns: k => k === 'L2' ? 1 : 0, kitchenLit: .8 });
    const placed = [.6, 1.6, 2.6].filter(x => lt > x).length;
    const spots = [690, 820, 1100, 1230];
    for (let i = 0; i < 4; i++) { if (i >= 1 + placed && i !== 0) continue; const k = i === 0 ? 1 : seg(lt, [0, .6, 1.6, 2.6][i] - .25, [0, .6, 1.6, 2.6][i]); chair(spots[i], 880 - (1 - easeOut(k)) * 24, 60, '#B98459', { key: 'c' + i }); }
    roundTable(960, 880, 520, { key: 'S3' });
    const step = placed, gx = lerp(560, 1360, (step + seg(lt, step * 1 + .1, step * 1 + .55)) / 3.6);
    const carrying = 3 - placed;
    P('ye', { x: gx, y: 960, k: 2.9, t, walk: lt * 1.8, stride: 5, face: .4, lean: .08, mouth: 'flat', brows: -.3,
      handL: [-6, -58], handR: [8, -56], holdR: (k, LW) => { for (let i = 0; i < carrying; i++) { ctx.save(); ctx.translate(-4 + i * 2, 18 - i * 3); ctx.scale(1 / 2.9, 1 / 2.9); chair(0, 0, 60, '#B98459', { key: 'held' + i }); ctx.restore(); } } });
    camEnd();
    paperCover(1 - ease(seg(lt, 0, .7)));
  } else if (lt < 7) {                 // 29–33: from above: sixteen chairs in a ring, the last one set
    const z = kf(lt, [[3, 1.28], [7, 1.0]], ease);
    camBegin(960, 540, z);
    seed('bricks'); shape(rectPts(-400, -400, 2800, 1900), { fill: '#5E6386', ink: null, curv: 0, wob: 2 });
    for (let i = -6; i < 14; i++) line([[i * 160, -400], [i * 160 + 40, 1500]], 1.6, '#4A4F72', { alpha: .5, double: false, wob: 2 });
    for (let j = -3; j < 12; j++) line([[-400, j * 120], [2400, j * 120 + 20]], 1.6, '#4A4F72', { alpha: .5, double: false, wob: 2 });
    tableTop(960, 540, 300, t, { cloth: 1 });
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI / 2 + i / 16 * TAU, last = i === 5;
      const k = last ? ease(seg(lt, 4.2, 5.0)) : 1;
      const r = 390 + (1 - k) * 160;
      topChair(960 + Math.cos(a) * r, 540 + Math.sin(a) * r, a, 46, { key: 'tc' + i, pat: last ? spring(lt, 5.4, 3, 6) * 4 : 0 });
    }
    // grandpa from above bringing the last chair
    const a5 = -Math.PI / 2 + 5 / 16 * TAU, gk = ease(seg(lt, 4.2, 5.0)), back = ease(seg(lt, 5.8, 7));
    const gr = 560 + (1 - gk) * 160 + back * 120;
    personTop(C.ye, 960 + Math.cos(a5) * gr, 540 + Math.sin(a5) * gr, a5 - Math.PI / 2, 3.6, { reach: lt > 5.3 && lt < 5.9 ? .6 : .2 });
    camEnd();
  } else {                              // 33–36: grandpa rubs his back, thumbs-up to the kitchen window
    camBegin(1380, 640, 1.6);
    courtyard(t, { night: .5, lamps: .5, moon: [1395, 175, 58], eaveLanterns: k => k === 'L2' ? 1 : 0, kitchenLit: .9, inKitchen: () => {
      ctx.save(); tracePath(rectPts(1730, 500, 150, 130), true, 0); ctx.clip();
      const nod = lt > 8.3 ? Math.sin((lt - 8.3) * 9) * 1.2 * (1 - seg(lt, 8.3, 9.3)) : 0;
      P('nai', { x: 1805, y: 760, k: 1.9, t, face: -.4, nod, eyes: lt > 8.3 ? 'happy' : 'open', mouth: 'smile' });
      ctx.restore(); lattice(1730, 500, 150, 130, .9, { n: 4, noFill: 1 });
    } });
    roundTable(960, 880, 520, { key: 'S3' });
    for (const [i, x] of [[0, 690], [1, 820], [2, 1100], [3, 1230]]) chair(x, 880, 60, '#B98459', { key: 'c' + i });
    const rub = ease(seg(lt, 7.1, 7.6)) * (1 - ease(seg(lt, 8.0, 8.3)));
    const thumb = ease(seg(lt, 8.1, 8.45));
    P('ye', { x: 1330, y: 960, k: 3, t, face: .6, lean: -rub * .09 + thumb * .03, look: [1, -.4], eyes: rub > .5 ? 'squeeze' : thumb > .5 ? 'happy' : 'open', mouth: rub > .5 ? 'flat' : 'grin',
      handL: rub > .1 ? [-14, -46] : undefined, bendL: 1, handR: thumb > 0 ? [lerp(14, 20, thumb), lerp(-42, -76, thumb)] : undefined, holdR: thumb > .5 ? thumbUp(PAL.skinOld) : undefined });
    camEnd();
    if (lt > 9.2) { const [ix, iy] = toScreenAt(1380, 640, 1.6, 1805, 565); iris(ix, iy, lerp(1400, 0, easeIn(seg(lt, 9.2, 10)))); }
  }
}
// world→screen for a camera that is no longer active (irises after camEnd)
function toScreenAt(cx, cy, z, x, y) { return [(x - cx) * z + W / 2, (y - cy) * z + H / 2]; }
// top-down table: cloth, lazy susan, place settings
function tableTop(x, y, r, t, o = {}) {
  seed('tabletop');
  shade(x + 14, y + 20, r * 1.25, '#1B2142', .35);
  shape(ellPts(x, y, r, r, 48), { fill: '#C63B33', sw: 3, rim: true, rimCol: PAL.gold });
  shape(ellPts(x, y, r * .9, r * .9, 40), { ink: '#E8A33A', sw: 2, wob: 1 });
  if (o.settings) for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + i / 16 * TAU, px = x + Math.cos(a) * r * .8, py = y + Math.sin(a) * r * .8;
    shape(ellPts(px, py, 22, 22, 12), { fill: '#F3EEE3', sw: 1.8, wob: .5 });
    line([[px + Math.cos(a + 1.57) * 30, py + Math.sin(a + 1.57) * 30], [px + Math.cos(a + 1.57) * 30 - Math.cos(a) * 44, py + Math.sin(a + 1.57) * 30 - Math.sin(a) * 44]], 2.5, '#6D3F2A', { double: false });
  }
  if (o.susan) { shape(ellPts(x, y, r * .5, r * .5, 36), { fill: '#A8322A', sw: 2.2, wob: 1 }); }
}
function topChair(x, y, a, s, o = {}) {
  seed('tch' + (o.key || ''));
  ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.translate(0, o.pat || 0);
  shape(rrPts(-s * .55, -s * .5, s * 1.1, s, s * .18), { fill: '#EFE3C8', sw: 2.2, wob: .6, rim: true, rimCol: PAL.red });
  shape(rrPts(-s * .6, s * .38, s * 1.2, s * .28, s * .1), { fill: '#B98459', sw: 2.2, wob: .6 });
  ctx.restore();
}

// 镜4 挨个打电话 (36–52): the phone calls, circles like a waxing moon; the last one wanes
const CALLS = [
  { id: 'biaoge', at: 3.3, bg: '#5F6F95', scene: 'car' },
  { id: 'biaojie', at: 6.2, bg: '#7C86A8', scene: 'office' },
  { id: 'xmei', at: 7.6, bg: '#8FA3B8', scene: 'station' },
  { id: 'biaodi', at: 9.3, bg: '#4F5A86', scene: 'lantern' },
  { id: 'tangjie', at: 10.7, bg: '#9DB4D0', scene: 'airport' },
  { id: 'ayuan', at: 12.2, bg: '#34466E', scene: 'rain' },
];
function callPos(i) { const a = lerp(-2.62, -.52, i / 5); return [960 + Math.cos(a) * 690, 930 + Math.sin(a) * 690]; }
function S4(lt, t) {
  const z = kf(lt, [[9, 1.14], [12, 1.0]], ease);
  camBegin(960, kf(lt, [[9, 600], [12, 540]], ease), z);
  // the hall: plaster wall, a painted scroll (plum blossoms), a lattice screen, the long bench
  seed('hallwall'); shape(rectPts(-300, -300, 2520, 1700), { fill: '#EADDC4', ink: null, curv: 0, wob: 2 });
  shape(rectPts(-300, 820, 2520, 400), { fill: '#9C6B47', ink: null, curv: 0 });
  line([[-300, 820], [2220, 820]], 3, PAL.ink, {});
  for (const x of [150, 1770]) lattice(x - 110, 170, 220, 520, .4, { n: 3 });
  seed('scroll'); shape(rectPts(880, 110, 160, 360), { fill: '#F4EDDC', sw: 2, curv: 0 });
  line([[900, 440], [950, 300], [990, 200]], 3, '#5B3A2A', {}); for (let i = 0; i < 6; i++) shape(ellPts(920 + i * 14, 400 - i * 38, 7, 7, 6), { fill: '#E0505A', ink: null, flat: 1 });
  shape(rectPts(870, 100, 180, 12), { fill: PAL.wood, sw: 2, curv: 0 }); shape(rectPts(870, 468, 180, 12), { fill: PAL.wood, sw: 2, curv: 0 });
  // the bench
  seed('bench'); shape(rrPts(520, 880, 880, 44, 10), { fill: '#7B4A34', sw: 2.4, rim: true, rimCol: PAL.gold }); line([[560, 924], [560, 1060]], 14, '#6A3E2C', {}); line([[1360, 924], [1360, 1060]], 14, '#6A3E2C', {});
  // gugu with the phone, grandma leaning in
  const dial = seg(lt, .6, 1.4);
  const freeze = seg(lt, 14.6, 15.2);
  const gugu = { x: 820, y: 1080, k: 4.6, t, sit: true, face: .35 + freeze * .1, look: [.8, -.2 + dial * -.6], mouth: lt > 3.4 && lt < 14.5 ? 'grin' : 'smile',
    handR: [15, -84], bendR: 1, holdR: (k, LW) => { ctx.save(); ctx.translate(2, -4); ctx.scale(1 / 4.6, 1 / 4.6); phone(90, dial, { key: 'gugu', icon: lt > 13.2 ? null : null }); ctx.restore(); } };
  P('gugu', gugu);
  const lean = ease(seg(lt, .8, 1.6)) * .08;
  P('nai', { x: 1110, y: 1080, k: 4.6, t, sit: true, face: -.35, lean: -lean, look: [-.5, -.8], eyes: lt > 3.4 && lt < 14.6 && (lt % 3 > 1.4) ? 'happy' : 'open',
    mouth: freeze > .5 ? 'flat' : lt > 3.4 ? 'grin' : 'smile', brows: freeze * .9, blush: .4 - freeze * .2 });
  // call circles
  CALLS.forEach((c, i) => {
    if (lt < c.at) return;
    const [x, y] = callPos(i), k = backOut(seg(lt, c.at, c.at + .45)), r = 118 * k;
    if (r < 1) return;
    // thin line to the phone
    line([[1000, 700], [x, y + r]], 2, rgba(PAL.gold, 1), { alpha: .35 * seg(lt, c.at, c.at + .5), double: false });
    callCircle(c, x, y, r, lt - c.at, t, lt);
  });
  camEnd();
  if (lt < .8) { iris(960, 540, lerp(0, 1400, easeOut(seg(lt, 0, .8)))); }
}
function callCircle(c, x, y, r, age, t, lt) {
  seed('circle' + c.id);
  glow(x, y, r * 1.6, '#FFE3A0', .25);
  ctx.save(); tracePath(ellPts(x, y, r, r, 36), true, 1); ctx.clip();
  shape(rectPts(x - r - 10, y - r - 10, r * 2 + 20, r * 2 + 20), { fill: c.bg, ink: null, curv: 0, sc: .8 });
  const s = r / 118, px = x, py = y + 318 * s, k = 3.6 * s;
  const sc = c.scene;
  if (sc === 'car') { seed('car-bg'); shape(ellPts(x + 70 * s, y + 90 * s, 90 * s, 90 * s, 20), { ink: '#2B2F3F', sw: 10 * s, wob: 1 }); shape(rectPts(x - r, y - r, r * 2, 50 * s), { fill: '#3E4A70', ink: null }); }
  if (sc === 'office') { seed('off-bg'); shape(rectPts(x + 30 * s, y - 20 * s, 110 * s, 80 * s), { fill: '#2E3448', sw: 2, curv: 0 }); shape(rectPts(x + 38 * s, y - 12 * s, 94 * s, 62 * s), { fill: '#8FB6D8', ink: null, flat: 1 }); }
  if (sc === 'station') { seed('st-bg'); shape(rrPts(x - r, y - 60 * s, r * 2, 70 * s, 20 * s), { fill: '#F1EEE6', sw: 2 }); shape(rectPts(x - r, y - 30 * s, r * 2, 10 * s), { fill: '#3868B0', ink: null }); }
  if (sc === 'airport') { seed('ap-bg'); for (let i = 0; i < 3; i++) shape(rectPts(x - r + i * 90 * s, y - r, 70 * s, r * 1.2), { fill: '#C9DBEE', sw: 2, curv: 0 }); }
  if (sc === 'rain') { seed('rain-bg' + BF); for (let i = 0; i < 26; i++) { const rx = x - r + hash('rx', i) * r * 2, ry = y - r + ((hash('ry', i) + t * 1.4) % 1) * r * 2; line([[rx, ry], [rx - 6 * s, ry + 22 * s]], 2 * s, '#9FB6DA', { alpha: .6, double: false }); } }
  // the person, acting on their line
  const wave = Math.sin(age * 9) * 6;
  const pose = { x: px, y: py, k, t, face: 0, blink: c.id + 'call' };
  if (c.id === 'biaoge') Object.assign(pose, { mouth: 'grin', nod: Math.sin(age * 7) * 1.2 * (age < 2 ? 1 : 0), handR: [16 + wave * .2, -96], holdR: openHand(), eyes: 'happy', bendR: 1 });
  if (c.id === 'biaojie') Object.assign(pose, { mouth: 'grin', handR: [14, -90], holdR: thumbUp(), bendR: 1 });
  if (c.id === 'xmei') Object.assign(pose, { mouth: 'grin', eyes: 'happy', handL: [-12, -90], handR: [12, -90], holdR: (kk, LW) => { ctx.save(); ctx.translate(-12, -4); shape(rrPts(-9, -8, 18, 10, 2), { fill: '#C63B33', sw: LW, wob: .2 }); line([[-9, -5], [9, -5]], .8, PAL.gold, { double: false }); ctx.restore(); } });
  if (c.id === 'biaodi') Object.assign(pose, { mouth: 'grin', handR: [16, -84], holdR: (kk, LW) => { ctx.save(); ctx.scale(1 / kk * s, 1 / kk * s); rabbitLantern(20, 60, 60, 1, { key: 'call', wheels: false }); ctx.restore(); } });
  if (c.id === 'tangjie') Object.assign(pose, { mouth: 'grin', face: .4, lean: .14, walk: age * 2.2, handR: [18, -58], holdR: (kk, LW) => { shape(rrPts(0, -2, 10, 16, 2), { fill: '#3D4B6E', sw: LW, wob: .2 }); } });
  if (c.id === 'ayuan') {
    const shake = age > 2.3 ? Math.sin((age - 2.3) * 12) * .35 * (1 - seg(age, 2.3, 3.4)) : 0;
    const showPhone = age < 2.3;
    Object.assign(pose, { mouth: age > 1 ? 'sad' : 'soft', brows: .9, eyes: age > 2.4 ? 'down' : 'open', face: shake,
      handR: showPhone ? [6, -96] : [2, -84], handL: showPhone ? [-12, -60] : [-2, -84], bendR: 1, bendL: -1,
      holdR: showPhone ? (kk, LW) => { ctx.save(); ctx.translate(0, -8); ctx.scale(1 / kk * s * 1.1, 1 / kk * s * 1.1); phone(80, 1, { key: 'ay', icon: 'train', cross: ease(seg(age, .6, 1.1)) }); ctx.restore(); } : undefined });
  }
  P(c.id, pose);
  ctx.restore();
  shape(ellPts(x, y, r, r, 36), { ink: PAL.gold, sw: 5, wob: .8, rim: true, rimCol: PAL.red });
  // the last circle wanes like the moon, then goes out
  if (c.id === 'ayuan' && age > 2.6) {
    const w = ease(seg(age, 2.6, 3.6));
    ctx.save(); tracePath(ellPts(x, y, r + 4, r + 4, 36), true, 1); ctx.clip();
    shape(ellPts(x + r * 2.1 - w * r * 1.95, y, r * 1.05, r * 1.05, 36), { fill: '#1E2548', ink: null, wob: .5 });
    ctx.restore();
    if (age > 3.4) shape(ellPts(x, y, r, r, 36), { fill: '#1E2548', ink: null, alpha: ease(seg(age, 3.4, 3.9)) * .9 });
  }
}

// 镜5 第十六个 (52–60): the last mooncake wrapped in red cloth; grandma at the window, a cloud over the moon
function S5(lt, t) {
  setLight(kitchenLight, .06);
  if (lt < 4) {
    camBegin(960, 560, 1);
    kitchenBack(t, { window: [1290, 90, 380, 300], moonIn: [1480, 200, 44], shelfX: 60 });
    const reach = ease(seg(lt, .3, 1)), toCloth = ease(seg(lt, 1, 1.6)), wrap = ease(seg(lt, 1.7, 2.7)), pocket = ease(seg(lt, 2.8, 3.6));
    // grandma, the pocket at her right hip
    const bx = lerp(lerp(1515, 1200, toCloth), 760, pocket), by = lerp(lerp(990, 1010, toCloth), 820, pocket);
    const handTarget = [(bx - 960) / 6.4, (by - 1150) / 6.4 - 2];
    P('nai', { x: 960, y: 1150, k: 6.4, t, face: .12, look: [.5, 1], eyes: 'down', mouth: 'soft', brows: .4,
      handR: reach > 0 && pocket < 1 ? handTarget : undefined, bendR: 1, handL: [-12, -40], blink: 'w' });
    counterTop(930);
    tray(1180, 950, 520, 220);
    for (let i = 0; i < 15; i++) mooncake(1240 + (i % 4) * 128, 990 + Math.floor(i / 4) * 50, 40, { sq: .4, key: 'k' + i, sw: 1.6 });
    if (toCloth < 1) mooncake(bx, by, 40, { sq: .4, key: 'k15', sw: 1.8, rim: true });
    // the red cloth, folding around it
    seed('cloth');
    if (wrap < 1) { const s = lerp(150, 60, wrap); shape([[1200 - s, 1020], [1200, 1020 - s * .55], [1200 + s, 1020], [1200, 1020 + s * .45]], { fill: '#C9302C', sw: 2.4, rim: true, rimCol: PAL.gold, curv: .2 }); if (toCloth >= 1) mooncake(1200, 1010, 40, { sq: .4, key: 'k15', sw: 1.8 }); }
    if (wrap > .7) bundle(bx, by, 52);
    camEnd();
  } else {
    const z = kf(lt, [[4, 1], [8, 1.12]], ease);
    camBegin(1100, 480, z);
    kitchenBack(t, { window: [1080, 110, 560, 460], moonIn: [1350, 330, 90], shelf: false, cloudIn: () => cloud(lerp(1000, 1330, ease(seg(lt, 4.6, 7.2))), 350, 300, '#5B6690', { key: 'c5', alpha: .95 }) });
    const sigh = Math.sin(seg(lt, 6.4, 7.6) * Math.PI);
    P('nai', { x: 760, y: 1080, k: 7.2, t, face: .8, look: [1, -.8], tilt: -.08 + sigh * .05, dy: sigh * 1.2, sq: sigh * .02, eyes: lt > 6.8 && lt < 7.3 ? 'closed' : 'open', mouth: 'soft', brows: .7, handL: [-3, -44], handR: [4, -44], blink: 'win' });
    // the bundle's shape under the pocket
    camEnd();
    shade(960, 540, 1300, '#1B2142', .25);
  }
  if (lt < .6) overlayShot(shotAt(t) - 1, t, 1 - ease(seg(lt, 0, .6)));
}

// 镜6 远方 (60–68): a cold rented room, the same moon; he puts down his chopsticks, then runs
function S6(lt, t) {
  setLight('#5C79B8', .22);
  const [sx, sy] = shakeXY(lt, 6.5, 16);
  camBegin(960 - sx, 540 - sy, 1);
  seed('room'); shape(rectPts(-100, -100, 2120, 1300), { fill: '#AEB8CF', ink: null, curv: 0 });
  shape(rectPts(-100, 860, 2120, 400), { fill: '#6E7897', ink: null, curv: 0 }); line([[-100, 860], [2020, 860]], 3, PAL.ink, {});
  // the window: city lights and the moon
  windowWithMoon(1100, 120, 500, 420, t, { moonIn: [1350, 330, 90], winSky: '#1E2A55' });
  ctx.save(); tracePath(rectPts(1100, 120, 500, 420), true, 0); ctx.clip(); seed('cityw');
  for (let i = 0; i < 6; i++) tower(1080 + i * 90, 560, 80, 120 + hash('tw', i) * 160, '#2A3560', t);
  ctx.restore();
  // the door at the right
  const slam = seg(lt, 6.3, 6.5), open = ease(seg(lt, 5.5, 5.9)) * (1 - slam);
  seed('door'); shape(rectPts(1700, 330, 240, 530), { fill: '#1C2240', sw: 3, curv: 0 });
  shape(rectPts(1700, 330, 240 * (1 - open * .8), 530), { fill: '#8C6A58', sw: 3, curv: 0, rim: true, rimCol: PAL.gold });
  // the hanging lamp, swinging after the slam
  const swing = spring(lt, 6.5, 1.1, 1.2) * .5;
  ctx.save(); ctx.translate(700, -40); ctx.rotate(swing); line([[0, 0], [0, 260]], 3, PAL.ink, { double: false });
  shape([[-60, 300], [60, 300], [30, 250], [-30, 250]], { fill: '#E5D38E', sw: 2.4 }); glow(0, 320, 260, '#FFE9A8', .3 * (1 - seg(lt, 7.3, 8))); ctx.restore();
  // the desk, the instant noodles
  seed('desk'); shape(rectPts(300, 700, 700, 30), { fill: '#8B6B55', sw: 2.4, curv: 0 }); line([[330, 730], [330, 880]], 14, '#6B5040', {}); line([[970, 730], [970, 880]], 14, '#6B5040', {});
  shape([...arcPts(560, 690, 70, 0, Math.PI, 10, 40), [490, 690]], { fill: '#F2F0EA', sw: 2.2, rim: true, rimCol: PAL.red });
  shape(ellPts(560, 690, 70, 16, 14), { fill: '#E7B46B', sw: 2 });
  for (let i = 0; i < 3; i++) line([[540 + i * 16, 668 - ((t * .5 + i * .3) % 1) * 80], [548 + i * 16, 630 - ((t * .5 + i * .3) % 1) * 80]], 2, '#FFFFFF', { alpha: .35 });
  const down = ease(seg(lt, 2.2, 2.7)), up = ease(seg(lt, 4.2, 4.7));
  const run = seg(lt, 4.9, 6.3);
  const ax = lerp(760, 1960, easeIn(run)), grab = lt > 4.6;
  if (!grab) backpack(1000, 870, 110);
  const pose = up < 1 ? { sit: up < .5, x: 760, y: 900, k: 4.2, face: .45, dy: -up * 6 } : { x: ax, y: 900, k: 4.2, walk: lt * 2.6, stride: 11, face: .8, lean: .12 };
  P('ayuan', { ...pose, t, look: down > .5 ? [1, -.7] : [0, .8], eyes: lt > 4.1 && lt < 4.4 ? 'wide' : 'open', mouth: lt > 4.3 ? 'flat' : 'soft', brows: lt > 4.2 ? -.5 : .6,
    handR: up < 1 ? (down < 1 ? [14, -60 - (1 - down) * 8] : [16, -50]) : [22, -58], bendR: 1,
    holdR: up < 1 && down < 1 ? (k, LW) => { line([[0, 0], [14, -10]], .8, '#C9A56E', { double: false }); line([[1, 1], [15, -8]], .8, '#C9A56E', { double: false }); } : grab ? (k, LW) => { ctx.save(); ctx.scale(1 / 4.2, 1 / 4.2); backpack(10, 60, 110); ctx.restore(); } : undefined,
    handL: up < 1 ? [-10, -52] : [-16, -62] });
  if (up < 1) chair(760, 900, 70, '#7A6A5C', { key: 'ay', back: '#7A6A5C', seat: '#8A7A6C' });
  camEnd();
  if (lt < .5) overlayShot(shotAt(t) - 1, t, 1 - seg(lt, 0, .5));
  // the lamp swings into darkness
  if (lt > 7) fillScreen('#141832', ease(seg(lt, 7, 7.9)));
}

// ═════════ Act II · 归 ═════════

// 镜7 归途长卷 (68–98): one handscroll, the camera only pans right; the moon follows
const SCROLL_X = [[0, 900], [4, 1900], [8, 2950], [12, 4000], [16, 5000], [20, 6000], [24, 7050], [27, 8050], [30, 9200]];
const scrollCam = lt => lt < 24 ? kf(lt, SCROLL_X, k => k) : kf(lt, [[24, 7050], [27, 8050]], k => k) + (lt > 27 ? easeOut(seg(lt, 27, 30)) * 1150 : 0);
function S7(lt, t) {
  const camX = scrollCam(lt);
  setLight('#3A4880', .18);
  camBegin(camX, 540, 1);
  seed('scroll-sky'); shape(rectPts(camX - 1020, -40, 2040, 1200), { fill: '#27305E', ink: null, curv: 0, wob: 0 });
  // the moon keeps pace with the traveller (月亮跟着走)
  moon(camX + 460, 220, 70, { key: 'follow', glow: 1.1 });
  mountains(camX, t);
  // one continuous ground under the whole scroll
  seed('scroll-ground'); shape(rectPts(camX - 1020, 905, 2040, 300), { fill: '#2E3862', ink: null, curv: 0, wob: 1 });
  line([[camX - 1020, 905], [camX + 1020, 905]], 2, '#4A5688', { alpha: .6, double: false });
  cityScene(lt, t, camX); trainScene(lt, t, camX); skyScene(lt, t, camX); highwayScene(lt, t, camX); villageScene(lt, t, camX); greenTrainScene(lt, t, camX); homeScene(lt, t);
  camEnd();
  // the scroll unrolls from the left
  if (lt < 1.4) {
    const ux = lerp(-80, W + 120, easeIO(seg(lt, 0, 1.3)));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#141832'; ctx.fillRect(ux, 0, W - ux + 200, H);
    seed('roller'); shape(rrPts(ux - 40, -30, 80, H + 60, 30), { fill: '#C9A26A', sw: 4, rim: true, rimCol: PAL.red });
    for (const y of [-10, H - 20]) shape(rrPts(ux - 52, y, 104, 30, 10), { fill: '#6E3B26', sw: 3 });
    ctx.restore();
  }
  // into the lit window of home
  if (lt > 29.2) iris(960 + (HOME_X + 85 - camX), 612, lerp(1500, 0, easeIn(seg(lt, 29.2, 30))));
}
const HOME_X = 9200;
function mountains(camX, t) {
  for (const [par, col, y0, amp, key, ph] of [[.2, '#303B6A', 650, 150, 'm1', 0], [.45, '#3B4878', 720, 100, 'm2', 2]]) {
    seed(key);
    const shift = camX * (1 - par), u0 = Math.floor((camX * par - 1150) / 90) * 90, P = [];
    for (let j = 0; j <= 27; j++) { const u = u0 + j * 90; P.push([u + shift, y0 - Math.abs(Math.sin(u * .0028 + ph)) * amp - Math.sin(u * .013 + ph) * amp * .25]); }
    shape([...P, [P[P.length - 1][0], 1200], [P[0][0], 1200]], { fill: col, ink: null, wob: .8, curv: 1 });
  }
}
// 68–72: the office tower; lights go out floor by floor; she shuts the laptop and runs
function cityScene(lt, t, camX) {
  if (lt > 8) return;
  const off = seg(lt, .4, 2.4), ox = 900;
  for (const [x, w, h, c] of [[-400, 260, 520, '#3A4775'], [-120, 200, 380, '#465384'], [880 + ox, 240, 460, '#3A4775'], [1140 + ox, 220, 340, '#465384'], [1380 + ox, 260, 420, '#3A4775']]) tower(x, 905, w, h, c, t);
  tower(420 + ox, 905, 420, 640, '#4B5A8C', t, { lightOff: (r, c) => r < 8 ? off * 1.15 - (7 - r) * .02 : 0 });
  const shut = ease(seg(lt, 2.1, 2.4)), leave = seg(lt, 2.5, 3.0);
  seed('herwin'); shape(rectPts(470 + ox, 420, 320, 200), { fill: '#FFE3A6', sw: 2.4, curv: 0 });
  glow(630 + ox, 520, 260, '#FFC46B', .35 * (1 - leave));
  ctx.save(); tracePath(rectPts(470 + ox, 420, 320, 200), true, 0); ctx.clip();
  if (leave < 1) P('biaojie', { x: 600 + ox + leave * 200, y: 700, k: 2.2, t, sit: leave < .2, face: .3, eyes: shut > .5 ? 'happy' : 'open', mouth: shut > .5 ? 'grin' : 'flat', handR: [16, -46], handL: [8, -46] });
  seed('laptop'); shape([[660 + ox, 610], [740 + ox, 610], [730 + ox, 600], [670 + ox, 600]], { fill: '#8A8FA0', sw: 1.6 });
  shape([[670 + ox, 600], [730 + ox, 600], [735 + ox, 600 - (1 - shut) * 50], [675 + ox, 600 - (1 - shut) * 50]], { fill: '#AFC8E6', sw: 1.6 });
  ctx.restore();
  shape(rectPts(470 + ox, 420, 320, 200), { ink: PAL.ink, sw: 3, curv: 0 });
  seed('rev'); shape(rrPts(560 + ox, 805, 140, 100, 10), { fill: '#9FB6DA', sw: 2.4 });
  if (lt > 3.0) { const rk = seg(lt, 3.0, 6.5); P('biaojie', { x: lerp(630 + ox, camX + 1150, easeIn(rk) * .7 + rk * .3), y: 915, k: 2.4, t, walk: lt * 2.6, stride: 11, face: .8, lean: .16, mouth: 'grin', handR: [18, -64], handL: [-18, -60],
    holdL: (k, LW) => shape(rrPts(-6, -2, 12, 20, 3), { fill: '#3B3E48', sw: LW, wob: .2 }) }); }
}
// 72–76: the bullet train keeps pace with the camera
function trainScene(lt, t, camX) {
  if (lt < 2.5 || lt > 16) return;
  seed('viaduct'); shape(rectPts(1900, 740, 2600, 26), { fill: '#8C92AE', sw: 2, curv: 0 });
  for (let i = 0; i < 13; i++) shape([[1940 + i * 200, 766], [1990 + i * 200, 766], [1980 + i * 200, 905], [1950 + i * 200, 905]], { fill: '#7A809C', sw: 2, curv: 0 });
  const tx = camX - 900 - (1 - easeOut(seg(lt, 3.6, 5.3))) * 1900 + easeIn(seg(lt, 8, 11)) * 2600;
  bulletTrain(tx, 630, 1500, t, { window: 5, inWindow: (wx, wy) => {
    shape(rectPts(wx, wy, 84, 36), { fill: '#FFE9B8', ink: null, flat: 1 });
    shape(ellPts(wx + 64, wy + 12, 8, 8, 10), { fill: '#FFF4D6', ink: null, flat: 1, alpha: .8 });
    P('xmei', { x: wx + 34, y: wy + 94, k: .9, t, face: .6, look: [1, -.6], eyes: 'open', mouth: 'smile', handL: [-2, -58], handR: [8, -58],
      holdR: (k, LW) => { shape(rrPts(-9, -8, 16, 9, 1), { fill: '#C63B33', sw: LW, wob: .1 }); } });
  } });
}
// 76–80: a plane crosses the moon; she sleeps against the window
function skyScene(lt, t, camX) {
  if (lt < 6 || lt > 19) return;
  cloud(3000, 470, 420, '#4A5688', { key: 'sc1', sw: 2 }); cloud(3700, 520, 520, '#56629A', { key: 'sc2', sw: 2 }); cloud(3400, 380, 300, '#4A5688', { key: 'sc3', sw: 2 }); cloud(4300, 450, 380, '#4A5688', { key: 'sc4', sw: 2 });
  const px = lerp(camX + 1250, camX - 400, seg(lt, 7.6, 12.4));
  if (lt > 7.4 && lt < 12.6) plane(px, 240, 1.25, { col: '#E6E2EE', window: 5, inWindow: (wx, wy) => {
    shape(ellPts(wx, wy, 7, 8, 10), { fill: '#FFE9B8', ink: null, flat: 1 });
    shape(ellPts(wx + 1, wy + 3, 4.4, 5, 10), { fill: '#2E2321', ink: null, flat: 1 }); shape(ellPts(wx + 2, wy + 4, 3, 3.6, 10), { fill: PAL.skin, ink: null, flat: 1 });
    line(arcPts(wx + 2.5, wy + 3.5, 1, .3, Math.PI - .3, 4), .5, PAL.ink, { double: false }); line([[wx - 2.5, wy], [wx + 4, wy - 2.5]], .9, '#C62F33', { double: false });
  } });
  if (lt > 9 && lt < 11.4) { for (let i = 0; i < 3; i++) { const k = ((lt - 9) * .8 + i * .33) % 1; seed('zz' + i); line(arcPts(px - 30 + k * 30, 220 - k * 70, 6 + i * 2, 0, Math.PI * 1.4, 5), 2, '#EDE3F0', { alpha: 1 - k }); } }
}
// 80–88: the jam, his honk, then the traffic moves (and keeps pace)
function highwayScene(lt, t, camX) {
  if (lt < 10 || lt > 27) return;
  seed('road'); shape(rectPts(3600, 820, 3400, 170), { fill: '#3B4163', sw: 2, curv: 0 });
  for (let i = 0; i < 54; i++) shape(rectPts(3620 + i * 64, 900, 36, 7), { fill: '#E8D9A8', ink: null, flat: 1 });
  const go = lt > 16 ? scrollCam(lt) - scrollCam(16) : 0, exit = Math.pow(seg(lt, 19.5, 22), 2) * 2400;
  const move = go * ease(seg(lt, 16, 16.8)) + exit;
  const cars = [[4040, '#7C88B0'], [4270, '#B25B4E'], [4830, '#6E8E7C'], [5060, '#8C7FA8'], [5290, '#A7A2B8'], [5520, '#6F7A9E'], [3810, '#8C7FA8']];
  cars.forEach(([x, c], i) => car(x + move, 895, 1.1, c, { key: 'hc' + i, brake: lt < 16.3 ? .8 + .2 * Math.sin(t * 3 + i) : .1 }));
  const hx = 4560 + move, honk = lt > 13 && lt < 13.6;
  car(hx, 895, 1.25, '#E8E1CF', { key: 'his', rim: PAL.red, brake: lt < 16.3 ? .9 : 0, bounce: honk ? Math.sin(t * 60) * 1.5 : 0, inside: () => {
    gift(-20, -54, 26, 26, '#C63B33', 'a'); gift(10, -54, 22, 30, '#3E6C8E', 'b'); gift(40, -54, 26, 22, '#E8A33A', 'c'); gift(-4, -78, 18, 18, '#5E9E8C', 'd');
    P('biaoge', { x: 50, y: -8, k: .62, t, face: .6, mouth: honk ? 'o' : lt > 16.3 ? 'grin' : 'flat', eyes: lt > 16.3 ? 'happy' : 'open', brows: lt < 13 ? .5 : 0 });
  } });
  seed('rack'); gift(hx - 20, 785, 70, 40, '#C63B33', 'r1'); gift(hx + 52, 785, 60, 34, '#E8A33A', 'r2');
  if (honk) { for (let i = 0; i < 3; i++) { seed('honk' + i); line(arcPts(hx + 150, 855, 30 + i * 18, -.6, .6, 6), 3, '#FFE9A8', { alpha: .8 }); } }
}
// 88–92: the lane through the rice fields; the rabbit lantern hops over a pothole
function villageScene(lt, t, camX) {
  if (lt < 16 || lt > 30) return;
  seed('fields'); shape(rectPts(5900, 780, 1800, 420), { fill: '#3F5E5A', ink: null, curv: 0 });
  for (let i = 0; i < 46; i++) line([[5900 + i * 38, 800], [5880 + i * 38, 1080]], 2, '#56776B', { alpha: .6, double: false });
  shape(rectPts(5900, 875, 1800, 60), { fill: '#8A7C66', sw: 2, curv: 0 });
  for (let i = 0; i < 30; i++) { const fx = 5950 + hash('ff', i) * 1700, fy = 700 + hash('fy', i) * 160, tw = .5 + .5 * Math.sin(t * 3 + i * 1.7); glow(fx, fy, 18, '#E9FF9A', .4 * tw); }
  if (lt < 19 || lt > 26) return;
  const ex = camX - 120 - (1 - easeOut(seg(lt, 19, 20.6))) * 1300 + Math.pow(seg(lt, 22.9, 24.4), 2) * 2000;
  const bump = hop(lt, 21.8, 22.15, 26);
  const by = lt > 21.6 && lt < 22.3 ? Math.sin(seg(lt, 21.6, 21.9) * Math.PI) * -6 : 0;
  seed('ebike'); ctx.save(); ctx.translate(ex, 905 + by);
  for (const wx of [-70, 70]) shape(ellPts(wx, -22, 26, 26, 14), { fill: '#2A2E3A', sw: 2.4 });
  shape([[-70, -22], [-20, -60], [60, -60], [70, -22]], { ink: '#C9443A', sw: 7, curv: 0 });
  shape(rrPts(-50, -76, 70, 16, 6), { fill: '#3A3E4E', sw: 2 });
  ctx.restore();
  rabbitLantern(ex - 50, 905 - 70 + bump.dy + by, 42, 1, { key: 'bike', wheels: false });
  P('biaodi', { x: ex + 10, y: 905 - 30 + by, k: 2.2, t, sit: true, face: .7, lean: .08, mouth: lt > 22 && lt < 23.2 ? 'o' : 'grin', eyes: lt > 22 && lt < 22.8 ? 'wide' : 'open', handR: [26, -44], handL: [20, -46] });
}
// 92–95: the slow green train; he dozes standing, a jolt wakes him, he sees the moon and smiles
function greenTrainScene(lt, t, camX) {
  if (lt < 19 || lt > 30) return;
  seed('gtrack'); shape(rectPts(6600, 895, 2400, 16), { fill: '#6D6A7C', sw: 2, curv: 0 });
  if (lt < 23.2) return;
  const follow = Math.min(camX, scrollCam(27)) - 820 - (1 - easeOut(seg(lt, 23.3, 24.9))) * 1900;
  const jolt = spring(lt, 25.2, 3, 4) * 6;
  ctx.save(); ctx.translate(follow, 895); ctx.scale(1.35, 1.35); ctx.translate(-follow, -895);
  greenTrain(follow, 700 + jolt * .3, 1250);
  const vx = follow + 560;
  seed('vest'); shape(rectPts(vx, 716 + jolt * .3, 160, 150), { fill: '#FFE3A6', sw: 2.4, curv: 0 });
  glow(vx + 80, 790, 150, '#FFC46B', .35);
  const woke = lt > 25.25, smile = lt > 26;
  P('ayuan', { x: vx + 80 + jolt, y: 866, k: 1.3, t, face: woke ? .7 : .2, tilt: woke ? -.05 : .25, look: woke ? [1, -1] : [0, 0], eyes: woke ? (smile ? 'happy' : 'wide') : 'closed', mouth: smile ? 'smile' : woke ? 'o' : 'flat',
    handL: [-4, -56], handR: [6, -58], holdR: (k, LW) => { ctx.save(); ctx.scale(1 / 1.3 * .5, 1 / 1.3 * .5); backpack(-4, 30, 60); ctx.restore(); } });
  ctx.restore();
}
// 95–98: every road leads to the red gate of home
function homeScene(lt, t) {
  if (lt < 24) return;
  const X = HOME_X - 550;
  seed('home'); shape(rectPts(X, 560, 1100, 345), { fill: '#D9D2C4', sw: 2.4, curv: 0 });
  roof(X + 550, 560, 1220, 120, { col: '#4B5378' });
  shape(rectPts(X + 480, 660, 140, 245), { fill: '#B8362E', sw: 2.6, curv: 0, rim: true, rimCol: PAL.gold });
  line([[X + 550, 660], [X + 550, 905]], 2.4, '#7E2A2C', {});
  shape(rectPts(X + 590, 580, 90, 64), { fill: '#FFE3A6', sw: 2, curv: 0 }); glow(X + 635, 612, 160, '#FFB85C', .45);
  lantern(X + 440, 640, 34, 1, Math.sin(t * 2) * .05 + spring(lt, 27.6, 1.6, 2) * .2, { key: 'home1' }); lantern(X + 660, 640, 34, 1, Math.sin(t * 2 + 1) * .05, { key: 'home2' });
  line([[X - 900, 905], [X + 550, 905]], 5, '#8A7C66', { alpha: .8 }); line([[X - 900, 960], [X + 450, 908]], 4, '#6D6A7C', { alpha: .8 }); line([[X - 900, 1030], [X + 500, 910]], 4, '#8A7C66', { alpha: .7 });
}

// ═════════ Act II · 厨房 & 进门 ═════════
function S8(lt, t) {
  setLight(kitchenLight, .08);
  const cx = kf(lt, [[7, 840], [8.2, 1900]], easeIO);
  camBegin(cx, 600, 1);
  kitchenBack(t, { window: [1180, 90, 360, 260], moonIn: [1400, 180, 36], x0: -300, x1: 2900, shelfX: 2350 });
  // the stove and steamers (left)
  seed('stove'); shape(rectPts(100, 640, 520, 360), { fill: '#C9B8A0', sw: 2.6, curv: 0, rim: true, rimCol: PAL.red });
  const lid = ease(seg(lt, .3, .7));
  for (let i = 0; i < 2; i++) shape(rrPts(250, 520 - i * 70 + (i === 1 ? -lid * 110 : 0), 220, 70, 16), { fill: '#D9B36B', sw: 2.4, rim: true, rimCol: PAL.gold });
  if (lt > .5) { const k = seg(lt, .5, 3); seed('steam'); for (let i = 0; i < 9; i++) { const sk = (k * 1.6 + i * .11) % 1; shape(ellPts(360 + Math.sin(i * 2 + sk * 4) * 60 + (i - 4) * 10, 500 - sk * 260, 40 + sk * 60, 30 + sk * 40, 10), { fill: '#FFF8EC', ink: null, alpha: (1 - sk) * .7 * (1 - seg(lt, 2.4, 3)), flat: 1 }); } }
  const fog = seg(lt, .7, 1.1) * (1 - seg(lt, 2.4, 2.9));
  P('dabo', { x: 460, y: 1000, k: 4.4, t, face: .2, mouth: fog > .5 ? 'o' : 'smile', fog, handR: [16, -104 - lid * 10], handL: [-10, -60], bendR: 1,
    holdR: (k, LW) => { if (lid > .1) { shape(rrPts(-24, -4, 48, 12, 4), { fill: '#D9B36B', sw: LW, wob: .2 }); } } });
  // the chopping table
  seed('ctable'); shape(rectPts(700, 780, 520, 30), { fill: '#A0714E', sw: 2.4, curv: 0 }); line([[730, 810], [730, 1000]], 16, '#7A5238', {}); line([[1190, 810], [1190, 1000]], 16, '#7A5238', {});
  shape(ellPts(860, 772, 120, 22, 16), { fill: '#C79A6C', sw: 2.2 });
  const chopping = lt > 3 && lt < 4.6, chop = chopping ? Math.abs(Math.sin((lt - 3) * 4 * Math.PI)) : 0;
  const fed = lt > 5, chew = lt > 5.1;
  P('ershu', { x: 860, y: 1000, k: 4.4, t, face: fed ? .5 : 0, mouth: chew ? 'chew' : chopping ? 'flat' : 'smile', eyes: chew ? 'happy' : 'open', look: [0, .8], brows: chopping ? -.4 : 0,
    handR: [12, -84 - chop * 16], bendR: 1, holdR: (k, LW) => { shape([[0, -2], [10, -4], [10, 6], [0, 5]], { fill: '#C9CCD4', sw: LW * .8, wob: .1 }); }, handL: [-8, -68] });
  const feed = ease(seg(lt, 4.6, 5)) * (1 - ease(seg(lt, 5.1, 5.5)));
  P('ershen', { x: 1080, y: 1000, k: 4.3, t, face: -.4, look: [-1, 0], eyes: fed ? 'happy' : 'open', mouth: fed ? 'grin' : 'smile',
    handL: [lerp(-8, -30, feed), lerp(-70, -92, feed)], bendL: -1, handR: [6, -68], holdL: feed > .1 ? (k, LW) => shape(ellPts(-2, -1, 3.4, 2.2, 8), { fill: '#F6EEDB', sw: LW * .7, wob: .1 }) : undefined });
  if (chopping) { seed('thud'); for (let i = 0; i < 3; i++) if (chop > .85) line([[880 + i * 20, 760], [890 + i * 26, 730]], 3, PAL.ink, { alpha: .6 }); }
  // the door; the carp; the basin; the laugh
  seed('kdoor'); shape(rectPts(1380, 400, 220, 600), { fill: '#2B2F4E', sw: 2.6, curv: 0 }); glow(1490, 700, 200, '#6A7AB8', .2);
  const xin = seg(lt, 6, 7), fishK = seg(lt, 7.2, 8.6);
  const xx = lerp(1420, 1640, ease(xin));
  const leap = lt > 7.2 && lt < 8.6;
  const react = lt > 7.2 ? 'wide' : 'open';
  P('xshu', { x: xx, y: 1000, k: 4.4, t, walk: xin > 0 && xin < 1 ? lt * 2.4 : undefined, stride: 6, face: .4, eyes: lt > 10 ? 'happy' : react, mouth: lt > 10 ? 'laugh' : lt > 7.2 ? 'o' : 'grin',
    handL: [-10, -62], handR: [12, -62], holdR: (k, LW) => { ctx.save(); ctx.translate(-12, 0); shape([...arcPts(0, -2, 16, 0, Math.PI, 10, 7), [-16, -2]], { fill: '#8FA9C4', sw: LW, wob: .2 }); if (lt < 7.2) { shape(ellPts(0, -4, 12, 3.6, 12), { fill: '#E07A3A', sw: LW * .8, wob: .2 }); } ctx.restore(); },
    sq: lt > 7.1 && lt < 7.5 ? .06 : 0 });
  // the carp in the air (arc), a twist mid-flight
  if (leap) {
    const [fx, fy] = arcPt([1640, 720], [2020, 760], 300, easeIO(fishK));
    carp(fx, fy, 80, fishK * TAU * .9 + Math.sin(lt * 20) * .2);
    if (fishK < .2) { seed('drops'); for (let i = 0; i < 6; i++) shape(ellPts(1640 + (i - 3) * 16, 700 - fishK * 300 - i * 6, 5, 7, 6), { fill: '#BFE3F2', ink: null, flat: 1, alpha: 1 - fishK * 5 }); }
  }
  const catchK = lt > 8.6, splash = seg(lt, 8.6, 9.2);
  P('xshen', { x: 2020, y: 1000, k: 4.3, t, face: -.3, eyes: catchK ? 'happy' : 'wide', mouth: catchK ? 'laugh' : 'o', lean: catchK ? spring(lt, 8.6, 2, 4) * .08 : -.05,
    handL: [-14, -72], handR: [12, -72], sq: catchK ? spring(lt, 8.6, 3, 5) * .08 : 0,
    holdR: (k, LW) => { ctx.save(); ctx.translate(-13, -2); shape([...arcPts(0, -2, 18, 0, Math.PI, 10, 9), [-18, -2]], { fill: '#D9C38C', sw: LW, wob: .2 }); if (catchK) { ctx.save(); ctx.scale(1 / 4.3, 1 / 4.3); carp(0, -40, 80, Math.sin(lt * 14) * .3); ctx.restore(); } ctx.restore(); } });
  if (splash > 0 && splash < 1) { seed('splash'); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .35, r = splash * 160; shape(ellPts(2020 + Math.cos(a) * r, 700 + Math.sin(a) * r, 8, 10, 6), { fill: '#BFE3F2', ink: null, alpha: 1 - splash, flat: 1 }); } }
  const slap = ease(seg(lt, 10.2, 10.5)) * (1 - ease(seg(lt, 10.8, 11.2)));
  P('dabom', { x: 2280, y: 1000, k: 4.3, t, face: -.5, eyes: lt > 8.8 ? 'happy' : 'open', mouth: lt > 8.8 ? 'laugh' : 'smile', dy: lt > 9 ? -Math.abs(Math.sin(lt * 7)) * 1.5 : 0, handL: [lerp(-12, -26, slap), lerp(-60, -86, slap)], bendL: -1 });
  const gout = seg(lt, 11, 14);
  P('gufu', { x: lerp(2500, 2900, gout), y: 1000, k: 4.4, t, walk: gout > 0 ? lt * 2 : undefined, stride: 6, face: .6, eyes: lt > 8.8 ? 'happy' : 'open', mouth: lt > 8.8 ? 'grin' : 'smile',
    handL: [-8, -70], handR: [14, -70], holdR: (k, LW) => { ctx.save(); ctx.translate(-10, -2); shape(ellPts(0, 0, 14, 4, 12), { fill: '#F2ECDF', sw: LW, wob: .2 }); shape(ellPts(0, -1.5, 8, 2.6, 10), { fill: '#E2572F', sw: LW * .7, wob: .2 }); ctx.restore(); } });
  camEnd();
  if (lt < .7) { iris(960, 540, lerp(0, 1400, easeOut(seg(lt, 0, .7)))); }
}
function carp(x, y, s, rot) {
  seed('carp'); ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  shape([[-s, 0], [-s * .5, -s * .32], [s * .3, -s * .3], [s * .75, -s * .1], [s * .8, s * .1], [s * .3, s * .3], [-s * .5, s * .3]], { fill: '#E07A3A', sw: 2.4, rim: true, rimCol: PAL.gold });
  shape([[-s * .85, 0], [-s * 1.35, -s * .4], [-s * 1.2, 0], [-s * 1.35, s * .4]], { fill: '#E8943F', sw: 2.2 });
  shape(ellPts(s * .5, -s * .06, s * .06, s * .06, 8), { fill: PAL.ink, ink: null, flat: 1 });
  for (let i = 0; i < 4; i++) line(arcPts(-s * .3 + i * s * .2, 0, s * .12, -1, 1, 5), 1.4, '#B8542A', { alpha: .6, double: false });
  ctx.restore();
}

// the gate from inside the courtyard (镜9, 镜12)
function gateSet(t, open, o = {}) {
  seed('gwall'); shape(rectPts(-300, -200, 2520, 1300), { fill: '#27305A', ink: null, curv: 0 });
  // outside: the lane, lanterns on the houses
  seed('lane'); shape(rectPts(740, 300, 440, 640), { fill: '#1E2548', ink: null, curv: 0 });
  shape([[740, 940], [1180, 940], [1040, 640], [880, 640]], { fill: '#3B4466', ink: null, wob: 1 });
  for (const [lx, ly] of [[800, 420], [1120, 470]]) lantern(lx, ly, 26, 1, Math.sin(t * 2 + lx) * .05, { key: 'lane' + lx });
  if (o.lane) o.lane();
  // wall and gate frame
  seed('gframe');
  shape([[-300, 170], [2220, 170], [2220, 960], [1180, 960], [1180, 300], [740, 300], [740, 960], [-300, 960]], { fill: '#CFC6B4', ink: PAL.ink, sw: 2.4, curv: 0 });
  roof(960, 170, 2600, 70, { col: '#4B5378', lift: 10 });
  roof(960, 290, 700, 120, { col: '#4B5378' });
  // door leaves (swing outward: they narrow as they open)
  const lw = 220 * (1 - open * .82);
  shape(rectPts(740, 300, lw, 640), { fill: '#B8362E', sw: 2.6, curv: 0, rim: true, rimCol: PAL.gold });
  shape(rectPts(1180 - lw, 300, lw, 640), { fill: '#B8362E', sw: 2.6, curv: 0, rim: true, rimCol: PAL.gold });
  if (open < .3) for (const [x, s] of [[740 + lw - 30, 1], [1180 - lw + 30, -1]]) { shape(ellPts(x, 620, 16, 16, 12), { ink: PAL.gold, sw: 5 }); shape(ellPts(x, 600, 7, 7, 8), { fill: PAL.gold, sw: 1.4 }); }
  // the ground inside
  seed('gfloor'); shape(rectPts(-300, 940, 2520, 300), { fill: '#6A6F8E', ink: null, curv: 0 });
  line([[-300, 940], [2220, 940]], 3, PAL.ink, {});
  glow(1500, 600, 700, '#FFB85C', .18);
}
function S9(lt, t) {
  setLight('#FFB070', .06);
  const z = kf(lt, [[10, 1], [14, 1.12]], ease);
  camBegin(lt > 10 ? 1000 : 1000, 600, z);
  const open = lt < 10.4 ? ease(seg(lt, .1, .8)) : 1 - ease(seg(lt, 12.4, 13.4));
  gateSet(t, open, { lane: () => {
    if (lt > 11.4 && lt < 12.6) { seed('leaves'); for (let i = 0; i < 4; i++) { const k = seg(lt, 11.4 + i * .15, 12.6); blossomLeaf(lerp(1180, 760, k), 900 - Math.sin(k * Math.PI) * 60 - i * 20, lt * 4 + i); } }
  } });
  // grandma waits by the door (right), turned toward it
  const hug = lt > 3.8 && lt < 5.8, gotLantern = lt > 7;
  const nx = 1360, lookBack = lt > 11 ? 1 : 0;
  // arrivals, one read at a time
  const walkIn = (t0, t1, x0, x1) => ({ x: lerp(x0, x1, easeOut(seg(lt, t0, t1))), walk: lt > t0 && lt < t1 ? lt * 2.2 : undefined });
  const exitAll = seg(lt, 10, 11.2);
  // biaoge: a teetering stack of gifts
  if (lt > .4 && exitAll < 1) {
    const w = walkIn(.4, 1.6, 960, 1180), wob = lt > 1.4 && lt < 2.8 ? Math.sin((lt - 1.4) * 8) * .2 * (1 - seg(lt, 1.4, 2.8)) : 0;
    P('biaoge', { ...w, x: w.x + exitAll * 900, walk: exitAll > 0 ? lt * 2.2 : w.walk, y: 1000, k: 4, t, face: .5, lean: wob * .4, eyes: wob ? 'wide' : 'happy', mouth: wob ? 'o' : 'grin',
      handL: [-10, -76], handR: [12, -76], holdR: (k, LW) => { ctx.save(); ctx.rotate(wob); ctx.scale(1 / 4, 1 / 4); for (let i = 0; i < 4; i++) gift(-40 + (i % 2) * 8, -i * 50, 90 - i * 8, 48, ['#C63B33', '#3E6C8E', '#E8A33A', '#5E9E8C'][i], 's' + i); ctx.restore(); } });
  }
  // xmei & biaojie rush in and hug her
  if (lt > 3 && exitAll < 1) {
    const w1 = walkIn(3, 3.8, 900, 1250), w2 = walkIn(3.1, 3.9, 1000, 1470);
    P('biaojie', { x: w2.x + exitAll * 900, y: 1000, k: 4, t, walk: w2.walk ?? (exitAll > 0 ? lt * 2.2 : undefined), face: -.3, eyes: 'happy', mouth: 'grin', handL: hug ? [-24, -70] : undefined, handR: hug ? [-8, -74] : undefined, flip: false });
    P('xmei', { x: w1.x + exitAll * 900, y: 1000, k: 4, t, walk: w1.walk ?? (exitAll > 0 ? lt * 2.2 : undefined), face: .4, eyes: 'happy', mouth: 'grin', handR: hug ? [26, -74] : undefined, handL: hug ? [8, -72] : undefined });
  }
  // grandma
  const sway = hug ? Math.sin((lt - 3.8) * 5) * .05 : 0;
  P('nai', { x: nx + exitAll * 0, y: 1000, k: 3.8, t, face: lookBack ? -.9 : -.4, look: lookBack ? [-1, 0] : [-.8, 0], lean: sway, eyes: hug || (lt > 1.6 && lt < 3) ? 'happy' : 'open', mouth: lookBack ? 'soft' : 'grin', brows: lookBack ? .6 : 0,
    handR: gotLantern && lt < 11.4 ? [14, -50] : undefined, holdR: gotLantern && lt < 11.4 ? (k, LW) => { ctx.save(); ctx.scale(1 / 3.8, 1 / 3.8); line([[0, 0], [0, 60]], 3, '#A0794A', {}); rabbitLantern(0, 130, 40, 1, { key: 'nai' }); ctx.restore(); } : undefined,
    handL: lt > 12.2 && lt < 13.4 ? [-20, -60] : undefined });
  // biaodi hands over the rabbit lantern; tangjie runs in with her suitcase
  if (lt > 5.8 && exitAll < 1) {
    const w = walkIn(5.8, 6.8, 960, 1150), give = ease(seg(lt, 6.6, 7));
    P('biaodi', { x: w.x + exitAll * 900, y: 1000, k: 4, t, walk: w.walk ?? (exitAll > 0 ? lt * 2.2 : undefined), face: .5, eyes: 'happy', mouth: 'grin', handR: [lerp(12, 30, give), lerp(-50, -56, give)],
      holdR: lt < 7 ? (k, LW) => { ctx.save(); ctx.scale(1 / 4, 1 / 4); line([[0, 0], [0, 50]], 3, '#A0794A', {}); rabbitLantern(0, 120, 40, 1, { key: 'bd' }); ctx.restore(); } : undefined });
  }
  if (lt > 7.8 && exitAll < 1) {
    const w = walkIn(7.8, 9.2, 900, 1700);
    P('tangjie', { x: w.x + exitAll * 900, y: 1000, k: 4, t, walk: w.walk ?? (exitAll > 0 ? lt * 2.2 : undefined), stride: 10, face: .6, lean: .1, eyes: 'happy', mouth: 'grin', handL: [-22, -40],
      holdL: (k, LW) => { ctx.save(); ctx.scale(1 / 4, 1 / 4); shape(rrPts(-60, 0, 70, 110, 14), { fill: '#3D4B6E', sw: 3, rim: true, rimCol: PAL.gold }); shape(ellPts(-40, 114, 8, 8, 8), { fill: '#222', ink: null, flat: 1 }); ctx.restore(); } });
  }
  camEnd();
  if (lt > 13.4) fillScreen('#141832', ease(seg(lt, 13.4, 14)));
}
function blossomLeaf(x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); shape(ellPts(0, 0, 14, 6, 8), { fill: '#C98A3A', sw: 1.6, wob: .4 }); line([[-12, 0], [12, 0]], 1, '#7A4A22', { double: false }); ctx.restore(); }

// ═════════ Act III · 圆 ═════════
// who sits where. Back row faces us (behind the table); front row shows their backs.
const BACK_ROW = ['gugu', 'dabo', 'dabom', 'ye', 'nai', null, 'ershu', 'ershen', 'tangjie'];
const FRONT_ROW = ['gufu', 'xshu', 'xshen', 'biaoge', 'biaojie', 'xmei', 'biaodi'];
const TABLE = { x: 960, y: 922, w: 1060 };
function backRowX(i) { return TABLE.x - 460 + i * 115; }
// the reunion table in front view; o.pose(id, base) can override each diner
function feast(t, o = {}) {
  BACK_ROW.forEach((id, i) => {
    const x = backRowX(i);
    chair(x, 930, 58, '#B98459', { key: 'fb' + i });
    if (!id) {
      if (o.empty) o.empty(x);
      return;
    }
    const base = { x, y: 944, k: 2.5, t, sit: true, face: (i - 4) * -.08, mouth: 'smile', blink: 'f' + i };
    const pose = o.pose ? o.pose(id, base, i) : base;
    if (pose) P(id, pose);
  });
  if (o.behindTable) o.behindTable();
  roundTable(TABLE.x, TABLE.y, TABLE.w, { key: 'feast', flat: .14, dishes: (x, y, w, h) => tableDishes(x, y, w, h, t, { steam: o.steam }) });
  // the empty place setting
  const ex = backRowX(5);
  seed('emptyset'); shape(ellPts(ex, 872, 34, 9, 14), { fill: '#F3EEE3', sw: 2 }); line([[ex + 40, 862], [ex + 44, 884]], 3, '#6D3F2A', { double: false }); line([[ex + 48, 862], [ex + 52, 884]], 3, '#6D3F2A', { double: false });
  shape(rrPts(ex - 58, 850, 16, 22, 3), { fill: '#EDE6D8', sw: 1.6 });
  if (o.onTable) o.onTable();
  FRONT_ROW.forEach((id, i) => {
    const x = TABLE.x - 480 + i * 160 + (i % 2) * 10;
    const base = { x, y: 1190, k: 3.3, t, sit: true, back: true, blink: 'fr' + i, noHands: true, handL: [-12, -52], handR: [12, -52] };
    const pose = o.poseFront ? o.poseFront(id, base, i) : base;
    if (pose) P(id, pose);
  });
}
function S10(lt, t) {
  setLight('#FFB070', .05);
  // 126–130 wide & still; 130–138 one pan along the faces, stopping on the empty seat
  const z = lt < 4 ? 1 : 1.9, cx = lt < 4 ? 960 : kf(lt, [[4, 560], [8, 900], [11.2, backRowX(5)]], easeIO), cy = lt < 4 ? 560 : 790;
  camBegin(cx, cy, z);
  courtyard(t, { night: 1, lamps: 1, stars: 1, moon: [1560, 150, 76], eaveLanterns: () => 1, kitchenLit: 1 });
  const stand = ease(seg(lt, 1.4, 2.2)), raise = ease(seg(lt, 3.9, 4.9)), clink = lt > 5.3;
  feast(t, {
    steam: true,
    pose: (id, b, i) => {
      const cupUp = raise * (1 - ease(seg(lt, 8.5, 9.4)));
      const cup = (k, LW) => { shape(rrPts(-3, -6, 6, 7, 1), { fill: '#EFE6D2', sw: LW * .7, wob: .1 }); shape(rectPts(-2.6, -5.4, 5.2, 2), { fill: '#D9A441', ink: null, flat: 1 }); };
      const toast = { handR: [8 + (i - 4) * -1.2, lerp(-26, -64, cupUp)], bendR: 1, holdR: cupUp > .05 ? cup : undefined, eyes: clink && lt < 9 ? 'happy' : 'open', mouth: clink ? 'grin' : 'smile', face: b.face + (lt > 8.5 ? (6 - i) * .05 : 0) };
      if (id === 'ye') return { ...b, ...toast, sit: stand < .5, y: 944, dy: stand > .5 ? 0 : -stand * 6, handR: [10, lerp(-40, -70, stand)], holdR: cup, eyes: 'happy', mouth: 'grin' };
      if (id === 'nai') return { ...b, ...toast, look: lt > 9.5 ? [1, .2] : [0, 0], mouth: lt > 9.8 ? 'soft' : toast.mouth, brows: lt > 9.8 ? .4 : 0 };
      return { ...b, ...toast };
    },
    poseFront: (id, b, i) => ({ ...b, lean: Math.sin(t * 1.3 + i) * .02 }),
    onTable: () => { if (clink && lt < 6.2) { seed('clink'); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; line([[760 + Math.cos(a) * 30, 700 + Math.sin(a) * 30], [760 + Math.cos(a) * 60, 700 + Math.sin(a) * 60]], 3, '#FFE9A8', { alpha: 1 - seg(lt, 5.3, 6.2) }); } } },
  });
  camEnd();
  paperCover(0); if (lt < .8) fillScreen('#141832', 1 - ease(seg(lt, 0, .8)));
}
// top-down reunion table. filled: which seats are occupied; o: reach per seat, wedges left, extras
function ringTable(t, lt, o = {}) {
  seed('bricks2'); shape(rectPts(-600, -600, 3100, 2300), { fill: '#3E4468', ink: null, curv: 0, wob: 2 });
  for (let i = -8; i < 18; i++) line([[i * 160, -600], [i * 160 + 40, 1700]], 1.6, '#33395C', { alpha: .5, double: false, wob: 2 });
  for (let j = -5; j < 15; j++) line([[-600, j * 120], [2500, j * 120 + 20]], 1.6, '#33395C', { alpha: .5, double: false, wob: 2 });
  glow(960, 540, 900, '#FFB85C', .22);
  tableTop(960, 540, 300, t, { settings: true, susan: true });
  const seats = ['nai', 'ayuan', 'ershu', 'ershen', 'tangjie', 'biaodi', 'xmei', 'biaojie', 'biaoge', 'xshen', 'xshu', 'gufu', 'gugu', 'dabo', 'dabom', 'ye'];
  seats.forEach((id, i) => {
    const a = -Math.PI / 2 + i / 16 * TAU;
    const empty = id === 'ayuan' && !o.ayuan;
    topChair(960 + Math.cos(a) * 395, 540 + Math.sin(a) * 395, a, 46, { key: 'rt' + i });
    if (empty) return;
    const r = id === 'ayuan' ? 380 + (1 - (o.ayuan ?? 1)) * 200 : 380;
    personTop(C[id], 960 + Math.cos(a) * r, 540 + Math.sin(a) * r, a - Math.PI / 2, 3.1, { reach: o.reach ? o.reach(i, id) : 0, key: 'rt' });
  });
  if (o.center) o.center();
}
function S11(lt, t) {
  setLight('#FFB070', .04);
  const z = lt < 4 ? 1.35 : kf(lt, [[4, 1.35], [12, 1.0]], ease);
  camBegin(960, 540, z);
  const cuts = Math.floor(seg(lt, .6, 3.6) * 8.999);
  const taken = (i) => lt > 4.2 + i * .28;   // wedge i taken by seat order
  ringTable(t, lt, {
    reach: (i, id) => {
      if (id === 'nai') return lt < 4 ? .9 : lt > 7.6 && lt < 8.8 ? 1.1 : 0;
      const wi = i - 2; if (wi < 0) return 0;
      const t0 = 4.2 + wi * .28; return Math.sin(seg(lt, t0 - .3, t0 + .3) * Math.PI) * 1.1;
    },
    center: () => {
      // the mooncake, cut into sixteen
      if (lt < 4.2) mooncakeTop(960, 540, 120, { key: 'big', slice: cuts * 2, rim: true, sw: 2.6 });
      else for (let w = 0; w < 16; w++) {
        const a0 = w / 16 * TAU + .1, a1 = (w + 1) / 16 * TAU + .1;
        if (w < 14 && taken(w)) continue;
        if (w === 15) { // grandma carries the last wedge to the empty plate
          const k = ease(seg(lt, 7.8, 8.7)), aE = -Math.PI / 2 + 1 / 16 * TAU;
          const [px, py] = arcPt([960, 540], [960 + Math.cos(aE) * 240, 540 + Math.sin(aE) * 240], 40, k);
          wedge(px, py, 120, a0, a1, { key: 'w' + w });
        } else if (w === 14 && lt > 7.8) continue;
        else wedge(960, 540, 120, a0, a1, { key: 'w' + w });
      }
      if (lt > .6 && lt < 3.8) { seed('knife'); const a = cuts / 8 * Math.PI + .1; line([[960 - Math.cos(a) * 150, 540 - Math.sin(a) * 150], [960 + Math.cos(a) * 150, 540 + Math.sin(a) * 150]], 7, '#C9CCD4', { alpha: .9 }); }
    },
  });
  camEnd();
  // the moon with a bite, same shape as the gap (a dissolve, then cut)
  if (lt > 9.6) overlayMoon(t, ease(seg(lt, 9.6, 10.6)), { bite: 1 });
}
// the sky moon over a night field, for the rhymes at the gap and at the close
function overlayMoon(t, a, o = {}) {
  if (a <= 0) return;
  const main = ctx, bf = BF; ctx = BUF.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); paperUnder();
  skyBands(-20, -20, W + 40, H + 40, ['#1B2244', '#243060', '#2E3A70'], 'moonsky');
  seed('mstars'); for (let i = 0; i < 50; i++) { const tw = .5 + .5 * Math.sin(t * 2 + i); shape(ellPts(hash('msx', i) * W, hash('msy', i) * H, 2 + tw, 2 + tw, 5), { fill: '#FFF1C8', ink: null, flat: 1, alpha: .3 + .5 * tw }); }
  moon(960, 540, 300, { key: 'big', glow: 1.2, halo: 2 });
  if (o.bite) { const aE = -Math.PI / 2 + 1 / 16 * TAU, bx = 960 + Math.cos(aE) * 290, by = 540 + Math.sin(aE) * 290; cloud(bx + (o.clear ?? 0) * 900, by + 40, 420, '#3A4478', { key: 'bite', sw: 3, alpha: 1, lobes: 6 }); }
  ctx = main; BF = bf;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.drawImage(BUF, 0, 0); ctx.restore();
}

function S12(lt, t) {
  setLight('#FFB070', .05);
  if (lt < 3) {                          // 150–153: quiet eating; three knocks; heads turn
    camBegin(900, 760, 1.6);
    courtyard(t, { night: 1, lamps: 1, stars: 1, moon: [1560, 150, 76], eaveLanterns: () => 1, kitchenLit: 1 });
    feast(t, { pose: (id, b, i) => { const turnAt = .9 + Math.abs(i - 4) * .12; const tk = ease(seg(lt, turnAt, turnAt + .35)); return { ...b, face: lerp(b.face, -.9, tk), look: [-tk, 0], mouth: tk > .5 ? 'o' : 'chew', eyes: tk > .5 ? 'wide' : 'down' }; },
      poseFront: (id, b, i) => ({ ...b, lean: -ease(seg(lt, 1.1 + i * .08, 1.5 + i * .08)) * .12 }) });
    camEnd();
    if (lt > .8) for (const k of [.8, 1.3, 1.8]) if (lt > k && lt < k + .25) { seed('knock' + k); for (let i = 0; i < 3; i++) line(arcPts(90, 560, 30 + i * 20, -.8, .8, 6), 4, '#FFE9A8', { alpha: 1 - seg(lt, k, k + .25) }); }
  } else if (lt < 6) {                  // 153–156: the gate opens: him
    const z = kf(lt, [[3, 1], [6, 1.14]], ease);
    camBegin(960, 620, z);
    const open = ease(seg(lt, 3.2, 4.2));
    gateSet(t, open, { lane: () => {
      glow(960, 700, 300, '#FFC46B', .3);
      const wave = ease(seg(lt, 4.8, 5.2));
      P('ayuan', { x: 960, y: 960, k: 4.3, t, face: 0, mouth: lt > 5 ? 'grin' : 'pant', eyes: lt > 5 ? 'happy' : 'open', brows: .3, dy: Math.sin(lt * 9) * .8,
        handR: wave > 0 ? [16, lerp(-50, -100, wave)] : undefined, holdR: wave > .5 ? openHand() : undefined, bendR: 1 });
      seed('sweat'); for (const s of [-1, 1]) shape([[960 + s * 60, 520], [960 + s * 66, 544], [960 + s * 54, 544]], { fill: '#BFE3F2', ink: PAL.ink, sw: 1.4, curv: .5 });
    } });
    camEnd();
  } else if (lt < 9) {                  // 156–159: grandma rises; her chopsticks fall
    camBegin(backRowX(4), 700, 2.6);
    courtyard(t, { night: 1, lamps: 1, moon: [1560, 150, 76], eaveLanterns: () => 1, kitchenLit: 1 });
    const rise = ease(seg(lt, 6.3, 7.8)), drop = seg(lt, 7.2, 7.9);
    feast(t, { pose: (id, b, i) => {
      if (id === 'nai') return { ...b, sit: rise < .5, dy: rise < .5 ? -rise * 10 : 0, face: -.6, look: [-1, -.2], eyes: lt > 7.4 ? 'teary' : 'wide', mouth: lt > 7.6 ? 'sad' : 'o', brows: .8, handL: [-14, rise < .5 ? -30 : -42], handR: [12, rise < .5 ? -30 : -42], tear: seg(lt, 8, 9) };
      return { ...b, face: -.9, look: [-1, 0], eyes: 'wide', mouth: 'o' };
    }, onTable: () => { if (drop > 0 && drop < 1) { const [px, py] = arcPt([backRowX(4) + 30, 820], [backRowX(4) + 60, 980], -20, easeIn(drop)); seed('chop'); line([[px, py], [px + 30, py - 30 + drop * 50]], 3, '#6D3F2A', { double: false }); line([[px + 6, py], [px + 34, py - 28 + drop * 60]], 3, '#6D3F2A', { double: false }); } } });
    camEnd();
  } else {                               // 159–162: he runs to her, kneels, holds her
    camBegin(backRowX(4) - 60, 720, 1.9);
    courtyard(t, { night: 1, lamps: 1, moon: [1560, 150, 76], eaveLanterns: () => 1, kitchenLit: 1 });
    const run = seg(lt, 9, 9.8), hug = lt > 9.8;
    feast(t, { pose: (id, b, i) => {
      if (id === 'nai') return { ...b, sit: false, face: -.3, eyes: hug ? 'closed' : 'teary', mouth: hug ? 'smile' : 'sad', brows: .6, tear: 1, handL: hug ? [-18, -64] : [-12, -60], handR: hug ? [-4, -66] : [12, -60], bendL: 1 };
      if (id === 'ye' && hug) return null;
      const stand = ease(seg(lt, 10 + Math.abs(i - 4) * .15, 10.5 + Math.abs(i - 4) * .15));
      return { ...b, sit: stand < .5, face: lerp(-.6, (4 - i) * .15, stand), eyes: 'happy', mouth: 'grin' };
    }, behindTable: () => {
      const ax = lerp(backRowX(4) - 620, backRowX(4) - 58, easeOut(run));
      P('ayuan', { x: ax, y: 938, k: 2.6, t, walk: run < 1 ? lt * 2.8 : undefined, stride: 10, face: .6, lean: hug ? .22 : .12, eyes: hug ? 'closed' : 'teary', mouth: hug ? 'smile' : 'grin', handR: hug ? [28, -66] : undefined, handL: hug ? [20, -60] : undefined, bendR: -1, tear: hug ? .6 : 0 });
      if (hug) P('ye', { x: backRowX(3) - 30, y: 944, k: 2.5, t, face: .4, eyes: 'happy', mouth: 'grin', blink: 'f3' });
    } });
    camEnd();
  }
}
function S13(lt, t) {
  setLight('#FFB070', .05);
  if (lt < 4) {                          // 162–166: the red bundle; the sixteenth mooncake
    camBegin(960, 640, 1.35);
    seed('s13bg'); shape(rectPts(-100, -100, 2120, 1300), { fill: '#2B3563', ink: null, curv: 0 });
    glow(960, 300, 900, '#FFB85C', .3);
    lattice(120, 60, 300, 420, 1, { n: 3 }); lattice(1500, 60, 300, 420, 1, { n: 3 });
    const out = ease(seg(lt, .3, 1.2)), place = ease(seg(lt, 1.2, 1.8)), open = ease(seg(lt, 1.9, 3.1));
    P('ayuan', { x: 1260, y: 990, k: 6.4, t, sit: true, face: -.4, look: [-.8, .8], eyes: open > .7 ? 'teary' : 'open', mouth: open > .8 ? 'smile' : 'o', brows: .5, blush: .6 });
    const bx = lerp(lerp(560, 760, out), 960, place), by = lerp(lerp(900, 700, out), 820, place);
    P('nai', { x: 640, y: 990, k: 6.4, t, sit: true, face: .45, look: [.8, .6], eyes: open > .8 ? 'happy' : 'open', mouth: 'smile', handR: open > 0 ? [30, -34] : [(bx - 640) / 6.4, (by - 990) / 6.4 + 4], bendR: 1 });
    counterTop(800, -200, 2200, '#C63B33');
    bundle(bx, by, 80, open);
    camEnd();
  } else if (lt < 7) {                   // 166–169: from above, the circle closes
    const z = kf(lt, [[4, 1.15], [7, 1.0]], ease);
    camBegin(960, 540, z);
    const sitIn = ease(seg(lt, 4.2, 5.2));
    ringTable(t, lt, { ayuan: sitIn, center: () => {
      const aE = -Math.PI / 2 + 1 / 16 * TAU;
      for (let w = 0; w < 16; w++) { const a0 = w / 16 * TAU + .1; if (w === 15) wedge(960 + Math.cos(aE) * 240, 540 + Math.sin(aE) * 240, 120, a0, a0 + TAU / 16, { key: 'w15' }); }
      mooncakeTop(960, 540, 70, { key: 'b16', rim: true });
    } });
    // a warm ring lights up when it closes
    if (lt > 5.3) { ctx.save(); ctx.globalAlpha = Math.sin(seg(lt, 5.3, 6.8) * Math.PI) * .8; shape(ellPts(960, 540, 400, 400, 60), { ink: '#FFE3A0', sw: 10, wob: 1 }); ctx.restore(); }
    camEnd();
  } else {                               // 169–172: the table becomes the full moon
    camBegin(960, 540, 1);
    ringTable(t, lt, { ayuan: 1 });
    camEnd();
    overlayMoon(t, ease(seg(lt, 7.2, 8.6)), { bite: 1, clear: ease(seg(lt, 8.2, 10)) });
  }
}
function S14(lt, t) {
  setLight('#FFB070', .04);
  const z = kf(lt, [[0, 1.0], [4, .94]], ease);
  camBegin(960, 560, z);
  const on = (key) => ({ L1: ease(seg(lt, .4, .7)), L2: 1 })[key] ?? 1;
  courtyard(t, { night: 1, lamps: 1, stars: 1, moon: [1395, 185, 118], eaveLanterns: on, kitchenLit: 1 });
  // more lanterns along the eaves, lighting one after another
  [[180, 1.0], [960, 1.4], [1740, 1.8]].forEach(([x, t0]) => lantern(x, x === 960 ? 250 : 440, 40, ease(seg(lt, t0, t0 + .3)), Math.sin(t * 1.3 + x) * .04, { key: 'e' + x }));
  const tbl = { x: 960, y: 880, w: 520 };
  // the family, small, around the table
  const ring = ['gufu', 'gugu', 'dabo', 'ye', 'nai', 'ayuan', 'ershu', 'ershen', 'dabom'];
  ring.forEach((id, i) => P(id, { x: tbl.x - 250 + i * 62, y: 900, k: 1.35, t, sit: true, face: (i - 4) * -.1, eyes: 'happy', mouth: 'smile', blink: 'e' + i, look: [0, -1] }));
  roundTable(tbl.x, tbl.y, tbl.w, { key: 'S14', dishes: (x, y, w, h) => tableDishes(x, y, w, h, t) });
  ['xshu', 'xshen', 'biaoge', 'biaojie', 'xmei', 'biaodi', 'tangjie'].forEach((id, i) => P(id, { x: tbl.x - 230 + i * 76, y: 1000, k: 1.6, t, sit: true, back: true, noHands: true, blink: 'g' + i }));
  // the last blossom lands on the table
  const bk = seg(lt, 4.6, 6.4);
  if (bk > 0) { const [bx, by] = arcPt([1520, 560], [990, 872], -40, easeOut(bk)); blossom(bx + Math.sin(lt * 4) * 16 * (1 - bk), by, 7, lt * 2 * (1 - bk)); }
  camEnd();
  // moonlight to paper
  if (lt > 6.4) { glow(W / 2, H / 2, 1400, '#FFF0C4', .5 * seg(lt, 6.4, 7.6)); paperCover(ease(seg(lt, 6.8, 8))); }
}

const SHOTS = [
  [0, S1, '空院'], [12, S2, '十六个月饼'], [26, S3, '十六把椅子'], [36, S4, '挨个打电话'], [52, S5, '第十六个'], [60, S6, '远方'],
  [68, S7, '归途长卷'], [98, S8, '厨房'], [112, S9, '进门'], [126, S10, '月下家宴'], [138, S11, '切月饼'], [150, S12, '敲门'], [162, S13, '团圆'], [172, S14, '月圆'],
];

VIEWS.cast = (t) => {
  Object.keys(CAST).forEach((id, i) => person(CAST[id], { x: 130 + (i % 8) * 237, y: 500 + Math.floor(i / 8) * 520, k: 4.2, t, face: (i % 3 - 1) * .3 }));
};
