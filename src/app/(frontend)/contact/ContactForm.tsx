'use client'

import { FormEvent, useState } from 'react'

import type { Contact } from '@/payload-types'

import { submitContact } from './actions'

export function ContactForm({
  errorLabel,
  labels,
}: {
  errorLabel: string
  labels: Contact['form']
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const result = await submitContact(new FormData(form))
      if (result.ok) {
        form.reset()
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Honeypot: hidden from people and screen readers, filled by bots. */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="contact-honeypot"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <div className="contact-form-row">
        <input
          className="contact-input"
          aria-label={labels.namePlaceholder}
          maxLength={100}
          name="name"
          placeholder={labels.namePlaceholder}
          required
          type="text"
        />
        <input
          className="contact-input"
          aria-label={labels.phonePlaceholder}
          maxLength={30}
          name="phone"
          placeholder={labels.phonePlaceholder}
          required
          type="tel"
        />
        <input
          className="contact-input"
          aria-label={labels.emailPlaceholder}
          maxLength={254}
          name="email"
          placeholder={labels.emailPlaceholder}
          required
          type="email"
        />
      </div>
      <textarea
        className="contact-input contact-textarea"
        aria-label={labels.messagePlaceholder}
        maxLength={5000}
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
      {status === 'error' && (
        <p className="contact-form-error" role="alert">
          {errorLabel}
        </p>
      )}
    </form>
  )
}
