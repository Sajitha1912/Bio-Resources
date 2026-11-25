import { cn } from '@/lib/cn'

const RUNGS = [60, 180, 300]

/** Decorative code-drawn DNA double helix. */
export function DnaHelix({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 360"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id="dna-helix" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7BC74D" />
          <stop offset="100%" stopColor="#1B8A7A" />
        </linearGradient>
      </defs>
      <path
        d="M60 0 C20 40 20 80 60 120 C100 160 100 200 60 240 C20 280 20 320 60 360"
        stroke="url(#dna-helix)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 0 C100 40 100 80 60 120 C20 160 20 200 60 240 C100 280 100 320 60 360"
        stroke="url(#dna-helix)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {RUNGS.map((y) => (
        <line
          key={y}
          x1="28"
          y1={y}
          x2="92"
          y2={y}
          stroke="url(#dna-helix)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.4"
        />
      ))}
    </svg>
  )
}
