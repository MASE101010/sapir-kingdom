// טירת ספיר: the castle on the hill in the middle of the kingdom, where it all starts (day 1).
// Four round towers with pointed blue roofs, curtain walls with battlements, a tall keep in the middle with a gold crown
// on its roof, a gate to the south (+z) with a wooden door, and banners. Drawn at (0,0) on the hill (HILL high).
export const HILL = 6;
const STONE = 0xd8cfbd, DARK = 0xb3a891, ROOF = 0x2f5fa6, GOLD = 0xe8b323, WOOD = 0x6b4a33, BANNER = 0x0f8b8d, WIN = 0x2c3e50;

function battlements(p, x0, z0, x1, z1, y) {
  const len = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(len / 2.4), a = Math.atan2(x1 - x0, z1 - z0);
  for (let i = 0; i < n; i += 2) { const f = (i + .5) / n; p.box(x0 + (x1 - x0) * f, y, z0 + (z1 - z0) * f, 1.2, 1.2, 1.2, STONE, a); }
}
export function drawCastle(p) {
  p.at(0, 0, 0, HILL);
  const S = 26, WALL_H = 10, T = 7;
  // curtain walls
  p.box(0, 0, -S, 2 * S, WALL_H, 2.4, STONE); p.box(0, 0, S, 2 * S, WALL_H, 2.4, STONE);
  p.box(-S, 0, 0, 2.4, WALL_H, 2 * S, STONE); p.box(S, 0, 0, 2.4, WALL_H, 2 * S, STONE);
  battlements(p, -S, -S, S, -S, WALL_H); battlements(p, -S, S, S, S, WALL_H); battlements(p, -S, -S, -S, S, WALL_H); battlements(p, S, -S, S, S, WALL_H);
  // corner towers
  for (const [x, z] of [[-S, -S], [S, -S], [-S, S], [S, S]]) {
    p.cyl(x, 0, z, T, 16, STONE); p.cyl(x, 16, z, T + 1, 1.4, DARK); p.cone(x, 17.4, z, T + 1.6, 9, ROOF);
    p.box(x, 26.4, z, .25, 3, .25, WOOD); p.box(x + .9, 28, z, 1.8, 1.1, .1, BANNER);
  }
  // gate house on the south wall
  p.box(-5, 0, S, 4, 14, 5, STONE); p.box(5, 0, S, 4, 14, 5, STONE); p.box(0, 9, S, 14, 5, 5, STONE);
  p.box(0, 0, S + 2.55, 6, 8, .3, WOOD); battlements(p, -7, S + 2.5, 7, S + 2.5, 14);
  p.cone(-5, 14, S, 5.4, 5, ROOF); p.cone(5, 14, S, 5.4, 5, ROOF);
  // the keep
  p.box(0, 0, -4, 22, 24, 18, STONE); p.box(0, 24, -4, 23, 1.2, 19, DARK);
  for (let f = 0; f < 3; f++) for (const x of [-7, 0, 7]) p.box(x, 5 + f * 7, 5.05, 1.8, 3, .2, WIN);
  p.pyramid(0, 25.2, -4, 17, 10, ROOF);
  p.cyl(-7, 24, -10, 5, 10, STONE); p.cone(-7, 34, -10, 6, 7, ROOF);
  p.cyl(7, 24, -10, 5, 14, STONE); p.cone(7, 38, -10, 6, 8, ROOF);
  // the crown on top
  p.cyl(0, 35.2, -4, 4.4, 1.6, GOLD);
  for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5; p.cone(Math.cos(a) * 1.9, 36.8, -4 + Math.sin(a) * 1.9, 1.1, 2, GOLD); }
  // banners on the keep, and a courtyard
  p.box(-4, 14, 5.15, 2.4, 6, .15, BANNER); p.box(4, 14, 5.15, 2.4, 6, .15, BANNER);
  p.box(0, -.05, 14, 40, .2, 18, 0xe6dcc6);
  p.tree(-14, 14, 1.2); p.tree(14, 14, 1.2);
}
export const CASTLE = { key: 'castle', name: 'טירת ספיר', at: [0, 0], draw: drawCastle, top: 44 };
