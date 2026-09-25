// Inline src/*.js into one self-contained HTML file: mid-autumn.html
import { readFileSync, writeFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url).pathname;
const parts = ['core', 'wc', 'sprites', 'cast', 'props', 'scenes', 'scenes2', 'scenes3', 'audio', 'main'].map(n => `// ===== ${n}.js =====\n` + readFileSync(dir + `src/${n}.js`, 'utf8'));
const html = readFileSync(dir + 'src/shell.html', 'utf8').replace('/*INJECT*/', () => parts.join('\n'));
writeFileSync(dir + 'mid-autumn.html', html);
console.log('built mid-autumn.html', (html.length / 1024).toFixed(0) + ' KB');
