// The catalogue of homes, as plain data (the API reads it too). Index = the style number stored on a resident (home).
// COMMON: anyone may pick them. The rest are rare: only for holders of the gold key from the daily lottery.
export const HOMES = [
  { name: 'קוטג׳ עם גג רעפים', line: 'הבית הקלאסי של הממלכה' },
  { name: 'בית לבן עם דוד שמש', line: 'גג שטוח, מרפסות, ודוד על הגג' },
  { name: 'צריח אבן', line: 'בית קטן עם מגדל משלו' },
  { name: 'בקתת עץ', line: 'עץ חם, ארובה ומרפסת' },
  { name: 'טחנת רוח', line: 'נדיר · עם כנפיים שמסתובבות', rare: true },
  { name: 'בית על העץ', line: 'נדיר · גבוה מעל כולם', rare: true },
  { name: 'מגדלור', line: 'נדיר · אור שמסתובב בלילה', rare: true },
  { name: 'ארמון קטן', line: 'נדיר · כמעט כמו הטירה', rare: true },
  { name: 'וילה מוזהבת', line: 'נדיר · לזוכי מפתח הזהב, עם בריכה', rare: true },
];
export const COMMON = HOMES.map((h, k) => h.rare ? -1 : k).filter(k => k >= 0);
/** a house shared with friends grows with the number who live in it */
export const TIERS = [{ from: 1, name: 'בית משלך' }, { from: 2, name: 'בית משותף עם לב' }, { from: 4, name: 'בניין לחבורה' }, { from: 11, name: 'מגדל החבורה' }];
export const tierOf = n => TIERS.filter(t => n >= t.from).at(-1);
