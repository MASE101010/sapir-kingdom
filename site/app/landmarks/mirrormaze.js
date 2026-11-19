// מבוך המראות של הממלכה: day 36. Day 35's reel got no comment asking for a place, so the king picked (CLAUDE.md step 2):
// in season 1 (גנב הכתר) someone in the kingdom loves pranks, and a prankster can't resist a house of funny mirrors, so the
// king builds one as a trap. The first of the smaller lots (r 18, in the band between two rows of houses): an octagonal
// pavilion of mirror walls in white frames under a striped circus roof with a gold flag, an entrance arch with the sign,
// a ticket booth, a queue with posts and ropes, a row of funny mirrors outside (tall, wide, wavy) with visitors laughing
// at themselves, lamps, benches, trees. Live: the signs, the mirrors' shimmer, and at night (state 'night') the door
// stands ajar and the inside glows.
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240, WOOD2 = 0x6e4a2e,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, MIRROR = 0xbfe3f0,
  MIRROR2 = 0x9fd0e6, PINK = 0xf3a6b8, MINT = 0x8fdcc0, LEMON = 0xf6d84a, SKY = 0x7cc4ea, LILAC = 0xc9b2ec;
const R = 8.4, H = 7.2;                                                        // the pavilion: radius to the walls, wall height

function person(p, x, z, r, shirt, s = .3) {
  p.at(x, z, r, s);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawMirrorMaze(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.cyl(0, .2, 0, 24, .12, PAVE); p.box(0, .2, 13.5, 4.4, .12, 8, PAVE);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; p.box(Math.sin(a) * 11.9, .25, Math.cos(a) * 11.9, 3, .14, .6, k % 2 ? GOLD : CREAM, a); }
  // the pavilion: a base ring, eight mirror walls in white frames (the front one is the doorway), pilasters with gold caps
  p.cyl(0, .3, 0, R * 2 + 1.4, .6, NAVY, 8);
  for (let k = 0; k < 8; k++) {
    const a = (k + .5) / 8 * Math.PI * 2, x = Math.sin(a) * R, z = Math.cos(a) * R, w = 2 * R * Math.tan(Math.PI / 8) - .5;
    if (k) { p.cyl(Math.sin(k / 8 * Math.PI * 2) * (R + .25), .9, Math.cos(k / 8 * Math.PI * 2) * (R + .25), .9, H, WHITE, 8);
      p.ball(Math.sin(k / 8 * Math.PI * 2) * (R + .25), H + 1, Math.cos(k / 8 * Math.PI * 2) * (R + .25), .9, .9, GOLD); }
    if (k === 0 || k === 7) continue;                                          // the two front faces flank the doorway arch
    p.box(x, .9, z, w, H - .4, .4, WHITE, a); p.box(x * 1.012, 1.3, z * 1.012, w - .7, H - 1.4, .2, k % 2 ? MIRROR : MIRROR2, a);
    for (let j = 0; j < 3; j++) p.box(x * 1.02, 1.8 + j * 1.8, z * 1.02, w - 1, .12, .22, WHITE, a);
  }
  // the front: two half walls and the arch over the doorway (its sign is live)
  for (const s of [-1, 1]) { p.box(s * 3, .9, R - .2, 2.6, H - .4, .4, WHITE); p.box(s * 3, 1.3, R + .02, 2, H - 1.4, .2, MIRROR); }
  p.box(0, H - 1.2, R - .1, 4, 1.6, .5, NAVY); p.box(0, H + .4, R - .1, 4.6, .3, .7, GOLD);
  p.box(-1.95, .9, R - .1, .3, H - 2, .5, GOLD); p.box(1.95, .9, R - .1, .3, H - 2, .5, GOLD);
  // the striped roof: a cone in alternating slices (teal / cream), a lip of little flags, a gold ball and a flag
  p.cyl(0, H + .9, 0, R * 2 + 1.6, .5, NAVY, 8);
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; p.box(Math.sin(a) * (R + .9), H + .7, Math.cos(a) * (R + .9), .9, .9, .1, [RED, GOLD, TEAL, PINK][k % 4], a); }
  p.cone(0, H + 1.4, 0, R * 2 + 1.2, 6.4, TEAL, 16); p.cone(0, H + 1.45, 0, R * 2 - 2, 5.2, CREAM, 8);
  p.ball(0, H + 7.8, 0, 1.1, 1.1, GOLD); p.cyl(0, H + 8.3, 0, .16, 3.4, DARK); p.box(1.2, H + 10.5, 0, 2.2, 1.2, .08, GOLD); p.box(1.2, H + 10.9, .05, .8, .4, .05, NAVY);
  // the ticket booth to the right of the door
  p.box(7.2, .2, 11.2, 2.8, 3, 2.4, RED); p.box(7.2, 3.2, 11.2, 3.4, .3, 3, WHITE); p.cone(7.2, 3.5, 11.2, 3.2, 1.4, GOLD, 4);
  p.box(7.2, 1.5, 12.42, 2, .9, .1, MIRROR); p.box(7.2, 1.2, 12.6, 2.4, .15, .5, WOOD);
  // the queue: posts with gold tops and red ropes, zigzagging to the door
  for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) { const x = -3.2 + k * 2.1, z = 11 + r * 2.2;
    p.cyl(x, .3, z, .25, 1.4, DARK); p.ball(x, 1.75, z, .35, .35, GOLD); if (k < 3) p.box(x + 1.05, 1.2, z, 2, .12, .12, RED); }
  // the funny mirrors outside: tall, wide, wavy, on wooden stands, in a curve to the left of the door
  [[-12.4, 4, .9, 1.9, 4.6, PINK], [-11.4, 7.6, .6, 3.4, 2.6, LEMON], [-9.4, 10.6, .35, 2.2, 3.8, MINT], [-6.6, 12.8, .15, 2.6, 3.2, LILAC]].forEach(([x, z, r, w, h, c]) => {
    p.box(x, .3, z, w + .6, .3, .9, WOOD2, r); p.box(x, .6, z, w + .4, h + .4, .3, c, r); p.box(x + Math.sin(r) * .1, .8, z + Math.cos(r) * .1, w, h, .12, MIRROR, r);
    for (let j = 0; j < 4; j++) p.box(x + Math.sin(r) * .14, 1.1 + j * h / 4.4, z + Math.cos(r) * .14, w * (.5 + (j % 2) * .4), .18, .08, MIRROR2, r); });
  // visitors laughing at the mirrors, a few in the queue, a guard at the door
  [[-11, 5.6, -2, PINK], [-10.2, 8.7, -2.6, SKY], [-8.4, 11.6, -2.9, LEMON], [-5.6, 14.2, 3.1, MINT], [-2, 11.4, Math.PI, TEAL], [.4, 12, Math.PI, RED],
   [2.6, 13.4, Math.PI, LILAC], [7.2, 13.4, Math.PI, NAVY], [2.8, R + 1.6, 0, NAVY]].forEach(([x, z, r, c]) => person(p, x, z, r, c));
  // lamps, benches, trees round the plaza
  for (const [x, z] of [[-4.6, 16.6], [4.6, 16.6], [-12, -6], [12, -6], [0, -13.6]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, r] of [[12.4, 4, -1.2], [-13.2, -2, 1.3], [8, -11, -2.4]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z, 3.2, .8, .2, WOOD, r); }
  for (const [x, z, s] of [[14.6, -8, .9], [-14.2, -9, 1], [-6, -15, .8], [6.4, -15.4, .9], [15, 10, .7]]) tree(p, x, z, s);
}

export function mirrorMazeLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מבוך המראות 🪞', { w: 3.8, h: 1.2, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 6.8, R + .2));
  group.add(sign('כרטיסים 🎟️', { w: 2.4, h: .6, bg: '#ffffff', fg: '#c2412d', border: '#c2412d' }).at(7.2, 2.7, 12.45));
  group.add(sign('צחקו על עצמכם! 😂', { w: 3.8, h: .7, bg: '#0f6f73', fg: '#ffffff', border: '#f6d84a' }).at(-9.2, 5.6, 11.2));
  // the doorway: dark inside, two doors that stand ajar at night, a warm glow that breathes
  const mat = c => new THREE.MeshLambertMaterial({ color: c });
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(3.6, H - 2.1), new THREE.MeshBasicMaterial({ color: 0x1b2440 })); inside.position.set(0, .9 + (H - 2.1) / 2, R - .3); group.add(inside);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, H - 2.3), new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, depthWrite: false })); glow.position.set(0, .9 + (H - 2.1) / 2, R - .25); group.add(glow);
  const doors = [-1, 1].map(s => { const pivot = new THREE.Group(); pivot.position.set(s * 1.8, .9, R); const d = new THREE.Mesh(new THREE.BoxGeometry(1.75, H - 2.1, .15), mat(0x6e4a2e));
    d.position.set(-s * .875, (H - 2.1) / 2, 0); pivot.add(d); const k = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), mat(GOLD)); k.position.set(-s * 1.5, (H - 2.1) / 2, .12); pivot.add(k); group.add(pivot); return { pivot, s }; });
  let night = 0;
  const set = (t = 0) => { doors.forEach(({ pivot, s }) => { pivot.rotation.y = s * night * (1.15 + Math.sin(t * 1.3) * .06); });
    glow.material.opacity = Math.min(1, night * (.9 + Math.sin(t * 3.1) * .08)); };
  group.userData.night = k => { night = k; set(); };
  group.userData.tick = t => set(t);
  set();
}

export const MIRRORMAZE = { key: 'mirror-maze', name: 'מבוך המראות של הממלכה', draw: drawMirrorMaze, live: mirrorMazeLive, top: 18 };
