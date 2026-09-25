// Headless renderer for mid-autumn.html (Playwright + Chromium, ffmpeg for the MP4).
//   node tools/render.mjs --sheet=0.5,1,2 [--cols=4] [--w=480] [--view=cast] --out=contact/a.jpg   contact sheet
//   node tools/render.mjs --frames [--range=a:b] [--workers=4]                                     JPEG frames → frames/
//   node tools/render.mjs --audio --out=build/audio.wav                                              the soundtrack, same timeline
//   node tools/render.mjs --encode --out=日色变得慢.mp4                                            frames + audio → MP4
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const PAGE = pathToFileURL(ROOT + '/mid-autumn.html').href;
const FRAMES = ROOT + '/build/frames';
const FFMPEG = process.env.FFMPEG || (() => { try { return execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim(); } catch { return 'ffmpeg'; } })();
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });

if (args.encode) {
  const out = resolve(ROOT, args.out || '日色变得慢.mp4'), wav = ROOT + '/build/audio.wav';
  const fps = 24;
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${FRAMES}/f%05d.jpg`, '-i', wav,
    '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 20), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function openPage(tag = '') {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(PAGE + '?render' + (args.view ? '&view=' + args.view : ''));
  await page.waitForFunction('window.ready === true', null, { timeout: 60000 });
  return page;
}
const times = s => String(s).split(',').map(Number);

if (args.sheet) {
  const page = await openPage(), out = resolve(ROOT, args.out || 'contact/sheet.jpg'); mkdirSync(dirname(out), { recursive: true });
  let ts = times(args.sheet);
  const { url, ms } = await page.evaluate(([ts, c, w]) => window.renderSheet(ts, c, w), [ts, +(args.cols || 4), +(args.w || 480)]);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out} (${ts.length} frames) ms/frame: ${ms.join(' ')}`);
} else if (args.still) {
  const page = await openPage(), out = resolve(ROOT, args.out || 'build/still.png'); mkdirSync(dirname(out), { recursive: true });
  const url = await page.evaluate(t => window.renderAt(t, 'image/png'), +args.still);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log(out);
} else if (args.audio) {
  const page = await openPage(), out = resolve(ROOT, args.out || 'build/audio.wav'); mkdirSync(dirname(out), { recursive: true });
  const b64 = await page.evaluate(() => window.audioWavBase64());
  writeFileSync(out, Buffer.from(b64, 'base64')); console.log('wrote ' + out);
} else if (args.frames) {
  // one frame every 1/fps seconds; parallel workers, resumable, atomic writes
  const fps = 24, dur = 180;
  const [a, b] = args.range ? String(args.range).split(':').map(Number) : [0, dur], workers = +(args.workers || 4);
  mkdirSync(FRAMES, { recursive: true });
  const first = Math.round(a * fps), last = Math.min(dur * fps - 1, Math.round(b * fps) - 1);
  const todo = []; for (let i = first; i <= last; i++) { const f = `${FRAMES}/f${String(i).padStart(5, '0')}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} frames to render, ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES}/f${String(i).padStart(5, '0')}.jpg`;
      const url = await page.evaluate(t => window.renderAt(t, 'image/jpeg', .93), i / fps);
      writeFileSync(f + '.tmp', Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); renameSync(f + '.tmp', f);
      if (++done % 48 === 0 || done === todo.length) { const el = (Date.now() - start) / 1000; console.log(`${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`); }
    }
  }));
}
await browser.close();
