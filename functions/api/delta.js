// GET /api/delta?since=N: residents with house number above N, in order (the site adds them to the snapshot it loaded).
import { json, row, COLS } from '../_lib.js';
import { sync } from '../_sync.js';
export async function onRequestGet({ request, env, waitUntil }) {
  // while anyone watches the kingdom, it also reads new Instagram comments (at most every 30 s), after answering
  waitUntil(sync(env, { replies: 6, gap: 30000 }).catch(() => {}));
  const since = Math.max(0, +new URL(request.url).searchParams.get('since') || 0);
  const { results } = await env.DB.prepare(`SELECT ${COLS} FROM residents WHERE n > ? ORDER BY n LIMIT 5000`).bind(since).all();
  // houses changed by their residents (a style, a friend): the site redraws them
  const changed = (await env.DB.prepare(`SELECT ${COLS} FROM residents WHERE changed IS NOT NULL AND n <= ? LIMIT 3000`).bind(since).all()).results.map(r => ({ ...row(r), n: r.n }));
  // the notes on the royal wall (day 11): citizens' wishes that passed, newest first
  const wishes = (await env.DB.prepare('SELECT w.u, w.text, w.at FROM wishes w JOIN residents r ON r.u = w.u WHERE w.ok = 1 AND r.citizen = 1 ORDER BY w.at DESC LIMIT 600').all().catch(() => ({ results: [] }))).results;
  // the royal elections (day 11): citizens' votes, by candidate
  const votes = Object.fromEntries((await env.DB.prepare('SELECT vote, COUNT(*) AS c FROM residents WHERE vote IS NOT NULL AND citizen = 1 GROUP BY vote').all().catch(() => ({ results: [] }))).results.map(r => [r.vote, r.c]));
  return json({ residents: results.map(row), changed, wishes, votes }, 200, { 'cache-control': 'public, max-age=20' });
}
