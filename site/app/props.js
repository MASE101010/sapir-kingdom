// Props: things that exist only in a reel and change through it (ep.props), for the series "אתם מחליטים" (נהוראי), where
// the audience's idea happens in the next episode. Each prop is placed and animated by keyframes, like actors.js:
//   ep.props = [{ id, kind, x, z, ry, scale, keys: [{ line, dt, rise, fart, puddle }] }]
// rise (0..1) lifts it out of the ground, puddle (metres) is the radius of whatever it spills (eased between keys), and
// fart: true sets it off from that key until a key with fart: false.
// Kinds: 'chocodragon' (episode 2, @itamarsarusi's idea: a dragon statue that farts chocolate), 'teatable', 'chocoriver',
// 'mirrornote' and 'dogs' (גנב הכתר episode 8), 'feather' (episode 4: Nehorai tickles the dragon).
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
function chocoDragon(spec = {}) {
  const root = new THREE.Group(), statue = new THREE.Group(); root.add(statue);
  // spec.white: the second dragon (Nehorai episode 7), cream white, farting white chocolate
  const WH = !!spec.white, CHOC = WH ? 0xf3e6c8 : 0x5a3220, CHOC2 = WH ? 0xe8d6ae : 0x7a4528, MILK = WH ? 0xfff6e0 : 0x9b6238;
  const G = WH ? 0xf1efe6 : 0x3f9a5a, G2 = WH ? 0xd9d4c4 : 0x2f7a4a, BELLY = WH ? 0xf7d6e0 : 0xf2d27a, GOLD = 0xe8b323, STONE = 0xe9dfc9, STONE2 = 0xd8ccb2;
  // the pedestal: two stone steps, a gold band, the plaque in front (live, Hebrew)
  box(root, 9, .6, 9, STONE2, 0, .3, 0); box(root, 7.6, 2.4, 7.6, STONE, 0, 1.8, 0); box(root, 7.8, .3, 7.8, GOLD, 0, 3.1, 0);
  for (const [x, z] of [[-3.6, 3.6], [3.6, 3.6], [-3.6, -3.6], [3.6, -3.6]]) { box(root, .6, .6, .6, GOLD, x, 3.4, z); }
  const pl = plaque(spec.title ?? 'הדרקון של נהוראי 🐉', spec.sub ?? 'מפליץ שוקולד · 2,000,000 ₪'); pl.position.set(0, 1.85, 3.82); root.add(pl);
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
    box(w, 6, .4, .5, G2, s * 3, 2, 0, 0, 0, s * .5); box(w, .2, 4.6, 5.4, WH ? 0xf3c6d6 : 0x7fd08a, s * 3.2, .8, -1.6, 0, 0, s * .12); }
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
  // a fan's scarf round the neck (Nehorai episode 6): red and black stripes, two long ends hanging over the chest; key 'scarf'
  const scarf = new THREE.Group(); scarf.position.set(0, 7.2, .7); scarf.rotation.x = -.25; body.add(scarf);
  for (let k = 0; k < 4; k++) box(scarf, 3 - k * .05, .32, 3, k % 2 ? 0x1b1d21 : 0xc8102e, 0, -.48 + k * .32, 0);
  for (const sx of [-.55, .55]) for (let k = 0; k < 6; k++) box(scarf, .75, .5, .25, k % 2 ? 0x1b1d21 : 0xc8102e, sx, -.75 - k * .5, 1.55 + k * .04, sx * .1);
  for (const sx of [-.55, .55]) for (let k = 0; k < 4; k++) box(scarf, .1, .35, .1, 0xf3ead6, sx - .25 + k * .17, -3.85, 1.8);
  scarf.visible = false;
  root.userData = { statue, body, head, grin, eyes, fart, blobs, puffs, puddle, pool, shine, bubbles, plaque: pl, scarf };
  return root;
}

/** a little table outside the palace with the king's tea: a cup with steam, the sugar jar (full of salt!) and a spilled pile */
function teaTable() {
  const root = new THREE.Group(), WOOD = 0x8a6240, WHITE = 0xf7f5ee, GOLD = 0xe8b323, NAVY = 0x13213b;
  box(root, 2.4, .12, 1.6, WOOD, 0, 1.05, 0); for (const [x, z] of [[-1, -.6], [1, -.6], [-1, .6], [1, .6]]) box(root, .12, 1.05, .12, WOOD, x, .52, z);
  box(root, 2.6, .03, 1.8, WHITE, 0, 1.13, 0); for (const s of [-1, 1]) box(root, 2.6, .35, .03, WHITE, 0, .97, s * .9);
  box(root, .12, .35, 1.8, GOLD, -1.25, .97, 0); box(root, .12, .35, 1.8, GOLD, 1.25, .97, 0);
  // the cup: a saucer, a cup with a handle, tea inside, steam
  const cupG = new THREE.Group(); cupG.position.set(-.55, 1.15, .2); root.add(cupG);
  const cyl = (r1, r2, h, c, y) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 20), new THREE.MeshLambertMaterial({ color: c })); m.position.y = y; cupG.add(m); return m; };
  cyl(.34, .3, .04, WHITE, .02); cyl(.22, .16, .3, WHITE, .19); cyl(.2, .2, .02, 0x9a5a2a, .33); cyl(.235, .235, .03, GOLD, .32);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.09, .025, 8, 16), new THREE.MeshLambertMaterial({ color: WHITE })); handle.position.set(.25, .2, 0); cupG.add(handle);
  const steam = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5, depthWrite: false })); cupG.add(m); return m; });
  // the jar: glass with a gold lid, full of white grains, a label that says סוכר
  const jar = new THREE.Group(); jar.position.set(.45, 1.15, -.1); root.add(jar);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .7, 20), new THREE.MeshLambertMaterial({ color: 0xdff2fa, transparent: true, opacity: .45 })); glass.position.y = .35; jar.add(glass);
  const grains = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .5, 20), new THREE.MeshLambertMaterial({ color: 0xffffff })); grains.position.y = .27; jar.add(grains);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .1, 20), new THREE.MeshLambertMaterial({ color: GOLD })); lid.position.y = .75; jar.add(lid);
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  const draw = () => { g.fillStyle = '#fffbe8'; g.fillRect(0, 0, 256, 128); g.strokeStyle = '#13213b'; g.lineWidth = 8; g.strokeRect(4, 4, 248, 120);
    g.fillStyle = '#13213b'; g.textAlign = 'center'; g.direction = 'rtl'; g.font = '900 72px "Secular One", Rubik, sans-serif'; g.fillText('סוכר', 128, 92); };
  draw(); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(.42, .21), new THREE.MeshBasicMaterial({ map: tex })); label.position.set(0, .36, .285); jar.add(label);
  // a spoon and a little spilled pile of salt, a salt shaker that says מלח (the swap)
  box(root, .5, .03, .06, 0xc9c9c9, -.05, 1.17, .45, 0, .4); const pile = new THREE.Mesh(new THREE.ConeGeometry(.16, .1, 12), new THREE.MeshLambertMaterial({ color: 0xffffff })); pile.position.set(.15, 1.2, .5); root.add(pile);
  root.userData = { labelRedraw: () => { draw(); tex.needsUpdate = true; },
    update(t) { steam.forEach((m, i) => { const ph = (t * .5 + i / steam.length) % 1; m.position.set(Math.sin(ph * 6 + i) * .06, .4 + ph * .9, 0); m.scale.setScalar(.6 + ph * 1.8); m.material.opacity = .5 * (1 - ph); }); } };
  return root;
}

/** a chocolate river: a winding channel with stone banks, a wooden bridge, a dock, rubber rings floating down it with
 * little riders, and a ticket gate with a price sign. rise (0..1) fills it; the rings drift along it over time */
function chocoRiver(spec) {
  const root = new THREE.Group(), STONE = 0xd8ccb2, WOOD = 0x8a6240, WOOD2 = 0x6e4a2e, GOLD = 0xe8b323, NAVY = 0x13213b;
  const L = spec.len ?? 46, W = spec.wiggle ?? 5, path = u => new THREE.Vector3(Math.sin(u * Math.PI * 2.2) * W, 0, -u * L);           // local, from 0 to -L
  const fill = new THREE.Group(); root.add(fill);
  const segs = Math.round(L * .9);
  for (let i = 0; i < segs; i++) {
    const a = path(i / segs), b = path((i + 1) / segs), mid = a.clone().add(b).multiplyScalar(.5), len = a.distanceTo(b) + .4, ang = Math.atan2(b.x - a.x, b.z - a.z);
    const m = new THREE.Mesh(new THREE.BoxGeometry(5.2, .3, len), new THREE.MeshLambertMaterial({ color: i % 3 ? CHOC : CHOC2 })); m.position.copy(mid); m.position.y = .1; m.rotation.y = ang; fill.add(m);
    for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(.9, .55, len), new THREE.MeshLambertMaterial({ color: (i + (s > 0)) % 2 ? STONE : 0xe9dfc9 }));
      st.position.set(mid.x + Math.cos(ang) * s * 3.05, .27, mid.z - Math.sin(ang) * s * 3.05); st.rotation.y = ang; root.add(st); }
  }
  // swirls on the surface
  const swirls = Array.from({ length: 14 }, (_, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(.45 + (i % 3) * .2, .07, 6, 18), new THREE.MeshLambertMaterial({ color: MILK })); m.rotation.x = -Math.PI / 2; fill.add(m); return m; });
  // the bridge over the middle, the dock at the start
  const bm = path(.5); const bridge = new THREE.Group(); bridge.position.set(bm.x, 0, bm.z); root.add(bridge);
  box(bridge, 8.4, .25, 2.2, WOOD, 0, .95, 0); for (const s of [-1, 1]) { box(bridge, 8.4, .12, .12, WOOD2, 0, 1.9, s * 1); for (let k = 0; k < 6; k++) box(bridge, .14, 1, .14, WOOD2, -3.8 + k * 1.52, 1.4, s * 1); }
  for (const s of [-1, 1]) box(bridge, 1.2, .95, 2.2, 0xe9dfc9, s * 3.9, .47, 0);
  box(root, 5.6, .2, 2.4, WOOD, 0, .45, 1.6); for (const x of [-2.6, 2.6]) box(root, .25, 1.2, .25, WOOD2, x, .3, 2.7);
  // the ticket gate: two posts, an arch with the sign (canvas), a booth
  const gate = new THREE.Group(); gate.position.set(6.5, 0, 2.5); gate.rotation.y = -.5; root.add(gate);
  for (const x of [-2.4, 2.4]) { box(gate, .7, 4.6, .7, NAVY, x, 2.3, 0); const b = new THREE.Mesh(new THREE.SphereGeometry(.45, 10, 8), new THREE.MeshLambertMaterial({ color: GOLD })); b.position.set(x, 4.9, 0); gate.add(b); }
  const sg = plaque('נהר השוקולד 🍫', 'כניסה: 150 ₪'); sg.scale.setScalar(.95); sg.position.set(0, 3.6, .38); gate.add(sg);
  box(gate, 5.6, 1.9, .3, NAVY, 0, 3.6, 0);
  // the rubber rings with riders, drifting down
  const RING = [0xf3a6b8, 0x8fdcc0, 0xf6d84a, 0x7cc4ea, 0xc9b2ec, 0xf28c28];
  const rings = Array.from({ length: 7 }, (_, i) => { const g = new THREE.Group(); fill.add(g);
    const t = new THREE.Mesh(new THREE.TorusGeometry(.75, .32, 10, 20), new THREE.MeshLambertMaterial({ color: RING[i % RING.length] })); t.rotation.x = -Math.PI / 2; t.position.y = .35; g.add(t);
    box(g, .5, .7, .35, [0x13213b, 0xc2412d, 0x0f6f73, 0xe8b323][i % 4], 0, .75, 0); box(g, .42, .42, .42, 0xe2b48f, 0, 1.3, 0); box(g, .45, .12, .45, 0x2a1a10, 0, 1.55, 0);
    for (const s of [-1, 1]) box(g, .14, .5, .14, 0xe2b48f, s * .34, 1.15, 0, 0, 0, s * -.9);
    return g; });
  root.userData = { plaque: sg, update(t, val) {
    const rise = val('rise', 1); fill.position.y = (rise - 1) * .6; fill.scale.set(1, Math.max(.01, rise), 1); fill.visible = rise > .02;
    const on = val('float', 0);
    rings.forEach((g, i) => { const u = ((t * .028 + i / rings.length) % 1), p = path(u); g.position.set(p.x + Math.sin(t + i) * .5, .2, p.z); g.rotation.y = t * .6 + i; g.visible = on > .5; });
    swirls.forEach((m, i) => { const u = ((t * .02 + i / swirls.length) % 1), p = path(u); m.position.set(p.x + ((i * 7) % 5 - 2) * .5, .27, p.z); m.rotation.z = t * (i % 2 ? 1 : -1); });
  } };
  return root;
}


/** a note on the floor in mirror writing (episode 8 of גנב הכתר): a sheet of paper, the words drawn backwards; a little
 * hand mirror lies beside it, and in the mirror the words read the right way round */
function mirrorNote(spec) {
  const root = new THREE.Group();
  const c = document.createElement('canvas'); c.width = 512; c.height = 360; const g = c.getContext('2d');
  const draw = (flip) => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#fffaf0'; g.fillRect(0, 0, 512, 360); g.strokeStyle = '#d9cdb0'; g.lineWidth = 3;
    for (let y = 90; y < 360; y += 60) { g.beginPath(); g.moveTo(30, y); g.lineTo(482, y); g.stroke(); }
    if (flip) { g.translate(512, 0); g.scale(-1, 1); }
    g.fillStyle = '#7a2a8a'; g.textAlign = 'center'; g.direction = 'rtl'; g.font = '900 92px "Secular One", Rubik, sans-serif';
    g.fillText(spec.line1 ?? 'תודה', 256, 150); g.fillText(spec.line2 ?? 'על המשחק', 256, 270); };
  const mk = (flip, w, h) => { const cc = document.createElement('canvas'); cc.width = 512; cc.height = 360; const tex = new THREE.CanvasTexture(cc); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    m.userData.redraw = () => { draw(flip); cc.getContext('2d').drawImage(c, 0, 0); tex.needsUpdate = true; }; m.userData.redraw(); return m; };
  const paper = mk(true, 1.6, 1.12); paper.rotation.x = -Math.PI / 2; paper.rotation.z = .15; paper.position.set(0, .34, 0); root.add(paper);
  // the hand mirror standing up behind it: a gold frame, a handle, and the words the right way round in the glass
  const mirror = new THREE.Group(); mirror.position.set(.2, .3, -.9); mirror.rotation.x = -.25; root.add(mirror);
  box(mirror, 1.5, 1.1, .08, 0xe8b323, 0, .75, 0); box(mirror, .2, .5, .08, 0xe8b323, 0, .05, 0);
  const glass = mk(false, 1.3, .9); glass.position.set(0, .75, .05); mirror.add(glass);
  root.userData = { labelRedraw: () => { paper.userData.redraw(); glass.userData.redraw(); }, update(t, val) { const r = val('rise', 1); root.visible = r > .02; mirror.scale.setScalar(Math.max(.01, val('mirror', 1))); } };
  return root;
}

/** three sniffer dogs with their noses to the ground, tails wagging; rise (0..1) brings them in, sniff (0/1) sets the
 * noses going and the tails wagging; they face +z */
function dogs(spec) {
  const root = new THREE.Group(), cols = [[0xa5703f, 0x2a2a2a], [0xd9a86a, 0xa5703f], [0x2a2a2a, 0xa5703f]];
  const all = [[-1.8, 0, .1], [0, .9, 0], [1.8, -.2, -.1]].map(([x, z, r], i) => { const d = new THREE.Group(); d.position.set(x, 0, z); d.rotation.y = r; root.add(d);
    const [c, c2] = cols[i], S = 1.8, b = (bx, by, bz, w, h, dd, col, par = d) => box(par, w * S, h * S, dd * S, col, bx * S, (by + h / 2) * S, bz * S);
    b(0, .45, 0, .45, .4, 1, c); for (const [lx, lz] of [[-.15, .35], [.15, .35], [-.15, -.35], [.15, -.35]]) b(lx, 0, lz, .13, .48, .13, c);
    const head = new THREE.Group(); head.position.set(0, .7 * S, .55 * S); d.add(head);
    b(0, 0, .05, .38, .38, .38, c, head); b(0, -.02, .3, .2, .18, .22, 0xd9a86a, head); b(0, .05, .42, .08, .07, .05, 0x1b1b1b, head);
    b(-.17, .12, 0, .08, .26, .14, c2, head); b(.17, .12, 0, .08, .26, .14, c2, head);
    const tail = new THREE.Group(); tail.position.set(0, .8 * S, -.5 * S); d.add(tail); b(0, 0, -.05, .08, .32, .08, c, tail);
    return { d, head, tail, i }; });
  root.userData = { update(t, val) { const r = val('rise', 1), sn = val('sniff', 0); root.visible = r > .02; root.scale.setScalar(Math.max(.01, r));
    all.forEach(({ head, tail, i }) => { head.rotation.x = sn * (.55 + Math.sin(t * 14 + i) * .12); tail.rotation.z = Math.sin(t * 16 + i * 2) * (.3 + sn * .5); }); } };
  return root;
}

/** a giant feather on a wooden stand, its plume up against whatever is in front (+z); tickle (0/1) makes it swish */
function feather(spec) {
  const root = new THREE.Group(), WOOD = 0x8a6240, GOLD = 0xe8b323;
  box(root, 2.4, .5, 2.4, WOOD, 0, .25, 0); box(root, .5, 2.4, .5, 0x6e4a2e, 0, 1.6, 0);
  const arm = new THREE.Group(); arm.position.set(0, 2.8, 0); root.add(arm);
  const quill = new THREE.Group(); quill.rotation.x = .55; arm.add(quill);
  box(quill, .22, 9, .22, 0xf3ead6, 0, 4.5, 0);
  const COL = [0xf3a6b8, 0xc9b2ec, 0x7cc4ea, 0x8fdcc0, 0xf6d84a, 0xf28c28];
  for (let k = 0; k < 16; k++) { const y = 2.6 + k * .42, w = 1.2 + Math.sin(k / 15 * Math.PI) * 1.6; for (const s of [-1, 1]) { const m = box(quill, w, .34, .12, COL[k % COL.length], s * (w / 2 + .05), y, 0); m.rotation.z = s * .35; } }
  box(quill, .5, .5, .5, GOLD, 0, .3, 0);
  const pl = plaque('הנוצה של נהוראי 🪶', '500,000 ₪'); pl.scale.setScalar(.6); pl.position.set(0, .9, -1.25); pl.rotation.y = Math.PI; root.add(pl);
  root.userData = { plaque: pl, update(t, val) { const r = val('rise', 1), tk = val('tickle', 0); root.visible = r > .02; root.scale.setScalar(Math.max(.01, r));
    arm.rotation.z = Math.sin(t * 13) * .28 * tk; arm.rotation.x = Math.sin(t * 9) * .1 * tk; } };
  return root;
}


/** a sponsor board on two posts (Nehorai episode 5): a big plaque with a title and a line under it; rise (0..1) brings it up */
function board(spec) {
  const root = new THREE.Group();
  for (const sx of [-3.6, 3.6]) box(root, .35, 3.4, .35, 0x2b2f36, sx, 1.7, 0);
  const pl = plaque(spec.text ?? 'ספונסר', spec.sub ?? ''); pl.scale.setScalar(spec.size ?? 1.1); pl.position.set(0, 3.3, .25); root.add(pl);
  root.userData = { plaque: pl, update(t, val) { const r = val('rise', 1); root.visible = r > .02; root.position.y = (r - 1) * 5; } };
  return root;
}


/** a camera on a pole with a striped sock pulled over it (גנב הכתר episode 10); key 'sock' (0..1) shows the sock */
function sockCam(spec) {
  const root = new THREE.Group(), DARK = 0x2b2f36;
  box(root, .32, 5, .32, DARK, 0, 2.5, 0); box(root, .25, .25, .9, 0x9aa3ab, 0, 5.1, .4);
  const cam = new THREE.Group(); cam.position.set(0, 5, .95); root.add(cam);
  box(cam, .7, .6, 1.1, 0xf7f5ee, 0, 0, 0); box(cam, .4, .4, .2, 0x1b1b1b, 0, .05, .6); box(cam, .12, .12, .12, 0xc2412d, .22, .35, .4);
  const sock = new THREE.Group(); cam.add(sock);
  for (let k = 0; k < 6; k++) box(sock, .86, .74, .2, k % 2 ? 0xf7f5ee : 0x7cc4ea, 0, .02, .66 - k * .21);
  box(sock, .9, .3, .5, 0x7cc4ea, 0, .45, .2); box(sock, .8, .5, .6, 0xf7f5ee, 0, .7, -.1); box(sock, .7, .4, .5, 0x7cc4ea, 0, 1.05, -.3);
  root.userData = { update(t, val) { const s = val('sock', 1); sock.visible = s > .02; sock.scale.setScalar(Math.max(.01, s)); } };
  return root;
}


/** light bulbs taken out of the lanterns, set down in a neat row (גנב הכתר episode 11); key 'rise' brings them in one by one */
function bulbs(spec) {
  const root = new THREE.Group(), n = spec.n ?? 20, all = [];
  for (let i = 0; i < n; i++) { const b = new THREE.Group(); b.position.set((i - (n - 1) / 2) * .55, 0, 0); root.add(b);
    box(b, .22, .25, .22, 0x9aa3ab, 0, .12, 0); const gl = new THREE.Mesh(new THREE.SphereGeometry(.2, 12, 10), new THREE.MeshLambertMaterial({ color: 0xfff2c4, emissive: 0x403010 })); gl.position.y = .42; b.add(gl); all.push(b); }
  root.userData = { update(t, val) { const r = val('rise', 1); all.forEach((b, i) => { b.visible = r * n > i; }); } };
  return root;
}

/** the newsroom's cut cable, coiled on the ground and tied with a red ribbon bow like a present, the cut plug sticking out
 * (גנב הכתר episode 12). Keys: rise (0..1) */
function cable(spec) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const BLK = 0x23262c, RIB = 0xd8344a, RIB2 = 0xb0283c, CU = 0xd99a4a;
  const ring = (r, y, c = BLK, t = .13) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 10, 40), M(c)); m.rotation.x = Math.PI / 2; m.position.y = y; m.castShadow = true; body.add(m); return m; };
  for (let k = 0; k < 7; k++) ring(1.1 - (k % 2) * .08, .13 + k * .22);
  // the ribbon round the coil, crossing over the top, and a big bow
  box(body, .28, 1.7, 2.5, RIB, 0, .85, 0); box(body, 2.5, 1.7, .28, RIB, 0, .85, 0);
  box(body, .3, .06, 2.4, RIB, 0, 1.72, 0); box(body, 2.4, .06, .3, RIB, 0, 1.72, 0);
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.TorusGeometry(.42, .12, 8, 20), M(RIB)); l.position.set(s * .45, 2.1, 0); l.rotation.set(0, 0, s * .5); l.scale.set(1, .8, .6); l.castShadow = true; body.add(l);
    box(body, .2, .6, .06, RIB2, s * .3, 1.55, .25, 0, 0, s * .5); }
  box(body, .3, .3, .3, RIB2, 0, 2, 0);
  // the cut end: a run of cable out of the coil with copper wires showing, and a little tag
  box(body, 1.6, .22, .22, BLK, 1.85, .14, .5, 0, -.3, 0); box(body, .5, .3, .3, 0x3a3f47, 2.7, .16, .78, 0, -.3, 0);
  for (const d of [-.07, .07]) box(body, .25, .05, .05, CU, 3.05, .2 + d, .9 + d, 0, -.3, 0);
  box(body, .5, .32, .03, 0xf7f5ee, -.75, 1.2, .9, 0, .2, .1); box(body, .04, .3, .03, RIB, -.55, 1.45, .88);
  root.userData = { update(t, val) { const r = val('rise', 1); body.scale.setScalar(Math.max(.001, r)); body.visible = r > .01; } };
  return root;
}

const builders = { chocodragon: chocoDragon, teatable: teaTable, chocoriver: chocoRiver, mirrornote: mirrorNote, dogs, feather, board, sockcam: sockCam, bulbs, cable };

/** the props of a reel: build them, and each frame set them as their keyframes say */
export function placeProps(scene, list = [], lineAt) {
  const all = list.map(spec => {
    const g = builders[spec.kind](spec); g.position.set(spec.x, spec.y ?? 0, spec.z); g.rotation.y = (spec.ry ?? 0) * Math.PI / 180; g.scale.setScalar(spec.scale ?? 1); scene.add(g);
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
    if (!fresh && document.fonts.status === 'loaded') { fresh = true; for (const p of all) { p.g.userData.plaque?.userData.redraw?.(); p.g.userData.labelRedraw?.(); } }
    for (const p of all) {
      if (p.g.userData.update) { p.g.userData.update(t, (name, dflt) => val(p.keys, t, name, dflt)); continue; }
      const u = p.g.userData, rise = val(p.keys, t, 'rise', 1), r = val(p.keys, t, 'puddle', 0);
      u.statue.position.y = 3.25 - (1 - rise) * 14; u.statue.visible = rise > .02;
      const on = p.keys.filter(k => k.fart != null && k.t <= t).at(-1), fartT = on?.fart ? t - on.t : -1;
      // while it farts: it squeezes and wobbles, grins, the eyes squint, the stream shoots out
      const w = fartT >= 0 ? Math.sin(fartT * 18) * .06 : 0;
      u.body.scale.set(1 + w, 1 - w * 1.2, 1 + w); u.body.rotation.x = fartT >= 0 ? -.05 + Math.sin(fartT * 9) * .03 : 0;
      u.grin.scale.set(fartT >= 0 ? 1.4 : 1, fartT >= 0 ? 2.4 : 1, 1); for (const e of u.eyes) e.scale.y = fartT >= 0 ? .25 : 1;
      u.fart.visible = fartT >= 0;
      { const sc = val(p.keys, t, 'scarf', 0); u.scarf.visible = sc > .02; u.scarf.scale.setScalar(Math.max(.01, sc)); }
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
