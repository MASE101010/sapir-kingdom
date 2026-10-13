// Michael's own narration: he makes the voice in ElevenLabs himself and sends the mp3. This lines it up with the
// episode's lines, so the camera, the cards and the captions follow it, exactly like reel/voice.mjs does for a voice we make.
// How: ffmpeg finds the pauses; the script is cut into phrases at its punctuation (, . ! ? : ...); the speech between
// pauses is matched to the phrases (merging the shortest pauses, or cutting the longest stretch, until the counts agree);
// inside a phrase every word gets time by its length.
//   node reel/own-voice.mjs --day 1 --mp3 path/to/voice.mp3
// writes site/episodes/dayN.mp3 and site/episodes/dayN.voice.json { own: true, lines, words: [{w, start, end, line, p}] }
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
const arg = k => process.argv[process.argv.indexOf(`--${k}`) + 1];
const day = +arg('day'), mp3 = arg('mp3'), ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8'));
const strip = s => s.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
const duration = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString();

// the speech: everything that is not a pause
const log = spawnSync('ffmpeg', ['-i', mp3, '-af', 'silencedetect=noise=-30dB:d=0.12', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const quiet = []; let open = null;
for (const m of log.matchAll(/silence_(start|end): ([0-9.]+)/g)) { if (m[1] === 'start') open = +m[2]; else if (open !== null) { quiet.push([open, +m[2]]); open = null; } }
if (open !== null) quiet.push([open, duration]);
let speech = []; let t = 0;
for (const [a, b] of quiet) { if (a - t > .08) speech.push([t, a]); t = b; }
if (duration - t > .08) speech.push([t, duration]);

// the phrases of the script
const phrases = [];
ep.lines.forEach((raw, line) => strip(raw).split(/(?<=[,.!?:…]|\.\.\.)\s+/).filter(Boolean).forEach(text => phrases.push({ text, line })));
// match them: a monotonic alignment (dynamic programming) where several phrases may share one stretch of speech (a comma
// said without a pause) or one phrase may span several (a breath inside it). Cost: how far each group's share of the
// time is from its share of the letters, plus a fine for gluing phrases of different lines or splitting at a long pause.
const letters = phrases.map(ph => ph.text.length + 1), totalL = letters.reduce((a, b) => a + b), totalS = speech.reduce((a, [x, y]) => a + y - x, 0);
const P = phrases.length, S = speech.length, best = Array.from({ length: P + 1 }, () => Array(S + 1).fill(null)); best[0][0] = { cost: 0 };
const step = (i, j, a, b) => { const L = letters.slice(i, i + a).reduce((x, y) => x + y) / totalL, T = speech.slice(j, j + b).reduce((x, [u, v]) => x + v - u, 0) / totalS;
  let c = 1000 * (L - T) ** 2; if (a > 1) c += 4 * (phrases[i + a - 1].line - phrases[i].line);
  for (let k = j; k < j + b - 1; k++) c += 8 * (speech[k + 1][0] - speech[k][1]); return c; };
for (let i = 0; i <= P; i++) for (let j = 0; j <= S; j++) { const cur = best[i][j]; if (!cur) continue;
  for (const [a, b] of [[1, 1], [2, 1], [3, 1], [1, 2], [1, 3], [1, 4]]) { if (i + a > P || j + b > S) continue;
    const c = cur.cost + step(i, j, a, b); if (!best[i + a][j + b] || c < best[i + a][j + b].cost) best[i + a][j + b] = { cost: c, from: [i, j, a, b] }; } }
if (!best[P][S]) throw new Error(`cannot match ${P} phrases to ${S} stretches of speech`);
const span = Array(P); for (let i = P, j = S; i || j;) { const [pi, pj, a, b] = best[i][j].from, t0 = speech[pj][0], t1 = speech[pj + b - 1][1];
  // phrases sharing a stretch split it by their letters
  const ls = letters.slice(pi, pi + a), sum = ls.reduce((x, y) => x + y); let c = t0; for (let k = 0; k < a; k++) { const d = (t1 - t0) * ls[k] / sum; span[pi + k] = [c, c + d]; c += d; }
  i = pi; j = pj; }
speech = span;
const words = [], lines = ep.lines.map(() => ({ start: Infinity, end: 0 }));
phrases.forEach((ph, p) => { const [a, b] = speech[p], ws = ph.text.split(' '), letters = ws.reduce((n, w) => n + w.length + 1, 0); let c = a;
  for (const w of ws) { const d = (b - a) * (w.length + 1) / letters; words.push({ w, start: +c.toFixed(3), end: +(c + d).toFixed(3), line: ph.line, p }); c += d; }
  const L = lines[ph.line]; L.start = Math.min(L.start, a); L.end = Math.max(L.end, b); });
lines.forEach((L, i) => { if (!Number.isFinite(L.start)) throw new Error(`line ${i} got no speech`); L.start = +L.start.toFixed(3); L.end = +L.end.toFixed(3); });

copyFileSync(mp3, `site/episodes/day${day}.mp3`);
writeFileSync(`site/episodes/day${day}.voice.json`, JSON.stringify({ own: true, duration, lines, words }));
phrases.forEach((ph, p) => console.log(`${speech[p][0].toFixed(2)}-${speech[p][1].toFixed(2)}  [${ph.line}] ${ph.text}`));
console.log(`site/episodes/day${day}.mp3, ${duration.toFixed(1)} s, ${phrases.length} phrases`);
