// פארק הגיימינג העתידני: day 41. Day 40's reel brought no comment asking for a place, so the king picked (CLAUDE.md
// step 2) the park @ofek_bell had asked for twelve days running ("גיימינג פארק עתידני עם הולוגרמות ומגרש גיימינג מטורף,
// עם דברים מעופפים"): in season 1 (גנב הכתר) the thief loves games, so a park of games is a trap. Lot 40 (r 18, small,
// appended on day 41 in the same band as 35-39): a white dome arena with a glass top and teal ribs, a giant game screen,
// a floating game controller over a plinth, hologram rings and floating cubes, a row of arcade booths, VR pods, a little
// hover track with pods, kids playing, lamps, trees. Live: the signs, the screens, the hologram rings and cubes, and at
// night (state 'night') one arcade screen lights up by itself with "רמה 2".
// Lot radius 18, front toward +z.
import * as THREE from 'three';
import { sign } from '../sign.js';
const NAVY = 0x13213b, TEAL = 0x0f6f73, GOLD = 0xe8b323, CREAM = 0xf3ead6, RED = 0xc2412d, WOOD = 0x8a6240,
  GRASS = 0x8fcf6e, PAVE = 0xe6dcc6, DARK = 0x2b2f36, SKIN = 0xe2b48f, LEAF = 0x4f9a4a, WHITE = 0xf7f5ee, METAL = 0x9aa3ab,
  LILAC = 0xb9a3e8, SKY = 0x7cc4ea, MINT = 0x8fdcc0, PINK = 0xf3a6b8, GLASS = 0x9fd6e8;

function kid(p, x, z, r, shirt) {
  p.at(x, z, r, .3);
  p.box(-.15, 0, 0, .26, .7, .3, 0x2a3550); p.box(.15, 0, 0, .26, .7, .3, 0x2a3550); p.box(0, .7, 0, .75, .9, .46, shirt);
  p.box(0, 1.6, 0, .56, .56, .56, SKIN); p.box(0, 2.08, 0, .6, .16, .6, 0x4a3020);
  p.at(0, 0, 0);
}
function tree(p, x, z, s = 1) { p.cyl(x, .2, z, .6 * s, 2.6 * s, WOOD); p.ball(x, 2.3 * s, z, 3.2 * s, 3 * s, LEAF); p.ball(x + .4 * s, 3.5 * s, z - .2 * s, 2.1 * s, 2 * s, 0x5fae55); }

export function drawGamePark(p) {
  p.at(0, 0, 0);
  p.cyl(0, 0, 0, 35, .2, GRASS);
  p.cyl(0, .2, 0, 30, .12, PAVE); p.box(0, .2, 14.5, 5, .12, 8, PAVE);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; p.box(Math.sin(a) * 14.4, .25, Math.cos(a) * 14.4, 3.2, .14, .5, [TEAL, LILAC, GOLD][k % 3], a); }
  // the dome arena at the back: a round white base, a ring of teal ribs, a glass dome, a gold crown ring and a mast
  p.cyl(0, .3, -5, 16, 3.4, WHITE, 24); p.cyl(0, 3.7, -5, 16.6, .4, TEAL, 24);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; p.box(Math.sin(a) * 7.9, .3, -5 + Math.cos(a) * 7.9, .5, 3.4, .5, TEAL, a); }
  p.ball(0, 3.4, -5, 15.4, 9, GLASS); p.cyl(0, 11.6, -5, 3.2, .4, GOLD); p.cyl(0, 12, -5, .3, 3, METAL); p.ball(0, 15.2, -5, .7, .7, PINK);
  // the arena's door, under a giant game screen frame (the picture is live)
  p.box(0, .3, 2.8, 3.6, 3, .4, NAVY); p.box(0, .3, 2.95, 3, 2.8, .1, 0x2a3a5a);
  p.box(0, 4.2, 3.2, 9.4, 5.6, .5, NAVY); p.box(0, 3.9, 3.3, 10, .3, .8, GOLD);
  for (const s of [-1, 1]) p.box(s * 4.9, .3, 3.2, .5, 9.5, .5, TEAL);
  // the floating game controller over a plinth on the right
  p.cyl(8.6, .3, 4.6, 3.4, 1.2, WHITE); p.cyl(8.6, 1.5, 4.6, 2.6, .2, TEAL);
  p.box(8.6, 4.2, 4.6, 4.2, 1.2, 1.8, NAVY); for (const s of [-1, 1]) p.box(8.6 + s * 2.2, 3.7, 4.9, 1.4, 1.4, 1.6, NAVY);
  for (const [dx, dz, c] of [[1.2, -.3, RED], [1.6, .1, GOLD], [1.2, .5, MINT], [.8, .1, SKY]]) p.ball(8.6 + dx, 5.4, 4.6 + dz, .4, .3, c);
  p.box(7.2, 5.4, 4.6, .9, .3, .3, WHITE); p.box(7.2, 5.4, 4.6, .3, .3, .9, WHITE);
  // the arcade booths on the left: five cabinets with screens and buttons
  for (let k = 0; k < 5; k++) { const x = -12.4 + k * 2.2, z = 6.6 - Math.abs(k - 2) * .6, c = [LILAC, SKY, PINK, MINT, GOLD][k];
    p.box(x, .3, z, 1.8, 3.4, 1.4, c); p.box(x, 3.7, z, 1.9, .5, 1.5, NAVY); p.box(x, 2, z + .72, 1.4, 1.1, .06, DARK);
    p.box(x, 1.3, z + .72, 1.5, .4, .4, NAVY); p.ball(x - .3, 1.75, z + .9, .2, .15, RED); p.ball(x + .3, 1.75, z + .9, .2, .15, GOLD); }
  // VR pods: white egg seats with a visor on a stand
  for (const [x, z] of [[-11, -4.6], [-12.6, -1], [11.4, -3.6], [12.6, .2]]) { p.ball(x, .3, z, 2.4, 2.4, WHITE); p.ball(x, 1.4, z + .5, 1.4, 1.2, TEAL); p.box(x, 2.6, z + .1, .8, .3, .4, DARK); }
  // the hover track: a low oval rail on posts in front, with two little hover pods
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, x = Math.sin(a) * 5, z = 11 + Math.cos(a) * 2.2; p.box(x, .3, z, .25, .8, .25, METAL); p.box(x, 1.1, z, 2, .15, .2, TEAL, a + Math.PI / 2); }
  for (const [x, c] of [[-3, PINK], [2.6, SKY]]) { p.box(x, 1.4, 11 + (x > 0 ? -1.8 : 1.8), 1.6, .6, 1, c); p.ball(x, 2, 11 + (x > 0 ? -1.8 : 1.8), 1, .7, GLASS); }
  // kids playing, lamps with round tops, trees
  [[-12.4, 8.4, Math.PI, SKY], [-8, 8.2, Math.PI, PINK], [-3.4, 6.2, 2.6, GOLD], [3.6, 7.6, -2.6, MINT], [10.4, 7.8, Math.PI, LILAC], [6, 14.4, 0, RED], [-6.6, 15.6, .4, TEAL]].forEach(([x, z, r, c]) => kid(p, x, z, r, c));
  for (const [x, z] of [[-4.6, 17.2], [4.6, 17.2], [-14.6, 3], [14.6, 9]]) { p.cyl(x, .2, z, .28, 4.2, DARK); p.ball(x, 4.4, z, 1.2, 1.2, 0xe8f4ff); p.cyl(x, 4.4, z, 1.6, .12, TEAL); }
  for (const [x, z, s] of [[14.4, -12, .9], [-14.2, -12, 1], [-15.2, 11, .8], [15.2, 14, .7], [6, -15, .8]]) tree(p, x, z, s);
}

export function gameParkLive(group) {
  const big = '900 {px}px "Secular One", Rubik';
  group.add(sign('פארק הגיימינג 🎮', { w: 6.4, h: 1.3, bg: '#13213b', fg: '#ffffff', border: '#e8b323', font: big }).at(0, 10.3, 3.5));
  group.add(sign('ארקייד 🕹️', { w: 3, h: .7, bg: '#b9a3e8', fg: '#13213b', border: '#13213b' }).at(-8, 4.5, 7.4));
  group.add(sign('הרעיון של @ofek_bell 💡', { w: 4.2, h: .7, bg: '#0f6f73', fg: '#ffffff', border: '#e8b323' }).at(8.6, 1.2, 6.35));
  const font = (w, px) => `${w} ${px}px "Secular One", Rubik, sans-serif`;
  const screen = (w, h, paint, x, y, z) => { const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w); const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const draw = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.textAlign = 'center'; g.direction = 'rtl'; paint(g, c.width, c.height); tex.needsUpdate = true; };
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(x, y, z); group.add(m); return m; };
  // the giant screen: a little game (a hero on platforms, coins, a score)
  screen(8.6, 4.8, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2a3f7a'); gr.addColorStop(1, '#7cc4ea'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#8fcf6e'; g.fillRect(0, H - 50, W, 50); g.fillStyle = '#e8b323'; for (const [x, y] of [[90, 160], [230, 110], [380, 150]]) g.fillRect(x - 50, y, 100, 18);
    g.fillStyle = '#f6d84a'; for (const [x, y] of [[90, 130], [230, 80], [380, 120]]) { g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill(); }
    g.fillStyle = '#c2412d'; g.fillRect(150, H - 100, 30, 50); g.fillStyle = '#e2b48f'; g.fillRect(150, H - 125, 30, 25);
    g.fillStyle = '#ffffff'; g.font = font(900, 34); g.textAlign = 'left'; g.direction = 'ltr'; g.fillText('SCORE 0420', 16, 40); }, 0, 4.2 + 2.8, 3.47);
  // the arcade screens: the middle one is dark by day, and at night it lights up by itself with "רמה 2"
  const xs = [-12.4, -10.2, -8, -5.8, -3.6], zs = xs.map((x, k) => 6.6 - Math.abs(k - 2) * .6);
  xs.forEach((x, k) => { if (k === 2) return; screen(1.3, 1, (g, W, H) => { g.fillStyle = ['#2a3f7a', '#1a5a6a', '#5a2a6a', '#2a5a3a', '#6a4a1a'][k]; g.fillRect(0, 0, W, H);
    g.fillStyle = '#f6d84a'; g.beginPath(); g.arc(W / 2, H / 2, 60, .4, 5.9); g.lineTo(W / 2, H / 2); g.fill(); }, x, 2.55, zs[k] + .76); });
  const off = screen(1.3, 1, (g, W, H) => { g.fillStyle = '#0b0e16'; g.fillRect(0, 0, W, H); }, xs[2], 2.55, zs[2] + .76);
  const lvl = screen(1.3, 1, (g, W, H) => { g.fillStyle = '#05070c'; g.fillRect(0, 0, W, H); g.fillStyle = '#f6d84a'; g.font = font(900, 120); g.fillText('רמה 2', W / 2, H / 2 + 40); }, xs[2], 2.55, zs[2] + .77);
  lvl.visible = false;
  group.userData.night = k => { lvl.visible = k > .5; off.visible = !lvl.visible; };
  // hologram rings and floating cubes over the plaza
  const holo = new THREE.MeshBasicMaterial({ color: 0x8fe8f0, transparent: true, opacity: .55, depthWrite: false });
  for (const [x, y, z, r, rx] of [[0, 12.5, -5, 4.6, .3], [0, 13.4, -5, 3.2, -.4], [8.6, 7, 4.6, 2.2, 1.2]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, .12, 8, 48), holo); t.position.set(x, y, z); t.rotation.x = Math.PI / 2 + rx; group.add(t); }
  const cube = c => new THREE.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: .25 });
  for (const [x, y, z, s, c] of [[-6, 6.5, 10, .9, 0xb9a3e8], [5.6, 7.4, 12, .7, 0xf3a6b8], [-9, 8.6, 1, .8, 0x8fdcc0], [11.6, 8.2, -1, .6, 0xf6d84a], [-2.4, 9.2, 14, .6, 0x7cc4ea]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), cube(c)); m.position.set(x, y, z); m.rotation.set(.6, .7, .2); group.add(m); }
}

export const GAMEPARK = { key: 'gamepark', name: 'פארק הגיימינג העתידני', draw: drawGamePark, live: gameParkLive, top: 16 };
