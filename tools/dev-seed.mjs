// Test residents for working on the site and the reels locally: site/data/dev/residents.json, opened with ?dev.
// They are named test_0001 and up, never real people, and the folder is not deployed (.gitignore).
// Every 40th one brought friends, so shared houses (a heart, a block, a tower) show up too.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fingerprint } from '../site/app/residents.js';
const n = +(process.argv[2] ?? 3000), residents = []; let plot = 0;
for (let k = 0; residents.length < n; k++) {
  const u = `test_${String(residents.length + 1).padStart(4, '0')}`, day = 1 + Math.floor(residents.length / (n / 5));
  residents.push({ u, h: fingerprint(u), plot, day, src: 'test', ...(k % 9 === 4 ? { home: k % 8 } : {}) });
  if (k % 40 === 7) { const friends = [1, 2, 3, 5, 12][k % 5]; for (let f = 0; f < friends && residents.length < n; f++) { const g = `test_${String(residents.length + 1).padStart(4, '0')}`; residents.push({ u: g, h: fingerprint(g), plot, day, src: 'test', host: u }); } }
  plot++;
}
mkdirSync(new URL('../site/data/dev/', import.meta.url), { recursive: true });
writeFileSync(new URL('../site/data/dev/residents.json', import.meta.url), JSON.stringify({ residents }));
console.log(`${n} test residents on ${plot} plots`);
