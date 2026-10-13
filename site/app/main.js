// The public page: the kingdom as it stands today. Type an Instagram name and the camera flies to that follower's house.
//   ?u=name        opens on that person's house (the link the Share button copies)
//   ?invite=name   someone was invited to live with name: getting a house moves them into name's house
//   ?reel=N        the reel of day N, posed frame by frame (reel.js); the page shows nothing else
import * as THREE from 'three';
import { MapControls } from '../vendor/addons/MapControls.js';
import { loadKingdom, loadDelta } from './kingdom.js';
import { World } from './view.js';
import { addresses, KINGDOM } from './names.js';
import { find, normalize, valid } from './residents.js';
import { face } from './face.js';
import { HOMES, tierOf, TIERS } from './catalog.js';
import { STATUE } from './landmarks/castle.js';

const q = new URLSearchParams(location.search), $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ACCOUNT = document.documentElement.dataset.account;
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { } } };

const data = await loadKingdom('.');
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: q.has('reel') || q.has('catalog') });
renderer.setPixelRatio(q.has('reel') ? 1 : Math.min(devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1.5 : 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('scene').appendChild(renderer.domElement);

if (q.has('reel')) { const { startReel } = await import('./reel.js'); await startReel({ renderer, data, day: +q.get('reel') }); }
else if (q.has('catalog')) { const { startCatalog } = await import('./catalog-shots.js'); await startCatalog(renderer); }
else { data.residents.push(...await loadDelta(data.residents.length)); site(data); }

function site({ plan, residents, kingdom, honours }) {
  document.body.classList.add('site');
  const world = new World(renderer, plan, residents, kingdom), addr = addresses(plan.plots);
  // free movement: drag to move, two fingers or the right button to turn and tilt, pinch or the wheel to zoom, arrow keys too
  const cam = world.camera, controls = new MapControls(cam, renderer.domElement);
  cam.position.set(230, 260, 380); controls.target.set(0, 10, 40);
  Object.assign(controls, { enableDamping: true, dampingFactor: .08, maxPolarAngle: 1.42, minDistance: 18, maxDistance: 3200, screenSpacePanning: false, zoomToCursor: true, keyPanSpeed: 30 });
  controls.listenToKeyEvents(window);
  const W = plan.wall + 400;
  controls.addEventListener('change', () => { const t = controls.target; const r = Math.hypot(t.x, t.z); if (r > W) { t.x *= W / r; t.z *= W / r; } });
  const resize = () => { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
  addEventListener('resize', resize); resize();
  const hour = () => +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Jerusalem' }).format(new Date());
  world.daylight(hour()); setInterval(() => world.daylight(hour()), 60000);
  const count = () => { $('h-res').textContent = residents.length.toLocaleString('he-IL'); };
  $('h-day').textContent = kingdom.day; count(); $('status').textContent = kingdom.status ?? '';
  let mine = store.get('kingdom-me');

  // ---- labels: the nearest houses to where the camera looks, and the king's statue ----
  const labels = $('labels'), pool = [], kTag = document.createElement('button');
  kTag.className = 'tag michael'; kTag.textContent = 'המלך מיכאל'; labels.append(kTag);
  kTag.onclick = () => flyTo(STATUE[0], STATUE[1], 70);
  const place = (el, v) => { const p = v.clone().project(cam), vis = p.z < 1 && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05; el.hidden = !vis;
    if (vis) { el.style.left = `${(p.x + 1) / 2 * innerWidth}px`; el.style.top = `${(1 - p.y) / 2 * innerHeight}px`; } };
  function drawLabels() {
    const t = controls.target, dist = cam.position.distanceTo(t), max = dist < 160 ? 40 : dist < 500 ? 24 : 10, near = [];
    for (const [plot, people] of world.byPlot) { const pl = plan.plots[plot]; if (!pl) continue;
      const d = Math.hypot(pl[0] - t.x, pl[1] - t.z) - (people.some(k => residents[k].u === mine) ? 1e9 : 0);
      if (near.length < max || d < near.at(-1).d) { near.push({ plot, people, d }); near.sort((a, b) => a.d - b.d); if (near.length > max) near.pop(); } }
    while (pool.length < max) { const el = document.createElement('button'); el.className = 'tag'; el.onclick = () => openHouse(+el.dataset.k); labels.append(el); pool.push(el); }
    pool.forEach((el, i) => { const n = near[i]; if (!n) { el.hidden = true; return; } const owner = residents[n.people[0]], pl = plan.plots[n.plot], key = `${n.people[0]}:${n.people.length}`;
      if (el.dataset.key !== key) { el.dataset.key = key; el.dataset.k = n.people[0]; el.textContent = '@' + owner.u + (n.people.length > 1 ? ` +${n.people.length - 1}` : ''); }
      el.classList.toggle('mine', n.people.some(k => residents[k].u === mine)); place(el, new THREE.Vector3(pl[0], n.people.length >= 4 ? 22 : 13, pl[1])); });
  }
  (function frame() {
    world.animate(performance.timeOrigin / 1000 + performance.now() / 1000);
    controls.update(); world.aim(controls.target); renderer.render(world.scene, cam);
    place(kTag, new THREE.Vector3(STATUE[0], 38, STATUE[1])); drawLabels(); requestAnimationFrame(frame);
  })();
  const nudge = (fn) => { fn(); controls.update(); };
  const rotateBy = a => { const off = cam.position.clone().sub(controls.target); off.applyAxisAngle(new THREE.Vector3(0, 1, 0), a); cam.position.copy(controls.target).add(off); };
  const zoomBy = f => { const off = cam.position.clone().sub(controls.target).multiplyScalar(f); if (off.length() > 18 && off.length() < 3200) cam.position.copy(controls.target).add(off); };
  const tiltBy = d => { const off = cam.position.clone().sub(controls.target), r = off.length(); let ph = Math.acos(off.y / r) + d; ph = Math.max(.15, Math.min(1.42, ph));
    const th = Math.atan2(off.x, off.z); cam.position.set(controls.target.x + r * Math.sin(ph) * Math.sin(th), controls.target.y + r * Math.cos(ph), controls.target.z + r * Math.sin(ph) * Math.cos(th)); };
  const pad = $('pad'); pad.hidden = false;
  pad.querySelectorAll('button').forEach(b => { let timer; const act = { in: () => zoomBy(.9), out: () => zoomBy(1.11), left: () => rotateBy(.08), right: () => rotateBy(-.08), up: () => tiltBy(-.05), down: () => tiltBy(.05), home: () => flyTo(0, 40, 480) }[b.dataset.a];
    const go = () => nudge(act); b.addEventListener('pointerdown', e => { e.preventDefault(); go(); if (b.dataset.a !== 'home') timer = setInterval(go, 60); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => clearInterval(timer))); });
  function flyTo(x, z, dist = 90) {
    const t0 = performance.now(), from = controls.target.clone(), to = new THREE.Vector3(x, 4, z), off0 = cam.position.clone().sub(from), off1 = off0.clone().setLength(dist);
    (function step(now) { const f = Math.min(1, (now - t0) / 1100), e = f < .5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
      controls.target.lerpVectors(from, to, e); cam.position.copy(controls.target).add(off0.clone().lerp(off1, e)); if (f < 1) requestAnimationFrame(step); })(t0);
  }

  // ---- the ID card ----
  const card = $('card');
  const honoursOf = u => { const out = [];
    for (const [k, b] of Object.entries(honours.built ?? {})) if (b.by?.includes(u)) out.push(`אדריכל · ${world.lm[k]?.mod.name ?? k}`);
    if (honours.given?.key?.includes(u)) out.push('מפתח זהב'); return out; };
  function openHouse(k) {
    const r = residents[k], pl = plan.plots[r.plot], a = addr[r.plot], mates = world.housemates(r.plot), owner = residents[mates[0]];
    flyTo(pl[0], pl[1]); closeMenu();
    const tier = tierOf(mates.length), others = mates.filter(i => i !== k).slice(0, 8).map(i => `@${residents[i].u}`);
    card.innerHTML = `<div class="idcard"><div class="id-top"><span>תעודת תושב</span><span>${esc(KINGDOM)}</span></div>
      <div class="id-body"><div class="face">${face(r.h)}</div><div class="id-fields"><b dir="ltr">@${esc(r.u)}</b>
      <span>תושב מספר ${(k + 1).toLocaleString('he-IL')}</span><span>${esc(a.street)} ${a.num}</span>
      <span class="since">${mates.length > 1 ? `${esc(tier.name)} · גרים כאן ${mates.length}` : esc(HOMES[owner.home ?? -1]?.name ?? tier.name)} · מיום ${r.day ?? 1}</span></div></div>
      ${others.length ? `<p class="mates" dir="rtl">גרים איתו: <span dir="ltr">${others.map(esc).join(' ')}</span>${mates.length > 9 ? ' ועוד' : ''}</p>` : ''}
      ${honoursOf(r.u).length ? `<div class="chips">${honoursOf(r.u).map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
      <div class="row"><button class="btn ghost" id="share">העתקת קישור לבית</button>${r.u === mine ? '<button class="btn ghost" id="invite-me">להזמין חברים</button>' : ''}<button class="btn ghost" id="close">סגירה</button></div></div>`;
    card.hidden = false; $('close').onclick = () => card.hidden = true;
    $('share').onclick = () => copy(`${location.origin}${location.pathname}?u=${r.u}`, $('share'));
    if ($('invite-me')) $('invite-me').onclick = () => openMenu('friends');
  }
  async function copy(text, btn) { try { await navigator.clipboard.writeText(text); btn.textContent = 'הועתק'; } catch { btn.textContent = text; } }

  // ---- search ----
  const updated = data => data ? new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric', timeZone: 'Asia/Jerusalem' }).format(new Date(data)) : null;
  $('find').addEventListener('submit', e => { e.preventDefault(); const name = normalize($('who').value), err = $('find-err');
    err.hidden = true; if (!valid(name)) { err.textContent = 'זה לא נראה כמו שם משתמש באינסטגרם: אותיות באנגלית, מספרים, נקודה וקו תחתון.'; err.hidden = false; return; }
    const k = find(residents, name); if (k >= 0) { mine = residents[k].u; store.set('kingdom-me', mine); openHouse(k); return; }
    lookFor(name); });
  // not here yet: the site reads the newest Instagram comments right now (api/sync), so a fresh comment is a house in seconds
  async function lookFor(name, tries = 0) {
    const err = $('find-err'); err.hidden = false;
    err.innerHTML = `<span class="note">מחפשים את התגובה של <b dir="ltr">@${esc(name)}</b> באינסטגרם...</span>`;
    const d = await fetch(`api/sync?u=${encodeURIComponent(name)}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({}));
    if (d.resident) { residents.push(...await loadDelta(residents.length)); world.residents = residents; world.houses(); count();
      const k = find(residents, name); if (k >= 0) { err.hidden = true; mine = residents[k].u; store.set('kingdom-me', mine); openHouse(k); return; } }
    if (d.pending) { err.innerHTML = `ראינו את התגובה של <b dir="ltr">@${esc(name)}</b> 👋 שלחנו לך הודעה פרטית באינסטגרם (אם לא רואים, בדקו ב"בקשות הודעות").
      עוקבים אחרי <b dir="ltr">@${esc(ACCOUNT)}</b>, כותבים לנו שם "בית", והבית נבנה מיד. <a class="btn gold" target="_blank" rel="noopener" href="https://ig.me/m/${esc(ACCOUNT)}">לכתוב "בית" עכשיו</a>`;
      if (tries < 8) setTimeout(() => lookFor(name, tries + 1), 8000); return; }
    if (!d.ran && d.wait && tries < 3) { setTimeout(() => lookFor(name, tries + 1), Math.min(9000, d.wait + 500)); return; }
    err.innerHTML = `עוד אין בית על השם <b dir="ltr">@${esc(name)}</b>. עוקבים אחרי <b dir="ltr">@${esc(ACCOUNT)}</b> ומגיבים על הריל האחרון, ותקבלו הודעה פרטית שתהפוך אתכם לאזרחים.
      <a class="btn gold" target="_blank" rel="noopener" href="https://www.instagram.com/${esc(ACCOUNT)}/">להגיב באינסטגרם</a> <button class="link" id="how">איך מקבלים בית?</button>`;
    $('how').onclick = () => openMenu('how');
  }

  // ---- getting a house by DM code (after Meta's review; until then the button explains commenting) ----
  const invite = normalize(q.get('invite') ?? ''), host = invite && find(residents, invite) >= 0 ? invite : null;
  if (host) { $('invite-banner').hidden = false; $('invite-banner').innerHTML = `<b dir="ltr">@${esc(host)}</b> מזמין אותך לגור איתו בממלכה. מקבלים בית, ועוברים ישר לגור יחד.`; }
  $('get').onclick = () => verify();
  async function verify() {
    const box = $('verify'); box.hidden = false; box.innerHTML = '<p>מכינים קוד...</p>';
    try { const r = await fetch('api/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ invite: host }) }), d = await r.json(); if (!r.ok || !kingdom.dm) throw d;
      box.innerHTML = `<ol class="steps"><li>מעתיקים את הקוד: <code dir="ltr">${esc(d.code)}</code> <button class="btn ghost" id="copy">העתקה</button></li>
        <li>שולחים אותו בהודעה פרטית ל-<b dir="ltr">@${esc(ACCOUNT)}</b> מהחשבון שלכם: <a class="btn" target="_blank" rel="noopener" href="https://ig.me/m/${esc(ACCOUNT)}">פתיחת הודעה באינסטגרם</a></li>
        <li>חוזרים לכאן. הבית יופיע לבד תוך דקה.</li></ol><p class="note" id="wait">מחכים להודעה שלך...</p>`;
      $('copy').onclick = () => copy(d.code, $('copy'));
      const until = Date.now() + 10 * 60e3;
      const poll = async () => { if (Date.now() > until) { $('wait').textContent = 'הקוד פג. אפשר לבקש קוד חדש.'; return; }
        const me = await fetch('api/me', { cache: 'no-store' }).then(r => r.json()).catch(() => ({}));
        if (me.u) { residents.push(...await loadDelta(residents.length)); world.residents = residents; world.houses(); count();
          mine = me.u; store.set('kingdom-me', mine); store.set('kingdom-verified', mine); box.hidden = true; const k = find(residents, me.u); if (k >= 0) openHouse(k); return; }
        setTimeout(poll, 3000); };
      poll();
    } catch { box.innerHTML = `<p>הכי פשוט: מגיבים על הריל האחרון של <b dir="ltr">@${esc(ACCOUNT)}</b>. מיכאל שולח לכם הודעה פרטית, עונים לו "בית", ואם אתם עוקבים הבית נבנה מיד.</p>
      <a class="btn gold" target="_blank" rel="noopener" href="https://www.instagram.com/${esc(ACCOUNT)}/">לאינסטגרם של הממלכה</a>`; }
  }

  // ---- the info office (לשכת המידע) ----
  const menu = $('menu'), panel = $('panel');
  const ITEMS = [['find', 'איפה הבית שלי?', 'מחפשים לפי שם המשתמש באינסטגרם'], ['friends', 'לגור עם חברים', 'בית משותף, בניין לחבורה, ואפילו מגדל'],
    ['pick', 'לבחור בית אחר', 'מתוך הקטלוג של הממלכה'], ['lottery', 'ההגרלה היומית', 'כל יום מישהו זוכה במפתח הזהב'],
    ['catalog', 'קטלוג הבתים', 'כל הבתים שאפשר לגור בהם'], ['people', 'התושבים', 'החדשים בממלכה, והוותיקים'],
    ['how', 'איך מקבלים בית?', 'ולמה הבית שלי עוד לא מופיע'], ['places', 'מקומות בממלכה', 'כל מה שהתושבים ביקשו ונבנה']];
  $('open-menu').onclick = () => openMenu();
  function closeMenu() { menu.hidden = true; }
  function openMenu(page) {
    card.hidden = true; menu.hidden = false;
    if (!page) { panel.innerHTML = `<h2>לשכת המידע של הממלכה</h2><p class="note">מה עושים כאן?</p><div class="items">${ITEMS.map(([k, t, l]) => `<button class="item" data-k="${k}"><b>${t}</b><span>${l}</span></button>`).join('')}</div>`;
      panel.querySelectorAll('.item').forEach(b => b.onclick = () => openMenu(b.dataset.k)); return; }
    const back = '<button class="link back" id="back">חזרה ללשכה</button>';
    const pages = {
      find: () => { closeMenu(); $('who').focus(); return null; },
      friends: () => `<h2>לגור עם חברים</h2><p>כל חבר שמקבל בית דרך הקישור שלך עובר לגור איתך, והבית גדל לעיני כל הממלכה:</p>
        <ul class="tiers">${TIERS.map(t => `<li><b>${t.from === 1 ? 'לבד' : `${t.from} ומעלה`}</b> ${esc(t.name)}</li>`).join('')}</ul>
        ${store.get('kingdom-verified') ? `<div class="row"><button class="btn gold" id="copy-invite">העתקת הקישור שלי</button><a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`בוא לגור איתי בממלכה של משפחת ספיר 👑 ${location.origin}${location.pathname}?invite=${store.get('kingdom-verified')}`)}">שליחה בוואטסאפ</a></div>`
          : `<p class="note">כדי שהקישור יהיה שלך, צריך פעם אחת לאמת את הבית בקוד בהודעה פרטית.</p><button class="btn" id="go-verify">לאמת את הבית שלי</button>`}`,
      pick: () => `<h2>לבחור בית אחר</h2><p class="note">הבית החדש נבנה בעדכון הבא של הממלכה. הבתים הנדירים פתוחים רק למי שזכה במפתח הזהב.</p>${grid(true)}`,
      catalog: () => `<h2>קטלוג הבתים</h2>${grid(false)}`,
      lottery: () => { const keys = honours.given?.key ?? []; return `<h2>ההגרלה היומית</h2><p>כל יום, אחד התושבים החדשים זוכה במפתח הזהב: עיטור על תעודת התושב, וזכות לבחור בית נדיר מהקטלוג.</p>
        ${keys.length ? `<p>הזוכה האחרון: <b dir="ltr">@${esc(keys.at(-1))}</b></p><ul class="people">${keys.slice().reverse().map(u => `<li><button class="link" data-u="${esc(u)}" dir="ltr">@${esc(u)}</button></li>`).join('')}</ul>` : '<p class="note">ההגרלה הראשונה מחר. כל מי שמצטרף היום משתתף.</p>'}`; },
      people: () => `<h2>התושבים</h2><div class="tabs"><button class="tab on" data-t="new">חדשים</button><button class="tab" data-t="old">הראשונים</button></div><ul class="people" id="plist"></ul>`,
      how: () => `<h2>איך מקבלים בית?</h2><ol class="steps"><li>עוקבים אחרי <b dir="ltr">@${esc(ACCOUNT)}</b> באינסטגרם.</li><li>מגיבים על הריל האחרון. מה שתכתבו יכול גם לקבוע מה נבנה מחר.</li>
        <li>עוקבים אחרי הממלכה. תוך דקה מגיעה הודעה פרטית ממיכאל (בדקו גם ב"בקשות הודעות"), עונים לו "בית", ומקבלים אזרחות ובית עם מספר.</li><li>מחפשים את השם שלכם ב"איפה הבית שלי?" ומקבלים רחוב ומספר.</li></ol>
        <p class="note">לא מוצאים? בדקו שהשם כתוב בדיוק כמו באינסטגרם, ושהתגובה היא על פוסט של הממלכה.</p>`,
      places: () => `<h2>מקומות בממלכה</h2><div class="places-grid">${Object.entries(world.lm).map(([k, l]) => { const b = (kingdom.landmarks ?? []).find(x => x.key === k);
        return `<button class="place" data-k="${k}"><b>${esc(l.mod.name)}</b><span>${k === 'castle' ? 'כאן הכל התחיל, ביום 1' : `נבנה ביום ${b?.day ?? '?'}${b?.by?.length ? ` לבקשת <span dir="ltr">@${esc(b.by[0])}</span>` : ''}`}</span></button>`; }).join('')}</div>`,
    };
    const html = pages[page](); if (html === null) return;
    panel.innerHTML = back + html; $('back').onclick = () => openMenu();
    panel.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { const k = find(residents, b.dataset.u); if (k >= 0) openHouse(k); });
    panel.querySelectorAll('.place').forEach(b => b.onclick = () => { const l = world.lm[b.dataset.k]; closeMenu(); flyTo(l.at[0], l.at[1], 160); });
    if ($('copy-invite')) $('copy-invite').onclick = () => copy(`${location.origin}${location.pathname}?invite=${store.get('kingdom-verified')}`, $('copy-invite'));
    if ($('go-verify')) $('go-verify').onclick = () => { closeMenu(); verify(); };
    panel.querySelectorAll('.choose').forEach(b => b.onclick = () => choose(+b.dataset.k, b));
    if (page === 'people') { const list = t => { const idx = residents.map((_, k) => k), pick = t === 'new' ? idx.slice(-100).reverse() : idx.slice(0, 100);
        $('plist').innerHTML = pick.length ? pick.map(k => `<li><button class="link" data-u="${esc(residents[k].u)}" dir="ltr">@${esc(residents[k].u)}</button><span>${(k + 1).toLocaleString('he-IL')}</span></li>`).join('') : '<li class="note">עוד אין תושבים. הראשון יכול להיות אתה.</li>';
        $('plist').querySelectorAll('[data-u]').forEach(b => b.onclick = () => openHouse(find(residents, b.dataset.u))); };
      panel.querySelectorAll('.tab').forEach(b => b.onclick = () => { panel.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b)); list(b.dataset.t); }); list('new'); }
  }
  function grid(choosing) {
    return `<div class="catalog">${HOMES.map((h, k) => `<div class="home${h.rare ? ' rare' : ''}"><img src="catalog/${k}.png" alt="" loading="lazy" width="160" height="160"><b>${esc(h.name)}</b><span>${esc(h.line)}</span>
      ${choosing ? `<button class="btn ghost choose" data-k="${k}">זה הבית שלי</button>` : ''}</div>`).join('')}</div><p class="err" id="pick-err" hidden></p>`;
  }
  async function choose(kind, btn) {
    const err = $('pick-err'); err.hidden = true;
    const r = await fetch('api/home', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind }) }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok) { btn.textContent = 'נבחר. ייבנה בעדכון הבא'; return; }
    err.textContent = { verify: 'כדי לבחור, צריך פעם אחת לאמת את הבית בקוד בהודעה פרטית.', rare: 'הבית הזה נדיר: הוא פתוח רק למי שזכה במפתח הזהב.', shared: 'בבית משותף, מי שהזמין בוחר את הבית.' }[d.error] ?? 'אי אפשר לבחור כרגע. נסו שוב מאוחר יותר.';
    err.hidden = false;
  }
  $('menu-close').onclick = closeMenu;

  // ---- news: what is new today, offered once ----
  const news = kingdom.news;
  if (news && store.get(`kingdom-news-${news.day}`) !== '1' && !q.has('u')) {
    $('news').hidden = false; $('news').innerHTML = `<b>חדש ביום ${news.day}</b><p>${esc(news.line)}</p><div class="row"><button class="btn gold" id="see">לראות</button><button class="btn ghost" id="later">אחר כך</button></div>`;
    const done = () => { $('news').hidden = true; store.set(`kingdom-news-${news.day}`, '1'); };
    $('see').onclick = () => { done(); const l = world.lm[news.landmark]; if (l) flyTo(l.at[0], l.at[1], 150); }; $('later').onclick = done;
  }
  const u = q.get('u'); if (u) { const k = find(residents, u); if (k >= 0) setTimeout(() => openHouse(k), 400); }
  setInterval(async () => { const fresh = await loadDelta(residents.length); if (fresh.length) { residents.push(...fresh); world.residents = residents; world.houses(); count(); } }, 60000);
}
