'use client'

import { useRowLabel } from '@payloadcms/ui'

const LABEL_FIELDS = ['title', 'name', 'label', 'year', 'legendText', 'number', 'text']

// Names a collapsed array row after its own content ("טל כהן") instead of the
// default "Row 03", so editors can find a row without opening each one.
export function RowLabel() {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const field = LABEL_FIELDS.find((name) => data?.[name])
  const position = String((rowNumber ?? 0) + 1).padStart(2, '0')
  return <span>{field ? String(data[field]).slice(0, 60) : `פריט ${position}`}</span>
}
