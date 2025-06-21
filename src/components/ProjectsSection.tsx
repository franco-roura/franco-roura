import { useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";

export const ProjectsSection = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const companies = [
    {
      name: "Globant",
      role: "Test Automation Engineer",
      year: "2016-2017",
      description:
        "My first year in college, and also the year I landed my first job in the industry! I was able to work in the Disney team and learnt a lot about best practices for software development.",
      tech: ["Python", "Selenium", "BDD"],
    },
    {
      name: "3XM",
      role: "Full Stack Developer - Cloud Practicioner",
      year: "2018-2019",
      description:
        "AWS started positioning itself as the cloud of choice for the industry, and as the curious guy I was, I was hyped about it. 3XM allowed me to get a bunch of hands-on experience with it.",
      tech: ["C#", "Angular", "Python", "AWS", "Terraform"],
    },
    {
      name: "BairesDev",
      role: "Software Engineer",
      year: "2019-2020",
      description:
        "I was lucky enough to land my first remote job a few months before the pandemic hit, and even luckier to end up in the AdRoll team. I had always been obsessed with performance, and the folks at AdRoll taught me how to handle TONS of distributed data FAST. When you're processing millions of ad impressions in real-time, you quickly learn that performance isn't just nice to have, it's everything.",
      tech: ["React", "Python", "Go", "Terraform", "Typescript", "GraphQL"],
    },
    {
      name: "Capicua",
      role: "Software Architect & Tech Lead",
      year: "2020-2025",
      description:
        "My longest stint so far! I got to wear many hats here - from architecting cloud-native solutions to mentoring devs and even doing some people management. I basically became the go-to person for anything tech-related, from system design to CI/CD pipelines. The best part? I got to make my coworkers' lives easier by improving DX and making them happier at work.",
      tech: ["AWS", "NextJS", "Typescript", "Terraform", "GraphQL"],
    },
    {
      name: "White Prompt",
      role: "Software Architect",
      year: "2025-Present",
      description:
        "Ah, the era of AI agents and LLMs. I'm currently building a BI tool with LLM integrations, I'm mostly on the Telemetry and infrastructure side of things. Fun fact, I used LLMs to build this website.",
      tech: [
        "Terraform",
        "OTEL",
        "Kubernetes",
        "Grafana Stack",
        "GCP",
        "Python",
        "Typescript",
      ],
    },
  ];

  return (
    <section className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="text-2xl">📂</span>
            Career Journey
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto" />
        </div>

        <div className="relative">
          {/* SVG Path */}
          <div className="flex justify-center mb-8">
            <svg
              width="800"
              height="300"
              viewBox="0 0 800 300"
              className="max-w-full"
            >
              {/* Path connecting all nodes */}
              <path
                d="M 80 150 Q 200 50 320 150 T 560 150 Q 640 100 720 150"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                className="opacity-60"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Company nodes */}
              {companies.map((company, index) => {
                const positions = [
                  { x: 80, y: 150 }, // Globant
                  { x: 240, y: 105 }, // 3XM
                  { x: 400, y: 195 }, // BairesDev
                  { x: 560, y: 150 }, // Capicua
                  { x: 720, y: 150 }, // White Prompt
                ];

                return (
                  <g key={index}>
                    {/* Node circle */}
                    <circle
                      cx={positions[index].x}
                      cy={positions[index].y}
                      r={hoveredNode === index ? "16" : "12"}
                      fill={index === 4 ? "#64748b" : "#10b981"}
                      stroke="#1e293b"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-300 hover:fill-emerald-300"
                      onMouseEnter={() => setHoveredNode(index)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />

                    {/* Company label */}
                    <text
                      x={positions[index].x}
                      y={positions[index].y - 30}
                      textAnchor="middle"
                      className="fill-emerald-400 text-sm font-semibold"
                    >
                      {company.name}
                    </text>

                    {/* Year label */}
                    <text
                      x={positions[index].x}
                      y={positions[index].y + 35}
                      textAnchor="middle"
                      className="fill-slate-400 text-xs"
                    >
                      {company.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Company Details Card */}
          {hoveredNode !== null && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-400/30 transition-all duration-300 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-300">
                    {companies[hoveredNode].name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      {companies[hoveredNode].role}
                    </span>
                    <span className="text-sm text-slate-400 ml-2">
                      {companies[hoveredNode].year}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0" />
              </div>

              <p className="text-slate-400 mb-4 leading-relaxed">
                {companies[hoveredNode].description}
              </p>

              <div className="flex flex-wrap gap-2">
                {companies[hoveredNode].tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 text-xs font-medium bg-emerald-400/10 text-emerald-400 rounded-full border border-emerald-400/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Default message when no node is hovered */}
          {hoveredNode === null && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-lg">
                Hover over the nodes above to explore my career journey
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
