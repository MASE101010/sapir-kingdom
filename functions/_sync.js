// Reading the kingdom's own Instagram comments, from the site itself. Every new commenter becomes a resident on the spot
// and gets an answer under their comment. Needs no webhook and no Meta app review (only our own posts are read).
// Called by /api/sync: when someone searches their name on the site and is not found yet (so a comment turns into a
// house within seconds), and every few minutes by GitHub (poll.yml) for the people who never open the site.
// Instagram allows only so many calls an hour, so a sync runs at most once every GAP ms, and backs off after a limit error.
import { addResident, igToken } from './_lib.js';
const G = 'https://graph.instagram.com/v21.0', GAP = 8000, BACKOFF = 10 * 60e3;
const say = [n => `ברוכים הבאים לממלכה! הבית שלך, מספר ${n}, כבר עומד 🏠 חפשו את השם שלכם באתר שבביו`,
  n => `נבנה לך בית! מספר ${n}. כנסו לאתר שבביו ותמצאו אותו 👑`, n => `תושב חדש! בית מספר ${n} בממלכה הוא שלך. הקישור בביו 🏰`,
  n => `המלך מיכאל מברך את התושב החדש! בית מספר ${n} מחכה לך, הקישור בביו 🏡`];

const getState = (env, k) => env.DB.prepare('SELECT v FROM state WHERE k = ?').bind(k).first('v');
const setState = (env, k, v) => env.DB.prepare('INSERT INTO state (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').bind(k, String(v)).run();
async function get(url) { const d = await fetch(url).then(r => r.json()); if (d.error) { const e = new Error(d.error.message); e.code = d.error.code; throw e; } return d; }

/** takes comments (from here, the webhook, or the poller): keeps each once, builds the commenter's house, says who is new */
export async function takeComments(env, comments) {
  const out = [];
  const self = (env.IG_USERNAME ?? 'sapirkingdom').toLowerCase();
  for (const c of comments.slice(0, 500)) {
    const u = String(c.u).toLowerCase(); if (u === self) continue;     // the kingdom's own comments are not a resident
    const fresh = await env.DB.prepare('INSERT OR IGNORE INTO comments (id, media, u, text, at) VALUES (?, ?, ?, ?, ?)').bind(c.id, c.media ?? null, u, c.text ?? '', Date.now()).run();
    if (!fresh.meta.changes) continue;
    const before = await env.DB.prepare('SELECT n FROM residents WHERE u = ?').bind(u).first('n');
    const r = await addResident(env, c.u, 'comment'); if (r) out.push({ id: c.id, u: r.u, n: r.n, newHouse: !before });
  }
  return out;
}

/** one round: returns { ran, added, replied } or { ran: false, wait } when it is too soon */
export async function sync(env, { force = false, replies = 12 } = {}) {
  const now = Date.now(), until = +(await getState(env, 'sync_backoff') ?? 0);
  if (now < until) return { ran: false, wait: until - now };
  // only one sync at a time, at most one every GAP: the update succeeds for one caller only
  const claim = await env.DB.prepare("INSERT INTO state (k, v) VALUES ('sync_at', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v WHERE CAST(state.v AS INTEGER) <= ?").bind(String(now), force ? now : now - GAP).run();
  if (!claim.meta.changes) return { ran: false, wait: GAP };
  const token = await igToken(env), user = env.IG_USER_ID ?? 'me';
  try {
    // the newest posts (asked again every 5 minutes, or when forced)
    let media = JSON.parse(await getState(env, 'sync_media') ?? '{"at":0,"ids":[]}');
    if (force || now - media.at > 5 * 60e3) { media = { at: now, ids: (await get(`${G}/${user}/media?fields=id&limit=3&access_token=${token}`)).data.map(m => m.id) }; await setState(env, 'sync_media', JSON.stringify(media)); }
    const comments = [];
    const read = (m, d) => comments.push(...(d.data ?? []).filter(c => c.username).map(c => ({ id: c.id, u: c.username, text: c.text, media: m })));
    for (const [i, m] of media.ids.entries()) {
      if (i > 0 && !force) break;                               // a quick sync looks at the newest post only
      const base = `${G}/${m}/comments?fields=id,text,username&limit=50&access_token=${token}`;
      // the first page, and from the last page we reached before onwards (whichever end Instagram puts new comments at)
      const first = await get(base); read(m, first);
      let after = await getState(env, `sync_after:${m}`), next = after ? `${base}&after=${after}` : first.paging?.next, pages = 0;
      if (!after && first.paging?.cursors?.after) after = first.paging.cursors.after;
      while (next && pages++ < (force ? 8 : 3)) { const d = await get(next); read(m, d); if (d.paging?.cursors?.after) after = d.paging.cursors.after; next = d.paging?.next; }
      if (after) await setState(env, `sync_after:${m}`, after);
    }
    const added = await takeComments(env, comments);
    // answers under the comments of new residents, a few each round (the rest wait for the next one)
    for (const a of added.filter(a => a.newHouse)) await env.DB.prepare('UPDATE comments SET house = 1 WHERE id = ?').bind(a.id).run();
    const { results: queue } = await env.DB.prepare('SELECT c.id, r.n FROM comments c JOIN residents r ON r.u = c.u WHERE c.replied IS NULL AND c.house = 1 ORDER BY c.at LIMIT ?').bind(replies).all();
    let replied = 0;
    for (const a of queue) {
      const r = await fetch(`${G}/${a.id}/replies`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ message: say[a.n % say.length](a.n.toLocaleString('he-IL')) }) }).then(r => r.json()).catch(() => ({ error: {} }));
      await env.DB.prepare('UPDATE comments SET replied = ? WHERE id = ?').bind(r.error ? -1 : 1, a.id).run(); if (!r.error) replied++;
    }
    return { ran: true, read: comments.length, added: added.filter(a => a.newHouse).map(a => a.u), replied };
  } catch (e) {
    if ([4, 17, 32, 613].includes(e.code)) await setState(env, 'sync_backoff', now + BACKOFF);   // Instagram's rate limits
    return { ran: true, error: e.message };
  }
}
