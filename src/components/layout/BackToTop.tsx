import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useSmoothScroll } from '@/providers/smooth-scroll-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Floating button that appears on scroll, with a circular progress ring. */
export function BackToTop() {
  const { scrollTo } = useSmoothScroll()
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3,
  })
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => scrollTo(0, { immediate: reduced })}
      aria-label="Back to top"
      className={cn(
        'group fixed right-5 bottom-5 z-[70] flex size-12 items-center justify-center rounded-full border border-line bg-bg/80 text-fg backdrop-blur-xl transition duration-300 hover:border-teal/60 dark:hover:border-lime/60',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="2"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="url(#btt-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashOffset }}
        />
        <defs>
          <linearGradient id="btt-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7BC74D" />
            <stop offset="100%" stopColor="#1B8A7A" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="relative size-5" />
    </button>
  )
}
