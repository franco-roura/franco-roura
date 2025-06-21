import { Zap, Shield, TestTube } from "lucide-react";

export const WorkingStyleSection = () => {
  const principles = [
    {
      icon: Zap,
      text: "I value simplicity, automation, and fun (in code and in life).",
    },
    {
      icon: Shield,
      text: "I move fast, but never break things I can model properly first.",
    },
    {
      icon: TestTube,
      text: "I write tests because future-me deserves kindness.",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="text-2xl">🧪</span>
            How I Work
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto" />
        </div>

        <div className="space-y-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-400/30 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="flex-shrink-0 mt-1">
                  <Icon className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {principle.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
