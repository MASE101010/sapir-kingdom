// ספיר הוטל: day 23, @ofek_bell's comment "אולי הפעם תצרו את בית המלון ספיר הוטל" (2 likes, the first place asked for on day 22's
// reel). A cream hotel tower, 11 storeys, with teal balconies, a glass lift running up its front, a gold crown and the hotel's
// name on top, and a flat roof (the dragon checks in up there). At its foot the lobby: a gold canopy, a red carpet, a revolving
// door, a doorman, guests with suitcases and a luggage trolley. In front: the pool with loungers and umbrellas, a fountain,
// palms, a car at the drop-off, the gate with the stars. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const CREAM = 0xf6eedd, CREAM2 = 0xe9dcc2, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc8443a, WHITE = 0xf7f5ee,
  GLASS = 0x8fc3d9, GLASS2 = 0x6aa6c4, PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, WATER = 0x4cc3e0, WOOD = 0x8a6240, METAL = 0x9aa3ab,
  DARK = 0x2b2f36, SKIN = 0xe2b48f, GRASS = 0x86c766, CORAL = 0xf08a6c;
const TX = 0, TZ = -13, TW = 24, TD = 12, FL = 11, FH = 3;                  // the tower: centre x, z, width, depth, storeys, storey height
export const HOTEL_ROOF = .2 + FL * FH;                                       // the roof's height (the dragon's perch)

/** a person standing: legs, a shirt, a head, hair */
function guest(p, x, z, r, shirt, y = .32) {
  p.at(x, z, r, y);
  p.box(-.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(.22, 0, 0, .35, 1, .4, 0x2a3550); p.box(0, 1, 0, 1, 1.2, .6, shirt);
  p.box(0, 2.2, 0, .7, .7, .7, SKIN); p.box(0, 2.8, 0, .74, .2, .74, 0x4a3020);
  p.at(0, 0, 0);
}
/** a suitcase on wheels with its handle up */
function suitcase(p, x, z, c) { p.box(x, .32, z, .9, 1.2, .5, c); p.box(x, 1.52, z, .08, .6, .08, METAL); p.box(x, 2.1, z, .5, .08, .08, METAL); }

export function drawHotel(p) {
  p.at(0, 0, 0);
  // the ground: the lawn, the paved forecourt, the red carpet from the gate to the door
  p.cyl(0, 0, 0, 59, .2, GRASS); p.box(0, .2, 6, 44, .12, 34, PAVE);
  for (let i = -5; i <= 5; i++) p.box(i * 4, .33, 6, .12, .02, 34, PAVE2);
  p.box(0, .34, 11, 3.2, .05, 22, RED); p.box(-1.7, .34, 11, .2, .07, 22, GOLD); p.box(1.7, .34, 11, .2, .07, 22, GOLD);

  // the tower: a plinth, the cream body, a band at every storey, windows and balconies front and back, windows on the sides
  p.box(TX, .2, TZ, TW + 1.6, .6, TD + 1.6, CREAM2);
  p.box(TX, .2, TZ, TW, FL * FH, TD, CREAM);
  const front = TZ + TD / 2, back = TZ - TD / 2;
  for (let f = 1; f < FL; f++) { const y = .2 + f * FH;
    p.box(TX, y - .15, TZ, TW + .3, .3, TD + .3, CREAM2);
    for (let k = 0; k < 6; k++) { const x = TX - TW / 2 + 2 + k * 4;
      p.box(x, y + .5, front + .02, 2.2, 1.9, .12, GLASS); p.box(x, y + .5, back - .02, 2.2, 1.9, .12, GLASS2);
      if (f === FL - 1 && Math.abs(x - TX) < 9) continue;                       // the top floor's middle carries the hotel's name
      if ((k + f) % 2 === 0) { p.box(x, y, front + .8, 3, .25, 1.6, TEAL); p.box(x, y + .25, front + 1.55, 3, .9, .1, WHITE); }
      else p.box(x, y + 2.45, front + .25, 2.6, .2, .5, TEAL); }
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) p.box(TX + s * (TW / 2 + .02), y + .5, TZ - 3.6 + k * 3.6, .12, 1.9, 2, GLASS); }
  // the glass lift up the front, in the middle (its cabin rides up and down, live)
  p.box(TX, .8, front + .5, 3.4, FL * FH - .4, .9, GLASS2); p.box(TX - 1.8, .8, front + .9, .2, FL * FH - .4, .2, GOLD); p.box(TX + 1.8, .8, front + .9, .2, FL * FH - .4, .2, GOLD);
  // the roof: a parapet, a teal cornice, the rooftop pool at the back left, the stairs hut, the crown on a plinth on the front
  const R = HOTEL_ROOF;
  p.box(TX, R, TZ, TW + .8, .5, TD + .8, TEAL);
  for (const [x, z, w, d] of [[TX, front, TW, .4], [TX, back, TW, .4], [TX - TW / 2, TZ, .4, TD], [TX + TW / 2, TZ, .4, TD]]) p.box(x, R + .5, z, w, 1, d, CREAM);
  p.box(TX - 7.5, R + .5, TZ - 3, 7, .4, 4, WHITE); p.box(TX - 7.5, R + .6, TZ - 3, 6.2, .32, 3.2, WATER);
  p.box(TX + 8.5, R + .5, TZ - 3.5, 3.4, 2.6, 3, CREAM2); p.box(TX + 8.5, R + 3.1, TZ - 3.5, 3.8, .3, 3.4, RED);
  p.box(TX, R + .5, front - 1, 9, 1.2, 1.4, NAVY);
  for (let k = 0; k < 5; k++) p.cone(TX - 3.2 + k * 1.6, R + 1.7, front - 1, 1, k === 2 ? 2.6 : 1.8, GOLD);
  p.box(TX, R + 1.7, front - 1, 8, .6, .9, GOLD); for (let k = 0; k < 5; k++) p.ball(TX - 3.2 + k * 1.6, R + (k === 2 ? 4.3 : 3.5), front - 1, .6, .6, RED);
  // the flag pole on the stairs hut (the cloth waves, live)
  p.cyl(TX + 8.5, R + 3.4, TZ - 3.5, .25, 5, METAL);

  // two low wings either side of the tower, with red roofs and arched windows
  for (const s of [-1, 1]) { const x = s * 17.5;
    p.box(x, .2, TZ + 1, 11, 7, 10, CREAM); p.gable(x, 7.2, TZ + 1, 11.6, 2.6, 10.6, RED);
    for (let k = 0; k < 3; k++) { const wx = x - 3.6 + k * 3.6;
      p.box(wx, 1.6, TZ + 6.02, 1.8, 2.4, .12, GLASS); p.cyl(wx, 4, TZ + 6.02, 1.8, .12, GLASS);
      p.box(wx, 4.7, TZ + 6.08, 2.2, .2, .2, TEAL); } }

  // the lobby at the foot of the tower: a glass front, the gold canopy on four posts, the revolving door (turns, live)
  p.box(TX, .2, front + 2.2, 16, 5, 4.4, CREAM2); p.box(TX, .8, front + 4.42, 14, 3.6, .1, GLASS);
  p.box(TX, 5.2, front + 6.4, 12, .4, 6, GOLD); p.box(TX, 5.6, front + 6.4, 12.4, .25, 6.4, NAVY);
  for (const [x, z] of [[-5.6, front + 9.2], [5.6, front + 9.2], [-5.6, front + 4.6], [5.6, front + 4.6]]) p.cyl(x, .2, z, .4, 5, GOLD);
  p.cyl(TX, .3, front + 4.6, 3.4, .2, METAL); p.cyl(TX, 3.6, front + 4.6, 3.6, .3, GOLD);
  // the doorman by the door, with his cap, and the reception bell on a stand
  guest(p, 2.6, front + 7.6, 0, NAVY); p.box(2.6, 3.1, front + 7.6, .9, .25, .9, RED); p.box(2.6, 3.32, front + 7.6, .5, .1, .5, GOLD);
  p.cyl(-2.8, .3, front + 7.2, .3, 1.2, WOOD); p.cyl(-2.8, 1.5, front + 7.2, .9, .12, GOLD); p.ball(-2.8, 1.6, front + 7.2, .7, .5, GOLD);
  // guests with their suitcases on the carpet, the luggage trolley with a pile of bags
  [[-1, front + 11, .2, CORAL], [1.1, front + 13, -.3, TEAL], [-.6, front + 16, .1, GOLD]].forEach(([x, z, r, c], k) => { guest(p, x, z, Math.PI + r, c); suitcase(p, x + .9, z - .2, [RED, NAVY, TEAL][k]); });
  p.box(5, .6, front + 12, 2.6, .2, 1.6, GOLD); for (const x of [3.8, 6.2]) p.box(x, .6, front + 12, .15, 3.2, .15, GOLD); p.box(5, 3.7, front + 12, 2.6, .15, .15, GOLD);
  for (const [dx, dz] of [[3.8, 11.2], [6.2, 11.2], [3.8, 12.8], [6.2, 12.8]]) p.cyl(dx, .2, front + dz, .5, .4, DARK);
  p.box(4.6, .8, front + 12, 1.2, 1.4, 1, RED); p.box(5.6, .8, front + 12, .9, 1, .9, TEAL); p.box(5, 2.2, front + 12, 1.4, .8, .9, NAVY);

  // the pool at the front left: white edge, water, the ladder, loungers and umbrellas, a swimmer's ring
  const PX = -14, PZ = 9;
  p.box(PX, .2, PZ, 13, .5, 9, WHITE); p.box(PX, .3, PZ, 11.6, .45, 7.6, WATER);
  for (const dz of [-.4, .4]) p.box(PX + 5.6, .6, PZ - 3 + dz, .1, 1.4, .1, METAL);
  p.cyl(PX - 2, .74, PZ + 1, 1.4, .3, CORAL); p.cyl(PX - 2, .78, PZ + 1, .7, .3, WATER);
  for (let k = 0; k < 4; k++) { const x = PX - 5 + k * 3.2, z = PZ + 6.2;
    p.box(x, .4, z, 1, .3, 2.4, WHITE); p.box(x, .7, z - 1, 1, .8, .3, WHITE, 0);
    if (k % 2 === 0) { p.cyl(x + 1.6, .4, z, .15, 3.4, METAL); p.cone(x + 1.6, 3.4, z, 3.4, 1, k ? TEAL : CORAL); } }
  guest(p, PX + 6.8, PZ + 6.4, -Math.PI / 2, CORAL);

  // the fountain at the front right: three bowls and a gold crown on top (its water sparkles, live)
  const FX = 14, FZ = 9;
  p.cyl(FX, .2, FZ, 9, .8, CREAM2); p.cyl(FX, .5, FZ, 8, .5, WATER); p.cyl(FX, .9, FZ, 1, 3, CREAM); p.cyl(FX, 3.6, FZ, 4, .4, CREAM2);
  p.cyl(FX, 3.8, FZ, 3.4, .3, WATER); p.cyl(FX, 4, FZ, .6, 1.6, CREAM); p.cyl(FX, 5.4, FZ, 2, .3, CREAM2); p.cone(FX, 5.7, FZ, 1, 1, GOLD);

  // the drop-off: a little car by the kerb (no brand), a cone or two
  p.at(9.5, front + 13.5, 0, .32);
  p.box(0, .5, 0, 2.2, 1.2, 4.6, 0xf2c418); p.box(0, 1.7, -.2, 2, 1, 2.6, 0xf2c418); p.box(0, 1.8, -.2, 2.04, .8, 2.3, GLASS);
  for (const [x, z] of [[-1.1, 1.5], [1.1, 1.5], [-1.1, -1.5], [1.1, -1.5]]) p.box(x, 0, z, .3, .9, .9, DARK);
  p.at(0, 0, 0);
  for (const [x, z] of [[7.4, front + 17], [11.6, front + 17]]) p.cone(x, .32, z, .6, 1, CORAL);

  // the gate: two cream pillars with gold balls, a navy beam with the stars (its signs are live)
  for (const x of [-8, 8]) { p.box(x, .2, 26, 1.8, 7, 1.8, CREAM); p.box(x, 7.2, 26, 2.2, .4, 2.2, TEAL); p.ball(x, 7.6, 26, 1.4, 1.4, GOLD); }
  p.box(0, 5, 26, 14.4, 2.2, .9, NAVY); p.box(0, 7.2, 26, 14.8, .3, 1.1, GOLD);
  // lamps, palms and trees
  for (const [x, z] of [[-4, 22], [4, 22], [-20, 18], [20, 18], [-21, -1], [21, -1]]) { p.cyl(x, .2, z, .25, 4.6, NAVY); p.ball(x, 4.6, z, .9, .9, 0xfff3c4); }
  for (const [x, z] of [[-7, 18], [7, 20], [-23, 9], [23, 10], [-10, 2.5], [10, 2.5]]) { p.cyl(x, .2, z, .55, 6.5, WOOD);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; p.box(x + Math.sin(a) * 1.4, 6.4, z + Math.cos(a) * 1.4, 1, .25, 3.2, 0x4f9a43, a); } }
  for (const [x, z, s] of [[-24, -14, 1], [24, -15, 1.1], [-12, -24, .9], [12, -24, 1], [0, -26, .8]]) p.tree(x, z, s, 0x4f9a43);
}

export function hotelLive(group) {
  const big = '900 {px}px "Secular One", Rubik', front = TZ + TD / 2;
  group.add(sign('ספיר הוטל 🏨', { w: 16, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(TX, HOTEL_ROOF - 2.5, front + 1.1));
  group.add(sign('ספיר הוטל ⭐⭐⭐⭐⭐', { w: 13.6, h: 1.8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 5.2, 26.47));
  group.add(sign('רעיון של @ofek_bell · אדריכל', { w: 9, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.7, 26.47));
  group.add(sign('קבלה 🛎️', { w: 4.6, h: 1, bg: '#f6eedd', fg: '#13213b', border: '#e8b323', font: big }).at(0, 4.3, front + 4.5));
  group.add(sign('הלילה הראשון על חשבון המלך 👑', { w: 10.4, h: 1, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }).at(0, 5.9, front + 9.62));
  group.add(sign('חדרים פנויים: לכל תושב 🗝️', { w: 8.6, h: 1, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323' }).at(-17.5, 5.6, TZ + 6.1));
  group.add(sign('בריכה 🏊', { w: 4, h: 1, bg: '#ffffff', fg: '#0f6f73', border: '#0f6f73', font: big }).at(-14, 2.2, 13.6));
  // the lift's cabin riding up and down the glass shaft, the revolving door, the flag on the roof, the fountain's spray
  const m = c => new THREE.MeshLambertMaterial({ color: c });
  const cab = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 1), m(GOLD)); cab.position.set(TX, 2, front + 1.05); group.add(cab);
  const door = new THREE.Group(); door.position.set(TX, .5, front + 4.6); group.add(door);
  for (let k = 0; k < 4; k++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.1, .08), new THREE.MeshLambertMaterial({ color: GLASS, transparent: true, opacity: .7 }));
    w.position.set(Math.sin(k * Math.PI / 2) * .8, 1.55, Math.cos(k * Math.PI / 2) * .8); w.rotation.y = k * Math.PI / 2 + Math.PI / 2; door.add(w); }
  const flag = new THREE.Group(); flag.position.set(TX + 8.5, HOTEL_ROOF + 8.2, TZ - 3.5); group.add(flag);
  for (const [x, c] of [[.7, NAVY], [1.9, GOLD], [3.1, NAVY]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, .08), m(c)); b.position.set(x, -1, 0); flag.add(b); }
  const spray = []; for (let k = 0; k < 10; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.22, 6, 4), new THREE.MeshLambertMaterial({ color: 0xd9f4ff, transparent: true, opacity: .85 })); group.add(s); spray.push(s); }
  group.userData.tick = t => {
    const u = (Math.sin(t * .45) + 1) / 2; cab.position.y = 2 + u * (HOTEL_ROOF - 9);
    door.rotation.y = t * .8; flag.rotation.y = .4 * Math.sin(t * 1.1);
    spray.forEach((s, k) => { const a = k / 10 * Math.PI * 2, q = ((t * .9 + k / 10) % 1); s.position.set(14 + Math.sin(a) * q * 3.4, 6.8 + q * 2.4 - q * q * 5.4, 9 + Math.cos(a) * q * 3.4); });
  };
  group.userData.tick(0);
}

export const HOTEL = { key: 'hotel', name: 'ספיר הוטל', draw: drawHotel, live: hotelLive, top: 40 };
