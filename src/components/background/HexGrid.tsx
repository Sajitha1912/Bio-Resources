import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** A lightweight, static SVG honeycomb pattern for services and detail pages. */
export default function HexGrid({
  color = "#7bc74d",
  className,
}: {
  color?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 104"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-25"
      >
        <defs>
          <pattern
            id="bio-hex-grid"
            width="120"
            height="104"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 2h60l28 50-28 50H30L2 52z"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.28"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bio-hex-grid)" />
      </svg>
      {!reduced ? (
        <div
          className="page-hex-glow absolute inset-x-0 top-[18%] h-56"
          style={{ "--hex-accent": color } as CSSProperties}
        />
      ) : null}
    </div>
  );
}
