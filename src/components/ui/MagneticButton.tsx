import { useRef, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  className?: string
  /** Renders a react-router <Link>. */
  to?: string
  /** Renders an <a> (external URL or tel: link). */
  href?: string
  onClick?: () => void
  ariaLabel?: string
  /** How far the element drifts toward the cursor (0–1). */
  strength?: number
  disabled?: boolean
}

/**
 * Button/link that is magnetically pulled toward the cursor on hover.
 * The effect is disabled on touch devices and under reduced motion.
 */
export function MagneticButton({
  children,
  className,
  to,
  href,
  onClick,
  ariaLabel,
  strength = 0.35,
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced && !disabled

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const classes = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition',
    className,
  )

  const inner = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-flex"
    >
      {to ? (
        <Link to={to} aria-label={ariaLabel} className={classes}>
          {inner}
        </Link>
      ) : href ? (
        <a href={href} aria-label={ariaLabel} className={classes}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
          {inner}
        </button>
      )}
    </motion.div>
  )
}
