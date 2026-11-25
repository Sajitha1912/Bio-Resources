import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-forest text-cream hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90',
  secondary:
    'border border-line bg-surface text-fg backdrop-blur hover:border-teal/60 dark:hover:border-lime/60',
  ghost: 'text-fg-muted hover:text-fg',
}

function classes(variant: Variant, className?: string) {
  return cn(BASE, VARIANTS[variant], className)
}

export function ButtonLink({
  to,
  variant = 'primary',
  className,
  children,
}: {
  to: string
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={classes(variant, className)}>
      {children}
    </Link>
  )
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, className)} {...props}>
      {children}
    </button>
  )
}
