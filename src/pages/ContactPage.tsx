import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { company, contact, contactPage, primaryPhone } from "@/data/site";
import { mapEmbedUrl, openInMapsUrl } from "@/lib/location";
import { useSeo } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { RegistrationBadge } from "@/components/ui/RegistrationBadge";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageBackground } from "@/components/background/PageBackground";
import { SectionDivider } from "@/components/ui/SectionDivider";

export function ContactPage() {
  useSeo({
    title: contactPage.hero.eyebrow,
    description: contactPage.hero.subtitle,
    path: "/contact",
  });

  const email = contact.channels.find((channel) => channel.id === "email");
  const address = contact.channels.find((channel) => channel.id === "address");

  return (
    <>
      <PageBackground variant="contact" />
      <PageHero
        eyebrow={contactPage.hero.eyebrow}
        title={contactPage.hero.title}
        subtitle={contactPage.hero.subtitle}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl">{company.companyName}</h2>
              {email ? (
                <Reveal>
                  <a
                    href={email.href}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 backdrop-blur-xl transition hover:border-teal/50 dark:hover:border-lime/50"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                      <Mail className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-fg-muted">
                        {email.label}
                      </span>
                      <span className="block truncate text-fg">
                        {email.value}
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-fg-muted transition group-hover:text-accent dark:group-hover:text-lime" />
                  </a>
                </Reveal>
              ) : null}

              {primaryPhone ? (
                <Reveal>
                  <a
                    href={primaryPhone.href}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 backdrop-blur-xl transition hover:border-teal/50 dark:hover:border-lime/50"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                      <Phone className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-fg-muted">
                        {primaryPhone.label}
                      </span>
                      <span className="block truncate text-fg">
                        {primaryPhone.value}
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-fg-muted transition group-hover:text-accent dark:group-hover:text-lime" />
                  </a>
                </Reveal>
              ) : null}

              <Reveal>
                <GlassCard className="p-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                    <Clock className="size-5" />
                  </span>
                  <h2 className="mt-4 text-lg">{contact.hoursTitle}</h2>
                  <p className="mt-1 text-sm text-fg-muted">{contact.hours}</p>
                </GlassCard>
              </Reveal>

              {address ? (
                <Reveal>
                  <GlassCard className="p-5">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                      <MapPin className="size-5" />
                    </span>
                    <h2 className="mt-4 text-lg">{address.label}</h2>
                    <p className="mt-1 text-sm text-fg-muted">
                      {address.value}
                    </p>
                  </GlassCard>
                </Reveal>
              ) : null}

              <Reveal>
                <RegistrationBadge />
              </Reveal>
            </div>

            <Reveal>
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-2xl">{contactPage.form.title}</h2>
                <p className="mt-2 text-sm text-fg-muted">
                  {contactPage.form.subtitle}
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <SectionDivider tone="lime" />

      <Section className="section-faint-grid border-t border-line">
        <Container>
          <SectionHeading title={contact.map.title} />
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <iframe
              title={contact.map.title}
              src={mapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-frame h-[22rem] w-full border-0"
            />
          </div>
          <div className="mt-6">
            <a
              href={openInMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90"
            >
              <ExternalLink className="size-4" />
              Open in Google Maps
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
