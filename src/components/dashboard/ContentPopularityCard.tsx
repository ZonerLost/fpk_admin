import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";
import { downloadCsv } from "./downloadCsv";
import { formatContentId, prefixFromContentType } from "../../shared/utils/contentId";

export type ContentListLimit = 20 | 50 | 100 | "all";

type Props = {
  className?: string;
  countriesLabel: string;

  contentType: "all" | "tactic" | "drill" | "match" | "live";
  onChangeContentType: (v: Props["contentType"]) => void;

  // ✅ NEW: list length filter
  listLimit: ContentListLimit;
  onChangeListLimit: (v: ContentListLimit) => void;

  // optional locale tag for IDs (ENG / GER etc)
  locale?: string;
};

type PopularityRow = {
  rank: number;
  contentId: string;
  title: string;
  watched: number;
  downloaded: number;
  favorited: number;
};

const limitOptions: ContentListLimit[] = [20, 50, 100, "all"];

function limitLabel(v: ContentListLimit) {
  return v === "all" ? "All" : String(v);
}

function makeTopRows(params: {
  count: number;
  contentType: Props["contentType"];
  locale: string;
}): PopularityRow[] {
  const { count, contentType, locale } = params;

  return Array.from({ length: count }).map((_, i) => {
    const rank = i + 1;
    const prefix =
      contentType === "all" ? (rank % 3 === 0 ? "AC" : rank % 2 === 0 ? "LR" : "TR") : prefixFromContentType(contentType);

    return {
      rank,
      contentId: formatContentId(prefix, rank, locale),
      title: `Top Content #${rank}`,
      watched: Math.max(0, 5000 - i * 37),
      downloaded: Math.max(0, 2400 - i * 18),
      favorited: Math.max(0, 1100 - i * 9),
    };
  });
}

function makeBottomRows(params: {
  count: number;
  contentType: Props["contentType"];
  locale: string;
}): PopularityRow[] {
  const { count, contentType, locale } = params;

  return Array.from({ length: count }).map((_, i) => {
    const rank = i + 1;
    const prefix =
      contentType === "all" ? (rank % 3 === 0 ? "AC" : rank % 2 === 0 ? "LR" : "TR") : prefixFromContentType(contentType);

    return {
      rank,
      contentId: formatContentId(prefix, 10_000 + rank, locale), // separate range so IDs won't clash with top
      title: `Bottom Content #${rank}`,
      watched: 20 + i * 2,
      downloaded: 8 + i,
      favorited: 2 + Math.floor(i / 2),
    };
  });
}

const ContentPopularityCard: React.FC<Props> = ({
  className,
  countriesLabel,
  contentType,
  onChangeContentType,
  listLimit,
  onChangeListLimit,
  locale = "ENG",
}) => {
  // Base dataset size (what "All" means in UI)
  const baseCount = contentType === "all" ? 200 : 120;
  const finalCount = listLimit === "all" ? baseCount : Math.min(listLimit, baseCount);

  const { topRows, bottomRows } = React.useMemo(() => {
    return {
      topRows: makeTopRows({ count: finalCount, contentType, locale }),
      bottomRows: makeBottomRows({ count: finalCount, contentType, locale }),
    };
  }, [finalCount, contentType, locale]);

  const handleDownload = () => {
    // export both lists in one file (segment column)
    const combined = [
      ...topRows.map((r) => ({ segment: "top", ...r })),
      ...bottomRows.map((r) => ({ segment: "bottom", ...r })),
    ];
    downloadCsv("content-popularity.csv", combined);
  };

  return (
    <SectionCard
      title="Content Popularity"
      className={cn("min-w-0", className)}
      contentClassName="space-y-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[11px] text-slate-400">
          {countriesLabel} · {contentType.toUpperCase()} · List:{" "}
          <span className="text-slate-300">{limitLabel(listLimit)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Content type */}
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

          {/* ✅ List limit */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="ml-1 text-[11px] font-semibold text-slate-300">
              Show:
            </span>
            {limitOptions.map((opt) => (
              <button
                key={String(opt)}
                type="button"
                onClick={() => onChangeListLimit(opt)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium",
                  listLimit === opt
                    ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                )}
              >
                {limitLabel(opt)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            Download data
          </button>
        </div>
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
                <th className="px-3 py-2">Content ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Watched</th>
                <th className="px-3 py-2">Downloaded</th>
                <th className="px-3 py-2">Favorited</th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((r) => (
                <tr key={r.contentId} className="border-t border-white/5">
                  <td className="px-3 py-2 text-slate-200">{r.rank}</td>
                  <td className="px-3 py-2 font-mono text-slate-200">
                    {r.contentId}
                  </td>
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
                <th className="px-3 py-2">Content ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Watched</th>
                <th className="px-3 py-2">Downloaded</th>
                <th className="px-3 py-2">Favorited</th>
              </tr>
            </thead>
            <tbody>
              {bottomRows.map((r) => (
                <tr key={r.contentId} className="border-t border-white/5">
                  <td className="px-3 py-2 text-slate-200">{r.rank}</td>
                  <td className="px-3 py-2 font-mono text-slate-200">
                    {r.contentId}
                  </td>
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
