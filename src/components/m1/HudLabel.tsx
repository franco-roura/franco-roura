import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HudLabelProps = {
  code?: string;
  end?: ReactNode;
  rule?: boolean;
  className?: string;
  children: ReactNode;
};

export const HudLabel = ({ code, end, rule = true, className, children }: HudLabelProps) => (
  <div className={cn("m1-hudlabel m1-hud", className)}>
    {code && <span className="m1-hudlabel-code">{code}</span>}
    <span>{children}</span>
    {rule && <span className="m1-hudlabel-rule" aria-hidden="true" />}
    {end && <span className="m1-micro">{end}</span>}
  </div>
);
