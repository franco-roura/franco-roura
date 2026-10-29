import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  onClick?: MouseEventHandler;
  arrow?: boolean;
  disabled?: boolean;
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
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  className,
  children,
}: ButtonProps) => {
  const classes = cn("m1-btn", `m1-btn-${variant}`, className);
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
