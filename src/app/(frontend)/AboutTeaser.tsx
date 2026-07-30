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

      // ── Title: GSAP masked word reveal ──
      // Each word rises out of its overflow-hidden .word-mask with a slight
      // swing (rotation settles to 0), staggered in RTL reading order (DOM
      // order = rightmost word first). Reverses when scrolling back above.
      const titleWords = gsap.utils.toArray<HTMLElement>('.about-teaser-title .word-inner')
      gsap.set(titleWords, { yPercent: 130, rotation: 7, transformOrigin: '100% 100%' })
      gsap.to(titleWords, {
        yPercent: 0,
        rotation: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: '.about-teaser-title',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // ── Road: drawn stroke-by-stroke as the section scrolls in ──
      // pathLength=1 normalizes every path, so dasharray/dashoffset 1→0 is a
      // full DrawSVG-style reveal (edges + the centerline's mask in sync).
      const roadPaths = sectionRef.current!.querySelectorAll('.about-road-draw')
      gsap.set(roadPaths, { attr: { 'stroke-dasharray': 1, 'stroke-dashoffset': 1 } })
      gsap.to(roadPaths, {
        attr: { 'stroke-dashoffset': 0 },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={`about-teaser${visible ? ' is-visible' : ''}`}
      ref={sectionRef}
    >
      {/* Decorative road: exits the hero top-left, sweeps across above the
          title, then descends along the right edge toward the divisions
          (videos) section. Same stroke language as the about page's
          "time road.svg": #60D3AA edges, #9CEE8C dashed centerline. */}
      <svg
        aria-hidden="true"
        className="about-teaser-road"
        fill="none"
        preserveAspectRatio="xMidYMin meet"
        viewBox="0 0 1680 700"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The dashed centerline can't be dash-offset-animated directly (it
            already uses its dash pattern), so it's revealed through a mask
            whose solid copy of the same path is drawn instead. */}
        <defs>
          <mask id="about-road-draw-mask" maskUnits="userSpaceOnUse">
            <path
              className="about-road-draw"
              d="M84.25 0 V125.75 A48.5 48.5 0 0 0 132.75 174.25 H1547.25 A48.5 48.5 0 0 1 1595.75 222.75 V700"
              pathLength={1}
              stroke="#fff"
              strokeWidth="8"
            />
          </mask>
        </defs>
        <path
          className="about-road-draw"
          d="M60 0 V150 A48.5 48.5 0 0 0 108.5 198.5 H1523 A48.5 48.5 0 0 1 1571.5 247 V700"
          pathLength={1}
          stroke="#60D3AA"
          strokeWidth="3"
        />
        <path
          className="about-road-draw"
          d="M108.5 0 V101.5 A48.5 48.5 0 0 0 157 150 H1571.5 A48.5 48.5 0 0 1 1620 198.5 V700"
          pathLength={1}
          stroke="#60D3AA"
          strokeWidth="3"
        />
        <path
          d="M84.25 0 V125.75 A48.5 48.5 0 0 0 132.75 174.25 H1547.25 A48.5 48.5 0 0 1 1595.75 222.75 V700"
          mask="url(#about-road-draw-mask)"
          stroke="#9CEE8C"
          strokeDasharray="82 82"
          strokeWidth="3"
        />
      </svg>
      <div className="about-teaser-inner">
        <h2 className="about-teaser-title">
          {TITLE_WORDS.map((word, i) => (
            <Fragment key={i}>
              <span className="word-mask">
                <span className="word-inner">{word}</span>
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
      </div>
    </section>
  )
}
