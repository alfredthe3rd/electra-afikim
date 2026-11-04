import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getGlobal } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

import { DivisionAnimations } from './DivisionAnimations'
import { DivisionHeading } from './DivisionHeading'
import { StatsCounter } from './StatsCounter'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

const isMedia = (value: unknown): value is Media => typeof value === 'object' && value !== null

const findDivision = async (rawSlug: string) => {
  const slug = decodeURIComponent(rawSlug)
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'divisions',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const division = await findDivision(slug)
  if (!division) return {}
  return pageMetadata(division.meta, `/divisions/${division.slug}`, {
    description: division.description,
    title: division.title,
  })
}

export default async function DivisionPage({ params }: Props) {
  const { slug: rawSlug } = await params
  const [division, lobby] = await Promise.all([findDivision(rawSlug), getGlobal('lobby')])

  if (!division) {
    notFound()
  }

  const {
    bannerImage,
    logo,
    title,
    subtitle,
    tertiaryTitle,
    description,
    featuredImage,
    externalUrl,
    statsByNumbers,
    goodToKnow,
    goodToKnowHeading,
    goodToKnowText,
  } = division

  // "פעילות במספרים" is optional per division — only 2 of the 6 have it filled
  // in. Rows that were added in the admin but left blank are dropped too, so an
  // empty row can't produce a heading with nothing under it.
  const stats = (statsByNumbers ?? [])
    .filter((stat) => stat.number || stat.title || isMedia(stat.image))
    .map((stat, index) => ({
      id: stat.id ?? String(index),
      imageAlt: isMedia(stat.image) ? stat.image.alt : null,
      imageUrl: isMedia(stat.image) ? (stat.image.url ?? null) : null,
      number: stat.number ?? null,
      title: stat.title ?? null,
    }))

  return (
    <article className="division">
      <DivisionAnimations />

      {isMedia(bannerImage) && bannerImage.url && (
        <div className="division-banner">
          <img alt={bannerImage.alt} src={bannerImage.url} />
        </div>
      )}

      <DivisionHeading
        logoAlt={isMedia(logo) ? logo.alt : null}
        logoUrl={isMedia(logo) ? (logo.url ?? null) : null}
        subtitle={subtitle ?? null}
        tertiaryTitle={tertiaryTitle ?? null}
        title={title}
      />

      <div className="division-columns">
        <div className="division-text">
          {description && <p className="division-description">{description}</p>}
          {externalUrl && (
            <a className="division-cta" href={externalUrl}>
              {lobby.division.visitSiteLabel}
            </a>
          )}
        </div>
        <div className="division-image">
          {isMedia(featuredImage) && featuredImage.url && (
            <img
              alt={featuredImage.alt}
              className="division-featured-image"
              src={featuredImage.url}
            />
          )}
        </div>
      </div>

      {stats.length > 0 && <StatsCounter heading={lobby.division.statsHeading} items={stats} />}

      {goodToKnow && goodToKnow.length > 0 && (
        <section className="good-to-know">
          <h2 className="good-to-know-heading">{lobby.division.goodToKnowHeading}</h2>
          <div className="good-to-know-grid">
            {goodToKnow.map((item, index) => (
              <div className="good-to-know-card" key={item.id ?? index}>
                {isMedia(item.icon) && item.icon.url && (
                  <img alt={item.icon.alt} className="good-to-know-icon" src={item.icon.url} />
                )}
                {item.title && <div className="good-to-know-title">{item.title}</div>}
                {item.text && (
                  <div className="good-to-know-text">
                    <RichText data={item.text} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The closing block editors fill in per division ("מבט קדימה"). */}
      {goodToKnowText && (
        <section className="division-closing">
          {goodToKnowHeading && <h2 className="good-to-know-heading">{goodToKnowHeading}</h2>}
          <p className="division-closing-text">{goodToKnowText}</p>
        </section>
      )}
    </article>
  )
}
