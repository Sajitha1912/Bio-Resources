import { home, services } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ServiceCard } from '@/components/services/ServiceCard'

export function ServicesPreview() {
  const { eyebrow, title, subtitle, ctaLabel, ctaHref } = home.servicesPreview

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            return (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
                className="h-full"
              />
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <MagneticButton
            to={ctaHref}
            className="border border-line bg-surface text-fg backdrop-blur hover:border-teal/60 dark:hover:border-lime/60"
          >
            {ctaLabel}
          </MagneticButton>
        </div>
      </Container>
    </Section>
  )
}
