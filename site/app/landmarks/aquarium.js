// האקווריום הגדול של הממלכה: day 29, @orthegoat's comment "...במקום תבנו אקווריום גדול" (5 likes, the top comment on
// day 28's reel; he asked for a hotel first and laughed when he saw we already have one). A giant round glass tank, 24 m
// across and 14 m tall, full of colourful fish, a shark and a turtle swimming round coral and seaweed (live); in front the
// entrance is a huge friendly blue whale: you walk in through its mouth, and it blows a fountain from its blowhole (live).
// On the sides a penguin pool with ice rocks and a seal pool with benches, round them a sea blue plaza, lamps, palms and
// visitors. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const BLUE = 0x3f7cc4, BLUE2 = 0x2f5f9e, BELLY = 0xdfeaf2, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf6eedd,
  SAND = 0xf0dca8, WATER = 0x5fb8de, ICE = 0xf4fbff, ROCK = 0x8a8f96, CORAL = [0xf38a7a, 0xf3a6b8, 0xf2a03d, 0xb57ad6, 0xe8b323],
  SEAWEED = 0x3e9a5a, PAVE = 0xdde9ee, PAVE2 = 0xc4d7df, GRASS = 0x86c766, DARK = 0x1f2329, WHITE = 0xf7f5ee, SKIN = 0xe2b48f,
  RED = 0xc8443a, PINK = 0xf3a6b8, WOOD = 0x8a6240;
const TR = 12, TZ = -9, TH = 14;                                              // the tank: radius, centre z, height

function visitor(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
function penguin(p, x, z, r) {
  p.at(x, z, r, .2);
  p.box(0, 0, 0, .9, 1.3, .8, DARK); p.box(0, .15, .3, .65, 1, .25, WHITE); p.box(0, 1.3, 0, .7, .6, .65, DARK);
  p.box(-.18, 1.5, .33, .14, .14, .05, WHITE); p.box(.18, 1.5, .33, .14, .14, .05, WHITE); p.box(0, 1.35, .4, .25, .15, .3, GOLD);
  p.box(-.5, .5, 0, .15, .7, .4, DARK); p.box(.5, .5, 0, .15, .7, .4, DARK); p.box(-.2, -.1, .2, .3, .1, .4, GOLD); p.box(.2, -.1, .2, .3, .1, .4, GOLD);
  p.at(0, 0, 0);
}

export function drawAquarium(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the plaza: sea blue paving with white wave lines, the path from the gate
  p.cyl(0, .2, -2, 50, .12, PAVE); for (let k = 0; k < 6; k++) p.box(0, .33, 4 + k * 3.6, 30 - k * 2, .02, .3, PAVE2);
  p.box(0, .2, 23, 7, .12, 10, PAVE);
  // the tank: a navy base ring, a sand floor, coral, rocks and seaweed inside, a gold rim on top (the glass is live)
  p.cyl(0, .2, TZ, TR * 2 + 2, 1.4, NAVY, 32); p.cyl(0, 1.6, TZ, TR * 2 - .4, .6, SAND, 32);
  for (let k = 0; k < 32; k++) { const a = (k + .5) / 32 * Math.PI * 2, x = Math.sin(a) * (TR + .1), z = TZ + Math.cos(a) * (TR + .1);
    p.box(x, 1.6 + TH, z, 2.5, .8, 1.2, NAVY, a); p.box(x, 2.4 + TH, z, 2.6, .3, 1.3, GOLD, a); }
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; p.box(Math.sin(a) * (TR + .2), 1.6, TZ + Math.cos(a) * (TR + .2), .5, TH, .5, NAVY, a); }
  for (let k = 0; k < 14; k++) { const a = k * 2.4, r = 3 + (k * 37 % 7), x = Math.sin(a) * r, z = TZ + Math.cos(a) * r, c = CORAL[k % 5];
    if (k % 3 === 0) { p.ball(x, 2.2, z, 1.6, 1.4, c); p.ball(x + .6, 3.2, z, 1, 1, c); }
    else if (k % 3 === 1) { p.cyl(x, 2.2, z, .5, 2.6, c); p.cyl(x + .5, 2.8, z, .4, 2.2, c); p.cyl(x - .45, 3.2, z + .3, .4, 1.6, c); }
    else { p.box(x, 2.2, z, .3, 4 + k % 3, .3, SEAWEED, a); p.box(x + .5, 2.2, z + .2, .3, 3 + k % 2, .3, SEAWEED, a); } }
  for (const [x, z, s] of [[-6, TZ + 5, 2.4], [7, TZ - 4, 2], [2, TZ + 8, 1.6], [-4, TZ - 7, 1.8]]) p.ball(x, 1.9, z, s, s * .7, ROCK);
  p.box(0, 2.2, TZ - 2, 4, .8, 2, WOOD); p.box(0, 3, TZ - 2, 3.4, 1.4, 1.6, 0x6b4428); p.box(0, 4.4, TZ - 2, 3.6, .3, 1.8, GOLD);   // a treasure chest
  // the whale: the entrance building, a big friendly blue whale, its mouth is the door, a fountain from its blowhole (live)
  const WZ = 9;
  // the body in rounded steps, the light belly, the head with a big smile, eyes on its sides
  [[.2, 1.6, 10.4, 13.4, BLUE2], [1.8, 4.6, 10, 13, BLUE], [6.4, 1.4, 9, 12, BLUE], [7.8, 1.2, 7.4, 10.6, BLUE], [9, .8, 5, 8, BLUE]]
    .forEach(([y, h, w, d, c], k) => p.box(0, y, WZ - k * .3, w, h, d, c));
  p.box(0, 1.8, WZ + 6.55, 8.8, 4.2, .2, BLUE); p.box(0, 6.4, WZ + 5.9, 8, 1.4, .2, BLUE);
  p.box(0, .25, WZ + 6.62, 9.4, 1.4, .2, BELLY); p.box(0, 1.65, WZ + 6.6, 8.2, .6, .2, BELLY);
  p.box(0, .2, WZ + 6.75, 3.8, 3.2, .2, DARK); p.box(0, 3.4, WZ + 6.75, 2.8, .45, .2, DARK); p.box(0, 3.85, WZ + 6.75, 1.6, .35, .2, DARK);   // the door: the mouth
  p.box(0, 2.6, WZ + 6.8, 8.4, .35, .1, NAVY); p.box(-4.1, 2.95, WZ + 6.8, .9, .35, .1, NAVY); p.box(4.1, 2.95, WZ + 6.8, .9, .35, .1, NAVY);  // the smile
  for (const s of [-1, 1]) {
    p.ball(s * 5.05, 3.6, WZ + 4.4, 1.6, 1.6, WHITE); p.ball(s * 5.5, 3.9, WZ + 4.6, .8, .8, DARK); p.ball(s * 5.75, 4.2, WZ + 4.7, .3, .3, WHITE);
    p.box(s * 4.3, 3.4, WZ + 6.72, 1, .5, .1, PINK);
    p.box(s * 5.6, 1.4, WZ + 1.5, 2.4, .6, 4, BLUE2, s * .4); p.box(s * 6.8, 1, WZ + 2.1, 1.6, .5, 2.4, BLUE2, s * .6); }
  p.cyl(0, 9.75, WZ - 1, 1.2, .2, DARK);                                                                               // the blowhole
  // the tail curls up from the whale's back
  p.box(0, 7.6, WZ - 5.4, 4, 3.4, 2.6, BLUE); p.box(0, 10.8, WZ - 5.9, 2.8, 2.4, 1.8, BLUE); p.box(0, 13, WZ - 6.2, 1.8, 1, 1.4, BLUE);
  p.box(-2.5, 13.6, WZ - 6.3, 5, 1.1, 1.4, BLUE2, .35); p.box(2.5, 13.6, WZ - 6.3, 5, 1.1, 1.4, BLUE2, -.35);
  // portholes along the whale's sides
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { p.box(s * 5.02, 4.6, WZ - 3.4 + k * 2.6, .1, 1.2, 1.2, GOLD); p.box(s * 5.06, 4.75, WZ - 3.4 + k * 2.6, .1, .9, .9, WATER); }
  // the penguin pool on the left: water, ice rocks, an ice slide and penguins
  p.cyl(-19, .2, 9, 13, .9, WHITE, 16); p.cyl(-19, .5, 9, 11.6, .6, WATER, 16);
  for (const [x, z, s] of [[-22, 6, 3], [-17, 5, 2.4], [-23, 11, 2.2]]) { p.box(x, .5, z, s, s * .7, s, ICE); p.box(x + .3, .5 + s * .7, z, s * .7, s * .4, s * .7, ICE); }
  p.box(-15.5, .5, 12, 2, 3, 2, ICE); p.box(-15.5, 1.8, 10, 1.4, .3, 4, 0xbfe4f5, 0);
  [[-22, 6.4, 0], [-21.4, 6, .6], [-17, 5.2, -.3], [-23.4, 11.2, .8], [-16, 12.4, 0], [-19.4, 13.4, Math.PI]].forEach(([x, z, r], k) => penguin(p, x, z + (k < 2 ? 0 : 0), r));
  // the seal pool on the right with a little stage, a ball, and benches for the show
  p.cyl(19, .2, 8, 11, .9, CREAM, 16); p.cyl(19, .5, 8, 9.6, .6, WATER, 16); p.box(19, .5, 3.6, 4, 1.4, 2, ROCK);
  p.box(19, 1.9, 3.6, 1, .9, 1.6, 0x6d6a66); p.box(19, 2.8, 4.1, .8, .6, .8, 0x6d6a66); p.ball(19, 3.4, 4.3, .9, .9, RED); p.box(19, 2.8, 4.55, .5, .2, .1, DARK);
  for (let k = 0; k < 3; k++) p.box(19, .2 + k * .3, 15 + k * 1.3, 9 - k * .4, .5, .9, k % 2 ? TEAL : NAVY);
  // lamps shaped like bubbles, palms, a ticket booth, visitors
  for (const [x, z] of [[-6, 20], [6, 20], [-12, 18], [12, 18], [-14, -4], [14, -4]]) { p.cyl(x, .2, z, .25, 4.2, NAVY); p.ball(x, 4.2, z, 1.1, 1.1, 0xbfe4f5); }
  for (const [x, z, s] of [[-24, 18, 1], [24, 19, 1], [-23, -14, 1], [23, -14, 1.1], [0, -26, .9], [-14, -23, .8], [14, -23, .9]]) p.tree(x, z, s, 0x4f9a43);
  p.box(8, .2, 22, 3, 3, 2.4, TEAL); p.box(8, 3.2, 22, 3.6, .4, 3, GOLD); p.box(8, 1.6, 23.22, 2, 1, .05, WATER);
  [[-2.4, 18.6, Math.PI, RED], [-1.4, 19.2, Math.PI, TEAL], [2.2, 17.4, Math.PI, NAVY], [3, 18.2, Math.PI, PINK], [-18, 15.6, Math.PI, GOLD],
   [-20, 15.2, Math.PI, TEAL], [17, 15.2, Math.PI, RED], [20.6, 16.4, Math.PI, WHITE], [21.8, 16.4, Math.PI, NAVY], [-8, 4, Math.PI * .7, PINK], [9, 3, -Math.PI * .7, TEAL]]
    .forEach(([x, z, r, c]) => visitor(p, x, z, r, c));
  // the gate: two blue pillars with bubbles on top and a beam (its signs are live)
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, BLUE); p.ball(x, 6.6, 27, 1.4, 1.4, 0xbfe4f5); }
  p.box(0, 4.6, 27, 15.2, 2, .8, NAVY); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
}

// a little voxel fish
function fish(color, s) {
  const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(new THREE.BoxGeometry(.7 * s, .9 * s, 1.6 * s), m); g.add(body);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(.2 * s, 1 * s, .7 * s), m); tail.position.z = -1.1 * s; g.add(tail);
  for (const x of [-1, 1]) { const e = new THREE.Mesh(new THREE.BoxGeometry(.06, .2 * s, .2 * s), new THREE.MeshBasicMaterial({ color: 0x111111 })); e.position.set(x * .36 * s, .15 * s, .45 * s); g.add(e); }
  return g;
}

export function aquariumLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('האקווריום הגדול של הממלכה 🐠', { w: 11.2, h: 1.5, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @orthegoat · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  group.add(sign('כניסה דרך הלווייתן 🐳', { w: 6.4, h: 1, bg: '#ffffff', fg: '#2f5f9e', border: '#3f7cc4', font: big }).at(0, 10.6, 9 + 3.2));
  group.add(sign('הפינגווינים 🐧', { w: 4.6, h: .9, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(-19, 2.2, 15.2));
  group.add(sign('מופע כלבי הים 🦭', { w: 5.2, h: .9, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(19, 3, 1.9));
  // the glass of the tank: a clear blue wall, open at the top, drawn after the fish so they show through
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, TH, 40, 1, true),
    new THREE.MeshLambertMaterial({ color: 0x9fdcf5, transparent: true, opacity: .28, depthWrite: false, side: THREE.DoubleSide }));
  glass.position.set(0, 1.6 + TH / 2, TZ); glass.renderOrder = 2; group.add(glass);
  const top = new THREE.Mesh(new THREE.CircleGeometry(TR - .1, 40), new THREE.MeshLambertMaterial({ color: 0x5fb8de, transparent: true, opacity: .5, depthWrite: false }));
  top.rotation.x = -Math.PI / 2; top.position.set(0, 1.4 + TH, TZ); top.renderOrder = 3; group.add(top);
  // fish, a shark and a turtle swimming round the tank at their own speeds and heights
  const swimmers = [];
  const colors = [0xf2a03d, 0xf3d23a, 0xf38a7a, 0xb57ad6, 0x4fc3e8, 0xf7f5ee, 0xe8b323, 0xf3a6b8, 0x7fd36a, 0xf2a03d, 0x4fc3e8, 0xf38a7a];
  colors.forEach((c, k) => { const f = fish(c, 1 + (k % 3) * .25); group.add(f); swimmers.push({ o: f, r: 3.5 + (k * 2.3) % 7.5, y: 3.5 + (k * 1.7) % 10, w: (k % 2 ? 1 : -1) * (.35 + (k % 4) * .08), a: k * .9 }); });
  const shark = fish(0x8a96a3, 3.2); const finM = new THREE.Mesh(new THREE.BoxGeometry(.25, 1.6, 1.2), new THREE.MeshLambertMaterial({ color: 0x8a96a3 }));
  finM.position.set(0, 2.2, 0); shark.add(finM); group.add(shark); swimmers.push({ o: shark, r: 8.5, y: 9, w: .22, a: 2 });
  const turtle = new THREE.Group(); { const m = new THREE.MeshLambertMaterial({ color: 0x5c9a4a }), sh = new THREE.MeshLambertMaterial({ color: 0x8a6a3a });
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, .8, 2.8), sh); turtle.add(b); const h = new THREE.Mesh(new THREE.BoxGeometry(.8, .7, .9), m); h.position.z = 1.8; turtle.add(h);
    for (const [x, z] of [[-1.3, .9], [1.3, .9], [-1.2, -1], [1.2, -1]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(1, .2, .6), m); l.position.set(x, 0, z); turtle.add(l); } }
  group.add(turtle); swimmers.push({ o: turtle, r: 6, y: 6, w: -.15, a: 4 });
  // the whale's fountain: drops rising and falling from the blowhole
  const drops = []; const dm = new THREE.MeshLambertMaterial({ color: 0xbfe4f5 });
  for (let k = 0; k < 18; k++) { const d = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), dm); group.add(d); drops.push(d); }
  group.userData.tick = t => {
    swimmers.forEach(s => { const a = s.a + t * s.w; s.o.position.set(Math.sin(a) * s.r, s.y + Math.sin(t * 1.3 + s.a) * .6, TZ + Math.cos(a) * s.r);
      s.o.rotation.y = a + (s.w > 0 ? Math.PI / 2 : -Math.PI / 2); });
    drops.forEach((d, k) => { const q = (t * .9 + k / drops.length) % 1, ang = k * 2.4, sp = 1.8 * q;
      d.position.set(Math.sin(ang) * sp, 10 + 9 * q - 11 * q * q, 8 + Math.cos(ang) * sp); });
  };
  group.userData.tick(0);
}

export const AQUARIUM = { key: 'aquarium', name: 'האקווריום הגדול של הממלכה', draw: drawAquarium, live: aquariumLive, top: 18 };
