import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-·/";
const STEP_MS = 35;
const STAGGER_MS = 20;

const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

export type SplitFlapProps = {
  text: string;
  // Flaps whenever text changes; with `start` it also waits for the first true (e.g. in view)
  start?: boolean;
  className?: string;
};

// Characters flip through random glyphs before landing, like a train-station board.
// Screen readers get the final text only.
export const SplitFlap = ({ text, start = true, className }: SplitFlapProps) => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [display, setDisplay] = useState(text);
  const shown = useRef<string | null>(null);

  useEffect(() => {
    if (!start || shown.current === text) return;
    const from = shown.current;
    shown.current = text;
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    const length = Math.max(text.length, from?.length ?? 0);
    const flips = Array.from({ length }, () => 4 + Math.floor(Math.random() * 5));
    const begin = performance.now();
    let frame = 0;
    let lastStep = -1;

    const tick = (now: number) => {
      const elapsed = now - begin;
      const step = Math.floor(elapsed / STEP_MS);
      if (step !== lastStep) {
        lastStep = step;
        let done = true;
        let next = "";
        for (let index = 0; index < length; index++) {
          const target = text[index] ?? "";
          const settled = elapsed >= index * STAGGER_MS + flips[index] * STEP_MS;
          const unchanged = from !== null && from[index] === target;
          if (settled || unchanged || target === " ") next += target;
          else {
            next += randomChar();
            done = false;
          }
        }
        setDisplay(next);
        if (done) return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setDisplay(text);
    };
  }, [text, start, reducedMotion]);

  return (
    <span className={cn("m1-flap", className)}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
};
