'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

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

const LEGEND_FADE_WINDOW = 0.12

const formatNumber = (value: number): string => Math.round(value).toLocaleString('en-US')

export function StatsHighlights() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const legendRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  // useIsomorphicLayoutEffect (not useEffect) — this effect pins with
  // ScrollTrigger; see the hook's comment for why the cleanup must be
  // synchronous.
  useIsomorphicLayoutEffect(() => {
    if (!trackRef.current) return

    const track = trackRef.current

    const ctx = gsap.context(() => {
      gsap.set(legendRefs[0].current, { opacity: 1, y: 0 })
      gsap.set(
        legendRefs.slice(1).map((ref) => ref.current),
        { opacity: 0, y: 20 },
      )

      const lastStep = STATS.length - 1
      const activeAt = STATS.map((_stat, i) => i / lastStep)

      ScrollTrigger.create({
        end: '+=400%',
        onUpdate: (self) => {
          const { progress } = self

          // Track slides leftward (x: 0 → -distance): each next stat enters
          // from the right — the natural RTL reading direction. The track is
          // direction:ltr so stat 0 sits at the left end, on-screen at rest.
          const distance = track.scrollWidth - window.innerWidth
          gsap.set(track, { x: -progress * distance })

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
        {STATS.map((stat) => (
          <div className="stats-track-item" key={stat.legendText}>
            <div className="stats-hero-number">{formatNumber(stat.num) + stat.suffix}</div>
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
