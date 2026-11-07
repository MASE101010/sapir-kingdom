// בית ספר ספיר: day 24. Michael picked it himself, from @eladshwar's comment on day 22 ("בית ספר ספיר ותיכון ספיר", the runner
// up that day). Every resident can be a student ("תלמיד") or a teacher ("מורה" and the subject). A U of cream classrooms with red
// roofs round a yard, a clock tower with a bell in the middle (the bell swings, live), a giant yellow pencil at the gate (you see it
// from far away), the classroom doors with their subjects, the teachers' room, a blackboard on the wall, a basketball hoop and a
// football goal in the yard, a yellow school bus at the kerb, kids with school bags. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const CREAM = 0xf6eedd, CREAM2 = 0xe7dabd, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc8443a, WHITE = 0xf7f5ee,
  GLASS = 0x8fc3d9, YARD = 0xd9c9a8, LINE = 0xf7f5ee, WOOD = 0x8a6240, METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f,
  GRASS = 0x86c766, YEL = 0xf2c418, PINK = 0xf0a0a8, BOARD = 0x2f5a46, CORAL = 0xf08a6c;
export const SUBJECTS = [['ציור 🎨', CORAL], ['מתמטיקה ➕', TEAL], ['אנגלית 🔤', NAVY], ['מוזיקה 🎵', 0x8a5cc0], ['מדעים 🔬', 0x3f9a5a], ['ספורט ⚽', RED]];

/** a kid: legs, a shirt, a head, hair, and a school bag on the back */
function kid(p, x, z, r, shirt, bag, s = .8) {
  p.at(x, z, r, .2);
  p.box(-.18 * s, 0, 0, .3 * s, .9 * s, .34 * s, 0x2a3550); p.box(.18 * s, 0, 0, .3 * s, .9 * s, .34 * s, 0x2a3550);
  p.box(0, .9 * s, 0, .9 * s, 1.05 * s, .55 * s, shirt); p.box(0, 1.95 * s, 0, .65 * s, .65 * s, .65 * s, SKIN); p.box(0, 2.5 * s, 0, .7 * s, .2 * s, .7 * s, 0x4a3020);
  p.box(0, 1.05 * s, -.45 * s, .75 * s, .85 * s, .35 * s, bag);
  p.at(0, 0, 0);
}

export function drawSchool(p) {
  p.at(0, 0, 0);
  // the ground: lawn, the paved yard inside the U, the path from the gate, the yard's lines
  p.cyl(0, 0, 0, 59, .2, GRASS); p.box(0, .2, -4, 40, .12, 26, YARD); p.box(0, .2, 17, 6, .12, 16, YARD);
  p.box(-9, .33, -2, 12, .02, .2, LINE); p.box(-9, .33, 6, 12, .02, .2, LINE); p.box(-15, .33, 2, .2, .02, 8, LINE); p.box(-3, .33, 2, .2, .02, 8, LINE);
  p.cyl(-9, .33, 2, 3, .02, LINE); p.cyl(-9, .34, 2, 2.6, .02, YARD);
  // hopscotch squares in front of the tower
  for (let k = 0; k < 6; k++) p.box(k % 3 === 1 ? 0 : (k % 3 === 0 ? -.8 : .8) * (k > 2 ? 1 : 0), .34, 4 + k * 1.3, 1.4, .02, 1.2, [CORAL, YEL, TEAL, PINK, CORAL, YEL][k]);

  // the back wing: two storeys of classrooms, red gable roof, windows and doors on the yard side
  const B = -17;
  p.box(0, .2, B, 40, 8, 8, CREAM); p.box(0, 4.1, B, 40.4, .3, 8.4, CREAM2); p.gable(0, 8.2, B, 41, 3, 9, RED);
  for (let k = 0; k < 8; k++) { const x = -17.5 + k * 5;
    p.box(x, 5, B + 4.02, 2.8, 2, .12, GLASS); p.box(x, 4.8, B + 4.1, 3.2, .2, .3, WHITE);
    if (k % 2 === 0) { p.box(x, .3, B + 4.02, 1.6, 2.6, .12, [CORAL, TEAL, YEL, 0x8a5cc0][k / 2]); p.box(x, 2.9, B + 4.08, 2, .2, .3, WHITE); }
    else if (k !== 5) p.box(x, 1.2, B + 4.02, 2.8, 2, .12, GLASS); }
  // the blackboard on the back wing's wall, with chalk sums and a heart
  p.box(7.5, 1, B + 4.14, 4.4, 2.6, .12, BOARD); p.box(7.5, .85, B + 4.22, 4.6, .15, .3, WOOD);
  for (const [x, y, w] of [[6.4, 2.9, 1.2], [6.4, 2.3, 1], [8.6, 2.6, 1.6], [8.6, 1.9, 1.1]]) p.box(x, y, B + 4.22, w, .12, .02, WHITE);
  // two side wings, one storey, with red roofs
  for (const s of [-1, 1]) { const x = s * 16;
    p.box(x, .2, -4, 8, 5, 18, CREAM); p.gable(x, 5.2, -4, 9, 2.4, 18.6, RED);
    for (let k = 0; k < 4; k++) { const z = -10.5 + k * 4.4; p.box(x - s * 4.02, 1.3, z, .12, 2, 2.6, GLASS); p.box(x - s * 4.1, 3.4, z, .3, .2, 3, WHITE); }
    p.box(x, .2, 5.2, 4, 3, .4, CREAM2); }

  // the clock tower in the middle of the back wing: the clock, the bell under a little roof, the flag
  p.box(0, .2, B + 2, 7, 15, 7, CREAM); p.box(0, 15.2, B + 2, 7.6, .5, 7.6, TEAL);
  p.box(0, 0.3, B + 5.52, 3, 3.6, .14, WOOD); p.box(0, 3.9, B + 5.6, 4, .5, .6, GOLD);
  p.box(0, 10.3, B + 5.6, 4.4, 4.4, .1, WHITE);
  p.box(0, 12.4, B + 5.7, .25, 1.6, .1, NAVY); p.box(.55, 12.3, B + 5.72, 1.3, .25, .1, NAVY); p.cyl(0, 12.3, B + 5.68, .5, .14, GOLD);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; p.box(Math.sin(a) * 1.85, 12.4 + Math.cos(a) * 1.85, B + 5.66, .2, .2, .06, NAVY); }
  for (const [x, z] of [[-3, B - 1], [3, B - 1], [-3, B + 5], [3, B + 5]]) p.box(x, 15.7, z, .5, 4.4, .5, CREAM2);
  p.cone(0, 20.1, B + 2, 9.6, 4.4, RED, 4); p.ball(0, 24.4, B + 2, .8, .8, GOLD);
  p.cyl(4.6, 15.7, B + 2, .2, 8, METAL);

  // the giant yellow pencil standing at the gate: a hexagonal yellow body, a pink eraser in a silver band, a wood cone with a black tip
  const PX = -8, PZ = 21;
  p.cyl(PX, .2, PZ, 4.4, .8, CREAM2); p.cyl(PX, 1, PZ, 3, 1.4, PINK, 6); p.cyl(PX, 2.4, PZ, 3.1, 1, METAL, 6);
  p.cyl(PX, 3.4, PZ, 3, 13, YEL, 6); for (let k = 0; k < 6; k++) { const a = (k + .5) / 6 * Math.PI * 2; p.box(PX + Math.sin(a) * 1.32, 3.4, PZ + Math.cos(a) * 1.32, .12, 13, .3, 0xe0a810, a); }
  p.cone(PX, 16.4, PZ, 3, 3, 0xe9c79a, 6); p.cone(PX, 18.6, PZ, 1, 1, DARK, 6);

  // the gate: two pillars and an arch beam (its name sign is live), a low fence along the front with coloured pickets
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 26, 1.6, 6.4, 1.6, CREAM); p.ball(x, 6.6, 26, 1.4, 1.4, YEL); }
  p.box(0, 4.6, 26, 14.8, 2, .8, NAVY); p.box(0, 6.6, 26, 15.2, .3, 1, GOLD);
  for (const s of [-1, 1]) for (let k = 0; k < 12; k++) { const x = s * (8.6 + k * 1.5);
    if (Math.hypot(x, 26) > 29) continue; p.box(x, .2, 26, .5, 1.6, .3, [CORAL, YEL, TEAL, PINK][k % 4]); p.cone(x, 1.8, 26, .5, .5, [CORAL, YEL, TEAL, PINK][k % 4], 4); }
  for (const s of [-1, 1]) p.box(s * 15.5, 1.2, 26, 13, .2, .2, WHITE);

  // the yard: a basketball hoop on the right, a small football goal on the left, benches, a drinking fountain, trees
  p.cyl(11, .2, 4, .35, 6, METAL, ); p.box(10.4, 5.6, 4, .15, 1.6, 2.4, WHITE); p.box(10.3, 5.6, 4, .05, .7, 1, RED); p.cyl(9.6, 5.4, 4, 1.1, .15, CORAL);
  p.box(-9, .2, -8.5, 6, 2.6, .2, WHITE); p.box(-12, .2, -7.4, .2, 2.6, 2.2, WHITE); p.box(-6, .2, -7.4, .2, 2.6, 2.2, WHITE); p.box(-9, 2.6, -7.4, 6, .2, 2.2, WHITE);
  p.ball(-8, .2, -4, .8, .8, WHITE);
  for (const [x, z, r] of [[5, 7, 0], [-4, 9, 0], [13.5, 4, Math.PI / 2]]) { p.box(x, .7, z, 3.2, .25, .9, WOOD, r); p.box(x, .2, z, .2, .5, .7, DARK, r); }
  p.box(4, .2, -11, 1, 1.4, .8, METAL); p.cyl(4, 1.6, -11, .3, .3, TEAL);
  for (const [x, z, s] of [[-24, 10, 1], [24, 9, 1.1], [-22, -22, .9], [22, -22, 1], [-26, -6, .8], [26, -6, .9]]) p.tree(x, z, s, 0x4f9a43);

  // the yellow school bus at the kerb (no brand): body, black stripes, windows, a stop arm
  p.at(10, 19.5, Math.PI / 2, .32);
  p.box(0, .6, 0, 2.6, 2.4, 10, YEL); p.box(0, 3, 0, 2.5, .3, 9.8, YEL); p.box(0, 1, 0, 2.62, .15, 10.02, DARK); p.box(0, 1.6, 0, 2.62, .15, 10.02, DARK);
  for (let k = 0; k < 6; k++) p.box(0, 2, -3.8 + k * 1.5, 2.64, .8, 1.1, GLASS); p.box(0, .6, 5.02, 2.3, 1.2, .1, DARK); p.box(0, 1.9, 5.02, 2.2, .9, .1, GLASS);
  for (const [x, z] of [[-1.3, 3.4], [1.3, 3.4], [-1.3, -3.4], [1.3, -3.4]]) p.box(x, 0, z, .3, 1, 1, DARK);
  p.box(1.5, 1.8, 3.4, .1, .8, .8, RED);
  p.at(0, 0, 0);

  // kids with school bags walking in through the gate and playing in the yard
  [[-1.2, 22, Math.PI, CORAL, TEAL], [1, 20, Math.PI, TEAL, RED], [-.4, 15, Math.PI, YEL, NAVY], [6, 1, -.6, PINK, TEAL], [-9, 2.4, .8, TEAL, YEL], [-10.4, 1, 2.6, RED, PINK],
   [0, 6, 0, NAVY, CORAL], [12, -1, -1.6, YEL, RED]].forEach(([x, z, r, s, b]) => kid(p, x, z, r, s, b));
}

export function schoolLive(group) {
  const big = '900 {px}px "Secular One", Rubik', B = -17;
  group.add(sign('בית ספר ספיר 🏫', { w: 10, h: 1.7, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.75, 26.42));
  group.add(sign('רעיון של @eladshwar · אדריכל', { w: 8.4, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 26.42));
  group.add(sign('בית ספר ספיר', { w: 6.6, h: 1.2, bg: '#f6eedd', fg: '#13213b', border: '#c8443a', font: big }).at(0, 7.4, B + 5.62));
  SUBJECTS.forEach(([t, c], k) => {   // the classroom doors on the back wing, and two on the side wings
    const L = Math.PI / 2, at = [[-11.88, 3.9, -8.3, L], [-7.5, 3.2, B + 4.2], [-11.88, 3.9, -3.9, L], [11.88, 3.9, -8.3, -L], [11.88, 3.9, -3.9, -L], [-11.88, 3.9, .5, L]][k];   // where the yard sees them
    const s = sign(t, { w: 3.6, h: .8, bg: '#' + c.toString(16).padStart(6, '0'), fg: '#ffffff', border: '#ffffff', font: big }).at(at[0], at[1], at[2]);
    if (at[3]) s.rotation.y = at[3]; group.add(s); });
  { const t = sign('חדר המורים 📚', { w: 3.6, h: .8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(11.88, 3.9, .5); t.rotation.y = -Math.PI / 2; group.add(t); }
  group.add(sign('אין שיעורי בית! 👑', { w: 4.6, h: .8, bg: '#2f5a46', fg: '#ffffff', border: '#8a6240' }).at(7.5, 3.95, B + 4.24));
  const mat = c => new THREE.MeshLambertMaterial({ color: c });
  // the bell in the tower swings, the flag on the tower waves, the basketball bounces
  const bell = new THREE.Group(); bell.position.set(0, 19.6, B + 2); group.add(bell);
  const cup = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2, 16, 1, true), new THREE.MeshLambertMaterial({ color: GOLD, side: THREE.DoubleSide })); cup.position.y = -1.3; bell.add(cup);
  const clap = new THREE.Mesh(new THREE.SphereGeometry(.35, 8, 6), mat(DARK)); clap.position.y = -2.2; bell.add(clap);
  const flag = new THREE.Group(); flag.position.set(4.6, 23.5, B + 2); group.add(flag);
  for (const [x, c] of [[.7, NAVY], [1.9, YEL], [3.1, NAVY]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, .08), mat(c)); b.position.set(x, -1, 0); flag.add(b); }
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.4, 12, 8), mat(CORAL)); group.add(ball);
  group.userData.tick = t => {
    bell.rotation.z = .5 * Math.sin(t * 3); flag.rotation.y = .4 * Math.sin(t * 1.1);
    const q = (t * 1.4) % 1; ball.position.set(8.6, .6 + 3.2 * 4 * q * (1 - q), 4.6);
  };
  group.userData.tick(0);
}

export const SCHOOL = { key: 'school', name: 'בית ספר ספיר', draw: drawSchool, live: schoolLive, top: 26 };
