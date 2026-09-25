// ───────────────────────── cast: the sixteen family members as paper cut-outs ─────────────────────────
// Every figure is the character card's own drawing (sprites.js), never redrawn. They act like paper puppets:
// slide, sway, breathe, lean, turn by swapping views, and change expression in close-up by swapping heads.

// role → card
const ROLE = {
  laolao: '11', laoye: '07', mama: '13', baba: '12', daju: '10', erjiu: '15', erjiumu: '14', eryi: '06',
  sanyi: '08', sanyifu: '09', wo: '03', lulu: '04', tongtong: '05', rere: '01', daidai: '02', doudou: '16',
};
// standing height relative to an adult
const TALL = { laolao: .9, laoye: .95, mama: .95, baba: 1, daju: 1, erjiu: 1, erjiumu: .94, eryi: .95, sanyi: .95, sanyifu: 1, wo: 1, lulu: .96, tongtong: 1.02, rere: 1.03, daidai: .95, doudou: .97 };
// views drawn seated on the card (they bring their own seat)
const SEATED = new Set(['07_main', '07_front', '07_side', '07_back', '09_main', '09_front', '09_side', '09_back', '10_main', '08_main']);

const IMG = {};
function loadSprites() {
  return Promise.all(Object.entries(SPRITES).map(([k, src]) => { const im = new Image(); im.src = src; IMG[k] = im; return im.decode(); }));
}
const spriteOf = (role, view) => IMG[ROLE[role] + '_' + view];

// scratch canvas for tinted figures (dusk and night light)
const TINT = document.createElement('canvas');
// puppet(role, view, x, y, h, o): (x, y) = ground point between the feet; h = an adult's standing height in px.
// o: t (for breathing), flip, rot (lean, pivots at the feet), dy, sx, sy, alpha, tint [col, a], shadow, walk (phase)
function puppet(role, view, x, y, h, o = {}) {
  const im = spriteOf(role, view); if (!im) return;
  const seated = SEATED.has(ROLE[role] + '_' + view);
  const dh = h * TALL[role] * (seated ? .74 : 1) * (view === 'main' ? 1.02 : 1);
  const dw = dh * im.width / im.height;
  const t = o.t ?? 0, ph = hash(role, 'breath') * TAU;
  let sy = (o.sy ?? 1) * (1 + .007 * Math.sin(t * 2.4 + ph)), sx = (o.sx ?? 1) * (1 - .003 * Math.sin(t * 2.4 + ph));
  let rot = o.rot || 0, dy = o.dy || 0;
  if (o.walk !== undefined) { const w = o.walk * TAU; dy -= Math.abs(Math.sin(w)) * h * .018; rot += Math.sin(w) * .035; }
  if (o.shadow !== false) {   // a watercolour puddle of shadow under the feet
    ctx.save(); ctx.globalAlpha = (o.alpha ?? 1) * (o.shadowA ?? .8);
    wcAt('shadow:' + role + view, UNIT(12), o.shadowCol || '#6D6A8E', x, y + 2, dw * .42, { sy: .12, spread: .4, a: .06, layers: 8, wet: true, gran: .3 });
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x, y + dy); ctx.rotate(rot); ctx.scale(sx * (o.flip ? -1 : 1), sy);
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  if (o.tint && o.tint[1] > 0) {
    const tw = Math.ceil(dw), th = Math.ceil(dh);
    if (TINT.width < tw || TINT.height < th) { TINT.width = Math.max(TINT.width, tw); TINT.height = Math.max(TINT.height, th); }
    const g = TINT.getContext('2d'); g.clearRect(0, 0, tw, th); g.globalCompositeOperation = 'source-over'; g.drawImage(im, 0, 0, tw, th);
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba(o.tint[0], o.tint[1]); g.fillRect(0, 0, tw, th);
    ctx.drawImage(TINT, 0, 0, tw, th, -dw / 2, -dh, dw, dh);
  } else ctx.drawImage(im, -dw / 2, -dh, dw, dh);
  ctx.restore();
  return { top: y + dy - dh, w: dw, h: dh };
}
// a close-up bust: view 'face' or an expression 'e0' (calm) 'e1' (smile) 'e2' (serious); from → to over k
function bust(role, from, to, k, x, y, h, o = {}) {
  const A = spriteOf(role, from), B = spriteOf(role, to);
  const draw = (im, a) => { if (!im || a <= 0) return; const dh = h, dw = dh * im.width / im.height; ctx.save(); ctx.globalAlpha *= a * (o.alpha ?? 1); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.drawImage(im, -dw / 2, -dh, dw, dh); ctx.restore(); };
  const kk = clamp(k), bob = Math.sin(kk * Math.PI) * h * .012;   // a tiny lift while the face changes
  y -= bob;
  if (kk < 1) draw(A, 1);
  draw(B, ease(kk));
}
