// כיכר הבחירות: day 11, the royal elections. King Michael called elections for the royal presidency of Sapirland, and four
// candidates stand on the stage: ביבקוביץ', יאירדו, לבט and מסקנטייפ (made-up royal figures, no real person, no real
// politics; their promises are about the kingdom only). Each stands on a pedestal under a banner with his name and promise;
// the figures are 3D models from site/models/<key>.glb (models.js), and until a model exists a draped statue waits in its
// place. Above each, a bar grows with his votes (setVotes: a comment with his name is a vote, citizens count). In front, a
// giant golden ballot box (קלפי) with a crown, flags, bunting, a crowd with signs, trees. Lot radius 26, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
import { place } from '../models.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xfbf3e2, RED = 0xc8102e, WHITE = 0xf7f7f2, STONE = 0xe3d9c6,
  GRASS = 0x86c766, DARK = 0x3a3f45, SKIN = 0xe2b48f, WOOD = 0x8a6240, PURPLE = 0x6b3fa0, GREEN = 0x1f8a4c;
export const CANDIDATES = [
  { key: 'bibkovich', name: "ביבקוביץ'", promise: 'אביס את הדרקונים ואביא שלום לממלכה', color: NAVY, fg: '#e8b323', bg: '#13213b' },
  { key: 'yairdo', name: 'יאירדו', promise: 'נחליף את השלטון העתיק, וכולם יהיו מלכים', color: TEAL, fg: '#ffffff', bg: '#0f6f73' },
  { key: 'lebet', name: 'לבט', promise: 'אבנה ממלכה חדשה', color: GREEN, fg: '#ffffff', bg: '#1f8a4c' },
  { key: 'mascentape', name: 'מסקנטייפ', promise: 'חופש מהעבודה לכולם, כל הזמן', color: PURPLE, fg: '#ffffff', bg: '#6b3fa0' },
];
export const XS = [-15.6, -5.2, 5.2, 15.6], STAGE_Z = -8, STAGE_H = 2.6, PED_H = 2.2, FIG_H = 7.5;

function person(p, x, z, rot, shirt, sign = false) {
  p.at(x, z, rot); p.box(-.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(.3, 0, 0, .45, 1.4, .5, 0x2a3550); p.box(0, 1.4, 0, 1.2, 1.4, .8, shirt);
  p.box(0, 2.8, 0, .9, .9, .9, SKIN); p.box(0, 3.6, 0, .95, .25, .95, 0x4a3020);
  if (sign) { p.box(.8, 2.2, 0, .12, 2.6, .12, WOOD); p.box(.8, 4.4, 0, 1.6, 1, .08, sign); } p.at(0, 0, 0);
}
export function drawElections(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 52, .08, 52, GRASS); p.box(0, .08, 2, 48, .12, 40, STONE);
  for (let x = -22; x <= 22; x += 4) for (let z = -16; z <= 20; z += 4) if ((x + z) % 8 === 0) p.box(x, .2, z, 3.8, .02, 3.8, 0xd8ccb3);
  // the stage: a platform with steps, a red carpet, a backdrop in navy with gold, four pedestals
  p.box(0, .1, STAGE_Z, 42, STAGE_H, 11, CREAM); p.box(0, STAGE_H + .1, STAGE_Z, 42.4, .3, 11.4, GOLD);
  for (let k = 0; k < 4; k++) p.box(0, .1, STAGE_Z + 5.5 + (3 - k) * 1.1, 12, STAGE_H * (k + 1) / 4, 1.1, CREAM);   // the steps up
  p.box(0, .22, 6, 4, .04, 14, RED); p.box(0, STAGE_H + .45, STAGE_Z + 2.5, 4, .04, 6, RED);
  p.box(0, STAGE_H + .4, STAGE_Z - 5.2, 44, 16, 1, NAVY); p.box(0, STAGE_H + 16.4, STAGE_Z - 5.2, 44.6, .8, 1.4, GOLD);
  for (const x of [-22, 22]) p.box(x, STAGE_H + .4, STAGE_Z - 5.2, 1.2, 16.8, 1.4, GOLD);
  p.cone(0, STAGE_H + 17.2, STAGE_Z - 5.2, 5, 4, GOLD);
  for (const [i, x] of XS.entries()) { const c = CANDIDATES[i];
    p.cyl(x, STAGE_H + .4, STAGE_Z + .5, 3.4, PED_H, WHITE); p.cyl(x, STAGE_H + .4 + PED_H, STAGE_Z + .5, 3.8, .35, GOLD); p.cyl(x, STAGE_H + .4, STAGE_Z + .5, 3.9, .35, GOLD);
    p.box(x, STAGE_H + .5, STAGE_Z - 4.6, 9, .3, .2, c.color); }
  // microphones at the front of the stage
  for (const x of XS) { p.box(x, STAGE_H + .4, STAGE_Z + 3.6, .15, 3, .15, DARK); p.ball(x, STAGE_H + 3.5, STAGE_Z + 3.6, .5, .6, DARK); }
  // the ballot box: a big golden box with a slot, a crown on top, the royal seal
  p.box(0, .2, 10, 7.5, 6.5, 6, GOLD); p.box(0, 6.7, 10, 8, .5, 6.5, 0xd4a017); p.box(0, 7.2, 10, 3.2, .2, .6, DARK);
  p.cyl(0, 7.4, 10, 2.6, 1.2, GOLD); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; p.cone(Math.cos(a) * 1.9, 8.6, 10 + Math.sin(a) * 1.9, 1, 1.8, GOLD); p.ball(Math.cos(a) * 1.9, 10.4, 10 + Math.sin(a) * 1.9, .5, .5, k % 2 ? RED : 0x3b6fb6); }
  p.cyl(0, 3, 13.05, 2, .2, NAVY);
  // a falling ballot halfway into the slot
  p.box(0, 7.6, 10, 1.6, 1.2, .08, WHITE);
  // flag poles with the kingdom's colours, bunting between them
  for (const [x, z] of [[-24, -14], [24, -14], [-24, 20], [24, 20], [-24, 3], [24, 3]]) { p.box(x, 0, z, .35, 14, .35, 0xb9c1c8); p.box(x + 1.4, 11.6, z, 2.6, 1.7, .08, [NAVY, TEAL, GREEN, PURPLE, GOLD, RED][(x + z + 100) % 6]); p.ball(x, 14, z, .5, .5, GOLD); }
  for (const s of [-1, 1]) for (let k = 0; k < 16; k++) { const z = -14 + k * 2.2; p.box(s * 24, 8.4 - Math.sin(k / 15 * Math.PI) * 1.4, z, .1, 1.1, .9, [RED, GOLD, TEAL, PURPLE][k % 4]); }
  // the crowd: people facing the stage, some with signs in their candidate's colour
  let k = 0; for (let z = 6; z <= 21; z += 3) for (let x = -20; x <= 20; x += 3.2) { if (Math.abs(x) < 6 && z < 15) continue; if ((k++ * 7) % 5 === 0) continue;
    person(p, x + Math.sin(k) * .6, z + Math.cos(k) * .5, Math.PI + Math.sin(k * 3) * .3, [RED, TEAL, GOLD, 0x3b6fb6, 0xf29bb7, GREEN][k % 6], k % 3 === 0 ? CANDIDATES[k % 4].color : false); }
  for (const [x, z] of [[-24, 24], [24, 24], [-12, -22], [12, -22], [0, -22]]) p.tree(x, z, 1.1);
  // two screens on the backdrop's sides: the count
  for (const x of [-26, 26]) { p.box(x * .9, 0, STAGE_Z + 2, .8, 9, .8, DARK); p.box(x * .9, 9, STAGE_Z + 2, 1, 6, 8, NAVY); }
}
/** the draped statue that waits for a candidate's model */
function veil(x, y, z) { const p = new Pen(); p.at(x, z, 0, y); p.cone(0, 0, 0, 3.2, 6.5, 0xd9d2c4); p.ball(0, 6.2, 0, 1.4, 1.2, 0xd9d2c4); p.box(0, 0, 0, 3.4, .25, 3.4, GOLD); return p.build(new THREE.Group()); }

export function electionsLive(group) {
  group.add(sign('כיכר הבחירות 🗳️', { w: 14, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, STAGE_H + 14.6, STAGE_Z - 4.6));
  group.add(sign('הבחירות לנשיאות המלכותית של ספירלנד', { w: 20, h: 1.4, bg: '#fffaf0', fg: '#13213b', border: '#e8b323' }).at(0, STAGE_H + 12.6, STAGE_Z - 4.6));
  group.add(sign('קלפי 👑', { w: 6, h: 1.8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 4.6, 13.1));
  group.add(sign('תגיבו את שם המועמד שלכם', { w: 7, h: .9, bg: '#fffaf0', fg: '#13213b', border: '#13213b' }).at(0, 2.2, 13.1));
  const bars = [], figures = [];
  CANDIDATES.forEach((c, i) => { const x = XS[i], top = STAGE_H + .4 + PED_H + .35;
    group.add(sign(c.name, { w: 8.6, h: 1.9, bg: c.bg, fg: c.fg, border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(x, STAGE_H + 9.6, STAGE_Z - 4.6));
    group.add(sign(c.promise, { w: 9.2, h: 1.1, bg: '#fffaf0', fg: '#13213b', border: c.bg }).at(x, STAGE_H + 8.1, STAGE_Z - 4.6));
    group.add(sign(c.name, { w: 3.6, h: .8, bg: c.bg, fg: c.fg, border: '#e8b323' }).at(x, STAGE_H + 1.5, STAGE_Z + 2.45));
    // his vote bar on the backdrop: grows with the votes
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, .3), new THREE.MeshLambertMaterial({ color: 0xe8b323, emissive: 0x3a2a00 })); bar.position.set(x + 3.8, STAGE_H + 1, STAGE_Z - 4.5); bar.scale.y = .01; group.add(bar);
    const count = sign('0', { w: 2.4, h: 1, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }); count.position.set(x + 3.8, STAGE_H + 1.6, STAGE_Z - 4.3); group.add(count); bars.push({ bar, count, c });
    const v = veil(x, top, STAGE_Z + .5); group.add(v);
    const fig = place(group, `models/${c.key}.glb`, { at: [x, top, STAGE_Z + .5], h: FIG_H, key: c.key }); figures.push(fig);
    fig.userData.job.then(() => { v.visible = !fig.userData.ok; }); });
  group.userData.figures = figures;
  /** votes: { key: n }; the bars grow to 6 m for the leader */
  group.userData.setVotes = votes => { const max = Math.max(1, ...Object.values(votes ?? {}));
    for (const b of bars) { const n = votes?.[b.c.key] ?? 0; b.bar.scale.y = Math.max(.01, n / max * 5.6); b.bar.position.y = STAGE_H + 1 + b.bar.scale.y / 2;
      b.count.position.y = STAGE_H + 1.4 + b.bar.scale.y + .6; const g = b.count.material.map.image.getContext('2d'); const W = g.canvas.width, H = g.canvas.height;
      g.fillStyle = '#e8b323'; g.fillRect(0, 0, W, H); g.fillStyle = '#13213b'; g.fillRect(4, 4, W - 8, H - 8); g.fillStyle = '#ffffff'; g.font = `800 ${H * .6}px Rubik`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), W / 2, H * .54); b.count.material.map.needsUpdate = true; } };
}
export const ELECTIONS = { key: 'elections', name: 'כיכר הבחירות', draw: drawElections, live: electionsLive, top: 24 };
