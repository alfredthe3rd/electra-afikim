'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll/entrance animations for the divisions lobby page. Rendered as a null
 * client component so the page itself stays a server component (it fetches the
 * divisions from Payload). Targets the page's elements by class.
 */
export function LobbyAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero video — subtle settle-zoom on load (scale only, no opacity, so
      //    there's no flash of the prominent above-the-fold video).
      gsap.from('.divisions-lobby-hero-video', {
        scale: 1.12,
        duration: 1.6,
        ease: 'power2.out',
      })

      // 2. Titles — fade-up when scrolled into view.
      const titleEls = gsap.utils.toArray<HTMLElement>(
        '.divisions-lobby-title, .divisions-lobby-subtitle',
      )
      if (titleEls.length) {
        gsap.set(titleEls, { autoAlpha: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.divisions-lobby-titles',
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(titleEls, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
            }),
        })
      }

      // 3. Grid cards — staggered reveal, mirroring PartnersGrid on the homepage.
      //    Only the visible grid's cards: the desktop grid and its .lattice-m
      //    mobile twin both live in the DOM, and staggering the hidden set
      //    would delay the visible one. The trigger is the section (always
      //    displayed) rather than either grid.
      const cards = gsap.utils
        .toArray<HTMLElement>('.divisions-lobby-card')
        .filter((el) => el.offsetParent !== null)
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.divisions-lobby-grid-section',
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            }),
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
