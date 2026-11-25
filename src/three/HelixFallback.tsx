import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const WIDTH = 220
const HEIGHT = 460
const TURNS = 3

/** Samples a sine so the fallback mirrors the shape of the 3D helix. */
function pointAt(t: number, phase: number) {
  return {
    x: WIDTH / 2 + Math.sin(t * Math.PI * 2 * TURNS + phase) * WIDTH * 0.3,
    y: t * HEIGHT,
  }
}

function strandPath(phase: number): string {
  const steps = 90
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const { x, y } = pointAt(i / steps, phase)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
  }
  return d.trim()
}

const STRAND_A = strandPath(0)
const STRAND_B = strandPath(Math.PI)

const RUNGS = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12
  return { a: pointAt(t, 0), b: pointAt(t, Math.PI) }
})

/**
<<<<<<< HEAD
 * Code-drawn SVG stand-in for the WebGL helix. Used when WebGL2 is unavailable
 * or the WebGL context is lost.
=======
 * Code-drawn SVG stand-in for the WebGL helix. Used on mobile, low-power
 * devices, under reduced motion and whenever WebGL fails to initialise.
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae
 */
export function HelixFallback({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
        className={cn('h-full w-auto max-w-full', !reduced && 'float-y')}
      >
        <defs>
          <linearGradient id="helix-fallback" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7BC74D" />
            <stop offset="100%" stopColor="#1B8A7A" />
          </linearGradient>
        </defs>

        {RUNGS.map(({ a, b }, i) => (
          <line
            key={`rung-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#helix-fallback)"
            strokeWidth="1.4"
            strokeDasharray="3 5"
            opacity="0.32"
          />
        ))}

        <path
          d={STRAND_A}
          stroke="url(#helix-fallback)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(123,199,77,0.35))' }}
        />
        <path
          d={STRAND_B}
          stroke="url(#helix-fallback)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d={STRAND_A}
          stroke="#F7F5EF"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 10"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}
