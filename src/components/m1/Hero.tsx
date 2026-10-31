import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Crosshair } from "./Crosshair";
import { Grill } from "./Grill";
import { SpecReadout, type SpecItem } from "./SpecReadout";

export type HeroProps = {
  name: ReactNode;
  role?: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  specs?: SpecItem[];
  portrait?: ReactNode;
  portraitLabel?: string;
  media?: ReactNode;
  serial?: string;
  coords?: string;
  className?: string;
};

export type HeroPortraitProps = {
  portrait?: ReactNode;
  label?: string;
};

export const HeroPortrait = ({ portrait, label }: HeroPortraitProps) => (
  <div className="m1-hero-port">
    {portrait ?? (
      <Crosshair style={{ width: 20, height: 20, color: "rgba(28,30,33,0.45)" }} />
    )}
    <span className="m1-hero-port-ring" aria-hidden="true" />
    {label && (
      <span className="m1-hero-port-tag m1-micro" style={{ color: "var(--ink)" }}>
        {label}
      </span>
    )}
  </div>
);

export const Hero = ({
  name,
  role,
  lead,
  actions,
  specs,
  portrait,
  portraitLabel,
  media,
  serial,
  coords,
  className,
}: HeroProps) => (
  <section className={cn("m1-hero m1-panel m1-lift", className)}>
    <span className="m1-hero-tab" aria-hidden="true" />
    <div className="m1-panel-body m1-notch m1-notch-lg">
      {serial && (
        <span className="m1-panel-serial m1-micro">{serial}</span>
      )}
      <div className="m1-hero-main">
        <h1 className="m1-h m1-h-xl">{name}</h1>
        {role && (
          <p className="m1-hud" style={{ margin: 0, color: "var(--signal-ink)" }}>
            {role}
          </p>
        )}
        {lead && <p className="m1-hero-lead">{lead}</p>}
        {actions && <div className="m1-hero-actions">{actions}</div>}
        {specs && <SpecReadout items={specs} />}
      </div>
      <div className="m1-hero-side">
        {media ?? (
          <>
            <HeroPortrait portrait={portrait} label={portraitLabel} />
            <Grill count={4} slotWidth={28} gap="8px" />
          </>
        )}
        {coords && <span className="m1-micro">{coords}</span>}
      </div>
      <Crosshair className="m1-panel-cross" tone="signal" />
    </div>
  </section>
);
