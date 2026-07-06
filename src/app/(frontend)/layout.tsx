import React from 'react'

import { almoniNeue } from '@/fonts/almoni-neue'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SmoothScroll } from './SmoothScroll'
import './styles.css'

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
