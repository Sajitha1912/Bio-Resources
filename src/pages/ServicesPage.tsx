import { company, focusAreas, services, servicesPage } from "@/data/site";
import { useSeo } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { FocusCard } from "@/components/services/FocusCard";
import { PageBackground } from "@/components/background/PageBackground";
import { SectionDivider } from "@/components/ui/SectionDivider";

export function ServicesPage() {
  useSeo({
    title: servicesPage.hero.eyebrow,
    description: `Services offered by ${company.companyName}. ${servicesPage.hero.subtitle}`,
    path: "/services",
  });

  return (
    <>
      <PageBackground variant="services" />
      <PageHero
        eyebrow={servicesPage.hero.eyebrow}
        title={servicesPage.hero.title}
        subtitle={servicesPage.hero.subtitle}
      />

      <Section className="section-soft-glow">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
                className="h-full"
              />
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider tone="teal" />

      <Section className="section-faint-grid border-t border-line">
        <Container>
          <SectionHeading
            eyebrow={servicesPage.focus.eyebrow}
            title={servicesPage.focus.title}
            subtitle={servicesPage.focus.subtitle}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.items.map((area, index) => (
              <Reveal key={area.title} delay={index * 0.06} className="h-full">
                <FocusCard area={area} index={index} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
