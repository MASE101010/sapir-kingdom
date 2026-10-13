// /api/ig: the Instagram webhook (Meta app → Webhooks → Instagram: messages, comments).
//   GET  the subscription handshake (IG_VERIFY_TOKEN)
//   POST events, signed with the app secret (META_APP_SECRET). A DM holding a code from /api/verify builds the sender's house
//        if they follow the kingdom; any other DM makes a follower a citizen (functions/_sync.js fromDM); a comment is kept
//        for the daily count of likes, and its writer is invited by DM to follow (the sync sends it).
import { addResident, igToken } from '../_lib.js';
import { takeComments, fromDM } from '../_sync.js';
const GRAPH = 'https://graph.instagram.com/v21.0';

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams;
  return q.get('hub.mode') === 'subscribe' && q.get('hub.verify_token') === env.IG_VERIFY_TOKEN ? new Response(q.get('hub.challenge')) : new Response('no', { status: 403 });
}
async function signed(request, env, body) {
  const sig = request.headers.get('x-hub-signature-256') ?? '', key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.META_APP_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = [...new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)))].map(b => b.toString(16).padStart(2, '0')).join('');
  return sig === `sha256=${mac}`;
}
const say = async (env, to, text) => fetch(`${GRAPH}/${env.IG_USER_ID}/messages`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${await igToken(env)}` }, body: JSON.stringify({ recipient: { id: to }, message: { text } }) });

export async function onRequestPost({ request, env, waitUntil }) {
  const body = await request.text();
  if (!await signed(request, env, body)) return new Response('bad signature', { status: 401 });
  const data = JSON.parse(body), site = env.SITE_URL ?? '';
  for (const entry of data.entry ?? []) {
    for (const m of entry.messaging ?? []) {
      const text = m.message?.text ?? '', code = text.toUpperCase().match(/SAPIR-\d{6}/)?.[0], from = m.sender?.id;
      if (!from || m.message?.is_echo || from === env.IG_USER_ID) continue;
      if (!code) {                                   // any other message: a follower becomes a citizen, others are asked to follow
        if (m.message?.mid && !(await env.DB.prepare('INSERT OR IGNORE INTO state (k, v) VALUES (?, ?)').bind(`msg:${m.message.mid}`, String(Date.now())).run()).meta.changes) continue;
        waitUntil(fromDM(env, from)); continue;
      }
      const row = await env.DB.prepare('SELECT device, at, u, host FROM codes WHERE code = ?').bind(code).first();
      if (!row || Date.now() - row.at > 20 * 60e3) { waitUntil(say(env, from, 'הקוד הזה לא מוכר או שפג תוקפו. בקשו קוד חדש באתר.')); continue; }
      const who = await fetch(`${GRAPH}/${from}?fields=username,is_user_follow_business&access_token=${await igToken(env)}`).then(r => r.json());
      if (!who.username) continue;
      if (!who.is_user_follow_business) { waitUntil(say(env, from, 'כמעט! בית מקבלים רק עוקבים. עקבו אחרי הממלכה ושלחו את הקוד שוב.')); continue; }
      const r = await addResident(env, who.username, 'dm', row.host);
      await env.DB.batch([env.DB.prepare('UPDATE codes SET u = ? WHERE code = ?').bind(r.u, code), env.DB.prepare('INSERT INTO devices (device, u, at) VALUES (?, ?, ?) ON CONFLICT(device) DO UPDATE SET u = excluded.u, at = excluded.at').bind(row.device, r.u, Date.now())]);
      waitUntil(say(env, from, `ברוכים הבאים לממלכה של משפחת ספיר! הבית שלכם, מספר ${r.n.toLocaleString('he-IL')}, כבר עומד: ${site}/?u=${r.u}`));
    }
    for (const ch of entry.changes ?? []) {          // a comment: kept, and the commenter waits for the follow (the sync writes to them)
      if (ch.field !== 'comments' || !ch.value?.from?.username || ch.value.from.id === env.IG_USER_ID || ch.value.parent_id) continue;
      await takeComments(env, [{ id: ch.value.id, u: ch.value.from.username, text: ch.value.text, media: ch.value.media?.id }]);
    }
  }
  return new Response('ok');
}
