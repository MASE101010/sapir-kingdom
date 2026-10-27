// שדרת הפסלים: day 12, @nika_trav's comment "תעשו פסל של המועמדים". The four candidates for the royal presidency in gold,
// each on a tall stone pedestal with a band in his colour and a plaque with his name and promise, in an arc round a plaza
// with a fountain: ביבקוביץ' in his curly wig and glasses, waving; יאירדו in his plumed bicorne, fist up and pointing at you;
// לבט in his top hat and moustache, tipping it, with his cane; מאיסנקוט with his crown, long beard, ermine cape and sceptre,
// and a golden beach chair beside him (holidays for everyone). Voxel figures in the style of the king's statue (castle.js).
// Benches, lamps, flower beds, people taking photos, trees. Lot radius 30, front toward +z. Made-up figures only.
import * as THREE from 'three';
import { Pen } from '../pen.js';
import { sign } from '../sign.js';
import { CANDIDATES } from './elections.js';
const GOLD = 0xe8b323, DEEP = 0xc9962e, LIGHT = 0xf5d36b, SHINE = 0xfbe7a1, STONE = 0xe3d9c6, STONE2 = 0xd2c6ae, CREAM = 0xfbf3e2,
  NAVY = 0x13213b, PAVE = 0xe9e0cc, GRASS = 0x86c766, WATER = 0x3fa9d6, DARK = 0x3a3f45, SKIN = 0xe2b48f, WOOD = 0x8a6240;
const S = 2, PED = 5;                                   // twice life size, on 5 m pedestals: about 19 m to the top
/** where each statue stands (x, z) and which way it faces (toward the plaza's front) */
export const SPOTS = [[-19, -3], [-6.8, -10], [6.8, -10], [19, -3]].map(([x, z]) => ({ x, z, rot: Math.atan2(0 - x, 18 - z) }));

/** the body every figure shares: legs, shoes, coat, belt, head; parts are relative to the feet, in figure units */
function body(b, coat = GOLD) {
  b(.84, 1.9, .84, DEEP, -.5, 0, 0); b(.84, 1.9, .84, DEEP, .5, 0, 0);                    // legs
  b(.9, .3, 1.15, DEEP, -.5, 0, .12); b(.9, .3, 1.15, DEEP, .5, 0, .12);                  // shoes
  b(2.05, 2.15, 1.15, coat, 0, 1.9, 0); b(2.3, .3, 1.25, DEEP, 0, 2.55, 0);               // coat, belt
  b(1.8, 1.7, 1.8, LIGHT, 0, 4.05, 0);                                                    // head
  b(.3, .3, .1, 0x8a6418, -.45, 4.85, .92); b(.3, .3, .1, 0x8a6418, .45, 4.85, .92);      // eyes
  b(.5, .14, .1, 0x8a6418, 0, 4.2, .92);                                                  // a smile
  b(.3, .4, .2, GOLD, 0, 4.45, .95);                                                      // nose
}
const figures = {
  // the curly white wig of an old court, round glasses, a sash, the left hand on his heart, the right one raised to wave
  bibkovich(b) {
    body(b); b(2.25, 1.6, .2, GOLD, 0, 1.2, -.66); b(.45, 2.2, .1, SHINE, .45, 2, .6);                        // coat tails, sash
    for (const [dx, dy, dz] of [[-1, 4.2, 0], [1, 4.2, 0], [-1, 4.9, -.3], [1, 4.9, -.3], [-.95, 3.6, -.2], [.95, 3.6, -.2], [0, 5.5, -.2], [-.6, 5.6, .3], [.6, 5.6, .3], [0, 4.6, -1], [-.6, 3.9, -.9], [.6, 3.9, -.9]])
      b(.95, .95, .95, SHINE, dx, dy, dz, 'ball');
    b(.62, .62, .1, DEEP, -.45, 4.7, 1); b(.62, .62, .1, DEEP, .45, 4.7, 1); b(.5, .12, .1, DEEP, 0, 4.95, 1);   // glasses
    b(.62, 2, .62, GOLD, -1.33, 2, 0); b(.62, .62, 1.2, GOLD, -.9, 3.2, .5); b(.7, .7, .3, LIGHT, -.55, 3.2, 1); // left arm, hand on his heart
    b(.62, 2.6, .62, GOLD, 1.33, 3.6, 0); b(.9, 1, .4, LIGHT, 1.33, 6.2, .05); b(.18, .5, .3, LIGHT, 1.7, 6.9, .05); // right arm up, open palm, thumb
    b(.8, .5, .2, SHINE, 1.33, 3.7, .3); b(.8, .5, .2, SHINE, -1.33, 2.1, .3);                                  // lace cuffs
    b(.6, .7, .6, SHINE, 0, 3.45, .62, 'ball');                                                                 // the lace jabot
  },
  // a plumed bicorne across the head, epaulettes, the right fist raised, the left hand pointing straight at you
  yairdo(b) {
    body(b); b(2.2, .4, .2, SHINE, 0, 2.2, .6);
    for (const y of [2.4, 3, 3.6]) b(.18, .18, .1, SHINE, 0, y, .6);                                            // buttons
    b(3, .7, 1.2, DEEP, 0, 5.25, 0); b(2.2, .9, 1, GOLD, 0, 5.6, 0); b(.5, .5, .1, SHINE, 0, 5.6, .5);           // the bicorne and its badge
    b(1.1, 1.6, 1.1, SHINE, .5, 6.1, -.1, 'ball'); b(.8, 1.2, .8, SHINE, .9, 6.9, -.2, 'ball');                 // the plume
    b(.9, .35, 1, SHINE, -1.3, 3.75, 0); b(.9, .35, 1, SHINE, 1.3, 3.75, 0);                                    // epaulettes
    b(.62, 2.4, .62, GOLD, 1.33, 4, 0); b(.85, .85, .85, LIGHT, 1.33, 6.4, 0);                                  // right arm up, fist
    b(.62, .62, 2.4, GOLD, -1.1, 3.1, .9); b(.7, .7, .7, LIGHT, -1.1, 3.05, 2.3); b(.2, .2, .9, LIGHT, -1.1, 3.3, 2.9);   // pointing at you
  },
  // a tall top hat with a band, a curled moustache, the right hand tipping the hat, the left one on a cane with a gold knob
  lebet(b) {
    body(b); b(1.4, 1.6, .1, SHINE, 0, 2.3, .58); b(.7, .45, .15, SHINE, 0, 3.55, .62);                        // waistcoat, bow tie
    b(2.4, .2, 2.4, DEEP, 0, 5.75, 0, 'cyl'); b(1.55, 2.2, 1.55, GOLD, 0, 5.95, 0, 'cyl'); b(1.6, .35, 1.6, DEEP, 0, 6.2, 0, 'cyl');   // the top hat
    b(1.5, .25, .2, DEEP, 0, 4.15, .95); b(.4, .25, .2, DEEP, -.85, 4.3, .95); b(.4, .25, .2, DEEP, .85, 4.3, .95);   // the moustache, curled up
    b(.62, 2.6, .62, GOLD, 1.25, 3.5, .2); b(.7, .7, .7, LIGHT, 1, 6, .4);                                      // right arm up to the brim
    b(.62, 2, .62, GOLD, -1.33, 2, .2); b(.7, .7, .7, LIGHT, -1.4, 1.6, .5);                                    // left arm down to the cane
    b(.22, 2, .22, DEEP, -1.4, 0, .9, 'cyl'); b(.55, .55, .55, SHINE, -1.4, 1.75, .8, 'ball');                  // the cane
    b(2.2, 1.4, .2, GOLD, 0, 1.15, -.66);                                                                       // coat tails
  },
  // a crown, a long full beard down the chest, an ermine cape over the shoulders, the sceptre in his right hand
  mascentape(b) {
    body(b); b(2.6, 4.2, .3, GOLD, 0, .7, -.75); b(2.6, .6, 1.4, SHINE, 0, 3.6, 0);                            // the cape, its ermine collar
    for (const [dx, dy] of [[-.9, 3.85], [0, 3.85], [.9, 3.85], [-1.1, 2], [1.1, 2], [-1.1, 1], [1.1, 1]]) b(.2, .2, .1, DEEP, dx, dy, dx ? .62 : .72);
    b(1.7, 1.5, .5, SHINE, 0, 2.9, .7); b(1.2, .9, .45, SHINE, 0, 2.3, .78); b(.6, .6, .4, SHINE, 0, 1.8, .82);  // the long beard
    b(1.9, .6, 1.9, SHINE, 0, 5.15, 0);                                                                         // his hair
    b(1.7, .45, 1.7, GOLD, 0, 5.75, 0); for (const [dx, dz] of [[-.65, -.65], [.65, -.65], [-.65, .65], [.65, .65], [0, .7]]) b(.36, .7, .36, GOLD, dx, 6.2, dz);   // the crown
    b(.5, .5, .5, SHINE, 0, 6.3, .85, 'ball');
    b(.62, 2, .62, GOLD, 1.4, 2.2, .3); b(.7, .7, .7, LIGHT, 1.4, 2.3, .8); b(.25, 5.2, .25, DEEP, 1.4, .3, .9, 'cyl'); b(.8, .8, .8, SHINE, 1.4, 5.5, .9, 'ball');   // the sceptre
    b(.62, 2, .62, GOLD, -1.4, 2, 0);
  },
};

/** one statue: the pedestal with its colour band, the figure, and the bits round its foot */
function statue(p, i) {
  const { x, z, rot } = SPOTS[i], c = CANDIDATES[i];
  p.at(x, z, rot);
  p.box(0, 0, 0, 7.4, .8, 7.4, STONE2); p.box(0, .8, 0, 6.4, .6, 6.4, STONE);                               // the steps
  p.box(0, 1.4, 0, 5, PED - 1.4, 5, CREAM); p.box(0, PED - 1.3, 0, 5.2, .7, 5.2, c.color);                  // the pedestal, his band
  p.box(0, PED - .6, 0, 5.6, .6, 5.6, GOLD); p.box(0, 1.4, 0, 5.3, .4, 5.3, GOLD);
  for (const [dx, dz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) p.ball(dx, PED - .3, dz, .7, .7, GOLD);
  p.box(0, 2, 2.55, 3.8, 1.6, .1, GOLD);                                                                    // the plaque's frame
  for (const dx of [-3, 3]) { p.cyl(dx, .8, 3.6, .9, .7, STONE2); p.ball(dx, 1.4, 3.6, 1.1, .8, [0xd7263d, 0xf29bb7, 0xffd23f][i % 3]); }   // flower pots
  const b = (w, h, d, col, dx, dy, dz, kind = 'box') => kind === 'box' ? p.box(dx * S, PED + dy * S, dz * S, w * S, h * S, d * S, col) : p[kind](dx * S, PED + dy * S, dz * S, w * S, h * S, col);
  figures[c.key](b);
  p.at(0, 0, 0);
}

export function drawStatues(p) {
  p.at(0, 0, 0);
  // the plaza: grass, a round stone floor with rings, paths out
  p.box(0, 0, 0, 60, .08, 60, GRASS); p.cyl(0, .08, 0, 56, .14, PAVE);
  for (const [r, c] of [[50, STONE2], [48, PAVE], [24, STONE2], [22, PAVE]]) p.cyl(0, .22 + (r < 30 ? .02 : 0), 0, r, .02, c);
  p.box(0, .1, 25, 8, .14, 10, PAVE);
  for (const x of [-7.6, 7.6]) { p.box(x, 0, 29, 1.2, 7.4, 1.2, CREAM); p.box(x, 7.4, 29, 1.6, .5, 1.6, GOLD); p.ball(x, 7.9, 29, 1.1, 1.1, GOLD); }   // the gate posts
  p.box(0, 7, 29, 16.4, .6, .8, NAVY);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; p.box(Math.sin(a) * 26.5, .1, Math.cos(a) * 26.5, 2.4, .5, .9, STONE2, a); }   // the rim
  for (let i = 0; i < 4; i++) statue(p, i);
  // the fountain in the middle: a round basin, a column, a golden ballot box on top spouting water
  p.cyl(0, .2, 7, 13, 1.2, STONE); p.cyl(0, .3, 7, 12, 1.15, WATER); p.cyl(0, 1.4, 7, 13.4, .3, GOLD);
  p.cyl(0, .3, 7, 3, 3.6, STONE); p.cyl(0, 3.9, 7, 6, .6, STONE2); p.cyl(0, 4.2, 7, 5.4, .45, WATER);
  p.box(0, 4.5, 7, 2, 1.8, 1.6, GOLD); p.box(0, 6.3, 7, .9, .12, .2, DARK); p.box(0, 6.4, 7, .7, .8, .06, CREAM);   // the ballot box, a ballot in its slot
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.ball(Math.sin(a) * 4, 4.7, 7 + Math.cos(a) * 4, .8, .9, 0xbfe6f5); p.ball(Math.sin(a) * 9, .9, 7 + Math.cos(a) * 9, .7, .8, 0xbfe6f5); }
  // the gold beach chair beside מאיסנקוט, under a striped umbrella, with a drink
  p.at(25, 6, -1.2);
  p.box(0, .3, 0, 2.4, .3, 4.4, GOLD); p.box(0, .6, -2.2, 2.4, 2.6, .3, GOLD); for (const [dx, dz] of [[-1, -1.8], [1, -1.8], [-1, 1.8], [1, 1.8]]) p.box(dx, 0, dz, .25, .6, .25, DEEP);
  p.box(0, 0, 3.4, 4, 1, 1, CREAM); p.cyl(1.3, 1, 3.4, .5, .8, 0xf28c28); p.box(1.4, 1.8, 3.4, .06, .8, .06, 0xffffff);
  p.box(-2.4, 0, 0, .2, 6.5, .2, CREAM); for (let k = 0; k < 6; k++) p.box(-2.4, 6.3 - k * .1, 0, 6 - k * .6, .3, 6 - k * .6, k % 2 ? 0xffffff : 0xd7263d);
  p.at(0, 0, 0);
  // benches and lamps round the ring, flower beds, trees
  for (let k = 0; k < 8; k++) { const a = (k + .5) / 8 * Math.PI * 2; if (Math.cos(a) < -.3) continue;
    const bx = Math.sin(a) * 21, bz = Math.cos(a) * 21; p.box(bx, .5, bz, 3.4, .3, 1.1, WOOD, a); p.box(bx - Math.sin(a) * .5, .8, bz - Math.cos(a) * .5, 3.4, .9, .2, WOOD, a);
    p.box(bx + Math.cos(a) * 1.5, 0, bz - Math.sin(a) * 1.5, .3, .5, .9, DARK, a); p.box(bx - Math.cos(a) * 1.5, 0, bz + Math.sin(a) * 1.5, .3, .5, .9, DARK, a); }
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, lx = Math.sin(a) * 24, lz = Math.cos(a) * 24;
    p.box(lx, 0, lz, .3, 5, .3, NAVY); p.box(lx, 5, lz, .9, .3, .9, GOLD); p.ball(lx, 5.3, lz, .9, 1, 0xfff3b0); }
  for (const [x, z] of [[-12, 18], [12, 18]]) { p.cyl(x, .1, z, 6, .6, STONE2); for (let k = 0; k < 9; k++) p.ball(x + Math.sin(k * 2.1) * 2, .6, z + Math.cos(k * 2.1) * 2, 1, .8, [0xd7263d, 0xffd23f, 0xf29bb7, 0x7a4f9a][k % 4]); }
  for (const [x, z] of [[-27, 14], [27, 15], [-24, -18], [24, -18], [0, -24], [-13, -24], [13, -24]]) p.tree(x, z, 1.15);
  // visitors: a family taking a photo, a child on a parent's shoulders, an old man feeding pigeons
  const person = (x, z, r, shirt, h = 1) => { p.at(x, z, r); p.box(-.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550); p.box(.3 * h, 0, 0, .45 * h, 1.4 * h, .5 * h, 0x2a3550);
    p.box(0, 1.4 * h, 0, 1.2 * h, 1.4 * h, .8 * h, shirt); p.box(0, 2.8 * h, 0, .9 * h, .9 * h, .9 * h, SKIN); p.box(0, 3.6 * h, 0, .95 * h, .25 * h, .95 * h, 0x4a3020); p.at(0, 0, 0); };
  person(4, 19, Math.PI, 0xc2412d); p.box(4, 2.7, 18.4, .9, .6, .3, DARK);                                   // the photographer and his camera
  person(-3, 15, .2, 0x0f8b8d); person(-1.5, 15.5, .1, 0xf29bb7, .7); person(-4.4, 15.3, .4, 0x3b6fb6);       // the family posing
  person(-14, 4, 1.4, 0xe8b323); p.ball(-14, 5.3, 4, .6, .5, 0x7a4f9a);
  person(14, 12, -1.9, 0x7a4f9a); for (let k = 0; k < 5; k++) p.ball(12.4 + k * .4, .2, 12.6 + (k % 2) * .5, .45, .4, 0x9aa3ab);   // pigeons
  person(9, -1, -2.6, 0x4f9a43); person(-9, -1, 2.6, 0xc2412d, .8);
}

export function statuesLive(group) {
  group.add(sign('שדרת הפסלים 🗳️', { w: 14, h: 2.8, bg: '#13213b', fg: '#e8b323', border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(0, 5.6, 29.2));
  group.add(sign('רעיון של @nika_trav · אדריכלית', { w: 8.6, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.9, 29.2));
  group.add(sign('יום הבחירות: יום שלישי', { w: 6.6, h: 1.1, bg: '#fffaf0', fg: '#c8102e', border: '#c8102e' }).at(0, 2.4, 29.2));
  CANDIDATES.forEach((c, i) => { const { x, z, rot } = SPOTS[i], fx = Math.sin(rot), fz = Math.cos(rot), d = 2.66;
    group.add(sign(c.name, { w: 3.4, h: .85, bg: c.bg, fg: c.fg, border: '#e8b323', font: '900 {px}px "Secular One", Rubik' }).at(x + fx * d, 2.5, z + fz * d, rot));
    group.add(sign(c.promise, { w: 3.4, h: .55, bg: '#fffaf0', fg: '#13213b', border: '#fffaf0' }).at(x + fx * d, 1.95 - .2, z + fz * d, rot));
    // day 14: the winner of the elections gets a giant gold crown over his statue and a plaque (states.statues['crown_<key>'])
    const p = new Pen(), top = PED + 6.6 * S; p.cyl(0, 0, 0, 5.6, 1.4, GOLD); p.cyl(0, .2, 0, 5.9, .4, DEEP);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; p.cone(Math.sin(a) * 2.4, 1.4, Math.cos(a) * 2.4, 1.3, 2.4, GOLD); p.ball(Math.sin(a) * 2.4, 3.6, Math.cos(a) * 2.4, .7, .7, [0xc8102e, 0x3b6fb6, 0x1f8a4c, 0xf5d36b][k % 4]); }
    p.ball(0, 1.4, 0, 2.2, 1.8, 0xc8102e); p.ball(0, 3.1, 0, .9, .9, GOLD);
    const crown = p.build(new THREE.Group()); crown.position.set(x, top, z); crown.visible = false; group.add(crown);
    const plaque = sign('הנשיא הנבחר 👑', { w: 4.6, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b', font: '900 {px}px "Secular One", Rubik' }).at(x + fx * 3.9, 4.4, z + fz * 3.9, rot); plaque.visible = false; group.add(plaque);
    group.userData['crown_' + c.key] = k => { k = Math.max(0, Math.min(1, k)); crown.visible = plaque.visible = k > 0; const e = 1 - (1 - k) ** 3;
      crown.position.y = top + (1 - e) * 26; crown.rotation.y = (1 - e) * 6; }; });
}
export const STATUES = { key: 'statues', name: 'שדרת הפסלים', draw: drawStatues, live: statuesLive, top: 20 };
