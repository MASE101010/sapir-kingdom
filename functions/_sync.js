// Reading the kingdom's own Instagram comments and messages, from the site itself. Citizenship is for followers only:
// a new commenter gets a private message ("follow, then write 'בית'"); when they write back, Instagram lets us see whether
// they follow, and then the house is built, they get its number in the chat and a welcome under their comment.
// Instagram only shows whether someone follows after they have written to us, which is why the message comes first.
// Called by /api/sync: when someone searches their name on the site and is not found yet (so a comment turns into a
// house within seconds), and every few minutes by GitHub (poll.yml) for the people who never open the site.
// Instagram allows only so many calls an hour, so a sync runs at most once every GAP ms, and backs off after a limit error.
import { addResident, igToken } from './_lib.js';
const G = 'https://graph.instagram.com/v21.0', GAP = 8000, BACKOFF = 10 * 60e3;
const say = [n => `ברוכים הבאים לממלכה! הבית שלך, מספר ${n}, כבר עומד 🏠 חפשו את השם שלכם באתר שבביו`,
  n => `נבנה לך בית! מספר ${n}. כנסו לאתר שבביו ותמצאו אותו 👑`, n => `תושב חדש! בית מספר ${n} בממלכה הוא שלך. הקישור בביו 🏰`,
  n => `המלך מיכאל מברך את התושב החדש! בית מספר ${n} מחכה לך, הקישור בביו 🏡`];
const invited = ['שלחתי לך הודעה פרטית 📩 (אם לא רואים, בדקו בבקשות ההודעות) עוקבים, עונים לי שם, ומקבלים אזרחות 👑',
  'יש לך הודעה ממני בפרטי 📩 כדי לקבל בית בממלכה צריך לעקוב ולענות לי שם 🏰', 'הבית שלך כמעט מוכן! תסתכלו בהודעות הפרטיות 📩'];
const SELF = env => (env.IG_USERNAME ?? 'sapirkingdom').toLowerCase();
const post = async (env, path, body) => fetch(`${G}/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${await igToken(env)}` }, body: JSON.stringify(body) }).then(r => r.json()).catch(() => ({ error: {} }));
export const dmTo = (env, recipient, text) => post(env, `${env.IG_USER_ID}/messages`, { recipient, message: { text } });

const getState = (env, k) => env.DB.prepare('SELECT v FROM state WHERE k = ?').bind(k).first('v');
const setState = (env, k, v) => env.DB.prepare('INSERT INTO state (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').bind(k, String(v)).run();
async function get(url) { const d = await fetch(url).then(r => r.json()); if (d.error) { const e = new Error(d.error.message); e.code = d.error.code; throw e; } return d; }

/** takes comments (from here, the webhook, or the poller): keeps each once; a commenter who has no house yet waits for
 *  the follow (house = 0). Returns the new comments of people without a house. */
export async function takeComments(env, comments) {
  const out = [], self = SELF(env);
  for (const c of comments.slice(0, 500)) {
    const u = String(c.u).toLowerCase(); if (u === self) continue;     // the kingdom's own comments
    const fresh = await env.DB.prepare('INSERT OR IGNORE INTO comments (id, media, u, text, at) VALUES (?, ?, ?, ?, ?)').bind(c.id, c.media ?? null, u, c.text ?? '', Date.now()).run();
    if (!fresh.meta.changes) continue;
    if (await env.DB.prepare('SELECT n FROM residents WHERE u = ?').bind(u).first('n')) continue;
    await env.DB.prepare('UPDATE comments SET house = 0 WHERE id = ?').bind(c.id).run(); out.push({ id: c.id, u });
  }
  return out;
}

/** someone wrote to the kingdom in private: if they follow, they become a citizen (the house is built and they get its
 *  number); if not, they are asked to follow. Used by the sync (reading the chats) and by the webhook. */
export async function fromDM(env, sender, site = env.SITE_URL ?? 'https://sapir-kingdom.pages.dev') {
  const who = await fetch(`${G}/${sender}?fields=username,is_user_follow_business&access_token=${await igToken(env)}`).then(r => r.json()).catch(() => ({}));
  if (!who.username) return null;
  const u = who.username.toLowerCase(); if (u === SELF(env)) return null;
  const home = await env.DB.prepare('SELECT n FROM residents WHERE u = ?').bind(u).first('n');
  const once = async (k, ms) => { const at = +(await getState(env, k) ?? 0); if (Date.now() - at < ms) return false; await setState(env, k, Date.now()); return true; };
  if (home) { if (await once(`dmhome:${u}`, 864e5)) await dmTo(env, { id: sender }, `אתם כבר תושבים בממלכה 👑 בית מספר ${home.toLocaleString('he-IL')}: ${site}/?u=${u}\nיש רעיון מה לבנות מחר? תגיבו על הריל האחרון!`); return { u, home }; }
  if (!who.is_user_follow_business) { if (await once(`dmnofollow:${u}`, 5 * 60e3)) await dmTo(env, { id: sender }, `כמעט! 🙂 עוד לא רואה שאתם עוקבים אחרי @${SELF(env)}.\nעקבו, וכתבו לי כאן שוב "בית", והבית שלכם נבנה מיד 🏰`); return { u, follows: false }; }
  const r = await addResident(env, who.username, 'follow');
  // a welcome under one comment of theirs (the first); their other comments are simply kept
  await env.DB.batch([env.DB.prepare('UPDATE comments SET house = 1 WHERE id = (SELECT id FROM comments WHERE u = ? AND house = 0 ORDER BY at LIMIT 1)').bind(u),
    env.DB.prepare('UPDATE comments SET house = 2 WHERE u = ? AND house = 0').bind(u)]);
  await dmTo(env, { id: sender }, `ברוכים הבאים לממלכה של משפחת ספיר! 🎉\nקיבלתם אזרחות, והבית שלכם, מספר ${r.n.toLocaleString('he-IL')}, כבר עומד:\n${site}/?u=${r.u}\nמה בונים מחר? תגיבו על הריל האחרון, התגובה עם הכי הרבה לייקים נבנית 👑`);
  return { u, n: r.n };
}

/** one round: returns { ran, added, replied } or { ran: false, wait } when it is too soon */
export async function sync(env, { force = false, replies = 12, gap = GAP } = {}) {
  const now = Date.now(), until = +(await getState(env, 'sync_backoff') ?? 0);
  if (now < until) return { ran: false, wait: until - now };
  // only one sync at a time, at most one every GAP: the update succeeds for one caller only
  const claim = await env.DB.prepare("INSERT INTO state (k, v) VALUES ('sync_at', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v WHERE CAST(state.v AS INTEGER) <= ?").bind(String(now), force ? now : now - gap).run();
  if (!claim.meta.changes) return { ran: false, wait: gap };
  const token = await igToken(env), user = env.IG_USER_ID ?? 'me';
  try {
    // the newest posts (asked again every 5 minutes, or when forced)
    let media = JSON.parse(await getState(env, 'sync_media') ?? '{"at":0,"ids":[]}');
    if (force || now - media.at > 5 * 60e3) { media = { at: now, ids: (await get(`${G}/${user}/media?fields=id&limit=3&access_token=${token}`)).data.map(m => m.id) }; await setState(env, 'sync_media', JSON.stringify(media)); }
    const comments = [];
    const read = (m, d) => comments.push(...(d.data ?? []).map(c => ({ id: c.id, u: c.username ?? c.from?.username, text: c.text, media: m })).filter(c => c.u));
    for (const [i, m] of media.ids.entries()) {
      if (i > 0 && !force) break;                               // a quick sync looks at the newest post only
      const base = `${G}/${m}/comments?fields=id,text,username,from&limit=50&access_token=${token}`;
      // the first page, and from the last page we reached before onwards (whichever end Instagram puts new comments at)
      let first; try { first = await get(base); } catch (e) { if (e.code === 4 || e.code === 17 || e.code === 32 || e.code === 613) throw e; continue; }   // a deleted post: skip it
      read(m, first);
      let after = await getState(env, `sync_after:${m}`), next = after ? `${base}&after=${after}` : first.paging?.next, pages = 0;
      if (!after && first.paging?.cursors?.after) after = first.paging.cursors.after;
      while (next && pages++ < (force ? 8 : 3)) { const d = await get(next); read(m, d); if (d.paging?.cursors?.after) after = d.paging.cursors.after; next = d.paging?.next; }
      if (after) await setState(env, `sync_after:${m}`, after);
    }
    const waiting = await takeComments(env, comments);
    let invites = 0, replied = 0, citizens = [];
    // 1. a private message to each new commenter without a house (once a person), and a word under their comment
    const { results: toInvite } = await env.DB.prepare(`SELECT c.id, c.u FROM comments c WHERE c.house = 0 AND (c.dm IS NULL OR c.dm BETWEEN -2 AND -1)
      AND NOT EXISTS (SELECT 1 FROM comments o WHERE o.u = c.u AND o.dm IN (0, 1)) ORDER BY c.at LIMIT ?`).bind(replies).all();
    const name = u => u.replace(/[._\d]+$/, '').replace(/[._]/g, ' ');
    const once = new Set();
    for (const c of toInvite) {
      if (once.has(c.u)) { await env.DB.prepare('UPDATE comments SET dm = 0 WHERE id = ?').bind(c.id).run(); continue; }   // one message a person
      once.add(c.u);
      const r = await dmTo(env, { comment_id: c.id }, `היי ${name(c.u)}! 👑 כאן המלך מיכאל מהממלכה של משפחת ספיר.\nכדי לקבל אזרחות ובית עם השם שלך, צריך לעקוב אחרי @${SELF(env)}.\nעוקבים? כתבו לי כאן "בית", והבית שלכם נבנה מיד 🏰`);
      await env.DB.prepare('UPDATE comments SET dm = CASE WHEN ? THEN COALESCE(dm, 0) - 1 ELSE 1 END WHERE id = ?').bind(r.error ? 1 : 0, c.id).run();
      if (!r.error) { invites++; const p = await post(env, `${c.id}/replies`, { message: invited[invites % invited.length] }); if (!p.error) await env.DB.prepare('UPDATE comments SET replied = 2 WHERE id = ?').bind(c.id).run(); }
    }
    // 2. the private chats: whoever wrote since the last look (each message once)
    const conv = await get(`${G}/${user}/conversations?platform=instagram&fields=messages.limit(4){id,from,created_time}&limit=25&access_token=${token}`).catch(() => ({ data: [] }));
    const since = +(await getState(env, 'dm_since') ?? 0); let newest = since;
    for (const cv of conv.data ?? []) for (const m of cv.messages?.data ?? []) {
      const at = Date.parse(m.created_time); if (!m.from?.id || m.from.id === user || m.from.username?.toLowerCase() === SELF(env) || at <= since - 120e3) continue;
      if (!(await env.DB.prepare("INSERT OR IGNORE INTO state (k, v) VALUES (?, ?)").bind(`msg:${m.id}`, String(at)).run()).meta.changes) continue;
      newest = Math.max(newest, at); const r = await fromDM(env, m.from.id); if (r?.n) citizens.push(r.u);
    }
    if (newest > since) await setState(env, 'dm_since', newest);
    // 3. a welcome under the comments of new citizens, a few each round
    const { results: queue } = await env.DB.prepare('SELECT c.id, r.n FROM comments c JOIN residents r ON r.u = c.u WHERE (c.replied IS NULL OR c.replied = 2 OR c.replied BETWEEN -2 AND -1) AND c.house = 1 ORDER BY c.at LIMIT ?').bind(replies).all();
    for (const a of queue) {
      const r = await post(env, `${a.id}/replies`, { message: say[a.n % say.length](a.n.toLocaleString('he-IL')) });
      await env.DB.prepare('UPDATE comments SET replied = CASE WHEN ? THEN (CASE WHEN replied > 0 THEN 0 ELSE COALESCE(replied, 0) END) - 1 ELSE 1 END WHERE id = ?').bind(r.error ? 1 : 0, a.id).run(); if (!r.error) replied++;   // a failed answer is tried again
    }
    return { ran: true, read: comments.length, waiting: waiting.map(w => w.u), invites, citizens, replied };
  } catch (e) {
    if ([4, 17, 32, 613].includes(e.code)) await setState(env, 'sync_backoff', now + BACKOFF);   // Instagram's rate limits
    return { ran: true, error: e.message };
  }
}
