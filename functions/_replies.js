// King Michael answers every comment, in character: warm, quick and funny. It reads what was written (an idea for the
// kingdom, a house request, an emoji, a question, something rude, another city page) and answers that, and to someone
// new it also says their house is built. Lines are picked by the comment's id, so the same comment always gets the
// same answer and neighbours rarely get the same one. Family friendly, no links, no em dashes.
const pick = (list, seed) => list[Math.abs(seed) % list.length];
const hash = s => { let h = 7; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 2654435761); return h >>> 0; };

/** the thing they asked for, from "תבנו לנו גן חיות!" → "גן חיות" */
export function wish(text) {
  let t = String(text ?? '').replace(/@[\w.]+/g, ' ').replace(/[^\p{L}\p{N}\s'"-]/gu, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/^(אני\s+)?(ממש\s+)?(רוצה|רוצים|אשמח|אשמחחח+|מבקש|מבקשת|בבקשה|יאללה|יאלה|אולי|מה\s+דעתך\s+על)\s+(ש)?/u, '');
  t = t.replace(/^(תבנו|תבנה|תיבנו|תבני|לבנות|לבנו|תעשו|תעשה|שתבנו|שתבנה|שתעשו|תוסיפו|תוסיף|בנו|נבנה|אפשר)\s+(לי|לנו|לכם|גם|פה|כאן|את)?\s*/u, '');
  t = t.replace(/^(בממלכה|לממלכה)\s+/u, '').replace(/\s+(בממלכה|לממלכה|בבקשה|פליז|שלכם|שלנו)$/u, '');
  return t.split(' ').slice(0, 6).join(' ');
}

const W = alts => new RegExp(`(?<!\\p{L})[הבלמשוכ]{0,2}(?:${alts})`, 'u');
const TOPICS = [
  [W(String.raw`דרקון|הגנה|מגן|חומה|לוחמ|אביר|צבא|תותח|מבצר`), [w => `${w}? בדיוק מה שהממלכה צריכה מול הדרקונים 🐉🛡️`, w => `המלך רשם: ${w}. הדרקונים כבר מתחילים לדאוג 😏`, () => `סוף סוף מישהו שחושב על ביטחון הממלכה! 🛡️👑`]],
  [W(String.raw`פיצה|פיצרי|פלאפל|שווארמה|המבורגר|גלידה|סושי|מסעדה|פלאפליה|קפה|בית\s*קפה|מאפייה|ממתק|שוקולד|קרמבו|פופקורן|מזון|אוכל|צ'יפס|פסטה|בורגר`), [w => `${w}? הבטן של המלך כבר אמרה כן 😋`, w => `רעיון טעים! ${w} נכנס לרשימה של המלך 🍽️`, () => `המלך רעב רק מלקרוא את זה 🤤`, w => `${w} בממלכה? מישהו פה יודע מה טוב 😎`]],
  [W(String.raw`גן\s*חיות|חיות|כלב|חתול|סוס|פיל|אריה|ג'ירפה|קוף|דולפין|פינגווין|חנות\s*חיות|חווה`), [w => `${w}! רק שהדרקונים לא יחשבו שזה מזנון 🐉😅`, () => `המלך אוהב חיות. חוץ מדרקונים. הם עוד בבדיקה 🦁`, w => `${w}? הממלכה כבר מתחילה לשמוע נביחות ושאגות 🐾`]],
  [W(String.raw`אצטדיון|כדורגל|כדורסל|ספורט|בריכה|מגרש|פארק|לונה|מגלש|קרוסלה|רכבת\s*הרים|ים|חוף|אגם|סקייט`), [w => `${w}? הממלכה מתאמנת מעכשיו 💪⚽`, () => `המלך כבר קנה משרוקית 😄`, w => `${w} נשמע כמו יום כיף לכל התושבים! 🎢`]],
  [W(String.raw`קניון|סופר|חנות|שוק|קולנוע|תיאטרון|ספרייה|בית\s*ספר|גן\s*ילדים|בית\s*חולים|תחנה|נמל|שדה\s*תעופה|רכבת|מגדל|גשר|מזרקה|פסל|ארמון|טירה|וילה|גורד`), [w => `${w}? רעיון מלכותי! 👑`, w => `רשמתי: ${w}. עכשיו רק צריך לייקים 😉`, w => `${w} בממלכה? אני כבר רואה את זה 🏗️`, () => `רעיון ענק! תביאו לו לייקים והוא נבנה ✨`]],
  [W(String.raw`חגיגה|מסיבה|פסטיבל|יום\s*הולדת|זיקוק|חג|תהלוכה|הופעה|שלג|גשם|קשת`), [w => `${w}? הממלכה כבר מנפחת בלונים 🎉`, () => `המלך אוהב מסיבות. במיוחד כשאין בהן דרקונים 🎈`]],
];
const IDEA = [w => `רעיון נהדר! ${w} נכנס לרשימה של המלך 👑`, w => `${w}? אהבתי! אם יקבל הכי הרבה לייקים, זה נבנה 🏗️`, () => `וואו, רעיון של אדריכל אמיתי 📐`, w => `${w}... המלך שוקל ברצינות 🤔👑`, () => `רשמתי במגילה המלכותית ✍️`];
const HELLO = [() => 'תודה שקפצת לממלכה! 👑', () => 'המלך מנופף לך מהארמון 👋', () => 'שמחים שאתה פה 😄', () => 'הממלכה נהיית שמחה יותר עם כל תגובה ✨'];
const ASK = /(?<!\p{L})(תבנו|תבנה|תיבנו|תבני|לבנות|תעשו|תעשה|שתבנו|שתבנה|תוסיפו|תוסיף|בנו|אפשר|רוצה|רוצים|אשמח|מבקש|מבקשת)(?!\p{L})/u;
const QWORD = /^(מתי|איך|למה|מה|איפה|מי|כמה|האם|יש|אפשר לדעת)(?!\p{L})/u;
const HOUSE = [() => 'הבית שלך מחכה לך 🏡', () => 'בית עם השם שלך? כבר עומד 😎', () => 'המפתחות אצלך 🔑'];
const EMOJI = [() => 'המלך מרגיש את האנרגיה 🔥👑', () => 'אש בממלכה! (לא של דרקונים, מקווה) 🔥', () => '❤️ גם אנחנו אוהבים אותך', () => 'התגובה הכי קצרה והכי חמה 😄'];
const QUESTION = [() => 'שאלה מצוינת! המלך עונה בריל הבא 😉', () => 'סוד מלכותי 🤫 תמשיכו לעקוב ותגלו', () => 'כל התשובות בלשכת המידע באתר שבביו 📜'];
const RUDE = [() => 'את זה תבנה בבית שלך 😅', () => 'זה נראה לי פחות מתאים לממלכה 🙃', () => 'המלך עשה פרצוף. תנסה רעיון אחר 😂', () => 'ההצעה נשלחה לדרקונים. הם סירבו גם 🐉', () => 'בממלכה שלנו בונים דברים שמחים בלבד 😇'];
const OTHER_CITY = [() => 'פה זו הממלכה של משפחת ספיר 👑 יש לנו דרקונים, ארמון, ומלך אמיתי', () => 'כל עיר והקסם שלה 😊 אצלנו יש גם דרקונים', () => 'ברוכים הבאים לממלכה 🏰 כאן כל תגובה הופכת לבית'];
/** "חייל": joining the kingdom's army, their house becomes מגורים צבאיים (homes.js style 9) */
export const SOLDIER = /(?<!\p{L})(אני\s+)?(חייל|חיילת|חיילים|מתגייס|מתגייסת|להתגייס)(?!\p{L})/u;
export const SOLDIER_HOME = 9;
/** the football clubs (day 5): "מכבי ספיר" or "הפועל ספיר" in a comment asks to play; the first 30 of each make the squad (20 until day 10) */
export const TEAMS = { maccabi: { re: /(?<!\p{L})[בל]?מכבי(?!\p{L})/u, name: 'מכבי ספיר' }, hapoel: { re: /(?<!\p{L})[בל]?ה?פועל(?!\p{L})/u, name: 'הפועל ספיר' },
  beitar: { re: /(?<!\p{L})[בל]?(ביתר|בית["״]ר|בייתר)(?!\p{L})/u, name: 'ביתר ספיר', squad: 30 } };   // day 9: ביתר ספיר, 30 places   // "מכבי" alone counts too
export const SQUAD = 30;   // day 10: מכבי and הפועל opened 10 more places each (20 to 30)
export const squadOf = key => TEAMS[key]?.squad ?? SQUAD;
// day 9: נתס"ר is looking for pilots; a comment with "טייס" makes you one (residents.job = 'pilot')
export const PILOT = /(?<!\p{L})(אני\s+)?[ל]?(טייס|טייסת|טייסים|טייסות)(?!\p{L})/u;
const PILOTS = [() => 'ברוך הבא לצוות של נתס"ר! ✈️ אתה טייס רשמי של הממלכה', () => 'קיבלת כנפיים! ✈️ מעכשיו אתה טייס בנמל התעופה ספיר', () => 'הקברניט מדבר: ברוך הבא לטייסת של הממלכה 🛫', () => 'המטוס שלך מחכה על המסלול ✈️ גויסת לטייסי נתס"ר!'];
export const teamOf = text => Object.entries(TEAMS).find(([, t]) => t.re.test(String(text ?? '')))?.[0];
const SIGNED = [(n, s) => `ברוך הבא ל${n}! ⚽ קיבלת חולצה מספר ${s}`, (n, s) => `חתמת ב${n}! 🖊️⚽ מספר ${s} שלך, תתחיל להתאמן`, (n, s) => `${n} מחתימה שחקן חדש! 🔥 חולצה מספר ${s}`, (n, s) => `הסגל של ${n} גדל! ⚽ אתה מספר ${s}, מחר בוחרים צבע מדים`];
const FULL = [n => `הסגל של ${n} מלא 😅 אבל אתה האוהד מספר 1 ביציע! 📣`, n => `כל השחקנים של ${n} כבר נבחרו, אבל ביציע תמיד יש מקום 🏟️`];
const ARMY = [() => 'גויסת לצבא ההגנה לספירלנד! 🪖 הבית שלך עבר למגורים הצבאיים', () => 'ברוך הבא לצבא, חייל! 🫡 המגורים הצבאיים שלך מוכנים', () => 'הדרקונים כבר רועדים 🐉 גויסת! הבית שלך עכשיו במגורים הצבאיים', () => 'קיבלת מדים וקסדה 🪖 ברוכים הבאים לצבא ההגנה לספירלנד'];
export const BAD = /זונה|זנות|סקס|ציצי|תחת|חרא|קקי|פיפי|משתין|משתינ|מחרבן|זין|כוס|שרמוט|מטומטם|אידיוט|טיפש|סתום|למות|להרוג|רצח|פיגוע|מחבל|טרור|נאצי|היטלר|סמים|ג'וינט|אלכוהול|וודקה|נשק|אקדח|רובה|פצצה|מגדלי\s*התאומים|ביבי|נתניהו|בנט|טראמפ|לפיד|גנץ|בן\s*גביר|סמוטריץ|ליכוד|מטוס\s*שמתקרב/u;
// day 11: the royal wall. "המשאלה שלי היא..." (or "משאלה:") puts a note with the wish on הכותל המלכותי
export const WISH = /(?:^|\s)(?:ה?משאלה(?:\s+שלי)?(?:\s+(?:היא|זה|זו))?|אני\s+מבקש(?:ת)?\s+ש|אני\s+משאיל)\s*[:,.\-–]*\s*([\s\S]{2,})/u;
/** the wish itself, cleaned for the note: no mentions, no links, at most 70 letters */
export function wishText(text) { const m = String(text ?? '').match(WISH); if (!m) return null;
  const t = m[1].replace(/https?:\S+|www\.\S+/giu, ' ').replace(/@[\w.]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(?:זה\s+)?ש(?=[היתאנ])/u, '').trim();   // "שהדרקון ישתחרר" → "הדרקון ישתחרר", but "שלום" stays
  return t.length >= 2 ? (t.length > 70 ? t.slice(0, 68).replace(/\s+\S*$/u, '') + '…' : t) : null; }
/** 1: straight onto the wall, 0: the daily run looks first (a name, a number, a link, English), -1: never */
export function wishOk(text, raw) { if (BAD.test(raw) || CITY.test(raw)) return -1; if (/https?:|www\.|\d{5,}|[A-Za-z]{4,}/u.test(raw)) return 0; return 1; }
const WISHES = [() => 'המשאלה שלך נתלתה על הכותל המלכותי 🙏✨', () => 'פתק חדש בכותל המלכותי! שהמשאלה תתגשם 🙏', () => 'המלך שם את הפתק שלך בכותל בעצמו 👑🙏', () => 'נרשם בכותל המלכותי. שיתגשם בקרוב! ✨'];
const WISH_WAIT = [() => 'המשאלה שלך נשמרה 🙏 כדי שתופיע על הכותל המלכותי, עקבו וכתבו לי "בית" בפרטי', () => 'קיבלתי את המשאלה! ✨ היא תעלה לכותל ברגע שתעקבו ותכתבו לי "בית" בפרטי'];
const WISH_CHECK = [() => 'המשאלה הגיעה למלך 🙏 הוא קורא אותה ותולה אותה בכותל בקרוב', () => 'קיבלתי! המלך עובר על הפתקים ותולה אותם בכותל ✨'];
// day 11: the royal elections. Four candidates for the royal presidency of Sapirland; a comment with a name is a vote
export const CANDIDATES = {
  bibkovich: { re: /(?<!\p{L})(ב[יו]?ב[יו]?ק[ו]?ב[יו]?[צץ]['׳"]?|ביבי?קוביץ|bibkovi(?:ch|tch|tz))/iu, name: "ביבקוביץ'" },   // and its misspellings (ביביקוביץ׳, ביבוקביץ)
  yairdo: { re: /(?<!\p{L})(יאירדו|יארדו|יאירדוו|יאירידו|yairdo)/iu, name: 'יאירדו' },
  lebet: { re: /(?<!\p{L})(לבט|לה\s*בט|lebet)(?!\p{L})/iu, name: 'לבט' },
  mascentape: { re: /(?<!\p{L})(מאיסנקוט|מאיזנקוט|מייסנקוט|מייזנקוט|מאיסנקוטט|מסקנטייפ|maizencot|maisencot|mascentape)(?!\p{L})/iu, name: 'מאיסנקוט' } };   // day 11: renamed from מסקנטייפ (the voice could not say it)
export const voteOf = text => { const hits = Object.entries(CANDIDATES).filter(([, c]) => c.re.test(String(text ?? ''))); return hits.length === 1 ? hits[0][0] : null; };
const VOTED = [n => `הקול שלך ל${n} נספר! 🗳️`, n => `נרשם בקלפי המלכותית: קול ל${n} 🗳️👑`, n => `${n} מודה לך על הקול! 🗳️ הספירה ממשיכה`, n => `קיבלנו! עוד קול ל${n} 🗳️ מי ינצח?`];
const VOTE_WAIT = [n => `הקול שלך ל${n} נספר! 🗳️ ועכשיו תעקבו אחרי הממלכה, כדי לראות מי ינצח 👑`, n => `עוד קול ל${n}! 🗳️ אל תשכחו לעקוב אחרי הממלכה 👑`, n => `נספר! 🗳️ קול ל${n}. תעקבו אחרי הממלכה, התוצאות בריל הבא 👀`];   // Michael: every vote counts; those we have not seen follow are asked to follow
const CITY = /תל\s*בטטה|telbatata|tel\s*batata|מעתיק|העתק|חיקוי|קריית\s*בצל/iu;
const HOUSE_ASK = /^(אפשר|אני\s+רוצה|תבנו\s+לי|תבנה\s+לי|רוצה|אשמח\s+ל)?\s*(גם\s+)?(בית|ביית|ביתת|בית\s+משלי|בית\s+בבקשה)[\s?!.]*$/u;

/** the answer to one comment. fresh: their house was built just now (n); citizen: they follow */
export function reply({ id, u, text }, { fresh = false, n, citizen = false, team = null, pilot = false, tagged = [], wish: wishState = null, vote = null } = {}) {
  const seed = hash(id), t = String(text ?? '').trim(), w = wish(t), num = n?.toLocaleString?.('he-IL') ?? n;
  const tail = fresh ? (citizen ? ` · נבנה לך בית מספר ${num}, ואתם כבר אזרחים 👑` : ` · נבנה לך בית מספר ${num} 🏠 לאזרחות: עקבו וכתבו לי "בית" בפרטי`) : '';
  let head;
  if (BAD.test(t)) head = pick(RUDE, seed)();
  else if (CITY.test(t)) head = pick(OTHER_CITY, seed)();
  else if (vote) head = pick(citizen ? VOTED : VOTE_WAIT, seed)(CANDIDATES[vote].name);
  else if (wishState != null) head = wishState === 1 ? pick(citizen ? WISHES : WISH_WAIT, seed)() : pick(WISH_CHECK, seed)();
  else if (team) head = team.full ? pick(FULL, seed)(TEAMS[team.key].name) : pick(SIGNED, seed)(TEAMS[team.key].name, team.shirt);
  else if (pilot) head = pick(PILOTS, seed)();
  else if (SOLDIER.test(t)) head = pick(ARMY, seed)();
  else if (!/[\p{L}\p{N}]/u.test(t)) head = pick(EMOJI, seed)();
  else if (HOUSE_ASK.test(t)) head = fresh ? 'ביקשת, קיבלת! 🏡' : pick(HOUSE, seed)();
  else if (QWORD.test(t)) head = pick(QUESTION, seed)();
  else { const topic = TOPICS.find(([re]) => re.test(t));
    head = topic ? pick(topic[1], seed)(w || 'הרעיון שלך') : ASK.test(t) && w ? pick(IDEA, seed)(w) : pick(HELLO, seed)(); }
  const friends = tagged.length ? ` · ${tagged.map(t => '@' + t).join(' ')} ${pick(['יש לכם בית חדש בממלכה, בזכות', 'עכשיו גרים בממלכה, בזכות', 'ברוכים הבאים לממלכה! הבית מחכה, בזכות'], seed + 1)} @${u} 🏠` : '';
  return `@${u} ${head}${tail}${friends}`.slice(0, 300);
}
