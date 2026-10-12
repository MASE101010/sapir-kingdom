// מיכאל: the avatar who lives in the kingdom. A voxel figure that walks the roads on one shared clock, so everyone who
// opens the site at the same moment sees him at the same place. data/kingdom.json "visit" sends him to a resident's door.
import * as THREE from 'three';

const SKIN = 0xe2b48f, HAIR = 0x2b2320, SHIRT = 0x0f8b8d, PANTS = 0x2d3c5a, SHOE = 0x1d1d1d, GOLD = 0xe8b323;

export function makeMichael() {
  const g = new THREE.Group(), mat = c => new THREE.MeshLambertMaterial({ color: c });
  const vox = (w, h, d, c, x, y, z, parent = g) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const limb = (w, h, d, c, x, y) => { const pivot = new THREE.Group(); pivot.position.set(x, y, 0); g.add(pivot); vox(w, h, d, c, 0, -h / 2, 0, pivot); return pivot; };
  vox(1.8, 1.7, 1.8, SKIN, 0, 4.75, 0);                      // head
  vox(1.92, .55, 1.92, HAIR, 0, 5.75, 0); vox(1.92, .9, .3, HAIR, 0, 5.3, -.85);
  vox(1.86, .55, .32, HAIR, 0, 4.12, .82); vox(.5, .4, .32, HAIR, 0, 4.45, .82);   // beard
  vox(.32, .32, .1, 0x161616, -.45, 4.95, .92); vox(.32, .32, .1, 0x161616, .45, 4.95, .92);
  // a small gold crown: he is the king of nothing yet
  vox(1.6, .4, 1.6, GOLD, 0, 6.2, 0); for (const [x, z] of [[-.6, -.6], [.6, -.6], [-.6, .6], [.6, .6]]) vox(.35, .5, .35, GOLD, x, 6.6, z);
  vox(2, 2.1, 1.1, SHIRT, 0, 2.95, 0);                       // body
  const armL = limb(.62, 2, .62, SHIRT, -1.31, 3.95), armR = limb(.62, 2, .62, SHIRT, 1.31, 3.95);
  const legL = limb(.82, 1.9, .82, PANTS, -.5, 1.9), legR = limb(.82, 1.9, .82, PANTS, .5, 1.9);
  vox(.84, .3, 1.1, SHOE, 0, -1.8, .12, legL); vox(.84, .3, 1.1, SHOE, 0, -1.8, .12, legR);
  g.scale.setScalar(1.25);
  g.userData = { armL, armR, legL, legR };
  return g;
}

/** the path he walks: round the castle on its ring road, and out to a resident's door when there is a visit */
export function makeRoute(plan, visitPlot) {
  const r0 = plan.rings.r0, pts = [];
  for (let i = 0; i <= 96; i++) { const a = Math.PI / 2 + i * 2 * Math.PI / 96; pts.push([Math.cos(a) * r0, Math.sin(a) * r0]); }
  if (visitPlot) {
    const [x, z, , ring] = visitPlot, a = Math.atan2(z, x), live = plan.radials.filter(d => d.from <= ring);
    const rad = live.reduce((b, d) => Math.abs(Math.atan2(Math.sin(d.a - a), Math.cos(d.a - a))) < Math.abs(Math.atan2(Math.sin(b.a - a), Math.cos(b.a - a))) ? d : b, live[0]);
    const R = r0 + plan.rings.step * ring, out = [];
    // from the south gate round to the radial, out along it, round the ring to the door, and wait there
    const a0 = Math.PI / 2; let da = Math.atan2(Math.sin(rad.a - a0), Math.cos(rad.a - a0));
    for (let i = 1; i <= 24; i++) { const t = a0 + da * i / 24; out.push([Math.cos(t) * r0, Math.sin(t) * r0]); }
    out.push([Math.cos(rad.a) * R, Math.sin(rad.a) * R]);
    da = Math.atan2(Math.sin(a - rad.a), Math.cos(a - rad.a));
    for (let i = 1; i <= 24; i++) { const t = rad.a + da * i / 24; out.push([Math.cos(t) * R, Math.sin(t) * R]); }
    const door = [x + (Math.cos(a) * R - x) * .55, z + (Math.sin(a) * R - z) * .55];
    out.push(door, door, door);                                // he stands at the door a while
    pts.push(...out, ...out.slice().reverse(), pts[0]);
  }
  const segs = []; let total = 0;
  for (let i = 1; i < pts.length; i++) { const [ax, az] = pts[i - 1], [bx, bz] = pts[i], len = Math.hypot(bx - ax, bz - az); segs.push({ ax, az, bx, bz, len: Math.max(len, 12), still: len < .01, start: total }); total += Math.max(len, 12); }
  return { segs, total };
}
const SPEED = 4.2;   // metres a second: a stroll
export function poseMichael(m, route, seconds, lean = true) {
  const d = (seconds * SPEED) % route.total, s = route.segs.find(s => d >= s.start && d < s.start + s.len) ?? route.segs[0], f = (d - s.start) / s.len;
  const x = s.ax + (s.bx - s.ax) * f, z = s.az + (s.bz - s.az) * f;
  m.position.set(x, .2, z);
  if (!s.still) m.rotation.y = Math.atan2(s.bx - s.ax, s.bz - s.az);
  const sw = s.still ? 0 : Math.sin(seconds * 7) * .6, u = m.userData;
  u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw * .8; u.armR.rotation.x = s.still && lean ? -2.6 + Math.sin(seconds * 6) * .3 : sw * .8;
  return { x, z, still: s.still };
}
