// Checks the kingdom before anything is pushed: every landmark draws, kingdom.json agrees with the plan and the landmark
// list, every episode refers to lines, residents and landmarks that exist, and the residents list was only appended to.
//   node tools/check.mjs [--day N]
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { LANDMARKS } from '../site/app/landmarks/index.js';
const fail = [], read = f => JSON.parse(readFileSync(f, 'utf8'));
const plan = read('site/data/plan.json'), kingdom = read('site/data/kingdom.json'), residents = read('site/data/residents.json').residents;
const mock = { n: 0 }; for (const k of ['at', 'add', 'box', 'gable', 'cyl', 'cone', 'pyramid', 'ball', 'tree', 'mark']) mock[k] = function () { this.n++; return this; };
for (const [key, l] of Object.entries(LANDMARKS)) { mock.n = 0; try { l.draw(mock); } catch (e) { fail.push(`landmark ${key}: ${e.message}`); }
  if (mock.n < 10) fail.push(`landmark ${key} draws only ${mock.n} shapes`); if (!l.name) fail.push(`landmark ${key} has no name`); }
const lots = new Set();
for (const l of kingdom.landmarks) { if (!LANDMARKS[l.key]) fail.push(`kingdom.json: unknown landmark ${l.key}`);
  if (l.key !== 'castle') { if (!plan.lots[l.lot]) fail.push(`kingdom.json: ${l.key} on missing lot ${l.lot}`); if (lots.has(l.lot)) fail.push(`kingdom.json: lot ${l.lot} used twice`); lots.add(l.lot); } }
residents.forEach((r, k) => { if (!plan.plots[r.plot]) fail.push(`resident ${r.u}: no plot ${r.plot}`); if (r.host && !residents.some(x => x.u === r.host && x.plot === r.plot)) /* the host may be listed after the guest */ fail.push(`resident ${r.u}: host ${r.host} not on plot ${r.plot}`); });
try { const before = JSON.parse(execSync('git show HEAD:site/data/residents.json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString()).residents;
  before.forEach((r, k) => { if (residents[k]?.u !== r.u) fail.push(`resident ${k + 1} changed or removed: ${r.u}`); }); } catch { }
const TYPES = new Set(['title', 'counter', 'comment', 'idcard', 'label', 'cta']);
const days = process.argv.includes('--day') ? [+process.argv[process.argv.indexOf('--day') + 1]] : Array.from({ length: kingdom.day }, (_, i) => i + 1);
for (const d of days) { const f = `site/episodes/day${d}.json`; if (!existsSync(f)) continue; const ep = read(f), n = ep.lines?.length ?? 0;
  if (!n) fail.push(`${f}: no lines`); if (!ep.caption && d > 1) fail.push(`${f}: no caption`);
  for (const s of ep.shots ?? []) { if (s.line >= n) fail.push(`${f}: shot on line ${s.line}`); if (typeof s.target === 'string' && s.target.startsWith('landmark:') && !LANDMARKS[s.target.slice(9)]) fail.push(`${f}: shot at unknown ${s.target}`);
    if (typeof s.target === 'string' && s.target.startsWith('house:') && !residents.some(r => r.u === s.target.slice(6)) && !(ep.demo ?? []).some(d => d.u === s.target.slice(6))) fail.push(`${f}: shot at ${s.target}, not a resident`); }
  for (const c of ep.cards ?? []) { if (!TYPES.has(c.type)) fail.push(`${f}: card type ${c.type}`); if (c.line >= n) fail.push(`${f}: card on line ${c.line}`); }
  for (const r of [ep.rise].flat().filter(Boolean)) if (!LANDMARKS[r.key]) fail.push(`${f}: rise of unknown ${r.key}`);
  if (JSON.stringify(ep).includes('—')) fail.push(`${f}: has an em dash`); }
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log(`ok: ${Object.keys(LANDMARKS).length} landmarks, ${residents.length} residents, day ${kingdom.day}`);
