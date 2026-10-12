// GET /api/me: who this device is, once a code it asked for came back in a DM.
import { json, cookie } from '../_lib.js';
export async function onRequestGet({ request, env }) {
  const device = cookie(request, 'dev'); if (!device) return json({ u: null });
  const r = await env.DB.prepare('SELECT d.u, r.n FROM devices d LEFT JOIN residents r ON r.u = d.u WHERE d.device = ?').bind(device).first();
  return json(r ? { u: r.u, house: r.n } : { u: null });
}
