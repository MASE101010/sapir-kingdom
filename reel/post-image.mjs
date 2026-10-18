// Posts a picture to the kingdom's feed (the new residents of the day), tagging them so each gets a notification.
// The picture is site/posts/dayN.jpg on the deployed site; the caption and the handles to tag are in site/episodes/dayN.json
// ("caption", "tags", at most 20). If Instagram refuses the tags, it posts the picture without them.
// env: IG_TOKEN, IG_USER_ID, SITE_URL   node reel/post-image.mjs --day 602
import { readFileSync } from 'node:fs';
process.on('unhandledRejection', e => { console.log(`::error title=post::${String(e?.message ?? e).slice(0, 600)}`); process.exit(1); });
const day = +process.argv[process.argv.indexOf('--day') + 1], { IG_TOKEN, IG_USER_ID, SITE_URL } = process.env, G = 'https://graph.instagram.com/v21.0';
const ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8')), wait = s => new Promise(r => setTimeout(r, s * 1000));
const post = async (path, params) => { const r = await fetch(`${G}/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${IG_TOKEN}` }, body: JSON.stringify(params) }).then(r => r.json()); if (r.error) throw new Error(`${path}: ${r.error.message}`); return r; };
const image_url = `${SITE_URL}/posts/day${day}.jpg?v=${Date.now()}`, tags = (ep.tags ?? []).slice(0, 20);
// the tags sit on the picture in a grid, one per person
const user_tags = tags.map((username, i) => ({ username, x: +(.2 + (i % 3) * .3).toFixed(2), y: +(.15 + Math.floor(i / 3) * .1).toFixed(2) }));
let container;
try { ({ id: container } = await post(`${IG_USER_ID}/media`, { image_url, caption: ep.caption, ...(user_tags.length ? { user_tags } : {}) })); console.log(`::notice title=post::tagged ${user_tags.length}`); }
catch (e) {   // one bad handle refuses them all: try each alone (an unpublished container costs nothing), keep the good ones
  console.log(`::warning title=tags::tags refused (${e.message.slice(0, 200)}), checking them one by one`);
  const good = []; for (const t of user_tags) { try { await post(`${IG_USER_ID}/media`, { image_url, user_tags: [t] }); good.push(t); } catch { console.log(`::notice title=tags::@${t.username} cannot be tagged`); } }
  ({ id: container } = await post(`${IG_USER_ID}/media`, { image_url, caption: ep.caption, ...(good.length ? { user_tags: good } : {}) })); console.log(`::notice title=post::tagged ${good.length} of ${user_tags.length}`); }
for (let i = 0; ; i++) { const s = await fetch(`${G}/${container}?fields=status_code&access_token=${IG_TOKEN}`).then(r => r.json()); if (s.status_code === 'FINISHED') break; if (s.status_code === 'ERROR' || i > 20) throw new Error(`container: ${JSON.stringify(s)}`); await wait(5); }
const { id } = await post(`${IG_USER_ID}/media_publish`, { creation_id: container });
if (ep.firstComment) await post(`${id}/comments`, { message: ep.firstComment }).catch(() => {});
console.log(`::notice title=post::published ${id}`);
