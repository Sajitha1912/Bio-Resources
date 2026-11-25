import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Renders a photo, falling back to a code-drawn motif if the file is missing.
 * Photo placeholders live in /public/images (see src/data/site.ts).
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallback,
}: {
  src: string
  alt: string
  className?: string
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={cn('flex h-full w-full items-center justify-center', className)}>{fallback}</div>
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
