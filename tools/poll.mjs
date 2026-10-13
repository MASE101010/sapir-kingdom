// Every 5 minutes (poll.yml): asks the site to read the newest comments on the kingdom's posts (functions/_sync.js),
// so commenters who never open the site still get their house and an answer. The site does the same on every search.
// env: SITE_URL, EXPORT_TOKEN
const { SITE_URL, EXPORT_TOKEN } = process.env;
if (process.env.DEBUG) { const x = await fetch(`${SITE_URL}/api/sync?debug=1`, { headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(r => r.text()); console.log(`::notice title=debug::${x.slice(0, 3000).replace(/\n/g, ' ')}`); }
const d = await fetch(`${SITE_URL}/api/sync`, { method: 'POST', headers: { authorization: `Bearer ${EXPORT_TOKEN}` } }).then(r => r.json());
console.log(JSON.stringify(d));
console.log(`::notice title=sync::read ${d.read ?? 0} comments, new houses: ${(d.added ?? []).join(" ") || "none"}, replies ${d.replied ?? 0}${d.error ? ", error: " + d.error : ""}`);
if (d.error) process.exitCode = 1;
