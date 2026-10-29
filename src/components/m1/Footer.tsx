import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { TickRuler } from "./TickRuler";

export type FooterLink = {
  label: string;
  href: string;
  target?: string;
};

export type FooterProps = {
  links?: FooterLink[];
  left?: ReactNode;
  right?: ReactNode;
  rulerLabels?: string[];
  className?: string;
};

export const Footer = ({ links, left, right, rulerLabels, className }: FooterProps) => (
  <footer className={cn("m1-footer", className)}>
    <TickRuler labels={rulerLabels} />
    <div className="m1-footer-row">
      <span className="m1-micro is-read">{left}</span>
      <div className="m1-footer-links">
        {links?.map((link) => (
          <Button key={link.label} variant="ghost" href={link.href} target={link.target}>
            {link.label}
          </Button>
        ))}
      </div>
      <span className="m1-micro is-read">{right}</span>
    </div>
  </footer>
);
