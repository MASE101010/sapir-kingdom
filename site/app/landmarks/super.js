// סופר ספיר: day 2's winning comment (@noga_buhnik, "סופר בשם סופר ספיר"). A funny neighbourhood supermarket: a flat
// white box with a red band and a big gold sign on the roof, a glass front plastered with sale posters, sliding doors,
// carts, fruit crates on the pavement, and the staff hanging about outside instead of working: one asleep on a plastic
// chair, one on the phone, one leaning on a broom, the manager with his clipboard. Round the back, the staff's smoking
// corner: a bench, a bucket, a tin roof and a dumpster. A delivery van at the side. About 36 × 40, front toward +z.
import { sign } from '../sign.js';
import { burnable } from '../burn.js';
const WALL = 0xf6f1e6, RED = 0xc2412d, GOLD = 0xe8b323, NAVY = 0x13213b, GLASS = 0x7fb3c9, FRAME = 0x9aa3ab, ASPH = 0x5d6166,
  LINE = 0xf2f2f2, WOOD = 0x8a6240, DARK = 0x3a3f45, GREEN = 0x3f7f4a, SKIN = 0xe2b48f, VEST = 0x2f8a4a, TIN = 0xb9c0c6;

/** a voxel worker; pose: 'stand', 'sit', 'lean', 'phone', 'sleep' */
function worker(p, x, z, rot, pose = 'stand', shirt = VEST, cap = RED) {
  p.at(x, z, rot);
  const sit = pose === 'sit' || pose === 'sleep', y = sit ? .9 : 0;
  if (sit) { p.box(0, 0, 0, 2.4, 1.1, 2.4, 0xf2f2f2); p.box(0, 1.1, -1.1, 2.4, 1.8, .3, 0xf2f2f2); }   // a white plastic chair
  if (sit) { p.box(-.45, 1.1, .9, .6, .6, 1.6, NAVY); p.box(.45, 1.1, .9, .6, .6, 1.6, NAVY); p.box(-.45, 0, 1.6, .6, 1.2, .6, NAVY); p.box(.45, 0, 1.6, .6, 1.2, .6, NAVY); }
  else { p.box(-.45, 0, 0, .6, 1.8, .6, NAVY); p.box(.45, 0, 0, .6, 1.8, .6, NAVY); }                    // legs
  const by = sit ? 1.7 : 1.8, tilt = pose === 'sleep' ? .25 : 0;
  p.box(0, by, 0, 1.7, 1.8, 1, shirt); p.box(0, by + .2, .52, 1.2, 1.2, .05, 0xffffff);                  // body, a badge
  p.box(0, by + 1.8, tilt, 1.3, 1.3, 1.3, SKIN); p.box(0, by + 3.1, tilt, 1.45, .35, 1.45, cap); p.box(0, by + 3.1, tilt + .9, 1, .15, .7, cap);  // head, cap
  p.box(-.32, by + 2.35, tilt + .66, .2, .2, .05, pose === 'sleep' ? SKIN : 0x222222); p.box(.32, by + 2.35, tilt + .66, .2, .2, .05, pose === 'sleep' ? SKIN : 0x222222);
  if (pose === 'phone') { p.box(-1.05, by + .6, 0, .45, 1.6, .45, shirt); p.box(1.05, by + 1.6, .1, .45, 1.2, .45, shirt); p.box(.95, by + 2.1, .55, .3, .6, .12, 0x222222); }
  else if (pose === 'lean') { p.box(-1.05, by + .4, 0, .45, 1.6, .45, shirt); p.box(1.05, by + .6, .3, .45, 1.4, .45, shirt); p.box(1.4, 0, .9, .2, 4, .2, WOOD); p.box(1.4, 0, .9, 1.6, .5, .5, 0xd9c27a); }
  else if (pose === 'sleep') { p.box(-1.05, by + .2, .2, .45, 1.6, .45, shirt); p.box(1.05, by + .2, .2, .45, 1.6, .45, shirt); }
  else { p.box(-1.05, by + .4, 0, .45, 1.6, .45, shirt); p.box(1.05, by + .4, 0, .45, 1.6, .45, shirt); }
  p.at(0, 0, 0);
}

export function drawSuper(p) {
  p.at(0, 0, 0);
  // the parking in front, with lines, and the pavement
  p.box(0, 0, 13, 36, .12, 14, ASPH);
  for (const x of [-12, -6, 6, 12]) p.box(x, .12, 15, .3, .03, 8, LINE);
  p.box(0, 0, 4.5, 36, .3, 4, 0xd9d2c4);
  // the shop: a white box, a red band, the glass front with its frame
  p.box(0, 0, -6, 32, 7.5, 17, WALL); p.box(0, 7.5, -6, 32.6, 1.4, 17.6, RED); p.box(0, 8.9, -6, 32.8, .4, 17.8, 0xe9e2d4);
  p.box(0, .3, 2.55, 26, 6, .2, GLASS);
  for (const x of [-13, -8.5, -4, 4, 8.5, 13]) p.box(x, .3, 2.7, .4, 6.2, .3, FRAME);
  p.box(0, 6.2, 2.7, 26.4, .4, .3, FRAME); p.box(0, .3, 2.7, 26.4, .4, .3, FRAME);
  p.box(0, .3, 2.8, 7.2, 6, .2, 0x9cc7d8); p.box(0, .3, 2.95, .2, 6, .2, FRAME);                       // the sliding doors
  p.box(0, 6.4, 3.6, 9, .3, 2.2, RED);                                                                   // a little canopy
  // inside, seen through the glass: shelves and the tills
  for (const x of [-10, -6, 6, 10]) { p.box(x, .3, -3, 2.4, 4.4, 6, 0xe2dccf); for (let k = 0; k < 4; k++) p.box(x, 1 + k * 1, -3, 2.6, .5, 6, [RED, GOLD, GREEN, 0x3b6fb6][(k + x) & 3]); }
  for (const x of [-3, 3]) { p.box(x, .3, .3, 3, 2.2, 1.6, 0x6b6f75); p.box(x, 2.5, .3, .4, 1.2, .4, DARK); p.box(x, 3.7, .3, 1.4, .9, .2, 0x2b2f36); }
  // the big gold sign on the roof, on two poles, with lights
  p.box(-8, 9.3, -2, .6, 3, .6, DARK); p.box(8, 9.3, -2, .6, 3, .6, DARK);
  p.box(0, 12.2, -2, 23, 5.2, 1, GOLD); p.box(0, 12.2, -2.6, 23.6, 5.8, .4, NAVY);
  for (let i = 0; i < 12; i++) p.ball(-11 + i * 2, 17.4, -1.4, .7, .7, 0xfff3b0);
  // air conditioners and a water tank on the roof
  for (const x of [-13, -10.5, 11]) { p.box(x, 9.3, -11, 2, 1.6, 2.4, 0xdde2e6); p.cyl(x, 10.9, -11, 1.4, .2, DARK); }
  p.cyl(4, 9.3, -11, 3, 3.4, 0xeef0f2);
  // carts: a row of them by the door, and one left in the parking
  for (let i = 0; i < 6; i++) { const x = -15.5 + i * .8; p.box(x, .5, 5, 1.1, 1.4, 2, 0xc8ced4); p.box(x, 1.9, 4.2, 1.2, .2, .2, RED); p.cyl(x, 0, 5.6, .35, .5, DARK); }
  p.at(11, 13, .5); p.box(0, .5, 0, 1.6, 1.4, 2.2, 0xc8ced4); p.box(0, 1.9, -1, 1.7, .2, .2, RED); p.box(0, 1.9, .3, 1.2, .9, 1.2, 0xf2b632); p.at(0, 0, 0);
  // fruit and veg on the pavement, in crates, with a price sign
  const crates = [[6, 5.2, 0xf28c28], [8.4, 5.2, 0xd7263d], [10.8, 5.2, 0x8bc34a], [13.2, 5.2, 0xffd23f], [15.6, 5.2, 0x3f7f4a]];
  for (const [x, z, c] of crates) { p.box(x, 0, z, 2.2, 1.6, 1.8, WOOD); p.box(x, .4, z, 2.4, .3, 2, 0x7a5434); for (let i = 0; i < 6; i++) p.ball(x - .6 + (i % 3) * .6, 1.5, z - .3 + Math.floor(i / 3) * .6, .7, .7, c); }
  p.ball(15.6, 1.6, 5.2, 1.6, 1.2, 0x2f6b3a);                                                            // a watermelon on top
  // the staff, outside, not working
  worker(p, -6, 7.5, .4, 'sleep');
  worker(p, -9.5, 8.5, -.6, 'phone');
  worker(p, -17, 3.8, 1.6, 'lean');
  worker(p, 3.5, 8, -.3, 'stand', 0xffffff, NAVY);                                                       // the manager, in a white shirt
  p.at(3.5, 8, -.3); p.box(.2, 2.4, .9, 1.6, 2, .15, 0x8a6240); p.box(.2, 2.6, 1, 1.3, 1.6, .05, 0xffffff); p.box(0, 3.4, .55, .3, 1.4, .1, RED); p.at(0, 0, 0);   // clipboard, tie
  worker(p, -2.5, 9, .2, 'sit', VEST, GOLD);
  p.box(-1, 0, 9.4, 1.4, .9, 1.4, 0x3b6fb6); p.ball(-1, .9, 9.4, .5, .4, 0xffffff);                       // a crate as a table, a cup of coffee
  p.box(-4.2, 0, 9.4, 1.2, 1, 1.2, 0x3b6fb6);
  // a pallet of boxes waiting to be brought in, with a pallet jack
  p.box(-12.5, 0, 6, 3.4, .4, 3, WOOD); for (let k = 0; k < 3; k++) for (const [dx, dz] of [[-.8, -.7], [.8, -.7], [-.8, .7], [.8, .7]]) p.box(-12.5 + dx, .4 + k * 1.2, 6 + dz, 1.5, 1.15, 1.3, 0xc8a26e);
  p.box(-12.5, 0, 8.6, 1.2, .3, 2.2, RED); p.box(-12.5, .3, 9.6, .3, 3, .3, RED);
  // the delivery van at the side
  p.at(-14, -18, 0);
  p.box(0, .8, 0, 5, 4.2, 9, 0xffffff); p.box(0, .8, 5.2, 5, 3, 2.6, 0xffffff); p.box(0, 2.6, 6.3, 4.6, 1.3, .3, GLASS);
  p.box(-2.55, 2.2, -1, .1, 1.8, 6, RED); p.box(2.55, 2.2, -1, .1, 1.8, 6, RED);
  for (const [dx, dz] of [[-2.4, 4.2], [2.4, 4.2], [-2.4, -3], [2.4, -3]]) p.cyl(dx, 0, dz, 1.6, .5, DARK);
  p.at(0, 0, 0);
  // round the back: the staff entrance, the dumpster, and the smoking corner under a tin roof
  p.box(9, 0, -14.6, 2.4, 4.6, .3, 0x6b6f75); p.box(9, 4.6, -15.2, 3.4, .3, 1.4, TIN);
  p.box(-3, 0, -17.5, 5, 3, 2.6, 0x2f6b3a); p.box(-3, 3, -17.5, 5.2, .3, 2.8, 0x264f2c);
  const sx = 12.5, sz = -18.5;
  for (const [dx, dz] of [[-3, -2], [3, -2], [-3, 2], [3, 2]]) p.box(sx + dx, 0, sz + dz, .3, 6.6, .3, DARK);
  p.box(sx, 6.6, sz, 7.4, .25, 5.4, TIN);
  p.box(sx, .9, sz - 1.4, 5, .3, 1.2, WOOD); p.box(sx - 2.2, 0, sz - 1.4, .3, .9, 1, WOOD); p.box(sx + 2.2, 0, sz - 1.4, .3, .9, 1, WOOD); p.box(sx, 1.2, sz - 2, 5, 1.2, .2, WOOD);
  p.cyl(sx + 2.6, 0, sz + 1.3, 1, 1.2, RED); p.cyl(sx + 2.6, 1.2, sz + 1.3, 1.1, .1, 0x9aa3ab);
  p.box(sx - 2.4, 0, sz + 1.2, 1.4, 1, 1.4, 0x3b6fb6);
  worker(p, sx - .8, sz - 1.4, Math.PI, 'sit', VEST, RED);
  worker(p, sx + 1.4, sz + .4, Math.PI - .5, 'stand', VEST, GOLD);
  // trees
  p.tree(16.5, -6, 1.1); p.tree(-17.5, -6, 1); p.tree(17, 9, .9);
}
export function superLive(group) {
  group.add(sign('סופר ספיר', { w: 22, h: 4.6, bg: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 14.8, -1.45));
  group.add(sign('מבצע!', { w: 4.2, h: 2.2, bg: '#c2412d', fg: '#ffffff', border: '#ffffff' }).at(-10.75, 4.6, 2.8));
  group.add(sign('1+1', { w: 3.6, h: 2.2, bg: '#ffd23f' }).at(-6.25, 4.6, 2.8));
  group.add(sign('הכל ב-9.90', { w: 4.2, h: 2, bg: '#ffffff', fg: '#c2412d', border: '#c2412d' }).at(6.25, 4.6, 2.8));
  group.add(sign('קופה 2 סגורה', { w: 4.2, h: 1.6, bg: '#ffffff' }).at(10.75, 4.8, 2.8));
  group.add(sign('פתוח', { w: 3.4, h: 1.4, bg: '#3f7f4a', fg: '#ffffff', border: '#ffffff' }).at(0, 5.2, 4.75));
  group.add(sign('פינת עישון', { w: 5, h: 1.4, bg: '#fffaf0' }).at(12.5, 6, -21.25, Math.PI));
  group.add(sign('כניסת עובדים', { w: 4.4, h: 1.2, bg: '#fffaf0' }).at(9, 5.4, -14.4, Math.PI));
  group.add(sign('פירות וירקות טריים', { w: 9, h: 1.4, bg: '#3f7f4a', fg: '#ffffff', border: '#ffffff' }).at(10.8, 3.1, 4.25));
  group.add(sign('משלוחים עד הבית', { w: 6, h: 1.4, bg: '#ffffff', fg: '#c2412d', border: '#c2412d' }).at(-11.4, 3.1, -19, Math.PI / 2));
  const z = sign('Z z z', { w: 2.4, h: 1, bg: '#ffffff', border: '#ffffff', font: '800 {px}px Rubik' }); group.add(z.at(-6, 6.9, 7.9));
  // day 12: two of the staff by name, ניסינוב the manager and אנטוליוס on the phone (their jobs hang on the shop)
  group.add(sign('ניסינוב', { w: 3, h: .9, bg: '#ffffff', fg: '#13213b', border: '#13213b' }).at(3.5, 6.8, 8.1));
  group.add(sign('אנטוליוס', { w: 3.2, h: .9, bg: '#ffffff', fg: '#13213b', border: '#13213b' }).at(-9.5, 6.3, 8.6));
  // day 12: the escaped dragon set it on fire (burn.js); kingdom.json states.super.burn keeps it burned until 500 followers
  burnable(group, [[-10, 9.3, -8, 1.3], [0, 9.3, -4, 1.5], [10, 9.3, -9, 1.2], [-4, 9.3, -12, 1], [6, 9.3, -1, 1], [0, 16, -2, 1.1], [-8, .4, 3.4, .9], [8, .4, 3.4, .9], [-14, 4.9, -18, .8]]);
  const f = group.userData.fireGroup;
  f.add(sign('סגור בגלל דרקון 🔥', { w: 9, h: 1.8, bg: '#c8102e', fg: '#ffffff', border: '#ffffff', font: '900 {px}px "Secular One", Rubik' }).at(0, 4.4, 5.0));
  f.add(sign('נפתח מחדש ב-500 עוקבים', { w: 7.4, h: 1.1, bg: '#ffffff', fg: '#c8102e', border: '#c8102e' }).at(0, 3.1, 5.0));
}
export const SUPER = { key: 'super', name: 'סופר ספיר', draw: drawSuper, live: superLive, top: 18 };
