import { cn } from '@/lib/cn'

const NODES = [
  { cx: 60, cy: 18, r: 9 },
  { cx: 18, cy: 92, r: 7 },
  { cx: 102, cy: 92, r: 7 },
]

/** Decorative code-drawn molecule motif. */
export function MoleculeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      {NODES.map((node) => (
        <line
          key={`bond-${node.cx}-${node.cy}`}
          x1="60"
          y1="60"
          x2={node.cx}
          y2={node.cy}
          stroke="#1B8A7A"
          strokeWidth="2"
          opacity="0.5"
        />
      ))}
      <circle cx="60" cy="60" r="12" fill="#7BC74D" opacity="0.9" />
      {NODES.map((node) => (
        <circle
          key={`node-${node.cx}-${node.cy}`}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill="none"
          stroke="#0F3D2E"
          strokeWidth="2.5"
          className="dark:stroke-cream"
        />
      ))}
    </svg>
  )
}
