// What moves in the kingdom: dragons circling the palace, flocks of birds, clouds drifting, carts and people on the ring
// roads, flags in the wind. Everything is a function of time, so the site (the clock) and a reel (its own time) show the
// same kingdom, and every viewer sees the dragons in the same place at the same moment.
import * as THREE from 'three';

const mat = c => new THREE.MeshLambertMaterial({ color: c });
const hash = (a, b) => { let h = Math.imul(a * 73856093 ^ b * 19349663, 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };

/** a voxel dragon: a long neck rising to a horned head, a tapering tail with a spade, four tucked legs, and bat wings
 *  (an arm, three fingers and the skin between them) that flap from the shoulder and bend at the elbow */
function dragon(color, belly, skin) {
  const g = new THREE.Group(), box = (w, h, d, c, x, y, z, parent = g, rx = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.rotation.x = rx; m.castShadow = true; parent.add(m); return m; };
  box(4.4, 3.8, 9, color, 0, 0, 0); box(3.6, 1.2, 8, belly, 0, -2.1, .3);                      // body, belly
  box(5, 4.4, 3.6, color, 0, .5, 3.6);                                                           // chest
  [[2.8, 6.2, -.5], [2.4, 7.8, -.75], [2.1, 9.6, -.95]].forEach(([s, z, rx], i) => box(s, s, 2.6, color, 0, 1.6 + i * 1.5, z, g, rx));   // the neck, rising
  const head = new THREE.Group(); head.position.set(0, 6.2, 11.4); g.add(head);
  box(3.2, 2.6, 3.6, color, 0, 0, 0, head); box(2.4, 1.6, 2.8, color, 0, -.3, 2.8, head); box(2.2, .7, 2.6, belly, 0, -1.4, 2.4, head);  // skull, snout, jaw
  box(.5, .5, .3, 0xffe066, -1.05, .6, 1.4, head); box(.5, .5, .3, 0xffe066, 1.05, .6, 1.4, head);                                      // eyes
  box(.5, .5, .5, 0x2b2f36, -.6, .1, 4.15, head); box(.5, .5, .5, 0x2b2f36, .6, .1, 4.15, head);                                      // nostrils
  box(.5, 2.4, .5, 0xf3ead8, -1, 1.9, -1.2, head, -.6); box(.5, 2.4, .5, 0xf3ead8, 1, 1.9, -1.2, head, -.6);                          // horns, swept back
  for (let i = 0; i < 6; i++) box(3.2 - i * .45, 2.8 - i * .4, 3, color, 0, -.2 - i * .45, -5.8 - i * 2.7);                         // tail, tapering down
  box(2.6, .4, 2.2, belly, 0, -2.9, -22.4); box(.3, 1.6, 1.4, belly, 0, -2.2, -22.4);                                                // the spade at its tip
  for (let i = 0; i < 6; i++) box(.4, 1.4 - i * .12, 1.2, belly, 0, 2.5 - i * .25, 3 - i * 3);                                        // spikes on the back
  for (const [x, z] of [[-1.8, 2.8], [1.8, 2.8], [-1.8, -3], [1.8, -3]]) { box(1.2, 2.4, 1.4, color, x, -2.6, z, g, .5); box(1.2, .5, 1.6, belly, x, -3.8, z + .9); }   // legs, tucked
  const wing = side => {
    const shoulder = new THREE.Group(); shoulder.position.set(side * 2.2, 1.6, 2.4); g.add(shoulder);
    box(8, .7, .9, color, side * 4, 0, 0, shoulder);                                             // upper arm
    const elbow = new THREE.Group(); elbow.position.set(side * 8, 0, 0); shoulder.add(elbow);
    box(7, .6, .8, color, side * 3.5, 0, 0, elbow);                                              // forearm
    [[10, -.25], [9, -.75], [7.5, -1.25]].forEach(([len, a]) => { const f = box(len, .4, .5, color, 0, 0, 0, elbow);
      f.position.set(side * (7 + Math.cos(a) * len / 2), 0, Math.sin(a) * len / 2); f.rotation.y = -side * a; });           // fingers
    box(14, .2, 9, skin, side * 7, -.1, -4.6, elbow); box(8, .2, 6, skin, side * 4, -.1, -3.4, shoulder);   // the skin
    return { shoulder, elbow };
  };
  g.userData.wings = [wing(-1), wing(1)];
  // fire from the mouth: a cone of flames and puffs, hidden until a reel lights it (Life.fire)
  const fire = new THREE.Group(); fire.position.set(0, -.4, 4.4); head.add(fire); fire.visible = false;
  const flame = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .92, depthWrite: false });
  [[0xfff1a8, 1.2, 3], [0xffc23d, 2, 7], [0xff8a1f, 3.2, 12], [0xe8461e, 4.2, 17]].forEach(([c, r, z]) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, 9, 9, 1, true).rotateX(-Math.PI / 2), flame(c)); m.position.z = z - 2; fire.add(m); });
  fire.userData.puffs = Array.from({ length: 14 }, (_, i) => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), flame([0xffc23d, 0xff8a1f, 0xe8461e][i % 3])); fire.add(m); return m; });
  g.userData.fire = fire; g.userData.head = head; g.rotation.order = 'YXZ';
  return g;
}

export class Life {
  constructor(scene, plan) {
    this.scene = scene; this.plan = plan; const r0 = plan.rings.r0, step = plan.rings.step;
    // dragons: each flies its own loop round the kingdom at its own height and speed
    this.dragons = [[0xb83a2a, 0xf2b632, 0xe3793f, 300, 130, .055, 0], [0x2f7a4a, 0xd8e8a0, 0x7fb069, 460, 170, -.04, 2], [0x3b4fa6, 0xb6c8f2, 0x6d86d6, 220, 105, .07, 4]].map(([c, b, sk, R, H, w, ph]) => {
      const d = dragon(c, b, sk); d.scale.setScalar(1.1); scene.add(d); return { d, R, H, w, ph }; });
    // birds: little flocks of V shapes
    const bird = new THREE.BoxGeometry(1.8, .2, .6); this.birds = new THREE.InstancedMesh(bird, mat(0x2b2f36), 60); this.birds.frustumCulled = false; scene.add(this.birds);
    // clouds: clusters of white balls high up, drifting with the wind
    this.clouds = []; const cg = new THREE.IcosahedronGeometry(1, 1), cm = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for (let i = 0; i < 18; i++) { const c = new THREE.Group(); for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(cg, cm); m.scale.setScalar(18 + hash(i, k) * 16); m.position.set((k - 2) * 20, hash(k, i) * 10, hash(i * 3, k) * 16); c.add(m); }
      scene.add(c); this.clouds.push({ c, x0: (hash(i, 1) - .5) * 4000, z: (i % 2 ? 1 : -1) * (520 + hash(i, 2) * 1100), y: 220 + hash(i, 3) * 120 }); }
    // carts and people walking the ring roads
    const cart = new THREE.Group(), cbox = (w, h, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.castShadow = true; cart.add(m); };
    cbox(2.4, 1.6, 4.4, 0x8a6240, 0, 1.4, 0); cbox(2.6, .3, 4.6, 0x6b4a33, 0, 2.3, 0); cbox(1.4, 2, 2.4, 0xe9e0cc, 0, 2.4, -.6); cbox(1.2, 2.2, 2.6, 0x7a5a3a, 0, 1.1, 4); cbox(.8, .8, 1.2, 0x7a5a3a, 0, 2.2, 5.6);
    this.carts = Array.from({ length: 10 }, (_, i) => { const c = cart.clone(); scene.add(c); return { c, ring: 1 + (i % 4), speed: (i % 2 ? 1 : -1) * (5 + hash(i, 5) * 3), a0: hash(i, 6) * Math.PI * 2 }; });
    const body = new THREE.BoxGeometry(.9, 1.6, .6), head = new THREE.BoxGeometry(.7, .7, .7);
    this.people = { n: 120, body: new THREE.InstancedMesh(body, new THREE.MeshLambertMaterial(), 120), head: new THREE.InstancedMesh(head, mat(0xe2b48f), 120) };
    const col = new THREE.Color(), shirts = [0xc2412d, 0x0f8b8d, 0x3b6fb6, 0xe8b323, 0x7a4f9a, 0x4f9a43];
    for (let i = 0; i < 120; i++) this.people.body.setColorAt(i, col.setHex(shirts[i % 6]));
    scene.add(this.people.body, this.people.head); this.people.body.frustumCulled = this.people.head.frustumCulled = false;
    this.r0 = r0; this.step = step; this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.v = new THREE.Vector3(); this.s = new THREE.Vector3(1, 1, 1);
  }
  /** shows the walkers and carts only on rings that are built (the view tells it the outermost one) */
  setExtent(ring) { this.extent = ring; }
  update(t) {
    const up = new THREE.Vector3(0, 1, 0);
    // a reel can gather them round a place (swarm: { x, z, R, H, k 0..1 }) and light one's fire (fire: 0..1)
    const sw = this.swarm, P = new THREE.Vector3(), Q = new THREE.Vector3();
    this.dragons.forEach(({ d, R, H, w, ph }, i) => {
      const pos = (tt, out) => { const a = tt * w + ph, wob = Math.sin(tt * .7 + ph) * 18; out.set(Math.cos(a) * (R + wob), H + Math.sin(tt * .9 + ph) * 12, Math.sin(a) * (R + wob));
        if (sw?.k > 0) { const b = tt * (.42 + i * .07) * (i % 2 ? -1 : 1) + i * 2.1, r = sw.R * (1 + i * .22), k = sw.k * sw.k * (3 - 2 * sw.k);
          out.lerp(new THREE.Vector3(sw.x + Math.cos(b) * r, sw.H + i * 9 + Math.sin(tt * 1.3 + i) * 4, sw.z + Math.sin(b) * r), k); }
        return out; };
      pos(t, P); pos(t + .05, Q); d.position.copy(P);
      const v = Q.sub(P), turn = sw?.k > 0 ? (i % 2 ? 1 : -1) * .45 * sw.k : 0;
      d.rotation.set(-Math.atan2(v.y, Math.hypot(v.x, v.z)) * .6 + Math.sin(t * .9 + ph) * .08, Math.atan2(v.x, v.z), sw?.k > 0 ? turn : -Math.sign(w) * .35);
      const fire = d.userData.fire, f0 = i === 0 ? this.fire ?? 0 : 0; fire.visible = f0 > .01; d.userData.head.rotation.x = .45 * f0;
      if (fire.visible) { fire.scale.setScalar(1.8 * f0 * (1 + Math.sin(t * 31) * .08)); fire.children.forEach((m, k) => { if (m.material) m.material.opacity = .9 * f0; });
        fire.userData.puffs.forEach((m, k) => { const u = ((t * 2.2 + k / 14) % 1); m.position.set(Math.sin(k * 7.3 + t * 9) * u * 3.4, Math.cos(k * 5.1 + t * 7) * u * 3, 4 + u * 20); m.scale.setScalar(1 + u * 3.2); }); }
      const f = Math.sin(t * 3.4 + ph), [L, Rw] = d.userData.wings;           // the wing beats down, and folds a little on the way up
      L.shoulder.rotation.z = f * .6; Rw.shoulder.rotation.z = -f * .6; L.elbow.rotation.z = Math.max(0, f) * .5; Rw.elbow.rotation.z = -Math.max(0, f) * .5;
    });
    for (let i = 0; i < 60; i++) {
      const flock = Math.floor(i / 12), k = i % 12, a = t * (.09 + flock * .01) + flock * 1.3, R = 300 + flock * 140, side = k % 2 ? 1 : -1, row = Math.ceil(k / 2);
      const cx = Math.cos(a) * R, cz = Math.sin(a) * R, dir = a + Math.PI / 2, flap = Math.sin(t * 9 + i) * .4;
      this.v.set(cx - Math.cos(dir) * row * 3 + Math.cos(dir + Math.PI / 2) * side * row * 3, 70 + flock * 12 + Math.sin(t * 2 + i) * 1.5, cz - Math.sin(dir) * row * 3 + Math.sin(dir + Math.PI / 2) * side * row * 3);
      this.q.setFromEuler(new THREE.Euler(0, -dir, flap)); this.m.compose(this.v, this.q, this.s); this.birds.setMatrixAt(i, this.m);
    }
    this.birds.instanceMatrix.needsUpdate = true;
    for (const { c, x0, z, y } of this.clouds) { const x = ((x0 + t * 6 + 2000) % 4000 + 4000) % 4000 - 2000; c.position.set(x, y, z); }
    const maxRing = Math.max(1, this.extent ?? 1);
    for (const k of this.carts) { const ring = Math.min(k.ring, maxRing), R = this.r0 + this.step * ring + 2, a = k.a0 + t * k.speed / R;
      k.c.visible = ring <= maxRing; k.c.position.set(Math.cos(a) * R, .15, Math.sin(a) * R); k.c.rotation.y = Math.atan2(-Math.sin(a) * Math.sign(k.speed), Math.cos(a) * Math.sign(k.speed)); }
    for (let i = 0; i < this.people.n; i++) {
      const ring = 1 + (i % Math.max(1, maxRing)), R = this.r0 + this.step * ring + (i % 2 ? 6.5 : -6.5), dir = i % 3 ? 1 : -1, sp = 1.1 + hash(i, 9) * .6;
      const a = hash(i, 8) * Math.PI * 2 + dir * t * sp / R, bob = Math.abs(Math.sin(t * 6 + i)) * .25, x = Math.cos(a) * R, z = Math.sin(a) * R;
      this.q.setFromAxisAngle(up, Math.atan2(-Math.sin(a) * dir, Math.cos(a) * dir));
      this.m.compose(this.v.set(x, .95 + bob, z), this.q, this.s); this.people.body.setMatrixAt(i, this.m);
      this.m.compose(this.v.set(x, 2.1 + bob, z), this.q, this.s); this.people.head.setMatrixAt(i, this.m);
    }
    this.people.body.instanceMatrix.needsUpdate = this.people.head.instanceMatrix.needsUpdate = true;
  }
}
