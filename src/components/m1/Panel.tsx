import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Crosshair } from "./Crosshair";

export type PanelProps = {
  serial?: string;
  notch?: "sm" | "md" | "lg" | false;
  recess?: boolean;
  cross?: boolean;
  style?: CSSProperties;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export const Panel = ({
  serial,
  notch = "md",
  recess,
  cross = true,
  style,
  className,
  bodyClassName,
  children,
}: PanelProps) => (
  <div className={cn("m1-panel m1-lift", serial && "has-serial", className)} style={style}>
    <div
      className={cn(
        "m1-panel-body",
        notch && "m1-notch",
        notch && notch !== "md" && `m1-notch-${notch}`,
        recess && "is-recess",
        bodyClassName
      )}
    >
      {serial && <span className="m1-panel-serial m1-micro">{serial}</span>}
      {children}
      {cross && <Crosshair className="m1-panel-cross" />}
    </div>
  </div>
);
