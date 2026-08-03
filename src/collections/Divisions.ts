import type { CollectionConfig, FieldHook } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'

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
  /**
   * Drag-to-reorder in the admin list view. Payload injects a hidden `_order`
   * text field holding a fractional index (so a reorder rewrites one row, not
   * the whole table) and makes it the collection's defaultSort.
   *
   * The lobby grid must query `sort: '_order'` for this to have any effect —
   * it lays out in DOM order, and being RTL the first document lands in the
   * top-right cell and fills leftward, three per row.
   *
   * ⚠️ Payload marks `orderable` @experimental — the API may change across
   * upgrades. If a future Payload bump breaks the drag handles, check this
   * flag first.
   */
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
          type: 'richText',
          label: 'טקסט',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              UnorderedListFeature(),
              OrderedListFeature(),
              FixedToolbarFeature(),
            ],
          }),
        },
      ],
    },
    {
      name: 'goodToKnowHeading',
      type: 'text',
      label: 'כותרת מסכמת (בתחתית העמוד)',
      defaultValue: 'כדאי לדעת עלינו',
    },
    {
      name: 'goodToKnowText',
      type: 'textarea',
      label: 'טקסט מתחת לכותרת המסכמת',
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
