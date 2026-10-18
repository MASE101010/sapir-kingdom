// Day 5's winning comment (@yuvalgaba, "אצטדיון של קבוצת הכדורגל ספיר"), built twice for two rival clubs:
// אצטדיון מכבי ספיר (lot 3): a big oval stadium with five tiers of seats full of fans, a roof on two columns rings, four
//   floodlight masts, a scoreboard, a striped pitch with its lines and goals, the players' residence (20 rooms) behind it.
// מגרש הפועל ספיר (lot 4): the neighbours' ground: a pitch with low stands on its two long sides, a fence, floodlights,
//   dugouts, a clubhouse with the players' residence (20 rooms) and the club's sign.
// Kits (chosen by the residents on day 6): מכבי ספיר green and white, הפועל ספיר red and black; ספירדונלדס sponsors הפועל.
// Front toward +z (the castle).
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const MGREEN = 0x1f8a4c, HRED = 0xc8102e, HBLACK = 0x1b1d21, GRASS = 0x4fa64a, GRASS2 = 0x5cb556, LINE = 0xffffff, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc2412d,
  CREAM = 0xf3ead8, CONCRETE = 0xd6d0c4, DARK = 0x3a3f45, METAL = 0x9aa3ab, GLASS = 0x7fb3c9, SKIN = 0xe2b48f, WOOD = 0x8a6240;
const FANS = [0xe8b323, 0x0f6f73, 0xc2412d, 0xffffff, 0x3b6fb6, 0x7a4f9a, 0xf28db2, 0x4f9a43];
const rnd = (a, b) => { let h = Math.imul(a * 73856093 ^ b * 19349663, 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };

/** a pitch W × D (x × z) with mown stripes, its lines, centre circle, boxes and two goals */
function pitch(p, W, D, y = 0) {
  const n = 10; for (let i = 0; i < n; i++) p.box(-W / 2 + (i + .5) * W / n, y, 0, W / n, .12, D, i % 2 ? GRASS : GRASS2);
  const ln = (x, z, w, d) => p.box(x, y + .12, z, w, .03, d, LINE);
  ln(0, -D / 2, W, .25); ln(0, D / 2, W, .25); ln(-W / 2, 0, .25, D); ln(W / 2, 0, .25, D); ln(0, 0, .25, D);
  for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; p.box(Math.cos(a) * 3.2, y + .12, Math.sin(a) * 3.2, .5, .03, .25, LINE, -a); }
  for (const s of [-1, 1]) { const bx = s * (W / 2 - 3); ln(bx, -5, .25 * 1, .25); ln(s * (W / 2 - 1.5), -5, 3, .25); ln(s * (W / 2 - 1.5), 5, 3, .25); ln(bx, 0, .25, 10);
    const gx = s * (W / 2 + .5); p.box(gx, y, -2, .25, 2.4, .25, LINE); p.box(gx, y, 2, .25, 2.4, .25, LINE); p.box(gx, y + 2.3, 0, .25, .25, 4.2, LINE);
    p.box(gx + s * .8, y, 0, .08, 2.3, 4, 0xe9eef2); }                                                        // goal and its net
}
/** a footballer: shirt in kit, shorts and the number in trim */
function player(p, x, z, rot, kit, y = 0, trim = kit === LINE ? NAVY : LINE) {
  p.at(x, z, rot, y); p.box(-.3, 0, 0, .45, .7, .5, trim); p.box(.3, 0, 0, .45, .7, .5, trim); p.box(-.3, .7, 0, .45, .7, .5, SKIN); p.box(.3, .7, 0, .45, .7, .5, SKIN);
  p.box(0, 1.4, 0, 1.2, .5, .7, kit); p.box(0, 1.9, 0, 1.3, 1.2, .8, kit); p.box(0, 2.3, -.42, .5, .5, .05, trim);
  p.box(-.8, 2, 0, .35, 1, .4, SKIN); p.box(.8, 2, 0, .35, 1, .4, SKIN); p.box(0, 3.1, 0, .9, .9, .9, SKIN); p.box(0, 3.85, 0, .95, .3, .95, 0x4a3020); p.at(0, 0, 0);
}
function floodlight(p, x, z, h, face) {
  p.box(x, 0, z, .8, h, .8, METAL); p.box(x, h, z, 5, 2.6, .6, DARK, face);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) p.box(x + Math.cos(face) * (-1.8 + i * 1.2), h + .4 + j * 1.1, z - Math.sin(face) * (-1.8 + i * 1.2) + Math.sin(face + Math.PI / 2) * .1, .9, .8, .2, 0xfff6c8, face);
}
/** the players' residence: a two-storey block with 20 rooms, each with a window and a balcony */
function residence(p, x, z, w, colour, rot = 0) {
  p.at(x, z, rot); p.box(0, 0, 0, w, 6.4, 4, CREAM); p.box(0, 6.4, 0, w + .4, .5, 4.4, colour); p.box(0, 3.1, 0, w + .1, .3, 4.1, colour);
  for (let f = 0; f < 2; f++) for (let k = 0; k < 10; k++) { const rx = -w / 2 + (k + .5) * w / 10, y = .8 + f * 3.2;
    p.box(rx, y, 2.02, w / 10 * .55, 1.4, .1, GLASS); p.box(rx, y - .2, 2.4, w / 10 * .7, .15, .8, CREAM); p.box(rx, y + .3, 2.75, w / 10 * .7, .5, .08, colour); }
  p.box(0, 0, 2.05, 2, 2.4, .12, WOOD); p.at(0, 0, 0);
}

export function drawMaccabi(p) {
  p.at(0, 0, 0);
  p.box(0, 0, -2, 52, .08, 46, CONCRETE);
  const PW = 30, PD = 18; pitch(p, PW, PD, .08);
  // the stands: five tiers on an oval round the pitch, seats striped in the club's (still undecided) navy and gold, fans
  const RX = 17.5, RZ = 11.5, T = 5;
  for (let t = 0; t < T; t++) { const rx = RX + t * 1.5, rz = RZ + t * 1.4, y = .08 + t * 1.15, N = 72;
    for (let k = 0; k < N; k++) { const a = (k + .5) / N * Math.PI * 2, b = (k + 1.5) / N * Math.PI * 2;
      const x0 = Math.cos(a) * rx, z0 = Math.sin(a) * rz, x1 = Math.cos(b) * rx, z1 = Math.sin(b) * rz;
      if (z0 > 9 && Math.abs(x0) < 4.5 && t < 4) continue;                                                       // the players' tunnel and the gate
      const len = Math.hypot(x1 - x0, z1 - z0) + .1, yaw = Math.atan2(x1 - x0, z1 - z0);
      p.box(x0, 0, z0, len, y + 1.15, 1.5, CONCRETE, yaw); p.box(x0, y + 1.15, z0, len, .25, 1.4, (k + t) % 6 < 3 ? MGREEN : LINE, yaw);
      if (rnd(k, t) < .62) { const c = FANS[(k * 7 + t * 3) % FANS.length]; p.box(x0, y + 1.4, z0, .7, .8, .5, c, yaw); p.box(x0, y + 2.2, z0, .5, .5, .5, SKIN, yaw); } } }
  // the outer wall and the roof on its columns
  const ox = RX + T * 1.5 + .6, oz = RZ + T * 1.4 + .6;
  for (let k = 0; k < 64; k++) { const a = (k + .5) / 64 * Math.PI * 2, b = (k + 1.5) / 64 * Math.PI * 2;
    const x0 = Math.cos(a) * ox, z0 = Math.sin(a) * oz, x1 = Math.cos(b) * ox, z1 = Math.sin(b) * oz, len = Math.hypot(x1 - x0, z1 - z0) + .1, yaw = Math.atan2(x1 - x0, z1 - z0);
    if (z0 > 15 && Math.abs(x0) < 5) continue;
    p.box(x0, 0, z0, len, 8.4, .8, k % 2 ? CREAM : 0xe9e0cc, yaw); p.box(x0, 8.4, z0, len, .5, 1.1, MGREEN, yaw);
    p.box(Math.cos(a) * (ox - 2.4), 11, Math.sin(a) * (oz - 2.4), len, .4, 5, 0xf2f2f2, yaw);
    if (k % 4 === 0) p.box(x0, 8.9, z0, .5, 2.4, .5, METAL); }
  // the gate toward the castle, with its arch
  for (const x of [-5.2, 5.2]) p.box(x, 0, oz - .2, 1.6, 11, 1.6, MGREEN);
  p.box(0, 9, oz - .2, 12, 2, 1.4, MGREEN); p.box(0, 11, oz - .2, 12.4, .4, 1.6, GOLD);
  // the scoreboard at the west end and the floodlights
  p.box(-ox + .5, 8.4, 0, .6, 6, 1, DARK); p.box(-ox + .9, 9.2, 0, .4, 4.4, 9.6, NAVY);
  for (const [x, z] of [[-24, -20], [24, -20], [-22, 15], [22, 15]]) floodlight(p, x, z, 18, Math.atan2(-x, -z));
  // the players on the pitch: eleven in white, eleven in black, the ball, a referee
  const pos = [[-13, 0], [-9, -5], [-9, 5], [-10, 0], [-5, -7], [-5, 7], [-4, -2], [-4, 2], [-1, -5], [-1, 5], [-2, 0]];
  pos.forEach(([x, z], k) => { player(p, x, z, Math.PI / 2, MGREEN, .08, LINE); player(p, -x + (k === 10 ? 1.5 : 0), -z, -Math.PI / 2, HRED, .08, HBLACK); });
  player(p, 1, 3, Math.PI, 0xf2b632, .08); p.ball(0, .08, 0, .6, .6, LINE);
  // benches on the touchline
  for (const x of [-6, 6]) { p.box(x, .08, PD / 2 + 1.6, 5, 1, 1, TEAL); p.box(x, 1.1, PD / 2 + 1.9, 5.4, 1.6, .2, 0xcde8f5); }
  // the players' residence behind the stadium
  residence(p, 0, -22.5, 34, MGREEN, Math.PI);
  for (const [x, z] of [[-24, 22], [24, 22], [-25, -10], [25, -10]]) p.tree(x, z, .8, 0x4f9a43);
}
export function maccabiLive(group) {
  const ox = 17.5 + 5 * 1.5 + .6, oz = 11.5 + 5 * 1.4 + .6;
  group.add(sign('אצטדיון מכבי ספיר', { w: 11.6, h: 2, bg: '#1f8a4c', fg: '#ffffff', border: '#ffffff', font: '900 {px}px "Secular One", Rubik' }).at(0, 10, oz + .55));
  const board = sign('מכבי ספיר 0 : 0 הפועל ספיר', { w: 9.4, h: 2.4, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }); board.rotation.y = Math.PI / 2; board.position.set(-ox + 1.15, 11.4, 0); group.add(board);
  group.add(sign('מגורי השחקנים · 20 מקומות', { w: 12, h: 1.4, bg: '#fffaf0' }).at(0, 7.2, -22.5 - 2.25, Math.PI));
  group.add(sign('מכבי ספיר · ירוק לבן 💚🤍', { w: 10, h: 1.5, bg: '#1f8a4c', fg: '#ffffff', border: '#ffffff' }).at(0, 2.2, 9 + 2.45));
}

export function drawHapoel(p) {
  p.at(0, 0, 0);
  p.box(0, 0, -2, 50, .08, 44, 0xc9b98b);
  const PW = 28, PD = 17; pitch(p, PW, PD, .08);
  // a fence round the ground
  for (let x = -18; x <= 18; x += 2) { p.box(x, 0, -13, .2, 2.2, .2, METAL); p.box(x, 0, 14, .2, 2.2, .2, METAL); }
  for (let z = -13; z <= 14; z += 2) { p.box(-18, 0, z, .2, 2.2, .2, METAL); p.box(18, 0, z, .2, 2.2, .2, METAL); }
  for (const y of [1, 2]) { p.box(0, y, -13, 36, .1, .1, METAL); p.box(0, y, 14, 36, .1, .1, METAL); p.box(-18, y, .5, .1, .1, 27, METAL); p.box(18, y, .5, .1, .1, 27, METAL); }
  // low stands on both long sides, red and white, with fans
  for (const s of [-1, 1]) for (let t = 0; t < 3; t++) { const z = s * (PD / 2 + 2 + t * 1.4), y = .08 + t * .9;
    p.box(0, 0, z, 26, y + .9, 1.4, CONCRETE); p.box(0, y + .9, z, 26, .25, 1.3, t % 2 ? HRED : HBLACK);
    for (let k = 0; k < 26; k++) if (rnd(k + s * 50, t) < .55) { const x = -12.5 + k; p.box(x, y + 1.15, z, .6, .8, .5, FANS[(k + t * 2 + (s > 0 ? 1 : 0)) % FANS.length]); p.box(x, y + 1.95, z, .45, .45, .45, SKIN); } }
  // a small roof over the north stand
  for (const x of [-12, -4, 4, 12]) p.box(x, 0, -(PD / 2 + 5.2), .4, 5.4, .4, METAL);
  p.box(0, 5.4, -(PD / 2 + 3.6), 27, .3, 4.4, RED);
  // dugouts, floodlights, the clubhouse with the residence, the gate
  for (const x of [-5, 5]) { p.box(x, .08, PD / 2 + .9, 4, 1.8, 1.2, 0xd9e2e8); p.box(x, 1.9, PD / 2 + .9, 4.2, .2, 1.6, RED); }
  for (const [x, z] of [[-19.5, -14.5], [19.5, -14.5], [-19.5, 15.5], [19.5, 15.5]]) floodlight(p, x, z, 13, Math.atan2(-x, -z));
  residence(p, 0, -20.5, 30, HRED, Math.PI);
  p.box(-21, 0, -20.5, 6, 3.4, 5, CREAM); p.gable(-21, 3.4, -20.5, 6.6, 2, 5.6, RED);
  for (const x of [-4, 4]) p.box(x, 0, 18, 1.2, 4.6, 1.2, HBLACK); p.box(0, 4.6, 18, 9.4, 1.4, 1, HRED);
  // the squad training: cones and a few players, the coach with a whistle
  for (let k = 0; k < 8; k++) p.cone(-8 + k * 2.2, .08, -4 + (k % 2) * 1.6, .7, .9, 0xf28c28);
  [[-8, -2], [-3, 3], [2, -3], [6, 2], [9, -1], [-6, 5]].forEach(([x, z], k) => player(p, x, z, k * 1.3, HRED, .08, HBLACK));
  player(p, 0, 6.5, Math.PI, 0x3b6fb6, .08); p.ball(-2, .08, 1, .6, .6, LINE);
  for (const [x, z] of [[-23, 8], [23, 8], [23, -8], [-23, -6]]) p.tree(x, z, .8, 0x4f9a43);
}
export function hapoelLive(group) {
  group.add(sign('מגרש הפועל ספיר', { w: 8.8, h: 1.3, bg: '#c8102e', fg: '#ffffff', border: '#1b1d21', font: '900 {px}px "Secular One", Rubik' }).at(0, 5.3, 18.55));
  group.add(sign('מגורי השחקנים · 20 מקומות', { w: 11, h: 1.3, bg: '#fffaf0' }).at(0, 7.2, -20.5 - 2.25, Math.PI));
  group.add(sign('ספונסר רשמי: ספירדונלדס 🍔', { w: 9, h: 1.4, bg: '#e8b323', fg: '#c8102e', border: '#c8102e' }).at(0, 1.2, 14.15));
}
export const MACCABI = { key: 'maccabi', name: 'אצטדיון מכבי ספיר', draw: drawMaccabi, live: maccabiLive, top: 20 };
export const HAPOEL = { key: 'hapoel', name: 'מגרש הפועל ספיר', draw: drawHapoel, live: hapoelLive, top: 12 };
