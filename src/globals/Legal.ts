import type { GlobalConfig } from 'payload'

import { GROUP, VERSIONS } from './shared'
import { list, optionalText, text } from './fields'

export const Accessibility: GlobalConfig = {
  slug: 'accessibility',
  label: 'הצהרת נגישות',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'page',
          label: 'תוכן העמוד',
          fields: [
            text('title', 'כותרת'),
            { name: 'bodyTop', type: 'richText', label: 'תוכן לפני אנשי הקשר', required: true },
            text('phoneLabel', 'תווית טלפון'),
            text('emailLabel', 'תווית דואר אלקטרוני'),
            text('addressLabel', 'תווית כתובת'),
            list('contacts', 'רכזי נגישות', 'רכז', [
              text('name', 'שם'),
              text('phone', 'טלפון'),
              text('email', 'דואר אלקטרוני'),
              text('address', 'כתובת'),
            ]),
            { name: 'bodyBottom', type: 'richText', label: 'תוכן אחרי אנשי הקשר', required: true },
          ],
        },
      ],
    },
  ],
}

export const Privacy: GlobalConfig = {
  slug: 'privacy',
  label: 'מדיניות פרטיות',
  admin: { group: GROUP },
  versions: VERSIONS,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'page',
          label: 'תוכן העמוד',
          fields: [
            text('title', 'כותרת'),
            { name: 'body', type: 'richText', label: 'תוכן', required: true },
            optionalText('updatedLabel', 'שורת "עודכן לאחרונה"'),
          ],
        },
      ],
    },
  ],
}
