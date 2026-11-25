import { cn } from '@/lib/cn'

/** Decorative code-drawn leaf motif. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <path
        d="M96 20 C50 24 22 52 24 96 C68 94 96 66 96 20 Z"
        stroke="#1B8A7A"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M96 20 C74 40 52 62 30 92"
        stroke="#7BC74D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M66 48 C76 50 84 48 92 42"
        stroke="#7BC74D"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M50 64 C58 68 64 72 68 80"
        stroke="#7BC74D"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}
