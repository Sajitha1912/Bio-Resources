import { useRef, type MouseEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { usePointerFine } from '@/hooks/usePointerFine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

/**
 * Card that tilts in 3D toward the pointer and shows a soft glare highlight.
 * The effect is disabled on touch devices and under reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 10,
}: {
  children: ReactNode
  className?: string
  /** Maximum tilt, in degrees. */
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.5 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.5 })

  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(220px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 65%)`

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!enabled || !el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set(-(py - 0.5) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: enabled ? springX : 0,
        rotateY: enabled ? springY : 0,
        transformPerspective: 900,
      }}
      className={cn('group relative [transform-style:preserve-3d]', className)}
    >
      {children}
      {enabled ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      ) : null}
    </motion.div>
  )
}
