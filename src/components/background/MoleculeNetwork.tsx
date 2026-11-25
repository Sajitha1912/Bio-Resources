import { useEffect, useRef } from "react";
import { useCanvasAnimation } from "@/hooks/useCanvasAnimation";
import { useIsLowPower } from "@/hooks/useIsLowPower";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/**
 * Layer 2 — a lightweight canvas of drifting nodes that fuse bonds when they
 * come close and gently push away from the pointer. Node count drops on small
 * / low-power devices and the mouse reaction is disabled there.
 *
 * Positions live in CSS pixels; DPR scaling and on-screen/visibility pausing
 * are handled by `useCanvasAnimation`.
 */
export default function MoleculeNetwork({
  color = "#7bc74d",
  className,
}: {
  /** Accent hex used for nodes and bonds. */
  color?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const low = useIsLowPower();
  const count = low ? 15 : 40;
  const interactive = !low;
  const linkDist = low ? 140 : 165;

  const nodes = useRef<Node[]>([]);
  const size = useRef({ width: 0, height: 0 });
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const rgb = useRef(hexToRgb(color));
  useEffect(() => {
    rgb.current = hexToRgb(color);
  }, [color]);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [interactive]);

  const canvasRef = useCanvasAnimation(
    (ctx, { width, height }, dt) => {
      if (width !== size.current.width || height !== size.current.height) {
        size.current = { width, height };
        nodes.current = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: 1.2 + Math.random() * 1.6,
        }));
      }

      const step = Math.min(dt, 48) / 16;
      const [r, g, b] = rgb.current;
      ctx.clearRect(0, 0, width, height);

      const list = nodes.current;
      const p = pointer.current;
      const pushRadius = 130;

      // Move + softly react to the pointer.
      for (const node of list) {
        node.x += node.vx * step;
        node.y += node.vy * step;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        if (interactive && p.active) {
          const dx = node.x - p.x;
          const dy = node.y - p.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < pushRadius * pushRadius && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / pushRadius) * 0.9;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }
      }

      // Bonds.
      ctx.lineWidth = 1;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b2 = list[j];
          const dx = a.x - b2.x;
          const dy = a.y - b2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        }
      }

      // Nodes.
      for (const node of list) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.75)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    { enabled: !reduced },
  );

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
