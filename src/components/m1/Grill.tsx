import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type GrillProps = {
  count?: number;
  slotWidth?: number;
  gap?: string;
  tone?: "signal" | "on-signal";
  className?: string;
};

export const Grill = ({ count = 6, slotWidth, gap, tone, className }: GrillProps) => (
  <div
    className={cn("m1-grill", tone && `is-${tone}`, className)}
    style={gap ? ({ "--g": gap } as CSSProperties) : undefined}
    aria-hidden="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <span
        key={index}
        className="m1-grill-slot"
        style={slotWidth ? { width: slotWidth } : undefined}
      />
    ))}
  </div>
);
