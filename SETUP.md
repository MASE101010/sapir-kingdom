# הקמה: מה מיכאל עושה פעם אחת

הכל בדפדפן, בלי להתקין כלום במחשב. בסוף כל שלב יש מפתח או מזהה שנכנסים ל-GitHub כ"סוד" (Secret).
את המפתחות מקלידים רק בהגדרות של GitHub ושל Cloudflare, לא בצ'אט.

## 1. GitHub (5 דקות)
1. ב-claude.ai: הגדרות ← Connectors ← GitHub ← לחבר. ככה אני יכול לדחוף קוד ולהריץ את הממלכה.
2. ליצור ריפו פרטי בשם `sapir-kingdom`. אני מעלה אליו את כל הקוד.
3. Settings ← Secrets and variables ← Actions. שם נכנסים כל הסודות מהשלבים הבאים.

## 2. אינסטגרם (20 דקות)
1. לפתוח חשבון חדש `@sapir.kingdom` (או שם אחר, ואז מעדכנים את `data-account` ב-`site/index.html`).
2. בהגדרות החשבון: מעבר לחשבון מקצועי (Creator). לסמן בפרופיל "AI-generated profile" אם אינסטגרם מציעה.
3. ב-developers.facebook.com: Create App ← סוג Business ← להוסיף את המוצר **Instagram** ← "API setup with Instagram login".
4. Generate token לחשבון החדש. ההרשאות: `instagram_business_basic`, `instagram_business_content_publish`,
   `instagram_business_manage_messages`, `instagram_business_manage_comments`.
5. Webhooks: Callback URL = `https://<הדומיין>/api/ig`, Verify token = מחרוזת שתמציא, ולהירשם ל-`messages` ול-`comments`.
6. סודות ל-GitHub: `IG_TOKEN` (הטוקן), `IG_USER_ID` (מזהה החשבון), `META_APP_SECRET` (App secret), `IG_VERIFY_TOKEN` (המחרוזת).
   האפליקציה נשארת במצב פיתוח, אין צורך ב-App Review כשזה רק החשבון שלך.

## 3. Cloudflare (10 דקות)
1. dash.cloudflare.com ← Workers & Pages ← Create ← Pages ← "Direct upload" ← שם הפרויקט `sapir-kingdom`.
2. Storage ← D1 ← Create database בשם `sapir-kingdom`. להעתיק את ה-Database ID ולשלוח לי (זה לא סוד), ואני מעדכן את `wrangler.toml`.
3. בפרויקט ה-Pages: Settings ← Bindings ← D1 ← שם `DB` ← הדאטהבייס.
4. My Profile ← API Tokens ← Create ← תבנית "Edit Cloudflare Workers" + הרשאות Pages ו-D1.
5. סודות ל-GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
6. משתנה (Variable, לא סוד) ב-GitHub: `SITE_URL` = כתובת האתר, למשל `https://sapir-kingdom.pages.dev` או דומיין משלך.

## 4. ElevenLabs (2 דקות)
1. Profile ← API Keys ← Create. סוד ל-GitHub: `ELEVENLABS_API_KEY`.
2. הקול המשובט שלך ← Voice ID. סוד ל-GitHub: `ELEVENLABS_VOICE_ID`.

## 5. עוד שני סודות
- `EXPORT_TOKEN`: מחרוזת אקראית ארוכה (למשל מ-1password או מ-random.org). מגינה על הייצוא היומי.
- `GH_ADMIN_TOKEN`: ב-GitHub ← Settings ← Developer settings ← Fine-grained token לריפו הזה בלבד, עם "Secrets: Read and write".
  בזכותו הטוקן של אינסטגרם מתחדש לבד כל שבוע.

## 6. הדלקה
1. Actions ← deploy ← Run workflow, לסמן "Copy the API secrets to Cloudflare". האתר עולה.
2. Actions ← publish ← Run workflow, day = 1. הריל הראשון (הטירה הריקה) עולה לאינסטגרם.
3. מכאן אני רץ כל יום ב-16:30 לבד. אתה מקבל ממני סיכום של שלוש שורות.
