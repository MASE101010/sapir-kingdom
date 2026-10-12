// GET /api/export: everything, for the daily run (GitHub Actions, tools/ingest.mjs). Needs the EXPORT_TOKEN secret.
// POST /api/export {day}: the daily run moves the kingdom to a new day.
import { json, row } from '../_lib.js';
const allowed = (request, env) => env.EXPORT_TOKEN && request.headers.get('authorization') === `Bearer ${env.EXPORT_TOKEN}`;
export async function onRequestGet({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const since = +new URL(request.url).searchParams.get('comments_since') || 0;
  const [res, com] = await Promise.all([env.DB.prepare('SELECT n, u, h, day, src FROM residents ORDER BY n').all(), env.DB.prepare('SELECT id, media, u, text, at FROM comments WHERE at > ? ORDER BY at').bind(since).all()]);
  return json({ residents: res.results.map(row), comments: com.results });
}
export async function onRequestPost({ request, env }) {
  if (!allowed(request, env)) return json({ error: 'unauthorized' }, 401);
  const { day } = await request.json(); if (!Number.isInteger(day)) return json({ error: 'day' }, 400);
  await env.DB.prepare("INSERT INTO state (k, v) VALUES ('day', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(day)).run();
  return json({ day });
}
