// ארמון משפחת ספיר: the great palace on the hill in the middle of the kingdom (day 1), and in its front courtyard the
// statue of King Michael, the king of the kingdom. Outer walls with eight towers and blue spires, a grand keep with three
// roofs, a tall central tower crowned in gold, banners, a gate to the south (+z) with a wide stair, and the statue on a
// stone pedestal in a round pool, facing the gate. Drawn at (0,0) on the hill (HILL high). The key stays 'castle'.
import { sign } from '../sign.js';
export const HILL = 3;
export const STATUE = [0, 24];                 // where the king stands, in the palace's own space (world space too: the palace is at 0,0)
const STONE = 0xe3d9c4, DARK = 0xbcae92, ROOF = 0x2f5fa6, GOLD = 0xe8b323, WOOD = 0x6b4a33, BANNER = 0x0f8b8d, WIN = 0x2c3e50, WATER = 0x3fa9d6, BRONZE = 0xc9962e;

function battlements(p, x0, z0, x1, z1, y, size = 1.5) {
  const len = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(len / (size * 2)), a = Math.atan2(x1 - x0, z1 - z0);
  for (let i = 0; i < n; i += 2) { const f = (i + .5) / n; p.box(x0 + (x1 - x0) * f, y, z0 + (z1 - z0) * f, size, size, size, STONE, a); }
}
function tower(p, x, z, r, h, roofH, banner = true) {
  p.cyl(x, 0, z, r, h, STONE); p.cyl(x, h, z, r + 1.2, 1.6, DARK); p.cone(x, h + 1.6, z, r + 2, roofH, ROOF);
  for (let k = 0; k < 3; k++) p.box(x, h * (.35 + k * .2), z + r / 2 + .05, 1, 2, .2, WIN);
  if (banner) { p.box(x, h + 1.6 + roofH, z, .3, 4, .3, WOOD); p.box(x + 1.3, h + 3.4 + roofH, z, 2.6, 1.5, .12, BANNER); }
}
/** King Michael in stone and gold: the voxel figure, s times life size, facing +z */
export function statue(p, x, z, y, s) {
  const b = (w, h, d, c, dx, dy, dz) => p.box(x + dx * s, y + dy * s, z + dz * s, w * s, h * s, d * s, c);
  b(.84, 1.9, .84, BRONZE, -.5, 0, 0); b(.84, 1.9, .84, BRONZE, .5, 0, 0);                    // legs
  b(.9, .3, 1.15, DARK, -.5, 0, .12); b(.9, .3, 1.15, DARK, .5, 0, .12);                      // shoes
  b(2.05, 2.15, 1.15, GOLD, 0, 1.9, 0); b(2.3, .35, 1.25, BRONZE, 0, 2.6, 0);                 // body and belt
  b(2.4, 3.4, .25, 0xa8312c, 0, .9, -.72);                                                    // the royal cape
  b(.62, 2, .62, GOLD, -1.33, 2, 0); b(.62, 2, .62, GOLD, 1.33, 2.4, .5);                     // arms, the right one raised forward
  b(.22, 4.2, .22, BRONZE, 1.33, 2.4, 1.2); b(.7, .7, .7, GOLD, 1.33, 6.6, 1.2);              // the sceptre
  b(1.8, 1.7, 1.8, 0xe8c79a, 0, 4.05, 0); b(1.92, .55, 1.92, BRONZE, 0, 5.2, 0);              // head, hair
  b(1.86, .6, .32, BRONZE, 0, 3.95, .82); b(.32, .32, .1, 0x3a2a1a, -.45, 4.85, .92); b(.32, .32, .1, 0x3a2a1a, .45, 4.85, .92);  // beard, eyes
  b(1.7, .45, 1.7, GOLD, 0, 5.75, 0); for (const [dx, dz] of [[-.65, -.65], [.65, -.65], [-.65, .65], [.65, .65], [0, .7]]) b(.36, .6, .36, GOLD, dx, 6.2, dz);  // the crown
}
export function drawCastle(p) {
  p.at(0, 0, 0, HILL);
  const S = 46, WALL_H = 13;
  // the outer walls, eight towers, battlements
  p.box(0, 0, -S, 2 * S, WALL_H, 3, STONE); p.box(-S, 0, 0, 3, WALL_H, 2 * S, STONE); p.box(S, 0, 0, 3, WALL_H, 2 * S, STONE);
  p.box(-S / 2 - 8, 0, S, S - 16, WALL_H, 3, STONE); p.box(S / 2 + 8, 0, S, S - 16, WALL_H, 3, STONE);
  battlements(p, -S, -S, S, -S, WALL_H); battlements(p, -S, -S, -S, S, WALL_H); battlements(p, S, -S, S, S, WALL_H);
  battlements(p, -S, S, -16, S, WALL_H); battlements(p, 16, S, S, S, WALL_H);
  for (const [x, z] of [[-S, -S], [S, -S], [-S, S], [S, S]]) tower(p, x, z, 9, 22, 12);
  for (const [x, z] of [[0, -S], [-S, 0], [S, 0]]) tower(p, x, z, 7, 18, 9, false);
  // the gate house with its arch and doors, and the stair down the hill
  p.box(-12, 0, S, 8, 20, 8, STONE); p.box(12, 0, S, 8, 20, 8, STONE); p.box(0, 13, S, 32, 7, 8, STONE);
  p.cone(-12, 20, S, 8.5, 7, ROOF); p.cone(12, 20, S, 8.5, 7, ROOF); battlements(p, -16, S + 4, 16, S + 4, 20);
  p.box(0, 0, S + 4.1, 12, 12, .4, WOOD); p.box(0, 6, S + 4.35, .4, 12, .2, 0x4a3322);
  p.box(0, -.05, S + 15, 16, .2, 22, 0xe9e0cc);                                      // the road from the gate to the stair
  for (let i = 0; i < 3; i++) p.box(0, -.7 - i, 74 + i * 3, 22, 1, 3, DARK);         // the stair down the hill
  // the grand keep: a wide hall with three roofs
  p.box(0, 0, -14, 56, 26, 30, STONE); p.box(0, 26, -14, 57, 1.5, 31, DARK);
  for (let f = 0; f < 3; f++) for (const x of [-21, -14, -7, 7, 14, 21]) p.box(x, 5 + f * 7.5, 1.05, 2.4, 3.8, .3, WIN);
  p.box(0, 0, 1.2, 12, 14, .4, WOOD); p.box(0, 14, 1.3, 14, 2, .4, GOLD);
  p.pyramid(-18, 27.5, -14, 18, 12, ROOF); p.pyramid(18, 27.5, -14, 18, 12, ROOF);
  // the central tower, the tallest thing in the kingdom, with the gold crown on top
  p.cyl(0, 27.5, -14, 16, 26, STONE); p.cyl(0, 53.5, -14, 18, 2, DARK);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; p.box(Math.sin(a) * 9, 55.5, -14 + Math.cos(a) * 9, 2, 2, 2, STONE, a); }
  p.cone(0, 55.5, -14, 17, 14, ROOF); p.cyl(0, 69.5, -14, 6.4, 2.2, GOLD);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; p.cone(Math.sin(a) * 2.8, 71.7, -14 + Math.cos(a) * 2.8, 1.6, 3, GOLD); }
  p.ball(0, 71.7, -14, 1.8, 1.8, 0xd6334a);
  // banners down the keep
  for (const x of [-25, -9, 9, 25]) p.box(x, 12, 1.3, 3.2, 11, .2, BANNER);
  // the front courtyard: paving, gardens, and the king's statue in a round pool
  p.box(0, -.1, 22, 86, .25, 40, 0xe9e0cc);
  p.cyl(STATUE[0], 0, STATUE[1], 26, 1.2, DARK); p.cyl(STATUE[0], .1, STATUE[1], 23, 1.2, WATER);
  p.box(STATUE[0], 0, STATUE[1], 9, 7, 9, DARK); p.box(STATUE[0], 7, STATUE[1], 10, 1, 10, STONE);
  statue(p, STATUE[0], STATUE[1], 8, 3);
  for (const x of [-34, -24, 24, 34]) { p.box(x, 0, 16, 7, .6, 18, 0x86c766); p.tree(x, 10, 1.3); p.tree(x, 22, 1.1); }
}
export function castleLive(group) {
  group.add(sign('ארמון משפחת ספיר', { w: 30, h: 5, bg: '#13213b', fg: '#f2b632', border: '#f2b632', font: '400 {px}px Crown' }).at(0, HILL + 16.5, 46 + 4.2));
  group.add(sign('המלך מיכאל', { w: 8.6, h: 2, bg: '#e3d9c4', fg: '#13213b' }).at(STATUE[0], HILL + 3.4, STATUE[1] + 4.55));
}
export const CASTLE = { key: 'castle', name: 'ארמון משפחת ספיר', at: [0, 0], draw: drawCastle, live: castleLive, top: 74 };
