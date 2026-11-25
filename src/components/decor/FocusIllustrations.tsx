import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Code-drawn, animated illustrations for the focus areas. Each one is a
 * self-contained SVG; the motion comes from CSS keyframes (defined in
 * index.css) which are neutralised for users who prefer reduced motion.
 */

function Frame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id="fi-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7BC74D" />
          <stop offset="100%" stopColor="#1B8A7A" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}

function PillIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g className="il-float il-origin">
        <g transform="rotate(-30 100 100)">
          <rect
            x="48"
            y="86"
            width="104"
            height="30"
            rx="15"
            fill="url(#fi-gradient)"
          />
          <rect
            x="86"
            y="86"
            width="52"
            height="30"
            rx="15"
            fill="#F7F5EF"
            opacity="0.22"
          />
          <line x1="100" y1="88" x2="100" y2="114" stroke="#F7F5EF" strokeWidth="2" opacity="0.6" />
        </g>
      </g>

      {[
        [52, 54],
        [150, 62],
        [146, 146],
        [50, 144],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="7"
          fill="none"
          stroke="#1B8A7A"
          strokeWidth="3"
          className="il-pulse il-origin"
          style={{ animationDelay: `${i * 0.55}s` }}
        />
      ))}
    </Frame>
  )
}

const VEINS = [
  { y: 138, dx: 26 },
  { y: 116, dx: 30 },
  { y: 94, dx: 26 },
  { y: 72, dx: 18 },
]

function LeafIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g className="il-float il-origin">
        <path
          d="M100 168 C58 132 54 78 100 36 C146 78 142 132 100 168 Z"
          fill="url(#fi-gradient)"
          opacity="0.16"
          stroke="url(#fi-gradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M100 168 L100 52"
          stroke="#1B8A7A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {VEINS.map(({ y, dx }) => (
          <g key={y}>
            <line
              x1="100"
              y1={y}
              x2={100 + dx}
              y2={y - 20}
              stroke="#7BC74D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="6 5"
              className="il-dash"
            />
            <line
              x1="100"
              y1={y}
              x2={100 - dx}
              y2={y - 20}
              stroke="#7BC74D"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="6 5"
              className="il-dash"
            />
          </g>
        ))}
      </g>
    </Frame>
  )
}

function CpuIllustration({ className }: { className?: string }) {
  const pins = [72, 100, 128]
  return (
    <Frame className={className}>
      <rect
        x="56"
        y="56"
        width="88"
        height="88"
        rx="16"
        fill="none"
        stroke="#1B8A7A"
        strokeWidth="3"
      />
      <rect
        x="76"
        y="76"
        width="48"
        height="48"
        rx="10"
        fill="url(#fi-gradient)"
        opacity="0.2"
        stroke="url(#fi-gradient)"
        strokeWidth="2"
      />
      <circle cx="100" cy="100" r="10" fill="#7BC74D" className="il-pulse il-origin" />

      {pins.map((p) => (
        <g key={p} stroke="#7BC74D" strokeWidth="3" strokeLinecap="round">
          <line x1={p} y1="40" x2={p} y2="56" />
          <line x1={p} y1="144" x2={p} y2="160" />
          <line x1="40" y1={p} x2="56" y2={p} />
          <line x1="144" y1={p} x2="160" y2={p} />
        </g>
      ))}
    </Frame>
  )
}

function SproutIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <ellipse cx="100" cy="146" rx="64" ry="20" fill="url(#fi-gradient)" opacity="0.12" />
      <ellipse
        cx="100"
        cy="146"
        rx="64"
        ry="20"
        fill="none"
        stroke="#1B8A7A"
        strokeWidth="3"
        opacity="0.5"
      />

      <g className="il-float il-origin">
        <path
          d="M100 146 L100 88"
          stroke="#1B8A7A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M100 110 C78 106 66 90 68 72 C88 74 100 90 100 110 Z"
          fill="url(#fi-gradient)"
          opacity="0.75"
        />
        <path
          d="M100 100 C122 96 134 80 132 62 C112 64 100 80 100 100 Z"
          fill="url(#fi-gradient)"
          opacity="0.75"
        />
      </g>
    </Frame>
  )
}

function AtomIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      {[0, 60, 120].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle} 100 100)`}>
          <g
            className="il-spin"
            style={{ animationDuration: `${10 + i * 3}s`, transformOrigin: '100px 100px' }}
          >
            <ellipse
              cx="100"
              cy="100"
              rx="66"
              ry="26"
              stroke="url(#fi-gradient)"
              strokeWidth="2"
              opacity="0.7"
            />
            <circle
              cx="166"
              cy="100"
              r="6"
              fill="#7BC74D"
              className="il-pulse il-origin"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          </g>
        </g>
      ))}
      <circle cx="100" cy="100" r="12" fill="url(#fi-gradient)" />
    </Frame>
  )
}

function ImmunoIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g className="il-float il-origin">
        <path
          d="M100 34 L152 54 V100 C152 134 128 158 100 168 C72 158 48 134 48 100 V54 Z"
          fill="url(#fi-gradient)"
          opacity="0.16"
          stroke="url(#fi-gradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M100 78 V128 M76 103 H124"
          stroke="#7BC74D"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>

      {[
        [66, 62],
        [134, 62],
        [162, 122],
        [38, 122],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="6"
          fill="none"
          stroke="#1B8A7A"
          strokeWidth="3"
          className="il-pulse il-origin"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </Frame>
  )
}

function VaccineIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g transform="rotate(-38 100 100)">
        <g className="il-float il-origin">
          <rect
            x="66"
            y="72"
            width="68"
            height="58"
            rx="9"
            fill="none"
            stroke="url(#fi-gradient)"
            strokeWidth="3"
          />
          <rect
            x="70"
            y="88"
            width="60"
            height="38"
            rx="6"
            fill="url(#fi-gradient)"
            opacity="0.25"
          />
          <rect
            x="88"
            y="48"
            width="24"
            height="24"
            rx="5"
            fill="url(#fi-gradient)"
            opacity="0.85"
          />
          <line x1="100" y1="40" x2="100" y2="48" stroke="#7BC74D" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="130" x2="100" y2="164" stroke="#1B8A7A" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {[
        [60, 152],
        [140, 152],
        [100, 178],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="5"
          fill="none"
          stroke="#7BC74D"
          strokeWidth="3"
          className="il-pulse il-origin"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </Frame>
  )
}

const ILLUSTRATIONS: Record<string, (props: { className?: string }) => ReactNode> = {
  pill: PillIllustration,
  leaf: LeafIllustration,
  cpu: CpuIllustration,
  sprout: SproutIllustration,
  atom: AtomIllustration,
  'shield-plus': ImmunoIllustration,
  syringe: VaccineIllustration,
}

export function FocusIllustration({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Illustration = ILLUSTRATIONS[icon] ?? LeafIllustration
  return <Illustration className={className} />
}
