// GET /api/votes: the royal elections' count right now (day 11), citizens' votes by candidate (a follower's comment with a name; Michael: only followers count). While anyone watches the
// count, it also reads new Instagram comments (at most every 30 s), so a vote shows within a minute of the comment.
import { json } from '../_lib.js';
import { sync } from '../_sync.js';
export async function onRequestGet({ env, waitUntil }) {
  waitUntil(sync(env, { replies: 6, gap: 30000 }).catch(() => {}));
  const { results } = await env.DB.prepare('SELECT vote, COUNT(*) AS c FROM residents WHERE vote IS NOT NULL AND citizen = 1 GROUP BY vote').all().catch(() => ({ results: [] }));
  return json({ votes: Object.fromEntries(results.map(r => [r.vote, r.c])), at: Date.now() }, 200, { 'cache-control': 'public, max-age=15' });
}
