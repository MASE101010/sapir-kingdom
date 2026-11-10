// הקופה הראשית של הממלכה: day 27, @orthegoat's comment "תבנו קופה ראשית" (3 likes, the top comment on day 26's reel).
// The kingdom's main box office, where every ticket is sold: a round cream pavilion with eight ticket windows, each with
// the name of a place in the kingdom, under a red and white striped roof; on top a giant golden piggy bank (a קופה, both
// meanings) with a coin dropping into it (live). In front a huge golden ticket standing on its edge (you see it from far
// away), queues between rope barriers, turnstiles, two ticket machines, the board of today's shows, flags and lamps.
// Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const CREAM = 0xf6eedd, CREAM2 = 0xe7dabd, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, GOLD2 = 0xc9971a, RED = 0xc8443a,
  WHITE = 0xf7f5ee, GLASS = 0x8fc3d9, PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, METAL = 0x9aa3ab, DARK = 0x2b2f36, SKIN = 0xe2b48f,
  GRASS = 0x86c766, PINK = 0xf3a6b8, WOOD = 0x8a6240;
export const WINDOWS = ['ספירלנד 🎢', 'האצטדיון ⚽', 'הרכבת 🚂', 'פארק המים 💦', 'ספיר הוטל 🏨', 'בית הספר 🏫', 'ספיר סינמה 🎬', 'ספארי ספיר 🦁'];
const PR = 9;                                                                // the pavilion's radius

function guest(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}

export function drawBoxOffice(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the plaza: a round paved square with a gold star in the middle of the front, the path from the gate
  p.cyl(0, .2, -3, 46, .12, PAVE); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; p.box(Math.sin(a) * 18, .33, -3 + Math.cos(a) * 18, 1.4, .02, 5, PAVE2, a); }
  p.box(0, .2, 22, 7, .12, 12, PAVE);
  // the pavilion: a round cream drum, eight ticket windows round it, a gold band, the striped roof in eight slices
  p.cyl(0, .2, -6, PR * 2 + 1, .6, CREAM2, 8); p.cyl(0, .8, -6, PR * 2, 6, CREAM, 8); p.cyl(0, 6.8, -6, PR * 2 + .4, .5, GOLD, 8);
  for (let k = 0; k < 8; k++) { const a = (k + .5) / 8 * Math.PI * 2, x = Math.sin(a) * (PR - .1), z = -6 + Math.cos(a) * (PR - .1);
    p.box(x, 2, z, 3.6, 2.6, .3, GLASS, a); p.box(x + Math.sin(a) * .3, 1.8, z + Math.cos(a) * .3, 4, .3, .9, WOOD, a);          // the window and its counter
    p.box(x + Math.sin(a) * .2, 4.6, z + Math.cos(a) * .2, 4.2, .8, .2, k % 2 ? TEAL : NAVY, a);                                   // its name board (text live)
    p.box(x + Math.sin(a) * .6, 5.3, z + Math.cos(a) * .6, 4.4, .25, 1.4, RED, a); }                                              // a small awning
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.cone(Math.sin(a) * 4.2, 7.3, -6 + Math.cos(a) * 4.2, 9.8, 5, k % 2 ? WHITE : RED, 3); }
  p.cone(0, 7.3, -6, PR * 2 + 1.2, 5.6, RED, 8); for (let k = 0; k < 8; k++) { const a = (k + .5) / 8 * Math.PI * 2; p.box(Math.sin(a) * 4.8, 9.6, -6 + Math.cos(a) * 4.8, .5, .2, 8.4, WHITE, a); }
  // the giant golden piggy bank on top of the roof, with a coin slot, ears, a snout, legs and a curly tail
  const PY = 12.6, PZ = -6;
  p.ball(0, PY, PZ, 7, 6, GOLD); p.box(0, PY + 5.8, PZ, 2.6, .3, .5, DARK);
  p.cyl(0, PY + 2.4, PZ + 3.5, 2.2, 1.4, GOLD2, 12); p.box(-.45, PY + 2.8, PZ + 4.3, .35, .6, .1, DARK); p.box(.45, PY + 2.8, PZ + 4.3, .35, .6, .1, DARK);
  p.cyl(0, PY + 2.2, PZ + 3.2, 2.4, .2, GOLD2);
  for (const s of [-1, 1]) { p.cone(s * 1.8, PY + 5, PZ + 1.8, 1.6, 1.6, GOLD2); p.box(s * 1.2, PY + 3.9, PZ + 3.1, .5, .5, .2, DARK);
    for (const z of [-1.8, 1.8]) p.cyl(s * 1.9, PY - .8, PZ + z, 1.3, 1.4, GOLD2); }
  p.ball(0, PY + 3, PZ - 3.6, .8, .8, GOLD2); p.ball(.4, PY + 3.6, PZ - 3.8, .6, .6, GOLD2);
  // the giant golden ticket in front, standing on its long edge in a stand, with its stub torn along dots
  const TZ = 9;
  p.box(0, .2, TZ, 14, .8, 2.4, NAVY); p.box(0, 1, TZ, 13, 7, .7, GOLD); p.box(0, 1.6, TZ, 12, 5.8, .74, 0xf5d36a);
  for (let k = 0; k < 7; k++) p.box(3.4, 1.6 + k * .85, TZ, .2, .4, .76, GOLD2);
  for (const s of [-1, 1]) { p.cyl(s * 6.5, 4.5, TZ, 1.2, .76, 0xf6eedd); }
  // queues: rope barriers on posts zig zagging to the front windows, people waiting with tickets in hand
  for (let row = 0; row < 3; row++) { const z = 3 - row * 1.6;
    for (let k = 0; k < 6; k++) { const x = -8 + k * 3.2; p.cyl(x, .3, z, .3, 1.3, GOLD); p.ball(x, 1.6, z, .4, .4, GOLD); if (k < 5) p.box(x + 1.6, 1.15, z, 3, .14, .14, RED); } }
  [[-6.4, 2.2, 0, TEAL], [-3.2, 2.2, 0, RED], [0, 2.2, 0, PINK], [3.4, 2.2, 0, NAVY], [-4.6, .6, Math.PI, GOLD], [-1.4, .6, Math.PI, TEAL], [1.8, .6, Math.PI, RED],
   [5.2, .6, Math.PI, PINK], [-2.6, -1, 0, NAVY], [2.2, -1, 0, TEAL]].forEach(([x, z, r, c]) => guest(p, x, z, r, c));
  // turnstiles at the plaza's sides, two ticket machines, the board with today's shows on posts
  for (const s of [-1, 1]) { for (let k = 0; k < 3; k++) { const x = s * (15 + k * 1.8), z = 6; p.box(x, .3, z, .5, 1.4, 1.4, METAL); p.cyl(x - s * .5, 1.2, z, .9, .12, GOLD); }
    p.box(s * 13, .3, -2, 1.6, 3, 1.2, TEAL); p.box(s * 13, 2, -1.38, 1.1, .8, .05, GLASS); p.box(s * 13, 1.1, -1.38, .7, .2, .05, GOLD); }
  for (const x of [-4, 4]) p.cyl(x - 14, .2, -16, .3, 5, DARK);
  p.box(-18, 4.4, -16, 9.4, 4, .4, NAVY); p.box(-18, 4.2, -15.9, 9.8, .2, .5, GOLD);
  // flags and lamps round the plaza, trees at the back
  for (let k = 0; k < 6; k++) { const a = (k + .5) / 6 * Math.PI * 2 + Math.PI, x = Math.sin(a) * 21, z = -3 + Math.cos(a) * 21;
    p.cyl(x, .2, z, .25, 7, METAL); p.box(x + .8, 5.8, z, 1.6, 1.1, .06, [RED, GOLD, TEAL][k % 3]); }
  for (const [x, z] of [[-5, 16], [5, 16], [-20, 4], [20, 4]]) { p.cyl(x, .2, z, .25, 4.4, NAVY); p.ball(x, 4.4, z, .9, .9, 0xfff3c4); }
  for (const [x, z, s] of [[-24, 12, 1], [24, 12, 1], [-22, -18, .9], [22, -18, 1.1], [0, -27, .9], [-12, -25, .8], [12, -25, .8]]) p.tree(x, z, s, 0x4f9a43);
  // the gate: two gold pillars and a beam (its signs are live)
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, GOLD); p.ball(x, 6.6, 27, 1.4, 1.4, RED); }
  p.box(0, 4.6, 27, 15.2, 2, .8, NAVY); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
}

export function boxOfficeLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('הקופה הראשית של הממלכה 🎟️', { w: 11.2, h: 1.5, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @orthegoat · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('כרטיס זהב לכל הממלכה 👑', { w: 10.4, h: 2, bg: '#f5d36a', fg: '#13213b', border: '#c9971a', font: big }).at(-.8, 4.5, 9.38));
  // the windows' name boards, round the pavilion, each turned to face out
  WINDOWS.forEach((t, k) => { const a = (k + .5) / 8 * Math.PI * 2, s = sign(t, { w: 3.9, h: .7, bg: k % 2 ? '#0f6f73' : '#13213b', fg: '#ffffff', border: '#e8b323', font: big });
    s.position.set(Math.sin(a) * (PR + .25), 4.6, -6 + Math.cos(a) * (PR + .25)); s.rotation.y = a; group.add(s); });
  group.add(sign('היום בממלכה ⭐', { w: 8.6, h: 1, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(-18, 7.6, -15.75));
  group.add(sign('⚽ הפועל נגד בית"ר · 🎢 ספירלנד פתוח · 🚂 רכבת כל 5 דק\'', { w: 9, h: 2.4, bg: '#13213b', fg: '#ffffff', border: '#13213b' }).at(-18, 5.4, -15.75));
  // a golden coin drops into the piggy bank's slot, again and again, and spins as it falls
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .25, 20), new THREE.MeshLambertMaterial({ color: GOLD })); coin.rotation.x = Math.PI / 2; group.add(coin);
  group.userData.tick = t => { const q = (t * .45) % 1; coin.position.set(0, 12.6 + 6 + 8 * (1 - q), -6); coin.rotation.z = t * 4; coin.visible = q < .97; };
  group.userData.tick(0);
}

export const BOXOFFICE = { key: 'box-office', name: 'הקופה הראשית של הממלכה', draw: drawBoxOffice, live: boxOfficeLive, top: 22 };
