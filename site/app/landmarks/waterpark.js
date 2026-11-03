// פארק המים ספיר: day 20, @mgmgmgkhs's comment "תבנו בעיר פארק מים שלתושבים יהיה משהו כיף לעשות".
// A slide tower in the back with a red roof and a navy-gold name board, a spiral slide (red and gold) winding down on
// the left with a rider going round and round (live), a long straight turbo slide down to the right, a big wave pool in
// front with waves rolling and coloured rings bobbing on them (live), a splash pad with a giant gold bucket that fills
// and tips over (live), a lifeguard tower, sunbeds and umbrellas, an ice cream kiosk, an entrance gate, people swimming,
// lamps and trees. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const TEAL = 0x0f6f73, NAVY = 0x13213b, GOLD = 0xe8b323, CREAM = 0xfbf3e2, RED = 0xc8452e, WHITE = 0xf6f3ee, DARK = 0x2b2f36,
  WATER = 0x3fb6e0, WATER2 = 0x7fd3f0, DEEP = 0x2a93c4, PAVE = 0xeee3c8, PAVE2 = 0xdccfae, SKIN = 0xe2b48f, WOOD = 0x8a6240,
  YELLOW = 0xffd23f, PINK = 0xff8fb1, LIME = 0x7ed957;
const SH = [0x5ec8f2, 0xf5a623, 0x7ed957, 0xb28dff, 0xff6b6b, 0xffe066, 0xe36fa3, 0x0f6f73];
const RING = [0xff6b6b, 0xffe066, 0x7ed957, 0xb28dff, 0xf5a623, 0xff8fb1];

function person(p, x, z, r, shirt, h = .55, y = 0) {
  p.at(x, z, r, y); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
  p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020);
  p.at(0, 0, 0);
}
/** someone swimming: shoulders and a head out of the water */
function swimmer(p, x, z, cap) { p.box(x, .35, z, .8, .4, .5, SKIN); p.ball(x, .7, z, .55, .55, SKIN); p.ball(x, .95, z, .58, .3, cap); }

// the spiral slide: a helix round (SX, SZ), from the tower's platform down to its splash pool
const SX = -13, SZ = -9, SR = 6.2, TOP = 17.4, TURNS = 1.75, SEG = 84;
export const spiral = u => {                          // u from 0 (top) to 1 (bottom): position and heading
  const a = u * TURNS * Math.PI * 2;
  return { x: SX + Math.cos(a) * SR, z: SZ - Math.sin(a) * SR, y: TOP - u * (TOP - .9), h: a };
};
// the turbo slide: straight from the tower's right side down to its run-out
const T0 = { x: 4.4, y: 17.4, z: -12 }, T1 = { x: 21, y: 1.1, z: -12 };

export function drawWaterpark(p) {
  p.at(0, 0, 0);
  // the ground: a round lawn and a big paved deck
  p.cyl(0, 0, 0, 59, .2, 0x86c766); p.cyl(0, .2, 1, 54, .1, PAVE);
  for (let i = -6; i <= 6; i++) p.box(i * 4, .31, 1, .1, .02, 48 - Math.abs(i) * 2.2, PAVE2);
  // the wave pool: white coping, deep blue at the back, shallow beach at the front (its waves and rings are live)
  p.box(0, .2, 11, 30, .25, 17, WHITE); p.box(0, .3, 11, 28.4, .2, 15.4, WATER); p.box(0, .31, 6, 28.4, .2, 5, DEEP);
  p.box(0, .31, 17.6, 28.4, .2, 2.2, WATER2);
  for (const x of [-14.6, 14.6]) p.box(x, .3, 11, .8, .35, 17, WHITE);
  for (let i = 0; i < 14; i++) p.box(-13 + i * 2, .44, 2.9, .9, .06, .5, i % 2 ? NAVY : WHITE);        // the depth marks
  for (const x of [-9, 9]) { p.box(x - .5, .3, 2.6, .12, 2.2, .12, 0xbfc6cf); p.box(x + .5, .3, 2.6, .12, 2.2, .12, 0xbfc6cf); p.box(x, 2.3, 2.6, 1.1, .12, .12, 0xbfc6cf); } // ladders
  // the slide tower: four navy legs, three decks, a zigzag of stairs, a red roof, the name board on the front
  for (const x of [-4, 4]) for (const z of [-16, -8]) p.box(x, 0, z, .8, 18, .8, NAVY);
  for (const y of [6, 12, 17]) { p.box(0, y, -12, 9.6, .5, 9.6, CREAM); p.box(0, y + .5, -7.4, 9.6, 1.1, .2, GOLD); p.box(-4.7, y + .5, -12, .2, 1.1, 9.6, GOLD); }
  for (let i = 0; i < 17; i++) { const y = i * 1.06, side = Math.floor(i / 6) % 2, x = side ? 5.4 - (i % 6) * 1.2 : -.6 + (i % 6) * 1.2; p.box(x, y, -17, 1.2, .3, 1.6, WOOD); }
  p.box(0, 0, -17.9, 12, 17.5, .2, 0xbfc6cf);                                                         // the stairs' back screen
  for (const x of [-4, 4]) for (const z of [-16, -8]) p.box(x, 17.5, z, .4, 3.2, .4, WHITE);
  p.gable(0, 20.7, -12, 11, 3.6, 11, RED); p.box(0, 20.6, -12, 11.2, .3, 11.2, GOLD); p.cyl(0, 24.3, -12, .3, 2.4, WHITE);
  p.box(1.1, 26, -12, 2, 1.2, .1, 0x5ec8f2);                                                           // a little flag
  p.box(0, 12.8, -7.2, 15, 3.2, .4, GOLD);                                                            // the name board (letters live)
  // the spiral slide: a red trough with gold rims, a bridge from the top deck, posts, and a splash pool
  p.box(-6.4, 17, -10.4, 3.4, .4, 2.2, CREAM); p.box(-6.4, 17.4, -9.3, 3.4, 1, .16, GOLD);
  for (let i = 0; i < SEG; i++) {
    const u = i / (SEG - 1), s = spiral(u);
    p.box(s.x, s.y, s.z, 1.9, .35, 2.5, RED, s.h); p.box(s.x + Math.cos(s.h) * .95, s.y + .3, s.z - Math.sin(s.h) * .95, .3, .55, 2.5, GOLD, s.h);
    if (i % 7 === 3) p.box(s.x, 0, s.z, .35, s.y, .35, WHITE);
  }
  const se = spiral(1); p.cyl(se.x + 3.4, .2, se.z + 1, 8.6, .25, WHITE); p.cyl(se.x + 3.4, .3, se.z + 1, 7.6, .2, WATER);
  for (let i = 0; i < 4; i++) p.box(se.x + .6 + i * .9, .9 - i * .2, se.z, 1, .35, 2.5, RED);         // the run-out into the pool
  // the turbo slide: a long teal chute with white rims, on posts, into a long run-out pool
  const TN = 34;
  for (let i = 0; i < TN; i++) {
    const u = i / (TN - 1), x = T0.x + (T1.x - T0.x) * u, y = T0.y + (T1.y - T0.y) * Math.pow(u, .85);
    p.box(x, y, T0.z, .75, .35, 2.4, TEAL); p.box(x, y + .3, T0.z - 1.1, .75, .55, .25, WHITE); p.box(x, y + .3, T0.z + 1.1, .75, .55, .25, WHITE);
    if (i % 5 === 2) for (const dz of [-1, 1]) p.box(x, 0, T0.z + dz, .35, y, .35, NAVY);
  }
  p.box(24.2, .2, -12, 6.4, .3, 4.2, WHITE); p.box(24.2, .3, -12, 5.6, .2, 3.4, WATER);
  // a kids' slide in the shallow corner of the wave pool
  p.box(-11.5, .3, 15.6, 2.4, 3, 2.4, YELLOW); p.box(-11.5, 3.3, 15.6, 2.6, .3, 2.6, PINK);
  for (let i = 0; i < 6; i++) p.box(-11.5 + 1.4 + i * .6, 3 - i * .5, 15.6, .7, .3, 1.4, LIME);
  // the splash pad on the right: coloured spots, fountains, a frame with the giant gold bucket (the bucket is live)
  p.cyl(17.8, .3, 8, 13, .08, 0xdff3fb);
  for (const [x, z, c] of [[14.4, 5.4, PINK], [21, 5.4, YELLOW], [14.6, 11, LIME], [21.2, 11, 0xb28dff], [17.8, 13.4, 0xff6b6b]]) {
    p.cyl(x, .36, z, 1.8, .06, c); p.cyl(x, .4, z, .25, 1.2, WATER2); p.ball(x, 1.4, z, .9, .9, WATER2);
  }
  for (const x of [13.6, 22]) for (const z of [4.4, 11.6]) p.box(x, .3, z, .6, 11, .6, x < 15 ? TEAL : NAVY);
  p.box(17.8, 11.3, 4.4, 9, .6, .6, GOLD); p.box(17.8, 11.3, 11.6, 9, .6, .6, GOLD); p.box(17.8, 11.9, 8, 9, .5, 7.8, CREAM);
  for (const x of [15.1, 20.5]) p.box(x, 9.1, 8, .4, 2.8, .6, NAVY);                                  // the arms the bucket swings on
  for (const x of [15.4, 20.2]) p.cyl(x, 12.4, 8, 1.6, 1.4, YELLOW);                                  // two small buckets on the roof
  // the lifeguard tower between the pools
  p.at(-16.6, 6, Math.PI / 2);
  for (const x of [-1, 1]) for (const z of [-1, 1]) p.box(x, 0, z, .3, 4.4, .3, WHITE);
  p.box(0, 4.4, 0, 2.8, .3, 2.8, RED); p.box(0, 4.7, -1.2, 2.8, 1.6, .2, RED); p.box(0, 6.4, 0, 3.2, .2, 3.2, WHITE);
  for (let i = 0; i < 5; i++) p.box(0, .3 + i * .85, -1.8 - i * .1, 1.2, .14, .3, WOOD);
  p.box(0, 3.1, 1.45, 2.8, 1.1, .1, WHITE);
  person(p, 0, -.2, 0, RED, .55, 4.7);
  p.at(0, 0, 0);
  // sunbeds with umbrellas along the left and the front
  const beds = [[-23, -2, Math.PI / 2], [-23, 3, Math.PI / 2], [-23, 8, Math.PI / 2], [-20, 20.5, 0], [-14.5, 22.5, 0], [14.5, 22.5, 0], [20, 20.5, 0]];
  beds.forEach(([x, z, r], i) => {
    p.at(x, z, r); p.box(0, .3, 0, 1.4, .4, 3, WHITE); p.box(0, .7, -1.1, 1.4, .8, .3, SH[i % SH.length]); p.box(0, .7, .3, 1.2, .1, 2, SH[(i + 3) % SH.length]);
    p.cyl(1.4, .3, 0, .18, 3.8, WHITE); p.cone(1.4, 3.6, 0, 4.2, 1.4, i % 2 ? RED : GOLD); p.cone(1.4, 3.7, 0, 3, 1.1, WHITE);
    p.at(0, 0, 0);
  });
  [[-20, 20.5, 0], [-23, 8, Math.PI / 2]].forEach(([x, z, r], i) => person(p, x, z, r + Math.PI, SH[i + 2], .5, .75));
  // the ice cream kiosk on the left front
  p.at(-20, 15.5, Math.PI / 2);
  p.box(0, .3, 0, 4.6, 3, 3, CREAM); p.box(0, 3.3, 0, 5, .3, 3.6, GOLD);
  for (let i = 0; i < 5; i++) p.box(-2 + i, 3.6, 1.9, 1, .3, 1.6, i % 2 ? WHITE : PINK);
  p.box(0, 1.4, 1.55, 3.8, .3, .5, WOOD); p.cone(0, 3.9, 0, 1.6, 2.4, 0xd9a35a); p.ball(0, 5.8, 0, 1.9, 1.6, PINK); p.ball(0, 6.9, 0, 1.2, 1, 0xfff4e0);
  p.at(0, 0, 0);
  // the entrance gate at the front, with a ticket booth
  for (const x of [-7.5, 7.5]) { p.box(x, .3, 26, 1.6, 7, 1.6, TEAL); p.box(x, 7.3, 26, 2, .5, 2, GOLD); p.ball(x, 7.8, 26, 1.4, 1.4, WATER2); }
  p.box(0, 6.2, 26, 16.6, 2.4, .5, NAVY);                                                             // the arch board (letters live)
  p.box(-10.5, .3, 25, 2.6, 2.8, 2.2, CREAM); p.box(-10.5, 3.1, 25, 3, .3, 2.6, RED); p.box(-10.5, 1.5, 26.12, 1.8, 1, .05, 0x9fd6ee);
  // people: swimmers in the wave pool and the splash pool, people walking on the deck, a queue at the stairs
  [[-8, 7, 0xff6b6b], [-4, 12, 0xffe066], [3, 9, 0x5ec8f2], [7, 14, 0xb28dff], [10, 6, 0x7ed957], [-1, 16, 0xff8fb1], [5, 5, 0xf5a623], [-6, 15, 0x5ec8f2],
   [se.x + 2.6, se.z + .4, 0xff6b6b], [24.2, -11.2, 0xffe066]].forEach(([x, z, c]) => swimmer(p, x, z, c));
  [[16, 7, 0], [19.5, 9, 2], [17.4, 10.6, 3], [12, 20, Math.PI], [3, 22, 2.8], [-3, 21.4, 3.4], [6.2, -6, Math.PI], [-1, -5.4, 2.4],
   [2.4, -18.4, 0], [3.6, -18.6, 0], [-16.6, 15.5, -Math.PI / 2]].forEach(([x, z, r], i) => person(p, x, z, r, SH[i % SH.length]));
  // lamps, a few palm-ish trees, flower beds
  for (const [x, z] of [[-23.5, 17.5], [23.5, 17.5], [-24, -13], [10, 24.5], [-13, 24.5]]) { p.cyl(x, 0, z, .3, 4.6, NAVY); p.ball(x, 4.6, z, 1, 1, 0xfff4c2); }
  for (const [x, z, s] of [[-17, -21, 1.4], [-6, -24, 1.2], [8, -23, 1.3], [27, -2, 1.2], [26, 6, 1.1], [-27, 4, 1.1], [16, -22, 1.2], [-20, -18, 1.2]]) {
    p.cyl(x, 0, z, .45 * s, 5.4 * s, 0x9a7148); for (let k = 0; k < 5; k++) { const a = k * 1.256; p.box(x + Math.cos(a) * 1.4 * s, 5.2 * s, z + Math.sin(a) * 1.4 * s, 3 * s, .3, .9 * s, 0x4f9a43, -a); }
  }
  for (const [x, z] of [[-14, -24], [21, -19]]) p.tree(x, z, 1.1);
}

/** the giant bucket: a gold tub on an axle (its pivot at the axle) */
function bucket() {
  const b = new Pen();
  b.cyl(0, -3.4, 0, 4.4, 3.6, GOLD); b.cyl(0, .1, 0, 4.7, .3, NAVY); b.cyl(0, -.2, 0, 3.8, .2, WATER); b.cyl(0, -3.6, 0, 3, .3, NAVY);
  b.box(-2.6, -.6, 0, .5, .8, .5, NAVY); b.box(2.6, -.6, 0, .5, .8, .5, NAVY);
  const g = new THREE.Group(); b.build(g); return g;
}
/** an inner tube: a coloured ring (a fat short cylinder with a water-coloured middle) */
function tube(c) { const t = new Pen(); t.cyl(0, 0, 0, 2.2, .5, c); t.cyl(0, .05, 0, 1, .5, WATER); const g = new THREE.Group(); t.build(g); return g; }
/** someone riding the spiral slide, lying back */
function rider() { const r = new Pen(); r.box(0, 0, 0, .9, .45, 1.8, 0xffe066); r.ball(0, .2, -1, .7, .7, SKIN); r.ball(0, .45, -1, .72, .35, 0xff6b6b); const g = new THREE.Group(); r.build(g); return g; }

export function waterparkLive(group) {
  const big = '900 {px}px Rubik';
  group.add(sign('פארק המים ספיר 🌊', { w: 14.4, h: 2.8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 14.4, -6.95));
  group.add(sign('פארק המים ספיר 🌊', { w: 16, h: 2.2, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 7.4, 26.3));
  group.add(sign('רעיון של @mgmgmgkhs · אדריכל', { w: 8, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 4.4, 26.3));
  group.add(sign('מגלשת הטורבו 🚀', { w: 4.2, h: 1.05, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(2.4, 18.05, -7.25));
  group.add(sign('הספירלה 🌀', { w: 4.2, h: 1.05, bg: '#c8452e', fg: '#ffffff', border: '#e8b323', font: big }).at(-2.4, 18.05, -7.25));
  group.add(sign('גלידה 🍦', { w: 3.6, h: 1, bg: '#ffffff', fg: '#c8452e', border: '#c8452e', font: big }).at(-18.05, 2.5, 15.5, Math.PI / 2));
  group.add(sign('מציל 🛟', { w: 2.6, h: .9, bg: '#ffffff', fg: '#c8452e', border: '#c8452e', font: big }).at(-15.05, 3.65, 6, Math.PI / 2));
  group.add(sign('דלי הענק 🪣', { w: 5.4, h: 1.1, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(17.8, 13.1, 11.95));
  // the giant bucket: it fills slowly, tips, pours a curtain of water, and swings back
  const piv = new THREE.Group(); piv.position.set(17.8, 9.4, 8); const b = bucket(); piv.add(b); group.add(piv);
  const pour = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1).translate(0, -.5, 0), new THREE.MeshLambertMaterial({ color: WATER2, transparent: true, opacity: .8 }));
  pour.position.set(17.8, 9, 9.8); pour.scale.set(3.2, .01, 1.4); group.add(pour);
  const splash = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, 1, 14), new THREE.MeshLambertMaterial({ color: WATER2, transparent: true, opacity: .7 }));
  splash.position.set(17.8, .5, 10.6); group.add(splash);
  // waves rolling across the pool, and rings bobbing on them
  const wm = new THREE.MeshLambertMaterial({ color: WATER2 });
  const waves = Array.from({ length: 4 }, () => { const w = new THREE.Mesh(new THREE.BoxGeometry(28, .12, 1.2), wm); group.add(w); return w; });
  const tubes = [[-9, 9], [-3, 6], [4, 12], [9, 10], [0, 14], [-6, 11]].map(([x, z], i) => { const t = tube(RING[i]); t.position.set(x, .5, z); group.add(t); return { t, x, z }; });
  // a rider going down the spiral, again and again
  const r = rider(); group.add(r);
  group.userData.tick = t => {
    const c = ((t + 3.15) % 5) / 5, tip = c < .5 ? 0 : c < .62 ? Math.sin((c - .5) / .12 * Math.PI / 2) : c < .78 ? 1 : c < .95 ? Math.cos((c - .78) / .17 * Math.PI / 2) : 0;
    piv.rotation.x = tip * 2.1;
    const flow = c > .58 && c < .86 ? Math.min(1, (c - .58) / .05, (.86 - c) / .05) : 0;
    pour.scale.y = Math.max(.01, flow * 8.6); splash.scale.set(1 + flow * 6, Math.max(.01, flow * 1.4), 1 + flow * 5);
    waves.forEach((w, i) => { const zz = ((t * 1.6 + i * 3.6) % 14.4); w.position.set(0, .45, 4 + zz); });
    tubes.forEach(({ t: m, x, z }, i) => { m.position.y = .48 + Math.sin(t * 2.2 + z * .45) * .16; m.position.x = x + Math.sin(t * .4 + i) * .5; m.rotation.y = t * .3 + i; });
    const u = (t % 4.2) / 4.2, s = spiral(u); r.position.set(s.x, s.y + .4, s.z); r.rotation.y = s.h;
  };
  group.userData.tick(0);
}

export const WATERPARK = { key: 'waterpark', name: 'פארק המים ספיר', draw: drawWaterpark, live: waterparkLive, top: 28 };
