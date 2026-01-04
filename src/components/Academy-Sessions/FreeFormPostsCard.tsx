import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Badge from "../../shared/data-display/Badge";
import type { FreeFormPost } from "./types/types";

type Props = {
  posts: FreeFormPost[];
  activeCountry: string;
  activeLanguage: string;
};

const FreeFormPostsCard: React.FC<Props> = ({
  posts,
  activeCountry,
  activeLanguage,
}) => {
  const visible = posts.filter((p) => {
    if (activeCountry !== "All" && p.country !== activeCountry) return false;
    if (activeLanguage !== "All" && p.language !== activeLanguage) return false;
    return true;
  });

  return (
    <SectionCard
      title="Free Form Posts"
      subtitle="Country + language selectable admin announcements / notes."
      className="bg-[#04130d]"
      contentClassName="space-y-3"
    >
      {visible.length === 0 && (
        <div className="text-xs text-slate-400">
          No posts match the current filters.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-white/5 bg-white/3 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{p.country}</Badge>
              <Badge variant="neutral">{p.language}</Badge>
              <span className="text-[10px] text-slate-500">{p.updatedAt}</span>
            </div>

            <div className="mt-2 text-sm font-semibold text-white break-words">
              {p.title}
            </div>
            <div className="mt-1 text-xs text-slate-300 break-words">
              {p.body}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default FreeFormPostsCard;
