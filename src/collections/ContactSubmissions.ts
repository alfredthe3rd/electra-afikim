import type { CollectionConfig } from 'payload'

export const INBOX_GROUP = 'פניות'

// Every message sent from the contact form. The form writes here first and only
// then emails the recipients, so a message is never lost when the email fails;
// emailStatus shows what happened to the email.
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { plural: 'פניות מהאתר', singular: 'פנייה' },
  admin: {
    group: INBOX_GROUP,
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'handled', 'createdAt'],
    description: 'כל הפניות שנשלחו מטופס צור קשר. לאן נשלח המייל נקבע ב"הגדרות פניות".',
  },
  defaultSort: '-createdAt',
  access: {
    // Only the site's own form creates submissions (through the Local API).
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'שם', required: true, admin: { readOnly: true } },
    { name: 'phone', type: 'text', label: 'טלפון', required: true, admin: { readOnly: true } },
    { name: 'email', type: 'email', label: 'דוא"ל', required: true, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', label: 'הודעה', admin: { readOnly: true } },
    {
      name: 'handled',
      type: 'checkbox',
      label: 'טופל',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'emailStatus',
      type: 'select',
      label: 'מצב המייל',
      options: [
        { label: 'נשלח', value: 'sent' },
        { label: 'השליחה נכשלה', value: 'failed' },
        { label: 'לא נשלח: אין נמענים', value: 'no-recipients' },
        { label: 'לא נשלח: שרת הדואר לא מוגדר', value: 'no-smtp' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'emailError',
      type: 'text',
      label: 'שגיאת שליחה',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.emailStatus === 'failed',
      },
    },
  ],
}
