import { createElement, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getServiceBySlug, services, servicesPage } from "@/data/site";
import { useSeo } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { TechniqueChips } from "@/components/ui/TechniqueChips";
import { NotFoundPage } from "./NotFoundPage";
import { PageBackground } from "@/components/background/PageBackground";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const notFoundTitle = "Service not found";

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);

  useSeo({
    title: service ? service.title : notFoundTitle,
    description: service
      ? service.description
      : "The requested service could not be found.",
    path: `/services/${slug}`,
  });

  if (!service) return <NotFoundPage />;

  const icon = getIcon(service.icon);
  const others = services.filter((item) => item.slug !== service.slug);
  const { detail } = servicesPage;

  return (
    <>
      <PageBackground variant="detail" slug={service.slug} />
      {service.media ? <ServiceBanner service={service} /> : null}
      <PageHero
        eyebrow="Service"
        title={service.title}
        subtitle={service.tagline}
      />

      <Section className="section-soft-glow">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,20rem)]">
            <div>
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                {createElement(icon, { className: "size-6" })}
              </span>
              <p className="mt-6 text-fg-muted">{service.description}</p>

              {service.techniques ? (
                <>
                  <h2 className="mt-10 text-2xl">{detail.methodsTitle}</h2>
                  <TechniqueChips
                    items={service.techniques}
                    withDescriptions
                    className="mt-4"
                  />
                </>
              ) : null}

              <h2 className="mt-10 text-2xl">{detail.whatYouGetTitle}</h2>
              <ul className="mt-4 space-y-3">
                {service.whatYouGet.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent dark:text-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-2xl">{detail.processTitle}</h2>
              <ol className="relative mt-6 space-y-8 border-l border-line pl-8">
                {service.process.map((step, index) => (
                  <li key={step} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 -left-[2.5rem] flex size-8 items-center justify-center rounded-full border border-teal/40 bg-bg font-heading text-xs text-accent dark:border-lime/40 dark:text-lime"
                    >
                      {index + 1}
                    </span>
                    <Reveal delay={index * 0.08}>
                      <p className="pt-1">{step}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="lg:pt-2">
              <Reveal>
                <GlassCard className="p-6">
                  <h2 className="text-lg">{detail.ctaTitle}</h2>
                  <p className="mt-2 text-sm text-fg-muted">
                    {detail.ctaSubtitle}
                  </p>
                  <ButtonLink to="/contact" className="mt-5 w-full">
                    {detail.ctaLabel}
                  </ButtonLink>
                </GlassCard>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      <SectionDivider tone="lime" />

      <Section className="section-faint-grid border-t border-line">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-2xl">{detail.otherTitle}</h2>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm text-accent dark:text-lime"
            >
              <ArrowLeft className="size-4" />
              {detail.backLabel}
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/services/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4 transition hover:border-teal/50 dark:hover:border-lime/50"
                >
                  <span>{item.title}</span>
                  <span className="text-sm text-fg-muted">{item.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}

function ServiceBanner({ service }: { service: (typeof services)[number] }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const media = service.media;
  const src = media?.type === "video" ? media.poster : media?.src;

  if (!media || !src) return null;

  const Icon = getIcon(service.icon);

  return (
    <Section className="pb-0 pt-6 sm:pt-8">
      <Container>
        <div
          ref={bannerRef}
          className="service-banner relative h-[clamp(12rem,38vw,20rem)] max-h-80 overflow-hidden rounded-2xl"
        >
          {!loaded && !failed ? (
            <div className="card-3d-skeleton service-card-shimmer absolute inset-0" />
          ) : null}
          {!failed ? (
            <motion.img
              src={src}
              alt={media.alt}
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{ y: reduced ? 0 : y, scale: 1.08 }}
              className="service-card-image absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-accent dark:text-lime">
              {createElement(Icon, {
                "aria-hidden": true,
                className: "size-16",
              })}
            </div>
          )}
          <div className="service-card-vignette" />
        </div>
      </Container>
    </Section>
  );
}
