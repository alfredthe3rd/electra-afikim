import type { Metadata } from 'next'
import Script from 'next/script'
import React from 'react'

import { almoniNeue } from '@/fonts/almoni-neue'
import { getGlobal } from '@/lib/content'
import { mediaUrl } from '@/lib/media'
import { siteOrigin } from '@/lib/seo'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SmoothScroll } from './SmoothScroll'
import './styles.css'

// The footer lists divisions from the CMS, so every page reads the database.
// Render per request: content edits show up immediately, and the Docker build
// does not need a database connection.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { brand, meta } = await getGlobal('site-settings')
  return {
    description: meta?.description ?? undefined,
    metadataBase: new URL(siteOrigin(brand.siteUrl)),
    title: meta?.title || brand.siteName,
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getGlobal('site-settings')
  const { brand, contactDetails, footer } = settings
  const origin = siteOrigin(brand.siteUrl)
  const logo = mediaUrl(brand.logo)

  // Tells search engines which company this site belongs to.
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    address: contactDetails.address,
    logo: logo ? `${origin}${logo}` : undefined,
    name: brand.siteName,
    sameAs: (footer.social ?? []).map((item) => item.url).filter((url) => url.startsWith('http')),
    telephone: contactDetails.phoneLabel,
    url: origin,
  }

  return (
    <html dir="rtl" lang="he">
      <body className={almoniNeue.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, '\\u003c'),
          }}
          type="application/ld+json"
        />
        <SmoothScroll />
        <SiteHeader settings={settings} />
        <main>{children}</main>
        <SiteFooter />
        {/* UserWay accessibility widget */}
        <Script
          data-account="2XzfE4RPY8"
          src="https://cdn.userway.org/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
