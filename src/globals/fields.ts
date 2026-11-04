import type { ArrayField, Field, TextField, TextareaField, UploadField } from 'payload'

// Small builders so the content globals read as a list of what the editor sees
// rather than repeating the same Payload boilerplate on every field.

export const text = (name: string, label: string, description?: string): TextField => ({
  name,
  type: 'text',
  label,
  required: true,
  admin: { description },
})

export const optionalText = (name: string, label: string, description?: string): TextField => ({
  name,
  type: 'text',
  label,
  admin: { description },
})

export const textarea = (name: string, label: string, description?: string): TextareaField => ({
  name,
  type: 'textarea',
  label,
  required: true,
  admin: { description },
})

export const LINES_HINT = 'כל שורה כאן מוצגת כשורה נפרדת באתר.'

export const image = (name: string, label: string, description?: string): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required: true,
  filterOptions: { mimeType: { contains: 'image' } },
  admin: { description },
})

const VIDEO_HINT =
  'אופציונלי. כל עוד השדה ריק מוצג הסרטון הקיים. מומלץ קובץ MP4 דחוס, עד כ-20MB, כדי לא להאט את האתר.'

export const video = (name: string, label: string): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  filterOptions: { mimeType: { contains: 'video' } },
  admin: { description: VIDEO_HINT },
})

export const href = (name: string, label: string): TextField => ({
  name,
  type: 'text',
  label,
  required: true,
  admin: { description: 'כתובת פנימית כמו /about, או כתובת מלאה שמתחילה ב-https://' },
})

export const list = (
  name: string,
  label: string,
  singular: string,
  fields: Field[],
  options: { description?: string; maxRows?: number; minRows?: number } = {},
): ArrayField => ({
  name,
  type: 'array',
  label,
  labels: { plural: label, singular },
  minRows: options.minRows,
  maxRows: options.maxRows,
  required: options.minRows ? true : undefined,
  fields,
  admin: {
    description: options.description,
    initCollapsed: true,
    components: { RowLabel: '/components/RowLabel#RowLabel' },
  },
})
