// ספירמול: day 7 (@alin_vasan named it, "תבנה קניון בשם ספירמול"; @maya2006888 asked for "קניון גדול כמו שיש באילת"),
// the kingdom's mall and the sponsor of מכבי ספיר. A long cream building on two floors with a row of shop fronts and
// striped awnings, a tall glass atrium with a dome in the middle, a cinema wing with its marquee, a giant ice cream cone
// on the kiosk out front, a three-tier fountain on the plaza, shoppers with bags, benches, palms and מכבי's green and
// white flags. No real brand's marks anywhere. Lot radius 26, front toward +z.
import { sign } from '../sign.js';
const CREAM = 0xfbf3e2, SAND = 0xead9b8, GLASS = 0x8fc3d8, GLASS2 = 0xb7dbe8, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323,
  GREEN = 0x1f8a4c, WHITE = 0xf7f7f2, DARK = 0x3a3f45, PAVE = 0xe8dfcf, STONE = 0xd9cdb6, WATER = 0x5fb7d6, SKIN = 0xe2b48f,
  LEAF = 0x4f9a43, PALM = 0x3f8f3a, TRUNK = 0x8a6a46, RED = 0xc8102e, PINK = 0xf29bb7, CONE = 0xd9a05b, BERRY = 0xd65a8a;
const AWNINGS = [[RED, WHITE], [TEAL, WHITE], [GOLD, WHITE], [0x3b6fb6, WHITE], [PINK, WHITE], [GREEN, WHITE]];
const SHIRTS = [RED, TEAL, 0x3b6fb6, GOLD, 0x7a4f9a, GREEN, PINK];
const SHOPS = ['צעצועים', 'בגדים', 'ספרים', 'נעליים', 'פיצה', 'ממתקים'];

function shopper(p, x, z, rot, shirt, bag) {
  p.at(x, z, rot);
  p.box(-.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(.3, 0, 0, .45, 1.4, .5, 0x2a3550);
  p.box(0, 1.4, 0, 1.2, 1.4, .8, shirt); p.box(0, 2.8, 0, .9, .9, .9, SKIN); p.box(0, 3.6, 0, .95, .25, .95, 0x4a3020);
  if (bag) { p.box(.85, 1.1, 0, .25, 1.1, .2, SKIN); p.box(.95, .6, 0, .3, .9, .9, bag); }
  p.at(0, 0, 0);
}
function palm(p, x, z) {
  for (let k = 0; k < 5; k++) p.cyl(x + k * .08, k * 1.6, z, .7 - k * .06, 1.6, TRUNK);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; p.box(x + .4 + Math.cos(a) * 1.6, 7.6, z + Math.sin(a) * 1.6, 3.4, .3, 1, PALM, -a); }
  p.ball(x + .4, 7.6, z, 1.2, 1, 0x7a5a2a);
}
export function drawSpirmall(p) {
  p.at(0, 0, 0);
  // the ground: a lawn, the paved plaza in front, a path to the road, flower beds
  p.box(0, 0, 0, 52, .08, 52, 0x86c766);
  p.box(0, .08, 10, 48, .08, 22, PAVE); p.box(0, .08, 22.5, 8, .08, 5, PAVE);
  for (let i = -4; i <= 4; i++) p.box(i * 5, .17, 10, .15, .02, 22, STONE);
  for (const x of [-20, 20]) { p.box(x, .08, 16, 6, .5, 6, 0x7a5a3a); for (let k = 0; k < 6; k++) p.ball(x - 2 + (k % 3) * 2, .5, 14.5 + Math.floor(k / 3) * 3, 1.3, 1.1, [PINK, GOLD, RED, 0xffffff, 0x9b6fd0, PINK][k]); }
  // the mall: two floors of cream walls, a gold band between them, a flat roof with its parapet
  p.box(0, .16, -9, 46, 9, 20, CREAM); p.box(0, 4.4, -9, 46.4, .6, 20.4, GOLD); p.box(0, 9.16, -9, 46.6, .8, 20.6, SAND);
  // the shop fronts on the ground floor: glass, a door, a striped awning and a little sign each (three each side of the atrium)
  const fronts = [-20, -15, -10, 10, 15, 20];
  fronts.forEach((x, k) => {
    p.box(x, .3, 1.05, 4.2, 3.6, .15, GLASS); p.box(x, .3, 1.1, 1.4, 2.6, .12, GLASS2); p.box(x - 2.3, .16, 1.1, .4, 4.2, .4, SAND);
    const [a, b] = AWNINGS[k];
    for (let s = 0; s < 6; s++) p.box(x - 1.75 + s * .7, 3.6, 2.1, .7, .2, 2, s % 2 ? b : a, 0);
    p.box(x, 3.4, 3.05, 4.2, .4, .1, a);
    // the window displays: a shelf, two goods on it
    p.box(x - 1.2, .3, .3, 1.2, .9, .8, SAND); p.ball(x - 1.4, 1.2, .3, .6, .6, a); p.box(x + 1.2, .3, .3, 1, 1.4, .6, b === WHITE ? a : b);
  });
  // upper floor windows all along the front
  for (let x = -21; x <= 21; x += 3) if (Math.abs(x) > 7) { p.box(x, 5.4, 1.05, 2.2, 2.6, .15, GLASS); p.box(x, 5.2, 1.15, 2.6, .2, .3, SAND); }
  // the atrium: a tall glass hall in the middle with a dome, ribs, and the entrance with its canopy and revolving door
  p.box(0, .16, -6, 13, 14, 15, GLASS2); for (const x of [-6.5, -3.25, 0, 3.25, 6.5]) p.box(x, .16, 1.55, .5, 14, .5, WHITE);
  for (const y of [4.6, 9.2]) p.box(0, y, 1.6, 13.2, .4, .4, WHITE);
  p.box(0, 14.16, -6, 13.6, .8, 15.6, WHITE); p.ball(0, 14.6, -6, 11, 7, GLASS); for (let k = 0; k < 6; k++) p.box(0, 14.6, -6, .3, 3.6, 11.2, WHITE, k * Math.PI / 6);
  p.ball(0, 18, -6, 1.6, 1.6, GOLD); p.cone(0, 19.2, -6, .8, 2.4, GOLD);
  p.cyl(0, .16, 2.4, 3.6, 3.2, GLASS); p.box(0, .16, 2.4, .2, 3.2, 3.4, WHITE); p.box(0, 3.4, 4, 9, .4, 4.4, NAVY); p.box(-4.3, .16, 5.9, .3, 3.3, .3, NAVY); p.box(4.3, .16, 5.9, .3, 3.3, .3, NAVY);
  // inside the atrium, seen through the glass: an escalator, a balcony, a palm in a pot
  p.box(-3, .2, -6, 2, 5.4, 9, DARK, 0); p.box(-3, 4.4, -10, 7, .4, 4, SAND); p.cyl(3.5, .2, -3, 1.6, 1.2, 0xb36b3a); palm(p, 3.5, -3);
  // the cinema wing on the west end: taller, navy, with a marquee, posters and lights
  p.box(-19, .16, -9, 9, 13, 18, NAVY); p.box(-19, 13.16, -9, 9.4, .6, 18.4, GOLD);
  p.box(-19, 7.5, 0.5, 9.4, 2.6, 1.2, GOLD); for (let k = 0; k < 11; k++) p.ball(-23.4 + k * .88, 7.4, 1.2, .35, .35, 0xfff3b0);
  for (const x of [-22, -16]) { p.box(x, 1, .05, 2.4, 3.4, .2, GOLD); p.box(x, 1.2, .2, 2, 3, .1, [0x7a4f9a, TEAL][x === -22 ? 0 : 1]); p.ball(x, 2.4, .3, 1, 1, GOLD); }
  // a giant popcorn bucket on the cinema's roof, red and white stripes, popcorn spilling over
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; p.box(-19 + Math.cos(a) * 2.1, 13.8, -9 + Math.sin(a) * 2.1, 1.15, 5, .3, k % 2 ? WHITE : RED, -a + Math.PI / 2); }
  p.cyl(-19, 13.8, -9, 4, 4.8, RED);
  for (let k = 0; k < 14; k++) { const a = k * 2.4, r = (k % 4) * .6; p.ball(-19 + Math.cos(a) * r, 18.4 + (k % 3) * .4, -9 + Math.sin(a) * r, 1.1, 1, 0xfff1c9); }
  // the ice cream kiosk on the plaza (east), with a giant cone on its roof
  p.box(15, .16, 12, 6, 3, 4, WHITE); p.box(15, .16, 14.05, 6, 1.2, .1, PINK); p.box(15, 1.4, 14.05, 4.4, 1.4, .1, GLASS);
  for (let s = 0; s < 8; s++) p.box(12.4 + s * .75, 3.16, 14.4, .75, .2, 1.6, s % 2 ? WHITE : PINK);
  p.box(15, 3.16, 12, 6.4, .4, 4.4, PINK);
  for (let k = 0; k < 6; k++) p.cyl(15, 3.56 + k * .7, 12, .5 + k * .46, .72, k % 2 ? CONE : 0xc98f4e); p.ball(15, 7.6, 12, 3, 2.4, PINK); p.ball(15, 9.4, 12, 2.4, 2, 0xfff1d6); p.ball(15, 10.9, 12, 1.6, 1.4, BERRY); p.ball(15, 11.9, 12, .6, .6, RED);
  // the fountain in the middle of the plaza: a round pool, three tiers, water falling
  p.cyl(0, .16, 13, 11, .9, STONE); p.cyl(0, .3, 13, 10, .7, WATER);
  p.cyl(0, .6, 13, 1, 3, STONE); p.cyl(0, 3.6, 13, 6, .5, STONE); p.cyl(0, 3.7, 13, 5.4, .45, WATER);
  p.cyl(0, 4.1, 13, .7, 2, STONE); p.cyl(0, 6.1, 13, 3.4, .4, STONE); p.cyl(0, 6.2, 13, 2.9, .35, WATER); p.cyl(0, 6.5, 13, .4, 1.4, STONE);
  p.ball(0, 7.8, 13, 1.2, 1.6, 0xbfe6f2);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; p.box(Math.cos(a) * 2.9, 1, 13 + Math.sin(a) * 2.9, .25, 2.7, .25, 0xbfe6f2); }
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + .3; p.box(Math.cos(a) * 1.6, 4.2, 13 + Math.sin(a) * 1.6, .2, 2, .2, 0xbfe6f2); }
  // benches round the fountain, and lamps
  for (const [x, z, r] of [[-7, 13, Math.PI / 2], [7, 13, -Math.PI / 2], [-5, 19, 0], [5, 19, 0]]) { p.at(x, z, r); p.box(0, .5, 0, 3, .3, 1, TRUNK); p.box(0, .8, -.45, 3, .9, .15, TRUNK); p.box(-1.3, 0, 0, .2, .5, .8, DARK); p.box(1.3, 0, 0, .2, .5, .8, DARK); p.at(0, 0, 0); }
  for (const x of [-11, 11]) for (const z of [6, 20]) { p.cyl(x, 0, z, .3, 5, DARK); p.ball(x, 5, z, 1, 1, 0xfff3b0); }
  // מכבי's flags on poles at the edge of the plaza, green and white, and the big rooftop sign's frame
  for (const x of [-22, -8, 8, 22]) { p.box(x, 0, 23.5, .25, 8, .25, DARK); p.box(x + .9, 5.6, 23.5, 1.6, 2.2, .1, GREEN); p.box(x + .9, 6.3, 23.55, 1.6, .7, .1, WHITE); }
  // shoppers with their bags, a family by the kiosk, kids at the fountain
  [[-4, 7, .4], [3.5, 6, Math.PI - .5], [-9, 18, 2.4], [9, 8, -1], [-14, 9, .2], [12, 17, 3], [18, 9, -2.6], [-17, 5, 1.2]]
    .forEach(([x, z, r], k) => shopper(p, x, z, r, SHIRTS[k % 7], [GOLD, PINK, TEAL, RED, WHITE][k % 5]));
  shopper(p, 14, 16, Math.PI, SHIRTS[3]); shopper(p, 16.2, 16.4, Math.PI, SHIRTS[5]);
  p.at(-3, 18.4, 0); p.box(0, 0, 0, .6, 1.4, .6, SHIRTS[6]); p.ball(0, 1.6, 0, .7, .7, SKIN); p.at(0, 0, 0);
  // palms along the front and trees behind
  for (const x of [-24, -12.5, 12.5, 24]) palm(p, x, 4.5);
  for (const [x, z] of [[-23, -22], [-8, -23], [8, -23], [23, -22]]) p.tree(x, z, .9, LEAF);
}
export function spirmallLive(group) {
  group.add(sign('ספירמול', { w: 12, h: 3.4, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 10.9, 1.95));
  group.add(sign('הספונסר הרשמי של מכבי ספיר ⚽', { w: 12.6, h: 1.4, bg: '#1f8a4c', fg: '#ffffff', border: '#f7f7f2' }).at(0, 3.85, 6.25));
  group.add(sign('הספונסר הרשמי של מכבי ספיר 💚🤍', { w: 12.4, h: 2, bg: '#1f8a4c', fg: '#ffffff', border: '#f7f7f2' }).at(0, 7, 1.95));
  group.add(sign('קולנוע', { w: 8.4, h: 2.2, bg: '#e8b323', fg: '#13213b', border: '#13213b', font: '900 {px}px "Secular One", Rubik' }).at(-19, 7.6, 1.15));
  group.add(sign('גלידה 🍦', { w: 5.6, h: 1.1, bg: '#ffffff', fg: '#d65a8a', border: '#f29bb7' }).at(15, 2.05, 14.15));
  [-20, -15, -10, 10, 15, 20].forEach((x, k) => group.add(sign(SHOPS[k], { w: 4, h: .9, bg: '#fffaf0', fg: '#13213b', border: '#e8b323' }).at(x, 4.95, 1.2)));
}
export const SPIRMALL = { key: 'spirmall', name: 'ספירמול', draw: drawSpirmall, live: spirmallLive, top: 20 };
