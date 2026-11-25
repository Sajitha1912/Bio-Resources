import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const BLOBS = [
  {
    className: 'left-[-10%] top-[-15%] size-[34rem] bg-teal/30',
    drift: { x: [0, 46, -22, 0], y: [0, -34, 24, 0], scale: [1, 1.12, 0.95, 1] },
    duration: 20,
  },
  {
    className: 'right-[-12%] top-[10%] size-[28rem] bg-lime/30',
    drift: { x: [0, -40, 26, 0], y: [0, 30, -18, 0], scale: [1, 1.08, 0.92, 1] },
    duration: 24,
  },
  {
    className: 'bottom-[-18%] left-[25%] size-[30rem] bg-forest/25 dark:bg-teal/25',
    drift: { x: [0, 30, -30, 0], y: [0, -24, 28, 0], scale: [1, 0.94, 1.1, 1] },
    duration: 28,
  },
]

/**
 * Placeholder hero backdrop: a soft, slowly drifting gradient mesh.
 * Blobs stay static when reduced motion is requested.
 */
export function GradientMesh({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.className}
          className={cn('absolute rounded-full blur-3xl', blob.className)}
          animate={reduced ? undefined : blob.drift}
          transition={
            reduced
              ? undefined
              : { duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      ))}
    </div>
  )
}
