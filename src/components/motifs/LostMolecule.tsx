import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

/**
 * Animated "lost molecule": an atom whose electron has wandered off along a
 * dashed trajectory. CSS keyframes drive the orbits; framer-motion drifts the
 * runaway electron, and the drift is disabled under reduced motion.
 */
export function LostMolecule({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id="lm-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7BC74D" />
          <stop offset="100%" stopColor="#1B8A7A" />
        </linearGradient>
      </defs>

      {/* Orbits with captive electrons */}
      {[0, 60, 120].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle} 120 120)`}>
          <g
            className="il-spin"
            style={{
              transformOrigin: '120px 120px',
              animationDuration: `${14 + i * 4}s`,
            }}
          >
            <ellipse
              cx="120"
              cy="120"
              rx="86"
              ry="34"
              stroke="url(#lm-gradient)"
              strokeWidth="2"
              opacity="0.5"
            />
            <circle
              cx="206"
              cy="120"
              r="6"
              fill="#7BC74D"
              className="il-pulse il-origin"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </g>
        </g>
      ))}

      {/* Nucleus */}
      <circle cx="120" cy="120" r="14" fill="url(#lm-gradient)" />

      {/* Escape trajectory */}
      <path
        d="M120 120 C150 96 168 80 198 58"
        stroke="#1B8A7A"
        strokeWidth="2"
        strokeDasharray="4 7"
        opacity="0.5"
        className="il-dash"
      />

      {/* The runaway electron */}
      <motion.g
        initial={false}
        animate={
          reduced
            ? undefined
            : { x: [0, 14, -6, 10, 0], y: [0, -12, 8, -4, 0], opacity: [1, 0.8, 1] }
        }
        transition={{
          duration: 7,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      >
        <circle cx="198" cy="58" r="7" fill="#1B8A7A" />
        <circle
          cx="198"
          cy="58"
          r="15"
          fill="none"
          stroke="#1B8A7A"
          strokeWidth="1.5"
          opacity="0.45"
        />
      </motion.g>
    </svg>
  )
}
