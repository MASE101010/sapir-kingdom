// פסל המלך עם הדגל האדום: day 26, @eilam.lev99's comment "אפשר לבנות במגרש של הפועל ספיר פסל של המלך רק במקום שרביט עם
// דגל אדום" (1 like, the earliest of three tied comments on day 25's reel). The fans' square: the king in gold, 18 m tall,
// on a red and black pedestal, holding up a huge red flag (it waves, live) where the scepter used to be, his other hand
// waving to the fans. Round him a red and white paved square with the club's ball in flowers, flag poles with red and
// black flags, fans with scarves taking photos, benches, lamps, a drum, a photo frame for selfies, the gate to the square.
// Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const HRED = 0xc8102e, HBLACK = 0x1b1d21, GOLD = 0xe8b323, GOLD2 = 0xc9971a, CREAM = 0xf6eedd, WHITE = 0xf7f5ee, PAVE = 0xe6dcc6,
  METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f, GRASS = 0x86c766, WOOD = 0x8a6240, NAVY = 0x13213b;
const S = 2.6;                                                              // the statue's voxel scale (a 7 m figure × 2.6 ≈ 18 m)
export const KF_TOP = 6.6;                                                  // the pedestal's top

function fan(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020); p.box(0, 1.85, .3, 1.05, .24, .12, shirt === HRED ? HBLACK : HRED);
  p.at(0, 0, 0);
}

export function drawKingFlag(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the square: a red and white checker of paving round the statue, a white ring, the path from the gate
  for (let i = -6; i < 6; i++) for (let j = -6; j < 6; j++) { const x = i * 3.4 + 1.7, z = j * 3.4 + 1.7; if (Math.hypot(x, z) > 21) continue;
    p.box(x, .2, z, 3.4, .12, 3.4, (i + j) % 2 ? PAVE : 0xf2d6d0); }
  p.cyl(0, .2, 0, 44, .1, WHITE); p.cyl(0, .22, 0, 42.6, .1, PAVE); p.box(0, .2, 23.5, 6, .12, 10, PAVE);
  // the pedestal: three steps, a red block with black bands, a gold plaque (its text is live)
  p.cyl(0, .3, 0, 15, .8, CREAM, 8); p.cyl(0, 1.1, 0, 12.6, .8, CREAM2(), 8);
  p.box(0, 1.9, 0, 8.4, 4.7, 8.4, HRED); p.box(0, 2.4, 0, 8.6, .5, 8.6, HBLACK); p.box(0, 5.4, 0, 8.6, .5, 8.6, HBLACK); p.box(0, 6.1, 0, 9, .5, 9, GOLD);
  p.box(0, 3.1, 4.25, 5, 1.8, .15, GOLD);
  // the king in gold, built from voxels like the statue in front of the palace, × S, standing on the pedestal
  const v = (w, h, d, x, y, z, c = GOLD) => p.box(x * S, KF_TOP + y * S, z * S, w * S, h * S, d * S, c);
  v(.84, .3, 1.1, -.5, 0, .12); v(.84, .3, 1.1, .5, 0, .12);                                     // shoes
  v(.82, 1.9, .82, -.5, .3, 0); v(.82, 1.9, .82, .5, .3, 0);                                     // legs
  v(2, 2.1, 1.1, 0, 2.2, 0); v(2.06, .3, 1.16, 0, 2.6, 0, GOLD2);                                // body, belt
  v(.62, 2, .62, -1.31, 2.3, 0);                                                                  // the left arm down by his side
  v(1.8, 1.7, 1.8, 0, 4.3, 0);                                                                    // head
  v(1.92, .55, 1.92, 0, 6, 0, GOLD2); v(1.86, .55, .32, 0, 4.3, .82, GOLD2);                      // hair, beard
  v(.32, .32, .1, -.45, 5, .92, HBLACK); v(.32, .32, .1, .45, 5, .92, HBLACK);                    // eyes
  v(1.6, .4, 1.6, 0, 6.55, 0); for (const [x, z] of [[-.6, -.6], [.6, -.6], [-.6, .6], [.6, .6]]) v(.35, .5, .35, x, 6.95, z);   // crown
  for (const [x, z] of [[-.6, .62], [.6, .62]]) v(.2, .2, .1, x, 6.75, z + .2, HRED);            // red stones in the crown
  // the right arm raised up holding the flag pole (the flag itself waves, live)
  v(.62, 2.2, .62, 1.31, 3.7, 0); v(.7, .7, .7, 1.31, 5.9, 0);
  p.cyl(1.31 * S, KF_TOP + 4 * S, .3, .5, 13, METAL); p.ball(1.31 * S, KF_TOP + 4 * S + 13, .3, 1, 1, GOLD);
  // a red scarf round his neck, the club's
  v(2.1, .35, 1.2, 0, 3.95, 0, HRED); v(.4, 1.2, .2, .5, 2.8, .62, HRED); v(.4, .3, .22, .5, 2.6, .62, HBLACK);

  // flag poles round the square with red and black flags (static ones; the king's is the one that waves)
  for (let k = 0; k < 8; k++) { const a = (k + .5) / 8 * Math.PI * 2, x = Math.sin(a) * 19, z = Math.cos(a) * 19;
    if (z > 15) continue; p.cyl(x, .2, z, .3, 9, METAL); p.box(x + .9, 7.6, z, 1.8, 1.2, .08, k % 2 ? HBLACK : HRED); p.box(x + .9, 7.15, z, 1.8, .3, .1, k % 2 ? HRED : HBLACK); }
  // the club's ball in red and white flowers on each side of the path, benches, lamps
  for (const s of [-1, 1]) { const x = s * 12, z = 12;
    p.cyl(x, .2, z, 7, .5, 0x6d4a2e); p.cyl(x, .5, z, 6.4, .2, WHITE); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; p.cyl(x + Math.sin(a) * 1.6, .55, z + Math.cos(a) * 1.6, 1.4, .25, HRED); }
    p.box(x - s * 6, .7, z + 4, 3.2, .25, .9, WOOD, s * .5); p.box(x - s * 6, .2, z + 4, .2, .5, .7, DARK, s * .5); }
  for (const [x, z] of [[-6, 18], [6, 18], [-15, -8], [15, -8], [-8, -16], [8, -16]]) { p.cyl(x, .2, z, .25, 4.6, HBLACK); p.ball(x, 4.6, z, .9, .9, 0xfff3c4); }
  // the selfie frame: a big red frame on legs with a gold crown on top, fans posing in front of it
  p.box(-15, .2, 5, .4, 6, .4, HRED); p.box(-9.6, .2, 5, .4, 6, .4, HRED); p.box(-12.3, 6.2, 5, 5.8, .4, .4, HRED); p.box(-12.3, .2, 5, 5.8, .4, .4, HRED);
  p.cone(-12.3, 6.6, 5, 1.6, 1.2, GOLD, 4);
  // a big drum on a cart next to the statue and the drummer
  p.cyl(11, 1.2, -2, 3, 2.4, HRED); p.cyl(11, 1.15, -2, 3.1, .2, GOLD); p.cyl(11, 3.55, -2, 3.1, .2, GOLD); p.cyl(11, 3.6, -2, 2.8, .05, WHITE);
  for (const [x, z] of [[10, -3], [12, -3], [10, -1], [12, -1]]) p.cyl(x, .2, z, .6, .9, DARK);
  // fans round the square, with scarves, looking up at the king
  [[-4, 9, Math.PI, HRED], [-2.2, 10.4, Math.PI, HBLACK], [2.4, 9.6, Math.PI, HRED], [4.2, 10.8, Math.PI, HRED], [-12.3, 7.4, Math.PI, HRED],
   [-11, 7.6, Math.PI, HBLACK], [13.4, -2, -Math.PI / 2, HBLACK], [-9, -6, Math.PI * .75, HRED], [8, -9, -Math.PI * .25, HRED], [0, 15, Math.PI, HBLACK]].forEach(([x, z, r, c]) => fan(p, x, z, r, c));
  // the gate to the square: two red pillars with balls, the beam (its sign is live)
  for (const x of [-6.8, 6.8]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, HRED); p.ball(x, 6.6, 27, 1.4, 1.4, WHITE); }
  p.box(0, 4.6, 27, 15.2, 2, .8, HBLACK); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
  for (const [x, z, s] of [[-24, -12, 1], [24, -12, 1.1], [-20, 18, .9], [20, 18, 1], [0, -26, .9], [-14, -22, .8], [14, -22, .8]]) p.tree(x, z, s, 0x4f9a43);
}
function CREAM2() { return 0xe7dabd; }

export function kingFlagLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('כיכר המלך של הפועל ספיר ❤️🖤', { w: 11, h: 1.6, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.4, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('המלך מניף את הדגל 🚩', { w: 4.8, h: 1.5, bg: '#e8b323', fg: '#c8102e', border: '#1b1d21', font: big }).at(0, 3.85, 4.34));
  { const t = sign('📸 תמונה עם המלך', { w: 5.2, h: .8, bg: '#ffffff', fg: '#c8102e', border: '#c8102e', font: big }).at(-12.3, 5.4, 5.25); group.add(t); }
  // the king's big red flag, waving from the top of his pole
  const top = KF_TOP + 4 * 2.6 + 13, x0 = 1.31 * 2.6, flag = new THREE.Group(); flag.position.set(x0, top - .6, .3); group.add(flag);
  const strips = [];
  for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 5, .12), new THREE.MeshLambertMaterial({ color: k === 7 ? HBLACK : HRED })); m.position.set(.5 + k, -2.5, 0); flag.add(m); strips.push(m); }
  group.userData.tick = t => { strips.forEach((m, k) => { m.position.z = Math.sin(t * 3 - k * .7) * .25 * k / 7; m.rotation.y = Math.cos(t * 3 - k * .7) * .25; }); flag.rotation.y = .25 * Math.sin(t * .8); };
  group.userData.tick(0);
}

export const KINGFLAG = { key: 'king-flag', name: 'כיכר המלך של הפועל ספיר', draw: drawKingFlag, live: kingFlagLive, top: 42 };
