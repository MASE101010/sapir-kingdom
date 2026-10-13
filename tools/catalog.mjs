// Pictures for the catalogue page: renders every house style (site/app/catalog-shots.js) into site/catalog/k.png.
//   node tools/catalog.mjs   (run again whenever a style is added or changed)
import { chromium } from 'playwright-core';
import { createServer } from 'node:http'; import { readFile, writeFile, mkdir } from 'node:fs/promises'; import { existsSync } from 'node:fs'; import { extname, join, resolve } from 'node:path';
const root = resolve('site'), T = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const s = createServer(async (q, r) => { const p = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = join(root, p.endsWith('/') ? p + 'index.html' : p); if (!existsSync(f)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[extname(f)] ?? 'application/octet-stream' }); r.end(await readFile(f)); }).listen(0);
const exe = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'].find(existsSync);
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 320, height: 320 } }); pg.on('pageerror', e => console.error(e.message));
await pg.goto(`http://localhost:${s.address().port}/?catalog`); await pg.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 120000 });
const shots = await pg.evaluate(() => window.__catalog); await mkdir('site/catalog', { recursive: true });
for (const [k, url] of shots.entries()) await writeFile(`site/catalog/${k}.png`, Buffer.from(url.split(',')[1], 'base64'));
console.log(`${shots.length} pictures in site/catalog/`); await b.close(); s.close();
