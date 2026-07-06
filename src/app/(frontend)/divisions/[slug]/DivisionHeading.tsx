'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  logoAlt: string | null
  logoUrl: string | null
  subtitle: string | null
  tertiaryTitle: string | null
  title: string
}

export function DivisionHeading({ logoAlt, logoUrl, subtitle, tertiaryTitle, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const tertiaryRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = subtitleRef.current?.querySelectorAll('.division-word')

      gsap.set(titleRef.current, { opacity: 0 })
      if (words?.length) gsap.set(words, { opacity: 0, y: 10 })
      gsap.set(tertiaryRef.current, { opacity: 0, y: 20 })

      const tl = gsap.timeline({ paused: true })

      tl.to(titleRef.current, { duration: 0.6, opacity: 1 }, 0)

      if (words?.length) {
        tl.to(words, { duration: 0.4, opacity: 1, stagger: 0.08, y: 0 }, 0.2)
      }

      tl.to(tertiaryRef.current, { duration: 0.6, opacity: 1, y: 0 }, 1.3)

      ScrollTrigger.create({
        once: true,
        onEnter: () => tl.play(),
        start: 'top 80%',
        trigger: containerRef.current,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const subtitleWords = subtitle ? subtitle.split(' ') : []

  return (
    <div className="division-heading" ref={containerRef}>
      {logoUrl && <img alt={logoAlt ?? ''} className="division-logo" src={logoUrl} />}
      <h1 ref={titleRef}>{title}</h1>
      {subtitle && (
        <h2 ref={subtitleRef}>
          {subtitleWords.map((word, index) => (
            <span className="division-word" key={index}>
              {word}
              {index < subtitleWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>
      )}
      {tertiaryTitle && <h3 ref={tertiaryRef}>{tertiaryTitle}</h3>}
    </div>
  )
}
