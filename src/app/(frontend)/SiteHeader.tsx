'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { mediaAlt, mediaUrl } from '@/lib/media'
import type { SiteSetting } from '@/payload-types'

export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const { brand, contactDetails, header } = settings
  const NAV_ITEMS = header.nav ?? []
  const logoAlt = mediaAlt(brand.logo)
  const logoUrl = mediaUrl(brand.logo)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Safety net: close the drawer on any route change (links also close it
  // directly via onClick, so the slide-out starts immediately on tap).
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // While the drawer is open: lock background scroll (html.menu-open) and
  // close on Escape. Lenis scrolls the window natively, so overflow:hidden
  // on <html> freezes it too.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen)
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.classList.remove('menu-open')
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-header-logo" href="/">
            <img alt={logoAlt} src={logoUrl} />
          </Link>

          {/* Desktop nav — hidden on mobile in favor of the drawer */}
          <nav className="site-nav">
            {NAV_ITEMS.map((item) => (
              <Link href={item.href} key={item.id}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile only — logo stays on the right (first in RTL), burger lands
              on the left via the inner's space-between */}
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
            className={`site-burger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer — slides in from the right over a dimming overlay.
          Deliberately OUTSIDE the <header>: an ancestor was acting as the
          containing block for this fixed element (collapsing it to the
          header's 83px box), so it lives at body level and stacks above the
          header via its own z-index. */}
      <div aria-hidden={!menuOpen} className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <div className="mobile-menu-overlay" onClick={closeMenu} />
        <aside className="mobile-menu-panel" data-lenis-prevent>
          <div className="mobile-menu-top">
            <img alt={logoAlt} src={logoUrl} />
            <button aria-label="סגירת תפריט" onClick={closeMenu} type="button">
              <span />
              <span />
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {NAV_ITEMS.map((item) => (
              <Link href={item.href} key={item.id} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-actions">
            <Link
              className="mobile-menu-cta mobile-menu-cta-fill"
              href={header.mobileCtaHref}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {header.mobileCtaLabel}
            </Link>
            <a
              className="mobile-menu-cta mobile-menu-cta-outline"
              href={contactDetails.dialHref}
              tabIndex={menuOpen ? 0 : -1}
            >
              {contactDetails.dialCtaLabel}
            </a>
          </div>
        </aside>
      </div>
    </>
  )
}
