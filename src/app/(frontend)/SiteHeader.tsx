import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/', label: 'דף הבית' },
  { href: '/about', label: 'אודות' },
  { href: '/divisions', label: 'חטיבות' },
  { href: '/social-responsibility', label: 'אחריות חברתית' },
  { href: '/contact', label: 'צרו קשר' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-header-logo" href="/">
          <img alt="אלקטרה אפיקים" src="/main-logo-alectra.png" />
        </Link>
        <nav className="site-nav">
          {NAV_ITEMS.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
