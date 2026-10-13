// Every 20 minutes (poll.yml): reads the newest comments on the kingdom's latest reels straight from Instagram, builds a
// house for every first-time commenter (through the site's API), and answers under their comment.
// This needs no webhook and no Meta app review: it only reads and answers comments on the kingdom's own posts.
// env: IG_TOKEN, IG_USER_ID, SITE_URL, EXPORT_TOKEN
const { IG_TOKEN, IG_USER_ID, SITE_URL, EXPORT_TOKEN } = process.env, G = 'https://graph.instagram.com/v21.0';
const get = url => fetch(url).then(r => r.json()).then(d => { if (d.error) throw new Error(d.error.message); return d; });
const media = (await get(`${G}/${IG_USER_ID}/media?fields=id,timestamp&limit=5&access_token=${IG_TOKEN}`)).data;
const comments = [];
for (const m of media) {
  let url = `${G}/${m.id}/comments?fields=id,text,username,timestamp&limit=50&access_token=${IG_TOKEN}`;
  for (let page = 0; url && page < 20; page++) { const d = await get(url); comments.push(...d.data.filter(c => c.username).map(c => ({ id: c.id, u: c.username, text: c.text, media: m.id }))); url = d.paging?.next; }
}
const { added = [] } = await fetch(`${SITE_URL}/api/export`, { method: 'POST', headers: { authorization: `Bearer ${EXPORT_TOKEN}`, 'content-type': 'application/json' }, body: JSON.stringify({ comments }) }).then(r => r.json());
const say = [n => `ברוכים הבאים לממלכה! הבית שלך, מספר ${n}, כבר עומד 🏠 חפשו את השם שלכם באתר שבביו`,
  n => `נבנה לך בית! מספר ${n}. כנסו לאתר שבביו ותמצאו אותו 👑`, n => `תושב חדש! בית מספר ${n} בממלכה הוא שלך. הקישור בביו 🏰`];
let replied = 0;
for (const a of added.filter(a => a.newHouse).slice(0, 120)) {
  const r = await fetch(`${G}/${a.id}/replies`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${IG_TOKEN}` }, body: JSON.stringify({ message: say[a.n % 3](a.n.toLocaleString('he-IL')) }) }).then(r => r.json());
  if (!r.error) replied++; await new Promise(ok => setTimeout(ok, 1500));
}
console.log(`${comments.length} comments read, ${added.length} new, ${added.filter(a => a.newHouse).length} new houses, ${replied} replies`);
