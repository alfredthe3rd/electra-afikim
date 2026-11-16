'use server'

import { headers } from 'next/headers'

import { parseRecipients } from '@/globals/ContactInbox'
import { getCms } from '@/lib/content'

export type ContactResult = { ok: true } | { ok: false; reason: 'invalid' | 'error' }

const LIMITS = { email: 254, message: 5000, name: 100 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[0-9+\-\s()*]{7,30}$/

// A handful of messages per address in a short window is plenty for a person
// and stops a script from filling the inbox. In memory: the site runs as one
// container, and a restart simply clears it.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const recent = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > MAX_PER_WINDOW
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const field = (form: FormData, name: string) => String(form.get(name) ?? '').trim()

export async function submitContact(form: FormData): Promise<ContactResult> {
  // Hidden field that people never see; bots that fill every input do.
  if (field(form, 'website')) return { ok: true }

  const name = field(form, 'name')
  const phone = field(form, 'phone')
  const email = field(form, 'email')
  const message = field(form, 'message')

  if (
    !name ||
    name.length > LIMITS.name ||
    !PHONE.test(phone) ||
    email.length > LIMITS.email ||
    !EMAIL.test(email) ||
    message.length > LIMITS.message
  ) {
    return { ok: false, reason: 'invalid' }
  }

  const h = await headers()
  const ip =
    h.get('incap-client-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) return { ok: false, reason: 'error' }

  const payload = await getCms()

  let submission
  try {
    submission = await payload.create({
      collection: 'contact-submissions',
      data: { email, message, name, phone },
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Contact form: could not save the submission' })
    return { ok: false, reason: 'error' }
  }

  // The message is saved, so from the visitor's side it has been received.
  // Email problems are recorded on the submission for the site team.
  const inbox = await payload.findGlobal({ slug: 'contact-inbox' })
  const to = parseRecipients(inbox.recipients)

  // Without SMTP, Payload only prints the email to the log, so don't record it
  // as sent.
  const notSent = !to.length ? 'no-recipients' : !process.env.SMTP_HOST ? 'no-smtp' : null
  if (notSent) {
    await payload.update({
      collection: 'contact-submissions',
      id: submission.id,
      data: { emailStatus: notSent },
    })
    if (notSent === 'no-recipients') return { ok: true }
  }

  const rows: [string, string][] = [
    ['שם', name],
    ['טלפון', phone],
    ['דוא"ל', email],
    ['הודעה', message || '—'],
  ]
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
<h2 style="margin:0 0 12px">פנייה חדשה מטופס צור קשר</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="right" valign="top" style="white-space:nowrap">${label}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('')}</table>
</div>`
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')

  try {
    await payload.sendEmail({
      html,
      replyTo: email,
      subject: `${inbox.emailSubject} – ${name}`,
      text,
      to,
    })
    if (!notSent) {
      await payload.update({
        collection: 'contact-submissions',
        id: submission.id,
        data: { emailStatus: 'sent' },
      })
    }
  } catch (err) {
    payload.logger.error({ err, msg: 'Contact form: email failed' })
    await payload.update({
      collection: 'contact-submissions',
      id: submission.id,
      data: {
        emailError: String(err instanceof Error ? err.message : err).slice(0, 500),
        emailStatus: 'failed',
      },
    })
  }

  return { ok: true }
}
