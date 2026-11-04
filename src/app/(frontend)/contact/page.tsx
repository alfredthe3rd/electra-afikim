import { Fragment } from 'react'

import { getGlobal } from '@/lib/content'
import { mediaUrl, splitLines } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'

import { ContactForm } from './ContactForm'

export async function generateMetadata() {
  const contact = await getGlobal('contact')
  return pageMetadata(contact.meta, '/contact', {
    description: contact.page.subtitle,
    title: contact.page.title,
  })
}

export default async function ContactPage() {
  const [{ form, page }, { contactDetails }] = await Promise.all([
    getGlobal('contact'),
    getGlobal('site-settings'),
  ])
  const subtitleLines = splitLines(page.subtitle)

  return (
    <section className="contact-hero">
      <video
        autoPlay
        className="contact-hero-video"
        loop
        muted
        playsInline
        src={mediaUrl(page.video) ?? '/movie-1.mp4'}
      />
      <div className="contact-hero-overlay" />

      <div className="contact-container">
        <div className="contact-top">
          <h1 className="contact-title">{page.title}</h1>
          <p className="contact-subtitle">
            {/* Explicit space before the break: mobile hides the <br> so the
                copy can wrap on its own, and JSX strips the newline around it,
                so without this the halves would join as "בישראל.המחויבות". */}
            {subtitleLines.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < subtitleLines.length - 1 && (
                  <>
                    {' '}
                    <br className="contact-subtitle-break" />
                  </>
                )}
              </Fragment>
            ))}
          </p>
          <img alt="" className="contact-separator" src="/Vector%2018.svg" />
        </div>

        <div className="contact-bottom">
          <div className="contact-info-card">
            <p className="contact-info-item">{contactDetails.phoneLabel}</p>
            <p className="contact-info-item">{contactDetails.address}</p>
          </div>

          <ContactForm labels={form} />
        </div>
      </div>
    </section>
  )
}
