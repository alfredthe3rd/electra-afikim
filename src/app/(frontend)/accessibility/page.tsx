import { RichText } from '@payloadcms/richtext-lexical/react'

import { getGlobal } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const accessibility = await getGlobal('accessibility')
  return pageMetadata(accessibility.meta, '/accessibility', { title: accessibility.page.title })
}

export default async function AccessibilityPage() {
  const { page } = await getGlobal('accessibility')

  return (
    <section className="legal-page">
      <h1 className="legal-page-title">{page.title}</h1>

      <div className="legal-page-body">
        <RichText data={page.bodyTop} disableContainer />

        {page.contacts && page.contacts.length > 0 && (
          <div className="legal-page-contacts">
            {page.contacts.map((contact) => (
              <div className="legal-page-contact" key={contact.id}>
                <h3>{contact.name}</h3>
                <p>
                  {page.phoneLabel} <a href={`tel:${contact.phone}`}>{contact.phone}</a>.
                </p>
                <p>
                  {page.emailLabel} <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
                <p>
                  {page.addressLabel} {contact.address}
                </p>
              </div>
            ))}
          </div>
        )}

        <RichText data={page.bodyBottom} disableContainer />
      </div>
    </section>
  )
}
