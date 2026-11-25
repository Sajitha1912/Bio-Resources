import { lazy, Suspense } from "react";

const Mesh = lazy(() => import("./GradientMesh"));
const Dna = lazy(() => import("./FloatingDNA"));
const Network = lazy(() => import("./MoleculeNetwork"));
const Particles = lazy(() => import("./Particles"));
const HexGrid = lazy(() => import("./HexGrid"));
const Leaves = lazy(() =>
  import("@/components/decor/FloatingMotifs").then((module) => ({
    default: module.FloatingMotifs,
  })),
);

export type PageBackgroundVariant = "about" | "services" | "detail" | "contact";

const DETAIL_ACCENTS: Record<string, string> = {
  "in-vitro-assays": "#7bc74d",
  "computational-studies": "#1b8a7a",
  "nanotechnology-projects": "#a7cf6a",
  "projects-and-internships": "#6cae8f",
  "thesis-and-manuscript-writing": "#d5b86a",
};

export function PageBackground({
  variant,
  accent,
  slug,
}: {
  variant: PageBackgroundVariant;
  accent?: string;
  slug?: string;
}) {
  const detailAccent =
    accent ?? (slug ? DETAIL_ACCENTS[slug] : undefined) ?? "#7bc74d";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Suspense fallback={null}>
        {variant === "about" ? (
          <>
            <Mesh className="opacity-70" />
            <Dna />
            <Particles speed={0.55} />
            <Leaves />
          </>
        ) : null}

        {variant === "services" ? (
          <>
            <Network />
            <HexGrid />
            <Mesh className="opacity-45" />
          </>
        ) : null}

        {variant === "detail" ? (
          <>
            <HexGrid color={detailAccent} className="opacity-90" />
            <Particles color={detailAccent} accent="#1b8a7a" speed={0.75} />
          </>
        ) : null}

        {variant === "contact" ? (
          <>
            <Mesh className="opacity-55" />
            <Particles speed={0.28} />
          </>
        ) : null}
      </Suspense>
    </div>
  );
}
