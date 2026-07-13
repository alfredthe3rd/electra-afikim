'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { useReveal } from '../useReveal'

gsap.registerPlugin(ScrollTrigger)

type IconItem = {
  file: string
  label: string
}

const ICONS: IconItem[] = [
  { file: 'הפעלת תחבורה ציבורית.svg', label: 'הפעלת תחבורה ציבורית' },
  { file: 'מערכי היסעים מתקדמים.svg', label: 'מערכי היסעים מתקדמים' },
  { file: 'ניהול ותפעול רכבות קלות.svg', label: 'ניהול ותפעול רכבות קלות' },
  { file: 'יבוא אוטובוסים וטכנולוגיות.svg', label: 'יבוא אוטובוסים וטכנולוגיות' },
  { file: 'תחזוקה ותשתיות.svg', label: 'תחזוקה ותשתיות' },
  { file: 'הכשרה והסמכה.svg', label: 'הכשרה והסמכה' },
  { file: 'הסעות פרטיות.svg', label: 'הסעות פרטיות' },
]

const COLS = 4
const iconSrc = (file: string) => `/about%20page/icons%20section%203/${encodeURIComponent(file)}`

const TITLE_WORDS = 'קורת גג אחת - מערכת הוליסטית אחת'.split(' ')

export function AboutIconsGrid() {
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.about-icon-item')
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

  const rows: (IconItem | null)[][] = []
  for (let i = 0; i < ICONS.length; i += COLS) {
    const row: (IconItem | null)[] = ICONS.slice(i, i + COLS)
    while (row.length < COLS) row.push(null)
    rows.push(row)
  }

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
                key={icon ? icon.file : `empty-${ri}-${ci}`}
              >
                {icon && (
                  <>
                    <img alt="" className="about-icon-img" src={iconSrc(icon.file)} />
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
    </section>
  )
}
