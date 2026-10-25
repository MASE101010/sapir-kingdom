// A landmark on fire (day 12: the dragon that broke out of its cage burned סופר ספיר). burnable(group, spots) gives the
// group a burn(k) state, 0 as built and 1 burned: its colours char toward soot, flames lick out of the spots and grey smoke
// rises; the site keeps it burned while kingdom.json says so (states), a reel sets k over time. tick(t) moves the flames.
import * as THREE from 'three';
const SOOT = new THREE.Color(0x2b2724);

export function burnable(group, spots, { H = 9 } = {}) {
  const fire = new THREE.Group(); fire.visible = false; group.add(fire);
  const fmat = [0xff5a1f, 0xff9a1f, 0xffd23f].map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .9, depthWrite: false }));
  const smat = new THREE.MeshLambertMaterial({ color: 0x6b6b6b, transparent: true, opacity: .55, depthWrite: false });
  const flames = [], smoke = [];
  spots.forEach(([x, y, z, s = 1], i) => {
    for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(1.4 * s * (1 - k * .25), 5 * s * (1 - k * .2), 7), fmat[k]); m.position.set(x, y + 2.4 * s, z); fire.add(m); flames.push({ m, i, k, y, s }); }
    for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 * s, 0), smat.clone()); fire.add(m); smoke.push({ m, x, y, z, s, k, i }); }
  });
  const mats = []; let orig = null;
  const remember = () => { orig = []; group.traverse(o => { if (o.isInstancedMesh && o.instanceColor) orig.push({ o, a: o.instanceColor.array.slice() });
    else if (o.isMesh && o.material?.color && !fire.children.includes(o) && o.parent !== fire) mats.push({ m: o.material, c: o.material.color.clone() }); }); };
  let cur = 0;
  group.userData.burn = k => { k = Math.max(0, Math.min(1, k)); if (k === cur) return; cur = k; if (!orig) remember();
    const e = .72 * k; for (const { o, a } of orig) { const arr = o.instanceColor.array; for (let j = 0; j < arr.length; j += 3) { arr[j] = a[j] + (SOOT.r - a[j]) * e; arr[j + 1] = a[j + 1] + (SOOT.g - a[j + 1]) * e; arr[j + 2] = a[j + 2] + (SOOT.b - a[j + 2]) * e; } o.instanceColor.needsUpdate = true; }
    for (const { m, c } of mats) m.color.copy(c).lerp(SOOT, .55 * k);
    fire.visible = k > .02; fire.userData.k = k; };
  group.userData.tick = t => { if (!fire.visible) return; const k = fire.userData.k ?? 1, flare = Math.min(1, k * 1.6);
    for (const { m, i, k: n, y, s } of flames) { const f = 1 + Math.sin(t * (9 + n * 3) + i * 1.7) * .18 + Math.sin(t * 23 + i) * .08; m.scale.set(flare * (1 + Math.sin(t * 7 + i) * .1), flare * f, flare * (1 + Math.cos(t * 6 + i) * .1)); m.position.y = y + 2.4 * s * flare * f; }
    for (const { m, x, y, z, s, k: n, i } of smoke) { const u = (t * .22 + n / 5 + i * .13) % 1; m.position.set(x + Math.sin(i + u * 3) * 2 * s + u * 6, y + 3 + u * H * 3 * s, z + Math.cos(i * 2 + u * 2) * 2 * s); m.scale.setScalar((.6 + u * 2.6) * Math.min(1, k * 1.4)); m.material.opacity = .5 * (1 - u); } };
  group.userData.fireGroup = fire;
  return group;
}
