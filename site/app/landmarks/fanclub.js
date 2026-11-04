// מועדון האוהדים של הפועל ספיר: day 21, @eilam.lev99's comment "אפשר לעשות מועדון האוהדים של הפועל ספיר" (2 likes; he
// asked for הפועל ארנה on day 15 too). The fans' home: a two-storey clubhouse in cream with red and black bands, a giant
// red-black scarf hung across its front, a giant gold cup on the roof for the derby rematch (הפועל 1:0), fans on the roof
// terrace jumping, a big outdoor screen with benches full of fans watching the match, drummers, flags on tall masts that
// wave, tables with red and black umbrellas, the fan shop with scarves, the gate with the club's name. Lot radius 30,
// front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const HRED = 0xc8102e, HBLACK = 0x1b1d21, CREAM = 0xf6eedd, WHITE = 0xf7f5ee, GOLD = 0xe8b323, GOLD2 = 0xc99a17, NAVY = 0x13213b,
  GLASS = 0x8fc3d9, PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, WOOD = 0x8a6240, METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f, GRASS = 0x86c766;
const SHIRTS = [HRED, HBLACK, HRED, WHITE, HRED, HBLACK, 0xe8b323, HRED];

/** a fan: legs, a red or black shirt, a head, hair; seated folds the legs forward */
function fan(p, x, z, r, shirt, y = 0, seated = false) {
  p.at(x, z, r, y);
  if (seated) { p.box(0, 0, .35, .9, .5, .9, 0x2a3550); p.box(0, .45, 0, 1, 1.1, .6, shirt); p.box(0, 1.55, 0, .7, .7, .7, SKIN); p.box(0, 2.15, 0, .74, .2, .74, 0x4a3020); }
  else { p.box(-.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(0, 1, 0, 1, 1.2, .6, shirt); p.box(0, 2.2, 0, .7, .7, .7, SKIN); p.box(0, 2.8, 0, .74, .2, .74, 0x4a3020);
    p.box(0, 1.9, .32, 1.1, .25, .12, shirt === HRED ? HBLACK : HRED); }                                           // a scarf round the neck
  p.at(0, 0, 0);
}

export function drawFanclub(p) {
  p.at(0, 0, 0);
  // the ground: a round lawn, the paved fan square in front
  p.cyl(0, 0, 0, 59, .2, GRASS); p.box(0, .2, 6, 50, .12, 34, PAVE);
  for (let i = -6; i <= 6; i++) p.box(i * 3.8, .33, 6, .12, .02, 34, PAVE2);
  p.box(0, .34, 16, 10, .04, 10, HRED); p.box(0, .38, 16, 7, .04, 7, HBLACK); p.box(0, .42, 16, 4, .04, 4, HRED);   // the club's circle in the paving

  // the clubhouse: two storeys, cream walls, a black plinth, red bands, a red parapet round the roof terrace
  const W = 28, D = 14, Z = -13, H = 7.4, F = Z + D / 2;                                                            // F: the front wall
  p.box(0, .2, Z, W, H, D, CREAM); p.box(0, .2, Z, W + .2, 1, D + .2, HBLACK);
  p.box(0, 3.6, Z, W + .3, .5, D + .3, HRED); p.box(0, H + .2, Z, W + .4, .9, D + .4, HRED); p.box(0, H + 1.1, Z, W + .5, .2, D + .5, HBLACK);
  // ground floor: a wall of windows with the bar inside, the double door in the middle under a red canopy
  for (const x of [-11.2, -7.2, -3.6, 3.6, 7.2, 11.2]) { p.box(x, 1.2, F + .02, 3, 2.2, .12, GLASS); p.box(x, 1.2, F + .05, .12, 2.2, .1, HBLACK); }
  p.box(0, .2, F + .03, 3.4, 3, .15, WOOD); p.box(0, .2, F + .07, .1, 3, .1, HBLACK); p.box(-.5, 1.6, F + .1, .15, .5, .1, GOLD); p.box(.5, 1.6, F + .1, .15, .5, .1, GOLD);
  p.box(0, 3.25, F + 1.1, 5, .25, 2.4, HRED); for (const x of [-2.3, 2.3]) p.box(x, .2, F + 2.1, .18, 3.05, .18, HBLACK);
  // inside, seen through the windows: the bar, its stools, the trophy shelf
  p.box(-8, .2, F - 1.4, 9, 1.2, 1, WOOD); for (let k = 0; k < 6; k++) p.cyl(-11.5 + k * 1.4, .2, F - .6, .5, 1, HBLACK);
  for (let k = 0; k < 4; k++) p.cyl(7 + k * 1.4, 1.6, F - .6, .4, .9, GOLD);
  // upper floor: windows with red awnings
  for (let k = 0; k < 7; k++) { const x = -10.8 + k * 3.6; p.box(x, 4.6, F + .02, 2, 1.8, .12, GLASS); p.box(x, 6.45, F + .35, 2.4, .2, .7, k % 2 ? HRED : HBLACK); }
  // the sides: windows, and a huge ❤️🖤 mural on the east wall (painted in live)
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { p.box(s * (W / 2 + .02), 1.4, Z - 4 + k * 4, .12, 1.8, 2, GLASS); }
  p.box(W / 2 + .03, 4.3, Z, .1, 2.6, 9, HBLACK);
  // the giant scarf across the front: red and black blocks sagging between the corners, the ends hanging down with fringe
  for (let i = 0; i < 14; i++) { const x = -13 + i * 2 + 1, sag = 1.1 * (1 - ((x / 13) ** 2)); p.box(x, 5.7 - sag, F + .45, 2.02, 1.4, .3, i % 2 ? HBLACK : HRED); }
  for (const s of [-1, 1]) { for (let k = 0; k < 4; k++) p.box(s * 13.6, 5.7 - k * 1.3 - 1.3, F + .45, 1.6, 1.3, .3, k % 2 ? HBLACK : HRED);
    for (let k = 0; k < 5; k++) p.box(s * 13.6 - .6 + k * .3, 5.7 - 5.2 - .6, F + .45, .1, .6, .1, k % 2 ? HBLACK : HRED); }
  // the roof terrace: a black rail, benches, umbrellas, the giant gold cup of the derby rematch
  for (let x = -13.5; x <= 13.5; x += 1.5) p.box(x, H + 1.3, F - .2, .1, 1, .1, HBLACK); p.box(0, H + 2.2, F - .2, W, .1, .1, HBLACK);
  const R = H + 1.3;
  p.box(0, R, Z - 2, 5, 1.4, 5, HBLACK); p.box(0, R + 1.4, Z - 2, 4.2, .5, 4.2, GOLD2);                            // the cup's plinth
  p.cyl(0, R + 1.9, Z - 2, 2.4, .6, GOLD); p.cyl(0, R + 2.5, Z - 2, 1.2, 2.6, GOLD); p.cyl(0, R + 5.1, Z - 2, 2.2, .5, GOLD);
  p.cyl(0, R + 5.6, Z - 2, 4.4, 3.6, GOLD); p.cyl(0, R + 9.2, Z - 2, 5, .4, GOLD2); p.cyl(0, R + 9.4, Z - 2, 4.2, .2, HRED);   // its bowl, rim, ribbon
  for (const s of [-1, 1]) { p.box(s * 2.7, R + 6.1, Z - 2, .5, 2.8, .5, GOLD); p.box(s * 2.45, R + 8.6, Z - 2, 1, .5, .5, GOLD); p.box(s * 2.45, R + 6.1, Z - 2, 1, .5, .5, GOLD); }
  for (const x of [-10, 10]) { p.cyl(x, R, Z - 4, .2, 2.4, METAL); p.cone(x, R + 2.4, Z - 4, 3.6, 1, x < 0 ? HRED : HBLACK); p.box(x, R, Z - 2.4, 3, .5, .8, WOOD); }

  // flag masts at the corners of the square (their flags wave, live)
  for (const [x, z] of [[-17, -4], [17, -4], [-22, 18], [22, 18]]) { p.cyl(x, .2, z, .35, 14, METAL); p.ball(x, 14.2, z, .7, .7, GOLD); }

  // the big outdoor screen on the west side, and benches of fans watching it
  p.box(-21.5, .2, 4, .8, 4, .8, HBLACK); p.box(-21.5, .2, 12, .8, 4, .8, HBLACK); p.box(-21.3, 4.2, 8, 1, 5.6, 10.6, HBLACK);
  for (let r = 0; r < 3; r++) { const x = -15.5 + r * 2.4;
    p.box(x, .2, 8, .9, .6, 9, WOOD); p.box(x + .55, .2, 8, .2, 1.4, 9, WOOD);
    for (let k = 0; k < 6; k++) fan(p, x, 4.4 + k * 1.45, -Math.PI / 2, SHIRTS[(k + r * 3) % SHIRTS.length], .8, true); }
  // the drummers and the fans in the middle of the square (some of them jump, live)
  for (const [x, z] of [[-3, 9], [3, 9]]) { p.cyl(x, .2, z, 1.5, 1.3, HRED); p.cyl(x, 1.5, z, 1.6, .15, WHITE); p.cyl(x, .9, z, 1.55, .12, GOLD); }
  // tables with red and black umbrellas on the east side
  for (const [x, z, k] of [[12, 3, 0], [18, 3, 1], [12, 10, 1], [18, 10, 0]]) {
    p.cyl(x, .2, z, 2.2, 1.1, WHITE); p.cyl(x, .2, z, .2, 3.4, METAL); p.cone(x, 3.4, z, 4.4, 1.2, k ? HBLACK : HRED);
    for (const [dx, dz] of [[-1.7, 0], [1.7, 0]]) { p.box(x + dx, .2, z + dz, .9, .7, .9, k ? HRED : HBLACK); fan(p, x + dx, z + dz, dx < 0 ? Math.PI / 2 : -Math.PI / 2, SHIRTS[(x + z + dx) & 7], .2, true); }
    p.cyl(x - .4, 1.3, z, .35, .5, GOLD); p.cyl(x + .4, 1.3, z, .35, .5, WHITE); }
  // the fan shop on the east, with scarves on a rail
  p.box(19, .2, 18.5, 6, 3.4, 4, WHITE); p.gable(19, 3.6, 18.5, 6.6, 1.4, 4.6, HRED); p.box(19, 1.2, 20.52, 4.4, 1.2, .1, DARK); p.box(19, 1.1, 20.9, 5, .2, .8, WOOD);
  for (let k = 0; k < 6; k++) p.box(16.9 + k * .85, 1.3, 21, .4, 1.4, .08, k % 2 ? HBLACK : HRED);
  // the gate at the front: black posts, a red beam (its signs are live), a few fans walking in
  for (const x of [-8.2, 8.2]) { p.box(x, .2, 25, 1.4, 6.6, 1.4, HBLACK); p.box(x, 6.8, 25, 1.8, .4, 1.8, HRED); p.ball(x, 7.2, 25, 1.2, 1.2, WHITE); }
  p.box(0, 4.8, 25, 15, 2, .9, HRED); p.box(0, 6.8, 25, 15.4, .3, 1.1, HBLACK);
  [[-4, 21, 0], [-2.6, 19.5, .4], [4.4, 20, -.3], [5.6, 22, .2], [-6, 14, 1.2], [7, 14, -1], [0, 5, Math.PI]].forEach(([x, z, r], k) => fan(p, x, z, r, SHIRTS[k], .32));
  // lamps and benches round the square, trees at the back
  for (const [x, z] of [[-12, 20], [12, 20], [-12, -1], [12, -1]]) { p.cyl(x, .2, z, .25, 4.6, HBLACK); p.ball(x, 4.6, z, .9, .9, 0xfff3c4); }
  for (const [x, z, s] of [[-25, -8, 1], [25, -10, 1.1], [-20, -21, .9], [20, -22, 1], [-26, 6, .8], [26, 0, .9], [0, -23.5, 1]]) p.tree(x, z, s, 0x4f9a43);
}

/** a flag on a mast: a red and black cloth in three strips that ripple (its pivot at the mast) */
function flag(k) {
  const f = new Pen(); f.box(.1, -2.4, 0, 1.4, 2.4, .08, k ? HRED : HBLACK); f.box(1.5, -2.4, 0, 1.4, 2.4, .08, k ? HBLACK : HRED); f.box(2.9, -2.4, 0, 1.4, 2.4, .08, k ? HRED : HBLACK);
  const g = new THREE.Group(); f.build(g); return g;
}
/** a jumping fan, standing, built on its own so the tick can move it */
function jumper(shirt) { const f = new Pen(); fan(f, 0, 0, 0, shirt); const g = new THREE.Group(); f.build(g); return g; }

export function fanclubLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מועדון האוהדים ❤️🖤', { w: 14.2, h: 1.7, bg: '#c8102e', fg: '#ffffff', border: '#1b1d21', font: big }).at(0, 4.95, 25.47));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.4, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.6, 25.47));
  group.add(sign('הפועל ספיר ❤️🖤 מועדון האוהדים', { w: 13, h: 1.6, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e', font: big }).at(0, 8.25, -5.75));
  group.add(sign('🏆 הדרבי: הפועל 1 · מכבי 0', { w: 4.8, h: 1.2, bg: '#1b1d21', fg: '#e8b323', border: '#e8b323' }).at(0, 9, -12.45));
  group.add(sign('שידור חי ⚽ בית"ר · מכבי', { w: 10, h: 5, bg: '#1d6fa5', fg: '#ffffff', border: '#1b1d21', font: big }).at(-20.75, 7, 8, Math.PI / 2));
  group.add(sign('חנות האוהדים 🧣', { w: 5.4, h: 1, bg: '#ffffff', fg: '#c8102e', border: '#c8102e', font: big }).at(19, 2.65, 20.56));
  group.add(sign('הבר 🍺 ❤️🖤', { w: 4, h: .9, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e' }).at(-8, 3.05, -5.9));
  group.add(sign('❤️🖤', { w: 8.6, h: 2.4, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e', font: big }).at(14.1, 4.4, -13, Math.PI / 2));
  // the flags, the jumping fans on the roof and in the square, the drummers' sticks
  const flags = [[-17, -4], [17, -4], [-22, 18], [22, 18]].map(([x, z], k) => { const g = new THREE.Group(); g.position.set(x, 13.8, z); g.add(flag(k % 2)); group.add(g); return g; });
  const jump = [[-6, 8.7, -8], [-3.6, 8.7, -8.4], [3.6, 8.7, -8.2], [6, 8.7, -8], [-8.6, 8.7, -9.4], [8.4, 8.7, -9.6],
    [-1.5, .32, 11.5], [1.5, .32, 11.5], [-5, .32, 11], [5, .32, 11.2], [0, .32, 13]].map(([x, y, z], k) => { const g = jumper(SHIRTS[k % 8]); g.position.set(x, y, z); group.add(g); return { g, y, k }; });
  const sticks = [-3, 3].map(x => { const s = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, 1.4), new THREE.MeshLambertMaterial({ color: WOOD })); s.position.set(x, 2, 9.6); group.add(s); return s; });
  group.userData.tick = t => {
    flags.forEach((g, k) => { g.rotation.y = .5 * Math.sin(t * 1.3 + k) + (k % 2 ? 0 : Math.PI); g.children[0].rotation.z = .05 * Math.sin(t * 4 + k); });
    jump.forEach(({ g, y, k }) => { g.position.y = y + Math.max(0, Math.sin(t * 6.5 + k * 1.7)) * .9; g.rotation.y = .3 * Math.sin(t * 2 + k); });
    sticks.forEach((s, k) => { s.rotation.x = -.6 + .7 * Math.abs(Math.sin(t * 6.5 + k * Math.PI / 2)); });
  };
  group.userData.tick(0);
}

export const FANCLUB = { key: 'fanclub', name: 'מועדון האוהדים של הפועל ספיר', draw: drawFanclub, live: fanclubLive, top: 22 };
