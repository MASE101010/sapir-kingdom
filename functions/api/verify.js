// POST /api/verify: a one-time code for this device. The visitor sends it to the kingdom in an Instagram DM;
// the webhook (api/ig.js) finds it, checks they follow, builds their house and tells this device who they are.
import { json, cookie } from '../_lib.js';
export async function onRequestPost({ request, env }) {
  let device = cookie(request, 'dev'); const headers = {};
  if (!device || !/^[a-f0-9]{32}$/.test(device)) { device = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
    headers['set-cookie'] = `dev=${device}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`; }
  const recent = await env.DB.prepare('SELECT COUNT(*) AS c FROM codes WHERE device = ? AND at > ?').bind(device, Date.now() - 3600e3).first('c');
  if (recent > 8) return json({ error: 'too_many' }, 429, headers);
  const code = `SAPIR-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 1e6).padStart(6, '0')}`;
  await env.DB.prepare('INSERT INTO codes (code, device, at) VALUES (?, ?, ?)').bind(code, device, Date.now()).run();
  return json({ code }, 200, headers);
}
