'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

const TITLE_WORDS = 'חוד החנית של ענף התחבורה בישראל'.split(' ')

const SUBTITLE_WORDS =
  'אלקטרה אפיקים מהווה כיום את חוד החנית של ענף התחבורה בישראל. החברה, שהחלה את דרכה בשנת 2008 עם זכייה באשכול שומרון, עברה קפיצת מדרגה אסטרטגית בשנת 2021 עם רכישת השליטה על ידי קבוצת אלקטרה ומיזוג פעילות "אגד תעבורה".'.split(
    ' ',
  )

type Step = {
  id: number
  title?: string
  text: string
}

const STEPS: Step[] = [
  {
    id: 0,
    title: 'יבוא',
    text: 'כחברה המפעילה כ-280 קווי שירות ומסיעה כ-52 מיליון נוסעים בשנה, אנו מהווים עורק חיים מרכזי במשק הישראלי. הפעילות שלנו מתאפיינת בניהול מבוסס נתונים, הקפדה על דיוק במבצעי ושיפור מתמיד של חוויית הנוסע.',
  },
  {
    id: 1,
    title: 'הפעלה',
    text: 'הפעלה וניהול של מערכי תחבורה ציבורית בפריסה ארצית, תוך עמידה בסטנדרטים מתקדמים של שירות ובטיחות.',
  },
  {
    id: 2,
    title: 'תחזוקה',
    text: 'מערכי תחזוקה מתקדמים, מוסכים ותשתיות טעינה - המבטיחים רציפות תפעולית וזמינות גבוהה לציי הרכב.',
  },
  {
    id: 3,
    title: 'הכשרה והסמכה',
    text: 'הכשרת דור העתיד של אנשי התחבורה בישראל, במכללה ייעודית לפיתוח מקצועי ואיכות השירות.',
  },
  {
    id: 4,
    title: 'תשתיות',
    text: 'פיתוח ותחזוקה של תשתיות תחבורה מתקדמות, כחלק ממחויבותנו לצמיחה ארוכת טווח של ענף התחבורה.',
  },
  {
    id: 5,
    title: 'יבוא',
    text: 'ייבוא ושילוב של אוטובוסים ופתרונות תחבורה חדשניים, בהתאמה לדרישות הרגולציה ולצרכי השוק הישראלי.',
  },
]

const STEP_COUNT = STEPS.length

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const circleLayerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLImageElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  // useIsomorphicLayoutEffect (not useEffect) — this effect pins with
  // ScrollTrigger; see the hook's comment for why the cleanup must be
  // synchronous.
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !ringRef.current) return

    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[]
    if (items.length !== STEP_COUNT) return

    const ctx = gsap.context(() => {
      const titleWords = containerRef.current!.querySelectorAll('.about-hero-word')
      const subWords = containerRef.current!.querySelectorAll('.about-hero-sub-word')

      // Load-time entrance for the titles (independent of scroll).
      gsap.set(titleWords, { autoAlpha: 0, y: 24 })
      gsap.set(subWords, { autoAlpha: 0, y: 12 })
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .to(titleWords, { autoAlpha: 1, duration: 0.7, stagger: 0.08, y: 0 }, 0.3)
        .to(subWords, { autoAlpha: 1, duration: 0.4, stagger: 0.012, y: 0 }, '-=0.3')

      gsap.set(circleLayerRef.current, { autoAlpha: 0 })
      gsap.set(items[0], { opacity: 1, y: 0 })
      for (let i = 1; i < STEP_COUNT; i++) {
        gsap.set(items[i], { opacity: 0, y: 30 })
      }

      // One pinned scrub over the whole area — the hero video stays as the
      // backdrop the entire time (single video-backed area, per the client):
      // phase 1 hands the titles off to the circle, phase 2 plays the stepped
      // circle story exactly as before.
      const tl = gsap.timeline()

      // Phase 1 — handoff: an overlapping crossfade (circle starts entering
      // at 0.35 while the titles are still leaving until 0.7), with sine
      // eases — gentle response to scroll, no dead "blank" moment between
      // the two layers. The whole content block leaves (not per-word: the
      // load-time entrance animates the words, so scrubbing the block avoids
      // property conflicts).
      tl.to(contentRef.current, { autoAlpha: 0, y: -60, duration: 0.7, ease: 'sine.in' }, 0)
      tl.fromTo(
        circleLayerRef.current,
        { autoAlpha: 0, y: 80, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'sine.out' },
        0.35,
      )

      // Phase 2 — the stepped story (same pacing as the old circle section).
      for (let i = 0; i < STEP_COUNT - 1; i++) {
        tl.to(items[i], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, `step${i}`)
        tl.fromTo(
          items[i + 1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          `step${i}+=0.25`,
        )
      }

      // Continuous "steering wheel" turn from the moment the circle enters,
      // independent of the stepped content crossfade above.
      tl.fromTo(
        ringRef.current,
        { rotation: 0 },
        { duration: tl.duration() - 0.35, ease: 'none', rotation: 360 },
        0.35,
      )

      // NOTE: no `snap` here. ScrollTrigger's snap sets the scroll position
      // directly, which fights Lenis smooth-scroll (both try to own the scroll)
      // and traps the user in this pinned section — gentle scrolls can't get
      // past. The stepped crossfade still plays via `scrub` as you scroll.
      ScrollTrigger.create({
        animation: tl,
        anticipatePin: 1,
        end: `+=${100 + STEP_COUNT * 50}%`,
        pin: true,
        pinSpacing: true,
        // 0.5 (was 0.3): a slightly longer catch-up smooths the handoff and
        // step crossfades without feeling laggy under Lenis.
        scrub: 0.5,
        start: 'top top',
        trigger: containerRef.current,
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

      <div className="about-hero-content" ref={contentRef}>
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

      <div className="about-hero-circle-layer" ref={circleLayerRef}>
        <div className="about-circle-stage">
          <img
            alt=""
            className="about-circle-ring"
            ref={ringRef}
            src="/about%20page/circle%20about%20section%202.svg"
          />
          <div className="about-circle-text-stack">
            {STEPS.map((step, i) => (
              <div
                className="about-circle-item"
                key={step.id}
                ref={(el) => { itemsRef.current[i] = el }}
              >
                {step.title && <h3 className="about-circle-title">{step.title}</h3>}
                <p className="about-circle-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
