import path from 'path'
import type { GlobalSlug, Payload, PayloadRequest } from 'payload'

import accessibilityBody from './accessibility.json'
import privacyBody from './privacy.json'

// The site's content as it was hard-coded before the control panel existed.
// Runs once, inside the migration that creates the globals, so the panel opens
// full and the site never renders with empty content.

const siteName = 'אלקטרה אפיקים'

type Uploader = (file: string, alt: string) => Promise<number>

const content = async (upload: Uploader) => {
  const logo = await upload('main-logo-electra.png', siteName)
  const slide = (file: number, text: string) => ({
    defaultVideo: `/movie-${file}.mp4`,
    logo: 0,
    text,
  })
  const slides = [
    slide(
      1,
      'הפעלה וניהול של מערכי תחבורה ציבורית בהיקפים רחבים, בפריסה ארצית, תוך עמידה בסטנדרטים מתקדמים של שירות, בטיחות ויעילות תפעולית.',
    ),
    slide(
      2,
      'פתרונות הסעה מותאמים לארגונים, מוסדות וגופים ציבוריים - משירותים שוטפים ועד פרויקטים ייעודיים, בליווי מערך תפעולי מתקדם.',
    ),
    slide(
      3,
      'שותפות בפרויקטים לאומיים של רכבת קלה, כחלק מפיתוח תשתיות התחבורה של ישראל, תוך שילוב יכולות תפעול, תחזוקה וניהול מערכות מורכבות.',
    ),
    slide(
      4,
      'ייבוא, שיווק ושילוב של אוטובוסים ופתרונות תחבורה מתקדמים ובטכנולוגיות חשמליות חדשניות. הייבוא נעשה בהתאמה לדרישות הרגולציה ולצרכים התפעוליים של השוק הישראלי.',
    ),
    slide(
      5,
      'מערכי תחזוקה מתקדמים, מוסכים, חניונים ותשתיות טעינה ותפעול - המבטיחים רציפות תפעולית, בטיחות וזמינות גבוהה לציי רכב ולמערכות תחבורה מורכבות.',
    ),
    slide(
      6,
      'הכשרת דור העתיד של אנשי התחבורה וכוח האדם המקצועי בישראל, במכללה ייעודית למקצועות התחבורה. תוך פיתוח תכניות לימוד, קורסים, והכשרה מקצועית - כחלק מהשקעה ארוכת טווח בהון האנושי ובאיכות השירות.',
    ),
    slide(
      7,
      'שימוש בטכנולוגיה חדשנית, המאפשרת ללקוחות פרטיים ועסקיים להזמין הסעה בכל יעד ובכל מטרה - בקלות, בשקיפות ובזמינות מלאה.',
    ),
  ]
  for (const [i, row] of slides.entries()) {
    row.logo = await upload(`logo-${i + 1}.png`, `לוגו חטיבה ${i + 1}`)
  }

  const partnerFiles: [string, string][] = [
    ['אלקטרה.png', 'אלקטרה'],
    ['אשדוד.png', 'אשדוד'],
    ['יוטונג.png', 'יוטונג'],
    ['מדינת ישראל.png', 'מדינת ישראל'],
    ['מוביט.png', 'מוביט'],
    ['מעלה אדומים.png', 'מעלה אדומים'],
    ['משרד בטחון.png', 'משרד הביטחון'],
    ['משרד תחבורה.png', 'משרד התחבורה'],
    ['פורום תחבצ.png', 'פורום תחב״צ'],
    ['פ״ת.png', 'פתח תקווה'],
    ['ראש העין.png', 'ראש העין'],
    ['רפאל.png', 'רפאל'],
    ['תעשייה אויירית.png', 'התעשייה האווירית'],
  ]
  const partners = []
  for (const [file, alt] of partnerFiles) {
    partners.push({ logo: await upload(`logos to home/${file}`, alt) })
  }

  const iconFiles = [
    'הפעלת תחבורה ציבורית',
    'מערכי היסעים מתקדמים',
    'ניהול ותפעול רכבות קלות',
    'יבוא אוטובוסים וטכנולוגיות',
    'תחזוקה ותשתיות',
    'הכשרה והסמכה',
    'הסעות פרטיות',
  ]
  const icons = []
  for (const label of iconFiles) {
    icons.push({ icon: await upload(`about page/icons section 3/${label}.svg`, label), label })
  }

  const member = async (name: string, role: string, file: string) => ({
    name,
    photo: await upload(`about page/team img/${file}`, name),
    role,
  })

  const socialCard = async (
    file: string,
    title: string,
    text: string,
    list: string[],
  ) => ({
    icon: await upload(`socail page/${file}`, title),
    list: list.join('\n'),
    text,
    title,
  })

  const carouselImage = async (file: string, n: number) => ({
    image: await upload(`socail page/${file}`, `תמונה מפעילות חברתית ${n}`),
  })

  const social = (label: string, icon: string) =>
    upload(icon, label).then((id) => ({ icon: id, label, url: '#' }))

  return {
    'site-settings': {
      brand: { logo, siteName, siteUrl: 'https://electra-afikim-group.co.il' },
      contactDetails: {
        address: 'הערבה 1 בניין SIV גבעת שמואל',
        dialCtaLabel: 'חייגו 6686*',
        dialHref: 'tel:*6686',
        phoneLabel: '6686*',
      },
      footer: {
        contactHeading: 'פרטי התקשרות',
        creditText: 'קבוצת סיון – מיתוג I שיווק בדיגיטל I בניית אתרים',
        creditUrl: 'https://sivan-group.net/',
        divisionsHeading: 'תחומי פעילות',
        graphic: await upload('tree-footer.png', 'גרפיקת עץ בפוטר'),
        legal: [
          { href: '/privacy-policy', label: 'מדיניות פרטיות' },
          { href: '/accessibility', label: 'הצהרת נגישות' },
        ],
        nav: [
          { href: '/', label: 'בית' },
          { href: '/about', label: 'אודות' },
          { href: '/divisions', label: 'תחומי פעילות' },
          { href: '/social-responsibility', label: 'אחריות חברתית' },
        ],
        navHeading: 'ניווט מהיר',
        social: [
          await social('פייסבוק', 'facebook-icon.svg'),
          await social('אינסטגרם', 'instagram-icon.svg'),
          await social('יוטיוב', 'youtube-icon.svg'),
        ],
      },
      header: {
        mobileCtaHref: '/contact',
        mobileCtaLabel: 'צרו קשר',
        nav: [
          { href: '/', label: 'דף הבית' },
          { href: '/about', label: 'אודות' },
          { href: '/divisions', label: 'חטיבות' },
          { href: '/social-responsibility', label: 'אחריות חברתית' },
          { href: '/contact', label: 'צרו קשר' },
        ],
      },
      meta: {
        description:
          'קבוצת אלקטרה אפיקים היא קבוצת התחבורה המובילה בישראל, הפועלת כקורת גג אחת למכלול רחב של פתרונות תחבורה מתקדמים.',
        title: `${siteName} | מעצמת התחבורה של ישראל`,
      },
    },

    home: {
      about: {
        ctaHref: '/about',
        ctaLabel: 'אודות אלקטרה אפיקים',
        text: 'קבוצת אלקטרה אפיקים היא קבוצת התחבורה המובילה בישראל, הפועלת כקורת גג אחת למכלול רחב של פתרונות תחבורה מתקדמים. הקבוצה משלבת תכנון, הפעלה, טכנולוגיה, תשתיות, הכשרה, תחזוקה וחדשנות - כדי לייצר מערכות תחבורה חכמות, בטוחות ויעילות.',
        title: 'שותפים אסטרטגיים בפתרונות תחבורה מתקדמים',
      },
      divisions: {
        slides,
        subtitle:
          'אלקטרה אפיקים מרכזת תחתיה מגוון תחומי פעילות משלימים,\nהיוצרים מעטפת מלאה לכל אתגר במעגל החיים',
        title: 'קורת גג אחת לעולם התחבורה',
      },
      hero: {
        scrollCueLabel: 'גללו מטה',
        subtitle: 'מניעים אותך ואת התחבורה בישראל - קדימה',
        titleLine1: 'מעצמת התחבורה',
        titleLine2: 'של ישראל',
      },
      meta: {
        description:
          'קבוצת אלקטרה אפיקים היא קבוצת התחבורה המובילה בישראל, הפועלת כקורת גג אחת למכלול רחב של פתרונות תחבורה מתקדמים.',
        title: `${siteName} | מעצמת התחבורה של ישראל`,
      },
      partners: {
        logos: partners,
        titleLine1: 'גאים לעבוד בשותפות עם הגופים',
        titleLine2: 'שמובילים את התחבורה בישראל',
      },
      stats: {
        items: [
          { legendText: 'אוטובוסים בצי הרכבים', number: 1200, overlayText: 'אוטובוסים', suffix: '' },
          { legendText: 'נוסעים בשנה', number: 52, overlayText: 'נוסעים', suffix: 'M' },
          { legendText: 'עובדים ומקצוענים', number: 2200, overlayText: 'עובדים', suffix: '' },
          { legendText: 'חטיבות', number: 7, overlayText: 'חטיבות', suffix: '' },
        ],
        subtitle: 'חברת התחבורה הגדולה בישראל, והשלישית בגודלה בתחום התחבורה הציבורית',
        title: 'יתרון הגודל. עומק הניסיון. הראייה קדימה',
      },
    },

    about: {
      hero: {
        steps: [
          {
            text: 'כחברה המפעילה כ-280 קווי שירות ומסיעה כ-52 מיליון נוסעים בשנה, אנו מהווים עורק חיים מרכזי במשק הישראלי. הפעילות שלנו מתאפיינת בניהול מבוסס נתונים, הקפדה על דיוק במבצעי ושיפור מתמיד של חוויית הנוסע.',
            title: 'יבוא',
          },
          {
            text: 'הפעלה וניהול של מערכי תחבורה ציבורית בפריסה ארצית, תוך עמידה בסטנדרטים מתקדמים של שירות ובטיחות.',
            title: 'הפעלה',
          },
          {
            text: 'מערכי תחזוקה מתקדמים, מוסכים ותשתיות טעינה - המבטיחים רציפות תפעולית וזמינות גבוהה לציי הרכב.',
            title: 'תחזוקה',
          },
          {
            text: 'הכשרת דור העתיד של אנשי התחבורה בישראל, במכללה ייעודית לפיתוח מקצועי ואיכות השירות.',
            title: 'הכשרה והסמכה',
          },
          {
            text: 'פיתוח ותחזוקה של תשתיות תחבורה מתקדמות, כחלק ממחויבותנו לצמיחה ארוכת טווח של ענף התחבורה.',
            title: 'תשתיות',
          },
          {
            text: 'ייבוא ושילוב של אוטובוסים ופתרונות תחבורה חדשניים, בהתאמה לדרישות הרגולציה ולצרכי השוק הישראלי.',
            title: 'יבוא',
          },
        ],
        subtitle:
          'אלקטרה אפיקים מהווה כיום את חוד החנית של ענף התחבורה בישראל. החברה, שהחלה את דרכה בשנת 2008 עם זכייה באשכול שומרון, עברה קפיצת מדרגה אסטרטגית בשנת 2021 עם רכישת השליטה על ידי קבוצת אלקטרה ומיזוג פעילות "אגד תעבורה".',
        title: 'חוד החנית של ענף התחבורה בישראל',
      },
      icons: { items: icons, title: 'קורת גג אחת - מערכת הוליסטית אחת' },
      meta: {
        description:
          'אלקטרה אפיקים מהווה כיום את חוד החנית של ענף התחבורה בישראל. הכירו את הקבוצה, החזון, הערכים וצוות ההנהלה.',
        title: `אודות | ${siteName}`,
      },
      story: {
        milestones: [
          { lines: 'זכייה באשכול שומרון והקמת אפיקים', year: '2008' },
          {
            lines:
              'רכישת פעילות התחבורה הציבורית Connex\n(Veolia) - אשכולות בני ברק אשדוד וטבריה',
            year: '2011',
          },
          { lines: 'תחילת הפעלה באשכול אשדוד בין-עירוני', year: '2015' },
          { lines: 'תחילת הפעלה באשכולות אשדוד עירוני ופתח תקווה - ראש העין', year: '2016' },
          {
            bullets: true,
            lines: 'רכישת השליטה ע"י קבוצת אלקטרה\nמיזוג פעילות "אגד תעבורה"',
            year: '2021',
          },
          {
            bullets: true,
            lines:
              'ייבוא אוטובוסים (Yutong)\nזכייה במכרז קו רכבת קלה חיפה-נצרת\nפתיחת המכללה למקצועות התחבורה\nחידוש צי הרכב ורכש של כ- 475 אוטובוסים',
            year: '2024',
          },
          {
            bullets: true,
            lines: 'פיתוח אפליקציה RideEazy\nחידוש צי הרכב ורכש כ- 227 אוטובוסים',
            year: '2025',
          },
          { lines: 'רכש 150 אוטובוסים לחידוש צי הרכב', year: '2026' },
        ],
        subtitle: 'אבני הדרך בהתפתחות הקבוצה',
        title: 'הסיפור שלנו',
      },
      team: {
        bottomRow: [
          await member('עו"ד שרון שלמה קרואני', 'יועצת משפטית', 'שרון שלמה.png'),
          await member('ערן מונרוב', 'סמנכ"ל משאבי אנוש', 'ערן-מונרוב-1.webp'),
          await member('איציק הדר', 'סמנכ"ל נכסים ותשתיות', 'איציק-הדר-1.webp'),
          await member('רועי אברהמי', 'סמנכ"ל אחזקה ובטיחות', 'רועי-אברהמי-1.webp'),
          await member('אשר שיטרית', 'סמנכ"ל תכנון ובקרה', 'Asher_Shitrit.webp'),
          await member('יוסי בוחבוט', 'סמנכ"ל לוגיסטיקה ורכש', 'יוסי-בוחבוט-1.webp'),
        ],
        title: 'צוות ההנהלה',
        topRow: [
          await member('טל כהן', 'מנכ"ל', 'טל-כהן-4.webp'),
          await member('יהודה הכהן', 'מנכ"ל חטיבת התחבורה ציבורית', 'יהודה-כהן.webp'),
          await member('שי יצחקוב', 'סמנכ"ל כספים', 'שי-יצחקוב-1.webp'),
          await member('שי מלכה', 'Customer success & innovation', 'shaimalka.webp'),
          await member('יניב שונים', 'סמנכ"ל טכנולוגיות ומערכות מידע', 'YanivShonim-1.jpg'),
        ],
      },
      values: {
        items: [
          { number: '01', title: 'מקצוענות ואחריות' },
          { number: '02', title: 'מצוינות תפעולית' },
          { number: '03', title: 'בטיחות ללא פשרות' },
          { number: '04', title: 'חדשנות מתמדת' },
          { number: '05', title: 'שותפות ארוכת טווח' },
          { number: '06', title: 'מחויבות לציבור ולסביבה' },
        ],
        title: 'ערכים שמניעים אותנו',
      },
      vision: {
        cards: [
          {
            text: 'הפעלה איכותית ברמת ביצוע ושירותיות גבוהה, תוך מימוש כלים כלכליים בכל מרכיבי העשייה',
            title: 'מצוינות תפעולית וכלכלית',
          },
          { text: 'חיזוק המקצועיות והשירותיות של המשאב האנושי בחברה', title: 'העובד במרכז' },
          {
            text: 'צמיחה, הרחבת פעילות, הגדלת נתח השוק וכניסה לתחומים חדשים',
            title: 'פיתוח עסקי',
          },
          { text: 'שיפור הבטיחות בכל מרכיבי העשייה', title: 'בטיחות' },
        ],
        subtitle: 'אלקטרה אפיקים מובילה בתחום התחבורה,\nצומחת, חדשנית, מצוינת תפעולית וכלכלית',
        title: 'החזון שלנו',
      },
    },

    lobby: {
      division: {
        goodToKnowHeading: 'כדאי לדעת עלינו',
        statsHeading: 'הפעילות שלנו במספרים',
        visitSiteLabel: 'בקרו באתר',
      },
      meta: {
        description: 'קבוצת אלקטרה אפיקים פועלת במגוון תחומים משלימים, היוצרים יחד מעטפת מלאה.',
        title: `חטיבות | ${siteName}`,
      },
      page: {
        ctaLabel: 'למידע מורחב',
        subtitle: 'קבוצת אלקטרה אפיקים פועלת במגוון תחומים משלימים, היוצרים יחד מעטפת מלאה.',
        tickerHighlight: 'מערכת אחת.',
        tickerMuted: 'שפה אחת. סטנדרט אחד.',
        title: 'פתרונות מקיפים לכל צורכי התחבורה',
      },
    },

    social: {
      carousel: {
        row1: [
          await carouselImage('image carusel 1.jpg', 1),
          await carouselImage('image caruel 2.jpg', 2),
          await carouselImage('image carusel 3.jpg', 3),
          await carouselImage('image carusel 4.jpg', 4),
        ],
        row2: [
          await carouselImage('image carusel 5.jpg', 5),
          await carouselImage('image carusel 6.jpg', 6),
          await carouselImage('image carusel 7.jpg', 7),
          await carouselImage('image carusel 8.jpg', 8),
        ],
      },
      cards: {
        items: [
          await socialCard(
            'icon socail 1.svg',
            'אחריות סביבתית',
            'התייעלות אנרגטית, צמצום פליטות פחמן, מעבר לאנרגיות מתחדשות, מניעת זיהום ומחזור.',
            ['צי אוטובוסים חשמלי', 'עמידה בתקני זיהום', 'הפחתת פליטות'],
          ),
          await socialCard(
            'icon socail 2.svg',
            'אחריות קהילתית',
            'שמירה על זכויות אדם, תנאי העסקה הוגנים, גיוון והכלה, בטיחות בעבודה ותרומה לקהילה.',
            ['שילוב וגיוון אוכלוסיות', 'יצירת מקומות תעסוקה', 'פעילות והתנדבות בקהילה'],
          ),
          await socialCard(
            'icon social 3.svg',
            'אחריות תאגידית',
            'ניהול תקין של החברה. כולל את מבנה הדירקטוריון, שקיפות מול משקיעים, מניעת שחיתות וניגודי עניינים, ואתיקה מקצועית.',
            ['התנהלות אתית', 'ציות לרגולציה', 'בקרת איכות'],
          ),
        ],
      },
      cta: {
        href: '/contact',
        label: 'ליצירת קשר',
        subtitle:
          'אנחנו מזמינים אתכם לכתוב לנו כיצד אנחנו יכולים לפעול טוב יותר למען החברה והסביבה בישראל.',
        title: 'לפניות, שאלות והצעות בנושא אחריות חברתית',
      },
      hero: {
        subtitle:
          'כקבוצה המשרתת מיליוני אזרחים וכשותפה בפרויקטים המעצבים את התחבורה והתנועה בישראל, חשוב לנו לשמור על סטנדרטים של מחויבות, אחריות ושותפות.',
        title: 'אחריות חברתית',
      },
      meta: { title: `אחריות חברתית | ${siteName}` },
    },

    contact: {
      form: {
        emailPlaceholder: 'דוא"ל',
        messagePlaceholder: 'ההודעה שלי',
        namePlaceholder: 'שם מלא',
        phonePlaceholder: 'טלפון',
        sendingLabel: 'שולח...',
        sentLabel: 'נשלח בהצלחה!',
        submitLabel: 'צרו קשר',
      },
      meta: { title: `צור קשר | ${siteName}` },
      page: {
        subtitle:
          'כקבוצת תחבורה המניעה מיליוני אזרחים, אנו רואים בעצמנו שותף מרכזי לעיצוב פני החברה והסביבה בישראל.\nהמחויבות שלנו חורגת מעבר למדדים העסקיים ונוגעת בלב האתגרים הלאומיים.',
        title: 'דברו איתנו',
      },
    },

    accessibility: {
      meta: { title: `הצהרת נגישות | ${siteName}` },
      page: {
        addressLabel: 'כתובת:',
        bodyBottom: accessibilityBody.bottom,
        bodyTop: accessibilityBody.top,
        contacts: [
          {
            address: 'הערבה 1, גבעת שמואל – עבור מר יצחק הדר.',
            email: 'izikad@electra.co.il',
            name: 'יצחק הדר',
            phone: '073-201-4000',
          },
          {
            address: 'הערבה 1, גבעת שמואל – עבור מר שי סעדון.',
            email: 'shaysd@electra.co.il',
            name: 'שי סעדון',
            phone: '073-201-4000',
          },
        ],
        emailLabel: 'דואר אלקטרוני:',
        phoneLabel: 'טלפון:',
        title: 'הצהרת נגישות',
      },
    },

    privacy: {
      meta: { title: `מדיניות פרטיות | ${siteName}` },
      page: {
        body: privacyBody.body,
        title: 'מדיניות פרטיות',
        updatedLabel: 'עודכן לאחרונה: 08/09/2025',
      },
    },
  }
}

export async function seedContent(payload: Payload, req: PayloadRequest): Promise<void> {
  // One media document per file, even when a file is used in several places.
  const uploaded = new Map<string, number>()
  const upload: Uploader = async (file, alt) => {
    const known = uploaded.get(file)
    if (known) return known
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.resolve(process.cwd(), 'public', file),
      req,
    })
    uploaded.set(file, doc.id)
    return doc.id
  }

  const globals = await content(upload)
  for (const [slug, data] of Object.entries(globals)) {
    await payload.updateGlobal({
      data: data as never,
      req,
      slug: slug as GlobalSlug,
    })
  }
}
