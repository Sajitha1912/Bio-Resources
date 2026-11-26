import { company } from '@/data/site'
import { LeafMark } from '@/components/motifs/LeafMark'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'

export function BrandLockup({
  compact = false,
}: {
  compact?: boolean
}) {
  const legalSuffix = company.companyName
    .slice(company.companyShort.length)
    .trim()
    .toUpperCase()

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Logo
        className={compact ? 'h-9 sm:h-10' : 'h-10 sm:h-12'}
        fallback={
          <span className="size-8 shrink-0">
            <LeafMark />
          </span>
        }
      />
      <span
        className={cn(
          'flex min-w-0 flex-col leading-none max-[359px]:hidden',
          compact && 'scale-[0.92] origin-left',
        )}
      >
        <span className="whitespace-nowrap font-heading text-sm font-medium tracking-tight sm:text-base">
          {company.companyShort}
        </span>
        <span className="mt-1 whitespace-nowrap text-[10px] font-semibold tracking-[0.24em] text-lime">
          {legalSuffix}
        </span>
      </span>
    </span>
  )
}
