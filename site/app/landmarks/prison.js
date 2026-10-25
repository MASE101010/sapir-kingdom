// כלא הדרקונים: day 10 (@mpt9399 asked for "כלא לדרקונים"). The army and the pilots caught the dragon on the Burj with a net
// and brought it here. A long cage of gold bars on a stone floor, big enough for a dragon (its tail along the cage), a
// stone wall round the yard with four watchtowers and their searchlights, a gate toward the castle with the sign, soldiers on
// guard, a guardhouse, a big padlock, a clock "until 1000 followers", a pile of dragon-sized bones (chicken drumsticks).
// Lot radius 26, front toward +z. Family friendly: nobody is hurt, the dragon only sulks.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const IRON = 0x2f3640, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xfbf3e2, STONE = 0xcfc6b4, STONE2 = 0xb9ae98, RED = 0xc8102e,
  GRASS = 0x86c766, SAND = 0xe6d5ae, DARK = 0x3a3f45, SKIN = 0xe2b48f, OLIVE = 0x5b6b3a, OLIVE2 = 0x48562d, WOOD = 0x8a6240, METAL = 0xb9c1c8;
export const CAGE = { x: 0, z: -5, L: 40, D: 20, H: 24 };   // the cage's centre, length (x), depth (z), height

function soldier(p, x, z, rot) {
  p.at(x, z, rot); p.box(-.3, 0, 0, .45, 1.4, .5, OLIVE2); p.box(.3, 0, 0, .45, 1.4, .5, OLIVE2); p.box(0, 1.4, 0, 1.2, 1.4, .8, OLIVE);
  p.box(0, 2.8, 0, .9, .9, .9, SKIN); p.box(0, 3.55, 0, 1.05, .45, 1.05, OLIVE2); p.box(0, 3.5, .5, 1, .12, .3, OLIVE2);
  p.box(-.8, 1.6, 0, .3, 1.2, .3, OLIVE); p.box(.8, 1.6, 0, .3, 1.2, .3, OLIVE); p.at(0, 0, 0);
}
function tower(p, x, z) {
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) p.box(x + dx, 0, z + dz, .6, 12, .6, STONE2);
  p.box(x, 0, z, 3.2, 12, 3.2, STONE); for (let k = 1; k < 4; k++) p.box(x, k * 3, z, 4.6, .3, 4.6, STONE2);
  p.box(x, 12, z, 6, .6, 6, STONE2); for (const [dx, dz, w, d] of [[0, -2.8, 6, .4], [0, 2.8, 6, .4], [-2.8, 0, .4, 6], [2.8, 0, .4, 6]]) p.box(x + dx, 12.6, z + dz, w, 1.2, d, STONE);
  for (const [dx, dz] of [[-2.8, -2.8], [2.8, -2.8], [-2.8, 2.8], [2.8, 2.8]]) p.box(x + dx, 12.6, z + dz, .4, 3.6, .4, WOOD);
  p.pyramid(x, 16.2, z, 7, 3.2, RED, Math.PI / 4); p.box(x, 19.4, z, .15, 2.4, .15, METAL); p.box(x + .6, 20.8, z, 1.2, .8, .05, GOLD);
  // the searchlight on the rail, pointed in at the cage
  p.cyl(x, 13.8, z, 1.1, 1, DARK); p.ball(x, 14.3, z, 1.2, 1.2, 0xfff3b0);
  soldier(p, x + 1.4, z + 1.4, Math.atan2(-x, -z)); p.at(0, 0, 0);
}
export function drawPrison(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 52, .08, 52, GRASS); p.box(0, .08, 0, 46, .1, 46, SAND);
  // the wall round the yard, with stripes of gold at the top, and the gate toward the castle
  for (const [x, z, w, d] of [[0, -22, 44, 1.6], [-22, 0, 1.6, 44], [22, 0, 1.6, 44], [-13.5, 22, 17, 1.6], [13.5, 22, 17, 1.6]]) {
    p.box(x, .1, z, w, 5.4, d, STONE); p.box(x, 5.5, z, w + .3, .5, d + .3, GOLD);
    const n = Math.round(Math.max(w, d) / 2.2); for (let k = 0; k < n; k++) { const t = -1 + (2 * k + 1) / n; p.box(x + (w > d ? t * w / 2 : 0), 6, z + (w > d ? 0 : t * d / 2), w > d ? 1 : 1.9, 1, w > d ? 1.9 : 1, STONE2); }
  }
  for (const x of [-5, 5]) { p.box(x, 0, 22, 2.4, 9.6, 2.4, STONE2); p.cone(x, 9.6, 22, 2.2, 2, GOLD); }
  for (let k = 0; k < 9; k++) p.box(-4 + k, .1, 22, .25, 7.6, .25, DARK); p.box(0, 7.4, 22, 8.4, .5, .5, DARK);
  p.box(0, .1, 26, 10, .1, 6, 0x5d6166);
  for (const [x, z] of [[-21, -21], [21, -21], [-21, 21], [21, 21]]) tower(p, x, z);
  // the cage: a stone floor, gold bars all round and across the top, navy beams, a big door with a padlock at the front
  const { x: cx, z: cz, L, D, H } = CAGE;
  p.box(cx, .1, cz, L + 2, 1.2, D + 2, STONE2); p.box(cx, 1.3, cz, L, .2, D, 0xd9cfb9);
  for (let x = -L / 2; x <= L / 2 + .01; x += 2) for (const z of [-D / 2, D / 2]) if (!(z > 0 && Math.abs(x) < 3.5)) p.box(cx + x, 1.3, cz + z, .45, H, .45, IRON);
  for (let z = -D / 2 + 2; z < D / 2; z += 2) for (const x of [-L / 2, L / 2]) p.box(cx + x, 1.3, cz + z, .45, H, .45, IRON);
  for (const [y, c] of [[1.5, GOLD], [10, NAVY], [H + 1, GOLD]]) { p.box(cx, y, cz - D / 2, L + .8, .8, .8, c); p.box(cx, y, cz + D / 2, L + .8, .8, .8, c); p.box(cx - L / 2, y, cz, .8, .8, D + .8, c); p.box(cx + L / 2, y, cz, .8, .8, D + .8, c); }
  for (let x = -L / 2 + 8; x < L / 2; x += 8) p.box(cx + x, H + 1.2, cz, .6, .6, D, IRON);
  for (const x of [-L / 2, L / 2]) for (const z of [-D / 2, D / 2]) p.ball(cx + x, H + 1.6, cz + z, 1.6, 1.6, GOLD);
  // the door is in prisonLive (it can swing open: day 12, the dragon broke out); here only the frame's posts
  for (const x of [-3.9, 3.9]) p.box(cx + x, 1.3, cz + D / 2, .9, 14.6, .9, NAVY);
  // a bowl of water and a pile of giant drumsticks for the prisoner, a hay bed
  p.cyl(cx + 15, 1.5, cz + 5, 3, 1, METAL); p.cyl(cx + 15, 1.6, cz + 5, 2.6, .95, 0x58b0d4);
  for (let k = 0; k < 5; k++) { p.box(cx - 15 + k * .8, 1.5 + (k % 2) * .9, cz + 5 - k * .4, 3.4, .8, .8, 0xf3e7cf, k * .5); p.ball(cx - 13.3 + k * .8, 1.5 + (k % 2) * .9, cz + 5 - k * .4, 1.6, 1.4, 0xb8743a); }
  p.box(cx, 1.5, cz - 2, 22, .8, 12, 0xe8c66a);
  // the guardhouse by the gate, with its flag, and soldiers on guard in a row
  p.box(14, .1, 15, 7, 5, 5, CREAM); p.box(14, 5, 15, 7.6, .4, 5.6, TEAL); p.box(14, 1.4, 17.6, 2.4, 2, .1, 0x8fc3d8); p.box(11.8, .1, 17.55, 1.2, 3.2, .1, WOOD);
  p.box(17.5, 5, 17, .2, 6, .2, METAL); p.box(18.4, 9.6, 17, 1.8, 1.2, .08, NAVY); p.box(18.4, 9.6, 17.05, 1.8, .4, .08, GOLD);
  for (let k = 0; k < 6; k++) soldier(p, -12 + k * 2.4, 12.5, 0);
  for (const [x, z, r] of [[-8, 20, Math.PI], [8, 20, Math.PI], [-17, 0, Math.PI / 2], [17, -6, -Math.PI / 2], [6, 15, -.3]]) soldier(p, x, z, r);
  // barrels, crates, a spare net rolled up, a few trees outside the wall
  for (const [x, z] of [[-18, 14], [-16.5, 15.5], [-18, 17]]) p.cyl(x, .1, z, 1.4, 2, WOOD);
  for (const [x, z] of [[18, 3], [18, 5.2]]) p.box(x, .1, z, 2, 2, 2, 0xc9a26b);
  p.cyl(-15, .1, 18, 2.6, 1.6, GOLD); p.cyl(-15, 1.7, 18, 2, .8, 0xd4a017);
  for (const [x, z] of [[-25, 25], [25, 25], [-25, -10], [25, -10]]) p.tree(x, z, 1.1);
}
export function prisonLive(group) {
  group.add(sign('כלא הדרקונים 🐉', { w: 13, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 10.8, 23.4));
  group.add(sign('רעיון של @mpt9399 · אדריכל', { w: 8, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 8.5, 23.4));
  group.add(sign('אסור להאכיל את הדרקון!', { w: 7, h: 1.3, bg: '#fffaf0', fg: '#c8102e', border: '#c8102e' }).at(-11, 3.4, 5.7 + .05));
  group.add(sign('משתחרר ב-1000 עוקבים ⏳', { w: 7.6, h: 1.4, bg: '#c8102e', fg: '#ffffff', border: '#ffffff' }).at(11, 3.4, 5.7 + .05));
  // the door: thicker bars in a navy frame on a hinge at its left, and the giant padlock and chain on it. open(k): day 12, the
  // dragon broke out; the padlock drops, the door swings wide (kingdom.json states.prison.open keeps it open)
  const { x: cx, z: cz, D } = CAGE, hinge = new THREE.Group(), lock = new THREE.Group(); hinge.position.set(cx - 3.45, 0, cz + D / 2);
  const d = new Pen(); d.box(3.45, 1.3, 0, 6.9, .9, .9, NAVY); d.box(3.45, 14.1, 0, 6.9, .9, .9, NAVY);
  for (let x = -3; x <= 3; x += 1.2) d.box(3.45 + x, 1.3, .2, .55, 13.8, .55, IRON);
  hinge.add(d.build(new THREE.Group())); group.add(hinge);
  const l = new Pen(); l.box(0, -1.2, 0, 2.6, 2.4, .8, GOLD); l.cyl(0, .2, 0, 1.6, .6, METAL); l.ball(0, -.7, .45, .5, .5, NAVY);
  for (let k = 0; k < 6; k++) l.box(-3 + k * 1.2, -.3 + (k % 2) * .25, -.2, 1, .3, .3, METAL);
  lock.add(l.build(new THREE.Group())); lock.position.set(cx, 7.7, cz + D / 2 + .9); group.add(lock);
  group.userData.open = k => { k = Math.max(0, Math.min(1, k)); const a = Math.min(1, k * 2.2), b = Math.max(0, (k - .25) / .75);
    lock.position.set(cx + a * 1.5, 7.7 - (6.1 * a * a), cz + D / 2 + .9 + a * 1.5); lock.rotation.set(a * 1.4, 0, a * .9);
    hinge.rotation.y = -(b * b * (3 - 2 * b)) * 1.9; };
  group.add(sign('שמירה', { w: 3.6, h: 1, bg: '#0f6f73', fg: '#ffffff', border: '#ffffff' }).at(14, 3.8, 17.55));
}
export const PRISON = { key: 'prison', name: 'כלא הדרקונים', draw: drawPrison, live: prisonLive, top: 22 };
