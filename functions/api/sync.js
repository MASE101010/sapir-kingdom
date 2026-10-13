// /api/sync?u=name: looks at the newest comments on Instagram right now, and says whether name has a house.
// The site calls it when a search finds nobody yet; GitHub (poll.yml) calls it with the export token every few minutes.
import { json, COLS, row } from '../_lib.js';
import { sync } from '../_sync.js';
import { normalize } from '../../site/app/residents.js';
export async function onRequest({ request, env }) {
  const auth = env.EXPORT_TOKEN && request.headers.get('authorization') === `Bearer ${env.EXPORT_TOKEN}`;
  const u = normalize(new URL(request.url).searchParams.get('u') ?? '');
  const find = () => u ? env.DB.prepare(`SELECT ${COLS} FROM residents WHERE u = ?`).bind(u).first() : null;
  if (auth && new URL(request.url).searchParams.has('debug')) {     // what Instagram itself answers (no token in it)
    const { igToken } = await import('../_lib.js'), t = await igToken(env), G = 'https://graph.instagram.com/v21.0';
    const media = await fetch(`${G}/${env.IG_USER_ID ?? 'me'}/media?fields=id,timestamp,comments_count,media_type&limit=3&access_token=${t}`).then(r => r.json());
    const first = media.data?.[0]?.id, comments = first ? await fetch(`${G}/${first}/comments?fields=id,text,username,from,timestamp&limit=10&access_token=${t}`).then(r => r.json()) : null;
    const fid = comments?.data?.find(c => c.from?.username && c.from.username !== 'sapirkingdom')?.from?.id;
    const follow = fid ? await fetch(`${G}/${fid}?fields=username,is_user_follow_business,is_business_follow_user,follower_count&access_token=${t}`).then(r => r.json()) : null;
    const conv = await fetch(`${G}/${env.IG_USER_ID}/conversations?platform=instagram&fields=participants,messages.limit(3){message,from,created_time}&limit=5&access_token=${t}`).then(r => r.json());
    const dm = new URL(request.url).searchParams.get('dmtest'), dmr = dm ? await fetch(`${G}/${env.IG_USER_ID}/messages`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${t}` }, body: JSON.stringify({ recipient: { comment_id: dm }, message: { text: 'היי! 👑 כאן הממלכה של משפחת ספיר. זו בדיקה של ההודעה שתקבלו אחרי תגובה. ענו לי כאן "בית" כדי לבדוק את ההמשך 🏰' } }) }).then(r => r.json()) : null;
    const state = (await env.DB.prepare("SELECT k, v FROM state WHERE k LIKE 'sync%'").all()).results;
    return json({ user: env.IG_USER_ID ?? null, follow, conv, dmr, media, comments, state });
  }
  let r = await find();
  const out = r ? { ran: false } : await sync(env, { force: auth, replies: auth ? 15 : 6 });
  if (!r) r = await find();
  const pending = !r && u ? !!(await env.DB.prepare('SELECT 1 FROM comments WHERE u = ? AND house = 0').bind(u).first()) : false;
  return json({ ...(auth ? out : { ran: out.ran, wait: out.wait }), resident: r ? { ...row(r), n: r.n } : null, pending });
}
