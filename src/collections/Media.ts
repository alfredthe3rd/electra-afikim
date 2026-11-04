import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { plural: 'מדיה', singular: 'קובץ מדיה' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'טקסט חלופי',
      required: true,
      admin: { description: 'תיאור קצר של התמונה, לנגישות ולמנועי חיפוש.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
  },
}
