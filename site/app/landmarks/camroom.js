// חדר המצלמות של הממלכה: day 38. Day 37's winning comment (@ofek_bell, "כדי לתפוס אותו צריך מצלמות מפוזרות ברחבי
// העולם"): in season 1 (גנב הכתר) the king builds a control room with a wall of screens and cameras all over the kingdom.
// Lot 37 (r 18, small): a two storey control building in navy and cream with a wall of nine screens on its front, a roof
// with an antenna mast, a satellite dish and a camera tower, camera poles round the plaza with little red lights, a guard
// at the door, a van with a dish, benches, lamps and trees. Live: the signs, the screen labels, and at night (state 'night')
// the big screen in the middle goes black.
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, METAL = 0x9aa3ab,
  SCREEN = 0x5fc8e8, SCREEN2 = 0x8fdcc0, SCREEN3 = 0xf6d84a, GLASS = 0x7fb3c9;

function person(p, x, z, r, shirt) {
  p.at(x, z, r, .3);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, 0x4a3020);
  p.at(0, 0, 0);
}
// a camera on a pole: the pole, an arm, the camera body with a lens and a little red light, turned toward ry
function camPole(p, x, z, ry, h = 5) {
  p.cyl(x, .2, z, .32, h, DARK); p.box(x, h, z, .25, .25, .25, DARK);
  p.at(x, z, ry, h + .1);
  p.box(0, 0, .4, .2, .2, .9, METAL); p.box(0, -.15, .9, .7, .6, 1.1, WHITE); p.box(0, -.05, 1.5, .4, .4, .2, DARK);
  p.box(0, .26, .6, .9, .08, 1.3, WHITE); p.box(.22, .2, 1.2, .12, .12, .12, RED);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawCamRoom(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 1, 26, .12, 22, PAVE); p.box(0, .2, 15, 5, .12, 8, PAVE);
  for (let k = 0; k < 12; k++) p.box(-12.5 + k * 2.27, .25, 11.9, 1.2, .14, .5, k % 2 ? GOLD : NAVY);
  // the building: two storeys, a navy ground floor, a cream upper floor, a gold band, a flat roof with a parapet
  p.box(0, .3, -3, 18, 4.4, 9, NAVY); p.box(0, 4.7, -3, 18, 4, 9, CREAM); p.box(0, 4.5, -3, 18.4, .3, 9.4, GOLD);
  p.box(0, 8.7, -3, 18.6, .5, 9.6, NAVY); for (const s of [-1, 1]) p.box(s * 9.15, 9.2, -3, .3, .6, 9.6, NAVY); p.box(0, 9.2, 1.65, 18.6, .6, .3, NAVY); p.box(0, 9.2, -7.65, 18.6, .6, .3, NAVY);
  // the wall of screens on the upper front: nine screens in white frames, the big one in the middle
  const cols = [SCREEN, SCREEN2, SCREEN3, SCREEN2, SCREEN, SCREEN3, SCREEN3, SCREEN, SCREEN2];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { if (i === 1) continue;
    const x = (i - 1) * 5.4, y = 5 + j * 1.2; p.box(x, y, 1.55, 4.6, 1.05, .14, WHITE); p.box(x, y + .08, 1.63, 4.2, .9, .06, cols[i * 3 + j]);
    p.box(x - 1.2, y + .3, 1.68, 1.1, .5, .04, 0x2a6a80); p.box(x + .9, y + .2, 1.68, .7, .6, .04, 0xffffff); }
  p.box(0, 5, 1.55, 4.6, 3.45, .16, WHITE);
  // the ground floor: a glass door, windows, a canopy, steps
  p.box(0, .3, 1.55, 3.2, 3.2, .12, DARK); p.box(0, .3, 1.62, 2.8, 3, .06, GLASS); p.box(0, 3.6, 2.2, 4.8, .3, 1.8, GOLD);
  for (const s of [-1, 1]) for (const k of [0, 1]) { const x = s * (3.6 + k * 3); p.box(x, 1.2, 1.55, 2.2, 1.8, .12, WHITE); p.box(x, 1.3, 1.62, 1.9, 1.6, .06, GLASS); p.box(x, 2.1, 1.66, 1.9, .1, .04, WHITE); }
  p.box(0, .2, 2.8, 4, .25, 1.4, PAVE); p.box(0, .2, 3.6, 4.4, .15, .8, PAVE);
  // the roof: an antenna mast with crossbars, a satellite dish, a little camera tower with four cameras, an aircon box
  p.cyl(-6, 9.2, -4, .4, 7, METAL); for (let k = 0; k < 4; k++) p.box(-6, 10.6 + k * 1.4, -4, 1.6 - k * .3, .1, .1, METAL); p.ball(-6, 16.3, -4, .5, .5, RED);
  p.cyl(5.2, 9.2, -5, .5, 1.4, METAL); p.ball(5.2, 11, -4.6, 3.2, 1.2, WHITE); p.box(5.2, 11, -3.5, .14, .14, 1.4, METAL); p.ball(5.2, 11, -2.8, .35, .35, DARK);
  p.box(1, 9.2, -5.5, 2.4, 1.2, 1.8, METAL); p.box(1, 10.4, -5.5, 2.4, .1, 1.8, DARK);
  p.box(-1.6, 9.2, -1.6, 1.6, 4, 1.6, NAVY); p.box(-1.6, 13.2, -1.6, 2.2, .3, 2.2, GOLD);
  for (const [a, dx, dz] of [[0, 0, 1], [Math.PI / 2, 1, 0], [Math.PI, 0, -1], [-Math.PI / 2, -1, 0]]) { p.at(-1.6 + dx * .9, -1.6 + dz * .9, a, 12);
    p.box(0, 0, .2, .7, .55, 1, WHITE); p.box(0, .08, .75, .36, .36, .15, DARK); p.box(.2, .45, .3, .1, .1, .1, RED); p.at(0, 0, 0); }
  // camera poles round the plaza, each looking out a different way
  for (const [x, z, a] of [[-12.6, 8, -.7], [12.6, 8, .7], [-13.4, -4, -1.6], [13.4, -4, 1.6], [-7, -11.6, -2.6], [7, -11.6, 2.6], [-3.4, 14.4, .3], [3.4, 14.4, -.3]]) camPole(p, x, z, a);
  // the van with a dish on its roof, a guard at the door, a visitor at the screens, benches, lamps, trees
  p.box(9.8, .5, 5.6, 2.6, 2.2, 5.4, WHITE); p.box(9.8, .5, 8.1, 2.6, 1.5, .5, NAVY); p.box(9.8, 1.7, 8.36, 2.2, .7, .05, GLASS);
  for (const s of [-1, 1]) for (const k of [-1, 1]) p.cyl(9.8 + s * 1.3, .2, 5.6 + k * 1.7, 1, .5, DARK);
  p.box(9.8, 1.2, 5.6, 2.62, .5, 5.42, TEAL); p.cyl(9.8, 2.7, 4.6, .3, .5, METAL); p.ball(9.8, 3.4, 4.6, 1.8, .7, WHITE);
  person(p, 2.2, 3.4, 0, NAVY); person(p, -2.6, 4.6, Math.PI, TEAL); person(p, -5.8, 7.6, 2.8, RED);
  for (const [x, z, r] of [[-9.6, 4.6, Math.PI / 2], [-6.2, 9.8, Math.PI]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3.2, .8, .2, WOOD, r); }
  for (const [x, z] of [[-4.6, 17], [4.6, 17], [-14.6, 2], [14.6, 2]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, s] of [[14.6, -11, .9], [-14.2, -11, 1], [-15, 12, .8], [15.4, 13, .7], [0, -14.6, .8]]) tree(p, x, z, s);
}

export function camRoomLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('חדר המצלמות 📹', { w: 6.4, h: 1.3, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 9.9, 1.9));
  group.add(sign('בקרה 24/7 👀', { w: 3, h: .7, bg: '#e8b323', fg: '#13213b', border: '#13213b' }).at(0, 3.9, 3.15));
  // the big screen: a camera view (sky, grass, a little house) that goes black at night
  const c = document.createElement('canvas'); c.width = 512; c.height = 384; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const draw = (k) => { g.globalAlpha = 1; g.fillStyle = '#7cc4ea'; g.fillRect(0, 0, 512, 384); g.fillStyle = '#8fcf6e'; g.fillRect(0, 230, 512, 154);
    g.fillStyle = '#f3ead6'; g.fillRect(180, 150, 150, 110); g.fillStyle = '#c2412d'; g.beginPath(); g.moveTo(165, 155); g.lineTo(255, 90); g.lineTo(345, 155); g.fill();
    g.fillStyle = '#13213b'; g.fillRect(238, 200, 34, 60);
    g.fillStyle = '#c2412d'; g.beginPath(); g.arc(470, 40, 14, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.font = '900 40px "Secular One", Rubik, sans-serif'; g.textAlign = 'left'; g.fillText('CAM 7', 20, 52);
    tex.needsUpdate = true; };
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 3.2), new THREE.MeshBasicMaterial({ map: tex })); scr.position.set(0, 5 + 1.72, 1.65); group.add(scr);
  draw(0); if (document.fonts) document.fonts.ready.then(() => draw(0));
  const black = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 3.2), new THREE.MeshBasicMaterial({ color: 0x05070c, transparent: true, opacity: 0, depthWrite: false }));
  black.position.set(0, 5 + 1.72, 1.68); group.add(black);
  group.userData.night = k => { black.material.opacity = Math.min(1, Math.max(0, k)); black.visible = k > .01; };
  group.userData.night(0);
}

export const CAMROOM = { key: 'camroom', name: 'חדר המצלמות של הממלכה', draw: drawCamRoom, live: camRoomLive, top: 17 };
