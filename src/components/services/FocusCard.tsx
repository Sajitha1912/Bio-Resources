import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { FocusArea } from "@/data/site";
import { cn } from "@/lib/cn";
import { FocusIllustration } from "@/components/decor/FocusIllustrations";

export function FocusCard({
  area,
  index,
  className,
}: {
  area: FocusArea;
  index: number;
  className?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [touch, setTouch] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const rotateX = useSpring(0, { stiffness: 260, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 28 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const updateTouch = () => setTouch(media.matches);
    updateTouch();
    media.addEventListener("change", updateTouch);

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(motionMedia.matches);
    updateMotion();
    motionMedia.addEventListener("change", updateMotion);

    return () => {
      media.removeEventListener("change", updateTouch);
      motionMedia.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    if (touch || reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 16);
    rotateX.set((0.5 - py) * 16);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const reset = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const media = area.media;
  const fallback = (
    <FocusIllustration icon={area.icon} className="h-full w-full" />
  );

  return (
    <motion.article
      ref={cardRef}
      initial={reduced ? false : { opacity: 0, scale: 0.92, y: 18 }}
      animate={inView && !reduced ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{
        duration: 0.55,
        delay: inView ? index * 0.07 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerMove={onMove}
      onPointerEnter={() => !touch && !reduced && setHovered(true)}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-4 ring-1 ring-inset ring-white/5 backdrop-blur-xl sm:p-5",
        "transition-[border-color,box-shadow,background] duration-500",
        "hover:border-teal/50 hover:shadow-[0_18px_60px_rgba(123,199,77,0.12)] dark:hover:border-lime/50",
        hovered && "focus-card-hovered",
        className,
      )}
    >
      <div
        className="focus-card-media relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl"
        aria-live="polite"
      >
        {!loaded && !failed ? (
          <div className="focus-card-shimmer absolute inset-0" />
        ) : null}

        {media && !failed ? (
          media.type === "video" ? (
            <video
              className="h-full w-full object-cover"
              poster={media.src}
              muted
              loop
              playsInline
              preload="metadata"
              width={800}
              height={600}
              aria-label={media.alt}
              ref={(video) => {
                if (!video) return;
                if (inView && !reduced)
                  void video.play().catch(() => undefined);
                else video.pause();
              }}
              onLoadedData={() => setLoaded(true)}
              onError={() => setFailed(true)}
            >
              <source
                src={media.src.replace(/\.(png|jpe?g)$/i, ".webm")}
                type="video/webm"
              />
              <source
                src={media.src.replace(/\.(png|jpe?g)$/i, ".mp4")}
                type="video/mp4"
              />
            </video>
          ) : (
            <motion.img
              src={media.src}
              alt={media.alt}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className="focus-card-image h-full w-full object-cover"
              animate={
                reduced || !inView
                  ? { y: 0, scale: 1 }
                  : touch
                    ? {
                        y: [0, -5, 0],
                        scale: [1, 1.025, 1],
                        rotate: [-1.5, 1.5, -1.5],
                      }
                    : hovered
                      ? { y: -4, scale: 1.06 }
                      : { y: [0, -6, 0], scale: [1, 1.04, 1] }
              }
              transition={
                reduced || !inView
                  ? { duration: 0 }
                  : touch
                    ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
                    : hovered
                      ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
            />
          )
        ) : (
          fallback
        )}

        {!reduced && inView ? (
          <>
            <span className="focus-bokeh focus-bokeh-one" />
            <span className="focus-bokeh focus-bokeh-two" />
            <span className="focus-bokeh focus-bokeh-three" />
            <motion.span
              className="focus-card-glare"
              style={{
                backgroundPosition: `${glareX.get()}% ${glareY.get()}%`,
              }}
              animate={{ opacity: hovered ? 0.75 : 0 }}
            />
          </>
        ) : null}
        <div className="focus-card-vignette" />
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <h3 className="text-xl leading-tight">{area.title}</h3>
        {area.description ? (
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {area.description}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
