// רכבת האוהדים של הפועל ספיר: day 25, @eilam.lev99's comment "רכבת המועדון האוהדים של הפועל ספיר עד למגרש של הפועל ספיר ושיהיה
// על הרכבת ציורים של הפועל ספיר" (1 like, the first place asked for on day 24's reel; he asked for the fan club on day 21 too).
// The fans' station: a cream station house with a red roof, a clock and a bell, a long platform under a red and black canopy,
// fans waiting with scarves and flags, a ticket booth, the line's map board ("מועדון האוהדים → מגרש הפועל"). Round it an oval
// track on sleepers, a signal, a crossing with barriers, a tunnel through a green hill, and the train itself, red and black,
// painted with the club's drawings (stars, balls, hearts, a scarf and the club's name), running round and round (live).
// Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const HRED = 0xc8102e, HBLACK = 0x1b1d21, CREAM = 0xf6eedd, CREAM2 = 0xe7dabd, WHITE = 0xf7f5ee, GOLD = 0xe8b323, NAVY = 0x13213b,
  GLASS = 0x8fc3d9, PAVE = 0xe6dcc6, WOOD = 0x8a6240, METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f, GRASS = 0x86c766,
  GRAVEL = 0xb8ad9a, HILL = 0x6fb35a, RED2 = 0xc8443a;
const A = 23, Bz = 14, CZ = 3;                                              // the oval track: half widths and its centre's z
export const trackAt = th => [Math.cos(th) * A, Math.sin(th) * Bz + CZ];   // th in radians, counter clockwise seen from above

function fan(p, x, z, r, shirt) {
  p.at(x, z, r, .9);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020); p.box(0, 1.85, .3, 1.05, .24, .12, shirt === HRED ? HBLACK : HRED);
  p.at(0, 0, 0);
}

export function drawTrain(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the track: gravel bed, a sleeper every few metres, two rails as short straight pieces
  const N = 72;
  for (let k = 0; k < N; k++) { const a = k / N * Math.PI * 2, b = (k + 1) / N * Math.PI * 2, [x0, z0] = trackAt(a), [x1, z1] = trackAt(b);
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, len = Math.hypot(x1 - x0, z1 - z0) + .05, r = Math.atan2(x1 - x0, z1 - z0);
    p.box(mx, .2, mz, 3.2, .25, len, GRAVEL, r); p.box(mx, .45, mz, 2.8, .18, .5, WOOD, r);
    for (const s of [-.75, .75]) p.box(mx + Math.cos(r) * s, .63, mz - Math.sin(r) * s, .14, .16, len, METAL, r); }

  // the station house behind the track: cream walls, a red gable roof, arched windows, a clock and a bell on top
  const SZ = -21;
  p.box(0, .2, SZ, 18, 6, 6, CREAM); p.box(0, 3.1, SZ, 18.3, .3, 6.3, CREAM2); p.gable(0, 6.2, SZ, 19, 3, 7, RED2);
  for (const x of [-6.5, -3.5, 3.5, 6.5]) { p.box(x, 1.4, SZ + 3.02, 1.8, 2.4, .12, GLASS); p.cyl(x, 3.8, SZ + 3.02, 1.8, .12, GLASS); }
  p.box(0, .3, SZ + 3.02, 2.4, 3.2, .12, WOOD); p.box(0, 3.5, SZ + 3.1, 3, .3, .3, GOLD);
  p.box(0, 7.6, SZ, 3, 3.6, 3, CREAM); p.box(0, 8.4, SZ + 1.52, 2.2, 2.2, .1, WHITE); p.box(0, 9.3, SZ + 1.58, .2, 1, .06, NAVY); p.box(.4, 9.4, SZ + 1.6, .9, .2, .06, NAVY);
  p.cone(0, 11.2, SZ, 4.2, 2.4, RED2); p.ball(0, 13.6, SZ, .6, .6, GOLD);
  // the platform between the house and the track, its red and black canopy on posts, benches, the ticket booth
  p.box(0, .2, -15.6, 26, .9, 3.6, PAVE); p.box(0, 1.1, -14, 26, .06, .3, GOLD);
  for (let k = 0; k < 6; k++) { const x = -11 + k * 4.4; p.cyl(x, 1.1, -16.5, .3, 4, HBLACK); }
  for (let k = 0; k < 8; k++) p.box(-11.4 + k * 3.25, 5.1, -15.8, 3.25, .3, 4.4, k % 2 ? HBLACK : HRED);
  for (const x of [-7, 0, 7]) { p.box(x, 1.5, -17, 2.6, .25, .7, WOOD); p.box(x, 1.75, -17.3, 2.6, .7, .15, WOOD); }
  p.box(11.5, 1.1, -17, 2.4, 2.8, 2, CREAM2); p.box(11.5, 2.2, -15.98, 1.6, .9, .1, GLASS); p.box(11.5, 3.9, -17, 2.8, .3, 2.4, HRED);
  // fans waiting on the platform with scarves and flags
  [[-9, -15.2], [-8, -16.2], [-4.6, -15], [-3.4, -16], [2, -15.3], [3.2, -16.1], [6, -15], [8.8, -15.6]].forEach(([x, z], k) => fan(p, x, z, 0, k % 3 === 2 ? HBLACK : HRED));
  for (const [x, z] of [[-8, -16.2], [3.2, -16.1]]) { p.box(x + .6, 3.6, z, .08, 2.6, .08, METAL); p.box(x + 1.3, 5.3, z, 1.3, .9, .05, HRED); p.box(x + 1.3, 4.9, z, 1.3, .2, .06, HBLACK); }

  // the tunnel through a green hill on the right side of the oval, with a stone portal on each side
  p.ball(A, .2, CZ, 12, 9, HILL); p.ball(A + 2, .2, CZ - 3, 8, 6, 0x5ea64c);
  for (const s of [-1, 1]) { const z = CZ + s * 5.6;
    p.box(A, .2, z, 5.4, 5, 1.2, 0xb9b2a5); p.box(A, .25, z + s * .05, 3.6, 3.8, 1.25, DARK); p.cyl(A, 3.6, z + s * .05, 3.6, 1.26, DARK); }
  // a level crossing in front: the road over the rails, barriers striped red and white, a crossing sign
  p.box(0, .22, CZ + Bz, 6, .5, 8, 0x5b5f66); for (let k = -1; k <= 1; k++) p.box(k * 1.6, .74, CZ + Bz + 3.2, .8, .02, 1.6, WHITE);
  for (const s of [-1, 1]) { p.box(s * 3.6, .2, CZ + Bz + s * 3.4, .5, 1.6, .5, DARK); for (let k = 0; k < 5; k++) p.box(s * (3.6 - .7 - k * .7), 1.5, CZ + Bz + s * 3.4, .7, .25, .2, k % 2 ? WHITE : HRED); }
  p.cyl(-4.6, .2, CZ + Bz + 4.6, .2, 3.6, METAL); p.box(-4.6, 3.6, CZ + Bz + 4.6, 1.6, .25, .1, WHITE, .78); p.box(-4.6, 3.6, CZ + Bz + 4.6, 1.6, .25, .1, WHITE, -.78);
  // a signal on a post by the station, with its red and green lamps
  p.cyl(-14, .2, -10.5, .25, 5.2, DARK); p.box(-14, 4.4, -10.5, .9, 2, .6, HBLACK); p.ball(-14, 5.6, -10.18, .45, .45, 0xe03c31); p.ball(-14, 4.8, -10.18, .45, .45, 0x3fc060);

  // the water tower on the left behind the station: four legs, a red tank with a black band and a cone roof (seen from far away)
  for (const [dx, dz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) p.box(-18 + dx, .2, -21 + dz, .4, 9, .4, HBLACK);
  p.cyl(-18, 9.2, -21, 5, 4.4, HRED); p.cyl(-18, 10.8, -21, 5.1, .8, HBLACK); p.cone(-18, 13.6, -21, 5.6, 2.4, HBLACK); p.ball(-18, 16, -21, .6, .6, GOLD);
  // inside the oval: a lawn with the club's name in flowers (a red ball and a black star) and a bench
  p.cyl(0, .22, CZ, 14, .1, 0x7cc35c); p.cyl(-3, .3, CZ, 4.6, .1, HRED); p.cyl(-3, .35, CZ, 2.6, .1, WHITE); p.cone(3.6, .3, CZ, 4.4, .3, HBLACK, 5);
  for (const [x, z] of [[-8, CZ + 4], [8, CZ - 4]]) p.tree(x, z, .9, 0x4f9a43);
  for (const [x, z, s] of [[-26, -8, 1], [-24, 14, 1.1], [24, -18, .9], [-20, -24, 1], [18, 22, .9]]) p.tree(x, z, s, 0x4f9a43);
}

/** one car of the train, built round its own centre, front toward +z: red and black body with the club's drawings */
function car(p, loco) {
  const L = loco ? 6 : 5.4;
  p.box(0, .8, 0, 2.6, 2.6, L, HRED); p.box(0, .8, 0, 2.62, .5, L + .02, HBLACK); p.box(0, 3.4, 0, 2.7, .3, L + .2, HBLACK);
  for (const [x, z] of [[-1.15, L / 2 - .9], [1.15, L / 2 - .9], [-1.15, -L / 2 + .9], [1.15, -L / 2 + .9]]) p.cyl(x, .1, z, 1, .3, DARK);
  if (loco) {
    p.box(0, 2.2, L / 2 - 1.2, 2.64, 1, 1.6, GLASS); p.box(0, .9, L / 2 + .02, 2.2, 1.2, .1, HBLACK); p.ball(0, 1.4, L / 2 + .08, .6, .6, 0xfff3c4);
    p.cyl(0, 3.7, -L / 2 + 1.4, .8, 1.4, HBLACK); p.cyl(0, 5, -L / 2 + 1.4, 1.1, .3, HRED);
    for (const s of [-1, 1]) { p.box(s * 1.32, 2.2, -.6, .06, 1, 2.6, WHITE); }       // a white panel each side for the club's name
  } else {
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) p.box(s * 1.32, 2.3, -1.6 + k * 1.6, .06, .9, 1.1, GLASS);
    // the drawings on each side: a white ball, a gold star, a black heart and a red-black scarf stripe
    for (const s of [-1, 1]) { p.ball(s * 1.34, 1.3, -1.6, .8, .8, WHITE); p.cone(s * 1.34, 1.05, 0, .9, .9, GOLD, 5); p.box(s * 1.34, 1.3, 1.6, .06, .7, .7, HBLACK, .78);
      for (let k = 0; k < 4; k++) p.box(s * 1.33, .62, -2 + k * 1.3, .07, .2, .65, k % 2 ? HBLACK : WHITE); }
  }
}

export function trainLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('רכבת האוהדים של הפועל ספיר 🚂', { w: 15, h: 1.6, bg: '#c8102e', fg: '#ffffff', border: '#1b1d21', font: big }).at(0, 5.6, -13.5));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 4.45, -18.05));
  group.add(sign('מועדון האוהדים ⬅ מגרש הפועל ספיר ⚽', { w: 9.4, h: 1, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }).at(0, 2.6, -13.2));
  group.add(sign('כרטיסים 🎟️', { w: 2.8, h: .7, bg: '#f6eedd', fg: '#c8102e', border: '#c8102e', font: big }).at(11.5, 3.4, -15.9));
  const p = new Pen(), sub = fn => { const q = new Pen(); fn(q); return q.build(new THREE.Group()); };
  const loco = sub(q => car(q, true)), cars = [0, 1, 2].map(() => sub(q => car(q, false)));
  const name = s => { const g = new THREE.Group(); for (const side of [-1, 1]) { const t = sign('הפועל ספיר', { w: 2.5, h: .8, bg: '#ffffff', fg: '#c8102e', border: '#1b1d21', font: big });
    t.position.set(side * 1.37, 2.7, -.6); t.rotation.y = side * Math.PI / 2; g.add(t); } return g; };
  loco.add(name()); const train = [loco, ...cars]; train.forEach(c => group.add(c));
  const smoke = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); group.add(m); return m; });
  group.userData.tick = t => {
    const v = .22;                                                       // the train's speed round the oval, radians a second
    train.forEach((c, k) => { const th = t * v - k * .3, [x, z] = trackAt(th), [x2, z2] = trackAt(th + .01);
      c.position.set(x, .7, z); c.rotation.y = Math.atan2(x2 - x, z2 - z); });
    const lp = loco.position, ly = loco.rotation.y;
    smoke.forEach((s, k) => { const q = ((t * .8 + k / 6) % 1); s.position.set(lp.x - Math.sin(ly) * 1.6, 5.4 + q * 4, lp.z - Math.cos(ly) * 1.6); s.scale.setScalar(.6 + q * 1.6); s.material.opacity = .8 * (1 - q); });
  };
  group.userData.tick(0);
}

export const TRAIN = { key: 'train', name: 'רכבת האוהדים של הפועל ספיר', draw: drawTrain, live: trainLive, top: 16 };
