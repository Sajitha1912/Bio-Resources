import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Section({
  children,
  id,
  className,
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-28', className)}>
      {children}
    </section>
  )
}
