// ספיר סינמה: day 18, @ofek_bell's comment "יאללה מחר תעשו בעיר את הספיר סינמה בית קולנוע 🎦🎞️📽️🎬" (the architect of the zoo,
// again). An old style movie palace: a cream hall with navy and gold bands, a tall blade sign "סינמה" over the door, a canopy
// with a ring of light bulbs, a giant striped popcorn bucket on the roof and a giant clapperboard that snaps (live), two
// searchlights that sweep the sky, and a big screen over the canopy playing the films the followers name. In front: a red carpet
// between gold posts and ropes, a ticket booth, a popcorn cart, posters of the films the followers name (FILMS), a queue of people-sized visitors,
// benches, lamps and trees. Lot radius 30, front toward +z.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
const CREAM = 0xfbf3e2, CREAM2 = 0xeee2c8, NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, RED = 0xc8102e, RED2 = 0xa30d26,
  PAVE = 0xe9e0cc, PAVE2 = 0xd8ccb2, DARK = 0x2b2f36, WHITE = 0xf6f3ee, GLASS = 0x9fd6ee, BULB = 0xfff1b8, SKIN = 0xe2b48f, WOOD = 0x8a6240;

function person(p, x, z, r, shirt, h = .55) {
  p.at(x, z, r); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
  p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020);
  p.at(0, 0, 0);
}

export function drawCinema(p) {
  p.at(0, 0, 0);
  // the ground: a round plaza, a lawn ring at the back
  p.cyl(0, 0, 0, 59, .2, 0x86c766); p.box(0, .2, 15, 44, .12, 26, PAVE);
  for (let i = -5; i <= 5; i++) p.box(i * 4, .33, 15, .12, .02, 26, PAVE2);                             // paving lines
  // the hall: two floors of cream, a navy plinth, gold bands, a stepped art deco top
  p.box(0, 0, -8, 40, 1, 24, NAVY);
  p.box(0, 1, -8, 40, 13, 24, CREAM);
  p.box(0, 6.6, 4.05, 40, .5, .2, GOLD); p.box(0, 13.4, 4.05, 40, .6, .2, GOLD);
  p.box(0, 14, -8, 38, 1.4, 22, CREAM2); p.box(0, 15.4, -8, 30, 1.2, 18, CREAM);
  p.box(0, 14, 3.1, 38, .4, .3, NAVY);
  // a film strip running round the top band: dark frames with holes
  for (let i = -9; i <= 9; i++) { p.box(i * 2.05, 11.2, 4.1, 1.7, 1.6, .12, DARK); p.box(i * 2.05, 12.25, 4.18, .5, .3, .05, WHITE); p.box(i * 2.05, 10.65, 4.18, .5, .3, .05, WHITE); }
  // side pilasters with gold caps
  for (const x of [-19.5, -12.5, 12.5, 19.5]) { p.box(x, 1, 4.2, 1.2, 12.4, .5, CREAM2); p.box(x, 13.2, 4.3, 1.5, .8, .6, GOLD); }
  // windows on the upper floor (between the pilasters) and on the sides
  for (const x of [-17.5, -14.5, 14.5, 17.5]) { p.box(x, 7.6, 4.08, 1.8, 2.6, .1, GLASS); p.box(x, 7.4, 4.12, 2.2, .3, .1, NAVY); }
  for (const z of [-17, -12, -7, -2]) for (const sx of [-1, 1]) { p.box(sx * 20.05, 7.6, z, .1, 2.6, 2, GLASS); p.box(sx * 20.05, 2.4, z, .1, 2.6, 2, GLASS); }
  // the doors: three pairs of glass doors with gold frames, under the canopy
  for (const x of [-6, 0, 6]) { p.box(x, 1, 4.05, 4, 4.2, .1, GOLD); p.box(x - 1, 1.2, 4.1, 1.8, 3.8, .08, GLASS); p.box(x + 1, 1.2, 4.1, 1.8, 3.8, .08, GLASS); p.box(x, 1.2, 4.14, .15, 3.8, .06, GOLD); }
  // the posters between the doors and the pilasters (the films are painted in live)
  for (const x of [-10, 10]) { p.box(x, 1.3, 4.1, 3.2, 4.4, .12, GOLD); }
  // the canopy over the doors: a navy slab with a gold edge and a ring of bulbs
  p.box(0, 5.2, 7, 22, 1.2, 6, NAVY); p.box(0, 5, 10, 22.4, .3, .3, GOLD); p.box(0, 6.4, 7, 22.4, .3, 6.4, GOLD);
  for (let i = 0; i < 22; i++) { p.ball(-10.5 + i, 5.55, 10.2, .36, .36, BULB); }
  for (let i = 0; i < 6; i++) { p.ball(-11.2, 5.55, 4.6 + i, .36, .36, BULB); p.ball(11.2, 5.55, 4.6 + i, .36, .36, BULB); }
  for (const x of [-10.6, 10.6]) p.cyl(x, 0, 9.6, .4, 5.2, GOLD);                                    // the canopy's posts
  // the blade sign: a tall navy fin over the canopy with gold bulbs up both edges, a crown of a star on top
  const BX = 16;
  p.box(BX, 6.6, 5, 3, 22, 1.6, NAVY); p.box(BX, 6.6, 5.85, 3.4, 22, .1, GOLD);
  for (let i = 0; i < 20; i++) { p.ball(BX - 1.6, 7.4 + i * 1.05, 6, .34, .34, BULB); p.ball(BX + 1.6, 7.4 + i * 1.05, 6, .34, .34, BULB); }
  p.cone(BX, 28.6, 5, 2, 2.4, GOLD); p.ball(BX, 31.2, 5, 1.2, 1.2, GOLD);
  // the giant popcorn bucket on the roof: red and white stripes, a pile of popcorn spilling over
  const PB = [7, 16.6, -10];
  for (let i = 0; i < 14; i++) { const a = i / 14 * 2 * Math.PI; p.at(PB[0] + Math.sin(a) * 4.2, PB[2] + Math.cos(a) * 4.2, a); p.box(0, PB[1], 0, 2, 10, .5, i % 2 ? WHITE : RED); }
  p.at(0, 0, 0); p.cyl(PB[0], PB[1], PB[2], 8.2, 9.8, 0xfff4d6); p.cyl(PB[0], PB[1] + 9.6, PB[2], 9, .5, GOLD);
  for (let i = 0; i < 34; i++) { const a = i * 2.4, rr = (i % 5) * 0.95; p.ball(PB[0] + Math.sin(a) * rr, PB[1] + 9.8 + (i % 5) * .5 - rr * .25, PB[2] + Math.cos(a) * rr, 1.7, 1.5, i % 3 ? 0xfff2c4 : 0xffe08a); }
  for (const [x, z] of [[3, -5], [11, -14], [3.4, -15], [11.6, -6]]) p.ball(x, 15.4, z, 1.1, 1, 0xfff2c4);   // fallen popcorn
  // the giant clapperboard on the roof: a striped board; its striped arm is live (it snaps)
  const CB = -10;
  p.box(CB, 16.6, -8, 9, 6, 1, DARK); p.box(CB, 16.6, -7.45, 8.2, 3.6, .1, WHITE);
  for (let i = 0; i < 5; i++) p.box(CB - 3.6 + i * 1.8, 21.4, -8, .9, 1.4, 1.02, i % 2 ? WHITE : DARK);
  // the searchlights at the front corners: drums on stands (the beams are live)
  for (const x of [-17, 17]) { p.cyl(x, .3, 20, 2.4, 1, DARK); p.box(x, 1.3, 20, .6, 1.4, .6, DARK); p.cyl(x, 2.4, 20, 2, 1.6, 0x9aa4b3); p.cyl(x, 3.9, 20, 1.6, .2, BULB); }
  // the red carpet with gold posts and red ropes
  p.box(0, .34, 17, 7, .06, 14, RED);
  for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { p.cyl(sx * 4.2, .3, 11 + i * 2.4, .3, 2, GOLD); p.ball(sx * 4.2, 2.3, 11 + i * 2.4, .5, .5, GOLD); if (i < 5) p.box(sx * 4.2, 1.7, 12.2 + i * 2.4, .14, .14, 2.3, RED2); }
  // the ticket booth on the right: a little round kiosk with a gold dome
  p.cyl(13, .3, 13, 4.2, 3.4, CREAM); p.cyl(13, 3.7, 13, 4.6, .4, NAVY); p.ball(13, 4, 13, 3.6, 2.4, GOLD); p.ball(13, 6.3, 13, .6, .6, RED);
  p.box(13, 1.6, 15.05, 2.2, 1.4, .1, GLASS); p.box(13, 1.4, 15.3, 2.6, .2, .6, WOOD);
  // the popcorn cart on the left: red with gold wheels and a glass box of popcorn
  p.at(-13, 13, .4); p.box(0, .9, 0, 3.4, 1.8, 1.8, RED); p.cyl(-1.2, .1, 1, 1.2, .3, GOLD); p.cyl(1.2, .1, 1, 1.2, .3, GOLD);
  p.box(0, 2.7, 0, 2.6, 2, 1.4, GLASS); p.box(0, 2.8, 0, 2.2, .9, 1.1, 0xfff2c4); p.box(0, 4.7, 0, 3.2, .3, 2, RED); p.box(0, 5, 0, 3.4, .15, 2.2, WHITE);
  p.at(0, 0, 0);
  // the queue to the booth and people on the carpet
  const SH = [0x5ec8f2, 0xf5a623, 0x7ed957, 0xb28dff, 0xff6b6b, 0x0f6f73, 0xffe066, 0xe36fa3];
  [[13, 17.6, Math.PI], [13.4, 19.2, Math.PI], [12.6, 20.8, Math.PI], [13.2, 22.4, Math.PI], [-1.2, 15, Math.PI], [1.4, 18.4, Math.PI], [-13, 15.8, Math.PI], [-11.6, 16.6, -2.4],
   [7.6, 22, 3], [-7, 21, 2.6]].forEach(([x, z, r], i) => person(p, x, z, r, SH[i % SH.length]));
  // a giant pair of 3D glasses on a stand in the plaza: take a photo in them
  p.at(-7.6, 24.6, 0); p.box(0, 0, 0, .3, 3.2, .3, DARK); p.box(0, 3.2, 0, 5.2, .3, .3, DARK);
  p.box(-1.3, 3.4, 0, 2.2, 1.4, .2, 0xe0473a); p.box(1.3, 3.4, 0, 2.2, 1.4, .2, 0x3a8fe0); p.box(0, 3.9, 0, .5, .3, .25, DARK);
  p.at(0, 0, 0);
  // lamps, benches, trees round the plaza and the back
  for (const [x, z] of [[-20, 10], [20, 10], [-20, 26], [20, 26], [-5.6, 27], [5.6, 27]]) { p.cyl(x, 0, z, .3, 4.4, NAVY); p.ball(x, 4.4, z, 1, 1, 0xfff4c2); }
  for (const [x, z, r] of [[-17, 8, Math.PI / 2], [17, 8, -Math.PI / 2], [7.4, 27, Math.PI], [-1, 27.4, Math.PI]]) { p.at(x, z, r); p.box(0, .5, 0, 2.4, .2, .8, WOOD); p.box(0, .9, -.35, 2.4, .7, .14, WOOD); p.box(-1, 0, 0, .2, .5, .7, DARK); p.box(1, 0, 0, .2, .5, .7, DARK); }
  p.at(0, 0, 0);
  for (const [x, z, s] of [[-24, 4, 1.4], [24, 4, 1.4], [-23, -12, 1.6], [23, -12, 1.6], [-14, -24, 1.4], [0, -25, 1.3], [14, -24, 1.4], [-25, 18, 1.2], [25, 18, 1.2]]) p.tree(x, z, s);
  for (const x of [-19, 19]) { p.box(x, .3, 26.4, 2, .6, 2, NAVY); p.ball(x, .9, 26.4, 1.6, 1.4, 0xe36fa3); }   // flower tubs
}

/** the films the followers named (follow, comment a film's name; the most liked go on the screen and the posters).
 *  Until a name is chosen the screen asks for one. e.g. FILMS = ['הדרקון שאכל את הירח'] */
export const FILMS = [];
const SLIDES = () => FILMS.length
  ? FILMS.map((t, i) => ({ t, s: i ? 'בקרוב בקולנוע 🎬' : 'עכשיו בקולנוע 🍿', bg: ['#0f6f73', '#8e5bd6', '#13213b', '#c8102e'][i % 4] }))
  : [{ t: 'הסרט הראשון: ???', s: 'אתם בוחרים את השם 🎬', bg: '#13213b' },
     { t: 'תגיבו שם לסרט', s: 'הכי הרבה לייקים = על המסך 🍿', bg: '#c8102e' }];

function screen() {
  const c = document.createElement('canvas'); c.width = 960; c.height = 400;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 5.8), new THREE.MeshBasicMaterial({ map: tex }));
  let shown = -1;
  const paint = i => {
    const f = SLIDES()[i], g = c.getContext('2d');
    g.fillStyle = '#e8b323'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = f.bg; g.fillRect(14, 14, c.width - 28, c.height - 28);
    g.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 9; k++) g.fillRect(40 + k * 102, 30, 60, 30), g.fillRect(40 + k * 102, c.height - 60, 60, 30);
    g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff';
    let px = 120; g.font = `900 ${px}px Rubik`; while (g.measureText(f.t).width > c.width - 80 && px > 40) g.font = `900 ${px -= 6}px Rubik`;
    g.fillText(f.t, c.width / 2, 170); g.fillStyle = '#e8b323'; px = 66; g.font = `800 ${px}px Rubik`; while (g.measureText(f.s).width > c.width - 80 && px > 30) g.font = `800 ${px -= 4}px Rubik`; g.fillText(f.s, c.width / 2, 290);
    tex.needsUpdate = true; shown = i;
  };
  paint(0); document.fonts?.load('900 40px Rubik').then(() => paint(shown)).catch(() => {});
  mesh.userData.show = t => { const i = Math.floor(t / 3.2) % SLIDES().length; if (i !== shown) paint(i); };
  return mesh;
}

export function cinemaLive(group) {
  const big = '900 {px}px Rubik';
  // the blade sign: סינמה down the fin, one letter a board (Hebrew reads top to bottom here)
  [...'סינמה'].forEach((ch, i) => group.add(sign(ch, { w: 2.4, h: 2.6, bg: '#13213b', fg: '#e8b323', border: '#13213b', font: big }).at(16, 25.4 - i * 3.6, 5.95)));
  // the canopy's front: the name, and the architect
  group.add(sign('ספיר סינמה 🎬', { w: 20, h: 1.15, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: big }).at(0, 5.8, 10.2));
  group.add(sign('רעיון של @ofek_bell · אדריכל', { w: 8, h: 1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 4.3, 10.22));
  // the big screen over the canopy, framed in gold
  const scr = screen(); scr.position.set(0, 9.6, 4.25); group.add(scr);
  group.add(Object.assign(new THREE.Mesh(new THREE.PlaneGeometry(15, 6.8), new THREE.MeshBasicMaterial({ color: 0xe8b323 })), {}).translateY(9.6).translateZ(4.2));
  // the posters beside the doors: the followers' first two films, or "?" until they are named
  for (const [k, x] of [[0, -10], [1, 10]]) {
    const t = FILMS[k];
    group.add(sign(t || `סרט ${k + 1}`, { w: 2.9, h: 1.1, bg: k ? '#8e5bd6' : '#0f6f73', fg: '#ffffff', border: '#e8b323', font: big }).at(x, 4.2, 4.2));
    group.add(sign(t ? (k ? 'בקרוב' : 'עכשיו') : '?', { w: 2.9, h: 2.9, bg: '#f6f3ee', fg: k ? '#8e5bd6' : '#0f6f73', border: k ? '#8e5bd6' : '#0f6f73', font: big }).at(x, 2.3, 4.2));
  }
  // the ticket booth, the popcorn cart, the clapperboard, the glasses
  group.add(sign('כרטיסים 🎟️', { w: 3, h: .8, bg: '#c8102e', fg: '#ffffff', border: '#e8b323', font: big }).at(13, 3.1, 15.12));
  const pc = sign('פופקורן 🍿', { w: 3.2, h: .9, bg: '#ffffff', fg: '#c8102e', border: '#c8102e', font: big }); pc.position.set(-13 + Math.sin(.4) * 1.12, 5.6, 13 + Math.cos(.4) * 1.12); pc.rotation.y = .4; group.add(pc);
  group.add(sign('ספיר סינמה · טייק 1', { w: 7, h: 1.4, bg: '#f6f3ee', fg: '#13213b', border: '#2b2f36', font: big }).at(-10, 18.4, -7.38));
  group.add(sign('תצטלמו! 📸', { w: 3, h: .8, bg: '#ffffff', fg: '#13213b', border: '#13213b', font: big }).at(-7.6, 1.6, 24.8));
  // the clapperboard's arm: a striped bar hinged at its left end, it snaps shut and opens
  const arm = new THREE.Group(); arm.position.set(-14.4, 19.7, -8);
  const ap = new Pen(); for (let i = 0; i < 5; i++) ap.box(.9 + i * 1.8, 0, 0, .9, 1.2, 1.04, i % 2 ? WHITE : DARK); ap.box(4.5, -.1, 0, 9.1, .2, 1.1, DARK);
  ap.build(arm); group.add(arm);
  // the searchlights' beams: long soft cones that sweep the sky
  const beams = [-17, 17].map((x, k) => {
    const piv = new THREE.Group(); piv.position.set(x, 4, 20);
    const m = new THREE.Mesh(new THREE.ConeGeometry(4, 60, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6d0, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide }));
    m.position.y = 30; m.rotation.x = Math.PI; piv.add(m); group.add(piv); return { piv, k };
  });
  group.userData.screen = scr; group.userData.arm = arm;
  group.userData.tick = t => {
    scr.userData.show(t);
    const c = (t % 2.4) / 2.4; arm.rotation.z = c < .15 ? .5 * (1 - c / .15) : c < .7 ? 0 : .5 * (c - .7) / .3;
    for (const { piv, k } of beams) { piv.rotation.z = (k ? -1 : 1) * (.35 + Math.sin(t * .9 + k * 1.7) * .25); piv.rotation.x = -.25 + Math.cos(t * .7 + k) * .12; }
  };
  group.userData.tick(0);
}

export const CINEMA = { key: 'cinema', name: 'ספיר סינמה', draw: drawCinema, live: cinemaLive, top: 32 };
