'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { useReveal } from './useReveal'

gsap.registerPlugin(ScrollTrigger)

type PartnerLogo = {
  file: string
  alt: string
}

const PARTNER_LOGOS: PartnerLogo[] = [
  { alt: 'אלקטרה', file: 'אלקטרה.png' },
  { alt: 'אשדוד', file: 'אשדוד.png' },
  { alt: 'יוטונג', file: 'יוטונג.png' },
  { alt: 'מדינת ישראל', file: 'מדינת ישראל.png' },
  { alt: 'מוביט', file: 'מוביט.png' },
  { alt: 'מעלה אדומים', file: 'מעלה אדומים.png' },
  { alt: 'משרד הביטחון', file: 'משרד בטחון.png' },
  { alt: 'משרד התחבורה', file: 'משרד תחבורה.png' },
  { alt: 'פורום תחב״צ', file: 'פורום תחבצ.png' },
  { alt: 'פתח תקווה', file: 'פ״ת.png' },
  { alt: 'ראש העין', file: 'ראש העין.png' },
  { alt: 'רפאל', file: 'רפאל.png' },
  { alt: 'התעשייה האווירית', file: 'תעשייה אויירית.png' },
]

const COLS = 5
const logoSrc = (file: string) => `/logos to home/${encodeURIComponent(file)}`

const TITLE_LINE1 = 'גאים לעבוד בשותפות עם הגופים'.split(' ')
const TITLE_LINE2 = 'שמובילים את התחבורה בישראל'.split(' ')

export function PartnersGrid() {
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.partners-logo-item')
      if (!items?.length) return

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

  const rows: (PartnerLogo | null)[][] = []
  for (let i = 0; i < PARTNER_LOGOS.length; i += COLS) {
    const row: (PartnerLogo | null)[] = PARTNER_LOGOS.slice(i, i + COLS)
    while (row.length < COLS) row.push(null)
    rows.push(row)
  }

  // Offset for line2 stagger: continues after line1
  const line2Offset = TITLE_LINE1.length

  return (
    <section className={`partners-section${visible ? ' is-visible' : ''}`} ref={sectionRef}>
      <h2 className="partners-title">
        {TITLE_LINE1.map((word, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span
                className="word-inner"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {word}
              </span>
            </span>
            {i < TITLE_LINE1.length - 1 && ' '}
          </Fragment>
        ))}
        <br />
        {TITLE_LINE2.map((word, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span
                className="word-inner"
                style={{ transitionDelay: `${(i + line2Offset) * 0.1}s` }}
              >
                {word}
              </span>
            </span>
            {i < TITLE_LINE2.length - 1 && ' '}
          </Fragment>
        ))}
      </h2>
      <div className="partners-grid" ref={gridRef}>
        {/* Row 1: top spacer */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="partners-spacer-row" key={`top-${i}`} />
        ))}

        {/* Rows 2-4: side + 5 logos + side */}
        {rows.map((row, ri) => (
          <Fragment key={`row-${ri}`}>
            <div className="partners-spacer-side" />
            {row.map((logo, ci) => (
              <div
                className="partners-logo-item"
                key={logo ? logo.file : `empty-${ri}-${ci}`}
              >
                {logo && (
                  <img alt={logo.alt} className="partners-logo-img" src={logoSrc(logo.file)} />
                )}
              </div>
            ))}
            <div className="partners-spacer-side" />
          </Fragment>
        ))}

        {/* Row 5: bottom spacer */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="partners-spacer-row" key={`bottom-${i}`} />
        ))}
      </div>
    </section>
  )
}
