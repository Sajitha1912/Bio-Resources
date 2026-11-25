import { lazy, Suspense } from "react";
import { cn } from "@/lib/cn";
import { FocusIllustration } from "./FocusIllustrations";

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
    <Suspense fallback={null}>
      <LazyCardCanvas />
    </Suspense>
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
  return (
    <Suspense
      fallback={
        <div className={cn("card-3d-skeleton h-[200px] w-full", className)} />
      }
    >
      <LazyCardSlot object={object} fallback={fallback} className={className} />
    </Suspense>
  );
}
