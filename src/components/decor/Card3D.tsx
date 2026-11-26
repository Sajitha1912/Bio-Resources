import { lazy, Suspense } from "react";
import { cn } from "@/lib/cn";
import { FocusIllustration } from "./FocusIllustrations";
import { CanvasErrorBoundary } from "@/three/CanvasErrorBoundary";

const LazyCardCanvas = lazy(() =>
  import("@/three/cards/CardVisual3D").then((module) => ({
    default: module.CardCanvas,
  })),
);
const LazyCardSlot = lazy(() =>
  import("@/three/cards/CardVisual3D").then((module) => ({
    default: module.CardSlot,
  })),
);

export function Card3DCanvas() {
  return (
    <CanvasErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <LazyCardCanvas />
      </Suspense>
    </CanvasErrorBoundary>
  );
}

export function Card3DSlot({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const object = icon as
    | "pill"
    | "leaf"
    | "cpu"
    | "shield-plus"
    | "syringe"
    | "sprout"
    | "atom";
  const fallback = <FocusIllustration icon={icon} className="h-full w-full" />;
  const staticFallback = (
    <div className={cn("relative h-[200px] w-full", className)}>{fallback}</div>
  );
  return (
    <CanvasErrorBoundary fallback={staticFallback}>
      <Suspense
        fallback={
          <div className={cn("card-3d-skeleton h-[200px] w-full", className)} />
        }
      >
        <LazyCardSlot
          object={object}
          fallback={fallback}
          className={className}
        />
      </Suspense>
    </CanvasErrorBoundary>
  );
}
