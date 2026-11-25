import { about } from "@/data/site";
import { useSeo } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { TechniqueChips } from "@/components/ui/TechniqueChips";
import { RegistrationBadge } from "@/components/ui/RegistrationBadge";
import { AudienceToggle } from "@/components/about/AudienceToggle";
import { PageBackground } from "@/components/background/PageBackground";
import { SectionDivider } from "@/components/ui/SectionDivider";

export function AboutPage() {
  useSeo({
    title: "About",
    description: about.hero.subtitle,
    path: "/about",
  });

  return (
    <>
      <PageBackground variant="about" />

      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        subtitle={about.hero.subtitle}
      />

      {/* Story */}
      <Section className="section-faint-grid border-y border-line">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={about.story.eyebrow}
                title={about.story.title}
              />
              <div className="mt-6 space-y-4 text-fg-muted">
                {about.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <dl className="grid content-start gap-4">
              {about.story.facts.map((fact, index) => (
                <Reveal key={fact.label} delay={index * 0.08}>
                  <GlassCard className="p-5">
                    <dt className="text-xs font-semibold tracking-[0.18em] text-accent uppercase dark:text-lime">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-fg">{fact.value}</dd>
                  </GlassCard>
                </Reveal>
              ))}
            </dl>

            <div className="mt-6">
              <RegistrationBadge />
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider tone="lime" />

      {/* Why choose us */}
      <Section className="border-y border-line">
        <Container>
          <SectionHeading
            eyebrow={about.whyChooseUs.eyebrow}
            title={about.whyChooseUs.title}
            subtitle={about.whyChooseUs.subtitle}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {about.whyChooseUs.items.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.08}
                  className="h-full"
                >
                  <GlassCard className="h-full p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-xl">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      {item.description}
                    </p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <SectionDivider tone="teal" />

      {/* Techniques */}
      <Section className="section-soft-glow">
        <Container>
          <SectionHeading
            eyebrow={about.techniques.eyebrow}
            title={about.techniques.title}
            subtitle={about.techniques.subtitle}
            align="center"
          />
          <Reveal className="mt-10">
            <TechniqueChips
              items={about.techniques.items}
              className="justify-center"
            />
          </Reveal>
        </Container>
      </Section>

      {/* Who we serve — animated toggle */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading
            eyebrow={about.segments.eyebrow}
            title={about.segments.title}
            subtitle={about.segments.subtitle}
            align="center"
          />
          <AudienceToggle />
        </Container>
      </Section>

      {/* Strengths */}
      <Section className="section-faint-grid border-t border-line">
        <Container>
          <SectionHeading
            eyebrow={about.strengths.eyebrow}
            title={about.strengths.title}
            subtitle={about.strengths.subtitle}
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.strengths.items.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.08}
                  className="h-full"
                >
                  <GlassCard className="h-full p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-xl">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      {item.description}
                    </p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <SectionDivider />
    </>
  );
}
