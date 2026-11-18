// פארק ההופעות של הממלכה: day 35, @eilam.lev99's comment (1 like) asking for a park with live shows and events for the
// holidays. In season 1 (גנב הכתר) the king puts on a big show there, so the whole kingdom is in one place. An open-air
// stage under a big curved shell (navy, with gold rays), red curtains drawn to the sides, a lighting truss with lamps,
// speakers, a drum kit and microphones; in front, rows of curved benches stepping down the lawn, an aisle of lights, two
// food stands (popcorn and juice), string lights on poles, flags, trees, and people waiting for the show.
// Lot radius 30, front toward +z (the stage is at the back and faces +z, toward the audience and the castle).
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, CURTAIN = 0xa3283a, WOOD = 0x8a6240,
  WOOD2 = 0x6e4a2e, GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, METAL = 0x9aa3ad, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee,
  PINK = 0xf3a6b8, MINT = 0x8fdcc0, LEMON = 0xf6d84a, SKY = 0x7cc4ea;
const SZ = -12;                                                                   // the stage's front edge

function person(p, x, z, r, shirt, s = .32) {
  p.at(x, z, r, s);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .7 * s, 3 * s, WOOD); p.ball(x, 2.6 * s, z, 4 * s, 3.6 * s, LEAF); p.ball(x + .5 * s, 4 * s, z - .3 * s, 2.6 * s, 2.4 * s, 0x5fae55); }

export function drawShowPark(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the stage: a deck with steps, a back wall and the big curved shell over it
  p.box(0, .2, SZ - 6, 26, 2, 12, WOOD2); p.box(0, 2.2, SZ - 6, 26.4, .2, 12.4, WOOD);
  for (let k = 0; k < 3; k++) p.box(0, .2 + k * .65, SZ + .6 + (2 - k) * .7, 6, .65, .8, WOOD);
  for (let k = 0; k < 13; k++) { const a = (k / 12 - .5) * Math.PI * .95; p.box(Math.sin(a) * 13.5, 2.2, SZ - 6 - Math.cos(a) * 6, 2.6, 12 - Math.abs(Math.sin(a)) * 3, 1.2, NAVY, a); }
  for (let row = 0; row < 7; row++) { const y = 12.6 + row * 1.1, w = 26 - row * 3.4; p.box(0, y, SZ - 9 + row * .9, w, 1.1, 3 - row * .2, row % 2 ? NAVY : TEAL); }
  for (let k = 0; k < 9; k++) { const a = (k / 8 - .5) * Math.PI * .8; p.box(Math.sin(a) * 6.5, 6 + Math.cos(a) * 6.5, SZ - 9.6, .5, 4.2, .2, GOLD, 0); }   // gold rays
  p.cyl(0, 6, SZ - 9.7, 4, .2, GOLD, 20);
  // curtains drawn to the sides, a valance on top
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) p.box(s * (10.4 - k * .7), 2.4, SZ - 1.2 - k * .1, .8, 9.6, .6 + (k % 2) * .3, CURTAIN);
  p.box(0, 11.2, SZ - 1.3, 22, 1.4, .8, CURTAIN); for (let k = 0; k < 11; k++) p.ball(-10 + k * 2, 10.6, SZ - .9, .8, .5, GOLD);
  // the lighting truss: two towers and a beam, with lamps
  for (const x of [-12.8, 12.8]) { for (let k = 0; k < 7; k++) p.box(x, .2 + k * 2, SZ - .2, 1, 2, 1, METAL); p.box(x, .2, SZ - .2, 2, .3, 2, DARK); }
  p.box(0, 14.2, SZ - .2, 26.6, .9, .9, METAL);
  for (let k = 0; k < 8; k++) { const x = -10.5 + k * 3; p.box(x, 13.3, SZ - .2, .2, .9, .2, DARK); p.cyl(x, 12.3, SZ - .2, 1, 1, DARK, 10); }
  // on the stage: speakers, a drum kit, microphones, a keyboard
  for (const x of [-11, 11]) { p.box(x, 2.4, SZ - 1.8, 2, 4, 1.6, DARK); p.cyl(x, 3.4, SZ - .98, 1.2, .1, METAL, 12); p.cyl(x, 5.1, SZ - .98, .8, .1, METAL, 12); }
  p.cyl(0, 2.4, SZ - 8, 2.2, 1.6, RED, 14); for (const [x, z] of [[-1.8, -7], [1.8, -7], [-1.2, -9], [1.4, -9.2]]) { p.cyl(x, 2.4, SZ + z + 1, 1, 1, WHITE, 12); p.cyl(x, 3.4, SZ + z + 1, 1.1, .1, LEMON, 12); }
  for (const x of [-4, 0, 4]) { p.cyl(x, 2.4, SZ - 2.6, .12, 3.4, METAL); p.ball(x, 5.9, SZ - 2.6, .45, .55, DARK); }
  p.box(7, 3.6, SZ - 4, 3.6, .3, 1.2, DARK); p.box(7, 3.95, SZ - 3.7, 3.4, .1, .5, WHITE); p.box(6, 2.4, SZ - 4, .2, 1.2, .2, METAL); p.box(8, 2.4, SZ - 4, .2, 1.2, .2, METAL);
  // the audience: curved benches stepping down the lawn, an aisle with little lights
  for (let row = 0; row < 6; row++) {
    const R = 9 + row * 3.2, y = .2 + row * .35;
    for (let k = 0; k < 12; k++) { const a = (k / 11 - .5) * Math.PI * .72; if (Math.abs(a) < .09) continue;
      p.box(Math.sin(a) * R, y, SZ + Math.cos(a) * R, 2.4, .5, .9, row % 2 ? WOOD : WOOD2, a);
      p.box(Math.sin(a) * (R + .5), y + .5, SZ + Math.cos(a) * (R + .5), 2.4, .7, .2, row % 2 ? TEAL : NAVY, a); }
  }
  for (let k = 0; k < 9; k++) { p.box(0, .2, SZ + 9 + k * 2, 2.4, .1, 1.8, PAVE); for (const s of [-1, 1]) p.ball(s * 1.6, .3, SZ + 9 + k * 2, .35, .35, LEMON); }
  // string lights on poles round the lawn, flags of the holidays
  const poles = [[-18, 10], [-14, 20], [0, 26], [14, 20], [18, 10]];
  for (const [x, z] of poles) { p.cyl(x, .2, z, .3, 7, DARK); p.box(x, 7.2, z, 1.4, .8, .1, [RED, GOLD, TEAL, PINK, SKY][(x + z) & 3]); }
  for (let i = 0; i < poles.length - 1; i++) { const [x0, z0] = poles[i], [x1, z1] = poles[i + 1];
    for (let k = 1; k < 8; k++) { const f = k / 8; p.ball(x0 + (x1 - x0) * f, 6.6 - Math.sin(f * Math.PI) * 1, z0 + (z1 - z0) * f, .4, .4, [LEMON, PINK, MINT, SKY][k % 4]); } }
  // two food stands: popcorn and juice
  for (const [x, c, roof] of [[-20, RED, WHITE], [20, LEMON, TEAL]]) {
    p.box(x, .2, -2, 5, 3, 3, c); p.box(x, 3.2, -2, 5.6, .3, 3.6, roof); for (let k = 0; k < 5; k++) p.box(x - 2.2 + k * 1.1, 3.5, -2, 1.1, .6, 3.6, k % 2 ? c : roof);
    p.box(x, 1.6, -.45, 4.4, .2, .4, WHITE); p.ball(x - 1, 2, -.4, .5, .6, x < 0 ? WHITE : 0xf28c28); p.ball(x + 1, 2, -.4, .5, .6, x < 0 ? LEMON : 0xd8443a);
  }
  for (const [x, z, s] of [[-24, -14, 1.1], [24, -15, 1], [-22, 14, .9], [22, 13, .9], [-14, -22, 1], [14, -22, 1.1]]) tree(p, x, z, s);
  // people waiting for the show
  [[-3.6, SZ + 9.4, Math.PI, PINK], [-6, SZ + 9.2, Math.PI * 1.05, TEAL], [4.4, SZ + 9.3, Math.PI * .95, LEMON], [-8, SZ + 15.6, Math.PI * 1.1, NAVY],
   [6.5, SZ + 15.8, Math.PI * .9, RED], [-2.8, SZ + 18.8, Math.PI, MINT], [3, SZ + 22, Math.PI, SKY], [-20, 1.2, Math.PI, GOLD], [20.6, 1.4, Math.PI, PINK], [0, 24, Math.PI, TEAL]]
    .forEach(([x, z, r, c]) => person(p, x, z, r, c));
  // the gate: two posts with gold stars and a navy beam (its signs are live)
  for (const x of [-6.4, 6.4]) { p.box(x, .2, 27, 1.6, 7, 1.6, NAVY); p.ball(x, 7.6, 27, 1.4, 1.4, GOLD); }
  p.box(0, 4.4, 27, 14.6, 2.2, .8, NAVY); p.box(0, 6.6, 27, 15, .3, 1, GOLD);
}

export function showParkLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('פארק ההופעות של הממלכה 🎤', { w: 11.6, h: 1.5, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.4, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('הערב: ההופעה הגדולה! 🎉', { w: 10, h: 1.3, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 16.4, SZ - 6.2));
  group.add(sign('פופקורן 🍿', { w: 3.6, h: .9, bg: '#ffffff', fg: '#c2412d', border: '#c2412d' }).at(-20, 2.6, -.38));
  group.add(sign('מיץ 🧃', { w: 3, h: .9, bg: '#0f6f73', fg: '#ffffff', border: '#f6d84a' }).at(20, 2.6, -.38));
  // beams of light from the truss, sweeping across the stage
  const beams = [], colors = [0xfff3b0, 0xf3a6b8, 0x8fdcc0, 0x7cc4ea];
  for (let k = 0; k < 4; k++) {
    const g = new THREE.Group(), m = new THREE.Mesh(new THREE.ConeGeometry(2.4, 13, 16, 1, true), new THREE.MeshBasicMaterial({ color: colors[k], transparent: true, opacity: .18, depthWrite: false, side: THREE.DoubleSide }));
    m.position.y = -6.5; g.add(m); g.position.set(-9 + k * 6, 12.3, SZ - .2); group.add(g); beams.push(g);
  }
  group.userData.tick = t => beams.forEach((g, k) => { g.rotation.z = Math.sin(t * .9 + k * 1.7) * .45; g.rotation.x = .15 + Math.sin(t * .6 + k) * .12; });
  group.userData.tick(0);
}

export const SHOWPARK = { key: 'show-park', name: 'פארק ההופעות של הממלכה', draw: drawShowPark, live: showParkLive, top: 22 };
