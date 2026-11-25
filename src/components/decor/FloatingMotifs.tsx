import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { LeafMark } from '@/components/motifs/LeafMark'
import { MoleculeMark } from '@/components/motifs/MoleculeMark'
import { HexagonMark } from '@/components/motifs/HexagonMark'

gsap.registerPlugin(ScrollTrigger)

type MotifKind = 'leaf' | 'molecule' | 'hexagon'

type Motif = {
  key: string
  kind: MotifKind
  className: string
  /** Scroll-parallax travel, as a percentage of the element height. */
  depth: number
  /** Offset for the idle float animation, in seconds. */
  delay: number
}

const MARKS: Record<MotifKind, typeof LeafMark> = {
  leaf: LeafMark,
  molecule: MoleculeMark,
  hexagon: HexagonMark,
}

const MOTIFS: Motif[] = [
  {
    key: 'leaf-a',
    kind: 'leaf',
    className: 'left-[4%] top-[14%] size-14 sm:size-20',
    depth: -80,
    delay: 0,
  },
  {
    key: 'molecule-a',
    kind: 'molecule',
    className: 'right-[6%] top-[22%] size-16 sm:size-24',
    depth: 60,
    delay: 1.2,
  },
  {
    key: 'hexagon-a',
    kind: 'hexagon',
    className: 'left-[10%] bottom-[16%] size-14 sm:size-20',
    depth: 44,
    delay: 0.6,
  },
  {
    key: 'leaf-b',
    kind: 'leaf',
    className: 'right-[12%] bottom-[12%] size-12 sm:size-16',
    depth: -52,
    delay: 2.1,
  },
]

/**
 * Decorative layer of floating leaves, molecules and hexagons.
 * GSAP ScrollTrigger drives the parallax; a CSS keyframe handles the idle float.
 * Everything stays static when reduced motion is requested.
 */
export function FloatingMotifs({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (reduced || !root) return

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'))

    const tweens = layers.map((layer) =>
      gsap.to(layer, {
        yPercent: Number(layer.dataset.depth),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }),
    )

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    }
  }, [reduced])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {MOTIFS.map((motif) => {
        const Mark = MARKS[motif.kind]
        return (
          <div
            key={motif.key}
            data-depth={motif.depth}
            className={cn(
              'absolute opacity-40 dark:opacity-30',
              motif.className,
            )}
          >
            <div
              className={cn('h-full w-full', !reduced && 'float-y')}
              style={reduced ? undefined : { animationDelay: `${motif.delay}s` }}
            >
              <Mark className="h-full w-full" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
