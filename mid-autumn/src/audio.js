// ───────────────────────── audio: the soundtrack, generated on the film's own timeline ─────────────────────────
// Everything is synthesised from seeded randomness: plucked pentatonic strings (Karplus–Strong), soft pads,
// and the sounds of each scene (pigeon whistles, bells, rain, hooves, the train, the lock, the door, crickets).
// buildAudio(sr) → [L, R]; window.audioWavBase64() → the same mix as a 16-bit WAV for ffmpeg.
function buildAudio(sr = 44100) {
  const N = Math.ceil(DUR * sr), L = new Float32Array(N), R = new Float32Array(N);
  const rnd = mulberry(15081508);
  const at = t => Math.max(0, Math.floor(t * sr));
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const add = (i, v, pan) => { if (i < 0 || i >= N) return; L[i] += v * Math.cos((pan + 1) * Math.PI / 4); R[i] += v * Math.sin((pan + 1) * Math.PI / 4); };

  // ── instruments ──
  // plucked string (guzheng-like): Karplus–Strong with a touch of pitch bend at the attack
  function pluck(t, f, amp = .3, pan = 0, dur = 2.6, bright = .5) {
    const P = Math.max(2, Math.round(sr / f)), buf = new Float32Array(P), r = mulberry(Math.floor(t * 1000 + f));
    for (let i = 0; i < P; i++) buf[i] = (r() * 2 - 1) * (1 - bright * .5) + (i / P - .5) * bright;
    let idx = 0, prev = 0; const n = Math.floor(dur * sr), i0 = at(t), damp = .4985 + bright * .0012;
    for (let k = 0; k < n; k++) {
      const v = buf[idx], nv = damp * (v + prev); prev = v; buf[idx] = nv; idx = (idx + 1) % P;
      const env = k < 40 ? k / 40 : 1;
      add(i0 + k, v * amp * env * (1 - k / n), pan);
    }
  }
  // a small bell or chime: inharmonic partials with separate decays
  function bell(t, f, amp = .2, pan = 0, dur = 3, parts = [[1, 1, 1], [2.76, .5, .6], [5.4, .25, .35], [8.93, .12, .2]]) {
    const i0 = at(t), n = Math.floor(dur * sr);
    for (let k = 0; k < n; k++) { const tt = k / sr; let v = 0; for (const [m, a, d] of parts) v += a * Math.sin(TAU * f * m * tt) * Math.exp(-tt * 3 / (dur * d)); add(i0 + k, v * amp * Math.min(1, k / 30), pan); }
  }
  const ting = (t, amp = .09, pan = 0, f = 2093) => bell(t, f, amp, pan, .9, [[1, 1, 1], [2.01, .3, .5], [3.2, .1, .3]]);
  // a soft pad: detuned sines with slow swells
  function pad(t0, t1, midis, amp = .05, pan = 0, att = 1.5) {
    const i0 = at(t0), i1 = Math.min(N, at(t1)), a = att * sr;
    for (const m of midis) for (const det of [-.07, .07]) {
      const f = mtof(m + det), ph = rnd() * TAU;
      for (let i = i0; i < i1; i++) { const k = i - i0, env = Math.min(1, k / a, (i1 - i) / a); add(i, Math.sin(TAU * f * k / sr + ph) * amp * env * (.8 + .2 * Math.sin(k / sr * .7 + ph)), pan + det * 3); }
    }
  }
  // filtered noise with an envelope function (rain, wind, river, whooshes, steam)
  function noise(t0, t1, amp, env, lp = .2, hp = 0, pan = 0, seedN = 1) {
    const r = mulberry(seedN * 7919 + Math.floor(t0 * 100)), i0 = at(t0), i1 = Math.min(N, at(t1));
    let l1 = 0, l2 = 0, h = 0, px = 0;
    for (let i = i0; i < i1; i++) {
      const x = r() * 2 - 1; l1 += lp * (x - l1); l2 += lp * (l1 - l2); let y = l2;
      if (hp > 0) { h = hp * (h + y - px); px = y; y = h; }
      add(i, y * amp * env((i - i0) / sr, (i - i0) / (i1 - i0)), pan + (r() - .5) * .2);
    }
  }
  const swell = (a, b) => (s, u) => Math.min(1, u / a, (1 - u) / b);
  // a short knock (wood, hooves, clicks): damped low sine + noise burst
  function knock(t, f = 180, amp = .2, pan = 0, dec = 25, nz = .5) {
    const i0 = at(t), n = Math.floor(.25 * sr), r = mulberry(Math.floor(t * 977));
    for (let k = 0; k < n; k++) { const tt = k / sr, e = Math.exp(-tt * dec); add(i0 + k, (Math.sin(TAU * f * tt * (1 + e * .3)) * (1 - nz) + (r() * 2 - 1) * nz * Math.exp(-tt * dec * 3)) * e * amp, pan); }
  }
  // a whistle glide (pigeon whistles, the train)
  function whistle(t0, t1, f0, f1, amp, pan = 0, vib = 6) {
    const i0 = at(t0), i1 = Math.min(N, at(t1)); let ph = 0;
    for (let i = i0; i < i1; i++) { const u = (i - i0) / (i1 - i0), f = lerp(f0, f1, u) * (1 + .006 * Math.sin(TAU * vib * (i - i0) / sr)); ph += TAU * f / sr; add(i, (Math.sin(ph) + .3 * Math.sin(ph * 2.01)) * amp * Math.sin(u * Math.PI), pan); }
  }

  // ── music: each shot its own pentatonic mode, tempo and density ──
  const PENT = [0, 2, 4, 7, 9];
  const SECTIONS = [
    // start, end, root midi, bpm, density, brightness, pad chord (semitones from root)
    [0, 14, 62, 72, .45, .6, [0, 7, 12]],
    [14, 32, 67, 84, .6, .7, [0, 7, 16]],
    [32, 50, 57, 64, .45, .45, [0, 7, 12, 15]],
    [50, 68, 64, 60, .4, .4, [0, 7, 12]],
    [68, 86, 62, 70, .5, .5, [0, 7, 10, 15]],
    [86, 104, 65, 78, .55, .6, [0, 7, 16]],
    [104, 128, 60, 88, .6, .6, [0, 7, 12, 16]],
    [128, 152, 62, 60, .4, .5, [0, 7, 12, 16]],
    [152, 173, 62, 54, .5, .55, [0, 7, 12, 16, 19]],
  ];
  const minorish = new Set([57, 64]);
  SECTIONS.forEach(([t0, t1, root, bpm, dens, br, chord], si) => {
    const beat = 60 / bpm, scale = minorish.has(root) ? [0, 3, 5, 7, 10] : PENT;
    pad(Math.max(0, t0 - .5), Math.min(DUR, t1 + 1), chord.map(c => root - 12 + c), .018, 0, 2);
    let deg = 5 + Math.floor(rnd() * 3);
    for (let t = t0 + beat * .5, b = 0; t < t1 - .3; t += beat, b++) {
      if (b % 4 === 0) pluck(t, mtof(root - 12 + (b % 8 ? 7 : 0)), .16, -.3, 3.2, .35);            // bass on the bar
      if (rnd() < dens) {
        deg = clamp(deg + [-2, -1, -1, 1, 1, 2][Math.floor(rnd() * 6)], 0, 10);
        const m = root + Math.floor(deg / 5) * 12 + scale[deg % 5], off = rnd() < .25 ? beat * .5 : 0;
        pluck(t + off, mtof(m), .13 + rnd() * .05, (rnd() - .5) * .8, 2.4, br);
        if (rnd() < .15) pluck(t + off + .09, mtof(m + 12), .05, (rnd() - .5) * .8, 1.6, br);   // a grace note an octave up
      }
    }
  });
  // the ending: sixteen notes rising, one for each face as it lights; then the family photo chord and one long note
  FACES.forEach(({ x }, i) => {
    const u = (x - 360) / (1500 - 360), lt = 12 + 6.5 * u;                       // (the reverse-angle pan, roughly linear)
    if (u >= 0 && u <= 1) pluck(152 + lt, mtof(62 + [0, 2, 4, 7, 9][i % 5] + 12 * Math.floor(i / 5)), .12, (u - .5) * 1.2, 2.6, .6);
  });
  [62, 69, 74, 78, 81].forEach((m, i) => pluck(170.6 + i * .06, mtof(m), .12, (i - 2) * .3, 4, .55));
  pad(170.5, 176, [50, 57, 62, 66, 69], .02, 0, 1.2);
  bell(176.9, mtof(86), .07, 0, 3.2);
  pluck(177, mtof(62), .2, 0, 3, .5); pad(177, 180, [50, 62], .02, 0, 1);

  // ── the scenes' sounds ──
  // 镜1: the rabbit leaves the moon, the characters turn gold, the letter, the crane
  whistle(1.3, 2.7, 1500, 2400, .03, -.4, 3);
  [2.7, 3.7, 4.4, 6.5, 7.3, 8.1, 9.7, 10.7, 12.1].forEach((t, i) => ting(t, .07, (i % 3 - 1) * .3, 1760 + (i % 4) * 220));
  LIGHT_AT.forEach((t, i) => bell(t, mtof(74 + PENT[(4 - i) % 5]), .09, .3 - i * .2, 3));
  noise(10, 11.3, .06, swell(.3, .3), .1, 0, .2, 2);                                   // paper sliding under the door
  noise(11.6, 12.2, .05, swell(.2, .6), .3, .5, 0, 3);                                 // folding
  for (let i = 0; i < 6; i++) noise(12.3 + i * .42, 12.5 + i * .42, .05, swell(.3, .5), .08, 0, 0, 4 + i);   // wing beats
  // 镜2 北京: pigeon whistles, landing, the bicycle bell, the persimmon
  for (let i = 0; i < 3; i++) whistle(13.5 + i * .3, 18.5, 880 * (1 + i * .19), 860 * (1 + i * .19), .025, (i - 1) * .5, 4 + i);
  for (let i = 0; i < 9; i++) knock(17 + .9 + i * .24, 700, .03, (i - 4) * .1, 60, .8);
  [19.45, 19.9].forEach(t => ting(t, .07));
  bell(24.3, 2640, .06, .2, .8, [[1, 1, 1], [2.3, .3, .5]]); bell(24.55, 2640, .06, .2, .8, [[1, 1, 1], [2.3, .3, .5]]);
  noise(23, 26, .02, swell(.2, .2), .05, 0, 0, 20);                                    // tyres on the lane
  ting(29.3, .06); knock(29.6, 120, .08, 0, 12, .2); noise(29.6, 32.2, .06, (s, u) => u * u, .15, .2, 0, 21);
  // 镜3 包头: river and wind, the deer drinking, the furnace, hooves
  noise(31.4, 50.5, .05, swell(.05, .05), .03, 0, -.2, 30); noise(31.4, 41, .04, swell(.1, .2), .08, .9, .3, 31);
  [35.9, 36.5].forEach(t => ting(t, .06));
  [36.8, 37.4].forEach(t => bell(t, 1320, .05, -.2, .6, [[1, 1, 1], [1.5, .4, .5]]));
  noise(38.3, 41.5, .12, swell(.35, .4), .02, 0, 0, 32);
  for (let t = 44; t < 47; t += .23) knock(t + (Math.floor((t - 44) / .23) % 2) * .06, 90, .08, .3, 30, .4);
  for (let t = 47.2; t < 50; t += .42) ting(t, .03, .2, 2349);
  // 镜4 呼和浩特: wind over grass, hooves, prayer flags, the skylight's poles ticking, the red flash
  noise(49.2, 68, .045, swell(.05, .05), .05, 0, .3, 40);
  for (let t = 53; t < 56; t += .36) for (let j = 0; j < 3; j++) knock(t + j * .07, 80 + j * 10, .07, -.2 + j * .1, 28, .45);
  noise(56, 59, .05, (s) => .5 + .5 * Math.sin(s * 40), .3, .6, .4, 41);
  for (let i = 0; i < 12; i++) knock(62 + i * .24, 1400, .025, (i % 2 - .5) * .6, 80, .2);
  noise(66.3, 68, .08, (s, u) => u * u, .2, .3, 0, 42);
  // 镜5 西安: lanterns lighting as the rabbit passes, the bell tower, the two lanterns touching, the rain drop
  XA_LAN.forEach((x, i) => { const u = (x - 60) / 2640; if (u >= 0 && u <= 1) { ting(71 + 3 * u, .045, (u - .5) * 1.4, 1568 + (i % 5) * 196); } });
  [74.3, 75.3, 76.3].forEach(t => bell(t, 98, .045, 0, 6, [[1, 1, 1], [2.1, .6, .7], [3, .35, .5], [4.2, .2, .35], [5.4, .12, .25]]));
  ting(74.35, .05, -.3);
  noise(77.2, 79.5, .05, swell(.3, .5), .12, .4, .3, 50);
  [78.2, 78.9].forEach(t => knock(t, 260, .09, 0, 22, .3));
  bell(84, 1760, .08, 0, 1.4, [[1, 1, 1], [1.5, .5, .6], [2.2, .2, .3]]);
  // 镜6 新加坡: rain, shutters, lanterns, the frangipani, the rabbit shaking itself dry, the Supertrees, the drop
  noise(84.6, 96, .09, swell(.03, .12), .5, .6, 0, 60); noise(84.6, 96, .05, swell(.03, .12), .5, .6, .5, 61);
  for (let i = 4; i <= 6; i++) for (let j = 0; j < 3; j++) knock(86 + 3.3 + (i - 4) * .7 + j * .22, 320, .06, (j - 1) * .4, 35, .5);
  for (let i = 0; i < 4; i++) ting(90.4 + i * .3, .04, (i - 1.5) * .3, 2637);
  bell(94.4, 1318, .06, -.2, 1.2, [[1, 1, 1], [2, .3, .5]]);
  noise(96, 96.6, .06, swell(.1, .3), .6, .7, .2, 62); ting(96.9, .06);
  for (let i = 0; i < 10; i++) ting(98.5 + i * .13, .03, (i / 10 - .5), 2093 * Math.pow(2, PENT[i % 5] / 12));
  bell(101.8, 1568, .07, 0, 1.2, [[1, 1, 1], [1.5, .4, .5]]);
  noise(102.8, 104, .06, (s, u) => u, .15, .3, 0, 63);
  // 镜7 从前慢: the knife, the train, the bridge, birds, the station bell, letters, the racing sky, the lock
  for (let i = 0; i < 5; i++) noise(104.3 + i * .38, 104.55 + i * .38, .07, swell(.2, .6), .5, .7, (i - 2) * .2, 70 + i);
  whistle(107.2, 108.4, 620, 600, .04, .4, 2);
  for (let t = 107.3, i = 0; t < 115.8; i++) { knock(t, 140, .06, .2, 40, .6); knock(t + .11, 150, .05, .2, 40, .6); t += .52 + Math.max(0, t - 114.6) * .8; }
  noise(110, 113, .05, swell(.2, .3), .04, 0, 0, 80);
  for (let i = 0; i < 8; i++) noise(110.6 + i * .06, 110.8 + i * .06, .03, swell(.2, .5), .3, .5, (i - 4) * .15, 81 + i);
  bell(115.4, 1175, .06, .3, 1.5);
  LETTER_FROM.forEach((_, i) => knock(117.5 + i * .48, 200, .07, (i - 2) * .2, 30, .7));
  for (let i = 0; i < 6; i++) { noise(119 + i * .5, 119.5 + i * .5, .04, swell(.4, .4), .2, .3, i % 2 ? .4 : -.4, 90 + i); pluck(119 + i * .5, mtof(72 + PENT[i % 5] + (i > 4 ? 12 : 0)), .1, i % 2 ? .4 : -.4, 1.5, .7); }
  noise(122.2, 123, .04, swell(.2, .3), .6, .8, .2, 96);
  knock(123.7, 900, .08, .2, 60, .6); knock(124.02, 520, .12, .2, 40, .5); bell(124.05, 1100, .05, .2, .8, [[1, 1, 1], [2.4, .4, .4]]);
  for (let i = 0; i < 12; i++) ting(125.3 + i * .22, .025 + i * .003, (i % 2 - .5) * .5, 1760 * Math.pow(2, PENT[i % 5] / 12 + Math.floor(i / 5)));
  // 镜8 夜: crickets under everything, cranes landing, the door, the floret in the cup, steam
  for (let t = 128; t < 152; t += .9 + rnd() * .8) { const p = (rnd() - .5) * 1.4; for (let j = 0; j < 3; j++) bell(t + j * .06, 4200 + rnd() * 300, .012, p, .15, [[1, 1, 1]]); }
  for (let i = 0; i < 5; i++) noise(131.3 + i * .5, 132.1 + i * .5, .04, swell(.3, .4), .08, 0, (i - 2) * .3, 100 + i);
  { const i0 = at(134.3), n = Math.floor(2.2 * sr); let ph = 0; for (let k = 0; k < n; k++) { const u = k / n, f = 110 + 30 * Math.sin(u * 9) + 20 * Math.sin(u * 23); ph += TAU * f / sr; add(i0 + k, ((ph / TAU) % 1 - .5) * .03 * Math.sin(u * Math.PI), -.2); } }
  [135.6, 136.1, 136.6, 137.3, 137.9, 138.5, 139.2].forEach(t => ting(t, .05));
  bell(141.4, 1760, .07, -.2, 1.5, [[1, 1, 1], [1.5, .4, .6], [2.4, .2, .3]]);
  for (let i = 0; i < 6; i++) ting(143.4 + i * .3, .025, -.5 + i * .2, 2349 * Math.pow(2, PENT[i % 5] / 12));
  noise(145.6, 152, .03, swell(.3, .3), .15, .5, 0, 110);
  // 镜9: the rabbit climbing the moonbeam, going home, the moon filling with light
  noise(152, 173, .02, swell(.1, .1), .02, 0, 0, 120);
  [159.3, 159.9, 160.5, 161.1, 161.7, 162.3].forEach((t, i) => ting(t, .06, .3 - i * .1, 1568 * Math.pow(2, PENT[i % 5] / 12)));
  for (let i = 0; i < 16; i++) ting(162.8 + i * .045, .03, (i / 16 - .5), 2093 * Math.pow(2, PENT[i % 5] / 12 + Math.floor(i / 5)));
  pad(162.8, 164.5, [74, 78, 81, 86], .02, 0, .4);
  // 镜10: the drop from the 日, and paper
  ting(175.8, .05, .1, 2637);

  // ── a little room: Schroeder reverb, then a gentle limiter ──
  const comb = [1557, 1617, 1491, 1422, 1277, 1356], ap = [225, 556, 441];
  for (const [X, off] of [[L, 0], [R, 23]]) {
    const dry = X.slice(), wet = new Float32Array(N);
    for (const d0 of comb) { const d = d0 + off, b = new Float32Array(d); let j = 0, lp = 0; for (let i = 0; i < N; i++) { const y = b[j]; lp = y * .7 + lp * .3; b[j] = dry[i] + lp * .8; wet[i] += y; j = (j + 1) % d; } }
    for (const d0 of ap) { const d = d0 + off, b = new Float32Array(d); let j = 0; for (let i = 0; i < N; i++) { const bo = b[j], y = -wet[i] + bo; b[j] = wet[i] + bo * .5; wet[i] = y; j = (j + 1) % d; } }
    for (let i = 0; i < N; i++) X[i] = dry[i] + wet[i] * .045;
  }
  // level by the loud end of the distribution (99.95th percentile), not by one stray peak; tanh catches the rest
  const hist = new Uint32Array(1000); for (let i = 0; i < N; i += 3) { hist[Math.min(999, Math.floor(Math.abs(L[i]) * 500))]++; hist[Math.min(999, Math.floor(Math.abs(R[i]) * 500))]++; }
  let acc = 0, tot = 2 * Math.ceil(N / 3), q = 999; for (let b = 0; b < 1000; b++) { acc += hist[b]; if (acc >= tot * .9995) { q = b; break; } }
  const g = .7 / Math.max((q + 1) / 500, 1e-6);
  for (let i = 0; i < N; i++) {
    const fade = Math.min(1, i / (sr * .5), (N - i) / (sr * 1.5));
    L[i] = Math.tanh(L[i] * g * 1.1) * fade; R[i] = Math.tanh(R[i] * g * 1.1) * fade;
  }
  return [L, R];
}
window.audioWavBase64 = () => {
  const sr = 44100, [L, R] = buildAudio(sr), n = L.length, buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.round(clamp(L[i], -1, 1) * 32767), true); v.setInt16(46 + i * 4, Math.round(clamp(R[i], -1, 1) * 32767), true); }
  const u8 = new Uint8Array(buf); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(s);
};
