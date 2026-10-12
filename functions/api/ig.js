// /api/ig: the Instagram webhook (Meta app → Webhooks → Instagram: messages, comments).
//   GET  the subscription handshake (IG_VERIFY_TOKEN)
//   POST events, signed with the app secret (META_APP_SECRET). A DM holding a code from /api/verify builds the sender's house
//        if they follow the kingdom, and answers them; a comment on a reel builds the commenter's house and is kept for the
//        daily count of likes (the likes themselves are read later, tools/ingest.mjs).
import { addResident } from '../_lib.js';
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
const say = (env, to, text) => fetch(`${GRAPH}/${env.IG_USER_ID}/messages`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${env.IG_TOKEN}` }, body: JSON.stringify({ recipient: { id: to }, message: { text } }) });

export async function onRequestPost({ request, env, waitUntil }) {
  const body = await request.text();
  if (!await signed(request, env, body)) return new Response('bad signature', { status: 401 });
  const data = JSON.parse(body), site = env.SITE_URL ?? '';
  for (const entry of data.entry ?? []) {
    for (const m of entry.messaging ?? []) {
      const text = m.message?.text ?? '', code = text.toUpperCase().match(/SAPIR-\d{6}/)?.[0], from = m.sender?.id;
      if (!code || !from || m.message?.is_echo) continue;
      const row = await env.DB.prepare('SELECT device, at, u FROM codes WHERE code = ?').bind(code).first();
      if (!row || Date.now() - row.at > 20 * 60e3) { waitUntil(say(env, from, 'הקוד הזה לא מוכר או שפג תוקפו. בקשו קוד חדש באתר.')); continue; }
      const who = await fetch(`${GRAPH}/${from}?fields=username,is_user_follow_business&access_token=${env.IG_TOKEN}`).then(r => r.json());
      if (!who.username) continue;
      if (!who.is_user_follow_business) { waitUntil(say(env, from, 'כמעט! בית מקבלים רק עוקבים. עקבו אחרי הממלכה ושלחו את הקוד שוב.')); continue; }
      const r = await addResident(env, who.username, 'dm');
      await env.DB.batch([env.DB.prepare('UPDATE codes SET u = ? WHERE code = ?').bind(r.u, code), env.DB.prepare('INSERT INTO devices (device, u, at) VALUES (?, ?, ?) ON CONFLICT(device) DO UPDATE SET u = excluded.u, at = excluded.at').bind(row.device, r.u, Date.now())]);
      waitUntil(say(env, from, `ברוכים הבאים לממלכה של משפחת ספיר! הבית שלכם, מספר ${r.n.toLocaleString('he-IL')}, כבר עומד: ${site}/?u=${r.u}`));
    }
    for (const ch of entry.changes ?? []) {
      if (ch.field !== 'comments' || !ch.value?.from?.username) continue;
      const v = ch.value; if (v.from.id === env.IG_USER_ID) continue;           // our own replies
      await env.DB.prepare('INSERT OR IGNORE INTO comments (id, media, u, text, at) VALUES (?, ?, ?, ?, ?)').bind(v.id, v.media?.id ?? null, v.from.username.toLowerCase(), v.text ?? '', Date.now()).run();
      await addResident(env, v.from.username, 'comment');
    }
  }
  return new Response('ok');
}
