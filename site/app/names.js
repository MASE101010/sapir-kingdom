// Names in the kingdom: the ring roads, the radial roads, and a resident's address.
// Frozen like the plan: a road's name never changes once a resident lives on it.
export const KINGDOM = 'הממלכה של משפחת ספיר';
export const RING_NAMES = ['שדרות הטירה', 'רחוב הכתר', 'דרך האבירים', 'רחוב הדרקון', 'שדרות המגדלים', 'רחוב החרב', 'רחוב המגן',
  'דרך הנסיכה', 'רחוב הקשת', 'שדרות היונים', 'רחוב הגביע', 'רחוב השריון', 'דרך הליצנים', 'רחוב הזהב', 'רחוב היהלום',
  'שדרות האריות', 'רחוב הפעמון', 'דרך הטחנה', 'רחוב הנפח', 'רחוב המעיין', 'שדרות הכרמים', 'רחוב הפרשים', 'רחוב המגילה',
  'דרך הכוכבים', 'רחוב החצוצרה', 'רחוב הגשר', 'שדרות הדגלים', 'רחוב הצריח', 'רחוב השער', 'דרך הים'];

/** for every plot: which ring it is on and its house number on that road (odd outside the road, even inside) */
export function addresses(plots) {
  const count = new Map(), out = new Array(plots.length);
  plots.forEach((p, k) => {
    const ring = p[3], key = ring * 10 + (Math.hypot(p[0], p[1]) > 90 + 70 * ring ? 1 : 0), n = (count.get(key) ?? 0) + 1;
    count.set(key, n); out[k] = { street: RING_NAMES[ring] ?? `טבעת ${ring + 1}`, num: key % 10 ? n * 2 - 1 : n * 2 };
  });
  return out;
}
