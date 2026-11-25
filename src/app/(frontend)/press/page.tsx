import { pageMetadata } from '@/lib/seo'

// Placeholder for the "מהתקשורת" nav link (client round 25.11.2026). The real
// page — press items managed from the panel — gets specced with the client
// later; until then the link lands on a "coming soon" page, kept out of search.
export async function generateMetadata() {
  return pageMetadata({ noindex: true }, '/press', { title: 'מהתקשורת' })
}

export default function PressPage() {
  return (
    <section className="legal-page press-page">
      <h1 className="legal-page-title">מהתקשורת</h1>
      <p className="legal-page-placeholder">העמוד בבנייה ויעלה בקרוב.</p>
    </section>
  )
}
