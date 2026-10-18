// ספירדונלדס: day 6 (@alin_vasan, "מסעדת המבוגרים בשם ספירדונלדס"), the kingdom's own burger place and the sponsor of
// הפועל ספיר. A red and gold diner with a glass front, a giant burger on the roof and a giant box of fries, a drive-thru
// lane with its menu board, a terrace with umbrellas and diners, a little playground, parking, the club's red and black
// banners and a sign saying who it sponsors. No real brand's marks anywhere. Lot radius 26, front toward +z.
import { sign } from '../sign.js';
const RED = 0xc8102e, GOLD = 0xf2b632, CREAM = 0xfff6e6, DARK = 0x3a3f45, GLASS = 0x8fc3d8, ASPH = 0x5d6166, LINE = 0xf2f2f2,
  BUN = 0xd9963e, SESAME = 0xfff1c9, LETTUCE = 0x5fae3c, PATTY = 0x5a3220, CHEESE = 0xf7c531, TOMATO = 0xd8452f,
  BLACK = 0x1b1d21, SKIN = 0xe2b48f, WOOD = 0x8a6240, GREEN = 0x4f9a43, PAVE = 0xe5dccb;
const SHIRTS = [RED, 0x0f6f73, 0x3b6fb6, GOLD, 0x7a4f9a, 0x1f8a4c];

function diner(p, x, z, rot, shirt, sitting = true) {
  p.at(x, z, rot); const y = sitting ? .9 : 0;
  if (!sitting) { p.box(-.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(.3, 0, 0, .45, 1.4, .5, 0x2a3550); }
  else { p.box(-.3, .9, .5, .45, .45, 1, 0x2a3550); p.box(.3, .9, .5, .45, .45, 1, 0x2a3550); }
  p.box(0, y + .5, 0, 1.2, 1.4, .8, shirt); p.box(0, y + 1.9, 0, .9, .9, .9, SKIN); p.box(0, y + 2.7, 0, .95, .25, .95, 0x4a3020);
  p.box(.7, y + 1.2, .5, .35, .35, .7, SKIN); p.at(0, 0, 0);
}
/** a burger, s across, standing on y */
function burger(p, x, y, z, s) {
  p.cyl(x, y, z, s * .92, s * .18, BUN); p.cyl(x, y + s * .18, z, s, s * .06, LETTUCE); p.cyl(x, y + s * .24, z, s * .96, s * .16, PATTY);
  p.box(x, y + s * .4, z, s * .9, s * .04, s * .9, CHEESE, .3); p.cyl(x, y + s * .44, z, s * .9, s * .06, TOMATO);
  p.cyl(x, y + s * .5, z, s, s * .2, BUN); p.ball(x, y + s * .55, z, s, s * .45, BUN);
  for (let k = 0; k < 14; k++) { const a = k * 2.4, r = s * (.12 + (k % 4) * .09); p.ball(x + Math.cos(a) * r, y + s * .93 - (k % 4) * s * .05, z + Math.sin(a) * r, s * .07, s * .04, SESAME); }
}
export function drawSpirdonalds(p) {
  p.at(0, 0, 0);
  // the ground: parking in front with its lines, pavement round the restaurant, a lawn behind
  p.box(0, 0, 0, 52, .08, 52, 0x86c766);
  p.box(0, .08, 15, 40, .06, 14, ASPH); for (const x of [-15, -10, -5, 5, 10, 15]) p.box(x, .14, 17, .3, .02, 7, LINE);
  p.box(0, .08, -1, 36, .1, 22, PAVE);
  // the drive-thru lane round the east side, with arrows and its menu board
  p.box(21, .08, -2, 5, .06, 34, ASPH); p.box(8, .08, -18.5, 30, .06, 5, ASPH);
  for (const z of [-12, -4, 4]) p.pyramid(21, .15, z, 1.4, .02, LINE);
  p.box(17.6, 0, 2, .4, 4, .4, DARK); p.box(17.6, 2, 2, .5, 3, 4.4, BLACK); p.box(17.9, 2.3, 2, .1, 2.4, 3.8, GOLD);
  // the restaurant: red walls, a gold band, a big glass front, a flat roof with a parapet
  p.box(0, .18, -4, 28, 6, 15, RED); p.box(0, 6.18, -4, 28.6, 1, 15.6, GOLD); p.box(0, 7.18, -4, 29, .4, 16, CREAM);
  p.box(0, .6, 3.55, 22, 4.6, .15, GLASS); for (const x of [-11, -6.6, -2.2, 2.2, 6.6, 11]) p.box(x, .6, 3.65, .35, 4.7, .3, CREAM);
  p.box(0, .18, 3.7, 4, 4, .2, 0x9cc7d8); p.box(0, 4.6, 5, 9, .35, 3, GOLD);                                          // the door and its canopy
  p.box(14.05, 1.2, -6, .15, 2.4, 3, GLASS); p.box(14.4, 3, -6, .9, .3, 3.6, GOLD);                                   // the drive-thru window
  // inside, through the glass: the counter, the menu screens, tables
  p.box(0, .18, -8, 18, 1.4, 1.4, CREAM); for (const x of [-6, -2, 2, 6]) p.box(x, 3.6, -9.6, 3.4, 1.8, .2, BLACK);
  for (const x of [-8, -3, 3, 8]) { p.box(x, .18, -1, 2, 1.1, 2, GOLD); p.box(x, .18, .6, 2, .7, .6, RED); }
  // on the roof: the giant burger, the giant fries, air conditioners
  burger(p, -5, 7.6, -4, 9);
  p.box(7, 7.6, -4, 5, 5.4, 3, RED); p.box(7, 13, -4, 5.2, .5, 3.2, GOLD);
  for (let k = 0; k < 9; k++) p.box(5.2 + (k % 5) * .9, 12.4, -4.8 + Math.floor(k / 5) * 1.5, .55, 3 + (k % 3) * .7, .55, 0xf6c445, (k - 4) * .06);
  for (const x of [11, 12.6]) p.box(x, 7.6, -9, 1.4, 1.2, 1.8, 0xdde2e6);
  // the terrace: tables with red and gold umbrellas, diners
  const tables = [[-15, 6], [-10, 8], [-15, 11], [-20, 8]];
  tables.forEach(([x, z], k) => { p.cyl(x, .18, z, 2.4, 1.1, CREAM); p.box(x, .18, z, .2, 3.4, .2, DARK); p.cone(x, 3.3, z, 4.2, 1.2, k % 2 ? RED : GOLD);
    diner(p, x - 1.6, z, Math.PI / 2, SHIRTS[k]); diner(p, x + 1.6, z, -Math.PI / 2, SHIRTS[k + 2]); p.box(x, 1.3, z, .8, .3, .8, BUN); });
  // a little playground: a slide, a climbing frame, a seesaw
  p.box(-20, 0, -10, 8, .15, 8, 0xf7c6d9);
  for (let k = 0; k < 6; k++) p.box(-21.5 + k * .5, 3 - k * .5, -10, .6, .2, 1.4, GOLD); p.box(-22, 0, -10, 1.2, 3.2, 1.6, RED); p.box(-22, 3.2, -10, 1.6, .3, 2, GOLD);
  p.box(-18, 0, -12.5, .2, 2.4, .2, 0x3b6fb6); p.box(-16, 0, -12.5, .2, 2.4, .2, 0x3b6fb6); p.box(-17, 2.4, -12.5, 2.3, .2, .2, 0x3b6fb6);
  p.box(-17, .6, -7.5, 3.6, .2, .5, RED, .2); p.box(-17, 0, -7.5, .4, .6, .4, DARK);
  // הפועל's banners on poles by the road, red and black, and the big sign on its pole
  for (const x of [-20, -12, 12]) { p.box(x, 0, 23, .25, 7, .25, DARK); p.box(x + .9, 4.6, 23, 1.6, 2.2, .1, RED); p.box(x + .9, 4.6, 23.05, 1.6, .5, .1, BLACK); }
  p.box(16, 0, 22, .7, 11, .7, DARK); p.box(16, 11, 22, 8.4, 3.6, 1, RED); p.box(16, 11.2, 22.55, 7.8, 3.2, .1, GOLD);
  // people walking in, a delivery scooter, cars in the parking, trees
  [[-2, 7], [2.5, 8.5], [-6, 10], [6, 12]].forEach(([x, z], k) => diner(p, x, z, Math.PI + k, SHIRTS[(k + 3) % 6], false));
  p.at(-8, 19, .3); p.box(0, .4, 0, .8, .9, 2.4, RED); p.box(0, 1.3, .9, .3, 1, .3, DARK); p.box(0, 1.2, -.8, 1.4, 1.2, 1.2, GOLD); p.cyl(0, 0, 1, .9, .5, DARK); p.cyl(0, 0, -1, .9, .5, DARK); p.at(0, 0, 0);
  for (const [x, c] of [[-12.5, 0x3b6fb6], [-2.5, LINE], [7.5, 0x1f8a4c], [12.5, GOLD]]) { p.at(x, 18, 0); p.box(0, .4, 0, 2.6, 1.3, 4.6, c); p.box(0, 1.7, -.3, 2.3, 1, 2.6, c); p.box(0, 1.8, 1.02, 2.1, .8, .05, GLASS);
    for (const [dx, dz] of [[-1.3, 1.5], [1.3, 1.5], [-1.3, -1.5], [1.3, -1.5]]) p.cyl(dx, 0, dz, .9, .5, DARK); p.at(0, 0, 0); }
  for (const [x, z] of [[-23, 20], [23, 20], [-23, -20], [-8, -20], [6, -24]]) p.tree(x, z, .85, GREEN);
}
export function spirdonaldsLive(group) {
  group.add(sign('ספירדונלדס', { w: 14, h: 2.6, bg: '#c8102e', fg: '#f2b632', border: '#f2b632', font: '900 {px}px "Secular One", Rubik' }).at(0, 7.9, 3.75));
  group.add(sign('ספירדונלדס', { w: 7.4, h: 3, bg: '#f2b632', fg: '#c8102e', border: '#c8102e', font: '900 {px}px "Secular One", Rubik' }).at(16, 12.6, 22.61));
  group.add(sign('הספונסר הרשמי של הפועל ספיר ⚽', { w: 9.6, h: 1.4, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e' }).at(0, 4.85, 6.55));
  group.add(sign('דרייב', { w: 2.6, h: 1, bg: '#f2b632', fg: '#c8102e', border: '#c8102e' }).at(21, 3.4, 8, 0));
  const menu = sign('המבורגר מלכותי · צ׳יפס · שייק', { w: 3.8, h: 2.2, bg: '#1b1d21', fg: '#f2b632', border: '#f2b632' }); menu.rotation.y = Math.PI / 2; menu.position.set(18.05, 3.5, 2); group.add(menu);
}
export const SPIRDONALDS = { key: 'spirdonalds', name: 'ספירדונלדס', draw: drawSpirdonalds, live: spirdonaldsLive, top: 18 };
