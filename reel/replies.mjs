// Michael's personal answers to the day's best comments, written by the daily run into the episode ("replies":
// [{ "id": "<comment id>", "text": "..." }]) and posted after the reel is up. At most 15 a day, 3 seconds apart.
// env: IG_TOKEN   node reel/replies.mjs --day 3
import { readFileSync } from 'node:fs';
const day = +process.argv[process.argv.indexOf('--day') + 1], { IG_TOKEN } = process.env;
const ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8'));
for (const r of (ep.replies ?? []).slice(0, 15)) {
  const res = await fetch(`https://graph.instagram.com/v21.0/${r.id}/replies`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${IG_TOKEN}` }, body: JSON.stringify({ message: r.text }) }).then(x => x.json());
  console.log(res.error ? `skip ${r.id}: ${res.error.message}` : `replied ${r.id}`); await new Promise(ok => setTimeout(ok, 3000));
}
