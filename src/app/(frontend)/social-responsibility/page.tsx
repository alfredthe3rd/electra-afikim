import { getGlobal } from '@/lib/content'
import { mediaUrl, splitLines } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'

import { SocialAnimations } from './SocialAnimations'
import { SocialCarousel } from './SocialCarousel'

export async function generateMetadata() {
  const social = await getGlobal('social')
  return pageMetadata(social.meta, '/social-responsibility', {
    description: social.hero.subtitle,
    title: social.hero.title,
  })
}

export default async function SocialResponsibilityPage() {
  const { carousel, cards, cta, hero } = await getGlobal('social')

  return (
    <>
      <SocialAnimations />

      {/* אזור 1 - הירו וידאו */}
      <section className="social-hero">
        <video
          autoPlay
          className="social-hero-video"
          loop
          muted
          playsInline
          src={mediaUrl(hero.video) ?? '/social-hero.mp4'}
        />
      </section>

      {/* אזור 2 - כותרות */}
      <section className="social-titles">
        <h1 className="social-title">{hero.title}</h1>
        <p className="social-subtitle">{hero.subtitle}</p>
      </section>

      {/* אזור 3 - קוביות */}
      <section className="social-cards-section">
        <div className="social-cards">
          {(cards?.items ?? []).map((card) => (
            <article className="social-card" key={card.id}>
              <img alt="" className="social-card-icon" src={mediaUrl(card.icon)} />
              <h3 className="social-card-title">{card.title}</h3>
              <p className="social-card-text">{card.text}</p>
              <ul className="social-card-list">
                {splitLines(card.list).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* אזור 4 - כותרות + כפתור */}
      <section className="social-cta-section">
        <h2 className="social-cta-title">{cta.title}</h2>
        <p className="social-cta-subtitle">{cta.subtitle}</p>
        <a className="division-cta" href={cta.href}>
          {cta.label}
        </a>
      </section>

      {/* אזור 5 - קרוסלת תמונות */}
      <SocialCarousel
        row1={carousel.row1.map((row) => mediaUrl(row.image) ?? '')}
        row2={carousel.row2.map((row) => mediaUrl(row.image) ?? '')}
      />
    </>
  )
}
