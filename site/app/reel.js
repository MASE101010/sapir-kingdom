// A day's reel, posed frame by frame. site/episodes/dayN.json says what is said (lines), where the camera looks (shots),
// which cards come up (cards), how many houses stand (houses) and which landmark rises (rise). Every time is tied to a line
// of the narration: with site/episodes/dayN.voice.json (ElevenLabs timings, reel/voice.mjs) the pictures follow the voice;
// without it the times are estimated, for a preview. reel/render.mjs calls window.__reel.seek(t) for every frame.
import * as THREE from 'three';
import { World } from './view.js';
import { STATUE } from './landmarks/castle.js';
import { addresses, KINGDOM } from './names.js';
import { face } from './face.js';
import { fingerprint } from './residents.js';
import { drawOverlay, FONTS } from './overlay.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const backOut = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const strip = s => s.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

/** when each line is said, and every word in it: from the voice file, or estimated at about 13 letters a second */
function timing(ep, voice) {
  if (voice?.lines?.length === ep.lines.length) return voice;
  let t = .4; const lines = [], words = [];
  for (const raw of ep.lines) { const text = strip(raw), ws = text.split(' '), len = Math.max(1.2, text.length / 13), start = t;
    let c = start; ws.forEach(w => { const d = len * (w.length + 1) / (text.length + 1); words.push({ w, start: c, end: c + d, line: lines.length }); c += d; });
    lines.push({ start, end: start + len }); t += len + .35; }
  return { lines, words };
}

export async function startReel({ renderer, data, day }) {
  document.body.classList.add('reel');
  const ep = await fetch(`episodes/day${day}.json`, { cache: 'no-store' }).then(r => r.json());
  const voice = await fetch(`episodes/day${day}.voice.json`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null);
  const time = timing(ep, voice), lineAt = (n, dt = 0) => (time.lines[clamp(n ?? 0, 0, time.lines.length - 1)]?.start ?? 0) + dt;
  const duration = (ep.duration ?? (time.lines.at(-1).end + 1.8));
  // the residents as they were at the end of this day: a reel of an old day never shows newer houses
  // ep.demo: example residents only in this reel ("your.name"), to show what a new house and its ID card look like
  const demo = ep.demo ?? [], upTo = ep.houses?.to ?? data.residents.length + demo.length, last = Math.max(-1, ...data.residents.map(r => r.plot));
  const residents = [...data.residents.slice(0, upTo - demo.length), ...demo.map((d, i) => ({ u: d.u, h: fingerprint(d.u), plot: last + 1 + i, day: ep.day, src: 'demo' }))];
  // a preview (?dev) may stand landmarks that are not built yet, to try them out
  const preview = new URLSearchParams(location.search).has('dev') ? ep.preview?.landmarks ?? [] : [];
  const world = new World(renderer, data.plan, residents, { ...data.kingdom, landmarks: [...(data.kingdom.landmarks ?? []), ...preview], visit: ep.visit ?? null });
  world.daylight(12); renderer.setSize(W, H); world.camera.aspect = W / H; world.camera.updateProjectionMatrix();
  const addr = addresses(data.plan.plots), cam = world.camera;

  // where a shot looks
  const resident = u => residents.find(r => r.u === u);
  function focus(spec, t) {
    if (Array.isArray(spec)) return new THREE.Vector3(...spec);
    if (spec === 'statue' || spec === 'michael') return new THREE.Vector3(STATUE[0], 18, STATUE[1]);      // the king
    if (spec?.startsWith('dragon:')) { const d = world.life.dragons[+spec.slice(7)]?.d; if (d) return d.position.clone(); }   // follows it
    if (spec?.startsWith('house:')) { const r = resident(spec.slice(6)), pl = r && data.plan.plots[r.plot]; if (pl) return new THREE.Vector3(pl[0], 5, pl[1]); }
    if (spec?.startsWith('landmark:')) { const l = world.lm[spec.slice(9)]; if (l) return new THREE.Vector3(l.at[0], (l.mod.top ?? 20) * .35, l.at[1]); }
    return new THREE.Vector3(0, 18, 0);
  }
  const shots = ep.shots.map(s => ({ ...s, t: lineAt(s.line, s.dt) })).sort((a, b) => a.t - b.t);
  function poseCamera(t) {
    let i = shots.findLastIndex(s => s.t <= t); if (i < 0) i = 0;
    const s = shots[i], p = shots[i - 1] ?? s, f = smooth((t - s.t) / (s.ease ?? 1.6));
    // on a landmark, yaw 0 looks at its front (its lot is turned to face the castle)
    const front = sh => typeof sh.target === 'string' && sh.target.startsWith('landmark:') ? (world.lm[sh.target.slice(9)]?.group.rotation.y ?? 0) * 180 / Math.PI : 0;
    const params = sh => ({ target: focus(sh.target, t), dist: sh.dist ?? 300, yaw: front(sh) + (sh.yaw ?? -30) + (sh.orbit ?? 0) * (t - sh.t), pitch: sh.pitch ?? 32, fov: sh.fov ?? 38 });
    const a = params(p), b = params(s), lerp = (x, y) => x + (y - x) * f;
    const target = a.target.clone().lerp(b.target, f), dist = Math.exp(lerp(Math.log(a.dist), Math.log(b.dist))), yaw = lerp(a.yaw, b.yaw) * Math.PI / 180, pitch = lerp(a.pitch, b.pitch) * Math.PI / 180;
    cam.fov = lerp(a.fov, b.fov); cam.updateProjectionMatrix();
    cam.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    // camera effects: a shake, and a punch (a quick zoom in that settles)
    for (const f of fx) { if (t < f.t0 || t > f.t1) continue; const age = t - f.t0, life = f.t1 - f.t0;
      if (f.type === 'shake') { const amp = (f.amp ?? 1.2) * (1 - age / life) * dist / 60; cam.position.x += Math.sin(t * 61) * amp; cam.position.y += Math.sin(t * 47 + 1) * amp; cam.position.z += Math.sin(t * 53 + 2) * amp; }
      if (f.type === 'punch') { cam.fov *= 1 - (f.zoom ?? .3) * Math.exp(-age * 5) * clamp(age / .06); cam.updateProjectionMatrix(); } }
    cam.lookAt(target); world.aim(target);
  }

  // the cards and captions: drawn on a 2D canvas over the 3D frame (overlay.js)
  const cards = (ep.cards ?? []).map((c, i) => ({ ...c, i, t0: lineAt(c.line, c.dt), t1: lineAt(c.line, c.dt) + (c.dur ?? 3.5) }));
  for (const c of cards) {
    const r = c.u && resident(c.u);
    if (r) { const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(face(r.h)); await img.decode().catch(() => {}); c.img = img;
      const a = addr[r.plot]; c.house ??= `בית מספר ${(residents.indexOf(r) + 1).toLocaleString('he-IL')}`; c.address ??= `${a.street} ${a.num}`; }
    if (c.type === 'counter') c.to ??= upTo;
  }
  // captions: at most three words, never across a pause in the voice (a phrase), each gone before the next one starts
  const chunks = []; { let cur = null; time.words.forEach(w => { if (!cur || cur.line !== w.line || cur.p !== w.p || cur.words.length >= 3) { cur = { line: w.line, p: w.p, words: [] }; chunks.push(cur); } cur.words.push(w); }); }
  chunks.forEach((c, i) => { c.t0 = c.words[0].start - .05; c.t1 = Math.min(c.words.at(-1).end + .25, chunks[i + 1] ? chunks[i + 1].words[0].start - .05 : Infinity); });
  const out = document.createElement('canvas'); out.width = W; out.height = H; out.className = 'r-out';
  document.getElementById('overlay').append(out); const g = out.getContext('2d');
  const k = { top: ep.top, t: 0, day: ep.day, kingdom: KINGDOM, history: (data.kingdom.history ?? []).slice(0, Math.max(0, ep.day - 1)), handle: document.documentElement.dataset.account };
  const houses = ep.houses ? { ...ep.houses, t0: lineAt(ep.houses.line, ep.houses.dt), dur: ep.houses.dur ?? 5 } : null;
  const rises = [ep.rise].flat().filter(Boolean).map(r => ({ ...r, t0: lineAt(r.line, r.dt), dur: r.dur ?? 4.5 }));
  // effects: drawn over the frame (overlay.js), or moving the camera (shake, punch); flashes and vignettes go under the cards
  const fx = (ep.fx ?? []).map(f => ({ ...f, t0: lineAt(f.line, f.dt), t1: lineAt(f.line, f.dt) + (f.dur ?? 1.2), under: f.under ?? ['flash', 'vignette'].includes(f.type) }));
  function seek(t) {
    if (houses) world.showHouses(houses.from + (houses.to - houses.from) * smooth((t - houses.t0) / houses.dur)); else world.showHouses(residents.length);
    for (const r of rises) world.rise(r.key, backOut((t - r.t0) / r.dur));
    world.animate((ep.clock ?? 900) + t); poseCamera(t);
    renderer.render(world.scene, cam);
    k.t = t; g.drawImage(renderer.domElement, 0, 0, W, H); drawOverlay(g, k, cards, chunks, fx);
  }
  /** one finished frame, as a JPEG data URL */
  const frame = (t, q = .92) => { seek(t); return out.toDataURL('image/jpeg', q); };
  await Promise.all(FONTS.map(f => document.fonts.load(f))); await document.fonts.ready;
  window.__reel = { duration, fps: 30, seek, frame, day, audio: ep.mix ? `episodes/${ep.mix}` : voice ? `episodes/day${day}.mp3` : null, lines: time.lines };
  seek(0);
  document.body.dataset.ready = '1';
}
