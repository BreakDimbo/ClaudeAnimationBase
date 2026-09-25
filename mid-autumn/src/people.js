// ───────────────────────── people: sixteen family members drawn from the reference photos ─────────────────────────
// Local space: feet on the ground at (0,0), y up is negative, an adult is ~104 units tall (≈5.7 heads). k = px per unit.
// LOOKS are keyed by reference number (01–16, see STORYBOARD.md); CAST maps story roles to looks in one table.

const SKIN = { young: '#F1BE98', mid: '#E6AC84', warm: '#E0A277', old: '#D99A74' };
const LOOKS = {
  // 01 · young man: mushroom curtain hair, thin gold glasses, grey oversized sweatshirt with a black chest patch, dark wide jeans, white sneakers
  '01': { skin: SKIN.young, h: 1.04, build: .95, sex: 'm', age: 1,
    face: { w: 6.6, h: 9.4, jaw: .7, chinW: .3, eye: 'mono', eyeW: 1.35, eyeH: .6, tilt: .08, noseW: 1.2, noseL: 3.7, mouthW: 1.9, lipU: .35, lipL: .55 }, brow: { col: '#2A2630', w: .7, arch: .2 },
    hair: 'curtain', hairCol: '#26242E', glasses: { type: 'roundrect', col: '#C4A870', w: .28, size: 1.08 },
    top: { type: 'sweat', col: '#CFCDC8', fit: 'over', patch: '#26262E' }, pants: { col: '#2F4577', cut: 'wide' }, shoes: 'whiteChunky' },
  // 02 · young woman: black hair tied low, face-framing wisps, charcoal oversized blazer, black turtleneck, pink pendant
  '02': { skin: SKIN.young, h: .97, build: .88, sex: 'f', age: 1,
    face: { w: 7.0, h: 8.9, jaw: .78, chinW: .36, eye: 'mono', eyeW: 1.45, eyeH: .72, tilt: .12, noseW: 1.25, noseL: 3.5, mouthW: 1.9 }, brow: { col: '#2A2630', w: .55, arch: .25 },
    hair: 'lowtie', hairCol: '#1F1E27', earring: { col: '#F2E9DC', drop: 0 }, lips: '#D98C86',
    top: { type: 'blazer', col: '#55585F', under: '#1E1E25', fit: 'over', tweed: 1, necklace: '#E8948A' }, pants: { col: '#4C4F57', cut: 'wide' }, shoes: 'blackLeather' },
  // 03 · man ~40: round face, big toothy smile, round thin glasses, cream Breton stripes, mid-blue jeans, cream sneakers
  '03': { skin: SKIN.warm, h: 1.0, build: 1.08, sex: 'm', age: 2,
    face: { w: 7.9, h: 9.1, jaw: .9, chinW: .42, cheek: 1, eye: 'mono', eyeW: 1.35, eyeH: .62, tilt: .05, noseW: 1.65, noseL: 3.7, mouthW: 2.5 }, brow: { col: '#23222A', w: .75, arch: .15 },
    hair: 'recede', hairCol: '#1F1F28', glasses: { type: 'round', col: '#4E4A48', w: .3, size: 1.0 }, smile: 'grin',
    top: { type: 'sweat', col: '#F4EBD5', fit: 'reg', stripes: '#2D3A6A' }, pants: { col: '#3E5E98', cut: 'straight' }, shoes: 'nb' },
  // 04 · young woman: long wavy brown hair over one shoulder, pearl drops, ivory ruffle-collar jacket and wide trousers
  '04': { skin: SKIN.young, h: .98, build: .86, sex: 'f', age: 1,
    face: { w: 6.9, h: 9.1, jaw: .72, chinW: .3, eye: 'double', eyeW: 1.55, eyeH: .75, tilt: .2, noseW: 1.2, noseL: 3.6, mouthW: 2.3 }, brow: { col: '#3A2A26', w: .55, arch: .3 },
    hair: 'wavy', hairCol: '#3A2923', hairHi: '#8C5A3E', earring: { col: '#F6EEDF', drop: 1 }, lips: '#E08A86', smile: 'grin',
    top: { type: 'crop', col: '#F2E7CD', ruffle: 1 }, pants: { col: '#EFE3C6', cut: 'wide' }, shoes: 'cream' },
  // 05 · man ~35: crew cut, rectangular thin glasses, brown knit with pale abstract pattern, dark trousers, colourful runners
  '05': { skin: SKIN.warm, h: 1.02, build: 1.0, sex: 'm', age: 2,
    face: { w: 6.9, h: 9.8, jaw: .78, chinW: .38, eye: 'mono', eyeW: 1.3, eyeH: .58, tilt: .02, noseW: 1.45, noseL: 3.9, mouthW: 2.0, stubble: 1 }, brow: { col: '#1F1E26', w: .8, arch: .05 },
    hair: 'crew', hairCol: '#1F1F28', glasses: { type: 'rect', col: '#3B3C44', w: .28, size: 1.02 }, smile: 'flat',
    top: { type: 'sweat', col: '#5E3F37', fit: 'over', knit: '#D9A898' }, pants: { col: '#333746', cut: 'straight' }, shoes: 'runner' },
  // 06 · woman ~55: black bowl cut with blunt bangs, square-round face, black top, hot-pink floral scarf, phone in hand
  '06': { skin: SKIN.warm, h: .95, build: 1.14, sex: 'f', age: 3,
    face: { w: 7.9, h: 9.2, jaw: .92, chinW: .45, eye: 'mono', eyeW: 1.3, eyeH: .6, tilt: 0, noseW: 1.6, noseL: 3.7, mouthW: 2.2, bags: 1 }, brow: { col: '#26242C', w: .6, arch: .1 },
    hair: 'bowl', hairCol: '#1E1E27', smile: 'flat',
    top: { type: 'tee', col: '#2B2B35', sparkle: 1 }, scarf: '#EF4E86', pants: { col: '#26262F', cut: 'wide' }, shoes: 'blackSneaker' },
  // 07 · old man: grey hair swept back, lean lined face, navy collared shirt under a black diamond-quilted vest
  '07': { skin: SKIN.old, h: .96, build: 1.0, sex: 'm', age: 4,
    face: { w: 6.9, h: 10, jaw: .74, chinW: .34, eye: 'mono', eyeW: 1.25, eyeH: .5, tilt: -.05, noseW: 1.55, noseL: 4.2, mouthW: 2.2, lipU: .3, lipL: .45, cheekbone: 1, hollow: 1 }, brow: { col: '#8A8784', w: .65, arch: .1 },
    hair: 'sweptGrey', hairCol: '#BDB9B2', smile: 'soft',
    top: { type: 'vest', col: '#34363F', under: '#2F4674' }, pants: { col: '#2B3350', cut: 'straight' }, shoes: 'blackSneaker' },
  // 08 · woman ~50: straight black jaw-length bob, round gold glasses, brick-red shirt jacket over a black turtleneck
  '08': { skin: SKIN.mid, h: .96, build: .98, sex: 'f', age: 3,
    face: { w: 7.1, h: 9.3, jaw: .76, chinW: .34, eye: 'mono', eyeW: 1.35, eyeH: .6, tilt: .05, noseW: 1.35, noseL: 3.7, mouthW: 1.9 }, brow: { col: '#2A2630', w: .55, arch: .2 },
    hair: 'bob', hairCol: '#1C1C24', glasses: { type: 'round', col: '#C9A052', w: .26, size: 1.05 }, smile: 'soft',
    top: { type: 'shirtjacket', col: '#A83530', under: '#1C1C24' }, pants: { col: '#23232C', cut: 'straight' }, shoes: 'loafer' },
  // 09 · man ~55: grey textured hair brushed up, thin rimless glasses, long face, black henley, silver watch
  '09': { skin: SKIN.mid, h: 1.02, build: 1.02, sex: 'm', age: 3,
    face: { w: 6.8, h: 10.2, jaw: .72, chinW: .34, eye: 'mono', eyeW: 1.3, eyeH: .55, tilt: 0, noseW: 1.4, noseL: 4.2, mouthW: 2.1 }, brow: { col: '#4A4850', w: .7, arch: .1 },
    hair: 'greyUp', hairCol: '#6E6D72', hairHi: '#B8B6B4', glasses: { type: 'rect', col: '#9A9AA4', w: .22, size: 1.02 }, smile: 'soft', watch: 'L',
    top: { type: 'henley', col: '#22232C' }, pants: { col: '#232A40', cut: 'straight' }, shoes: 'blackLeather' },
  // 10 · man ~50: short black hair, square face, black sweatshirt with tan piping, black joggers, orange bead bracelet
  '10': { skin: SKIN.warm, h: 1.0, build: 1.12, sex: 'm', age: 3,
    face: { w: 7.7, h: 9.6, jaw: .88, chinW: .44, eye: 'mono', eyeW: 1.3, eyeH: .55, tilt: -.02, noseW: 1.6, noseL: 3.9, mouthW: 2.1, ears: 1.25 }, brow: { col: '#1F1E26', w: .8, arch: .05 },
    hair: 'shortBack', hairCol: '#1F1F28', smile: 'flat', bracelet: '#EB8E2C', watch: 'L',
    top: { type: 'sweat', col: '#26262E', fit: 'reg', piping: '#A08865' }, pants: { col: '#24242D', cut: 'jogger' }, shoes: 'blackSneaker' },
  // 11 · old woman: grey permed hair, round face, deep smile lines, red patterned stand-collar jacket with round buttons
  '11': { skin: SKIN.old, h: .9, build: 1.14, sex: 'f', age: 4,
    face: { w: 7.9, h: 9.3, jaw: .86, chinW: .44, eye: 'mono', eyeW: 1.2, eyeH: .5, tilt: -.05, noseW: 1.55, noseL: 3.8, mouthW: 2.2, lipU: .3, lipL: .5 }, brow: { col: '#8E8884', w: .55, arch: .15 },
    hair: 'perm', hairCol: '#BDB8B1', hairHi: '#E1DDD6', smile: 'soft',
    top: { type: 'mandarin', col: '#A62C35', pattern: '#D8434C' }, pants: { col: '#262838', cut: 'straight' }, shoes: 'blackLeather' },
  // 12 · man ~55: thick grey hair, rectangular half-rim glasses, square face, charcoal sweatshirt
  '12': { skin: SKIN.mid, h: 1.0, build: 1.1, sex: 'm', age: 3,
    face: { w: 7.6, h: 9.8, jaw: .86, chinW: .42, eye: 'mono', eyeW: 1.3, eyeH: .55, tilt: 0, noseW: 1.55, noseL: 4.1, mouthW: 2.2 }, brow: { col: '#3E3C42', w: .85, arch: .05 },
    hair: 'greyThick', hairCol: '#5E5D62', hairHi: '#A9A7A6', glasses: { type: 'halfrim', col: '#2A2A30', w: .34, size: 1.08 }, smile: 'flat',
    top: { type: 'sweat', col: '#3E3D45', fit: 'reg', patch: '#2A2A32' }, pants: { col: '#222230', cut: 'straight' }, shoes: 'blackSneaker' },
  // 13 · woman ~50: long black hair past the shoulders, middle part, round face, brown loose top with wide 3/4 sleeves
  '13': { skin: SKIN.mid, h: .96, build: 1.0, sex: 'f', age: 3,
    face: { w: 7.4, h: 9.0, jaw: .8, chinW: .38, eye: 'mono', eyeW: 1.35, eyeH: .6, tilt: .05, noseW: 1.4, noseL: 3.6, mouthW: 2.0 }, brow: { col: '#2A2630', w: .55, arch: .2 },
    hair: 'longMid', hairCol: '#1F1D22', smile: 'soft',
    top: { type: 'loose', col: '#6A4234' }, pants: { col: '#22222A', cut: 'wide' }, shoes: 'loafer' },
  // 14 · woman ~50: short black hair with side-swept bangs, thin gold oval glasses, round face, red fitted long top
  '14': { skin: SKIN.mid, h: .95, build: 1.06, sex: 'f', age: 3,
    face: { w: 7.8, h: 9.1, jaw: .86, chinW: .42, eye: 'mono', eyeW: 1.3, eyeH: .58, tilt: .02, noseW: 1.5, noseL: 3.6, mouthW: 2.2 }, brow: { col: '#2A2630', w: .55, arch: .2 },
    hair: 'shortBangs', hairCol: '#1F1E26', glasses: { type: 'oval', col: '#C9A052', w: .22, size: 1.0 }, smile: 'smile',
    top: { type: 'long', col: '#A8302F' }, pants: { col: '#22222A', cut: 'straight' }, shoes: 'loafer' },
  // 15 · man ~50: neat short black hair, rectangular metal glasses, grey polo, black belt with a silver buckle
  '15': { skin: SKIN.mid, h: 1.01, build: 1.06, sex: 'm', age: 3,
    face: { w: 7.3, h: 9.6, jaw: .84, chinW: .4, eye: 'mono', eyeW: 1.3, eyeH: .55, tilt: 0, noseW: 1.5, noseL: 3.9, mouthW: 2.2 }, brow: { col: '#1F1E26', w: .75, arch: .05 },
    hair: 'neat', hairCol: '#1C1C24', glasses: { type: 'rect', col: '#4A4B55', w: .26, size: 1.05 }, smile: 'soft',
    top: { type: 'polo', col: '#5A5C66' }, pants: { col: '#262A3E', cut: 'straight' }, shoes: 'blackLeather' },
  // 16 · young woman: long straight dark-brown hair, red velvet headband, red lips, red double-breasted blazer, houndstooth trousers
  '16': { skin: SKIN.young, h: .98, build: .9, sex: 'f', age: 1,
    face: { w: 6.8, h: 9.4, jaw: .68, chinW: .3, eye: 'double', eyeW: 1.5, eyeH: .7, tilt: .15, noseW: 1.2, noseL: 3.7, mouthW: 1.9 }, brow: { col: '#3A2A26', w: .5, arch: .25 },
    hair: 'longStraight', hairCol: '#2E2220', hairHi: '#6A4A3C', headband: '#C22F35', earring: { col: '#E8E4DC', drop: 1 }, lips: '#C22F3A', smile: 'soft',
    top: { type: 'blazer', col: '#D23330', under: '#1C1C24', fit: 'fitted', double: 1 }, pants: { col: '#8F8C90', cut: 'wide', hound: 1 }, shoes: 'loafer' },
};
// story roles → looks. (A first guess; the family will say who is who.)
const ROLE_LOOK = { nai: '11', ye: '07', dabo: '12', dabom: '14', ershu: '10', ershen: '13', gugu: '06', gufu: '09', xshu: '15', xshen: '08', biaoge: '03', biaojie: '02', xmei: '04', biaodi: '05', tangjie: '16', ayuan: '01' };
for (const [id, c] of Object.entries(LOOKS)) c.look = id;
const CAST = {};
for (const [role, look] of Object.entries(ROLE_LOOK)) CAST[role] = { ...LOOKS[look], id: role };

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
// skeleton for a pose (shared by drawing and headPos)
function skeleton(c, p) {
  const hs = c.h, sit = p.sit, crouch = p.crouch;
  const hipY = sit ? -28 : crouch ? -30 : -50 * hs;
  const shY = sit ? hipY - 29 * hs : crouch ? hipY - 30 * hs : -81 * hs;
  const headY = shY - 13.6 * hs + (p.nod || 0);
  const bw = (c.sex === 'm' ? 13.4 : 11.8) * c.build;
  return { hs, hipY, shY, headY, bw };
}

// person(spec, pose)
// pose: x, y, k, t, flip, face(-1..1 turn), tilt, nod, lean, dy, sq, sit, crouch, walk(phase), stride,
//       handL/handR ([x,y] local targets), bendL/bendR, gestL/gestR ('v','open','thumb','pocket','relax'),
//       eyes, mouth, brows, blush, look, tear, fog, holdL/holdR, alpha, key, back, noHands
function person(c, p) {
  const id = c.id || c.look, k = p.k, t = p.t ?? 0;
  const LW = .78 * Math.pow(k, -.5), WB = .5 * Math.pow(k, -.6), SC = 1.1 / k, rimD = Math.max(.55, 1.6 / k);
  const S = (key) => seed(id + ':' + key + (p.key || ''));
  const o = (extra) => ({ sw: LW, wob: WB, sc: SC, rimX: rimD, rimY: rimD * .8, rimW: Math.max(LW * 1.5, .45), band: 2.2, ...extra });
  const { hipY, shY, headY, bw } = skeleton(c, p);
  ctx.save();
  ctx.translate(p.x, p.y); ctx.scale(k * (p.flip ? -1 : 1), k);
  if (p.alpha !== undefined) ctx.globalAlpha = p.alpha;
  const sq = p.sq || 0; ctx.scale(1 + sq * .6, 1 - sq);
  ctx.translate(0, p.dy || 0);
  const sit = p.sit, crouch = p.crouch;
  const lean = (p.lean || 0) + (c.age >= 4 ? .03 : 0);
  let feet, knees;
  if (sit) { const sp = p.feetSpread ?? (c.sex === 'm' ? 3 : 0); feet = [[-6.8 - sp, 0], [6.8 + sp, 0]]; knees = [[-7.4 - sp * .8, hipY + 6.5], [7.4 + sp * .8, hipY + 6.5]]; }
  else if (crouch) { feet = [[-9, 0], [8, 0]]; knees = [[-12, -16], [12, -18]]; }
  else if (p.walk !== undefined) {
    const ph = p.walk * TAU, A = p.stride ?? 8;
    feet = [[-2.4 + Math.sin(ph) * A, -Math.max(0, Math.cos(ph)) * 3.5], [2.4 + Math.sin(ph + Math.PI) * A, -Math.max(0, Math.cos(ph + Math.PI)) * 3.5]];
    knees = feet.map(f => [f[0] * .55 + 1.6, hipY / 2 + f[1] * .4]);
  } else { const sp = p.feetSpread ?? (c.sex === 'm' ? 1.2 : 0); feet = [[-5.4 - sp, 0], [5.4 + sp, 0]]; knees = [[-5.2 - sp * .5, hipY / 2], [5.2 + sp * .5, hipY / 2]]; }
  const upper = (fn) => { ctx.save(); ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY); fn(); ctx.restore(); };
  upper(() => {
    if (!p.back) { S('bh'); ctx.save(); ctx.translate(0, headY); ctx.rotate(p.tilt || 0); hairBack(c, o, LW); ctx.restore(); }
    if (c.scarf && !p.back) scarfBack(c, shY, bw, o, S);
  });
  S('legs'); legs(c, p, feet, knees, hipY, o, LW);
  upper(() => {
    const g = torso(c, p, shY, hipY, bw, o, S, LW);
    if (sit && !p.back) lap(c, hipY, bw, o, S, LW, knees);
    S('neck');
    shape([[-3.4, shY - 6], [3.4, shY - 6], [3.8, shY + .8], [-3.8, shY + .8]], o({ fill: c.skin, ink: null, band: 0 }));
    shape([[-3.4, shY - 3], [3.4, shY - 3], [3.8, shY + .8], [-3.8, shY + .8]], o({ fill: mix(c.skin, '#9A5A48', .25), ink: null, alpha: .6, band: 0 }));
    if (!p.back) collar(c, shY, bw, o, S, LW);
    if (c.scarf && !p.back) scarfFront(c, shY, g.hemY, bw, o, S, p, LW);
    const shL = [-bw + 2.6, shY + 3.2], shR = [bw - 2.6, shY + 3.2];
    const hang = s => [s * (bw + 1.2), shY + 33];
    const sitRest = s => [s * 6, hipY + 3];
    const hL = p.handL ? p.handL.slice() : sit ? sitRest(-1) : hang(-1);
    const hR = p.handR ? p.handR.slice() : sit ? sitRest(1) : hang(1);
    const drawHead = () => { ctx.save(); ctx.translate(0, headY); ctx.rotate(p.tilt || 0); head(c, p, o, S, LW, WB); ctx.restore(); };
    if (p.back) { drawHead(); return; }
    drawHead();
    if (['wavy', 'longStraight', 'longMid'].includes(c.hair)) { S('fronthair'); ctx.save(); ctx.translate(0, headY); ctx.rotate(p.tilt || 0); hairOverShoulder(c, o, LW); ctx.restore(); }
    arm(c, p, shL, hL, 'L', o, S, LW); arm(c, p, shR, hR, 'R', o, S, LW);
  });
  ctx.restore();
  seed('after:' + id);
  return { headY, shY, hipY };
}
function headPos(c, p) { const s = skeleton(c, p); return [p.x, p.y + (s.headY + (p.dy || 0)) * p.k]; }

// ── legs, trousers, shoes ──
function legs(c, p, feet, knees, hipY, o, LW) {
  const cut = c.pants.cut, pc = c.pants.col;
  const W = { wide: [9.8, 9, 10], straight: [8.4, 7, 6.9], jogger: [8.8, 7.2, 5.8], slim: [8, 6.4, 6] }[cut] || [8.4, 7, 6.9];
  const hips = [[-5.1, hipY + 1], [5.1, hipY + 1]];
  if (!p.sit) { const hw = W[0] + .6; const PV = [[-hw, hipY - 7], [hw, hipY - 7], [hw + .2, hipY + 3], [1.4, hipY + 6.5], [-1.4, hipY + 6.5], [-hw - .2, hipY + 3]]; shape(PV, o({ fill: pc, rim: true, curv: .4, band: 1.8 })); }
  for (let i = 0; i < 2; i++) {
    const f = feet[i], kn = knees[i], s = i ? 1 : -1;
    shoe(c, [f[0] + s * 1.2, f[1]], s, o, LW);
    const ankle = [f[0], f[1] - 3.2];
    const P = p.sit ? ribbonPts([[kn[0], kn[1] + 2], [lerp(kn[0], ankle[0], .5), lerp(kn[1], ankle[1], .5)], ankle], W[1] * 1.02, W[2]) : ribbonPts([hips[i], kn, ankle], W[0], W[2], 2);
    shape(P, o({ fill: pc, rim: true, curv: .5, band: 2.8 }));
    const dk = mix(pc, PAL.ink, .45);
    if (!p.sit) { line([[kn[0] + s * .6, kn[1] - 6], [kn[0] + s * .2, kn[1] + 6]], LW * .5, dk, { double: false, alpha: .6 }); line([[ankle[0] - W[2] * .3, ankle[1] - 3], [ankle[0] + W[2] * .2, ankle[1] - 5]], LW * .5, dk, { double: false, alpha: .5 }); }
    if (cut === 'jogger') shape(ribbonPts([[ankle[0], ankle[1] - 1.6], [ankle[0], ankle[1] + .2]], W[2] * .95, W[2] * .95, 2), o({ fill: mix(pc, PAL.ink, .15), sw: LW * .6, band: 0 }));
    if (c.pants.hound) houndstooth(P, hipY);
  }
}
function houndstooth(P, y0) {
  ctx.save(); tracePath(P, true, .5); ctx.clip(); ctx.fillStyle = rgba('#26262E', .72);
  for (let yy = y0 - 4; yy < 1; yy += 2.2) for (let xx = -16; xx < 16; xx += 2.2) if ((Math.round(xx / 2.2) + Math.round(yy / 2.2)) % 2 === 0) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 1.3, yy); ctx.lineTo(xx + 1.9, yy + 1.1); ctx.lineTo(xx + .5, yy + 1.4); ctx.lineTo(xx - .3, yy + .6); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function shoe(c, [x0, y], s, o, LW) {
  const t = c.shoes; ctx.save(); ctx.translate(x0, y); ctx.scale(1.3, 1.3); ctx.translate(-x0, -y); const x = x0;
  const body = { whiteChunky: '#EFEBE4', nb: '#E9E3D6', cream: '#F2EBDD', runner: '#E2DED6', blackSneaker: '#2A2A33', blackLeather: '#23232B', loafer: '#1F1F27' }[t] || '#2A2A33';
  const P = [[x - s * 3.4, y - .2], [x - s * 3.8, y - 2.6], [x - s * 1.2, y - 3.8], [x + s * 2.4, y - 3.1], [x + s * 4.6, y - 1.6], [x + s * 4.8, y - .1]];
  shape(P, o({ fill: body, curv: .6, sw: LW * .9, band: 1 }));
  if (['whiteChunky', 'nb', 'runner', 'blackSneaker', 'cream'].includes(t)) {
    shape([[x - s * 3.7, y + .3], [x + s * 5, y + .3], [x + s * 4.9, y - 1.1], [x - s * 3.6, y - 1.1]], o({ fill: t === 'blackSneaker' ? '#D9D4CA' : '#FBF8F1', sw: LW * .7, curv: .3, band: 0 }));
    if (t === 'nb') line([[x - s * 1.5, y - 1.4], [x + s * .6, y - 3], [x + s * 2, y - 1.5]], LW * .9, '#8C8F9A', { double: false });
    if (t === 'runner') { line([[x - s * 1.8, y - 1.5], [x + s * 1.8, y - 2.8]], LW * 1.1, '#3F7FB8', { double: false }); line([[x - s * .5, y - 1.3], [x + s * 3, y - 2.2]], LW * .9, '#E5A13B', { double: false }); }
    line([[x - s * .6, y - 3.4], [x + s * 1.4, y - 2.9]], LW * .5, '#9A968E', { double: false });
  }
  if (t === 'loafer') { line([[x + s * .2, y - 3.1], [x + s * 2.2, y - 2.6]], LW * 1.1, '#D6AE52', { double: false }); shape(ellPts(x + s * 3.4, y - 1.8, .9, .6, 6), { fill: '#FFFFFF', ink: null, flat: 1, alpha: .35 }); }
  if (t === 'blackLeather') shape(ellPts(x + s * 3, y - 1.9, 1.1, .6, 6), { fill: '#FFFFFF', ink: null, flat: 1, alpha: .3 });
  ctx.restore();
}

// ── torso & garment ──
function torso(c, p, shY, hipY, bw, o, S, LW) {
  const t = c.top, over = t.fit === 'over';
  const hemY = hipY + ({ sweat: over ? 3 : 1.5, tee: 4, blazer: t.fit === 'fitted' ? 4 : 7, crop: -5, vest: 2, shirtjacket: 6, henley: 2, mandarin: 5, loose: 4, long: 8, polo: -1 }[t.type] ?? 2);
  const drop = over ? 2 : 0;
  const waistW = bw * (t.fit === 'fitted' ? .76 : c.sex === 'f' ? .86 : .92);
  const hemW = bw * ({ sweat: over ? .98 : .9, blazer: t.fit === 'fitted' ? .9 : 1.02, loose: 1.08, long: .98, mandarin: 1.02, tee: 1.02, crop: .86, vest: .9, shirtjacket: .98, henley: .9, polo: .9 }[t.type] ?? .92);
  const P = [[-3.6, shY - 1.8], [3.6, shY - 1.8], [bw - 2.8, shY - .2], [bw + drop * .4, shY + 3.2], [bw + drop * .2 - .6, shY + 12], [waistW, hipY - 8], [hemW, hemY - 1], [hemW - .6, hemY], [-hemW + .6, hemY], [-hemW, hemY - 1], [-waistW, hipY - 8], [-bw - drop * .2 + .6, shY + 12], [-bw - drop * .4, shY + 3.2], [-bw + 2.8, shY - .2]];
  S('torso');
  const base = t.type === 'vest' ? t.under : t.col;
  shape(P, o({ fill: base, rim: true, curv: .7, band: 6 }));
  if (p.back) return { hemY };
  const dk = mix(base, PAL.ink, .42), hi = mix(base, '#FFF8EA', .35);
  S('garm');
  const ribbed = (y, w) => { shape([[-w, y - 2.4], [w, y - 2.4], [w - .3, y], [-w + .3, y]], o({ fill: mix(base, PAL.ink, .1), sw: LW * .6, curv: 0, band: 0 })); for (let x = -w + 1; x < w; x += 1.1) line([[x, y - 2.2], [x, y - .2]], LW * .3, dk, { double: false, alpha: .45 }); };
  if (t.type === 'sweat') {
    ribbed(hemY, hemW - .4);
    if (over) { line([[-bw - .4, shY + 3.6], [-bw + 1.2, shY + 1]], LW * .5, dk, { double: false }); line([[bw + .4, shY + 3.6], [bw - 1.2, shY + 1]], LW * .5, dk, { double: false }); }
    line([[-4, hipY - 10], [-1.5, hipY - 5]], LW * .45, dk, { double: false, alpha: .5 }); line([[5, hipY - 12], [3, hipY - 6]], LW * .45, dk, { double: false, alpha: .5 });
    if (t.stripes) { ctx.save(); tracePath(P, true, .7); ctx.clip(); for (let y = shY + 8; y < hemY - 3; y += 3.1) line([[-bw - 2, y + jit(.2)], [bw + 2, y + jit(.2)]], 1.05, t.stripes, { double: false, wob: .15 }); ctx.restore(); shape([[-3, shY - .4], [3, shY - .4], [0, shY + 4.5]], { fill: '#8FC7B4', ink: null, alpha: .6, flat: 1 }); }
    if (t.knit) { ctx.save(); tracePath(P, true, .7); ctx.clip(); for (let i = 0; i < 9; i++) { const x0 = -bw + hash(c.look, i) * bw * 1.6, y0 = shY + 5 + hash(c.look, i, 2) * (hemY - shY - 10); line([[x0, y0], [x0 + 2.4, y0 - 1.6], [x0 + 4.6, y0 + .6], [x0 + 7, y0 - 2], [x0 + 9.6, y0 - .4]], .7, t.knit, { double: false, wob: .25, alpha: .85 }); line([[x0 + 3, y0 - 1], [x0 + 2, y0 - 4]], .6, t.knit, { double: false, alpha: .7 }); } ctx.restore(); }
    if (t.patch) { shape(rrPts(bw * .18, shY + 8, 3.2, 3.4, .5), o({ fill: t.patch, sw: LW * .45, band: 0 })); line([[bw * .18 + .9, shY + 10.8], [bw * .18 + 1.6, shY + 8.9], [bw * .18 + 2.3, shY + 10.8]], .35, '#EDE8DC', { double: false, wob: .05, curv: 0 }); }
    if (t.piping) { line([[-bw + 2, shY + .5], [-bw - .4, shY + 14], [-hemW, hemY - 3]], LW * .55, t.piping, { double: false }); line([[bw - 2, shY + .5], [bw + .4, shY + 14], [hemW, hemY - 3]], LW * .55, t.piping, { double: false }); }
  }
  if (t.type === 'tee') { ribbed(hemY, hemW - .4); if (t.sparkle) { ctx.save(); tracePath(P, true, .7); ctx.clip(); for (let i = 0; i < 40; i++) shape(ellPts(-bw + hash('sp', i) * bw * 2, shY + hash('sp', i, 1) * (hemY - shY), .35, .35, 4), { fill: '#8A8FA8', ink: null, flat: 1, alpha: .6 }); ctx.restore(); } }
  if (t.type === 'blazer') {
    const dbl = t.double, lapX = dbl ? 1.8 : 0;
    shape([[-3.6, shY - 1.6], [3.6, shY - 1.6], [2.2 + lapX, shY + (dbl ? 11 : 15)], [-2.2 + lapX, shY + (dbl ? 11 : 15)]], o({ fill: t.under, ink: null, band: 0 }));
    shape([[-3.8, shY - 1.8], [-6.2, shY + 2.4], [-4.8, shY + 3.6], [-6.8, shY + 5], [lapX - 1, shY + (dbl ? 12 : 16)], [-2.4, shY + 5]], o({ fill: mix(base, PAL.ink, .08), sw: LW * .7, curv: .2, band: 1 }));
    shape([[3.8, shY - 1.8], [6.2, shY + 2.4], [4.8, shY + 3.6], [6.8, shY + 5], [lapX + 1.2, shY + (dbl ? 12 : 16)], [2.4, shY + 5]], o({ fill: mix(base, PAL.ink, .08), sw: LW * .7, curv: .2, band: 1 }));
    line([[lapX, shY + (dbl ? 12 : 16)], [dbl ? 3 : 0, hemY]], LW * .7, dk, { double: false });
    for (const [x, y] of dbl ? [[lapX + 2.4, shY + 17], [lapX - 3.2, shY + 17]] : [[.7, shY + 19]]) shape(ellPts(x, y, .75, .75, 6), o({ fill: dbl ? '#D6AE52' : '#2A2A30', sw: LW * .35, band: 0 }));
    for (const s of [-1, 1]) shape(rectPts(s > 0 ? 3.6 : -hemW + 1.6, hipY - 3, hemW - 5.2, 1.2), o({ fill: mix(base, PAL.ink, .12), sw: LW * .45, curv: 0, band: 0 }));
    if (t.tweed) { ctx.save(); tracePath(P, true, .7); ctx.clip(); for (let y = shY; y < hemY; y += 1.6) for (let x = -bw; x < bw; x += 3.2) line([[x + (Math.round(y / 1.6) % 2) * 1.6, y], [x + (Math.round(y / 1.6) % 2) * 1.6 + 1.1, y + 1.1]], .3, hi, { double: false, alpha: .45, wob: 0 }); ctx.restore(); }
    if (t.necklace) { line(arcPts(0, shY - .5, 2.3, .35, Math.PI - .35, 7, 5.5), .3, '#D6AE52', { double: false, wob: .05 }); shape(ellPts(0, shY + 5.2, .75, .85, 6), { fill: t.necklace, ink: '#A86A60', sw: .2, flat: 1 }); }
  }
  if (t.type === 'crop') { line([[0, shY + 1], [0, hemY]], LW * .6, dk, { double: false }); line([[-5, shY + 10], [-3.5, hipY - 10]], LW * .4, dk, { double: false, alpha: .5 }); }
  if (t.type === 'vest') {
    const V = [[-bw + 3.2, shY + .6], [-2.2, shY - .6], [0, shY + 9], [2.2, shY - .6], [bw - 3.2, shY + .6], [bw - .4, shY + 11], [hemW, hemY - .6], [-hemW, hemY - .6], [-bw + .4, shY + 11]];
    shape(V, o({ fill: t.col, curv: .35, band: 2.4 }));
    ctx.save(); tracePath(V, true, .35); ctx.clip();
    for (let i = -8; i < 10; i++) { line([[i * 3.4 - 9, shY], [i * 3.4 + 9, hemY]], .4, '#5E6276', { double: false, wob: .1 }); line([[i * 3.4 + 9, shY], [i * 3.4 - 9, hemY]], .4, '#565a6c', { double: false, wob: .1 }); }
    ctx.restore();
    line([[0, shY + 9], [0, hemY]], LW * .6, mix(t.col, PAL.ink, .5), { double: false });
    for (let i = 0; i < 5; i++) shape(ellPts(.8, shY + 11 + i * 4, .6, .6, 6), { fill: '#15151B', ink: null, flat: 1 });
  }
  if (t.type === 'shirtjacket') {
    shape([[-3.4, shY - 1.2], [3.4, shY - 1.2], [0, shY + 10]], o({ fill: t.under, ink: null, band: 0 }));
    line([[-.8, shY + 9], [-1.2, hemY]], LW * .6, dk, { double: false }); line([[.8, shY + 9], [1.2, hemY]], LW * .6, dk, { double: false });
    for (const s of [-1, 1]) shape(rrPts(s > 0 ? 3 : -7.6, shY + 8, 4.6, 3.6, .6), o({ fill: mix(base, PAL.ink, .06), sw: LW * .4, band: 0 }));
  }
  if (t.type === 'henley' || t.type === 'polo') {
    const py = t.type === 'polo' ? 7.6 : 9;
    line([[0, shY + 1], [0, shY + py]], LW * .6, dk, { double: false }); line([[1.2, shY + 1], [1.2, shY + py]], LW * .5, dk, { double: false });
    for (const y of t.type === 'polo' ? [3, 5.8] : [2.4, 5, 7.6]) shape(ellPts(.6, shY + y, .45, .45, 6), { fill: '#C9CBD2', ink: null, flat: 1 });
    if (t.type === 'polo') { shape(rectPts(-hemW + .4, hemY - 2.6, hemW * 2 - .8, 2.2), o({ fill: '#1C1C22', sw: LW * .45, curv: 0, band: 0 })); shape(rrPts(-1.5, hemY - 3, 3, 3, .4), o({ fill: '#B9B9C0', sw: LW * .35, band: 0 })); }
    line([[-5, hipY - 12], [-3, hipY - 6]], LW * .45, dk, { double: false, alpha: .5 });
  }
  if (t.type === 'mandarin') {
    line([[0, shY + 1], [0, hemY]], LW * .7, dk, { double: false });
    ctx.save(); tracePath(P, true, .7); ctx.clip();
    for (let y = shY; y < hemY + 2; y += 2.4) for (let x = -bw - 2; x < bw + 2; x += 2.4) if ((Math.round(x / 2.4) + Math.round(y / 2.4)) % 2) line([[x, y], [x + 1.2, y + 1.2]], .35, mix(base, PAL.ink, .35), { double: false, alpha: .55, wob: 0 });
    for (let i = 0; i < 8; i++) { const x = (i % 2 ? 1 : -1) * (3.5 + (i >> 1) % 2 * 4), y = shY + 5 + (i >> 1) * 6; shape([[x - 1.8, y], [x, y - 1.8], [x + 1.8, y], [x, y + 1.8]], { fill: t.pattern, ink: null, flat: 1, alpha: .7, wob: .1 }); }
    ctx.restore();
    for (let i = 0; i < 4; i++) { shape(ellPts(0, shY + 4 + i * 6, 1.05, 1.05, 8), o({ fill: '#5E1822', sw: LW * .35, band: 0 })); shape(ellPts(-.3, shY + 3.7 + i * 6, .35, .35, 5), { fill: '#F2C8C8', ink: null, flat: 1, alpha: .8 }); }
  }
  if (t.type === 'loose' || t.type === 'long') {
    line([[-4, hipY - 8], [-2.5, hemY - 1]], LW * .45, dk, { double: false, alpha: .5 }); line([[5, hipY - 10], [3.6, hemY - 2]], LW * .45, dk, { double: false, alpha: .5 });
    if (t.type === 'long') { line([[-hemW + 1, hemY - 5], [-hemW + .6, hemY]], LW * .5, dk, { double: false }); line([[hemW - 1, hemY - 5], [hemW - .6, hemY]], LW * .5, dk, { double: false }); }
  }
  return { hemY };
}
function collar(c, shY, bw, o, S, LW) {
  const t = c.top, base = t.type === 'vest' ? t.under : t.col, dk = mix(base, PAL.ink, .42);
  S('collar');
  if (t.type === 'sweat') shape([...arcPts(0, shY - 2.6, 4.2, .05, Math.PI - .05, 10, 4.8), ...arcPts(0, shY - 2.6, 2.8, Math.PI - .05, .05, 10, 3.4)], o({ fill: mix(base, PAL.ink, .08), sw: LW * .6, curv: .5, band: 0 }));
  if (t.type === 'tee' || t.type === 'long' || t.type === 'loose') line(arcPts(0, shY - 2.4, t.type === 'loose' ? 4.6 : 4, .12, Math.PI - .12, 10, 4.2), LW * .8, dk, { double: false });
  if (t.type === 'blazer' && t.under) shape(rrPts(-3.2, shY - 5, 6.4, 5, 1.6), o({ fill: t.under, sw: LW * .5, band: 0 }));
  if (t.type === 'shirtjacket') { shape(rrPts(-3.1, shY - 5.4, 6.2, 5.2, 1.6), o({ fill: t.under, sw: LW * .5, band: 0 })); for (const s of [-1, 1]) shape([[s * 2.8, shY - 2], [s * 7, shY - .5], [s * 5.6, shY + 5], [s * 1.2, shY + 1]], o({ fill: mix(base, PAL.ink, .08), sw: LW * .6, curv: .2, band: .8 })); }
  if (t.type === 'vest') for (const s of [-1, 1]) shape([[s * .3, shY - 3.4], [s * 3.6, shY - 3], [s * 4.2, shY + 1.4], [s * 1, shY + 3]], o({ fill: t.under, sw: LW * .5, curv: .2, band: 0 }));
  if (t.type === 'polo') for (const s of [-1, 1]) shape([[s * .2, shY - 3], [s * 4, shY - 2.6], [s * 5.4, shY + 1.8], [s * 1.2, shY + 2.4]], o({ fill: mix(base, PAL.ink, .12), sw: LW * .55, curv: .2, band: 0 }));
  if (t.type === 'henley') line(arcPts(0, shY - 2.4, 3.6, .1, Math.PI - .1, 8, 3.8), LW * .8, dk, { double: false });
  if (t.type === 'mandarin') shape(rrPts(-4.2, shY - 4.2, 8.4, 4, 1.2), o({ fill: mix(base, PAL.ink, .08), sw: LW * .6, band: 0 }));
  if (t.type === 'crop' && t.ruffle) { shape(rrPts(-3.3, shY - 6, 6.6, 6.2, 1.8), o({ fill: '#F7EEDB', sw: LW * .5, band: 0 })); line(arcPts(0, shY - 5.8, 3.4, Math.PI, TAU, 10, 1.2).map(([x, y], i) => [x, y - (i % 2) * .7]), LW * .5, '#C9B998', { double: false, curv: 0 }); for (const s of [-1, 1]) shape([[s * .6, shY - .6], [s * 5.6, shY - .2], [s * 5, shY + 5], [s * 1, shY + 3]], o({ fill: mix(base, PAL.ink, .04), sw: LW * .5, curv: .3, band: .8 })); }
}
function lap(c, hipY, bw, o, S, LW, knees) {
  S('lap');
  const pc = c.pants.col, w = c.pants.cut === 'wide' ? 1.05 : .98;
  for (const s of [-1, 1]) {
    const kx = knees[s > 0 ? 1 : 0][0];
    const P = [[s * .4, hipY - 4], [s * bw * w * .9, hipY - 4], [kx + s * 4.6, hipY + 2], [kx + s * 4.4, hipY + 8], [kx - s * 4.2, hipY + 8.6], [s * .4, hipY + 4]];
    // (thighs toward the viewer)
    shape(P, o({ fill: pc, rim: true, curv: .6, band: 1.8 }));
    if (c.pants.hound) houndstooth(P, hipY - 4);
  }
}

// ── arms & hands ──
function arm(c, p, sh, hand, side, o, S, LW) {
  const t = c.top, over = t.fit === 'over';
  const am = p.armScale ?? (p.sit ? .8 : 1);
  const [E, Hd] = ik(sh, hand, 16.2 * am, 15.6 * am, p['bend' + side]);
  S('arm' + side);
  const sleeve = t.type === 'vest' ? t.under : t.col;
  const gest = p['gest' + side] || 'relax';
  const wrist = [lerp(E[0], Hd[0], .9), lerp(E[1], Hd[1], .9)];
  if (t.type === 'loose' || t.type === 'tee') {
    const cut = t.type === 'tee' ? .15 : .45, mid = [lerp(E[0], Hd[0], cut), lerp(E[1], Hd[1], cut)];
    shape(ribbonPts([mid, wrist], 3.6, 3.1), o({ fill: c.skin, curv: .5, band: 1 }));
    shape(ribbonPts([sh, E, mid], 6.6, t.type === 'loose' ? 7.8 : 6), o({ fill: sleeve, rim: true, curv: .5, band: 1.6 }));
  } else {
    const w0 = over ? 6.6 : 5.8, w1 = over ? 5.4 : 4.6;
    const cuffAt = [lerp(E[0], Hd[0], .78), lerp(E[1], Hd[1], .78)];
    const SP = ribbonPts([sh, E, cuffAt], w0, w1);
    shape(SP, o({ fill: sleeve, rim: true, curv: .5, band: 1.6 }));
    const dk = mix(sleeve, PAL.ink, .42);
    line([[lerp(sh[0], E[0], .75) - 1, lerp(sh[1], E[1], .75)], [E[0] + 1, E[1] + 1.5]], LW * .45, dk, { double: false, alpha: .5 });
    if (['sweat', 'henley', 'polo', 'mandarin', 'long'].includes(t.type)) {
      const a = Math.atan2(Hd[1] - E[1], Hd[0] - E[0]);
      shape(ribbonPts([cuffAt, [cuffAt[0] + Math.cos(a) * 2.2, cuffAt[1] + Math.sin(a) * 2.2]], w1 * .92, w1 * .85, 2), o({ fill: mix(sleeve, PAL.ink, .1), sw: LW * .6, band: 0 }));
    }
    if (t.piping) line([sh, E, cuffAt], LW * .5, t.piping, { double: false, alpha: .9 });
    if (t.stripes) { ctx.save(); tracePath(SP, true, .5); ctx.clip(); for (let i = 1; i < 10; i++) { const q = i / 10, P0 = q < .5 ? [lerp(sh[0], E[0], q * 2), lerp(sh[1], E[1], q * 2)] : [lerp(E[0], cuffAt[0], (q - .5) * 2), lerp(E[1], cuffAt[1], (q - .5) * 2)]; line([[P0[0] - 5, P0[1] - .6], [P0[0] + 5, P0[1] + .6]], 1, t.stripes, { double: false, wob: .1 }); } ctx.restore(); }
  }
  if (c.watch === side) { const w = [lerp(E[0], Hd[0], .86), lerp(E[1], Hd[1], .86)]; shape(ellPts(w[0], w[1], 1.7, 1.7, 8), o({ fill: '#C9CCD4', sw: LW * .55, band: 0 })); shape(ellPts(w[0], w[1], .9, .9, 6), { fill: '#F4F2EC', ink: null, flat: 1 }); }
  if (c.bracelet && side === 'R') { const w = [lerp(E[0], Hd[0], .86), lerp(E[1], Hd[1], .86)]; for (let i = 0; i < 5; i++) shape(ellPts(w[0] - 2.2 + i * 1.1, w[1] + (i % 2) * .4, .75, .75, 6), { fill: c.bracelet, ink: '#9A5418', sw: .15, flat: 1, wob: 0 }); }
  if (p.noHands || gest === 'pocket') return;
  handShape(c, Hd, Math.atan2(Hd[1] - E[1], Hd[0] - E[0]), gest, side, LW);
  const hold = p['hold' + side];
  if (hold) { ctx.save(); ctx.translate(Hd[0], Hd[1]); hold(p.k, LW); ctx.restore(); }
}
function handShape(c, [x, y], a, gest, side, LW) {
  const sk = c.skin, dk = mix(sk, '#8A4A3A', .45), sw = LW * .7;
  ctx.save(); ctx.translate(x, y); ctx.scale(.85, .85);
  if (gest === 'v' || gest === 'thumb') {
    shape(rrPts(-2.1, -1.2, 4.2, 4.2, 1.4), { fill: sk, ink: PAL.ink, sw, wob: .06, band: 0 });
    if (gest === 'v') for (const [dx, r] of [[-1.2, -.18], [.9, .18]]) { ctx.save(); ctx.translate(dx, -1); ctx.rotate(r); shape(rrPts(-.75, -5.6, 1.5, 6, .75), { fill: sk, ink: PAL.ink, sw, wob: .05, band: 0 }); ctx.restore(); }
    if (gest === 'thumb') shape(rrPts(-2, -5.2, 1.6, 5, .8), { fill: sk, ink: PAL.ink, sw, wob: .05, band: 0 });
    line([[-1.6, .6], [1.6, .6]], sw * .6, dk, { double: false }); line([[-1.6, 1.8], [1.6, 1.8]], sw * .6, dk, { double: false });
    ctx.restore(); return;
  }
  ctx.rotate(a - Math.PI / 2);
  if (gest === 'open') {
    shape(rrPts(-2, -1, 4, 3.6, 1.2), { fill: sk, ink: PAL.ink, sw, wob: .06, band: 0 });
    for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-1.5 + i * 1, 2.4); ctx.rotate((i - 1.5) * .12); shape(rrPts(-.45, 0, .9, 3.4 - Math.abs(i - 1.5) * .5, .45), { fill: sk, ink: PAL.ink, sw: sw * .8, wob: .04, band: 0 }); ctx.restore(); }
    ctx.save(); ctx.translate(side === 'L' ? 1.9 : -1.9, .4); ctx.rotate(side === 'L' ? -.9 : .9); shape(rrPts(-.5, 0, 1, 2.8, .5), { fill: sk, ink: PAL.ink, sw: sw * .8, wob: .04, band: 0 }); ctx.restore();
  } else {
    shape([[-1.9, -1.2], [1.9, -1.2], [2.1, 2.2], [1.4, 4.4], [-1.2, 4.6], [-2, 2.4]], { fill: sk, ink: PAL.ink, sw, wob: .06, curv: .8, band: 0 });
    ctx.save(); ctx.translate(side === 'L' ? 1.6 : -1.6, .8); ctx.rotate(side === 'L' ? -.5 : .5); shape(rrPts(-.55, 0, 1.1, 2.6, .55), { fill: sk, ink: PAL.ink, sw: sw * .8, wob: .04, band: 0 }); ctx.restore();
    line([[-.6, 2.8], [-.6, 4.2]], sw * .5, dk, { double: false }); line([[.6, 2.8], [.6, 4.3]], sw * .5, dk, { double: false });
  }
  ctx.restore();
}

// ── the scarf (06): hot pink with blue, yellow and green flowers, fringed ──
function scarfBack(c, shY, bw, o, S) { S('scarfB'); shape([[-bw + 1, shY - 2], [bw - 1, shY - 2], [bw + 1, shY + 5], [-bw - 1, shY + 5]], o({ fill: mix(c.scarf, PAL.ink, .15), curv: .6, band: 0 })); }
function scarfFront(c, shY, hemY, bw, o, S, p, LW) {
  S('scarf');
  const sway = Math.sin((p.t || 0) * 2.1) * .8;
  const Lp = [[-6.4, shY - 4], [-1.4, shY - 1.6], [-2.6, shY + 12], [-3.6 + sway, hemY + 4], [-10.4 + sway, hemY + 5], [-9.4, shY + 12], [-9.6, shY + 1]];
  const Rp = [[1.6, shY - 4], [7.8, shY - 3], [10.4, shY + 8], [11.6 + sway, hemY + 10], [3.6 + sway, hemY + 11], [2.4, shY + 12], [.2, shY + 1]];
  for (const P of [Rp, Lp]) {
    shape(P, o({ fill: c.scarf, rim: true, curv: .5 }));
    ctx.save(); tracePath(P, true, .5); ctx.clip();
    for (let i = 0; i < 14; i++) { const fx = lerp(P[0][0], P[3][0], hash('fl', i)) + (hash('fl2', i) - .5) * 5, fy = lerp(shY, hemY + 8, hash('fl3', i)); const col = ['#3657B0', '#F3C443', '#86CDB0', '#3657B0'][i % 4]; shape(ellPts(fx, fy, 1.6, 1.1, 7, hash('fr', i) * 3), { fill: col, ink: null, alpha: .85, flat: 1, wob: .2 }); if (i % 3 === 0) shape(ellPts(fx + 1.4, fy + 1, .8, .6, 5), { fill: '#2C4C9A', ink: null, flat: 1, alpha: .8 }); }
    ctx.restore();
  }
  for (let i = 0; i < 7; i++) { line([[-10 + sway + i * 1.1, hemY + 4.8], [-10.2 + sway + i * 1.1, hemY + 7.6]], .4, c.scarf, { double: false }); line([[4 + sway + i * 1.1, hemY + 10.8], [3.8 + sway + i * 1.1, hemY + 13.6]], .4, c.scarf, { double: false }); }
  shape([[-6.6, shY - 4.4], [6.6, shY - 4.4], [8.2, shY + .8], [-8.2, shY + .8]], o({ fill: mix(c.scarf, '#FF9EC0', .15), curv: .6, band: 1 }));
}

// ── the head ──
// face outline from anatomical keypoints (mirrored): forehead, temple, cheekbone, jaw angle, chin
function faceOutline(F, f = 0) {
  const w = F.w, h = F.h, jaw = F.jaw, cw = F.chinW ?? .34, ck = F.cheek ? 1.04 : 1;
  const R = [[0, -h], [w * .62, -h * .93], [w * .93, -h * .56], [w * 1.0, -h * .14], [w * ck, h * .14], [w * lerp(ck, jaw, .45), h * .42], [w * jaw, h * .66], [w * cw * 1.55, h * .9], [w * cw, h * .99], [0, h * 1.01]];
  const P = [...R, ...R.slice(1, -1).reverse().map(([x, y]) => [-x, y])];
  return P.map(([x, y]) => [x * (1 - .12 * f * Math.sign(x)) + f * .7 * (1 - Math.abs(y) / h * .5), y]);
}
function head(c, p, o, S, LW, WB) {
  const F = c.face, f = clamp(p.face || 0, -1, 1), t = p.t || 0;
  const col = c.skin, dk = mix(col, '#6E2E26', .6), shadowC = mix(col, '#9A4A40', .45), lightC = mix(col, '#FFE9C8', .5);
  if (p.back) {
    S('ears'); for (const s of [-1, 1]) shape(ellPts(s * (F.w - .1), 1.2, 1.3, 2.2, 8), o({ fill: col, band: 0 }));
    S('backhead'); hairBackView(c, o, LW); return;
  }
  const cx = f * 2.4, ey = F.eyeY ?? 0;
  // ears
  S('ears');
  const earS = F.ears || 1;
  for (const s of [-1, 1]) {
    if (s * f > .7) continue;
    const ex0 = s * (F.w * .98) + f * .7;
    const E = [[ex0, ey - 1.2], [ex0 + s * 1.3 * earS, ey - 1.8 * earS], [ex0 + s * 1.6 * earS, ey + .4], [ex0 + s * 1.1 * earS, ey + 2.6 * earS], [ex0 - s * .1, ey + 3.4]];
    shape(E, o({ fill: col, band: .4, curv: .8 }));
    line([[ex0 + s * .5, ey - .8], [ex0 + s * 1.1 * earS, ey - .9], [ex0 + s * 1.1 * earS, ey + 1.4], [ex0 + s * .6, ey + 2]], LW * .45, dk, { double: false, alpha: .7 });
  }
  // face
  S('face');
  const FP = faceOutline(F, f);
  shape(FP, o({ fill: col, rim: true, rimW: LW * .8, curv: 1, band: 2.4 }));
  const sd = f >= 0 ? -1 : 1;          // the shadow side
  const ex = F.ex ?? F.w * .44, ew = (F.eyeW ?? 1.45) * 1.06, eh = (F.eyeH ?? .72) * 1.18, tilt = F.tilt ?? .1;
  const noseL = F.noseL ?? 3.7, noseW = F.noseW ?? 1.35, my = ey + noseL + (F.mouthY ?? 2.1), mw = F.mouthW ?? 2.1;
  const nx = cx + f * 1.3;
  // modelling inside the face
  ctx.save(); tracePath(FP, true, 1); ctx.clip();
  shape([[sd * F.w * .55, -F.h], [sd * F.w * 1.2, -F.h], [sd * F.w * 1.2, F.h * 1.1], [sd * F.w * .2, F.h * 1.1], [sd * F.w * .62, F.h * .3]], { fill: shadowC, ink: null, alpha: .42, flat: 1, wob: .1, curv: .8 });
  for (const s of [-1, 1]) shape(ellPts(cx + s * ex, ey - .8, ew * 1.45, 1.35, 12), { fill: shadowC, ink: null, alpha: .28, flat: 1, wob: .05 });
  shape(ellPts(cx, -F.h * .95, F.w * 1.1, 2.4, 12), { fill: shadowC, ink: null, alpha: .3, flat: 1, wob: .05 });
  shape(ribbonPts([[nx + sd * .9, ey - .8], [nx + sd * 1.05, ey + noseL * .6], [nx + sd * 1.2, ey + noseL - .2]], .7, 1.1), { fill: shadowC, ink: null, alpha: .35, flat: 1, wob: .03 });
  shape(ellPts(nx, ey + noseL + .45, noseW * .9, .4, 8), { fill: shadowC, ink: null, alpha: .4, flat: 1, wob: .03 });
  shape(ellPts(cx + f * .9, my + 1.9, mw * .55, .45, 8), { fill: shadowC, ink: null, alpha: .35, flat: 1, wob: .03 });
  shape(ellPts(cx + f * .6, F.h * 1.05, F.w * .55, 1.6, 12), { fill: shadowC, ink: null, alpha: .3, flat: 1, wob: .05 });
  if (F.hollow || c.age >= 3) for (const s of [-1, 1]) shape(ellPts(cx + s * F.w * .66, ey + 3.4, .9, 1.9, 8, s * .2), { fill: shadowC, ink: null, alpha: c.age >= 4 ? .3 : .16, flat: 1, wob: .05 });
  shape(ellPts(nx - sd * .2, ey + noseL - .5, .55, .5, 8), { fill: lightC, ink: null, alpha: .55, flat: 1, wob: .03 });
  shape(ribbonPts([[nx - sd * .25, ey - .5], [nx - sd * .3, ey + noseL - 1.2]], .35, .45), { fill: lightC, ink: null, alpha: .45, flat: 1, wob: .03 });
  for (const s of [-1, 1]) shape(ellPts(cx + s * F.w * .5, ey + 1.9, 1.5, .8, 8), { fill: lightC, ink: null, alpha: s === -sd ? .4 : .15, flat: 1, wob: .05 });
  shape(ellPts(cx - sd * 1.5, -F.h * .55, 2.4, 1.1, 8), { fill: lightC, ink: null, alpha: .3, flat: 1, wob: .05 });
  if (F.stubble) shape(ellPts(cx + f * .6, F.h * .74, F.w * .72, F.h * .32, 14), { fill: '#5E6B80', ink: null, alpha: .14, flat: 1, wob: .1 });
  ctx.restore();
  // eyes
  const look = p.look || [0, 0];
  const bl = (p.eyes === undefined || p.eyes === 'open') && blinkAt(t, (c.id || c.look) + (p.blink || ''));
  const eyes = bl ? 'closed' : (p.eyes || (c.smile === 'grin' ? 'smiley' : 'open'));
  S('eyes');
  const lid = '#231A1C';
  for (const s of [-1, 1]) {
    const x = cx + s * ex * (s * f > 0 ? .92 : 1), y = ey, w = ew * (s * f > 0 ? .82 : 1);
    if (['open', 'wide', 'teary', 'smiley', 'down'].includes(eyes)) {
      const h = eh * ({ wide: 1.35, smiley: .62, down: .5 }[eyes] ?? 1);
      const E = [[x - s * w, y + .15], [x - s * w * .45, y - h * .95], [x + s * w * .35, y - h - tilt * .35], [x + s * w, y - tilt], [x + s * w * .4, y + h * .5 - tilt * .2], [x - s * w * .4, y + h * .55]];
      shape(E, { fill: '#F4EBDD', ink: null, flat: 1, wob: 0, curv: .7 });
      ctx.save(); tracePath(E, true, .7); ctx.clip();
      const ir = Math.min(h * 1.05, w * .55), ix = x + look[0] * w * .3 + s * .05, iy = y - h * .15 + look[1] * .3 + (eyes === 'down' ? .35 : 0);
      shape(ellPts(ix, iy, ir, ir, 12), { fill: '#3E2A22', ink: null, flat: 1, wob: 0 });
      shape(ellPts(ix, iy, ir * .5, ir * .5, 8), { fill: '#120C0E', ink: null, flat: 1, wob: 0 });
      shape(ellPts(ix + ir * .35, iy - ir * .4, ir * .22, ir * .22, 6), { fill: '#FFFFFF', ink: null, flat: 1, wob: 0, alpha: .9 });
      shape(ellPts(x, y - h * .9, w * 1.2, h * .5, 8), { fill: '#6A4A40', ink: null, flat: 1, wob: 0, alpha: .35 });
      ctx.restore();
      // upper lid, thickest toward the outer corner; lower lid faint
      shape(ribbonPts([E[0], E[1], E[2], E[3]], LW * .6, LW * 1.6), { fill: lid, ink: null, flat: 1, wob: .02 });
      line([E[3], E[4], E[5], E[0]], LW * .32, dk, { double: false, wob: .02, alpha: .75 });
      if (F.eye === 'double' && eyes !== 'smiley') line([[x - s * w * .35, y - h - .55], [x + s * w * .3, y - h - .7 - tilt * .3], [x + s * w * .95, y - tilt - .4]], LW * .32, dk, { double: false, wob: .02, alpha: .8 });
      if (eyes === 'teary') shape(ellPts(x, y + h * .5, w * .7, .3, 8), { fill: '#BFE3F2', ink: null, flat: 1, alpha: .85, wob: 0 });
      if (c.age >= 3 || F.bags) line([[x - s * w * .7, y + h + .55], [x + s * w * .4, y + h + .7]], LW * .28, dk, { double: false, alpha: .55 });
    } else if (eyes === 'happy') line(arcPts(x, y + .7, w * .95, Math.PI + .35, TAU - .35, 7, 1), LW * .9, lid, { double: false, wob: .03 });
    else if (eyes === 'closed') line(arcPts(x, y - .3, w * .95, .3, Math.PI - .3, 7, .6), LW * .9, lid, { double: false, wob: .03 });
    else if (eyes === 'squeeze') line([[x - s * w, y - .8], [x + s * w * .6, y], [x - s * w, y + .7]], LW * .9, lid, { double: false, wob: .03, curv: 0 });
    if (c.age >= 3) line([[x + s * (w + .3), y - .1], [x + s * (w + 1.1), y - .45]], LW * .28, dk, { double: false, alpha: .6 });
    if (c.age >= 4) { line([[x + s * (w + .3), y + .45], [x + s * (w + 1.2), y + .75]], LW * .28, dk, { double: false, alpha: .6 }); line([[x - s * w * .6, y + 1.6], [x + s * w * .6, y + 1.85]], LW * .3, dk, { double: false, alpha: .55 }); }
  }
  // brows: tapered, thick at the inner end
  const B = c.brow, bwv = p.brows || 0;
  for (const s of [-1, 1]) {
    const x = cx + s * ex * (s * f > 0 ? .92 : 1), y = ey - 1.75 - (F.browY ?? 0);
    const Pb = [[x - s * ew * 1.05, y + .25 + bwv * .8], [x + s * ew * .15, y - B.arch - bwv * .1], [x + s * ew * 1.35, y + .35 - bwv * .4]];
    shape(ribbonPts(Pb, B.w * 1.25, B.w * .45, 2), { fill: B.col, ink: null, flat: 1, wob: .02, alpha: .92 });
  }
  // nose
  line([[nx - noseW, ey + noseL - .55], [nx - noseW * 1.05, ey + noseL - .05], [nx - noseW * .55, ey + noseL + .3]], LW * .5, dk, { double: false, wob: .02, alpha: .85 });
  line([[nx + noseW, ey + noseL - .55], [nx + noseW * 1.05, ey + noseL - .05], [nx + noseW * .55, ey + noseL + .3]], LW * .5, dk, { double: false, wob: .02, alpha: .85 });
  for (const s of [-1, 1]) shape(ellPts(nx + s * noseW * .42, ey + noseL + .12, .38, .2, 6, s * .3), { fill: '#5A2E28', ink: null, flat: 1, wob: 0, alpha: .8 });
  line([[nx + sd * .75, ey - .2], [nx + sd * .9, ey + noseL * .55]], LW * .35, dk, { double: false, alpha: .45 });
  // folds by age
  if (c.age >= 2 || F.folds) for (const s of [-1, 1]) line([[nx + s * (noseW + .3), ey + noseL - .2], [cx + s * (mw + .9), my + .5], [cx + s * (mw + .8), my + 1.4]], LW * (c.age >= 4 ? .5 : .32), dk, { double: false, alpha: c.age >= 3 ? .65 : .4 });
  if (c.age >= 4) { line([[cx - 2.6, -F.h * .55], [cx + 2.6, -F.h * .58]], LW * .32, dk, { double: false, alpha: .5 }); line([[cx - 2, -F.h * .44], [cx + 2, -F.h * .46]], LW * .28, dk, { double: false, alpha: .45 }); line([[cx - .9, ey - 2.6], [cx - .5, ey - 1.6]], LW * .28, dk, { double: false, alpha: .5 }); }
  // mouth
  S('mouth');
  const m = p.mouth || c.smile || 'soft', mx = cx + f * .8;
  const lip = c.lips || mix(col, '#A8484A', .5), lipDk = mix(lip, '#4A1E22', .35), ink = '#4A2224';
  const up = F.lipU ?? .45, lo = F.lipL ?? .7;
  if (m === 'grin' || m === 'laugh') {
    const w = mw * (m === 'laugh' ? 1.2 : 1.12), h = m === 'laugh' ? 2.4 : 1.6;
    const M = [[mx - w, my - .45], [mx - w * .45, my - .6], [mx, my - .5], [mx + w * .45, my - .6], [mx + w, my - .45], [mx + w * .6, my + h * .8], [mx, my + h], [mx - w * .6, my + h * .8]];
    shape(M, { fill: '#8E3A3C', ink: null, flat: 1, wob: .02, curv: .7 });
    ctx.save(); tracePath(M, true, .7); ctx.clip(); shape([[mx - w, my - .7], [mx + w, my - .7], [mx + w * .8, my + h * .5], [mx - w * .8, my + h * .5]], { fill: '#F7F0E6', ink: null, flat: 1, curv: .5 }); for (let i = -2; i <= 2; i++) line([[mx + i * w * .28, my - .5], [mx + i * w * .3, my + h * .4]], LW * .2, '#CDBBAA', { double: false }); ctx.restore();
    line(M.slice(0, 5), LW * .45, ink, { double: false, wob: .02 });
    shape([[mx - w * .9, my - .5], [mx, my - .8 - up * .4], [mx + w * .9, my - .5], [mx, my - .45]], { fill: lip, ink: null, flat: 1, alpha: .85, wob: .02 });
    shape([[mx - w * .65, my + h * .85], [mx + w * .65, my + h * .85], [mx, my + h + lo * .6]], { fill: lip, ink: null, flat: 1, alpha: .8, wob: .02 });
    for (const s of [-1, 1]) line([[mx + s * (w + .45), my - .95], [mx + s * w, my - .45]], LW * .35, dk, { double: false });
  } else if (m === 'o') { shape(ellPts(mx, my + .4, .85, 1.1, 8), { fill: '#6E2E30', ink, sw: LW * .35, flat: 1, wob: .02 }); shape(ellPts(mx, my + .4, 1.3, 1.5, 10), { ink: lip, sw: LW * .7, wob: .02 }); }
  else if (m === 'pant') { shape(ellPts(mx, my + .5, 1.3, .7 + Math.abs(Math.sin(t * 9)) * .6, 8), { fill: '#6E2E30', ink: lip, sw: LW * .6, flat: 1, wob: .02 }); }
  else {
    const curve = { smile: .6, soft: .28, flat: 0, sad: -.45, chew: .1 }[m] ?? .25, w = mw * (m === 'smile' ? 1.08 : 1);
    const cy2 = my + (m === 'chew' ? Math.sin(t * 14) * .25 : 0);
    // upper lip with a cupid's bow, fuller lower lip, a dark line between
    shape([[mx - w, cy2 - curve * .5], [mx - w * .4, cy2 - up], [mx, cy2 - up * .7], [mx + w * .4, cy2 - up], [mx + w, cy2 - curve * .5], [mx, cy2 + .05]], { fill: lipDk, ink: null, flat: 1, alpha: c.lips ? .95 : .7, wob: .02, curv: .6 });
    shape([[mx - w * .9, cy2 - curve * .4], [mx + w * .9, cy2 - curve * .4], [mx + w * .5, cy2 + lo], [mx - w * .5, cy2 + lo]], { fill: lip, ink: null, flat: 1, alpha: c.lips ? .95 : .7, wob: .02, curv: .8 });
    shape(ellPts(mx - .3, cy2 + lo * .45, w * .35, .18, 6), { fill: '#FFFFFF', ink: null, flat: 1, alpha: .25, wob: 0 });
    line([[mx - w, cy2 - curve * .5], [mx - w * .45, cy2 + .05], [mx, cy2 + .12], [mx + w * .45, cy2 + .05], [mx + w, cy2 - curve * .5]], LW * .55, ink, { double: false, wob: .02 });
    if (curve > .2) for (const s of [-1, 1]) line([[mx + s * w, cy2 - curve * .5], [mx + s * (w + .45), cy2 - curve * .85]], LW * .3, dk, { double: false });
  }
  const bl2 = p.blush ?? (c.sex === 'f' ? .2 : .08);
  if (bl2 > 0) for (const s of [-1, 1]) shape(ellPts(cx + s * F.w * .55, ey + 2.6, 1.7, .9, 10), { fill: '#E88A86', ink: null, alpha: bl2, flat: 1, wob: .1 });
  if (p.tear) { S('tear'); for (const s of [-1, 1]) shape([[cx + s * ex + .4, ey + 1], [cx + s * ex + 1, ey + 2.8 + p.tear * 3], [cx + s * ex - .2, ey + 2.8 + p.tear * 3]], { fill: '#A9DDF3', ink: null, flat: 1, alpha: .85, wob: .05 }); }
  S('hair'); hairFront(c, f, o, LW);
  if (c.headband) { S('band'); const P = arcPts(f * .8, -1.2, F.w + .9, Math.PI + .25, TAU - .25, 14, F.h + .9); shape(ribbonPts(P, 1.5, 1.5, 2), o({ fill: c.headband, rim: true, rimW: LW * .8, band: .5 })); line(arcPts(f * .8, -2, F.w + 1.2, Math.PI * 1.25, Math.PI * 1.55, 5, F.h + 1), LW * .9, '#F07A7E', { double: false, alpha: .55 }); }
  if (c.earring) for (const s of [-1, 1]) if (s * f < .6) { const exx = s * (F.w * .98 + .9) + f * .7; if (c.earring.drop) { line([[exx, ey + 3.2], [exx, ey + 4.8]], .25, '#C9A052', { double: false }); shape(ellPts(exx, ey + 5.5, .75, .9, 8), { fill: c.earring.col, ink: '#8A8070', sw: .18, flat: 1, wob: 0 }); } else shape(ellPts(exx, ey + 3.2, .5, .5, 6), { fill: c.earring.col, ink: '#8A8070', sw: .18, flat: 1, wob: 0 }); }
  if (c.glasses) glasses(c, cx, ey, ex, ew, f, LW, p);
}
function glasses(c, cx, ey, ex, ew, f, LW, p) {
  const G = c.glasses, gc = G.col, gw = Math.max(.12, G.w) * (1 + LW * .2), sz = G.size || 1;
  seed((c.id || c.look) + ':glasses');
  const r = (ew + .95) * sz, rh = (G.type === 'rect' || G.type === 'halfrim' ? 1.45 : 1.7) * sz;
  for (const s of [-1, 1]) {
    const x = cx + s * ex * (s * f > 0 ? .92 : 1), y = ey + .15, rw = r * (s * f > 0 ? .82 : 1);
    const P = G.type === 'round' ? ellPts(x, y, rw * .92, rh * 1.02, 18) : G.type === 'oval' ? ellPts(x, y, rw, rh * .82, 16) : G.type === 'roundrect' ? rrPts(x - rw, y - rh, rw * 2, rh * 2, rh * .85, 3) : rrPts(x - rw, y - rh, rw * 2, rh * 2, .55, 2);
    if (p.fog) shape(P, { fill: '#F5F3EE', ink: null, flat: 1, alpha: clamp(p.fog), wob: .03 });
    if (G.type === 'halfrim') { line(P.slice(0, 8), gw * 2.4, gc, { double: false, wob: .02, curv: 0 }); shape(P, { ink: mix(gc, '#FFFFFF', .5), sw: gw * .45, wob: .02, alpha: .55 }); }
    else shape(P, { ink: gc, sw: gw * 1.3, wob: .02 });
    shape(ellPts(x + rw * .4, y - rh * .45, rw * .22, rh * .12, 6, -.4), { fill: '#FFFFFF', ink: null, flat: 1, alpha: .4, wob: 0 });
  }
  line([[cx - ex + r * .9, ey - .15], [cx, ey - .5], [cx + ex - r * .9, ey - .15]], gw * 1.2, gc, { double: false, wob: .02 });
  for (const s of [-1, 1]) if (s * f < .5) line([[cx + s * (ex + r), ey - .3], [s * (c.face.w * .97) + f * .7, ey - .7]], gw * 1.1, gc, { double: false, wob: .02 });
}
function blinkAt(t, key) {
  const period = 3.2 + hash(key, 'blink') * 2.2, ph = hash(key, 'ph') * period;
  return ((t + ph) % period) < .12;
}

// ── hair ──
function hairBack(c, o, LW) {
  const F = c.face, col = c.hairCol, s = c.hair;
  const tex = (P) => { ctx.save(); tracePath(P, true, 1); ctx.clip(); const hiC = lum(col) < .25 ? '#4F6FB0' : mix(col, '#FFFFFF', .35); for (let i = 0; i < 40; i++) { const x = lerp(-F.w - 4, F.w + 4, hash(c.look, i, 21)); line([[x * .6, -4], [x + (hash(c.look, i, 22) - .5) * 3, 12], [x * 1.05, 36]], LW * .4, i % 2 ? hiC : mix(col, PAL.ink, .4), { double: false, alpha: .45, wob: .1 }); } ctx.restore(); };
  if (s === 'wavy') { const P = [[-F.w - 1, -5], [F.w + 1, -5]]; for (let i = 0; i <= 9; i++) P.push([F.w + 3 + Math.sin(i * 1.25) * 1.6, -2 + i * 4.6]); for (let i = 9; i >= 0; i--) P.push([-F.w - 2.4 - Math.sin(i * 1.25 + 1) * 1.2, -2 + i * 3.6]); shape(P, o({ fill: col, curv: 1, rim: true, sw: LW * .6 })); tex(P); }
  if (s === 'longStraight') { const P = [[-F.w - 1, -5], [F.w + 1, -5], [F.w + 2.6, 10], [F.w + 3, 34], [-F.w - 3, 34], [-F.w - 2.6, 10]]; shape(P, o({ fill: col, curv: .7, rim: true, sw: LW * .6 })); tex(P); }
  if (s === 'longMid') { const P = [[-F.w - 1, -5], [F.w + 1, -5], [F.w + 3.4, 8], [F.w + 4.4, 24]]; for (let i = 0; i <= 6; i++) P.push([F.w + 4 - i * (F.w * 2 + 8) / 6, 25 + Math.sin(i * 2.1) * 1.8]); P.push([-F.w - 3.4, 8]); shape(P, o({ fill: col, curv: .8, rim: true, sw: LW * .6 })); tex(P); }
  if (s === 'bob') shape([[-F.w - 1.8, -4], [F.w + 1.8, -4], [F.w + 2.6, 9.6], [-F.w - 2.6, 9.6]], o({ fill: col, curv: .9 }));
  if (s === 'bowl' || s === 'shortBangs') shape([[-F.w - 1.6, -4], [F.w + 1.6, -4], [F.w + 1.8, s === 'bowl' ? 6.4 : 5], [-F.w - 1.8, s === 'bowl' ? 6.4 : 5]], o({ fill: col, curv: .9 }));
  if (s === 'curtain') shape([[-F.w - 2.2, -5], [F.w + 2.2, -5], [F.w + 1.4, 1.2], [-F.w - 1.4, 1.2]], o({ fill: col, curv: .9 }));
  if (s === 'lowtie') shape(ellPts(F.w * .55, 9.4, 2, 2.2, 10), o({ fill: col }));
}
function hairOverShoulder(c, o, LW) {
  const F = c.face, col = c.hairCol, hi = c.hairHi || mix(col, '#FFFFFF', .25);
  if (c.hair === 'wavy') {
    const P = [[F.w - .8, -3]]; for (let i = 0; i <= 8; i++) P.push([F.w + 1.4 + Math.sin(i * 1.3) * 1.8, 2 + i * 4]); P.push([F.w - 3.4, 34]); for (let i = 7; i >= 0; i--) P.push([F.w - 2.4 + Math.sin(i * 1.3 + 1.5) * 1.4, 1 + i * 4]);
    shape(P, o({ fill: col, curv: 1, rim: true }));
    for (let j = 0; j < 3; j++) line(Array.from({ length: 8 }, (_, i) => [F.w - .4 + j * 1 + Math.sin(i * 1.3 + j) * 1.2, 1 + i * 4.2]), LW * .6, hi, { double: false, alpha: .65 });
    const Q = [[-F.w - .4, -2]]; for (let i = 0; i <= 4; i++) Q.push([-F.w - 1.4 - Math.sin(i * 1.4) * 1.2, 2 + i * 3.4]); Q.push([-F.w + 1.2, 16]); Q.push([-F.w + .8, 2]);
    shape(Q, o({ fill: col, curv: 1 }));
  }
  if (c.hair === 'longStraight') for (const s of [-1, 1]) { shape([[s * (F.w - .6), -4], [s * (F.w + 1.8), 4], [s * (F.w + 2.2), 26], [s * (F.w - 1.8), 27], [s * (F.w - 1.4), 6]], o({ fill: col, curv: .6 })); line([[s * (F.w + .4), 2], [s * (F.w + .6), 24]], LW * .6, hi, { double: false, alpha: .55 }); }
  if (c.hair === 'longMid') for (const s of [-1, 1]) { shape([[s * (F.w - .6), -4], [s * (F.w + 2.2), 5], [s * (F.w + 3.4), 20], [s * (F.w - .4), 21], [s * (F.w - 1.6), 6]], o({ fill: col, curv: .7 })); line([[s * (F.w + .8), 3], [s * (F.w + 1.8), 18]], LW * .5, hi, { double: false, alpha: .45 }); }
}
function hairFront(c, f, o, LW) {
  const F = c.face, col = c.hairCol, s = c.hair, fx = f * 2, hi = c.hairHi || mix(col, '#FFFFFF', .28), dk = mix(col, PAL.ink, .4);
  const W = F.w, Hh = F.h;
  const cap = (vol, yL, yR, flat = 0) => { const P = []; for (let i = 0; i <= 26; i++) { const a = Math.PI + i / 26 * Math.PI, sn = Math.sin(a), j = (hash(c.look, 'cap', i) - .5) * Math.min(1.4, vol * .45); P.push([Math.cos(a) * (W + vol * .7 + j) + fx * .35, sn * (Hh + vol + j) * (1 - flat * sn * sn * .06) - .5]); } P[0][1] = yL; P[26][1] = yR; return P; };
  const strands = (n, y0, y1, spread, alpha = .6) => { for (let i = 0; i < n; i++) { const x = fx + (i - (n - 1) / 2) * spread / Math.max(1, n - 1) * 2; line([[x * .85, y0], [x, (y0 + y1) / 2], [x * 1.08, y1]], LW * .4, hi, { double: false, alpha }); } };
  const shine = (vol, a0 = 1.2, a1 = 1.48) => line(arcPts(fx * .3 - 1.5, -.5, W + vol * .5 - 2, Math.PI * a0, Math.PI * a1, 6, Hh + vol - 2), LW * 1.4, hi, { double: false, alpha: .5 });
  const H = e => o({ fill: col, rim: true, rimW: LW * .9, sw: LW * .6, inkA: .55, band: 1.6, ...e });
  // strand clumps flowing from the part to the edge, in the colour-pencil highlights of the photos (blue on black hair)
  const hiC = lum(col) < .25 ? '#4F6FB0' : mix(col, '#FFFFFF', .35), midC = lum(col) < .25 ? '#3A3F5C' : mix(col, PAL.ink, .2);
  const texture = (Q, ox = fx, oy = -Hh - 1) => {
    ctx.save(); tracePath(Q, true, 1); ctx.clip();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of Q) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let i = 0; i < 120; i++) {
      const tx = lerp(x0, x1, hash(c.look, i, 7)), ty = lerp(y0, y1, hash(c.look, i, 8)) + 2;
      const sx = lerp(ox, tx, .15 + hash(c.look, i, 9) * .3), sy = lerp(oy, ty, .15 + hash(c.look, i, 9) * .3);
      const bend = (hash(c.look, i, 10) - .5) * 2.4;
      line([[sx, sy], [(sx + tx) / 2 + bend, (sy + ty) / 2], [tx, ty]], LW * (.35 + hash(c.look, i, 11) * .6), i % 4 === 0 ? dk : i % 4 === 1 ? midC : hiC, { double: false, alpha: i % 4 >= 2 ? .75 : .5, wob: .1 });
    }
    ctx.restore();
  };
  let P;
  if (s === 'curtain') {
    P = cap(3.6, 2, 2); P.push([W + 1.6, 2], [W + .6, 1], [W - .4, -1.5], [fx + 4.6, -3.2], [fx + 1.4, -5.8], [fx, -7.6], [fx - 1.4, -5.8], [fx - 4.6, -3.2], [-W + .4, -1.5], [-W - .6, 3], [-W - 1.6, 5.6]);
    shape(P, H({ curv: .9 }));
    line([[fx, -Hh - 2.6], [fx - .2, -7.4]], LW * .45, hi, { double: false, alpha: .7 });
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) line([[fx + sd * (1 + i * 1.2), -Hh - 1 + i], [fx + sd * (3.4 + i * 1.6), -6 + i * .8], [fx + sd * (5.2 + i * 1.2), -2.2 + i * .6]], LW * .4, hi, { double: false, alpha: .6 });
  }
  if (s === 'lowtie') {
    P = cap(1.3, -1.4, -1.4); P.push([W - .2, -2], [W - 1.4, -5.6], [fx + 2.8, -7], [fx - .6, -7.8], [fx - 4.6, -6.6], [-W + 1, -4.4], [-W + .2, -2]);
    shape(P, H()); shine(1.3);
    for (const sd of [-1, 1]) line([[sd * (W - 1), -3.5], [sd * (W - .6), 1], [sd * (W - 1.4), 4.8]], LW * .45, col, { double: false });
    for (let i = 0; i < 4; i++) line([[fx - 3 + i * 2, -Hh - .6], [fx - 5 + i * 2.8, -6.8]], LW * .35, hi, { double: false, alpha: .5 });
  }
  if (s === 'recede') { P = cap(1.8, -.6, -.6, 1); P.push([W - .3, -1.2], [W - 1, -5.8], [fx + 3.4, -6.2], [fx + 1.6, -7.8], [fx, -7.4], [fx - 1.6, -7.8], [fx - 3.4, -6.2], [-W + 1, -5.8], [-W + .3, -1.2]); shape(P, H()); shine(1.8); strands(5, -Hh - 1.2, -8, 4); }
  if (s === 'crew') {
    P = cap(.8, -2, -2, 1); P.push([W - .4, -2.4], [fx + 4, -6.8], [fx, -7.2], [fx - 4, -6.8], [-W + .4, -2.4]);
    shape(P, H()); ctx.save(); tracePath(P, true, 1); ctx.clip(); for (let i = 0; i < 26; i++) line([[-W + hash('cr', i) * W * 2, -Hh + hash('cr', i, 1) * 5], [-W + hash('cr', i) * W * 2 + .4, -Hh + hash('cr', i, 1) * 5 - 1]], .25, hi, { double: false, alpha: .7 }); ctx.restore();
  }
  if (s === 'bowl') { P = cap(2.4, 6.2, 6.2); P.push([W + 1.8, 6.2], [W - .6, 6], [W - .8, -2.8], [-W + .8, -2.8], [-W + .6, 6], [-W - 1.8, 6.2]); shape(P, H({ curv: .5 })); shine(2.4); for (let i = -3; i <= 3; i++) line([[fx + i * 2, -7], [fx + i * 2.1, -3.2]], LW * .4, hi, { double: false, alpha: .45 }); }
  if (s === 'sweptGrey') { P = cap(1.6, -.5, -.5); P.push([W - .3, -1.4], [W - 1.4, -6.4], [fx + 3, -8.4], [fx - 3, -8.4], [-W + 1.4, -6.4], [-W + .3, -1.4]); shape(P, H()); for (let i = 0; i < 7; i++) line([[fx - 4.5 + i * 1.5, -8], [fx - 5 + i * 1.7, -Hh - 1]], LW * .4, mix(col, PAL.ink, .35), { double: false, alpha: .6 }); }
  if (s === 'bob') {
    P = cap(1.9, 9.6, 9.6); P.push([W + 2.1, 9.6], [W - 1.2, 9.4], [W - 1.6, -1], [fx + 2, -7.6], [fx - 1, -7], [fx - 5.6, -3.2], [-W + 1.3, 1], [-W + 1.1, 9.4], [-W - 2.1, 9.6]);
    shape(P, H({ curv: .6 })); shine(1.9);
    line([[fx + 2, -Hh - 1.2], [fx + 1.6, -7.4]], LW * .45, hi, { double: false, alpha: .6 });
    for (let i = 0; i < 4; i++) { line([[-W - 1 + i * .6, -1 - i], [-W - .8 + i * .5, 9]], LW * .35, hi, { double: false, alpha: .45 }); line([[W + 1 - i * .6, -1 - i], [W + .8 - i * .5, 9]], LW * .35, hi, { double: false, alpha: .45 }); }
  }
  if (s === 'greyUp') {
    P = cap(3, -.8, -.8); for (let i = 5; i <= 13; i += 2) P[i] = [P[i][0] * 1.03, P[i][1] - 1.4];
    P.push([W - .4, -1.4], [W - 1.2, -6], [fx + 3.6, -6.8], [fx, -7.4], [fx - 3.6, -6.8], [-W + 1.2, -6], [-W + .4, -1.4]);
    shape(P, H({ curv: .55 }));
    for (let i = 0; i < 9; i++) line([[fx - 5 + i * 1.25, -7], [fx - 5.6 + i * 1.4, -Hh - 3.2 + (i % 2)]], LW * .45, hi, { double: false, alpha: .8 });
  }
  if (s === 'shortBack') { P = cap(1.6, -1.2, -1.2, 1); P.push([W - .3, -1.6], [W - 1.4, -6.4], [fx + 2, -7.8], [fx - 2, -7.8], [-W + 1.4, -6.4], [-W + .3, -1.6]); shape(P, H()); shine(1.6); strands(4, -Hh - 1, -8, 3.4, .45); }
  if (s === 'perm') {
    P = []; const n = 17;
    for (let i = 0; i <= n; i++) { const a = Math.PI * .9 + i / n * Math.PI * 1.2, r = (i % 2) * 1.3; P.push([Math.cos(a) * (W + 2.6 + r), Math.sin(a) * (Hh + 2.4 + r) - .6]); }
    P.push([W - .4, -1.2], [fx + 4, -6.2], [fx + 1, -7], [fx - 2, -6.2], [fx - 4.6, -6.6], [-W + .4, -1.2]);
    shape(P, H({ curv: 1 }));
    for (let i = 0; i < 12; i++) { const a = Math.PI * 1.05 + i / 11 * Math.PI * .9, rr = W * .7 + (i % 3); line(arcPts(Math.cos(a) * rr, Math.sin(a) * (Hh * .8) - 1, 1.2, 0, Math.PI * 1.6, 6), LW * .45, mix(col, PAL.ink, .4), { double: false, alpha: .7 }); }
    shine(2.6, 1.22, 1.42);
  }
  if (s === 'greyThick') {
    P = cap(2.6, -.6, -.6, 1); P.push([W - .3, -1.2], [W - 1.2, -6], [fx + 4.4, -7], [fx - 1.8, -7.8], [fx - 4, -7.2], [-W + 1.2, -6], [-W + .3, -1.2]);
    shape(P, H());
    for (let i = 0; i < 8; i++) line([[fx - 3 + i * 1.3, -Hh - 2.4], [fx - 1 + i * 1.5, -7.2]], LW * .45, hi, { double: false, alpha: .75 });
    line([[fx - 3, -Hh - 2], [fx - 3.4, -7.6]], LW * .4, dk, { double: false });
  }
  if (s === 'longMid') {
    P = cap(2, -1.5, -1.5); P.push([W - .4, -2], [W - 1.8, -5.6], [fx + 1.2, -7.8], [fx, -8.4], [fx - 1.2, -7.8], [-W + 1.8, -5.6], [-W + .4, -2]);
    shape(P, H()); shine(2);
    line([[fx, -Hh - 2], [fx, -8.2]], LW * .45, hi, { double: false, alpha: .6 });
    for (const sd of [-1, 1]) shape([[fx + sd * .6, -8], [sd * (W - 1), -4.6], [sd * (W + .4), 3], [sd * (W - 1.2), 8], [sd * (W - 1.6), 1]], o({ fill: col, curv: .8, sw: LW * .7, band: 0 }));
  }
  if (s === 'shortBangs') {
    P = cap(2.2, 5, 5); P.push([W + 1.6, 5], [W - .6, 4.6], [W - 1, -2.6], [fx + 3.6, -4.2], [fx - 1, -5.4], [fx - 5, -3.6], [-W + .8, -2.4], [-W + .5, 4.6], [-W - 1.6, 5]);
    shape(P, H({ curv: .6 })); shine(2.2);
    for (let i = 0; i < 4; i++) line([[fx - 4 + i * 2, -Hh - .8], [fx + i * 1.8, -4.6]], LW * .4, hi, { double: false, alpha: .5 });
  }
  if (s === 'neat') {
    P = cap(2.2, -.8, -.8, 1); P.push([W - .3, -1.4], [W - 1.2, -6], [fx + 4, -7.4], [fx + 1, -8.6], [fx - 3.2, -8], [-W + 1.2, -6.2], [-W + .3, -1.4]);
    shape(P, H()); shine(2.2);
    line([[fx - 3.4, -Hh - 1.6], [fx - 3, -8]], LW * .4, hi, { double: false, alpha: .6 });
    for (let i = 0; i < 4; i++) line([[fx - 2 + i * 1.6, -Hh - 1.8], [fx + i * 1.9, -8]], LW * .4, hi, { double: false, alpha: .5 });
  }
  if (s === 'wavy') {
    P = cap(2.8, 2, 3); P.push([W + 1, 3], [W - .4, -1], [fx + 5, -4.8], [fx + 1, -7.6], [fx - 3, -8.2], [-W + 1.4, -4.4], [-W - .6, 2]);
    shape(P, H()); shine(2.8);
    for (let i = 0; i < 4; i++) line([[fx - 3 + i * 1.2, -Hh - 1.6], [fx + i * 2, -6.4], [fx + 3 + i * 1.6, -3]], LW * .45, hi, { double: false, alpha: .6 });
  }
  if (s === 'longStraight') {
    P = cap(1.8, -1.2, -1.2); P.push([W - .4, -2], [W - 1.6, -5.8], [fx + 1.6, -7.8], [fx, -8.4], [fx - 1.6, -7.8], [-W + 1.6, -5.8], [-W + .4, -2]);
    shape(P, H()); shine(1.8);
    for (const sd of [-1, 1]) shape([[fx + sd * .6, -8], [sd * (W - 1.2), -4.4], [sd * (W + .2), 4], [sd * (W - 1.2), 9], [sd * (W - 1.6), 0]], o({ fill: col, curv: .8, sw: LW * .7, band: 0 }));
  }
  if (P && s !== 'crew') texture(P);
}
function hairBackView(c, o, LW) {
  const F = c.face, col = c.hairCol, long = ['wavy', 'longStraight', 'longMid'].includes(c.hair), mid = ['bob', 'bowl', 'curtain', 'shortBangs'].includes(c.hair);
  const P = ellPts(0, -1, F.w + 1.8, F.h + 1.8, 24);
  if (long || mid) P.splice(4, 7, [F.w + 2.6, 6], [F.w + 3, long ? 30 : 10], [-F.w - 3, long ? 30 : 10], [-F.w - 2.6, 6]);
  shape(P, o({ fill: col, rim: true, curv: .8, band: 2 }));
  if (c.headband) line(arcPts(0, -2, F.w + 1.6, Math.PI * 1.1, Math.PI * 1.9, 10, F.h + 1.2), LW * 2.4, c.headband, { double: false });
  if (c.hair === 'lowtie') shape(ellPts(0, 7, 2.2, 3, 10), o({ fill: col }));
}

// seen from above (the round-table shots)
function personTop(c, x, y, ang, k, p = {}) {
  const LW = 1.05 * Math.pow(k, -.52), WB = .55 * Math.pow(k, -.6), SC = 1.2 / k;
  seed((c.id || c.look) + ':top' + (p.key || ''));
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
  const o = (e) => ({ sw: LW, wob: WB, sc: SC, rimX: 1.7 / k, rimY: 1.3 / k, band: 2, ...e });
  const t = c.top, sleeve = t.type === 'vest' ? t.under : t.col, sk = c.skin;
  const reach = p.reach || 0, rl = p.reachL ?? reach, rr = p.reachR ?? reach;
  shape(ribbonPts([[-11, 0], [-14, -8], [-7 - rl * 2, -16 - rl * 9]], 6.4, 5.4), o({ fill: sleeve, curv: .5 }));
  shape(ribbonPts([[11, 0], [14, -8], [7 + rr * 2, -16 - rr * 9]], 6.4, 5.4), o({ fill: sleeve, curv: .5 }));
  shape(ellPts(-7 - rl * 2, -17 - rl * 9, 2.6, 2.8, 8), o({ fill: sk, band: 0 }));
  shape(ellPts(7 + rr * 2, -17 - rr * 9, 2.6, 2.8, 8), o({ fill: sk, band: 0 }));
  shape(ellPts(0, 2, 14.5 * c.build, 7.5, 18), o({ fill: t.col, rim: true }));
  if (c.scarf) shape(ellPts(0, 0, 9, 5, 12), o({ fill: c.scarf }));
  if (t.stripes) for (let i = -2; i <= 2; i++) line([[i * 4.4, -4], [i * 4.4, 8]], 1.1, t.stripes, { double: false, wob: .2 });
  if (['wavy', 'longStraight', 'longMid'].includes(c.hair)) shape(ellPts(0, 7, 9, 8.5, 14), o({ fill: c.hairCol }));
  shape(ellPts(0, 1, 9.6, 10.4, 16), o({ fill: c.hairCol, rim: true }));
  if (c.hair === 'perm') for (let i = 0; i < 7; i++) line(arcPts(Math.cos(i) * 4.5, Math.sin(i * 1.7) * 4.5, 1.8, 0, 4.5, 5), .6, mix(c.hairCol, PAL.ink, .35), { double: false });
  if (c.headband) line(arcPts(0, 1, 9.2, Math.PI * 1.05, Math.PI * 1.95, 10, 4.6), LW * 2, c.headband, { double: false });
  ctx.restore();
  seed('after-top:' + (c.id || c.look));
}
// gestures replace the old hand-sign props; these stay as no-ops for scene code that still passes them
function fingers() { return () => {}; }
function thumbUp() { return () => {}; }
function openHand() { return () => {}; }
