import { stats } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Counter } from '@/components/ui/Counter'

/** Splits a stat value like "100 ns" into its numeric part and trailing unit. */
function parseStatValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/)
  if (!match) return null
  return { number: Number(match[1]), suffix: match[2] }
}

/** Renders nothing until real, verifiable figures are added in site.ts. */
export function StatsBand() {
  if (stats.length === 0) return null

  return (
    <section className="border-y border-line">
      <Container>
        <dl className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4 sm:py-12">
          {stats.map((stat) => {
            const parsed = parseStatValue(stat.value)
            return (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-heading text-3xl sm:text-4xl">
                    {parsed ? (
                      <Counter value={parsed.number} suffix={parsed.suffix} />
                    ) : (
                      stat.value
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-fg-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            )
          })}
        </dl>
      </Container>
    </section>
  )
}
