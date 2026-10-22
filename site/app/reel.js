// A day's reel, posed frame by frame. site/episodes/dayN.json says what is said (lines), where the camera looks (shots),
// which cards come up (cards), how many houses stand (houses) and which landmark rises (rise). Every time is tied to a line
// of the narration: with site/episodes/dayN.voice.json (ElevenLabs timings, reel/voice.mjs) the pictures follow the voice;
// without it the times are estimated, for a preview. reel/render.mjs calls window.__reel.seek(t) for every frame.
import * as THREE from 'three';
import { World } from './view.js';
import { place as placeModel, ready as modelsReady } from './models.js';
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
  const residents = [...data.residents.slice(0, upTo - demo.length), ...demo.map((d, i) => ({ u: d.u, h: fingerprint(d.u), plot: last + 1 + i, day: ep.day, src: 'demo', gold: d.gold ? 1 : undefined, home: d.home }))];
  // ep.homes: a house style shown in this reel before the count catches up (a gold key winner's villa)
  for (const [u, h] of Object.entries(ep.homes ?? {})) { const r = residents.find(r => r.u === u); if (r) residents[residents.indexOf(r)] = { ...r, home: h }; }
  // a preview (?dev) may stand landmarks that are not built yet, to try them out
  const preview = new URLSearchParams(location.search).has('dev') ? ep.preview?.landmarks ?? [] : [];
  const world = new World(renderer, data.plan, residents, { ...data.kingdom, landmarks: [...(data.kingdom.landmarks ?? []), ...preview], visit: ep.visit ?? null });
  // the royal wall's notes as they were (data/wishes.json), and any this reel adds (ep.wishes); 3D models only this reel shows (ep.models)
  const snap = await fetch('data/wishes.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  world.setWishes([...(ep.wishes ?? []), ...(snap.wishes ?? []).slice().reverse()]);
  // the elections' count: the snapshot (data/votes.json) or what the reel says (ep.votes)
  const vsnap = await fetch('data/votes.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  world.setVotes(ep.votes ?? vsnap.votes ?? {});
  const epModels = {}; for (const m of ep.models ?? []) epModels[m.key ?? m.url] = placeModel(world.scene, m.url, m);
  world.models = { ...(world.models ?? {}), ...epModels }; await modelsReady();
  world.daylight(12); renderer.setSize(W, H); world.camera.aspect = W / H; world.camera.updateProjectionMatrix();
  const addr = addresses(data.plan.plots), cam = world.camera;

  // where a shot looks
  const resident = u => residents.find(r => r.u === u);
  function focus(spec, t) {
    if (Array.isArray(spec)) return new THREE.Vector3(...spec);
    if (spec === 'statue' || spec === 'michael') return new THREE.Vector3(STATUE[0], 18, STATUE[1]);      // the king
    if (spec?.startsWith('ride:')) { const [, key, i] = spec.split(':'), car = world.lm[key]?.group.userData.rides?.train?.[+i || 0]; if (car) { car.updateWorldMatrix(true, false); return car.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 1.5, 0)); } }   // rides along
    if (spec?.startsWith('ball:')) { const b = world.lm[spec.slice(5)]?.group.userData.live?.ball; if (b) { b.updateWorldMatrix(true, false); return b.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 1, 0)); } }   // follows a match's ball
    if (spec?.startsWith('dragon:')) { const d = world.life.dragons[+spec.slice(7)]?.d; if (d) return d.position.clone(); }   // follows it
    if (spec?.startsWith('house:')) { const r = resident(spec.slice(6)), pl = r && data.plan.plots[r.plot]; if (pl) return new THREE.Vector3(pl[0], 5, pl[1]); }
    if (spec?.startsWith('model:')) { const m = world.models?.[spec.slice(6)]; if (m) { const sz = m.userData.size?.y ?? 10; return m.position.clone().add(new THREE.Vector3(0, sz * .55, 0)); } }   // a 3D model (models.js)
    if (spec?.startsWith('landmark:')) { const l = world.lm[spec.slice(9)]; if (l) return new THREE.Vector3(l.at[0], (l.mod.top ?? 20) * .35, l.at[1]); }
    return new THREE.Vector3(0, 18, 0);
  }
  const shots = ep.shots.map(s => ({ ...s, t: lineAt(s.line, s.dt) })).sort((a, b) => a.t - b.t);
  function poseCamera(t) {
    let i = shots.findLastIndex(s => s.t <= t); if (i < 0) i = 0;
    const s = shots[i], p = shots[i - 1] ?? s, f = smooth((t - s.t) / (s.ease ?? 1.6));
    // on a landmark, yaw 0 looks at its front (its lot is turned to face the castle)
    const front = sh => typeof sh.target !== 'string' ? 0 : sh.target.startsWith('landmark:') ? (world.lm[sh.target.slice(9)]?.group.rotation.y ?? 0) * 180 / Math.PI
      : sh.follow && sh.target.startsWith('ride:') ? (() => { const [, key, i] = sh.target.split(':'), l = world.lm[key], car = l?.group.userData.rides?.train?.[+i || 0]; return car ? (l.group.rotation.y + car.rotation.y) * 180 / Math.PI : 0; })()
      : sh.follow && sh.target.startsWith('dragon:') ? (world.life.dragons[+sh.target.slice(7)]?.d.rotation.y ?? 0) * 180 / Math.PI : 0;   // follow: yaw 0 is in front of the dragon's face
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
    // day 11: pictures on the cards (a candidate's portrait): c.image, or c.images for the grid
    const pic = async src => { if (!src) return null; const im = new Image(); im.src = src; await im.decode().catch(() => {}); return im.naturalWidth ? im : null; };
    if (c.image) c.photo = await pic(c.image);
    if (c.images) c.photos = await Promise.all(c.images.map(pic));
  }
  // ep.say: how a word the voice needed in English letters is shown in the captions ("Sapir" → "ספיר")
  for (const w of time.words) { w.w = w.w.replace(/[\u0591-\u05C7]/g, '');          // nikud is for the voice only
    for (const [a, b] of Object.entries(ep.say ?? {})) if (w.w.includes(a)) { w.w = w.w.replace(a, b); break; } }   // also inside "ל-Imry!"
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
  // the dragons: gathered round a place for a while (swarm), one of them breathing fire (fire)
  const swarms = [ep.swarm].flat().filter(Boolean).map(w => ({ ...w, t0: lineAt(w.line, w.dt), t1: w.until != null ? lineAt(w.until, w.udt) : lineAt(w.line, w.dt) + (w.dur ?? 8) }));
  const fires = [ep.fire].flat().filter(Boolean).map(f => ({ ...f, t0: lineAt(f.line, f.dt), t1: lineAt(f.line, f.dt) + (f.dur ?? 2.5) }));
  // cues: a landmark's own animation starting at a line (e.g. נתס"ר's plane taking off): ep.cue = [{ key, line, dt }]
  for (const c of [ep.cue].flat().filter(Boolean)) { const l = world.lm?.[c.key]; if (l) l.group.userData.cue = (ep.clock ?? 900) + lineAt(c.line, c.dt); }
  // a football match in a stadium (football.js): kick-off at a line, and the goals, each at its line (who: the scorer's place, 0 to 10)
  if (ep.match) { const l = world.lm?.[ep.match.key ?? 'maccabi'], c = ep.clock ?? 900; if (l) l.group.userData.match = { t0: c + lineAt(ep.match.line, ep.match.dt), goals: ep.match.goals.map(g => ({ ...g, t: c + lineAt(g.line, g.dt) })).sort((a, b) => a.t - b.t) }; }
  const arrivals = [ep.arrive].flat().filter(Boolean).map(a => ({ ...a, t0: lineAt(a.line, a.dt), dur: a.dur ?? 5 }));
  function dragons(t) {
    const w = swarms.find(w => t > w.t0 - 3 && t < w.t1 + 3), e = w?.ease ?? 2.5;
    if (w) { const at = focus(w.target, t); world.life.swarm = { x: at.x, z: at.z, R: w.R ?? 70, H: w.H ?? 60, k: clamp(Math.min((t - w.t0 + e) / e, (w.t1 + e - t) / e)) }; } else world.life.swarm = null;
    world.life.fire = Math.max(0, ...fires.map(f => clamp(Math.min((t - f.t0) / .35, (f.t1 - t) / .5))));
    // new dragons flying in from far away: before t0 they are not there, over dur they come home
    // a dragon landing on its perch during the reel (ep.perch: { dragon, at, ry, line, dt, dur }); before it lands it flies as usual
    // day 10: from: [x, y, z] (and fromRy) moves it from one perch to another; net: { line, dt, dur } drops the net on it
    if (ep.perch) world.life.perch = { ...ep.perch, k: clamp((t - lineAt(ep.perch.line, ep.perch.dt)) / (ep.perch.dur ?? 3)),
      net: ep.perch.net ? clamp((t - lineAt(ep.perch.net.line, ep.perch.net.dt)) / (ep.perch.net.dur ?? 1.2)) : ep.perch.netOn ? 1 : undefined };
    world.life.arrive = arrivals.length ? Object.fromEntries(arrivals.map(a => [a.dragon, clamp((t - a.t0) / a.dur)])) : null;
  }
  function seek(t) {
    dragons(t);
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
