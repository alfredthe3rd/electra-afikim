import { RichText } from '@payloadcms/richtext-lexical/react'

import { getGlobal } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const privacy = await getGlobal('privacy')
  return pageMetadata(privacy.meta, '/privacy-policy', { title: privacy.page.title })
}

export default async function PrivacyPolicyPage() {
  const { page } = await getGlobal('privacy')

  return (
    <section className="legal-page">
      <h1 className="legal-page-title">{page.title}</h1>

      <div className="legal-page-body">
        <RichText data={page.body} disableContainer />
        {page.updatedLabel && <p className="legal-page-updated">{page.updatedLabel}</p>}
      </div>
    </section>
  )
}
