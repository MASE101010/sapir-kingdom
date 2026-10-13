// POST /api/home {kind}: a verified resident picks their house from the catalogue (site/app/homes.js).
// The common styles are open to everyone; the rare ones only to holders of the gold key (data/honours.json).
import { json, whoIs } from '../_lib.js';
import { COMMON, HOMES } from '../../site/app/catalog.js';
export async function onRequestPost({ request, env }) {
  const u = await whoIs(env, request); if (!u) return json({ error: 'verify' }, 401);
  const { kind } = await request.json().catch(() => ({}));
  if (!Number.isInteger(kind) || kind < 0 || kind >= HOMES.length) return json({ error: 'kind' }, 400);
  if (!COMMON.includes(kind)) {
    const honours = await fetch(`${new URL(request.url).origin}/data/honours.json`).then(r => r.json()).catch(() => ({}));
    if (!honours.given?.key?.includes(u)) return json({ error: 'rare' }, 403);
  }
  const r = await env.DB.prepare('SELECT host FROM residents WHERE u = ?').bind(u).first();
  if (r?.host) return json({ error: 'shared' }, 409);          // a guest in a friend's house: the host picks
  await env.DB.prepare('UPDATE residents SET home = ? WHERE u = ?').bind(kind, u).run();
  return json({ u, home: kind });
}
