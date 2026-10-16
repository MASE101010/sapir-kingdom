// Turns the plan into a three.js scene: the land, the river, every road, the wall, the first n houses, landmarks, trees.
// The site shows the kingdom as it stands; a reel poses every frame with pose(), so houses and landmarks rise when it says.
import * as THREE from 'three';
import { Pen } from './pen.js';
import { drawHome, drawShared } from './homes.js';
import { LANDMARKS } from './landmarks/index.js';
import { HILL } from './landmarks/castle.js';
import { Life } from './life.js';
import { riverDist, riverBend } from './river.js';

const GRASS = 0x86c766, FIELD = 0x9fd27a, ROAD = 0x6f737b, ROAD_LINE = 0xf4f1e8, WATER = 0x3fa9d6, SAND = 0xe8dcb5, STONE = 0xd2c8b2, ROOF = 0x2f5fa6;
const hash = (a, b) => { let h = Math.imul(a * 73856093 ^ b * 19349663, 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };

/** turns what was drawn since a mark into gold: light colours to gold, the middle ones to a deeper gold, dark ones stay */
function gild(p, from) {
  for (const [kind, a] of Object.entries(p.parts)) for (let i = (from[kind] ?? 0) * 8; i < a.length; i += 8) {
    const c = a[i + 7], l = (((c >> 16) & 255) * .3 + ((c >> 8) & 255) * .59 + (c & 255) * .11) / 255;
    a[i + 7] = l > .72 ? 0xf6d365 : l > .38 ? 0xe8b323 : l > .2 ? 0xb8860b : c;
  }
}
export class World {
  constructor(renderer, plan, residents, kingdom) {
    Object.assign(this, { renderer, plan, residents, kingdom });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfe3f5); this.scene.fog = new THREE.Fog(0xbfe3f5, 1400, 3400);
    this.camera = new THREE.PerspectiveCamera(42, 1, 2, 9000);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb7c99a, 1.25), sun = new THREE.DirectionalLight(0xfff4e0, 2.1);
    sun.position.set(-260, 420, 300); sun.castShadow = true; sun.shadow.mapSize.setScalar(new URLSearchParams(location.search).has('reel') ? 4096 : 2048); sun.shadow.bias = -.0005;
    Object.assign(sun.shadow.camera, { left: -420, right: 420, top: 420, bottom: -420, near: 10, far: 1400 });
    this.sun = sun; this.scene.add(hemi, sun, sun.target);
    this.land(); this.roads(); this.trees(); this.wall();
    this.life = new Life(this.scene, plan, kingdom?.dragons ?? 3);
    this.houses(); this.landmarks();
  }
  /** the ground, the castle hill, the river with its sandy banks, and mountains round the edge */
  land() {
    const s = this.scene, W = this.plan.wall;
    const ground = new THREE.Mesh(new THREE.CircleGeometry(4200, 96), new THREE.MeshLambertMaterial({ color: FIELD })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; s.add(ground);
    const inside = new THREE.Mesh(new THREE.CircleGeometry(W, 160), new THREE.MeshLambertMaterial({ color: GRASS })); inside.rotation.x = -Math.PI / 2; inside.position.y = .02; inside.receiveShadow = true; s.add(inside);
    const hill = new THREE.Mesh(new THREE.CylinderGeometry(74, 86, HILL, 64), new THREE.MeshLambertMaterial({ color: 0x79b85a })); hill.position.y = HILL / 2; hill.receiveShadow = true; s.add(hill);
    // the river: a lake near the castle, and a ribbon from it out past the wall, with sandy banks
    const R = this.plan.river, ux = Math.cos(R.a), uz = Math.sin(R.a);
    const strip = (half, y, color) => {
      const v = [], idx = [];
      for (let t = R.lake, i = 0; t <= 4300; t += 15, i++) { const o = riverBend(R, t), cx = ux * t - uz * o, cz = uz * t + ux * o;
        v.push(cx + uz * half, y, cz - ux * half, cx - uz * half, y, cz + ux * half); if (i) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })); m.receiveShadow = true; s.add(m);
      const lake = new THREE.Mesh(new THREE.CircleGeometry(R.lakeR + half - R.half, 48), m.material); lake.rotation.x = -Math.PI / 2; lake.position.set(ux * R.lake, y, uz * R.lake); lake.receiveShadow = true; s.add(lake);
    };
    strip(R.half + 5, .05, SAND); strip(R.half, .1, WATER);
    // mountains beyond the wall
    const p = new Pen();
    for (let i = 0; i < 70; i++) { const a = i / 70 * Math.PI * 2 + hash(i, 1) * .05, r = W + 380 + hash(i, 2) * 900, h = 120 + hash(i, 3) * 300;
      p.pyramid(Math.cos(a) * r, 0, Math.sin(a) * r, h * 2.2, h, hash(i, 4) > .5 ? 0x7f9c6a : 0x93a87c, hash(i, 5) * 3); p.pyramid(Math.cos(a) * r, h * .72, Math.sin(a) * r, h * .62, h * .3, 0xf5f5f0, hash(i, 5) * 3); }
    p.build(s, { shadows: false });
  }
  /** roads and garden strips, one group per ring: the kingdom only shows the rings people live on, and grows */
  roads() {
    const { rings, radials, river, lots } = this.plan, mat = new THREE.MeshLambertMaterial({ color: ROAD }), line = new THREE.MeshLambertMaterial({ color: ROAD_LINE });
    this.bands = [];
    // a bridge wherever a road crosses the river: found by walking the road, as long as the water is wide there
    const wet = (x, z) => riverDist(river, x, z) < 5;
    const bridge = (p, x, z, dx, dz) => {
      let a = 0, b = 0; while (a < 200 && wet(x - dx * a, z - dz * a)) a++; while (b < 200 && wet(x + dx * b, z + dz * b)) b++;
      const L = a + b + 6, cx = x + dx * (b - a) / 2, cz = z + dz * (b - a) / 2;
      p.at(cx, cz, Math.atan2(dx, dz));
      p.box(0, .1, 0, rings.road * 2 + 2, .6, L, 0xb9a88f); p.box(0, .7, 0, rings.road * 2 - .6, .05, L, ROAD);
      for (const sd of [-1, 1]) { p.box(sd * (rings.road + .7), .7, 0, .5, 1, L, 0xe9e0cc);
        for (let t = -L / 2; t <= L / 2; t += 4) p.box(sd * (rings.road + .7), .7, t, .8, 1.5, .8, 0xd8ccb4);
        p.box(sd * (rings.road + .7), 0, -L / 2, 1.4, 2.6, 1.4, 0xc9b99c); p.box(sd * (rings.road + .7), 0, L / 2, 1.4, 2.6, 1.4, 0xc9b99c); }
      p.at(0, 0);
    };
    const crossings = (fx, n, t0, t1) => { const out = []; let prev = null;
      for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n, [x, z] = fx(t), f = riverDist(river, x, z) < 5 ? -1 : 1;
        if (prev && prev.f > 0 && f < 0) {                    // walking into the water: the bridge starts here
           let lo = prev.t, hi = t; for (let j = 0; j < 20; j++) { const m = (lo + hi) / 2, [mx, mz] = fx(m); ((riverDist(river, mx, mz) < 5 ? -1 : 1) === Math.sign(prev.f) ? lo = m : hi = m); } out.push((lo + hi) / 2); }
        prev = { t, f }; }
      return out; };
    for (let k = 0; k < rings.count; k++) {
      const g = new THREE.Group(), r = rings.r0 + rings.step * k, segs = Math.min(360, 64 + k * 12);
      const m = new THREE.Mesh(new THREE.RingGeometry(r - rings.road, r + rings.road, segs), mat); m.rotation.x = -Math.PI / 2; m.position.y = .12; m.receiveShadow = true;
      const l = new THREE.Mesh(new THREE.RingGeometry(r - .18, r + .18, segs), line); l.rotation.x = -Math.PI / 2; l.position.y = .14; g.add(m, l);
      const r0 = k ? r - rings.step : 0;                       // the radial stretches that lead to this ring
      for (const d of radials.filter(d => d.from <= k)) {
        const a0 = Math.max(r0, d.from ? rings.r0 + rings.step * d.from : 0), len = r - a0; if (len <= 0) continue;
        const seg = new THREE.Mesh(new THREE.BoxGeometry(rings.road * 2, .1, len), mat), mid = a0 + len / 2;
        seg.position.set(Math.cos(d.a) * mid, .13, Math.sin(d.a) * mid); seg.rotation.y = Math.atan2(Math.cos(d.a), Math.sin(d.a)); seg.receiveShadow = true; g.add(seg);
      }
      { const p = new Pen();
        for (const a of crossings(a => [Math.cos(a) * r, Math.sin(a) * r], 1440, 0, Math.PI * 2)) bridge(p, Math.cos(a) * r, Math.sin(a) * r, -Math.sin(a), Math.cos(a));
        for (const d of radials.filter(d => d.from <= k)) { const a0 = Math.max(r0, d.from ? rings.r0 + rings.step * d.from : 0);
          if (r > a0) for (const t of crossings(t => [Math.cos(d.a) * t, Math.sin(d.a) * t], 200, a0, r)) bridge(p, Math.cos(d.a) * t, Math.sin(d.a) * t, Math.cos(d.a), Math.sin(d.a)); }
        p.build(g); }
      if (k) { const p = new Pen(), rm = r - rings.step / 2, n = Math.floor(2 * Math.PI * rm / 26);
        for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + hash(k, i) * .03, x = Math.cos(a) * rm, z = Math.sin(a) * rm;
          if (riverDist(river, x, z) < 10 || lots.some(l => Math.hypot(l.x - x, l.z - z) < l.r + 4) || hash(i, k) < .35) continue;
          p.tree(x, z, .8 + hash(k, i * 7) * .5, hash(i, k * 3) > .5 ? 0x4f9a43 : 0x63a94a); }
        p.build(g); }
      this.scene.add(g); this.bands.push(g);
    }
  }
  /** shows the rings up to n (the outermost ring anyone lives on, and one more) */
  setExtent(n) { this.bands.forEach((g, k) => g.visible = k <= n); this.life?.setExtent(n); }
  /** everything that moves, at time t (seconds) */
  animate(t) { this.life.update(t); for (const l of Object.values(this.lm ?? {})) l.mod.tick?.(l.group, t); }
  /** forests outside the wall */
  trees() {
    const p = new Pen(), W = this.plan.wall;
    for (let i = 0; i < 2400; i++) { const a = hash(i, 9) * Math.PI * 2, r = W + 40 + hash(i, 10) * 420; p.tree(Math.cos(a) * r, Math.sin(a) * r, 1 + hash(i, 11) * .9, hash(i, 12) > .5 ? 0x3f8a3a : 0x4f9a43); }
    p.build(this.scene);
  }
  wall() {
    const p = new Pen(), W = this.plan.wall, n = 120;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = (i + 1) / n * Math.PI * 2, m = (a + b) / 2, len = W * (b - a) + 1;
      if (Math.abs(Math.atan2(Math.sin(m - Math.PI / 2), Math.cos(m - Math.PI / 2))) < .02) continue;     // the south gate
      p.at(Math.cos(m) * W, Math.sin(m) * W, Math.atan2(-Math.cos(m), -Math.sin(m))).box(0, 0, 0, len, 9, 3.2, STONE);
      if (i % 6 === 0) { p.cyl(0, 0, 0, 9, 15, STONE); p.cone(0, 15, 0, 11, 8, ROOF); } }
    p.build(this.scene);
  }
  /** the residents' houses, in the order they came: a reel can show the first n */
  houses() {
    if (this.homeGroup) this.scene.remove(this.homeGroup);
    const p = new Pen(), up = this.kingdom.upgraded ?? {};
    // who lives on each plot: the first is the owner, friends who moved in make the house grow
    this.byPlot = new Map(); this.residents.forEach((r, k) => (this.byPlot.get(r.plot) ?? this.byPlot.set(r.plot, []).get(r.plot)).push(k));
    this.homeMarks = [p.mark()];
    this.residents.forEach((r, k) => {
      const people = this.byPlot.get(r.plot), pl = this.plan.plots[r.plot];
      if (pl && people[0] === k) { p.at(pl[0], pl[1], pl[2]); const n = people.length, before = p.mark();
        n > 1 ? drawShared(p, r, n) : drawHome(p, r, 1 + (up[r.u] ?? 0));
        if (people.some(j => this.residents[j].gold)) gild(p, before); }
      this.homeMarks.push(p.mark());
    });
    this.homes = p; this.homeGroup = p.build(); this.scene.add(this.homeGroup);
    // the next free plots: a patch of earth and four fence posts each, so the room for hundreds more houses is plain to see
    if (this.emptyGroup) this.scene.remove(this.emptyGroup);
    const e = new Pen(), used = new Set(this.residents.map(r => r.plot)), upto = Math.min(this.plan.plots.length, Math.max(this.residents.length + 400, 900));
    for (let k = 0; k < upto; k++) { if (used.has(k)) continue; const pl = this.plan.plots[k]; e.at(pl[0], pl[1], pl[2]);
      e.box(0, 0, 0, 9, .12, 9, 0xc9b58f); for (const [x, z] of [[-4.2, -4.2], [4.2, -4.2], [-4.2, 4.2], [4.2, 4.2]]) e.box(x, 0, z, .35, 1.3, .35, 0x8a6240); e.box(0, .9, 4.2, 8.4, .18, .18, 0x8a6240); }
    this.emptyGroup = e.build(new THREE.Group(), { shadows: false }); this.scene.add(this.emptyGroup);
    this.lotRing = this.plan.plots[upto - 1]?.[3] ?? 0;
    this.outerRing = this.residents.reduce((m, r) => Math.max(m, this.plan.plots[r.plot]?.[3] ?? 0), 0);
    this.setExtent(Math.max(this.outerRing + 1, this.lotRing));
  }
  /** everyone who lives in the house on this plot (indexes into residents, owner first) */
  housemates(plot) { return this.byPlot.get(plot) ?? []; }
  showHouses(n) { n = Math.max(0, Math.min(Math.round(n), this.homeMarks.length - 1)); this.homes.showUpTo(this.homeMarks[n]);
    const last = this.residents[n - 1]; this.setExtent(Math.max((last ? this.plan.plots[last.plot]?.[3] ?? 0 : 0) + 1, this.lotRing ?? 0)); }
  landmarks() {
    this.lm = {};
    const list = [{ key: 'castle' }, ...(this.kingdom.landmarks ?? []).filter(l => l.key !== 'castle')];
    for (const l of list) { const mod = LANDMARKS[l.key]; if (!mod) continue;
      const lot = l.lot != null ? this.plan.lots[l.lot] : null, p = new Pen(); mod.draw(p);
      const g = p.build(); if (lot) { g.position.set(lot.x, 0, lot.z); g.rotation.y = lot.rot; }
      mod.live?.(g, THREE); this.scene.add(g); this.lm[l.key] = { group: g, mod, at: lot ? [lot.x, lot.z] : mod.at ?? [0, 0] }; }
  }
  /** a landmark rising out of the ground (0 hidden, 1 standing) */
  rise(key, f) { const l = this.lm[key]; if (!l) return; l.group.visible = f > 0; l.group.scale.set(1, Math.max(.001, f), 1); }
  /** the sun follows the time of day in Israel; night lights the windows less */
  daylight(hour) {
    const night = hour < 6 || hour >= 19, dusk = !night && (hour < 7.5 || hour >= 17.5);
    const sky = night ? 0x1b2a46 : dusk ? 0xf4c9a2 : 0xbfe3f5;
    this.scene.background.setHex(sky); this.scene.fog.color.setHex(sky);
    this.sun.intensity = night ? .25 : dusk ? 1.3 : 2.1;
  }
  /** the sun's shadow box follows what the camera looks at */
  aim(target) { this.sun.target.position.copy(target); this.sun.position.set(target.x - 260, 420, target.z + 300); }
}
