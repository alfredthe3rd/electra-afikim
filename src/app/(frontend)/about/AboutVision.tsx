'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useReveal } from '../useReveal'

gsap.registerPlugin(ScrollTrigger)

type Value = {
  id: number
  title: string
  text: string
}

const VALUES: Value[] = [
  {
    id: 1,
    title: 'מצוינות תפעולית וכלכלית',
    text: 'הפעלה איכותית ברמת ביצוע ושירותיות גבוהה, תוך מימוש כלים כלכליים בכל מרכיבי העשייה',
  },
  {
    id: 2,
    title: 'העובד במרכז',
    text: 'חיזוק המקצועיות והשירותיות של המשאב האנושי בחברה',
  },
  {
    id: 3,
    title: 'פיתוח עסקי',
    text: 'צמיחה, הרחבת פעילות, הגדלת נתח השוק וכניסה לתחומים חדשים',
  },
  {
    id: 4,
    title: 'בטיחות',
    text: 'שיפור הבטיחות בכל מרכיבי העשייה',
  },
]

const STEP_COUNT = VALUES.length

const TITLE_WORDS = 'החזון שלנו'.split(' ')
const SUBTITLE_LINE1 = 'אלקטרה אפיקים מובילה בתחום התחבורה,'
const SUBTITLE_LINE2 = 'צומחת, חדשנית, מצוינת תפעולית וכלכלית'

export function AboutVision() {
  const { ref: topRef, visible } = useReveal<HTMLDivElement>()
  const pinRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // Mobile lays the four cards out as a static 2-up grid under the video
  // instead of crossfading them in a pinned column, so the whole effect below
  // is desktop-only. That guard also has to cover the gsap.set calls at the
  // top of the effect: they run outside gsap.context, so ctx.revert() would
  // not undo the autoAlpha:0 they leave on cards 2-4.
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
    if (isMobile || !pinRef.current) return

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length !== STEP_COUNT) return

    gsap.set(cards[0], { autoAlpha: 1, y: '0%' })
    for (let i = 1; i < STEP_COUNT; i++) {
      gsap.set(cards[i], { autoAlpha: 0, y: '40%' })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })

      for (let i = 0; i < STEP_COUNT - 1; i++) {
        tl.to(cards[i], { autoAlpha: 0, duration: 0.8, y: '-40%' }, `step${i}`)
        tl.fromTo(
          cards[i + 1],
          { autoAlpha: 0, y: '40%' },
          { autoAlpha: 1, duration: 0.8, y: '0%' },
          `step${i}+=0.1`,
        )
      }

      // No `snap` — it fights Lenis smooth-scroll and traps the user in the
      // pinned section (see AboutCircle for the full explanation). The card
      // crossfade still plays via `scrub`.
      ScrollTrigger.create({
        animation: tl,
        anticipatePin: 1,
        end: `+=${STEP_COUNT * 50}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        start: 'top top',
        trigger: pinRef.current,
      })
    }, pinRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section className="about-vision-section">
      <div className={`about-vision-top${visible ? ' is-visible' : ''}`} ref={topRef}>
        <h2 className="about-vision-title">
          {TITLE_WORDS.map((word, i) => (
            <Fragment key={i}>
              <span className="word-mask">
                <span className="word-inner" style={{ transitionDelay: `${i * 0.1}s` }}>
                  {word}
                </span>
              </span>
              {i < TITLE_WORDS.length - 1 && ' '}
            </Fragment>
          ))}
        </h2>
        <p className="about-vision-subtitle">
          {SUBTITLE_LINE1}
          <br />
          {SUBTITLE_LINE2}
        </p>
      </div>

      <div className="about-vision-bottom" ref={pinRef}>
        <div className="about-vision-left">
          <div className="about-vision-card-stack">
            {VALUES.map((value, i) => (
              <div
                className="about-vision-card"
                key={value.id}
                ref={(el) => { cardsRef.current[i] = el }}
              >
                <h3 className="about-vision-card-title">{value.title}</h3>
                <p className="about-vision-card-text">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="about-vision-right">
          <video
            autoPlay
            className="about-vision-video"
            loop
            muted
            playsInline
            src="/about%20page/buss%20section%204.mp4"
          />
        </div>
      </div>
    </section>
  )
}
