// The public page: the kingdom as it stands today. Type an Instagram name and the camera flies to that follower's house.
//   ?u=name     opens on that person's house (the link the Share button copies)
//   ?reel=N     the reel of day N, posed frame by frame (reel.js); the page shows nothing else
import * as THREE from 'three';
import { OrbitControls } from '../vendor/addons/OrbitControls.js';
import { loadKingdom, loadDelta } from './kingdom.js';
import { World } from './view.js';
import { addresses, KINGDOM } from './names.js';
import { find, normalize, valid, fingerprint } from './residents.js';
import { face } from './face.js';
import { LANDMARKS } from './landmarks/index.js';

const q = new URLSearchParams(location.search), $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ACCOUNT = document.documentElement.dataset.account;      // the kingdom's Instagram account (index.html)

const data = await loadKingdom('.');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: q.has('reel') });
renderer.setPixelRatio(q.has('reel') ? 1 : Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('scene').appendChild(renderer.domElement);

if (q.has('reel')) {
  const { startReel } = await import('./reel.js');
  await startReel({ renderer, data, day: +q.get('reel') });
} else {
  data.residents.push(...await loadDelta(data.residents.length));
  site(data);
}

function site({ plan, residents, kingdom, honours }) {
  document.body.classList.add('site');
  const world = new World(renderer, plan, residents, kingdom), addr = addresses(plan.plots);
  const cam = world.camera, controls = new OrbitControls(cam, renderer.domElement);
  cam.position.set(260, 300, 420); controls.target.set(0, 10, 0);
  Object.assign(controls, { enableDamping: true, maxPolarAngle: 1.28, minDistance: 30, maxDistance: 2400, screenSpacePanning: false });
  const resize = () => { const w = innerWidth, h = innerHeight; cam.aspect = w / h; cam.updateProjectionMatrix(); renderer.setSize(w, h); };
  addEventListener('resize', resize); resize();
  const hour = () => +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Jerusalem' }).format(new Date());
  world.daylight(hour()); setInterval(() => world.daylight(hour()), 60000);

  $('h-day').textContent = kingdom.day; $('h-res').textContent = residents.length.toLocaleString('he-IL');
  $('status').textContent = kingdom.status ?? '';

  // labels: the nearest residents to where the camera looks, and Michael
  const labels = $('labels'), pool = [], mTag = document.createElement('button');
  mTag.className = 'tag michael'; mTag.textContent = 'מיכאל'; labels.append(mTag);
  let follow = false; mTag.onclick = () => { follow = true; };
  controls.addEventListener('start', () => follow = false);
  const place = (el, v) => { const p = v.clone().project(cam), vis = p.z < 1 && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05; el.hidden = !vis;
    if (vis) { el.style.left = `${(p.x + 1) / 2 * innerWidth}px`; el.style.top = `${(1 - p.y) / 2 * innerHeight}px`; } };
  let mine = null; try { mine = localStorage.getItem('kingdom-me'); } catch { }
  function drawLabels() {
    const t = controls.target, dist = cam.position.distanceTo(t), max = dist < 160 ? 40 : dist < 500 ? 24 : 10, near = [];
    for (let k = 0; k < residents.length; k++) { const pl = plan.plots[residents[k].plot]; if (!pl) continue;
      const d = Math.hypot(pl[0] - t.x, pl[1] - t.z) - (residents[k].u === mine ? 1e9 : 0); if (near.length < max || d < near[near.length - 1].d) { near.push({ k, d }); near.sort((a, b) => a.d - b.d); if (near.length > max) near.pop(); } }
    while (pool.length < max) { const el = document.createElement('button'); el.className = 'tag'; el.onclick = () => openHouse(+el.dataset.k); labels.append(el); pool.push(el); }
    pool.forEach((el, i) => { const n = near[i]; if (!n) { el.hidden = true; return; } const r = residents[n.k], pl = plan.plots[r.plot];
      if (el.dataset.k !== String(n.k)) { el.dataset.k = n.k; el.textContent = '@' + r.u; } el.classList.toggle('mine', r.u === mine); place(el, new THREE.Vector3(pl[0], 13, pl[1])); });
  }
  function frame() {
    const m = world.poseMichael(Date.now() / 1000);
    if (follow) controls.target.lerp(new THREE.Vector3(m.x, 4, m.z), .08);
    controls.update(); world.aim(controls.target); renderer.render(world.scene, cam);
    place(mTag, new THREE.Vector3(m.x, 12, m.z)); drawLabels(); requestAnimationFrame(frame);
  }
  frame();

  function flyTo(x, z, dist = 90) {
    follow = false; const t0 = performance.now(), from = controls.target.clone(), to = new THREE.Vector3(x, 4, z), off0 = cam.position.clone().sub(from), off1 = off0.clone().setLength(dist);
    (function step(now) { const f = Math.min(1, (now - t0) / 1100), e = f < .5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
      controls.target.lerpVectors(from, to, e); cam.position.copy(controls.target).add(off0.clone().lerp(off1, e)); if (f < 1) requestAnimationFrame(step); })(t0);
  }
  function honoursOf(u) {
    const out = []; for (const [k, list] of Object.entries(honours.built ?? {})) if (list.by?.includes(u)) out.push(`אדריכל · ${LANDMARKS[k]?.name ?? k}`);
    if (honours.given?.key?.includes(u)) out.push('מפתח זהב'); if (kingdom.upgraded?.[u]) out.push(`${kingdom.upgraded[u] + 1} קומות`);
    return out;
  }
  function openHouse(k) {
    const r = residents[k], pl = plan.plots[r.plot], a = addr[r.plot]; flyTo(pl[0], pl[1]);
    $('card').innerHTML = `<div class="idcard"><div class="id-top"><span>תעודת תושב</span><span>${esc(KINGDOM)}</span></div>
      <div class="id-body"><div class="face">${face(r.h)}</div><div class="id-fields"><b dir="ltr">@${esc(r.u)}</b>
      <span>בית מספר ${(k + 1).toLocaleString('he-IL')}</span><span>${esc(a.street)} ${a.num}</span>
      <span class="since">תושב מיום ${r.day ?? 1}</span></div></div>
      ${honoursOf(r.u).length ? `<div class="chips">${honoursOf(r.u).map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
      <div class="row"><button class="btn ghost" id="share">העתקת קישור לבית</button><button class="btn ghost" id="close">סגירה</button></div></div>`;
    $('card').hidden = false; $('close').onclick = () => $('card').hidden = true;
    $('share').onclick = async () => { const url = `${location.origin}${location.pathname}?u=${r.u}`; try { await navigator.clipboard.writeText(url); $('share').textContent = 'הקישור הועתק'; } catch { $('share').textContent = url; } };
  }
  $('find').addEventListener('submit', e => { e.preventDefault(); const name = normalize($('who').value), err = $('find-err');
    err.hidden = true; if (!valid(name)) { err.textContent = 'זה לא נראה כמו שם משתמש באינסטגרם: אותיות באנגלית, מספרים, נקודה וקו תחתון.'; err.hidden = false; return; }
    const k = find(residents, name); if (k >= 0) { mine = residents[k].u; try { localStorage.setItem('kingdom-me', mine); } catch { } openHouse(k); return; }
    err.innerHTML = `עוד אין בית על השם @${esc(name)}. מגיבים על ריל או שולחים לנו קוד ב-DM, והבית נבנה.`; err.hidden = false; });
  $('get').onclick = verify;
  async function verify() {
    const box = $('verify'); box.hidden = false; box.innerHTML = '<p>מכינים קוד...</p>';
    try { const r = await fetch('api/verify', { method: 'POST' }), d = await r.json(); if (!r.ok) throw d;
      box.innerHTML = `<ol class="steps"><li>מעתיקים את הקוד: <code dir="ltr">${esc(d.code)}</code> <button class="btn ghost" id="copy">העתקה</button></li>
        <li>שולחים אותו בהודעה פרטית ל-<b dir="ltr">@${esc(ACCOUNT)}</b> מהחשבון שלכם: <a class="btn" target="_blank" rel="noopener" href="https://ig.me/m/${esc(ACCOUNT)}">פתיחת הודעה באינסטגרם</a></li>
        <li>חוזרים לכאן. הבית יופיע לבד תוך דקה.</li></ol><p class="note" id="wait">מחכים להודעה שלך...</p>`;
      $('copy').onclick = async () => { try { await navigator.clipboard.writeText(d.code); $('copy').textContent = 'הועתק'; } catch { $('copy').textContent = 'סמנו והעתיקו'; } };
      const until = Date.now() + 10 * 60e3;
      const poll = async () => { if (Date.now() > until) { $('wait').textContent = 'הקוד פג. אפשר לבקש קוד חדש.'; return; }
        const me = await fetch('api/me', { cache: 'no-store' }).then(r => r.json()).catch(() => ({}));
        if (me.u) { const fresh = await loadDelta(residents.length); residents.push(...fresh); world.residents = residents; world.houses();
          mine = me.u; try { localStorage.setItem('kingdom-me', mine); } catch { } box.hidden = true; const k = find(residents, me.u); if (k >= 0) openHouse(k); return; }
        setTimeout(poll, 3000); };
      poll();
    } catch { box.innerHTML = '<p class="err">האימות לא זמין כרגע. נסו שוב מאוחר יותר, או פשוט הגיבו על הריל האחרון.</p>'; }
  }
  // places: the landmarks that stand
  $('places').innerHTML = Object.entries(world.lm).map(([k, l]) => `<button class="chip-btn" data-k="${k}">${esc(l.mod.name)}</button>`).join('');
  $('places').querySelectorAll('button').forEach(b => b.onclick = () => { const l = world.lm[b.dataset.k]; flyTo(l.at[0], l.at[1], 160); });
  const u = q.get('u'); if (u) { const k = find(residents, u); if (k >= 0) setTimeout(() => openHouse(k), 400); }
  // what changed while the page is open
  setInterval(async () => { const fresh = await loadDelta(residents.length); if (fresh.length) { residents.push(...fresh); world.residents = residents; world.houses(); $('h-res').textContent = residents.length.toLocaleString('he-IL'); } }, 60000);
}
