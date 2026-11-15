// מגדל התצפית של הממלכה: day 33. No comment on day 32's reel asked for a place, so the king picked (CLAUDE.md step 2):
// in season 1 (גנב הכתר) the king builds a lookout tower to watch the whole kingdom at night. A round stone tower 40 m
// tall on a square base, navy bands and arrow-slit windows, a wooden gallery round the top with a railing, a giant brass
// telescope on a tripod, a big searchlight (live: it sweeps, its beam a soft cone), a red cone roof with a gold flag.
// At its foot a little garden: a stair to the door, benches, lamps, trees, a signpost, visitors looking up, a guard.
// Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const STONE = 0xe9dfc9, STONE2 = 0xd8ccb2, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc2412d, WOOD = 0x8a6240,
  WOOD2 = 0x6e4a2e, BRASS = 0xc9971a, GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee;
const TR = 9, TH = 34, TOP = 36;                                               // the tower: diameter... radius, shaft height, gallery floor

function person(p, x, z, r, shirt, hat) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, hat ?? 0x4a3020);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .7 * s, 3 * s, WOOD); p.ball(x, 2.6 * s, z, 4 * s, 3.6 * s, LEAF); p.ball(x + .6 * s, 4 * s, z - .3 * s, 2.6 * s, 2.4 * s, 0x5fae55); }

export function drawWatchTower(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the plaza and the path from the gate
  p.cyl(0, .2, 0, 34, .12, PAVE); p.box(0, .2, 20, 5, .12, 14, PAVE);
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; p.box(Math.sin(a) * 16.4, .25, Math.cos(a) * 16.4, 2.6, .2, 1, STONE2, a); }
  // the square base with its door and a stair
  p.box(0, .3, 0, 22, 6, 22, STONE2); p.box(0, 6.3, 0, 23, .8, 23, NAVY);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { p.box(sx * 10.6, .3, sz * 10.6, 2.4, 7.4, 2.4, STONE); p.cone(sx * 10.6, 7.7, sz * 10.6, 3.4, 2.6, RED); p.ball(sx * 10.6, 10.3, sz * 10.6, .6, .6, GOLD); }
  for (let k = 0; k < 6; k++) p.box(0, .3 + k * .35, 14.6 - k * .5, 7 - k * .2, .35, 1.2, PAVE);
  p.box(0, .3, 11.05, 4.4, 5.4, .3, WOOD2); p.box(0, 5.7, 11.05, 5.2, .7, .4, STONE); p.ball(1.2, 2.9, 11.3, .45, .45, GOLD);
  for (const x of [-7, 7]) { p.box(x, 2.4, 11.05, 1.6, 2.4, .2, NAVY); p.box(x, 4.8, 11.05, 2.2, .4, .3, STONE); }
  for (const sx of [-1, 1]) for (const z of [-5, 5]) p.box(sx * 11.05, 2.4, z, .2, 2.4, 1.6, NAVY);
  // the shaft: stone rings, navy bands, narrow windows going up in a spiral (the stair inside)
  for (let k = 0; k < 7; k++) p.cyl(0, 7 + k * 4, 0, TR * 2 - k * .25, 4, k % 2 ? STONE : STONE2, 20);
  for (const y of [14.6, 22.6, 30.6]) p.cyl(0, y, 0, TR * 2 + .3, .5, NAVY, 20);
  for (let k = 0; k < 14; k++) { const a = k * .9 + .4, y = 9 + k * 1.9, r = TR - .05 - k * .016;
    p.box(Math.sin(a) * r, y, Math.cos(a) * r, .7, 1.8, .4, NAVY, a); p.box(Math.sin(a) * (r + .1), y + 1.9, Math.cos(a) * (r + .1), 1.1, .3, .5, STONE, a); }
  // the gallery: corbels, a wooden floor, a railing with posts, a small room under the roof
  for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; p.box(Math.sin(a) * (TR - .2), TOP - 1.4, Math.cos(a) * (TR - .2), 1, 1.4, 1.6, STONE2, a); }
  p.cyl(0, TOP - .4, 0, TR * 2 + 4, .6, WOOD, 24); p.cyl(0, TOP + .2, 0, TR * 2 + 3.6, .1, 0xb08458, 24);
  for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; p.box(Math.sin(a) * (TR + 1.7), TOP + .2, Math.cos(a) * (TR + 1.7), .25, 1.4, .25, WOOD2); }
  for (let k = 0; k < 28; k++) { const a = (k + .5) / 28 * Math.PI * 2; p.box(Math.sin(a) * (TR + 1.7), TOP + 1.5, Math.cos(a) * (TR + 1.7), 2.2, .2, .3, WOOD, a + Math.PI / 2); }
  p.cyl(0, TOP + .2, 0, 10, 5, STONE, 16); p.cyl(0, TOP + 5.2, 0, 11, .5, NAVY, 16);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + .5; p.box(Math.sin(a) * 4.95, TOP + 1.6, Math.cos(a) * 4.95, 1.2, 2, .3, TEAL, a); }
  // the roof: a red cone, a gold ball and the king's flag
  p.cone(0, TOP + 5.7, 0, 13, 8, RED, 16); p.ball(0, TOP + 13.6, 0, 1.2, 1.2, GOLD); p.cyl(0, TOP + 14, 0, .2, 5, DARK);
  p.box(1.6, TOP + 17, 0, 3, 1.8, .1, GOLD); p.box(1.6, TOP + 17.6, .06, 1, .6, .05, NAVY);
  // the telescope: a tripod and a long brass tube pointing out over the front
  const tz = TR + .2;
  for (const [x, z] of [[-1.1, -.6], [1.1, -.6], [0, 1.1]]) p.box(x * .9 - 3, TOP + .2, tz + z * .9, .25, 2.4, .25, WOOD2);
  p.cyl(-3, TOP + 2.4, tz, .9, .6, BRASS); p.box(-3, TOP + 3.1, tz + 1.4, 1.1, 1.1, 5.2, BRASS); p.box(-3, TOP + 3.1, tz + 4.1, 1.5, 1.5, .5, GOLD);
  p.box(-3, TOP + 3.1, tz - 1.4, .7, .7, .8, BRASS); p.box(-3, TOP + 3.1, tz + 2.3, 1.2, .25, .25, DARK);
  // the guard on the gallery, looking out; the searchlight's base (the lamp itself is live)
  person(p, 1.6, tz + .4, 0, NAVY, GOLD);
  p.cyl(4.4, TOP + .2, tz - .6, 1.6, 1.4, DARK, 10);
  // the garden: benches, lamps, trees, a signpost, visitors looking up
  for (const [x, z, r] of [[-12, 14, .4], [12, 14, -.4], [-15, -6, 1.5], [15, -6, -1.5]]) { p.box(x, .5, z, 4, .3, 1.2, WOOD, r); p.box(x, 1.1, z - .5, 4, .9, .2, WOOD, r); }
  for (const [x, z] of [[-4, 24], [4, 24], [-16, 8], [16, 8], [-12, -14], [12, -14]]) { p.cyl(x, .2, z, .3, 4.4, DARK); p.ball(x, 4.6, z, 1, 1, 0xfff2c4); p.cone(x, 5.1, z, 1.4, .8, NAVY); }
  for (const [x, z, s] of [[-20, 4, 1.1], [20, 2, 1], [-18, -16, 1.2], [18, -17, .9], [-8, -22, 1], [9, -22, 1.1], [-22, 16, .8], [22, 15, .9]]) tree(p, x, z, s);
  p.cyl(8, .2, 22, .3, 4, WOOD2); p.box(9.4, 3.2, 22, 2.8, .8, .2, TEAL); p.box(6.8, 2.4, 22, 2.4, .7, .2, GOLD);
  [[-2.5, 18, Math.PI, 0xf3a6b8], [-1.4, 18.6, Math.PI, TEAL], [2.8, 17.4, Math.PI * .9, GOLD], [-9, 10, Math.PI * .7, 0x8fdcc0], [10, 11, -Math.PI * .7, RED], [0, 25, Math.PI, NAVY]]
    .forEach(([x, z, r, c]) => person(p, x, z, r, c));
  // the gate: two stone posts and a navy beam (its signs are live)
  for (const x of [-6.4, 6.4]) { p.box(x, .2, 27, 1.8, 7, 1.8, STONE); p.cone(x, 7.2, 27, 2.6, 1.6, RED); }
  p.box(0, 4.4, 27, 14.6, 2.2, .8, NAVY); p.box(0, 6.6, 27, 15, .3, 1, GOLD);
}

export function watchTowerLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מגדל התצפית של הממלכה 🔭', { w: 11.6, h: 1.5, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('המלך רואה הכול 👀', { w: 6.4, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('אל הצופים ↑', { w: 2.6, h: .7, bg: '#0f6f73', fg: '#ffffff', border: '#ffffff' }).at(9.4, 3.6, 22.12));
  // the searchlight: a drum on a yoke that sweeps round, and its beam, a long soft cone
  const lamp = new THREE.Group(), mat = c => new THREE.MeshLambertMaterial({ color: c });
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 1.8, 14), mat(0x2b2f36)); drum.rotation.x = Math.PI / 2; lamp.add(drum);
  const face = new THREE.Mesh(new THREE.CircleGeometry(1.05, 16), new THREE.MeshBasicMaterial({ color: 0xfff6c8 })); face.position.z = .91; lamp.add(face);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(9, 70, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff3b0, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide }));
  beam.rotation.x = -Math.PI / 2; beam.position.z = 36; lamp.add(beam);
  const yoke = new THREE.Group(); yoke.add(lamp); lamp.rotation.x = .28; yoke.position.set(4.4, TOP + 2.6, TR - .4); group.add(yoke);
  group.userData.tick = t => { yoke.rotation.y = Math.sin(t * .35) * 1.1; };
  group.userData.tick(0);
}

export const WATCHTOWER = { key: 'watch-tower', name: 'מגדל התצפית של הממלכה', draw: drawWatchTower, live: watchTowerLive, top: 52 };
