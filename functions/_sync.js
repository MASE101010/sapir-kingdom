// Reading the kingdom's own Instagram comments and messages, from the site itself. Every commenter gets a house at once,
// and a word under their comment. Citizenship (a mark on the ID card, the gold key draw, choosing a house, living with
// friends) is for followers: Instagram only shows whether someone follows after they wrote to us in private, so a
// commenter we cannot see following gets a private message ("follow, then write 'בית'").
// Called by /api/sync: when someone searches their name on the site and is not found yet (so a comment turns into a
// house within seconds), and every few minutes by GitHub (poll.yml) for the people who never open the site.
// Instagram allows only so many calls an hour, so a sync runs at most once every GAP ms, and backs off after a limit error.
import { addResident, igToken } from './_lib.js';
import { HOMES, COMMON } from '../site/app/catalog.js';
import { reply, SOLDIER, SOLDIER_HOME, BAD, teamOf, SQUAD } from './_replies.js';
const G = 'https://graph.instagram.com/v21.0', GAP = 8000, BACKOFF = 10 * 60e3;
const say = [n => `ברוכים הבאים לממלכה! הבית שלך, מספר ${n}, כבר עומד 🏠 חפשו את השם שלכם באתר שבביו`,
  n => `נבנה לך בית! מספר ${n}. כנסו לאתר שבביו ותמצאו אותו 👑`, n => `תושב חדש! בית מספר ${n} בממלכה הוא שלך. הקישור בביו 🏰`,
  n => `המלך מיכאל מברך את התושב החדש! בית מספר ${n} מחכה לך, הקישור בביו 🏡`];
// under the comment of someone we cannot yet see following: the house is theirs, and how to become a citizen
const invited = [(u, n) => `@${u} נבנה לך בית! מספר ${n} 🏠 רוצים גם אזרחות? 👑 עקבו אחרי @sapirkingdom וכתבו לי "בית" בפרטי (שלחתי לך הודעה, בדקו גם בבקשות ההודעות)`,
  (u, n) => `@${u} ברוכים הבאים לממלכה! הבית שלך, מספר ${n}, כבר עומד 🏡 לאזרחות מלאה: עוקבים אחרי @sapirkingdom וכותבים לי "בית" בהודעה הפרטית 📩`,
  (u, n) => `@${u} תושב חדש בבית מספר ${n}! 🏰 הקישור בביו. רוצים להיות אזרחים? עקבו וענו לי "בית" בפרטי 👑`];
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
    const fresh = await env.DB.prepare('INSERT OR IGNORE INTO comments (id, media, u, text, at, uid) VALUES (?, ?, ?, ?, ?, ?)').bind(c.id, c.media ?? null, u, c.text ?? '', Date.now(), c.uid ?? null).run();
    if (!fresh.meta.changes) continue;
    if (await env.DB.prepare('SELECT n FROM residents WHERE u = ?').bind(u).first('n')) { await env.DB.prepare('UPDATE comments SET house = 3 WHERE id = ?').bind(c.id).run(); continue; }   // a resident: an answer to what they wrote
    await env.DB.prepare('UPDATE comments SET house = 0 WHERE id = ?').bind(c.id).run(); out.push({ id: c.id, u });
  }
  return out;
}

/** someone wrote to the kingdom in private: if they follow, they become a citizen (the house is built and they get its
 *  number); if not, they are asked to follow. Used by the sync (reading the chats) and by the webhook. */
export async function fromDM(env, sender, text = '', { shared = false } = {}, site = env.SITE_URL ?? 'https://sapir-kingdom.pages.dev') {
  const who = await fetch(`${G}/${sender}?fields=username,is_user_follow_business&access_token=${await igToken(env)}`).then(r => r.json()).catch(() => ({}));
  if (!who.username) return null;
  const u = who.username.toLowerCase(); if (u === SELF(env)) return null;
  const once = async (k, ms) => { const at = +(await getState(env, k) ?? 0); if (Date.now() - at < ms) return false; await setState(env, k, Date.now()); return true; };
  const tell = t => dmTo(env, { id: sender }, t), link = `${site}/?u=${u}`;
  const HELP = `\nשתפו את הריל לסטורי ותייגו @${SELF(env)}, והבית שלכם יוזהב ✨\nרוצים בית אחר מהקטלוג? כתבו לי "בית 1" עד "בית ${COMMON.length}" (הקטלוג בלשכת המידע באתר).\nרוצים לגור עם חבר? כתבו "גר עם @השם_שלו", והבית שלכם גדל 🏡`;
  const style = String(text).match(/בית\s*(?:מספר\s*)?(\d{1,2})(?!\d)/), mate = String(text).match(/(?:גר|גרה|לגור|גרים)\s+(?:יחד\s+)?עם\s+@?([A-Za-z0-9._]{1,30})/);
  let me = await env.DB.prepare('SELECT n, u, plot, host, home, citizen, gold FROM residents WHERE u = ?').bind(u).first(), fresh = false, made = false;
  const follows = !!who.is_user_follow_business;
  if (!me) { me = await addResident(env, who.username, follows ? 'follow' : 'dm'); fresh = true;
    // a welcome under one comment of theirs (the first); their other comments are simply kept
    await env.DB.batch([env.DB.prepare('UPDATE comments SET house = 1 WHERE id = (SELECT id FROM comments WHERE u = ? AND house = 0 ORDER BY at LIMIT 1)').bind(u),
      env.DB.prepare('UPDATE comments SET house = 3 WHERE u = ? AND house = 0').bind(u)]); }
  // shared the reel to their story and tagged the kingdom: the house turns gold (follower or not), and a thank you
  if (shared) {
    if (!me.gold) await env.DB.prepare('UPDATE residents SET gold = 1, changed = ? WHERE u = ?').bind(Date.now(), u).run();
    if (!me.gold || await once(`dmgold:${u}`, 864e5)) await tell(`${me.gold ? 'שוב שיתפתם? המלך מתרגש 🥹 ' : ''}תודה ששיתפתם את הממלכה! ✨\nהבית שלכם, מספר ${me.n.toLocaleString('he-IL')}, הוזהב: עכשיו הוא הכי נוצץ ברחוב 🏆\n${link}`);
    me.gold = 1; if (!follows) return { u, gold: true };
  }
  if (follows && !me.citizen) { await env.DB.prepare('UPDATE residents SET citizen = 1, changed = ? WHERE u = ?').bind(Date.now(), u).run(); me.citizen = 1; made = true; }
  if (!follows) {                                                   // a house, but not yet a citizen
    if (fresh || style || mate || await once(`dmnofollow:${u}`, 5 * 60e3))
      await tell(`${fresh ? `בניתי לך בית בממלכה, מספר ${me.n.toLocaleString('he-IL')} 🏠 ${link}\n` : ''}כדי לקבל אזרחות${style || mate ? ' (ואיתה לבחור בית ולגור עם חברים)' : ''} צריך לעקוב אחרי @${SELF(env)} 🙂\nעקבו, וכתבו לי כאן שוב "בית" 👑`);
    return fresh ? { u, n: me.n } : { u, follows: false };
  }
  const n = me.n.toLocaleString('he-IL'), notes = [];
  if (mate) {                                                       // moving in with a friend: the friend's house grows
    const f = await env.DB.prepare('SELECT u, plot, host FROM residents WHERE u = ?').bind(mate[1].toLowerCase().replace(/^@+/, '')).first();
    const guests = await env.DB.prepare('SELECT COUNT(*) AS c FROM residents WHERE host = ?').bind(u).first('c');
    if (!f) notes.push(`@${mate[1]} עוד לא תושב בממלכה. שיגיב על הריל האחרון ויקבל בית, ואז כתבו לי שוב 🙂`);
    else if (f.u === u) notes.push('אתם כבר גרים אצל עצמכם 😄');
    else if (guests) notes.push(`כבר גרים אצלכם חברים, אז הבית שלכם נשאר במקום. החבר יכול לבוא לגור אצלכם: שיכתוב לי "גר עם @${u}"`);
    else { const host = f.host ?? f.u; await env.DB.prepare('UPDATE residents SET plot = ?, host = ?, changed = ? WHERE u = ?').bind(f.plot, host, Date.now(), u).run(); me.host = host;
      notes.push(`עברתם לגור עם @${f.u}! 🏡 הבית שלכם גדל, תראו באתר: ${site}/?u=${f.u}`); }
  }
  if (style) {                                                      // a house from the catalogue (numbered from 1)
    const kind = +style[1] - 1, h = HOMES[kind];
    if (!h) notes.push(`בקטלוג יש בתים 1 עד ${HOMES.length}. בחרו מספר מהם 🙂`);
    else if (me.host) notes.push('בבית משותף, מי שהזמין בוחר את סוג הבית 🙂');
    else if (h.rare && !((await fetch(`${site}/data/honours.json`).then(r => r.json()).catch(() => ({}))).given?.key ?? []).includes(u)) notes.push(`"${h.name}" הוא בית נדיר 🔑 הוא פתוח רק למי שזכה במפתח הזהב בהגרלה היומית.`);
    else { await env.DB.prepare('UPDATE residents SET home = ?, changed = ? WHERE u = ?').bind(kind, Date.now(), u).run(); notes.push(`מעולה! הבית שלכם עכשיו "${h.name}" 🏡 ${link}`); }
  }
  if (fresh || made) await tell(`${fresh ? 'ברוכים הבאים לממלכה של משפחת ספיר! 🎉\n' : ''}קיבלתם אזרחות 👑 ${fresh ? 'והבית שלכם' : 'הבית שלכם'}, מספר ${n}, ${fresh ? 'כבר עומד' : 'מחכה לכם'}:\n${link}${notes.length ? '\n\n' + notes.join('\n') : HELP}\nמה בונים מחר? תגיבו על הריל האחרון, התגובה עם הכי הרבה לייקים נבנית`);
  else if (notes.length) await tell(notes.join('\n'));
  else if (await once(`dmhome:${u}`, 864e5)) await tell(`אתם כבר תושבים בממלכה 👑 בית מספר ${n}: ${link}${HELP}`);
  return fresh || made ? { u, n: me.n } : { u, home: me.n };
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
    const read = (m, d) => comments.push(...(d.data ?? []).map(c => ({ id: c.id, u: c.username ?? c.from?.username, uid: c.from?.id, text: c.text, media: m })).filter(c => c.u));
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
    let invites = 0, replied = 0; const citizens = [];
    // 1. every new commenter gets a house at once (one a person); a follower we can already see becomes a citizen, the
    //    others get a private message about citizenship. The word under the comment goes out in step 3.
    const { results: fresh } = await env.DB.prepare('SELECT c.id, c.u, c.uid, c.dm FROM comments c WHERE c.house = 0 ORDER BY c.at LIMIT ?').bind(replies * 3).all();
    const name = u => u.replace(/[._\d]+$/, '').replace(/[._]/g, ' ') || u, once = new Set();
    for (const c of fresh) {
      if (once.has(c.u)) { await env.DB.prepare('UPDATE comments SET house = 3 WHERE id = ?').bind(c.id).run(); continue; }
      once.add(c.u); if (once.size > replies) break;
      const h = await addResident(env, c.u, 'comment'); if (!h) { await env.DB.prepare('UPDATE comments SET house = 2 WHERE id = ?').bind(c.id).run(); continue; }
      await env.DB.batch([env.DB.prepare('UPDATE comments SET house = 1 WHERE id = ?').bind(c.id), env.DB.prepare('UPDATE comments SET house = 3 WHERE u = ? AND house = 0').bind(c.u)]);
      const who = c.uid ? await fetch(`${G}/${c.uid}?fields=username,is_user_follow_business&access_token=${token}`).then(r => r.json()).catch(() => ({})) : {};
      if (who.username && who.is_user_follow_business) { await env.DB.prepare('UPDATE residents SET citizen = 1, changed = ? WHERE u = ?').bind(Date.now(), h.u).run(); citizens.push(h.u); continue; }
      if (c.dm === 1) continue;                                      // told about citizenship before (an earlier rule)
      const r = await dmTo(env, { comment_id: c.id }, `היי ${name(c.u)}! 👑 כאן המלך מיכאל מהממלכה של משפחת ספיר.\nבניתי לך בית בממלכה, מספר ${h.n.toLocaleString('he-IL')}: ${env.SITE_URL ?? 'https://sapir-kingdom.pages.dev'}/?u=${h.u}\nרוצים גם אזרחות? (סימן אזרח בתעודה, השתתפות בהגרלת מפתח הזהב, ובחירת בית מהקטלוג)\nעקבו אחרי @${SELF(env)} וכתבו לי כאן "בית" 🏰`);
      await env.DB.prepare('UPDATE comments SET dm = ? WHERE id = ?').bind(r.error ? -1 : 1, c.id).run(); if (!r.error) invites++;
    }
    // 2. the private chats: whoever wrote since the last look (each message once)
    const conv = await get(`${G}/${user}/conversations?platform=instagram&fields=messages.limit(4){id,from,created_time,message,story,attachments}&limit=25&access_token=${token}`).catch(() => ({ data: [] }));
    const since = +(await getState(env, 'dm_since') ?? (now - 36e5)); let newest = since, handled = 0;
    for (const cv of conv.data ?? []) for (const m of cv.messages?.data ?? []) {
      const at = Date.parse(m.created_time); if (!m.from?.id || m.from.id === user || m.from.username?.toLowerCase() === SELF(env) || at <= since - 120e3) continue;
      if (handled >= replies) break;                               // a few people each round; the rest next time
      if (!(await env.DB.prepare("INSERT OR IGNORE INTO state (k, v) VALUES (?, ?)").bind(`msg:${m.id}`, String(at)).run()).meta.changes) continue;
      newest = Math.max(newest, at); handled++; const shared = !!(m.story?.mention || (m.attachments?.data ?? []).some(a => /story/i.test(a.type ?? '') || a.story_mention)); const r = await fromDM(env, m.from.id, m.message ?? '', { shared }); if (r?.n) citizens.push(r.u);
    }
    if (newest > since) await setState(env, 'dm_since', newest);
    // 3. a welcome under the comments of new citizens, a few each round
    const { results: queue } = await env.DB.prepare('SELECT c.id, c.u, c.text, c.house, r.n, r.citizen FROM comments c JOIN residents r ON r.u = c.u WHERE (c.replied IS NULL OR c.replied = 2 OR c.replied BETWEEN -2 AND -1) AND c.house IN (1, 3) ORDER BY c.at LIMIT ?').bind(replies).all();
    for (const a of queue) {
      if (SOLDIER.test(a.text ?? '') && !BAD.test(a.text ?? '')) await env.DB.prepare('UPDATE residents SET home = ?, changed = ? WHERE u = ? AND COALESCE(home, -1) NOT IN (8, ?)').bind(SOLDIER_HOME, Date.now(), a.u, SOLDIER_HOME).run();   // "חייל": moves into the מגורים צבאיים (the villa stays)
      let team = null; const key = !BAD.test(a.text ?? '') && teamOf(a.text);   // "מכבי ספיר" / "הפועל ספיר": into the squad while there is room
      if (key) { const me = await env.DB.prepare('SELECT team, shirt FROM residents WHERE u = ?').bind(a.u).first();
        if (me?.team) team = { key: me.team, shirt: me.shirt };
        else { const c = await env.DB.prepare('SELECT COUNT(*) AS c FROM residents WHERE team = ?').bind(key).first('c');
          if (c < SQUAD) { await env.DB.prepare('UPDATE residents SET team = ?, shirt = ?, changed = ? WHERE u = ? AND team IS NULL').bind(key, c + 1, Date.now(), a.u).run(); team = { key, shirt: c + 1 }; } else team = { key, full: true }; } }
      const r = await post(env, `${a.id}/replies`, { message: reply(a, { fresh: a.house === 1, n: a.n, citizen: !!a.citizen, team }) });   // the king answers what they wrote
      await env.DB.prepare('UPDATE comments SET replied = CASE WHEN ? THEN (CASE WHEN replied > 0 THEN 0 ELSE COALESCE(replied, 0) END) - 1 ELSE 1 END WHERE id = ?').bind(r.error ? 1 : 0, a.id).run(); if (!r.error) replied++;   // a failed answer is tried again
    }
    return { ran: true, read: comments.length, waiting: waiting.map(w => w.u), invites, citizens, replied };
  } catch (e) {
    if ([4, 17, 32, 613].includes(e.code)) await setState(env, 'sync_backoff', now + BACKOFF);   // Instagram's rate limits
    return { ran: true, error: e.message };
  }
}

/** the day's stories (site/stories/plan.json: [{ id, at, image, after? }]): each goes up once, when its time comes;
 *  "after": "reel:N" waits until day N's reel is posted. Called by the clock every minute. */
export async function stories(env, site) {
  const now = Date.now(), plan = await fetch(`${site}/stories/plan.json`, { cf: { cacheTtl: 60 } }).then(r => r.ok ? r.json() : []).catch(() => []);
  for (const st of plan) {
    const at = Date.parse(st.at); if (!(at <= now) || now - at > 6 * 36e5) continue;          // due, and not stale
    if (await getState(env, `story:${st.id}`)) continue;
    if (st.after?.startsWith('reel:')) { const k = await fetch(`${site}/data/kingdom.json`).then(r => r.json()).catch(() => ({})); if (!k.reels?.[st.after.slice(5)]) continue; }
    if (!(await env.DB.prepare("INSERT OR IGNORE INTO state (k, v) VALUES (?, 'posting')").bind(`story:${st.id}`).run()).meta.changes) continue;
    const c = await post(env, `${env.IG_USER_ID}/media`, { media_type: 'STORIES', image_url: `${site}/${st.image}` });
    let ok = false;
    if (c.id) for (let i = 0; i < 6 && !ok; i++) { const p = await post(env, `${env.IG_USER_ID}/media_publish`, { creation_id: c.id }); if (p.id) { ok = true; await setState(env, `story:${st.id}`, p.id); } else await new Promise(r => setTimeout(r, 3000)); }
    if (!ok) { const tries = +(await getState(env, `storytry:${st.id}`) ?? 0) + 1; await setState(env, `storytry:${st.id}`, tries);
      if (tries < 5) await env.DB.prepare('DELETE FROM state WHERE k = ?').bind(`story:${st.id}`).run(); else await setState(env, `story:${st.id}`, `failed: ${JSON.stringify(c.error ?? {}).slice(0, 200)}`); }   // try again next minute, five times
    return;                                                                                       // one a minute
  }
}
