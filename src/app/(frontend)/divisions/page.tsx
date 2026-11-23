import Link from 'next/link'
import { getPayload } from 'payload'
import { Fragment } from 'react'
import type React from 'react'

import { getGlobal } from '@/lib/content'
import { mediaUrl } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
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

export async function generateMetadata() {
  const lobby = await getGlobal('lobby')
  return pageMetadata(lobby.meta, '/divisions', { title: lobby.page.title })
}

export default async function DivisionsLobbyPage() {
  const { page } = await getGlobal('lobby')
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

  // A short last row is centered when it can be (one card in three columns
  // lands in the middle one), and its empty cells draw no lines — see
  // latticeStyles below. Two leftovers in three columns can't center on the
  // lattice, so they keep the RTL reading order.
  const buildRows = (cols: number): (Division | null)[][] => {
    const result: (Division | null)[][] = []
    for (let i = 0; i < divisions.length; i += cols) {
      const items = divisions.slice(i, i + cols)
      const lead = items.length < cols && (cols - items.length) % 2 === 0 ? (cols - items.length) / 2 : 0
      const row: (Division | null)[] = [...Array<null>(lead).fill(null), ...items]
      while (row.length < cols) row.push(null)
      result.push(row)
    }
    return result
  }

  type Borders = React.CSSProperties | undefined
  const HIDE_BOTTOM = { borderBottomColor: 'transparent' }

  // Every lattice line belongs to one cell's border (styles.css: content cells
  // draw bottom + left, the first content column also right; spacer cells
  // carry the overshoot). A line stays only if a card sits on either side of
  // it, so an empty cell vanishes instead of showing as a hollow square.
  const latticeStyles = (rows: (Division | null)[][], cols: number) => {
    const has = (row: (Division | null)[] | undefined, c: number) => Boolean(row?.[c])
    const content = rows.map((row) =>
      row.map((division, c): Borders => {
        if (division) return undefined
        const style: React.CSSProperties = { ...HIDE_BOTTOM }
        if (!has(row, c + 1)) style.borderLeftColor = 'transparent'
        if (c === 0) style.borderRightColor = 'transparent'
        return style
      }),
    )
    const sides = rows.map((row) => ({
      left: has(row, cols - 1) ? undefined : HIDE_BOTTOM,
      right: has(row, 0) ? undefined : HIDE_BOTTOM,
    }))
    // Bottom spacer row continues the last row's vertical lines downward.
    const last = rows[rows.length - 1]
    const bottom = Array.from({ length: cols }, (_, c): Borders => {
      const style: React.CSSProperties = {}
      if (!has(last, c) && !has(last, c + 1)) style.borderLeftColor = 'transparent'
      if (c === 0 && !has(last, 0)) style.borderRightColor = 'transparent'
      return Object.keys(style).length ? style : undefined
    })
    return { bottom, content, sides }
  }

  const rows = buildRows(COLS)
  const mobileRows = buildRows(2)
  const lines = latticeStyles(rows, COLS)
  const mobileLines = latticeStyles(mobileRows, 2)

  const renderCard = (division: Division | null, key: string, style?: Borders) => {
    if (!division) {
      return <div aria-hidden className="divisions-lobby-card" key={key} style={style} />
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
            {page.ctaLabel}
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
          src={mediaUrl(page.video) ?? '/lobby-hero.mp4'}
        />
      </section>

      {/* אזור 2 - כותרות */}
      <section className="divisions-lobby-titles">
        <h1 className="divisions-lobby-title">{page.title}</h1>
        <p className="divisions-lobby-subtitle">{page.subtitle}</p>
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
              <div className="divisions-lobby-spacer-side" style={lines.sides[ri].right} />
              {row.map((division, ci) =>
                renderCard(
                  division,
                  division ? String(division.id) : `empty-${ri}-${ci}`,
                  lines.content[ri][ci],
                ),
              )}
              <div className="divisions-lobby-spacer-side" style={lines.sides[ri].left} />
            </Fragment>
          ))}

          {/* Bottom spacer row */}
          {Array.from({ length: COLS + 2 }).map((_, i) => (
            <div
              className="divisions-lobby-spacer-row"
              key={`bottom-${i}`}
              style={i > 0 && i <= COLS ? lines.bottom[i - 1] : undefined}
            />
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
              <div style={mobileLines.sides[ri].right} />
              {row.map((division, ci) =>
                renderCard(
                  division,
                  division ? `m-${division.id}` : `m-empty-${ri}-${ci}`,
                  mobileLines.content[ri][ci],
                ),
              )}
              <div style={mobileLines.sides[ri].left} />
            </Fragment>
          ))}

          {Array.from({ length: 4 }).map((_, i) => (
            <div
              className="lattice-m-spacer-row"
              key={`m-bottom-${i}`}
              style={i > 0 && i <= 2 ? mobileLines.bottom[i - 1] : undefined}
            />
          ))}
        </div>
      </section>

      {/* אזור 4 - טיקר */}
      <section className="divisions-lobby-ticker">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="ticker-segment" key={i}>
              <span className="ticker-highlight">{page.tickerHighlight}</span>
              {' '}
              <span className="ticker-muted">{page.tickerMuted}</span>
              {' '}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
