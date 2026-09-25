// ───────────────────────── audio: the score and the sounds, on the film's own timeline ─────────────────────────
// One little theme in D major pentatonic runs through the whole film (80 bpm, a bar every 3 s). Each city changes who
// plays it and what is under it: guzheng alone at dawn, dizi over plucked chords in Beijing, a bowed drone on the
// Yellow River and the grassland, low guzheng in Xi'an, bright high plucks in the Singapore rain, a running
// ostinato for the train, a quiet flute at night, everyone together for the family. Sounds of each scene sit on top.
// All synthesised, all seeded. Scene sounds are written in storyboard time and placed with toFilm() (cut ones drop).
// buildAudio(sr) → [L, R]; window.audioWavBase64() → the same mix as a 16-bit WAV for ffmpeg.
function buildAudio(sr = 44100) {
  const N = Math.ceil(DUR * sr), L = new Float32Array(N), R = new Float32Array(N);
  const rnd = mulberry(15081508);
  const at = t => Math.max(0, Math.floor(t * sr));
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const add = (i, v, pan) => { if (i < 0 || i >= N) return; L[i] += v * Math.cos((pan + 1) * Math.PI / 4); R[i] += v * Math.sin((pan + 1) * Math.PI / 4); };
  const ev = t => toFilm(t);                                                   // a storyboard moment → film time (null if cut)
  const rg = (a, b) => { const x = toFilm(a, true), y = toFilm(b, true); return y - x > .05 ? [x, y] : null; };
  const PENT = [0, 2, 4, 7, 9];

  // ── instruments ──
  // guzheng: Karplus–Strong with a softened attack
  function pluck(t, f, amp = .3, pan = 0, dur = 2.6, bright = .5) {
    if (t === null || t < 0 || t >= DUR) return;
    const P = Math.max(2, Math.round(sr / f)), buf = new Float32Array(P), r = mulberry(Math.floor(t * 1000 + f));
    for (let i = 0; i < P; i++) buf[i] = (r() * 2 - 1) * (1 - bright * .5) + (i / P - .5) * bright;
    for (let pass = 0; pass < 3 - Math.round(bright * 2); pass++) for (let i = 0; i < P; i++) buf[i] = (buf[i] + buf[(i + 1) % P] + buf[(i + P - 1) % P]) / 3;
    let idx = 0, prev = 0; const n = Math.floor(dur * sr), i0 = at(t), damp = .4978 + bright * .0016;
    for (let k = 0; k < n; k++) {
      const v = buf[idx], nv = damp * (v + prev); prev = v; buf[idx] = nv; idx = (idx + 1) % P;
      add(i0 + k, v * amp * Math.min(1, k / 40) * (1 - k / n), pan);
    }
  }
  // dizi-like flute: a phrase of [time, duration, midi] played legato, with breath, glides and late vibrato
  function flute(notes, amp = .07, pan = 0) {
    if (!notes.length) return;
    const t0 = notes[0][0], t1 = notes[notes.length - 1][0] + notes[notes.length - 1][1], i0 = at(t0), i1 = Math.min(N, at(t1 + .25));
    const r = mulberry(Math.floor(t0 * 991)); let ph = 0, j = 0, fcur = mtof(notes[0][2]), nb = 0;
    for (let i = i0; i < i1; i++) {
      const t = i / sr; while (j < notes.length - 1 && t >= notes[j + 1][0]) j++;
      const [nt, nd, nm] = notes[j], local = t - nt, target = mtof(nm);
      fcur += (target - fcur) * .0025;                                         // a quick glide between notes
      const vib = 1 + .006 * Math.sin(TAU * 5.4 * t) * clamp((local - .25) / .3);
      ph += TAU * fcur * vib / sr;
      const gap = j < notes.length - 1 ? notes[j + 1][0] - (nt + nd) : .2;
      const env = Math.min(1, local / .06) * (local > nd ? Math.max(0, 1 - (local - nd) / (gap > .03 ? .12 : .02)) : 1) * (1 - .15 * clamp(local / 3));
      nb += .08 * ((r() * 2 - 1) - nb);                                        // breath noise, low-passed
      add(i, (Math.sin(ph) + .22 * Math.sin(2 * ph) + .06 * Math.sin(3 * ph) + nb * .35) * amp * env, pan);
    }
  }
  // bowed string (morin khuur / erhu colour): band-limited saw with vibrato, slow bow
  function bowed(t0, t1, midi, amp = .04, pan = 0) {
    if (t0 === null) return;
    const i0 = at(t0), i1 = Math.min(N, at(t1)), f = mtof(midi); let ph = 0, lp = 0;
    for (let i = i0; i < i1; i++) {
      const k = (i - i0) / sr, left = (i1 - i) / sr, vib = 1 + .005 * Math.sin(TAU * 5.8 * k) * clamp(k / .6);
      ph += TAU * f * vib / sr; let v = 0; for (let h = 1; h <= 7; h++) v += Math.sin(ph * h) / h;
      lp += .18 * (v - lp);
      add(i, lp * amp * Math.min(1, k / .35, left / .3), pan);
    }
  }
  function bell(t, f, amp = .2, pan = 0, dur = 3, parts = [[1, 1, 1], [2.76, .5, .6], [5.4, .25, .35], [8.93, .12, .2]]) {
    if (t === null || t < 0) return;
    const i0 = at(t), n = Math.floor(dur * sr);
    for (let k = 0; k < n; k++) { const tt = k / sr; let v = 0; for (const [m, a, d] of parts) v += a * Math.sin(TAU * f * m * tt) * Math.exp(-tt * 3 / (dur * d)); add(i0 + k, v * amp * Math.min(1, k / 30), pan); }
  }
  const ting = (t, amp = .06, pan = 0, f = 2093) => bell(t, f, amp, pan, .9, [[1, 1, 1], [2.01, .3, .5], [3.2, .1, .3]]);
  function pad(t0, t1, midis, amp = .05, pan = 0, att = 1.5) {
    const i0 = at(t0), i1 = Math.min(N, at(t1)), a = att * sr;
    for (const m of midis) for (const det of [-.07, .07]) {
      const f = mtof(m + det), ph = rnd() * TAU;
      for (let i = i0; i < i1; i++) { const k = i - i0, env = Math.min(1, k / a, (i1 - i) / a); add(i, Math.sin(TAU * f * k / sr + ph) * amp * env * (.8 + .2 * Math.sin(k / sr * .7 + ph)), pan + det * 3); }
    }
  }
  function noise(r2, amp, env, lp = .2, hp = 0, pan = 0, seedN = 1) {
    if (!r2) return; const [t0, t1] = r2;
    const r = mulberry(seedN * 7919 + Math.floor(t0 * 100)), i0 = at(t0), i1 = Math.min(N, at(t1));
    let l1 = 0, l2 = 0, h = 0, px = 0;
    for (let i = i0; i < i1; i++) {
      const x = r() * 2 - 1; l1 += lp * (x - l1); l2 += lp * (l1 - l2); let y = l2;
      if (hp > 0) { h = hp * (h + y - px); px = y; y = h; }
      add(i, y * amp * env((i - i0) / sr, (i - i0) / (i1 - i0)), pan + (r() - .5) * .2);
    }
  }
  const swell = (a, b) => (s, u) => Math.min(1, u / a, (1 - u) / b);
  function knock(t, f = 180, amp = .2, pan = 0, dec = 25, nz = .5) {
    if (t === null) return;
    const i0 = at(t), n = Math.floor(.25 * sr), r = mulberry(Math.floor(t * 977));
    for (let k = 0; k < n; k++) { const tt = k / sr, e = Math.exp(-tt * dec); add(i0 + k, (Math.sin(TAU * f * tt * (1 + e * .3)) * (1 - nz) + (r() * 2 - 1) * nz * Math.exp(-tt * dec * 3)) * e * amp, pan); }
  }
  function whistle(r2, f0, f1, amp, pan = 0, vib = 6) {
    if (!r2) return; const [t0, t1] = r2;
    const i0 = at(t0), i1 = Math.min(N, at(t1)); let ph = 0;
    for (let i = i0; i < i1; i++) { const u = (i - i0) / (i1 - i0), f = lerp(f0, f1, u) * (1 + .006 * Math.sin(TAU * vib * (i - i0) / sr)); ph += TAU * f / sr; add(i, (Math.sin(ph) + .3 * Math.sin(ph * 2.01)) * amp * Math.sin(u * Math.PI), pan); }
  }

  // ── the score ──
  const BEAT = .75, BAR = 3;
  // sections in film time (the shots' boundaries after the cut)
  const SEC = [[0, 'dawn'], [14, 'beijing'], [32, 'baotou'], [50, 'hohhot'], [68, 'xian'], [86, 'sg'], [104, 'slow'], [128, 'night'], [152, 'home'], [173, 'paper']].map(([st, n]) => [toFilm(st, true), n]);
  const secAt = t => { let s = SEC[0][1]; for (const [a, n] of SEC) if (t >= a - 1e-6) s = n; return s; };
  const PROG = {                                   // one chord a bar: [root, third, fifth] (midi)
    dawn: [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]], beijing: [[62, 66, 69], [55, 59, 62], [62, 66, 69], [57, 61, 64]],
    baotou: [[59, 62, 66], [55, 59, 62], [57, 61, 64], [59, 62, 66]], hohhot: [[64, 67, 71], [59, 62, 66], [64, 67, 71], [62, 66, 69]],
    xian: [[59, 62, 66], [57, 61, 64], [55, 59, 62], [57, 61, 64]], sg: [[55, 59, 62], [57, 61, 64], [62, 66, 69], [59, 62, 66]],
    slow: [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]], night: [[55, 59, 62], [62, 66, 69], [52, 55, 59], [57, 61, 64]],
    home: [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]], paper: [[62, 66, 69]],
  };
  // the theme: eight bars of [beats, midi] (0 = rest)
  const THEME = [
    [[1, 69], [1, 71], [2, 74]], [[1, 76], [1, 74], [2, 71]], [[1, 69], [1, 71], [1, 74], [1, 76]], [[3, 78], [1, 0]],
    [[1, 81], [1, 78], [2, 76]], [[1, 74], [1, 76], [2, 71]], [[1, 69], [1, 66], [1, 64], [1, 66]], [[4, 62]],
  ];
  const flutePhrase = [];
  const nBars = Math.floor(DUR / BAR);
  for (let b = 0; b < nBars; b++) {
    const t = b * BAR, sec = secAt(t + .01), prog = PROG[sec], ch = prog[b % prog.length], tb = THEME[b % 8];
    if (sec !== 'paper') {                          // chords and bass under everything but the paper
      pad(t, t + BAR + .6, [ch[0] - 12, ch[2] - 12, ch[1]], sec === 'home' ? .016 : .011, 0, .9);
      pluck(t, mtof(ch[0] - 24), .15, -.2, 3.4, .3);
    }
    const arp = [ch[0], ch[2], ch[0] + 12, ch[1] + 12, ch[0] + 12, ch[2]];
    if (sec === 'beijing' || sec === 'sg' || sec === 'home') for (let i = 0; i < 8; i++) { if (i % 4 === 3 && sec !== 'sg') continue; pluck(t + i * BEAT / 2, mtof(arp[i % 6] + (sec === 'sg' ? 12 : 0)), sec === 'home' ? .06 : .05, (i % 2 - .5) * .6, 1.6, .55); }
    if (sec === 'slow') for (let i = 0; i < 8; i++) pluck(t + i * BEAT / 2, mtof(arp[i % 6]), .07, (i % 2 - .5) * .5, 1.2, .5);   // the train
    if (sec === 'dawn' || sec === 'night' || sec === 'xian') for (let i = 0; i < 4; i++) pluck(t + i * BEAT, mtof(arp[i * 2 % 6] + (sec === 'xian' ? -12 : 0)), .05, (i % 2 - .5) * .5, 2.4, .45);
    if (sec === 'hohhot') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) pluck(t + i * BEAT + j * BEAT / 3, mtof(ch[0] + [0, 7, 12][j]), .035 * (j ? .7 : 1), -.3 + j * .3, .8, .4);   // a galloping triplet
    // who plays the theme here
    let x = t;
    for (const [bt, m] of tb) {
      const d = bt * BEAT;
      if (m) {
        if (sec === 'dawn') { if (b % 2) pluck(x, mtof(m + 12), .1, .2, 2.4, .6); }
        else if (sec === 'beijing' || sec === 'hohhot' || sec === 'night' || sec === 'home') flutePhrase.push([x, d * .92, m + (sec === 'night' ? 0 : 12), sec]);
        else if (sec === 'baotou') bowed(x, x + d * .98, m - 12, .035, -.1);
        else if (sec === 'xian') pluck(x, mtof(m), .13, .15, 2.8, .5);
        else if (sec === 'sg') pluck(x, mtof(m + 12), .14, .1, 1.8, .7);
        else if (sec === 'slow') { pluck(x, mtof(m + 12), .13, .15, 1.6, .6); if (bt >= 2) pluck(x + d / 2, mtof(m + 12), .08, .15, 1.2, .6); }
      }
      x += d;
    }
    if (sec === 'baotou' || sec === 'hohhot') bowed(t, t + BAR + .05, ch[0] - 24, .03, .2);   // the drone
  }
  // the flute plays its phrases section by section, breathing at the rests
  for (const s of ['beijing', 'hohhot', 'night', 'home']) {
    const ph = flutePhrase.filter(n => n[3] === s).map(n => n.slice(0, 3));
    let cur = []; ph.forEach((n, i) => { cur.push(n); const nx = ph[i + 1]; if (!nx || nx[0] - (n[0] + n[1]) > .25) { flute(cur, s === 'night' ? .045 : s === 'home' ? .07 : .06, s === 'home' ? 0 : .15); cur = []; } });
  }
  // the ending: sixteen notes rising as the faces light, the family-photo chord, one long note on the paper
  FACES.forEach(({ x }, i) => { const u = (x - 360) / (1500 - 360); if (u >= 0 && u <= 1) pluck(ev(164 + 6.5 * u), mtof(62 + PENT[i % 5] + 12 * Math.floor(i / 5)), .09, (u - .5) * 1.2, 2.6, .6); });
  const photo = toFilm(170.5, true), drop = toFilm(177, true);
  [62, 69, 74, 78, 81].forEach((m, i) => pluck(photo + i * .06, mtof(m), .12, (i - 2) * .3, 4, .55));
  pad(photo, photo + 4.6, [50, 57, 62, 66, 69], .02, 0, 1.2);
  bell(drop - .2, mtof(86), .06, 0, 3.2);
  pluck(drop, mtof(62), .18, 0, 3.2, .5); pad(drop, DUR, [50, 62, 69], .02, 0, 1);

  // ── the scenes' sounds (storyboard times) ──
  // 镜1: the rabbit leaves the moon, the characters turn gold, the letter, the crane
  whistle(rg(1.3, 2.7), 1500, 2400, .03, -.4, 3);
  [2.7, 3.7, 4.4, 6.5, 7.3, 8.1, 9.7, 10.7, 12.1].forEach((t, i) => ting(ev(t), .05, (i % 3 - 1) * .3, 1760 + (i % 4) * 220));
  LIGHT_AT.forEach((t, i) => bell(ev(t), mtof(74 + PENT[(4 - i) % 5]), .08, .3 - i * .2, 3));
  noise(rg(10, 11.3), .05, swell(.3, .3), .1, 0, .2, 2);
  noise(rg(11.6, 12.2), .04, swell(.2, .6), .3, .5, 0, 3);
  for (let i = 0; i < 6; i++) noise(rg(12.3 + i * .42, 12.5 + i * .42), .04, swell(.3, .5), .08, 0, 0, 4 + i);
  // 镜2 北京: pigeon whistles, landing, the bicycle bell, the persimmon
  for (let i = 0; i < 3; i++) whistle(rg(13.5 + i * .3, 18.5), 880 * (1 + i * .19), 860 * (1 + i * .19), .022, (i - 1) * .5, 4 + i);
  for (let i = 0; i < 9; i++) knock(ev(17.9 + i * .24), 700, .025, (i - 4) * .1, 60, .8);
  [19.45, 19.9].forEach(t => ting(ev(t), .05));
  bell(ev(24.3), 2640, .05, .2, .8, [[1, 1, 1], [2.3, .3, .5]]); bell(ev(24.55), 2640, .05, .2, .8, [[1, 1, 1], [2.3, .3, .5]]);
  noise(rg(23, 26), .015, swell(.2, .2), .05, 0, 0, 20);
  ting(ev(29.3), .05); knock(ev(29.6), 120, .07, 0, 12, .2); noise(rg(29.6, 32), .05, (s, u) => u * u, .15, .2, 0, 21);
  // 镜3 包头: river and wind, the furnace, hooves
  noise(rg(31.4, 50.5), .04, swell(.05, .05), .03, 0, -.2, 30);
  noise(rg(38.3, 41.5), .1, swell(.35, .4), .02, 0, 0, 32);
  for (let t = 44; t < 47; t += .23) knock(ev(t), 90, .07, .3, 30, .4);
  // 镜4 呼和浩特: wind over the grass, hooves, prayer flags, the poles ticking, the red flash
  noise(rg(49.2, 68), .035, swell(.05, .05), .05, 0, .3, 40);
  for (let t = 53; t < 56; t += .36) for (let j = 0; j < 3; j++) knock(ev(t + j * .07), 80 + j * 10, .06, -.2 + j * .1, 28, .45);
  noise(rg(56, 59), .04, (s) => .5 + .5 * Math.sin(s * 40), .3, .6, .4, 41);
  for (let i = 0; i < 12; i++) knock(ev(62 + i * .24), 1400, .02, (i % 2 - .5) * .6, 80, .2);
  noise(rg(66.3, 68), .07, (s, u) => u * u, .2, .3, 0, 42);
  // 镜5 西安: lanterns lighting as the rabbit passes, the two lanterns touching, the rain drop on the moon
  XA_LAN.forEach((x, i) => { const u = (x - 60) / 2640; if (u >= 0 && u <= 1) ting(ev(71 + 3 * u), .035, (u - .5) * 1.4, 1568 + (i % 5) * 196); });
  noise(rg(77.2, 79.5), .045, swell(.3, .5), .12, .4, .3, 50);
  [78.2, 78.9].forEach(t => knock(ev(t), 260, .08, 0, 22, .3));
  bell(ev(84), 1760, .07, 0, 1.4, [[1, 1, 1], [1.5, .5, .6], [2.2, .2, .3]]);
  // 镜6 新加坡: rain, shutters, lanterns, the rabbit shaking itself dry, the Supertrees, the drop
  noise(rg(84.6, 96), .035, swell(.03, .12), .35, .6, -.3, 60); noise(rg(84.6, 96), .022, swell(.03, .12), .35, .6, .4, 61);
  for (let i = 4; i <= 6; i++) for (let j = 0; j < 3; j++) knock(ev(89.3 + (i - 4) * .7 + j * .22), 320, .05, (j - 1) * .4, 35, .5);
  for (let i = 0; i < 4; i++) ting(ev(90.4 + i * .3), .03, (i - 1.5) * .3, 2637);
  noise(rg(96, 96.6), .05, swell(.1, .3), .6, .7, .2, 62); ting(ev(96.9), .045);
  for (let i = 0; i < 10; i++) ting(ev(98.5 + i * .13), .022, (i / 10 - .5), 2093 * Math.pow(2, PENT[i % 5] / 12));
  bell(ev(101.8), 1568, .06, 0, 1.2, [[1, 1, 1], [1.5, .4, .5]]);
  noise(rg(102.8, 104), .05, (s, u) => u, .15, .3, 0, 63);
  // 镜7 从前慢: the knife, the train, the bridge, the station bell, letters, the racing sky, the lock, the keyhole
  for (let i = 0; i < 5; i++) noise(rg(104.3 + i * .38, 104.55 + i * .38), .06, swell(.2, .6), .5, .7, (i - 2) * .2, 70 + i);
  whistle(rg(107.2, 108.4), 620, 600, .035, .4, 2);
  for (let t = 107.3; t < 115.8;) { knock(ev(t), 140, .05, .2, 40, .6); knock(ev(t + .11), 150, .04, .2, 40, .6); t += .52 + Math.max(0, t - 114.6) * .8; }
  noise(rg(110, 113), .04, swell(.2, .3), .04, 0, 0, 80);
  bell(ev(115.4), 1175, .05, .3, 1.5);
  LETTER_FROM.forEach((_, i) => knock(ev(117.5 + i * .48), 200, .06, (i - 2) * .2, 30, .7));
  for (let i = 0; i < 6; i++) { noise(rg(119 + i * .5, 119.5 + i * .5), .035, swell(.4, .4), .2, .3, i % 2 ? .4 : -.4, 90 + i); pluck(ev(119 + i * .5), mtof(72 + PENT[i % 5] + (i > 4 ? 12 : 0)), .08, i % 2 ? .4 : -.4, 1.5, .7); }
  noise(rg(122.2, 123), .035, swell(.2, .3), .6, .8, .2, 96);
  knock(ev(123.7), 900, .07, .2, 60, .6); knock(ev(124.02), 520, .1, .2, 40, .5); bell(ev(124.05), 1100, .04, .2, .8, [[1, 1, 1], [2.4, .4, .4]]);
  for (let i = 0; i < 10; i++) ting(ev(125.3 + i * .26), .02 + i * .003, (i % 2 - .5) * .5, 1760 * Math.pow(2, PENT[i % 5] / 12 + Math.floor(i / 5)));
  // 镜8 夜: crickets, the door, the rabbit hopping in, the moon moving between the cups, steam
  for (let t = 128; t < 152; t += .9 + rnd() * .8) { const p = (rnd() - .5) * 1.4, ft = ev(t); if (ft !== null) for (let j = 0; j < 3; j++) bell(ft + j * .06, 4200 + rnd() * 300, .01, p, .15, [[1, 1, 1]]); }
  { const r2 = rg(134.3, 136.5); if (r2) { const i0 = at(r2[0]), n = Math.floor((r2[1] - r2[0]) * sr); let ph = 0; for (let k = 0; k < n; k++) { const u = k / n, f = 110 + 30 * Math.sin(u * 9) + 20 * Math.sin(u * 23); ph += TAU * f / sr; add(i0 + k, ((ph / TAU) % 1 - .5) * .025 * Math.sin(u * Math.PI), -.2); } } }
  [135.6, 136.1, 136.6, 137.3, 137.9, 138.5, 139.2].forEach(t => ting(ev(t), .04));
  for (let i = 0; i < 6; i++) ting(ev(143.4 + i * .3), .02, -.5 + i * .2, 2349 * Math.pow(2, PENT[i % 5] / 12));
  noise(rg(145.6, 152), .025, swell(.3, .3), .15, .5, 0, 110);
  // 镜9: the rabbit climbing the moonbeam and going home
  [159.3, 159.9, 160.5, 161.1, 161.7, 162.3].forEach((t, i) => ting(ev(t), .045, .3 - i * .1, 1568 * Math.pow(2, PENT[i % 5] / 12)));
  for (let i = 0; i < 16; i++) ting((ev(162.8) ?? 0) + i * .04, .022, (i / 16 - .5), 2093 * Math.pow(2, PENT[i % 5] / 12 + Math.floor(i / 5)));
  // 镜10: the drop from the 日
  ting(ev(175.8), .04, .1, 2637);

  // ── a little room: Schroeder reverb, then level by the loud end of the distribution and a gentle limiter ──
  const comb = [1557, 1617, 1491, 1422, 1277, 1356], ap = [225, 556, 441];
  for (const [X, off] of [[L, 0], [R, 23]]) {
    const dry = X.slice(), wet = new Float32Array(N);
    for (const d0 of comb) { const d = d0 + off, b = new Float32Array(d); let j = 0, lp = 0; for (let i = 0; i < N; i++) { const y = b[j]; lp = y * .7 + lp * .3; b[j] = dry[i] + lp * .82; wet[i] += y; j = (j + 1) % d; } }
    for (const d0 of ap) { const d = d0 + off, b = new Float32Array(d); let j = 0; for (let i = 0; i < N; i++) { const bo = b[j], y = -wet[i] + bo; b[j] = wet[i] + bo * .5; wet[i] = y; j = (j + 1) % d; } }
    for (let i = 0; i < N; i++) X[i] = dry[i] + wet[i] * .06;
  }
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
