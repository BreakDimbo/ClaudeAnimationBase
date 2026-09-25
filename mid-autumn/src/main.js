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
// ── the cut: the shots are written on the 180 s storyboard timeline. The film is 47 cuts taken from it at normal
// speed, each chosen around its one event, with a transition designed for every join.
// [story in, story out, how it arrives: null = cut, or [type, seconds] (dissolve | ripple)]
const RIPPLE_AT = [960, 177];
const EDIT = [
  [0, 3.3], [3.3, 7.45], [9.45, 11.5], [11.5, 13.6],                                                            // 镜1 向阳门第·晨
  [14.0, 16.6, ['dissolve', .7]], [17.5, 20.0], [21.0, 22.8], [23.3, 25.6], [29.2, 32.0, ['dissolve', .5]],       // 镜2 北京
  [32.0, 34.6, ['dissolve', .8]], [38.5, 40.5], [41.3, 44.0], [44.0, 46.4], [47.3, 49.4],                         // 镜3 包头
  [50.0, 52.4, ['dissolve', .8]], [53.2, 55.6], [56.4, 58.8], [59.8, 62.2], [66.0, 68.0],                         // 镜4 呼和浩特
  [68.2, 70.4], [71.2, 73.8], [77.5, 79.8], [80.8, 83.0], [83.8, 85.8],                                           // 镜5 西安
  [86.4, 88.8, ['ripple', 1.2]], [89.4, 91.8], [95.6, 97.8], [98.4, 100.6], [101.0, 103.2],                       // 镜6 新加坡
  [104.3, 106.5, ['dissolve', .5]], [107.4, 109.4], [113.6, 115.8, ['dissolve', .4]], [116.9, 120.4], [123.0, 124.8], [126.0, 127.8],   // 镜7 从前慢
  [128.6, 131.0, ['dissolve', .8]], [134.8, 137.2], [137.4, 139.6], [143.2, 145.6], [148.0, 151.8],               // 镜8 向阳门第·夜
  [152.2, 155.0, ['dissolve', 1]], [155.4, 158.8], [159.2, 162.0], [162.0, 164.0], [164.3, 169.2], [170.5, 172.4], // 镜9 背影 · 赏月 · 团圆
  [173.6, 179.4, ['dissolve', 1]],                                                                                // 镜10 纸
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
// the one entry point: every frame is a pure function of t (film seconds)
function render(T) {
  T = clamp(T, 0, DUR - 1e-4);
  BF = Math.floor(T * BOIL + 1e-6);
  if (VIEW) { paperUnder(); VIEW(T); grainOver(); return; }
  const ci = clipAt(T), c = EDIT_AT[ci], nx = EDIT_AT[ci + 1], t = toStory(T);
  drawShot(shotAt(t), t);
  if (nx && nx.into && T > nx.f0 - nx.into[1]) {                 // the next cut arriving: it starts early and is laid over this one
    const d = nx.into[1], k = seg(T, nx.f0 - d, nx.f0), tn = nx.a - (nx.f0 - T);
    const main = ctx, bf = BF; ctx = BUF.getContext('2d'); drawShot(shotAt(nx.a + 1e-6), tn); ctx = main; BF = bf;   // (the incoming shot, running into its first frame)
    if (nx.into[0] === 'ripple') circleReveal('into' + ci, RIPPLE_AT[0], RIPPLE_AT[1], lerp(0, 1400, easeIn(k)), () => ctx.drawImage(BUF, 0, 0), '#E8F2F4');
    else { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = ease(k); ctx.drawImage(BUF, 0, 0); ctx.restore(); }
  }
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
