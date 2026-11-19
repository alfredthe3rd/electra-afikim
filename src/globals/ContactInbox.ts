import type { GlobalConfig } from 'payload'

import { INBOX_GROUP } from '../collections/ContactSubmissions'
import { text } from './fields'

// Kept apart from the "contact" global on purpose: the content seed in the
// cms_globals migration writes "contact" through the Local API with the current
// config, so new columns there would break that migration on a fresh database.
export const ContactInbox: GlobalConfig = {
  slug: 'contact-inbox',
  label: 'הגדרות פניות',
  admin: { group: INBOX_GROUP },
  access: { read: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'recipients',
      type: 'textarea',
      label: 'כתובות לקבלת פניות',
      required: true,
      admin: { description: 'כתובת דוא"ל אחת בכל שורה. כל פנייה מהטופס נשלחת לכל הכתובות.' },
      validate: (value: null | string | undefined) => {
        const lines = parseRecipients(value)
        if (!lines.length) return 'יש להזין לפחות כתובת אחת'
        const bad = lines.find((line) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line))
        return bad ? `כתובת לא תקינה: ${bad}` : true
      },
    },
    {
      name: 'publicEmail',
      type: 'email',
      label: 'כתובת דוא"ל להצגה באתר',
      admin: { description: 'מוצגת בעמוד צור קשר מתחת לטלפון. להשאיר ריק כדי להסתיר.' },
    },
    text('emailSubject', 'נושא המייל', 'שם הפונה יתווסף בסוף הנושא.'),
    text('errorLabel', 'הודעה לגולש כשהשליחה נכשלה'),
  ],
}

export function parseRecipients(value: null | string | undefined): string[] {
  return (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
