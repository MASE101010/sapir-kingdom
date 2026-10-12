// GET /api/delta?since=N: residents with house number above N, in order (the site adds them to the snapshot it loaded).
import { json, row } from '../_lib.js';
export async function onRequestGet({ request, env }) {
  const since = Math.max(0, +new URL(request.url).searchParams.get('since') || 0);
  const { results } = await env.DB.prepare('SELECT n, u, h, day, src FROM residents WHERE n > ? ORDER BY n LIMIT 5000').bind(since).all();
  return json({ residents: results.map(row) }, 200, { 'cache-control': 'public, max-age=20' });
}
