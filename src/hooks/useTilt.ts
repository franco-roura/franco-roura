import { useEffect, useRef } from "react";

const PROPS = ["--tilt-x", "--tilt-y", "--lift-x", "--lift-y"];

// Tilts a molded part up to 4° toward the cursor and shifts its shadow the other way.
export const useTilt = <T extends HTMLElement>(enabled: boolean) => {
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
      const x = (pointerX - rect.left) / rect.width - 0.5;
      const y = (pointerY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
      element.style.setProperty("--lift-x", `${(-x * 12).toFixed(1)}px`);
      element.style.setProperty("--lift-y", `${(-y * 12).toFixed(1)}px`);
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      PROPS.forEach((prop) => element.style.removeProperty(prop));
    };

    element.classList.add("m1-tilt");
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      onLeave();
      element.classList.remove("m1-tilt");
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return ref;
};
