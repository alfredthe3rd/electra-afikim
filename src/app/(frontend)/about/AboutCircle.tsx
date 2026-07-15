'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

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

export function AboutCircle() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLImageElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !ringRef.current) return

    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[]
    if (items.length !== STEP_COUNT) return

    gsap.set(items[0], { opacity: 1, y: 0 })
    for (let i = 1; i < STEP_COUNT; i++) {
      gsap.set(items[i], { opacity: 0, y: 30 })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      for (let i = 0; i < STEP_COUNT - 1; i++) {
        tl.to(items[i], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, `step${i}`)
        tl.fromTo(
          items[i + 1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          `step${i}+=0.25`,
        )
      }

      // Continuous "steering wheel" turn spanning the whole pinned scroll,
      // independent of the stepped/snapped content crossfade above.
      tl.fromTo(
        ringRef.current,
        { rotation: 0 },
        { duration: tl.duration(), ease: 'none', rotation: 360 },
        0,
      )

      ScrollTrigger.create({
        animation: tl,
        anticipatePin: 1,
        end: `+=${STEP_COUNT * 50}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        snap: {
          delay: 0,
          duration: { min: 0.2, max: 0.4 },
          ease: 'power1.inOut',
          snapTo: 1 / (STEP_COUNT - 1),
        },
        start: 'top top',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-circle-section" ref={sectionRef}>
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
    </section>
  )
}
