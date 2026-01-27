import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";
import { downloadCsv } from "./downloadCsv";

export type ContentListLimit = 20 | 50 | 100 | "all";
export type PopularityMode = "top" | "bottom";
export type ContentSource = "all" | "trainLearn" | "academy";
export type ContentCategory = "all" | "mindset" | "tactic" | "technique" | "fitness";

type Props = {
  className?: string;
  countriesLabel: string;

  mode: PopularityMode;
  onChangeMode: (v: PopularityMode) => void;

  source: ContentSource;
  onChangeSource: (v: ContentSource) => void;

  category: ContentCategory;
  onChangeCategory: (v: ContentCategory) => void;

  weeks: number;
  onChangeWeeks: (v: number) => void;

  search: string;
  onChangeSearch: (v: string) => void;

  listLimit: ContentListLimit;
  onChangeListLimit: (v: ContentListLimit) => void;
};

type PopularityRow = {
  rank: number;
  contentId: string;
  title: string;
  source: ContentSource;
  category: ContentCategory;
  watched: number;
  downloaded: number;
  favorited: number;
};

const limitOptions: ContentListLimit[] = [20, 50, 100, "all"];
const sourceOptions: { v: ContentSource; label: string }[] = [
  { v: "all", label: "All" },
  { v: "trainLearn", label: "Train Learn" },
  { v: "academy", label: "Academy" },
];
const categoryOptions: { v: ContentCategory; label: string }[] = [
  { v: "all", label: "All" },
  { v: "mindset", label: "Mindset" },
  { v: "tactic", label: "Tactic" },
  { v: "technique", label: "Technique" },
  { v: "fitness", label: "Fitness" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function limitLabel(v: ContentListLimit) {
  return v === "all" ? "All" : String(v);
}

function makeDataset(total: number): PopularityRow[] {
  const sources: ContentSource[] = ["trainLearn", "academy"];
  const cats: ContentCategory[] = ["mindset", "tactic", "technique", "fitness"];

  return Array.from({ length: total }).map((_, i) => {
    const idx = i + 1;
    const source = sources[i % sources.length];
    const category = cats[i % cats.length];

    // big numbers for top-ish
    const watched = 5000 - i * 21;
    const downloaded = 2400 - i * 10;
    const favorited = 1100 - i * 5;

    return {
      rank: idx,
      contentId: `${source === "trainLearn" ? "TL" : "AC"}-${String(idx).padStart(4, "0")}`,
      title: `${category.toUpperCase()} Content #${idx}`,
      source,
      category,
      watched: Math.max(0, watched),
      downloaded: Math.max(0, downloaded),
      favorited: Math.max(0, favorited),
    };
  });
}

const ContentPopularityCard: React.FC<Props> = ({
  className,
  countriesLabel,
  mode,
  onChangeMode,
  source,
  onChangeSource,
  category,
  onChangeCategory,
  weeks,
  onChangeWeeks,
  search,
  onChangeSearch,
  listLimit,
  onChangeListLimit,
}) => {
  const pillBase = "rounded-full border px-3 py-1 text-[11px] font-medium transition";
  const pillActiveA = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const pillActiveB = "border-amber-400/60 bg-amber-400/10 text-amber-200";
  const pillInactive = "border-white/10 text-slate-300 hover:bg-white/5";

  const deferredSearch = React.useDeferredValue(search);

  const base = React.useMemo(() => makeDataset(240), []);

  const filtered = React.useMemo(() => {
    const s = deferredSearch.trim().toLowerCase();

    let rows = base;

    if (source !== "all") rows = rows.filter((r) => r.source === source);
    if (category !== "all") rows = rows.filter((r) => r.category === category);

    if (s) {
      rows = rows.filter(
        (r) => r.title.toLowerCase().includes(s) || r.contentId.toLowerCase().includes(s)
      );
    }

    // Sort based on mode (top vs less popular)
    rows = [...rows].sort((a, b) => {
      const aScore = a.watched + a.downloaded + a.favorited;
      const bScore = b.watched + b.downloaded + b.favorited;
      return mode === "top" ? bScore - aScore : aScore - bScore;
    });

    const finalCount = listLimit === "all" ? rows.length : Math.min(listLimit, rows.length);
    return rows.slice(0, finalCount).map((r, i) => ({ ...r, rank: i + 1 }));
  }, [base, source, category, deferredSearch, mode, listLimit]);

  const handleDownload = () => downloadCsv("content-popularity.csv", filtered);

  return (
    <SectionCard title="Content Popularity" className={cn("min-w-0", className)} contentClassName="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[11px] text-slate-400">
          {countriesLabel} · {mode === "top" ? "Top" : "Less popular"} · Last{" "}
          <span className="text-slate-200">{weeks}</span> weeks
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            Download data
          </button>
        </div>
      </div>

      {/* Mode: Top vs Less popular */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-300">Mode:</span>
        {(["top", "bottom"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChangeMode(m)}
            className={cn(pillBase, mode === m ? pillActiveB : pillInactive)}
          >
            {m === "top" ? "Top" : "Less popular"}
          </button>
        ))}
      </div>

      {/* Filters: Source + Category */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-300">Source:</span>
        {sourceOptions.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChangeSource(o.v)}
            className={cn(pillBase, source === o.v ? pillActiveA : pillInactive)}
          >
            {o.label}
          </button>
        ))}

        <span className="ml-2 text-[11px] font-semibold text-slate-300">Category:</span>
        {categoryOptions.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChangeCategory(o.v)}
            className={cn(pillBase, category === o.v ? pillActiveA : pillInactive)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Weeks filter + Search */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="text-[11px] font-semibold text-slate-300">Search</label>
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search by title or ID…"
            className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
          <button
            type="button"
            onClick={() => onChangeWeeks(clamp(weeks - 1, 1, 52))}
            className="h-9 w-10 rounded-lg border border-white/10 bg-black/20 text-slate-100 hover:bg-white/10"
          >
            –
          </button>

          <div className="flex flex-col items-center px-3">
            <div className="text-sm font-semibold text-slate-100">{weeks}</div>
            <div className="text-[11px] text-slate-400">weeks</div>
          </div>

          <button
            type="button"
            onClick={() => onChangeWeeks(clamp(weeks + 1, 1, 52))}
            className="h-9 w-10 rounded-lg border border-white/10 bg-black/20 text-slate-100 hover:bg-white/10"
          >
            +
          </button>
        </div>
      </div>

      {/* List limit */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-300">Show:</span>
        {limitOptions.map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChangeListLimit(opt)}
            className={cn(pillBase, listLimit === opt ? pillActiveB : pillInactive)}
          >
            {limitLabel(opt)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="min-w-full text-left text-[11px]">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Content ID</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Watched</th>
              <th className="px-3 py-2">Downloaded</th>
              <th className="px-3 py-2">Favorited</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.contentId} className="border-t border-white/5">
                <td className="px-3 py-2 text-slate-200">{r.rank}</td>
                <td className="px-3 py-2 font-mono text-slate-200">{r.contentId}</td>
                <td className="px-3 py-2 text-slate-100">{r.title}</td>
                <td className="px-3 py-2 text-slate-200">{r.source === "trainLearn" ? "Train Learn" : "Academy"}</td>
                <td className="px-3 py-2 text-slate-200">{r.category}</td>
                <td className="px-3 py-2 text-slate-200">{r.watched}</td>
                <td className="px-3 py-2 text-slate-200">{r.downloaded}</td>
                <td className="px-3 py-2 text-slate-200">{r.favorited}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-500">
        * Backend should implement these filters + weeks window + search + top/bottom sorting. UI is ready.
      </p>
    </SectionCard>
  );
};

export default ContentPopularityCard;
