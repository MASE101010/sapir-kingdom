// Props: things that exist only in a reel and change through it (ep.props), for the series "אתם מחליטים" (נהוראי), where
// the audience's idea happens in the next episode. Each prop is placed and animated by keyframes, like actors.js:
//   ep.props = [{ id, kind, x, z, ry, scale, keys: [{ line, dt, rise, fart, puddle }] }]
// rise (0..1) lifts it out of the ground, puddle (metres) is the radius of whatever it spills (eased between keys), and
// fart: true sets it off from that key until a key with fart: false.
// Kinds: 'chocodragon' (episode 2, @itamarsarusi's idea: a dragon statue that farts chocolate).
import * as THREE from 'three';

const mat = new Map(), M = c => { if (!mat.has(c)) mat.set(c, new THREE.MeshLambertMaterial({ color: c })); return mat.get(c); };
const box = (g, w, h, d, c, x, y, z, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c)); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; g.add(m); return m; };
const CHOC = 0x5a3220, CHOC2 = 0x7a4528, MILK = 0x9b6238;

function plaque(text, sub) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 320; const g = c.getContext('2d');
  const draw = () => { g.fillStyle = '#13213b'; g.fillRect(0, 0, 1024, 320); g.strokeStyle = '#e8b323'; g.lineWidth = 22; g.strokeRect(11, 11, 1002, 298);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.direction = 'rtl'; g.font = '900 104px "Secular One", Rubik, sans-serif'; g.fillText(text, 512, 150);
    g.fillStyle = '#e8b323'; g.font = '700 56px Rubik, sans-serif'; g.fillText(sub, 512, 250); };
  draw(); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.75), new THREE.MeshBasicMaterial({ map: tex })); m.userData.redraw = () => { draw(); tex.needsUpdate = true; };
  return m;
}

/** a dragon statue on a pedestal, sitting up, wings half open, tail curled, facing +z; its rear points to -z */
function chocoDragon() {
  const root = new THREE.Group(), statue = new THREE.Group(); root.add(statue);
  const G = 0x3f9a5a, G2 = 0x2f7a4a, BELLY = 0xf2d27a, GOLD = 0xe8b323, STONE = 0xe9dfc9, STONE2 = 0xd8ccb2;
  // the pedestal: two stone steps, a gold band, the plaque in front (live, Hebrew)
  box(root, 9, .6, 9, STONE2, 0, .3, 0); box(root, 7.6, 2.4, 7.6, STONE, 0, 1.8, 0); box(root, 7.8, .3, 7.8, GOLD, 0, 3.1, 0);
  for (const [x, z] of [[-3.6, 3.6], [3.6, 3.6], [-3.6, -3.6], [3.6, -3.6]]) { box(root, .6, .6, .6, GOLD, x, 3.4, z); }
  const pl = plaque('הדרקון של נהוראי 🐉', 'מפליץ שוקולד · 2,000,000 ₪'); pl.position.set(0, 1.85, 3.82); root.add(pl);
  statue.position.y = 3.25;
  const body = new THREE.Group(); statue.add(body);
  // sitting: a round belly and haunches, the chest rising, two short arms, the neck up and the head looking out
  box(body, 4.6, 3.6, 4.2, G, 0, 1.8, -.4); box(body, 3.4, 3, .5, BELLY, 0, 1.9, 1.8);
  for (const s of [-1, 1]) { box(body, 1.8, 2.2, 3.4, G2, s * 2.4, 1.1, -.6); box(body, 1.6, .7, 2, G, s * 2.4, .35, .9); for (const k of [-1, 0, 1]) box(body, .35, .35, .5, 0xf3ead8, s * 2.4 + k * .5, .25, 2); }
  box(body, 3.6, 3, 3.4, G, 0, 4.4, .2, -.15); box(body, 2.8, 2.4, .4, BELLY, 0, 4.4, 1.85, -.15);
  for (const s of [-1, 1]) { box(body, .9, 2.2, .9, G2, s * 1.9, 4, 1.4, -.9); box(body, .9, .6, .9, G, s * 1.9, 3.4, 2.4); }
  box(body, 2.2, 2.6, 2.2, G, 0, 6.6, .6, -.25); box(body, 1.9, 1.8, 1.9, G, 0, 8.1, 1.1, -.35);
  const head = new THREE.Group(); head.position.set(0, 9.4, 1.6); body.add(head);
  box(head, 2.8, 2.2, 2.8, G, 0, 0, 0); box(head, 2.2, 1.4, 2.4, G, 0, -.3, 2.2); box(head, 2, .5, 2.2, BELLY, 0, -1.1, 2);
  box(head, .55, .6, .2, 0xffffff, -.85, .5, 1.42); box(head, .55, .6, .2, 0xffffff, .85, .5, 1.42);
  const eyes = [box(head, .3, .35, .1, 0x1b1b1b, -.85, .45, 1.55), box(head, .3, .35, .1, 0x1b1b1b, .85, .45, 1.55)];
  box(head, .4, .3, .2, 0x2b2f36, -.5, -.1, 3.42); box(head, .4, .3, .2, 0x2b2f36, .5, -.1, 3.42);
  const grin = box(head, 1.4, .18, .1, 0x8a3a2a, 0, -.75, 3.42);
  for (const s of [-1, 1]) { box(head, .4, 1.8, .4, 0xf3ead8, s * .9, 1.5, -.6, -.5); box(head, .3, .3, .3, GOLD, s * .9, 2.4, -1.1); }
  for (let i = 0; i < 5; i++) box(body, .3, .9 - i * .1, .9, BELLY, 0, 8.6 - i * 1.5, -.2 - i * .35);   // spikes down the back
  // wings, half open
  for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(s * 1.6, 5, -1); w.rotation.set(0, s * .5, s * .35); body.add(w);
    box(w, 6, .4, .5, G2, s * 3, 2, 0, 0, 0, s * .5); box(w, .2, 4.6, 5.4, 0x7fd08a, s * 3.2, .8, -1.6, 0, 0, s * .12); }
  // the tail, curling round to the front on the pedestal
  [[0, .5, -2.9], [-1.1, .4, -3.6], [-2.4, .35, -3.2], [-3.1, .3, -1.9], [-3.2, .3, -.4], [-2.6, .3, .9]].forEach(([x, y, z], i) => box(body, 1.6 - i * .18, 1.3 - i * .12, 1.6 - i * .18, i % 2 ? G2 : G, x, y, z));
  box(body, 1.2, .2, 1.4, GOLD, -2.2, .4, 1.8);
  // the fart: a chocolate stream out of the back (-z), puffs of cocoa, and blobs that fall on the pavement
  const fart = new THREE.Group(); fart.position.set(0, 1.3, -2.7); body.add(fart);
  const choc = c => new THREE.MeshLambertMaterial({ color: c });
  const blobs = Array.from({ length: 48 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.26 + (i % 4) * .07, 10, 8), choc([CHOC, CHOC2, MILK][i % 3])); fart.add(m); return m; });
  const cloud = new THREE.MeshBasicMaterial({ color: 0xa87a55, transparent: true, opacity: .55, depthWrite: false });
  const puffs = Array.from({ length: 10 }, () => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), cloud); fart.add(m); return m; });
  // the puddle on the ground behind it, a flat chocolate pool with a few bubbles
  const puddle = new THREE.Group(); puddle.position.set(0, .07, -2); root.add(puddle);
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .14, 40), choc(CHOC)); puddle.add(pool);
  const shine = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .16, 30), choc(CHOC2)); shine.position.set(.25, .01, -.2); puddle.add(shine);
  const bubbles = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.22, 8, 6), choc(MILK)); puddle.add(m); return m; });
  root.userData = { statue, body, head, grin, eyes, fart, blobs, puffs, puddle, pool, shine, bubbles, plaque: pl };
  return root;
}

const builders = { chocodragon: chocoDragon };

/** the props of a reel: build them, and each frame set them as their keyframes say */
export function placeProps(scene, list = [], lineAt) {
  const all = list.map(spec => {
    const g = builders[spec.kind](); g.position.set(spec.x, spec.y ?? 0, spec.z); g.rotation.y = (spec.ry ?? 0) * Math.PI / 180; g.scale.setScalar(spec.scale ?? 1); scene.add(g);
    const keys = (spec.keys ?? [{ line: 0 }]).map(k => ({ ...k, t: lineAt(k.line, k.dt) })).sort((p, q) => p.t - q.t);
    return { id: spec.id, g, s: spec.scale ?? 1, keys };
  });
  let fresh = false;
  const val = (keys, t, name, dflt) => {             // eased from one key to the next
    const ks = keys.filter(k => k[name] != null); if (!ks.length) return dflt;
    let i = ks.findLastIndex(k => k.t <= t); if (i < 0) return ks[0][name];
    const a = ks[i], b = ks[i + 1]; if (!b) return a[name];
    const f = Math.min(1, Math.max(0, (t - a.t) / Math.max(.01, b.t - a.t))), e = f * f * (3 - 2 * f); return a[name] + (b[name] - a[name]) * e;
  };
  function update(t) {
    if (!fresh && document.fonts.status === 'loaded') { fresh = true; for (const p of all) p.g.userData.plaque?.userData.redraw?.(); }
    for (const p of all) {
      const u = p.g.userData, rise = val(p.keys, t, 'rise', 1), r = val(p.keys, t, 'puddle', 0);
      u.statue.position.y = 3.25 - (1 - rise) * 14; u.statue.visible = rise > .02;
      const on = p.keys.filter(k => k.fart != null && k.t <= t).at(-1), fartT = on?.fart ? t - on.t : -1;
      // while it farts: it squeezes and wobbles, grins, the eyes squint, the stream shoots out
      const w = fartT >= 0 ? Math.sin(fartT * 18) * .06 : 0;
      u.body.scale.set(1 + w, 1 - w * 1.2, 1 + w); u.body.rotation.x = fartT >= 0 ? -.05 + Math.sin(fartT * 9) * .03 : 0;
      u.grin.scale.set(fartT >= 0 ? 1.4 : 1, fartT >= 0 ? 2.4 : 1, 1); for (const e of u.eyes) e.scale.y = fartT >= 0 ? .25 : 1;
      u.fart.visible = fartT >= 0;
      u.blobs.forEach((m, i) => { const life = 1.25, ph = ((fartT + i * life / u.blobs.length) % life + life) % life, sp = 9 + (i % 5) * 1.3, side = ((i * 37) % 11 - 5) * .16;
        m.position.set(side * ph * 3, -ph * ph * 4.6 + ph * 1.2, -ph * sp); m.rotation.set(ph * 5, i, ph * 3); m.visible = fartT > i * .03; });
      u.puffs.forEach((m, i) => { const life = 1.6, ph = ((fartT + i * life / u.puffs.length) % life + life) % life;
        m.position.set(Math.sin(i * 2.1) * ph * 1.8, ph * 1.6, -1 - ph * 4); m.scale.setScalar(.6 + ph * 1.6); m.material.opacity = .55 * (1 - ph / life); });
      u.puddle.visible = r > .05; u.puddle.scale.set(r, 1, r * 1.25); u.puddle.position.z = -2 - r * .9;
      u.bubbles.forEach((m, i) => { const a = i * 2.4, rr = .3 + (i % 3) * .2, ph = (t * .8 + i * .37) % 1, k = (.6 + Math.sin(ph * Math.PI) * 1.4) / Math.max(1, r); m.position.set(Math.cos(a) * rr, .08 + ph * .1, Math.sin(a) * rr); m.scale.set(k, .6 + Math.sin(ph * Math.PI) * 1.4, k / 1.25); });
    }
  }
  const at = id => { const p = all.find(p => p.id === id); if (!p) return null; const v = p.g.position.clone(); v.y += 8 * p.s; return v; };
  const facing = id => all.find(p => p.id === id)?.g.rotation.y ?? 0;
  return { update, at, facing };
}
