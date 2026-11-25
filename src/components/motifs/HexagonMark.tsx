import { cn } from '@/lib/cn'

/** Decorative hexagon (honeycomb) motif. */
export function HexagonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <polygon
        points="60,8 105,34 105,86 60,112 15,86 15,34"
        stroke="#1B8A7A"
        strokeWidth="2.5"
        fill="none"
      />
      <polygon
        points="60,30 84,44 84,72 60,86 36,72 36,44"
        stroke="#7BC74D"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
    </svg>
  )
}
