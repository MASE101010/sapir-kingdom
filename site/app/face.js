// A resident's portrait for the ID card: a little voxel face drawn from the name's fingerprint, so it never changes.
import { pickFrom } from './residents.js';
const SKINS = ['#f1c9a5', '#e2b48f', '#c98e67', '#a8714f', '#7d5038'], HAIRS = ['#2b2320', '#5b3a24', '#b07a3c', '#e2c06b', '#8a8a8a', '#c4472f'];
const BG = ['#cfe8f3', '#f6e3b4', '#e3d4f0', '#d6efd0', '#f5d5cc'];
export function face(h) {
  const skin = SKINS[pickFrom(h, 0, 5)], hair = HAIRS[pickFrom(h, 1, 6)], bg = BG[pickFrom(h, 2, 5)], beard = pickFrom(h, 3, 3) === 0, crown = pickFrom(h, 4, 7) === 0;
  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><rect width="48" height="48" rx="10" fill="${bg}"/>
  <rect x="12" y="13" width="24" height="24" rx="2" fill="${skin}"/><rect x="11" y="9" width="26" height="${6 + pickFrom(h, 5, 4)}" fill="${hair}"/>
  <rect x="18" y="22" width="4" height="4" fill="#1d1d1d"/><rect x="27" y="22" width="4" height="4" fill="#1d1d1d"/>
  ${beard ? `<rect x="12" y="30" width="24" height="7" fill="${hair}"/>` : `<rect x="20" y="31" width="9" height="2.5" fill="#8a3b2c"/>`}
  ${crown ? `<path d="M14 9 l3-6 4 4 3-6 3 6 4-4 3 6z" fill="#e8b323"/>` : ''}</svg>`;
}
