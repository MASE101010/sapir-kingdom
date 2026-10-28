// הפועל ארנה: day 15, @eilam.lev99's comment "אפשר לבנות מגרש יותר גדול להפועל ספיר עם גם בניין למנהלים". The club's new
// home: a big bowl stadium in red and black, stands on all four sides full of fans, a roof ring on red trusses, two giant
// screens, six tall floodlights, a striped pitch with the squad warming up, and behind it the management building: a glass
// tower with the club's crest, the chairman's office on top with a balcony. A fan shop, the gate with its sign, flags.
// Lot radius 30, front toward +z.
import { sign } from '../sign.js';
import { pitch, player, floodlight } from './football.js';
const HRED = 0xc8102e, HBLACK = 0x1b1d21, WHITE = 0xf7f5ee, CONCRETE = 0xd6d0c4, METAL = 0x9aa3ab, GLASS = 0x7fb3c9, DARK = 0x3a3f45, GOLD = 0xe8b323,
  SKIN = 0xe2b48f, PAVE = 0xe2d9c6, GRASS = 0x86c766;
const FANS = [HRED, HBLACK, HRED, WHITE, HRED, 0xe8b323, HBLACK, 0xf28db2];
const rnd = (a, b) => { let h = Math.imul(a * 73856093 ^ b * 19349663, 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };
const PW = 32, PD = 20, T = 6;          // pitch, number of tiers

export function drawArena(p) {
  p.at(0, 0, 0);
  p.box(0, 0, 0, 60, .08, 60, GRASS); p.box(0, .08, 0, 58, .1, 56, PAVE);
  pitch(p, PW, PD, .18);
  p.box(0, .1, 0, PW + 6, .08, PD + 6, 0x3f8f43);
  // four stands: long sides and ends, six tiers each, red and black rows, fans in club colours
  const stand = (len, along, s) => { for (let t = 0; t < T; t++) { const off = (along ? PD : PW) / 2 + 3.4 + t * 1.5, y = .2 + t * 1.05;
      const c = t % 2 ? HRED : HBLACK;
      if (along) { p.box(0, 0, s * off, len + t * 3, y + 1, 1.5, CONCRETE); p.box(0, y + 1, s * off, len + t * 3, .22, 1.4, c); }
      else { p.box(s * off, 0, 0, 1.5, y + 1, len + t * 3, CONCRETE); p.box(s * off, y + 1, 0, 1.4, .22, len + t * 3, c); }
      const n = Math.floor((len + t * 3) / 1.15);
      for (let k = 0; k < n; k++) if (rnd(k + s * 91 + (along ? 0 : 500), t) < .7) { const a = -(len + t * 3) / 2 + .6 + k * 1.15, col = FANS[(k * 3 + t) % FANS.length];
        const [x, z] = along ? [a, s * off] : [s * off, a]; p.box(x, y + 1.22, z, .6, .75, .55, col); p.box(x, y + 1.97, z, .42, .42, .42, SKIN); } } };
  stand(PW, true, -1); stand(PW, true, 1); stand(PD, false, -1); stand(PD, false, 1);
  // the corners filled in, a red trussed roof ring all round, two giant screens over the ends
  const top = .2 + T * 1.05 + 1;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(sx * (PW / 2 + 7), 0, sz * (PD / 2 + 7), 9, top, 9, CONCRETE);
  for (const s of [-1, 1]) { p.box(0, top + 4, s * (PD / 2 + 9.5), PW + 22, .6, 7, HRED); p.box(s * (PW / 2 + 9.5), top + 4, 0, 7, .6, PD + 12, HRED);
    for (let k = -3; k <= 3; k++) { p.box(k * 7, top, s * (PD / 2 + 12.6), .5, 4.6, .5, HBLACK); }
    for (let k = -1; k <= 1; k++) p.box(s * (PW / 2 + 12.6), top, k * 8, .5, 4.6, .5, HBLACK); }
  for (const s of [-1, 1]) { p.box(s * (PW / 2 + 9.5), top + 4.6, 0, 1, 6, 12, HBLACK); p.box(s * (PW / 2 + 9.5 - .55 * s), top + 5, 0, .1, 5.2, 11.2, 0x1d6fa5); }
  for (const [x, z] of [[-27, -21], [27, -21], [-27, 21], [27, 21], [0, -24], [0, 24]]) if (z !== 24) floodlight(p, x, z, 22, Math.atan2(-x, -z));
  // the squad warming up, the coach, cones, balls
  [[-10, -4], [-6, 3], [-2, -5], [3, 4], [7, -2], [11, 3], [-12, 6], [12, -6]].forEach(([x, z], k) => player(p, x, z, k * 1.1, HRED, .18, HBLACK));
  player(p, 0, 8, Math.PI, 0x3b6fb6, .18); for (let k = 0; k < 6; k++) { p.cone(-5 + k * 2, .18, -1, .6, .8, 0xf28c28); p.ball(-4 + k * 2, .18, 1.5, .55, .55, WHITE); }
  // the management building behind the north stand: a glass tower, red bands, the chairman's office with a balcony, the crest
  p.at(0, -26.5);
  p.box(0, 0, 0, 16, 1, 6, CONCRETE); p.box(0, 1, 0, 14, 21, 5, GLASS);
  for (let f = 0; f < 7; f++) { p.box(0, 1 + f * 3, 0, 14.3, .35, 5.3, f % 2 ? HRED : WHITE); for (let k = 0; k < 6; k++) p.box(-5.6 + k * 2.24, 2 + f * 3, 2.55, .15, 2.2, .1, HBLACK); }
  p.box(0, 22, 0, 15, 3.4, 6, HBLACK); p.box(0, 25.4, 0, 15.6, .5, 6.6, HRED); p.box(0, 22, 3.4, 10, .3, 1.6, WHITE);
  for (let k = 0; k < 9; k++) p.box(-4.8 + k * 1.2, 22.3, 4.1, .2, 1.1, .2, WHITE);
  p.box(0, 26, 0, .3, 6, .3, METAL); p.box(1.8, 30.4, 0, 3.4, 2, .1, HRED); p.box(1.8, 30.4, .02, 3.4, .7, .1, HBLACK);
  p.at(0, 0, 0);
  // the gate and the fan shop at the front, flags along the road
  for (const x of [-6, 6]) { p.box(x, 0, 27, 1.6, 7, 1.6, HBLACK); p.cone(x, 7, 27, 2, 2, HRED); } p.box(0, 6, 27, 13.6, 1.4, 1.2, HRED);
  p.box(17, 0, 25, 8, 4, 5, WHITE); p.box(17, 4, 25, 8.6, .4, 5.6, HRED); p.box(17, .1, 27.55, 6, 2.6, .1, GLASS);
  for (let k = 0; k < 5; k++) { const x = -26 + k * 4; p.box(x, 0, 27.5, .25, 7, .25, METAL); p.box(x + .9, 5.5, 27.5, 1.8, 1.2, .06, k % 2 ? HBLACK : HRED); }
  for (const [x, z] of [[-27, 10], [27, 10], [-27, -6], [27, -6]]) p.tree(x, z, .9);
}
export function arenaLive(group) {
  group.add(sign('הפועל ארנה ❤️🖤', { w: 12.6, h: 2, bg: '#c8102e', fg: '#ffffff', border: '#1b1d21', font: '900 {px}px "Secular One", Rubik' }).at(0, 4.6, 27.65));
  group.add(sign('רעיון של @eilam.lev99 · אדריכל', { w: 8.4, h: 1.1, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 2.9, 27.65));
  group.add(sign('בניין ההנהלה', { w: 9, h: 1.6, bg: '#1b1d21', fg: '#ffffff', border: '#c8102e', font: '900 {px}px "Secular One", Rubik' }).at(0, 23.7, -26.5 + 3.05));
  group.add(sign('חנות האוהדים 🧣', { w: 6.4, h: 1.2, bg: '#ffffff', fg: '#c8102e', border: '#c8102e' }).at(17, 3.3, 27.6));
  for (const s of [-1, 1]) group.add(sign('הפועל ספיר ❤️🖤', { w: 10, h: 4, bg: '#1d6fa5', fg: '#ffffff', border: '#1b1d21', font: '900 {px}px "Secular One", Rubik' }).at(s * (PW / 2 + 9.5 - .62 * s), 14, 0, -s * Math.PI / 2));
}
export const ARENA = { key: 'arena', name: 'הפועל ארנה', draw: drawArena, live: arenaLive, top: 30 };
