import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type ServiceDiagramKind = "architecture" | "cloud" | "code";

// Steps through frames while active, holding on the last one before looping.
// Inactive or with reduced motion it rests on the final frame.
const useLoop = (frames: number, active: boolean, stepMs: number, holdMs: number) => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [frame, setFrame] = useState(frames - 1);

  useEffect(() => {
    if (!active || reducedMotion) {
      setFrame(frames - 1);
      return;
    }
    let current = 0;
    setFrame(0);
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      current = current + 1 >= frames ? 0 : current + 1;
      setFrame(current);
      timer = setTimeout(next, current === frames - 1 ? holdMs : stepMs);
    };
    timer = setTimeout(next, stepMs);
    return () => clearTimeout(timer);
  }, [active, reducedMotion, frames, stepMs, holdMs]);

  return frame;
};

const NODES = [
  { label: "API", x: 4, y: 46, width: 44 },
  { label: "QUEUE", x: 64, y: 14, width: 52 },
  { label: "WORKER", x: 134, y: 14, width: 60 },
  { label: "DB", x: 212, y: 46, width: 44 },
];
const EDGES = ["M48 56 H56 V24 H64", "M116 24 H134", "M194 24 H203 V56 H212", "M26 66 V74 H234 V66"];

// Requests flowing through a small system: dots travel the edges while active
const Architecture = ({ active }: { active: boolean }) => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (active && !reducedMotion) {
      // Skip past the staggered starts so no dot waits at the origin
      svg.setCurrentTime(3);
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
    }
  }, [active, reducedMotion]);

  return (
    <svg ref={ref} viewBox="0 0 260 80" className="m1-diagram-svg" aria-hidden="true">
      {EDGES.map((path) => (
        <path key={path} d={path} className="m1-diagram-edge" />
      ))}
      {NODES.map((node) => (
        <g key={node.label}>
          <rect x={node.x} y={node.y} width={node.width} height={20} rx={6} className="m1-diagram-node" />
          <text x={node.x + node.width / 2} y={node.y + 13.5} textAnchor="middle" className="m1-diagram-label">
            {node.label}
          </text>
        </g>
      ))}
      {EDGES.map((path, index) => (
        <circle key={path} r={2.6} className="m1-diagram-dot">
          <animateMotion path={path} dur="1.4s" begin={`${index * 0.35}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

const PLAN = [
  { text: "terraform plan", tone: "is-cmd" },
  { text: "+ aws_lambda_function.api", tone: "is-add" },
  { text: "+ aws_s3_bucket.assets", tone: "is-add" },
  { text: "~ kubernetes_deployment.web", tone: "is-change" },
  { text: "Plan: 2 add, 1 change, 0 destroy.", tone: "is-note" },
];

const Cloud = ({ active }: { active: boolean }) => {
  const frame = useLoop(PLAN.length, active, 420, 1800);
  return (
    <>
      {PLAN.map((line, index) => (
        <div key={line.text} className={cn("m1-diagram-line", line.tone, index > frame && "is-hidden")}>
          {line.text}
        </div>
      ))}
    </>
  );
};

const Code = ({ active }: { active: boolean }) => {
  // 0: command, 1–2: the type error, 3: fixed
  const frame = useLoop(4, active, 700, 2000);
  return (
    <>
      <div className="m1-diagram-line is-cmd">tsc --noEmit</div>
      <div className={cn("m1-diagram-line", frame === 3 ? "is-ok" : "is-error", frame === 0 && "is-hidden")}>
        {frame === 3 ? "✓ Found 0 errors." : "src/api.ts(12,5): error TS2322"}
      </div>
      <div className={cn("m1-diagram-line is-note", frame !== 3 && "is-hidden")}>Watching for file changes.</div>
    </>
  );
};

type ServiceDiagramProps = {
  kind: ServiceDiagramKind;
  active: boolean;
};

// A small black-glass screen at the foot of each service card that shows the work
export const ServiceDiagram = ({ kind, active }: ServiceDiagramProps) => (
  <div className={cn("m1-diagram", active && "is-active")} aria-hidden="true">
    {kind === "architecture" && <Architecture active={active} />}
    {kind === "cloud" && <Cloud active={active} />}
    {kind === "code" && <Code active={active} />}
  </div>
);
