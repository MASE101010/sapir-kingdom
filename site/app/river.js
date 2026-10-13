// The river: out of a lake near the castle, straight between the radial roads to beyond the wall, with a gentle wiggle.
// plan.river = { a: its direction, lake: the lake's distance from the castle, lakeR, half: half its width, wiggle, wave }.
/** how far a point is from the water's edge (negative: in the water) */
export function riverDist(R, x, z) {
  const ux = Math.cos(R.a), uz = Math.sin(R.a), t = x * ux + z * uz, perp = -x * uz + z * ux;
  const lake = Math.hypot(x - ux * R.lake, z - uz * R.lake) - R.lakeR;
  const run = t >= R.lake ? Math.abs(perp - riverBend(R, t)) - R.half : Infinity;
  return Math.min(lake, run);
}
/** the centre line's sideways offset at distance t along the river */
export const riverBend = (R, t) => R.wiggle * Math.sin((t - R.lake) / R.wave);
