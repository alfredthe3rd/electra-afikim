import type { GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { href, image, LINES_HINT, list, text, textarea, video } from './fields'

export const Social: GlobalConfig = {
  slug: 'social',
  label: 'אחריות חברתית',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'פתיחה',
          fields: [
            video('video', 'סרטון פתיחה'),
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה'),
          ],
        },
        {
          name: 'cards',
          label: 'קוביות',
          fields: [
            list('items', 'קוביות', 'קובייה', [
              image('icon', 'אייקון'),
              text('title', 'כותרת'),
              textarea('text', 'טקסט'),
              textarea('list', 'רשימה', LINES_HINT),
            ]),
          ],
        },
        {
          name: 'cta',
          label: 'קריאה לפעולה',
          fields: [
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה'),
            text('label', 'טקסט הכפתור'),
            href('href', 'קישור הכפתור'),
          ],
        },
        {
          name: 'carousel',
          label: 'קרוסלת תמונות',
          fields: [
            list('row1', 'שורה עליונה', 'תמונה', [image('image', 'תמונה')], { minRows: 1 }),
            list('row2', 'שורה תחתונה', 'תמונה', [image('image', 'תמונה')], { minRows: 1 }),
          ],
        },
      ],
    },
  ],
}
