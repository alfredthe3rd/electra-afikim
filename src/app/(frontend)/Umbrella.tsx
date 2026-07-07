'use client'

import { Fragment } from 'react'

import { useReveal } from './useReveal'

const TITLE_WORDS = 'קורת גג אחת לעולם התחבורה'.split(' ')

export function Umbrella() {
  const { ref: sectionRef, visible } = useReveal<HTMLElement>()

  return (
    <section className={`umbrella${visible ? ' is-visible' : ''}`} ref={sectionRef}>
      <h2 className="umbrella-title">
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
      <p className="umbrella-text">
        אלקטרה אפיקים מרכזת תחתיה מגוון תחומי פעילות משלימים,
        <br />
        היוצרים מעטפת מלאה לכל אתגר במעגל החיים
      </p>
    </section>
  )
}
