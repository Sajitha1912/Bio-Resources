import { whoNeedsUs } from '@/data/site'
import { getIcon } from '@/lib/icons'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/Reveal'

export function WhoNeedsUs() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Who needs us"
          title={whoNeedsUs.title}
          subtitle={whoNeedsUs.subtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whoNeedsUs.items.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <Reveal key={item.title} delay={index * 0.06} className="h-full">
                <GlassCard className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-teal/40 dark:hover:border-lime/40">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{item.description}</p>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
