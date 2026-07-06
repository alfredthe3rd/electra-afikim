'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type PartnerLogo = {
  file: string
  alt: string
}

// Placeholder list — update the file names here as final assets change.
const PARTNER_LOGOS: PartnerLogo[] = [
  { alt: 'אלקטרה', file: 'אלקטרה.png' },
  { alt: 'אשדוד', file: 'אשדוד.png' },
  { alt: 'יוטונג', file: 'יוטונג.png' },
  { alt: 'מדינת ישראל', file: 'מדינת ישראל.png' },
  { alt: 'מוביט', file: 'מוביט.png' },
  { alt: 'מעלה אדומים', file: 'מעלה אדומים.png' },
  { alt: 'משרד הביטחון', file: 'משרד בטחון.png' },
  { alt: 'משרד התחבורה', file: 'משרד תחבורה.png' },
  { alt: 'פורום תחב״צ', file: 'פורום תחבצ.png' },
  { alt: 'פתח תקווה', file: 'פ״ת.png' },
  { alt: 'ראש העין', file: 'ראש העין.png' },
  { alt: 'רפאל', file: 'רפאל.png' },
  { alt: 'התעשייה האווירית', file: 'תעשייה אויירית.png' },
]

const logoSrc = (file: string) => `/logos to home/${encodeURIComponent(file)}`

export function PartnersGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.partners-logo-item')
      if (!items?.length) return

      gsap.set(items, { opacity: 0, y: 30 })

      ScrollTrigger.create({
        once: true,
        onEnter: () => {
          gsap.to(items, { duration: 0.8, ease: 'power3.out', opacity: 1, stagger: 0.1, y: 0 })
        },
        start: 'top 80%',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="partners-section" ref={sectionRef}>
      <h2 className="partners-title">גאים לעבוד בשותפות עם הגופים שמובילים את התחבורה בישראל</h2>
      <div className="partners-grid" ref={gridRef}>
        {PARTNER_LOGOS.map((logo) => (
          <div className="partners-logo-item" key={logo.file}>
            <img alt={logo.alt} className="partners-logo-img" src={logoSrc(logo.file)} />
          </div>
        ))}
      </div>
    </section>
  )
}
