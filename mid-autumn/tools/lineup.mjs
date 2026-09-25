// Review tool: sprites of one view for every card, on a dark wash (to expose halos) and on paper.
//   node tools/lineup.mjs <view> <out.jpg>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
const [view, out] = process.argv.slice(2);
const cards = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'];
const srcs = cards.map(c => { const f = `${ROOT}sprites/${c}_${view}.png`; return existsSync(f) ? 'data:image/png;base64,' + readFileSync(f).toString('base64') : null; });
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage();
const url = await p.evaluate(async srcs => {
  const cw = 250, ch = 420, S = document.createElement('canvas'); S.width = cw * 8; S.height = ch * 2 + 10; const g = S.getContext('2d');
  for (let i = 0; i < srcs.length; i++) {
    const x = (i % 8) * cw, y = Math.floor(i / 8) * (ch + 10);
    const gr = g.createLinearGradient(0, y, 0, y + ch); gr.addColorStop(0, i % 2 ? '#2B3563' : '#E9DFC9'); gr.addColorStop(1, i % 2 ? '#3E4A7A' : '#D8CBB0');
    g.fillStyle = gr; g.fillRect(x, y, cw, ch);
    if (!srcs[i]) continue;
    const im = new Image(); im.src = srcs[i]; await im.decode();
    const s = Math.min((cw - 16) / im.width, (ch - 30) / im.height);
    g.drawImage(im, x + (cw - im.width * s) / 2, y + ch - 8 - im.height * s, im.width * s, im.height * s);
    g.fillStyle = i % 2 ? '#fff' : '#222'; g.font = 'bold 20px sans-serif'; g.fillText(String(i + 1).padStart(2, '0'), x + 6, y + 22);
  }
  return S.toDataURL('image/jpeg', .9);
}, srcs);
writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close();
