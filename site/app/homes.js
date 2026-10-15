// The homes of the kingdom. HOMES[k](p, h) draws one on its plot at the pen's place, front toward +z (the road).
// About 9 across and 9 deep. h is the resident's fingerprint: it picks the colours, so a house never changes.
// A resident who brought friends gets more storeys (floors, from data/kingdom.json "upgraded").
import { pickFrom } from './residents.js';

const WALLS = [0xfbf8f1, 0xf3ead8, 0xe9dcc3, 0xf6efe6, 0xe8e2d6, 0xf1e4cf];
const ROOFS = [0xc0533a, 0xb5443a, 0x2f6fa6, 0x6b8f3a, 0x7a4f9a, 0xd08a2e];
const DOORS = [0x6b4a33, 0x2f6fa6, 0xb5443a, 0x3f7f4a, 0x7a4f9a];
const STONE = 0xc9bea6, WIN = 0x3a5f7a, WOOD = 0x8a6240, LAWN = 0x86c766, PATH = 0xe2d7bf;

function yard(p) { p.box(0, 0, 0, 10, .15, 10, LAWN); p.box(0, 0, 3.6, 1.6, .2, 2.8, PATH); }
function windows(p, y, w, d, n = 2) {
  for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * (w / n); p.box(x, y, d / 2 + .02, 1.1, 1.1, .08, WIN); }
}

/** a cottage with a pitched roof */
function cottage(p, h, floors) {
  const w = 6.4, d = 6, H = 2.9 * floors, wall = WALLS[pickFrom(h, 0, WALLS.length)];
  yard(p); p.box(0, .15, -.5, w, H, d, wall);
  for (let f = 0; f < floors; f++) windows(p, .15 + 1 + f * 2.9, w, d - 1, 2);
  p.gable(0, .15 + H, -.5, w + .6, 2.6, d + .6, ROOFS[pickFrom(h, 1, ROOFS.length)]);
  p.box(0, .15, 2.52, 1.2, 2, .1, DOORS[pickFrom(h, 2, DOORS.length)]);
  p.box(1.8, .15 + H + .6, -1.8, .7, 1.8, .7, STONE);           // chimney
}
/** a white block with a flat roof and a solar boiler, the most Israeli house there is */
function block(p, h, floors) {
  const w = 6.8, d = 6.4, H = 3 * floors + .4;
  yard(p); p.box(0, .15, -.4, w, H, d, WALLS[pickFrom(h, 3, 3)]);
  for (let f = 0; f < floors; f++) { windows(p, .15 + 1.1 + f * 3, w, d - .8, 3); p.box(0, .15 + .3 + f * 3 + 2.6, 2.95, w, .15, .9, 0xffffff); }
  p.box(1.4, .15 + H, -1.6, 1.8, .9, 1.1, 0x2f3a44); p.cyl(1.4, .15 + H + .9, -1.6, .9, .6, 0xdddddd);  // boiler
  p.box(-1.2, .15, 2.85, 1.2, 2, .1, DOORS[pickFrom(h, 2, DOORS.length)]);
}
/** a little stone keep with a pointed roof, for the kingdom */
function turret(p, h, floors) {
  const H = 3.2 * floors + 1.2, roof = ROOFS[pickFrom(h, 1, ROOFS.length)];
  yard(p); p.box(-.8, .15, -.6, 5.2, H - 1, 5.6, WALLS[pickFrom(h, 0, WALLS.length)]);
  p.gable(-.8, .15 + H - 1, -.6, 5.8, 2.2, 6.2, roof);
  p.cyl(2.2, .15, -1.2, 3, H + 1.2, STONE); p.cone(2.2, .15 + H + 1.2, -1.2, 3.8, 3.4, roof);
  p.box(-.8, .15, 2.2, 1.2, 2, .1, DOORS[pickFrom(h, 2, DOORS.length)]);
  windows(p, 1.3, 5.2, 5, 2);
}
/** a wooden house with a balcony */
function cabin(p, h, floors) {
  const w = 6.6, d = 6, H = 2.9 * floors;
  yard(p); p.box(0, .15, -.6, w, H, d, WOOD); p.box(0, .15, -.6, w + .2, .5, d + .2, STONE);
  for (let f = 0; f < floors; f++) windows(p, .15 + 1 + f * 2.9, w, d - 1.2, 2);
  p.gable(0, .15 + H, -.6, w + .8, 2.4, d + .8, [0x3f6f3a, 0x8a3b2c, 0x2f4f6f][pickFrom(h, 4, 3)]); p.box(-2, .15 + H, -2, .8, 2.6, .8, STONE);
  p.box(0, .15 + 1.6, 2.6, w, .2, 1.4, 0x6b4a33); p.box(0, .15, 2.4, 1.2, 2, .1, 0x4a3322);
}
/** rare: a windmill with four sails */
function windmill(p, h) {
  yard(p); p.cyl(0, .15, -.8, 6.4, 9, WALLS[pickFrom(h, 0, WALLS.length)]); p.cone(0, 9.15, -.8, 7.4, 4.4, ROOFS[pickFrom(h, 1, ROOFS.length)]);
  p.box(0, 4.6, 2.6, .5, 8, .2, WOOD); p.box(0, 8.4, 2.6, 8, .5, .2, WOOD);
  p.box(0, 4.6, 2.65, 1.4, 6.6, .1, 0xf3ead8); p.box(0, 8.3, 2.65, 6.6, 1.4, .1, 0xf3ead8);
  p.box(0, .15, 2.4, 1.2, 2.2, .1, DOORS[pickFrom(h, 2, DOORS.length)]);
}
/** rare: a house up in a big tree, with a ladder */
function treehouse(p, h) {
  yard(p); p.cyl(0, .15, -.6, 2, 7, 0x7a5a3a); p.ball(0, 9, -.6, 11, 8, 0x4f9a43); p.ball(-2.6, 7.4, 1, 6, 5, 0x63a94a);
  p.box(0, 6.4, -.6, 6.4, .5, 6.4, WOOD); p.box(0, 6.9, -.6, 5, 3, 4.6, 0xb98a5a); p.gable(0, 9.9, -.6, 5.6, 2, 5.2, ROOFS[pickFrom(h, 1, ROOFS.length)]);
  p.box(1.6, .15, 2.6, .25, 6.6, .25, WOOD); p.box(2.6, .15, 2.6, .25, 6.6, .25, WOOD); for (let y = 1; y < 6.5; y += 1.1) p.box(2.1, y, 2.6, 1.2, .18, .18, WOOD);
}
/** rare: a red and white lighthouse */
function lighthouse(p, h) {
  yard(p); for (let i = 0; i < 5; i++) p.cyl(0, .15 + i * 2.6, -.6, 4.6 - i * .35, 2.6, i % 2 ? 0xc2412d : 0xfbf8f1);
  p.cyl(0, 13.15, -.6, 3.6, 2.2, 0xf2d36b); p.cone(0, 15.35, -.6, 4.4, 2.6, 0xc2412d); p.box(0, .15, 1.65, 1.2, 2, .1, 0x33404d);
}
/** rare: a small palace with two towers and a gold dome */
function palace(p, h) {
  yard(p); const wall = WALLS[pickFrom(h, 0, WALLS.length)];
  p.box(0, .15, -.8, 7, 5.2, 5.6, wall); p.cyl(-3.4, .15, 1.2, 2.2, 7.6, STONE); p.cyl(3.4, .15, 1.2, 2.2, 7.6, STONE);
  p.cone(-3.4, 7.75, 1.2, 2.8, 2.6, 0x2f5fa6); p.cone(3.4, 7.75, 1.2, 2.8, 2.6, 0x2f5fa6);
  p.ball(0, 5.35, -.8, 4.4, 4, 0xe8b323); p.box(0, .15, 2.02, 1.4, 2.4, .1, DOORS[pickFrom(h, 2, DOORS.length)]); windows(p, 1.6, 7, 4.6, 2);
}
// the golden villa: the gold key winner's house. A two-storey modern villa in gold and white, a pool with loungers and
// an umbrella, palm trees, a golden gate, and a little gold crown on the roof
function villa(p, h) {
  const GOLD = 0xe8b323, PALE = 0xf6d365, WHITE = 0xfffaf0, GLASS = 0x7fc3dd, WATER = 0x3fb6e8;
  p.box(0, 0, 0, 10.6, .15, 10.6, 0x8fd16f); p.box(1.6, 0, 3.9, 1.8, .2, 2.8, 0xf3ead8);
  // the pool, its rim, and the water
  p.box(-2.4, .15, 2.2, 4.8, .35, 3.8, WHITE); p.box(-2.4, .2, 2.2, 4.2, .35, 3.2, WATER);
  for (const z of [1.2, 3.2]) { p.box(-5.3 + 1, .15, z, .9, .4, 1.8, WHITE); p.box(-5.3 + 1, .55, z - .7, .9, .4, .4, WHITE); }   // loungers
  p.cyl(-.4, .15, 4.3, .15, 2.6, 0x9aa3ab); p.cone(-.4, 2.75, 4.3, 3, .9, GOLD); p.cone(-.4, 2.7, 4.3, 2.4, .7, WHITE);           // the umbrella
  // the villa: a gold ground floor with big windows, a white upper floor with a balcony, flat roofs with gold trim
  p.box(1.4, .15, -1.8, 6.8, 3.1, 5.4, PALE); p.box(1.4, 3.25, -1.8, 7, .3, 5.6, GOLD);
  p.box(1.4, .5, .92, 5.6, 2.2, .1, GLASS); for (const x of [-.4, 1.4, 3.2]) p.box(x, .5, .98, .15, 2.2, .1, GOLD);
  p.box(.8, 3.55, -2.6, 5, 2.6, 3.8, WHITE); p.box(.8, 6.15, -2.6, 5.2, .3, 4, GOLD);
  p.box(.8, 4, -.68, 4.2, 1.6, .1, GLASS); p.box(.8, 3.55, -.3, 5, .9, .08, 0xbfe4f2); p.box(.8, 4.45, -.3, 5, .12, .12, GOLD);   // the balcony
  p.box(4.4, .15, .95, 1.4, 2.6, .1, 0x7a5a3a); p.box(4.4, 2.75, 1, 1.8, .25, .2, GOLD);                                          // the door
  p.ball(.8, 6.45, -2.6, 1.2, .8, GOLD); for (const dx of [-.45, 0, .45]) p.cone(.8 + dx, 7.05, -2.6, .3, .6, GOLD);                 // a crown on the roof
  // palm trees
  for (const [x, z, s] of [[4.6, 3.6, 1], [-4.4, -3.8, 1.15], [4.5, -4.2, .9]]) {
    p.cyl(x, 0, z, .45 * s, 5.2 * s, 0x9b6b3f);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; p.box(x + Math.cos(a) * 1.1 * s, 5 * s, z + Math.sin(a) * 1.1 * s, 2.4 * s, .25, .8 * s, 0x3f9a4a, -a); }
    p.ball(x, 4.9 * s, z, .9 * s, .7 * s, 0x6b4a2a); }
  // the golden gate
  for (const x of [-5.1, -3.9, 3.0, 5.1]) p.box(x, 0, 5.1, .3, 1.4, .3, GOLD);
  p.box(-4.5, 1.1, 5.1, 1.4, .15, .15, GOLD); p.box(4.05, 1.1, 5.1, 2.2, .15, .15, GOLD);
}
/** the מגורים צבאיים: for residents who joined the kingdom's army (commented "חייל"). A khaki hut with an olive roof,
 *  a flag of the kingdom, sandbags, a little watchtower, and a soldier's helmet on the roof */
function soldier(p, h) {
  const KHAKI = 0xd8c79a, OLIVE = 0x6f7f4a, DOLIVE = 0x56643a, SAND = 0xb9a76f, TEAL = 0x0f6f73, GOLD = 0xe8b323;
  p.box(0, 0, 0, 10.4, .15, 10.4, 0xc9b98b); p.box(0, 0, 3.8, 1.6, .2, 2.8, 0xe2d7bf);
  p.box(-.6, .15, -1.2, 7, 3, 5.6, KHAKI); p.gable(-.6, 3.15, -1.2, 7.6, 2.2, 6.2, OLIVE);
  p.box(-.6, .15, 1.62, 1.3, 2.2, .1, 0x6b4a33); for (const x of [-3, 1.8]) p.box(x, 1.4, 1.62, 1.2, 1, .1, WIN);
  p.box(-.6, 5.1, -1.2, 1.6, .6, 1.6, DOLIVE); p.box(-.6, 5, -1.2, 1.9, .15, 1.9, DOLIVE);                                     // the helmet on the roof
  for (let k = 0; k < 4; k++) for (let r = 0; r < 2 - (k > 2 ? 1 : 0); r++) p.box(-4.2 + k * 1.3, .15 + r * .6, 3.9, 1.2, .6, .9, SAND);   // sandbags
  for (const [dx, dz] of [[3.4, -3.4], [4.6, -3.4], [3.4, -2.2], [4.6, -2.2]]) p.box(dx, .15, dz, .25, 4.2, .25, WOOD);          // a little watchtower
  p.box(4, 4.35, -2.8, 1.8, .2, 1.8, WOOD); p.box(4, 4.55, -2.8, 1.5, 1, 1.5, KHAKI); p.pyramid(4, 5.55, -2.8, 2, .9, OLIVE);
  p.box(3.7, .15, 2.6, .15, 5, .15, 0x9aa3ab); p.box(4.5, 4.2, 2.6, 1.6, 1, .08, 0xffffff); p.box(4.5, 4.95, 2.6, 1.6, .18, .1, TEAL); p.box(4.5, 4.25, 2.6, 1.6, .18, .1, TEAL); p.box(4.5, 4.6, 2.6, .4, .4, .12, GOLD);
}
export const HOMES = [cottage, block, turret, cabin, windmill, treehouse, lighthouse, palace, villa, soldier];
/** a house shared by friends: two or three get a heart on the roof, four or more a block of flats, eleven or more a tower */
export function drawShared(p, r, count) {
  const H = pickFrom(r.h, 3, 3) ? 0xfbf8f1 : 0xf1e4cf;
  if (count >= 11) { const f = Math.min(12, 6 + Math.floor((count - 11) / 6)); yard(p);
    p.box(0, .15, -.4, 7.4, f * 3.1, 7, H); for (let k = 0; k < f; k++) { windows(p, 1.2 + k * 3.1, 7.4, 6.4, 3); p.box(0, .15 + 2.9 + k * 3.1, 3.2, 7.4, .15, 1, 0xffffff); }
    p.box(0, .15 + f * 3.1, -.4, 7.8, .6, 7.4, STONE); p.cone(0, .75 + f * 3.1, -.4, 3, 3, 0xe8b323); return; }
  if (count >= 4) { const f = Math.min(5, 2 + Math.floor((count - 4) / 2)); yard(p);
    p.box(0, .15, -.4, 8, f * 3, 7, H); for (let k = 0; k < f; k++) { windows(p, 1.2 + k * 3, 8, 6.4, 3); p.box(0, .15 + 2.8 + k * 3, 3.2, 8, .15, .9, 0xffffff); }
    p.box(1.6, .15 + f * 3, -1.4, 1.8, .9, 1.1, 0x2f3a44); p.box(-1.6, .15 + f * 3, -1.4, 1.8, .9, 1.1, 0x2f3a44); return; }
  drawHome(p, r, 2); p.ball(0, 9.4, -.5, 1.8, 1.6, 0xd6334a); p.cone(0, 8.6, -.5, 1.8, 1.2, 0xd6334a);     // a heart on the roof
}
export function drawHome(p, r, floors = 1) { const kind = r.home ?? pickFrom(r.h, 5, 4); (HOMES[kind] ?? cottage)(p, r.h, Math.max(1, Math.min(4, floors))); }
