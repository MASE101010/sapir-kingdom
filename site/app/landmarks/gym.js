// חדר כושר ספיר: day 19, @itamarsarusi's comment "תעשו חדר כושר ספיררררר" (@eladshwar asked for one too).
// A teal sports hall with a wall of windows and a big navy-gold name board, a giant gold dumbbell on the roof that is
// lifted up and down all day (live), a climbing tower with coloured holds on the left, a juice bar, a running track in
// front, a shaded deck of treadmills with people running on them (live), a giant kettlebell, a pull-up bar, a record board
// where the king holds the kingdom's record (three push-ups), benches, lamps and trees. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const TEAL = 0x0f6f73, TEAL2 = 0x14868b, NAVY = 0x13213b, GOLD = 0xe8b323, CREAM = 0xfbf3e2, RED = 0xc8452e, TRACK = 0xc8553d,
  WHITE = 0xf6f3ee, DARK = 0x2b2f36, GLASS = 0x9fd6ee, PAVE = 0xe9e0cc, PAVE2 = 0xd8ccb2, SKIN = 0xe2b48f, WOOD = 0x8a6240, RUB = 0x3a3f48;
const SH = [0x5ec8f2, 0xf5a623, 0x7ed957, 0xb28dff, 0xff6b6b, 0xffe066, 0xe36fa3, 0x0f6f73];

function person(p, x, z, r, shirt, h = .55, y = 0) {
  p.at(x, z, r, y); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
  p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020);
  p.at(0, 0, 0);
}

export function drawGym(p) {
  p.at(0, 0, 0);
  // the ground: a round lawn, a paved front, the running track
  p.cyl(0, 0, 0, 59, .2, 0x86c766); p.box(0, .2, 12, 46, .12, 22, PAVE);
  for (let i = -5; i <= 5; i++) p.box(i * 4.2, .33, 12, .12, .02, 22, PAVE2);
  p.box(0, .34, 19.5, 44, .06, 5.4, TRACK);                                                           // the track across the front
  for (const z of [17.6, 19.5, 21.4]) p.box(0, .41, z, 44, .02, .14, WHITE);                          // its lanes
  for (const x of [-21, 21]) p.box(x, .42, 19.5, .3, .02, 5.4, WHITE);                                // start and finish
  // the hall: a navy plinth, teal walls, a cream band, a flat roof with a gold edge
  p.box(0, 0, -8, 36, 1, 20, NAVY);
  p.box(0, 1, -8, 36, 11, 20, TEAL);
  p.box(0, 7.2, 2.05, 36, .6, .2, CREAM); p.box(0, 12, -8, 37, .8, 21, CREAM); p.box(0, 12.8, -8, 37.2, .3, 21.2, GOLD);
  for (let i = 0; i < 9; i++) p.box(-16 + i * 4, 1, 2.1, .3, 11, .3, TEAL2);                          // the ribs of the facade
  // a wall of windows on the ground floor (the gym inside) and a row on the upper floor
  for (let i = 0; i < 8; i++) {
    const x = -14 + i * 4; if (Math.abs(x) < 3) continue;
    p.box(x, 1.4, 2.08, 3.2, 5.2, .1, GLASS); p.box(x, 4, 2.14, 3.2, .16, .06, NAVY);
    p.box(x, 8.1, 2.08, 3.2, 3, .1, GLASS); p.box(x, 7.9, 2.14, 3.6, .25, .12, NAVY);
  }
  for (const z of [-15, -10, -5]) for (const sx of [-1, 1]) { p.box(sx * 18.05, 2, z, .1, 4, 3, GLASS); p.box(sx * 18.05, 8, z, .1, 3, 3, GLASS); }
  // the doors: gold-framed glass, a navy canopy with a gold edge
  p.box(0, 1, 2.05, 5.4, 4.8, .1, GOLD); p.box(-1.25, 1.2, 2.12, 2.3, 4.4, .08, GLASS); p.box(1.25, 1.2, 2.12, 2.3, 4.4, .08, GLASS);
  p.box(0, 5.8, 4, 8, .5, 4, NAVY); p.box(0, 5.6, 6, 8.2, .3, .3, GOLD); for (const x of [-3.8, 3.8]) p.cyl(x, 0, 5.7, .3, 5.6, GOLD);
  // the name board on the facade (the letters are live)
  p.box(0, 8.6, 2.2, 22, 3.2, .4, GOLD);
  // the stand for the giant dumbbell on the roof: two gold forks (the dumbbell itself is live)
  for (const x of [-4.5, 4.5]) { p.box(x, 13.1, -8, 1.2, 3, 1.2, NAVY); p.box(x, 15.6, -8, 2.6, .5, 1.6, NAVY); }
  // little roof things: vents, a water tank
  p.box(12, 13.1, -15, 3, 1.4, 3, 0xbfc6cf); p.box(-12, 13.1, -15, 3, 1.4, 3, 0xbfc6cf); p.cyl(14, 13.1, -3, 2.6, 2.4, WHITE);
  // the climbing tower on the left: a tall wall with coloured holds and a red top
  const CW = -21.5;
  p.box(CW, 0, -6, 5.6, 18, 5, CREAM); p.box(CW, 18, -6, 6.2, .8, 5.6, RED); p.box(CW, 0, -3.4, 5.6, .6, .5, NAVY);
  const HOLD = [0xff6b6b, 0xffe066, 0x7ed957, 0x5ec8f2, 0xb28dff, 0xf5a623];
  for (let i = 0; i < 26; i++) p.ball(CW - 2.2 + ((i * 37) % 44) / 10, 1.4 + i * .62, -3.4, .55, .5, HOLD[i % HOLD.length]);
  p.box(CW + 1.2, 0, -2.7, 2.6, .5, 1.6, 0x5ec8f2);                                                  // the crash mat
  person(p, CW - .8, -3.1, Math.PI, 0xff6b6b, .55, 7.2);                                              // a climber halfway up
  p.box(CW - .8, 9.2, -3.25, .08, 9, .08, WHITE);                                                     // the rope
  // the juice bar on the right: a little kiosk with a striped awning and a giant cup on top
  p.at(14.5, 9, -.3);
  p.box(0, 0, 0, 6, 3, 3, CREAM); p.box(0, 3, 0, 6.4, .3, 3.4, GOLD);
  for (let i = 0; i < 6; i++) p.box(-2.75 + i * 1.1, 3.3, 1.9, 1.1, .3, 1.6, i % 2 ? WHITE : 0x7ed957);
  p.box(0, 1.1, 1.55, 5, .3, .5, WOOD); p.cyl(0, 3.6, 0, 2.4, 3, 0xff8fb1); p.cyl(0, 6.6, 0, 2.7, .4, WHITE); p.box(.5, 6.9, 0, .25, 2.2, .25, 0x7ed957, .3);
  p.at(0, 0, 0);
  // the treadmill deck: a wooden deck under a navy pergola, six treadmills (their runners are live)
  p.box(-1.5, .3, 8.4, 20, .3, 5.2, WOOD);
  for (const x of [-11, 8]) for (const z of [6.2, 10.6]) p.box(x, .6, z, .4, 4.6, .4, NAVY);
  for (let i = 0; i < 7; i++) p.box(-11 + i * 3.17, 5.2, 8.4, .3, .3, 5, NAVY); p.box(-1.5, 5.2, 6.2, 19.6, .3, .3, NAVY); p.box(-1.5, 5.2, 10.6, 19.6, .3, .3, NAVY);
  for (let i = 0; i < 6; i++) {
    const x = -9.5 + i * 3.1;
    p.box(x, .6, 8.6, 1.3, .35, 3, RUB); p.box(x, .95, 8.6, 1.1, .04, 2.8, DARK);                     // the belt
    p.box(x - .6, .6, 7.3, .12, 1.6, .12, 0xbfc6cf); p.box(x + .6, .6, 7.3, .12, 1.6, .12, 0xbfc6cf); p.box(x, 2.1, 7.25, 1.3, .5, .3, NAVY); // the console
  }
  // a giant gold kettlebell, a pull-up bar, a bench with a barbell
  p.ball(10, .2, 15.4, 4.4, 3.8, GOLD); p.box(10, 5.6, 15.4, 3.4, .6, .7, GOLD); p.box(8.5, 3.4, 15.4, .6, 2.6, .7, GOLD); p.box(11.5, 3.4, 15.4, .6, 2.6, .7, GOLD); p.cyl(10, .2, 15.4, 3.6, .5, NAVY);
  p.box(-9, 0, 14.6, .25, 4, .25, DARK); p.box(-5, 0, 14.6, .25, 4, .25, DARK); p.box(-7, 4, 14.6, 4.3, .18, .18, 0xbfc6cf);
  person(p, -7, 14.6, Math.PI, 0x7ed957, .55, 1.2); p.box(-7.35, 2.7, 14.6, .14, 1.4, .14, SKIN); p.box(-6.65, 2.7, 14.6, .14, 1.4, .14, SKIN); // hanging on the bar
  p.at(-16, 14.4, .3); p.box(0, .5, 0, 1, .3, 3, NAVY); p.box(0, 0, -1.2, .8, .5, .3, DARK); p.box(0, 0, 1.2, .8, .5, .3, DARK);
  p.box(0, 1.6, -.6, 3.6, .14, .14, 0xbfc6cf); for (const x of [-1.6, 1.6]) p.cyl(x, 1, -.6, 1.2, .3, RUB); p.box(-.9, 1, -.6, .1, .7, .1, DARK); p.box(.9, 1, -.6, .1, .7, .1, DARK);
  p.at(0, 0, 0);
  // the record board (the text is live) on two posts
  for (const x of [-4.4, 4.4]) p.box(x, 0, 25, .3, 3.4, .3, NAVY);
  // people: runners on the track, a queue at the juice bar, people stretching
  [[-17, 19, Math.PI / 2], [-13, 18.4, Math.PI / 2], [3, 20.2, -Math.PI / 2], [16, 18.6, -Math.PI / 2],
   [14.3, 12.3, Math.PI], [13, 13.4, Math.PI], [-1.2, 13.8, 2.6], [1.6, 14.2, -2.6], [-19.5, 2.6, 2.2], [6, 24, 3]]
    .forEach(([x, z, r], i) => person(p, x, z, r, SH[i % SH.length]));
  for (const [x, z, c] of [[-1.2, 13.8, 0x5ec8f2], [1.6, 14.2, 0xff8fb1], [5, 13, 0xffe066]]) p.box(x, .35, z, 1.8, .06, 3, c, .3);  // yoga mats
  // lamps, benches, water bottles, trees
  for (const [x, z] of [[-23, 8], [23, 8], [-23, 24], [23, 24]]) { p.cyl(x, 0, z, .3, 4.4, NAVY); p.ball(x, 4.4, z, 1, 1, 0xfff4c2); }
  for (const [x, z, r] of [[-19, 25.4, Math.PI], [19, 25.4, Math.PI], [-22.5, 14, Math.PI / 2]]) { p.at(x, z, r); p.box(0, .5, 0, 2.4, .2, .8, WOOD); p.box(0, .9, -.35, 2.4, .7, .14, WOOD); p.box(-1, 0, 0, .2, .5, .7, DARK); p.box(1, 0, 0, .2, .5, .7, DARK); }
  p.at(0, 0, 0);
  for (const [x, z, c] of [[-18.4, 25.6, 0x5ec8f2], [18.6, 25.6, 0xff6b6b]]) { p.cyl(x, .9, z, .5, 1.1, c); p.cyl(x, 2, z, .3, .3, WHITE); }
  for (const [x, z, s] of [[-25, 0, 1.3], [25, -2, 1.4], [-24, -16, 1.5], [24, -15, 1.5], [-12, -22, 1.3], [1, -23, 1.2], [13, -22, 1.3], [-26, 18, 1.1], [26, 16, 1.1]]) p.tree(x, z, s);
}

/** the giant dumbbell, drawn standing up (its bar along y), turned on its side by the live group */
function dumbbell() {
  const d = new Pen();
  d.cyl(0, -11, 0, .9, 22, 0xbfc6cf);
  for (const s of [-1, 1]) {
    d.cyl(0, s > 0 ? 6.6 : -8, 0, 7.4, 1.4, NAVY); d.cyl(0, s > 0 ? 8 : -9.6, 0, 6.4, 1.6, GOLD); d.cyl(0, s > 0 ? 9.6 : -10.8, 0, 2.4, 1.2, NAVY);
  }
  const g = new THREE.Group(); d.build(g); return g;
}

/** a runner on a treadmill: a little person, bobbing (live) */
function runner(shirt) { const r = new Pen(); person(r, 0, 0, Math.PI, shirt, .55); const g = new THREE.Group(); r.build(g); return g; }

export function gymLive(group) {
  const big = '900 {px}px Rubik';
  group.add(sign('חדר כושר ספיר 💪', { w: 21, h: 2.8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 10.2, 2.45));
  group.add(sign('רעיון של @itamarsarusi · אדריכל', { w: 7.6, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 6.4, 6.18));
  group.add(sign('בר שייקים 🥤', { w: 5.4, h: 1, bg: '#ffffff', fg: '#0f6f73', border: '#0f6f73', font: big }).at(14.5 + Math.sin(-.3) * 1.75, 2.2, 9 + Math.cos(-.3) * 1.75, -.3));
  group.add(sign('קיר טיפוס 🧗', { w: 5, h: 1.2, bg: '#c8452e', fg: '#ffffff', border: '#13213b', font: big }).at(-21.5, 16.4, -3.44));
  group.add(sign('🏆 שיא הממלכה', { w: 9, h: 1.2, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.6, 25.2));
  group.add(sign('המלך: 3 שכיבות סמיכה 👑', { w: 9, h: 1.4, bg: '#fbf3e2', fg: '#13213b', border: '#e8b323', font: big }).at(0, 3.2, 25.2));
  group.add(sign('אתם שוברים? 💪', { w: 9, h: 1, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 2, 25.2));
  // the giant dumbbell on the roof, lying across the forks; it is lifted and set down
  const db = dumbbell(), piv = new THREE.Group(); piv.position.set(0, 16.9, -8); db.rotation.z = Math.PI / 2; piv.add(db); group.add(piv);
  // the runners on the treadmills
  const runners = Array.from({ length: 6 }, (_, i) => { const r = runner(SH[i]); r.position.set(-9.5 + i * 3.1, .99, 9); group.add(r); return r; });
  group.userData.dumbbell = piv;
  group.userData.tick = t => {
    const c = (t % 3.2) / 3.2, up = c < .35 ? Math.sin(c / .35 * Math.PI / 2) : c < .55 ? 1 : c < .9 ? Math.cos((c - .55) / .35 * Math.PI / 2) : 0;
    piv.position.y = 16.9 + up * 4.2; piv.rotation.x = Math.sin(t * 1.1) * .06;
    runners.forEach((r, i) => { r.position.y = .99 + Math.abs(Math.sin(t * 7 + i * 1.3)) * .22; });
  };
  group.userData.tick(0);
}

export const GYM = { key: 'gym', name: 'חדר כושר ספיר', draw: drawGym, live: gymLive, top: 34 };
