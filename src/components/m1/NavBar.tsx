import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

export type NavBarProps = {
  name: ReactNode;
  links: NavItem[];
  serial?: string;
  cta?: ReactNode;
  homeHref?: string;
  label?: string;
  className?: string;
};

export const NavBar = ({
  name,
  links,
  serial,
  cta,
  homeHref = "#",
  label = "Main",
  className,
}: NavBarProps) => (
  <nav className={cn("m1-nav", className)} aria-label={label}>
    <a className="m1-nav-id" href={homeHref}>
      <span className="m1-h m1-h-sm">{name}</span>
      {serial && <span className="m1-micro">{serial}</span>}
    </a>
    <div className="m1-nav-links">
      {links.map((link, index) => (
        <a
          key={link.label}
          className="m1-nav-link"
          href={link.href ?? "#"}
          aria-current={link.active ? "page" : undefined}
        >
          <span className="m1-micro">{String(index + 1).padStart(2, "0")}</span>
          {link.label}
        </a>
      ))}
    </div>
    {cta}
  </nav>
);
