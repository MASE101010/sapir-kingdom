// בורג' ספיר: day 8 (@ofek_bell, "תבנה את הבורג׳ ספיר המגדל הכי גבוה שיש בממלכה"), the tallest thing in the kingdom: a
// glass tower on three wings that step back as they rise, gold bands at every setback, a gold crown at 100 m that turns
// slowly, and a spire above it. At its foot a three-winged podium with the lobby, a lake with fountain jets, palms, a drop-off
// with cars, and people looking up. No real building's name or brand anywhere. Lot radius 26, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const GLASS = 0x5f9fc4, GLASS2 = 0x9cc9df, STEEL = 0xd7dde2, GOLD = 0xe8b323, NAVY = 0x13213b, CREAM = 0xf6efe0, STONE = 0xe3d9c6,
  WATER = 0x58b0d4, JET = 0xd8f0f8, PALM = 0x3f8f3a, TRUNK = 0x8a6a46, SKIN = 0xe2b48f, DARK = 0x3a3f45, LAWN = 0x86c766;
const SHIRTS = [0xc8102e, 0x0f6f73, 0x3b6fb6, GOLD, 0x7a4f9a, 0x1f8a4c, 0xf29bb7];
const WINGS = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6];          // one wing to the back, two to the front corners: the lobby faces +z
const TIERS = 10, TIER_H = 9.6;

function wing(p, a, len, w, y, h, color) { p.box(Math.cos(a) * len / 2, y, Math.sin(a) * len / 2, len, h, w, color, -a); }
function palm(p, x, z, s = 1) {
  for (let k = 0; k < 5; k++) p.cyl(x + k * .08 * s, k * 1.6 * s, z, (.7 - k * .06) * s, 1.6 * s, TRUNK);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; p.box(x + (.4 + Math.cos(a) * 1.6) * s, 7.6 * s, z + Math.sin(a) * 1.6 * s, 3.4 * s, .3, 1 * s, PALM, -a); }
}
function person(p, x, z, rot, shirt, look = false) {
  p.at(x, z, rot); p.box(-.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(0, 1.4, 0, 1.2, 1.4, .8, shirt);
  p.box(0, 2.8, look ? -.15 : 0, .9, .9, .9, SKIN); p.box(0, 3.6, look ? -.2 : 0, .95, .25, .95, 0x4a3020);
  if (look) p.box(.75, 2.6, -.2, .3, 1.2, .3, SKIN); p.at(0, 0, 0);
}
export function drawBurj(p) {
  p.at(0, 0, 0);
  // the ground: lawn, a stone plaza round the foot, the lake in front with its rim, the drive to the lobby
  p.box(0, 0, 0, 52, .08, 52, LAWN); p.cyl(0, .08, 0, 34, .1, STONE);
  p.box(0, .08, 17, 30, .3, 12, STONE); p.box(0, .2, 17, 28, .25, 10, WATER);
  for (let k = 0; k < 9; k++) { const x = -12 + k * 3; p.cyl(x, .4, 17, .35, 2 + (k % 3) * 1.6, JET); p.ball(x, 2.2 + (k % 3) * 1.6, 17, .9, .9, JET); }
  for (let k = 0; k < 5; k++) { const x = -8 + k * 4; p.cyl(x, .4, 20, .3, 1.4, JET); }
  p.box(-19, .08, 10, 6, .1, 30, 0x5d6166); p.box(-14, .08, 3, 10, .1, 6, 0x5d6166);
  // the podium: three low wings in cream and glass round the tower's foot, and the lobby with its gold canopy
  for (const a of WINGS) { wing(p, a, 20, 11, .08, 7, CREAM); wing(p, a, 20.4, 11.4, 7.08, .6, GOLD); for (let s = 0; s < 2; s++) wing(p, a, 20.2, 11.2, 1.6 + s * 3, 1.6, GLASS2); }
  p.box(0, .08, 5.5, 9, 6.4, 5, GLASS2); p.box(0, 6.5, 7.6, 12, .5, 6, GOLD); for (const x of [-5.5, 5.5]) p.box(x, .08, 10.2, .5, 6.4, .5, GOLD);
  p.box(0, .08, 8.1, 3, 3.6, .2, 0x8fc3d8);
  // the tower: a core and three wings, ten tiers that step back as they rise, a gold band at each setback and light storey bands
  for (let t = 0; t < TIERS; t++) {
    const y = 7.6 + t * TIER_H, len = 15 - t * 1.25, w = 6.6 - t * .28;
    for (const [i, a] of WINGS.entries()) {
      if (len - i * .9 * (t % 3 === 2) < 3) continue;
      const L = len - (i === (t % 3) ? 1.6 : 0);
      wing(p, a, L, w, y, TIER_H, GLASS);
      for (let s = 0; s < 3; s++) wing(p, a, L + .12, w + .12, y + 1.2 + s * 3.2, .35, GLASS2);
      wing(p, a, L + .3, w + .3, y + TIER_H - .35, .5, GOLD);
    }
    p.cyl(0, y, 0, 7.4 - t * .32, TIER_H, GLASS2);
  }
  const top = 7.6 + TIERS * TIER_H;
  p.cyl(0, top, 0, 4.2, 3, STEEL); p.cyl(0, top + 3, 0, 3.4, 4, GLASS); p.cyl(0, top + 7, 0, 5.6, .7, GOLD);
  // the spire above the crown, in steps, with a light on top
  for (let k = 0; k < 6; k++) p.cyl(0, top + 7.7 + k * 3, 0, 1.6 - k * .22, 3, k % 2 ? STEEL : 0xc9d1d8);
  p.ball(0, top + 26, 0, 1, 1, 0xfff3b0);
  // palms round the plaza and along the lake, cars at the drop-off, people looking up at the tower
  for (const [x, z] of [[-22, 22], [-22, 12], [22, 22], [22, 12], [-24, -14], [24, -14], [-10, -22], [10, -22], [-15, 24], [15, 24]]) palm(p, x, z, .9);
  for (const [z, c] of [[2, 0xc8102e], [8, 0xf7f7f2], [14, NAVY]]) { p.at(-19, z, 0); p.box(0, .4, 0, 2.6, 1.3, 4.6, c); p.box(0, 1.7, -.3, 2.3, 1, 2.6, c); p.box(0, 1.8, 1.02, 2.1, .8, .05, GLASS2);
    for (const [dx, dz] of [[-1.3, 1.5], [1.3, 1.5], [-1.3, -1.5], [1.3, -1.5]]) p.cyl(dx, 0, dz, .9, .5, DARK); p.at(0, 0, 0); }
  [[-4, 11, Math.PI], [3, 12, Math.PI + .3], [7, 10, Math.PI - .4], [-8, 9, Math.PI + .5], [10, 23.5, Math.PI], [-6, 24, Math.PI - .2], [13, 9, Math.PI + .8], [-12, 23, Math.PI + .1]]
    .forEach(([x, z, r], k) => person(p, x, z, r, SHIRTS[k % SHIRTS.length], k % 2 === 0));
  // benches by the lake
  for (const x of [-10, 10]) { p.box(x, .5, 23.4, 3, .3, 1, TRUNK); p.box(x, .8, 23.85, 3, .9, .15, TRUNK); }
}
/** the crown at 100 m: a gold ring with points and jewels, turning slowly (tick) */
export function burjLive(group) {
  const top = 7.6 + TIERS * TIER_H, p = new Pen();
  p.cyl(0, 0, 0, 6.6, 1.2, GOLD);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.cone(Math.cos(a) * 2.9, 1.2, Math.sin(a) * 2.9, 1.5, 2.8, GOLD); p.ball(Math.cos(a) * 2.9, 4, Math.sin(a) * 2.9, .8, .8, k % 2 ? 0xc8102e : 0x3b6fb6); }
  const crown = p.build(new THREE.Group()); crown.position.set(0, top + 7.7, 0); group.add(crown); group.userData.crown = crown;
  group.add(sign("בורג' ספיר", { w: 9.6, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 7.6, 10.65));
  group.add(sign('המגדל הכי גבוה בממלכה 👑', { w: 8, h: 1.2, bg: '#fffaf0', fg: '#13213b', border: '#e8b323' }).at(0, 4.6, 8.25));
}
export function burjTick(group, t) { const c = group.userData.crown; if (c) c.rotation.y = t * .4; }
export const BURJ = { key: 'burj', name: "בורג' ספיר", draw: drawBurj, live: burjLive, tick: burjTick, top: 135 };
