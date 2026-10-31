import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { SplitFlap } from "./SplitFlap";

export type HudLabelProps = {
  code?: string;
  end?: ReactNode;
  rule?: boolean;
  // Split-flaps the code chip in the first time the label scrolls into view
  flap?: boolean;
  className?: string;
  children: ReactNode;
};

export const HudLabel = ({ code, end, rule = true, flap, className, children }: HudLabelProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true, threshold: 0.6 });

  return (
    <div ref={ref} className={cn("m1-hudlabel m1-hud", className)}>
      {code && <span className="m1-hudlabel-code">{flap ? <SplitFlap text={code} start={inView} /> : code}</span>}
      <span>{children}</span>
      {rule && <span className="m1-hudlabel-rule" aria-hidden="true" />}
      {end && <span className="m1-micro">{end}</span>}
    </div>
  );
};
