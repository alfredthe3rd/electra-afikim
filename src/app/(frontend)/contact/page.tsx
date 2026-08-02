'use client'

import { FormEvent, useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    // TODO: wire up to API
    setTimeout(() => setStatus('sent'), 1000)
  }

  return (
    <section className="contact-hero">
      <video
        autoPlay
        className="contact-hero-video"
        loop
        muted
        playsInline
        src="/movie-1.mp4"
      />
      <div className="contact-hero-overlay" />

      <div className="contact-container">
        <div className="contact-top">
          <h1 className="contact-title">דברו איתנו</h1>
          <p className="contact-subtitle">
            {/* Explicit space before the break: mobile hides the <br> so the
                copy can wrap on its own, and JSX strips the newline around it,
                so without this the halves would join as "בישראל.המחויבות". */}
            כקבוצת תחבורה המניעה מיליוני אזרחים, אנו רואים בעצמנו שותף מרכזי לעיצוב פני החברה
            והסביבה בישראל.{' '}
            <br className="contact-subtitle-break" />
            המחויבות שלנו חורגת מעבר למדדים העסקיים ונוגעת בלב האתגרים הלאומיים.
          </p>
          <img alt="" className="contact-separator" src="/Vector%2018.svg" />
        </div>

        <div className="contact-bottom">
          <div className="contact-info-card">
            <p className="contact-info-item">*6686</p>
            <p className="contact-info-item">
              <a href="mailto:info@electra-afikim.co.il">info@electra-afikim.co.il</a>
            </p>
            <p className="contact-info-item">הערבה 1 בנין SIV גבעת שמואל</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <input
                className="contact-input"
                name="name"
                placeholder="שם מלא"
                required
                type="text"
              />
              <input
                className="contact-input"
                name="phone"
                placeholder="טלפון"
                required
                type="tel"
              />
              <input
                className="contact-input"
                name="email"
                placeholder='דוא"ל'
                required
                type="email"
              />
            </div>
            <textarea
              className="contact-input contact-textarea"
              name="message"
              placeholder="ההודעה שלי"
              rows={4}
            />
            <button className="division-cta contact-submit" disabled={status === 'sending'} type="submit">
              {status === 'sending' ? 'שולח...' : status === 'sent' ? 'נשלח בהצלחה!' : 'צרו קשר'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
