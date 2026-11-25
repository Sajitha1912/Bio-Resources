import { company } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/Reveal'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { DnaHelix } from '@/components/motifs/DnaHelix'

export function FounderSpotlight() {
  const { displayName, role, bio, photo } = company.leadScientist

  return (
    <Section className="border-y border-line">
      <Container>
        <Reveal>
          <GlassCard className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface">
              <ImageWithFallback
                src={photo}
                alt={displayName}
                fallback={<DnaHelix className="h-40 w-auto" />}
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase dark:text-lime">
                Lead scientist
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{displayName}</h2>
              <p className="mt-1 text-sm text-fg-muted">{role}</p>
              <p className="mt-5 text-fg-muted">{bio}</p>
            </div>
          </GlassCard>
        </Reveal>
      </Container>
    </Section>
  )
}
