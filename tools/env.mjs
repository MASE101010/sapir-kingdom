// One secret instead of ten. The GitHub secret KINGDOM_ENV holds lines of KEY=value (SETUP.md); this turns them into
// the job's environment, hides every value from the logs, and works out the rest:
//   EXPORT_TOKEN and the webhook's verify token are derived from META_APP_SECRET, IG_USER_ID is asked from Instagram,
//   SITE_URL defaults to the Pages address, and IG_TOKEN is replaced by the fresher one the site keeps (token.yml).
import { appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const env = Object.fromEntries((process.env.KINGDOM_ENV ?? '').split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#') && l.includes('='))
  .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const derive = what => createHash('sha256').update(`${env.META_APP_SECRET}:${what}`).digest('hex').slice(0, 40);
if (env.META_APP_SECRET) env.EXPORT_TOKEN ??= derive('export');
env.IG_VERIFY_TOKEN ??= 'sapir-kingdom';
env.SITE_URL ??= process.env.SITE_URL || 'https://sapir-kingdom.pages.dev';
try { const live = await fetch(`${env.SITE_URL}/api/export?token=1`, { headers: { authorization: `Bearer ${env.EXPORT_TOKEN}` } }).then(r => r.ok ? r.json() : {}); if (live.ig_token) env.IG_TOKEN = live.ig_token; } catch { }
if (env.IG_TOKEN && !env.IG_USER_ID) { try { const me = await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,username&access_token=${env.IG_TOKEN}`).then(r => r.json()); if (me.user_id) env.IG_USER_ID = String(me.user_id); console.log(`instagram account: @${me.username ?? '?'}`); } catch { } }
for (const [k, v] of Object.entries(env)) { if (v && !['SITE_URL', 'IG_VERIFY_TOKEN', 'IG_USER_ID', 'CLOUDFLARE_ACCOUNT_ID', 'ELEVENLABS_VOICE_ID'].includes(k)) console.log(`::add-mask::${v}`); if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `${k}=${v}\n`); }
const ready = ['IG_TOKEN', 'META_APP_SECRET', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'].every(k => env[k]);
if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `READY=${ready ? 1 : 0}\n`);
console.log(ready ? `loaded: ${Object.keys(env).join(', ')}` : '::notice::KINGDOM_ENV is not set yet (SETUP.md). Nothing to do.');
