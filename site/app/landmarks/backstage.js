// מאחורי הקלעים: day 44. Day 43's reel brought no comment asking for a place (one asked for flares at the next match), so
// the king picked (CLAUDE.md step 2): in season 1 (גנב הכתר) the thief promised "נתראה בהופעה הגדולה", so before Saturday's
// big show the king builds the place every performer has to pass through, and hides a trap in it: a backstage building of
// dressing rooms with star doors and a stage door in the middle, a rolled net over that door with a red button on a post,
// a make-up table with a bulb mirror, costume racks, a trunk, crates, a spotlight tower, the show programme board, lamps,
// benches, crew and trees.
// Live: the signs, the programme board (at night (state 'night') a new act appears on it: "הפתעה למלך 🎭") and a torn
// patch of fabric with coloured diamonds caught on a nail by the mirror.
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, CURTAIN = 0xa3283a, WOOD = 0x8a6240,
  WOOD2 = 0x6e4a2e, GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, METAL = 0x9aa3ad, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee,
  PINK = 0xf3a6b8, MINT = 0x8fdcc0, LEMON = 0xf6d84a, SKY = 0x7cc4ea, PURPLE = 0x7a5cc4, BULB = 0xfff2c4;

function person(p, x, z, r, shirt, hair = 0x4a3020) {
  p.at(x, z, r, .3);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, hair);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }
function star(p, x, y, z, s, c) { p.box(x, y, z, s, s * .3, .12, c); p.box(x, y - s * .3, z, s * .3, s * .9, .12, c, 0); p.box(x, y - s * .05, z, s * .7, s * .3, .12, c, .6); p.box(x, y - s * .05, z, s * .7, s * .3, .12, c, -.6); }

export function drawBackstage(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 2, 28, .12, 16, PAVE); p.box(0, .2, 13, 5, .12, 8, PAVE);
  for (let k = 0; k < 6; k++) p.box(-12 + k * 4.8, .27, 2, .12, .04, 15, 0xd9cdb2);                                   // paving lines
  // the backstage hall: cream walls, a navy roof with a gold edge, a strip of bulbs along the front
  p.box(0, .3, -7, 26, 6.4, 7, CREAM); p.box(0, .3, -7, 26.3, .5, 7.3, 0xd9cdb2);
  p.box(0, 6.7, -7, 26.6, .5, 7.6, GOLD); p.box(0, 7.2, -7, 25.6, 1, 6.8, NAVY);
  for (let k = 0; k < 4; k++) p.box(0, 8.2 + k * .5, -7, 22 - k * 5, .5, 6 - k, NAVY);
  for (let k = 0; k < 24; k++) p.ball(-12.2 + k * 1.06, 6.2, -3.4, .32, .32, k % 2 ? BULB : LEMON);
  // four dressing-room doors with gold stars and numbers, and a big red stage door in the middle
  for (const [i, x] of [[1, -10.2], [2, -6], [3, 6], [4, 10.2]].map(([i, x]) => [i, x])) {
    p.box(x, .3, -3.56, 2.7, 4.3, .1, WHITE); p.box(x, .3, -3.42, 2.3, 3.9, .14, [PINK, MINT, SKY, LEMON][i - 1]);
    star(p, x, 3.4, -3.3, .9, GOLD); p.ball(x + .8, 1.9, -3.3, .2, .2, GOLD);
    p.box(x, 4.9, -3.4, 1.8, .7, .1, WHITE);
  }
  p.box(0, .3, -3.6, 4.6, 5.5, .1, GOLD); p.box(0, .3, -3.45, 4.1, 5.1, .14, CURTAIN); p.box(0, .3, -3.36, .1, 5.1, .06, 0x7c1c2b);
  p.ball(-.5, 2.4, -3.3, .25, .25, GOLD); p.ball(.5, 2.4, -3.3, .25, .25, GOLD);
  // the trap: a beam over the stage door with the net rolled on it, ropes down the sides, a red button on a post
  p.box(0, 5.9, -2.6, 6.4, .35, .35, WOOD2); p.box(0, 6.25, -2.5, 5.8, 1, 1, 0xc9b48a);
  for (let k = 0; k < 9; k++) p.box(-2.6 + k * .65, 6.25, -1.98, .07, 1.02, .05, 0x6b5a40);
  for (let k = 0; k < 3; k++) p.box(0, 6.4 + k * .3, -1.97, 5.8, .06, .05, 0x6b5a40);
  for (const s of [-1, 1]) { p.box(s * 3.1, .3, -2.6, .2, 6, .2, WOOD2); p.box(s * 3.1, 3, -2.4, .05, 3, .05, 0xd8c8a0); }
  p.box(4.4, .3, -1.4, .3, 1.6, .3, DARK); p.box(4.4, 1.9, -1.4, .7, .5, .6, NAVY); p.cyl(4.4, 2.4, -1.4, .45, .2, RED);
  // the make-up station on the right: a table, a mirror framed with bulbs, a stool, brushes and a wig stand
  p.box(9.4, .3, 2.4, 4.4, 1, 1.4, WOOD); p.box(9.4, 1.3, 2.4, 4.6, .12, 1.6, WOOD2);
  p.box(9.4, 1.42, 1.7, 3.6, 2.6, .15, DARK); p.box(9.4, 1.6, 1.78, 3.1, 2.2, .06, 0xcde8f3);
  for (let k = 0; k < 6; k++) { p.ball(7.75 + k * .66, 4.05, 1.85, .26, .26, BULB); }
  for (let k = 0; k < 3; k++) { p.ball(7.65, 1.7 + k * .8, 1.85, .26, .26, BULB); p.ball(11.15, 1.7 + k * .8, 1.85, .26, .26, BULB); }
  p.cyl(9.4, .3, 3.7, .9, 1.1, CURTAIN); p.cyl(8.2, 1.42, 2.6, .22, .5, PINK); p.cyl(10.6, 1.42, 2.6, .3, .3, LEMON); p.box(9, 1.42, 2.8, .5, .12, .3, PURPLE);
  p.cyl(7.7, 1.42, 2.9, .1, .8, DARK); p.ball(7.7, 2.2, 2.9, .55, .6, 0xe7c98a);
  // the costume racks on the left: rails with colourful costumes, a hat stand, a trunk, crates
  for (const z of [1.2, 4]) {
    p.box(-11.6, .3, z, .12, 2.6, .12, METAL); p.box(-7.2, .3, z, .12, 2.6, .12, METAL); p.box(-9.4, 2.9, z, 4.5, .1, .1, METAL);
    for (let k = 0; k < 7; k++) p.box(-11.1 + k * .6, 1.2, z, .45, 1.65, .6, [RED, TEAL, LEMON, PURPLE, PINK, SKY, MINT][(k + (z > 2 ? 3 : 0)) % 7]);
  }
  p.cyl(-13.4, .3, 6.6, .12, 2.4, WOOD2); p.cone(-13.4, 2.7, 6.6, .9, .6, NAVY); p.cone(-13.4, 2.1, 6.6, .7, .5, RED);
  p.box(-9, .3, 7, 2.4, 1.2, 1.4, WOOD2); p.box(-9, 1.5, 7, 2.5, .25, 1.5, GOLD); p.box(-9, .9, 7.72, .4, .4, .05, GOLD);
  for (const [x, z, s] of [[-13, -1, 1.2], [-11.8, -1.6, .9], [13, -1.2, 1.1], [12.4, 6.6, .9], [-12.2, 9.8, 1]]) p.box(x, .3, z, s, s, s, WOOD);
  // the spotlight tower and a follow spot, ropes and sandbags
  p.box(-14.2, .3, -12.2, .3, 9, .3, METAL); p.box(-13.2, .3, -12.2, .3, 9, .3, METAL); for (let k = 0; k < 6; k++) p.box(-13.7, 1 + k * 1.5, -12.2, 1.2, .1, .1, METAL);
  p.box(-13.7, 9.3, -12.2, 1.8, .2, 1, DARK); p.cyl(-14.2, 9.5, -11.8, .8, .8, DARK); p.cyl(-13.2, 9.5, -11.8, .8, .8, DARK);
  p.cyl(13.2, .3, -12, .3, 1.8, DARK); p.box(13.2, 2.1, -12, 1, .8, 1.6, DARK); p.cyl(13.2, 2.3, -11.1, .7, .2, BULB);
  for (const x of [-2.4, 2.4]) p.box(x, .3, -1.6, .8, .5, .6, 0xb9a57e);
  // the programme board out front on two posts (its face is live), benches, lamps, trees, red carpet
  p.box(-3.6, .3, 9.8, .3, 4.6, .3, WOOD2); p.box(3.6, .3, 9.8, .3, 4.6, .3, WOOD2); p.box(0, 4.9, 9.8, 8, .3, .5, NAVY);
  p.box(0, .25, 4, 2.6, .06, 12, CURTAIN); for (let k = 0; k < 6; k++) { p.cyl(-1.7, .3, -1 + k * 2.2, .2, 1.1, GOLD); p.cyl(1.7, .3, -1 + k * 2.2, .2, 1.1, GOLD); }
  for (const [x, z, r] of [[13.4, 9.6, -Math.PI / 2], [-14, 2.8, Math.PI / 2]]) { p.box(x, .5, z, 3, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3, .8, .2, WOOD, r); }
  for (const [x, z] of [[-5, 15.6], [5, 15.6], [-14.4, 12], [14.4, 12]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, BULB); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, s] of [[15.6, -6, .8], [-15.6, -6, .85], [8, 13.6, .7], [-8.6, 13.6, .7], [0, -13.8, .8]]) tree(p, x, z, s);
  // the crew: a stage hand with a ladder, a make-up artist, a costume lady, two dancers rehearsing
  person(p, 6.6, 6.4, -2.6, NAVY); p.box(5.6, .3, 6.9, .1, 3.4, .1, WOOD); p.box(6.3, .3, 6.9, .1, 3.4, .1, WOOD); for (let k = 0; k < 5; k++) p.box(5.95, .7 + k * .6, 6.9, .75, .08, .08, WOOD);
  person(p, 10.4, 4.6, Math.PI * .9, PINK, 0xd8a04a); person(p, -7.4, 2.6, .5, PURPLE, 0x2a1a10);
  person(p, -3.2, 12.4, Math.PI - .4, TEAL); person(p, 2.6, 12.8, Math.PI + .3, LEMON, 0x8a5a2a);
}

export function backstageLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מאחורי הקלעים 🎭', { w: 9, h: 1.6, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 9.4, -3.6));
  group.add(sign('כניסה לאמנים בלבד ⭐', { w: 3.6, h: .7, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 5.3, -3.3));
  [1, 2, 3, 4].forEach((n, i) => group.add(sign('חדר ' + n, { w: 1.6, h: .55, bg: '#ffffff', fg: '#13213b', border: '#e8b323' }).at([-10.2, -6, 6, 10.2][i], 5.25, -3.32)));
  group.add(sign('לא ללחוץ! 🔴', { w: 1.6, h: .5, bg: '#c2412d', fg: '#ffffff', border: '#ffffff' }).at(4.4, 2.75, -1.08));
  // the programme board: three acts by day, a fourth (in another hand) at night
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  let extra = false;
  const draw = () => {
    g.fillStyle = '#e8b323'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#fffaf0'; g.fillRect(10, 10, 492, 236);
    g.direction = 'rtl'; g.textAlign = 'right'; g.fillStyle = '#13213b';
    g.font = '900 40px "Secular One", Rubik, sans-serif'; g.textAlign = 'center'; g.fillText('ההופעה הגדולה · שבת', 256, 54);
    g.textAlign = 'right'; g.font = '700 30px Rubik, sans-serif';
    ['1. להקת הממלכה 🎺', '2. הדרקונים רוקדים 🐉', '3. המלך שר 👑'].forEach((t, i) => g.fillText(t, 480, 104 + i * 40));
    if (extra) { g.save(); g.translate(256, 232); g.rotate(-.05); g.textAlign = 'center'; g.fillStyle = '#c2412d'; g.font = '900 32px "Secular One", Rubik, sans-serif'; g.fillText('4. הפתעה למלך 🎭', 0, 0); g.restore(); }
    tex.needsUpdate = true;
  };
  draw(); if (document.fonts) document.fonts.ready.then(draw);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.6), new THREE.MeshBasicMaterial({ map: tex })); board.position.set(0, 2.9, 10.08); group.add(board);
  // the patch of fabric with coloured diamonds, caught on a nail by the mirror (only after the night)
  const pc = document.createElement('canvas'); pc.width = 128; pc.height = 128; const pg = pc.getContext('2d');
  const cols = ['#c2412d', '#e8b323', '#0f6f73', '#7a5cc4', '#2f8fd8', '#45b36b'];
  for (let i = -2; i < 6; i++) for (let j = -2; j < 6; j++) { pg.fillStyle = cols[(i + j * 2 + 12) % cols.length]; pg.beginPath(); const x = i * 32 + (j % 2) * 16, y = j * 24; pg.moveTo(x, y - 24); pg.lineTo(x + 16, y); pg.lineTo(x, y + 24); pg.lineTo(x - 16, y); pg.closePath(); pg.fill(); }
  const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace;
  const shape = new THREE.Shape([[0, 0], [.55, .05], [.62, .35], [.5, .62], [.18, .7], [.05, .45], [-.05, .2]].map(([x, y]) => new THREE.Vector2(x, y)));
  const patchGeo = new THREE.ShapeGeometry(shape); patchGeo.computeBoundingBox();
  const uv = patchGeo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / .7, uv.getY(i) / .7);
  const patch = new THREE.Mesh(patchGeo, new THREE.MeshBasicMaterial({ map: ptex, side: THREE.DoubleSide }));
  patch.position.set(11.25, 2.75, 1.9); patch.rotation.z = -.25; patch.visible = false; group.add(patch);
  const nail = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .3, 6), new THREE.MeshStandardMaterial({ color: 0x777777, metalness: .6 }));
  nail.rotation.x = Math.PI / 2; nail.position.set(11.45, 3.35, 1.9); group.add(nail);
  // the trap (day 45): a net that drops from the beam over the stage door like a curtain on three sides; state 'trap' 0..1
  const net = new THREE.Group(); net.position.set(0, 6.1, -1.6); group.add(net);
  const rope = new THREE.MeshLambertMaterial({ color: 0x6b5a40 });
  const strand = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rope); m.position.set(x, y, z); net.add(m); };
  for (let i = 0; i <= 12; i++) { const x = -2.7 + i * .45; strand(.05, 6, .05, x, -3, 1.4); }
  for (let i = 0; i <= 6; i++) { const z = -1.4 + i * .47; strand(.05, 6, .05, -2.7, -3, z); strand(.05, 6, .05, 2.7, -3, z); }
  for (let j = 0; j <= 12; j++) { const y = -j * .5; strand(5.45, .05, .05, 0, y, 1.4); strand(.05, .05, 2.85, -2.7, y, 0); strand(.05, .05, 2.85, 2.7, y, 0); }
  net.scale.y = .001; net.visible = false;
  group.userData.trap = k => { net.visible = k > .01; net.scale.y = Math.max(.001, k); };
  group.userData.night = k => { const on = k > .5; patch.visible = on; if (on !== extra) { extra = on; draw(); } };
}

export const BACKSTAGE = { key: 'backstage', name: 'מאחורי הקלעים', draw: drawBackstage, live: backstageLive, top: 13 };
