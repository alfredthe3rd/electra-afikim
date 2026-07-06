'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const HEADER_REVEAL_END = 0.2
const LOGO_CROSSFADE_START = 0.85
const TITLES_START = 0.88

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!lottieRef.current || !logoRef.current) return

    const header = document.querySelector<HTMLElement>('.site-header')
    const headerLogo = document.querySelector<HTMLElement>('.site-header-logo')

    let deltaX = 0
    let deltaY = 0
    let logoScale = 1

    const measure = () => {
      if (!logoRef.current || !headerLogo) return
      const big = logoRef.current.getBoundingClientRect()
      const small = headerLogo.getBoundingClientRect()
      logoScale = small.height / big.height
      deltaX = small.left + small.width / 2 - (big.left + big.width / 2)
      deltaY = small.top + small.height / 2 - (big.top + big.height / 2)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)

    const anim = lottie.loadAnimation({
      autoplay: false,
      container: lottieRef.current,
      loop: false,
      path: '/animation_home.json',
      renderer: 'svg',
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    })

    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, { xPercent: -50, yPercent: -50 })
      if (header) gsap.set(header, { autoAlpha: 0, y: -16 })
      if (headerLogo) gsap.set(headerLogo, { opacity: 0 })

      const titlesTl = gsap.timeline({ paused: true })
      titlesTl
        .fromTo(titleRef.current, { opacity: 0 }, { duration: 0.3, ease: 'power1.out', opacity: 1 })
        .fromTo(
          subtitleRef.current,
          { xPercent: 100 },
          { duration: 0.8, ease: 'power2.inOut', xPercent: 0 },
          '-=0.1',
        )

      let titlesPlayed = false
      let animReady = false

      anim.addEventListener('DOMLoaded', () => {
        animReady = true
        anim.goToAndStop(0, true)
        ScrollTrigger.refresh()
      })

      // Created synchronously (not gated behind the lottie file's async
      // load) so this pin-spacer exists — and later sections' ScrollTriggers
      // measure their position against the correct document height — well
      // before that large JSON file has finished loading.
      ScrollTrigger.create({
        anticipatePin: 1,
        end: () => `+=${window.innerHeight * 3}`,
        onUpdate: (self) => {
          const { progress } = self

          if (animReady) anim.goToAndStop(progress * anim.totalFrames, true)

          const flip = Math.min(progress / HEADER_REVEAL_END, 1)
          const cross = Math.max(
            0,
            Math.min((flip - LOGO_CROSSFADE_START) / (1 - LOGO_CROSSFADE_START), 1),
          )

          if (header) gsap.set(header, { autoAlpha: flip, y: (1 - flip) * -16 })
          if (headerLogo) gsap.set(headerLogo, { opacity: cross })

          gsap.set(logoRef.current, {
            opacity: 1 - cross,
            scale: 1 + (logoScale - 1) * flip,
            x: deltaX * flip,
            y: deltaY * flip,
          })

          if (progress >= TITLES_START && !titlesPlayed) {
            titlesPlayed = true
            titlesTl.play()
          } else if (progress < TITLES_START && titlesPlayed) {
            titlesPlayed = false
            titlesTl.reverse()
          }

          const fillProgress = Math.max(
            0,
            Math.min((progress - TITLES_START) / (1 - TITLES_START), 1),
          )
          gsap.set(titleRef.current, { backgroundPosition: `${fillProgress * 100}% 0%` })
        },
        pin: true,
        scrub: true,
        start: 'top top',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ctx.revert()
      anim.destroy()
    }
  }, [])

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-lottie" ref={lottieRef} />
      <img alt="אלקטרה אפיקים" className="hero-logo" ref={logoRef} src="/main-logo-alectra.png" />
      <div className="hero-end-titles">
        <h1 className="hero-end-title" ref={titleRef}>
          מעצמת התחבורה של ישראל
        </h1>
        <div className="hero-end-subtitle-mask">
          <h2 className="hero-end-subtitle" ref={subtitleRef}>
            מניעים אותך ואת התחבורה בישראל - קדימה
          </h2>
        </div>
      </div>
    </section>
  )
}
