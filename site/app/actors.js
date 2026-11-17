// Actors: people of the kingdom who appear in a reel and move through it (ep.actors). Day 34's new series "אתם מחליטים"
// follows one of them, נהוראי, whose every step the audience chooses. An actor is a voxel figure with a head, a body, two
// arms and two legs on pivots, so it can walk, jump, cheer, dance and point; it is placed and posed by keyframes:
//   ep.actors = [{ id: 'nehorai', look: { shirt, pants, hair, skin, apron }, scale, keys: [{ line, dt, x, z, ry, anim, y }] }]
// Between two keyframes it slides from one spot to the next (walking if the anim is 'walk'); anims: idle, walk, run, jump,
// cheer (arms up and hop), dance, point, sit, shock (arms out, leaning back), hold (holding a prop up: the giant cheque).
import * as THREE from 'three';

const mat = new Map(), M = c => { if (!mat.has(c)) mat.set(c, new THREE.MeshLambertMaterial({ color: c })); return mat.get(c); };
const box = (g, w, h, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c)); m.position.set(x, y, z); g.add(m); return m; };

/** a voxel person about 1.8 m tall (times scale), feet at y 0, facing +z */
export function makeActor(look = {}) {
  const L = { skin: 0xe2b48f, hair: 0x2a1a10, shirt: 0xf6d84a, pants: 0x2f4a7a, shoes: 0xffffff, apron: null, eyes: 0x1b1b1b, ...look };
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const legL = new THREE.Group(), legR = new THREE.Group(), armL = new THREE.Group(), armR = new THREE.Group(), head = new THREE.Group();
  legL.position.set(-.15, .82, 0); legR.position.set(.15, .82, 0);
  for (const leg of [legL, legR]) { box(leg, .24, .74, .26, L.pants, 0, -.37, 0); box(leg, .26, .12, .36, L.shoes, 0, -.78, .05); body.add(leg); }
  box(body, .6, .66, .34, L.shirt, 0, 1.15, 0);                                                                   // the torso
  if (L.apron) { box(body, .5, .7, .04, L.apron, 0, 1.0, .19); box(body, .06, .3, .04, L.apron, -.2, 1.42, .19); box(body, .06, .3, .04, L.apron, .2, 1.42, .19); }
  if (L.logo) box(body, .2, .2, .03, L.logo, .15, 1.3, .18);
  armL.position.set(-.4, 1.44, 0); armR.position.set(.4, 1.44, 0);
  for (const [arm, s] of [[armL, -1], [armR, 1]]) { box(arm, .2, .58, .22, L.shirt, 0, -.26, 0); box(arm, .18, .14, .2, L.skin, 0, -.6, 0); body.add(arm); }
  head.position.set(0, 1.5, 0); body.add(head);
  box(head, .5, .5, .46, L.skin, 0, .27, 0);                                                                     // the face
  box(head, .54, .16, .5, L.hair, 0, .56, -.01); box(head, .54, .26, .12, L.hair, 0, .4, -.22);                 // curly hair, top and back
  for (const [x, z] of [[-.2, .1], [.2, .12], [0, .16], [-.1, -.1], [.12, -.08]]) box(head, .16, .12, .16, L.hair, x, .66, z);
  box(head, .08, .1, .02, L.eyes, -.11, .3, .235); box(head, .08, .1, .02, L.eyes, .11, .3, .235);              // eyes
  const mouth = box(head, .18, .05, .02, 0x8a3a2a, 0, .14, .235);
  box(head, .07, .1, .07, L.skin, 0, .22, .25);                                                                  // nose
  return { root, body, legL, legR, armL, armR, head, mouth };
}

/** pose an actor at time t (seconds) in an anim, started at t0 */
export function pose(a, anim, t, t0 = 0) {
  const s = t - t0, sw = Math.sin(s * 9);
  a.legL.rotation.x = a.legR.rotation.x = 0; a.armL.rotation.set(0, 0, 0); a.armR.rotation.set(0, 0, 0);
  a.body.position.y = 0; a.body.rotation.set(0, 0, 0); a.head.rotation.set(0, 0, 0); a.mouth.scale.y = 1;
  if (anim === 'walk' || anim === 'run') { const k = anim === 'run' ? 1 : .55, f = anim === 'run' ? 14 : 8, w = Math.sin(s * f);
    a.legL.rotation.x = w * k; a.legR.rotation.x = -w * k; a.armL.rotation.x = -w * k; a.armR.rotation.x = w * k; a.body.position.y = Math.abs(Math.cos(s * f)) * .06 * k; }
  if (anim === 'jump') { const h = Math.abs(Math.sin(s * 4.2)); a.body.position.y = h * .9; a.legL.rotation.x = a.legR.rotation.x = -h * .6;
    a.armL.rotation.z = -2.6; a.armR.rotation.z = 2.6; a.mouth.scale.y = 4; }
  if (anim === 'cheer') { const h = Math.abs(Math.sin(s * 5)); a.body.position.y = h * .35; a.armL.rotation.z = -2.5 - .3 * sw; a.armR.rotation.z = 2.5 + .3 * sw; a.mouth.scale.y = 4; }
  if (anim === 'dance') { a.body.rotation.y = Math.sin(s * 4) * .5; a.body.position.y = Math.abs(Math.sin(s * 8)) * .15; a.armL.rotation.z = -1.4 + Math.sin(s * 8) * .8; a.armR.rotation.z = 1.4 + Math.sin(s * 8 + 1) * .8;
    a.legL.rotation.x = Math.sin(s * 8) * .4; a.legR.rotation.x = -Math.sin(s * 8) * .4; a.mouth.scale.y = 3; }
  if (anim === 'point') { a.armR.rotation.x = -1.5; a.head.rotation.y = .15; }
  if (anim === 'shock') { a.body.rotation.x = -.2; a.armL.rotation.z = -1.2; a.armR.rotation.z = 1.2; a.armL.rotation.x = a.armR.rotation.x = -.6; a.mouth.scale.y = 5; }
  if (anim === 'hold') { a.armL.rotation.z = -2.9; a.armR.rotation.z = 2.9; a.body.position.y = Math.abs(Math.sin(s * 3)) * .12; a.mouth.scale.y = 4; }
  if (anim === 'sit') { a.legL.rotation.x = a.legR.rotation.x = -1.5; a.body.position.y = -.42; }
  if (anim === 'think') { a.armR.rotation.x = -2.2; a.armR.rotation.z = .5; a.head.rotation.z = .15; a.head.rotation.x = Math.sin(s * 1.5) * .05; }
  if (anim === 'idle' || !anim) { a.head.rotation.y = Math.sin(s * .8) * .2; a.body.position.y = Math.sin(s * 2) * .01; }
}

/** a giant cheque, held up over the head: a white board with the amount (drawn on a canvas) */
export function cheque(text = '10,000,000 ₪', sub = 'ממלכת משפחת ספיר') {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  const draw = () => {
  g.fillStyle = '#fffdf3'; g.fillRect(0, 0, 1024, 512); g.strokeStyle = '#e8b323'; g.lineWidth = 28; g.strokeRect(14, 14, 996, 484);
  g.fillStyle = '#13213b'; g.textAlign = 'center'; g.direction = 'rtl';
  g.font = '700 54px Rubik, sans-serif'; g.fillText('צ\'ק מהמלך 👑', 512, 110);
  g.font = '900 150px "Secular One", Rubik, sans-serif'; g.fillStyle = '#0f6f73'; g.fillText(text, 512, 300);
  g.font = '600 46px Rubik, sans-serif'; g.fillStyle = '#13213b'; g.fillText(sub, 512, 410); };
  draw(); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, .05), [M(0xfffdf3), M(0xfffdf3), M(0xfffdf3), M(0xfffdf3), new THREE.MeshBasicMaterial({ map: tex }), M(0xfffdf3)]);
  m.userData.redraw = () => { draw(); tex.needsUpdate = true; };          // again once the fonts have loaded
  return m;
}

/** the actors of a reel: build them, and each frame put them where their keyframes say */
export function castActors(scene, list = [], lineAt) {
  const cast = list.map(spec => {
    const a = makeActor(spec.look), s = spec.scale ?? 1; a.root.scale.setScalar(s); scene.add(a.root);
    const keys = spec.keys.map(k => ({ ...k, t: lineAt(k.line, k.dt) })).sort((p, q) => p.t - q.t);
    let prop = null; if (spec.cheque) { prop = cheque(spec.cheque.text, spec.cheque.sub); prop.position.set(0, 2.85, .25); a.body.add(prop); }
    return { id: spec.id, a, s, keys, prop, spec };
  });
  let fresh = false;
  function update(t) {
    if (!fresh && document.fonts.status === 'loaded') { fresh = true; for (const c of cast) c.prop?.userData.redraw?.(); }
    for (const c of cast) {
      let i = c.keys.findLastIndex(k => k.t <= t); if (i < 0) i = 0;
      const k = c.keys[i], n = c.keys[i + 1];
      // moving: from this key's spot to the next one's over the time between them (if the next one is a 'to' key)
      let x = k.x, z = k.z, y = k.y ?? 0, ry = k.ry ?? 0;
      if (n && n.from === 'slide') { const f = Math.min(1, Math.max(0, (t - k.t) / Math.max(.01, n.t - k.t))); x = k.x + (n.x - k.x) * f; z = k.z + (n.z - k.z) * f; y = (k.y ?? 0) + ((n.y ?? 0) - (k.y ?? 0)) * f; }
      c.a.root.position.set(x, y, z); c.a.root.rotation.y = ry * Math.PI / 180; c.a.root.visible = k.hide !== true;
      pose(c.a, k.anim ?? 'idle', t, k.t);
      if (c.prop) c.prop.visible = !!k.cheque;
      if (c.prop && k.cheque) { c.a.armL.rotation.z = -2.9; c.a.armR.rotation.z = 2.9; }
    }
  }
  /** where to look at an actor: its head */
  const head = id => { const c = cast.find(c => c.id === id); if (!c) return null; const p = c.a.root.position; return new THREE.Vector3(p.x, p.y + 1.6 * c.s + c.a.body.position.y * c.s, p.z); };
  const facing = id => cast.find(c => c.id === id)?.a.root.rotation.y ?? 0;
  return { update, head, facing };
}
