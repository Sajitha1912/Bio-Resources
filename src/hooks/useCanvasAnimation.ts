import { useEffect, useRef } from "react";

export type CanvasFrame = (
  ctx: CanvasRenderingContext2D,
  size: { width: number; height: number },
  dt: number,
  time: number,
) => void;

/**
 * A DPR-capped canvas that only paints while it is on-screen and the tab is
 * visible. The frame callback is invoked at most once per animation frame, so
 * a hidden tab or an off-screen element costs nothing.
 */
export function useCanvasAnimation(
  frame: CanvasFrame,
  { maxDpr = 1.5, enabled = true }: { maxDpr?: number; enabled?: boolean } = {},
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(frame);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let inView = false;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Off-screen pause. The generous margin means work resumes slightly before
    // the layer scrolls back into view.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
      },
      { rootMargin: "160px" },
    );
    io.observe(canvas);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(now - last, 48);
      last = now;
      if (!inView || document.hidden) return;
      frameRef.current(ctx, { width, height }, dt, now);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [maxDpr, enabled]);

  return canvasRef;
}
