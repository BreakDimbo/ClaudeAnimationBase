// ───────────────────────── props & sets: sky, moon, courtyard, kitchen, table, lanterns, vehicles ─────────────────────────

// ── sky in painted bands (no digital gradients) ──
function skyBands(x, y, w, h, cols, key = 'sky') {
  seed(key);
  shape(rectPts(x - 60, y - 60, w + 120, h + 120), { fill: cols[cols.length - 1], ink: null, wob: 0, curv: 0, flat: 1 });
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const y0 = y + h * i / n - (i ? 30 : 0), y1 = y + h * (i + 1) / n + 40;
    const P = [[x - 40, y0]]; for (let j = 0; j <= 8; j++) P.push([x + w * j / 8, y0 + (i ? Math.sin(j * 1.7 + i) * 14 : 0)]);
    P.push([x + w + 40, y1], [x - 40, y1]);
    shape(P, { fill: cols[i], ink: null, wob: 4, curv: 1, sc: 1.6 });
  }
}
// ── the moon: glow, disc, faint rabbit & tree, a pencil rim ──
function moon(x, y, r, o = {}) {
  const a = o.alpha ?? 1;
  glow(x, y, r * (o.halo ?? 3.2), o.glowCol || '#FFD98A', .32 * a * (o.glow ?? 1));
  glow(x, y, r * 1.5, '#FFF0C4', .25 * a * (o.glow ?? 1));
  seed('moon' + (o.key || ''));
  ctx.save(); ctx.globalAlpha = a;
  shape(ellPts(x, y, r, r, 40), { fill: o.col || PAL.moon, ink: '#E2B65A', sw: Math.max(1.5, r * .02), wob: r * .006, sc: Math.max(.6, r / 260) });
  // maria: the osmanthus tree and the jade rabbit, very faint
  ctx.save(); tracePath(ellPts(x, y, r * .98, r * .98, 32), true, 1); ctx.clip(); ctx.globalAlpha = a * .22;
  shape(ellPts(x + r * .28, y - r * .1, r * .32, r * .38, 14), { fill: '#D7A95A', ink: null, flat: 1, wob: r * .02 });
  shape(ellPts(x - r * .3, y + r * .22, r * .22, r * .16, 12), { fill: '#D7A95A', ink: null, flat: 1, wob: r * .02 });
  shape(ellPts(x - r * .42, y + r * .06, r * .06, r * .16, 8, -.3), { fill: '#D7A95A', ink: null, flat: 1, wob: r * .01 });
  shape(ellPts(x - r * .34, y + r * .02, r * .05, r * .15, 8, -.1), { fill: '#D7A95A', ink: null, flat: 1, wob: r * .01 });
  ctx.restore();
  ctx.restore();
}
// ── auspicious cloud (祥云): a lobed body with painted curls ──
function cloud(x, y, w, col = '#EDE3F0', o = {}) {
  seed('cloud' + (o.key ?? x));
  const h = w * .28, P = [];
  const lobes = o.lobes || 5;
  for (let i = 0; i <= lobes; i++) { const k = i / lobes; P.push([x - w / 2 + k * w, y - h * (.35 + .65 * Math.sin(k * Math.PI)) * (i % 2 ? 1 : .8)]); }
  P.push([x + w / 2 + h * .2, y + h * .15], [x - w / 2 - h * .2, y + h * .15]);
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
  shape(P, { fill: col, ink: o.ink ?? mix(col, PAL.ink, .35), sw: o.sw ?? 2.2, wob: 2, curv: 1, sc: 1.2 });
  const ic = mix(col, PAL.ink, .3);
  for (let i = 0; i < 3; i++) { const cx = x - w * .3 + i * w * .3, cy = y - h * .15; line(arcPts(cx, cy, h * .22, 0, Math.PI * 1.6, 8), o.sw ?? 2, ic, { alpha: .7 }); }
  ctx.restore();
}
// ── tiled roof in elevation, upturned eaves ──
function roof(x, y, w, h, o = {}) {
  seed('roof' + x + ':' + y);
  const lift = o.lift ?? h * .45, col = o.col || PAL.tile;
  const P = [[x - w / 2 - lift * .6, y - lift * .5], [x - w / 2 + h * .25, y - h * .15], [x - w / 2 + h * .8, y - h * .78], [x + w / 2 - h * .8, y - h * .78], [x + w / 2 - h * .25, y - h * .15], [x + w / 2 + lift * .6, y - lift * .5], [x + w / 2 - h * .1, y + h * .12], [x - w / 2 + h * .1, y + h * .12]];
  shape(P, { fill: col, sw: 2.4, wob: 1.5, curv: .55, rim: true, rimCol: PAL.red, sc: 1.1 });
  // tile columns
  const n = Math.floor(w / 26);
  for (let i = 1; i < n; i++) { const xx = x - w / 2 + h * .5 + (w - h) * i / n; line([[xx, y - h * .74], [xx + (xx - x) * .02, y + h * .06]], 1.4, mix(col, PAL.ink, .45), { alpha: .6, double: false }); }
  // eave line with tile ends
  for (let i = 0; i <= n; i++) { const xx = x - w / 2 + h * .15 + (w - h * .3) * i / n; shape(ellPts(xx, y + h * .1, 5, 4, 8), { fill: mix(col, PAL.ink, .25), sw: 1.2, wob: .6 }); }
  // ridge
  shape(rrPts(x - w / 2 + h * .7, y - h * .92, w - h * 1.4, h * .16, 4), { fill: PAL.tileDk, sw: 2, wob: 1 });
  for (const s of [-1, 1]) { const ex = x + s * (w / 2 - h * .7); line(arcPts(ex + s * 8, y - h * .98, 12, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2.4 : -Math.PI * 1.4, 8), 3, PAL.tileDk); }
}
// ── lattice window (格扇): warm light inside when lit ──
function lattice(x, y, w, h, lit = 0, o = {}) {
  seed('lat' + x + ':' + y);
  if (!o.noFill) shape(rectPts(x, y, w, h), { fill: lit > 0 ? mix('#E9C98A', '#FFE3A6', lit) : '#E4D6BC', sw: 2.2, wob: .8, curv: 0, rim: o.rim });
  if (lit > 0 && !o.noFill) glow(x + w / 2, y + h / 2, Math.max(w, h) * .9, '#FFC46B', .35 * lit);
  const c = o.frame || PAL.redDk, n = o.n || 4;
  for (let i = 1; i < n; i++) line([[x + w * i / n, y], [x + w * i / n, y + h]], 2, c, { double: false, curv: 0 });
  for (let j = 1; j < n + 1; j++) line([[x, y + h * j / (n + 1)], [x + w, y + h * j / (n + 1)]], 2, c, { double: false, curv: 0 });
  shape(rectPts(x - 5, y - 5, w + 10, h + 10), { ink: c, sw: 6, wob: .8, curv: 0 });
}
// ── the red lantern ──
function lantern(x, y, s, lit = 1, swing = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(swing);
  seed('lan' + (o.key ?? x));
  line([[0, -s * 1.3], [0, -s * .7]], Math.max(1.5, s * .05), PAL.ink);
  if (lit > 0) glow(0, 0, s * 3.2, '#FF8A3D', .38 * lit);
  shape(rrPts(-s * .32, -s * .8, s * .64, s * .16, s * .04), { fill: PAL.gold, sw: Math.max(1.2, s * .04), wob: s * .01 });
  shape(ellPts(0, 0, s * .72, s * .66, 22), { fill: lit > 0 ? mix('#D8402D', '#FF7A45', lit * .6) : '#B8392E', sw: Math.max(1.6, s * .05), wob: s * .012, rim: true, rimCol: PAL.gold });
  for (const k of [-.55, -.2, .2, .55]) line(arcPts(0, 0, s * .72 * Math.abs(k) + 1, -Math.PI / 2, Math.PI / 2, 8, s * .64).map(([px, py]) => [k < 0 ? -px : px, py]), Math.max(1, s * .025), mix('#8E2226', PAL.ink, .2), { alpha: .55, double: false });
  if (lit > 0) glow(0, 0, s * .8, '#FFD27A', .45 * lit);
  shape(rrPts(-s * .3, s * .62, s * .6, s * .15, s * .04), { fill: PAL.gold, sw: Math.max(1.2, s * .04), wob: s * .01 });
  for (let i = 0; i < 5; i++) line([[-s * .14 + i * s * .07, s * .78], [-s * .16 + i * s * .08 + Math.sin(swing * 3) * s * .05, s * 1.25]], Math.max(1, s * .03), PAL.red, { double: false });
  ctx.restore();
}
// ── osmanthus tree (桂花): trunk, clustered foliage, seeded gold blossoms ──
function osmanthus(x, y, s, t, o = {}) {
  seed('tree' + x);
  const sway = Math.sin(t * .9) * s * .01;
  shape(ribbonPts([[x, y], [x - s * .05, y - s * .45], [x + s * .08, y - s * .8]], s * .16, s * .07), { fill: '#6C4B3B', sw: 2.4, wob: 1.2, curv: .7 });
  line([[x - s * .04, y - s * .5], [x - s * .35, y - s * .78]], s * .05, '#6C4B3B', {});
  line([[x + s * .02, y - s * .62], [x + s * .38, y - s * .9]], s * .045, '#6C4B3B', {});
  const cl = [[0, -1.08, .42], [-.36, -.88, .34], [.36, -.92, .36], [-.14, -1.32, .3], [.22, -1.3, .28], [-.52, -.68, .24], [.55, -.7, .25]];
  for (const [dx, dy, r] of cl) {
    const cx = x + dx * s + sway * (-dy), cy = y + dy * s;
    shape(ellPts(cx, cy, r * s, r * s * .8, 16), { fill: o.dark ? '#2C4A45' : PAL.jadeDk, sw: 2.2, wob: s * .006, rim: true, rimCol: PAL.gold, sc: 1.1 });
    shape(ellPts(cx - r * s * .2, cy - r * s * .25, r * s * .55, r * s * .35, 12), { fill: o.dark ? '#3D625A' : PAL.jade, ink: null, wob: 2, alpha: .8 });
  }
  // blossoms, fixed positions
  for (let i = 0; i < (o.n || 90); i++) {
    const c = cl[i % cl.length], a = hash('blossom', i) * TAU, rr = Math.sqrt(hash('br', i)) * c[2] * s * .85;
    const bx = x + c[0] * s + Math.cos(a) * rr + sway * 2, by = y + c[1] * s + Math.sin(a) * rr * .8;
    shape(ellPts(bx, by, s * .012 + 1.5, s * .012 + 1.5, 5), { fill: '#F6B93E', ink: null, flat: 1, wob: .5 });
  }
}
// a single falling osmanthus blossom
function blossom(x, y, s = 6, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; shape(ellPts(Math.cos(a) * s * .6, Math.sin(a) * s * .6, s * .5, s * .35, 6, a), { fill: '#F6B93E', ink: '#C98A2A', sw: 1, wob: .3, flat: 1 }); } ctx.restore(); }

// ── the courtyard (四合院) in elevation: main hall at the back, kitchen left, gate right ──
// light: 0 = dusk, 1 = full night; lamps: 0..1 how lit the house is; moonY: where the moon sits
function courtyard(t, o = {}) {
  const night = o.night ?? 0, lamps = o.lamps ?? 0;
  const skyTop = mix('#7A6FA5', '#1E2650', night), skyMid = mix('#B98BA6', '#2D3869', night), skyLow = mix('#EFB08A', '#46518B', night);
  skyBands(-400, -300, 2800, 900, [skyTop, skyMid, skyLow], 'yard-sky');
  if (o.stars) { seed('stars'); for (let i = 0; i < 40; i++) { const sx = hash('sx', i) * 2600 - 300, sy = hash('sy', i) * 420 - 250, tw = .5 + .5 * Math.sin(t * 2 + i); shape(ellPts(sx, sy, 2 + tw * 1.5, 2 + tw * 1.5, 5), { fill: '#FFF1C8', ink: null, flat: 1, alpha: night * (.4 + .6 * tw) }); } }
  if (o.moon) moon(o.moon[0], o.moon[1], o.moon[2], { alpha: o.moonA ?? 1, glow: .6 + night * .6 });
  if (o.beforeHouse) o.beforeHouse();
  // distant roofs
  seed('far-roofs'); for (let i = 0; i < 5; i++) shape([[-400 + i * 620, 380], [-280 + i * 620, 300], [60 + i * 620, 300], [180 + i * 620, 380]], { fill: mix('#8C86A6', '#36406E', night), ink: null, wob: 2 });
  // main hall
  const wallC = mix(PAL.wall, '#8F93B8', night * .6);
  seed('hall'); shape(rectPts(420, 330, 1080, 380), { fill: wallC, sw: 2.4, curv: 0, wob: 1 });
  shape(rectPts(400, 700, 1120, 40), { fill: mix('#B9AE9C', '#5B6284', night * .6), sw: 2.2, curv: 0 });
  for (const px of [470, 700, 1220, 1450]) shape(rectPts(px - 14, 330, 28, 372), { fill: mix('#B8362E', '#7A2C3A', night * .5), sw: 2.2, curv: 0, wob: .8 });
  lattice(530, 430, 140, 200, lamps, { n: 3 }); lattice(1250, 430, 140, 200, lamps, { n: 3 });
  // central doors
  shape(rectPts(760, 400, 400, 300), { fill: lamps > 0 ? mix('#6A4033', '#E3B36B', lamps * .7) : '#6A4033', sw: 2.4, curv: 0 });
  if (lamps > 0) glow(960, 560, 360, '#FFB85C', .35 * lamps);
  for (const dx of [760, 860, 960, 1060]) lattice(dx + 8, 410, 84, 190, lamps, { n: 3 });
  roof(960, 330, 1300, 170, { col: mix(PAL.tile, '#2F3558', night * .6) });
  // kitchen wing (left) and gate wing (right), cut by the frame
  seed('wings');
  shape(rectPts(-260, 420, 520, 360), { fill: wallC, sw: 2.4, curv: 0 });
  roof(0, 420, 640, 120, { col: mix(PAL.tile, '#2F3558', night * .6) });
  
  shape(rectPts(1660, 420, 560, 360), { fill: wallC, sw: 2.4, curv: 0 });
  roof(1920, 420, 640, 120, { col: mix(PAL.tile, '#2F3558', night * .6) });
  lattice(1730, 500, 150, 130, Math.max(lamps, o.kitchenLit ?? 0), { n: 4 });
  if (o.inKitchen) o.inKitchen();
  // the round moon gate on the right wing, a peek of the lane
  seed('moongate'); shape(ellPts(60, 640, 110, 120, 30), { fill: mix('#3C3F5C', '#1A1E38', night), sw: 5, wob: 1, rim: true, rimCol: PAL.gold });
  // ground: grey bricks
  seed('ground'); shape(rectPts(-400, 740, 2800, 700), { fill: mix('#B7AE9F', '#4B5378', night * .7), ink: null, wob: 2, curv: 0 });
  for (let r = 0; r < 9; r++) { const yy = 770 + r * r * 9 + r * 28; line([[-400, yy], [2400, yy]], 1.6, mix('#8E8578', '#353C5E', night * .7), { alpha: .5, double: false, wob: 1.5 }); }
  for (let i = -8; i < 12; i++) line([[960 + i * 120, 745], [960 + i * 330, 1400]], 1.4, mix('#8E8578', '#353C5E', night * .7), { alpha: .35, double: false, wob: 1.5 });
  if (o.eaveLanterns) for (const [lx, key] of [[600, 'L1'], [1320, 'L2']]) { const on = o.eaveLanterns(key); lantern(lx, 360, 46, on, Math.sin(t * 1.3 + lx) * .04, { key }); }
  if (o.tree !== false) osmanthus(1560, 760, 470, t, { dark: night > .5 });
}
// ── the round table, front view: top ellipse, cloth, dishes ──
function roundTable(x, y, w, o = {}) {
  seed('rtable' + (o.key || ''));
  const h = w * (o.flat ?? .22);
  shape(rectPts(x - w * .03, y, w * .06, w * .28), { fill: '#6A4436', sw: 2.2, curv: 0 });
  shape(ellPts(x, y + w * .28, w * .18, w * .035, 14), { fill: '#6A4436', sw: 2 });
  shape([...arcPts(x, y, w / 2, 0, Math.PI, 16, h / 2), [x - w / 2, y + h * .5], [x - w / 2, y]].concat([]), { fill: o.cloth || '#C63B33', sw: 2.4, curv: .4, rim: true, rimCol: PAL.gold });
  shape([[x - w / 2, y], [x + w / 2, y], [x + w / 2 + 4, y + h * .7], [x - w / 2 - 4, y + h * .7]], { fill: o.cloth || '#C63B33', sw: 2.4, curv: .3 });
  shape(ellPts(x, y, w / 2, h / 2, 30), { fill: o.top || '#D5483E', sw: 2.4, rim: true, rimCol: PAL.gold });
  if (o.dishes) o.dishes(x, y, w, h);
}
// dishes on the table (front view), fixed layout
function tableDishes(x, y, w, h, t, o = {}) {
  seed('dishes');
  const items = [[-.3, -.15, 'fish'], [.05, -.25, 'crab'], [.32, -.1, 'greens'], [-.08, .12, 'dump'], [.25, .18, 'mooncakes'], [-.36, .16, 'ribs']];
  for (const [dx, dy, kind] of items) {
    const px = x + dx * w, py = y + dy * h, r = w * .075;
    shape(ellPts(px, py, r, r * .38, 16), { fill: '#F2ECDF', sw: 1.8, wob: .6 });
    if (kind === 'fish') shape([[px - r * .7, py], [px - r * .1, py - r * .18], [px + r * .5, py - r * .05], [px + r * .75, py - r * .2], [px + r * .7, py + r * .12], [px + r * .5, py + r * .02], [px - r * .1, py + r * .14]], { fill: '#D6883E', sw: 1.4, wob: .4 });
    if (kind === 'crab') for (let i = 0; i < 3; i++) shape(ellPts(px - r * .35 + i * r * .35, py - r * .05, r * .2, r * .12, 8), { fill: '#E2572F', sw: 1.2, wob: .3 });
    if (kind === 'greens') shape(ellPts(px, py - r * .05, r * .6, r * .18, 10), { fill: '#6FA25A', sw: 1.2, wob: .6 });
    if (kind === 'dump') for (let i = 0; i < 4; i++) shape(ellPts(px - r * .45 + i * r * .3, py - r * .06, r * .16, r * .1, 8), { fill: '#F6EEDB', sw: 1, wob: .3 });
    if (kind === 'ribs') shape(ellPts(px, py - r * .05, r * .55, r * .17, 10), { fill: '#9A4A2E', sw: 1.2, wob: .5 });
    if (kind === 'mooncakes') for (let i = 0; i < 3; i++) shape(ellPts(px - r * .35 + i * r * .35, py - r * .08, r * .18, r * .1, 10), { fill: '#C98A45', sw: 1.2, wob: .3 });
  }
  if (o.steam) for (let i = 0; i < 3; i++) { const sx = x + (-.3 + i * .3) * w, ph = (t * .5 + i * .3) % 1; line([[sx, y - 10 - ph * 60], [sx + 8, y - 30 - ph * 60], [sx - 4, y - 50 - ph * 60]], 2, '#FFF6E6', { alpha: .5 * (1 - ph) }); }
}
// ── a folding chair / stool (front view) ──
function stool(x, y, s, col = '#8A5A3C') {
  seed('stool' + x);
  shape(rrPts(x - s * .5, y - s * .9, s, s * .14, s * .05), { fill: col, sw: 2, wob: .6 });
  line([[x - s * .42, y - s * .76], [x - s * .46, y]], s * .07, mix(col, PAL.ink, .2), { double: false });
  line([[x + s * .42, y - s * .76], [x + s * .46, y]], s * .07, mix(col, PAL.ink, .2), { double: false });
}
function chair(x, y, s, col = '#B98459', o = {}) {
  seed('chair' + x + (o.key || ''));
  line([[x - s * .42, y - s * 1.7], [x - s * .45, y]], s * .08, mix(col, PAL.ink, .15), {});
  line([[x + s * .42, y - s * 1.7], [x + s * .45, y]], s * .08, mix(col, PAL.ink, .15), {});
  shape(rrPts(x - s * .44, y - s * 1.72, s * .88, s * .5, s * .1), { fill: o.back || '#EFE3C8', sw: 2, wob: .6 });
  shape(rrPts(x - s * .52, y - s * .95, s * 1.04, s * .16, s * .06), { fill: o.seat || '#EFE3C8', sw: 2, wob: .6 });
}

// ── mooncake: 3/4 view, scalloped rim, rabbit on top ──
function mooncake(x, y, r, o = {}) {
  seed('mc' + (o.key ?? x + ':' + y));
  const sq = o.sq ?? .55, col = o.col || '#C98A45', top = o.top || '#DDA25A';
  const th = r * .32 * (o.thick ?? 1);
  // side band
  const side = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; side.push([x + Math.cos(a) * r, y + Math.sin(a) * r * sq + th]); }
  for (let i = 16; i >= 0; i--) { const a = i / 16 * Math.PI; side.push([x + Math.cos(a) * r, y + Math.sin(a) * r * sq]); }
  shape(side, { fill: mix(col, PAL.ink, .12), sw: o.sw ?? 2, wob: r * .015 });
  // scalloped top
  const P = []; const n = 48;
  for (let i = 0; i < n; i++) { const a = i / n * TAU, rr = r * (1 - .05 * (Math.cos(a * 12) * .5 + .5)); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * sq]); }
  shape(P, { fill: top, sw: o.sw ?? 2, wob: r * .012, rim: o.rim, rimCol: PAL.red, sc: Math.max(.4, r / 200) });
  // rabbit relief
  const rc = mix(top, '#7A4A22', .45);
  ctx.save(); ctx.translate(x, y); ctx.scale(1, sq);
  ctx.globalAlpha = .9;
  line(ellPts(0, 0, r * .72, r * .72, 24).concat([ellPts(0, 0, r * .72, r * .72, 24)[0]]), Math.max(1, r * .03), rc, { double: false, wob: r * .01, curv: 1 });
  shape(ellPts(-r * .05, r * .1, r * .3, r * .22, 12), { ink: rc, sw: Math.max(1, r * .035), wob: r * .01 });
  shape(ellPts(r * .24, -r * .05, r * .14, r * .13, 10), { ink: rc, sw: Math.max(1, r * .035), wob: r * .01 });
  line([[r * .22, -r * .16], [r * .12, -r * .5]], Math.max(1, r * .035), rc, { double: false, wob: r * .01 });
  line([[r * .3, -r * .16], [r * .34, -r * .52]], Math.max(1, r * .035), rc, { double: false, wob: r * .01 });
  ctx.restore();
  if (o.slice) { // cut lines from the centre (top view wedges)
    const m = o.slice;
    for (let i = 0; i < m; i++) { const a = i / m * TAU + .1; line([[x, y], [x + Math.cos(a) * r * .97, y + Math.sin(a) * r * .97 * sq]], Math.max(1, r * .025), mix(top, PAL.ink, .5), { double: false }); }
  }
}
// top-view mooncake (the table shots)
function mooncakeTop(x, y, r, o = {}) { mooncake(x, y, r, { ...o, sq: 1, thick: 0 }); }
// one wedge of a mooncake seen from above (for serving)
function wedge(x, y, r, a0, a1, o = {}) {
  seed('wedge' + (o.key ?? a0));
  const P = [[x, y]]; for (let i = 0; i <= 6; i++) { const a = lerp(a0, a1, i / 6); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  shape(P, { fill: '#DDA25A', sw: o.sw ?? 1.6, wob: .6, curv: .2 });
  const P2 = [[x + Math.cos((a0 + a1) / 2) * r * .15, y + Math.sin((a0 + a1) / 2) * r * .15]]; for (let i = 0; i <= 6; i++) { const a = lerp(a0 + .05, a1 - .05, i / 6); P2.push([x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55]); }
  shape(P2, { fill: '#8C4E2E', ink: null, wob: .4, curv: .2, alpha: .85 });
  shape(ellPts(x + Math.cos((a0 + a1) / 2) * r * .35, y + Math.sin((a0 + a1) / 2) * r * .35, r * .08, r * .08, 8), { fill: '#F2B845', ink: null, flat: 1 });
}
// wooden mould (木模子)
function mould(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); seed('mould');
  shape(rrPts(-s * .12, -s * 1.5, s * .24, s * .95, s * .08), { fill: '#A56B42', sw: 2.4, wob: .8, rim: true, rimCol: PAL.gold });
  shape(rrPts(-s * .55, -s * .6, s * 1.1, s * .7, s * .18), { fill: '#B77A4B', sw: 2.4, wob: .8, rim: true, rimCol: PAL.gold });
  shape(ellPts(0, -s * .25, s * .36, s * .1, 16), { fill: '#6D3F22', sw: 1.6, wob: .5 });
  ctx.restore();
}
// bamboo tray with a 4×4 grid
function tray(x, y, w, h, o = {}) {
  seed('tray');
  shape(rrPts(x, y, w, h, 16), { fill: '#D6B070', sw: 2.6, wob: 1, rim: true, rimCol: PAL.red });
  shape(rrPts(x + 14, y + 14, w - 28, h - 28, 10), { fill: '#E6C88E', sw: 1.8, wob: .8 });
  for (let i = 1; i < 4; i++) { line([[x + 14 + (w - 28) * i / 4, y + 16], [x + 14 + (w - 28) * i / 4, y + h - 16]], 1.4, '#B08A4E', { alpha: .6, double: false }); line([[x + 16, y + 14 + (h - 28) * i / 4], [x + w - 16, y + 14 + (h - 28) * i / 4]], 1.4, '#B08A4E', { alpha: .6, double: false }); }
}
// the red cloth bundle
function bundle(x, y, s, open = 0) {
  seed('bundle');
  if (open > 0) {
    const P = []; for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + Math.PI / 4; P.push([x + Math.cos(a) * s * (1 + open * .6), y + Math.sin(a) * s * .6 * (1 + open * .6)]); P.push([x + Math.cos(a + Math.PI / 4) * s * .8, y + Math.sin(a + Math.PI / 4) * s * .45]); }
    shape(P, { fill: '#C9302C', sw: 2, wob: 1, curv: .4, rim: true, rimCol: PAL.gold });
    if (open > .3) mooncake(x, y - s * .08, s * .62, { key: 'b16', alpha: 1 });
    return;
  }
  shape(ellPts(x, y, s, s * .62, 16), { fill: '#C9302C', sw: 2.2, wob: 1, rim: true, rimCol: PAL.gold });
  shape([[x - s * .3, y - s * .5], [x, y - s * 1.05], [x + s * .3, y - s * .5]], { fill: '#D93B35', sw: 2, wob: .8 });
  shape([[x - s * .1, y - s * .6], [x - s * .5, y - s * .85], [x - s * .45, y - s * .5]], { fill: '#D93B35', sw: 1.6, wob: .6 });
  shape([[x + s * .1, y - s * .6], [x + s * .5, y - s * .85], [x + s * .45, y - s * .5]], { fill: '#D93B35', sw: 1.6, wob: .6 });
}
// phone (screen may glow)
function phone(s, on = 1, o = {}) {
  seed('phone' + (o.key || ''));
  shape(rrPts(-s * .28, -s * .52, s * .56, s * 1.04, s * .08), { fill: '#262A38', sw: Math.max(1, s * .04), wob: s * .01 });
  if (on > 0) { shape(rrPts(-s * .23, -s * .45, s * .46, s * .9, s * .05), { fill: mix('#3A4468', '#9FD3F0', on), ink: null, flat: 1, wob: 0 }); glow(0, 0, s * 1.2, '#9FD3F0', .25 * on); }
  if (o.icon === 'train') {       // a train icon with a red cross
    ctx.save(); ctx.globalAlpha = on;
    shape(rrPts(-s * .15, -s * .2, s * .3, s * .3, s * .06), { fill: '#F3EFE6', sw: Math.max(1, s * .025), wob: 0 });
    shape(rectPts(-s * .1, -s * .14, s * .2, s * .09), { fill: '#6D8BC4', ink: null, flat: 1, wob: 0 });
    line([[-s * .1, s * .15], [-s * .15, s * .22]], Math.max(1, s * .025), PAL.ink, { double: false }); line([[s * .1, s * .15], [s * .15, s * .22]], Math.max(1, s * .025), PAL.ink, { double: false });
    if (o.cross) { line([[-s * .2, -s * .28], [s * .2, s * .24]], Math.max(2, s * .06) * o.cross, '#E0302A', { double: false }); line([[s * .2, -s * .28], [-s * .2, s * .24]], Math.max(2, s * .06) * o.cross, '#E0302A', { double: false }); }
    ctx.restore();
  }
}
// small gift box
function gift(x, y, w, h, col, key) {
  seed('gift' + key);
  shape(rectPts(x - w / 2, y - h, w, h), { fill: col, sw: 2, wob: .6, curv: 0 });
  line([[x, y - h], [x, y]], Math.max(2, w * .08), PAL.gold, { double: false }); line([[x - w / 2, y - h * .5], [x + w / 2, y - h * .5]], Math.max(2, w * .08), PAL.gold, { double: false });
  shape(ellPts(x - w * .1, y - h - w * .08, w * .12, w * .08, 8), { fill: PAL.gold, sw: 1, wob: .2 }); shape(ellPts(x + w * .1, y - h - w * .08, w * .12, w * .08, 8), { fill: PAL.gold, sw: 1, wob: .2 });
}
// rabbit lantern (兔子灯) on wheels, side view facing right
function rabbitLantern(x, y, s, lit = 1, o = {}) {
  seed('rabbit' + (o.key || ''));
  if (lit > 0) glow(x, y - s * .5, s * 2.2, '#FF9A5A', .35 * lit);
  shape(ellPts(x, y - s * .55, s * .8, s * .5, 18), { fill: '#F4EEE2', sw: 2, wob: .8, rim: true, rimCol: PAL.red });
  shape(ellPts(x + s * .72, y - s * .9, s * .34, s * .3, 12), { fill: '#F4EEE2', sw: 2, wob: .6 });
  shape(ellPts(x + s * .6, y - s * 1.4, s * .09, s * .32, 8, -.25), { fill: '#F4EEE2', sw: 1.8, wob: .4 });
  shape(ellPts(x + s * .78, y - s * 1.42, s * .09, s * .32, 8, .15), { fill: '#F4EEE2', sw: 1.8, wob: .4 });
  shape(ellPts(x + s * .85, y - s * .94, s * .05, s * .05, 6), { fill: '#D8342E', ink: null, flat: 1 });
  line([[x - s * .5, y - s * .7], [x - s * .1, y - s * .45], [x + s * .3, y - s * .7]], 2, '#E0453A', { double: false });
  if (lit > 0) glow(x, y - s * .55, s * .7, '#FFD49A', .4 * lit);
  if (o.wheels !== false) for (const dx of [-.45, .45]) shape(ellPts(x + dx * s, y - s * .08, s * .13, s * .13, 10), { fill: '#C9302C', sw: 1.6, wob: .3 });
}
// backpack
function backpack(x, y, s) { seed('bp'); shape(rrPts(x - s * .4, y - s, s * .8, s, s * .2), { fill: '#3E6C8E', sw: 2, wob: .6, rim: true, rimCol: PAL.gold }); shape(rrPts(x - s * .3, y - s * .45, s * .6, s * .35, s * .1), { fill: '#335A77', sw: 1.6, wob: .5 }); }

// ── vehicles (side view, facing right) ──
function bulletTrain(x, y, len, t, o = {}) {
  seed('bullet');
  const h = 110;
  const P = [[x, y], [x + len - 240, y], [x + len - 60, y + 20], [x + len, y + 70], [x + len - 20, y + h], [x, y + h]];
  shape(P, { fill: '#F1EEE6', sw: 2.6, wob: 1.2, curv: .5, rim: true, rimCol: PAL.red });
  shape([[x, y + 70], [x + len - 30, y + 70], [x + len - 12, y + 86], [x, y + 86]], { fill: '#3868B0', ink: null, wob: 1 });
  for (let i = 0; x + 60 + i * 120 < x + len - 300; i++) {
    const wx = x + 60 + i * 120;
    shape(rrPts(wx, y + 22, 84, 36, 8), { fill: '#FFE3A6', sw: 1.8, wob: .6 });
    glow(wx + 42, y + 40, 70, '#FFC46B', .2);
    if (o.window === i && o.inWindow) { ctx.save(); tracePath(rrPts(wx, y + 22, 84, 36, 8), true, 0); ctx.clip(); o.inWindow(wx, y + 22); ctx.restore(); shape(rrPts(wx, y + 22, 84, 36, 8), { ink: PAL.ink, sw: 2 }); }
  }
  shape([[x + len - 210, y + 18], [x + len - 90, y + 28], [x + len - 50, y + 55], [x + len - 210, y + 55]], { fill: '#2B3252', sw: 1.8, wob: .6 });
}
function greenTrain(x, y, len, o = {}) {
  seed('green');
  const h = 150;
  shape(rrPts(x, y, len, h, 16), { fill: '#2F6B4E', sw: 2.6, wob: 1.2, rim: true, rimCol: PAL.gold });
  shape(rectPts(x, y + h * .72, len, 12), { fill: '#E7C45A', ink: null, wob: .6 });
  shape(rrPts(x - 10, y - 12, len + 20, 20, 8), { fill: '#3E4758', sw: 2, wob: .6 });
  for (let i = 0; x + 50 + i * 110 < x + len - 80; i++) { const wx = x + 50 + i * 110; shape(rrPts(wx, y + 30, 76, 56, 6), { fill: '#FFDFA0', sw: 1.8, wob: .6 }); glow(wx + 38, y + 58, 70, '#FFC46B', .18); }
  for (const wx of [x + 60, x + len - 60]) shape(ellPts(wx, y + h + 6, 22, 22, 12), { fill: '#2A2E3A', sw: 2, wob: .4 });
}
function plane(x, y, s, o = {}) {
  seed('plane');
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape([[-200, -10], [120, -22], [190, -10], [205, 5], [185, 20], [-190, 18], [-230, 8]], { fill: o.col || '#E9E6EE', sw: 2.4 / s * 1.4, wob: 1, curv: .6, rim: true, rimCol: PAL.red });
  shape([[-40, 5], [40, 5], [-60, 90], [-95, 90]], { fill: mix(o.col || '#E9E6EE', PAL.ink, .12), sw: 2.2 / s * 1.4, wob: .8, curv: 0 });
  shape([[-190, -8], [-160, -8], [-195, -70], [-220, -70]], { fill: mix(o.col || '#E9E6EE', PAL.ink, .08), sw: 2.2 / s * 1.4, wob: .8, curv: 0 });
  for (let i = 0; i < 10; i++) { const wx = -150 + i * 30; shape(ellPts(wx, -4, 7, 8, 10), { fill: '#FFE3A6', sw: 1.3 / s * 1.4, wob: .4 }); if (o.window === i && o.inWindow) { ctx.save(); tracePath(ellPts(wx, -4, 7, 8, 10), true, 1); ctx.clip(); o.inWindow(wx, -4); ctx.restore(); } }
  ctx.restore();
}
function car(x, y, s, col, o = {}) {
  seed('car' + (o.key ?? x));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const bounce = o.bounce || 0; ctx.translate(0, bounce);
  shape([[-100, -20], [-92, -48], [-50, -52], [-22, -90], [48, -90], [78, -52], [104, -44], [108, -20]], { fill: col, sw: 2.4 / s, wob: 1, curv: .5, rim: true, rimCol: o.rim || PAL.gold });
  shape([[-40, -54], [-16, -84], [16, -84], [16, -54]], { fill: o.win || '#9FB4D8', sw: 1.8 / s, wob: .6, curv: .2 });
  shape([[24, -54], [24, -84], [44, -84], [66, -54]], { fill: o.win || '#9FB4D8', sw: 1.8 / s, wob: .6, curv: .2 });
  if (o.inside) { ctx.save(); tracePath([[-40, -54], [-16, -84], [66, -84], [66, -54]], true, 0); ctx.clip(); o.inside(); ctx.restore(); }
  shape(rrPts(-104, -30, 8, 10, 2), { fill: '#FF3B2E', ink: null, flat: 1 });
  if (o.brake) glow(-100, -25, 70, '#FF3B2E', .45 * o.brake);
  shape(rrPts(98, -36, 10, 8, 2), { fill: '#FFF2C4', ink: null, flat: 1 });
  for (const wx of [-62, 62]) { shape(ellPts(wx, -16, 17, 17, 12), { fill: '#262A36', sw: 2 / s, wob: .5 }); shape(ellPts(wx, -16, 7, 7, 8), { fill: '#9DA3B4', ink: null, flat: 1 }); }
  ctx.restore();
}
// ── buildings in the city (flat facades with seeded window lights) ──
function tower(x, y, w, h, col, t, o = {}) {
  seed('tower' + x);
  shape(rectPts(x, y - h, w, h), { fill: col, sw: 2.2, wob: 1, curv: 0, rim: true, rimCol: PAL.gold });
  const cols = Math.floor(w / 34), rows = Math.floor(h / 44);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const wx = x + 12 + c * (w - 18) / cols, wy = y - h + 16 + r * (h - 20) / rows;
    const on = o.lightOff ? hash('win' + x, r, c) * 1.0 > o.lightOff(r, c) : hash('win' + x, r, c) > .45;
    shape(rectPts(wx, wy, (w - 18) / cols - 10, (h - 20) / rows - 14), { fill: on ? '#FFD98A' : mix(col, PAL.ink, .3), ink: null, flat: 1, wob: .4, curv: 0 });
  }
}
