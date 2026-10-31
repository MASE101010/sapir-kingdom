// Every landmark the kingdom can show. Each is built on the day its winning comment asked for it (data/kingdom.json lists
// which stand, on which lot, and who asked). A landmark module exports { key, name, draw(p), top } and draws around (0,0)
// with its front toward +z; the view moves it onto its lot. The daily run adds one file here and one line below.
import { CASTLE } from './castle.js';
import { BAKERY } from './bakery.js';
import { SUPER } from './super.js';        // day 2: סופר ספיר
import { BASE } from './base.js';          // day 3: צבא ההגנה לספירלנד
import { SPIRLAND } from './spirland.js';  // day 4: ספירלנד
import { MACCABI, HAPOEL, BEITAR } from './football.js';   // day 5: מכבי ספיר and הפועל ספיר
import { SPIRDONALDS } from './spirdonalds.js';  // day 6: ספירדונלדס
import { SPIRMALL } from './spirmall.js';        // day 7: ספירמול
import { BURJ } from './burj.js';                // day 8: בורג' ספיר
import { NATSAR } from './natsar.js';            // day 9: נמל התעופה ספיר
import { PRISON } from './prison.js';            // day 10: כלא הדרקונים
import { ELECTIONS } from './elections.js';      // day 11: כיכר הבחירות
import { STATUES } from './statues.js';        // day 12: שדרת הפסלים
import { CITYHALL } from './cityhall.js';      // day 13: עיריית ספיר
import { ARENA, BEITAR_ARENA } from './arena.js';   // day 15: הפועל ארנה, day 16: בית"ר ארנה
import { ZOO } from './zoo.js';                // day 17: ספארי ספיר

export const LANDMARKS = Object.fromEntries([CASTLE, BAKERY, SUPER, BASE, SPIRLAND, MACCABI, HAPOEL, SPIRDONALDS, SPIRMALL, BURJ, NATSAR, BEITAR, PRISON, ELECTIONS, STATUES, CITYHALL, ARENA, BEITAR_ARENA, ZOO].map(l => [l.key, l]));
