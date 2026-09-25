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

// ── painting the cut-outs into the watercolour ──
// Each figure gets: a halo of its own colour bleeding into the paper, pigment pooling just inside its edge,
// granulation from the same paper tooth, and softened edges. Static sprites are processed once and cached;
// rigged (deformed) figures are processed every frame.
function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
let GRAIN_TILE = null;
function grainTile() {
  if (GRAIN_TILE) return GRAIN_TILE;
  const S = 128, c = cnv(S, S), g = c.getContext('2d'), r = mulberry(4242);
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(90,70,60,${.04 + r() * .12})`; const z = .6 + r() * 1.5; g.fillRect(r() * S, r() * S, z, z); }
  for (let i = 0; i < 60; i++) { const x = r() * S, y = r() * S, rr = 3 + r() * 9, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(120,90,80,.10)'); gr.addColorStop(1, 'rgba(120,90,80,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  return GRAIN_TILE = c;
}
function avgColour(src) {
  const c = cnv(8, 8), g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(src, 0, 0, 8, 8);
  const d = g.getImageData(0, 0, 8, 8).data; let r = 0, gg = 0, b = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
  return n ? toHex(r / n, gg / n, b / n) : '#888888';
}
// src (image or canvas) of size sw×sh → { c, m }: a canvas with margin m on every side
function paintFigure(src, sw, sh, sx = 0, sy = 0) {
  const m = Math.ceil(sh * .035), cw = sw + 2 * m, ch = sh + 2 * m;
  const base = cnv(cw, ch), bg = base.getContext('2d'); bg.drawImage(src, sx, sy, sw, sh, m, m, sw, sh);
  // erode the cut-out by two pixels so no card-white fringe survives around hair and dark clothes
  { const er = cnv(cw, ch), eg = er.getContext('2d'); eg.drawImage(base, 0, 0); eg.globalCompositeOperation = 'destination-in'; for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) eg.drawImage(base, dx, dy); bg.clearRect(0, 0, cw, ch); bg.drawImage(er, 0, 0); }
  const avg = avgColour(base);
  const out = cnv(cw, ch), g = out.getContext('2d');
  // 1. halo: the figure's colour bled out into the wet paper
  const halo = cnv(cw, ch), hg = halo.getContext('2d'); hg.drawImage(base, 0, 0); hg.globalCompositeOperation = 'source-in'; hg.fillStyle = mix(avg, '#8A7A8A', .2); hg.fillRect(0, 0, cw, ch);
  g.filter = `blur(${(sh * .011).toFixed(1)}px)`; g.globalAlpha = .4; g.drawImage(halo, sh * .004, sh * .006); g.filter = 'none'; g.globalAlpha = 1;
  // 2. body with granulation
  const body = cnv(cw, ch), b = body.getContext('2d');
  b.drawImage(base, 0, 0);
  b.globalCompositeOperation = 'multiply'; b.globalAlpha = .55; b.fillStyle = b.createPattern(grainTile(), 'repeat'); b.fillRect(0, 0, cw, ch); b.globalAlpha = 1;
  // 3. pigment pooling at the edge: a dark band just inside the silhouette
  const edge = cnv(cw, ch), e = edge.getContext('2d');
  e.fillStyle = mix(avg, '#241A3A', .55); e.fillRect(0, 0, cw, ch);
  e.globalCompositeOperation = 'destination-out'; e.filter = `blur(${Math.max(1, sh * .004).toFixed(1)}px)`; e.drawImage(base, 0, 0); e.filter = 'none';
  e.globalCompositeOperation = 'destination-in'; e.drawImage(base, 0, 0);
  b.globalCompositeOperation = 'multiply'; b.globalAlpha = .55; b.drawImage(edge, 0, 0); b.globalAlpha = 1;
  // restore the silhouette, with softened edges
  b.globalCompositeOperation = 'destination-in'; b.filter = `blur(${Math.max(.6, sh * .0009).toFixed(2)}px)`; b.drawImage(base, 0, 0); b.filter = 'none';
  g.drawImage(body, 0, 0);
  return { c: out, m };
}
const PAINTED = new Map();
function paintedSprite(im) { let p = PAINTED.get(im); if (!p) { p = paintFigure(im, im.width, im.height); PAINTED.set(im, p); } return p; }

// ── mesh + bones (WebGL2): a figure bends instead of sliding as one stiff card ──
// Bones live in the sprite's own pixel space; a pose rotates each bone about its joint. Vertices are skinned
// (linear blend) and the textured mesh is drawn by WebGL2 into a scratch canvas, then painted like any figure.
const RIGS = {
  // 我: V-sign arm on screen-left, other hand in pocket
  '03_main': { M: 220, bones: { root: [196, 1230], spine: [215, 640, 'root'], head: [222, 205, 'spine'], upperR: [105, 250, 'spine'], foreR: [38, 405, 'upperR'] },
    weights(x, y) {
      const w = {}, head = sstep(225, 188, y);
      const fore = x < 118 && y < 470 ? sstep(78, 48, segDist(x, y, 38, 405, 72, 185)) : 0;
      const up = x < 140 && y > 220 && y < 470 ? sstep(70, 45, segDist(x, y, 105, 250, 38, 405)) * (1 - fore) : 0;
      w.head = head * (1 - fore); let rest = 1 - w.head - fore - up; w.foreR = fore; w.upperR = up;
      const sp = sstep(720, 590, y); w.spine = rest * sp; w.root = rest * (1 - sp); return w;
    } },
  // 璐璐: hands clasped, long hair over her left shoulder (screen-right)
  '04_main': { M: 220, bones: { root: [178, 1215], spine: [200, 620, 'root'], head: [205, 212, 'spine'] },
    weights(x, y) {
      const w = {}; let head = sstep(230, 190, y);
      if (x > 245 && y > 150 && y < 380) head = Math.max(head, .75 * sstep(380, 170, y));    // the hair follows the head
      w.head = head; const rest = 1 - head, sp = sstep(700, 580, y); w.spine = rest * sp; w.root = rest * (1 - sp); return w;
    } },
};
const sstep = (e0, e1, x) => { const k = clamp((x - e0) / (e1 - e0)); return k * k * (3 - 2 * k); };
function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, k = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)); return Math.hypot(px - ax - dx * k, py - ay - dy * k); }

const GLR = { gl: null };
function glInit() {
  const c = cnv(16, 16), gl = c.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, alpha: true, antialias: true });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, `#version 300 es
    in vec2 pos; in vec2 uv; uniform vec2 res; out vec2 vuv;
    void main() { vuv = uv; vec2 q = pos / res * 2.0 - 1.0; gl_Position = vec4(q.x, -q.y, 0.0, 1.0); }`));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float; in vec2 vuv; uniform sampler2D tex; out vec4 o;
    void main() { o = texture(tex, vuv); }`));
  gl.linkProgram(p); gl.useProgram(p);
  Object.assign(GLR, { c, gl, p, pos: gl.createBuffer(), uv: gl.createBuffer(), idx: gl.createBuffer(), tex: new Map(), mesh: new Map(),
    aPos: gl.getAttribLocation(p, 'pos'), aUv: gl.getAttribLocation(p, 'uv'), uRes: gl.getUniformLocation(p, 'res') });
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
function rigMesh(key, im) {
  let R = GLR.mesh.get(key); if (R) return R;
  const rig = RIGS[key], W = im.width, H = im.height, step = 14;
  const a = cnv(W, H).getContext('2d', { willReadFrequently: true }); a.drawImage(im, 0, 0); const A = a.getImageData(0, 0, W, H).data;
  const alphaAt = (x, y) => { x = Math.round(clamp(x, 0, W - 1)); y = Math.round(clamp(y, 0, H - 1)); return A[(y * W + x) * 4 + 3]; };
  const nx = Math.ceil(W / step) + 1, ny = Math.ceil(H / step) + 1, names = Object.keys(rig.bones);
  const verts = [], uvs = [], wts = [], idx = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = Math.min(W, i * step), y = Math.min(H, j * step); verts.push(x, y); uvs.push(x / W, y / H);
    const w = rig.weights(x, y); let s = 0; names.forEach(n => s += w[n] || 0); wts.push(names.map(n => (w[n] || 0) / (s || 1)));
  }
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let any = false; for (let yy = 0; yy <= step && !any; yy += 4) for (let xx = 0; xx <= step && !any; xx += 4) if (alphaAt(i * step + xx, j * step + yy) > 8) any = true;
    if (!any) continue;
    const v = j * nx + i; idx.push(v, v + 1, v + nx, v + 1, v + nx + 1, v + nx);
  }
  R = { verts: new Float32Array(verts), uvs: new Float32Array(uvs), wts, idx: new Uint32Array(idx), names };
  GLR.mesh.set(key, R); return R;
}
// pose: { boneName: angle (rad), rootDx, rootDy } → deformed figure on a scratch canvas, scale s, margin M (sprite px)
function renderRig(key, im, pose, s) {
  if (!GLR.gl) glInit();
  const { gl } = GLR, rig = RIGS[key], R = rigMesh(key, im), M = rig.M;
  // bone world transforms: W = W_parent · T(p) R(a) T(-p)
  const Wm = {};
  for (const n of R.names) {
    const [px, py, parent] = rig.bones[n], a = pose[n] || 0, c = Math.cos(a), sn = Math.sin(a);
    let L = [c, sn, -sn, c, px - c * px + sn * py, py - sn * px - c * py];
    if (n === 'root') { L[4] += pose.rootDx || 0; L[5] += pose.rootDy || 0; }
    const P = parent ? Wm[parent] : [1, 0, 0, 1, 0, 0];
    Wm[n] = [P[0] * L[0] + P[2] * L[1], P[1] * L[0] + P[3] * L[1], P[0] * L[2] + P[2] * L[3], P[1] * L[2] + P[3] * L[3], P[0] * L[4] + P[2] * L[5] + P[4], P[1] * L[4] + P[3] * L[5] + P[5]];
  }
  const nv = R.verts.length / 2, out = new Float32Array(nv * 2), mats = R.names.map(n => Wm[n]);
  for (let v = 0; v < nv; v++) {
    const x = R.verts[v * 2], y = R.verts[v * 2 + 1], w = R.wts[v]; let ox = 0, oy = 0;
    for (let b = 0; b < mats.length; b++) { const k = w[b]; if (!k) continue; const m = mats[b]; ox += k * (m[0] * x + m[2] * y + m[4]); oy += k * (m[1] * x + m[3] * y + m[5]); }
    out[v * 2] = (ox + M) * s; out[v * 2 + 1] = (oy + M) * s;
  }
  const cw = Math.ceil((im.width + 2 * M) * s), ch = Math.ceil((im.height + 2 * M) * s);
  if (GLR.c.width !== cw || GLR.c.height !== ch) { GLR.c.width = cw; GLR.c.height = ch; }
  gl.viewport(0, 0, cw, ch); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  let tex = GLR.tex.get(key);
  if (!tex) { tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); GLR.tex.set(key, tex); }
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform2f(GLR.uRes, cw, ch);
  gl.bindBuffer(gl.ARRAY_BUFFER, GLR.pos); gl.bufferData(gl.ARRAY_BUFFER, out, gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(GLR.aPos); gl.vertexAttribPointer(GLR.aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, GLR.uv); gl.bufferData(gl.ARRAY_BUFFER, R.uvs, gl.STATIC_DRAW); gl.enableVertexAttribArray(GLR.aUv); gl.vertexAttribPointer(GLR.aUv, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GLR.idx); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, R.idx, gl.STATIC_DRAW);
  gl.drawElements(gl.TRIANGLES, R.idx.length, gl.UNSIGNED_INT, 0);
  const copy = cnv(cw, ch); copy.getContext('2d').drawImage(GLR.c, 0, 0);
  return { c: copy, M: M * s };
}

// each shot sets its ambient colour and light; puppets pick them up unless told otherwise
let AMB = null, AMBLIGHT = null;
function ambient(tint, light) { AMB = tint || null; AMBLIGHT = light || null; }
// scratch canvas for tinted figures (dusk and night light)
const TINT = document.createElement('canvas');
// puppet(role, view, x, y, h, o): (x, y) = ground point between the feet; h = an adult's standing height in px.
// o: t (for breathing), flip, rot (lean, pivots at the feet), dy, sx, sy, alpha, tint [col, a], shadow, walk (phase),
//    pose (bone angles for a rigged view), light [col, a] (warm light from the upper left), raw (skip the watercolour pass)
function puppet(role, view, x, y, h, o = {}) {
  const key = ROLE[role] + '_' + view, im = IMG[key]; if (!im) return;
  const seated = SEATED.has(key);
  const dh = h * TALL[role] * (seated ? .74 : 1) * (view === 'main' ? 1.02 : 1);
  const dw = dh * im.width / im.height, s = dh / im.height;
  const t = o.t ?? 0, ph = hash(role, 'breath') * TAU;
  let sy = (o.sy ?? 1) * (1 + .007 * Math.sin(t * 2.4 + ph)), sx = (o.sx ?? 1) * (1 - .003 * Math.sin(t * 2.4 + ph));
  let rot = o.rot || 0, dy = o.dy || 0;
  if (o.walk !== undefined) { const w = o.walk * TAU; dy -= Math.abs(Math.sin(w)) * h * .018; rot += Math.sin(w) * .035; }
  const rigged = o.pose && RIGS[key];
  if (rigged) sy = o.sy ?? 1, sx = o.sx ?? 1;         // the rig breathes on its own
  if (o.shadow !== false) {   // a watercolour puddle of shadow under the feet, and a darker contact
    ctx.save(); ctx.globalAlpha = (o.alpha ?? 1) * (o.shadowA ?? .8);
    const sdx = rigged ? (o.pose.rootDx || 0) * s * (o.flip ? -1 : 1) : 0;
    wcAt('shadow:' + role + view, UNIT(12), o.shadowCol || '#6D6A8E', x + sdx, y + 2, dw * .42, { sy: .12, spread: .4, a: .06, layers: 8, wet: true, gran: .3 });
    wcAt('contact:' + role + view, UNIT(10), o.shadowCol || '#5A5680', x + sdx, y, dw * .3, { sy: .07, spread: .3, a: .07, layers: 6, wet: true, gran: 0 });
    ctx.restore();
  }
  // the figure's pixels: rigged → deformed every frame; static → cached; both painted into the watercolour
  let src, m, fx, fy, fw, fh;
  if (rigged) {
    const breath = .012 * Math.sin(t * 2.4 + ph);
    const r = renderRig(key, im, { ...o.pose, spine: (o.pose.spine || 0) + breath * .3 }, s);
    const P = o.raw ? { c: r.c, m: 0 } : paintFigure(r.c, r.c.width, r.c.height);
    src = P.c; m = P.m + r.M; fx = -dw / 2 - m; fy = -dh - m; fw = r.c.width + 2 * P.m; fh = r.c.height + 2 * P.m;
  } else if (o.raw) { src = im; fx = -dw / 2; fy = -dh; fw = dw; fh = dh; }
  else { const P = paintedSprite(im); src = P.c; const k = dh / im.height; m = P.m * k; fx = -dw / 2 - m; fy = -dh - m; fw = P.c.width * k; fh = P.c.height * k; }
  ctx.save();
  ctx.translate(x, y + dy); ctx.rotate(rot); ctx.scale(sx * (o.flip ? -1 : 1), sy);
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const tn = o.tint ?? AMB, tint = tn && tn[1] > 0 ? tn : null, light = o.light ?? AMBLIGHT;
  if (tint || light) {
    const tw = Math.ceil(fw), th = Math.ceil(fh);
    if (TINT.width < tw || TINT.height < th) { TINT.width = Math.max(TINT.width, tw); TINT.height = Math.max(TINT.height, th); }
    const g = TINT.getContext('2d'); g.clearRect(0, 0, TINT.width, TINT.height); g.globalCompositeOperation = 'source-over'; g.drawImage(src, 0, 0, tw, th);
    g.globalCompositeOperation = 'source-atop';
    if (tint) { g.fillStyle = rgba(tint[0], tint[1]); g.fillRect(0, 0, tw, th); }
    if (light) { const gr = g.createLinearGradient(0, 0, tw, th * .6); gr.addColorStop(0, rgba(light[0], light[1])); gr.addColorStop(.6, rgba(light[0], 0)); g.fillStyle = gr; g.fillRect(0, 0, tw, th); }
    ctx.drawImage(TINT, 0, 0, tw, th, fx, fy, fw, fh);
  } else ctx.drawImage(src, fx, fy, fw, fh);
  ctx.restore();
  return { top: y + dy - dh, w: dw, h: dh };
}
// a close-up bust: view 'face' or an expression 'e0' (calm) 'e1' (smile) 'e2' (serious); from → to over k
function bust(role, from, to, k, x, y, h, o = {}) {
  const A = spriteOf(role, from), B = spriteOf(role, to);
  const draw = (im, a) => {
    if (!im || a <= 0) return;
    const P = paintedSprite(im), k = h / im.height, dh = h, dw = dh * im.width / im.height, m = P.m * k;
    ctx.save(); ctx.globalAlpha *= a * (o.alpha ?? 1); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.drawImage(P.c, -dw / 2 - m, -dh - m, P.c.width * k, P.c.height * k); ctx.restore();
  };
  const kk = clamp(k), bob = Math.sin(kk * Math.PI) * h * .012;   // a tiny lift while the face changes
  y -= bob;
  if (kk < 1) draw(A, 1);
  draw(B, ease(kk));
}
