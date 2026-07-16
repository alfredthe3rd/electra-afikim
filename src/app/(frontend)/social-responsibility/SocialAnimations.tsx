'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll/entrance animations for the social-responsibility page. Rendered as
 * a null client component so the page itself stays a server component.
 * Targets the page's elements by class. Does not touch the image carousel —
 * that has its own separate marquee animation.
 */
export function SocialAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero video — settle-zoom on load, matching the hero pattern used
      //    elsewhere on the site (AboutHero, divisions lobby, division banner).
      gsap.from('.social-hero-video', {
        scale: 1.12,
        duration: 1.6,
        ease: 'power2.out',
      })

      // 2. Titles — fade-up when scrolled into view.
      const titleEls = gsap.utils.toArray<HTMLElement>('.social-title, .social-subtitle')
      if (titleEls.length) {
        gsap.set(titleEls, { autoAlpha: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.social-titles',
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

      // 3. Three responsibility cards — staggered reveal, mirroring the same
      //    pattern used for good-to-know cards / divisions lobby / partners grid.
      const cards = gsap.utils.toArray<HTMLElement>('.social-card')
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.social-cards',
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

      // 4. CTA section — title and button fade up together.
      const ctaEls = gsap.utils.toArray<HTMLElement>(
        '.social-cta-title, .social-cta-section .division-cta',
      )
      if (ctaEls.length) {
        gsap.set(ctaEls, { autoAlpha: 0, y: 30 })
        ScrollTrigger.create({
          trigger: '.social-cta-section',
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(ctaEls, {
              autoAlpha: 1,
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
