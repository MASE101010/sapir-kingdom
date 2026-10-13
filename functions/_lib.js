// Shared by the API: the database (env.DB, Cloudflare D1), adding a resident, and JSON replies.
import { fingerprint, normalize, valid } from '../site/app/residents.js';
export const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
export const cookie = (req, name) => (req.headers.get('cookie') ?? '').split(/;\s*/).map(c => c.split('=')).find(([k]) => k === name)?.[1];
export async function today(env) { return +(await env.DB.prepare("SELECT v FROM state WHERE k = 'day'").first('v') ?? 1); }
/** adds a resident if new; returns their row (n = house number). With a host who lives here, they move into the host's house. */
export async function addResident(env, name, src, hostName = null) {
  const u = normalize(name); if (!valid(u)) return null;
  const day = await today(env), host = hostName ? await env.DB.prepare('SELECT u, plot FROM residents WHERE u = ?').bind(normalize(hostName)).first() : null;
  if (host && host.u !== u)
    await env.DB.prepare('INSERT OR IGNORE INTO residents (u, h, day, src, at, plot, host) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(u, fingerprint(u), day, src, Date.now(), host.plot, host.u).run();
  else
    await env.DB.prepare('INSERT OR IGNORE INTO residents (u, h, day, src, at, plot) SELECT ?, ?, ?, ?, ?, COALESCE(MAX(plot), -1) + 1 FROM residents').bind(u, fingerprint(u), day, src, Date.now()).run();
  return env.DB.prepare('SELECT n, u, h, day, src, plot, host, home FROM residents WHERE u = ?').bind(u).first();
}
export const row = r => Object.fromEntries(Object.entries({ u: r.u, h: r.h, plot: r.plot ?? r.n - 1, day: r.day, src: r.src, host: r.host ?? undefined, home: r.home ?? undefined }).filter(([, v]) => v !== undefined && v !== null));
export const COLS = 'n, u, h, day, src, plot, host, home';
/** the Instagram token: the fresh one kept in the database (token.yml), or the one set at the start */
export async function igToken(env) { return (await env.DB.prepare("SELECT v FROM state WHERE k = 'ig_token'").first('v')) ?? env.IG_TOKEN; }
/** who this device is (after a DM code came back) */
export async function whoIs(env, request) { const d = cookie(request, 'dev'); return d ? env.DB.prepare('SELECT u FROM devices WHERE device = ?').bind(d).first('u') : null; }
