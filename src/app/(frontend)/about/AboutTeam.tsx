'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fragment, useEffect, useRef } from 'react'

import { useReveal } from '../useReveal'

gsap.registerPlugin(ScrollTrigger)

type Member = {
  name: string
  role: string
  file: string
}

// DOM order is right-to-left in RTL, so the first item renders rightmost.
// Ordered to match the Figma: top row starts (rightmost) with טל כהן (מנכ"ל),
// bottom row starts (rightmost) with שרון שלמה קרואני.
const TOP_ROW: Member[] = [
  { name: 'טל כהן', role: 'מנכ"ל', file: 'טל-כהן-4.webp' },
  { name: 'יהודה הכהן', role: 'מנכ"ל חטיבת התחבורה ציבורית', file: 'יהודה-כהן.webp' },
  { name: 'שי יצחקוב', role: 'סמנכ"ל כספים', file: 'שי-יצחקוב-1.webp' },
  { name: 'שי מלכה', role: 'Customer success & innovation', file: 'shaimalka.webp' },
  { name: 'יניב שונים', role: 'סמנכ"ל טכנולוגיות ומערכות מידע', file: 'YanivShonim-1.jpg' },
]

const BOTTOM_ROW: Member[] = [
  { name: 'עו"ד שרון שלמה קרואני', role: 'יועצת משפטית', file: 'שרון שלמה.png' },
  { name: 'ערן מונרוב', role: 'סמנכ"ל משאבי אנוש', file: 'ערן-מונרוב-1.webp' },
  { name: 'איציק הדר', role: 'סמנכ"ל נכסים ותשתיות', file: 'איציק-הדר-1.webp' },
  { name: 'רועי אברהמי', role: 'סמנכ"ל אחזקה ובטיחות', file: 'רועי-אברהמי-1.webp' },
  { name: 'אשר שיטרית', role: 'סמנכ"ל תכנון ובקרה', file: 'Asher_Shitrit.webp' },
  { name: 'יוסי בוחבוט', role: 'סמנכ"ל לוגיסטיקה ורכש', file: 'יוסי-בוחבוט-1.webp' },
]

const TITLE_WORDS = 'צוות ההנהלה'.split(' ')

const photoSrc = (file: string) => `/about%20page/team%20img/${encodeURIComponent(file)}`

function TeamMember({ member }: { member: Member }) {
  return (
    <div className="about-team-member">
      <img alt={member.name} className="about-team-photo" src={photoSrc(member.file)} />
      <div className="about-team-text">
        <p className="about-team-name">{member.name}</p>
        <p className="about-team-role">{member.role}</p>
      </div>
    </div>
  )
}

export function AboutTeam() {
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
          {TOP_ROW.map((member) => (
            <TeamMember key={member.file} member={member} />
          ))}
        </div>
        <div className="about-team-row">
          {BOTTOM_ROW.map((member) => (
            <TeamMember key={member.file} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
