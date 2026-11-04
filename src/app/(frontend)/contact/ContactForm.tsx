'use client'

import { FormEvent, useState } from 'react'

import type { Contact } from '@/payload-types'

export function ContactForm({ labels }: { labels: Contact['form'] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    // TODO: wire up to API
    setTimeout(() => setStatus('sent'), 1000)
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-row">
        <input
          className="contact-input"
          name="name"
          placeholder={labels.namePlaceholder}
          required
          type="text"
        />
        <input
          className="contact-input"
          name="phone"
          placeholder={labels.phonePlaceholder}
          required
          type="tel"
        />
        <input
          className="contact-input"
          name="email"
          placeholder={labels.emailPlaceholder}
          required
          type="email"
        />
      </div>
      <textarea
        className="contact-input contact-textarea"
        name="message"
        placeholder={labels.messagePlaceholder}
        rows={4}
      />
      <button className="division-cta contact-submit" disabled={status === 'sending'} type="submit">
        {status === 'sending'
          ? labels.sendingLabel
          : status === 'sent'
            ? labels.sentLabel
            : labels.submitLabel}
      </button>
    </form>
  )
}
