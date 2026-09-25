// Review tool only: crops of the reference photos (head close-ups) into one sheet.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2], out = process.argv[3], mode = process.argv[4] || 'heads';
const files = readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const imgs = files.map(f => 'data:image/png;base64,' + readFileSync(dir + '/' + f).toString('base64'));
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage();
const url = await p.evaluate(async ([imgs, mode]) => {
  const cols = 6, cw = 360, ch = 300, S = document.createElement('canvas'); S.width = cols * cw; S.height = Math.ceil(imgs.length / cols) * ch;
  const g = S.getContext('2d'); g.fillStyle = '#EDE6D6'; g.fillRect(0, 0, S.width, S.height);
  for (let i = 0; i < imgs.length; i++) {
    const im = new Image(); im.src = imgs[i]; await im.decode();
    const sw = im.width * .5, sh = sw * ch / cw, sx = (im.width - sw) / 2, sy = 0;
    g.drawImage(im, sx, sy, sw, sh, (i % cols) * cw, Math.floor(i / cols) * ch, cw, ch);
    g.fillStyle = '#000'; g.font = 'bold 22px sans-serif'; g.fillText(String(i + 1).padStart(2, '0'), (i % cols) * cw + 6, Math.floor(i / cols) * ch + 26);
  }
  return S.toDataURL('image/jpeg', .9);
}, [imgs, mode]);
writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close(); console.log(out);
