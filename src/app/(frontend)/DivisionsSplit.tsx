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

type Layer = {
  content: HTMLDivElement | null
  logo: HTMLImageElement | null
  text: HTMLParagraphElement | null
  video: HTMLVideoElement | null
}

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

const HOLD = 1
const FADE_OUT = 0.3
const FADE_IN = 0.35
const OVERLAP = 0.15

export function DivisionsSplit() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const content0 = useRef<HTMLDivElement>(null)
  const content1 = useRef<HTMLDivElement>(null)
  const logo0 = useRef<HTMLImageElement>(null)
  const logo1 = useRef<HTMLImageElement>(null)
  const text0 = useRef<HTMLParagraphElement>(null)
  const text1 = useRef<HTMLParagraphElement>(null)
  const video0 = useRef<HTMLVideoElement>(null)
  const video1 = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!content0.current || !video0.current) return

    const layers: [Layer, Layer] = [
      { content: content0.current, logo: logo0.current, text: text0.current, video: video0.current },
      { content: content1.current, logo: logo1.current, text: text1.current, video: video1.current },
    ]

    const applyStep = (layer: Layer, step: Step) => {
      if (layer.logo) layer.logo.src = step.logo
      if (layer.text) layer.text.textContent = step.text
      if (layer.video) {
        layer.video.src = step.video
        layer.video.load()
        layer.video.play().catch(() => {})
      }
    }

    const ctx = gsap.context(() => {
      gsap.set([layers[1].content, layers[1].video], { opacity: 0, y: 30 })

      const tl = gsap.timeline({ paused: true })
      // activeAt[i] is the tl-time at which step i becomes the active
      // (visible) one — used below to derive the correct step purely from
      // scroll progress, since a GSAP .call() fired during the timeline
      // build fires identically in both scrub directions and can't tell
      // "arriving at step i" from "leaving step i", which breaks reverse
      // scrubbing.
      const activeAt: number[] = [0]

      STEPS.forEach((_step, i) => {
        if (i > 0) {
          const inLayer = layers[i % 2]
          const outLayer = layers[1 - (i % 2)]
          const outStart = tl.duration()

          tl.to([outLayer.content, outLayer.video], { duration: FADE_OUT, ease: 'power1.in', opacity: 0 })

          const fadeInStart = outStart + FADE_OUT - OVERLAP
          activeAt.push(fadeInStart)

          tl.fromTo(
            [inLayer.content, inLayer.video],
            { opacity: 0, y: 30 },
            {
              duration: FADE_IN,
              ease: 'power2.out',
              immediateRender: false,
              opacity: 1,
              y: 0,
            },
            fadeInStart,
          )
        }
        if (i < STEPS.length - 1) {
          tl.to({}, { duration: HOLD })
        }
      })

      let activeIndex = 0

      ScrollTrigger.create({
        animation: tl,
        end: '+=700%',
        onUpdate: (self) => {
          const currentTime = self.progress * tl.duration()
          let index = 0
          for (let i = activeAt.length - 1; i >= 0; i--) {
            if (currentTime >= activeAt[i]) {
              index = i
              break
            }
          }
          if (index !== activeIndex) {
            activeIndex = index
            applyStep(layers[index % 2], STEPS[index])
          }
        },
        pin: true,
        scrub: 1,
        start: 'top top',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="divisions-split" ref={sectionRef}>
      <div className="divisions-split-left">
        <div className="divisions-split-content-stack">
          <div className="divisions-split-content" ref={content0}>
            <img alt="" className="divisions-split-logo" ref={logo0} src={STEPS[0].logo} />
            <p className="divisions-split-text" ref={text0}>
              {STEPS[0].text}
            </p>
          </div>
          <div className="divisions-split-content" ref={content1}>
            <img alt="" className="divisions-split-logo" ref={logo1} />
            <p className="divisions-split-text" ref={text1} />
          </div>
        </div>
      </div>
      <div className="divisions-split-right">
        <div className="divisions-split-video-stack">
          <video
            autoPlay
            className="divisions-split-video"
            loop
            muted
            playsInline
            ref={video0}
            src={STEPS[0].video}
          />
          <video autoPlay className="divisions-split-video" loop muted playsInline ref={video1} />
        </div>
      </div>
    </section>
  )
}
