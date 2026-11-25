import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { home } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { SplitText } from '@/components/ui/SplitText'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { GradientMesh } from '@/components/decor/GradientMesh'
import { FloatingMotifs } from '@/components/decor/FloatingMotifs'
import { HelixCanvas } from '@/three/HelixCanvas'

const PRIMARY_CTA =
  'bg-forest text-cream hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90'
const SECONDARY_CTA =
  'border border-line bg-surface text-fg backdrop-blur hover:border-teal/60 dark:hover:border-lime/60'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <GradientMesh />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <HelixCanvas
          className="h-full w-full"
          height={11}
          pairs={30}
          autoRotate
          molecules
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(58%_50%_at_50%_46%,var(--bg)_0%,transparent_72%)] opacity-75 dark:opacity-85"
      />
      <FloatingMotifs />

      <Container>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-xs font-semibold tracking-[0.22em] text-accent uppercase dark:text-lime"
          >
            {home.hero.eyebrow}
          </motion.p>

          <SplitText
            as="h1"
            text={home.hero.title}
            stagger={0.055}
            delay={0.1}
            className="text-[clamp(2.25rem,6.4vw,4.5rem)] leading-[1.05]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg text-fg-muted"
          >
            {home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <MagneticButton to={home.hero.primaryCta.href} className={PRIMARY_CTA}>
              {home.hero.primaryCta.label}
              <ArrowRight className="size-4" />
            </MagneticButton>
            <MagneticButton
              to={home.hero.secondaryCta.href}
              className={SECONDARY_CTA}
            >
              {home.hero.secondaryCta.label}
            </MagneticButton>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
