process.on('uncaughtException', e => { console.log(`::warning title=poll crash::${e.stack?.slice(0, 600).replace(/\n/g, ' ')}`); process.exit(1); });
process.on('unhandledRejection', e => { console.log(`::warning title=poll crash::${String(e?.stack ?? e).slice(0, 600).replace(/\n/g, ' ')}`); process.exit(1); });
// Every 5 minutes (poll.yml): asks the site to read the newest comments on the kingdom's posts (functions/_sync.js),
// so commenters who never open the site still get their house and an answer. The site does the same on every search.
// env: SITE_URL, EXPORT_TOKEN
const { SITE_URL, EXPORT_TOKEN } = process.env;
if (process.env.DEBUG) { const x = await fetch(`${SITE_URL}/api/sync?debug=1&likes=1${process.env.DMTEST ? `&dmtest=${process.env.DMTEST}` : ''}`, { headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(r => r.text()); try { const j = JSON.parse(x); console.log(`::notice title=state::${JSON.stringify(j.state.filter(s => !s.k.startsWith('sync_after'))).slice(0, 800)} now ${Date.now()}`);
    console.log(`::notice title=likes::${(j.likes ?? []).filter(l => l[1] !== 'sapirkingdom').map(l => `${l[0]}♥ ${l[1]}: ${String(l[2]).slice(0, 70)}`).join(' || ').slice(0, 3500)}`);
    console.log(`::notice title=chats::${(j.conv?.data ?? []).map(c => (c.messages?.data ?? []).map(m => `${m.from?.username}: ${(m.message ?? '').slice(0, 40)} @${m.created_time}`).join(' / ')).join(' || ').slice(0, 2500) || JSON.stringify(j.conv).slice(0, 400)}`); } catch { console.log(`::notice title=debug::${x.slice(0, 1500)}`); } }
const raw = await fetch(`${SITE_URL}/api/sync`, { method: 'POST', headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(async r => `${r.status} ${await r.text()}`);
let d; try { d = JSON.parse(raw.slice(4)); } catch { d = { error: raw.slice(0, 400).replace(/\s+/g, ' ') }; }
console.log(JSON.stringify(d));
console.log(`::notice title=sync::read ${d.read ?? 0} comments, waiting: ${(d.waiting ?? []).join(" ") || "none"}, invites ${d.invites ?? 0}, new citizens: ${(d.citizens ?? []).join(" ") || "none"}, replies ${d.replied ?? 0}${d.error ? ", error: " + d.error : ""}`);
if (d.error) process.exitCode = 1;
if (process.env.DEBUG) { const x = await fetch(`${SITE_URL}/api/export`, { headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(r => r.json());
  const res = new Set(x.residents.map(r => r.u)), who = [...new Set(x.comments.map(c => c.u))].filter(u => u !== 'sapirkingdom');
  console.log(`::notice title=count::citizens ${x.residents.filter(r => r.citizen).length}, commenters ${who.length}, with a house ${who.filter(u => res.has(u)).length}, waiting: ${who.filter(u => !res.has(u)).join(' ')}`);
  console.log(`::notice title=kingdom::residents ${x.residents.length}: ${x.residents.slice(-15).map(r => r.u).join(' ')} | comments ${x.comments.length}: ${x.comments.slice(-12).map(c => `${c.u}: ${c.text}`).join(' || ').slice(0, 2500)}`); }
