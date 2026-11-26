import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { focusAreas } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FocusCard } from "@/components/services/FocusCard";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned horizontal-scroll gallery of the five focus areas. On desktop the
 * section is pinned and the track is translated sideways as the page scrolls;
 * on smaller screens (and under reduced motion) the cards simply stack.
 */
export function FocusGallery() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pinned]);

  const panels = focusAreas.items.map((area, index) => (
    <FocusCard
      key={area.title}
      area={area}
      index={index}
      className={cn("shrink-0", pinned ? "w-[max(38vw,340px)]" : "w-full")}
    />
  ));

  const heading = (
    <SectionHeading
      eyebrow={focusAreas.eyebrow}
      title={focusAreas.title}
      subtitle={focusAreas.subtitle}
      align="center"
    />
  );

  return (
    <section
      ref={sectionRef}
      id="focus"
      className="relative border-y border-line"
    >
      {pinned ? (
        <div className="flex h-svh flex-col justify-center overflow-hidden">
          <Container className="w-full">{heading}</Container>
          <div
            ref={trackRef}
            className="mt-10 flex w-max gap-8 px-8 will-change-transform"
          >
            {panels}
          </div>
        </div>
      ) : (
        <Container className="py-16 sm:py-20 lg:py-28">
          {heading}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {panels}
          </div>
        </Container>
      )}
    </section>
  );
}
