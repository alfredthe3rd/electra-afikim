import { getGlobal } from '@/lib/content'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'

import { AboutTeaser } from './AboutTeaser'
import { DivisionsSplit } from './DivisionsSplit'
import { Hero } from './Hero'
import { PartnersGrid } from './PartnersGrid'
import { StatsHighlights } from './StatsHighlights'
import './styles.css'

export async function generateMetadata() {
  const home = await getGlobal('home')
  return pageMetadata(home.meta, '/')
}

export default async function HomePage() {
  const [home, settings] = await Promise.all([getGlobal('home'), getGlobal('site-settings')])

  return (
    <>
      <Hero
        data={home.hero}
        logoAlt={mediaAlt(settings.brand.logo)}
        logoUrl={mediaUrl(settings.brand.logo)}
      />
      <AboutTeaser data={home.about} />
      <DivisionsSplit data={home.divisions} />
      <StatsHighlights data={home.stats} />
      <PartnersGrid data={home.partners} />
    </>
  )
}
