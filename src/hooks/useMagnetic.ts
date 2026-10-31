import { useEffect, useRef } from "react";

const REACH_PX = 40; // how far outside the button the pull starts
const PULL = 0.18;
const MAX_PX = 6;

// Leans a button toward a nearby cursor through --mx/--my, like a switch you're about to press.
export const useMagnetic = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const apply = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const outsideX = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
      const outsideY = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
      const near = Math.hypot(outsideX, outsideY) <= REACH_PX;
      const clamp = (value: number) => Math.max(-MAX_PX, Math.min(MAX_PX, value * PULL));
      const dx = near ? clamp(pointerX - (rect.left + rect.width / 2)) : 0;
      const dy = near ? clamp(pointerY - (rect.top + rect.height / 2)) : 0;
      element.style.setProperty("--mx", `${dx.toFixed(1)}px`);
      element.style.setProperty("--my", `${dy.toFixed(1)}px`);
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      element.style.removeProperty("--mx");
      element.style.removeProperty("--my");
    };
  }, [enabled]);

  return ref;
};
