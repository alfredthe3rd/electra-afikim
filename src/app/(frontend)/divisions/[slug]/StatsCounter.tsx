'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export type StatItem = {
  id: string
  imageAlt: string | null
  imageUrl: string | null
  number: string | null
  title: string | null
}

type Props = {
  items: StatItem[]
}

type ParsedNumber = {
  suffix: string
  value: number
}

const parseNumber = (raw: string): ParsedNumber | null => {
  const match = raw.match(/^(\d+)(.*)$/)
  if (!match) return null
  return { suffix: match[2], value: parseInt(match[1], 10) }
}

const formatNumber = (value: number): string => Math.round(value).toLocaleString('en-US')

const getInitialDisplay = (raw: string): string => {
  const parsed = parseNumber(raw)
  return parsed ? `0${parsed.suffix}` : raw
}

export function StatsCounter({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)
  const numberRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        const el = numberRefs.current[index]
        if (!el || !item.number) return

        const parsed = parseNumber(item.number)
        if (!parsed) return

        const counter = { value: 0 }

        ScrollTrigger.create({
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              duration: 2,
              ease: 'power1.out',
              onUpdate: () => {
                el.textContent = `${formatNumber(counter.value)}${parsed.suffix}`
              },
              value: parsed.value,
            })
          },
          start: 'top 85%',
          trigger: el,
        })
      })
    }, gridRef)

    return () => ctx.revert()
  }, [items])

  return (
    <section className="stats">
      <h2 className="stats-heading">הפעילות שלנו במספרים</h2>
      <div className="stats-grid" ref={gridRef}>
        {items.map((item, index) => (
          <div className="stats-item" key={item.id}>
            {item.imageUrl && (
              <img alt={item.imageAlt ?? ''} className="stats-item-image" src={item.imageUrl} />
            )}
            {item.title && <div className="stats-item-title">{item.title}</div>}
            {item.number && (
              <div
                className="stats-item-number"
                ref={(node) => {
                  numberRefs.current[index] = node
                }}
              >
                {getInitialDisplay(item.number)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
