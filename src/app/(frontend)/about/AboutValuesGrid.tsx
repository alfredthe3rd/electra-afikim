'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { useReveal } from '../useReveal'

gsap.registerPlugin(ScrollTrigger)

type ValueItem = {
  number: string
  title: string
}

const VALUES_GRID: ValueItem[] = [
  { number: '01', title: 'מקצוענות ואחריות' },
  { number: '02', title: 'מצוינות תפעולית' },
  { number: '03', title: 'בטיחות ללא פשרות' },
  { number: '04', title: 'חדשנות מתמדת' },
  { number: '05', title: 'שותפות ארוכת טווח' },
  { number: '06', title: 'מחויבות לציבור ולסביבה' },
]

const TITLE_WORDS = 'ערכים שמניעים אותנו'.split(' ')

export function AboutValuesGrid() {
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Queried together (in DOM order) so each item's number is
      // immediately followed by its own title: num1, title1, num2, title2…
      const parts = gridRef.current?.querySelectorAll(
        '.about-values-number, .about-values-item-title',
      )
      if (!parts?.length) return

      gsap.set(parts, { opacity: 0, y: 24 })

      ScrollTrigger.create({
        once: true,
        onEnter: () => {
          gsap.to(parts, { duration: 0.6, ease: 'power3.out', opacity: 1, stagger: 0.18, y: 0 })
        },
        start: 'top 65%',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={`about-values-section${visible ? ' is-visible' : ''}`} ref={sectionRef}>
      <h2 className="about-values-title">
        {TITLE_WORDS.map((word, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span
                className="word-inner"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {word}
              </span>
            </span>
            {i < TITLE_WORDS.length - 1 && ' '}
          </Fragment>
        ))}
      </h2>
      <div className="about-values-grid" ref={gridRef}>
        {VALUES_GRID.map((item) => (
          <div className="about-values-item" key={item.number}>
            <span className="about-values-number">{item.number}</span>
            <h3 className="about-values-item-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
