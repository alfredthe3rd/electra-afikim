import type { CollectionConfig, FieldHook } from 'payload'

const HEBREW_AND_ALPHANUMERIC = new RegExp('[^\\u0590-\\u05FFa-z0-9]+', 'g')

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(HEBREW_AND_ALPHANUMERIC, '-')
    .replace(/^-+|-+$/g, '')

const generateSlug: FieldHook = ({ value, data }) => {
  if (value) return formatSlug(value)
  if (data?.title) return formatSlug(data.title)
  return value
}

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  labels: {
    singular: 'חטיבה',
    plural: 'חטיבות',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'תמונת באנר',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'לוגו החטיבה',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'שם החטיבה',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'כותרת משנה',
    },
    {
      name: 'tertiaryTitle',
      type: 'text',
      label: 'כותרת שלישית',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'תיאור',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'תמונה מייצגת',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'קישור לאתר החיצוני',
    },
    {
      name: 'statsByNumbers',
      type: 'array',
      label: 'פעילות במספרים',
      labels: {
        singular: 'נתון',
        plural: 'נתונים',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'כותרת',
        },
        {
          name: 'number',
          type: 'text',
          label: 'מספר',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'תמונה',
        },
      ],
    },
    {
      name: 'goodToKnow',
      type: 'array',
      label: 'כדאי לדעת',
      labels: {
        singular: 'פריט',
        plural: 'פריטים',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'אייקון',
        },
        {
          name: 'title',
          type: 'text',
          label: 'כותרת',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'טקסט',
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'כתובת URL (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'נוצר אוטומטית משם החטיבה. ניתן לערוך ידנית.',
      },
      hooks: {
        beforeValidate: [generateSlug],
      },
    },
  ],
}
