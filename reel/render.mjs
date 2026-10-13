// Renders a day's reel: opens the site at ?reel=N in headless Chromium, poses every frame with window.__reel.seek(t),
// screenshots it and pipes the frames to ffmpeg, then lays the narration (episodes/dayN.mp3) under it.
//   node reel/render.mjs --day 3 [--fps 30] [--from 0] [--to 60] [--frames 0,5,12.5 (stills only)] [--out site/reels/day3.mp4] [--scale 1]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const day = +arg('day', 1), fps = +arg('fps', 30), scale = +arg('scale', 1), root = resolve('site');
const out = arg('out', `site/reels/day${day}.mp4`), stills = arg('frames', null), dev = process.argv.includes('--dev');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

// a tiny static server for the site folder
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join(root, path.endsWith('/') ? path + 'index.html' : path);
  if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file));
}).listen(0);
const port = server.address().port;

const exe = process.env.CHROMIUM ?? ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
const browser = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
page.on('console', m => { if (m.type() === 'error') console.error('page:', m.text()); });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(`http://localhost:${port}/?reel=${day}${dev ? '&dev' : ''}`);
await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 180000 });
const info = await page.evaluate(() => ({ duration: window.__reel.duration, audio: window.__reel.audio }));
console.log(`day ${day}: ${info.duration.toFixed(1)} s, audio ${info.audio ?? 'none (preview)'}`);
await mkdir('site/reels', { recursive: true }); await mkdir('out', { recursive: true });

if (stills) {                                   // a few stills to look at, no video
  for (const t of stills.split(',').map(Number)) {
    const url = await page.evaluate(t => window.__reel.frame(t, .85), t);
    await writeFile(`out/day${day}-${t}.jpg`, Buffer.from(url.split(',')[1], 'base64')); console.log(`out/day${day}-${t}.jpg`);
  }
} else {
  const from = +arg('from', 0), to = Math.min(+arg('to', info.duration), info.duration), n = Math.ceil((to - from) * fps);
  const audio = info.audio && existsSync(join(root, info.audio)) ? join(root, info.audio) : null;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    ...(audio ? ['-ss', String(from), '-i', audio] : []),
    '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-maxrate', '3.8M', '-bufsize', '7.6M', '-pix_fmt', 'yuv420p', '-r', String(fps),
    ...(audio ? ['-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const url = await page.evaluate(t => window.__reel.frame(t), from + i / fps), jpg = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}/${(n / fps).toFixed(0)} s  (${((Date.now() - t0) / 1000).toFixed(0)} s elapsed)`);
  }
  ff.stdin.end(); await new Promise((ok, no) => ff.on('close', c => c ? no(new Error(`ffmpeg ${c}`)) : ok()));
  console.log(`\n${out}`);
}
await browser.close(); server.close();
