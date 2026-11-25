import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

type Blob = {
  id: string
  className: string
  drift: {
    x: number[]
    y: number[]
    scale: number[]
  }
  duration: number
}

/**
 * Layer 1 — a soft mesh of large blurred forest/teal/lime blobs that drift and
 * morph on slow (20–40s) loops. Falls back to a static arrangement under
 * reduced motion.
 */
const BLOBS: Blob[] = [
  {
    id: 'forest',
    className: 'left-[-14%] top-[-12%] size-[42rem] bg-forest/50',
    drift: { x: [0, 60, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.92, 1] },
    duration: 32,
  },
  {
    id: 'teal',
    className: 'right-[-16%] top-[6%] size-[38rem] bg-teal/25',
    drift: { x: [0, -50, 34, 0], y: [0, 40, -24, 0], scale: [1, 1.1, 0.9, 1] },
    duration: 26,
  },
  {
    id: 'lime',
    className: 'bottom-[-20%] left-[18%] size-[40rem] bg-lime/20',
    drift: { x: [0, 40, -42, 0], y: [0, -30, 34, 0], scale: [1, 0.92, 1.12, 1] },
    duration: 38,
  },
  {
    id: 'deep',
    className: 'right-[10%] bottom-[-16%] size-[32rem] bg-forest-deep/60',
    drift: { x: [0, -28, 24, 0], y: [0, 26, -32, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 22,
  },
]

export default function GradientMesh({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.id}
          className={cn('absolute rounded-full blur-[120px]', blob.className)}
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
