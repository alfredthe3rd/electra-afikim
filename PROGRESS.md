# PROGRESS

סיכום מצב הפרויקט — עדכון אחרון: 15.7.2026

## מה בנינו

### תשתית
- Next.js (App Router) + Payload CMS 3, תבנית `blank` (נקייה, בלי דמו).
- Postgres מקומי (Postgres.app) — DB בשם `hebrew_cms`.
- עברית + RTL מוגדרים גלובלית: `<html dir="rtl" lang="he">`, ופאנל הניהול של Payload מוגדר ל-`i18n` עברי (`@payloadcms/translations/languages/he`) — כך שגם פאנל הניהול עצמו RTL.
- פונט **Almoni Neue** (4 משקלים: 300/400/700/900) מותקן עם `next/font/local`, מוגדר על `<body>` — יורש לכל האתר. קבצים ב-`src/fonts/almoni-neue.ts`.

### מודל תוכן (Payload)
- Collection יחיד: **Divisions** (`src/collections/Divisions.ts`) — חטיבה.
  שדות: `bannerImage`, `logo`, `title`, `subtitle`, `tertiaryTitle`, `description`, `featuredImage`, `externalUrl`, `statsByNumbers` (array: title/number/image — **קיים ב-DB אך מוסתר מהעמוד**, ראה עמוד חטיבה למטה), `goodToKnow` (array: icon/title/**text — `richText` עם Lexical, לא `textarea`**), `slug` (נוצר אוטומטית מ-`title`, עם hook `beforeValidate` + פונקציית `formatSlug` שתומכת גם בעברית).
  כל ה-labels בפאנל בעברית.
- **שדה `goodToKnow.text` שונה מ-`textarea` ל-`richText`** — עורך Lexical עם `FixedToolbarFeature` (סרגל כלים קבוע גלוי) + `UnorderedListFeature`/`OrderedListFeature` (בולטים ומספרים). זה חייב **מיגרציית DB חיה** (ראה "לקחים כלליים" למטה).
- שדות `goodToKnowHeading`/`goodToKnowText` **נוספו ואז הוסרו** — הכותרת "כדאי לדעת עלינו" בעמוד חטיבה **קבועה בקוד**, לא שדה CMS.
- שאר עמודי האתר (בית, אודות, אחריות חברתית, צור קשר) **לא** קיבלו Collections/Globals — מוקשחים בקוד.

### עמוד הבית — `/`
- 6 סקשנים: Hero (וידאו + לוגו), DivisionsSplit (7 סרטוני חטיבות עם sticky scroll + snap + crossfade), Umbrella (קורת גג אחת), AboutTeaser (שותפים אסטרטגיים — word reveal + scrub highlight), PartnersGrid (לוגואים + hover glow), Ticker.
- אנימציות: GSAP + ScrollTrigger (pin, scrub, snap) לסקשנים מורכבים. CSS transitions + IntersectionObserver (useReveal hook) לכותרות word-reveal (דפוס Terminal Industries).
- **לוגו Hero: `clamp(260px, 46.3vw, 700px)`** (הוגדל מ-468px ל-700px לבקשת הלקוח), ממוקם ב-top: 25%.
  - **באג שנתפס ותוקן: הלוגו זלג מעל כרית ההאדר בנחיתה** — `measure()` (מחשב סקייל/מיקום היעד להאדר) רץ גם על `window.load`, ובאותו רגע ה-transform של חשיפת ההאדר (`y:-16`) כבר הופעל, ולכן המדידה "נגועה" והלוגו נחת ~16px גבוה מדי. תוקן ע"י איפוס הטרנספורמים (של ההאדר ושל הלוגו) למצב ניטרלי בתוך `measure()` עצמה, לפני שהיא קוראת `getBoundingClientRect()`.
  - **אנימציית הכותרת הסופית ("מעצמת התחבורה של ישראל") נבנתה מחדש**: היה מבוסס `background-position` שרק הזיז גרדיאנט קיים; עכשיו שתי שכבות טקסט חופפות — בסיס לבן שנכנס קודם (`autoAlpha`+`y`, `power3.out`), ואז גרדיאנט המותג (טורקיז→ירוק) נחשף מעליו ע"י `clip-path: inset()` wipe מימין לשמאל (RTL).
  - **תזמון החשיפה (`TITLES_START`) הוזז מ-0.88 ל-0.66** — הלקוח ביקש שהכותרת תופיע בפריים "בתוך המנהרה" של אנימציית ה-Lottie, לא בסוף.

### עמוד לובי חטיבות — `/divisions`
- 4 אזורים: הירו וידאו (55vh), כותרות ("פתרונות מקיפים לכל צורכי התחבורה"), רשת חטיבות דינמית מ-Payload, טיקר מרקיז ("מערכת אחת. שפה אחת. סטנדרט אחד.").
- **רשת החטיבות נבנתה מחדש 1:1 כשכפול של PartnersGrid מדף הבית** (לבקשת הלקוח) — אותו מנגנון spacer-grid: 5 עמודות (2 spacer + 3 תוכן, ל-6 חטיבות = 2 שורות), שורות-spacer למעלה/למטה, קווים מקווקווים `3px dashed` בטורקיז-20%, וכתם glow ירוק ב-`::before` על hover (בשונה מהלוגואים בדף הבית: כאן **בלי** grayscale — לוגואי החטיבות תמיד בצבע מלא).
- כפתורי CTA ("למידע מורחב"): `padding-left/right: 40px` → **35px** (מוגדר ב-`.divisions-lobby-card .division-cta`, ראה "לקחים" על CSS specificity).
- **`LobbyAnimations.tsx`** (client component, מחזיר `null`) — אנימציות כניסה: זום עדין על וידאו ההירו, fade-up לכותרות, stagger reveal לכרטיסי הרשת (מראה של PartnersGrid).

### עמוד חטיבה — `/divisions/[slug]`
- Server Component שמביא חטיבה בודדת מ-Payload Local API לפי `slug`.
- מבנה עודכן: באנר → כותרות (`DivisionHeading`) → דו-טורי (תיאור+כפתור מול תמונה) → **"כדאי לדעת עלינו"** (קוביות; **אזור "פעילות במספרים" הוסר מהתצוגה** — השדה `statsByNumbers` נשאר ב-Payload, `StatsCounter.tsx` נשאר בקוד אך לא נטען בעמוד).
- **לוגו**: `338×79.236px` → **`405.6×95.0832px`** (+20% לבקשת הלקוח), עם `object-fit: contain`.
- **דו-טורי (`.division-columns`)**: padding אופקי `5vw` → `8vw` → **`11vw`** (סבבי כיוונון לפי בקשות).
- **"כדאי לדעת עלינו"**:
  - הכותרת **קבועה בקוד** (לא שדה CMS), `5vw`, לבן, בולד, `margin-bottom: 4vw` מהגריד שמתחתיה.
  - גריד: 2 עמודות → **3 עמודות קבועות** (`repeat(3, minmax(0,400px))`) — "תמיד שורה אחת של 3 קוביות".
  - טקסט הקובייה מרונדר עם `<RichText>` של Payload (ראה שינוי השדה למעלה).
  - **תוכן הקובייה מיושר לימין** (אייקון+כותרת+טקסט) — `align-items: flex-start` (לא `flex-end`! ראה "לקחים כלליים").
  - **כותרת קובייה**: `1.8vw`→**`1.5vw`**; **טקסט קובייה**: `1.1vw`→**`1vw`**.
  - **גובה שווה בין קוביות**: הוסר `aspect-ratio:1/1` (שהיה נדרס ע"י תוכן ארוך ושובר את המתיחה האוטומטית של ה-grid), הוחלף ב-`height:100%` (מנצל `align-items:stretch` ברירת המחדל של grid) + `min-height:400px`.
  - **יישור לראש הקובייה**: `justify-content:center`→**`flex-start`** (מרכוז גרם לקוביות עם תוכן קצר "לצוף" נמוך יותר מקוביות עם תוכן ארוך).
  - כפתור "בקרו באתר": `padding-left/right: 40px` (`.division-text .division-cta`).
- **`DivisionAnimations.tsx`** — אנימציות: זום על הבאנר, fade-up על העמודות, stagger על קוביות "כדאי לדעת".
- **מותאם למובייל במלואו** (`@media max-width:768px`) — כולל תיקוני יישור: לוגו וכותרות (h1/h2/h3) מיושרים לימין (`align-items:flex-start`), לוגו מוגדל 30% במובייל (200×47→260×61.1px), מרווח כותרת-שלישית↔טקסט צומצם ל-20px מדויק.
- `export const dynamic = 'force-dynamic'`, 404 עם `notFound()`.

### עמוד אודות — `/about`
- 7 סקשנים בנויים במלואם (ראה סעיפים המקוריים למטה — **ללא שינוי היום מלבד AboutHero+AboutCircle**).
- **AboutHero.tsx — שינוי מהותי: הסקשן השני (AboutCircle) עכשיו "מכסה" אותו כשכבה, לא בגלילה קלאסית** (בקשת הלקוח מפורשת). מומש ע"י `ScrollTrigger` עם `pin:true, pinSpacing:false, start:'top top', end:'+=100%'` על ה-Hero עצמו — הוא נשאר `fixed`, וה-100vh הטבעי של גלילת AboutCircle מעלה אותו מעליו (בזכות סדר ה-DOM, בלי צורך ב-z-index).
- **AboutCircle.tsx**:
  - **הוסר וידאו הרקע** (היה כפילות עם וידאו ה-Hero שמתחתיו) — הוחלף ברקע כחול אחיד `var(--bg)`.
  - כותרות הקטגוריה במרכז הטבעת: `1.5vw`→**`1.8vw`** (+20%), צבע `var(--brand)`→**לבן**, משקל `700`→**`900`**.
  - **שלב 0 (פתיחה) קיבל כותרת "יבוא"** — קודם היה רק טקסט אינטרו בלי כותרת; הסגמנט הפעיל בפתיחה (ימין-עליון) הוא "יבוא", אז הכותרת עכשיו תואמת.

### עמוד צור קשר — `/contact`
- הירו וידאו מלא מסך עם שכבת overlay (#2A3950E5). קונטיינר RTL, כרטיס מידע ירוק + טופס (שם/טלפון/מייל/הודעה/כפתור). Client component עם state שליחה (idle/sending/sent) — **עדיין setTimeout mock, לא מחובר ל-API אמיתי**.
- **כפתור "צרו קשר"**: `padding: 10px 40px` (היה `10px 32px`) — הוגדר דרך `.contact-form .contact-submit` (specificity גבוה, ראה "לקחים").
- **מותאם למובייל — כלל כמה באגים אמיתיים וחמורים, לא רק פוליש**:
  - **הטופס כולו היה בלתי נגיש במובייל** — `.contact-bottom` שם כרטיס-מידע קבוע (338px) וטופס באותה שורה בלי wrap; `.contact-hero{overflow:hidden}` **חתך** את מה שגלש במקום לתת לגלול, אז הטופס פשוט נעלם. תוקן: `flex-direction:column` במובייל + כרטיס `width:100%;height:auto` + `.contact-form-row` גם `column`.
  - **גדלי טקסט `vw` בלי רצפת px** צנחו ל-**3.75-4.5px** (בלתי קריא) — `.contact-input`, `.contact-submit`, `.contact-subtitle`, `.contact-info-item` כולם קיבלו רצפת **16px** במובייל (גם פותר auto-zoom מעצבן ב-Safari iOS מתחת ל-16px).
  - **כותרת/טקסט חפפו את ההאדר הצף** — `.contact-hero` ממרכז אנכית, ותוכן ארוך "נדחף" מעל ההאדר. תוקן: `align-items:flex-start` + `min-height:100vh` (במקום `height:100vh` הקשיח, כדי לא לחתוך תוכן) על ה-hero, ו-`padding-top:130px` על `.contact-container` במובייל.
  - **שדות הטופס התכווצו לרוחב התוכן** (לא נמתחו לרוחב מלא) אחרי המעבר ל-column — אותה מלכודת RTL/flex-column (ראה "לקחים"): `.contact-bottom`'s `align-items:flex-start` (תקין לפריסת שורה) הפך לבעייתי בעמודה. תוקן עם `align-items:stretch` override במובייל.

### עמוד אחריות חברתית — `/social-responsibility`
- 5 אזורים: הירו וידאו (55vh), כותרות, 3 קוביות ירוקות (#9CEE8C) עם אייקון/כותרת/טקסט/רשימה, סקשן CTA, קרוסלת תמונות (2 שורות נעות בכיוונים מנוגדים).
- כפתור CTA ("ליצירת קשר"): `padding-left/right: 40px` (`.social-cta-section .division-cta`).
- **`SocialAnimations.tsx`** — אנימציות כניסה: זום הירו, fade-up כותרות, stagger 3 הקוביות, reveal סקשן ה-CTA.
- **מותאם למובייל** — העמוד כבר נכתב עם `clamp()` בכל הטקסטים (אין באגי קריאות כמו בעמודים אחרים); בוצע כיווץ ריפודים בלבד לעקביות (`6vw 5vw`→`32px 20px` וכו').
- **⚠️ קרוסלת התמונות — לולאה אינסופית לא סגורה לגמרי, זו החלטת לקוח מודעת**:
  - **האבחון**: כל שורה מכילה 2 עותקים של סט 4 תמונות (רוחב שורה ~2672px). האנימציה זזה ב-50% מרוחב השורה (1336px) — קטן מרוב רוחבי מסך דסקטופ (1440px+), ולכן בשיא הגלילה נחשף רקע כחול.
  - **נוסו ותועדו 2 תיקונים טכניים שעבדו במדידה אך נדחו ע"י הלקוח**: (א) 4 עותקים + `gap` + תרגום `-25%` — סגר את הפער (מדוד: מכסה עד 4032px רוחב) אך השאיר "קפיצה" זעירה (~4px) בנקודת הלולאה בגלל שפריט אחרון ב-flex עם `gap` לא מקבל רווח עוקב; (ב) אותו מנגנון אך עם `margin-inline-end` על כל תמונה במקום `gap` (מדפוס `.ticker-track` המוכח) — תיקן את הקפיצה לדיוק פיקסלי מושלם (אומת: crops זהים ב-0% וב-25%).
  - **הלקוח ביקש לחזור למפרט מדויק משלו**: 2 עותקים, `flex`+`gap`, `translateX(-50%)`. יושם בדיוק כך. **נמדד אמפירית ב-6 רוחבי מסך (1280-3440px) שהמפרט הזה משאיר פער אמיתי מעל 1336px** (עד 2104px ב-3440px) — הוצג ללקוח, שבחר במפורש להשאיר את הגרסה הזו על אף הפער התיעוד. **מצב נוכחי = טרייד-אוף מודע של הלקוח, לא באג שנשאר לתקן.**

### האדר ופוטר (גלובליים)
- **SiteHeader.tsx** — "כרית זכוכית" צפה (fixed, backdrop-filter: blur), לוגו + ניווט. **⚠️ לא responsive** — התפריט נחתך במובייל (לא טופל, מחוץ לתחום העבודות של היום).
- **SiteFooter.tsx** — 4 עמודות, אלמנט גרפי tree-footer.png.
- SmoothScroll — GSAP Lenis integration.

### אנימציות
- **useReveal.ts** — hook אחיד: IntersectionObserver + immediate viewport check.
- **Word reveal** — CSS transitions עם stagger: AboutTeaser, Umbrella, PartnersGrid.
- **DivisionsSplit** — sticky scroll, crossfade + translateY, snap. **7 לוגואי החטיבות תוקנו** — היו ממורכזים בקנבס PNG עם ריפוד שקוף אסימטרי, ולכן נראו מוזזים משמאל לטקסט; הוצמדו לימין (padR→0) בסקריפט Python/PIL, בלי לשנות את גודל הקנבס (שומר יחס-גודל בין הלוגואים) או המיקום האנכי. מקור גובה ל-`scratchpad/logo-backup/`.
- **StatsHighlights** (מספרים רצים בדף הבית) — **תוקן**: המספר הראשון (1,200 אוטובוסים) היה סופר על טעינת הדף (מבוסס-זמן), ומסתיים הרבה לפני שהמשתמש גולל אליו. הוחלף ל-ScrollTrigger נפרד מבוסס-scrub שסופר בזמן שהסקשן עולה למסך (`top bottom`→`top top`) — ממורכז לאורך כל הכניסה, מסיים בדיוק כשהסקשן ננעל.
- **DivisionHeading** — fade-in + stagger words.
- **Partners hover glow** — ellipse positioned at bottom with blur.

## לקחים כלליים (חשוב לזכור לעבודה עתידית)

1. **מלכודת RTL + `flex-direction: column`**: ב-flex column, ה-cross-axis (אופקי) הולך לפי `inline-start`/`inline-end`, וזה **הפוך מהאינטואיציה ב-RTL** — `flex-start` נוחת **בימין**, ו-`flex-end` נוחת **בשמאל**. נתקלנו בזה **3 פעמים נפרדות** היום (`.good-to-know-card`, `.division-heading` במובייל, `.contact-bottom`/שדות טופס במובייל). כלל אצבע: לרצות "ימין" ב-flex column → `flex-start`.
2. **CSS specificity/source-order כשמשתפים כיתה כמו `.division-cta`**: הכיתה הזו משמשת ב-5+ מקומות (עמוד חטיבה, לובי חטיבות, אחריות חברתית, צור קשר, AboutTeaser). דריסת `padding` שלה **חייבת selector עם specificity גבוה יותר** (למשל `.division-text .division-cta`), **לא** הגדרה חוזרת של אותה כיתה בודדת באותה רמת specificity — אחרת "האחרון בקובץ מנצח" בלי קשר לאיפה ערכת (קרה עם `.contact-submit` מול `.division-cta` שמוגדרת אחריו בקובץ).
3. **שינוי שדה Payload מ-`textarea`/`text` ל-`richText`**: Postgres לא יכול להמיר טור טקסט קיים ל-`jsonb` אוטומטית (`ALTER COLUMN ... SET DATA TYPE jsonb` נכשל) — וכישלון ה-push מפיל את **כל** אתחול Payload (כולל admin!). צריך סקריפט מיגרציה ידני (Node + `pg`) שממיר את התוכן הקיים ל-JSON תקין של lexical **לפני** ש-Payload מנסה לעשות push, בתוך טרנזקציה.
4. **Playwright `fullPage: true` לא תמיד מפעיל ScrollTrigger reveals** — צילום מסך מלא לפעמים "מפספס" אנימציות מבוססות-scroll (התוכן קיים אך `autoAlpha:0`/`visibility:hidden` כי ה-trigger לא ירה). לאימות אמין: לגלול בפועל בצעדים (`window.scrollTo` בלולאה + `waitForTimeout`) לפני צילום/מדידה.
5. **אנימציית marquee אינסופית**: הרוחב הכולל של השורה (אחרי הכפלה) חייב לכסות את רוחב ה-viewport **גם בנקודת הגלילה הקיצונית ביותר**, לא רק בהתחלה — הנוסחה: `(מס' עותקים − יחס-התרגום⁻¹) × רוחב-סט-אחד ≥ רוחב-מסך-מקסימלי-צפוי`. `gap` בין flex-items משאיר את הפריט האחרון בלי רווח עוקב (אי-דיוק קטן ב-boundary); `margin` על כל פריט (כמו ב-`.ticker-track`) נותן דיוק פיקסלי מושלם.

## החלטות עיצוב

**צבעים** (`styles.css`, `:root`):
```css
--bg: #2a3950;      /* רקע */
--text: #ffffff;    /* טקסט */
--brand: #9cee8c;   /* ירוק בהיר */
--brand-2: #60d3aa; /* טורקיז */
```

**טיפוגרפיה** — סולם רספונסיבי עם `clamp()`. **הערה**: לא כל הרכיבים באתר עקביים — חלק (h1-h3, `--body`) משתמשים ב-`clamp()` עם רצפת px; חלק (רוב הטקסטים בעמוד חטיבה, צור קשר — לפני תיקוני היום) השתמשו ב-`vw` גולמי בלי רצפה, מה שגרם לטקסט בלתי קריא במובייל. הדפוס שאומץ בתיקוני מובייל של היום: `vw` בדסקטופ + override מפורש ב-`@media (max-width:768px)` לערך px קבוע (לא המרה ל-`clamp()`).

**RTL** — כל "פריט ראשון ב-DOM" מוצג בצד ימין אוטומטית ב-flex/grid רגילים. **לא** נכון ב-`flex-direction:column` (ראה "לקחים כלליים" #1).

## מה נשאר

- **התאמת מובייל** — הושלמה במלואה עבור: **עמוד חטיבה** (`/divisions/[slug]`), **עמוד צור קשר** (`/contact`), **עמוד אחריות חברתית** (`/social-responsibility`). **טרם טופלו**: דף הבית (`/`), עמוד אודות (`/about`), עמוד לובי חטיבות (`/divisions` — רק הגריד קיבל breakpoint, שאר העמוד לא נבדק), **וה-SiteHeader/SiteFooter הגלובליים** (התפריט של ההאדר נחתך במובייל — נצפה אך לא טופל).
- **קרוסלת התמונות באחריות חברתית** — לולאה אינסופית לא סגורה במלואה בגלל בחירת לקוח מודעת (2 עותקים בלבד). אם ירצה לסגור את הפער בעתיד תוך שמירה על אותה טכניקה (flex+gap), הפתרון הבדוק זמין: 4 עותקים + תרגום `-25%`.
- **טקסטים placeholder בסקשן הטבעת** (`AboutCircle.tsx`) — 5 הטקסטים של הפעלה/תחזוקה/הכשרה והסמכה/תשתיות/יבוא עדיין דמה, ממתינים לתוכן סופי מהלקוח.
- **טופס צור קשר** — עדיין `setTimeout` mock, לא מחובר ל-API אמיתי לשליחת פניות.
- **דיוקים אחרונים** — אייקוני סושיאל (placeholder), כתובות URL אמיתיות, תמונות צוות ברזולוציה גבוהה (עמוד אודות).
