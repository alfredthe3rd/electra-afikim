import type { GlobalConfig, Validate } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { href, image, LINES_HINT, list, optionalText, text, textarea, video } from './fields'

// A new slide has no file of its own to fall back on, so it needs an upload.
const slideVideo: Validate = (value, { siblingData }) =>
  value || (siblingData as { defaultVideo?: string }).defaultVideo
    ? true
    : 'יש להעלות סרטון לשקופית חדשה'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'עמוד הבית',
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
            text('titleLine1', 'כותרת, שורה ראשונה', 'כותרת קצרה: טקסט ארוך עלול לשבור את העימוד.'),
            text('titleLine2', 'כותרת, שורה שנייה'),
            text('subtitle', 'כותרת משנה'),
            text('scrollCueLabel', 'טקסט הגלילה'),
          ],
        },
        {
          name: 'about',
          label: 'אודות בקצרה',
          fields: [
            text('title', 'כותרת'),
            textarea('text', 'פסקה'),
            text('ctaLabel', 'טקסט הכפתור'),
            href('ctaHref', 'קישור הכפתור'),
          ],
        },
        {
          name: 'divisions',
          label: 'שקופיות החטיבות',
          fields: [
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה', LINES_HINT),
            list(
              'slides',
              'שקופיות',
              'שקופית',
              [
                image('logo', 'לוגו'),
                textarea('text', 'טקסט'),
                { ...video('video', 'סרטון'), validate: slideVideo },
                // The file this row shipped with, used until a video is uploaded.
                { name: 'defaultVideo', type: 'text', admin: { hidden: true } },
              ],
              { minRows: 2 },
            ),
          ],
        },
        {
          name: 'stats',
          label: 'נתונים',
          fields: [
            text('title', 'כותרת'),
            text('subtitle', 'כותרת משנה'),
            list(
              'items',
              'נתונים',
              'נתון',
              [
                { name: 'number', type: 'number', label: 'מספר', required: true },
                optionalText('suffix', 'סיומת', 'לדוגמה M עבור מיליון.'),
                text('overlayText', 'טקסט על המספר הגדול'),
                text('legendText', 'טקסט מקרא'),
              ],
              { minRows: 2 },
            ),
          ],
        },
        {
          name: 'partners',
          label: 'שותפים',
          fields: [
            text('titleLine1', 'כותרת, שורה ראשונה'),
            text('titleLine2', 'כותרת, שורה שנייה'),
            list('logos', 'לוגואים', 'לוגו', [
              image('logo', 'לוגו', 'הטקסט החלופי של התמונה משמש כשם השותף.'),
            ]),
          ],
        },
      ],
    },
  ],
}
