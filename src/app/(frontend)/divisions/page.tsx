import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Media } from '@/payload-types'

const isMedia = (value: unknown): value is Media => typeof value === 'object' && value !== null

export default async function DivisionsLobbyPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    limit: 100,
    depth: 1,
    sort: 'title',
  })

  return (
    <>
      {/* אזור 1 - הירו וידאו */}
      <section className="divisions-lobby-hero">
        <video
          autoPlay
          className="divisions-lobby-hero-video"
          loop
          muted
          playsInline
          src="/lobby-hero.mp4"
        />
      </section>

      {/* אזור 2 - כותרות */}
      <section className="divisions-lobby-titles">
        <h1 className="divisions-lobby-title">פתרונות מקיפים לכל צורכי התחבורה</h1>
        <p className="divisions-lobby-subtitle">
          קבוצת אלקטרה אפיקים פועלת במגוון תחומים משלימים,
          היוצרים יחד מעטפת מלאה.
        </p>
      </section>

      {/* אזור 3 - רשת החטיבות */}
      <section className="divisions-lobby-grid-section">
        <div className="divisions-lobby-grid">
          {divisions.map((division) => {
            const logo = isMedia(division.logo) ? division.logo : null
            return (
              <article className="divisions-lobby-card" key={division.id}>
                {logo?.url && (
                  <img
                    alt={logo.alt ?? division.title}
                    className="divisions-lobby-card-logo"
                    src={logo.url}
                  />
                )}
                {division.description && (
                  <p className="divisions-lobby-card-desc">{division.description}</p>
                )}
                {division.slug && (
                  <Link className="division-cta" href={`/divisions/${division.slug}`}>
                    למידע מורחב
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* אזור 4 - טיקר */}
      <section className="divisions-lobby-ticker">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="ticker-segment" key={i}>
              <span className="ticker-highlight">מערכת אחת.</span>
              {' '}
              <span className="ticker-muted">שפה אחת. סטנדרט אחד.</span>
              {' '}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
