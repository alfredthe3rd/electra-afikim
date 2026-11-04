'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { mediaUrl, splitWords } from '@/lib/media'
import type { About } from '@/payload-types'

import { useReveal } from '../useReveal'

type IconItem = NonNullable<About['icons']['items']>[number]

gsap.registerPlugin(ScrollTrigger)

const COLS = 4

export function AboutIconsGrid({ data }: { data: About['icons'] }) {
  const ICONS = data.items ?? []
  const TITLE_WORDS = splitWords(data.title)
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Both the desktop grid and its .lattice-m mobile twin live in the DOM;
      // animate only the visible set, or the stagger burns its first slots on
      // display:none cells and the reveal starts seconds late.
      const items = Array.from(
        sectionRef.current?.querySelectorAll('.about-icon-item') ?? [],
      ).filter((el) => (el as HTMLElement).offsetParent !== null)
      if (!items.length) return

      gsap.set(items, { opacity: 0, y: 30 })

      ScrollTrigger.create({
        once: true,
        onEnter: () => {
          gsap.to(items, { duration: 0.8, ease: 'power3.out', opacity: 1, stagger: 0.1, y: 0 })
        },
        start: 'top 80%',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const buildRows = (cols: number): (IconItem | null)[][] => {
    const result: (IconItem | null)[][] = []
    for (let i = 0; i < ICONS.length; i += cols) {
      const row: (IconItem | null)[] = ICONS.slice(i, i + cols)
      while (row.length < cols) row.push(null)
      result.push(row)
    }
    return result
  }

  const rows = buildRows(COLS)
  const mobileRows = buildRows(2)

  return (
    <section className={`about-icons-section${visible ? ' is-visible' : ''}`} ref={sectionRef}>
      <h2 className="about-icons-title">
        {TITLE_WORDS.map((word, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span
                className="word-inner"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {word}
              </span>
            </span>
            {i < TITLE_WORDS.length - 1 && ' '}
          </Fragment>
        ))}
      </h2>
      <div className="about-icons-grid" ref={gridRef}>
        {/* Top spacer row */}
        {Array.from({ length: COLS + 2 }).map((_, i) => (
          <div className="about-icons-spacer-row" key={`top-${i}`} />
        ))}

        {/* Content rows: side + icons + side */}
        {rows.map((row, ri) => (
          <Fragment key={`row-${ri}`}>
            <div className="about-icons-spacer-side" />
            {row.map((icon, ci) => (
              <div
                className="about-icon-item"
                key={icon ? icon.id : `empty-${ri}-${ci}`}
              >
                {icon && (
                  <>
                    <img alt="" className="about-icon-img" src={mediaUrl(icon.icon)} />
                    <p className="about-icon-label">{icon.label}</p>
                  </>
                )}
              </div>
            ))}
            <div className="about-icons-spacer-side" />
          </Fragment>
        ))}

        {/* Bottom spacer row */}
        {Array.from({ length: COLS + 2 }).map((_, i) => (
          <div className="about-icons-spacer-row" key={`bottom-${i}`} />
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
            {row.map((icon, ci) => (
              <div
                className="about-icon-item"
                key={icon ? icon.id : `m-empty-${ri}-${ci}`}
              >
                {icon && (
                  <>
                    <img alt="" className="about-icon-img" src={mediaUrl(icon.icon)} />
                    <p className="about-icon-label">{icon.label}</p>
                  </>
                )}
              </div>
            ))}
            <div />
          </Fragment>
        ))}

        {Array.from({ length: 4 }).map((_, i) => (
          <div className="lattice-m-spacer-row" key={`m-bottom-${i}`} />
        ))}
      </div>
    </section>
  )
}
