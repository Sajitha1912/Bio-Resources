import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { howItWorks } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { HelixCanvas } from '@/three/HelixCanvas'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger)

const STEP_COUNT = howItWorks.steps.length

/**
 * Pinned scroll-story: the 3D helix twists and unzips as the page scrolls while
 * each step, and its matching base pair, lights up in turn. Pinning only runs
 * on desktop with motion allowed; everywhere else the helix renders as the SVG
 * fallback and the steps are simply shown fully lit.
 */
export function HowItWorks() {
  const reduced = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const pinned = isDesktop && !reduced

  const sectionRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  /** Live scroll progress, read by the 3D helix every frame. */
  const progressRef = useRef(0)

  useEffect(() => {
    if (!pinned) return
    const section = sectionRef.current
    if (!section) return

    const applyActive = (progress: number) => {
      const active = Math.min(STEP_COUNT - 1, Math.floor(progress * STEP_COUNT))
      stepRefs.current.forEach((element, i) => {
        if (element) element.dataset.active = i <= active ? 'true' : 'false'
      })
    }

    applyActive(0)

    const driver = { progress: 0 }

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${STEP_COUNT * 70 * (window.innerHeight / 100)}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      }).to(driver, {
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          progressRef.current = driver.progress
          applyActive(driver.progress)
        },
      })
    }, section)

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
      progressRef.current = 0
    }
  }, [pinned])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative border-y border-line"
    >
      <div
        className={cn(
          'flex items-center overflow-hidden px-0 py-16',
          pinned && 'h-svh py-10',
        )}
      >
        <Container className="w-full">
          <SectionHeading
            eyebrow={howItWorks.eyebrow}
            title={howItWorks.title}
            subtitle={howItWorks.subtitle}
            align="center"
          />

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="relative mx-auto h-[46vh] w-full max-w-[220px] lg:h-[56vh]">
              <HelixCanvas
                className="h-full w-full"
                height={6.5}
                pairs={26}
                steps={STEP_COUNT}
                autoRotate
                interactive
                progressRef={progressRef}
              />
            </div>

            <ol className="space-y-4">
              {howItWorks.steps.map((step, i) => (
                <li
                  key={step.title}
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  data-active={pinned ? 'false' : 'true'}
                  className={cn(
                    'group flex gap-4 rounded-2xl border border-line bg-surface p-5 backdrop-blur transition duration-300',
                    pinned && 'opacity-45',
                    'data-[active=true]:opacity-100',
                    'data-[active=true]:border-teal/50 dark:data-[active=true]:border-lime/50',
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold transition group-data-[active=true]:border-transparent group-data-[active=true]:bg-lime group-data-[active=true]:text-forest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg">{step.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  )
}
