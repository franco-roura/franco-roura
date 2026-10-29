import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button, ContactBanner } from "./m1";

const LINKEDIN = "https://www.linkedin.com/in/franco-roura/";
// Short enough to stay inside every browser's "recent click" window for opening a tab
const TRANSMIT_MS = 550;

export const ContactSection = () => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [transmitting, setTransmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // A plain click presses the button and lights the grill before LinkedIn opens.
  // Modified and middle clicks fall through to the real link.
  const transmit = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reducedMotion || transmitting) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setTransmitting(true);
    timer.current = setTimeout(() => {
      window.open(LINKEDIN, "_blank", "noopener,noreferrer");
      setTransmitting(false);
    }, TRANSMIT_MS);
  };

  return (
    <ContactBanner
      id="contact"
      code="S-05 / CONTACT"
      title="Let's build something"
      text="Got a system that needs to scale, or a pipeline that needs taming? LinkedIn is the best place to reach me."
      className={cn(transmitting && "is-transmitting")}
      action={
        <Button
          variant="secondary"
          href={LINKEDIN}
          target="_blank"
          arrow
          magnetic
          pressed={transmitting}
          onClick={transmit}
        >
          Connect on LinkedIn
        </Button>
      }
    />
  );
};
