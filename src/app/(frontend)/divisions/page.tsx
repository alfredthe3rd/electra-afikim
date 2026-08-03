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

/**
 * ⚠️ Required, not incidental. Without it Next prerenders this page at build
 * time, so the grid freezes to whatever divisions existed during the last
 * deploy: a division added in the admin never appears, and a logo swapped on
 * an existing one keeps showing the old file. The [slug] template already
 * declares this; the lobby was the one CMS-backed page still static.
 */
export const dynamic = 'force-dynamic'

export default async function DivisionsLobbyPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    limit: 100,
    depth: 1,
    // The order the editor sets by dragging in the admin list view
    // (Divisions declares `orderable: true`). Was 'title', i.e. Hebrew
    // alphabetical, which the editor had no way to influence.
    sort: '_order',
  })

  const buildRows = (cols: number): (Division | null)[][] => {
    const result: (Division | null)[][] = []
    for (let i = 0; i < divisions.length; i += cols) {
      const row: (Division | null)[] = divisions.slice(i, i + cols)
      while (row.length < cols) row.push(null)
      result.push(row)
    }
    return result
  }

  const rows = buildRows(COLS)
  const mobileRows = buildRows(2)

  const renderCard = (division: Division | null, key: string) => {
    if (!division) {
      return <div className="divisions-lobby-card" key={key} />
    }
    const logo = isMedia(division.logo) ? division.logo : null
    return (
      <article className="divisions-lobby-card" key={key}>
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
              {row.map((division, ci) =>
                renderCard(division, division ? String(division.id) : `empty-${ri}-${ci}`),
              )}
              <div className="divisions-lobby-spacer-side" />
            </Fragment>
          ))}

          {/* Bottom spacer row */}
          {Array.from({ length: COLS + 2 }).map((_, i) => (
            <div className="divisions-lobby-spacer-row" key={`bottom-${i}`} />
          ))}
        </div>

        {/* Mobile twin: the same spacer-grid lattice at two columns (see
            .lattice-m in styles.css). CSS shows exactly one grid per
            breakpoint, so SSR and client always agree. */}
        <div className="lattice-m">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="lattice-m-spacer-row" key={`m-top-${i}`} />
          ))}

          {mobileRows.map((row, ri) => (
            <Fragment key={`m-row-${ri}`}>
              <div />
              {row.map((division, ci) =>
                renderCard(division, division ? `m-${division.id}` : `m-empty-${ri}-${ci}`),
              )}
              <div />
            </Fragment>
          ))}

          {Array.from({ length: 4 }).map((_, i) => (
            <div className="lattice-m-spacer-row" key={`m-bottom-${i}`} />
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
