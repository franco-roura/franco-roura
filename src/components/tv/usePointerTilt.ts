import { useEffect, useRef } from "react";

export type PointerTilt = { x: number; y: number };

// Tracks the cursor across the whole page as -1..1 on each axis, plus when it last moved.
export const usePointerTilt = (enabled: boolean) => {
  const pointer = useRef<PointerTilt>({ x: 0, y: 0 });
  const lastMove = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  return { pointer, lastMove };
};
