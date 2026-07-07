'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { Fragment, useEffect, useRef } from 'react'

import { useReveal } from './useReveal'

gsap.registerPlugin(ScrollTrigger)

const TITLE_WORDS = 'שותפים אסטרטגיים בפתרונות תחבורה מתקדמים'.split(' ')

const PARAGRAPH_WORDS =
  'קבוצת אלקטרה אפיקים היא קבוצת התחבורה המובילה בישראל, הפועלת כקורת גג אחת למכלול רחב של פתרונות תחבורה מתקדמים. הקבוצה משלבת תכנון, הפעלה, טכנולוגיה, תשתיות, הכשרה, תחזוקה וחדשנות - כדי לייצר מערכות תחבורה חכמות, בטוחות ויעילות.'.split(
    ' ',
  )

export function AboutTeaser() {
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const textRef = useRef<HTMLParagraphElement>(null)

  // ── Paragraph: GSAP Scrub Word Highlight ──
  useEffect(() => {
    if (!textRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const scrubWords = textRef.current!.querySelectorAll('.scrub-word')
      gsap.set(scrubWords, { opacity: 0.2 })

      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top 85%',
        end: 'bottom 50%',
        scrub: 1,
        animation: gsap.to(scrubWords, {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
        }),
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={`about-teaser${visible ? ' is-visible' : ''}`}
      ref={sectionRef}
    >
      <h2 className="about-teaser-title">
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
      <p className="about-teaser-text" ref={textRef}>
        {PARAGRAPH_WORDS.map((word, i) => (
          <span className="scrub-word" key={i}>
            {word}
            {i < PARAGRAPH_WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
      <Link className="division-cta about-teaser-cta" href="/about">
        אודות אלקטרה אפיקים
      </Link>
    </section>
  )
}
