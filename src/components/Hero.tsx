import { ArrowDown, Github, Linkedin, Code } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative px-6 overflow-hidden">
      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-20 left-10 text-emerald-400/20"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="currentColor"
        >
          <polygon points="30,5 55,50 5,50" />
        </svg>
        <svg
          className="absolute top-40 right-16 text-teal-400/30"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="20" cy="20" r="18" />
        </svg>
        <svg
          className="absolute bottom-32 left-20 text-emerald-400/25"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="currentColor"
        >
          <rect x="5" y="5" width="40" height="40" rx="8" />
        </svg>
        <svg
          className="absolute top-60 right-32 text-teal-400/20"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="currentColor"
        >
          <polygon points="15,2 28,26 2,26" />
        </svg>
        <svg
          className="absolute bottom-20 right-10 text-emerald-400/30"
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="17.5,5 30,25 5,25" />
        </svg>
      </div>

      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Profile Picture */}
        <div className="mb-8 flex justify-center">
          <Avatar className="w-32 h-32 border-4 border-emerald-400/20">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-slate-800 text-emerald-400 text-2xl font-bold">
              ME
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mb-8">
          <span className="text-emerald-400 text-lg font-mono">
            I'm Franco Roura
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-orbitron">
          <span className="text-emerald-400">Obsessed</span> with technology,
          <br />
          <span className="text-slate-300">driven by</span>{" "}
          <span className="text-emerald-400">clean architecture</span>
        </h1>

        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-8 rounded-full" />

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Software architect crafting scalable solutions with precision and
          passion
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-16">
          <a
            href="https://github.com/franco-roura"
            target="_blank"
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-emerald-400/50 hover:bg-slate-800 transition-all duration-300 group"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </a>
          <a
            href="https://www.codingame.com/profile/941a6af1e3c8e43cb032f6d4a0650eb93245634"
            target="_blank"
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-emerald-400/50 hover:bg-slate-800 transition-all duration-300 group"
            aria-label="CodinGame"
          >
            <Code className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </a>
          <a
            href="https://www.linkedin.com/in/franco-roura/"
            target="_blank"
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-emerald-400/50 hover:bg-slate-800 transition-all duration-300 group"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </a>
        </div>

        <div className="animate-bounce">
          <ArrowDown className="w-6 h-6 text-emerald-400 mx-auto" />
        </div>
      </div>
    </section>
  );
};
