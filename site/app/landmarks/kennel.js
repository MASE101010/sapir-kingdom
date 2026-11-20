// תחנת כלבי הגישוש של הממלכה: day 37. Day 36's reel got no comment asking for a place, so the king picked (CLAUDE.md step 2):
// in season 1 (גנב הכתר) someone went into the mirror maze at night and never came out, leaving only a note in mirror
// writing, so the king builds a station of sniffer dogs to follow the scent. Lot 36 (r 18, in the band between two rows of
// houses): a big doghouse-shaped hall with a red roof and a giant bone over the door, a row of little kennels with dogs,
// a fenced training yard with hurdles, a tunnel, weave poles and a ramp, bowls, a trainer with a whistle, lamps, trees.
// Live: the signs and the dogs' wagging tails and sniffing noses.
// Lot radius 18, front toward +z.
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240, WOOD2 = 0x6e4a2e,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, SAND = 0xe9d29a,
  BROWN = 0xa5703f, TAN = 0xd9a86a, BLACK = 0x2a2a2a, SKY = 0x7cc4ea, PINK = 0xf3a6b8;

function person(p, x, z, r, shirt, s = .3) {
  p.at(x, z, r, s);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
// a dog: body, four legs, head with a snout and ears, a tail (s ~ 1 is a dog about 1 m long)
function dog(p, x, z, r, c, s0 = 1, c2 = BLACK) {
  const s = s0 * 1.8;
  p.at(x, z, r, .3); const b = (bx, by, bz, w, h, d, col) => p.box(bx * s, by * s, bz * s, w * s, h * s, d * s, col);
  dogBody(b, c, c2); p.at(0, 0, 0);
}
function dogBody(b, c, c2) {
  b(0, .45, 0, .45, .4, 1, c);
  for (const [lx, lz] of [[-.15, .35], [.15, .35], [-.15, -.35], [.15, -.35]]) b(lx, 0, lz, .13, .48, .13, c);
  b(0, .7, .6, .38, .38, .38, c); b(0, .68, .86, .2, .18, .22, TAN); b(0, .75, .98, .08, .07, .05, BLACK);
  b(-.17, .82, .55, .08, .26, .14, c2); b(.17, .82, .55, .08, .26, .14, c2);
  b(0, .7, -.6, .08, .3, .08, c);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawKennel(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 13.5, 4.4, .12, 9, PAVE); p.box(-1, .2, -1, 18, .12, 12, PAVE);
  // the hall: a giant doghouse, cream walls, a steep red roof, a round door, a bone over it, round windows
  p.box(-1, .3, -2.5, 14, 6.4, 9, CREAM); p.box(-1, .3, -2.5, 14.4, .5, 9.4, WOOD2);
  for (let k = 0; k < 6; k++) { const w = 15.4 - k * 2.6; p.box(-1, 6.6 + k * .75, -2.5, w, .75, 10, k % 2 ? 0xa83524 : RED);    // the stepped roof
    if (k < 5) p.box(-1, 6.6 + k * .75, 2.55, w - 2.4, .75, .3, CREAM); }
  p.box(-1, 11.1, -2.5, .8, .5, 10.2, WOOD2);
  p.box(-1, .3, 2.06, 3.6, 4.4, .2, WOOD2); p.box(-1, 4.7, 2.06, 2.6, .5, .2, WOOD2); p.box(-1, .3, 2.2, 2.8, 4.2, .12, 0x3a2614); p.box(-1, 4.5, 2.2, 1.8, .3, .12, 0x3a2614);
  for (const s of [-1, 1]) { p.box(-1 + s * 4.6, 2.4, 2.1, 2, 2, .2, WHITE); p.box(-1 + s * 4.6, 2.6, 2.2, 1.6, 1.6, .1, SKY);
    p.box(-1 + s * 4.6, 3.3, 2.26, 1.6, .12, .05, WHITE); p.box(-1 + s * 4.6, 2.6, 2.26, .12, 1.6, .05, WHITE); p.box(-1 + s * 4.6, 2.2, 2.4, 2.4, .2, .5, RED); }
  for (const s of [-1, 1]) { p.box(-1 + s * 7.1, .3, -2.5, .4, 6.4, 9.2, RED); }
  // the bone over the door
  p.box(-1, 5.6, 2.6, 3.4, .7, .5, WHITE); for (const s of [-1, 1]) for (const k of [-1, 1]) p.ball(-1 + s * 1.75, 5.55 + k * .38, 2.6, .9, .9, WHITE);
  // a paw print path to the door
  for (let k = 0; k < 6; k++) { const z = 3.4 + k * 1.6, x = -1 + (k % 2 ? .5 : -.5); p.cyl(x, .28, z, .7, .06, BROWN); for (const d of [-.3, 0, .3]) p.cyl(x + d, .28, z + .5, .22, .06, BROWN); }
  // the row of kennels on the right, each with a dog, a name plate and a bowl
  [[9.6, -6, 0, SAND, BROWN], [9.6, -1.8, 1, PINK, TAN], [9.6, 2.4, 2, SKY, BLACK], [9.6, 6.6, 3, 0xc9b2ec, WHITE]].forEach(([x, z, i, c, dc]) => {
    p.box(x, .3, z, 3, 2.2, 3, c); p.box(x, 2.5, z, 3.6, .5, 3.4, RED); p.box(x, 3, z, 2.4, .5, 3.4, 0xa83524); p.box(x, 3.5, z, 1.2, .4, 3.4, RED);
    p.box(x - 1.52, .3, z, .1, 1.5, 1.2, 0x3a2614); p.box(x - 1.56, 1.9, z, .1, .4, 1.6, WHITE);
    dog(p, x - 2.6, z, -Math.PI / 2, dc, .9, i % 2 ? BLACK : BROWN); p.cyl(x - 2.3, .3, z + 1.1, .7, .2, i % 2 ? RED : TEAL);
  });
  // the training yard on the left: a low fence, hurdles, a tunnel, weave poles, a ramp, a trainer and dogs
  for (let k = 0; k < 10; k++) { const z = -10 + k * 2.2; p.box(-15.6, .3, z, .2, 1.2, .2, WOOD); }
  p.box(-15.6, 1.2, 0, .12, .12, 20, WOOD); p.box(-15.6, .8, 0, .12, .12, 20, WOOD);
  for (let k = 0; k < 6; k++) { const x = -15.6 + k * 1.6; p.box(x, .3, -10.4, .2, 1.2, .2, WOOD); }
  p.box(-11.6, 1.2, -10.4, 8, .12, .12, WOOD);
  for (const [z, c] of [[-6.5, RED], [-3, GOLD]]) { for (const s of [-1, 1]) p.box(-11.6 + s * 1.2, .3, z, .15, 1.2, .15, WHITE); p.box(-11.6, 1, z, 2.6, .14, .14, c); }
  for (let k = 0; k < 6; k++) { const c = k % 2 ? TEAL : SKY; p.box(-12.2, .3, 1 + k * .45, .2, 1.3, .45, c); p.box(-11, .3, 1 + k * .45, .2, 1.3, .45, c); p.box(-11.6, 1.6, 1 + k * .45, 1.4, .2, .45, c); }   // the tunnel
  for (let k = 0; k < 6; k++) p.cyl(-13.8 + (k % 2) * .3, .3, -8.6 + k * 1, .14, 1.5, k % 2 ? RED : WHITE);     // weave poles
  for (let k = 0; k < 4; k++) p.box(-9, .3 + k * .25, 5.2 + k * .8, 1.4, .25, .8, WOOD); p.box(-9, 1.3, 9.1, 1.4, .25, 1.8, WOOD); p.box(-9, .3, 9.1, .2, 1, .2, WOOD2);
  dog(p, -11.6, -4.6, 0, BROWN, 1, BLACK); dog(p, -13.6, -5.4, 2.6, TAN, .8, BROWN); dog(p, -9, 9.1, Math.PI / 2, WHITE, .85, BLACK);
  person(p, -9.6, -7.4, -2.4, TEAL); p.box(-9.2, 2.4, -7.6, .14, .14, .3, GOLD);
  // the gate and the guard, the bench with a visitor and a puppy, bowls and a bone pile
  for (const s of [-1, 1]) { p.box(s * 2.6, .3, 18, .5, 2.6, .5, NAVY); p.ball(s * 2.6, 3.1, 18, .7, .7, GOLD); }
  p.box(0, 2.6, 18, 5.8, .6, .4, NAVY);
  person(p, 3.6, 16.2, 0, NAVY); dog(p, 2.4, 15.6, 0, BLACK, .8, BROWN);
  p.box(6.4, .5, 13.6, 3.2, .3, 1, WOOD, -.4); p.box(6.4, 1.05, 13.2, 3.2, .8, .2, WOOD, -.4); person(p, 6.2, 13.8, Math.PI - .4, PINK); dog(p, 7.6, 14.6, Math.PI, TAN, .55, BROWN);
  for (const [x, z, c] of [[4.4, 4, RED], [5.2, 4.6, TEAL], [4.8, 5.4, GOLD]]) { p.cyl(x, .28, z, 1.1, .25, c); p.cyl(x, .5, z, .9, .05, BROWN); }
  for (let k = 0; k < 5; k++) { p.box(4.6 + (k % 3) * .3, .4 + Math.floor(k / 3) * .25, 7.6, 1, .22, .22, WHITE, k * .7); }
  // lamps and trees round the plaza, a fire hydrant
  for (const [x, z] of [[-4.6, 16.6], [4.6, 11], [-14.6, 12], [14.6, -12], [0, -13.6]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  p.cyl(-3.8, .3, 9, .7, 1.2, RED); p.ball(-3.8, 1.5, 9, .6, .5, RED); p.box(-3.8, .9, 9, 1.1, .25, .25, GOLD);
  for (const [x, z, s] of [[14.6, 12, .9], [-14.2, -14, 1], [-6, -15, .8], [6.4, -15.4, .9], [15.4, -4, .7]]) tree(p, x, z, s);
}

export function kennelLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('כלבי הגישוש 🐕', { w: 5.6, h: 1.4, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(-1, 8.2, 2.75));
  group.add(sign('אימונים 🦴', { w: 3, h: .8, bg: '#ffffff', fg: '#0f6f73', border: '#0f6f73' }).at(-11.6, 2.6, 11.2));
  group.add(sign('הכלבים מוצאים הכול! 👃', { w: 4.6, h: .8, bg: '#c2412d', fg: '#ffffff', border: '#f6d84a' }).at(0, 3.4, 18.2));
}

export const KENNEL = { key: 'kennel', name: 'תחנת כלבי הגישוש של הממלכה', draw: drawKennel, live: kennelLive, top: 18 };
