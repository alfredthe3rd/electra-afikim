import Link from 'next/link'
import { Fragment } from 'react'

import { getCms, getGlobal } from '@/lib/content'
import { mediaAlt, mediaUrl } from '@/lib/media'

export async function SiteFooter() {
  const [payload, settings] = await Promise.all([getCms(), getGlobal('site-settings')])
  const { brand, contactDetails, footer } = settings

  const { docs: divisions } = await payload.find({
    collection: 'divisions',
    depth: 0,
    limit: 100,
    // Same order as the lobby: the one the editor sets by dragging in the admin.
    sort: '_order',
  })

  return (
    <footer className="site-footer">
      <img alt="" className="site-footer-graphic" src={mediaUrl(footer.graphic)} />

      <div className="site-footer-columns">
        <div className="site-footer-column site-footer-nav">
          <h3>{footer.navHeading}</h3>
          <ul>
            {(footer.nav ?? []).map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-column site-footer-divisions">
          <h3>{footer.divisionsHeading}</h3>
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
          <h3>{footer.contactHeading}</h3>
          <p>{contactDetails.phoneLabel}</p>
          <p>{contactDetails.address}</p>
        </div>

        <div className="site-footer-column site-footer-branding">
          <img alt={mediaAlt(brand.logo)} className="site-footer-logo" src={mediaUrl(brand.logo)} />
          <div className="site-footer-social">
            {(footer.social ?? []).map((item) => (
              <a aria-label={item.label} href={item.url} key={item.id}>
                <img alt="" src={mediaUrl(item.icon)} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip — sits below the road line of the tree graphic. RTL, so
          the legal links land on the right and the credit on the left. */}
      <div className="site-footer-bottom">
        <div className="site-footer-legal">
          {(footer.legal ?? []).map((item, i) => (
            <Fragment key={item.id}>
              {i > 0 && <span aria-hidden="true">|</span>}
              <Link href={item.href}>{item.label}</Link>
            </Fragment>
          ))}
        </div>

        {footer.creditText && (
          <a
            className="site-footer-credit"
            href={footer.creditUrl ?? undefined}
            rel="noopener noreferrer"
            target="_blank"
          >
            {footer.creditText}
          </a>
        )}
      </div>
    </footer>
  )
}
