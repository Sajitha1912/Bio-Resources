import { useId, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LocationModal } from './LocationModal'

/**
 * Map-pin trigger with a pulsing halo and a tooltip. Opens <LocationModal />.
 * Used in the top contact bar, the navbar, the footer and the contact page.
 */
export function LocationButton({
  className,
  size = 'md',
  showLabel = false,
  label = 'Find us',
}: {
  className?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const dims =
    size === 'sm'
      ? { box: 'size-8', icon: 'size-4' }
      : { box: 'size-10', icon: 'size-5' }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="View our location"
        aria-haspopup="dialog"
        aria-describedby={tooltipId}
        className={cn(
          'group relative inline-flex items-center gap-2 text-fg-muted transition hover:text-accent dark:hover:text-lime',
          className,
        )}
      >
        <span
          className={cn(
            'relative inline-flex items-center justify-center rounded-full border border-line bg-surface',
            dims.box,
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-lime/40"
          />
          <MapPin className={cn('relative', dims.icon)} />
        </span>
        {showLabel ? <span className="text-sm">{label}</span> : null}
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs whitespace-nowrap text-fg opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          View our location
        </span>
      </button>
      <LocationModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
