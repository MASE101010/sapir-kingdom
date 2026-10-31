// ספארי ספיר: day 17, @ofek_bell's comment "אני לא יוותר עד שיהיה גן חיות... עם אריה מעופף ודרקונים ודינוזאורים וחיות
// פרא היסטוריות וכאלה שלא קיימות". A round zoo behind a gate with a great arch: in the middle, on a rock, the white lion
// with wings hovers and flaps (its own group, so it can move); round it seven pens with a T-rex, a long-neck dinosaur,
// a mammoth, a rainbow unicorn, two giraffes, penguins on ice and a baby dragon in a cage of its own (a little cousin of the
// kingdom's dragons, safely locked). Every pen has a name board that still says "?": the followers name the animals
// (tag a friend with the name in the comments), and NAMES below fills in the boards as the names are chosen.
// Visitors, benches, a balloon seller, an ice cream cart, trees. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const STONE = 0xe3d9c6, STONE2 = 0xcfc2a8, PAVE = 0xe9e0cc, GRASS = 0x86c766, GRASS2 = 0x6fb052, SAND = 0xe6cf9a, WATER = 0x3fa9d6,
  WOOD = 0x8a6240, WOOD2 = 0x6b4a33, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc8452f, CREAM = 0xfbf3e2,
  ROCK = 0xa89f92, ROCK2 = 0x8c8478, SKIN = 0xe2b48f, DARK = 0x2b2f36, WHITE = 0xf6f3ee, ICE = 0xdff1fb;

/** the pens: where (x, z), how big (r), which way the animal looks, the board's name for it, and the floor */
export const PENS = [
  { key: 'trex', label: 'טי-רקס', x: -13, z: -16, r: 7.5, rot: .55, floor: SAND },
  { key: 'longneck', label: 'צוואר ארוך', x: 13, z: -16, r: 7.5, rot: -.55, floor: GRASS2 },
  { key: 'mammoth', label: 'ממותה', x: -20.5, z: 0, r: 6, rot: 1.1, floor: 0xd9e8ee },
  { key: 'unicorn', label: 'חד-קרן', x: 20.5, z: 0, r: 6, rot: -1.1, floor: GRASS },
  { key: 'penguins', label: 'פינגווינים', x: -16, z: 14, r: 6, rot: .6, floor: WATER },
  { key: 'giraffes', label: 'ג׳ירפות', x: 16, z: 14, r: 6, rot: -.6, floor: SAND },
  { key: 'dragon', label: 'דרקון תינוק', x: 0, z: -24, r: 4.5, rot: 0, floor: ROCK2 },
];
/** the names the followers chose: { lion: 'שמשון' }; a pen without one shows "?" */
export const NAMES = {};
export const LION = [0, -2];                              // the winged lion's rock in the middle

/** a body-part helper like the king's statue: parts relative to the animal's feet, s times its size, turned by rot */
function beast(p, x, z, rot, s = 1, y = 0) {
  return (w, h, d, c, dx, dy, dz, kind = 'box') => { p.at(x, z, rot, y); if (kind === 'box') p.box(dx * s, dy * s, dz * s, w * s, h * s, d * s, c); else p[kind](dx * s, dy * s, dz * s, w * s, h * s, c); };
}
const legs = (b, c, w, h, xs, zs) => { for (const dx of xs) for (const dz of zs) b(w, h, w, c, dx, 0, dz); };

function trex(b) {
  const G = 0x5f9e4a, B = 0xb9d78a;
  b(1.4, 4, 2, G, -1.3, 0, 0); b(1.4, 4, 2, G, 1.3, 0, 0); b(1.8, .6, 2.6, G, -1.3, 0, .6); b(1.8, .6, 2.6, G, 1.3, 0, .6);   // legs, feet
  b(4, 4.2, 6, G, 0, 3.6, -.5); b(3, 3, 4, B, 0, 3.8, .6);                                     // body, belly
  b(2.8, 3, 3, G, 0, 7, 2); b(3.4, 2.6, 4, G, 0, 8.6, 3.6); b(3, 1, 3.6, B, 0, 8, 4);           // neck, head, jaw
  for (let i = 0; i < 6; i++) b(.4, .6, .3, WHITE, -1.2 + i * .48, 7.6, 5.6);                  // teeth
  b(.6, .6, .3, 0xffe066, -1.2, 10, 4.6); b(.6, .6, .3, 0xffe066, 1.2, 10, 4.6);               // eyes
  b(.6, .6, 1.4, G, -1.8, 6.3, 2.6); b(.6, .6, 1.4, G, 1.8, 6.3, 2.6);                         // the tiny arms
  b(2.8, 2.6, 4, G, 0, 4.4, -5); b(1.8, 1.8, 4, G, 0, 4.4, -8.6); b(1, 1.2, 3, G, 0, 4.2, -11.6);   // the tail
  for (let i = 0; i < 6; i++) b(.5, .8, .8, 0x3f7a32, 0, 7.6 - i * .6, 2 - i * 2.1);           // spikes down the back
}
function longneck(b) {
  const G = 0x8fb3a0, B = 0xc7dccd;
  legs(b, G, 1.6, 5, [-1.6, 1.6], [-2.6, 2.6]); b(4.6, 4, 8, G, 0, 4.6, 0); b(3.6, 1.4, 6.6, B, 0, 4.4, 0);   // legs, body, belly
  for (let i = 0; i < 6; i++) b(1.6 - i * .06, 1.9, 1.6 - i * .06, G, 0, 7.6 + i * 1.6, 3.4 + i * .55);      // the long neck
  b(1.8, 1.4, 3, G, 0, 17, 7); b(.4, .4, .2, DARK, -.7, 17.8, 8); b(.4, .4, .2, DARK, .7, 17.8, 8);          // head, eyes
  b(2.4, 2.2, 3, G, 0, 5.4, -5); b(1.4, 1.4, 4, G, 0, 5, -8.4); b(.8, .8, 3, G, 0, 4.5, -11);               // tail
  for (const [dx, dz] of [[-1, 1.6], [1.2, -1.4], [0, -3]]) b(1, .2, 1, 0x7a9b86, dx, 8.6, dz);              // spots
}
function mammoth(b) {
  const F = 0x7a4e2d, D = 0x5b3820;
  legs(b, F, 1.5, 3.2, [-1.3, 1.3], [-1.8, 1.8]); b(4, 3.8, 5.4, F, 0, 2.8, 0); b(4.2, 1.4, 4, D, 0, 6.4, -.4);   // legs, body, the hump
  b(3, 3, 2.6, F, 0, 4, 3.4); b(.9, 3.4, .9, D, 0, 1.2, 4.9);                                   // head, trunk
  b(.4, .4, .2, DARK, -.8, 5.6, 4.7); b(.4, .4, .2, DARK, .8, 5.6, 4.7);                         // eyes
  for (const sx of [-1, 1]) { b(.45, .45, 2.4, CREAM, sx * 1.1, 3.2, 5.4); b(.45, 1.6, .45, CREAM, sx * 1.1, 3.2, 6.6); b(1.6, 2, .3, D, sx * 1.8, 4.2, 3); }   // tusks, ears
  b(1, 1.2, 2, D, 0, 4, -3.2); for (let i = 0; i < 4; i++) b(.5, 1.6, .5, D, -1.5 + i, 1.4, 2.6);   // tail, the fringe of fur
}
function unicorn(b) {
  const W = 0xfbf7ff, RB = [0xff6b6b, 0xffb347, 0xffe066, 0x7ed957, 0x5ec8f2, 0xb28dff];
  legs(b, W, .7, 2.6, [-.8, .8], [-1.6, 1.6]); for (const dx of [-.8, .8]) for (const dz of [-1.6, 1.6]) b(.8, .4, .8, GOLD, dx, 0, dz);   // legs, golden hooves
  b(2.2, 2, 4.4, W, 0, 2.4, 0); b(1.3, 2.4, 1.4, W, 0, 3.6, 2.2); b(1.4, 1.2, 2.4, W, 0, 5.4, 3);   // body, neck, head
  b(.3, .3, .2, DARK, -.6, 5.9, 3.6); b(.3, .3, .2, DARK, .6, 5.9, 3.6); b(.4, .5, .3, 0xffb6c8, 0, 5.4, 4.2);   // eyes, nose
  b(.5, 2.6, .5, GOLD, 0, 6.5, 3.2, 'cone');                                                    // the horn
  RB.forEach((c, i) => { b(.5, .9, .7, c, 0, 6.2 - i * .55, 2.2 - i * .3); b(.4, 1.6, .5, c, -.15 + (i % 2) * .3, 1.8 + i * .25, -2.6 - i * .15); });   // mane, tail
}
function giraffe(b) {
  const Y = 0xf2c14e, S = 0x9b5e2a;
  legs(b, Y, .6, 4.4, [-.8, .8], [-1.4, 1.4]); b(2.2, 2.2, 3.8, Y, 0, 4.2, 0);
  for (let i = 0; i < 5; i++) b(.9, 1.6, .9, Y, 0, 6 + i * 1.4, 1.4 + i * .35); b(1.1, 1, 2, Y, 0, 13, 3.4);   // the neck, the head
  b(.2, .7, .2, S, -.3, 13.9, 3); b(.2, .7, .2, S, .3, 13.9, 3); b(.3, .3, .2, DARK, -.5, 13.5, 4);           // horns, eye
  for (const [dx, dy, dz] of [[-1.12, 5, -.8], [1.12, 5.4, .6], [-1.12, 5.6, 1], [1.12, 4.8, -1.2]]) b(.08, .7, .8, S, dx, dy, dz);   // spots
  b(.8, .08, .8, S, 0, 6.42, -.6); b(.7, .08, .7, S, .3, 6.42, 1);
}
function penguin(b) {
  b(.9, 1.3, .8, DARK, 0, 0, 0); b(.6, 1, .2, WHITE, 0, .15, .38); b(.7, .6, .7, DARK, 0, 1.3, 0);
  b(.3, .15, .35, 0xf5a623, 0, 1.45, .45); b(.5, .15, .5, 0xf5a623, 0, 0, .15);
}
function babyDragon(b) {
  const R = 0x8e5bd6, B = 0xe9c46a;
  legs(b, R, .7, 1.4, [-.6, .6], [-.9, .9]); b(1.8, 1.6, 3, R, 0, 1.2, 0); b(1.2, 1, 2, B, 0, 1.1, .4);
  b(1.6, 1.4, 1.8, R, 0, 2.6, 1.8); b(.4, .4, .2, 0xffe066, -.5, 3.4, 2.7); b(.4, .4, .2, 0xffe066, .5, 3.4, 2.7);
  b(.3, .8, .3, B, -.4, 4, 1.4); b(.3, .8, .3, B, .4, 4, 1.4); b(.8, .8, 2.6, R, 0, 1.4, -2.6);
  b(2.6, .2, 1.6, 0xb48ae8, -1.6, 2.6, -.2); b(2.6, .2, 1.6, 0xb48ae8, 1.6, 2.6, -.2);   // little wings
}
const DRAW = { trex, longneck, mammoth, unicorn, giraffes: null, penguins: null, dragon: babyDragon };

function fence(p, x, z, r, n = 18, h = 1.6) {
  p.at(0, 0, 0);
  for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, a2 = (i + 1) / n * 2 * Math.PI;
    p.box(x + Math.sin(a) * r, 0, z + Math.cos(a) * r, .3, h, .3, WOOD2);
    const mx = x + (Math.sin(a) + Math.sin(a2)) / 2 * r, mz = z + (Math.cos(a) + Math.cos(a2)) / 2 * r, len = 2 * r * Math.sin(Math.PI / n) + .1;
    p.box(mx, h * .45, mz, len, .18, .14, WOOD, (a + a2) / 2 + Math.PI / 2); p.box(mx, h * .85, mz, len, .18, .14, WOOD, (a + a2) / 2 + Math.PI / 2); }
}
function person(p, x, z, r, shirt, h = 1) {
  p.at(x, z, r); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
  p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020); p.at(0, 0, 0);
}

export function drawZoo(p) {
  p.at(0, 0, 0);
  // the ground: a round lawn, a paved ring path and a path from the gate to the lion's rock
  p.cyl(0, -.05, 0, 58, .2, GRASS); p.cyl(0, .05, 0, 30, .14, PAVE); p.cyl(0, .08, 0, 22, .14, GRASS);
  p.box(0, .06, 15, 6, .14, 20, PAVE);
  // the outer wall, low and stone, with a gap for the gate
  for (let i = 0; i < 40; i++) { const a = (i + .5) / 40 * 2 * Math.PI; if (Math.abs(Math.sin(a)) < .2 && Math.cos(a) > 0) continue;
    p.box(Math.sin(a) * 28.5, 0, Math.cos(a) * 28.5, 4.6, 1.8, .8, STONE, a + Math.PI / 2); p.box(Math.sin(a) * 28.5, 1.8, Math.cos(a) * 28.5, 4.8, .3, 1, STONE2, a + Math.PI / 2); }
  // the gate: two rock towers, an arch of logs and a lion's head on top
  for (const sx of [-1, 1]) { p.box(sx * 6.5, 0, 27.5, 3.6, 10, 3.6, ROCK); p.box(sx * 6.5, 10, 27.5, 4.2, 1, 4.2, ROCK2); p.cone(sx * 6.5, 11, 27.5, 4.4, 3.4, 0x4f9a43);
    for (let k = 0; k < 3; k++) p.box(sx * 6.5, 2 + k * 3, 29.35, 1.2, 1.2, .2, ROCK2); }
  p.box(0, 8.4, 27.5, 16.5, 1.4, 1.6, WOOD); p.box(0, 9.8, 27.5, 15, 1, 1.4, WOOD2);
  p.ball(0, 10.4, 27.6, 4.2, 3.6, 0xd08a2a); p.box(0, 11, 29.3, 2.4, 2.2, .8, GOLD); p.box(-.5, 11.9, 29.75, .4, .4, .1, DARK); p.box(.5, 11.9, 29.75, .4, .4, .1, DARK); p.box(0, 11.2, 29.75, .6, .4, .1, 0x8a5a2a);
  // the ticket booth and the turnstiles
  p.box(-11, 0, 24, 4, 3.4, 3, CREAM); p.gable(-11, 3.4, 24, 4.6, 1.6, 3.6, RED); p.box(-11, 1.4, 25.55, 2.4, 1.2, .1, 0x9fd6ee);
  p.box(9.2, 0, 24, .3, 4.8, .3, WOOD2); p.box(14.8, 0, 24, .3, 4.8, .3, WOOD2);   // the posts of the naming board
  for (const x of [-2, 0, 2]) { p.box(x, 0, 26.5, .3, 1.1, .3, 0x9aa3ad); p.box(x, 1.1, 26.5, .9, .14, .14, 0x9aa3ad); }

  // the pens, each with its floor, fence, a tree or a rock, and its animal
  for (const pen of PENS) {
    const { x, z, r, rot, floor } = pen;
    p.at(0, 0, 0); p.cyl(x, .1, z, 2 * r, .2, floor);
    if (pen.key === 'dragon') {   // the baby dragon's cage: bars all round and a dome on top
      for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; p.box(x + Math.sin(a) * r, 0, z + Math.cos(a) * r, .22, 6.5, .22, 0x6c7480); }
      p.cyl(x, 6.5, z, 2 * r + .4, .4, 0x6c7480); p.cone(x, 6.9, z, 2 * r + .4, 2, 0x8a93a0); p.ball(x, 8.7, z, .8, .8, GOLD);
      p.box(x, 0, z + r - .1, 2.2, 1, .3, 0x6c7480); p.box(x + .9, 2.4, z + r + .1, .6, .8, .3, GOLD);   // a low step, the padlock
    } else fence(p, x, z, r);
    if (pen.key === 'penguins') {  // a pool with ice floes and an igloo
      p.at(0, 0, 0); p.cyl(x, .12, z, 2 * r - 1.4, .22, 0x2f8fc4);
      for (const [dx, dz, w] of [[-2, -1, 3.4], [2.2, 1.4, 2.6], [.4, -3, 2.2]]) p.box(x + dx, .3, z + dz, w, .5, w * .8, ICE);
      p.ball(x - 3.2, .1, z + 2.6, 3.2, 2.6, WHITE); p.box(x - 2.8, .1, z + 3.8, 1, 1, .8, 0xc9d9e6);
      [[-2, -1], [-1.4, -.6], [-2.6, -1.4], [2.2, 1.4], [1.6, 1], [.4, -3], [.8, -2.6]].forEach(([dx, dz], i) => penguin(beast(p, x + dx, z + dz, rot + (i % 3 - 1) * .5, 1, .8)));
    } else if (pen.key === 'giraffes') {
      giraffe(beast(p, x - 1.6, z - .6, rot, 1)); giraffe(beast(p, x + 2, z + 1, rot + .5, .8));
      p.at(0, 0, 0); p.tree(x + 3.4, z - 2.4, 2.4, 0x5e9e3c); p.box(x + 3.4, 0, z - 2.4, .5, 7, .5, 0x7a5a3a);   // an acacia they eat from
    } else {
      DRAW[pen.key](beast(p, pen.x, pen.z, rot, pen.key === 'dragon' ? .9 : pen.key === 'trex' || pen.key === 'longneck' ? .62 : .78));
    }
    p.at(0, 0, 0);
    if (pen.key === 'trex') { p.box(x - 4, 0, z - 3, 2.6, 1.8, 2.2, ROCK); p.ball(x + 3.6, 0, z - 4, 1.6, 1.2, 0xf2ead8); p.ball(x + 4.4, 0, z - 3.4, 1.4, 1.1, 0xf2ead8); }   // a rock, two big eggs
    if (pen.key === 'longneck') { p.tree(x - 4, z - 3, 2.2); p.tree(x + 4.2, z - 2, 1.8); }
    if (pen.key === 'mammoth') { for (const [dx, dz] of [[-2, -3], [2.4, -2.6]]) p.ball(x + dx, 0, z + dz, 2, 1.2, WHITE); }   // snow drifts
    if (pen.key === 'unicorn') { for (let i = 0; i < 6; i++) p.box(x - 3 + i * 1.2, 0, z - 3.4, 1.2, 4.4 - Math.abs(i - 2.5) * .9, .3, [0xff6b6b, 0xffb347, 0xffe066, 0x7ed957, 0x5ec8f2, 0xb28dff][i]); }   // a little rainbow arch
    // the name board on its two posts, at the front of the pen
    const bx = x + Math.sin(Math.atan2(-x, 8 - z)) * (r + 1), bz = z + Math.cos(Math.atan2(-x, 8 - z)) * (r + 1);
    pen.board = [bx, bz]; p.box(bx - 1.6, 0, bz, .25, 2.6, .25, WOOD2); p.box(bx + 1.6, 0, bz, .25, 2.6, .25, WOOD2);
  }
  // the lion's rock in the middle, with a little waterfall
  p.at(0, 0, 0);
  p.cyl(LION[0], 0, LION[1], 11, 2.4, ROCK); p.cyl(LION[0], 2.4, LION[1], 8, 1.6, ROCK2); p.cyl(LION[0], 4, LION[1], 5, 1, ROCK);
  p.box(LION[0] + 3.6, .2, LION[1] + 3.2, 1.6, 3.8, .4, 0x7fcbea); p.cyl(LION[0] + 3.6, .1, LION[1] + 4.4, 3.4, .3, WATER);
  p.box(LION[0], 0, LION[1] + 6.4, 4, 1.1, .4, CREAM); p.box(LION[0], 1.1, LION[1] + 6.4, 4.2, .2, .6, GOLD);   // the low wall in front of it
  // trees round the ring path, benches, lamps
  for (let i = 0; i < 14; i++) { const a = (i + .3) / 14 * 2 * Math.PI; if (Math.cos(a) > .9) continue; p.tree(Math.sin(a) * 25.6, Math.cos(a) * 25.6, 1.3 + (i % 3) * .2); }
  for (const [x, z, r] of [[-4.5, 11, Math.PI / 2], [4.5, 11, -Math.PI / 2], [-8, -6, 1], [8, -6, -1]]) { p.at(x, z, r); p.box(0, .5, 0, 2.4, .2, .8, WOOD); p.box(0, .9, -.35, 2.4, .7, .14, WOOD); p.box(-1, 0, 0, .2, .5, .7, DARK); p.box(1, 0, 0, .2, .5, .7, DARK); }
  p.at(0, 0, 0); for (const [x, z] of [[-3.6, 20], [3.6, 20], [-3.6, 8], [3.6, 8]]) { p.cyl(x, 0, z, .25, 4, NAVY); p.ball(x, 4, z, .9, .9, 0xfff4c2); }
  // the balloon seller and the ice cream cart
  p.box(6, 0, 20.5, .3, 3.6, .3, 0x9aa3ad); [[0, 0xff6b6b], [1, 0x5ec8f2], [2, 0xffe066], [3, 0x7ed957], [4, 0xb28dff]].forEach(([i, c]) => { const a = i * 1.26; p.box(6 + Math.sin(a) * .5, 3.4, 20.5 + Math.cos(a) * .5, .04, 1.6, .04, 0xffffff); p.ball(6 + Math.sin(a) * .9, 5, 20.5 + Math.cos(a) * .9, 1, 1.2, c); });
  person(p, 6.9, 20.6, -.4, TEAL);
  p.at(-6.5, 19, .3); p.box(0, .5, 0, 3, 1.4, 1.6, 0xf7d9e3); p.cyl(-1.1, 0, .9, .8, .8, DARK); p.cyl(1.1, 0, .9, .8, .8, DARK);
  p.box(0, 1.9, 0, .15, 1.8, .15, 0x9aa3ad); p.cone(0, 3.4, 0, 3.6, 1.2, 0xffffff); p.ball(-.6, 1.9, 0, .7, .7, 0xffb6c8); p.ball(.4, 1.9, .2, .7, .7, 0xfff0b3); p.ball(0, 1.9, -.4, .7, .7, 0x9b6b43);
  person(p, -6.5, 17.6, 0, 0xffb347, .9);
  // visitors at the pens
  for (const [x, z, r, c, h] of [[-9.5, -9.8, 3.6, RED, 1], [-8.4, -10.2, 3.6, GOLD, .7], [9, -9.6, -3.6, TEAL, 1], [-13.2, 5.6, 2.5, 0x5e8ed6, .8], [13, 5.8, -2.5, 0xff8fab, 1],
    [-11, 8.6, 2.5, 0x7ed957, .75], [11.2, 8.4, -2.5, NAVY, 1], [4.4, 5.4, 3.14, 0xb28dff, .7], [-4.4, 5.4, 3.14, RED, 1], [-2.4, -18, 3.14, GOLD, .8], [2.4, -18.2, 3.14, TEAL, 1]])
    person(p, x, z, r, c, h);
}

/** the winged lion: white with a golden mane, wings spread; its own Pen, so it hovers and flaps */
function lionGroup() {
  const g = new THREE.Group(), body = new Pen(), W = 0xfbf8f2, M = 0xe8b323, M2 = 0xd08a2a;
  const b = (w, h, d, c, dx, dy, dz) => body.box(dx, dy, dz, w, h, d, c);
  for (const dx of [-.9, .9]) for (const dz of [-1.6, 1.6]) { b(.8, 1.8, .8, W, dx, 0, dz); b(.9, .4, 1, 0xefe6d6, dx, 0, dz + .1); }   // legs, paws
  b(2.6, 2, 4.6, W, 0, 1.6, 0);                                                         // body
  b(3.4, 3.2, 1.8, M, 0, 2, 2.4); b(2.8, 2.6, 1, M2, 0, 2.3, 3.1);                      // the mane
  b(2, 1.9, 1.7, W, 0, 2.5, 3.4); b(1.2, .8, .8, 0xf3e7d3, 0, 2.6, 4.3); b(.5, .3, .2, 0xd98c8c, 0, 3.05, 4.72);   // head, muzzle, nose
  b(.3, .35, .1, 0x3d6fb3, -.55, 3.5, 4.26); b(.3, .35, .1, 0x3d6fb3, .55, 3.5, 4.26);   // blue eyes
  b(.5, .5, .3, W, -.8, 4.3, 3.2); b(.5, .5, .3, W, .8, 4.3, 3.2);                       // ears
  b(.3, .3, 2.4, W, 0, 2.8, -3.1); b(.6, .6, .6, M, 0, 2.8, -4.4);                       // the tail and its tuft
  body.build(g, { shadows: true });
  const wings = [];
  for (const side of [-1, 1]) { const pivot = new THREE.Group(), w = new Pen();
    for (let i = 0; i < 4; i++) w.box(side * (1.2 + i * 1.3), 0, -i * .25, 1.5, .25, 2.6 - i * .35, i % 2 ? 0xffffff : 0xeef3fb);
    for (let i = 0; i < 4; i++) w.box(side * (1.8 + i * 1.3), -.05, -1.2 - i * .3, 1.1, .2, 1.2, 0xdfe8f4);   // the feathers' tips
    w.build(pivot); pivot.position.set(side * 1, 3.4, .4); g.add(pivot); wings.push({ pivot, side }); }
  g.userData.wings = wings; return g;
}

export function zooLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('ספארי ספיר 🦁', { w: 13, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 6.6, 28.45));
  group.add(sign('רעיון של @ofek_bell · אדריכל', { w: 8, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 5, 28.45));
  group.add(sign('תנו שם לחיה! 🏷️', { w: 6.4, h: 1.4, bg: '#ffffff', fg: '#c8102e', border: '#c8102e', font: big }).at(12, 3.9, 24.2));
  group.add(sign('תייגו חבר בתגובות', { w: 6.4, h: .9, bg: '#c8102e', fg: '#ffffff', border: '#ffffff', font: big }).at(12, 2.7, 24.2));
  // every pen's name board: what the animal is, and its name (or "?")
  const boards = {};
  for (const pen of PENS) { const [bx, bz] = pen.board ?? [pen.x, pen.z + pen.r + 1], face = Math.atan2(-bx, 30 - bz) * 0;
    group.add(sign(pen.label, { w: 3.6, h: .8, bg: '#0f6f73', fg: '#ffffff', border: '#13213b' }).at(bx, 2.3, bz + .2, face));
    const n = NAMES[pen.key], s = sign(n ? `קוראים לי ${n}!` : 'קוראים לי: ?', { w: 3.6, h: 1.1, bg: n ? '#e8b323' : '#fffaf0', fg: '#13213b', border: '#13213b', font: big }).at(bx, 1.2, bz + .2, face);
    group.add(s); boards[pen.key] = s; }
  const n = NAMES.lion;
  group.add(sign('האריה המעופף', { w: 3.8, h: .8, bg: '#0f6f73', fg: '#ffffff', border: '#13213b' }).at(LION[0], 1.95, LION[1] + 6.62));
  group.add(sign(n ? `קוראים לי ${n}!` : 'קוראים לי: ?', { w: 3.8, h: .7, bg: n ? '#e8b323' : '#fffaf0', fg: '#13213b', border: '#13213b', font: big }).at(LION[0], 1.15, LION[1] + 6.62));
  const lion = lionGroup(); lion.scale.setScalar(1.6); lion.position.set(LION[0], 7.4, LION[1]); group.add(lion);
  group.userData.zooBoards = boards; group.userData.lion = lion;
  group.userData.tick = t => { lion.position.y = 7.4 + Math.sin(t * 1.6) * .5; lion.rotation.z = Math.sin(t * 1.6 + 1) * .04;
    for (const { pivot, side } of lion.userData.wings) pivot.rotation.z = side * (.25 + Math.sin(t * 5) * .45); };
}
export const ZOO = { key: 'zoo', name: 'ספארי ספיר', draw: drawZoo, live: zooLive, top: 18 };
