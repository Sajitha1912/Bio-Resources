import { motion } from 'framer-motion'
import { notFound } from '@/data/site'
import { useSeo } from '@/lib/seo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { LostMolecule } from '@/components/motifs/LostMolecule'

export function NotFoundPage() {
  const reduced = usePrefersReducedMotion()

  useSeo({
    title: 'Page not found',
    description: notFound.subtitle,
    path: '/404',
  })

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 right-0 size-[28rem] rounded-full bg-teal/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 size-[24rem] rounded-full bg-lime/20 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold tracking-[0.22em] text-accent uppercase dark:text-lime"
            >
              {notFound.eyebrow}
            </motion.p>
            <p className="mt-3 font-heading text-7xl text-accent sm:text-9xl dark:text-lime">
              {notFound.code}
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl">{notFound.title}</h1>
            <p className="mt-4 max-w-md text-fg-muted">{notFound.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/">{notFound.ctaLabel}</ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                {notFound.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto aspect-square w-full max-w-sm"
          >
            <LostMolecule className="h-full w-full" />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
