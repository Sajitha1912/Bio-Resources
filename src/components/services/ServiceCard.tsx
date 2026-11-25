import { createElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { Service } from "@/data/site";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/cn";

export function ServiceCard({
  service,
  index = 0,
  className,
}: {
  service: Service;
  index?: number;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
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
  const glare = useMotionTemplate`radial-gradient(240px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2), transparent 70%)`;

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: coarse)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setTouch(pointer.matches);
      setReduced(motionMedia.matches);
    };
    sync();
    pointer.addEventListener("change", sync);
    motionMedia.addEventListener("change", sync);
    return () => {
      pointer.removeEventListener("change", sync);
      motionMedia.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Icon = getIcon(service.icon);
  const media = service.media;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
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
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
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
        "group h-full",
        !inView && "service-card-paused",
        hovered && "service-card-hovered",
        className,
      )}
    >
      <Link
        to={`/services/${service.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface ring-1 ring-inset ring-white/5 backdrop-blur-xl transition-[border-color,box-shadow] duration-500"
      >
        <div className="service-media relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl">
          {media && !loaded && !failed ? (
            <div className="card-3d-skeleton service-card-shimmer absolute inset-0" />
          ) : null}
          {media && !failed ? (
            media.type === "video" ? (
              <video
                ref={(video) => {
                  if (!video) return;
                  if (inView && !reduced)
                    void video.play().catch(() => undefined);
                  else video.pause();
                }}
                poster={media.poster}
                muted
                loop
                playsInline
                preload="metadata"
                width={1280}
                height={720}
                aria-label={media.alt}
                className="service-card-image h-full w-full object-cover"
                onLoadedData={() => setLoaded(true)}
                onError={() => setFailed(true)}
              >
                <source
                  src={media.src.replace(/\.(mp4|webm)$/i, ".webm")}
                  type="video/webm"
                />
                <source
                  src={media.src.replace(/\.(mp4|webm)$/i, ".mp4")}
                  type="video/mp4"
                />
              </video>
            ) : (
              <motion.img
                src={media.src}
                alt={media.alt}
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
                className="service-card-image h-full w-full object-cover"
                animate={
                  reduced || !inView
                    ? { y: 0, scale: 1 }
                    : touch
                      ? {
                          y: [0, -5, 0],
                          scale: [1, 1.025, 1],
                          rotate: [-1, 1, -1],
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
            <div className="flex h-full items-center justify-center text-accent dark:text-lime">
              {createElement(Icon, { "aria-hidden": true, className: "size-16" })}
            </div>
          )}
          {!reduced && inView ? (
            <>
              <span className="service-card-bokeh service-card-bokeh-one" />
              <span className="service-card-bokeh service-card-bokeh-two" />
              <span className="service-card-bokeh service-card-bokeh-three" />
              <motion.span
                className="service-card-glare"
                style={{ background: glare }}
                animate={{ opacity: hovered ? 1 : 0 }}
              />
            </>
          ) : null}
          <div className="service-card-vignette" />
          <span className="absolute bottom-3 left-3 z-10 inline-flex size-11 items-center justify-center rounded-xl border border-white/15 bg-bg/70 text-accent shadow-lg backdrop-blur-md dark:text-lime">
            {createElement(Icon, { className: "size-5" })}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-xl leading-tight">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {service.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent dark:text-lime">
            Learn more
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
