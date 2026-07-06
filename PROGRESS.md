# PROGRESS

סיכום מצב הפרויקט — עדכון אחרון: הקמת סביבה, מודל תוכן, עמוד חטיבה, אנימציות, האדר ופוטר.

## מה בנינו

### תשתית
- Next.js (App Router) + Payload CMS 3, תבנית `blank` (נקייה, בלי דמו).
- Postgres מקומי (Postgres.app) — DB בשם `hebrew_cms`.
- עברית + RTL מוגדרים גלובלית: `<html dir="rtl" lang="he">`, ופאנל הניהול של Payload מוגדר ל-`i18n` עברי (`@payloadcms/translations/languages/he`) — כך שגם פאנל הניהול עצמו RTL.
- פונט **Almoni Neue** (4 משקלים: 300/400/700/900) מותקן עם `next/font/local`, מוגדר על `<body>` — יורש לכל האתר. קבצים ב-`src/fonts/almoni-neue.ts`.

### מודל תוכן (Payload)
- Collection יחיד: **Divisions** (`src/collections/Divisions.ts`) — חטיבה.
  שדות: `bannerImage`, `logo`, `title`, `subtitle`, `tertiaryTitle`, `description`, `featuredImage`, `externalUrl`, `statsByNumbers` (array: title/number/image), `goodToKnow` (array: icon/title/text), `slug` (נוצר אוטומטית מ-`title`, עם hook `beforeValidate` + פונקציית `formatSlug` שתומכת גם בעברית).
  כל ה-labels בפאנל בעברית.
- שאר עמודי האתר (בית, אודות, אחריות חברתית, צור קשר) **לא** קיבלו Collections/Globals — יוקשחו בקוד בהמשך, לפי החלטה מוקדמת.

### עמוד חטיבה — `/divisions/[slug]`
- Server Component (`page.tsx`) שמביא חטיבה בודדת מ-Payload Local API לפי `slug` (`decodeURIComponent` על הפרמטר — תוקן באג ידוע ב-Next 16/Turbopack שבו params של page components מגיעים לא-מפוענחים, בשונה מ-route handlers).
- מבנה מלמעלה למטה: באנר מלא → אזור כותרות ממורכז (לוגו, title כ-h1, subtitle כ-h2, tertiaryTitle כ-h3) → אזור דו-טורי (תיאור+כפתור מול תמונה) → "פעילות במספרים" (רשת 5, מספרים רצים) → "כדאי לדעת" (קוביות ריבועיות).
- `export const dynamic = 'force-dynamic'` — מונע ניסיון static-optimization על עמוד תלוי-DB.
- 404 אמיתי (`notFound()`) לסלאג לא קיים.

### אנימציות (GSAP + ScrollTrigger)
- **StatsCounter.tsx** (client) — מספרים "רצים" מ-0 לערך הסופי בגלילה לאזור (once, ~2s), עם פסיק לאלפים ותמיכה בסיומת טקסטואלית ("52 מיליון" — רק ה-52 רץ).
- **DivisionHeading.tsx** (client) — fade-in ל-h1, חשיפת מילים ברצף (stagger, מימין לשמאל) ל-h2, fade-up מושהה ל-h3.
- דפוס אחיד לשני הרכיבים: `'use client'` + `useEffect` עם `gsap.context(fn, scopeRef)` ו-cleanup דרך `ctx.revert()`. `ScrollTrigger.create({ once: true, onEnter })`.
- אנימציית hover על כפתור "בקרו באתר" — **CSS טהור** (לא GSAP): מילוי רקע מימין לשמאל עם `::before` + `transform: scaleX()`, כי זה effect שמספיק לו CSS transition.

### האדר ופוטר (ב-`layout.tsx`, גלובליים לכל עמוד)
- **SiteHeader.tsx** — "כרית זכוכית" צפה (`position: fixed`, `backdrop-filter: blur`), ממורכזת, עד 770px, לוגו מימין (קישור לבית), ניווט מיושר לשמאל (5 קישורים, כולל דפים שלא נבנו עדיין).
- **SiteFooter.tsx** — Server Component אסינכרוני, 4 עמודות (ניווט מהיר / תחומי פעילות **דינמי** משאילתת Divisions / צור קשר סטטי / מיתוג+סושיאל), אלמנט גרפי דקורטיבי (`tree-footer.png`) בפינה שמאל-תחתית.
- אייקוני סושיאל (פייסבוק/אינסטגרם/יוטיוב) הם **placeholder** שיצרתי (SVG פשוטים, לבנים) — הקבצים האמיתיים עדיין לא סופקו.

## החלטות עיצוב מרכזיות

**צבעים** (`src/app/(frontend)/styles.css`, ב-`:root`):
```css
--bg: #2a3950;      /* רקע כל האתר */
--text: #ffffff;    /* טקסט ברירת מחדל */
--brand: #9cee8c;   /* ירוק בהיר — קוביות, כפתורים */
--brand-2: #60d3aa; /* טורקיז — בורדרים, ניווט, כותרות עמודות בפוטר */
```

**טיפוגרפיה** — סולם רספונסיבי עם `clamp()`, עוגן עליון = ערכי Figma:
```css
--h1: clamp(20px, 2.1vw, 30px);
--h2: clamp(34px, 4.2vw, 60px);
--h3: clamp(18px, 1.7vw, 24px);
--body: clamp(17px, 1.5vw, 22px);
```
כל שדה טיפוגרפי חדש (למשל בתוך "פעילות במספרים" או "כדאי לדעת") מקבל את ה-`clamp()` הספציפי שלו לפי מפרט Figma, לא בהכרח את אחד מארבעת המשתנים הגלובליים.

**עקרון עבודה שחזר הרבה**: איפה שערך גולמי (hex/rgba) זהה למשתנה גלובלי קיים — משתמשים במשתנה (`var(--brand-2)` וכו') ולא בערך הגולמי, כדי שעדכון עתידי של הצבע יתפשט אוטומטית לכל מקום.

**RTL**: הדפוס העקבי — כל "פריט ראשון ב-DOM" מוצג בצד ימין אוטומטית (flex/grid מודעים לכיוון). לא היה צורך בהיפוך ידני של סדר בשום מקום, כולל ב-stagger של מילים.

## מה נשאר לדייק

- **עמוד הבית** — עדיין לא נבנה בכלל (מתחילים בו מחר).
- עמודי אודות / אחריות חברתית / צור קשר — לא קיימים (רק קישורים אליהם בהאדר/פוטר).
- עמוד רשימת חטיבות (`/divisions`) — יש קישורים אליו מהאדר והפוטר, אבל אין עמוד בפועל (404 כרגע).
- לוגו האדר/פוטר — כבר הוחלף בקובץ האמיתי (`main-logo-alectra.png`).
- אייקוני סושיאל בפוטר — placeholder, מחכים לקבצים אמיתיים + כתובות URL אמיתיות (כרגע `href="#"`).
- טלפון בפוטר כתוב `6686*` בדיוק כפי שסופק — לא אומת אם זה `*6686` (קוד מקוצר בפורמט הישראלי הרגיל).
- אלמנט גרפי דקורטיבי בפוטר — גודל/מיקום מוערכים (`min(480px, 45vw)`, שמאל-תחתית) בלי גישה לעיצוב מדויק.
- כל העיצוב שנבנה הוא **בלי אנימציות scroll נוספות** מעבר לשלוש שכבר יושמו (מספרים, כותרות, hover כפתור) — אם ירצו עוד, לחזור על דפוס `gsap.context` + `ScrollTrigger.create({ once: true })`.
