// Test residents for working on the site and the reels locally: site/data/dev/residents.json, opened with ?dev.
// They are named test_0001 and up, never real people, and the folder is not deployed (.gitignore, build-site.sh).
import { writeFileSync, mkdirSync } from 'node:fs';
import { fingerprint } from '../site/app/residents.js';
const n = +(process.argv[2] ?? 3000);
const residents = Array.from({ length: n }, (_, k) => { const u = `test_${String(k + 1).padStart(4, '0')}`; return { u, h: fingerprint(u), plot: k, day: 1 + Math.floor(k / (n / 5)), src: 'test' }; });
mkdirSync(new URL('../site/data/dev/', import.meta.url), { recursive: true });
writeFileSync(new URL('../site/data/dev/residents.json', import.meta.url), JSON.stringify({ residents }));
console.log(`${n} test residents`);
