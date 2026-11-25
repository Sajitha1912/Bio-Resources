import { cn } from '@/lib/cn'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase dark:text-lime">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-base text-fg-muted sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  )
}
