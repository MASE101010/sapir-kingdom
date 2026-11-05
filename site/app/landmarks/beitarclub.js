// מועדון האוהדים של בית"ר ספיר: day 22, @mgmgmgkhs's comment "גם בית״ר רוצים מועדון אוהדים אתה יכול לבנות לנו גם אחד?"
// (6 likes, the day after הפועל's fan club). The yellow and black answer: the clubhouse is a giant football, 22 m tall, with
// black patches, a yellow and black scarf wrapped round its middle, and a door in its front; a flag on top.
// In front, the march road (צעדת האוהדים, from @nevo93510's idea): a yellow road from the gate to the ball's door, fans
// marching on it with flags, a giant drum on a cart, two small stands of seated fans on its sides, the fan shop, umbrellas,
// lamps and trees. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const BYEL = 0xf2c418, BYEL2 = 0xd9ac0c, BBLK = 0x1b1d21, WHITE = 0xf7f5ee, CREAM = 0xf6eedd, GOLD = 0xe8b323,
  GLASS = 0x8fc3d9, PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, WOOD = 0x8a6240, METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f, GRASS = 0x86c766;
const SHIRTS = [BYEL, BBLK, BYEL, WHITE, BYEL, BBLK, 0xf28c28, BYEL];
const BX = 0, BZ = -9, BR = 11, BY = 1.2;                                   // the ball: its centre x, z, radius, the height of its base

/** a fan: legs, a yellow or black shirt, a head, hair, a scarf; seated folds the legs forward */
function fan(p, x, z, r, shirt, y = 0, seated = false) {
  p.at(x, z, r, y);
  if (seated) { p.box(0, 0, .35, .9, .5, .9, 0x2a3550); p.box(0, .45, 0, 1, 1.1, .6, shirt); p.box(0, 1.55, 0, .7, .7, .7, SKIN); p.box(0, 2.15, 0, .74, .2, .74, 0x4a3020); }
  else { p.box(-.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(0, 1, 0, 1, 1.2, .6, shirt); p.box(0, 2.2, 0, .7, .7, .7, SKIN); p.box(0, 2.8, 0, .74, .2, .74, 0x4a3020);
    p.box(0, 1.9, .32, 1.1, .25, .12, shirt === BYEL ? BBLK : BYEL); }
  p.at(0, 0, 0);
}

/** the 12 patch centres of a football: the vertices of an icosahedron, unit length */
function patches() {
  const t = (1 + Math.sqrt(5)) / 2, v = [];
  for (const a of [-1, 1]) for (const b of [-t, t]) v.push([0, a, b], [a, b, 0], [b, 0, a]);
  return v.map(([x, y, z]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; });
}

export function drawBeitarClub(p) {
  p.at(0, 0, 0);
  // the ground: a round lawn, the paved square, the yellow march road with black stripes from the gate to the door
  p.cyl(0, 0, 0, 59, .2, GRASS); p.box(0, .2, 5, 48, .12, 40, PAVE);
  for (let i = -5; i <= 5; i++) p.box(i * 4.2, .33, 5, .12, .02, 40, PAVE2);
  p.box(0, .34, 13, 8, .06, 26, BYEL); for (let k = 0; k < 9; k++) p.box(0, .41, 1.5 + k * 2.9, 8, .02, .5, BBLK);
  // the ball's plinth: a black ring with yellow steps
  p.cyl(BX, .2, BZ, 17, .5, BBLK); p.cyl(BX, .7, BZ, 15, .5, BYEL2); p.cyl(BX, 1.0, BZ, 13, .3, BBLK);
  // the ball: yellow, the 12 black patches, a black seam ring and the scarf round its middle
  p.ball(BX, BY, BZ, 2 * BR, 2 * BR, BYEL);
  const cy = BY + BR;
  for (const [x, y, z] of patches()) { const d = BR - 1.55; p.ball(BX + x * d, cy + y * d - 2.2, BZ + z * d, 4.4, 4.4, BBLK); }
  for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2, r = BR + .15;
    p.box(BX + Math.sin(a) * r, cy - .9, BZ + Math.cos(a) * r, 2.6, 1.8, .55, k % 2 ? BBLK : BYEL, a); }
  // the scarf's ends hang down the front-left side, with fringe
  for (let k = 0; k < 4; k++) p.box(-4.2, cy - 2.4 - k * 1.6, BZ + 10.6 - k * .35, 1.8, 1.6, .4, k % 2 ? BYEL : BBLK);
  for (let k = 0; k < 5; k++) p.box(-4.8 + k * .3, cy - 9.1, BZ + 9.2, .1, .7, .1, k % 2 ? BBLK : BYEL);
  // the door in the ball's front: a black frame, yellow doors, a canopy on two posts
  const F = BZ + Math.sqrt(BR * BR - 7.5 * 7.5) + .2;                                   // the ball's front at door height
  p.box(0, .9, F + .6, 5.4, 5.2, 2.6, BBLK); p.box(0, .9, F + 1.95, 4.2, 4.2, .12, BYEL); p.box(0, .9, F + 2.02, .12, 4.2, .1, BBLK);
  p.box(-.55, 2.8, F + 2.1, .15, .6, .12, GOLD); p.box(.55, 2.8, F + 2.1, .15, .6, .12, GOLD);
  p.box(0, 5.4, F + 3, 7, .3, 3.4, BYEL); p.box(0, 5.7, F + 3, 7.2, .2, 3.6, BBLK); for (const x of [-3.2, 3.2]) p.box(x, .4, F + 4.5, .25, 5, .25, BBLK);
  // the flag on top of the ball (its cloth waves, live) and a gold ball on the mast
  p.cyl(BX, 2 * BR + BY - .3, BZ, .4, 9, METAL); p.ball(BX, 2 * BR + BY + 8.6, BZ, 1, 1, GOLD);

  // the two stands along the march road, a few seated fans on each
  for (const s of [-1, 1]) { const x = s * 9.5;
    for (let r = 0; r < 3; r++) p.box(x + s * r * 1.3, .2 + r * .8, 13, 1.4, .8 + 0, 14, r % 2 ? BBLK : BYEL);
    p.box(x + s * 4, .2, 13, .3, 3.6, 14.4, BBLK);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) if ((k + r) % 3 !== 2) fan(p, x + s * r * 1.3, 7.6 + k * 2.1, s < 0 ? Math.PI / 2 : -Math.PI / 2, SHIRTS[(k + r * 3) & 7], 1 + r * .8, true); }
  // the giant drum on its cart, by the road, with a drummer
  p.box(5.4, .2, 22, 4.4, .6, 3, WOOD); for (const [x, z] of [[3.6, 20.6], [7.2, 20.6], [3.6, 23.4], [7.2, 23.4]]) p.cyl(x, .2, z, 1.2, .5, BBLK);
  p.at(5.4, 22, Math.PI / 2, .8); p.cyl(0, 0, 0, 3.6, .3, BBLK); p.cyl(0, .3, 0, 3.4, 2.2, BYEL); p.cyl(0, 2.5, 0, 3.6, .3, BBLK); p.cyl(0, 2.8, 0, 3.3, .08, WHITE); p.at(0, 0, 0);
  // the flag poles held up along the march (their cloths are live), the fan shop, umbrellas
  p.box(-18, .2, 18, 6, 3.4, 4.4, WHITE); p.gable(-18, 3.6, 18, 6.6, 1.4, 5, BYEL); p.box(-18, 1.2, 20.22, 4.4, 1.2, .1, DARK); p.box(-18, 1.1, 20.6, 5, .2, .8, WOOD);
  for (let k = 0; k < 6; k++) p.box(-20.1 + k * .85, 1.3, 20.7, .4, 1.4, .08, k % 2 ? BBLK : BYEL);
  for (const [x, z, k] of [[17, 4, 0], [22, 4, 1], [17, 11, 1], [22, 11, 0]]) {
    p.cyl(x, .2, z, 2.2, 1.1, WHITE); p.cyl(x, .2, z, .2, 3.4, METAL); p.cone(x, 3.4, z, 4.4, 1.2, k ? BBLK : BYEL);
    for (const dx of [-1.7, 1.7]) { p.box(x + dx, .2, z, .9, .7, .9, k ? BYEL : BBLK); fan(p, x + dx, z, dx < 0 ? Math.PI / 2 : -Math.PI / 2, SHIRTS[(x + z + dx) & 7], .2, true); }
    p.cyl(x - .4, 1.3, z, .35, .5, GOLD); }
  // the gate: two yellow and black striped towers, a black beam (its signs are live)
  for (const x of [-7.4, 7.4]) { for (let k = 0; k < 5; k++) p.box(x, .2 + k * 1.5, 27, 1.8, 1.5, 1.8, k % 2 ? BBLK : BYEL); p.box(x, 7.7, 27, 2.2, .4, 2.2, BBLK); p.ball(x, 8.1, 27, 1.4, 1.4, BYEL); }
  p.box(0, 5.2, 27, 13, 2, .9, BBLK); p.box(0, 7.2, 27, 13.4, .3, 1.1, BYEL);
  // fans standing round the square, the march's leader with a megaphone
  [[-13, 2, .8], [13, 0, -.8], [-14, 9, 1.4], [12.6, 22, -.4], [-4.8, 24, .2], [4.5, 18.5, -1]].forEach(([x, z, r], k) => fan(p, x, z, r, SHIRTS[k + 1], .32));
  fan(p, 0, 26, Math.PI, BBLK, .32); p.cyl(0, 2.1 + .32, 25.2, .5, .9, WHITE);
  // lamps and trees
  for (const [x, z] of [[-13, 24], [13, 25], [-14, -2], [14, -4]]) { p.cyl(x, .2, z, .25, 4.6, BBLK); p.ball(x, 4.6, z, .9, .9, 0xfff3c4); }
  for (const [x, z, s] of [[-24, -10, 1], [24, -12, 1.1], [-19, -22, .9], [19, -23, 1], [-26, 8, .8], [26, 18, .9], [0, -27, .8]]) p.tree(x, z, s, 0x4f9a43);
}

/** a flag: a yellow and black cloth in three strips (its pivot at the pole) */
function cloth(k, s = 1) {
  const f = new Pen(); f.box(.1 * s, -1.6 * s, 0, 1.2 * s, 1.6 * s, .08, k ? BYEL : BBLK); f.box(1.3 * s, -1.6 * s, 0, 1.2 * s, 1.6 * s, .08, k ? BBLK : BYEL); f.box(2.5 * s, -1.6 * s, 0, 1.2 * s, 1.6 * s, .08, k ? BYEL : BBLK);
  const g = new THREE.Group(); f.build(g); return g;
}
/** a marching fan with a flag on a pole, built on its own so the tick can walk it */
function marcher(shirt, k) {
  const f = new Pen(); fan(f, 0, 0, 0, shirt); f.box(.65, 1.2, 0, .12, 4.2, .12, METAL);
  const g = new THREE.Group(); f.build(g); const c = cloth(k % 2, .9); c.position.set(.7, 5.4, 0); g.add(c); g.userData.cloth = c; return g;
}

export function beitarClubLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מועדון האוהדים של בית"ר 💛🖤', { w: 12.6, h: 1.7, bg: '#1b1d21', fg: '#f2c418', border: '#f2c418', font: big }).at(0, 5.35, 27.47));
  group.add(sign('רעיון של @mgmgmgkhs · אדריכל', { w: 8.4, h: 1, bg: '#f2c418', fg: '#13213b', border: '#13213b' }).at(0, 3.9, 27.47));
  const F = BZ + Math.sqrt(BR * BR - 7.5 * 7.5) + .2;
  group.add(sign('בית"ר ספיר 💛🖤', { w: 6.6, h: 1.1, bg: '#1b1d21', fg: '#f2c418', border: '#f2c418', font: big }).at(0, 6.45, F + 4.72));
  group.add(sign('צעדת האוהדים 🥁', { w: 6, h: 1.1, bg: '#f2c418', fg: '#1b1d21', border: '#1b1d21', font: big }).at(9.5 + 4.18, 2.6, 13, Math.PI / 2));
  group.add(sign('צעדת האוהדים 🥁', { w: 6, h: 1.1, bg: '#f2c418', fg: '#1b1d21', border: '#1b1d21', font: big }).at(-9.5 - 4.18, 2.6, 13, -Math.PI / 2));
  group.add(sign('חנות האוהדים 🧣', { w: 5.4, h: 1, bg: '#ffffff', fg: '#1b1d21', border: '#f2c418', font: big }).at(-18, 2.65, 20.26));
  // the flag on the ball, the marchers walking up the road to the door, the drummer's sticks
  const top = new THREE.Group(); top.position.set(BX, 2 * BR + BY + 8.2, BZ); top.add(cloth(1, 1.6)); group.add(top);
  const march = []; for (let k = 0; k < 12; k++) { const g = marcher(SHIRTS[k % 8], k); group.add(g); march.push({ g, x: [-2.4, 0, 2.4][k % 3], k: Math.floor(k / 3) }); }
  const sticks = [-.6, .6].map(dx => { const s = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, 1.4), new THREE.MeshLambertMaterial({ color: WOOD })); s.position.set(5.4 + dx, 3.9, 19.6); group.add(s); return s; });
  const z0 = 25, z1 = 4, row = 3.6, len = z0 - z1;
  group.userData.tick = t => {
    top.rotation.y = .4 * Math.sin(t * 1.1); top.children[0].rotation.z = .05 * Math.sin(t * 4);
    march.forEach(({ g, x, k }, i) => { const s = ((t * 2.2 + k * row) % len + len) % len, z = z0 - s;
      g.position.set(x, .42 + Math.abs(Math.sin(t * 7 + i)) * .18, z); g.rotation.y = Math.PI + .08 * Math.sin(t * 3.5 + i);
      g.visible = s > .6 && s < len - .6; g.userData.cloth.rotation.y = .5 * Math.sin(t * 2 + i); });
    sticks.forEach((s, k) => { s.rotation.x = -.6 + .7 * Math.abs(Math.sin(t * 7 + k * Math.PI / 2)); });
  };
  group.userData.tick(0);
}

export const BEITARCLUB = { key: 'beitar-club', name: 'מועדון האוהדים של בית"ר ספיר', draw: drawBeitarClub, live: beitarClubLive, top: 34 };
