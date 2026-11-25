import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { company, contact, footer, nav } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { RegistrationBadge } from '@/components/ui/RegistrationBadge'
import { LeafMark } from '@/components/motifs/LeafMark'
import { LocationButton } from '@/components/location/LocationButton'

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  Email: Mail,
  Phone: Phone,
  Address: MapPin,
}

const WORDMARK_CLASSES =
  'block font-heading font-semibold uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(2rem,9vw,8.5rem)] whitespace-nowrap'

export function SiteFooter() {
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wordmarkRef,
    offset: ['start end', 'end start'],
  })
  // Reveals the coloured fill from left to right as the wordmark scrolls in.
  const inset = useTransform(scrollYProgress, [0.1, 0.75], [100, 0])
  const clipPath = useMotionTemplate`inset(0 ${inset}% 0 0)`
  const wordmark = company.shortName.toUpperCase()

  return (
    <footer className="border-t border-line">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label={`${company.name} — home`}
            >
              <Logo
                className="h-11"
                fallback={
                  <>
                    <span className="size-8 shrink-0">
                      <LeafMark />
                    </span>
                    <span className="font-heading text-lg font-medium">
                      {company.shortName}
                    </span>
                  </>
                }
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-fg-muted">{footer.blurb}</p>
            <div className="mt-5">
              <RegistrationBadge />
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Explore
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-fg-muted transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {contact.channels.map((channel) => {
                const Icon = CHANNEL_ICONS[channel.label] ?? Mail
                const content = (
                  <span className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 size-4 shrink-0 text-accent dark:text-lime" />
                    <span className="text-fg-muted">{channel.value}</span>
                  </span>
                )
                return (
                  <li key={channel.id}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="transition hover:text-fg"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="mt-4">
              <LocationButton size="sm" showLabel className="text-sm" />
            </div>

            {contact.social.length > 0 ? (
              <ul className="mt-4 flex gap-3 text-sm">
                {contact.social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-fg-muted transition hover:text-fg"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>

      <div ref={wordmarkRef} className="pt-6" aria-hidden="true">
        <Container>
          <div className="relative">
            <span className={`wordmark-outline ${WORDMARK_CLASSES}`}>
              {wordmark}
            </span>
            <motion.span
              style={{ clipPath }}
              className={`absolute inset-0 bg-gradient-to-r from-lime via-teal to-lime bg-clip-text text-transparent ${WORDMARK_CLASSES}`}
            >
              {wordmark}
            </motion.span>
          </div>
        </Container>
      </div>

      <Container>
        <div className="border-t border-line py-6 text-sm text-fg-muted">
          {footer.legal}
        </div>
      </Container>
    </footer>
  )
}
