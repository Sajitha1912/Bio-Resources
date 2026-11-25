import { coreStrength } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TechniqueChips } from '@/components/ui/TechniqueChips'

export function CoreStrength() {
  return (
    <Section className="border-y border-line">
      <Container>
        <SectionHeading
          eyebrow="Core strength"
          title={coreStrength.title}
          subtitle={coreStrength.lead}
        />

        <p className="mt-6 max-w-2xl text-fg-muted">{coreStrength.description}</p>

        <Reveal className="mt-8">
          <TechniqueChips items={coreStrength.capabilities} />
        </Reveal>
      </Container>
    </Section>
  )
}
