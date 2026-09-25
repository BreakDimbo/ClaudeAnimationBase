// Render a test view (?view=<name>) to MP4: every 1/24 s, piped straight into ffmpeg. No audio.
//   node tools/viewclip.mjs <view> <seconds> <out.mp4>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn, execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const [view, secs, out] = process.argv.slice(2);
const ROOT = new URL('..', import.meta.url).pathname, fps = 24;
const FFMPEG = execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('[page error]', e.message));
await p.goto(pathToFileURL(ROOT + 'mid-autumn.html').href + '?render&view=' + view);
await p.waitForFunction('window.ready === true');
const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.round(+secs * fps), t0 = Date.now();
for (let i = 0; i < n; i++) {
  const url = await p.evaluate(t => window.renderAt(t, 'image/jpeg', .93), i / fps);
  const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
console.log(`wrote ${out}  ${n} frames  ${((Date.now() - t0) / n).toFixed(0)} ms/frame`);
await b.close();
