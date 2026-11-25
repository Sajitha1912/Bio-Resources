import { getIcon } from '@/lib/icons'
import { cn } from '@/lib/cn'
import type { Technique } from '@/data/site'

type TechniqueChipsProps = {
  items: Technique[]
  className?: string
  /**
   * When true each entry becomes a card showing its one-line description
   * (used on the Computational Studies detail page); otherwise compact chips.
   */
  withDescriptions?: boolean
}

/**
 * Renders a list of techniques as chips, each with a small animated icon.
 * Icons resolve through the shared registry so the data stays JSX-free.
 */
export function TechniqueChips({
  items,
  className,
  withDescriptions = false,
}: TechniqueChipsProps) {
  return (
    <ul
      className={cn(
        withDescriptions ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-wrap gap-3',
        className,
      )}
    >
      {items.map((technique, index) => {
        const Icon = getIcon(technique.icon)
        const icon = (
          <Icon
            aria-hidden="true"
            className="chip-icon size-4 shrink-0 text-accent dark:text-lime"
            style={{ animationDelay: `${index * 0.18}s` }}
          />
        )

        if (withDescriptions) {
          return (
            <li
              key={technique.name}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 backdrop-blur transition hover:border-teal/60 dark:hover:border-lime/60"
            >
              {icon}
              <span>
                <span className="block font-medium">{technique.name}</span>
                {technique.description ? (
                  <span className="mt-0.5 block text-sm text-fg-muted">
                    {technique.description}
                  </span>
                ) : null}
              </span>
            </li>
          )
        }

        return (
          <li
            key={technique.name}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium backdrop-blur transition hover:border-teal/60 dark:hover:border-lime/60"
          >
            {icon}
            {technique.name}
          </li>
        )
      })}
    </ul>
  )
}
