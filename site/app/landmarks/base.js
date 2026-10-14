// צבא ההגנה לספירלנד: day 3's winning comment (@liroyrokach, "בסיס צבאי גדול נגד הדרקונים"). The kingdom's defence base
// against the dragons, friendly and for kids: no guns, only water. A walled square of about 62 × 62 with a gate toward the
// castle (+z) and a striped barrier, four watchtowers with searchlights, the headquarters with a radar dish and the flag,
// a parade ground with soldiers standing in line, three barracks (the מגורים צבאיים residents can move into), two giant
// water cannons pointing at the sky, the dragon alarm siren, a helipad with a little helicopter, an obstacle course,
// a jeep at the gate and sandbags. Drawn on a big lot (radius 32), front toward +z.
import { sign } from '../sign.js';
const SAND = 0xd8c79a, OLIVE = 0x6f7f4a, DOLIVE = 0x56643a, KHAKI = 0xb9a76f, WALL = 0xe9dfc8, NAVY = 0x13213b, TEAL = 0x0f6f73,
  GOLD = 0xe8b323, RED = 0xc2412d, ROOF = 0x8a4b3a, WHITE = 0xf6f1e6, DARK = 0x3a3f45, METAL = 0x9aa3ab, WATER = 0x3fa9d6,
  GLASS = 0x7fb3c9, SKIN = 0xe2b48f, WOOD = 0x8a6240, GRASS = 0x7fae5a, ASPH = 0x6b6f75;

/** a soldier in a helmet, standing to attention (salute: the right hand up at the helmet) */
function soldier(p, x, z, rot, salute = false) {
  p.at(x, z, rot);
  p.box(-.4, 0, 0, .55, 1.7, .6, DOLIVE); p.box(.4, 0, 0, .55, 1.7, .6, DOLIVE); p.box(-.4, 0, .1, .6, .35, .8, DARK); p.box(.4, 0, .1, .6, .35, .8, DARK);
  p.box(0, 1.7, 0, 1.6, 1.8, 1, OLIVE); p.box(0, 2.3, .51, 1.6, .25, .05, KHAKI);
  p.box(-1, 1.9, 0, .42, 1.6, .42, OLIVE);
  if (salute) { p.box(1, 2.9, .2, .42, 1.2, .42, OLIVE); p.box(.7, 3.9, .45, .42, .42, .42, SKIN); } else p.box(1, 1.9, 0, .42, 1.6, .42, OLIVE);
  p.box(0, 3.5, 0, 1.25, 1.25, 1.25, SKIN); p.box(-.3, 4, .63, .18, .18, .05, 0x222222); p.box(.3, 4, .63, .18, .18, .05, 0x222222);
  p.box(0, 4.6, 0, 1.55, .55, 1.55, DOLIVE); p.box(0, 4.45, 0, 1.75, .18, 1.75, DOLIVE);   // the helmet
  p.at(0, 0, 0);
}
/** a watchtower: four legs, a cabin with windows, a roof, a searchlight */
function watchtower(p, x, z) {
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) p.box(x + dx, 0, z + dz, .5, 11, .5, WOOD);
  for (const y of [3.5, 7]) { p.box(x, y, z - 2, 4.5, .3, .3, WOOD); p.box(x, y, z + 2, 4.5, .3, .3, WOOD); p.box(x - 2, y, z, .3, .3, 4.5, WOOD); p.box(x + 2, y, z, .3, .3, 4.5, WOOD); }
  p.box(x, 11, z, 6, .5, 6, WOOD); p.box(x, 11.5, z, 5.4, 2.6, 5.4, SAND);
  for (const [dx, dz, r] of [[0, 2.75, 0], [0, -2.75, 0], [2.75, 0, Math.PI / 2], [-2.75, 0, Math.PI / 2]]) p.box(x + dx, 12.6, z + dz, 3.6, 1.1, .1, GLASS, r);
  p.pyramid(x, 14.1, z, 6.4, 2.4, DOLIVE);
  p.cyl(x + 2.4, 14.1, z + 2.4, .9, .9, DARK); p.ball(x + 2.4, 14.6, z + 2.9, .9, .9, 0xfff3b0);   // the searchlight
  p.box(x, 0, z + 2.6, 1.2, 11, .2, METAL);                                                              // the ladder
  for (let k = 1; k < 11; k++) p.box(x, k, z + 2.7, 1.3, .12, .12, DARK);
}
/** a giant water cannon: a round tank, a turning base, and a barrel stepping up toward the sky (toward -z, the back) */
function waterCannon(p, x, z) {
  p.cyl(x, 0, z, 9, 1, DARK); p.cyl(x, 1, z, 7, 1.4, METAL);
  p.cyl(x - 5.5, 0, z + 3, 3.6, 5, WATER); p.cyl(x - 5.5, 5, z + 3, 3.8, .4, WHITE); p.box(x - 3.2, 1.5, z + 2, 2.4, .5, .5, METAL);   // the water tank and its pipe
  p.box(x, 2.4, z, 5, 3, 5, TEAL); p.box(x, 5.4, z, 4, .4, 4, NAVY); p.box(x, 3.2, z + 2.55, 3, 1.4, .1, GLASS);
  for (let k = 0; k < 7; k++) p.box(x, 4.4 + k * 1.15, z - 1.2 - k * 1.05, 1.6 - k * .05, 1.6, 1.6, k === 6 ? GOLD : METAL);
  p.box(x, 4.4 + 7 * 1.15, z - 1.2 - 7 * 1.05, 1.9, .6, 1.9, NAVY);                                  // the nozzle
  for (let k = 0; k < 4; k++) p.ball(x, 13.4 + k * 1.6, z - 9.5 - k * 1.3, 1.4 - k * .25, 1.4 - k * .25, 0xd6eef8);   // a little spray
}
/** a barracks: a long hut with a red gable roof, a door, small windows, a step */
function barracks(p, x, z, w, d) {
  p.box(x, 0, z, w, .4, d, 0xcfc4a8); p.box(x, .4, z, w - .4, 3.8, d - .4, WALL);
  p.gable(x, 4.2, z, w + .8, 2.6, d + .6, ROOF);
  p.box(x + w / 2 - .1, .4, z, .2, 2.6, 1.6, WOOD); p.box(x + w / 2 + .5, 0, z, 1.2, .4, 2.4, 0xbfb49a);   // the door toward the parade
  for (const dz of [-3.3, -1.8, 1.8, 3.3]) p.box(x + w / 2 - .1, 2, z + dz * d / 10, .2, 1, .9, GLASS);
  for (let k = 0; k < 3; k++) p.box(x - w / 2 + .1, 2, z - d / 2 + 2 + k * (d - 4) / 2, .2, 1, .9, GLASS);
  p.box(x, 6.6, z - d / 2 + 1.5, .2, 2, .2, DARK); p.box(x + .8, 7.8, z - d / 2 + 1.5, 1.6, 1, .1, TEAL);  // a little flag on the roof
}

export function drawBase(p) {
  p.at(0, 0, 0);
  // the walls: a square of 52 with its front corners cut (the neighbours' houses stand there), a gate toward the castle
  const S = 26, F = 12, DIAG = Math.hypot(S - F, S - F);
  p.box(0, 0, -S / 2 + F / 2, 2 * S, .1, S + F, SAND);
  for (let z = F; z < S; z += 1) { const half = S - (z - F); p.box(0, 0, z + .5, 2 * half, .1, 1, SAND); }
  p.box(0, 0, -S, 2 * S, 3.4, 1.2, WALL); p.box(-S, 0, (F - S) / 2, 1.2, 3.4, S + F, WALL); p.box(S, 0, (F - S) / 2, 1.2, 3.4, S + F, WALL);
  for (const sx of [-1, 1]) { p.box(sx * (S + F) / 2, 0, (S + F) / 2, 1.2, 3.4, DIAG, WALL, -sx * Math.PI / 4); p.box(sx * 9.5, 0, S, 5, 3.4, 1.2, WALL); }
  for (let i = -S + 1; i < S; i += 2.5) p.box(i, 3.4, -S, 1.6, .6, 1.3, KHAKI);
  for (let z = -S + 1; z < F; z += 2.5) { p.box(-S, 3.4, z, 1.3, .6, 1.6, KHAKI); p.box(S, 3.4, z, 1.3, .6, 1.6, KHAKI); }
  for (let k = 1; k < 8; k++) { const f = k / 8; for (const sx of [-1, 1]) p.box(sx * (S - (S - F) * f), 3.4, F + (S - F) * f, 1.6, .6, 1.3, KHAKI, -sx * Math.PI / 4); }
  // the road in from the gate, the parade ground with its lines
  p.box(0, 0, S + 3, 10, .14, 6, ASPH); p.box(0, 0, 20, 6, .13, 12, 0xc9b98b);
  p.box(-2, .1, 8, 20, .12, 12, 0xc4b48a); for (const x of [-12, 8]) p.box(x, .2, 8, .3, .05, 12, WHITE); for (const z of [2, 14]) p.box(-2, .2, z, 20, .05, .3, WHITE);
  // the gate: two pillars, a beam, gold balls
  for (const x of [-6, 6]) { p.box(x, 0, S, 2.2, 6.5, 2.2, OLIVE); p.box(x, 6.5, S, 2.8, .6, 2.8, DOLIVE); p.ball(x, 7.1, S, 1, 1, GOLD); }
  p.box(0, 6.8, S + .2, 13.6, .5, .6, DOLIVE);
  // the guard booth and the striped barrier, outside the gate
  p.box(-8.8, 0, S + 2.6, 3, 3.2, 3, WHITE); p.box(-8.8, 3.2, S + 2.6, 3.6, .5, 3.6, RED); p.box(-8.8, 1.5, S + 4.15, 2, 1.2, .1, GLASS);
  p.box(-4.6, 0, S + 3, .8, 1.4, .8, DARK);
  for (let i = 0; i < 8; i++) p.box(-3.6 + i * 1.1, 1.2, S + 3, 1.1, .35, .35, i % 2 ? WHITE : RED);
  soldier(p, -5.6, S + 4.6, 0, true);
  for (const sx of [-1, 1]) for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - r; k++) p.box(sx * (12.5 + k * 1.6 + r * .8), r * .7, S + 2.4, 1.5, .7, 1.1, KHAKI);
  // four watchtowers
  for (const [x, z] of [[-S + 3, -S + 3], [S - 3, -S + 3], [-S + 4, F + 2], [S - 4, F + 2]]) watchtower(p, x, z);
  // the headquarters: two storeys, a porch with columns, the flag, a radar dish on the roof, its sign on the roof
  const hz = -13;
  p.box(0, 0, hz, 24, .5, 12, 0xcfc4a8); p.box(0, .5, hz, 22, 7.5, 10, WALL); p.box(0, 8, hz, 23, .8, 11, OLIVE); p.box(0, 8.8, hz, 23.4, .3, 11.4, DOLIVE);
  for (let i = 0; i < 6; i++) for (const y of [1.8, 5.2]) if (!(y < 3 && Math.abs(i - 2.5) < 1)) p.box(-8.75 + i * 3.5, y, hz + 5.05, 2, 1.6, .1, GLASS);
  p.box(0, .5, hz + 5.05, 3, 3.2, .12, WOOD); p.box(0, 3.9, hz + 6.6, 8, .4, 3.2, OLIVE);
  for (const x of [-3.6, 3.6]) p.cyl(x, .5, hz + 7.8, .6, 3.4, WHITE);
  for (let k = 0; k < 3; k++) p.box(0, k * .17, hz + 8.4 + k * .4, 6, .17, 1, 0xbfb49a);
  for (const x of [-7, 7]) p.box(x, 9.1, hz + 4, .5, 2.4, .5, DARK);
  p.box(0, 11.2, hz + 4, 19.4, 3.6, .5, NAVY);
  p.cyl(-9, 9.1, hz - 2.5, 1.2, 2, DARK); p.cyl(-9, 11.1, hz - 2.5, 4.6, .4, METAL); p.cone(-9, 11.5, hz - 2.5, 1, 2, RED);   // the radar dish
  p.box(8, 9.1, hz - 2.5, 3, 1.4, 3, 0xdde2e6); p.box(4, 9.1, hz - 3, 1.6, 1.2, 2, 0xdde2e6);
  p.box(10.5, 9.1, hz + 1, .4, 10, .4, METAL); p.ball(10.5, 19.1, hz + 1, .7, .7, GOLD);                                 // the flagpole
  p.box(12.7, 16, hz + 1, 4, 2.6, .12, WHITE); p.box(12.7, 17.6, hz + 1, 4, .45, .14, TEAL); p.box(12.7, 16.2, hz + 1, 4, .45, .14, TEAL);
  p.box(12.7, 16.75, hz + 1, .9, .9, .16, GOLD);
  // soldiers in line on the parade ground, and their sergeant in front of them
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) soldier(p, -9.5 + c * 3, 4 + r * 3.2, 0, r === 0 && c === 2);
  soldier(p, -2, 13.5, Math.PI, true);
  for (let c = 0; c < 5; c++) { p.box(-10 + c * 4, 0, .8, .3, 6, .3, METAL); p.box(-9.2 + c * 4, 4.6, .8, 1.5, 1, .1, [TEAL, GOLD, RED, NAVY, OLIVE][c]); }
  // three barracks on the left: the residents' מגורים צבאיים
  for (const z of [-18, -5.5, 6.5]) barracks(p, -19.5, z, 9, 10);
  // two giant water cannons on the right, and the dragon alarm
  waterCannon(p, 19, -18); waterCannon(p, 19, -3.5);
  p.cyl(22, 0, 6.5, .8, .8, DARK); p.box(22, 0, 6.5, .4, 13, .4, METAL);
  for (const r of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) { const dx = Math.sin(r) * 1.1, dz = Math.cos(r) * 1.1; p.box(22 + dx, 12, 6.5 + dz, 1.4, 1.4, 1.4, RED, r); p.cyl(22 + dx * 1.7, 12.2, 6.5 + dz * 1.7, 1.2, 1, 0xf2f2f2); }
  p.ball(22, 13.6, 6.5, 1, 1, 0xff6a4d);
  // the helipad and a little helicopter
  const hx = 14, hy = 15;
  p.cyl(hx, 0, hy, 10, .2, ASPH); p.cyl(hx, .2, hy, 8.4, .05, WHITE); p.cyl(hx, .25, hy, 7.6, .05, ASPH);
  p.box(hx - 1.4, .3, hy, .7, .03, 4.6, WHITE); p.box(hx + 1.4, .3, hy, .7, .03, 4.6, WHITE); p.box(hx, .3, hy, 2.2, .03, .7, WHITE);
  p.at(hx, hy, -.6);
  p.box(0, .5, 1.2, 2.6, 2.4, 3.6, TEAL); p.box(0, 1.2, 3, 2.2, 1.6, .2, GLASS); p.box(0, 1.4, -2.4, .8, .8, 4.4, TEAL); p.box(0, 1.4, -4.6, .2, 1.6, 1, GOLD);
  p.box(-1, 0, 1.2, .2, .5, 4, DARK); p.box(1, 0, 1.2, .2, .5, 4, DARK); p.cyl(0, 2.9, 1.2, .3, .5, DARK);
  p.box(0, 3.4, 1.2, 9, .12, .5, DARK, .5); p.box(0, 3.4, 1.2, .5, .12, 9, DARK, .5); p.at(0, 0, 0);
  // the obstacle course behind the headquarters: tyres, a climbing wall, a rope net
  for (let k = 0; k < 6; k++) p.cyl(-9 + k * 2.2, 0, -22.5 + (k % 2) * .8, 1.6, .7, 0x2b2f36);
  p.box(4, 0, -22.5, 4, 3.6, .6, WOOD); for (let k = 0; k < 4; k++) p.box(4, .6 + k * .8, -22.1, .4, .2, .4, RED);
  p.box(9, 0, -22.5, .3, 3.2, .3, WOOD); p.box(13, 0, -22.5, .3, 3.2, .3, WOOD); p.box(11, 3, -22.5, 4.3, .2, .2, WOOD);
  for (let k = 0; k < 5; k++) p.box(9.4 + k * .8, .4, -22.5, .08, 2.6, .08, KHAKI);
  // a jeep and a water truck inside the gate, crates
  p.at(6.5, 20, -.2); p.box(0, .7, 0, 3, 1.5, 5, OLIVE); p.box(0, 2.2, -.6, 2.8, 1.2, 2.4, DOLIVE); p.box(0, 2.3, .62, 2.6, .9, .1, GLASS);
  for (const [dx, dz] of [[-1.5, 1.6], [1.5, 1.6], [-1.5, -1.6], [1.5, -1.6]]) p.cyl(dx, 0, dz, 1.4, 1.2, DARK); p.cyl(0, .9, -2.7, 1.3, .8, DARK); p.at(0, 0, 0);
  p.at(-7, 19, .15); p.box(0, .8, 1.8, 3, 2.4, 2.6, RED); p.box(0, 2, 3.1, 2.6, 1, .1, GLASS); p.cyl(0, .9, -1.6, 3, 2.6, WATER); p.box(0, .5, -1.6, 3, .5, 5, DARK);
  for (const dz of [2, -.6, -3]) { p.cyl(-1.5, 0, dz, 1.3, 1, DARK); p.cyl(1.5, 0, dz, 1.3, 1, DARK); } p.at(0, 0, 0);
  for (const [x, z, h] of [[23.5, -10, 1], [23.5, -11.4, 1], [23.5, -10.7, 2], [-23.5, -24, 1], [-22.1, -24, 1]]) p.box(x, (h - 1) * 1.2, z, 1.3, 1.2, 1.3, WOOD);
  // a bit of green, outside by the gate
  for (const [x, z] of [[-13, 30], [13, 30], [-18, 27.5], [18, 27.5]]) p.tree(x, z, .8, GRASS);
}
export function baseLive(group) {
  group.add(sign('צבא ההגנה לספירלנד', { w: 13, h: 2.2, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 8.4, 26.6));
  group.add(sign('צבא ההגנה לספירלנד', { w: 18.6, h: 3.2, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 13, -8.7));
  group.add(sign('מגורים צבאיים', { w: 6.4, h: 1.6, bg: '#fffaf0' }).at(-14.9, 3.4, 6.5, Math.PI / 2));
  group.add(sign('מחפשים חיילים! תגיבו "חייל"', { w: 8, h: 1.6, bg: '#e8b323' }).at(-14.9, 3.4, -5.5, Math.PI / 2));
  group.add(sign('אזעקת דרקונים', { w: 5, h: 1.3, bg: '#c2412d', fg: '#ffffff', border: '#ffffff' }).at(22, 7, 6.8));
  group.add(sign('זהירות, דרקונים!', { w: 5.4, h: 1.4, bg: '#ffd23f' }).at(-8.8, 4.6, 30.15));
  group.add(sign('תותח מים', { w: 4, h: 1.2, bg: '#fffaf0' }).at(19, 3.6, -.9));
}
export const BASE = { key: 'base', name: 'צבא ההגנה לספירלנד', draw: drawBase, live: baseLive, top: 18 };
