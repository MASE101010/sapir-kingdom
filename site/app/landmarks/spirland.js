// ספירלנד: day 4's winning comment (@ofek_bell, "הספירלנד, הלונה פארק הכי שווה שיש"). A giant amusement park whose rides
// all move: a roller coaster whose train races round the park with a big hill at the back, a Ferris wheel with cabins that
// stay level, a carousel with horses, a swinging pirate ship, a drop tower, and two water slides spiralling down into a
// pool. A gate with towers and the park's sign toward the castle (+z), candy stands, balloons, bunting, people, trees.
// Drawn on lot 2 (radius 26, its front corners left free for the neighbours' houses). tick(group, t) moves the rides.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const RED = 0xd8453a, GOLD = 0xe8b323, TEAL = 0x0f6f73, NAVY = 0x13213b, CREAM = 0xfff6e6, PINK = 0xf28db2, BLUE = 0x3b8fd6,
  SKY = 0x6cc3e8, PURPLE = 0x8a5cc2, GREEN = 0x4f9a43, WHITE = 0xffffff, WOOD = 0x8a6240, METAL = 0x9aa3ab, DARK = 0x3a3f45,
  PATH = 0xf1e3c4, GRASS = 0x86c766, SKIN = 0xe2b48f, WATER = 0x4fc3ef;
const SHIRTS = [RED, TEAL, BLUE, GOLD, PURPLE, PINK, GREEN];
const S = 26, F = 12;                               // the park's square, its front corners cut from z = F

// the roller coaster's track: an oval round the right half with a big hill at the back and a hump at the front
const CX = 13, CZ = -3, A = 8.5, B = 18.5;
const TAU = Math.PI * 2, wrap = x => ((x % TAU) + TAU) % TAU;
const bump = (th, c, w) => Math.exp(-(((wrap(th - c + Math.PI) - Math.PI) / w) ** 2));
export const track = th => [CX + A * Math.cos(th), 3 + 17 * bump(th, -Math.PI / 2, .75) + 6 * bump(th, Math.PI / 2 + .5, .4) + 2 * bump(th, 0, .3), CZ + B * Math.sin(th)];

function person(p, x, z, rot, shirt, y = 0) {
  p.at(x, z, rot, y); p.box(-.3, 0, 0, .45, 1.4, .5, NAVY); p.box(.3, 0, 0, .45, 1.4, .5, NAVY);
  p.box(0, 1.4, 0, 1.3, 1.5, .8, shirt); p.box(0, 2.9, 0, 1, 1, 1, SKIN); p.box(0, 3.75, 0, 1.05, .3, 1.05, 0x5a3b26); p.at(0, 0, 0);
}
function stand(p, x, z, rot, roof, top) {
  p.at(x, z, rot); p.box(0, 0, 0, 4, 2.6, 3, CREAM); p.box(0, 1, 1.55, 3.4, 1, .1, 0x7a5a3a);
  for (let i = 0; i < 5; i++) p.box(-1.8 + i * .9, 2.6, .2, .9, .25, 3.8, i % 2 ? WHITE : roof);
  top(p); p.at(0, 0, 0);
}

export function drawSpirland(p) {
  p.at(0, 0, 0);
  // the ground: lawn inside the cut square, cream paths
  p.box(0, 0, -S / 2 + F / 2, 2 * S, .1, S + F, GRASS);
  for (let z = F; z < S; z++) { const half = S - (z - F); p.box(0, 0, z + .5, 2 * half, .1, 1, GRASS); }
  p.box(0, .1, 14, 5, .06, 24, PATH); p.box(-4, .1, 2, 30, .06, 4.5, PATH); p.box(-14, .1, -10, 4, .06, 20, PATH); p.box(4, .1, -18, 24, .06, 4, PATH);
  // a low fence in the park's colours round the edge
  const post = (x, z, k) => { p.box(x, 0, z, .35, 1.6, .35, WHITE); p.ball(x, 1.6, z, .5, .5, SHIRTS[k % SHIRTS.length]); };
  for (let i = -S; i <= S; i += 2) post(i, -S, i);
  for (let z = -S; z <= F; z += 2) { post(-S, z, z); post(S, z, z + 1); }
  for (let k = 0; k <= 9; k++) { const f = k / 9; post(-(S - (S - F) * f), F + (S - F) * f, k); post(S - (S - F) * f, F + (S - F) * f, k + 2); }
  for (let x = 7; x <= F; x += 2) { post(-x, S, x); post(x, S, x + 1); }
  // the gate: two striped towers with cone roofs and flags, an arch with the sign, a ticket booth, balloons
  for (const sx of [-1, 1]) { const x = sx * 5.2;
    for (let k = 0; k < 5; k++) p.cyl(x, k * 2, S, 3, 2, k % 2 ? WHITE : RED);
    p.cone(x, 10, S, 4, 4.5, GOLD); p.box(x, 14.5, S, .2, 2.4, .2, DARK); p.box(x + sx * .8, 15.8, S, 1.6, 1, .1, TEAL); }
  p.box(0, 8.6, S, 8, 1.4, 1.4, NAVY); p.box(0, 10, S, 7, .5, 1.2, GOLD);
  p.box(-8.8, 0, S - 1.5, 3.2, 3, 3, PINK); p.box(-8.8, 3, S - 1.5, 3.8, .5, 3.8, WHITE); p.box(-8.8, 1.2, S + .05, 2, 1.1, .1, 0x7fb3c9);
  for (let k = 0; k < 9; k++) { const a = k * 2.4, r = .4 + (k % 3) * .5; p.box(9 + Math.cos(a) * r * .3, 0, S - 1 + Math.sin(a) * r * .3, .06, 4.4 + (k % 3) * .7, .06, 0xdddddd); p.ball(9 + Math.cos(a) * r, 4.4 + (k % 3) * .7, S - 1 + Math.sin(a) * r, 1.3, 1.6, SHIRTS[k % SHIRTS.length]); }
  // bunting on poles along the main path
  for (const z of [6, 12, 18]) { for (const x of [-3.2, 3.2]) p.box(x, 0, z, .25, 6, .25, METAL);
    for (let k = 0; k < 8; k++) p.pyramid(-2.8 + k * .8, 5.2 - Math.sin(k / 7 * Math.PI) * .7, z, .7, -.8, SHIRTS[k % SHIRTS.length]); }
  // candy stands: cotton candy, popcorn, ice cream, balloons
  stand(p, -5.5, 13.5, Math.PI / 2, PINK, p => { p.ball(0, 2.85, 0, 2.2, 2, PINK); p.box(0, 2.85, 0, .15, 1, .15, WHITE); });
  stand(p, -5.5, 19.5, Math.PI / 2, RED, p => { p.cyl(0, 2.85, 0, 1.6, 1.4, RED); p.ball(0, 4.1, 0, 1.6, 1, 0xfff1b8); });
  stand(p, -5.5, 7.5, Math.PI / 2, SKY, p => { p.cone(0, 2.85, 0, 1.4, -2.2, 0xd9a066); p.cone(0, 3.6, 0, 1.4, -2.2, 0xd9a066); p.ball(0, 3.4, 0, 1.8, 1.8, 0xf7c6d9); });
  // the carousel's base, its rim and its sign post (the turning part is in live)
  p.cyl(-14, 0, 13, 12, .5, WHITE); p.cyl(-14, .5, 13, 11.4, .3, GOLD);
  // the Ferris wheel's frame: two towers to the axle on each side of the wheel, and a ticket hut
  const wx = -13, wz = -7, axle = 16;
  for (const dz of [-2.4, 2.4]) { for (const dx of [-3, 3]) p.box(wx + dx * (1 - .0), 0, wz + dz, .7, axle, .7, WHITE);
    for (let y = 2; y < axle; y += 3.5) p.box(wx, y, wz + dz, 6.6, .4, .4, WHITE); p.box(wx, axle - .6, wz + dz, 2, 1.2, .8, NAVY); }
  p.box(wx + 6, 0, wz + 4.5, 3, 2.6, 2.4, RED); p.box(wx + 6, 2.6, wz + 4.5, 3.6, .4, 3, WHITE);
  // the pirate ship's frame: two A posts with a beam (the ship swings in live)
  for (const dx of [-3.2, 3.2]) { p.box(CX + dx, 0, CZ - 2.6, .7, 13, .7, WOOD); p.box(CX + dx, 0, CZ + 2.6, .7, 13, .7, WOOD); p.box(CX + dx, 12.6, CZ, .7, .7, 6, WOOD); }
  p.box(CX, 12.6, CZ, 7.2, .7, .7, DARK); p.box(CX, 0, CZ, 9, .2, 13, 0xcfc4a8);
  // the drop tower: a tall striped column with a crown, its car rides up and down in live
  const tx = -20.5, tz = -20.5;
  p.cyl(tx, 0, tz, 5, .5, METAL); for (let k = 0; k < 10; k++) p.cyl(tx, .5 + k * 4, tz, 1.8, 4, k % 2 ? WHITE : PURPLE);
  p.cyl(tx, 40.5, tz, 3.4, 1.2, GOLD); p.cone(tx, 41.7, tz, 3, 3, RED); p.ball(tx, 44.4, tz, .8, .8, GOLD);
  // the water slides: a tower with a stair, two slides spiralling down to a pool
  const sx0 = -3, sz0 = -19, top = 14;
  p.box(sx0, 0, sz0, 4, top, 4, CREAM); p.box(sx0, top, sz0, 5, .4, 5, BLUE); p.pyramid(sx0, top + 3.2, sz0, 5.4, 2.4, RED);
  for (const [dx, dz] of [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]]) p.box(sx0 + dx, top, sz0 + dz, .3, 3.2, .3, WHITE);
  for (let k = 0; k < 12; k++) p.box(sx0 + 2.5, k * 1.15, sz0 - 1.8 + k * .3, 1.2, .3, .9, WOOD);
  for (const [col, a0] of [[BLUE, 0], [PINK, Math.PI]]) for (let k = 0; k < 44; k++) {
    const f = k / 43, a = a0 + f * Math.PI * 3.2, r = 4.6, x = sx0 + Math.cos(a) * r, z = sz0 + Math.sin(a) * r * .8 + f * 7, y = top - f * (top - .8);
    p.box(x, y, z, 1.5, .45, 1.5, col, -a); }
  p.box(sx0 - 1, 0, sz0 + 9, 11, .7, 5.5, WHITE); p.box(sx0 - 1, .2, sz0 + 9, 10, .6, 4.5, WATER);
  // the roller coaster: rails, ties, white supports, and the station
  const N = 180; let prev = track(0);
  for (let i = 1; i <= N; i++) {
    const th = i / N * Math.PI * 2, cur = track(th), mx = (cur[0] + prev[0]) / 2, my = (cur[1] + prev[1]) / 2, mz = (cur[2] + prev[2]) / 2;
    const len = Math.hypot(cur[0] - prev[0], cur[2] - prev[2]) + .15, yaw = Math.atan2(cur[0] - prev[0], cur[2] - prev[2]), nx = Math.cos(yaw), nz = -Math.sin(yaw);
    for (const s of [-.65, .65]) p.box(mx + nx * s, my, mz + nz * s, .25, .3, len, RED, yaw);
    if (i % 2 === 0) p.box(mx, my - .15, mz, 1.7, .15, .3, DARK, yaw);
    if (i % 5 === 0) { p.box(mx, 0, mz, .35, my, .35, WHITE); if (my > 9) p.box(mx, my * .5, mz, 1.4, .25, .25, WHITE, yaw); }
    prev = cur;
  }
  const st = track(Math.PI); p.box(st[0] + 2.1, 0, st[2], 2.6, 3.2, 7, TEAL); p.box(st[0] + .6, 3.2, st[2], 4.2, .4, 8, GOLD);
  // people walking about
  const spots = [[-1, 22], [1.5, 20], [-1.2, 14], [1, 11], [-8, 2], [-16, 3], [-11, 4.5], [3, -16], [-6, -14], [-17, -10], [-9, -3], [8, 20], [-9, 22], [2, 6], [-4, 5], [-19, 14], [-5, 9], [16, -24]];
  spots.forEach(([x, z], k) => person(p, x, z, k * 1.7, SHIRTS[k % SHIRTS.length]));
  // trees and lamps
  for (const [x, z] of [[-22, 2], [-23, -6], [22, 12], [-2, -24], [10, -24], [-10, -24], [-20, 20], [20, 4]]) p.tree(x, z, .85, GREEN);
  for (const [x, z] of [[-3.5, 3], [-3.5, 22], [3, 22]]) { p.box(x, 0, z, .25, 4.5, .25, DARK); p.ball(x, 4.5, z, .9, .9, 0xfff3b0); }
}

/** the moving rides, each its own group, kept on group.userData.rides for tick */
export function spirlandLive(group) {
  const sub = (fn, x, y, z) => { const p = new Pen(); fn(p); const g = p.build(new THREE.Group()); g.position.set(x, y, z); group.add(g); return g; };
  const rides = group.userData.rides = {};
  // the Ferris wheel: rim, spokes and lights turn; the cabins hang level
  const wx = -13, wz = -7, axle = 16, R = 12.5;
  rides.wheel = sub(p => {
    for (const dz of [-1.2, 1.2]) for (let k = 0; k < 56; k++) { const a = k / 56 * Math.PI * 2; p.box(Math.cos(a) * R, Math.sin(a) * R - .5, dz, 1.5, 1, .45, k % 2 ? WHITE : RED, 0); }
    for (let s = 0; s < 14; s++) { const a = s / 14 * Math.PI * 2; for (let k = 1; k < 12; k++) p.box(Math.cos(a) * k, Math.sin(a) * k - .2, 0, .4, .4, 2.6, WHITE); p.ball(Math.cos(a) * R, Math.sin(a) * R - .5, 1.6, .7, .7, 0xfff3b0); }
    p.cyl(0, -1, 0, 2.4, 2, GOLD); p.ball(0, -.6, 1.4, 1.6, 1.6, GOLD);
  }, wx, axle, wz);
  rides.cabins = Array.from({ length: 14 }, (_, k) => sub(p => {
    p.box(0, -.2, 0, .2, .8, .2, DARK); p.box(0, -2.6, 0, 2.2, 2.2, 2, SHIRTS[k % SHIRTS.length]); p.box(0, -2, 1.05, 1.6, .9, .1, 0xcde8f5); p.box(0, -.6, 0, 2.6, .4, 2.4, WHITE);
  }, wx, axle, wz));
  // the carousel: a striped roof, gold poles, horses that go up and down
  rides.carousel = sub(p => {
    p.cyl(0, .8, 0, 11, .4, CREAM); p.cyl(0, .8, 0, 1.8, 6.5, GOLD); p.cyl(0, 6.5, 0, 12.4, .6, RED);
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; p.box(Math.cos(a) * 5.9, 6.3, Math.sin(a) * 5.9, 3, .6, .4, k % 2 ? WHITE : RED, -a); }
    p.cone(0, 7.1, 0, 12.6, 3.4, PINK); p.cone(0, 9.2, 0, 5.2, 1.6, RED); p.ball(0, 10.4, 0, 1, 1, GOLD);
  }, -14, 0, 13);
  rides.horses = Array.from({ length: 8 }, (_, k) => sub(p => {
    p.box(0, 0, 0, .25, 5, .25, GOLD); p.box(0, 1.4, 0, .9, 1, 2.2, [WHITE, 0xd9a066, 0x5a3b26, 0xf2f2f2][k % 4]); p.box(0, 2.1, 1.1, .7, 1.2, .7, [WHITE, 0xd9a066, 0x5a3b26, 0xf2f2f2][k % 4]);
    p.box(0, 2.4, .2, .6, .9, .5, SHIRTS[k % SHIRTS.length]); p.box(0, 3.1, .2, .5, .5, .5, SKIN); p.box(0, .6, .8, .2, .8, .2, 0x5a3b26); p.box(0, .6, -.8, .2, .8, .2, 0x5a3b26);
  }, -14, 1.2, 13));
  // the pirate ship: a hull with a mast and a sail, swinging under the beam
  rides.ship = sub(p => {
    p.box(0, -10.6, 0, 3.6, 2.2, 9, 0x7a4a2a); p.box(0, -9.2, 0, 4, 1.2, 10, 0x8a5a33); p.box(0, -8.2, 0, 4.2, .4, 10.4, GOLD);
    p.box(0, -10.2, 4.8, 3, 2.6, 1.4, 0x7a4a2a); p.box(0, -10.2, -4.8, 3, 2.6, 1.4, 0x7a4a2a);
    for (const z of [-3.6, -1.2, 1.2, 3.6]) for (const x of [-.9, .9]) { p.box(x, -8.2, z, .6, .7, .5, SHIRTS[(z * 3 + x * 5 + 20 | 0) % SHIRTS.length]); p.box(x, -7.5, z, .5, .5, .5, SKIN); }
    p.box(0, -8, 0, .3, 7, .3, WOOD); p.box(0, -4.6, .2, 3, 3, .1, WHITE); p.box(0, -1.2, 0, .1, .6, 1.2, NAVY);
    for (const x of [-1.6, 1.6]) p.box(x, -8, 0, .2, 8, .2, METAL);
  }, CX, 12.6, CZ);
  // the drop tower's car: a ring of seats with riders
  rides.drop = sub(p => {
    p.cyl(0, 0, 0, 4.6, 1.2, GOLD); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.box(Math.cos(a) * 2.6, -.8, Math.sin(a) * 2.6, .8, .9, .8, SHIRTS[k % SHIRTS.length]); p.box(Math.cos(a) * 2.6, -1.6, Math.sin(a) * 2.6, .6, .8, .6, NAVY); }
  }, -20.5, 4, -20.5);
  // the roller coaster's train: four cars with riders, arms up
  rides.train = Array.from({ length: 4 }, (_, k) => sub(p => {
    p.box(0, .2, 0, 1.8, .9, 2.4, k === 0 ? GOLD : [RED, BLUE, PURPLE][k % 3]); p.box(0, 1.1, 0, .7, .7, .7, SKIN); p.box(0, 1, -.9, .7, .7, .7, SKIN);
    p.box(-.5, 1.5, 0, .2, 1, .2, SKIN); p.box(.5, 1.5, 0, .2, 1, .2, SKIN); for (const [dx, dz] of [[-.8, .8], [.8, .8], [-.8, -.8], [.8, -.8]]) p.box(dx, -.2, dz, .3, .4, .3, DARK);
  }, 0, 0, 0));
  // signs
  group.add(sign('ספירלנד', { w: 9.6, h: 2.6, bg: '#e8b323', fg: '#13213b', border: '#d8453a', font: '900 {px}px "Secular One", Rubik' }).at(0, 12.6, S + .65));
  group.add(sign('רכבת ההרים', { w: 4.6, h: 1.2, bg: '#0f6f73', fg: '#ffffff', border: '#ffffff' }).at(track(Math.PI)[0] + 2.1, 4.4, track(Math.PI)[2] + 3.55));
  group.add(sign('גלגל ענק', { w: 3.6, h: 1.1, bg: '#fffaf0' }).at(wx + 6, 3.6, wz + 5.8));
  group.add(sign('צמר גפן מתוק', { w: 3.8, h: .9, bg: '#f28db2', fg: '#ffffff', border: '#ffffff' }).at(-5.5 + 1.6, 2.2, 13.5, Math.PI / 2));
  group.add(sign('גלידה', { w: 2.6, h: .9, bg: '#6cc3e8', fg: '#13213b', border: '#ffffff' }).at(-5.5 + 1.6, 2.2, 7.5, Math.PI / 2));
  group.add(sign('פופקורן', { w: 2.8, h: .9, bg: '#d8453a', fg: '#ffffff', border: '#ffffff' }).at(-5.5 + 1.6, 2.2, 19.5, Math.PI / 2));
  group.add(sign('ספינת הפיראטים', { w: 4.6, h: 1.1, bg: '#13213b', fg: '#e8b323', border: '#e8b323' }).at(CX, 13.5, CZ + 3.0));
  group.add(sign('מגדל הנפילה', { w: 4.4, h: 1.1, bg: '#8a5cc2', fg: '#ffffff', border: '#ffffff' }).at(-20.5, 2.4, -17.9));
  spirlandTick(group, 0);
}

export function spirlandTick(group, t) {
  const r = group.userData.rides; if (!r) return;
  const wa = t * .22; r.wheel.rotation.z = wa;
  r.cabins.forEach((c, k) => { const a = wa + k / 14 * Math.PI * 2; c.position.set(-13 + Math.cos(a) * 12.5, 16 + Math.sin(a) * 12.5 - .5, -7); });
  const ca = t * .7; r.carousel.rotation.y = ca;
  r.horses.forEach((h, k) => { const a = ca + k / 8 * Math.PI * 2; h.position.set(-14 + Math.cos(a) * 4.3, 1.2 + Math.sin(t * 3 + k) * .5, 13 - Math.sin(a) * 4.3); h.rotation.y = a; });
  r.ship.rotation.x = Math.sin(t * 1.15) * .85;
  const ph = (t % 9) / 9, h = ph < .45 ? 4 + 32 * Math.sin(ph / .45 * Math.PI / 2) : ph < .55 ? 36 : 36 - 32 * Math.min(1, ((ph - .55) / .12) ** 2);
  r.drop.position.y = h;
  r.train.forEach((car, k) => {
    const th = t * .62 - k * .075, P = track(th), Q = track(th + .01);
    car.position.set(P[0], P[1] + .35, P[2]); car.rotation.set(0, 0, 0); car.rotation.order = 'YXZ';
    car.rotation.y = Math.atan2(Q[0] - P[0], Q[2] - P[2]); car.rotation.x = -Math.atan2(Q[1] - P[1], Math.hypot(Q[0] - P[0], Q[2] - P[2]));
  });
}
export const SPIRLAND = { key: 'spirland', name: 'ספירלנד', draw: drawSpirland, live: spirlandLive, tick: spirlandTick, top: 30 };
