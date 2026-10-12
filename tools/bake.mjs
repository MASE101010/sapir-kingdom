// Lays out the kingdom once and freezes it in site/data/plan.json.
// Plot k is plot k for good: never re-sort or remove, only append (bump RINGS and re-run with --append).
// The castle stands on a hill at (0,0). Ring roads circle it, radial roads run out from the gates,
// a river crosses the south of the land. Houses sit on both sides of every ring road, facing it.
// Lots for future landmarks (the daily winning comment) are kept free between the rings.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const OUT = new URL('../site/data/plan.json', import.meta.url);
const RINGS = 30, R0 = 90, STEP = 70, ROAD = 4, SETBACK = 11, SPACING = 11.5;
const RIVER = { z0: 420, amp: 150, wave: 280, half: 16 };
export const riverZ = x => RIVER.z0 + RIVER.amp * Math.sin(x / RIVER.wave);

const ringR = k => R0 + STEP * k;
// radial roads: 8 from the castle gates, 16 from ring 6, 32 from ring 14
const radials = [];
for (let i = 0; i < 8; i++) radials.push({ a: i * Math.PI / 4, from: 0 });
for (let i = 0; i < 8; i++) radials.push({ a: Math.PI / 8 + i * Math.PI / 4, from: 6 });
for (let i = 0; i < 16; i++) radials.push({ a: Math.PI / 16 + i * Math.PI / 8, from: 14 });

// landmark lots: between ring k and k+1, halfway between two radials, every other gap
const lots = [];
for (const k of [0, 1, 2, 3, 5, 7]) {
  const n = k < 6 ? 8 : 16, off = k < 6 ? Math.PI / 8 : Math.PI / 16, mid = (ringR(k) + ringR(k + 1)) / 2;
  for (let i = 0; i < n; i += (k % 2 ? 2 : 1)) {
    const a = off + i * 2 * Math.PI / n + (k % 2 ? Math.PI / n : 0);
    const x = Math.cos(a) * mid, z = Math.sin(a) * mid;
    if (Math.abs(z - riverZ(x)) < 60) continue;
    lots.push({ id: lots.length, x: +x.toFixed(1), z: +z.toFixed(1), rot: +Math.atan2(-Math.cos(a), -Math.sin(a)).toFixed(4), r: k < 2 ? 26 : 30, ring: k });
  }
}

const angDist = (a, b) => { const d = Math.abs(a - b) % (2 * Math.PI); return Math.min(d, 2 * Math.PI - d); };
const plots = [];
for (let k = 0; k < RINGS; k++) {
  for (const side of k === 0 ? [1] : [-1, 1]) {
    const r = ringR(k) + side * SETBACK, n = Math.floor(2 * Math.PI * r / SPACING);
    const live = radials.filter(d => d.from <= k);
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + i * 2 * Math.PI / n;                       // start at the south gate, go round
      if (live.some(d => angDist(d.a, a) * r < 9)) continue;            // keep the radial crossing clear
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(z - riverZ(x)) < RIVER.half + 9) continue;           // not in the river
      if (lots.some(l => Math.hypot(l.x - x, l.z - z) < l.r + 8)) continue; // not on a landmark lot
      const dx = side > 0 ? -Math.cos(a) : Math.cos(a), dz = side > 0 ? -Math.sin(a) : Math.sin(a);
      plots.push([+x.toFixed(1), +z.toFixed(1), +Math.atan2(dx, dz).toFixed(3), k]);      // rot turns the front (+z) to the road
    }
  }
}

if (process.argv.includes('--append') && existsSync(OUT)) {
  const old = JSON.parse(readFileSync(OUT, 'utf8')).plots;
  const key = p => `${p[0]},${p[1]}`, seen = new Set(old.map(key));
  const fresh = plots.filter(p => !seen.has(key(p)));
  plots.length = 0; plots.push(...old, ...fresh);
}

const plan = {
  note: 'Frozen layout. Plot k is plot k for good: never re-sort or remove, only append (tools/bake.mjs --append).',
  baked: new Date().toISOString().slice(0, 10),
  rings: { count: RINGS, r0: R0, step: STEP, road: ROAD },
  radials: radials.map(d => ({ a: +d.a.toFixed(5), from: d.from })),
  river: RIVER,
  wall: ringR(RINGS) + 40,
  lots,
  plots,
};
writeFileSync(OUT, JSON.stringify(plan));
console.log(`plots ${plots.length}, lots ${lots.length}, ${(JSON.stringify(plan).length / 1024).toFixed(0)} KB`);
