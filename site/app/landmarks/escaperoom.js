// חדר הבריחה של הממלכה: day 42. Day 41's reel brought no comment asking for a place, so the king picked (CLAUDE.md step 2):
// in season 1 (גנב הכתר) the thief left "רמה 2" on an arcade machine, he plays with the kingdom like a game, so the king builds
// a game he cannot win: an escape room. Lot 41 (r 18, small): a purple and teal block with a giant golden padlock on the roof,
// a vault door with a combination dial, a countdown screen over it, walls of coloured puzzle tiles, giant question marks,
// a giant key, a hedge maze in front, puzzle cubes, a ticket booth, visitors, benches, lamps and trees.
// Live: the signs and the countdown screen, which at night (state 'night') shows "רמה 3 ⭐".
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, METAL = 0x9aa3ab,
  PURPLE = 0x6a4c9c, PURPLE2 = 0x8a6cc0, HEDGE = 0x3f8a46, TILES = [0xe8b323, 0xc2412d, 0x2f8fd8, 0x45b36b, 0xf3a6b8, 0xf7f5ee];

function person(p, x, z, r, shirt, hair = 0x4a3020) {
  p.at(x, z, r, .3);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, hair);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }
// a puzzle cube: a small stack of coloured cubelets
function cube(p, x, z, s, k) { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let l = 0; l < 2; l++)
  p.box(x + (i - .5) * s, .3 + l * s, z + (j - .5) * s, s * .94, s * .94, s * .94, TILES[(i + j * 2 + l * 3 + k) % 6]); }
// a giant question mark made of blocks, standing on a little base
function question(p, x, z, c, s = 1) {
  p.box(x, .3, z, 1.4 * s, .3, 1.4 * s, DARK); p.box(x, .6, z, .7 * s, .7 * s, .7 * s, c);
  p.box(x, 1.8 * s, z, .7 * s, 1.2 * s, .7 * s, c); p.box(x + .55 * s, 2.9 * s, z, .7 * s, .7 * s, .7 * s, c);
  p.box(x + .8 * s, 3.5 * s, z, .7 * s, .9 * s, .7 * s, c); p.box(x + .25 * s, 4.3 * s, z, 1.6 * s, .7 * s, .7 * s, c); p.box(x - .55 * s, 3.8 * s, z, .7 * s, .7 * s, .7 * s, c);
}

export function drawEscapeRoom(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 0, 24, .12, 18, PAVE); p.box(0, .2, 13.5, 5, .12, 9, PAVE);
  for (let k = 0; k < 10; k++) p.box(-11 + k * 2.45, .25, 7.4, 1.2, .14, 1.2, TILES[k % 6]);                          // a tiled stripe
  // the block: purple ground floor, teal upper floor, gold bands, a flat roof
  p.box(0, .3, -4, 16, 5.4, 9, PURPLE); p.box(0, 5.7, -4, 16, 3.6, 9, TEAL); p.box(0, 5.5, -4, 16.4, .3, 9.4, GOLD);
  p.box(0, 9.3, -4, 16.6, .5, 9.6, NAVY); p.box(0, .3, -4, 16.4, .4, 9.4, 0x4c3672);
  // the puzzle tile walls on the upper floor front and the two sides
  for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) p.box(-6.6 + i * 2.2, 6.1 + j * 1.6, .52, 1.9, 1.35, .12, TILES[(i * 2 + j * 3) % 6]);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) p.box(s * 8.06, 6.1 + j * 1.6, -7.4 + i * 2.2, .12, 1.35, 1.9, TILES[(i + j * 2 + (s > 0 ? 3 : 0)) % 6]);
  // the vault door: a round steel door with bolts, a big combination dial and a handle wheel
  p.box(0, .3, .5, 5.2, 4.6, .3, DARK);
  for (let k = 0; k < 9; k++) { const w = Math.sin((k + .5) / 9 * Math.PI) * 4; p.box(0, .5 + k * .45, .72, w, .45, .25, k % 2 ? METAL : 0xb6bec6); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.box(Math.cos(a) * 1.75, 2.5 + Math.sin(a) * 1.75, .9, .3, .3, .2, GOLD); }
  p.box(0, 2.5, .95, 1.3, 1.3, .25, NAVY); p.box(0, 2.5, 1.08, .9, .9, .1, GOLD); p.box(0, 2.9, 1.14, .1, .3, .05, DARK);
  for (const a of [0, Math.PI / 2]) p.box(1.4, 1.9, 1, .16, 1.4, .16, DARK, a);
  // the giant golden padlock on the roof: the body, the keyhole and the shackle
  p.box(0, 9.8, -3.5, 7, 5.6, 2.4, GOLD); p.box(0, 9.8, -3.5, 7.3, .4, 2.6, 0xc9971a); p.box(0, 15, -3.5, 7.3, .4, 2.6, 0xc9971a);
  p.box(0, 11.6, -2.25, 1, 1, .12, DARK); p.box(0, 10.5, -2.25, .45, 1.4, .12, DARK);
  for (const s of [-1, 1]) p.box(s * 2.4, 15.4, -3.5, 1.1, 3.2, 1.1, METAL);
  p.box(0, 18.3, -3.5, 5.9, 1.1, 1.1, METAL); for (const s of [-1, 1]) p.box(s * 2.15, 17.9, -3.5, 1.1, 1.1, 1.1, METAL);
  // windows on the ground floor, puzzle doors on the sides
  for (const x of [-5.6, 5.6]) { p.box(x, 1.4, .5, 2.6, 2.2, .14, WHITE); p.box(x, 1.5, .58, 2.2, 1.9, .06, 0x3a2a5c); p.box(x, 2.45, .62, 2.2, .1, .04, WHITE); }
  for (const s of [-1, 1]) { p.box(s * 8.06, .3, -2, .14, 3.4, 2, NAVY); p.box(s * 8.12, 2.1, -1.4, .05, .3, .3, GOLD); }
  // giant question marks on the plaza, a giant key leaning on the wall, puzzle cubes
  question(p, -10.4, 1.8, RED, 1.1); question(p, 10.8, 1.2, 0x2f8fd8, 1.1);
  p.at(-7.8, .95, -.35, 0); p.box(0, .3, 0, .5, 6.4, .3, GOLD); p.box(0, 6.7, 0, 2.2, 2.2, .3, GOLD); p.box(0, 6.95, .1, 1, 1, .3, PURPLE);
  p.box(.6, .8, 0, .9, .4, .3, GOLD); p.box(.6, 1.6, 0, .6, .4, .3, GOLD); p.at(0, 0, 0);
  cube(p, 4.4, 5.6, .7, 0); cube(p, 6.2, 6.4, .55, 2); cube(p, -4.6, 6.2, .6, 4);
  // the hedge maze in front on the left: low green walls with a gold trophy in the middle
  const H = (x, z, w, d) => p.box(x, .3, z, w, 1.5, d, HEDGE);
  H(-8, 9.5, 6, .8); H(-10.7, 11.5, .8, 4); H(-5.3, 11.8, .8, 3.4); H(-8.4, 13.4, 4.4, .8); H(-8.2, 11.5, 2.6, .8);
  p.cyl(-7, .3, 12.4, .8, .6, DARK); p.cyl(-7, .9, 12.4, .9, .9, GOLD);
  // the ticket booth on the right with a striped roof
  p.box(9.6, .3, 11, 3, 2.8, 2.4, CREAM); p.box(9.6, 3.1, 11, 3.4, .3, 2.8, RED); for (let k = 0; k < 4; k++) p.box(8.35 + k * .83, 3.4, 11, .42, .5, 2.8, k % 2 ? WHITE : RED);
  p.box(9.6, 1.4, 12.22, 2, 1, .06, 0x3a4a60); p.box(9.6, 1.25, 12.4, 2.4, .12, .4, WOOD);
  // visitors waiting at the door, a guide with a flag, benches, lamps, trees
  person(p, 1.8, 4.6, Math.PI, 0xf3a6b8); person(p, 3.2, 5.2, Math.PI - .4, 0x8fdcc0); person(p, -1.6, 4.4, Math.PI + .3, 0xc9b2ec, 0x8a5a2a);
  person(p, 8.2, 13.4, Math.PI / 2, TEAL); person(p, -2.8, 9.6, Math.PI, GOLD); p.cyl(-2.4, .3, 9.4, .1, 3.2, DARK); p.box(-2, 3.2, 9.4, .8, .5, .05, RED);
  for (const [x, z, r] of [[12.4, 3.6, -Math.PI / 2], [-13.2, 6, Math.PI / 2]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3.2, .8, .2, WOOD, r); }
  for (const [x, z] of [[-4.6, 17], [4.6, 17], [-14.6, -2], [14.6, -2]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, s] of [[14.4, -11, .9], [-14.2, -11, 1], [15.2, 9, .7], [0, -14.6, .8], [-15, -5.6, .7]]) tree(p, x, z, s);
}

export function escapeRoomLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('חדר הבריחה 🔐', { w: 6, h: 1.3, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 4.6, .9));
  group.add(sign('אף אחד לא יוצא! 😏', { w: 3.6, h: .8, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(9.6, 4.3, 12.5));
  group.add(sign('המבוך 🌿', { w: 2.4, h: .7, bg: '#ffffff', fg: '#0f6f73', border: '#0f6f73' }).at(-8, 2.4, 9.05));
  // the countdown screen over the upper tiles: 60:00 by day, at night (state 'night') "רמה 3 ⭐"
  const font = (w, px) => `${w} ${px}px "Secular One", Rubik, sans-serif`;
  const screen = (paint, z) => { const c = document.createElement('canvas'); c.width = 512; c.height = 192; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const draw = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.direction = 'rtl'; g.textAlign = 'center'; paint(g); tex.needsUpdate = true; };
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.95), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(0, 7.45, z); group.add(m); return m; };
  screen(g => { g.fillStyle = '#05070c'; g.fillRect(0, 0, 512, 192); g.fillStyle = '#ff5a4a'; g.font = font(900, 130); g.direction = 'ltr'; g.fillText('60:00', 256, 145); }, .62);
  const lvl = screen(g => { g.fillStyle = '#05070c'; g.fillRect(0, 0, 512, 192); g.fillStyle = '#f6d84a'; g.font = font(900, 110); g.fillText('רמה 3 ⭐', 256, 135); }, .66);
  lvl.visible = false;
  group.userData.night = k => { lvl.visible = k > .5; };
}

export const ESCAPEROOM = { key: 'escape-room', name: 'חדר הבריחה של הממלכה', draw: drawEscapeRoom, live: escapeRoomLive, top: 19 };
