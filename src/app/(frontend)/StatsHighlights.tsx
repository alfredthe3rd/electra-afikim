'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Stat = {
  num: number
  suffix: string
  textOverlay: string
  legendText: string
}

const STATS: Stat[] = [
  { legendText: 'אוטובוסים בצי הרכבים', num: 1200, suffix: '', textOverlay: 'אוטובוסים' },
  { legendText: 'נוסעים בשנה', num: 52, suffix: 'M', textOverlay: 'נוסעים' },
  { legendText: 'עובדים ומקצוענים', num: 2200, suffix: '', textOverlay: 'עובדים' },
  { legendText: 'חטיבות', num: 7, suffix: '', textOverlay: 'חטיבות' },
]

const COUNT_DURATION = 0.6
const LEGEND_FADE_WINDOW = 0.12

const formatNumber = (value: number): string => Math.round(value).toLocaleString('en-US')

export function StatsHighlights() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const numberRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]
  const legendRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  useEffect(() => {
    if (!trackRef.current) return

    const track = trackRef.current
    const counters = STATS.map(() => ({ value: 0 }))

    const countUp = (index: number) => {
      const stat = STATS[index]
      const el = numberRefs[index].current
      counters[index].value = 0
      gsap.to(counters[index], {
        duration: COUNT_DURATION,
        ease: 'power1.out',
        onUpdate: () => {
          if (el) el.textContent = formatNumber(counters[index].value) + stat.suffix
        },
        snap: { value: 1 },
        value: stat.num,
      })
    }

    const ctx = gsap.context(() => {
      gsap.set(legendRefs[0].current, { opacity: 1, y: 0 })
      gsap.set(
        legendRefs.slice(1).map((ref) => ref.current),
        { opacity: 0, y: 20 },
      )

      countUp(0)
      let activeIndex = 0

      const lastStep = STATS.length - 1
      const activeAt = STATS.map((_stat, i) => i / lastStep)

      gsap.set(track, { x: -(track.scrollWidth - window.innerWidth) })

      ScrollTrigger.create({
        end: '+=400%',
        onUpdate: (self) => {
          const { progress } = self

          const distance = track.scrollWidth - window.innerWidth
          gsap.set(track, { x: (progress - 1) * distance })

          const index = Math.round(progress * lastStep)
          if (index !== activeIndex) {
            // A single onUpdate tick can span more than one step if the
            // user scrolls fast enough (or jumps via anchor/keyboard), so
            // catch up every index in between rather than only the final
            // one — otherwise a skipped step's counter stays stuck at 0.
            const step = index > activeIndex ? 1 : -1
            for (let i = activeIndex + step; ; i += step) {
              countUp(i)
              if (i === index) break
            }
            activeIndex = index
          }

          legendRefs.forEach((ref, i) => {
            if (i === 0) return
            const localT = Math.max(0, Math.min((progress - activeAt[i]) / LEGEND_FADE_WINDOW, 1))
            gsap.set(ref.current, { opacity: localT, y: (1 - localT) * 20 })
          })
        },
        pin: true,
        scrub: 0.5,
        start: 'top top',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="stats-section" ref={sectionRef}>
      <header className="stats-header">
        <h2 className="stats-header-title">יתרון הגודל. עומק הניסיון. הראייה קדימה</h2>
        <p className="stats-header-subtitle">
          חברת התחבורה הגדולה בישראל, והשלישית בגודלה בתחום התחבורה הציבורית
        </p>
      </header>

      <div className="stats-track" ref={trackRef}>
        {STATS.map((stat, i) => (
          <div className="stats-track-item" key={stat.legendText}>
            <div className="stats-hero-number" ref={numberRefs[i]}>
              {i === 0 ? formatNumber(stat.num) + stat.suffix : '0'}
            </div>
            <div className="stats-hero-overlay">{stat.textOverlay}</div>
          </div>
        ))}
      </div>

      <div className="stats-legend">
        {STATS.map((stat, i) => (
          <div className="stats-legend-item" key={stat.legendText} ref={legendRefs[i]}>
            <span className="stats-legend-number">{formatNumber(stat.num) + stat.suffix}</span>
            <span className="stats-legend-text">{stat.legendText}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
