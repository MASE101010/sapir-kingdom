// בית הממתקים של הממלכה: day 32, @itamarsarusi's comment (1 like) asking for the witch's house of sweets from the fairy tale.
// In season 1 (גנב הכתר) the king builds it as a sweet trap: whoever leaves sugar crumbs at night will come for the candy.
// A gingerbread house: brown cookie walls with white icing trim, a roof of chocolate bar tiles dotted with candies, round
// cookie windows, a door of chocolate, candy cane pillars, a giant cupcake for a chimney, lollipop trees, gumdrops along a
// path of biscuits, a fence of candy sticks, and a big net rolled up under the roof's edge (the trap, live: it sways).
// Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const GINGER = 0xb7743c, GINGER2 = 0x9a5f2e, ICING = 0xfbf7f0, CHOCO = 0x5a3420, CHOCO2 = 0x6e4229, PINK = 0xf3a6b8, PINK2 = 0xe77fa0,
  MINT = 0x8fdcc0, LEMON = 0xf6d84a, BERRY = 0xd8443a, GRAPE = 0xa77bd6, SKY = 0x7cc4ea, GRASS = 0x9bd47a, BISCUIT = 0xe6c48a,
  NAVY = 0x13213b, GOLD = 0xe8b323, WHITE = 0xffffff, SKIN = 0xe2b48f, DARK = 0x2b2f36;
const CANDY = [PINK, MINT, LEMON, BERRY, GRAPE, SKY];
const HW = 20, HD = 14, HZ = -4, WH = 9;                                         // the house: width, depth, centre z, wall height

function visitor(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
function cane(p, x, z, h) { for (let k = 0; k < h / .6; k++) p.cyl(x, .2 + k * .6, z, .7, .6, k % 2 ? BERRY : WHITE); p.box(x + .4, .2 + h, z, 1.4, .6, .6, BERRY); p.box(x + 1, h - .3, z, .6, .9, .6, WHITE); }
function lolly(p, x, z, h, c) { p.cyl(x, .2, z, .25, h, WHITE); p.cyl(x, h, z, 3.2, .5, c, 16); p.cyl(x, h - .02, z, 2, .54, WHITE, 16); p.cyl(x, h - .04, z, .9, .58, c, 16); }

export function drawCandyHouse(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the path of biscuits from the gate, gumdrops along it
  for (let k = 0; k < 9; k++) { p.box(0, .2, 6 + k * 2.4, 4.4, .25, 1.9, BISCUIT); for (const s of [-1, 1]) p.ball(s * 3.2, .2, 6.8 + k * 2.4, .9, .8, CANDY[(k + (s > 0 ? 2 : 0)) % 6]); }
  // the house: gingerbread walls, icing at the corners and the top, cookie windows, the chocolate door
  p.box(0, .2, HZ, HW + 1, .8, HD + 1, GINGER2); p.box(0, 1, HZ, HW, WH, HD, GINGER);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(sx * HW / 2, 1, HZ + sz * HD / 2, .8, WH, .8, ICING);
  for (const sz of [-1, 1]) for (let k = 0; k < 11; k++) p.ball(-HW / 2 + 1 + k * 1.8, WH + .6, HZ + sz * (HD / 2 + .1), 1, .7, ICING);
  for (const sx of [-1, 1]) for (let k = 0; k < 8; k++) p.ball(sx * (HW / 2 + .1), WH + .6, HZ - HD / 2 + 1 + k * 1.75, 1, .7, ICING);
  const FZ = HZ + HD / 2 + .12;
  p.box(0, 1, FZ, 3.6, 5.4, .3, CHOCO); for (let k = 0; k < 3; k++) p.box(0, 1.6 + k * 1.6, FZ + .12, 3, .2, .1, CHOCO2); p.ball(1.1, 3.4, FZ + .2, .5, .5, GOLD);
  p.box(0, 6.4, FZ + .05, 4.4, .5, .3, ICING); p.box(0, 6.9, FZ + .05, 3.2, .5, .3, ICING);
  for (const x of [-6, 6]) { p.cyl(x, 4, FZ, 3.6, .3, BISCUIT, 16); p.cyl(x, 4.05, FZ + .1, 2.6, .3, SKY, 16); p.box(x, 4.6, FZ + .25, 2.6, .2, .1, ICING); p.box(x, 5.8, FZ + .25, .2, 2.6, .1, ICING);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.ball(x + Math.sin(a) * 2, 5.8 + Math.cos(a) * 2, FZ + .2, .45, .45, CANDY[k % 6]); } }
  for (const sx of [-1, 1]) for (const z of [HZ - 3, HZ + 3]) { p.cyl(sx * (HW / 2 + .1), 4.2, z, 2.6, .3, BISCUIT, 16); p.cyl(sx * (HW / 2 + .15), 4.25, z, 1.8, .3, SKY, 16); }
  // the roof: two slopes of chocolate bar tiles with candies, a ridge of icing
  for (const s of [-1, 1]) for (let row = 0; row < 6; row++) {
    const y = WH + 1 + row * 1.25, x = s * (HW / 2 + 1.2 - row * 1.9);
    p.box(x, y, HZ, 2.1, 1.3, HD + 2.4, CHOCO2); for (let k = 0; k < 6; k++) p.box(x, y + 1.3, HZ - HD / 2 - .6 + k * 3, 2.2, .12, .15, CHOCO);
    for (let k = 0; k < 4; k++) p.ball(x, y + 1.1, HZ - 5 + k * 3.4 + (row % 2) * 1.2, .7, .7, CANDY[(row + k) % 6]); }
  p.box(0, WH + 8.6, HZ, 3, 1, HD + 2.6, ICING); for (let k = 0; k < 7; k++) p.ball(0, WH + 9.4, HZ - 6.5 + k * 2.2, .9, .9, CANDY[k % 6]);
  // the gables: icing triangles in steps on the front and back
  for (const sz of [-1, 1]) for (let row = 0; row < 6; row++) p.box(0, WH + 1 + row * 1.25, HZ + sz * (HD / 2 + .2), HW - row * 3.6, 1.25, .3, row % 2 ? GINGER : GINGER2);
  p.cyl(0, WH + 4, FZ + .3, 3.4, .3, PINK, 16); p.cyl(0, WH + 4.05, FZ + .4, 2.2, .3, WHITE, 16);
  // the chimney: a giant cupcake with icing and a cherry
  p.cyl(6, WH + 6, HZ - 3, 3.4, 3, PINK2, 12); p.ball(6, WH + 8.6, HZ - 3, 4, 3, ICING); p.ball(6, WH + 10.8, HZ - 3, 1.2, 1.2, BERRY);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; p.box(6 + Math.sin(a) * 1.6, WH + 9.2, HZ - 3 + Math.cos(a) * 1.6, .25, .25, .6, CANDY[k], a); }
  // candy cane pillars at the door, lollipop trees, a fence of candy sticks, giant donuts and a cake stand
  cane(p, -3, FZ + 1.6, 6); cane(p, 3, FZ + 1.6, 6);
  for (const [x, z, h, c] of [[-12, 8, 7, PINK], [12, 8, 8, MINT], [-16, -10, 9, LEMON], [16, -12, 7, GRAPE], [-20, 14, 6, SKY], [20, 14, 6, BERRY], [0, -18, 8, PINK]]) lolly(p, x, z, h, c);
  for (let k = 0; k < 22; k++) { const a = (k / 22 - .5) * Math.PI * 1.4 + Math.PI, x = Math.sin(a) * 24, z = Math.cos(a) * 24; if (Math.abs(x) < 5) continue; p.cyl(x, .2, z, .5, 2.4, CANDY[k % 6]); }
  for (const [x, z, c] of [[-10, 18, PINK], [10, 18, LEMON]]) { p.cyl(x, .2, z, 4, 1.4, BISCUIT, 16); p.cyl(x, 1.6, z, 3.6, .2, c, 16); p.cyl(x, 1.4, z, 1.4, .5, GRASS, 12); }
  // the trap: a big rolled net under the roof's front edge (it sways, live) and a sign
  p.box(0, WH + .4, FZ + 1.6, HW - 2, .3, .3, DARK); for (const x of [-8, 0, 8]) p.box(x, WH - .4, FZ + 1.6, .12, .9, .12, DARK);
  // visitors
  [[-2, 15, Math.PI, PINK], [-1, 15.6, Math.PI, NAVY], [2.6, 13.4, Math.PI, MINT], [-13, 4, Math.PI * .8, LEMON], [13, 3, -Math.PI * .8, GRAPE], [0, 22, Math.PI, BERRY]].forEach(([x, z, r, c]) => visitor(p, x, z, r, c));
  // the gate: two candy cane pillars and a beam of chocolate (its signs are live)
  for (const x of [-6.6, 6.6]) { for (let k = 0; k < 10; k++) p.box(x, .2 + k * .64, 27, 1.6, .64, 1.6, k % 2 ? BERRY : WHITE); p.ball(x, 6.6, 27, 1.6, 1.6, PINK); }
  p.box(0, 4.6, 27, 15.2, 2, .8, CHOCO); p.box(0, 6.6, 27, 15.6, .3, 1, ICING);
}

export function candyHouseLive(group) {
  const big = '900 {px}px "Secular One", Rubik', FZ = HZ + HD / 2 + .12;
  group.add(sign('בית הממתקים של הממלכה 🍭', { w: 11.2, h: 1.5, bg: '#5a3420', fg: '#ffd7e4', border: '#f3a6b8', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @itamarsarusi · אדריכל', { w: 8.6, h: .9, bg: '#f3a6b8', fg: '#5a3420', border: '#5a3420' }).at(0, 3.55, 27.42));
  group.add(sign('כנסו, יש סוכריות 🍬', { w: 5.6, h: 1, bg: '#ffffff', fg: '#d8443a', border: '#d8443a', font: big }).at(0, 8.1, FZ + .3));
  // the rolled net of the trap, hanging under the roof's front edge, swaying a little
  const net = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: 0x8a6a3e });
  for (let k = 0; k < 9; k++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, 2.2, 10), m); s.rotation.z = Math.PI / 2; s.position.set(-8 + k * 2, 0, 0); net.add(s); }
  net.position.set(0, WH - .6, FZ + 1.6); group.add(net);
  group.userData.tick = t => { net.rotation.x = Math.sin(t * 1.3) * .05; };
  group.userData.tick(0);
}

export const CANDYHOUSE = { key: 'candy-house', name: 'בית הממתקים של הממלכה', draw: drawCandyHouse, live: candyHouseLive, top: 22 };
