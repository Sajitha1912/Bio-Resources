import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Frosted-glass surface used for cards throughout the site. */
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface backdrop-blur-xl',
        'ring-1 ring-inset ring-white/5',
        className,
      )}
    >
      {children}
    </div>
  )
}
