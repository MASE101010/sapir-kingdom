// בית הכנסת של הממלכה: day 28, @orthegoat's comment "תבנו בית כנסת" (8 likes, the top comment on day 27's reel).
// A festive synagogue of cream stone: a long hall with tall arched windows of coloured glass, a big teal dome with a gold
// band on a drum, two towers with small domes, a round window with a Star of David over the three wooden doors (live),
// wide steps, and in the front garden a golden seven branched menorah with flames. Round it a stone plaza, flower beds,
// benches, lamps, olive trees and people coming in. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const STONE = 0xefe3c8, STONE2 = 0xdccca8, STONE3 = 0xc9b791, TEAL = 0x0f6f73, TEAL2 = 0x1a8a8e, NAVY = 0x13213b, GOLD = 0xe8b323,
  GOLD2 = 0xc9971a, WOOD = 0x8a5a36, GLASS = [0x3f7cc4, 0x0f6f73, 0xe8b323, 0x7fb6e0], PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa,
  GRASS = 0x86c766, OLIVE = 0x7f9c5a, DARK = 0x2b2f36, SKIN = 0xe2b48f, FLAME = 0xf39a2b, RED = 0xc8443a, PINK = 0xf3a6b8, WHITE = 0xf7f5ee;
const HZ = -5, HW = 24, HD = 20, HH = 12;                                       // the hall: centre z, width, depth, height

function person(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
// an arched window in voxel steps, on a wall facing +z (rot 0) or ±x (rot ±π/2)
function arch(p, x, y, z, w, h, glass, rot = 0) {
  const s = Math.sin(rot), c = Math.cos(rot), o = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
  let [a, b] = o(0, .12); p.box(a, y, b, w, h, .3, glass, rot);
  [a, b] = o(0, .12); p.box(a, y + h, b, w * .7, w * .25, .3, glass, rot); p.box(a, y + h + w * .25, b, w * .35, w * .18, .3, glass, rot);
  [a, b] = o(0, .2); p.box(a, y + h * .5, b, w + .1, .14, .32, STONE3, rot); p.box(a, y - .3, b, w + .8, .3, .5, STONE2, rot);
}

export function drawSynagogue(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the plaza: a stone square in front, the path from the gate, paving rings
  p.box(0, .2, 13, 34, .12, 16, PAVE); p.box(0, .2, 23, 7, .12, 10, PAVE);
  for (let k = 0; k < 7; k++) p.box(-15 + k * 5, .33, 13, .2, .02, 16, PAVE2);
  for (let k = 0; k < 4; k++) p.box(0, .33, 6.5 + k * 4, 34, .02, .2, PAVE2);
  // the hall on a plinth
  p.box(0, .2, HZ, HW + 2, 1.2, HD + 2, STONE3);
  p.box(0, 1.4, HZ, HW, HH, HD, STONE);
  p.box(0, 1.4 + HH, HZ, HW + .8, .6, HD + .8, STONE2); p.box(0, 2 + HH, HZ, HW + .2, .5, HD + .2, GOLD);
  for (let k = 0; k < 13; k++) p.box(-HW / 2 + 1 + k * 1.83, 2.5 + HH, HZ + HD / 2, .8, .7, .8, STONE2);           // crenels at the front
  // the front: a gable over three doors, the round window (its star is live)
  const FZ = HZ + HD / 2;
  p.box(0, 1.4 + HH, FZ, 12, 3, .8, STONE); p.box(0, 4.4 + HH, FZ, 7, 1.6, .8, STONE); p.box(0, 6 + HH, FZ, 3, .8, .8, STONE2);
  p.cyl(0, 6.9 + HH, FZ, .4, 1.6, GOLD);
  p.box(0, 7.3, FZ + .1, 6.6, 6.6, .3, STONE2); p.box(0, 7.5, FZ + .2, 5.8, 6.2, .3, 0x3f7cc4);                       // the round window's frame and glass
  for (const [x, w] of [[-4.6, 2.6], [0, 3.4], [4.6, 2.6]]) {
    p.box(x, 1.4, FZ + .15, w, 4.6, .3, WOOD); p.box(x, 6, FZ + .15, w * .7, .6, .3, WOOD); p.box(x, 6.6, FZ + .15, w * .35, .4, .3, WOOD);
    p.box(x, 1.4, FZ + .3, .12, 4.6, .2, 0x6b4428); p.box(x + w * .3, 3.6, FZ + .35, .2, .2, .2, GOLD);
    p.box(x, 1.2, FZ + .5, w + 1, .3, .9, STONE2); }
  for (const x of [-7.6, 7.6]) { p.cyl(x, 1.4, FZ + .6, 1.1, 9, STONE2, 10); p.box(x, 10.4, FZ + .6, 1.6, .5, 1.6, GOLD); }   // two columns
  // tall arched windows of coloured glass along both sides and on the front
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) arch(p, s * (HW / 2 + .02), 3.4, HZ - 7 + k * 3.5, 1.8, 5, GLASS[k % 4], s * Math.PI / 2);
  for (const x of [-10, 10]) arch(p, x, 3.4, FZ, 1.8, 5, GLASS[x > 0 ? 2 : 1]);
  arch(p, -10, 10.4, FZ, 1.2, 1.4, GLASS[3]); arch(p, 10, 10.4, FZ, 1.2, 1.4, GLASS[3]);
  // the dome: a drum with little windows, the teal dome, a gold band, the lantern and a gold finial
  const DY = 2.6 + HH;
  p.cyl(0, DY, HZ, 13, 2.6, STONE2, 16); p.cyl(0, DY + 2.6, HZ, 13.6, .4, GOLD, 16);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; p.box(Math.sin(a) * 6.45, DY + .7, HZ + Math.cos(a) * 6.45, .9, 1.3, .2, GLASS[k % 4], a); }
  p.ball(0, DY + 3 - 6, HZ, 12.4, 12.4, TEAL, 16);
  p.cyl(0, DY + 9, HZ, 2.2, 1.6, STONE, 8); p.cone(0, DY + 10.6, HZ, 2.8, 1.6, GOLD, 8); p.cyl(0, DY + 12.2, HZ, .3, 1.4, GOLD); p.ball(0, DY + 13.6, HZ, .8, .8, GOLD);
  // two towers at the front corners with small domes
  for (const s of [-1, 1]) { const x = s * (HW / 2 + 1.6), z = FZ - 1.8;
    p.box(x, .2, z, 5, 19, 5, STONE); p.box(x, 19.2, z, 5.6, .5, 5.6, GOLD); p.box(x, 7, z, 5.2, .4, 5.2, STONE2); p.box(x, 13, z, 5.2, .4, 5.2, STONE2);
    for (const y of [3, 9, 14.6]) { arch(p, x, y, z + 2.5, 1.2, 2.4, GLASS[(y | 0) % 4]); arch(p, x + s * 2.5, y, z, 1.2, 2.4, GLASS[((y | 0) + 1) % 4], s * Math.PI / 2); }
    p.cyl(x, 19.7, z, 4.4, 1.4, STONE2, 12); p.ball(x, 21.1 - 2.2, z, 4.4, 4.4, TEAL, 12); p.cyl(x, 23.2, z, .2, 1.4, GOLD); p.ball(x, 24.4, z, .6, .6, GOLD); }
  // wide steps up to the doors
  for (let k = 0; k < 3; k++) p.box(0, .2 + k * .4, FZ + 3.4 - k * 1.1, 16 - k * 1.2, .4 + k * .4 + .01, 1.1, STONE2);
  // the golden seven branched menorah on a round base in the front garden, with flames
  const MZ = 15, MY = 1.6;
  p.cyl(0, .2, MZ, 7, .7, STONE2, 16); p.cyl(0, .9, MZ, 6.2, .4, GRASS, 16); p.cyl(0, 1.3, MZ, 2.4, .3, GOLD2, 8);
  p.box(0, MY, MZ, .6, 7.2, .6, GOLD);
  for (let k = 1; k <= 3; k++) { const w = k * 1.5, y0 = MY + 6.8 - k * 1.1;
    p.box(0, y0, MZ, w * 2 + .5, .45, .5, GOLD);
    for (const s of [-1, 1]) p.box(s * w, y0, MZ, .45, 7.2 + MY - y0, .45, GOLD); }
  for (let k = -3; k <= 3; k++) { p.cyl(k * 1.5, MY + 7.2, MZ, .9, .3, GOLD2); p.cone(k * 1.5, MY + 7.5, MZ, .55, 1, FLAME, 6); }
  // flower beds, benches, lamps, olive trees, a little fountain for washing hands
  for (const s of [-1, 1]) {
    p.box(s * 11, .2, 12, 7, .6, 3, 0x6d4a2e); for (let k = 0; k < 6; k++) p.ball(s * 11 - 2.6 + k * 1.05, .7, 12 + (k % 2 ? .6 : -.6), .9, .9, [PINK, GOLD, WHITE, RED][k % 4]);
    p.box(s * 11, .6, 16.2, 3.4, .25, 1, WOOD); p.box(s * 11, .2, 16.2, .3, .45, .8, DARK); p.box(s * 11, .85, 16.65, 3.4, .7, .15, WOOD);
    for (const z of [7, 19]) { p.cyl(s * 16, .2, z, .25, 4.4, NAVY); p.ball(s * 16, 4.4, z, .9, .9, 0xfff3c4); } }
  p.cyl(13, .2, 5, 2.4, 1, STONE2, 10); p.cyl(13, 1.2, 5, 2, .1, 0x7fc4e0, 10); p.box(13, 1.2, 5, .3, 1.4, .3, GOLD);
  for (const [x, z, s] of [[-22, 14, 1], [22, 14, 1.1], [-21, -16, 1], [21, -16, 1], [0, -24, .9], [-12, -22, .8], [12, -22, .9], [-24, 0, .8], [24, 0, .9]]) p.tree(x, z, s, OLIVE);
  // people arriving, families on the steps and round the menorah
  [[-3, 11, Math.PI, TEAL], [-2, 11.6, Math.PI, NAVY], [3.4, 10.4, Math.PI, RED], [4.3, 10.9, Math.PI, WHITE], [-5.6, 17, 0, GOLD],
   [5.5, 18.6, -Math.PI / 2, PINK], [-8, 8.8, Math.PI * .8, NAVY], [9, 9, -Math.PI * .8, TEAL], [0, 21, Math.PI, WHITE], [1.2, 21.6, Math.PI, RED]]
    .forEach(([x, z, r, c]) => person(p, x, z, r, c));
  // the gate: two stone pillars with gold tops and a beam (its signs are live)
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, STONE2); p.ball(x, 6.6, 27, 1.4, 1.4, GOLD); }
  p.box(0, 4.6, 27, 15.2, 2, .8, NAVY); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
}

// a Star of David: two triangles, as a flat gold frame on the round window
function star(r, t, color) {
  const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color });
  for (const flip of [0, Math.PI]) for (let k = 0; k < 3; k++) {
    const a1 = flip + k / 3 * Math.PI * 2, a2 = flip + (k + 1) / 3 * Math.PI * 2;
    const x1 = Math.sin(a1) * r, y1 = Math.cos(a1) * r, x2 = Math.sin(a2) * r, y2 = Math.cos(a2) * r, len = Math.hypot(x2 - x1, y2 - y1);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(len + t, t, .25), m); bar.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
    bar.rotation.z = Math.atan2(y2 - y1, x2 - x1); g.add(bar); }
  return g;
}

export function synagogueLive(group) {
  const big = '900 {px}px "Secular One", Rubik', FZ = HZ + HD / 2;
  group.add(sign('בית הכנסת של הממלכה ✡️', { w: 11.2, h: 1.5, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @orthegoat · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('ברוכים הבאים', { w: 6, h: 1, bg: '#efe3c8', fg: '#0f6f73', border: '#e8b323', font: big }).at(0, 14.7, FZ + .45));
  const s = star(2.5, .4, GOLD); s.position.set(0, 10.6, FZ + .45); group.add(s);
  const s2 = star(.9, .2, GOLD); s2.position.set(0, 2.6 + HH + 13.6 + 1.6, HZ); group.add(s2);
  // the menorah's flames flicker
  const flames = [];
  for (let k = -3; k <= 3; k++) { const f = new THREE.Mesh(new THREE.ConeGeometry(.22, .8, 6), new THREE.MeshBasicMaterial({ color: 0xffd25a })); f.position.set(k * 1.5, 1.6 + 7.5 + .9, 15); group.add(f); flames.push(f); }
  group.userData.tick = t => { flames.forEach((f, k) => { const q = 1 + .25 * Math.sin(t * 9 + k * 1.7); f.scale.set(1, q, 1); }); s2.rotation.y = t * .8; };
  group.userData.tick(0);
}

export const SYNAGOGUE = { key: 'synagogue', name: 'בית הכנסת של הממלכה', draw: drawSynagogue, live: synagogueLive, top: 30 };
