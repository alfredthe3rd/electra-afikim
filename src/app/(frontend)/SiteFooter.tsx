import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

const QUICK_LINKS = [
  { href: '/', label: 'בית' },
  { href: '/about', label: 'אודות' },
  { href: '/divisions', label: 'תחומי פעילות' },
  { href: '/social-responsibility', label: 'אחריות חברתית' },
]

const SOCIAL_LINKS = [
  { href: '#', icon: '/facebook-icon.svg', label: 'פייסבוק' },
  { href: '#', icon: '/instagram-icon.svg', label: 'אינסטגרם' },
  { href: '#', icon: '/youtube-icon.svg', label: 'יוטיוב' },
]

export async function SiteFooter() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    limit: 100,
    sort: 'title',
  })

  return (
    <footer className="site-footer">
      <img alt="" className="site-footer-graphic" src="/tree-footer.png" />

      <div className="site-footer-columns">
        <div className="site-footer-column">
          <h3>ניווט מהיר</h3>
          <ul>
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-column">
          <h3>תחומי פעילות</h3>
          <ul>
            {divisions.map(
              (division) =>
                division.slug && (
                  <li key={division.id}>
                    <Link href={`/divisions/${division.slug}`}>{division.title}</Link>
                  </li>
                ),
            )}
          </ul>
        </div>

        <div className="site-footer-column site-footer-contact">
          <h3>צור קשר</h3>
          <p>6686*</p>
          <p>
            <a href="mailto:info@electra-afikim.co.il">info@electra-afikim.co.il</a>
          </p>
          <p>הערבה 1 בניין SIV נבעת שמאל</p>
        </div>

        <div className="site-footer-column site-footer-branding">
          <img alt="אלקטרה אפיקים" className="site-footer-logo" src="/main-logo-alectra.png" />
          <div className="site-footer-social">
            {SOCIAL_LINKS.map((item) => (
              <a aria-label={item.label} href={item.href} key={item.label}>
                <img alt="" src={item.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
