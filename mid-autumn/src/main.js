// ───────────────────────── main: render(t), the timeline, preview player, export hooks ─────────────────────────
// SHOTS: [start, fn(lt, t, dur), name, into] from scenes.js; each shot paints the whole frame.
// into = how the shot arrives: {d: seconds before its start, type: 'dissolve' | 'ripple', x, y}
const SHOT_LIST = SHOTS.map((s, i) => ({ start: s[0], end: i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR, fn: s[1], name: s[2] || '', into: s[3] || null }));
makeWCPaper();
let VIEW = null;           // a test view (?view=cast) instead of the film
function shotAt(t) { let i = SHOT_LIST.length - 1; while (i > 0 && t < SHOT_LIST[i].start) i--; return i; }
// draw one shot at video time t into the current ctx (used by dissolves too)
function drawShot(i, t) {
  const s = SHOT_LIST[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  paperUnder(); LIGHT = null; LIGHTK = 0; ambient(null);
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
// the one entry point: every frame is a pure function of t (seconds)
function render(t) {
  t = clamp(t, 0, DUR - 1e-4);
  BF = Math.floor(t * BOIL + 1e-6);
  if (VIEW) { paperUnder(); VIEW(t); grainOver(); return; }
  const i = shotAt(t), nx = SHOT_LIST[i + 1];
  drawShot(i, t);
  if (nx && nx.into && t > nx.start - nx.into.d) {          // the next shot arriving early: a dissolve or a ripple
    const k = seg(t, nx.start - nx.into.d, nx.start);
    if (nx.into.type === 'ripple') {
      const main = ctx, bf = BF; ctx = BUF.getContext('2d'); drawShot(i + 1, t); ctx = main; BF = bf;
      circleReveal('into' + i, nx.into.x, nx.into.y, lerp(0, 1400, easeIn(k)), () => ctx.drawImage(BUF, 0, 0), '#E8F2F4');
    } else overlayShot(i + 1, t, ease(k));
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
