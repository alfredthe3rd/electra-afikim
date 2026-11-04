import type { GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { href, image, list, optionalText, text } from './fields'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'הגדרות כלליות',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'brand',
          label: 'מותג וכתובת האתר',
          fields: [
            text('siteName', 'שם האתר'),
            image('logo', 'לוגו ראשי', 'מוצג בפתיחת דף הבית, בהאדר, בתפריט המובייל ובפוטר.'),
            text(
              'siteUrl',
              'כתובת האתר',
              'הכתובת הראשית בלי / בסוף. משמשת ל-Canonical, למפת האתר ולשיתוף ברשתות.',
            ),
          ],
        },
        {
          name: 'contactDetails',
          label: 'פרטי התקשרות',
          fields: [
            text('phoneLabel', 'טלפון לתצוגה'),
            text('address', 'כתובת'),
            text('dialCtaLabel', 'כפתור חיוג במובייל'),
            text('dialHref', 'קישור החיוג', 'לדוגמה tel:*6686'),
          ],
        },
        {
          name: 'header',
          label: 'האדר ותפריט',
          fields: [
            list('nav', 'קישורי התפריט', 'קישור', [text('label', 'טקסט'), href('href', 'קישור')]),
            text('mobileCtaLabel', 'כפתור קריאה לפעולה במובייל'),
            href('mobileCtaHref', 'קישור הכפתור'),
          ],
        },
        {
          name: 'footer',
          label: 'פוטר',
          fields: [
            image('graphic', 'גרפיקה בפוטר'),
            text('navHeading', 'כותרת ניווט מהיר'),
            list('nav', 'קישורי ניווט מהיר', 'קישור', [
              text('label', 'טקסט'),
              href('href', 'קישור'),
            ]),
            text('divisionsHeading', 'כותרת החטיבות', 'רשימת החטיבות עצמה נמשכת מ"חטיבות".'),
            text('contactHeading', 'כותרת פרטי התקשרות'),
            list('social', 'רשתות חברתיות', 'רשת', [
              text('label', 'שם הרשת'),
              text('url', 'כתובת', 'כתובת מלאה של העמוד ברשת.'),
              image('icon', 'אייקון'),
            ]),
            list('legal', 'קישורים משפטיים', 'קישור', [
              text('label', 'טקסט'),
              href('href', 'קישור'),
            ]),
            optionalText('creditText', 'קרדיט'),
            optionalText('creditUrl', 'קישור הקרדיט'),
          ],
        },
      ],
    },
  ],
}
