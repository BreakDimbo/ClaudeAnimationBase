// Review tool: each reference photo beside its drawn look, in the same pose. Not part of the film.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const ROOT = new URL('..', import.meta.url).pathname, REF = process.argv[2], OUT = ROOT + (process.argv[3] || 'contact/characters');
mkdirSync(OUT, { recursive: true });
const refFile = n => readFileSync(`${REF}/${n}`).toString('base64');
const files = { '01': 'img01', '02': 'img02', '03': 'img03', '04': 'img04', '05': 'img05', '06': 'img06', '07': 'img07', '08': 'img08', '09': 'img10', '10': 'img11', '11': 'img12', '12': 'img13', '13': 'img14', '14': 'img15', '15': 'img16', '16': 'img18' };
import { readdirSync } from 'node:fs';
const all = readdirSync(REF);
const refs = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, 'data:image/png;base64,' + refFile(all.find(f => f.startsWith(v)))]));
// each look in the pose of its photo
const poses = {
  '01': { handL: [-16.5, -82], handR: [16.5, -82], gestL: 'v', gestR: 'v', bendL: -1, bendR: 1 },
  '02': { handL: [-15.5, -76], handR: [15.5, -78], gestL: 'v', gestR: 'v', bendL: -1, bendR: 1 },
  '03': { handL: [-15.5, -86], gestL: 'v', bendL: -1, handR: [12, -47], gestR: 'pocket' },
  '04': { handL: [-2, -50], handR: [2, -49] },
  '05': { handL: [-11.5, -47], handR: [11.5, -47], gestL: 'pocket', gestR: 'pocket' },
  '06': { handL: [-4, -54], holdL: 'phone', handR: [11, -50] },
  '07': { sit: 1, handL: [-2, -27], handR: [2, -26.5] },
  '08': { sit: 1, handL: [3, -26], handR: [6, -25.5] },
  '09': { sit: 1, handL: [-11, -23], handR: [11, -23], feetSpread: 5 },
  '10': { sit: 1, handL: [-2, -20], handR: [2, -20], feetSpread: 4 },
  '11': { sit: 1, handL: [-2, -27], handR: [2, -26.5] },
  '12': { sit: 1, handL: [-10.5, -23], handR: [10.5, -23], feetSpread: 4 },
  '13': { sit: 1, handL: [2, -26], handR: [5, -25.5] },
  '14': { sit: 1, handL: [-1, -27], handR: [2, -26.5] },
  '15': { handL: [-11.5, -48], handR: [11.5, -48], gestL: 'pocket', gestR: 'pocket' },
  '16': { handL: [-2, -49], handR: [2, -48] },
};
// where each head sits in its photo: [x, y, width] as fractions of the image width/height
const HEADBOX = { '01': [.38, .0, .24], '02': [.38, .0, .24], '03': [.4, .0, .24], '04': [.44, .0, .24], '05': [.38, .0, .24], '06': [.34, .0, .26], '07': [.36, .0, .26], '08': [.36, .02, .26], '09': [.36, .0, .26], '10': [.38, .02, .26], '11': [.36, .0, .28], '12': [.38, .01, .26], '13': [.38, .02, .26], '14': [.36, .0, .26], '15': [.4, .0, .22], '16': [.4, .01, .24] };
const b = await chromium.launch({ args: ['--no-sandbox'] });
const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('[page error]', e.message));
await page.goto(pathToFileURL(ROOT + 'mid-autumn.html').href + '?render');
await page.waitForFunction('window.ready === true');
const ids = Object.keys(poses).sort(), groups = [ids.slice(0, 6), ids.slice(6, 12), ids.slice(12)];
for (let gi = 0; gi < groups.length; gi++) {
  const url = await page.evaluate(async ([ids, refs, poses]) => {
    const PW = 700, PH = 620, cols = 3, rows = Math.ceil(ids.length / cols);
    const Sh = document.createElement('canvas'); Sh.width = cols * PW; Sh.height = rows * PH; const g = Sh.getContext('2d');
    g.fillStyle = '#1d2138'; g.fillRect(0, 0, Sh.width, Sh.height);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i], px = (i % cols) * PW, py = Math.floor(i / cols) * PH, pose = { ...poses[id] };
      // ours
      BF = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); paperUnder(); LIGHT = null;
      const k = pose.sit ? 11.5 : 9.4, y = pose.sit ? 1000 : 1050;
      if (pose.sit) chair(960, y, 31 * k, '#C9A56E', { back: '#EFE3C8', seat: '#EFE3C8', key: 'cmp' });
      if (pose.holdL === 'phone') pose.holdL = (kk, LW) => { ctx.save(); ctx.rotate(-.3); ctx.scale(1 / kk * 1.2, 1 / kk * 1.2); phone(60, 0, { key: 'cmp' }); ctx.restore(); };
      person(LOOKS[id], { x: 960, y, k, t: .5, ...pose });
      grainOver();
      g.fillStyle = '#EDE6D6'; g.fillRect(px + 6, py + 34, PW - 12, PH - 40);
      const im = new Image(); im.src = refs[id]; await im.decode();
      const sx = im.width * .12, sw = im.width * .76, sh = im.height, s = (PH - 44) / sh;
      g.drawImage(im, sx, 0, sw, sh, px + 10, py + 38, sw * s, sh * s);
      const ch = pose.sit ? 1010 : 1040, cw = ch * (sw / sh) * 1.02, cy = pose.sit ? 20 : 30;
      g.drawImage(cv, 960 - cw / 2, cy, cw, ch, px + PW / 2 + 4, py + 38, (PW / 2 - 14), (PH - 44));
      g.fillStyle = '#efe6d2'; g.font = 'bold 22px sans-serif'; g.fillText(id + '  参考照片 / 画像', px + 10, py + 26);
    }
    return Sh.toDataURL('image/jpeg', .9);
  }, [groups[gi], refs, poses]);
  const f = `${OUT}/人物对照_${gi + 1}.jpg`; writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); console.log(f);
}
// head close-ups: photo crop beside the drawn head
if (process.argv[4] !== 'nohead') {
  const url = await page.evaluate(async ([ids, refs, poses, box]) => {
    const PW = 420, PH = 260, cols = 4, rows = Math.ceil(ids.length / cols);
    const Sh = document.createElement('canvas'); Sh.width = cols * PW; Sh.height = rows * PH; const g = Sh.getContext('2d');
    g.fillStyle = '#1d2138'; g.fillRect(0, 0, Sh.width, Sh.height);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i], px = (i % cols) * PW, py = Math.floor(i / cols) * PH, pose = { ...poses[id] };
      BF = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); paperUnder(); LIGHT = null;
      const k = 22, sk = skeleton(LOOKS[id], pose), y = 540 - sk.headY * k;
      if (pose.holdL === 'phone') delete pose.holdL;
      person(LOOKS[id], { x: 960, y, k, t: .5, ...pose, handL: undefined, handR: undefined, gestL: undefined, gestR: undefined });
      grainOver();
      g.fillStyle = '#EDE6D6'; g.fillRect(px + 4, py + 26, PW - 8, PH - 30);
      const im = new Image(); im.src = refs[id]; await im.decode();
      const [bx, by, bw] = box[id]; const bh = bw * (PH - 30) / (PW / 2 - 6);
      g.drawImage(im, bx * im.width, by * im.height, bw * im.width, bh * im.width, px + 4, py + 26, PW / 2 - 6, PH - 30);
      const cw = 560, ch = cw * (PH - 30) / (PW / 2 - 6);
      g.drawImage(cv, 960 - cw / 2, 540 - ch * .42, cw, ch, px + PW / 2 + 2, py + 26, PW / 2 - 6, PH - 30);
      g.fillStyle = '#efe6d2'; g.font = 'bold 18px sans-serif'; g.fillText(id, px + 6, py + 20);
    }
    return Sh.toDataURL('image/jpeg', .92);
  }, [ids, refs, poses, HEADBOX]);
  writeFileSync(`${OUT}/头像对照.jpg`, Buffer.from(url.split(',')[1], 'base64')); console.log(`${OUT}/头像对照.jpg`);
}
await b.close();
