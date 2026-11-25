import { useState, type ReactNode } from 'react'
import { company } from '@/data/site'
import { cn } from '@/lib/cn'

/**
 * Company logo. Renders `/public/images/logo.png` and falls back to the
 * provided text/motif mark when that file is missing, so the site never shows
 * a broken image.
 *
 * The artwork ships with a white square background, so by default it sits
 * inside a rounded cream pill with a soft lime glow — turning the flat white
 * box into an intentional badge on the dark theme. Callers control the image
 * size via `className` and the badge padding via `badgeClassName`.
 */
export function Logo({
  className,
  fallback,
  badge = true,
  badgeClassName,
}: {
  /** Sizing/layout for the <img>, e.g. "h-11". */
  className?: string
  /** Shown instead of the image when it cannot be loaded. */
  fallback: ReactNode
  /** Wrap the image in the rounded badge (default) or render it bare. */
  badge?: boolean
  /** Extra classes for the badge wrapper, e.g. larger padding. */
  badgeClassName?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) return <>{fallback}</>

  const image = (
    <img
      src={company.logo}
      alt={company.name}
      width={192}
      height={48}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('w-auto object-contain', className)}
    />
  )

  if (!badge) return image

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl bg-cream p-1.5',
        'ring-1 ring-lime/40 shadow-[0_0_20px_rgba(123,199,77,0.35)]',
        badgeClassName,
      )}
    >
      {image}
    </span>
  )
}
