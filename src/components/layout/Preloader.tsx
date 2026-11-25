import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSmoothScroll } from '@/providers/smooth-scroll-context'
import { Logo } from '@/components/ui/Logo'

const STRAND_STEPS = 64
const NODE_COUNT = 10
const RUNG_T = [1 / 6, 1 / 2, 5 / 6]

/** A polyline that traces one strand of the helix (viewBox 0 0 200 200). */
function strandPath(sign: 1 | -1): string {
  let d = ''
  for (let i = 0; i <= STRAND_STEPS; i++) {
    const t = i / STRAND_STEPS
    const y = 20 + t * 160
    const x = 100 + sign * 42 * Math.sin(t * Math.PI * 3)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return d.trim()
}

const STRAND_A = strandPath(1)
const STRAND_B = strandPath(-1)

const NODES = Array.from({ length: NODE_COUNT }, (_, i) => {
  const t = i / (NODE_COUNT - 1)
  const y = 20 + t * 160
  const offset = 42 * Math.sin(t * Math.PI * 3)
  return { y, x1: 100 + offset, x2: 100 - offset }
})

const RUNGS = RUNG_T.map((t) => {
  const y = 20 + t * 160
  const offset = 42 * Math.sin(t * Math.PI * 3)
  return { y, x1: 100 + offset, x2: 100 - offset }
})

/**
 * Boot screen: an SVG DNA helix assembles while a percentage counter runs,
 * then the overlay opens like a curtain to reveal the site.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const { stop, start } = useSmoothScroll()
  const [count, setCount] = useState(0)
  const [opening, setOpening] = useState(false)

  // Lock scrolling until the curtain has finished opening.
  useEffect(() => {
    stop()
    return () => start()
  }, [stop, start])

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }

    let raf = 0
    const startTime = performance.now()
    const duration = 1800

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - t, 2)) * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)

    // Drive completion with a timer rather than requestAnimationFrame: rAF is
    // paused in backgrounded tabs, which would otherwise leave this overlay
    // stuck on screen and the page looking blank.
    const openId = window.setTimeout(() => {
      setCount(100)
      setOpening(true)
    }, duration + 320)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(openId)
    }
  }, [reduced, onDone])

  useEffect(() => {
    if (!opening) return
    const id = window.setTimeout(onDone, 900)
    return () => window.clearTimeout(id)
  }, [opening, onDone])

  if (reduced) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: opening ? '-101%' : '0%' }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 h-1/2 bg-forest"
      />
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: opening ? '101%' : '0%' }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-forest"
      />

      <motion.div
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex h-full flex-col items-center justify-center gap-8 text-cream"
      >
        <Logo
          className="h-32 sm:h-40"
          badgeClassName="rounded-2xl p-3"
          fallback={
            <div className="h-40 w-40 sm:h-48 sm:w-48" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
                <defs>
                  <linearGradient
                    id="preload-strand"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7BC74D" />
                    <stop offset="100%" stopColor="#1B8A7A" />
                  </linearGradient>
                </defs>

                {RUNGS.map((rung, index) => (
                  <motion.line
                    key={`rung-${index}`}
                    x1={rung.x1}
                    y1={rung.y}
                    x2={rung.x2}
                    y2={rung.y}
                    stroke="#F7F5EF"
                    strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: opening ? 0 : 0.35 }}
                    transition={{ delay: 0.5 + index * 0.12, duration: 0.5 }}
                  />
                ))}

                {[STRAND_A, STRAND_B].map((d, index) => (
                  <motion.path
                    key={`strand-${index}`}
                    d={d}
                    stroke="url(#preload-strand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.6 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.1, ease: 'easeInOut' }}
                  />
                ))}

                {NODES.map((node, index) => (
                  <g key={`node-${index}`}>
                    {[node.x1, node.x2].map((cx, side) => (
                      <motion.circle
                        key={side}
                        cx={cx}
                        cy={node.y}
                        r="3.5"
                        fill={side === 0 ? '#7BC74D' : '#1B8A7A'}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.15 + index * 0.06,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          }
        />

        <div className="flex flex-col items-center gap-3">
          <span className="font-heading text-5xl tabular-nums sm:text-6xl">
            {count}
            <span className="text-2xl text-cream/60">%</span>
          </span>
          <span className="h-px w-40 overflow-hidden bg-cream/20">
            <motion.span
              className="block h-full bg-gradient-to-r from-lime to-teal"
              initial={{ width: '0%' }}
              animate={{ width: `${count}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </span>
          <span className="text-xs tracking-[0.3em] text-cream/60 uppercase">
            Assembling
          </span>
        </div>
      </motion.div>
    </div>
  )
}
