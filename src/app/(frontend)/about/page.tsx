import { AboutCircle } from './AboutCircle'
import { AboutHero } from './AboutHero'
import { AboutIconsGrid } from './AboutIconsGrid'
import { AboutStory } from './AboutStory'
import { AboutTeam } from './AboutTeam'
import { AboutValuesGrid } from './AboutValuesGrid'
import { AboutVision } from './AboutVision'

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutCircle />
      <AboutIconsGrid />
      <AboutVision />
      <AboutValuesGrid />
      <AboutTeam />
      <AboutStory />
    </div>
  )
}
