// GET /api/export: everything, for the daily run (GitHub Actions, tools/ingest.mjs). Needs the EXPORT_TOKEN secret.
// POST /api/export {day}: the daily run moves the kingdom to a new day. {ig_token}: the weekly refresh keeps the new token.
import { json, row, COLS } from '../_lib.js';
import { takeComments } from '../_sync.js';
const allowed = (request, env) => env.EXPORT_TOKEN && request.headers.get('authorization') === `Bearer ${env.EXPORT_TOKEN}`;
export async function onRequestGet({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const q = new URL(request.url).searchParams, since = +q.get('comments_since') || 0;
  if (q.has('token')) return json({ ig_token: await env.DB.prepare("SELECT v FROM state WHERE k = 'ig_token'").first('v') });
  const [res, com] = await Promise.all([env.DB.prepare(`SELECT ${COLS} FROM residents ORDER BY n`).all(), env.DB.prepare('SELECT id, media, u, text, at FROM comments WHERE at > ? ORDER BY at').bind(since).all()]);
  const wishes = (await env.DB.prepare('SELECT w.id, w.u, w.text, w.at, w.ok, r.citizen FROM wishes w LEFT JOIN residents r ON r.u = w.u ORDER BY w.at').all().catch(() => ({ results: [] }))).results;
  const votes = Object.fromEntries((await env.DB.prepare('SELECT vote, COUNT(*) AS c FROM residents WHERE vote IS NOT NULL AND citizen = 1 GROUP BY vote').all().catch(() => ({ results: [] }))).results.map(r => [r.vote, r.c]));
  return json({ residents: res.results.map(row), comments: com.results, wishes, votes });
}
export async function onRequestPost({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const { day, ig_token, comments, home, wish } = await request.json();
  // the daily run looks at a waiting wish: { wish: { id, ok: 1 | -1 } }
  if (wish?.id && [1, -1].includes(wish.ok)) { await env.DB.prepare('UPDATE wishes SET ok = ? WHERE id = ?').bind(wish.ok, String(wish.id)).run(); return json({ ok: true, wish }); }
  // the daily run gives a house style (the gold key winner's villa): { home: { u, kind } }
  if (home?.u && Number.isInteger(home.kind)) { await env.DB.prepare('UPDATE residents SET home = ?, changed = ? WHERE u = ?').bind(home.kind, Date.now(), String(home.u).toLowerCase()).run(); return json({ ok: true, home }); }
  // comments read by the poller: keep each once, build the commenter's house, say which are new
  if (Array.isArray(comments)) return json({ added: await takeComments(env, comments) });
  if (ig_token) { await env.DB.prepare("INSERT INTO state (k, v) VALUES ('ig_token', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(ig_token).run(); return json({ ok: true }); }
  if (!Number.isInteger(day)) return json({ error: 'day' }, 400);
  await env.DB.prepare("INSERT INTO state (k, v) VALUES ('day', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(day)).run();
  return json({ day });
}
