import { useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'
import { useIsLowPower } from '@/hooks/useIsLowPower'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

type Dot = { x: number; y: number; r: number; vy: number; drift: number; phase: number }
type Bubble = { x: number; y: number; r: number; vy: number; phase: number }
type Leaf = { x: number; y: number; size: number; vy: number; rot: number; vr: number; tint: string }

/**
 * Layer 5 — tiny glowing dots and translucent bubbles rising slowly, plus a few
 * botanical leaves drifting and rotating. Density drops on low-power devices.
 */
export default function Particles({
  color = '#7bc74d',
  accent = '#1b8a7a',
  speed = 1,
  className,
}: {
  color?: string
  accent?: string
  /** Global speed multiplier (use < 1 for the calm Contact page). */
  speed?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const low = useIsLowPower()
  const dotCount = low ? 10 : 26
  const bubbleCount = low ? 3 : 8
  const leafCount = low ? 2 : 5

  const size = useRef({ width: 0, height: 0 })
  const dots = useRef<Dot[]>([])
  const bubbles = useRef<Bubble[]>([])
  const leaves = useRef<Leaf[]>([])

  const canvasRef = useCanvasAnimation(
    (ctx, { width, height }, dt) => {
      if (width !== size.current.width || height !== size.current.height) {
        size.current = { width, height }
        dots.current = Array.from({ length: dotCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.8 + Math.random() * 1.6,
          vy: 0.12 + Math.random() * 0.35,
          drift: Math.random() * Math.PI * 2,
          phase: 0,
        }))
        bubbles.current = Array.from({ length: bubbleCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 8 + Math.random() * 18,
          vy: 0.1 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
        }))
        leaves.current = Array.from({ length: leafCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 12 + Math.random() * 16,
          vy: 0.08 + Math.random() * 0.16,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.004,
          tint: Math.random() > 0.5 ? color : accent,
        }))
      }

      const step = Math.min(dt, 48) / 16
      ctx.clearRect(0, 0, width, height)

      // Glowing dots.
      for (const dot of dots.current) {
        dot.phase += 0.02 * step
        dot.y -= dot.vy * speed * step
        if (dot.y < -10) {
          dot.y = height + 10
          dot.x = Math.random() * width
        }
        const x = dot.x + Math.sin(dot.phase + dot.drift) * 8
        ctx.fillStyle = 'rgba(123,199,77,0.10)'
        ctx.beginPath()
        ctx.arc(x, dot.y, dot.r * 3.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(123,199,77,0.6)'
        ctx.beginPath()
        ctx.arc(x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Translucent bubbles.
      ctx.lineWidth = 1
      for (const bubble of bubbles.current) {
        bubble.phase += 0.012 * step
        bubble.y -= bubble.vy * speed * step
        if (bubble.y < -bubble.r * 2) {
          bubble.y = height + bubble.r * 2
          bubble.x = Math.random() * width
        }
        const x = bubble.x + Math.sin(bubble.phase) * 12
        ctx.strokeStyle = 'rgba(27,138,122,0.35)'
        ctx.beginPath()
        ctx.arc(x, bubble.y, bubble.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = 'rgba(27,138,122,0.08)'
        ctx.fill()
        ctx.fillStyle = 'rgba(247,245,239,0.28)'
        ctx.beginPath()
        ctx.arc(
          x - bubble.r * 0.35,
          bubble.y - bubble.r * 0.35,
          Math.max(1, bubble.r * 0.18),
          0,
          Math.PI * 2,
        )
        ctx.fill()
      }

      // Drifting leaves.
      for (const leaf of leaves.current) {
        leaf.y -= leaf.vy * speed * step
        leaf.rot += leaf.vr * step
        if (leaf.y < -leaf.size * 2) {
          leaf.y = height + leaf.size * 2
          leaf.x = Math.random() * width
        }
        const x = leaf.x + Math.sin(leaf.rot) * 18
        ctx.save()
        ctx.translate(x, leaf.y)
        ctx.rotate(leaf.rot)
        ctx.globalAlpha = 0.35
        ctx.fillStyle = leaf.tint
        const s = leaf.size
        ctx.beginPath()
        ctx.moveTo(0, -s)
        ctx.quadraticCurveTo(s * 0.6, -s * 0.15, 0, s)
        ctx.quadraticCurveTo(-s * 0.6, -s * 0.15, 0, -s)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 0.5
        ctx.strokeStyle = leaf.tint
        ctx.beginPath()
        ctx.moveTo(0, -s)
        ctx.lineTo(0, s)
        ctx.stroke()
        ctx.restore()
      }
    },
    { enabled: !reduced },
  )

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('absolute inset-0 h-full w-full', className)}
    />
  )
}
