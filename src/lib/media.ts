import type { Media } from '@/payload-types'

// Pure helpers for reading CMS values, safe to import from client components.

type MediaValue = Media | number | null | undefined

export const asMedia = (value: MediaValue): Media | null =>
  typeof value === 'object' && value !== null ? value : null

export const mediaUrl = (value: MediaValue): string | undefined => asMedia(value)?.url ?? undefined

export const mediaAlt = (value: MediaValue): string => asMedia(value)?.alt ?? ''

export const splitWords = (value: string): string[] => value.trim().split(/\s+/)

export const splitLines = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
