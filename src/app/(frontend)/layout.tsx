import React from 'react'

import { almoniNeue } from '@/fonts/almoni-neue'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SmoothScroll } from './SmoothScroll'
import './styles.css'

// The footer lists divisions from the CMS, so every page reads the database.
// Render per request: content edits show up immediately, and the Docker build
// does not need a database connection.
export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html dir="rtl" lang="he">
      <body className={almoniNeue.className}>
        <SmoothScroll />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
