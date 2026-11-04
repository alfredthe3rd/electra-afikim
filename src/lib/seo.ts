import type { Metadata } from 'next'

import { mediaUrl } from './media'
import { getGlobal } from './content'

export type PageMeta = {
  description?: string | null
  image?: unknown
  noindex?: boolean | null
  title?: string | null
}

type Fallback = { description?: string | null; title?: string | null }

const DESCRIPTION_LIMIT = 160

export const siteOrigin = (siteUrl: string) => siteUrl.replace(/\/+$/, '')

// Cuts long page copy at a word boundary, for use as a meta description.
const shorten = (value: string | null | undefined) => {
  const clean = value?.replace(/\s+/g, ' ').trim()
  if (!clean || clean.length <= DESCRIPTION_LIMIT) return clean
  return clean.slice(0, clean.lastIndexOf(' ', DESCRIPTION_LIMIT))
}

/**
 * Builds a page's title, description, canonical and social-share tags. Empty
 * SEO fields fall back to the page's own content, then to the site defaults
 * set on "הגדרות כלליות", so a page never renders without them.
 */
export async function pageMetadata(
  meta: PageMeta | null | undefined,
  path: string,
  fallback: Fallback = {},
): Promise<Metadata> {
  const settings = await getGlobal('site-settings')
  const defaults = settings.meta
  const { siteName, siteUrl } = settings.brand

  const pageTitle = fallback.title?.trim()
  const title =
    meta?.title ||
    (pageTitle && pageTitle !== siteName
      ? `${pageTitle} | ${siteName}`
      : pageTitle || defaults?.title || siteName)
  const description =
    meta?.description ||
    shorten(fallback.description) ||
    defaults?.description ||
    undefined
  const image =
    mediaUrl(meta?.image as Parameters<typeof mediaUrl>[0]) ?? mediaUrl(defaults?.image)
  const url = `${siteOrigin(siteUrl)}${encodeURI(path)}`
  const images = image ? [{ url: image }] : undefined

  return {
    alternates: { canonical: url },
    description,
    openGraph: { description, images, locale: 'he_IL', siteName, title, type: 'website', url },
    robots: meta?.noindex ? { follow: true, index: false } : undefined,
    title,
    twitter: { card: images ? 'summary_large_image' : 'summary', description, images, title },
  }
}
