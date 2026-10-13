# הקמה: חצי שעה, פעם אחת, הכל בדפדפן

הכל רשום על מייל חדש של הממלכה, בלי שום קשר לחשבונות שלך. בסוף יש **סוד אחד** להדביק ב-GitHub.

## 1. מייל חדש (3 דקות)
פותחים Gmail חדש, למשל `sapir.kingdom@gmail.com`. כל השלבים הבאים נרשמים איתו.

## 2. אינסטגרם (5 דקות)
1. נרשמים לאינסטגרם עם המייל החדש. שם משתמש: `sapirkingdom` (אם תפוס, תגיד לי ואעדכן בקוד).
2. הגדרות ← סוג חשבון ← מעבר לחשבון מקצועי ← Creator.
3. **לא** מוסיפים אותו ל-Accounts Center של החשבון שלך. ככה הם לא מקושרים.

## 3. אפליקציית Meta (10 דקות, אפשר יחד איתי בדפדפן)
1. developers.facebook.com ← Create app ← Business ← מוסיפים את **Instagram** ← "API setup with Instagram login".
   (Meta דורשת להיכנס עם פייסבוק כדי להיות מפתח. זה לא נראה לאף אחד ולא מקשר את החשבונות.)
2. "Generate access tokens" ← Add account ← מתחברים עם `sapirkingdom` ← מעתיקים את הטוקן.
3. App settings ← Basic ← מעתיקים את ה-App secret.

## 4. Cloudflare (5 דקות)
1. נרשמים ל-Cloudflare עם המייל החדש (חינם).
2. מעתיקים את ה-Account ID (בצד ימין בדף הבית של החשבון).
3. My Profile ← API Tokens ← Create Token ← Custom: הרשאות Account ← **Cloudflare Pages: Edit**, **D1: Edit**. מעתיקים.

## 5. ElevenLabs (2 דקות)
API Key, ו-Voice ID של הקול שמיכאל ידבר בו.

## 6. GitHub (5 דקות)
1. נרשמים ל-GitHub עם המייל החדש, ומחברים אותו ב-claude.ai: הגדרות ← Connectors ← GitHub. אני יוצר ריפו ציבורי ומעלה את הקוד (ציבורי = דקות רינדור בחינם בלי הגבלה ומכונה מהירה יותר; הסודות נשארים סודיים).
2. בריפו: Settings ← Secrets and variables ← Actions ← New secret, שם: `KINGDOM_ENV`, ובתוכו שש שורות:

```
IG_TOKEN=הטוקן מאינסטגרם
META_APP_SECRET=ה-App secret
CLOUDFLARE_API_TOKEN=הטוקן מ-Cloudflare
CLOUDFLARE_ACCOUNT_ID=ה-Account ID
ELEVENLABS_API_KEY=המפתח
ELEVENLABS_VOICE_ID=מזהה הקול
```

## 7. הדלקה
1. Actions ← **setup** ← Run workflow. הוא בונה את האתר והדאטהבייס ומדפיס כתובת webhook.
2. באפליקציית Meta ← Webhooks: מדביקים את הכתובת שהודפסה, Verify token: `sapir-kingdom`, ומסמנים comments ו-messages.
3. Actions ← **publish** ← Run workflow, day = 1. הריל הראשון עולה.

מכאן אני מנהל הכל: כל יום ב-16:30 אני בונה, מצלם ומפרסם, והמערכת עונה לתגובות ולהודעות. אתה מקבל סיכום של שלוש שורות.
