import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";
import { downloadCsv } from "./downloadCsv";

type Props = {
  className?: string;
  countriesLabel: string;
  contentType: "all" | "tactic" | "drill" | "match" | "live";
  onChangeContentType: (v: Props["contentType"]) => void;
};

const mockTop = Array.from({ length: 5 }).map((_, i) => ({
  rank: i + 1,
  title: `Top Content #${i + 1}`,
  watched: 1200 - i * 120,
  downloaded: 600 - i * 60,
  favorited: 320 - i * 30,
}));

const mockBottom = Array.from({ length: 5 }).map((_, i) => ({
  rank: i + 1,
  title: `Bottom Content #${i + 1}`,
  watched: 40 + i * 10,
  downloaded: 18 + i * 4,
  favorited: 6 + i * 2,
}));

const ContentPopularityCard: React.FC<Props> = ({
  className,
  countriesLabel,
  contentType,
  onChangeContentType,
}) => {
  const handleDownload = () => {
    downloadCsv("content-popularity-top.csv", mockTop);
  };

  return (
    <SectionCard
      title="Content Popularity"
      className={cn("min-w-0", className)}
      contentClassName="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          {countriesLabel} · {contentType.toUpperCase()}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {(["all", "tactic", "drill", "match", "live"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChangeContentType(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
                contentType === t
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                  : "border-white/10 text-slate-300 hover:bg-white/5"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      {/* Top list */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-slate-200">
          Top watched/downloaded/favorited (preview)
        </h4>
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full text-left text-[11px]">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Watched</th>
                <th className="px-3 py-2">Downloaded</th>
                <th className="px-3 py-2">Favorited</th>
              </tr>
            </thead>
            <tbody>
              {mockTop.map((r) => (
                <tr key={r.title} className="border-t border-white/5">
                  <td className="px-3 py-2 text-slate-200">{r.rank}</td>
                  <td className="px-3 py-2 text-slate-100">{r.title}</td>
                  <td className="px-3 py-2 text-slate-200">{r.watched}</td>
                  <td className="px-3 py-2 text-slate-200">{r.downloaded}</td>
                  <td className="px-3 py-2 text-slate-200">{r.favorited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-slate-500">
          * Client asked for Top/Bottom 100 — backend should paginate or export full list.
        </p>
      </div>

      {/* Bottom list */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-slate-200">
          Bottom watched/downloaded/favorited (preview)
        </h4>
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full text-left text-[11px]">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Watched</th>
                <th className="px-3 py-2">Downloaded</th>
                <th className="px-3 py-2">Favorited</th>
              </tr>
            </thead>
            <tbody>
              {mockBottom.map((r) => (
                <tr key={r.title} className="border-t border-white/5">
                  <td className="px-3 py-2 text-slate-200">{r.rank}</td>
                  <td className="px-3 py-2 text-slate-100">{r.title}</td>
                  <td className="px-3 py-2 text-slate-200">{r.watched}</td>
                  <td className="px-3 py-2 text-slate-200">{r.downloaded}</td>
                  <td className="px-3 py-2 text-slate-200">{r.favorited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* % content watched metric */}
      <div className="rounded-xl border border-white/5 bg-white/5 p-3">
        <div className="text-xs font-semibold text-slate-200">
          % of available content watched by users active this week
        </div>
        <div className="mt-1 text-lg font-bold text-emerald-200">
          62% <span className="text-xs text-slate-400">(mock)</span>
        </div>
      </div>
    </SectionCard>
  );
};

export default ContentPopularityCard;
