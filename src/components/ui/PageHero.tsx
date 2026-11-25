import { Container } from './Container'
import { SplitText } from './SplitText'

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-28 pb-14 sm:pt-36 sm:pb-20">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-accent uppercase dark:text-lime">
              {eyebrow}
            </p>
          ) : null}
          <SplitText
            as="h1"
            text={title}
            stagger={0.05}
            className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
          />
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lg text-fg-muted">{subtitle}</p>
          ) : null}
        </div>
      </Container>
    </header>
  )
}
