// ───────────────────────── people: sixteen family members, one parametric figure ─────────────────────────
// Local space: feet on the ground at (0,0), y up is negative, an adult is ~104 units tall. k = pixels per unit.
const SK = PAL.skin, SKO = PAL.skinOld;
const CAST = {
  nai:   { skin: SKO, hair: 'granny', hairCol: '#D3CEC6', h: .9, build: 1.14, stoop: .06, wrinkles: 1, rim: PAL.gold,
           top: { type: 'mandarin', col: '#B3313B' }, pants: { col: '#2E3150' }, shoes: '#2B2B3A' },
  ye:    { skin: SKO, hair: 'grandpa', hairCol: '#CFCBC3', h: .95, wrinkles: 1, rim: PAL.red,
           top: { type: 'vest', col: '#3A3D4E', under: '#2F4A7A' }, pants: { col: '#2C3552' }, shoes: '#2B2B3A' },
  dabo:  { hair: 'short', hairCol: '#707179', glasses: 'rect', build: 1.1, lines: 1, rim: PAL.gold,
           top: { type: 'sweat', col: '#4C4B56' }, pants: { col: '#272B3D' }, shoes: '#2A2A34' },
  dabom: { hair: 'shortF', hairCol: '#2A2833', glasses: 'thin', build: 1.08, rim: PAL.gold,
           top: { type: 'long', col: '#B53A40' }, pants: { col: '#26262F' }, shoes: '#2A2A34' },
  ershu: { hair: 'short', hairCol: '#26252F', build: 1.12, lines: 1, rim: PAL.gold, bracelet: '#EB8E2C',
           top: { type: 'sweat', col: '#34343D', seam: '#A48B69' }, pants: { col: '#272731' }, shoes: '#2A2A34' },
  ershen:{ hair: 'long', hairCol: '#2E2624', build: 1.05, rim: PAL.gold,
           top: { type: 'loose', col: '#72483A' }, pants: { col: '#2A2A33' }, shoes: '#2A2A34' },
  gugu:  { hair: 'bowl', hairCol: '#26252F', build: 1.16, rim: PAL.gold,
           top: { type: 'loose', col: '#30303A' }, scarf: '#EF4E86', pants: { col: '#282833' }, shoes: '#2A2A34' },
  gufu:  { hair: 'spiky', hairCol: '#5D5E66', glasses: 'thin', lines: 1, rim: PAL.gold, watch: 1,
           top: { type: 'henley', col: '#282D42' }, pants: { col: '#262B3F' }, shoes: '#2A2A34' },
  xshu:  { hair: 'neat', hairCol: '#25252F', glasses: 'rect', build: 1.06, rim: PAL.gold,
           top: { type: 'polo', col: '#62646F' }, pants: { col: '#2E3249' }, shoes: '#2A2A34' },
  xshen: { hair: 'bob', hairCol: '#23232C', glasses: 'gold', rim: PAL.gold,
           top: { type: 'shirtjacket', col: '#B83D36', under: '#23232C' }, pants: { col: '#26262F' }, shoes: '#2A2A34' },
  biaoge:{ hair: 'short', hairCol: '#23232D', glasses: 'round', round: 1, build: 1.1, rim: PAL.red,
           top: { type: 'sweat', col: '#F5ECD6', pat: 'stripes', patCol: '#2D3A6A' }, pants: { col: '#3B5C98' }, shoes: '#EEE7DA' },
  biaojie:{ hair: 'tuck', hairCol: '#23232D', rim: PAL.red, necklace: 1, build: .95,
           top: { type: 'blazer', col: '#5B5E68', under: '#23232C' }, pants: { col: '#575A62', wide: 1 }, shoes: '#23232C' },
  xmei:  { hair: 'wavy', hairCol: '#3F2D27', rim: PAL.red, earring: '#FFF4E0', build: .95,
           top: { type: 'cropjacket', col: '#F2E6CB' }, pants: { col: '#EEE2C5', wide: 1 }, shoes: '#F2EBDD' },
  biaodi:{ hair: 'buzz', hairCol: '#23232D', glasses: 'rect', rim: PAL.red,
           top: { type: 'sweat', col: '#6C4A3F', pat: 'squiggle', patCol: '#D8A58D' }, pants: { col: '#2F3549' }, shoes: '#E8E2D6' },
  tangjie:{ hair: 'straight', hairCol: '#2E2321', headband: '#C62F33', lips: 1, rim: PAL.gold, earring: '#E9E6DE', build: .96,
           top: { type: 'blazer', col: '#D8352F', under: '#1E1E27' }, pants: { col: '#8F8C90', wide: 1, pat: 'hound' }, shoes: '#23232C' },
  ayuan: { hair: 'curtain', hairCol: '#23232D', glasses: 'thin', h: 1.03, rim: PAL.red, build: .97,
           top: { type: 'sweat', col: '#C8C7C3', pat: 'patch' }, pants: { col: '#2D3550' }, shoes: '#EDE9E0' },
};
for (const [id, c] of Object.entries(CAST)) { c.id = id; c.skin = c.skin || SK; c.h = c.h || 1; c.build = c.build || 1; }

// two-bone IK: elbow/knee on the outer side unless bend (+1/-1) is given
function ik(S, T, a, b, bend) {
  const dx = T[0] - S[0], dy = T[1] - S[1];
  const d = clamp(Math.hypot(dx, dy), Math.abs(a - b) + .01, a + b - .01), ang = Math.atan2(dy, dx);
  const A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const c1 = [S[0] + Math.cos(ang + A) * a, S[1] + Math.sin(ang + A) * a], c2 = [S[0] + Math.cos(ang - A) * a, S[1] + Math.sin(ang - A) * a];
  const E = bend === undefined ? (Math.abs(c1[0]) > Math.abs(c2[0]) ? c1 : c2) : bend > 0 ? c1 : c2;
  const ea = Math.atan2(T[1] - E[1], T[0] - E[0]), full = Math.hypot(T[0] - E[0], T[1] - E[1]);
  return [E, [E[0] + Math.cos(ea) * Math.min(b, full), E[1] + Math.sin(ea) * Math.min(b, full)]];
}

// person(spec, pose)
// pose: x, y, k, t, flip, face(-1..1 turn), tilt, nod, lean, dy, sq, sit, crouch, walk(phase), stride,
//       handL/handR ([x,y] local targets), bendL/bendR, eyes, mouth, brows, blush, look, tear, fog, holdL/holdR, alpha, key
function person(c, p) {
  const id = c.id, k = p.k, t = p.t ?? 0;
  const LW = 1.35 * Math.pow(k, -.5), WB = .8 * Math.pow(k, -.6), SC = 1.3 / k;
  const rimD = 2.2 / k;
  const S = (key) => seed(id + ':' + key + (p.key || ''));
  const o = (extra) => ({ sw: LW, wob: WB, sc: SC, rimCol: c.rim, rimX: rimD, rimY: rimD * .8, ...extra });
  ctx.save();
  ctx.translate(p.x, p.y); ctx.scale(k * (p.flip ? -1 : 1), k);
  if (p.alpha !== undefined) ctx.globalAlpha = p.alpha;
  const sq = p.sq || 0; ctx.scale(1 + sq * .6, 1 - sq);
  ctx.translate(0, (p.dy || 0));
  const hs = c.h, sit = p.sit, crouch = p.crouch;
  const hipY = sit ? -30 : crouch ? -27 : -46 * hs;
  const shY = hipY - 28 * hs;
  const bw = 12.5 * c.build;
  const lean = (p.lean || 0) + (c.stoop || 0);
  const pw = c.pants.wide ? 10.6 : 8.6;
  // ── legs (and the lap when sitting) ──
  let feet, knees;
  if (sit) { feet = [[-7, 0], [7, 0]]; knees = [[-7.5, hipY + 7], [7.5, hipY + 7]]; }
  else if (crouch) { feet = [[-10, 0], [9, 0]]; knees = [[-13, -15], [13, -17]]; }
  else if (p.walk !== undefined) {
    const ph = p.walk * TAU, A = p.stride ?? 8;
    feet = [[-2 + Math.sin(ph) * A, -Math.max(0, Math.cos(ph)) * 3.5], [2 + Math.sin(ph + Math.PI) * A, -Math.max(0, Math.cos(ph + Math.PI)) * 3.5]];
    knees = feet.map(f => [f[0] * .55 + 1.8, hipY / 2 + f[1] * .4]);
  } else { const sp = p.feetSpread ?? 0; feet = [[-5.2 - sp, 0], [5.2 + sp, 0]]; knees = [[-5 - sp * .5, hipY / 2], [5 + sp * .5, hipY / 2]]; }
  const hips = [[-4.8, hipY], [4.8, hipY]];
  // back hair first (behind the body)
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY);
  const headY = shY - 13 * hs + (p.nod || 0);
  if (!p.back && ['long', 'wavy', 'straight', 'bob', 'tuck'].includes(c.hair)) { S('bh'); ctx.save(); ctx.translate(0, headY); ctx.rotate(p.tilt || 0); backHair(c, o, p); ctx.restore(); }
  ctx.restore();
  S('legs');
  for (let i = 0; i < 2; i++) {
    const f = feet[i], kn = knees[i], sh = [f[0] + (i ? 1.4 : -1.4), f[1] - 1.7];
    shape(ellPts(sh[0], sh[1], 4.8, 2.5, 12), o({ fill: c.shoes }));
    if (sit) shape(ribbonPts([[kn[0], kn[1] - 2], [f[0], f[1] - 3]], pw, pw * .9), o({ fill: c.pants.col, rim: true, curv: .5 }));
    else shape(ribbonPts([hips[i], kn, [f[0], f[1] - 3]], pw * 1.05, pw * .88), o({ fill: c.pants.col, rim: true, curv: .5 }));
    if (c.pants.pat === 'hound') {
      ctx.save(); tracePath(sit ? ribbonPts([[kn[0], kn[1] - 2], [f[0], f[1] - 3]], pw, pw * .9) : ribbonPts([hips[i], kn, [f[0], f[1] - 3]], pw * 1.05, pw * .88), true, .5); ctx.clip();
      ctx.fillStyle = rgba(PAL.ink, .6);
      for (let yy = hipY - 2; yy < 0; yy += 2.6) for (let xx = -14; xx < 14; xx += 2.6) if (((xx + yy) / 2.6 | 0) % 2 === 0) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 1.6, yy); ctx.lineTo(xx + 2.2, yy + 1.3); ctx.lineTo(xx + .6, yy + 1.6); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
  }
  // ── torso ──
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY);
  const tt = c.top.type;
  const hemY = hipY + (['long', 'mandarin', 'loose'].includes(tt) ? 7 : tt === 'blazer' ? 6 : tt === 'cropjacket' ? -3 : 3);
  const hemW = bw * (tt === 'long' || tt === 'loose' || tt === 'mandarin' ? 1.1 : tt === 'blazer' ? 1.02 : .96);
  const torso = [[-4.6, shY - 1.6], [4.6, shY - 1.6], [bw - 1.6, shY + 2], [bw + .2, shY + 6], [bw - .4, shY + 13], [hemW, hemY - 1.5], [hemW - .8, hemY], [-hemW + .8, hemY], [-hemW, hemY - 1.5], [-bw + .4, shY + 13], [-bw - .2, shY + 6], [-bw + 1.6, shY + 2]];
  S('torso');
  shape(torso, o({ fill: tt === 'vest' ? c.top.under : c.top.col, rim: true, curv: .75 }));
  if (!p.back) garment(c, shY, hemY, bw, hemW, o, S, torso, LW);
  if (sit && !p.back) { // the lap: thighs toward the viewer
    S('lap');
    const lap = [[-bw * .95, hipY - 3], [bw * .95, hipY - 3], [bw * .98, hipY + 5], [bw * .7, hipY + 9], [-bw * .7, hipY + 9], [-bw * .98, hipY + 5]];
    shape(lap, o({ fill: c.pants.col, rim: true, curv: .8 }));
    line([[0, hipY - 1], [0, hipY + 8]], LW * .7, mix(c.pants.col, PAL.ink, .5));
  }
  // ── neck & head ──
  S('neck'); shape([[-3.1, shY - 5], [3.1, shY - 5], [3.3, shY + 1], [-3.3, shY + 1]], o({ fill: c.skin, ink: null }));
  if (tt === 'mandarin' || tt === 'cropjacket') { S('collar'); shape(rrPts(-5, shY - 3.2, 10, 3.8, 1.4), o({ fill: mix(c.top.col, PAL.ink, .12) })); }
  if (c.scarf && !p.back) scarf(c, shY, hemY, bw, o, S, p, LW);
  if (c.scarf && p.back) { S('scarfb'); shape([[-8, shY - 3.5], [8, shY - 3.5], [9, shY + 3], [-9, shY + 3]], o({ fill: c.scarf, curv: .6 })); }
  const shL = [-bw + 2.6, shY + 4.5], shR = [bw - 2.6, shY + 4.5];
  const hang = (s) => [s * (bw + .5), shY + 30];
  const hL = p.handL ? p.handL.slice() : sit ? [-6.5, hipY + 2] : hang(-1);
  const hR = p.handR ? p.handR.slice() : sit ? [5.5, hipY + 3] : hang(1);
  const sleeve = tt === 'vest' ? c.top.under : c.top.col;
  const arm = (sh, hand, side, hold) => {
    const [E, Hd] = ik(sh, hand, 15.5, 15, p['bend' + side]);
    S('arm' + side);
    if (tt === 'loose') {
      const mid = [lerp(E[0], Hd[0], .38), lerp(E[1], Hd[1], .38)];
      shape(ribbonPts([mid, Hd], 4.6, 4), o({ fill: c.skin, curv: .5 }));
      shape(ribbonPts([sh, E, mid], 8.4, 8.6), o({ fill: sleeve, rim: true, curv: .5 }));
    } else shape(ribbonPts([sh, E, Hd], 7.2, 5.8), o({ fill: sleeve, rim: true, curv: .5 }));
    if (c.watch && side === 'L') { const w = [lerp(E[0], Hd[0], .8), lerp(E[1], Hd[1], .8)]; shape(ellPts(w[0], w[1], 2, 2, 8), o({ fill: '#C9CCD4', sw: LW * .6 })); }
    if (c.bracelet && side === 'R') { const w = [lerp(E[0], Hd[0], .82), lerp(E[1], Hd[1], .82)]; for (let i = 0; i < 4; i++) shape(ellPts(w[0] - 2.1 + i * 1.4, w[1] + (i % 2) * .5, 1, 1, 6), { fill: c.bracelet, ink: null, flat: 1, wob: 0 }); }
    if (!p.noHands) shape(ellPts(Hd[0], Hd[1] + .5, 2.9, 3.2, 10), o({ fill: c.skin, sw: LW * .85 }));
    if (hold) { ctx.save(); ctx.translate(Hd[0], Hd[1]); hold(k, LW); ctx.restore(); }
  };
  const drawHead = () => { ctx.save(); ctx.translate(0, headY); ctx.rotate(p.tilt || 0); head(c, p, o, S, LW, WB); ctx.restore(); };
  if (p.back) { drawHead(); }
  else if (p.armsBehind) { arm(shL, hL, 'L', p.holdL); arm(shR, hR, 'R', p.holdR); drawHead(); }
  else { drawHead(); arm(shL, hL, 'L', p.holdL); arm(shR, hR, 'R', p.holdR); }
  ctx.restore();
  ctx.restore();
  seed('after:' + id);
  return { headY, shY, hipY };
}
// where a person's head is in world space (for irises, looks, emotes)
function headPos(c, p) { const hs = c.h, hipY = p.sit ? -30 : p.crouch ? -27 : -46 * hs; return [p.x, p.y + (hipY - 41 * hs + (p.dy || 0)) * p.k]; }

function garment(c, shY, hemY, bw, hemW, o, S, torso, LW) {
  const t = c.top, dk = mix(t.col, PAL.ink, .38);
  S('garm');
  if (t.type === 'sweat') {
    line(arcPts(0, shY - 2.2, 4.8, .15, Math.PI - .15, 8, 3.4), LW * .9, dk);
    line([[-hemW + 1, hemY - 2.6], [hemW - 1, hemY - 2.6]], LW * .6, dk);
    if (t.seam) { line([[-bw + 1.5, shY + 3], [-hemW + 1.5, hemY - 3]], LW * .6, t.seam); line([[bw - 1.5, shY + 3], [hemW - 1.5, hemY - 3]], LW * .6, t.seam); }
  }
  if (t.pat === 'stripes') {
    ctx.save(); tracePath(torso, true, .75); ctx.clip();
    for (let y = shY + 5; y < hemY - 3; y += 3.3) line([[-bw - 2, y + jit(.25)], [bw + 2, y + jit(.25)]], 1.15, t.patCol, { double: false, wob: .2 });
    ctx.restore();
  }
  if (t.pat === 'patch') { shape(rrPts(bw * .22, shY + 6.5, 4, 4, .8), o({ fill: '#3A3B45', sw: LW * .5 })); }
  if (t.pat === 'squiggle') {
    ctx.save(); tracePath(torso, true, .75); ctx.clip();
    for (let i = 0; i < 6; i++) { const y = shY + 6 + i * 3.1, x0 = -bw + hash(c.id, i) * 7; line([[x0, y], [x0 + 4.5, y - 1.8], [x0 + 8, y + 1], [x0 + 12.5, y - 2.2], [x0 + 17, y]], .85, t.patCol, { double: false, wob: .25 }); }
    ctx.restore();
  }
  if (t.type === 'blazer') {
    shape([[-4, shY - 1.2], [4, shY - 1.2], [0, shY + 13]], o({ fill: t.under, ink: null }));
    line([[-4.4, shY - 1.4], [-2.2, shY + 6], [-.6, shY + 14], [0, hemY]], LW * .8, dk);
    line([[4.4, shY - 1.4], [2.2, shY + 6], [.6, shY + 14]], LW * .8, dk);
    line([[-5.8, shY + 1.4], [-3.4, shY + 5.6]], LW * .6, dk); line([[5.8, shY + 1.4], [3.4, shY + 5.6]], LW * .6, dk);
    shape(ellPts(1.4, shY + 17, .9, .9, 6), o({ fill: PAL.gold, sw: LW * .4 }));
    if (c.necklace) { line(arcPts(0, shY + .5, 2.6, .3, Math.PI - .3, 6, 4.5), .45, PAL.gold, { double: false }); shape(ellPts(0, shY + 5.2, .8, .8, 6), { fill: '#E9A07E', ink: null, flat: 1 }); }
  }
  if (t.type === 'polo' || t.type === 'henley') {
    if (t.type === 'polo') { shape([[-4.8, shY - 1.4], [0, shY + 1.8], [-1.8, shY + 4.6]], o({ fill: mix(t.col, PAL.ink, .15), sw: LW * .6 })); shape([[4.8, shY - 1.4], [0, shY + 1.8], [1.8, shY + 4.6]], o({ fill: mix(t.col, PAL.ink, .15), sw: LW * .6 })); }
    else line(arcPts(0, shY - 2.2, 4.4, .15, Math.PI - .15, 8, 3.2), LW * .8, dk);
    line([[0, shY + 1], [0, shY + 8]], LW * .6, dk);
    for (const y of [3.6, 6.4]) shape(ellPts(0, shY + y, .6, .6, 6), { fill: '#D8D8DC', ink: null, flat: 1 });
    if (t.type === 'polo') { shape(rectPts(-hemW + .6, hemY - 3.4, hemW * 2 - 1.2, 2.4), o({ fill: '#23232C', sw: LW * .45 })); shape(rrPts(-1.6, hemY - 3.8, 3.2, 3, .5), o({ fill: '#B9B9C0', sw: LW * .35 })); }
  }
  if (t.type === 'mandarin') {
    line([[0, shY], [0, hemY - 1]], LW * .8, dk);
    for (let i = 0; i < 5; i++) shape(ellPts(0, shY + 3 + i * 5, 1.15, 1.15, 8), o({ fill: '#6E1E2A', sw: LW * .4 }));
    ctx.save(); tracePath(torso, true, .75); ctx.clip();
    for (let i = 0; i < 20; i++) { const x = -bw + 2 + (i % 4) * 7 + ((i >> 2) % 2) * 3.5, y = shY + 4 + (i >> 2) * 6; if (Math.abs(x) < 2) continue; line([[x - 1.8, y], [x, y - 1.8], [x + 1.8, y], [x, y + 1.8], [x - 1.8, y]], .75, '#E0505A', { double: false, wob: .15, alpha: .7, curv: 0 }); }
    ctx.restore();
  }
  if (t.type === 'vest') {
    const V = [[-bw + 3.4, shY + 1.5], [-2.6, shY - .2], [0, shY + 9], [2.6, shY - .2], [bw - 3.4, shY + 1.5], [bw - .8, shY + 12], [hemW - .6, hemY - 1], [-hemW + .6, hemY - 1], [-bw + .8, shY + 12]];
    shape(V, o({ fill: t.col, curv: .35 }));
    ctx.save(); tracePath(V, true, .35); ctx.clip();
    for (let i = -6; i < 8; i++) line([[i * 4.5 - 9, shY], [i * 4.5 + 9, hemY]], .55, '#5E6276', { double: false, wob: .15 });
    for (let i = -6; i < 8; i++) line([[i * 4.5 + 9, shY], [i * 4.5 - 9, hemY]], .45, '#555a6c', { double: false, wob: .15, alpha: .5 });
    ctx.restore();
    for (let i = 0; i < 4; i++) shape(ellPts(0, shY + 11 + i * 4.2, .8, .8, 6), { fill: '#1E1E26', ink: null, flat: 1 });
    shape([[-4, shY - 1.4], [0, shY + 2.6], [-1.4, shY + 4.6]], o({ fill: t.under, sw: LW * .5 })); shape([[4, shY - 1.4], [0, shY + 2.6], [1.4, shY + 4.6]], o({ fill: t.under, sw: LW * .5 }));
  }
  if (t.type === 'shirtjacket') {
    shape([[-3.6, shY - 1], [3.6, shY - 1], [0, shY + 11]], o({ fill: t.under, ink: null }));
    shape([[-5.4, shY - 1.4], [-.9, shY + 5.5], [-3.6, shY + 7.2]], o({ fill: mix(t.col, PAL.ink, .1), sw: LW * .6 }));
    shape([[5.4, shY - 1.4], [.9, shY + 5.5], [3.6, shY + 7.2]], o({ fill: mix(t.col, PAL.ink, .1), sw: LW * .6 }));
    line([[-1, shY + 7.5], [-1.4, hemY]], LW * .6, dk); line([[1, shY + 7.5], [1.4, hemY]], LW * .6, dk);
  }
  if (t.type === 'cropjacket') { line([[0, shY + 1], [0, hemY]], LW * .6, dk); }
  if (t.type === 'long' || t.type === 'loose') line(arcPts(0, shY - 2.2, 5.2, .12, Math.PI - .12, 8, 4), LW * .8, dk);
}

function scarf(c, shY, hemY, bw, o, S, p, LW) {
  S('scarf');
  const sway = Math.sin((p.t || 0) * 2.1) * 1;
  const Lp = [[-7, shY - 3], [-2.6, shY - 1], [-3.4, shY + 11], [-4.4 + sway, hemY + 4], [-9.6 + sway, hemY + 4.6], [-9, shY + 9], [-9.6, shY]];
  const Rp = [[2.6, shY - 3], [8, shY - 2], [9.6, shY + 7], [8.8 + sway, hemY + 7], [3.6 + sway, hemY + 7], [3, shY + 9], [.8, shY]];
  shape(Rp, o({ fill: c.scarf, rim: true, curv: .5 })); shape(Lp, o({ fill: c.scarf, rim: true, curv: .5 }));
  shape([[-7, shY - 3.6], [7, shY - 3.6], [8, shY + 1], [-8, shY + 1]], o({ fill: mix(c.scarf, '#FF9EC0', .2), curv: .6 }));
  const dabs = [[-6, shY + 9, '#3C63B8'], [-7 + sway, hemY - 2, '#F4C44A'], [6, shY + 5, '#F4C44A'], [6 + sway, hemY + 2, '#3C63B8'], [-5, shY + 16, '#8FD0B8'], [7, shY + 14, '#8FD0B8']];
  for (const [x, y, col] of dabs) shape(ellPts(x, y, 1.8, 1.4, 7, hash(x, y) * 3), { fill: col, ink: null, wob: .3, alpha: .85, flat: 1 });
  for (let i = 0; i < 5; i++) { line([[-9 + sway + i * 1.2, hemY + 4.4], [-9 + sway + i * 1.2, hemY + 6.6]], .45, c.scarf, { double: false }); line([[4 + sway + i * 1.2, hemY + 7], [4 + sway + i * 1.2, hemY + 9.2]], .45, c.scarf, { double: false }); }
}

// head-local space: head centre at (0,0), face rx≈11.8, ry≈13.2
const HRX = 11.8, HRY = 13.2;
function backHair(c, o, p) {
  const col = c.hairCol;
  if (c.hair === 'long') shape([[-12, -6], [12, -6], [14.5, 8], [14, 27], [-14, 27], [-14.5, 8]], o({ fill: col, curv: .8, rim: true }));
  if (c.hair === 'straight') shape([[-12, -6], [12, -6], [14.5, 10], [14.5, 36], [-14.5, 36], [-14.5, 10]], o({ fill: col, curv: .8, rim: true }));
  if (c.hair === 'bob') shape([[-13.5, -4], [13.5, -4], [14.2, 10.5], [-14.2, 10.5]], o({ fill: col, curv: .9 }));
  if (c.hair === 'tuck') shape(ellPts(0, 9, 5, 4, 10), o({ fill: col }));
  if (c.hair === 'wavy') {
    const P = [[-13, -6], [13, -6]];
    for (let i = 0; i <= 8; i++) P.push([15.5 + Math.sin(i * 1.3) * 2.2, -2 + i * 5]);
    for (let i = 8; i >= 0; i--) P.push([-15.5 - Math.sin(i * 1.3 + 1) * 2.2, -2 + i * 5]);
    shape(P, o({ fill: col, curv: 1, rim: true }));
  }
}

function head(c, p, o, S, LW, WB) {
  const f = clamp(p.face || 0, -1, 1), rx = c.round ? HRX + 1 : HRX, ry = HRY;
  const col = c.skin, t = p.t || 0;
  if (p.back) { // seen from behind: ears, then the whole head is hair
    S('ears'); for (const s of [-1, 1]) shape(ellPts(s * (rx - .2), 1.5, 2.2, 3.1, 8), o({ fill: col }));
    S('backhead');
    const long = ['long', 'wavy', 'straight'].includes(c.hair), bobL = ['bob', 'bowl'].includes(c.hair);
    const P = ellPts(0, -1, rx + 1.8, ry + 1.8, 22);
    if (long || bobL) { P.splice(4, 5, [rx + 2.5, 8], [rx + 2.8, long ? 26 : 11], [-rx - 2.8, long ? 26 : 11], [-rx - 2.5, 8]); }
    shape(P, o({ fill: c.hairCol, rim: true, curv: .8 }));
    line(arcPts(-2, -3, rx - 2, Math.PI * 1.15, Math.PI * 1.5, 5, ry - 2), LW * 1.4, mix(c.hairCol, '#FFFFFF', .28), { double: false, alpha: .5 });
    if (c.headband) line(arcPts(0, -2, rx + 1.6, Math.PI * 1.1, Math.PI * 1.9, 10, ry + 1.2), LW * 2.4, c.headband, { double: false });
    if (c.hair === 'granny') for (let i = 0; i < 8; i++) line(arcPts(-9 + i * 2.6, -8 + (i % 3) * 5, 1.5, 0, 4.5, 5), LW * .45, mix(c.hairCol, PAL.ink, .35), { double: false, alpha: .6 });
    return;
  }
  S('ears');
  const earX = rx - .4 - Math.abs(f) * 2;
  if (f < .6) shape(ellPts(-earX + f * 1.4, 1.5, 2.2, 3.1, 8), o({ fill: col }));
  if (f > -.6) shape(ellPts(earX + f * 1.4, 1.5, 2.2, 3.1, 8), o({ fill: col }));
  S('face');
  const FP = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, s = Math.sin(a); FP.push([Math.cos(a) * rx * (1 - (s > 0 ? .1 * s * s : 0)), s * ry]); }
  shape(FP, o({ fill: col, rim: true }));
  // eyes (slightly below the centre, picture-book style)
  const ex = 4.7 * (1 - .22 * Math.abs(f)), cx = f * 4.4, ey = 1.2;
  const look = p.look || [0, 0];
  const bl = (p.eyes === undefined || p.eyes === 'open') && blinkAt(t, c.id + (p.blink || ''));
  const eyes = bl ? 'closed' : (p.eyes || 'open');
  S('eyes');
  for (const s of [-1, 1]) {
    const x = cx + s * ex, y = ey;
    if (eyes === 'open' || eyes === 'wide' || eyes === 'sad' || eyes === 'teary') {
      const r = eyes === 'wide' ? 1.9 : 1.45;
      if (eyes === 'wide') shape(ellPts(x, y, 2.6, 2.9, 10), { fill: '#FFF8EC', ink: PAL.ink, sw: LW * .45, flat: 1, wob: WB * .4 });
      shape(ellPts(x + look[0] * 1, y + look[1] * .9, r, r * 1.25, 10), { fill: PAL.ink, ink: null, flat: 1, wob: WB * .25 });
      shape(ellPts(x + look[0] * 1 + .5, y + look[1] * .9 - .7, .5, .5, 6), { fill: '#FFF8EC', ink: null, flat: 1, wob: 0 });
      if (eyes === 'teary') shape(ellPts(x + .2, y + 1.5, 1.7, .65, 8), { fill: '#BFE3F2', ink: null, flat: 1, alpha: .85, wob: 0 });
    } else if (eyes === 'happy') line(arcPts(x, y + 1.1, 2.1, Math.PI + .3, TAU - .3, 6), LW * .8, PAL.ink, { double: false, wob: WB * .25 });
    else if (eyes === 'closed') line(arcPts(x, y - .7, 2.1, .35, Math.PI - .35, 6), LW * .8, PAL.ink, { double: false, wob: WB * .25 });
    else if (eyes === 'down') line(arcPts(x, y - .2, 1.9, .5, Math.PI - .5, 6, 1.1), LW * .8, PAL.ink, { double: false, wob: WB * .25 });
    else if (eyes === 'squeeze') line([[x - 1.8 * s, y - 1.3], [x + 1.4 * s, y], [x - 1.8 * s, y + 1.1]], LW * .8, PAL.ink, { double: false, wob: WB * .25, curv: 0 });
  }
  const bw = p.brows || 0;   // + worried, - determined
  for (const s of [-1, 1]) {
    const x = cx + s * ex, y = -3.3 - (eyes === 'wide' ? 1.2 : 0);
    line([[x - 1.9 * s, y + bw * 1.1], [x + 1.9 * s, y - bw * 1.1 + (bw < 0 ? 0 : 0)]], LW * .65, mix(c.hairCol, PAL.ink, .55), { double: false, wob: WB * .25 });
  }
  line([[cx + .5 + f * 1.4, 3.2], [cx + 1.1 + f * 1.8, 5.2], [cx + f * 1.4, 5.7]], LW * .5, mix(col, PAL.redDk, .45), { double: false, wob: WB * .2 });
  S('mouth');
  const m = p.mouth || 'smile', mx = cx + f * .7, my = 8.4, mcol = '#8E2F35';
  if (m === 'smile') line(arcPts(mx, my - 1.5, 2.8, .45, Math.PI - .45, 7, 2), LW * .72, PAL.ink, { double: false, wob: WB * .25 });
  else if (m === 'soft') line(arcPts(mx, my - .9, 1.9, .5, Math.PI - .5, 6, 1.1), LW * .66, PAL.ink, { double: false, wob: WB * .25 });
  else if (m === 'flat') line([[mx - 1.9, my], [mx + 1.9, my]], LW * .66, PAL.ink, { double: false, wob: WB * .25 });
  else if (m === 'sad') line(arcPts(mx, my + 1.6, 2.4, Math.PI + .5, TAU - .5, 6, 1.4), LW * .66, PAL.ink, { double: false, wob: WB * .25 });
  else if (m === 'o') shape(ellPts(mx, my, 1.4, 1.8, 8), { fill: mcol, ink: PAL.ink, sw: LW * .45, flat: 1, wob: WB * .2 });
  else if (m === 'grin' || m === 'laugh') {
    const h = m === 'laugh' ? 3.8 : 2.5, w = m === 'laugh' ? 3.8 : 3.3;
    shape(arcPts(mx, my - 1.1, w, 0, Math.PI, 8, h), { fill: mcol, ink: PAL.ink, sw: LW * .5, flat: 1, wob: WB * .2 });
    shape([[mx - w * .8, my - 1], [mx + w * .8, my - 1], [mx + w * .6, my + .1], [mx - w * .6, my + .1]], { fill: '#FFF6E8', ink: null, flat: 1, wob: 0 });
  }
  else if (m === 'pant') shape(ellPts(mx, my + .4, 2.1, 1.5 + Math.abs(Math.sin(t * 9)) * 1, 8), { fill: mcol, ink: PAL.ink, sw: LW * .45, flat: 1, wob: WB * .2 });
  else if (m === 'chew') shape(ellPts(mx, my, 2.1 + Math.sin(t * 14) * .5, 1.1, 8), { fill: '#E8B09A', ink: PAL.ink, sw: LW * .45, flat: 1, wob: WB * .2 });
  if (c.lips && (m === 'smile' || m === 'soft' || m === 'flat')) shape(ellPts(mx, my - .3, 2, .8, 8), { fill: '#C8343E', ink: null, flat: 1, alpha: .75, wob: 0 });
  const bl2 = p.blush ?? .38;
  if (bl2 > 0) for (const s of [-1, 1]) shape(ellPts(cx + s * 7.2, 5, 2.4, 1.4, 10), { fill: PAL.rose, ink: null, alpha: bl2, flat: 1, wob: .2 });
  const wr = mix(col, PAL.redDk, .5);
  if (c.wrinkles) {
    for (const s of [-1, 1]) { line([[cx + s * 7.3, .2], [cx + s * 8.6, -.5]], LW * .38, wr, { double: false }); line([[cx + s * 7.3, 1.6], [cx + s * 8.6, 2]], LW * .38, wr, { double: false }); line([[cx + s * 3.8, 5.4], [cx + s * 4.8, 8.8]], LW * .42, wr, { double: false }); }
    line([[cx - 3, -6.6], [cx + 3, -7]], LW * .38, wr, { double: false });
  } else if (c.lines) for (const s of [-1, 1]) line([[cx + s * 3.8, 5.6], [cx + s * 4.6, 8.2]], LW * .33, wr, { double: false });
  if (p.tear) { S('tear'); for (const s of [-1, 1]) shape([[cx + s * ex + .4, 2.8], [cx + s * ex + 1.2, 5.2 + p.tear * 3], [cx + s * ex - .4, 5.2 + p.tear * 3]], { fill: '#A9DDF3', ink: null, flat: 1, alpha: .85, wob: .1 }); }
  S('hair'); frontHair(c, f, rx, ry, o, LW);
  if (c.headband) { S('band'); line(arcPts(f * 1.1, -1.5, rx + .9, Math.PI + .2, TAU - .2, 12, ry + .3), LW * 2.6, c.headband, { double: false, wob: WB * .25 }); }
  if (c.earring) for (const s of [-1, 1]) if (s * f < .6) shape(ellPts(s * earX + f * 1.4, 5.6, 1, 1.2, 7), { fill: c.earring, ink: PAL.ink, sw: LW * .3, flat: 1, wob: .1 });
  if (c.glasses) {
    S('glasses');
    const gc = c.glasses === 'gold' ? '#C99A3A' : c.glasses === 'rect' ? '#2A2D3E' : '#6B6E80';
    const gw = c.glasses === 'rect' ? LW * .7 : LW * .48;
    for (const s of [-1, 1]) {
      const x = cx + s * ex;
      const G = c.glasses === 'rect' ? rrPts(x - 3.4, ey - 2.5, 6.8, 4.8, 1.3, 2) : ellPts(x, ey, 3.3, 3.1, 14);
      if (p.fog) shape(G, { fill: '#F5F3EE', ink: null, flat: 1, alpha: clamp(p.fog), wob: WB * .2 });
      shape(G, { ink: gc, sw: gw, wob: WB * .2 });
    }
    line([[cx - ex + 3.2, ey - .4], [cx + ex - 3.2, ey - .4]], gw, gc, { double: false, wob: .1 });
    for (const s of [-1, 1]) if (s * f < .5) line([[cx + s * (ex + 3.3), ey - .6], [s * (earX - .5) + f * 1.4, ey - 1.2]], gw, gc, { double: false, wob: .1 });
  }
}
function blinkAt(t, key) {
  const period = 3.2 + hash(key, 'blink') * 2.2, ph = hash(key, 'ph') * period;
  return ((t + ph) % period) < .12;
}

// front hair: a cap that hugs the skull with a real hairline, a highlight and a few strands
function frontHair(c, f, rx, ry, o, LW) {
  const col = c.hairCol, s = c.hair, fx = f * 2.6, hi = mix(col, '#FFFFFF', .28), dk = mix(col, PAL.ink, .4);
  // skull arc from the left temple over the top to the right temple
  const cap = (vol, yL, yR, flat = 0) => { const P = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI, sn = Math.sin(a); P.push([Math.cos(a) * (rx + vol * .8) + fx * .3, sn * (ry + vol) * (1 - flat * sn * sn * .08) - .6]); } P[0][1] = yL; P[16][1] = yR; return P; };
  const strands = (n, y0, y1, spread = 7) => { for (let i = 0; i < n; i++) { const x = fx + (i - (n - 1) / 2) * spread / n * 2; line([[x * .9, y0], [x, (y0 + y1) / 2 - 1], [x * 1.05, y1]], LW * .45, hi, { double: false, alpha: .7, wob: .2 }); } };
  const shine = (vol) => line(arcPts(fx * .3 - 2, -.6, rx + vol * .5 - 2.5, Math.PI * 1.18, Math.PI * 1.45, 5, ry + vol - 2.5), LW * 1.4, hi, { double: false, alpha: .55 });
  let P;
  if (s === 'short') { P = cap(2.2, 0, 0, 1); P.push([rx - .6, -2], [rx - 2, -6.5], [fx + 5, -7.6], [fx - 1, -7], [fx - 3, -8.3], [-rx + 2, -6.4], [-rx + .6, -2]); shape(P, o({ fill: col, rim: true })); shine(2.2); strands(3, -12, -8, 5); }
  if (s === 'buzz') { P = cap(1, -1, -1); P.push([rx - .8, -3], [fx + 6, -8.2], [fx - 6, -8.2], [-rx + .8, -3]); shape(P, o({ fill: col, rim: true })); shine(1); }
  if (s === 'neat') { P = cap(2.6, 0, 0, 1); P.push([rx - .6, -2], [rx - 2.5, -7], [fx + 6, -8.4], [fx - 4, -8.6], [-rx + 2, -6], [-rx + .6, -2]); shape(P, o({ fill: col, rim: true })); line([[fx - 4.5, -15.5], [fx - 1, -12], [fx + 6, -9]], LW * .6, hi, { double: false }); shine(2.6); }
  if (s === 'grandpa') { P = cap(1.2, 1, 1); P.push([rx - .5, -1], [rx - 2.5, -8], [fx + 4, -10.5], [fx - 4, -10.8], [-rx + 2.5, -8], [-rx + .5, -1]); shape(P, o({ fill: col, rim: true })); strands(4, -13.5, -10.5, 7); }
  if (s === 'spiky') { P = cap(2.4, 0, 0); for (let i = 3; i <= 13; i += 2) P[i] = [P[i][0] * 1.04, P[i][1] - 2.2]; P.push([rx - .6, -2], [rx - 2, -7], [fx + 4, -7.8], [fx - 5, -7.6], [-rx + 2, -6.4], [-rx + .6, -2]); shape(P, o({ fill: col, rim: true, curv: .45 })); shine(2.4); }
  if (s === 'curtain') {
    P = cap(3.2, 2, 2); P.push([rx + .4, 1], [rx - 1, -4], [fx + 5, -9], [fx + 1, -12], [fx - 1, -12], [fx - 5, -9], [-rx + 1, -4], [-rx - .4, 1]);
    shape(P, o({ fill: col, rim: true }));
    shape([[fx - .5, -12.5], [fx - 7, -8], [fx - 10.5, -2.5], [fx - 9.5, -5.5], [fx - 3.5, -9.5]], o({ fill: col, curv: .8, sw: LW * .7 }));
    shape([[fx + .5, -12.5], [fx + 7, -8], [fx + 10.5, -2.5], [fx + 9.5, -5.5], [fx + 3.5, -9.5]], o({ fill: col, curv: .8, sw: LW * .7 }));
    shine(3.2); strands(4, -15, -11, 8);
  }
  if (s === 'granny') {
    P = []; const n = 15;
    for (let i = 0; i <= n; i++) { const a = Math.PI * .9 + i / n * Math.PI * 1.2, r = (i % 2) * 1.7; P.push([Math.cos(a) * (rx + 2.4 + r), Math.sin(a) * (ry + 2.6 + r) - .5]); }
    P.push([rx - .8, -2.5], [fx + 5, -7.6], [fx - 1, -6.4], [fx - 5.5, -7.6], [-rx + .8, -2.5]);
    shape(P, o({ fill: col, rim: true, curv: 1 }));
    for (let i = 0; i < 7; i++) line(arcPts(-9 + i * 3, -12.5 + (i % 2) * 2.4, 1.4, 0, Math.PI * 1.5, 5), LW * .45, dk, { double: false, alpha: .6 });
  }
  if (s === 'bowl') {
    P = cap(2.6, 9, 9); P.push([rx + 1.8, 9], [rx - 1, 9], [rx - 1.5, -3.6], [-rx + 1.5, -3.6], [-rx + 1, 9], [-rx - 1.8, 9]);
    shape(P, o({ fill: col, rim: true, curv: .45 }));
    for (let i = -3; i <= 3; i++) line([[fx + i * 2.6, -9], [fx + i * 2.8, -4.2]], LW * .45, hi, { double: false, alpha: .55 });
    shine(2.6);
  }
  if (s === 'bob') {
    P = cap(2.3, 10.5, 10.5); P.push([rx + 2, 10.5], [rx - 1.6, 10], [rx - 2.4, -1.5], [fx + 3, -8.4], [fx - 6.5, -3.4], [-rx + 2, 0], [-rx + 1.6, 10], [-rx - 2, 10.5]);
    shape(P, o({ fill: col, rim: true, curv: .6 })); shine(2.3);
    line([[fx + 3, -8.4], [fx - 2, -6.5], [fx - 6.5, -3.4]], LW * .45, hi, { double: false, alpha: .6 });
  }
  if (s === 'shortF') {
    P = cap(2, 4, 4); P.push([rx + 1.5, 4], [rx - 1, 3], [rx - 1.6, -3], [fx + 6, -6.4], [fx - 2, -4.6], [-rx + 1.2, -1.5], [-rx - 1.5, 4]);
    shape(P, o({ fill: col, rim: true })); shine(2);
  }
  if (s === 'tuck') { P = cap(1.6, -1, -1); P.push([rx - .6, -2], [fx + 3.5, -8.8], [fx + 1, -9.8], [fx - 6, -6.6], [-rx + .6, -2]); shape(P, o({ fill: col, rim: true })); shine(1.6); strands(3, -13, -9, 6); }
  if (s === 'long' || s === 'straight') {
    P = cap(1.8, -2, -2); P.push([rx - .5, -3], [fx + 1, -10.5], [fx - 1, -10.5], [-rx + .5, -3]);
    shape(P, o({ fill: col, rim: true })); shine(1.8);
    shape([[-rx - 1.4, -4], [-rx + 1.6, -7.5], [-rx + 2.2, 7], [-rx - .3, 17], [-rx - 2.6, 12]], o({ fill: col, curv: .8, sw: LW * .8 }));
    shape([[rx + 1.4, -4], [rx - 1.6, -7.5], [rx - 2.2, 7], [rx + .3, 17], [rx + 2.6, 12]], o({ fill: col, curv: .8, sw: LW * .8 }));
  }
  if (s === 'wavy') {
    P = cap(2.6, -1, 1); P.push([rx - .5, -2], [fx + 7, -4.8], [fx - 2, -9], [fx - 4, -10], [-rx + 1, -4]);
    shape(P, o({ fill: col, rim: true })); shine(2.6);
    shape([[rx + 1.4, -6], [rx - 1.4, -3.5], [rx - .8, 7], [rx + 2.2, 16], [rx + 3.6, 7]], o({ fill: col, curv: .9, sw: LW * .8 }));
    shape([[-rx - 1.4, -4], [-rx + 1.2, -3], [-rx + 1, 6], [-rx - 1.6, 13], [-rx - 3, 5]], o({ fill: col, curv: .9, sw: LW * .8 }));
  }
}

// seen from above (the round-table shots): shoulders, arms toward the table, the top of the head
function personTop(c, x, y, ang, k, p = {}) {
  const LW = 1.35 * Math.pow(k, -.5), WB = .8 * Math.pow(k, -.6), SC = 1.3 / k;
  seed(c.id + ':top' + (p.key || ''));
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
  const o = (e) => ({ sw: LW, wob: WB, sc: SC, rimCol: c.rim, rimX: 1.7 / k, rimY: 1.3 / k, ...e });
  const sleeve = c.top.type === 'vest' ? c.top.under : c.top.col;
  const reach = p.reach || 0, rl = p.reachL ?? reach, rr = p.reachR ?? reach;
  // arms reach toward the table (local -y is toward the table centre)
  shape(ribbonPts([[-11, 0], [-14, -8], [-7 - rl * 2, -16 - rl * 9]], 6.6, 5.6), o({ fill: sleeve, curv: .5 }));
  shape(ribbonPts([[11, 0], [14, -8], [7 + rr * 2, -16 - rr * 9]], 6.6, 5.6), o({ fill: sleeve, curv: .5 }));
  shape(ellPts(-7 - rl * 2, -17 - rl * 9, 2.8, 2.8, 8), o({ fill: c.skin }));
  shape(ellPts(7 + rr * 2, -17 - rr * 9, 2.8, 2.8, 8), o({ fill: c.skin }));
  shape(ellPts(0, 2, 14.5 * c.build, 7.5, 18), o({ fill: c.top.col, rim: true }));
  if (c.scarf) shape(ellPts(0, 0, 8, 4.5, 12), o({ fill: c.scarf }));
  if (c.top.pat === 'stripes') for (let i = -2; i <= 2; i++) line([[i * 4.4, -4], [i * 4.4, 8]], 1.1, c.top.patCol, { double: false, wob: .2 });
  if (['long', 'wavy', 'straight'].includes(c.hair)) shape(ellPts(0, 7, 9, 8.5, 14), o({ fill: c.hairCol }));
  shape(ellPts(0, 1, 10.2, 10.8, 16), o({ fill: c.hairCol, rim: true }));
  if (c.hair === 'granny') for (let i = 0; i < 7; i++) line(arcPts(Math.cos(i) * 4.5, Math.sin(i * 1.7) * 4.5, 1.8, 0, 4.5, 5), .6, mix(c.hairCol, PAL.ink, .35), { double: false });
  if (c.headband) line(arcPts(0, 1, 9.8, Math.PI * 1.05, Math.PI * 1.95, 10, 4.6), LW * 2, c.headband, { double: false });
  line(arcPts(-2, -1, 6, Math.PI * 1.1, Math.PI * 1.5, 5), LW * 1.3, mix(c.hairCol, '#FFFFFF', .28), { double: false, alpha: .5 });
  ctx.restore();
  seed('after-top:' + c.id);
}

// hand signs, drawn at the hand (hold functions): fingers up, a thumb, an open waving hand
function fingers(n, ang = -Math.PI / 2) {
  return (k, LW) => { seed('fing' + n); for (let i = 0; i < n; i++) { const a = ang + (i - (n - 1) / 2) * .32; shape(ribbonPts([[Math.cos(a) * 1.5, Math.sin(a) * 1.5], [Math.cos(a) * 6, Math.sin(a) * 6]], 2, 1.7), { fill: PAL.skinOld, sw: LW * .7, wob: .1 }); } shape(ellPts(0, .5, 3, 3.2, 10), { fill: PAL.skinOld, sw: LW * .8, wob: .1 }); };
}
function thumbUp(skin = PAL.skin) {
  return (k, LW) => { seed('thumb'); shape(ribbonPts([[0, -1], [.3, -7]], 2.4, 2), { fill: skin, sw: LW * .7, wob: .1 }); shape(ellPts(0, .8, 3.4, 3.2, 10), { fill: skin, sw: LW * .8, wob: .1 }); };
}
function openHand(skin = PAL.skin, ang = -Math.PI / 2) {
  return (k, LW) => { seed('open'); for (let i = 0; i < 5; i++) { const a = ang + (i - 2) * .36; shape(ribbonPts([[Math.cos(a) * 1.5, Math.sin(a) * 1.5], [Math.cos(a) * (i === 0 || i === 4 ? 5 : 6.2), Math.sin(a) * (i === 0 || i === 4 ? 5 : 6.2)]], 1.9, 1.6), { fill: skin, sw: LW * .6, wob: .1 }); } shape(ellPts(0, .5, 3.2, 3.4, 10), { fill: skin, sw: LW * .8, wob: .1 }); };
}
