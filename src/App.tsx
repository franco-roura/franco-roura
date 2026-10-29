import { AboutSection } from "./components/AboutSection";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { WorkingStyleSection } from "./components/WorkingStyleSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import { Button, Footer, NavBar } from "./components/m1";

function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-[1120px] px-6 md:px-12">
        <div className="sticky top-4 z-50 mt-4">
          <NavBar
            name="Franco Roura"
            serial="UNIT-01 · REV.2026"
            links={[
              { label: "About", href: "#about" },
              { label: "What I do", href: "#services" },
              { label: "How I work", href: "#approach" },
              { label: "Experience", href: "#experience" },
            ]}
            cta={
              <Button href="#contact" className="h-11 shrink-0">
                Contact
              </Button>
            }
          />
        </div>

        <main className="flex flex-col gap-24 pt-12 pb-24">
          <Hero />
          <AboutSection />
          <ServicesSection />
          <WorkingStyleSection />
          <ExperienceSection />
          <ContactSection />
        </main>

        <Footer
          rulerLabels={["0", "25", "50", "75", "100"]}
          left="© 2026 Franco Roura"
          links={[
            { label: "GitHub", href: "https://github.com/franco-roura", target: "_blank" },
            {
              label: "CodinGame",
              href: "https://www.codingame.com/profile/941a6af1e3c8e43cb032f6d4a0650eb93245634",
              target: "_blank",
            },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/franco-roura/", target: "_blank" },
          ]}
          right="franco.roura.dev · REV.2026"
        />
      </div>
    </div>
  );
}

export default App;
