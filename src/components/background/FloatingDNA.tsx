import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const STEPS = 72

/** One strand of the helix (viewBox 0 0 120 320). */
function strandPath(sign: 1 | -1): string {
  let d = ''
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    const y = 20 + t * 280
    const x = 60 + sign * 34 * Math.sin(t * Math.PI * 4)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return d.trim()
}

const PATH_A = strandPath(1)
const PATH_B = strandPath(-1)

const RUNGS = Array.from({ length: 9 }, (_, i) => {
  const t = i / 8
  const y = 20 + t * 280
  const offset = 34 * Math.sin(t * Math.PI * 4)
  return { y, x1: 60 + offset, x2: 60 - offset }
})

type StrandConfig = {
  id: string
  className: string
  depth: number
  spinDuration: number
  bob: number
  hideOnMobile?: boolean
}

const STRANDS: StrandConfig[] = [
  {
    id: 'a',
    className: 'left-[4%] top-[6%] h-[24rem] w-[7rem]',
    depth: -170,
    spinDuration: 62,
    bob: 16,
  },
  {
    id: 'b',
    className: 'right-[6%] top-[28%] h-[28rem] w-[8rem]',
    depth: 130,
    spinDuration: 84,
    bob: 22,
  },
  {
    id: 'c',
    className: 'left-[44%] top-[2%] h-[18rem] w-[6rem]',
    depth: -250,
    spinDuration: 72,
    bob: 12,
    hideOnMobile: true,
  },
]

function Helix({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 120 320"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id={`dna-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7bc74d" />
          <stop offset="100%" stopColor="#1b8a7a" />
        </linearGradient>
      </defs>
      {RUNGS.map((rung, index) => (
        <line
          key={index}
          x1={rung.x1}
          y1={rung.y}
          x2={rung.x2}
          y2={rung.y}
          stroke="#f7f5ef"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      <path
        d={PATH_A}
        stroke={`url(#dna-${id})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d={PATH_B}
        stroke={`url(#dna-${id})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Layer 3 — 2–3 faint DNA strands that spin slowly, bob upward at different
 * speeds and drift with scroll parallax. Static under reduced motion.
 */
export default function FloatingDNA({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()

  const y0 = useTransform(scrollYProgress, [0, 1], [0, STRANDS[0].depth])
  const y1 = useTransform(scrollYProgress, [0, 1], [0, STRANDS[1].depth])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, STRANDS[2].depth])
  const parallax = [y0, y1, y2]

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      {STRANDS.map((strand, index) => (
        <motion.div
          key={strand.id}
          style={{ y: reduced ? 0 : parallax[index] }}
          className={cn(
            'absolute opacity-[0.18]',
            strand.hideOnMobile && 'hidden sm:block',
            strand.className,
          )}
        >
          <motion.div
            className="h-full w-full"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={
              reduced
                ? undefined
                : {
                    duration: strand.spinDuration,
                    repeat: Infinity,
                    ease: 'linear',
                  }
            }
          >
            <motion.div
              className="h-full w-full"
              animate={reduced ? undefined : { y: [0, -strand.bob, 0] }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 9 + index * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              <Helix id={strand.id} />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
