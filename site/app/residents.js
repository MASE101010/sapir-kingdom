// Who lives where. data/residents.json is an ordered list, only ever added to: resident k has house number k + 1
// and the plot written next to them. u is the Instagram name, h its fingerprint (what a search matches).
export const tidy = text => String(text).replace(/[\s​-‏‪-‮⁦-⁩]/g, '').toLowerCase();
export const normalize = name => tidy(name).replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+).*$/, '$1').replace(/^@+/, '');
export const valid = name => /^[a-z0-9._]{1,30}$/.test(normalize(name));
/** a 53-bit fingerprint of a name, as hex; the same in every browser and in node */
export function fingerprint(name) {
  const s = normalize(name); let h1 = 0x9e3779b1, h2 = 0x85ebca6b;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}
export const find = (residents, name) => { const f = fingerprint(name); return residents.findIndex(r => r.h === f); };
/** a small number taken from a fingerprint, for picking a house style or a colour */
export const pickFrom = (h, k, n) => parseInt(h.slice((k * 3) % 12, (k * 3) % 12 + 3), 16) % n;
