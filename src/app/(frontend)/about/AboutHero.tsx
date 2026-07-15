'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const TITLE_WORDS = 'חוד החנית של ענף התחבורה בישראל'.split(' ')

const SUBTITLE_WORDS =
  'אלקטרה אפיקים מהווה כיום את חוד החנית של ענף התחבורה בישראל. החברה, שהחלה את דרכה בשנת 2008 עם זכייה באשכול שומרון, עברה קפיצת מדרגה אסטרטגית בשנת 2021 עם רכישת השליטה על ידי קבוצת אלקטרה ומיזוג פעילות "אגד תעבורה".'.split(
    ' ',
  )

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords = containerRef.current?.querySelectorAll('.about-hero-word')
      const subWords = containerRef.current?.querySelectorAll('.about-hero-sub-word')

      gsap.set(titleWords ?? [], { autoAlpha: 0, y: 24 })
      gsap.set(subWords ?? [], { autoAlpha: 0, y: 12 })

      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .to(titleWords ?? [], { autoAlpha: 1, duration: 0.7, stagger: 0.08, y: 0 }, 0.3)
        .to(subWords ?? [], { autoAlpha: 1, duration: 0.4, stagger: 0.012, y: 0 }, '-=0.3')

      // Pin the hero in place so the next section (AboutCircle) scrolls up and
      // covers it like a replacing layer, instead of the hero being pushed out
      // in classic flow. pinSpacing:false adds no scroll distance — the circle's
      // own 100vh of scroll-in is exactly what reveals it over the fixed hero.
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-hero" ref={containerRef}>
      <video
        autoPlay
        className="about-hero-video"
        loop
        muted
        playsInline
        src="/about%20page/about%20hero%20movie.mp4"
      />
      <div className="about-hero-overlay" />

      <div className="about-hero-content">
        <h1 className="about-hero-title">
          {TITLE_WORDS.map((word, i) => (
            <Fragment key={i}>
              <span className="about-hero-word">{word}</span>
              {i < TITLE_WORDS.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </h1>
        <p className="about-hero-subtitle">
          {SUBTITLE_WORDS.map((word, i) => (
            <Fragment key={i}>
              <span className="about-hero-sub-word">{word}</span>
              {i < SUBTITLE_WORDS.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
