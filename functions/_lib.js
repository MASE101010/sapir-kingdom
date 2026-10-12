// Shared by the API: the database (env.DB, Cloudflare D1), adding a resident, and JSON replies.
import { fingerprint, normalize, valid } from '../site/app/residents.js';
export const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
export const cookie = (req, name) => (req.headers.get('cookie') ?? '').split(/;\s*/).map(c => c.split('=')).find(([k]) => k === name)?.[1];
export async function today(env) { return +(await env.DB.prepare("SELECT v FROM state WHERE k = 'day'").first('v') ?? 1); }
/** adds a resident if new; returns their row (n = house number, plot = n - 1) */
export async function addResident(env, name, src) {
  const u = normalize(name); if (!valid(u)) return null;
  const day = await today(env);
  await env.DB.prepare('INSERT OR IGNORE INTO residents (u, h, day, src, at) VALUES (?, ?, ?, ?, ?)').bind(u, fingerprint(u), day, src, Date.now()).run();
  return env.DB.prepare('SELECT n, u, h, day, src FROM residents WHERE u = ?').bind(u).first();
}
export const row = r => ({ u: r.u, h: r.h, plot: r.n - 1, day: r.day, src: r.src });
