// בית התוכים של הממלכה: day 31, @eilam.lev99's comment "תוכי" (1 like; the top comment, a jail for the thief, was already
// built on day 10, and the next was not for children). A giant round aviary: a gold cage dome of bars on a stone ring, a big
// tree inside with perches, swings and bird houses, colourful parrots flying round inside and perched on the top (live, they
// flap), a giant parrot statue over the gate, feeders, a little pond, visitors with binoculars. In season 1 (גנב הכתר) the king
// checks every parrot's feathers here. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const GOLD = 0xe8b323, GOLD2 = 0xc9971a, STONE = 0xefe3c8, STONE2 = 0xdccca8, NAVY = 0x13213b, TEAL = 0x0f6f73, GRASS = 0x86c766,
  PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, TRUNK = 0x7a5232, LEAF = 0x4f9a43, LEAF2 = 0x6fb44f, WATER = 0x5fb8de, WOOD = 0x8a6240,
  SKIN = 0xe2b48f, DARK = 0x2b2f36, RED = 0xd8443a, BLUE = 0x2f7fd0, YELLOW = 0xf2c935, GREEN = 0x3fae5a, PINK = 0xf3a6b8, WHITE = 0xf7f5ee;
const R = 15, CZ = -4, H = 16;                                                  // the cage: radius, centre z, wall height

function visitor(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020); p.box(0, 1.9, .34, .5, .22, .2, DARK);   // binoculars
  p.at(0, 0, 0);
}
// a voxel parrot drawn into the static pen (the statue and the perched ones)
function parrot(p, x, y, z, s, body, wing, rot = 0) {
  p.at(x, z, rot, y);
  p.box(0, 0, 0, .9 * s, 1.4 * s, .9 * s, body); p.box(0, 1.4 * s, .1 * s, .8 * s, .8 * s, .8 * s, body);
  p.box(0, 1.55 * s, .55 * s, .3 * s, .35 * s, .35 * s, YELLOW); p.box(0, 1.4 * s, .7 * s, .2 * s, .2 * s, .2 * s, DARK);
  p.box(-.41 * s, 1.75 * s, .35 * s, .06, .18 * s, .18 * s, WHITE); p.box(.41 * s, 1.75 * s, .35 * s, .06, .18 * s, .18 * s, WHITE);
  p.box(-.5 * s, .2 * s, -.05 * s, .15 * s, 1 * s, .7 * s, wing); p.box(.5 * s, .2 * s, -.05 * s, .15 * s, 1 * s, .7 * s, wing);
  p.box(0, -.9 * s, -.45 * s, .4 * s, 1.2 * s, .2 * s, wing, 0); p.box(0, -1.4 * s, -.5 * s, .3 * s, .6 * s, .15 * s, BLUE);
  p.at(0, 0, 0);
}

export function drawAviary(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  p.cyl(0, .2, CZ, R * 2 + 6, .12, PAVE, 32); p.box(0, .2, 18, 7, .12, 18, PAVE);
  for (let k = 0; k < 4; k++) p.box(0, .33, 12 + k * 3.6, 7, .02, .2, PAVE2);
  // the stone ring and the floor of grass and sand inside
  p.cyl(0, .2, CZ, R * 2 + 1.6, 1.2, STONE2, 32); p.cyl(0, 1.4, CZ, R * 2 - .4, .2, GRASS, 32);
  // the cage: gold bars round the wall, rings at three heights, the dome as stacked rings and arcs of bars
  for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; p.box(Math.sin(a) * R, 1.4, CZ + Math.cos(a) * R, .3, H, .3, GOLD, a); }
  for (const y of [1.4, 6.5, 11.5, H + 1.2]) for (let k = 0; k < 40; k++) { const a = (k + .5) / 40 * Math.PI * 2; p.box(Math.sin(a) * R, y, CZ + Math.cos(a) * R, 2.45, .35, .4, GOLD2, a); }
  for (let ring = 1; ring <= 5; ring++) { const t = ring / 6, rr = R * Math.cos(t * Math.PI / 2), y = H + 1.4 + R * .75 * Math.sin(t * Math.PI / 2), n = Math.max(8, Math.round(40 * rr / R));
    for (let k = 0; k < n; k++) { const a = (k + .5) / n * Math.PI * 2; p.box(Math.sin(a) * rr, y, CZ + Math.cos(a) * rr, 2 * Math.PI * rr / n + .1, .3, .35, GOLD2, a); } }
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2;
    for (let s = 0; s < 6; s++) { const t0 = s / 6, t1 = (s + 1) / 6, r0 = R * Math.cos(t0 * Math.PI / 2), r1 = R * Math.cos(t1 * Math.PI / 2), y0 = H + 1.4 + R * .75 * Math.sin(t0 * Math.PI / 2), y1 = H + 1.4 + R * .75 * Math.sin(t1 * Math.PI / 2);
      p.box(Math.sin(a) * (r0 + r1) / 2, (y0 + y1) / 2 - .9, CZ + Math.cos(a) * (r0 + r1) / 2, .3, Math.hypot(r0 - r1, y1 - y0) + .2, .3, GOLD, a); } }
  p.cyl(0, H + 1.4 + R * .75 - .2, CZ, 2.4, .6, GOLD, 12); p.ball(0, H + 1.4 + R * .75 + .2, CZ, 1.4, 1.4, RED);
  // inside: a big tree with perches and swings, bird houses, a pond, feeders
  p.cyl(0, 1.6, CZ, 2.2, 9, TRUNK, 8); p.box(-2.5, 6, CZ, 5, .8, .8, TRUNK, 0); p.box(2.8, 8, CZ + 1, 5.5, .8, .8, TRUNK, .6); p.box(.5, 10, CZ - 2.5, .8, .8, 5, TRUNK, .3);
  for (const [x, y, z, s, c] of [[0, 10.4, CZ, 9, LEAF], [-4, 8.6, CZ + 1, 5.5, LEAF2], [4.5, 10, CZ + 2, 6, LEAF2], [1, 13, CZ - 2, 6.5, LEAF], [-3, 12, CZ - 3, 5, LEAF2]]) p.ball(x, y, z, s, s * .8, c);
  for (const [x, z, y] of [[-7, CZ + 6, 6], [7, CZ - 6, 7], [-8, CZ - 5, 5]]) { p.cyl(x, 1.6, z, .3, y, WOOD); p.box(x, y + 1.6, z, 3, .25, .25, WOOD); }
  for (const [x, z] of [[-6, CZ + 3], [6, CZ + 5]]) { p.box(x - .8, 4.6, z, .1, 3, .1, DARK); p.box(x + .8, 4.6, z, .1, 3, .1, DARK); p.box(x, 4.5, z, 2, .2, .4, RED); }   // swings
  for (const [x, z, c] of [[-3, CZ - 9, TEAL], [5, CZ - 9, RED], [-9, CZ + 2, YELLOW]]) { p.cyl(x, 1.6, z, .3, 4, WOOD); p.box(x, 5.6, z, 1.6, 1.6, 1.6, c); p.cone(x, 7.2, z, 2.2, 1, NAVY, 4); p.cyl(x, 6.2, z + .82, .5, .1, DARK); }
  p.cyl(7, 1.6, CZ + 4, 6, .1, WATER, 16); p.cyl(7, 1.5, CZ + 4, 6.6, .25, STONE2, 16);
  for (const [x, z] of [[-10, CZ + 7], [10, CZ - 2]]) { p.cyl(x, 1.6, z, .2, 3, DARK); p.cyl(x, 4.6, z, 1.4, .4, GOLD2); for (let k = 0; k < 4; k++) p.box(x - .4 + k * .25, 5, z, .2, .2, .2, [RED, YELLOW, GREEN, PINK][k]); }
  // perched parrots on the branches and on top of the cage
  parrot(p, -3.5, 6.8, CZ, .9, RED, BLUE, Math.PI); parrot(p, 3.5, 8.8, CZ + 1.4, .9, GREEN, YELLOW, .4); parrot(p, -8, 8.2, CZ + 6, .8, BLUE, YELLOW, .2);
  parrot(p, 7, 9.2, CZ - 6, .8, YELLOW, BLUE, -.4); parrot(p, 0, H + 1.4 + R * .75 + 1.8, CZ, 1.1, RED, GREEN, 0);
  // the giant parrot statue on the gate, and the gate itself (its signs are live)
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, TEAL); p.ball(x, 6.6, 27, 1.4, 1.4, GOLD); }
  p.box(0, 4.6, 27, 15.2, 2, .8, NAVY); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
  parrot(p, 0, 9.4, 27, 2.2, RED, BLUE, 0);
  // benches, lamps, palms, visitors with binoculars
  for (const s of [-1, 1]) { p.box(s * 9, .6, 16, 3.4, .25, 1, WOOD); p.box(s * 9, .2, 16, .3, .45, .8, DARK); p.box(s * 9, .85, 16.45, 3.4, .7, .15, WOOD); }
  for (const [x, z] of [[-5, 20], [5, 20], [-19, 6], [19, 6], [-17, -16], [17, -16]]) { p.cyl(x, .2, z, .25, 4.4, NAVY); p.ball(x, 4.4, z, .9, .9, 0xfff3c4); }
  for (const [x, z, s] of [[-23, 16, 1], [23, 16, 1.1], [-24, -6, .9], [24, -6, 1], [-14, -24, .9], [14, -24, .9], [0, -26, .8]]) p.tree(x, z, s, 0x4f9a43);
  [[-3, 14, Math.PI, TEAL], [-1.8, 14.6, Math.PI, PINK], [3, 13.4, Math.PI, NAVY], [16, 2, -Math.PI / 2, RED], [-16, 1, Math.PI / 2, YELLOW], [0, 22, Math.PI, WHITE]]
    .forEach(([x, z, r, c]) => visitor(p, x, z, r, c));
}

export function aviaryLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('בית התוכים של הממלכה 🦜', { w: 11.2, h: 1.5, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  // parrots flying round inside the cage, flapping
  const flyers = [], cols = [[RED, BLUE], [GREEN, YELLOW], [BLUE, YELLOW], [YELLOW, GREEN], [PINK, TEAL], [RED, GREEN], [BLUE, RED]];
  cols.forEach(([b, w], k) => {
    const g = new THREE.Group(), mb = new THREE.MeshLambertMaterial({ color: b }), mw = new THREE.MeshLambertMaterial({ color: w });
    const body = new THREE.Mesh(new THREE.BoxGeometry(.8, .8, 1.6), mb); g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .7), mb); head.position.set(0, .3, .95); g.add(head);
    const beak = new THREE.Mesh(new THREE.BoxGeometry(.25, .3, .35), new THREE.MeshLambertMaterial({ color: YELLOW })); beak.position.set(0, .2, 1.4); g.add(beak);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.3, .15, 1.4), mw); tail.position.set(0, 0, -1.4); g.add(tail);
    const wl = new THREE.Group(), wr = new THREE.Group();
    for (const [wg, s] of [[wl, -1], [wr, 1]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.6, .12, 1), mw); m.position.x = s * .85; wg.add(m); wg.position.x = s * .4; g.add(wg); }
    group.add(g); flyers.push({ g, wl, wr, r: 5 + (k * 1.7) % 7, y: 5 + (k * 2.3) % 9, w: (k % 2 ? 1 : -1) * (.35 + k * .04), a: k * .9 });
  });
  group.userData.tick = t => flyers.forEach(f => { const a = f.a + t * f.w;
    f.g.position.set(Math.sin(a) * f.r, f.y + Math.sin(t * 2 + f.a) * .8, CZ + Math.cos(a) * f.r); f.g.rotation.y = a + (f.w > 0 ? Math.PI / 2 : -Math.PI / 2);
    const fl = Math.sin(t * 14 + f.a) * .7; f.wl.rotation.z = fl; f.wr.rotation.z = -fl; });
  group.userData.tick(0);
}

export const AVIARY = { key: 'aviary', name: 'בית התוכים של הממלכה', draw: drawAviary, live: aviaryLive, top: 32 };
