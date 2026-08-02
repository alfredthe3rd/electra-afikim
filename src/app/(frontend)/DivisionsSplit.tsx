'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

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
  const mobileVideosRef = useRef<(HTMLVideoElement | null)[]>([])

  // Mobile replaces the pinned 50/50 split with a plain vertical stack
  // (video → logo → text per division), so the whole ScrollTrigger timeline
  // below is desktop-only. State, not a one-off read, so crossing the
  // breakpoint tears the pin down / builds it back up.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Seven autoplaying videos at once would be brutal on a phone's battery and
  // data, and the desktop markup already ships its own copies — so the mobile
  // set is preload="none" and only the one on screen plays.
  useEffect(() => {
    if (!isMobile) return
    const videos = mobileVideosRef.current.filter(Boolean) as HTMLVideoElement[]
    if (!videos.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { rootMargin: '100px 0px', threshold: 0.25 },
    )
    videos.forEach((video) => observer.observe(video))
    return () => observer.disconnect()
  }, [isMobile])

  // useIsomorphicLayoutEffect (not useEffect) — this effect pins with
  // ScrollTrigger; see the hook's comment for why the cleanup must be
  // synchronous.
  useIsomorphicLayoutEffect(() => {
    if (isMobile || !sectionRef.current) return

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
  }, [isMobile])

  return (
    <section className="divisions-split" ref={sectionRef}>
      <div className="divisions-split-left">
        <div className="divisions-split-header">
          <h2 className="divisions-split-title" ref={titleRef}>
            {TITLE_WORDS.join(' ')}
          </h2>
          <p className="divisions-split-subtitle" ref={subtitleRef}>
            {/* Explicit space before the break: mobile hides the <br>, and JSX
                strips the newline around it, so without this the two halves
                would run together as "משלימים,היוצרים". */}
            אלקטרה אפיקים מרכזת תחתיה מגוון תחומי פעילות משלימים,{' '}
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

      {/* Mobile layout — the pinned crossfade doesn't survive a phone-width
          column, so every division simply stacks: video → logo → text.
          Rendered alongside the desktop markup (rather than swapped in after
          mount) so server and client HTML match; CSS picks the one to show.
          preload="none" keeps the desktop page from fetching all seven files
          a second time — the effect above starts each one as it scrolls in. */}
      <div className="divisions-split-mobile">
        {STEPS.map((step, i) => (
          <article className="divisions-mobile-step" key={step.id}>
            <div className="divisions-mobile-video">
              <video
                loop
                muted
                playsInline
                preload="none"
                ref={(el) => { mobileVideosRef.current[i] = el }}
                src={step.video}
              />
            </div>
            <img alt="" className="divisions-mobile-logo" src={step.logo} />
            <p className="divisions-mobile-text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
