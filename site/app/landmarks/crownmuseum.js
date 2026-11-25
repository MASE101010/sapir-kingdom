// מוזיאון הכתר: day 43. Day 42's reel brought no comment asking for a place, so the king picked (CLAUDE.md step 2): in
// season 1 (גנב הכתר) the thief plays the kingdom like a game, so the king builds a trap he cannot resist: a museum with a
// copy of the crown in a glass case in the middle of the plaza. Lot 42 (r 18, small): a cream classical museum with six
// columns, a stepped pediment, a red roof and a small gold dome, wide steps, red banners, the glass case on a velvet
// pedestal behind rope barriers, a guard, visitors, lamps, benches and trees.
// Live: the signs, the crown copy turning slowly in its case, and at night (state 'night') a trail of shoe prints with
// curled toes leading to the case, and a note on the glass.
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, STONE = 0xe9dfc8, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, VELVET = 0x8e1f3a;

function person(p, x, z, r, shirt, hair = 0x4a3020) {
  p.at(x, z, r, .3);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, hair);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawCrownMuseum(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 3, 26, .12, 18, PAVE); p.box(0, .2, 14.5, 5, .12, 7, PAVE);
  for (let k = 0; k < 8; k++) p.box(0, .26, 6.5, 9 - k * 1, .06, 9 - k * 1, k % 2 ? 0xd9cdb2 : PAVE);           // a round-ish mosaic under the case
  // the museum: a cream hall, a stepped pediment, a red roof and a little gold dome
  p.box(0, .3, -7, 20, 7.2, 8, STONE); p.box(0, .3, -7, 20.4, .5, 8.4, 0xd9cdb2);
  p.box(0, 7.5, -7, 20.6, .6, 8.6, CREAM); p.box(0, 8.1, -7, 19, .5, 8, RED);
  for (let k = 0; k < 4; k++) p.box(0, 8.6 + k * .7, -2.9, 18 - k * 4.4, .7, .6, CREAM);                            // the pediment
  for (let k = 0; k < 4; k++) p.box(0, 8.6 + k * .7, -7, 18 - k * 4.4, .7, 7.2, RED);
  p.cyl(0, 11.4, -7, 3.4, .8, GOLD); p.ball(0, 12.2, -7, 3.2, 2.6, GOLD); p.cyl(0, 13.6, -7, .3, 1.2, GOLD); p.ball(0, 14.9, -7, .6, .6, GOLD);
  // the portico: steps, six columns with bases and caps, a deep shade wall with a big door and two windows
  for (let k = 0; k < 3; k++) p.box(0, .3 + k * .3, -1.6 + k * -.6, 18 - k * .6, .3, 2.2, k % 2 ? STONE : 0xddd2b8);
  for (let i = 0; i < 6; i++) { const x = -7.5 + i * 3; p.box(x, 1.2, -2.6, 1.3, .4, 1.3, CREAM); p.cyl(x, 1.6, -2.6, 1, 5.5, WHITE); p.box(x, 7.1, -2.6, 1.4, .4, 1.4, CREAM); }
  p.box(0, .3, -3.05, 20, .05, .1, CREAM);
  p.box(0, 1.2, -3.1, 3.2, 4.6, .2, WOOD); p.box(0, 1.2, -3, 2.8, 4.3, .1, 0x6e4a2e); p.ball(.9, 3.2, -2.9, .25, .25, GOLD); p.ball(-.9, 3.2, -2.9, .25, .25, GOLD);
  for (const s of [-1, 1]) { p.box(s * 5.6, 2.4, -3.1, 2, 2.8, .2, WHITE); p.box(s * 5.6, 2.5, -3, 1.6, 2.4, .1, 0x7fb3c9); }
  // red banners hanging between the columns
  for (const x of [-6, 6]) { p.box(x, 3.8, -2.2, 1.3, 3, .1, RED); p.box(x, 4.4, -2.12, .8, .8, .05, GOLD); p.box(x, 6.9, -2.2, 1.6, .2, .2, GOLD); }
  // the pedestal under the glass case (the case and the crown copy are live), the velvet ropes round it
  p.box(0, .3, 6.5, 2.6, .5, 2.6, STONE); p.box(0, .8, 6.5, 2, 1.6, 2, VELVET); p.box(0, 2.4, 6.5, 2.3, .2, 2.3, GOLD);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, x = Math.sin(a) * 3.6, z = 6.5 + Math.cos(a) * 3.6;
    p.cyl(x, .3, z, .22, 1.2, GOLD); p.ball(x, 1.55, z, .35, .35, GOLD);
    const a2 = (k + 1) / 8 * Math.PI * 2, x2 = Math.sin(a2) * 3.6, z2 = 6.5 + Math.cos(a2) * 3.6;
    if (k !== 0) p.box((x + x2) / 2, 1.1, (z + z2) / 2, .12, .12, Math.hypot(x2 - x, z2 - z), VELVET, Math.atan2(x2 - x, z2 - z)); }
  // a guard by the case, visitors, a ticket stand, benches, lamps, trees
  person(p, 4.4, 9.2, -2.4, NAVY); p.box(4.4, 2.9, 9.2, .8, .3, .8, NAVY);
  person(p, -3.4, 10.6, Math.PI - .3, 0xf3a6b8); person(p, -1.6, 11.4, Math.PI, 0x8fdcc0); person(p, 2, 12.4, Math.PI + .4, 0xc9b2ec, 0x8a5a2a);
  p.box(-8.6, .3, 9, 2.6, 2.2, 1.6, CREAM); p.box(-8.6, 2.5, 9, 3, .3, 2, RED); p.box(-8.6, 1.2, 9.82, 2, .8, .05, 0x3a4a60);
  for (const [x, z, r] of [[11.6, 4, -Math.PI / 2], [-12.2, 3, Math.PI / 2]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3.2, .8, .2, WOOD, r); }
  for (const [x, z] of [[-4.6, 17], [4.6, 17], [-11, 11], [11, 11]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, s] of [[14.4, -11, .9], [-14.2, -11, 1], [15.2, 9, .7], [-15.2, 8, .7], [0, -15.6, .8]]) tree(p, x, z, s);
}

export function crownMuseumLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('מוזיאון הכתר 👑', { w: 6.2, h: 1.3, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 7.75, -2.1));
  group.add(sign('אסור לגעת! 🚫', { w: 2.8, h: .7, bg: '#c2412d', fg: '#ffffff', border: '#f6d84a' }).at(0, 1.9, 10.3));
  // the glass case and the crown copy inside it, turning slowly
  const glass = new THREE.Mesh(new THREE.BoxGeometry(2, 2.2, 2), new THREE.MeshStandardMaterial({ color: 0xcfe9f5, transparent: true, opacity: .25, roughness: .1, depthWrite: false }));
  glass.position.set(0, 3.6, 6.5); group.add(glass);
  const crown = new THREE.Group(); crown.position.set(0, 2.6, 6.5); group.add(crown);
  const gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .6, roughness: .3 });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.6, .55, .45, 16, 1, true), gold); band.position.y = .35; crown.add(band);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, s = new THREE.Mesh(new THREE.ConeGeometry(.14, .45, 6), gold); s.position.set(Math.sin(a) * .56, .78, Math.cos(a) * .56); crown.add(s);
    const g = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), new THREE.MeshStandardMaterial({ color: [0xd8344a, 0x2f8fd8, 0x45b36b][k % 3] })); g.position.set(Math.sin(a) * .6, .35, Math.cos(a) * .6); crown.add(g); }
  // the night: shoe prints with curled toes from the edge of the plaza to the case, and a note stuck on the glass
  const prints = new THREE.Group(); prints.visible = false; group.add(prints);
  const pm = new THREE.MeshBasicMaterial({ color: 0x3a2a1c });
  for (let k = 0; k < 9; k++) { const z = 16 - k * 1.05, x = (k % 2 ? .35 : -.35) + Math.sin(k * .6) * .6;
    const f = new THREE.Group(); f.position.set(x, .3, z);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(.32, .03, .62), pm); f.add(sole);
    const toe = new THREE.Mesh(new THREE.TorusGeometry(.13, .04, 6, 12, Math.PI * 1.3), pm); toe.rotation.x = -Math.PI / 2; toe.position.set(.06, .01, -.36); f.add(toe);
    prints.add(f); }
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const draw = () => { g.fillStyle = '#fff7d6'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#13213b'; g.direction = 'rtl'; g.textAlign = 'center';
    g.font = '800 40px "Secular One", Rubik, sans-serif'; g.fillText('הכתר הזה', 128, 70); g.fillText('מזויף 😏', 128, 120); g.fillText('נתראה', 128, 175); g.fillText('בהופעה הגדולה', 128, 222); tex.needsUpdate = true; };
  draw(); if (document.fonts) document.fonts.ready.then(draw);
  const note = new THREE.Mesh(new THREE.PlaneGeometry(.85, .85), new THREE.MeshBasicMaterial({ map: tex })); note.position.set(-.5, 3.05, 7.52); note.rotation.z = .1; note.visible = false; group.add(note);
  group.userData.night = k => { prints.visible = k > .5; note.visible = k > .5; };
  group.userData.tick = t => { crown.rotation.y = t * .6; };
}

export const CROWNMUSEUM = { key: 'crown-museum', name: 'מוזיאון הכתר', draw: drawCrownMuseum, live: crownMuseumLive, top: 15 };
