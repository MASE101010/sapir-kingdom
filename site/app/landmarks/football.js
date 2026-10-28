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
export function pitch(p, W, D, y = 0) {
  const n = 10; for (let i = 0; i < n; i++) p.box(-W / 2 + (i + .5) * W / n, y, 0, W / n, .12, D, i % 2 ? GRASS : GRASS2);
  const ln = (x, z, w, d) => p.box(x, y + .12, z, w, .03, d, LINE);
  ln(0, -D / 2, W, .25); ln(0, D / 2, W, .25); ln(-W / 2, 0, .25, D); ln(W / 2, 0, .25, D); ln(0, 0, .25, D);
  for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; p.box(Math.cos(a) * 3.2, y + .12, Math.sin(a) * 3.2, .5, .03, .25, LINE, -a); }
  for (const s of [-1, 1]) { const bx = s * (W / 2 - 3); ln(bx, -5, .25 * 1, .25); ln(s * (W / 2 - 1.5), -5, 3, .25); ln(s * (W / 2 - 1.5), 5, 3, .25); ln(bx, 0, .25, 10);
    const gx = s * (W / 2 + .5); p.box(gx, y, -2, .25, 2.4, .25, LINE); p.box(gx, y, 2, .25, 2.4, .25, LINE); p.box(gx, y + 2.3, 0, .25, .25, 4.2, LINE);
    p.box(gx + s * .8, y, 0, .08, 2.3, 4, 0xe9eef2); }                                                        // goal and its net
}
/** a footballer: shirt in kit, shorts and the number in trim */
export function player(p, x, z, rot, kit, y = 0, trim = kit === LINE ? NAVY : LINE) {
  p.at(x, z, rot, y); p.box(-.3, 0, 0, .45, .7, .5, trim); p.box(.3, 0, 0, .45, .7, .5, trim); p.box(-.3, .7, 0, .45, .7, .5, SKIN); p.box(.3, .7, 0, .45, .7, .5, SKIN);
  p.box(0, 1.4, 0, 1.2, .5, .7, kit); p.box(0, 1.9, 0, 1.3, 1.2, .8, kit); p.box(0, 2.3, -.42, .5, .5, .05, trim);
  p.box(-.8, 2, 0, .35, 1, .4, SKIN); p.box(.8, 2, 0, .35, 1, .4, SKIN); p.box(0, 3.1, 0, .9, .9, .9, SKIN); p.box(0, 3.85, 0, .95, .3, .95, 0x4a3020); p.at(0, 0, 0);
}
export function floodlight(p, x, z, h, face) {
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
  p.box(-ox + .5, 8.4, 0, .6, 8.8, 1, DARK); p.box(-ox + .9, 12, 0, .4, 4.4, 9.6, NAVY);       // raised above the roof's rim, so it reads from the pitch
  for (const [x, z] of [[-24, -20], [24, -20], [-22, 15], [22, 15]]) floodlight(p, x, z, 18, Math.atan2(-x, -z));
  // the players, the referee and the ball are live (maccabiLive): they stand in their places, and play when a reel has a match
  // benches on the touchline
  for (const x of [-6, 6]) { p.box(x, .08, PD / 2 + 1.6, 5, 1, 1, TEAL); p.box(x, 1.1, PD / 2 + 1.9, 5.4, 1.6, .2, 0xcde8f5); }
  // the players' residence behind the stadium
  residence(p, 0, -22.5, 34, MGREEN, Math.PI);
  for (const [x, z] of [[-24, 22], [24, 22], [-25, -10], [25, -10]]) p.tree(x, z, .8, 0x4f9a43);
}
const HOME = [[-13, 0], [-9, -5], [-9, 5], [-10, 0], [-5, -7], [-5, 7], [-4, -2], [-4, 2], [-1, -5], [-1, 5], [-2, 0]];
const ease = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }, lerp = (a, b, f) => a + (b - a) * f;
/** where the ball wanders while nobody is scoring (deterministic in t, so every frame of a reel can be drawn on its own) */
const wander = s => [8 * Math.sin(.55 * s) + 3 * Math.sin(1.37 * s), 5 * Math.sin(.83 * s + 1) + 1.5 * Math.sin(2.1 * s)];
/** the match: group.userData.match = { t0, goals: [{ t, team: 'm' | 'h', who }] } in the same clock as tick's t (reel.js sets it
 * from the episode's "match"). Before t0, and without a match, the players stand in their places with the ball on the spot.
 * Around a goal: the scorer carries the ball 2.4 s into the net, it stays there 2.2 s while he runs to the corner and his team
 * follows, then the ball goes back to the centre and play goes on. */
const CARRY = 1.8, NET = 1.0, BACK = 1.0, BLEND = 1.2;
function ballAt(m, t) {
  if (!m || t < m.t0) return { B: [0, 0] };
  const g = [...m.goals].reverse().find(g => t >= g.t - CARRY);
  if (!g) { const w = wander(t), k = ease((t - m.t0) / 1.5); return { B: [lerp(0, w[0], k), lerp(0, w[1], k)] }; }
  const dir = g.team === 'm' ? 1 : -1, gz = .8 * Math.sin(g.t * 3.1), party = t >= g.t && t < g.t + 2.4 ? { party: g, f: (t - g.t) / 2.4 } : {};
  // a save (day 10, { save: true }): the shooter carries it to the box and shoots, the keeper dives and it bounces back out
  if (g.save) { const gs = 2.2 * Math.sign(Math.sin(g.t * 5.3) || 1), R = [dir * 7, -gs * 2.5];
    if (t < g.t) { const s0 = ballAt(m, g.t - CARRY - 1e-3).B, f = ease((t - g.t + CARRY) / CARRY); return { B: [lerp(s0[0], dir * 11, f), lerp(s0[1], gs * .3, f)], carry: g, dir }; }
    if (t < g.t + .45) { const f = (t - g.t) / .45; return { B: [lerp(dir * 11, dir * 15.2, f), lerp(gs * .3, gs, f)], dir, save: g, air: Math.sin(Math.PI * f) * 1.2 }; }
    if (t < g.t + 1.6) { const f = ease((t - g.t - .45) / 1.15); return { B: [lerp(dir * 15.2, R[0], f), lerp(gs, R[1], f)], dir, save: g, air: Math.sin(Math.PI * f) * 2.5 }; }
    const w = wander(t), f = ease((t - g.t - 1.6) / BLEND); return { B: [lerp(R[0], w[0], f), lerp(R[1], w[1], f)], dir }; }
  if (t < g.t) { const s0 = ballAt(m, g.t - CARRY - 1e-3).B, f = ease((t - g.t + CARRY) / CARRY); return { B: [lerp(s0[0], dir * 15.4, f), lerp(s0[1], gz, f)], carry: g, dir }; }
  if (t < g.t + NET) return { B: [dir * 16.3, gz], dir, ...party };
  if (t < g.t + NET + BACK) { const f = ease((t - g.t - NET) / BACK); return { B: [lerp(dir * 16.3, 0, f), lerp(gz, 0, f)], dir, ...party }; }
  const w = wander(t), f = ease((t - g.t - NET - BACK) / BLEND); return { B: [lerp(0, w[0], f), lerp(0, w[1], f)], dir, ...party };
}
function placeAt(m, P, i, t) {
  const st = ballAt(m, t), [bx, bz] = st.B, me = P.team === 'm' ? 1 : -1, [hx, hz] = P.home;
  if (!m || t < m.t0) return { x: hx, z: hz, run: 0 };
  const scorer = g => g.team === P.team && (g.who ?? 10) === P.k;
  if (st.carry && scorer(st.carry)) return { x: bx - st.dir * 1.1, z: bz + .3, run: 1 };
  if (st.save && P.k === 0 && P.team !== st.save.team) { const d = Math.max(0, Math.min(1, (t - st.save.t + .25) / .45));
    return { x: hx * 1.12, z: lerp(0, bz, ease(d)), run: 1, jump: t > st.save.t - .2 && t < st.save.t + .6 }; }   // the keeper dives
  // where he would be in open play
  const pull = P.k < 4 ? .35 : .6, j = Math.sin(t * .9 + i) * 1.2;
  const open = P.k === 0 ? { x: hx * 1.12, z: Math.max(-2.6, Math.min(2.6, bz * .45)), run: .3 }          // the keepers stay in goal
    : { x: hx + bx * pull + me * (P.k > 7 ? 1.5 : 0), z: hz * .8 + (bz - hz * .3) * .35 + j * .4, run: 1 };
  // after a goal the scorer runs to the corner and jumps, his teammates join him, then they all go back (3.6 s in all)
  const g = [...m.goals].reverse().find(g => !g.save && t >= g.t && t < g.t + 3.6);
  if (!g || g.team !== P.team || (P.k <= 3 && !scorer(g))) return open;
  const d = g.team === 'm' ? 1 : -1, corner = [d * 13, (g.t * 7 % 2 < 1 ? 1 : -1) * 7.5], f = (t - g.t) / 2.4;
  const party = scorer(g) ? { x: lerp(d * 15, corner[0], ease(f * 2)), z: lerp(0, corner[1], ease(f * 2)), run: 1, jump: f > .5 && f < 1 }
    : { x: lerp(open.x, corner[0] - d * (1.5 + P.k % 3), ease(f * 1.4)), z: lerp(open.z, corner[1] - Math.sign(corner[1]) * (P.k % 4), ease(f * 1.4)), run: 1 };
  const w = t < g.t + 2.4 ? 1 : 1 - ease((t - g.t - 2.4) / 1.2);
  return { x: lerp(open.x, party.x, w), z: lerp(open.z, party.z, w), run: 1, jump: party.jump };
}
export function maccabiTick(group, t) {
  const L = group.userData.live; if (!L) return; const m = group.userData.match;
  L.players.forEach((P, i) => {
    const a = placeAt(m, P, i, t), b = placeAt(m, P, i, t - .12), dx = a.x - b.x, dz = a.z - b.z;
    P.g.position.set(a.x, a.jump ? Math.abs(Math.sin(t * 9)) * 1.2 : a.run ? Math.abs(Math.sin(t * 11 + i)) * .18 : 0, a.z);
    P.g.rotation.y = Math.hypot(dx, dz) > .02 ? Math.atan2(dx, dz) : (P.team === 'm' ? Math.PI / 2 : -Math.PI / 2);
  });
  const { B, air } = ballAt(m, t); L.ball.position.set(B[0], .45 + (air ?? (m && t >= m.t0 ? Math.abs(Math.sin(t * 5)) * .3 : 0)), B[1]);
  L.ref.position.set(B[0] * .5 + 1, 0, B[1] * .5 + 3.5); L.ref.rotation.y = Math.atan2(B[0] * .5 - 1, -3.5);
  // the score so far
  let sm = 0, sh = 0; for (const g of m?.goals ?? []) if (t >= g.t && !g.save) g.team === 'm' ? sm++ : sh++;
  for (const [k, b] of Object.entries(group.userData.boards ?? {})) b.visible = k === `${Math.min(sm, 3)}:${Math.min(sh, 3)}`;
}
export function maccabiLive(group) {
  const ox = 17.5 + 5 * 1.5 + .6, oz = 11.5 + 5 * 1.4 + .6;
  group.add(sign('אצטדיון מכבי ספיר', { w: 11.6, h: 2, bg: '#1f8a4c', fg: '#ffffff', border: '#ffffff', font: '900 {px}px "Secular One", Rubik' }).at(0, 10, oz + .55));
  // the scoreboard: one board for each score the match can reach (tick shows the right one)
  const boards = group.userData.boards = {};
  for (let m = 0; m <= 3; m++) for (let h = 0; h <= 3; h++) {
    const b = sign(`מכבי ${m} · הפועל ${h}`, { w: 9.4, h: 2.4, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }); b.rotation.y = Math.PI / 2; b.position.set(-ox + 1.15, 14.2, 0);
    b.visible = m === 0 && h === 0; boards[`${m}:${h}`] = b; group.add(b); }
  // the players: eleven of מכבי (green, attacking +x) and eleven of הפועל (red, attacking -x), a referee, the ball
  const sub = fn => { const p = new Pen(); fn(p); const g = p.build(new THREE.Group()); group.add(g); return g; };
  const L = group.userData.live = { players: [] };
  HOME.forEach(([x, z], k) => {
    L.players.push({ team: 'm', k, home: [x, z], g: sub(p => player(p, 0, 0, 0, MGREEN, .08, LINE)) });
    L.players.push({ team: 'h', k, home: [-x + (k === 10 ? 1.5 : 0), -z], g: sub(p => player(p, 0, 0, 0, HRED, .08, HBLACK)) });
  });
  L.ref = sub(p => player(p, 0, 0, 0, 0xf2b632, .08));
  L.ball = sub(p => p.ball(0, 0, 0, .7, .7, LINE));
  maccabiTick(group, 0);
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
export const MACCABI = { key: 'maccabi', name: 'אצטדיון מכבי ספיר', draw: drawMaccabi, live: maccabiLive, tick: maccabiTick, top: 20 };
export const HAPOEL = { key: 'hapoel', name: 'מגרש הפועל ספיר', draw: drawHapoel, live: hapoelLive, top: 12 };

// מגרש ביתר ספיר (day 9, lot 9): the third club, opened after the derby, in yellow and black. A new ground: one big covered
// stand with yellow and black seats, a low stand opposite, floodlights, the players' residence (30 rooms), a gate with a
// ribbon still waiting to be cut, balloons, and the first players training. Front toward +z.
const BYEL = 0xf2c418, BBLK = 0x1b1d21;
export function drawBeitar(p) {
  p.at(0, 0, 0);
  p.box(0, 0, -2, 50, .08, 46, 0xbfd8a4);
  const PW = 28, PD = 17; pitch(p, PW, PD, .08);
  // the big covered stand on the north side: six tiers, yellow and black rows, fans, a roof on columns
  for (let t = 0; t < 6; t++) { const z = -(PD / 2 + 2 + t * 1.3), y = .08 + t * 1;
    p.box(0, 0, z, 30, y + 1, 1.3, CONCRETE); p.box(0, y + 1, z, 30, .25, 1.2, t % 2 ? BYEL : BBLK);
    for (let k = 0; k < 30; k++) if (rnd(k + 300, t) < .5) { const x = -14.5 + k; p.box(x, y + 1.25, z, .6, .8, .5, k % 3 ? BYEL : FANS[(k + t) % FANS.length]); p.box(x, y + 2.05, z, .45, .45, .45, SKIN); } }
  for (const x of [-14, -7, 0, 7, 14]) p.box(x, 0, -(PD / 2 + 9.6), .5, 9.4, .5, BBLK);
  p.box(0, 9.4, -(PD / 2 + 6.2), 31, .4, 8.2, BYEL); p.box(0, 9.8, -(PD / 2 + 2.3), 31, .8, .4, BBLK);
  // the low stand on the south side
  for (let t = 0; t < 2; t++) { const z = PD / 2 + 2 + t * 1.3, y = .08 + t * .9;
    p.box(-7, 0, z, 12, y + .9, 1.3, CONCRETE); p.box(-7, y + .9, z, 12, .25, 1.2, t % 2 ? BBLK : BYEL);
    p.box(9, 0, z, 8, y + .9, 1.3, CONCRETE); p.box(9, y + .9, z, 8, .25, 1.2, t % 2 ? BBLK : BYEL); }
  // floodlights, dugouts, the residence with 30 rooms behind the big stand
  for (const [x, z] of [[-19.5, -13], [19.5, -13], [-19.5, 14.5], [19.5, 14.5]]) floodlight(p, x, z, 14, Math.atan2(-x, -z));
  for (const x of [-3, 3]) { p.box(x, .08, PD / 2 + .9, 3.4, 1.8, 1.2, 0xd9e2e8); p.box(x, 1.9, PD / 2 + .9, 3.6, .2, 1.6, BYEL); }
  residence(p, 0, -23, 34, BYEL, Math.PI);
  // the gate toward the castle: yellow and black pillars, an arch, the ribbon, balloons on strings
  for (const x of [-4.5, 4.5]) { p.box(x, 0, 19, 1.4, 6, 1.4, BBLK); p.box(x, 6, 19, 1.8, .5, 1.8, BYEL); }
  p.box(0, 4.8, 19, 10.4, 1.6, 1, BYEL); p.box(0, 1.2, 19.4, 7.6, .35, .08, 0xc8102e); p.box(0, 1.2, 19.42, .9, .9, .08, 0xc8102e);
  for (let k = 0; k < 10; k++) { const x = (k < 5 ? -5.6 : 5.6) + ((k % 5) - 2) * .5, y = 7 + (k % 3) * .9; p.box(x, 6.4, 19.2, .05, y - 6.4, .05, 0xdddddd); p.ball(x, y, 19.2, 1, 1.2, k % 2 ? BYEL : BBLK); }
  // the first players training in yellow and black, cones, a coach, the ball
  for (let k = 0; k < 8; k++) p.cone(-9 + k * 2.4, .08, 4 + (k % 2) * 1.6, .7, .9, 0xf28c28);
  [[-8, -3], [-4, 2], [0, -4], [4, 1], [8, -2], [-2, 6], [6, 5]].forEach(([x, z], k) => player(p, x, z, k * 1.1, BYEL, .08, BBLK));
  player(p, -11, 6, Math.PI / 3, 0x3b6fb6, .08); p.ball(1, .08, 0, .6, .6, LINE);
  for (const [x, z] of [[-23, 10], [23, 10], [-23, -4], [23, -4]]) p.tree(x, z, .8, 0x4f9a43);
}
export function beitarLive(group) {
  group.add(sign('מגרש ביתר ספיר', { w: 9.6, h: 1.4, bg: '#1b1d21', fg: '#f2c418', border: '#f2c418', font: '900 {px}px "Secular One", Rubik' }).at(0, 5.6, 19.55));
  group.add(sign('חדש! · 30 מקומות בסגל ⚽', { w: 10, h: 1.4, bg: '#f2c418', fg: '#1b1d21', border: '#1b1d21' }).at(0, 10.6, -(17 / 2 + 2.05)));
  group.add(sign('מגורי השחקנים · 30 מקומות', { w: 12, h: 1.3, bg: '#fffaf0' }).at(0, 7.2, -23 - 2.25, Math.PI));
}
export const BEITAR = { key: 'beitar', name: 'מגרש ביתר ספיר', draw: drawBeitar, live: beitarLive, top: 12 };
