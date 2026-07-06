import { AboutTeaser } from './AboutTeaser'
import { DivisionsSplit } from './DivisionsSplit'
import { Hero } from './Hero'
import { PartnersGrid } from './PartnersGrid'
import { StatsHighlights } from './StatsHighlights'
import { Umbrella } from './Umbrella'
import './styles.css'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <Umbrella />
      <DivisionsSplit />
      <StatsHighlights />
      <PartnersGrid />
    </>
  )
}
