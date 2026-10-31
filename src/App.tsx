import { AboutSection } from "./components/AboutSection";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { WorkingStyleSection } from "./components/WorkingStyleSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import { SkillTraceProvider } from "./components/SkillTrace";
import { Button, Footer, NavBar } from "./components/m1";
import { useActiveSection } from "./hooks/useActiveSection";

const sections = [
  { id: "about", code: "S-01", label: "About" },
  { id: "services", code: "S-02", label: "What I do" },
  { id: "approach", code: "S-03", label: "How I work" },
  { id: "experience", code: "S-04", label: "Experience" },
  { id: "contact", code: "S-05", label: "Contact" },
];

const sectionIds = sections.map((section) => section.id);
const navSections = sections.slice(0, 4);

function App() {
  const { activeId, progress, marks } = useActiveSection(sectionIds);
  const active = sections.find((section) => section.id === activeId);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-[1120px] px-6 md:px-12">
        <div className="sticky top-4 z-50 mt-4">
          <NavBar
            name="Franco Roura"
            serial={active ? `${active.code} · ${active.label}` : "UNIT-01 · REV.2026"}
            links={navSections.map((section) => ({
              label: section.label,
              href: `#${section.id}`,
              active: section.id === activeId,
            }))}
            progress={progress}
            marks={marks}
            cta={
              <Button href="#contact" className="h-11 shrink-0" magnetic>
                Contact
              </Button>
            }
          />
        </div>

        <main className="flex flex-col gap-24 pt-12 pb-24">
          <Hero />
          <SkillTraceProvider>
            <AboutSection />
            <ServicesSection />
            <WorkingStyleSection />
            <ExperienceSection />
          </SkillTraceProvider>
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
          right={`BUILD ${__BUILD_COMMIT__} · ${__BUILD_DATE__}`}
        />
      </div>
    </div>
  );
}

export default App;
