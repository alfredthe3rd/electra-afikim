import type { MetadataRoute } from 'next'

import { getCms, getGlobal } from '@/lib/content'
import { siteOrigin } from '@/lib/seo'

// Read per request: the Docker build has no database, and pages or divisions
// added in the admin should appear in the sitemap immediately.
export const dynamic = 'force-dynamic'

const PAGES = [
  { path: '/', slug: 'home' },
  { path: '/about', slug: 'about' },
  { path: '/divisions', slug: 'lobby' },
  { path: '/social-responsibility', slug: 'social' },
  { path: '/contact', slug: 'contact' },
  { path: '/accessibility', slug: 'accessibility' },
  { path: '/privacy-policy', slug: 'privacy' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [payload, settings] = await Promise.all([getCms(), getGlobal('site-settings')])
  const origin = siteOrigin(settings.brand.siteUrl)

  const pages = await Promise.all(PAGES.map(({ slug }) => getGlobal(slug)))
  const staticEntries = PAGES.flatMap(({ path }, i) => {
    const page = pages[i]
    return page.meta?.noindex
      ? []
      : [{ lastModified: page.updatedAt ?? undefined, url: `${origin}${path}` }]
  })

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    depth: 0,
    limit: 1000,
    sort: '_order',
  })
  const divisionEntries = divisions.flatMap((division) =>
    !division.slug || division.meta?.noindex
      ? []
      : [
          {
            lastModified: division.updatedAt,
            url: `${origin}${encodeURI(`/divisions/${division.slug}`)}`,
          },
        ],
  )

  return [...staticEntries, ...divisionEntries]
}
