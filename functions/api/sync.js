// /api/sync?u=name: looks at the newest comments on Instagram right now, and says whether name has a house.
// The site calls it when a search finds nobody yet; GitHub (poll.yml) calls it with the export token every few minutes.
import { json, COLS, row } from '../_lib.js';
import { sync } from '../_sync.js';
import { normalize } from '../../site/app/residents.js';
export async function onRequest({ request, env }) {
  const auth = env.EXPORT_TOKEN && request.headers.get('authorization') === `Bearer ${env.EXPORT_TOKEN}`;
  const u = normalize(new URL(request.url).searchParams.get('u') ?? '');
  const find = () => u ? env.DB.prepare(`SELECT ${COLS} FROM residents WHERE u = ?`).bind(u).first() : null;
  let r = await find();
  const out = r ? { ran: false } : await sync(env, { force: auth, replies: auth ? 15 : 6 });
  if (!r) r = await find();
  return json({ ...(auth ? out : { ran: out.ran, wait: out.wait }), resident: r ? { ...row(r), n: r.n } : null });
}
