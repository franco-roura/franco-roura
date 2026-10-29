import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Grill } from "./Grill";

export type ContactBannerProps = {
  title: ReactNode;
  id?: string;
  text?: ReactNode;
  code?: string;
  action?: ReactNode;
  className?: string;
};

export const ContactBanner = ({ title, id, text, code, action, className }: ContactBannerProps) => (
  <section id={id} className={cn("m1-contact m1-panel m1-lift", className)}>
    <div className="m1-panel-body m1-notch m1-notch-lg">
      <div>
        {code && (
          <div className="m1-micro" style={{ marginBottom: 16 }}>
            {code}
          </div>
        )}
        <h2 className="m1-h m1-h-md">{title}</h2>
        {text && <p className="m1-contact-sub">{text}</p>}
      </div>
      <div className="m1-contact-side">
        <Grill count={6} tone="on-signal" slotWidth={30} gap="8px" />
        {action}
      </div>
    </div>
  </section>
);
