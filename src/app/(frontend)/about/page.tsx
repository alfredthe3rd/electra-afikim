import { getGlobal } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

import { AboutHero } from './AboutHero'
import { AboutIconsGrid } from './AboutIconsGrid'
import { AboutStory } from './AboutStory'
import { AboutTeam } from './AboutTeam'
import { AboutValuesGrid } from './AboutValuesGrid'
import { AboutVision } from './AboutVision'

export async function generateMetadata() {
  const about = await getGlobal('about')
  return pageMetadata(about.meta, '/about', { title: about.hero.title })
}

export default async function AboutPage() {
  const about = await getGlobal('about')

  return (
    <div className="about-page">
      <AboutHero data={about.hero} />
      <AboutIconsGrid data={about.icons} />
      <AboutVision data={about.vision} />
      <AboutValuesGrid data={about.values} />
      <AboutTeam data={about.team} />
      <AboutStory data={about.story} />
    </div>
  )
}
