import { lazy, Suspense, useEffect, useState } from "react";
import { LocalTime } from "./LocalTime";
import { Button, Hero as HeroShell, HeroPortrait } from "./m1";

const HeroTV = lazy(() => import("./tv/HeroTV"));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

// The flat portrait renders first; the 3D TV loads once the browser is idle, so it
// never competes with the text and photo for the first paint.
const HeroMedia = () => {
  const [mountTv, setMountTv] = useState(false);

  useEffect(() => {
    // Skip the 3D chunk for visitors who asked to save data
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData || !supportsWebGL()) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setMountTv(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setMountTv(true), 600);
    return () => clearTimeout(id);
  }, []);

  const portrait = <HeroPortrait portrait={<img src="/avatar.webp" alt="Franco Roura" />} label="FIG.01" />;
  const placeholder = (
    <div className="m1-hero-media">
      <div className="m1-hero-tv">{portrait}</div>
    </div>
  );

  if (!mountTv) return placeholder;

  return (
    <Suspense fallback={placeholder}>
      <HeroTV fallback={portrait} />
    </Suspense>
  );
};

export const Hero = () => {
  return (
    <HeroShell
      name="Franco Roura"
      role="Software architect"
      serial="FR-01 · FRANCO.ROURA.DEV"
      lead="Obsessed with technology, driven by code. Software architect building scalable systems with surgical precision, caffeine, and unreasonable enthusiasm."
      actions={
        <>
          <Button href="#contact" arrow magnetic>
            Get in touch
          </Button>
          <Button variant="secondary" href="https://github.com/franco-roura" target="_blank">
            GitHub
          </Button>
          <Button variant="ghost" href="https://www.linkedin.com/in/franco-roura/" target="_blank">
            LinkedIn
          </Button>
          <Button
            variant="ghost"
            href="https://www.codingame.com/profile/941a6af1e3c8e43cb032f6d4a0650eb93245634"
            target="_blank"
          >
            CodinGame
          </Button>
        </>
      }
      specs={[
        { label: "Focus", value: "Systems & cloud" },
        { label: "Since", value: "2016" },
        { label: "Now", value: "White Prompt" },
        { label: "Local", value: <LocalTime /> },
      ]}
      media={<HeroMedia />}
    />
  );
};
