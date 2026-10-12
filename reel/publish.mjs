// Posts a rendered reel to the kingdom's Instagram (Graph API: a REELS container, wait for it, publish), then writes
// its media id into site/data/kingdom.json "reels", which tomorrow's count reads the comments from.
// The video must be on a public URL when Instagram fetches it: the deployed site serves reels/dayN.mp4.
// env: IG_TOKEN, IG_USER_ID, SITE_URL   node reel/publish.mjs --day 3
import { readFileSync, writeFileSync } from 'node:fs';
const day = +process.argv[process.argv.indexOf('--day') + 1], { IG_TOKEN, IG_USER_ID, SITE_URL } = process.env, G = 'https://graph.instagram.com/v21.0';
const ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8')), wait = s => new Promise(r => setTimeout(r, s * 1000));
const post = async (path, params) => { const r = await fetch(`${G}/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${IG_TOKEN}` }, body: JSON.stringify(params) }).then(r => r.json()); if (r.error) throw new Error(`${path}: ${r.error.message}`); return r; };
const video_url = `${SITE_URL}/reels/day${day}.mp4?v=${Date.now()}`;
const { id: container } = await post(`${IG_USER_ID}/media`, { media_type: 'REELS', video_url, caption: ep.caption, share_to_feed: true });
for (let i = 0; ; i++) {
  const s = await fetch(`${G}/${container}?fields=status_code,status&access_token=${IG_TOKEN}`).then(r => r.json());
  if (s.status_code === 'FINISHED') break; if (s.status_code === 'ERROR' || i > 40) throw new Error(`container: ${JSON.stringify(s)}`); await wait(15);
}
const { id } = await post(`${IG_USER_ID}/media_publish`, { creation_id: container });
if (ep.firstComment) await post(`${id}/comments`, { message: ep.firstComment });
const k = JSON.parse(readFileSync('site/data/kingdom.json', 'utf8')); k.reels = { ...(k.reels ?? {}), [day]: id };
writeFileSync('site/data/kingdom.json', JSON.stringify(k, null, 2) + '\n');
console.log(`published day ${day}: ${id}`);
