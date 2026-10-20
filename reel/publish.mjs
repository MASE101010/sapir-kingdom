// Posts a rendered reel to the kingdom's Instagram (Graph API: a REELS container, wait for it, publish), then writes
// its media id into site/data/kingdom.json "reels", which tomorrow's count reads the comments from.
// The video must be on a public URL when Instagram fetches it: the deployed site serves reels/dayN.mp4.
// env: IG_TOKEN, IG_USER_ID, SITE_URL   node reel/publish.mjs --day 3
import { readFileSync, writeFileSync } from 'node:fs';
process.on('unhandledRejection', e => { console.log(`::error title=publish::${String(e?.message ?? e).slice(0, 600)}`); process.exit(1); });
const day = +process.argv[process.argv.indexOf('--day') + 1], { IG_TOKEN, IG_USER_ID, SITE_URL } = process.env, G = 'https://graph.instagram.com/v21.0';
const ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8')), wait = s => new Promise(r => setTimeout(r, s * 1000));
const post = async (path, params, v) => { const r = await fetch(`${v ? G.replace('v21.0', v) : G}/${path}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${IG_TOKEN}` }, body: JSON.stringify(params) }).then(r => r.json()); if (r.error) throw new Error(`${path}: ${r.error.message}`); return r; };
const video_url = `${SITE_URL}/reels/day${day}.mp4?v=${Date.now()}`;
const base = { media_type: 'REELS', video_url, caption: ep.caption, share_to_feed: true, ...(ep.collaborators?.length ? { collaborators: ep.collaborators } : {}) };
// a trial reel (ep.trial): shown first to people who do not follow the kingdom, and shared to the followers by itself
// when it does well. Newer API only; if Instagram refuses it, the reel goes up the ordinary way.
// --record: the reel is already up but its id was lost (a failed commit): find it by its caption and only write it down
if (process.argv.includes('--record')) {
  const { data = [] } = await fetch(`${G}/${IG_USER_ID}/media?fields=id,caption,media_product_type,timestamp&limit=10&access_token=${IG_TOKEN}`).then(r => r.json());
  const m = data.find(m => (m.caption ?? '').trim() === (ep.caption ?? '').trim()); if (!m) throw new Error('no posted media has this caption');
  const k = JSON.parse(readFileSync('site/data/kingdom.json', 'utf8')); k.reels = { ...(k.reels ?? {}), [day]: m.id };
  writeFileSync('site/data/kingdom.json', JSON.stringify(k, null, 2) + '\n'); console.log(`::notice title=post::recorded day ${day}: ${m.id} (${m.timestamp})`); process.exit(0);
}
// --trial: the same reel again as a trial reel (shown to non-followers first), kept as reels["<day>t"]; never falls back to an
// ordinary post (that would be a duplicate on the profile)
const asTrial = process.argv.includes('--trial'), key = asTrial ? `${day}t` : String(day);
let container;
if (asTrial) ({ id: container } = await post(`${IG_USER_ID}/media`, { ...base, trial_params: { graduation_strategy: 'SS_PERFORMANCE' } }, 'v23.0'));
else if (ep.trial) try { ({ id: container } = await post(`${IG_USER_ID}/media`, { ...base, trial_params: { graduation_strategy: 'SS_PERFORMANCE' } }, 'v23.0')); console.log('trial reel'); }
  catch (e) { console.log(`::warning title=trial::trial reel refused (${e.message.slice(0, 300)}), posting the ordinary way`); }
if (!container) ({ id: container } = await post(`${IG_USER_ID}/media`, base));
for (let i = 0; ; i++) {
  const s = await fetch(`${G}/${container}?fields=status_code,status&access_token=${IG_TOKEN}`).then(r => r.json());
  if (s.status_code === 'FINISHED') break; if (s.status_code === 'ERROR' || i > 40) throw new Error(`container: ${JSON.stringify(s)}`); if (i % 4 === 0) console.log(`container ${s.status_code} ${s.status ?? ''}`); await wait(15);
}
const { id } = await post(`${IG_USER_ID}/media_publish`, { creation_id: container });
if (ep.firstComment) await post(`${id}/comments`, { message: ep.firstComment });
const k = JSON.parse(readFileSync('site/data/kingdom.json', 'utf8')); k.reels = { ...(k.reels ?? {}), [key]: id };
writeFileSync('site/data/kingdom.json', JSON.stringify(k, null, 2) + '\n');
console.log(`::notice title=post::published day ${key}${asTrial ? ' (trial)' : ''}: ${id}`);
