import type { GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { LINES_HINT, text, textarea, video } from './fields'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'צור קשר',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'page',
          label: 'תוכן העמוד',
          description: 'הטלפון והכתובת נערכים ב"הגדרות כלליות".',
          fields: [
            video('video', 'סרטון רקע'),
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה', LINES_HINT),
          ],
        },
        {
          name: 'form',
          label: 'טופס',
          fields: [
            text('namePlaceholder', 'שדה שם'),
            text('phonePlaceholder', 'שדה טלפון'),
            text('emailPlaceholder', 'שדה דוא"ל'),
            text('messagePlaceholder', 'שדה הודעה'),
            text('submitLabel', 'כפתור שליחה'),
            text('sendingLabel', 'טקסט בזמן שליחה'),
            text('sentLabel', 'טקסט אחרי שליחה'),
          ],
        },
      ],
    },
  ],
}
