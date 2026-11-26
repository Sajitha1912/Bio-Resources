import { useSeo } from '@/lib/seo'
import { company } from '@/data/site'
import { Hero } from '@/sections/Hero'
import { Marquee } from '@/sections/Marquee'
import { StatsBand } from '@/sections/StatsBand'
import { CoreStrength } from '@/sections/CoreStrength'
import { HowItWorks } from '@/sections/HowItWorks'
import { ServicesPreview } from '@/sections/ServicesPreview'
import { FocusGallery } from '@/sections/FocusGallery'
import { WhoNeedsUs } from '@/sections/WhoNeedsUs'
import { FounderSpotlight } from '@/sections/FounderSpotlight'
import { FinalCta } from '@/sections/FinalCta'

export function HomePage() {
  useSeo({
    title: company.companyName,
    description: company.description,
    path: '/',
  })

  return (
    <>
      <Hero />
      <Marquee />
      <StatsBand />
      <CoreStrength />
      <HowItWorks />
      <ServicesPreview />
      <FocusGallery />
      <WhoNeedsUs />
      <FounderSpotlight />
      <FinalCta />
    </>
  )
}
