import { Mail, Phone } from 'lucide-react'
import { company, contact, primaryPhone } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { LocationButton } from '@/components/location/LocationButton'

/**
 * Slim strip above the navbar (desktop only). Shares the header's fixed shell,
 * so it hides and reveals together with the navbar on scroll.
 */
export function TopContactBar() {
  const email = contact.channels.find((channel) => channel.id === 'email')

  return (
    <div className="hidden border-b border-line/70 md:block">
      <Container>
        <div className="flex h-9 items-center justify-between gap-6 text-xs">
          <p className="truncate text-fg-muted">{company.tagline}</p>
          <div className="flex shrink-0 items-center gap-5">
            {email ? (
              <a
                href={email.href}
                className="inline-flex items-center gap-1.5 text-fg-muted transition hover:text-fg"
              >
                <Mail className="size-3.5" />
                {email.value}
              </a>
            ) : null}
            {primaryPhone?.href ? (
              <a
                href={primaryPhone.href}
                className="inline-flex items-center gap-1.5 text-fg-muted transition hover:text-fg"
              >
                <Phone className="size-3.5" />
                {primaryPhone.value}
              </a>
            ) : null}
            <LocationButton size="sm" showLabel />
          </div>
        </div>
      </Container>
    </div>
  )
}
