import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type CrosshairProps = {
  tone?: "signal";
  className?: string;
  style?: CSSProperties;
};

export const Crosshair = ({ tone, className, style }: CrosshairProps) => (
  <svg
    className={cn("m1-cross", tone && `is-${tone}`, className)}
    viewBox="0 0 12 12"
    style={style}
    aria-hidden="true"
  >
    <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth={1.25} fill="none" />
  </svg>
);
