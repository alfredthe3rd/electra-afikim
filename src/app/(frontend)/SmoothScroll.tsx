'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Lenis is created once in the layout, so it survives client-side navigation
  // — including its `targetScroll`, which still points at the *previous* page.
  // Next resets window.scrollTo(0, 0) on navigation, but on the very next frame
  // Lenis animates back toward that stale target, clamped to the new page's max
  // scroll. Land on a tall page, flick the wheel, and click a nav link before
  // the 1.5s easing finishes, and the new page opens at its bottom.
  //
  // Resetting Lenis itself (not window.scrollTo) is what matters: `immediate`
  // sets animatedScroll *and* targetScroll to 0, which kills the in-flight
  // animation instead of leaving it to resume.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      // Don't fight the browser's own scroll restoration on a reload.
      isFirstRender.current = false
      return
    }
    lenisRef.current?.scrollTo(0, { force: true, immediate: true })
  }, [pathname])

  return null
}
