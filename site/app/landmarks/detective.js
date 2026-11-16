// משרד הבלשים של הממלכה: day 34. No comment on day 33's reel asked for a place, so the king picked (CLAUDE.md step 2):
// in season 1 (גנב הכתר) the kingdom gets a detectives' office, and the followers are its detectives. A two-storey brick
// house with a bay window and a green door, a giant magnifying glass on the roof, a striped awning, and in the yard a big
// board of clues (a feather, sugar crumbs, a hand and a foot print, a striped ball, a question mark, joined by red string),
// a reading lamp, a bench, a post box "קבלת רמזים", footprints on the path, two trees, visitors. Lot radius 30, front +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const BRICK = 0xb5583e, BRICK2 = 0x9c4a33, CREAM = 0xf3ead6, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, GREEN = 0x2f6b4f,
  WOOD = 0x8a6240, WOOD2 = 0x6e4a2e, GLASS = 0x9fd3e6, GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, CORK = 0xc89a62, RED = 0xd8443a,
  SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, ROOF = 0x4b5563;
const W = 22, D = 14, HZ = -6, H1 = 6, H2 = 12;                                  // the house: width, depth, centre z, storeys

function person(p, x, z, r, shirt, hat) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .9, .14, .9, hat ?? 0x4a3020); p.box(0, 2.8, 0, .62, .3, .62, hat ?? 0x4a3020);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .7 * s, 3 * s, WOOD); p.ball(x, 2.6 * s, z, 4 * s, 3.6 * s, LEAF); p.ball(x - .5 * s, 4 * s, z + .3 * s, 2.6 * s, 2.4 * s, 0x5fae55); }

export function drawDetectiveOffice(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  p.box(0, .2, 4, 30, .12, 10, PAVE); p.box(0, .2, 17, 4, .12, 18, PAVE);
  // footprints on the path, as if a detective walked it
  for (let k = 0; k < 10; k++) p.box((k % 2 ? .5 : -.5), .34, 25 - k * 1.6, .35, .04, .7, DARK);
  // the house: two brick storeys, cream corners and a cornice, a slate roof with two chimneys
  p.box(0, .2, HZ, W, H2, D, BRICK);
  for (let y = 1.2; y < H2; y += 1.4) p.box(0, y, HZ + D / 2 + .02, W, .12, .05, BRICK2);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(sx * W / 2, .2, HZ + sz * D / 2, .9, H2, .9, CREAM);
  p.box(0, H1, HZ, W + .6, .5, D + .6, CREAM); p.box(0, H2 + .2, HZ, W + 1.2, .8, D + 1.2, CREAM);
  for (let row = 0; row < 5; row++) p.box(0, H2 + 1 + row * 1, HZ, W + 1 - row * 2.6, 1, D + 1 - row * 2.6, row % 2 ? ROOF : 0x5b6472);
  for (const x of [-7, 7]) { p.box(x, H2 + 1, HZ - 3, 1.8, 6, 1.8, BRICK2); p.box(x, H2 + 7, HZ - 3, 2.2, .5, 2.2, CREAM); }
  const FZ = HZ + D / 2 + .1;
  // the ground floor: a green door with a fanlight and brass knocker, a bay window full of books, steps
  p.box(0, .2, FZ, 3.6, 5, .3, GREEN); p.cyl(0, 5.2, FZ, 3.6, .3, GLASS, 12); p.ball(0, 2.8, FZ + .25, .45, .45, GOLD); p.ball(1.2, 2.4, FZ + .25, .3, .3, GOLD);
  for (let k = 0; k < 3; k++) p.box(0, .2 + k * .25, FZ + .6 + (2 - k) * .5, 5 - k * .4, .25, 1, PAVE);
  p.box(-6.5, .8, FZ + 1.2, 6, 4, 2.2, CREAM); p.box(-6.5, 1.4, FZ + 2.32, 5.2, 3, .1, GLASS);
  for (let k = 0; k < 5; k++) p.box(-8.6 + k * 1.05, 1.6, FZ + 2.2, .7, 1 + (k % 3) * .3, .5, [RED, NAVY, TEAL, GOLD, GREEN][k]);
  p.box(-6.5, 4.8, FZ + 1.2, 6.4, .4, 2.6, CREAM);
  // the awning over the right window: navy and cream stripes
  p.box(6.5, 1.4, FZ + .05, 5.2, 3, .1, GLASS); p.box(6.5, 1.2, FZ + .3, 5.6, .3, .6, CREAM);
  for (let k = 0; k < 6; k++) p.box(4.2 + k * .93, 4.6, FZ + .9, .93, .2, 1.8, k % 2 ? CREAM : NAVY, 0);
  // the first floor: four sash windows with shutters
  for (const x of [-7.5, -2.5, 2.5, 7.5]) { p.box(x, H1 + 1.4, FZ, 2.4, 3.2, .1, GLASS); p.box(x, H1 + 3, FZ + .05, 2.4, .15, .1, CREAM); p.box(x, H1 + 1.2, FZ + .15, 2.8, .3, .4, CREAM);
    for (const s of [-1, 1]) p.box(x + s * 1.6, H1 + 1.4, FZ + .1, .7, 3.2, .1, TEAL); }
  // the giant magnifying glass on the roof: a gold ring, a pale lens and a navy handle
  p.box(0, H2 + 6, HZ, 1, 3, 1, NAVY);
  for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; p.box(Math.sin(a) * 3.4, H2 + 11 + Math.cos(a) * 3.4, HZ + .6, 1.1, 1.1, .8, GOLD, 0); }
  // the board of clues in the yard: a cork board on two posts, pinned cards with each clue drawn on them, red strings
  const BX = 8, BZ = 8, BY = 3.4;
  for (const x of [BX - 5.6, BX + 5.6]) p.box(x, .2, BZ, .5, 7.4, .5, WOOD2);
  p.box(BX, BY - .2, BZ, 11.8, 6.8, .4, WOOD); p.box(BX, BY, BZ + .22, 11, 6.4, .1, CORK);
  const card = (x, y, c = WHITE) => { p.box(x, y, BZ + .3, 2.4, 2, .06, c); p.ball(x, y + 1.85, BZ + .38, .25, .25, RED); };
  card(BX - 3.6, BY + 3.6); p.box(BX - 3.6, BY + 4.2, BZ + .36, .25, 1.4, .05, 0xe7a3c9); p.box(BX - 3.4, BY + 4.5, BZ + .37, .5, .8, .05, 0x7cc4ea);       // the feather
  card(BX + 3.6, BY + 3.6); for (let k = 0; k < 7; k++) p.box(BX + 2.8 + (k % 4) * .5, BY + 4 + Math.floor(k / 4) * .6, BZ + .36, .22, .22, .05, [0xf3a6b8, 0x8fdcc0, 0xf6d84a, 0xa77bd6][k % 4]); // crumbs
  card(BX - 3.6, BY + .4); p.box(BX - 3.9, BY + .9, BZ + .36, .5, .55, .05, DARK); p.box(BX - 3.2, BY + .8, BZ + .36, .4, .7, .05, DARK);              // hand and foot
  card(BX + 3.6, BY + .4); p.cyl(BX + 3.6, BY + 1.3, BZ + .36, .9, .06, RED, 12); p.box(BX + 3.6, BY + 1.3, BZ + .4, .9, .3, .05, GOLD);           // the ball
  card(BX, BY + 2, GOLD);                                                                                                                            // ? (live)
  for (const [x0, y0] of [[BX - 3.6, BY + 4.6], [BX + 3.6, BY + 4.6], [BX - 3.6, BY + 1.4], [BX + 3.6, BY + 1.4]]) {   // red string, in steps
    const xm = BX + Math.sign(x0 - BX) * 1.2; p.box((x0 + xm) / 2, y0, BZ + .4, Math.abs(x0 - xm), .08, .04, RED);
    p.box(xm, Math.min(y0, BY + 2.9), BZ + .4, .08, Math.abs(y0 - (BY + 2.9)), .04, RED); }
  // a reading lamp, a bench, the post box for clues, trees, visitors in detective hats
  p.cyl(-12, .2, 10, .3, 5, DARK); p.box(-11.3, 5, 10, 1.6, .2, .3, DARK); p.cone(-10.6, 4.2, 10, 1.6, 1, GOLD); p.ball(-10.6, 4, 10, .7, .7, 0xfff2c4);
  p.box(-10, .5, 13, 4.4, .3, 1.2, WOOD); p.box(-10, 1.1, 12.5, 4.4, .9, .2, WOOD);
  p.box(-4.5, .2, 22, 1.4, 3, 1.2, RED); p.box(-4.5, 3.2, 22, 1.6, .4, 1.4, GOLD); p.box(-4.5, 2.4, 22.62, .9, .15, .05, DARK);
  for (const [x, z, s] of [[-20, 0, 1.2], [20, -2, 1.1], [-18, -18, 1], [18, -17, 1.1], [-22, 14, .8], [22, 15, .9]]) tree(p, x, z, s);
  [[6, 13, Math.PI, NAVY, GOLD], [8.4, 13.6, Math.PI, TEAL, 0x6b4a2e], [10.6, 12.8, Math.PI * .95, 0xf3a6b8, 0x4a3020], [-2, 19, Math.PI, RED, 0x4a3020], [2.6, 24, Math.PI, GREEN, 0x6b4a2e], [-9, 13.2, 0, 0x8fdcc0, 0x4a3020]]
    .forEach(([x, z, r, c, h]) => person(p, x, z, r, c, h));
  // the gate: two brick posts and a navy beam (its signs are live)
  for (const x of [-6.4, 6.4]) { p.box(x, .2, 27, 1.8, 7, 1.8, BRICK); p.box(x, 7.2, 27, 2.2, .5, 2.2, CREAM); p.ball(x, 7.9, 27, 1, 1, GOLD); }
  p.box(0, 4.4, 27, 14.6, 2.2, .8, NAVY); p.box(0, 6.6, 27, 15, .3, 1, GOLD);
}

export function detectiveOfficeLive(group) {
  const big = '900 {px}px "Secular One", Rubik', FZ = HZ + D / 2 + .1;
  group.add(sign('משרד הבלשים של הממלכה 🔍', { w: 11.6, h: 1.5, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('הבלשים: אתם! 🕵️', { w: 6.4, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('בלשים 🔍', { w: 3.4, h: .9, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 5.9, FZ + .22));
  group.add(sign('?', { w: 2.2, h: 1.8, bg: '#e8b323', fg: '#13213b', border: '#e8b323', font: big }).at(8, 5.4, 8.36));
  group.add(sign('לוח הרמזים', { w: 6, h: .9, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(8, 7.3, 8.46));
  group.add(sign('קבלת רמזים ✉️', { w: 2.2, h: .7, bg: '#ffffff', fg: '#d8443a', border: '#d8443a' }).at(-4.5, 1.6, 22.64));
  // the lens of the roof's magnifying glass glints round and round
  const glint = new THREE.Mesh(new THREE.BoxGeometry(.5, 4.6, .1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 }));
  glint.position.set(0, H2 + 11, HZ + .9); group.add(glint);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(3.1, 24), new THREE.MeshLambertMaterial({ color: 0x9fd3e6, side: THREE.DoubleSide })); lens.position.set(0, H2 + 11, HZ + .6); group.add(lens);
  group.userData.tick = t => { glint.rotation.z = t * .8; };
  group.userData.tick(0);
}

export const DETECTIVE = { key: 'detective-office', name: 'משרד הבלשים של הממלכה', draw: drawDetectiveOffice, live: detectiveOfficeLive, top: 32 };
