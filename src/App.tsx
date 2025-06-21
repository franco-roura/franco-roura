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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

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
