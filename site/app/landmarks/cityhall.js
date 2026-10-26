// עיריית ספיר: day 13, @ofek_bell's comment "תבנה את עיריית הממלכה של ספיר ושם תבקש מכולם לכתוב עובד ואז הם יעבדו שם".
// A grand cream town hall of three storeys with a white columned portico and a pediment, a tall clock tower in the middle
// with clocks on four sides, a navy spire and a gold ball, flags, a wide stair with a red carpet up to the doors, and on
// the top floor the president's office with its balcony and a gold door, waiting for the winner of the elections. In the
// square: a hiring desk with a queue ("דרושים עובדים": a comment "עובד" gets you a job here), clerks with briefcases, a
// fountain, benches, lamps, trees. Lot radius 30, front toward +z.
import { sign } from '../sign.js';
const CREAM = 0xf3e9d2, CREAM2 = 0xe2d5b8, WHITE = 0xf7f5ee, ROOF = 0xb5462f, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, WIN = 0x2c3e50,
  GLASS = 0x8fc3d8, RED = 0xc8102e, PAVE = 0xe9e0cc, STONE = 0xd2c6ae, GRASS = 0x86c766, WOOD = 0x8a6240, DARK = 0x3a3f45, SKIN = 0xe2b48f, WATER = 0x3fa9d6;
const W = 42, D = 16, Z = -8, F = 3.4;                  // the hall's width, depth, centre z, storey height
export const BALCONY = [0, 2 * F + 1.2, Z + D / 2 + 2.2];   // the president's balcony (local)

function person(p, x, z, r, shirt, { case: bag = false, h = 1 } = {}) {
  p.at(x, z, r); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
  p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020);
  if (bag) { p.box(.8, 1.4, 0, .25, 1, .25, shirt); p.box(.85, .7, 0, .3, .8, 1.1, 0x5a3a22); }
  p.at(0, 0, 0);
}
export function drawCityhall(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 60, .08, 60, GRASS); p.box(0, .08, 8, 54, .12, 30, PAVE);
  for (let x = -24; x <= 24; x += 4) for (let z = -6; z <= 22; z += 4) if (((x + z) / 4) % 2 === 0) p.box(x, .2, z, 3.8, .02, 3.8, 0xdcd1bb);
  // the hall: plinth, three storeys, a cornice, a red hipped roof
  p.box(0, 0, Z, W + 2, 1.2, D + 2, STONE);
  p.box(0, 1.2, Z, W, 3 * F, D, CREAM);
  for (let f = 1; f < 3; f++) p.box(0, 1.2 + f * F - .15, Z, W + .4, .3, D + .4, CREAM2);
  p.box(0, 1.2 + 3 * F, Z, W + 1.2, .8, D + 1.2, CREAM2);
  p.pyramid(-W / 4, 2 + 3 * F, Z, W / 2 * .95, 5, ROOF); p.pyramid(W / 4, 2 + 3 * F, Z, W / 2 * .95, 5, ROOF);
  // windows on every storey, front and back, and the sides
  for (let f = 0; f < 3; f++) for (let k = 0; k < 10; k++) { const x = -W / 2 + 2.6 + k * ((W - 5.2) / 9); if (Math.abs(x) < 6 && f < 3) continue;
    for (const s of [1, -1]) { p.box(x, 1.2 + f * F + .7, Z + s * (D / 2 + .05), 1.5, 2, .2, WIN); p.box(x, 1.2 + f * F + .55, Z + s * (D / 2 + .15), 1.9, .2, .3, WHITE); } }
  for (let f = 0; f < 3; f++) for (const s of [-1, 1]) for (const z of [Z - 4, Z, Z + 4]) p.box(s * (W / 2 + .05), 1.2 + f * F + .7, z, .2, 2, 1.5, WIN);
  // the portico: a stair, six white columns, the pediment, the doors with a red carpet
  for (let k = 0; k < 4; k++) p.box(0, k * .3, Z + D / 2 + 5.2 - k * .9, 18, .3, 1.2 + k * .9, STONE);
  p.box(0, 1.2, Z + D / 2 + 1.8, 15, .3, 4.2, WHITE);
  for (let k = 0; k < 6; k++) { const x = -6.5 + k * 2.6; p.cyl(x, 1.5, Z + D / 2 + 3.2, 1.1, 2 * F - .6, WHITE); p.box(x, 1.5, Z + D / 2 + 3.2, 1.4, .4, 1.4, CREAM2); p.box(x, 2 * F + .5, Z + D / 2 + 3.2, 1.4, .4, 1.4, CREAM2); }
  p.box(0, 2 * F + .9, Z + D / 2 + 2.2, 16, .7, 4.6, CREAM2);
  p.gable(0, 3 * F + 1.2, Z + D / 2 + 1.6, 4, 3.4, 16, CREAM, Math.PI / 2);
  p.box(0, 1.5, Z + D / 2 + .1, 4, 4.4, .3, WOOD); p.box(0, 5.9, Z + D / 2 + .1, 4.4, .6, .35, GOLD); p.box(0, 1.5, Z + D / 2 + .25, .15, 4.4, .2, 0x5a3a22);
  p.box(0, .02, Z + D / 2 + 6, 3, .05, 12, RED); p.box(0, 1.52, Z + D / 2 + 1.8, 3, .03, 4.2, RED);
  // the president's office on the top floor: a gold door onto the balcony over the portico, a balustrade, a crown
  const [bx, by, bz] = BALCONY;
  p.box(bx, by + .3, Z + D / 2 + .1, 3, 2.6, .3, GOLD); p.box(bx, by + 2.9, Z + D / 2 + .15, 3.6, .4, .35, NAVY);
  for (let k = 0; k < 11; k++) p.cyl(bx - 6 + k * 1.2, by + .3, bz + 2, .35, 1.1, WHITE); p.box(bx, by + 1.4, bz + 2, 14, .3, .5, WHITE);
  p.box(bx + 4, by + .3, bz, 1.6, 1, .9, WOOD); p.box(bx + 4, by + 1.3, bz - .4, 1.6, 1.6, .2, RED);   // the empty presidential chair, waiting
  // the clock tower: rising from the roof, clocks on four sides, the belfry, a navy spire, a gold ball and a flag
  const tz = Z - 1, th = 1.2 + 3 * F;
  p.box(0, th, tz, 8, 14, 8, CREAM); p.box(0, th + 14, tz, 8.8, .6, 8.8, CREAM2);
  for (const [dx, dz, r] of [[0, 4.1, 0], [0, -4.1, 0], [4.1, 0, Math.PI / 2], [-4.1, 0, Math.PI / 2]]) {
    p.box(dx, th + 8.5, tz + dz, 4.6, 4.6, .3, GOLD, r); p.box(dx * 1.01, th + 8.8, tz + dz * 1.01, 4, 4, .3, WHITE, r);
    const ox = Math.sign(dx) * .2, oz = Math.sign(dz) * .2; p.box(dx + ox, th + 10.6, tz + dz + oz, .3, 1.8, .2, NAVY, r); p.box(dx + ox + (r ? 0 : .7), th + 10.6, tz + dz + oz + (r ? .7 : 0), 1.4, .3, .2, NAVY, r);
    p.box(dx * .98, th + 3, tz + dz * .98, 1.4, 2.4, .3, WIN, r); }
  p.box(0, th + 14.6, tz, 7, 5, 7, CREAM2);
  for (const [dx, dz] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]) p.box(dx, th + 14.6, tz + dz, 1.4, 5, 1.4, WHITE);
  p.box(0, th + 15.6, tz, 4, 3, 4, 0x6b4a33); p.cone(0, th + 15.8, tz, 2.4, 2.2, GOLD);   // the bell
  p.box(0, th + 19.6, tz, 7.8, .5, 7.8, CREAM2); p.pyramid(0, th + 20.1, tz, 6.6, 9, NAVY); p.ball(0, th + 29, tz, 1.6, 1.6, GOLD);
  p.box(0, th + 30.4, tz, .25, 5, .25, DARK); p.box(1.6, th + 33.4, tz, 3, 1.8, .1, TEAL); p.box(1.6, th + 33.4, tz + .02, 3, .6, .1, GOLD);
  // flags in front, lamps, benches, trees
  for (const x of [-12, -9, 9, 12]) { p.box(x, 0, 6, .3, 11, .3, 0xb9c1c8); p.box(x + 1.3, 9, 6, 2.4, 1.6, .08, [NAVY, TEAL, GOLD, RED][(x + 12) % 4]); p.ball(x, 11, 6, .5, .5, GOLD); }
  for (const x of [-22, -16, 16, 22]) for (const z of [4, 18]) { p.box(x, 0, z, .3, 4.6, .3, NAVY); p.ball(x, 4.6, z, .9, 1, 0xfff3b0); }
  for (const [x, z, r] of [[-19, 11, Math.PI / 2], [19, 11, -Math.PI / 2], [-6, 22, Math.PI], [6, 22, Math.PI]]) { p.at(x, z, r); p.box(0, .5, 0, 3.4, .3, 1.1, WOOD); p.box(0, .8, -.5, 3.4, .9, .2, WOOD); p.box(-1.5, 0, 0, .3, .5, .9, DARK); p.box(1.5, 0, 0, .3, .5, .9, DARK); p.at(0, 0, 0); }
  for (const [x, z] of [[-27, 20], [27, 20], [-27, -4], [27, -4], [-26, -22], [26, -22], [0, -24]]) p.tree(x, z, 1.1);
  // the fountain in the square
  p.cyl(14, .2, 15, 8, 1, STONE); p.cyl(14, .3, 15, 7.2, .95, WATER); p.cyl(14, .3, 15, 1.4, 3, STONE); p.ball(14, 3.2, 15, 1.6, 1.2, GOLD);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; p.ball(14 + Math.sin(a) * 2, 2.4, 15 + Math.cos(a) * 2, .6, .8, 0xbfe6f5); }
  // the hiring desk with its awning, the clerk behind it, and the queue of people who want a job
  p.box(-14, 0, 14, 7, 1.6, 2, WOOD); p.box(-14, 1.6, 14, 7.4, .2, 2.4, WHITE); for (const x of [-17.4, -10.6]) p.box(x, 0, 13, .25, 4.6, .25, DARK);
  for (let k = 0; k < 6; k++) p.box(-17.1 + k * 1.24, 4.4, 13.2, 1.24, .5, 3.4, k % 2 ? WHITE : TEAL);
  p.box(-15.5, 1.8, 14, .9, .2, 1.2, WHITE); p.box(-12.6, 1.8, 14.2, .5, .6, .5, NAVY);   // papers, a stamp
  person(p, -14, 12.4, 0, 0xffffff);
  for (let k = 0; k < 6; k++) person(p, -14 + Math.sin(k) * .4, 16.5 + k * 1.6, Math.PI, [RED, 0x3b6fb6, GOLD, 0x7a4f9a, 0x4f9a43, 0xf29bb7][k], { case: k % 2 === 0 });
  person(p, 4, 12, -2.8, NAVY, { case: true }); person(p, -3.5, 10, 2.9, 0x3b6fb6, { case: true }); person(p, 8, 20, 3.1, 0xc2412d); person(p, 10, 8, -1.2, 0x4f9a43, { h: .8 });
}
export function cityhallLive(group) {
  const [bx, by, bz] = BALCONY;
  group.add(sign('עיריית ספיר 🏛️', { w: 13, h: 2.2, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 3 * F + 2.8, Z + D / 2 + 3.75));
  group.add(sign('לשכת הנשיא 👑 · מחר נדע מי', { w: 6.4, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(bx, by + 1.0, bz + 2.6));
  group.add(sign('רעיון של @ofek_bell · אדריכל', { w: 8, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, .9, Z + D / 2 + 9.8));
  group.add(sign('דרושים עובדים! 💼', { w: 6.4, h: 1.5, bg: '#c8102e', fg: '#ffffff', border: '#ffffff', font: '900 {px}px "Secular One", Rubik' }).at(-14, 3.6, 15.1));
  group.add(sign('תגיבו "עובד" ותקבלו עבודה', { w: 6.4, h: .8, bg: '#ffffff', fg: '#13213b', border: '#13213b' }).at(-14, 1, 15.05));
}
export const CITYHALL = { key: 'cityhall', name: 'עיריית ספיר', draw: drawCityhall, live: cityhallLive, top: 52 };
