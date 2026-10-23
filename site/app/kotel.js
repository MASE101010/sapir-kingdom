// הכותל המלכותי (day 11): the kingdom's wall, all the way round the map, rebuilt as a giant wall of great pale stones, with
// green tufts in the joints, a coping on top and a grand gate with its sign toward the south. On its inner face, around the
// gate, hang the residents' wishes: a comment "המשאלה שלי היא..." becomes a paper note with the wish and the handle
// (functions/_sync.js keeps them; the site gets them from api/delta, a reel from data/wishes.json). Notes are drawn into
// shared canvas atlases, so hundreds of them cost a few textures. Family friendly; no religious symbols.
import * as THREE from 'three';

export const KOTEL = { H: 60, GAP: .006 };          // height in metres; the gate's half width in radians, around angle 0 (+z)
const NOTE_W = 2.6, NOTE_H = 1.9, ROWS = 7, CELL = [204, 150], PER = [10, 13], CAP = 390;

/** the stones: big drafted ashlars in courses, lighter margins, darker joints, a few green tufts; one tile is 32 m wide and the wall's height */
function stones() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * KOTEL.H / 32); const g = c.getContext('2d');
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.fillStyle = '#b9a98a'; g.fillRect(0, 0, c.width, c.height);
  const course = 64;
  for (let y = 0, row = 0; y < c.height; y += course, row++) {
    let x = -(row % 2) * 70 - rnd() * 40;
    while (x < c.width) { const w = 110 + rnd() * 120, tone = 214 + rnd() * 26 | 0;
      g.fillStyle = `rgb(${tone},${tone - 10},${tone - 34})`; g.fillRect(x + 3, y + 3, w - 6, course - 6);
      g.fillStyle = `rgb(${tone + 14},${tone + 6},${tone - 18})`; g.fillRect(x + 10, y + 10, w - 20, course - 20);     // the drafted face
      g.fillStyle = 'rgba(120,100,70,.18)'; for (let k = 0; k < 6; k++) g.fillRect(x + 12 + rnd() * (w - 30), y + 12 + rnd() * (course - 26), 3 + rnd() * 6, 2 + rnd() * 4);
      if (rnd() < .07) { g.fillStyle = '#5d8f3a'; for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(x + w - 4 + rnd() * 10 - 5, y + course - 4 - rnd() * 8, 4 + rnd() * 6, 3 + rnd() * 4, rnd() * 3, 0, 7); g.fill(); } }
      x += w; }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}

/** builds the wall round the kingdom (radius W) with its gate; returns the group, with .notes(list) to hang the wishes */
export function buildKotel(scene, W) {
  const { H, GAP } = KOTEL, grp = new THREE.Group(); grp.name = 'kotel';
  const tex = stones(); tex.repeat.set(Math.round(2 * Math.PI * W / 32), 1);
  const mat = new THREE.MeshLambertMaterial({ map: tex, emissive: 0x6a5c44, emissiveMap: tex, side: THREE.DoubleSide });   // a little light of its own, so the shaded side stays golden
  for (const r of [W - 1.6, W + 1.6]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, H, 720, 1, true, GAP, 2 * Math.PI - 2 * GAP), mat); m.position.y = H / 2; m.receiveShadow = true; grp.add(m); }
  // the coping on top and a step at the foot, in a lighter stone
  const ring = (r0, r1, y, color) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 720, 1, Math.PI / 2 + GAP, 2 * Math.PI - 2 * GAP), new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI; m.position.y = y; grp.add(m); };
  ring(W - 2.4, W + 2.4, H + .05, 0xefe4c8); ring(W - 4, W - 1.6, .12, 0xd9ccae);
  // the gate: two great towers, an arch, the sign, and a stone plaza inside
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0xe6d8b6, emissive: 0x4a4030 }), gold = new THREE.MeshLambertMaterial({ color: 0xe8b323 });
  const gx = Math.sin(GAP) * W;
  for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.BoxGeometry(16, H + 14, 16), stoneMat); t.position.set(s * (gx + 6), (H + 14) / 2, Math.cos(GAP) * W); t.castShadow = true; grp.add(t);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(12, 10, 4), gold); cap.position.set(s * (gx + 6), H + 19, Math.cos(GAP) * W); cap.rotation.y = Math.PI / 4; grp.add(cap); }
  const arch = new THREE.Mesh(new THREE.BoxGeometry(2 * gx + 2, 8, 6), stoneMat); arch.position.set(0, H + 2, W); grp.add(arch);
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(260, 70), new THREE.MeshLambertMaterial({ color: 0xe9dfc8 })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, .08, W - 36); plaza.receiveShadow = true; grp.add(plaza);
  const title = board('הכותל המלכותי 🙏', 'כתבו בתגובות: "המשאלה שלי היא..."', 1024, 300);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(40, 11.7), new THREE.MeshBasicMaterial({ map: title, side: THREE.DoubleSide })); sg.position.set(0, 46, W - 3.2); sg.rotation.y = Math.PI; grp.add(sg);
  scene.add(grp);
  let held = null;
  /** hangs the notes (newest first is fine: the first ones sit nearest the gate) */
  grp.notes = list => { if (held) { grp.remove(held); held.traverse(o => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); }); }
    held = hang(W, (list ?? []).slice(0, CAP)); grp.add(held); };
  grp.slot = i => slot(W, i);
  return grp;
}

/** where note i hangs: columns going out from the gate on both sides, seven rows high */
function slot(W, i) {
  const col = Math.floor(i / ROWS), row = i % ROWS, side = col % 2 ? -1 : 1, k = Math.floor(col / 2);
  const th = side * (KOTEL.GAP + (30 + k * 3.3) / W), y = 3 + row * 3.9 + ((k * 7 + row * 3) % 5) * .18;
  const r = W - 1.65 - .06;
  return { x: Math.sin(th) * r, y, z: Math.cos(th) * r, ry: th + Math.PI, rz: (((i * 37) % 9) - 4) * .025 };
}

/** the note's paper: a cream sheet with a folded corner, the handle, and the wish in two or three lines */
function paintNote(g, x, y, w, h, n) {
  g.fillStyle = '#fff8e6'; g.fillRect(x + 4, y + 4, w - 8, h - 8);
  g.fillStyle = '#efe0bd'; g.beginPath(); g.moveTo(x + w - 4, y + 4); g.lineTo(x + w - 30, y + 4); g.lineTo(x + w - 4, y + 30); g.fill();
  g.strokeStyle = '#d9c79d'; g.lineWidth = 2; g.strokeRect(x + 4, y + 4, w - 8, h - 8);
  g.direction = 'rtl'; g.textAlign = 'center'; g.fillStyle = '#13213b';
  const words = String(n.text).split(/\s+/), lines = []; let size = 24;
  const fit = () => { lines.length = 0; let cur = ''; g.font = `700 ${size}px Rubik`;
    for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (g.measureText(t).width > w - 26 && cur) { lines.push(cur); cur = wd; } else cur = t; } if (cur) lines.push(cur); };
  fit(); while (lines.length > 3 && size > 14) { size -= 2; fit(); }
  const top = y + 22 + (3 - Math.min(3, lines.length)) * size * .5;
  lines.slice(0, 3).forEach((l, k) => g.fillText(l, x + w / 2, top + k * size * 1.18 + size * .5));
  g.font = '600 16px Rubik'; g.fillStyle = '#0f6f73'; g.direction = 'ltr'; g.fillText('@' + n.u, x + w / 2, y + h - 18);
}

function hang(W, list) {
  const grp = new THREE.Group(), per = PER[0] * PER[1];
  for (let a = 0; a * per < list.length; a++) {
    const c = document.createElement('canvas'); c.width = 2048; c.height = 2048; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const part = list.slice(a * per, (a + 1) * per);
    const paint = () => { g.clearRect(0, 0, 2048, 2048); part.forEach((n, j) => paintNote(g, (j % PER[0]) * CELL[0], Math.floor(j / PER[0]) * CELL[1], CELL[0], CELL[1], n)); tex.needsUpdate = true; };
    paint(); document.fonts?.load('700 24px Rubik').then(paint).catch(() => {});
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    part.forEach((n, j) => {
      const geo = new THREE.PlaneGeometry(NOTE_W, NOTE_H), uv = geo.attributes.uv, u0 = (j % PER[0]) * CELL[0] / 2048, v1 = 1 - Math.floor(j / PER[0]) * CELL[1] / 2048;
      const u1 = u0 + CELL[0] / 2048, v0 = v1 - CELL[1] / 2048;
      // RTL text drawn on the canvas reads right in a plane seen from its front
      uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
      const m = new THREE.Mesh(geo, mat), s = slot(W, a * per + j); m.position.set(s.x, s.y, s.z); m.rotation.set(0, s.ry, s.rz); grp.add(m);
    });
  }
  return grp;
}

/** a big board with a title and a line under it */
function board(title, sub, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const paint = () => { const g = c.getContext('2d'); g.fillStyle = '#e8b323'; g.fillRect(0, 0, w, h); g.fillStyle = '#13213b'; g.fillRect(12, 12, w - 24, h - 24);
    g.direction = 'rtl'; g.textAlign = 'center'; g.fillStyle = '#e8b323'; g.font = `900 ${h * .36}px "Secular One", Rubik`; g.fillText(title, w / 2, h * .46);
    g.fillStyle = '#ffffff'; g.font = `700 ${h * .15}px Rubik`; g.fillText(sub, w / 2, h * .8); tex.needsUpdate = true; };
  paint(); document.fonts?.load(`900 40px "Secular One"`).then(paint).catch(() => {}); return tex;
}
