import { techniques } from '@/data/site'
import { getIcon } from '@/lib/icons'

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {techniques.map((technique) => {
        const Icon = getIcon(technique.icon)
        return (
          <li
            key={technique.name}
            className="flex items-center gap-3 pr-12 whitespace-nowrap"
          >
            <Icon
              aria-hidden="true"
              className="size-5 shrink-0 text-accent dark:text-lime"
            />
            <span className="font-heading text-lg sm:text-2xl">
              {technique.name}
            </span>
            <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
          </li>
        )
      })}
    </ul>
  )
}

/** Infinite, hover-pausable marquee of the techniques we work with. */
export function Marquee() {
  return (
    <section
      aria-label="Techniques we work with"
      className="marquee relative overflow-hidden border-y border-line py-6"
    >
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent"
      />
    </section>
  )
}
