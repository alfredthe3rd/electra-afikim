import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getGlobal } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

import { findCardPage } from '../cardPages'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const social = await getGlobal('social')
  const card = findCardPage(social, slug)
  if (!card) return {}
  return pageMetadata(social.meta, `/social-responsibility/${slug}`, {
    description: card.text,
    title: card.title,
  })
}

export default async function SocialCardPage({ params }: { params: Params }) {
  const { slug } = await params
  const social = await getGlobal('social')
  const card = findCardPage(social, slug)
  if (!card?.details) notFound()

  return (
    <section className="legal-page social-card-page">
      <h1 className="legal-page-title">{card.title}</h1>

      <div className="legal-page-body">
        <RichText data={card.details} disableContainer />
      </div>

      <Link className="division-cta social-card-page-back" href="/social-responsibility">
        {social.hero.title}
      </Link>
    </section>
  )
}
