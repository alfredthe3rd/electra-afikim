'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Step = {
  id: number
  logo: string
  text: string
  video: string
}

const TITLE_WORDS = 'קורת גג אחת לעולם התחבורה'.split(' ')

const STEPS: Step[] = [
  {
    id: 1,
    logo: '/logo-1.png',
    text: 'הפעלה וניהול של מערכי תחבורה ציבורית בהיקפים רחבים, בפריסה ארצית, תוך עמידה בסטנדרטים מתקדמים של שירות, בטיחות ויעילות תפעולית.',
    video: '/movie-1.mp4',
  },
  {
    id: 2,
    logo: '/logo-2.png',
    text: 'פתרונות הסעה מותאמים לארגונים, מוסדות וגופים ציבוריים - משירותים שוטפים ועד פרויקטים ייעודיים, בליווי מערך תפעולי מתקדם.',
    video: '/movie-2.mp4',
  },
  {
    id: 3,
    logo: '/logo-3.png',
    text: 'שותפות בפרויקטים לאומיים של רכבת קלה, כחלק מפיתוח תשתיות התחבורה של ישראל, תוך שילוב יכולות תפעול, תחזוקה וניהול מערכות מורכבות.',
    video: '/movie-3.mp4',
  },
  {
    id: 4,
    logo: '/logo-4.png',
    text: 'ייבוא, שיווק ושילוב של אוטובוסים ופתרונות תחבורה מתקדמים ובטכנולוגיות חשמליות חדשניות. הייבוא נעשה בהתאמה לדרישות הרגולציה ולצרכים התפעוליים של השוק הישראלי.',
    video: '/movie-4.mp4',
  },
  {
    id: 5,
    logo: '/logo-5.png',
    text: 'מערכי תחזוקה מתקדמים, מוסכים, חניונים ותשתיות טעינה ותפעול - המבטיחים רציפות תפעולית, בטיחות וזמינות גבוהה לציי רכב ולמערכות תחבורה מורכבות.',
    video: '/movie-5.mp4',
  },
  {
    id: 6,
    logo: '/logo-6.png',
    text: 'הכשרת דור העתיד של אנשי התחבורה וכוח האדם המקצועי בישראל, במכללה ייעודית למקצועות התחבורה. תוך פיתוח תכניות לימוד, קורסים, והכשרה מקצועית - כחלק מהשקעה ארוכת טווח בהון האנושי ובאיכות השירות.',
    video: '/movie-6.mp4',
  },
  {
    id: 7,
    logo: '/logo-7.png',
    text: 'שימוש בטכנולוגיה חדשנית, המאפשרת ללקוחות פרטיים ועסקיים להזמין הסעה בכל יעד ובכל מטרה - בקלות, בשקיפות ובזמינות מלאה.',
    video: '/movie-7.mp4',
  },
]

const STEP_COUNT = STEPS.length

export function DivisionsSplit() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const videosRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[]
    const videoContainers = videosRef.current.filter(Boolean) as HTMLDivElement[]
    if (slides.length !== STEP_COUNT || videoContainers.length !== STEP_COUNT) return

    // Set initial state
    gsap.set(titleRef.current, { opacity: 1, scale: 1 })
    gsap.set(subtitleRef.current, { opacity: 1, scale: 1 })
    gsap.set(slides[0], { opacity: 1, y: 0 })
    gsap.set(videoContainers[0], { y: 0 })
    for (let i = 1; i < STEP_COUNT; i++) {
      gsap.set(slides[i], { opacity: 0, y: 30 })
      gsap.set(videoContainers[i], { y: '100%' })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      for (let i = 0; i < STEP_COUNT - 1; i++) {
        // Fade out current slide
        tl.to(slides[i], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, `step${i}`)

        // Slide up next video (from 100% to 0)
        tl.to(videoContainers[i + 1], { y: 0, duration: 0.6, ease: 'power2.out' }, `step${i}+=0.15`)

        // Fade in next slide
        tl.fromTo(
          slides[i + 1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          `step${i}+=0.25`,
        )
      }

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
    <section className="divisions-split" ref={sectionRef}>
      <div className="divisions-split-left">
        <div className="divisions-split-header">
          <h2 className="divisions-split-title" ref={titleRef}>
            {TITLE_WORDS.join(' ')}
          </h2>
          <p className="divisions-split-subtitle" ref={subtitleRef}>
            אלקטרה אפיקים מרכזת תחתיה מגוון תחומי פעילות משלימים,
            <br />
            היוצרים מעטפת מלאה לכל אתגר במעגל החיים
          </p>
        </div>
        <div className="divisions-split-content-stack">
          {STEPS.map((step, i) => (
            <div
              className="divisions-split-content"
              key={step.id}
              ref={(el) => { slidesRef.current[i] = el }}
            >
              <img alt="" className="divisions-split-logo" src={step.logo} />
              <p className="divisions-split-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="divisions-split-right">
        <div className="divisions-split-video-stack">
          {STEPS.map((step, i) => (
            <div
              className="divisions-split-video-container"
              key={step.id}
              ref={(el) => { videosRef.current[i] = el }}
            >
              <video
                autoPlay
                className="divisions-split-video"
                loop
                muted
                playsInline
                src={step.video}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
