'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll/entrance animations for the division template page. Rendered as a
 * null client component so the page itself stays a server component (it
 * fetches the division from Payload). Targets the page's elements by class.
 * DivisionHeading already animates its own title/subtitle — this covers the
 * parts that were still static: the banner, the text/image columns, and the
 * "good to know" cards.
 */
export function DivisionAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Banner — subtle settle-zoom on load (scale only; overflow:hidden on
      //    the banner already clips it), matching the hero pattern used
      //    elsewhere on the site (AboutHero, divisions lobby hero).
      gsap.from('.division-banner img', {
        scale: 1.12,
        duration: 1.6,
        ease: 'power2.out',
      })

      // 2. Text/image columns — fade-up in, staggered, when scrolled into view.
      const columns = gsap.utils.toArray<HTMLElement>(
        '.division-columns > .division-text, .division-columns > .division-image',
      )
      if (columns.length) {
        gsap.set(columns, { autoAlpha: 0, y: 40 })
        ScrollTrigger.create({
          trigger: '.division-columns',
          start: 'top 75%',
          once: true,
          onEnter: () =>
            gsap.to(columns, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
            }),
        })
      }

      // 3. "כדאי לדעת עלינו" cards — staggered reveal, mirroring the same
      //    pattern used for the divisions lobby grid and homepage partners grid.
      const cards = gsap.utils.toArray<HTMLElement>('.good-to-know-card')
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.good-to-know-grid',
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
            }),
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
