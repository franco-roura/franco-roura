import type { FocusEventHandler, MouseEventHandler, PointerEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagProps = {
  tone?: "signal" | "tint" | "outline";
  // Renders a focusable <button> (keycaps, skill trace) instead of a plain label
  interactive?: boolean;
  pressed?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onPointerEnter?: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: PointerEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  "aria-describedby"?: string;
  className?: string;
  children: ReactNode;
};

export const Tag = ({
  tone,
  interactive,
  pressed,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  "aria-describedby": describedBy,
  className,
  children,
}: TagProps) => {
  const classes = cn("m1-tag", tone && `m1-tag-${tone}`, className);
  if (!interactive) return <span className={classes}>{children}</span>;

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={pressed}
      aria-describedby={describedBy}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
};
