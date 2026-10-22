// The daily count (GitHub Actions, ingest.yml). Takes a snapshot of the residents from the live API into
// site/data/residents.json, and reads the comments on the latest reel with their likes from Instagram into
// inbox/dayN.json, sorted by likes, for the daily run (CLAUDE.md) to pick the winner from.
// env: SITE_URL, EXPORT_TOKEN, IG_TOKEN
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const { SITE_URL, EXPORT_TOKEN, IG_TOKEN } = process.env;
const kingdom = JSON.parse(readFileSync('site/data/kingdom.json', 'utf8')), day = kingdom.day;

const live = await fetch(`${SITE_URL}/api/export`, { headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(r => { if (!r.ok) throw new Error(`export ${r.status}`); return r.json(); });
const old = JSON.parse(readFileSync('site/data/residents.json', 'utf8'));
// only ever appended to: the same people in the same order (a plot may change: a resident moved in with a friend)
old.residents.forEach((r, k) => { if (live.residents[k]?.u !== r.u) throw new Error(`resident ${k + 1} changed: ${r.u} -> ${live.residents[k]?.u}`); });
writeFileSync('site/data/residents.json', JSON.stringify({ note: old.note, residents: live.residents }));
kingdom.updated = new Date().toISOString(); writeFileSync('site/data/kingdom.json', JSON.stringify(kingdom, null, 2) + '\n');
console.log(`residents ${old.residents.length} -> ${live.residents.length}`);
// the royal wall's notes (day 11): the citizens' wishes that passed, for the reels; the waiting ones for the daily run to look at
const wishes = live.wishes ?? [];
writeFileSync('site/data/wishes.json', JSON.stringify({ note: 'הכותל המלכותי: the notes on the wall (citizens, passed), newest first. Written by tools/ingest.mjs.', wishes: wishes.filter(w => w.ok === 1 && w.citizen).map(w => ({ u: w.u, text: w.text, at: w.at })).reverse() }, null, 1));
if (live.votes) { writeFileSync('site/data/votes.json', JSON.stringify({ note: 'The royal elections (day 11): citizens\' votes by candidate, at the daily count. Written by tools/ingest.mjs.', at: new Date().toISOString(), votes: live.votes }, null, 1)); console.log(`votes: ${JSON.stringify(live.votes)}`); }
const waitingWishes = wishes.filter(w => w.ok === 0);
console.log(`wishes: ${wishes.filter(w => w.ok === 1 && w.citizen).length} on the wall, ${waitingWishes.length} waiting`);

// the comments on the latest reel, with their likes
const media = kingdom.reels?.[day] ?? kingdom.reels?.[day - 1];
let comments = [];
if (media && IG_TOKEN) {
  let url = `https://graph.instagram.com/v21.0/${media}/comments?fields=id,text,username,like_count,timestamp&limit=50&access_token=${IG_TOKEN}`;
  while (url) { const page = await fetch(url).then(r => r.json()); if (page.error) throw new Error(page.error.message); comments.push(...page.data); url = page.paging?.next; }
}
comments = comments.map(c => ({ id: c.id, u: c.username, text: c.text, likes: c.like_count ?? 0, at: c.timestamp })).sort((a, b) => b.likes - a.likes);
mkdirSync('inbox', { recursive: true });
writeFileSync(`inbox/day${day}.json`, JSON.stringify({ day, media, counted: new Date().toISOString(), residents: live.residents.length, newResidents: live.residents.length - old.residents.length, waitingWishes, comments }, null, 1));
console.log(`inbox/day${day}.json: ${comments.length} comments, top ${comments[0]?.likes ?? 0} likes`);
