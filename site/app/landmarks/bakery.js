// מאפיית הממלכה: an example landmark, the kind the daily run builds from a winning comment ("שתהיה מאפייה עם
// לחמניות ענקיות"). A two-storey stone bakery with a striped awning, a giant bread loaf on the roof, a chimney with smoke,
// outdoor tables, crates of bread, a delivery cart, and a painted sign over the door. About 44 × 34, front toward +z.
import { sign } from '../sign.js';
const STONE = 0xe9dcc3, TRIM = 0xc9b48f, ROOF = 0xb5443a, WOOD = 0x8a6240, DARK = 0x4a3322, GLASS = 0x3a5f7a, CRUST = 0xc8873a, CRUMB = 0xf0d9a8, CLOTH = 0xfffaf0, RED = 0xc2412d, GREEN = 0x3f7f4a;

export function drawBakery(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 46, .2, 36, 0xe6dcc6);                                 // the square in front
  p.box(0, .2, -6, 30, 9, 18, STONE); p.box(0, 9.2, -6, 31, .8, 19, TRIM);
  p.box(0, 10, -6, 26, 6.5, 15, STONE); p.gable(0, 16.5, -6, 28, 6, 17, ROOF);
  for (const x of [-10, -3.5, 3.5, 10]) { p.box(x, 2.2, 3.05, 4.2, 4.6, .3, GLASS); p.box(x, 1.8, 3.2, 4.8, .5, .6, TRIM); }
  for (const x of [-8, 0, 8]) { p.box(x, 11.5, 1.55, 3, 3, .3, GLASS); p.box(x, 11, 1.7, 3.6, .4, .5, TRIM); }
  p.box(0, .2, 3.1, 4, 6.4, .3, DARK);                                  // the door
  for (let i = 0; i < 9; i++) p.box(-14 + i * 3.5, 7, 5, 3.5, .4, 4.2, i % 2 ? CLOTH : RED, 0);   // the striped awning
  for (let i = 0; i < 9; i++) p.box(-14 + i * 3.5, 6.6, 7, 3.5, .8, .2, i % 2 ? CLOTH : RED);
  // the giant loaf on the roof, with its cuts
  p.ball(0, 19.5, -6, 15, 7.5, CRUST); p.ball(0, 20.2, -6, 13, 6.6, 0xd99a4a);
  for (const x of [-4, 0, 4]) p.box(x, 26.2, -6, 1.2, .5, 5, CRUMB, .5);
  // chimney and smoke
  p.box(10, 16, -10, 2.6, 9, 2.6, TRIM); p.ball(10, 25.5, -10, 3.2, 3, 0xf2f2f2); p.ball(11.5, 28, -10.5, 4, 3.6, 0xf7f7f7); p.ball(13.5, 31, -11, 5, 4.2, 0xfbfbfb);
  // outdoor tables with umbrellas
  for (const [x, z] of [[-15, 12], [-7, 14], [7, 14], [15, 12]]) {
    p.cyl(x, 0, z, 3.4, 2.4, WOOD); p.cyl(x, 2.4, z, 3.8, .3, CLOTH);
    p.cyl(x, 2.7, z, .25, 3.6, DARK); p.cone(x, 6, z, 5.6, 1.6, x < 0 ? RED : GREEN);
    p.box(x - 2.4, 0, z, 1.2, 1.4, 1.2, WOOD); p.box(x + 2.4, 0, z, 1.2, 1.4, 1.2, WOOD);
    p.ball(x - .6, 2.7, z, 1.2, .7, CRUST); p.ball(x + .7, 2.7, z + .4, 1, .6, 0xd99a4a);
  }
  // crates of bread by the door
  for (const [x, z] of [[-4.5, 5.5], [4.5, 5.5], [5.8, 7]]) { p.box(x, .2, z, 2.4, 1.4, 1.8, WOOD); for (let i = 0; i < 3; i++) p.ball(x - .7 + i * .7, 1.5, z, .9, .6, CRUST); }
  // the delivery cart
  p.box(18, 1.2, 4, 6, 2.6, 3.4, 0xf2b632); p.box(18, 3.8, 4, 6.2, .3, 3.6, RED);
  p.cyl(16, 0, 5.9, 2.2, .4, DARK); p.cyl(20, 0, 5.9, 2.2, .4, DARK);
  for (let i = 0; i < 4; i++) p.ball(16.5 + i, 4.1, 4, 1.1, .8, CRUST);
  // trees and a bench
  p.tree(-20, -2, 1.1); p.tree(20, -6, 1); p.tree(-19, -12, .9);
  p.box(-21, 0, 8, 1, 1, 6, WOOD); p.box(-21.6, 1, 8, .3, 1.4, 6, WOOD);
}
export function bakeryLive(group) {
  group.add(sign('מאפיית הממלכה', { w: 18, h: 3.2, bg: '#f2b632' }).at(0, 8.4, 7.3));
  group.add(sign('לחם חם כל היום', { w: 12, h: 2.4, bg: '#fffaf0' }).at(0, 14.6, 1.75));
}
export const BAKERY = { key: 'bakery', name: 'מאפיית הממלכה', draw: drawBakery, live: bakeryLive, top: 32 };
