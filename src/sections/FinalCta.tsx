import { ArrowRight } from 'lucide-react'
import { home } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SplitText } from '@/components/ui/SplitText'
import { Reveal } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function FinalCta() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-forest px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
          >
            <div className="absolute -top-16 left-1/4 size-72 rounded-full bg-lime blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 size-72 rounded-full bg-teal blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <SplitText
              as="h2"
              text={home.finalCta.title}
              stagger={0.05}
              className="text-3xl text-cream sm:text-4xl"
            />
            <Reveal delay={0.15}>
              <p className="mt-4 text-cream/80">{home.finalCta.subtitle}</p>
              <div className="mt-8 flex justify-center">
                <MagneticButton
                  to={home.finalCta.cta.href}
                  className="bg-lime text-forest hover:bg-lime/90"
                >
                  {home.finalCta.cta.label}
                  <ArrowRight className="size-4" />
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
