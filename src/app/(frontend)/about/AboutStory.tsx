'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type CSSProperties, Fragment, useEffect, useRef, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useReveal } from '../useReveal'

gsap.registerPlugin(ScrollTrigger)

// Positions are in the road SVG's own viewBox coordinate space (3084 × 1602),
// expressed as percentages of the canvas so they scale with it.
const ROAD_W = 3084
const ROAD_H = 1602

// Road-coord fractions used to drive the scroll "camera".
const VROAD_X_FRAC = 1137 / ROAD_W // x of the vertical road segment
const Y_START_FRAC = 220 / ROAD_H // y of the first milestone (2008)
const CORNER_Y_FRAC = 1125 / ROAD_H // y of the horizontal segment (the bend)
const X_END_FRAC = 2960 / ROAD_W // x of the last milestone (2026)

// Where those road points should sit in the viewport (fractions), tunable.
const VROAD_SCREEN_X = 0.62
const START_SCREEN_Y = 0.5 // 2008 sits mid-viewport at the start, so the road's top entry stays visible below the header
const CORNER_SCREEN_Y = 0.56
const END_SCREEN_X = 0.5

// Viewport point at which a milestone "reveals" (station appears) as it arrives.
const REVEAL_SCREEN_Y = 0.5
const REVEAL_SCREEN_X = 0.55

// Road edges in road-coord units (the road SVG's outer lanes).
const V_ROAD_LEFT = 1113
const V_ROAD_RIGHT = 1161
const H_ROAD_TOP = 1101
const H_ROAD_BOTTOM = 1150

// Gap (px, on screen) between the road and the pins / text. The canvas is sized
// (not CSS-scaled), so transform px are literal screen px.
const GAP = 30

type Milestone = {
  year: string
  lines: string[]
  bullets?: boolean
  x: number
  y: number
  orient: 'v' | 'h'
  icon: 1 | 2 | 3
}

const MILESTONES: Milestone[] = [
  { year: '2008', lines: ['זכייה באשכול שומרון והקמת אפיקים'], x: 1137, y: 220, orient: 'v', icon: 1 },
  {
    year: '2011',
    lines: ['רכישת פעילות התחבורה הציבורית Connex', '(Veolia) - אשכולות בני ברק אשדוד וטבריה'],
    x: 1137,
    y: 470,
    orient: 'v',
    icon: 2,
  },
  { year: '2015', lines: ['תחילת הפעלה באשכול אשדוד בין-עירוני'], x: 1137, y: 690, orient: 'v', icon: 3 },
  {
    year: '2016',
    lines: ['תחילת הפעלה באשכולות אשדוד עירוני ופתח תקווה - ראש העין'],
    x: 1137,
    y: 910,
    orient: 'v',
    icon: 1,
  },
  {
    year: '2021',
    lines: ['רכישת השליטה ע"י קבוצת אלקטרה', 'מיזוג פעילות "אגד תעבורה"'],
    bullets: true,
    x: 1370,
    y: 1125,
    orient: 'h',
    icon: 2,
  },
  {
    year: '2024',
    lines: [
      'ייבוא אוטובוסים (Yutong)',
      'זכייה במכרז קו רכבת קלה חיפה-נצרת',
      'פתיחת המכללה למקצועות התחבורה',
      'חידוש צי הרכב ורכש של כ- 475 אוטובוסים',
    ],
    bullets: true,
    x: 1960,
    y: 1125,
    orient: 'h',
    icon: 3,
  },
  {
    year: '2025',
    lines: ['פיתוח אפליקציה RideEazy', 'חידוש צי הרכב ורכש כ- 227 אוטובוסים'],
    bullets: true,
    x: 2480,
    y: 1125,
    orient: 'h',
    icon: 1,
  },
  { year: '2026', lines: ['רכש 150 אוטובוסים לחידוש צי הרכב'], x: 2900, y: 1125, orient: 'h', icon: 2 },
]

const pct = (v: number, total: number) => `${(v / total) * 100}%`
const iconSrc = (n: number) => `/about%20page/story%20last%20section/icon%20${n}.svg`

// Pins sit on the OPPOSITE side of the road from the text, with a GAP px gap.
// Vertical road: text on the left, pin on the right. Horizontal road: text
// below, pin above.
const pinStyle = (m: Milestone): CSSProperties =>
  m.orient === 'v'
    ? { left: pct(V_ROAD_RIGHT, ROAD_W), top: pct(m.y, ROAD_H), transform: `translate(${GAP}px, -50%)` }
    : {
        left: pct(m.x, ROAD_W),
        top: pct(H_ROAD_TOP, ROAD_H),
        transform: `translate(-50%, calc(-100% - ${GAP}px))`,
      }

const itemStyle = (m: Milestone): CSSProperties =>
  m.orient === 'v'
    ? {
        left: pct(V_ROAD_LEFT, ROAD_W),
        top: pct(m.y, ROAD_H),
        transform: `translate(calc(-100% - ${GAP}px), -50%)`,
      }
    : { left: pct(m.x, ROAD_W), top: pct(H_ROAD_BOTTOM, ROAD_H), transform: `translate(-84%, ${GAP}px)` }

export function AboutStory() {
  const { ref: headRef, visible } = useReveal<HTMLDivElement>()
  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLOListElement>(null)

  // The panning "camera" needs a canvas 2.6 viewports wide; on a phone that is
  // a 1014px ribbon whose milestones land entirely off-screen. Mobile gets a
  // vertical timeline instead (markup below), so the whole camera effect is
  // desktop-only.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Mobile reveal: each milestone fades up as it scrolls in — the closest
  // equivalent of the desktop "station arrives" beat, without the pin.
  useEffect(() => {
    if (!isMobile || !mobileRef.current) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.about-story-m-item')
      items.forEach((item, i) => {
        // The first milestone is visible immediately, matching the desktop
        // rule that 2008 is simply there rather than popping in.
        if (i === 0) return
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { once: true, start: 'top 88%', trigger: item },
            y: 0,
          },
        )
      })
    }, mobileRef)

    return () => ctx.revert()
  }, [isMobile])

  // useIsomorphicLayoutEffect (not useEffect) — this effect pins with
  // ScrollTrigger; see the hook's comment for why the cleanup must be
  // synchronous.
  useIsomorphicLayoutEffect(() => {
    if (isMobile || !viewportRef.current || !canvasRef.current) return

    const ctx = gsap.context(() => {
      const canvas = canvasRef.current!
      const compute = () => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const cw = canvas.offsetWidth
        const ch = canvas.offsetHeight
        const xV = VROAD_SCREEN_X * vw - VROAD_X_FRAC * cw
        const yStart = START_SCREEN_Y * vh - Y_START_FRAC * ch
        const yEnd = CORNER_SCREEN_Y * vh - CORNER_Y_FRAC * ch
        const xEnd = END_SCREEN_X * vw - X_END_FRAC * cw
        return { xV, yStart, yEnd, xEnd }
      }

      let vals = compute()
      gsap.set(canvas, { x: vals.xV, y: vals.yStart })

      const tl = gsap.timeline()
      tl.to(canvas, { y: () => vals.yEnd, ease: 'none', duration: 1 }) // phase 1: descend
        .to(canvas, { x: () => vals.xEnd, ease: 'none', duration: 1.6 }) // phase 2: traverse

      // Per-milestone "station reveal": each pin + year/text fades and pops in
      // as the camera arrives at it. Reveal position on the master timeline is
      // computed from where the milestone crosses the reveal line on screen.
      const vw = window.innerWidth
      const vh = window.innerHeight
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      const pins = gsap.utils.toArray<HTMLElement>('.about-story-pin')
      const years = gsap.utils.toArray<HTMLElement>('.about-story-year')
      const descs = gsap.utils.toArray<HTMLElement>('.about-story-desc')
      const revealDur = 0.2
      MILESTONES.forEach((m, i) => {
        // The first milestone (2008) is already on screen the moment the
        // section pins — it should just be there, not pop in. Every other
        // milestone keeps its scroll-triggered pin/text reveal.
        if (i === 0) {
          gsap.set(pins[i], { autoAlpha: 1, scale: 1 })
          gsap.set([years[i], descs[i]], { autoAlpha: 1, y: 0 })
          return
        }

        let t: number
        if (m.orient === 'v') {
          const targetY = REVEAL_SCREEN_Y * vh - (m.y / ROAD_H) * ch
          t = gsap.utils.clamp(0, 1, (targetY - vals.yStart) / (vals.yEnd - vals.yStart))
        } else {
          const targetX = REVEAL_SCREEN_X * vw - (m.x / ROAD_W) * cw
          const p = gsap.utils.clamp(0, 1, (targetX - vals.xV) / (vals.xEnd - vals.xV))
          t = 1 + p * 1.6
        }
        const pos = Math.max(0, t - revealDur)
        tl.fromTo(
          pins[i],
          { autoAlpha: 0, scale: 0.3 },
          { autoAlpha: 1, duration: revealDur, ease: 'back.out(1.8)', scale: 1 },
          pos,
        )
        tl.fromTo(
          [years[i], descs[i]],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, duration: revealDur, ease: 'power2.out', y: 0 },
          pos,
        )
      })

      ScrollTrigger.create({
        animation: tl,
        anticipatePin: 1,
        end: () => `+=${Math.abs(vals.yEnd - vals.yStart) + Math.abs(vals.xEnd - vals.xV)}`,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          vals = compute()
          gsap.set(canvas, { x: vals.xV, y: vals.yStart })
        },
        pin: viewportRef.current,
        scrub: 0.5,
        start: 'top top',
        trigger: viewportRef.current,
      })
    }, viewportRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section className="about-story">
      <div className={`about-story-head${visible ? ' is-visible' : ''}`} ref={headRef}>
        <h2 className="about-story-title">הסיפור שלנו</h2>
        <p className="about-story-subtitle">אבני הדרך בהתפתחות הקבוצה</p>
      </div>

      <div className="about-story-viewport" ref={viewportRef}>
        <div className="about-story-canvas" ref={canvasRef}>
          <img
            alt=""
            className="about-story-road"
            src="/about%20page/story%20last%20section/time%20road.svg"
          />

          {MILESTONES.map((m) => (
            <Fragment key={m.year}>
              <div className="about-story-pin-wrap" style={pinStyle(m)}>
                <img alt="" className="about-story-pin" src={iconSrc(m.icon)} />
              </div>
              <div className={`about-story-item about-story-item--${m.orient}`} style={itemStyle(m)}>
                <div className="about-story-year">{m.year}</div>
                {m.bullets ? (
                  <ul className="about-story-desc about-story-desc--bullets">
                    {m.lines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="about-story-desc">
                    {m.lines.map((line, i) => (
                      <Fragment key={i}>
                        {line}
                        {i < m.lines.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </p>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile timeline — the same eight milestones turned vertical, with a
          rail drawn in the site's road language (two #60D3AA edges around a
          dashed #9CEE8C centreline, see .about-story-mobile in styles.css).
          Rendered alongside the desktop canvas rather than swapped in after
          mount, so server and client HTML match; CSS picks which one shows. */}
      <ol className="about-story-mobile" ref={mobileRef}>
        {MILESTONES.map((m) => (
          <li className="about-story-m-item" key={m.year}>
            <img alt="" className="about-story-m-icon" src={iconSrc(m.icon)} />
            <div className="about-story-m-body">
              <div className="about-story-m-year">{m.year}</div>
              {m.bullets ? (
                <ul className="about-story-m-desc about-story-m-desc--bullets">
                  {m.lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="about-story-m-desc">
                  {m.lines.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < m.lines.length - 1 && <br />}
                    </Fragment>
                  ))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
