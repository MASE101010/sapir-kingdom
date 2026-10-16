// Every landmark the kingdom can show. Each is built on the day its winning comment asked for it (data/kingdom.json lists
// which stand, on which lot, and who asked). A landmark module exports { key, name, draw(p), top } and draws around (0,0)
// with its front toward +z; the view moves it onto its lot. The daily run adds one file here and one line below.
import { CASTLE } from './castle.js';
import { BAKERY } from './bakery.js';
import { SUPER } from './super.js';        // day 2: סופר ספיר
import { BASE } from './base.js';          // day 3: צבא ההגנה לספירלנד
import { SPIRLAND } from './spirland.js';  // day 4: ספירלנד
import { MACCABI, HAPOEL } from './football.js';   // day 5: מכבי ספיר and הפועל ספיר

export const LANDMARKS = Object.fromEntries([CASTLE, BAKERY, SUPER, BASE, SPIRLAND, MACCABI, HAPOEL].map(l => [l.key, l]));
