// ───────────────────────── main: render(t), the timeline, preview player, export hooks ─────────────────────────
// SHOTS: [start, fn(lt, t, dur), name, into] from scenes.js; each shot paints the whole frame.
// into = how the shot arrives: {d: seconds before its start, type: 'dissolve' | 'ripple', x, y}
const SHOT_LIST = SHOTS.map((s, i) => ({ start: s[0], end: i + 1 < SHOTS.length ? SHOTS[i + 1][0] : STORY, fn: s[1], name: s[2] || '', into: s[3] || null }));
makeWCPaper();
let VIEW = null;           // a test view (?view=cast) instead of the film
function shotAt(t) { let i = SHOT_LIST.length - 1; while (i > 0 && t < SHOT_LIST[i].start) i--; return i; }
// draw one shot at video time t into the current ctx (used by dissolves too)
function drawShot(i, t) {
  const s = SHOT_LIST[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  paperUnder(); LIGHT = null; LIGHTK = 0; ambient(null); MOONRAB = 0;
  s.fn(t - s.start, t, s.end - s.start);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
// render another shot into a buffer and lay it over the frame (dissolves, match cuts)
const BUF = document.createElement('canvas'); BUF.width = W; BUF.height = H;
function overlayShot(i, t, a) {
  if (a <= 0) return;
  const main = ctx, bf = BF; ctx = BUF.getContext('2d');
  drawShot(i, t); ctx = main; BF = bf;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.drawImage(BUF, 0, 0); ctx.restore();
}
// ── the cut: the shots are written on the 180 s storyboard timeline. The film is 37 cuts taken from it at normal
// speed, each trimmed around its one event. Every join carries one visual feature across, and no device is used twice.
// [story in, story out, join into this cut]; join = { type, d: seconds before the cut, post: seconds after, ...params }
const EDIT = [
  [0, 7.45],                                                                         // 0  dawn colour spreads down the paper (in the shot)
  [9.45, 13.4],                                                                      // 1  cut on action: the rabbit's leap down
  [14.0, 16.6, { type: 'cloud', d: .9 }],                                            // 2  clouds sweep across
  [17.5, 20.0],                                                                      // 3  the flock's line of flight continues down
  [21.0, 22.8],                                                                      // 4  the rabbit holds its place on screen
  [23.3, 25.6, { type: 'trunk', d: .5 }],                                            // 5  a tree trunk passes in front of the lens
  [29.4, 32.0, { type: 'glaze', d: .9 }],                                            // 6  dusk pink stains the frame
  [32.0, 34.6, { type: 'dissolve', d: .8 }],                                         // 7  the persimmon becomes the sun
  [38.5, 40.5],                                                                      // 8  the horizon stays at one height
  [41.3, 44.0],                                                                      // 9  sparks rising carry into the tilt up
  [44.0, 46.6, { type: 'flare', d: .45, post: .7, x: 968, y: 310 }],                // 10 the rising moon flares; the light carries into the run
  [50.0, 52.6],                                                                      // 11 exit right, enter left
  [53.6, 55.6],                                                                      // 12 the smoke's cloud holds its place
  [56.6, 58.8],                                                                      // 13 the ridge line becomes the roof line
  [60.6, 66.4, { type: 'iris', d: .9 }],                                             // 14 an iris closes into the skylight
  [68.4, 73.6],                                                                      // 15 red floods the frame, red lantern
  [77.5, 79.8],                                                                      // 16 the wind blows the same way
  [81.4, 85.8, { type: 'leaves', d: .7, post: .9 }],                                 // 17 leaves on the wind cross the cut
  [86.4, 88.8, { type: 'ripple', d: 1.2, x: 960, y: 177 }],                          // 18 the rain drop's ripple
  [89.4, 91.8, { type: 'arch', d: .8, x: 550, y: 800, w: 240, h: 290 }],             // 19 through the arch the crane flew into
  [95.6, 97.8],                                                                      // 20 cut in on the same rabbit and lanterns
  [98.4, 100.6],                                                                     // 21 eyeline: the rabbit looks up
  [101.0, 103.2, { type: 'flip', d: .8, y: 560 }],                                   // 22 the sky flips into its reflection
  [104.3, 106.5],                                                                    // 23 graphic match cut: the round gold moon is a mooncake
  [107.4, 109.4, { type: 'scroll', d: .9 }],                                         // 24 unrolled like a hand scroll
  [113.6, 115.8, { type: 'whip', d: .4 }],                                           // 25 whip pan along the line
  [117.1, 120.2],                                                                    // 26 letters fly off the train into the box
  [123.2, 127.6],                                                                    // 27 the vertical axis holds at the centre
  [128.6, 131.0, { type: 'gather', d: 0, post: 1.1, rect: [706, 382, 508, 104] }],   // 28 the gold gathers into the four characters
  [134.8, 137.2],                                                                    // 29 the band of moonlight keeps sweeping
  [137.4, 139.6, { type: 'door', d: .8, rect: [662, 403, 596, 454] }],               // 30 in through the doorway
  [143.6, 150.2, { type: 'focus', d: .7 }],                                          // 31 out of focus, into focus
  [152.6, 158.6, { type: 'florets', d: .7, post: 1 }],                               // 32 osmanthus florets fall across the cut
  [159.4, 163.8],                                                                    // 33 the moonbeam's diagonal continues
  [164.3, 169.0],                                                                    // 34 reverse angle
  [170.5, 172.9],                                                                    // 35 from the faces out to all of them
  [173.6, 179.6, { type: 'bleach', d: 1.2 }],                                        // 36 the moonlight burns through to white paper
];
const EDIT_AT = []; { let f = 0; for (const [a, b, into] of EDIT) { EDIT_AT.push({ a, b, f0: f, f1: f + (b - a), into: into || null }); f += b - a; } }
function clipAt(T) { let i = 0; while (i < EDIT_AT.length - 1 && T >= EDIT_AT[i].f1) i++; return i; }
// film time → story time
function toStory(T) { const c = EDIT_AT[clipAt(T)]; return Math.min(c.b, c.a + (T - c.f0)); }
// story time → film time; outside the cut: null, or (collapse) the start of the next cut
function toFilm(t, collapse = false) {
  for (const c of EDIT_AT) { if (t < c.a) return collapse ? c.f0 : null; if (t <= c.b) return c.f0 + (t - c.a); }
  return collapse ? DUR : null;
}
window.toStory = toStory; window.toFilm = toFilm;
// ── joins: the outgoing frame is already on ctx; the incoming frame is in BUF; k runs 0 → 1 across the join ──
const BUF3 = document.createElement('canvas'); BUF3.width = W; BUF3.height = H;
function screen(fn) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); ctx.restore(); }
function wobbleFront(key, P) { return P.map(([x, y], i) => [x + (hash(key, i) - .5) * 30, y + (hash(key, i, 1) - .5) * 30]); }
function joinPre(j, k, key) {
  const inc = () => ctx.drawImage(BUF, 0, 0), e = ease(k);
  screen(() => {
    switch (j.type) {
      case 'dissolve': ctx.globalAlpha = e; inc(); break;
      case 'cloud': {                                        // banks of cloud sweep right to left; the new sky is behind them
        const fx = lerp(W + 900, -900, e), band = 900;
        ctx.save(); ctx.beginPath(); ctx.rect(fx, 0, W + 2000, H); ctx.clip(); inc(); ctx.restore();
        for (let i = 0; i < 40; i++) {                        // a deep bank of soft cloud whose middle sits on the seam
          const x = fx + (hash(key, i) - .5) * band, y = (i / 40) * H * 1.2 - 60 + (hash(key, i, 1) - .5) * 80, r = 160 + hash(key, i, 2) * 220, a = .55 * (1 - Math.abs(x - fx) / band * 1.4);
          if (a <= 0) continue; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,253,248,${a})`); g.addColorStop(.7, `rgba(246,244,250,${a * .5})`); g.addColorStop(1, 'rgba(246,244,250,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
        break;
      }
      case 'trunk': {                                        // a dark trunk passes close in front of the lens, left to right
        const x = lerp(-500, W + 500, k), w = 520;
        ctx.save(); ctx.beginPath(); ctx.rect(-10, 0, x + 10, H); ctx.clip(); inc(); ctx.restore();
        const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);   // a persimmon trunk, out of focus, lit from the left
        g.addColorStop(0, 'rgba(74,58,52,0)'); g.addColorStop(.08, 'rgba(92,72,62,.96)'); g.addColorStop(.35, 'rgba(84,64,56,1)'); g.addColorStop(.8, 'rgba(46,36,34,1)'); g.addColorStop(.93, 'rgba(40,32,30,.96)'); g.addColorStop(1, 'rgba(40,32,30,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w / 2, -40); ctx.bezierCurveTo(x - w * .6, H * .3, x - w * .4, H * .7, x - w / 2 - 30, H + 40); ctx.lineTo(x + w / 2 + 10, H + 40); ctx.bezierCurveTo(x + w * .45, H * .6, x + w * .58, H * .3, x + w / 2, -40); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(30,22,20,.35)'; ctx.lineWidth = 10; for (let i = 0; i < 6; i++) { const bx = x - w * .3 + i * w * .12; ctx.beginPath(); ctx.moveTo(bx, -40); ctx.bezierCurveTo(bx + 20, H * .4, bx - 20, H * .7, bx + 10, H + 40); ctx.stroke(); }
        break;
      }
      case 'glaze': {                                        // a pink glaze stains the old frame, then the new one comes through it
        ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#F2A6B0', .7 * Math.min(1, k * 1.6)); ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = ease(seg(k, .45, 1)); inc();
        break;
      }
      case 'iris': {                                         // the old frame survives only inside a closing circle that lands on the skylight
        const r = lerp(1200, 214, e);
        const g3 = BUF3.getContext('2d'); g3.setTransform(1, 0, 0, 1, 0, 0);
        g3.clearRect(0, 0, W, H); g3.drawImage(ctx.canvas, 0, 0);
        inc(); ctx.save(); ctx.beginPath(); ctx.arc(960, 540, r, 0, TAU); ctx.clip(); ctx.globalAlpha = 1 - ease(seg(k, .85, 1)); ctx.drawImage(BUF3, 0, 0); ctx.restore();
        break;
      }
      case 'ripple': circleReveal('join' + key, j.x, j.y, lerp(0, 1400, easeIn(k)), inc, '#E8F2F4'); break;
      case 'arch': {                                         // the new place opens out of the arch's shape
        const s = lerp(1, 9, easeIn(k)), w = j.w * s, h = j.h * s, x = lerp(j.x, 960, e), yb = lerp(j.y + j.h / 2, H + 60, e);
        ctx.save(); ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - w / 2, yb - h + w / 2); ctx.arc(x, yb - h + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w / 2, yb); ctx.closePath(); ctx.clip(); inc(); ctx.restore();
        break;
      }
      case 'flip': {                                         // the sky folds down onto the water line and opens again as the reflection
        const g3 = BUF3.getContext('2d'); g3.clearRect(0, 0, W, H); g3.drawImage(ctx.canvas, 0, 0);
        ctx.fillStyle = '#1C1E44'; ctx.fillRect(0, 0, W, H);
        if (k < .5) { const sy = 1 - ease(k * 2); ctx.translate(0, j.y); ctx.scale(1, Math.max(.001, sy)); ctx.translate(0, -j.y); ctx.drawImage(BUF3, 0, 0); }
        else { const sy = ease((k - .5) * 2); ctx.translate(0, j.y); ctx.scale(1, Math.max(.001, sy)); ctx.translate(0, -j.y); inc(); }
        break;
      }
      case 'scroll': {                                       // the next picture unrolls from the left, the roller rides its edge
        const x = lerp(-60, W + 60, e);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, H); ctx.clip(); inc(); ctx.restore();
        const g = ctx.createLinearGradient(x - 40, 0, x + 40, 0); g.addColorStop(0, 'rgba(90,60,40,0)'); g.addColorStop(.35, 'rgba(210,190,160,1)'); g.addColorStop(.55, 'rgba(250,240,220,1)'); g.addColorStop(.8, 'rgba(160,120,90,1)'); g.addColorStop(1, 'rgba(90,60,40,0)');
        ctx.fillStyle = g; ctx.fillRect(x - 40, 0, 80, H); ctx.fillStyle = '#6A3A2A'; ctx.fillRect(x - 46, 0, 92, 18); ctx.fillRect(x - 46, H - 18, 92, 18);
        break;
      }
      case 'whip': {                                         // both frames streak sideways and swap in the blur
        const g3 = BUF3.getContext('2d'); g3.clearRect(0, 0, W, H); g3.drawImage(ctx.canvas, 0, 0);
        const off = e * W, src = k < .5 ? BUF3 : BUF, base = k < .5 ? -off : W - off;
        ctx.fillStyle = '#E8D8C0'; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 12; i++) { ctx.globalAlpha = .14; ctx.drawImage(src, base - i * 60 * Math.sin(k * Math.PI), 0); }
        ctx.globalAlpha = 1;
        break;
      }
      case 'door': {                                         // the lit doorway grows until we are through it
        const [rx, ry, rw, rh] = j.rect, x0 = lerp(rx, -20, easeIn(k)), y0 = lerp(ry, -20, easeIn(k)), x1 = lerp(rx + rw, W + 20, easeIn(k)), y1 = lerp(ry + rh, H + 20, easeIn(k));
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); ctx.globalAlpha = ease(seg(k, 0, .35)); inc(); ctx.restore();
        break;
      }
      case 'focus': {                                        // the courtyard goes soft, the cups come up out of the blur
        const g3 = BUF3.getContext('2d'); g3.clearRect(0, 0, W, H); g3.drawImage(ctx.canvas, 0, 0);
        ctx.filter = `blur(${(16 * e).toFixed(1)}px)`; ctx.drawImage(BUF3, 0, 0);
        ctx.filter = `blur(${(16 * (1 - e)).toFixed(1)}px)`; ctx.globalAlpha = ease(seg(k, .3, 1)); inc(); ctx.filter = 'none';
        break;
      }
      case 'flare': {                                        // the moon behind the antlers flares white; the run comes up out of the light
        const f = ease(k); ctx.globalCompositeOperation = 'lighter';
        for (const [r, a] of [[900 * f + 80, .5], [300 * f + 40, .7]]) { const g = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, r); g.addColorStop(0, `rgba(255,248,228,${a * f})`); g.addColorStop(1, 'rgba(255,248,228,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
        break;
      }
      case 'bleach': {                                       // the gold light burns up to white, and what is left is the paper
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,240,200,${.8 * easeIn(k)})`; ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = ease(seg(k, .55, 1)); inc();
        break;
      }
      case 'leaves': case 'florets': break;                  // straight cut; the drifting things are drawn over both sides
    }
  });
}
// things that cross a join and are drawn on top of both frames (u: seconds from the cut, negative before it)
function joinOver(j, u, key) {
  screen(() => {
    if (j.type === 'leaves') for (let i = 0; i < 14; i++) {
      const p = (u + 1 + hash(key, i) * .4) / 2.2; if (p <= 0 || p >= 1) continue;
      const x = lerp(-80, W + 120, p) + Math.sin(p * 9 + i) * 40, y = lerp(900 - hash(key, i, 1) * 500, 150 - hash(key, i, 2) * 300, p);
      ctx.save(); ctx.translate(x, y); ctx.rotate(p * 8 + i); ctx.fillStyle = i % 3 ? 'rgba(40,64,54,.9)' : 'rgba(230,120,60,.9)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 6, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    if (j.type === 'florets') for (let i = 0; i < 40; i++) {
      const p = (u + 1 + hash(key, i) * .6) / 2.4; if (p <= 0 || p >= 1) continue;
      floret(hash(key, i, 1) * W + Math.sin(p * 6 + i) * 30, lerp(-40, H + 40, p), 7 + hash(key, i, 2) * 5, p * 6 + i, .95);
    }
    if (j.type === 'gather') {                               // the gold light draws itself in to the plaque and settles in the characters
      const [rx, ry, rw, rh] = j.rect, k = ease(clamp(u / j.post)), cx = rx + rw / 2, cy = ry + rh / 2;
      const hw = lerp(W * .75, rw * .55, k), hh = lerp(H * .75, rh * .6, k), a = 1 - ease(seg(u, j.post * .5, j.post));
      ctx.save(); ctx.translate(cx, cy); ctx.scale(hw, hh); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.2);
      g.addColorStop(0, `rgba(250,226,160,${a})`); g.addColorStop(.6, `rgba(246,214,140,${a * .9})`); g.addColorStop(1, 'rgba(246,214,140,0)');
      ctx.fillStyle = g; ctx.fillRect(-1.3, -1.3, 2.6, 2.6); ctx.restore();
    }
    if (j.type === 'flare' && u > 0) {                       // (after the cut) the light fades off the running deer
      const f = 1 - ease(clamp(u / j.post)); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, 980); g.addColorStop(0, `rgba(255,248,228,${.55 * f})`); g.addColorStop(1, 'rgba(255,248,228,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  });
}
// the one entry point: every frame is a pure function of t (film seconds)
function render(T) {
  T = clamp(T, 0, DUR - 1e-4);
  BF = Math.floor(T * BOIL + 1e-6);
  if (VIEW) { paperUnder(); VIEW(T); grainOver(); return; }
  const ci = clipAt(T), c = EDIT_AT[ci], nx = EDIT_AT[ci + 1], t = toStory(T);
  drawShot(shotAt(t), t);
  if (nx && nx.into && nx.into.d > 0 && T > nx.f0 - nx.into.d) {      // the next cut arriving: it starts early
    const j = nx.into, k = seg(T, nx.f0 - j.d, nx.f0), tn = nx.a - (nx.f0 - T);
    const main = ctx, bf = BF; ctx = BUF.getContext('2d'); drawShot(shotAt(nx.a + 1e-6), tn); ctx = main; BF = bf;   // (the incoming shot, running into its first frame)
    joinPre(j, k, 'j' + (ci + 1));
  }
  if (nx && nx.into && T > nx.f0 - (nx.into.d || .7)) joinOver(nx.into, T - nx.f0, 'j' + (ci + 1));
  if (c.into && T - c.f0 < (c.into.post || 0)) joinOver(c.into, T - c.f0, 'j' + ci);
  grainOver();
}
window.render = render;
window.DUR = DUR; window.FPS = FPS;
window.renderAt = (t, type = 'image/jpeg', q = .92) => { render(t); return cv.toDataURL(type, q); };
// contact sheet: several times side by side, labelled with the time (the sheet is a review tool, not the film)
window.renderSheet = (ts, cols = 4, w = 480) => {
  const h = Math.round(w * 9 / 16), rows = Math.ceil(ts.length / cols), pad = 8, lab = 22;
  const S = document.createElement('canvas'); S.width = cols * (w + pad) + pad; S.height = rows * (h + pad + lab) + pad;
  const g = S.getContext('2d'); g.fillStyle = '#1d2138'; g.fillRect(0, 0, S.width, S.height);
  const ms = [];
  ts.forEach((t, i) => {
    const t0 = performance.now(); render(t); ms.push(Math.round(performance.now() - t0));
    const x = pad + (i % cols) * (w + pad), y = pad + Math.floor(i / cols) * (h + pad + lab);
    g.drawImage(cv, x, y + lab, w, h); g.fillStyle = '#efe6d2'; g.font = '15px sans-serif'; g.fillText(t.toFixed(2) + 's', x + 2, y + 16);
  });
  return { url: S.toDataURL('image/jpeg', .88), ms };
};
// ── preview player (never used for export) ──
const q = new URLSearchParams(location.search);
if (q.get('view') && VIEWS[q.get('view')]) VIEW = VIEWS[q.get('view')];
if (q.has('render')) document.body.classList.add('render');
const scrub = document.getElementById('scrub'), tt = document.getElementById('tt'), btn = document.getElementById('play');
scrub.max = DUR;
let playing = false, t0Wall = 0, tStart = 0, actx = null, src = null, abuf = null;
function show(t) { render(t); scrub.value = t; tt.textContent = t.toFixed(2) + ' s'; }
scrub.addEventListener('input', () => { if (playing) stop(); show(+scrub.value); });
function stop() { playing = false; btn.textContent = '▶ 播放'; if (src) { try { src.stop(); } catch (e) {} src = null; } }
btn.addEventListener('click', async () => {
  if (playing) { stop(); return; }
  btn.textContent = '… 合成声音';
  if (!actx) actx = new AudioContext({ sampleRate: 44100 });
  if (!abuf) { const [L, Rr] = buildAudio(44100); abuf = actx.createBuffer(2, L.length, 44100); abuf.copyToChannel(L, 0); abuf.copyToChannel(Rr, 1); }
  tStart = +scrub.value >= DUR - .1 ? 0 : +scrub.value;
  src = actx.createBufferSource(); src.buffer = abuf; src.connect(actx.destination); src.start(0, tStart);
  t0Wall = actx.currentTime; playing = true; btn.textContent = '❚❚ 暂停';
  const loop = () => { if (!playing) return; const t = tStart + actx.currentTime - t0Wall; if (t >= DUR) { stop(); show(DUR - .01); return; } show(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
loadSprites().then(() => { show(+(q.get('t') || 0)); window.ready = true; });
