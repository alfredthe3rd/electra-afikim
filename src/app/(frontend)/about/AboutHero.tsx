'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useRef } from 'react'

import { mediaUrl, splitWords } from '@/lib/media'
import type { About } from '@/payload-types'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

// Where each labelled segment of `circle about section 2.svg` sits, in degrees
// clockwise from 12 o'clock (the centre of its lettering, measured from the
// SVG paths). If the ring artwork changes, re-measure these.
const SEGMENT_ANGLES: [string, number][] = [
  ['הפעלה', 1],
  ['יבוא', 59],
  ['תשתיות', 122],
  ['הכשרה', 209],
  ['תחזוקה', 299],
]

// Timeline time the wheel rests on each step between turns.
const HOLD = 0.6

/** The ring rotation that brings each step's segment to the top. Always
 *  turning clockwise (each value larger than the one before), so the wheel
 *  never jerks backwards. A title with no segment just advances 60°. */
function ringRotations(titles: string[]): number[] {
  const result: number[] = []
  for (const title of titles) {
    const angle = SEGMENT_ANGLES.find(([name]) => title.trim().startsWith(name))?.[1]
    const prev = result.at(-1)
    if (angle === undefined) {
      result.push(prev === undefined ? 0 : prev + 60)
      continue
    }
    let rotation = -angle
    if (prev === undefined) {
      result.push(rotation)
      continue
    }
    while (rotation <= prev) rotation += 360
    result.push(rotation)
  }
  return result
}

export function AboutHero({ data }: { data: About['hero'] }) {
  const TITLE_WORDS = splitWords(data.title)
  const SUBTITLE_WORDS = splitWords(data.subtitle)
  const STEPS = data.steps
  const STEP_COUNT = STEPS.length
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

      // Phase 2 — the stepped story. The ring no longer spins freely: it
      // turns in steps, so that whenever the reader rests on a step the
      // ring's segment for that step sits at 12 o'clock (client, 25.11.2026).
      // Holds between the turns give the reader a resting point.
      const rotations = ringRotations(STEPS.map((step) => step.title ?? ''))
      tl.fromTo(
        ringRef.current,
        { rotation: rotations[0] - 60 },
        { duration: 0.9, ease: 'sine.out', rotation: rotations[0] },
        0.35,
      )
      tl.to({}, { duration: HOLD })
      for (let i = 0; i < STEP_COUNT - 1; i++) {
        tl.addLabel(`step${i}`)
        tl.to(items[i], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, `step${i}`)
        tl.fromTo(
          items[i + 1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          `step${i}+=0.25`,
        )
        tl.to(
          ringRef.current,
          { duration: 0.75, ease: 'power2.inOut', rotation: rotations[i + 1] },
          `step${i}`,
        )
        tl.to({}, { duration: HOLD })
      }

      // NOTE: no `snap` here. ScrollTrigger's snap sets the scroll position
      // directly, which fights Lenis smooth-scroll (both try to own the scroll)
      // and traps the user in this pinned section — gentle scrolls can't get
      // past. The stepped crossfade still plays via `scrub` as you scroll.
      ScrollTrigger.create({
        animation: tl,
        anticipatePin: 1,
        end: `+=${100 + STEP_COUNT * 70}%`,
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
        src={mediaUrl(data.video) ?? '/about%20page/about%20hero%20movie.mp4'}
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
