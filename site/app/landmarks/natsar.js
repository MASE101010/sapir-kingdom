// נמל התעופה ספיר, נתס"ר: day 9 (@avia_ben._.shabat asked for "נתב״ג ספיר"; Michael named it נתס"ר). A runway along the back of
// the lot with its stripes and lights, a terminal with a glass front and a wavy roof, a control tower with its glass cab,
// two planes at the gates with their jet bridges, a third that takes off (tick: on a loop on the site, on cue in a reel),
// a drop-off with cars, travellers with suitcases, pilots in caps, a windsock. The planes wear the kingdom's colours.
// No real airline or airport marks. Lot radius 26, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xfbf3e2, WHITE = 0xf7f7f2, GLASS = 0x8fc3d8, GLASS2 = 0xb7dbe8,
  ASPH = 0x55595e, LINE = 0xf2f2f2, GRASS = 0x86c766, DARK = 0x3a3f45, SKIN = 0xe2b48f, RED = 0xc8102e, METAL = 0xb9c1c8, CONC = 0xcfc8bb;
const SHIRTS = [RED, TEAL, 0x3b6fb6, GOLD, 0x7a4f9a, 0x1f8a4c, 0xf29bb7];

/** a plane ~15 m long pointing +z (nose at +z): fuselage, nose, windows, wings, engines, tail; livery in the kingdom's colours */
export function plane(p, x, y, z, rot = 0, s = 1, belly = NAVY) {
  p.at(x, z, rot, y);
  p.box(0, 1.2 * s, 0, 2.4 * s, 2.4 * s, 13 * s, WHITE); p.box(0, 1.2 * s, 0, 2.45 * s, .7 * s, 13.05 * s, belly);
  p.ball(0, 1.2 * s, 6.5 * s, 2.4 * s, 2.4 * s, WHITE); p.box(0, 2.35 * s, 6.6 * s, 1.4 * s, .45 * s, .8 * s, 0x2b3d55);
  p.box(0, 1.6 * s, -7.6 * s, 1.4 * s, 1.6 * s, 2.4 * s, WHITE);
  for (let k = 0; k < 9; k++) for (const sd of [-1, 1]) p.box(sd * 1.23 * s, 2 * s, (-4.6 + k * 1.15) * s, .05, .4 * s, .5 * s, 0x2b3d55);
  p.box(0, .9 * s, .6 * s, 13.5 * s, .3 * s, 2.6 * s, WHITE); for (const sd of [-1, 1]) p.box(sd * 6.6 * s, .9 * s, .2 * s, .5 * s, .32 * s, 2 * s, GOLD);
  for (const sd of [-1, 1]) { p.cyl(sd * 3.4 * s, .1 * s, 1.4 * s, 1.1 * s, .3 * s, METAL); p.box(sd * 3.4 * s, .1 * s, 1.4 * s, 1.1 * s, .9 * s, 2.2 * s, METAL); }
  p.box(0, 2.4 * s, -7.4 * s, .3 * s, 3 * s, 2.2 * s, TEAL); p.box(0, 4.4 * s, -7.6 * s, .32 * s, .6 * s, 1.6 * s, GOLD);
  p.box(0, 2.6 * s, -7.6 * s, 5 * s, .25 * s, 1.4 * s, WHITE);
  for (const [gx, gz] of [[0, 5.2], [-1.6, .6], [1.6, .6]]) p.box(gx * s, 0, gz * s, .4 * s, .5 * s, .4 * s, DARK);
  p.at(0, 0, 0);
}
function person(p, x, z, rot, shirt, cap = false, bag = false) {
  p.at(x, z, rot); p.box(-.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(0, 1.4, 0, 1.2, 1.4, .8, shirt);
  p.box(0, 2.8, 0, .9, .9, .9, SKIN); p.box(0, 3.6, 0, .95, cap ? .35 : .25, .95, cap ? NAVY : 0x4a3020); if (cap) p.box(0, 3.6, .55, .9, .12, .4, NAVY);
  if (bag) { p.box(1, 0, -.2, .7, 1.1, .5, [RED, TEAL, GOLD][Math.abs(Math.round(x + z)) % 3]); p.box(1, 1.1, -.2, .1, .5, .1, DARK); }
  p.at(0, 0, 0);
}
export function drawNatsar(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 52, .08, 52, GRASS);
  // the runway along the back, with its edge lights, centre dashes, threshold stripes and a taxiway to the apron
  p.box(0, .08, -17, 52, .1, 9, ASPH);
  for (let x = -22; x <= 22; x += 4.5) p.box(x, .2, -17, 2.4, .02, .35, LINE);
  for (const sx of [-1, 1]) for (let k = 0; k < 6; k++) p.box(sx * 24, .2, -20.4 + k * 1.35, 2, .02, .6, LINE);
  for (let x = -25; x <= 25; x += 3) for (const z of [-21.7, -12.3]) p.box(x, .18, z, .35, .3, .35, (x / 3) % 2 ? 0xfff3b0 : 0x7fd0ff);
  p.box(-4, .08, -9, 6, .1, 7, ASPH); p.box(0, .08, -3, 40, .1, 7, CONC);
  // the apron: two planes at the gates, nose to the terminal, with their jet bridges
  for (const x of [-12, 9]) { plane(p, x, .18, -5.5, 0, .85, x < 0 ? NAVY : TEAL);
    p.box(x + 2.6, 3, -.6, 2, 2, 5, CREAM); p.box(x + 2.6, .1, -2.2, .4, 3, .4, METAL); }
  // the terminal: cream walls, a long glass front toward the castle, a wavy roof in teal, the gates' glass at the back
  p.box(0, .1, 6, 36, 7, 9, CREAM); p.box(0, .5, 10.55, 33, 5.6, .15, GLASS); for (let x = -16; x <= 16; x += 2.75) p.box(x, .5, 10.65, .3, 5.8, .3, WHITE);
  p.box(0, .5, 1.45, 33, 5, .15, GLASS2);
  for (let k = 0; k < 12; k++) { const x = -16.5 + k * 3, h = 7.1 + Math.sin(k * .9) * .9; p.box(x, h, 6, 3.2, .7, 10, k % 2 ? TEAL : 0x14807f); }
  p.box(0, .1, 12.6, 8, .3, 3.4, CONC); p.box(0, 4.8, 12.4, 10, .4, 4.2, GOLD); for (const x of [-4.6, 4.6]) p.box(x, .1, 14.2, .35, 4.7, .35, GOLD);
  // the control tower beside the terminal: a shaft, a gallery, the glass cab, its roof and antennas
  p.cyl(21, .1, 6, 3.4, 19, CREAM); for (let k = 0; k < 6; k++) p.box(21, 2 + k * 3, 7.6, .9, 1.2, .2, GLASS);
  p.cyl(21, 19, 6, 5.6, 1, WHITE); p.cyl(21, 20, 6, 6, 3.4, GLASS); p.cyl(21, 23.4, 6, 6.6, .6, NAVY); p.cone(21, 24, 6, 5.4, 1.4, TEAL);
  p.box(21, 25.4, 6, .2, 3, .2, METAL); p.ball(21, 28.4, 6, .5, .5, RED); p.box(22.4, 25, 6, .1, 1.6, .1, METAL);
  // the windsock by the runway
  p.box(-23, 0, -10.5, .2, 5.5, .2, METAL); for (let k = 0; k < 4; k++) p.box(-23 + .4 + k * .7, 5.1 - k * .12, -10.5, .7, .7 - k * .1, .7 - k * .1, k % 2 ? WHITE : 0xf28c28);
  // the drop-off in front: a road, cars, travellers with suitcases, pilots in caps, palms, a flag
  p.box(0, .08, 18.5, 46, .1, 6, ASPH); for (let x = -20; x <= 20; x += 5) p.box(x, .2, 18.5, 2.4, .02, .3, LINE);
  for (const [x, c] of [[-14, RED], [-6, WHITE], [12, GOLD]]) { p.at(x, 19.5, Math.PI / 2); p.box(0, .4, 0, 2.6, 1.3, 4.6, c); p.box(0, 1.7, -.3, 2.3, 1, 2.6, c); p.box(0, 1.8, 1.02, 2.1, .8, .05, GLASS2);
    for (const [dx, dz] of [[-1.3, 1.5], [1.3, 1.5], [-1.3, -1.5], [1.3, -1.5]]) p.cyl(dx, 0, dz, .9, .5, DARK); p.at(0, 0, 0); }
  [[-9, 14.5, Math.PI], [-3, 15.4, .2], [4, 14.6, Math.PI + .3], [7.5, 15.2, Math.PI], [-16, 15, .5]].forEach(([x, z, r], k) => person(p, x, z, r, SHIRTS[k], false, true));
  [[1, 14.2, Math.PI], [2.4, 14.6, Math.PI]].forEach(([x, z, r]) => person(p, x, z, r, WHITE, true));
  for (const x of [-22, 16, 24]) { p.cyl(x, 0, 23.5, .7, 7, 0x8a6a46); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; p.box(x + Math.cos(a) * 1.5, 7, 23.5 + Math.sin(a) * 1.5, 3.2, .3, 1, 0x3f8f3a, -a); } }
  p.box(-19, 0, 13, .2, 8, .2, METAL); p.box(-18.1, 6.6, 13, 1.6, 1.1, .08, NAVY); p.box(-18.1, 6.6, 13.05, 1.6, .35, .08, GOLD);
}
const PERIOD = 30;
/** the plane that takes off: waiting at the runway's west end, then the roll, the lift, the climb out over the kingdom */
function flight(p) {
  if (p < 0) return { x: -21, y: .18, pitch: 0, show: true };
  if (p < 5) { const x = -21 + 1.6 * p * p, lift = Math.max(0, p - 3.4); return { x, y: .18 + 3.2 * lift * lift, pitch: Math.min(.22, lift * .2), show: true }; }
  if (p < 14) { const q = p - 5, y0 = .18 + 3.2 * 1.6 * 1.6; return { x: 19 + 16 * q, y: y0 + 9 * q, pitch: .3, show: true }; }
  return { show: false };
}
export function natsarLive(group) {
  const pn = new Pen(); plane(pn, 0, 0, 0, 0, .9, GOLD); const g = pn.build(new THREE.Group());
  const holder = new THREE.Group(); holder.add(g); g.rotation.y = Math.PI / 2; group.add(holder); group.userData.plane = holder;
  group.add(sign('נמל התעופה ספיר · נתס"ר', { w: 12, h: 2, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 5.6, 14.6));
  group.add(sign('המראות ✈️ נחיתות', { w: 7, h: 1.2, bg: '#fffaf0', fg: '#13213b', border: '#0f6f73' }).at(-9, 3.6, 10.75));
  group.add(sign('דרושים טייסים! ✈️', { w: 6.6, h: 1.4, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(9, 3.6, 10.75));
  group.add(sign('נתס"ר', { w: 5, h: 1.3, bg: '#0f6f73', fg: '#ffffff', border: '#ffffff', both: true }).at(21, 21.7, 9.1));
  natsarTick(group, 0);
}
/** a reel cues the take-off (group.userData.cue, in tick's clock); on the site the plane takes off every PERIOD seconds */
export function natsarTick(group, t) {
  const h = group.userData.plane; if (!h) return;
  const cue = group.userData.cue, f = flight(cue != null ? t - cue : (t % PERIOD) - 6);
  h.visible = f.show; if (!f.show) return;
  h.position.set(f.x, f.y, -17); h.rotation.z = f.pitch;
}
export const NATSAR = { key: 'natsar', name: 'נמל התעופה ספיר', draw: drawNatsar, live: natsarLive, tick: natsarTick, top: 28 };
