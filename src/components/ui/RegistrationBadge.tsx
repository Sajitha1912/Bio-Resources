import { Check } from 'lucide-react'
import { company } from '@/data/site'
import { cn } from '@/lib/cn'

/**
 * Small trust badge showing the company's Udyam registration number.
 * Purely informational — it is not a link and makes no further claims.
 */
export function RegistrationBadge({ className }: { className?: string }) {
  const { registration } = company

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 backdrop-blur',
        className,
      )}
    >
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-medium">{registration.label}</span>
        <span className="font-mono text-xs font-semibold tracking-[0.08em] text-fg-muted">
          {registration.number}
        </span>
      </span>
    </div>
  )
}
