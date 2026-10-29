import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tag } from "./Tag";

export type ExperienceEntryProps = {
  role: ReactNode;
  org: ReactNode;
  start: string;
  end?: string;
  current?: boolean;
  code?: string;
  location?: string;
  points?: ReactNode[];
  tags?: string[];
  className?: string;
};

export const ExperienceEntry = ({
  role,
  org,
  start,
  end,
  current,
  code,
  location,
  points,
  tags,
  className,
}: ExperienceEntryProps) => (
  <article className={cn("m1-exp", className)}>
    <div className="m1-exp-when">
      <span className="m1-hudnum">
        {start} — {end ?? "Now"}
      </span>
      {code && <span className="m1-micro">{code}</span>}
      {location && (
        <span className="m1-micro" style={{ color: "var(--ink-soft)" }}>
          {location}
        </span>
      )}
    </div>
    <div className="m1-exp-track" aria-hidden="true">
      <span className={cn("m1-exp-node", !current && "is-past")} />
    </div>
    <div className="m1-exp-body">
      <h3 className="m1-h m1-h-sm">{role}</h3>
      <p className="m1-exp-org">{org}</p>
      {points && points.length > 0 && (
        <ul className="m1-exp-list">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
      {tags && (
        <div className="m1-exp-tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </div>
  </article>
);
