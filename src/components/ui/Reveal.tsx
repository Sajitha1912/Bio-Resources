import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRevealInView } from '@/hooks/useRevealInView'
import { cn } from '@/lib/cn'

/**
 * Fades and lifts its children into view once they enter the viewport.
 * Uses `useRevealInView` so the content is guaranteed to appear even if the
 * IntersectionObserver never fires. Falls back to a plain wrapper when reduced
 * motion is requested.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, shown } = useRevealInView<HTMLDivElement>({ amount: 0.2, once })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
