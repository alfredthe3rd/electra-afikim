import type { MetadataRoute } from 'next'

import { getGlobal } from '@/lib/content'
import { siteOrigin } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { brand } = await getGlobal('site-settings')
  return {
    rules: {
      // Uploaded images and videos live under /api/media and must stay crawlable.
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api/'],
      userAgent: '*',
    },
    sitemap: `${siteOrigin(brand.siteUrl)}/sitemap.xml`,
  }
}
