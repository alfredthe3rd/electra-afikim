'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import type { Home } from '@/payload-types'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

const LEGEND_FADE_WINDOW = 0.12

const formatNumber = (value: number): string => Math.round(value).toLocaleString('en-US')

export function StatsHighlights({ data }: { data: Home['stats'] }) {
  const STATS = data.items
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // A ref per legend item, sized by the data: the editor can add or remove stats.
  const legendRefs = useRef<(HTMLDivElement | null)[]>([])

  // Mobile drops the pinned horizontal track entirely and lays the four stats
  // out two-per-row, so the whole ScrollTrigger below is desktop-only. State,
  // not a one-off read, so crossing the breakpoint rebuilds the pin.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // useIsomorphicLayoutEffect (not useEffect) — this effect pins with
  // ScrollTrigger; see the hook's comment for why the cleanup must be
  // synchronous.
  useIsomorphicLayoutEffect(() => {
    if (isMobile || !trackRef.current) return

    const track = trackRef.current

    const ctx = gsap.context(() => {
      const legends = legendRefs.current.slice(0, STATS.length)
      gsap.set(legends[0], { opacity: 1, y: 0 })
      gsap.set(legends.slice(1), { opacity: 0, y: 20 })

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

          legends.forEach((legend, i) => {
            if (i === 0) return
            const localT = Math.max(0, Math.min((progress - activeAt[i]) / LEGEND_FADE_WINDOW, 1))
            gsap.set(legend, { opacity: localT, y: (1 - localT) * 20 })
          })
        },
        pin: true,
        scrub: 0.5,
        start: 'top top',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section className="stats-section" ref={sectionRef}>
      <header className="stats-header">
        <h2 className="stats-header-title">{data.title}</h2>
        <p className="stats-header-subtitle">{data.subtitle}</p>
      </header>

      <div className="stats-track" ref={trackRef}>
        {STATS.map((stat) => (
          <div className="stats-track-item" key={stat.id}>
            <div className="stats-hero-number">{formatNumber(stat.number) + (stat.suffix ?? '')}</div>
            <div className="stats-hero-overlay">{stat.overlayText}</div>
          </div>
        ))}
      </div>

      <div className="stats-legend">
        {STATS.map((stat, i) => (
          <div
            className="stats-legend-item"
            key={stat.id}
            ref={(el) => {
              legendRefs.current[i] = el
            }}
          >
            <span className="stats-legend-number">{formatNumber(stat.number) + (stat.suffix ?? '')}</span>
            <span className="stats-legend-text">{stat.legendText}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
