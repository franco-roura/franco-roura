import { AboutSection } from "./components/AboutSection";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { WorkingStyleSection } from "./components/WorkingStyleSection";
import { ProjectsSection } from "./components/ProjectsSection";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-50" />
        <div className="absolute inset-0 bg-[url('/background_dot.svg')] opacity-30" />

        <div className="relative z-10">
          <Hero />
          <AboutSection />
          <ServicesSection />
          <WorkingStyleSection />
          <ProjectsSection />
        </div>
      </div>
    </div>
  );
}

export default App;
