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
    const likes = []; if (new URL(request.url).searchParams.has('likes')) for (const m of media.data ?? []) { let url = `${G}/${m.id}/comments?fields=id,text,like_count,from&limit=50&access_token=${t}`;
      for (let i = 0; url && i < 10; i++) { const d = await fetch(url).then(r => r.json()); likes.push(...(d.data ?? []).map(c => [c.like_count ?? 0, c.from?.username, c.text])); url = d.paging?.next; } }
    likes.sort((a, b) => b[0] - a[0]);
    const insights = new URL(request.url).searchParams.has('insights') ? {
      me: await fetch(`${G}/${env.IG_USER_ID}?fields=username,followers_count,follows_count,media_count&access_token=${t}`).then(r => r.json()),
      day: await fetch(`${G}/${env.IG_USER_ID}/insights?metric=reach,follower_count,profile_views,accounts_engaged,total_interactions,website_clicks&period=day&metric_type=total_value&access_token=${t}`).then(r => r.json()),
      reels: await Promise.all((media.data ?? []).map(async m => ({ id: m.id, at: m.timestamp, comments: m.comments_count, ins: await fetch(`${G}/${m.id}/insights?metric=reach,views,likes,comments,shares,saved,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time&access_token=${t}`).then(r => r.json()) }))),
    } : null;
    const state = (await env.DB.prepare("SELECT k, v FROM state WHERE k LIKE 'sync%' OR k = 'clock_at' OR k = 'dm_since'").all()).results;
    return json({ user: env.IG_USER_ID ?? null, insights, likes: likes.slice(0, 60), follow, conv, dmr, media, comments, state });
  }
  if (new URL(request.url).searchParams.has('tick')) await env.DB.prepare("INSERT INTO state (k, v) VALUES ('clock_at', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(Date.now())).run();   // the clock was here
  let r = await find();
  const out = r ? { ran: false } : await sync(env, { force: auth, replies: auth ? 15 : 6 });
  if (!r) r = await find();
  const pending = !r && u ? !!(await env.DB.prepare('SELECT 1 FROM comments WHERE u = ? AND house = 0').bind(u).first()) : false;
  return json({ ...(auth ? out : { ran: out.ran, wait: out.wait }), resident: r ? { ...row(r), n: r.n } : null, pending });
}
