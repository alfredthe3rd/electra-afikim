import type { Field, GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { image, LINES_HINT, list, optionalText, text, textarea, video } from './fields'

const member: Field[] = [text('name', 'שם'), text('role', 'תפקיד'), image('photo', 'תמונה')]

export const About: GlobalConfig = {
  slug: 'about',
  label: 'אודות',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'פתיחה וגלגל',
          fields: [
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה'),
            video('video', 'סרטון רקע'),
            list(
              'steps',
              'שלבי הגלגל',
              'שלב',
              [optionalText('title', 'כותרת'), textarea('text', 'טקסט')],
              { minRows: 2 },
            ),
          ],
        },
        {
          name: 'icons',
          label: 'תחומי פעילות',
          fields: [
            text('title', 'כותרת'),
            list('items', 'פריטים', 'פריט', [image('icon', 'אייקון'), text('label', 'טקסט')]),
          ],
        },
        {
          name: 'vision',
          label: 'חזון',
          fields: [
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה', LINES_HINT),
            video('video', 'סרטון'),
            list('cards', 'כרטיסים', 'כרטיס', [text('title', 'כותרת'), textarea('text', 'טקסט')], {
              minRows: 2,
            }),
          ],
        },
        {
          name: 'values',
          label: 'ערכים',
          fields: [
            text('title', 'כותרת'),
            list('items', 'ערכים', 'ערך', [text('number', 'מספור'), text('title', 'כותרת')]),
          ],
        },
        {
          name: 'team',
          label: 'צוות ההנהלה',
          fields: [
            text('title', 'כותרת'),
            list('topRow', 'שורה עליונה', 'חבר הנהלה', member),
            list('bottomRow', 'שורה תחתונה', 'חבר הנהלה', member),
          ],
        },
        {
          name: 'story',
          label: 'ציר הזמן',
          fields: [
            text('title', 'כותרת'),
            text('subtitle', 'כותרת משנה'),
            list(
              'milestones',
              'אבני דרך',
              'אבן דרך',
              [
                text('year', 'שנה'),
                textarea('lines', 'טקסט', LINES_HINT),
                { name: 'bullets', type: 'checkbox', label: 'להציג כרשימה עם תבליטים' },
              ],
              {
                description:
                  'בדיוק 8 תחנות, כי המיקום של כל אחת מחושב על גרפיקת הכביש. הוספת תחנה דורשת שינוי עיצוב.',
                maxRows: 8,
                minRows: 8,
              },
            ),
          ],
        },
      ],
    },
  ],
}
