// Pack sprites/*.png into src/sprites.js as WebP data URIs (the HTML stays one self-contained file).
// Main views are scaled to ≤1000px tall; the rest keep their size.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
const files = readdirSync(ROOT + 'sprites').filter(f => f.endsWith('.png')).sort();
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage();
const out = {};
for (const f of files) {
  const src = 'data:image/png;base64,' + readFileSync(ROOT + 'sprites/' + f).toString('base64');
  out[f.replace('.png', '')] = await p.evaluate(async ([src, maxH]) => {
    const im = new Image(); im.src = src; await im.decode();
    const s = Math.min(1, maxH / im.height), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', .9);
  }, [src, f.includes('_main') ? 1000 : 2000]);
}
await b.close();
const js = '// sprites cut from the character cards (tools/extract.py), WebP\nconst SPRITES = ' + JSON.stringify(out) + ';\n';
writeFileSync(ROOT + 'src/sprites.js', js);
console.log(Object.keys(out).length, 'sprites', (js.length / 1048576).toFixed(1) + ' MB');
