// חדשות ספיר: day 40. Day 39's winning comment ("אפשר לעשות חדשות ספיר שיגידו כל מה שקורה"): in season 1 (גנב הכתר)
// the king opens a news channel so everyone in the kingdom hears what happens and reports what they saw. Lot 39 (r 18,
// small): a studio building in navy and teal with a giant screen on its front, a red ON AIR light, a roof with a satellite
// dish and a mast, an outdoor anchor desk on a little stage with two presenters, two cameras on tripods, studio lights,
// a news van with a dish, a weather board, benches, trees. Live: the signs, the big screen (the channel's title card) and
// at night (state 'night') the broadcast cut: the screen goes black with one word on it.
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, METAL = 0x9aa3ab, GLASS = 0x7fb3c9;

function person(p, x, z, r, shirt, hair = 0x4a3020) {
  p.at(x, z, r, .3);
  p.box(-.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(.2, 0, 0, .32, .95, .36, 0x2a3550); p.box(0, .95, 0, .95, 1.15, .58, shirt);
  p.box(0, 2.1, 0, .68, .68, .68, SKIN); p.box(0, 2.68, 0, .72, .2, .72, hair);
  p.at(0, 0, 0);
}
function camera(p, x, z, r) {
  p.at(x, z, r, .3);
  for (const [dx, dz] of [[-.5, -.4], [.5, -.4], [0, .5]]) p.box(dx, 0, dz, .1, 1.6, .1, DARK);
  p.box(0, 1.6, 0, .7, .6, 1.2, DARK); p.box(0, 1.65, .7, .45, .45, .3, 0x1b1b1b); p.box(.2, 2.25, -.2, .12, .12, .12, RED);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawNewsroom(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.box(0, .2, 1, 26, .12, 20, PAVE); p.box(0, .2, 14.5, 5, .12, 7, PAVE);
  // the studio: navy ground floor, teal upper floor, a gold band, a flat roof
  p.box(0, .3, -5, 18, 5, 8, NAVY); p.box(0, 5.3, -5, 18, 4.4, 8, TEAL); p.box(0, 5.1, -5, 18.4, .3, 8.4, GOLD);
  p.box(0, 9.7, -5, 18.6, .5, 8.6, NAVY); for (const s of [-1, 1]) p.box(s * 9.15, 10.2, -5, .3, .6, 8.6, NAVY);
  // the frame of the giant screen on the front (the picture is live)
  p.box(0, 5.4, -.95, 11.4, 4, .3, WHITE); p.box(0, 5.2, -.85, 12, .25, .5, GOLD);
  // the ON AIR light box over the door, the door, windows
  p.box(0, 3.9, -.95, 3, .8, .3, DARK); p.box(0, .3, -.95, 2.4, 3.2, .2, DARK); p.box(0, .3, -.88, 2, 3, .06, GLASS);
  for (const x of [-6.6, -3.8, 3.8, 6.6]) { p.box(x, 1.2, -.95, 2, 1.8, .14, WHITE); p.box(x, 1.3, -.88, 1.7, 1.6, .06, GLASS); }
  // the roof: a satellite dish, a mast with crossbars and a red light, an aircon box
  p.cyl(5.5, 9.9, -6, .5, 1.6, METAL); p.ball(5.5, 12, -5.4, 3.6, 1.3, WHITE); p.box(5.5, 12, -4.2, .14, .14, 1.5, METAL); p.ball(5.5, 12, -3.4, .4, .4, DARK);
  p.cyl(-6, 10, -6, .4, 7.5, METAL); for (let k = 0; k < 4; k++) p.box(-6, 11.4 + k * 1.5, -6, 1.6 - k * .3, .1, .1, METAL); p.ball(-6, 17.6, -6, .5, .5, RED);
  p.box(0, 10, -7, 2.6, 1.2, 2, METAL); p.box(0, 11.2, -7, 2.6, .1, 2, DARK);
  // the outdoor stage: a low platform, the anchor desk with the channel's colours, two presenters, a backdrop
  p.box(-4.5, .3, 5.4, 9, .6, 5.2, WOOD); p.box(-4.5, .9, 3.2, 9, .1, .6, GOLD);
  p.box(-4.5, .9, 5.6, 5.6, 1.5, 1.4, NAVY); p.box(-4.5, 2.4, 5.6, 5.8, .14, 1.6, WHITE); p.box(-4.5, 1.3, 6.32, 5.2, .7, .05, TEAL);
  person(p, -6, 4.6, 0, RED, 0x2a1a10); person(p, -3, 4.6, 0, GOLD, 0x8a5a2a);
  p.box(-4.5, .9, 3.4, 8.6, 4.6, .3, TEAL); for (let k = 0; k < 5; k++) p.box(-8.2 + k * 1.85, 1.6, 3.58, 1.2, 3, .05, k % 2 ? NAVY : 0x1a8a8e);
  // cameras on tripods, studio lights on stands, a cameraman
  camera(p, -6, 10.4, Math.PI); camera(p, -2.4, 10.8, Math.PI - .3); person(p, -4.3, 11.2, Math.PI, NAVY);
  for (const [x, z, r] of [[-10.6, 8.8, 2.4], [1.6, 9.6, -2.4]]) { p.cyl(x, .3, z, .25, 3.4, DARK); p.at(x, z, r, 3.6); p.box(0, 0, 0, 1.2, .9, .8, DARK); p.box(0, .05, .42, 1, .7, .06, 0xfff2c4); p.at(0, 0, 0); }
  // the news van with a dish, the weather board, visitors watching, benches, lamps, trees
  p.box(9.2, .5, 7, 2.6, 2.4, 5.6, WHITE); p.box(9.2, .5, 9.6, 2.6, 1.6, .5, NAVY); p.box(9.2, 1.8, 9.86, 2.2, .7, .05, GLASS);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.cyl(9.2 + sx * 1.3, .2, 7 + sz * 1.8, 1, .5, DARK);
  p.box(9.2, 1.4, 7, 2.62, .5, 5.62, RED); p.cyl(9.2, 2.9, 5.6, .3, .6, METAL); p.ball(9.2, 3.7, 5.6, 2, .8, WHITE);
  p.box(5, .3, 3.4, .2, 3, .2, DARK); p.box(5, 1.4, 3.5, 3, 2.2, .2, WHITE); p.ball(4.3, 2.8, 3.62, .7, .7, GOLD); p.box(5.4, 2, 3.62, 1.2, .5, .05, 0x7cc4ea);
  person(p, 1.4, 13.8, Math.PI + .5, 0xf3a6b8); person(p, 3.2, 14.6, Math.PI, 0x8fdcc0); person(p, -9.6, 13.6, 2.6, 0xc9b2ec);
  for (const [x, z, r] of [[-11.8, 2, Math.PI / 2], [12.4, -2, -Math.PI / 2]]) { p.box(x, .5, z, 3.2, .3, 1, WOOD, r); p.box(x, 1.05, z - .4, 3.2, .8, .2, WOOD, r); }
  for (const [x, z] of [[-4.6, 17.2], [4.6, 17.2], [-14.6, -4], [14.6, -6]]) { p.cyl(x, .2, z, .28, 4, DARK); p.ball(x, 4.2, z, .9, .9, 0xfff2c4); p.cone(x, 4.6, z, 1.2, .7, NAVY); }
  for (const [x, z, s] of [[14.4, -12, .9], [-14.2, -12, 1], [-15, 9, .8], [15.2, 12.6, .7], [0, -14.6, .8]]) tree(p, x, z, s);
}

export function newsroomLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('חדשות ספיר 📺', { w: 6.4, h: 1.3, bg: '#c2412d', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 10.4, -.6));
  group.add(sign('ON AIR', { w: 2.6, h: .6, bg: '#c2412d', fg: '#ffffff', border: '#13213b' }).at(0, 4.3, -.75));
  group.add(sign('חדשות ספיר', { w: 4, h: .6, bg: '#13213b', fg: '#ffffff', border: '#e8b323' }).at(-4.5, 3.6, 6.4));
  // the giant screen: the channel's title card; at night (state 'night') the broadcast is cut: black, one word
  const font = (w, px) => `${w} ${px}px "Secular One", Rubik, sans-serif`;
  const screen = (paint, z) => { const c = document.createElement('canvas'); c.width = 768; c.height = 384; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const draw = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.direction = 'rtl'; g.textAlign = 'center'; paint(g); tex.needsUpdate = true; };
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(11, 3.6), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(0, 7.4, z); group.add(m); return m; };
  screen(g => { const gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, '#13213b'); gr.addColorStop(1, '#0f6f73'); g.fillStyle = gr; g.fillRect(0, 0, 768, 384);
    g.fillStyle = '#e8b323'; g.fillRect(0, 300, 768, 84); g.fillStyle = '#ffffff'; g.font = font(900, 120); g.fillText('חדשות ספיר', 384, 190);
    g.fillStyle = '#13213b'; g.font = font(800, 52); g.fillText('כל מה שקורה בממלכה', 384, 358);
    g.fillStyle = '#c2412d'; g.beginPath(); g.arc(700, 54, 18, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.font = font(800, 40); g.textAlign = 'right'; g.direction = 'ltr'; g.fillText('LIVE', 670, 68); }, -.78);
  const cut = screen(g => { g.fillStyle = '#05070c'; g.fillRect(0, 0, 768, 384); g.fillStyle = '#f7f5ee'; g.font = font(900, 150); g.fillText('מחר...', 384, 240); }, -.74);
  cut.visible = false;
  group.userData.night = k => { cut.visible = k > .5; };
}

export const NEWSROOM = { key: 'newsroom', name: 'חדשות ספיר', draw: drawNewsroom, live: newsroomLive, top: 18 };
