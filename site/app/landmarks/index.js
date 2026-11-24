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
import { CINEMA } from './cinema.js';          // day 18: ספיר סינמה
import { GYM } from './gym.js';                // day 19: חדר כושר ספיר
import { WATERPARK } from './waterpark.js';    // day 20: פארק המים ספיר
import { FANCLUB } from './fanclub.js';        // day 21: מועדון האוהדים של הפועל ספיר
import { BEITARCLUB } from './beitarclub.js';  // day 22: מועדון האוהדים של בית"ר ספיר
import { HOTEL } from './hotel.js';            // day 23: ספיר הוטל
import { SCHOOL } from './school.js';          // day 24: בית ספר ספיר
import { TRAIN } from './train.js';            // day 25: רכבת האוהדים של הפועל ספיר
import { KINGFLAG } from './kingflag.js';      // day 26: כיכר המלך של הפועל ספיר
import { BOXOFFICE } from './boxoffice.js';    // day 27: הקופה הראשית של הממלכה
import { SYNAGOGUE } from './synagogue.js';    // day 28: בית הכנסת של הממלכה
import { AQUARIUM } from './aquarium.js';    // day 29: האקווריום הגדול של הממלכה
import { CLOCKTOWER } from './clocktower.js';    // day 30: מגדל השעון של הממלכה
import { AVIARY } from './aviary.js';    // day 31: בית התוכים של הממלכה
import { CANDYHOUSE } from './candy.js';    // day 32: בית הממתקים של הממלכה
import { WATCHTOWER } from './watchtower.js';    // day 33: מגדל התצפית של הממלכה (the king's pick)
import { DETECTIVE } from './detective.js';    // day 34: משרד הבלשים של הממלכה (the king's pick)
import { SHOWPARK } from './showpark.js';    // day 35: פארק ההופעות של הממלכה
import { MIRRORMAZE } from './mirrormaze.js';    // day 36: מבוך המראות של הממלכה (the king's pick, the first small lot)
import { KENNEL } from './kennel.js';    // day 37: תחנת כלבי הגישוש של הממלכה (the king's pick)
import { CAMROOM } from './camroom.js';  // day 38: חדר המצלמות של הממלכה (@ofek_bell)
import { GUARDS } from './guards.js';    // day 39: תחנת השומרים של הממלכה (@ofek_bell)
import { NEWSROOM } from './newsroom.js';  // day 40: חדשות ספיר
import { GAMEPARK } from './gamepark.js';  // day 41: פארק הגיימינג העתידני (@ofek_bell's idea, the king's pick)
import { ESCAPEROOM } from './escaperoom.js';  // day 42: חדר הבריחה של הממלכה (the king's pick)

export const LANDMARKS = Object.fromEntries([CASTLE, BAKERY, SUPER, BASE, SPIRLAND, MACCABI, HAPOEL, SPIRDONALDS, SPIRMALL, BURJ, NATSAR, BEITAR, PRISON, ELECTIONS, STATUES, CITYHALL, ARENA, BEITAR_ARENA, ZOO, CINEMA, GYM, WATERPARK, FANCLUB, BEITARCLUB, HOTEL, SCHOOL, TRAIN, KINGFLAG, BOXOFFICE, SYNAGOGUE, AQUARIUM, CLOCKTOWER, AVIARY, CANDYHOUSE, WATCHTOWER, DETECTIVE, SHOWPARK, MIRRORMAZE, KENNEL, CAMROOM, GUARDS, NEWSROOM, GAMEPARK, ESCAPEROOM].map(l => [l.key, l]));
