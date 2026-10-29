import { Button, Hero as HeroShell } from "./m1";

export const Hero = () => {
  return (
    <HeroShell
      name="Franco Roura"
      role="Software architect"
      serial="FR-01 · FRANCO.ROURA.DEV"
      lead="Obsessed with technology, driven by code. Software architect building scalable systems with surgical precision, caffeine, and unreasonable enthusiasm."
      actions={
        <>
          <Button href="#contact" arrow>
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
      ]}
      portrait={<img src="/avatar.webp" alt="Franco Roura" />}
      portraitLabel="FIG.01"
    />
  );
};
