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
export const HOMES = [cottage, block, turret, cabin, windmill, treehouse, lighthouse, palace];
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
