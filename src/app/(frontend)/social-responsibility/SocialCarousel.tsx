'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

/**
 * Two-row image marquee at the bottom of the social-responsibility page.
 *
 * Seamless-loop technique (the duplicated-track method):
 *   1. A base image set is repeated REPEAT times so one strip is wider than the
 *      viewport (even ultrawide) — otherwise the loop would expose a gap.
 *   2. That whole strip is rendered twice inside the track (the second copy is
 *      aria-hidden): [ set A ][ set A' ].
 *   3. GSAP slides the track by exactly -50% of its width (one full copy) with
 *      linear ease, repeating forever. At -50% copy A' sits pixel-for-pixel
 *      where copy A started, so the wrap is invisible — no seam, at any width.
 *   4. Spacing between images is a per-image `margin` (not a flex `gap`) so the
 *      last image of copy A keeps its trailing space and the A→A' boundary has
 *      the exact same gap as everywhere else (see PROGRESS.md "lesson #5").
 *
 * Top row scrolls right-to-left (xPercent 0 → -50); the bottom row runs the
 * tween in reverse (xPercent -50 → 0) for the opposite, left-to-right motion.
 * Only `transform` is animated, and the track carries `will-change: transform`.
 */

const ROW1 = [1, 2, 3, 4]
const ROW2 = [5, 6, 7, 8]
// 4 images × 4 = 16 × ~336px ≈ 5376px per copy — wider than any real monitor.
const REPEAT = 4
// Marquee speed in pixels per second (duration is derived so speed is constant
// regardless of how wide the strip ends up).
const PIXELS_PER_SECOND = 50

function srcFor(n: number) {
  // image 2's asset file is misspelled "caruel"; every other file is "carusel".
  const word = n === 2 ? 'caruel' : 'carusel'
  return `/socail%20page/image%20${word}%20${n}.jpg`
}

function repeated(base: number[]) {
  const out: number[] = []
  for (let r = 0; r < REPEAT; r++) out.push(...base)
  return out
}

export function SocialCarousel() {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect users who prefer reduced motion — leave the strip static.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const run = (track: HTMLDivElement | null, reversed: boolean) => {
        if (!track) return
        // Half the track = one copy; sliding that far makes the wrap seamless.
        const copyWidth = track.scrollWidth / 2
        const duration = copyWidth / PIXELS_PER_SECOND
        const vars = { ease: 'none', duration, repeat: -1 } as const
        if (reversed) {
          gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, ...vars }) // → LTR
        } else {
          gsap.to(track, { xPercent: -50, ...vars }) // → RTL
        }
      }
      run(row1Ref.current, false) // top row → right-to-left
      run(row2Ref.current, true) // bottom row → left-to-right
    })

    return () => ctx.revert()
  }, [])

  const set1 = repeated(ROW1)
  const set2 = repeated(ROW2)

  return (
    <section aria-hidden="true" className="social-carousel-section">
      <div className="social-carousel-row" ref={row1Ref}>
        {set1.map((n, i) => (
          <img alt="" className="social-carousel-img" key={`r1a-${i}`} src={srcFor(n)} />
        ))}
        {set1.map((n, i) => (
          <img
            alt=""
            aria-hidden="true"
            className="social-carousel-img"
            key={`r1b-${i}`}
            src={srcFor(n)}
          />
        ))}
      </div>
      <div className="social-carousel-row" ref={row2Ref}>
        {set2.map((n, i) => (
          <img alt="" className="social-carousel-img" key={`r2a-${i}`} src={srcFor(n)} />
        ))}
        {set2.map((n, i) => (
          <img
            alt=""
            aria-hidden="true"
            className="social-carousel-img"
            key={`r2b-${i}`}
            src={srcFor(n)}
          />
        ))}
      </div>
    </section>
  )
}
