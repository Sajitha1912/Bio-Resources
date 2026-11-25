import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useCanRender3D } from "@/hooks/useCanRender3D";
import { useIsLowPower } from "@/hooks/useIsLowPower";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { CardScene } from "./CardScene";
import { useCardTilt } from "./useCardTilt";
import { DrugDiscovery } from "./DrugDiscovery";
import { MedicinalPlant } from "./MedicinalPlant";
import { Computational } from "./Computational";
import { Immuno } from "./Immuno";
import { Vaccine } from "./Vaccine";
import { TissueCulture } from "./TissueCulture";
import { Nanotechnology } from "./Nanotechnology";

export type CardObject =
  | "pill"
  | "leaf"
  | "cpu"
  | "shield-plus"
  | "syringe"
  | "sprout"
  | "atom";

export function CardCanvas() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={hidden ? "never" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 35,
        touchAction: "pan-y",
      }}
    >
      <View.Port />
    </Canvas>
  );
}

export function CardSlot({
  object,
  fallback,
  className,
}: {
  object: CardObject;
  fallback: ReactNode;
  className?: string;
}) {
  const canRender = useCanRender3D();
  const low = useIsLowPower();
  const reduced = usePrefersReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const { tilt, hovered } = useCardTilt(host, canRender && !low && !reduced);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (
      !canRender ||
      low ||
      reduced ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setInView(visible);
        if (visible) setEntered(true);
      },
      { rootMargin: "160px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [canRender, low, reduced]);

  if (!canRender || low || reduced) {
    return (
      <div ref={host} className={cn("relative h-[200px] w-full", className)}>
        {fallback}
      </div>
    );
  }

  const scene = (
    <CardScene hovered={hovered} tilt={tilt.current}>
      {object === "pill" ? <DrugDiscovery hovered={hovered} /> : null}
      {object === "leaf" ? <MedicinalPlant hovered={hovered} /> : null}
      {object === "cpu" ? <Computational hovered={hovered} /> : null}
      {object === "shield-plus" ? <Immuno hovered={hovered} /> : null}
      {object === "syringe" ? <Vaccine hovered={hovered} /> : null}
      {object === "sprout" ? <TissueCulture hovered={hovered} /> : null}
      {object === "atom" ? <Nanotechnology hovered={hovered} /> : null}
    </CardScene>
  );

  return (
    <div
      ref={host}
      className={cn("relative h-[200px] w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      {!entered ? <div className="card-3d-skeleton absolute inset-0" /> : null}
      {entered && inView ? (
        <View className="absolute inset-0 h-full w-full">
          <Suspense fallback={null}>{scene}</Suspense>
        </View>
      ) : entered ? (
        <div className="card-3d-skeleton absolute inset-0" />
      ) : null}
    </div>
  );
}
