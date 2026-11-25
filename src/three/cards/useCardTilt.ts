import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export function useCardTilt(
  cardRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [hovered, setHovered] = useState(false);
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const card =
      cardRef.current?.closest("article, a, [data-card-tilt]") ??
      cardRef.current;
    if (!card || !enabled) return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.current.x = py * -0.18;
      tilt.current.y = px * 0.18;
      setHovered(true);
    };
    const onLeave = () => {
      tilt.current.x = 0;
      tilt.current.y = 0;
      setHovered(false);
    };

    card.addEventListener("pointermove", onMove as EventListener);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove as EventListener);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [cardRef, enabled]);

  return { tilt, hovered };
}
