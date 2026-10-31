import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  arrow?: boolean;
  disabled?: boolean;
  // Leans toward a nearby cursor (fine pointers, motion allowed)
  magnetic?: boolean;
  // Holds the pressed-in look, e.g. while the contact block transmits
  pressed?: boolean;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  className?: string;
  children: ReactNode;
};

export const Button = ({
  variant = "primary",
  href,
  target,
  rel,
  download,
  onClick,
  arrow,
  disabled,
  magnetic,
  pressed,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  className,
  children,
}: ButtonProps) => {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const magnetRef = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(Boolean(magnetic) && finePointer && !reducedMotion);

  const classes = cn("m1-btn", `m1-btn-${variant}`, magnetic && "is-magnetic", pressed && "is-pressed", className);
  const content = (
    <>
      {children}
      {arrow && (
        <span className="m1-btn-arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        ref={magnetRef}
        className={classes}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        download={download}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={magnetRef}
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {content}
    </button>
  );
};
