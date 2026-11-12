// מגדל השעון של הממלכה: day 30, @orthegoat's comment "תבנו תביג בן שבלונדון" (5 likes, the top comment on day 29's reel).
// A tall clock tower in the spirit of the famous one in London, the kingdom's own: a cream stone shaft with vertical ribs and
// pointed windows, four big clock faces with gold rims (the hands are live and stand at midnight, the hour the crown went
// missing in episode 1 of season 1), an open belfry with the bell, a navy spire with gold pinnacles and a gold tip. Round it a
// small park: a fountain, benches, lamps, flower beds, trees and people. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const STONE = 0xefe3c8, STONE2 = 0xdccca8, STONE3 = 0xc9b791, NAVY = 0x13213b, GOLD = 0xe8b323, GOLD2 = 0xc9971a, GLASS = 0x3f5f7e,
  DIAL = 0xfbf7ea, PAVE = 0xe6dcc6, PAVE2 = 0xd4c7aa, GRASS = 0x86c766, WOOD = 0x6b4428, DARK = 0x2b2f36, SKIN = 0xe2b48f,
  RED = 0xc8443a, TEAL = 0x0f6f73, PINK = 0xf3a6b8, WHITE = 0xf7f5ee, WATER = 0x5fb8de;
const W = 9, CY = 31, BY = 38;                                                   // the shaft's width, the clocks' centre, the belfry's floor

function person(p, x, z, r, shirt) {
  p.at(x, z, r, .32);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}

export function drawClockTower(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 59, .2, GRASS);
  // the park: a paved square round the tower, the path from the gate, paving lines
  p.box(0, .2, 0, 30, .12, 30, PAVE); p.box(0, .2, 21, 7, .12, 12, PAVE);
  for (let k = 0; k < 6; k++) { p.box(-12.5 + k * 5, .33, 0, .2, .02, 30, PAVE2); p.box(0, .33, -12.5 + k * 5, 30, .02, .2, PAVE2); }
  // the base: a wider plinth with a door and steps
  p.box(0, .2, 0, W + 3, 2.2, W + 3, STONE3); p.box(0, 2.4, 0, W + 1.6, 7, W + 1.6, STONE);
  p.box(0, 2.4, W / 2 + .85, 3, 4.6, .2, WOOD); p.box(0, 7, W / 2 + .85, 2, .8, .2, WOOD); p.box(0, 7.8, W / 2 + .85, 1, .5, .2, WOOD);
  p.box(.8, 4.4, W / 2 + .97, .2, .2, .1, GOLD);
  for (let k = 0; k < 3; k++) p.box(0, .2 + k * .4, W / 2 + 2.2 + k * -.5 + 1.2, 5 - k * .6, .4 + k * .4, 1, STONE2);
  p.box(0, 9.4, 0, W + 2.2, .6, W + 2.2, STONE2);
  // the shaft: ribs on the corners and between, rows of pointed windows on every side
  p.box(0, 10, 0, W, 17, W, STONE);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(sx * (W / 2), 10, sz * (W / 2), 1.2, 17.6, 1.2, STONE2);
  for (let side = 0; side < 4; side++) { const a = side * Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
    for (const off of [-2.2, 0, 2.2]) { p.box(c * off + s * (W / 2 + .05), 10, -s * off + c * (W / 2 + .05), .35, 17, .35, STONE2, a);
      for (const y of [12, 16.5, 21]) { p.box(c * (off + 1.1) + s * (W / 2 + .1), y, -s * (off + 1.1) + c * (W / 2 + .1), .9, 2.6, .2, GLASS, a);
        p.box(c * (off + 1.1) + s * (W / 2 + .1), y + 2.6, -s * (off + 1.1) + c * (W / 2 + .1), .5, .5, .2, GLASS, a); } }
    p.box(s * (W / 2 + .1), 25.4, c * (W / 2 + .1), W + .4, .6, .4, GOLD2, a); }
  // the clock stage: a wider block with a clock face on each side (dials here, hands and numbers live)
  p.box(0, 26, 0, W + 1.4, 10.4, W + 1.4, STONE);
  for (let side = 0; side < 4; side++) { const a = side * Math.PI / 2, s = Math.sin(a), c = Math.cos(a), o = W / 2 + .75;
    p.box(s * o, CY - 4.2, c * o, 8.4, 8.4, .2, GOLD, a); p.box(s * (o + .08), CY - 3.85, c * (o + .08), 7.7, 7.7, .2, DIAL, a);
    for (const [dx, dy] of [[-4.3, -4.4], [4.3, -4.4], [-4.3, 4.2], [4.3, 4.2]]) p.box(s * (o + .1) + c * dx, CY + dy, c * (o + .1) - s * dx, .6, .6, .3, GOLD2, a); }
  p.box(0, 36.4, 0, W + 2, .6, W + 2, GOLD2); p.box(0, 37, 0, W + 1.6, 1, W + 1.6, STONE2);
  // the belfry: open arches on four pillars, the bell inside
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(sx * (W / 2 - .2), BY, sz * (W / 2 - .2), 1.8, 6, 1.8, STONE);
  for (let side = 0; side < 4; side++) { const a = side * Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
    p.box(s * (W / 2 - .2), BY + 4.4, c * (W / 2 - .2), W - 1, 1.6, .8, STONE, a); p.box(s * (W / 2 - .2), BY + 3.7, c * (W / 2 - .2), W - 3, .7, .8, STONE, a); }
  p.box(0, BY, 0, W - 1, .4, W - 1, STONE3);
  p.cyl(0, BY + 1.2, 0, 3.4, 2.6, GOLD2, 12); p.cone(0, BY + 3.8, 0, 2.4, 1, GOLD2, 12); p.ball(0, BY + .9, 0, .7, .7, DARK);   // the bell
  p.box(0, BY + 6, 0, W + .6, .8, W + .6, GOLD2);
  // the spire: a navy roof in steps, gold pinnacles on the corners, small dormers, the gold tip
  p.box(0, BY + 6.8, 0, W - .4, 3, W - .4, NAVY); p.box(0, BY + 9.8, 0, W - 2.2, 3, W - 2.2, NAVY); p.box(0, BY + 12.8, 0, W - 4.2, 3, W - 4.2, NAVY);
  p.cone(0, BY + 15.8, 0, 3, 6, NAVY, 4); p.cyl(0, BY + 21.6, 0, .25, 2.6, GOLD); p.ball(0, BY + 24, 0, .9, .9, GOLD);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { p.box(sx * (W / 2 - .2), BY + 6.8, sz * (W / 2 - .2), 1, 2.4, 1, GOLD); p.cone(sx * (W / 2 - .2), BY + 9.2, sz * (W / 2 - .2), 1.1, 2.4, GOLD, 4); }
  for (let side = 0; side < 4; side++) { const a = side * Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
    p.box(s * (W / 2 - 1.2), BY + 10, c * (W / 2 - 1.2), 1.4, 1.6, .6, GOLD, a); p.box(s * (W / 2 - 1), BY + 10.3, c * (W / 2 - 1), .7, .9, .3, GLASS, a); }
  // the little park: a fountain, flower beds, benches, lamps, trees, people looking up at the clock
  p.cyl(-11, .2, 9, 5, .8, STONE2, 12); p.cyl(-11, .9, 9, 4.2, .2, WATER, 12); p.cyl(-11, .2, 9, .7, 3, STONE3); p.ball(-11, 3.1, 9, 1.2, .6, WATER);
  for (const [x, z] of [[11, 9], [-11, -9], [11, -9]]) { p.box(x, .2, z, 5, .6, 3, 0x6d4a2e); for (let k = 0; k < 5; k++) p.ball(x - 2 + k, .7, z + (k % 2 ? .5 : -.5), .9, .9, [PINK, GOLD, WHITE, RED, PINK][k]); }
  for (const s of [-1, 1]) { p.box(s * 8, .6, 13.5, 3.4, .25, 1, WOOD); p.box(s * 8, .2, 13.5, .3, .45, .8, DARK); p.box(s * 8, .85, 13.95, 3.4, .7, .15, WOOD); }
  for (const [x, z] of [[-5, 16], [5, 16], [-14, 14], [14, 14], [-14, -14], [14, -14]]) { p.cyl(x, .2, z, .25, 4.4, NAVY); p.ball(x, 4.4, z, .9, .9, 0xfff3c4); }
  for (const [x, z, s] of [[-22, 14, 1], [22, 14, 1.1], [-21, -16, 1], [21, -16, 1], [0, -24, .9], [-13, -22, .8], [13, -22, .9], [-24, 0, .8], [24, 0, .9]]) p.tree(x, z, s, 0x4f9a43);
  [[-3, 12, Math.PI, TEAL], [-2, 12.6, Math.PI, NAVY], [3.4, 11.4, Math.PI, RED], [4.3, 11.9, Math.PI, WHITE], [-9, 13, 0, GOLD],
   [9.5, 4, -Math.PI / 2, PINK], [-8.5, -2, Math.PI / 2, NAVY], [0, 19, Math.PI, WHITE], [1.2, 19.6, Math.PI, RED]].forEach(([x, z, r, c]) => person(p, x, z, r, c));
  // the gate: two stone pillars with gold tops and a beam (its signs are live)
  for (const x of [-6.6, 6.6]) { p.box(x, .2, 27, 1.6, 6.4, 1.6, STONE2); p.ball(x, 6.6, 27, 1.4, 1.4, GOLD); }
  p.box(0, 4.6, 27, 15.2, 2, .8, NAVY); p.box(0, 6.6, 27, 15.6, .3, 1, GOLD);
}

export function clockTowerLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מגדל השעון של הממלכה 🕰️', { w: 11.2, h: 1.5, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 4.85, 27.42));
  group.add(sign('רעיון של @orthegoat · אדריכל', { w: 8.6, h: .9, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.55, 27.42));
  // the hands and the hour marks on the four faces; the hands stand at midnight (both up), the hour the crown went missing
  const hands = [], dark = new THREE.MeshLambertMaterial({ color: 0x13213b }), goldM = new THREE.MeshLambertMaterial({ color: GOLD });
  for (let side = 0; side < 4; side++) {
    const face = new THREE.Group(), a = side * Math.PI / 2, o = W / 2 + 1.0; face.position.set(Math.sin(a) * o, CY, Math.cos(a) * o); face.rotation.y = a; group.add(face);
    for (let h = 0; h < 12; h++) { const m = new THREE.Mesh(new THREE.BoxGeometry(h % 3 ? .25 : .45, h % 3 ? .8 : 1.2, .1), dark), q = h / 12 * Math.PI * 2;
      m.position.set(Math.sin(q) * 3.2, Math.cos(q) * 3.2, 0); m.rotation.z = -q; face.add(m); }
    const hour = new THREE.Group(), min = new THREE.Group();
    { const m = new THREE.Mesh(new THREE.BoxGeometry(.4, 2.2, .12), dark); m.position.y = 1.1; hour.add(m); }
    { const m = new THREE.Mesh(new THREE.BoxGeometry(.25, 3.1, .12), dark); m.position.y = 1.55; min.add(m); }
    hour.position.z = .08; min.position.z = .16; face.add(hour, min);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .3, 12), goldM); pin.rotation.x = Math.PI / 2; pin.position.z = .2; face.add(pin);
    hands.push([hour, min]);
  }
  // the bell swings a little, the hands hold at midnight
  group.userData.tick = t => { const m = 0; hands.forEach(([h, mm]) => { mm.rotation.z = -m; h.rotation.z = -m / 12; }); };
  group.userData.tick(0);
}

export const CLOCKTOWER = { key: 'clock-tower', name: 'מגדל השעון של הממלכה', draw: drawClockTower, live: clockTowerLive, top: 64 };
