'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { mediaUrl, splitWords } from '@/lib/media'
import type { About } from '@/payload-types'

import { useReveal } from '../useReveal'

type Member = NonNullable<About['team']['topRow']>[number]

gsap.registerPlugin(ScrollTrigger)

function TeamMember({ member }: { member: Member }) {
  return (
    <div className="about-team-member">
      <img alt={member.name} className="about-team-photo" src={mediaUrl(member.photo)} />
      <div className="about-team-text">
        <p className="about-team-name">{member.name}</p>
        <p className="about-team-role">{member.role}</p>
      </div>
    </div>
  )
}

export function AboutTeam({ data }: { data: About['team'] }) {
  const TITLE_WORDS = splitWords(data.title)
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const members = gridRef.current?.querySelectorAll('.about-team-member')
      if (!members?.length) return

      gsap.set(members, { opacity: 0, y: 30 })

      ScrollTrigger.create({
        once: true,
        onEnter: () => {
          gsap.to(members, { duration: 0.7, ease: 'power3.out', opacity: 1, stagger: 0.08, y: 0 })
        },
        start: 'top 75%',
        trigger: sectionRef.current,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={`about-team-section${visible ? ' is-visible' : ''}`} ref={sectionRef}>
      <h2 className="about-team-title">
        {TITLE_WORDS.map((word, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span className="word-inner" style={{ transitionDelay: `${i * 0.1}s` }}>
                {word}
              </span>
            </span>
            {i < TITLE_WORDS.length - 1 && ' '}
          </Fragment>
        ))}
      </h2>
      <div className="about-team-rows" ref={gridRef}>
        <div className="about-team-row">
          {(data.topRow ?? []).map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
        <div className="about-team-row">
          {(data.bottomRow ?? []).map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
