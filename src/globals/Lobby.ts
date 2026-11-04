import type { GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { text, textarea, video } from './fields'

export const Lobby: GlobalConfig = {
  slug: 'lobby',
  label: 'לובי ועמודי חטיבה',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'page',
          label: 'לובי החטיבות',
          fields: [
            video('video', 'סרטון פתיחה'),
            text('title', 'כותרת'),
            textarea('subtitle', 'כותרת משנה'),
            text('ctaLabel', 'טקסט כפתור בכרטיס חטיבה'),
            text('tickerHighlight', 'טיקר, חלק מודגש'),
            text('tickerMuted', 'טיקר, המשך'),
          ],
        },
        {
          name: 'division',
          label: 'עמוד חטיבה',
          description: 'הטקסטים שמשותפים לכל עמודי החטיבות. התוכן של כל חטיבה נמצא ב"חטיבות".',
          fields: [
            text('visitSiteLabel', 'טקסט כפתור האתר החיצוני'),
            text('statsHeading', 'כותרת הנתונים'),
            text('goodToKnowHeading', 'כותרת "כדאי לדעת"'),
          ],
        },
      ],
    },
  ],
}
