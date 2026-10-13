// GET /api/export: everything, for the daily run (GitHub Actions, tools/ingest.mjs). Needs the EXPORT_TOKEN secret.
// POST /api/export {day}: the daily run moves the kingdom to a new day. {ig_token}: the weekly refresh keeps the new token.
import { json, row, addResident } from '../_lib.js';
const allowed = (request, env) => env.EXPORT_TOKEN && request.headers.get('authorization') === `Bearer ${env.EXPORT_TOKEN}`;
export async function onRequestGet({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const q = new URL(request.url).searchParams, since = +q.get('comments_since') || 0;
  if (q.has('token')) return json({ ig_token: await env.DB.prepare("SELECT v FROM state WHERE k = 'ig_token'").first('v') });
  const [res, com] = await Promise.all([env.DB.prepare('SELECT n, u, h, day, src FROM residents ORDER BY n').all(), env.DB.prepare('SELECT id, media, u, text, at FROM comments WHERE at > ? ORDER BY at').bind(since).all()]);
  return json({ residents: res.results.map(row), comments: com.results });
}
export async function onRequestPost({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const { day, ig_token, comments } = await request.json();
  // comments read by the poller (tools/poll.mjs): keep each once, build the commenter's house, say which are new
  if (Array.isArray(comments)) {
    const out = [];
    for (const c of comments.slice(0, 500)) {
      const fresh = await env.DB.prepare('INSERT OR IGNORE INTO comments (id, media, u, text, at) VALUES (?, ?, ?, ?, ?)').bind(c.id, c.media ?? null, String(c.u).toLowerCase(), c.text ?? '', Date.now()).run();
      if (!fresh.meta.changes) continue;
      const before = await env.DB.prepare('SELECT n FROM residents WHERE u = ?').bind(String(c.u).toLowerCase()).first('n');
      const r = await addResident(env, c.u, 'comment'); if (r) out.push({ id: c.id, u: r.u, n: r.n, newHouse: !before });
    }
    return json({ added: out });
  }
  if (ig_token) { await env.DB.prepare("INSERT INTO state (k, v) VALUES ('ig_token', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(ig_token).run(); return json({ ok: true }); }
  if (!Number.isInteger(day)) return json({ error: 'day' }, 400);
  await env.DB.prepare("INSERT INTO state (k, v) VALUES ('day', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(day)).run();
  return json({ day });
}
