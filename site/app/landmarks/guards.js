// תחנת השומרים של הממלכה: day 39. Day 38's winning comment (@ofek_bell: guards walking round the kingdom with
// flashlights, to catch the crown thief): in season 1 (גנב הכתר) the king builds a night watch station. Lot 38 (r 18,
// small): a little fort of cream stone with a red roof and battlements, a watch tower with a big searchlight, a gate
// with a striped barrier, a rack of lanterns, bicycles, a patrol cart, guards in navy with lanterns, benches and trees.
// Live: the signs, and the lights (the lanterns, the windows, the searchlight beam) that go dark at night (state 'night').
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, STONE = 0xe2d6bc, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, METAL = 0x9aa3ab;
const LANTERNS = [[-3.2, 12.6], [3.2, 12.6], [-9, 8.8], [9.4, 8.2], [-12.4, -1], [12.6, -2], [-6.4, 14.6], [6.6, 14.8]];

function guard(p, x, z, r, s = .3) {
  p.at(x, z, r, s);
  p.box(-.2, 0, 0, .32, .95, .36, DARK); p.box(.2, 0, 0, .32, .95, .36, DARK); p.box(0, .95, 0, .95, 1.15, .58, NAVY);
  p.box(0, 1.5, .3, .95, .12, .05, GOLD); p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .8, .3, .8, NAVY); p.box(0, 2.98, 0, .5, .14, .5, GOLD);
  p.box(.62, .9, .25, .14, .7, .14, DARK); p.box(.62, .55, .25, .36, .4, .36, GOLD);                                   // the lantern in hand
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawGuards(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 0, 24, .12, 20, PAVE); p.box(0, .2, 14, 5.4, .12, 8, PAVE);
  // the station: a stone block with a red roof, battlements round the roof edge, windows in white frames, a navy door
  p.box(-2, .3, -4, 14, 5.2, 8, STONE); p.box(-2, .3, -4, 14.4, .5, 8.4, 0xcbbd9f);
  p.box(-2, 5.5, -4, 14.6, .4, 8.6, RED); p.box(-2, 5.9, -4, 13, 1.4, 7, RED); p.box(-2, 7.3, -4, 9, 1, 5, 0xa83524);
  for (let k = 0; k < 8; k++) { p.box(-8.9 + k * 1.98, 5.9, .25, .9, .8, .5, STONE); }
  p.box(-2, .3, .02, 2.4, 3.4, .2, NAVY); p.box(-2, 3.7, .02, 2.8, .4, .25, GOLD); p.ball(-1.2, 1.9, .2, .2, .2, GOLD);
  for (const x of [-7.2, -4.6, .6, 3.2]) { p.box(x, 2, .02, 1.8, 1.6, .16, WHITE); p.box(x, 2.1, .08, 1.5, 1.4, .06, 0x3a4a60); p.box(x, 2.75, .12, 1.5, .1, .05, WHITE); }
  // the watch tower on the right with a searchlight on top
  p.box(7.6, .3, -5, 4, 10, 4, STONE); p.box(7.6, 10.3, -5, 4.6, .4, 4.6, NAVY);
  for (const [dx, dz] of [[-1.9, -1.9], [1.9, -1.9], [-1.9, 1.9], [1.9, 1.9]]) p.box(7.6 + dx, 10.7, -5 + dz, .5, .9, .5, STONE);
  p.cone(7.6, 11.8, -5, 5.2, 2.4, RED); p.cyl(7.6, 10.7, -5, .5, 1.1, DARK);
  p.box(7.6, 11.6, -4.1, 1.4, 1.2, 1.6, METAL); p.box(7.6, 11.6, -3.25, 1.2, 1, .1, 0xfff2c4);
  for (let k = 0; k < 3; k++) p.box(7.6, 2.4 + k * 2.6, -2.95, .9, 1.2, .1, 0x3a4a60);
  p.box(5.6, .3, -2.98, 1.2, 2.4, .1, NAVY);
  // the gate: two pillars, a striped barrier, a sentry box
  for (const s of [-1, 1]) { p.box(s * 2.9, .3, 17.6, .8, 3, .8, STONE); p.ball(s * 2.9, 3.6, 17.6, .7, .7, GOLD); }
  for (let k = 0; k < 6; k++) p.box(-2.2 + k * .8, 1.3, 17.6, .8, .3, .3, k % 2 ? WHITE : RED);
  p.box(5.4, .3, 15.6, 2, 3, 2, NAVY); p.box(5.4, 3.3, 15.6, 2.4, .3, 2.4, RED); p.box(5.4, 1.4, 16.62, 1.4, 1, .05, 0x3a4a60);
  // a rack of lanterns by the door, bicycles, a little patrol cart
  p.box(2.6, .3, 1.4, 3.2, 2.2, .3, WOOD); for (let k = 0; k < 5; k++) { p.box(1.4 + k * .6, 1.6, 1.62, .1, .5, .1, DARK); p.box(1.4 + k * .6, 1, 1.62, .4, .5, .4, GOLD); }
  for (const z of [3.6, 5]) { p.cyl(-8.6, .3, z, 1.2, .1, DARK); p.cyl(-6.8, .3, z, 1.2, .1, DARK); p.box(-7.7, .9, z, 1.8, .12, .12, RED); p.box(-7.2, 1.1, z, .1, .5, .1, DARK); }
  p.box(9.6, .5, 5, 2.4, 1.2, 3.6, WHITE); p.box(9.6, 1.7, 5.8, 2.2, .9, 1.6, NAVY); p.box(9.6, 2.6, 5, 2.6, .2, 3.4, RED);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.cyl(9.6 + sx * 1.25, .2, 5 + sz * 1.2, .9, .4, DARK);
  // lantern posts round the plaza (their lights are live), guards on patrol, benches, trees
  for (const [x, z] of LANTERNS) { p.cyl(x, .2, z, .26, 3.4, DARK); p.box(x, 3.6, z, .7, .1, .7, DARK); p.cone(x, 4.4, z, .9, .5, NAVY); }
  for (const [x, z, r] of [[-1.2, 5.6, 0], [1.6, 9.6, .4], [-5.6, 11, -.6], [6.8, 11.2, .8], [-11.2, 4, 1.3], [11.8, 1, -1.4], [2.9, 16.2, 0]]) guard(p, x, z, r);
  for (const [x, z, r] of [[-10.8, -8.6, Math.PI / 2], [12.4, -9.6, -Math.PI / 2]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3.2, .8, .2, WOOD, r); }
  for (const [x, z, s] of [[-14.6, -12, .9], [14.4, -13, 1], [-15, 10, .8], [15.2, 12.6, .7], [0, -14.6, .8]]) tree(p, x, z, s);
}

export function guardsLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('תחנת השומרים 🔦', { w: 6, h: 1.3, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(-2, 4.5, .6));
  group.add(sign('משמר הלילה 🌙', { w: 3.4, h: .8, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 2.6, 17.9));
  // the lights: a glowing lamp in every lantern, the windows, the searchlight's beam; at night (state 'night') they all go dark
  const glow = new THREE.MeshBasicMaterial({ color: 0xffe08a }), off = new THREE.Color(0x1a1f2b), on = new THREE.Color(0xffe08a);
  for (const [x, z] of LANTERNS) { const m = new THREE.Mesh(new THREE.BoxGeometry(.6, .7, .6), glow); m.position.set(x, 3.95, z); group.add(m); }
  for (const x of [-7.2, -4.6, .6, 3.2]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.3), glow); m.position.set(x, 2.8, .13); group.add(m); }
  const beam = new THREE.Mesh(new THREE.ConeGeometry(4, 22, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2c4, transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide }));
  beam.rotation.x = Math.PI / 2 + .35; beam.position.set(7.6, 9.2, 6.6); group.add(beam);
  group.userData.night = k => { const v = Math.min(1, Math.max(0, k)); glow.color.copy(on).lerp(off, v); beam.material.opacity = .22 * (1 - v); beam.visible = v < .98; };
  group.userData.night(0);
}

export const GUARDS = { key: 'guards', name: 'תחנת השומרים של הממלכה', draw: drawGuards, live: guardsLive, top: 14 };
