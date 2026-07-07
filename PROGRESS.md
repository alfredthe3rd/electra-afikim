# PROGRESS

סיכום מצב הפרויקט — עדכון אחרון: 7.7.2026

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
- שאר עמודי האתר (בית, אודות, אחריות חברתית, צור קשר) **לא** קיבלו Collections/Globals — מוקשחים בקוד.

### עמוד הבית — `/`
- 6 סקשנים: Hero (וידאו + לוגו), DivisionsSplit (7 סרטוני חטיבות עם sticky scroll + snap + crossfade), Umbrella (קורת גג אחת), AboutTeaser (שותפים אסטרטגיים — word reveal + scrub highlight), PartnersGrid (לוגואים + hover glow), Ticker.
- אנימציות: GSAP + ScrollTrigger (pin, scrub, snap) לסקשנים מורכבים. CSS transitions + IntersectionObserver (useReveal hook) לכותרות word-reveal (דפוס Terminal Industries).
- לוגו Hero: `clamp(260px, 28.6vw, 468px)`, ממוקם ב-top: 25%.

### עמוד לובי חטיבות — `/divisions`
- 4 אזורים: הירו וידאו (55vh), כותרות ("פתרונות מקיפים לכל צורכי התחבורה"), רשת חטיבות דינמית מ-Payload (3 עמודות, גבולות מקווקוים, כפתורי CTA), טיקר מרקיז ("מערכת אחת. שפה אחת. סטנדרט אחד.").

### עמוד חטיבה — `/divisions/[slug]`
- Server Component שמביא חטיבה בודדת מ-Payload Local API לפי `slug`.
- מבנה: באנר → כותרות (DivisionHeading) → דו-טורי (תיאור+כפתור מול תמונה) → "פעילות במספרים" (StatsCounter — מספרים רצים) → "כדאי לדעת" (קוביות).
- `export const dynamic = 'force-dynamic'`, 404 עם `notFound()`.

### עמוד צור קשר — `/contact`
- הירו וידאו מלא מסך עם שכבת overlay (#2A3950E5).
- קונטיינר RTL (max-width: 1200px): כותרת + סאבטייטל + separator.
- שני טורים: כרטיס מידע ירוק (טלפון, מייל, כתובת) + טופס (שם, טלפון, מייל, הודעה, כפתור שליחה).
- Client component עם state לניהול שליחה (idle/sending/sent).

### עמוד אחריות חברתית — `/social-responsibility`
- 5 אזורים: הירו וידאו (55vh), כותרות ("אחריות חברתית" + סאבטייטל), 3 קוביות ירוקות (#9CEE8C) עם אייקון/כותרת/טקסט/רשימה, סקשן CTA (כותרת + סאבטייטל + כפתור ליצירת קשר), קרוסלת תמונות (שתי שורות נעות בכיוונים מנוגדים, 8 תמונות).

### האדר ופוטר (גלובליים)
- **SiteHeader.tsx** — "כרית זכוכית" צפה (fixed, backdrop-filter: blur), לוגו + ניווט.
- **SiteFooter.tsx** — 4 עמודות (ניווט / חטיבות דינמי / צור קשר / מיתוג+סושיאל), אלמנט גרפי tree-footer.png.
- SmoothScroll — GSAP Lenis integration.

### אנימציות
- **useReveal.ts** — hook אחיד: IntersectionObserver + immediate viewport check, threshold: 0, rootMargin.
- **Word reveal** — CSS transitions (translate3d) עם stagger, מיושם על: AboutTeaser, Umbrella, PartnersGrid.
- **DivisionsSplit** — sticky scroll עם כל 7 הסליידים ב-DOM, crossfade + translateY, snap: 1/(STEP_COUNT-1), anticipatePin: 1.
- **StatsCounter** — מספרים רצים עם GSAP ScrollTrigger.
- **DivisionHeading** — fade-in + stagger words.
- **Partners hover glow** — ellipse positioned at bottom with blur.

## החלטות עיצוב

**צבעים** (`styles.css`, `:root`):
```css
--bg: #2a3950;      /* רקע */
--text: #ffffff;    /* טקסט */
--brand: #9cee8c;   /* ירוק בהיר */
--brand-2: #60d3aa; /* טורקיז */
```

**טיפוגרפיה** — סולם רספונסיבי עם `clamp()`.

**RTL** — כל "פריט ראשון ב-DOM" מוצג בצד ימין אוטומטית. לא היה צורך בהיפוך ידני.

## מה נשאר

- **עמוד אודות** (`/about`) — עדיין לא נבנה.
- **התאמה למובייל** — כל העמודים דורשים responsive tuning.
- **דיוקים אחרונים** — אייקוני סושיאל (placeholder), כתובות URL אמיתיות, עיצוב סופי.
- **טופס צור קשר** — wire up ל-API אמיתי (כרגע setTimeout mock).
