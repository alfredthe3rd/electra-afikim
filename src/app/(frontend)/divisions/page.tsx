import Link from 'next/link'
import { getPayload } from 'payload'
import { Fragment } from 'react'

import config from '@/payload.config'
import type { Division, Media } from '@/payload-types'

import { LobbyAnimations } from './LobbyAnimations'

const isMedia = (value: unknown): value is Media => typeof value === 'object' && value !== null

// 3 content columns, framed by a spacer column on each side (5 total) — the
// same spacer-grid mechanism as PartnersGrid on the homepage.
const COLS = 3

export default async function DivisionsLobbyPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    limit: 100,
    depth: 1,
    sort: 'title',
  })

  const rows: (Division | null)[][] = []
  for (let i = 0; i < divisions.length; i += COLS) {
    const row: (Division | null)[] = divisions.slice(i, i + COLS)
    while (row.length < COLS) row.push(null)
    rows.push(row)
  }

  return (
    <>
      <LobbyAnimations />

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
          {/* Top spacer row */}
          {Array.from({ length: COLS + 2 }).map((_, i) => (
            <div className="divisions-lobby-spacer-row" key={`top-${i}`} />
          ))}

          {/* Content rows: side spacer + 3 cards + side spacer */}
          {rows.map((row, ri) => (
            <Fragment key={`row-${ri}`}>
              <div className="divisions-lobby-spacer-side" />
              {row.map((division, ci) => {
                if (!division) {
                  return <div className="divisions-lobby-card" key={`empty-${ri}-${ci}`} />
                }
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
              <div className="divisions-lobby-spacer-side" />
            </Fragment>
          ))}

          {/* Bottom spacer row */}
          {Array.from({ length: COLS + 2 }).map((_, i) => (
            <div className="divisions-lobby-spacer-row" key={`bottom-${i}`} />
          ))}
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
