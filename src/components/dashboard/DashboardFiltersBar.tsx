import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";
import {
  CUSTOMER_SEGMENTS,
  SEGMENT_META,
  type CustomerSegment,
  uniqSegments,
} from "./customerSegments";

export type PeriodMode = "relative" | "absolute";
export type Timeframe = "daily" | "weekly" | "monthly" | "yearly";
export type DateRange = { startDate: string; endDate: string };

type Props = {
  countries: string[];
  selectedCountries: string[];
  onChangeCountries: (next: string[]) => void;

  languages: string[];
  selectedLanguages: string[];
  onChangeLanguages: (next: string[]) => void;

  //  Customer type state: [] means ALL (same as countries)
  selectedSegments: CustomerSegment[];
  onChangeSegments: (next: CustomerSegment[]) => void;

  periodMode: PeriodMode;
  onChangePeriodMode: (m: PeriodMode) => void;

  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;

  range: number;
  onChangeRange: (n: number) => void;

  dateRange: DateRange;
  onChangeDateRange: (r: DateRange) => void;

  title?: string;
  className?: string;
};

const timeframeOptions: { value: Timeframe; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function maxRangeFor(tf: Timeframe) {
  if (tf === "daily") return 365;
  if (tf === "weekly") return 104;
  if (tf === "monthly") return 48;
  return 10;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  when: boolean
) {
  React.useEffect(() => {
    if (!when) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose, when]);
}

const DashboardFiltersBar: React.FC<Props> = ({
  countries,
  selectedCountries,
  onChangeCountries,
  languages,
  selectedLanguages,
  onChangeLanguages,

  selectedSegments,
  onChangeSegments,

  periodMode,
  onChangePeriodMode,
  timeframe,
  onChangeTimeframe,
  range,
  onChangeRange,
  dateRange,
  onChangeDateRange,
  title = "Filters",
  className,
}) => {
  const max = maxRangeFor(timeframe);
  const unitLabel =
    timeframe === "daily"
      ? "days"
      : timeframe === "weekly"
      ? "weeks"
      : timeframe === "monthly"
      ? "months"
      : "years";

  React.useEffect(() => {
    if (range > max) onChangeRange(max);
    if (range < 1) onChangeRange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const pillBase =
    "rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs transition";
  const pillActive =
    "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const pillActiveTime =
    "border-amber-400/60 bg-amber-400/10 text-amber-200";
  const pillInactive = "border-white/10 text-slate-300 hover:bg-white/5";

  // -------------------- Countries picker --------------------
  const countryPopRef = React.useRef<HTMLDivElement>(null);
  const [openCountries, setOpenCountries] = React.useState(false);
  const [countryQuery, setCountryQuery] = React.useState("");
  useOutsideClick(countryPopRef, () => setOpenCountries(false), openCountries);

  const filteredCountries = React.useMemo(() => {
    const s = countryQuery.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => c.toLowerCase().includes(s));
  }, [countries, countryQuery]);

  const toggleCountry = (c: string) => {
    if (selectedCountries.includes(c)) {
      onChangeCountries(selectedCountries.filter((x) => x !== c));
    } else {
      onChangeCountries([...selectedCountries, c]);
    }
  };

  const countriesSummary =
    selectedCountries.length === 0
      ? "All countries"
      : selectedCountries.length === 1
      ? selectedCountries[0]
      : `${selectedCountries.length} selected`;

  // -------------------- Languages picker --------------------
  const langPopRef = React.useRef<HTMLDivElement>(null);
  const [openLanguages, setOpenLanguages] = React.useState(false);
  const [languageQuery, setLanguageQuery] = React.useState("");
  useOutsideClick(langPopRef, () => setOpenLanguages(false), openLanguages);

  const filteredLanguages = React.useMemo(() => {
    const s = languageQuery.trim().toLowerCase();
    if (!s) return languages;
    return languages.filter((lang) => lang.toLowerCase().includes(s));
  }, [languages, languageQuery]);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onChangeLanguages(selectedLanguages.filter((x) => x !== lang));
    } else {
      onChangeLanguages([...selectedLanguages, lang]);
    }
  };

  const languagesSummary =
    selectedLanguages.length === 0
      ? "All languages"
      : selectedLanguages.length === 1
      ? selectedLanguages[0]
      : `${selectedLanguages.length} selected`;

  // -------------------- Customer type picker (same UX as countries) --------------------
  const segPopRef = React.useRef<HTMLDivElement>(null);
  const [openSegs, setOpenSegs] = React.useState(false);
  const [segQuery, setSegQuery] = React.useState("");
  useOutsideClick(segPopRef, () => setOpenSegs(false), openSegs);

  // keep UI state as-is: [] means ALL
  const segs = React.useMemo(() => uniqSegments(selectedSegments), [selectedSegments]);
  const segsIsAll = segs.length === 0;

  const setSegmentsSafe = (next: CustomerSegment[]) => {
    onChangeSegments(uniqSegments(next)); // can be []
  };

  const toggleSegment = (seg: CustomerSegment) => {
    const has = segs.includes(seg);
    const next = has ? segs.filter((s) => s !== seg) : [...segs, seg];
    setSegmentsSafe(next); // if becomes empty => All (same as countries)
  };

  const segSummary =
    segs.length === 0 ? "All customer types" : `${segs.length} selected`;

  const filteredSegs = React.useMemo(() => {
    const q = segQuery.trim().toLowerCase();
    if (!q) return CUSTOMER_SEGMENTS;
    return CUSTOMER_SEGMENTS.filter((s) =>
      SEGMENT_META[s].label.toLowerCase().includes(q)
    );
  }, [segQuery]);

  // -------------------- Absolute dates validation --------------------
  const onChangeStart = (startDate: string) => {
    const endDate = dateRange.endDate;
    if (endDate && startDate && startDate > endDate) {
      onChangeDateRange({ startDate, endDate: startDate });
      return;
    }
    onChangeDateRange({ ...dateRange, startDate });
  };

  const onChangeEnd = (endDate: string) => {
    const startDate = dateRange.startDate;
    if (startDate && endDate && endDate < startDate) {
      onChangeDateRange({ startDate: endDate, endDate });
      return;
    }
    onChangeDateRange({ ...dateRange, endDate });
  };

  return (
    <SectionCard title={title} className={cn("min-w-0", className)}>
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        {/* Left column: Country + Customer type + Language */}
        <div className="lg:col-span-6">
          {/* Country header */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300">Country</span>
            {selectedCountries.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeCountries([])}
                className="text-[11px] font-semibold text-slate-300 hover:text-slate-100"
              >
                Clear ({selectedCountries.length})
              </button>
            )}
          </div>

          {/* Country row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="relative" ref={countryPopRef}>
              <button
                type="button"
                onClick={() => setOpenCountries((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                )}
              >
                <span>{countriesSummary}</span>
                <span className="text-slate-400">▾</span>
              </button>

              {openCountries && (
                <div className="absolute z-50 mt-2 w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <input
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      placeholder="Search countries…"
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onChangeCountries([])}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => onChangeCountries([])}
                      className={cn(
                        "flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-xs",
                        selectedCountries.length === 0
                          ? "text-emerald-200"
                          : "text-slate-200 hover:bg-white/5"
                      )}
                    >
                      <span>All countries</span>
                      <span className="text-slate-400">
                        {selectedCountries.length === 0 ? "✓" : ""}
                      </span>
                    </button>

                    {filteredCountries.map((c) => {
                      const active = selectedCountries.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCountry(c)}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-white/5",
                            active ? "text-emerald-200" : "text-slate-200"
                          )}
                        >
                          <span>{c}</span>
                          <span className="text-slate-400">{active ? "✓" : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedCountries.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCountry(c)}
                className={cn(pillBase, pillActive)}
                title="Click to remove"
              >
                {c} ✕
              </button>
            ))}
            {selectedCountries.length > 6 && (
              <span className="text-[11px] text-slate-400">
                +{selectedCountries.length - 6} more
              </span>
            )}
          </div>

          {/* Customer type header */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Customer type
            </span>

            {/* show clear only if user selected something */}
            {segs.length > 0 && (
              <button
                type="button"
                onClick={() => setSegmentsSafe([])} // [] = All
                className="text-[11px] font-semibold text-slate-300 hover:text-slate-100"
              >
                Clear ({segs.length})
              </button>
            )}
          </div>

          {/* Customer type row (same as country) */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="relative" ref={segPopRef}>
              <button
                type="button"
                onClick={() => setOpenSegs((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                )}
              >
                <span>{segSummary}</span>
                <span className="text-slate-400">▾</span>
              </button>

              {openSegs && (
                <div className="absolute z-50 mt-2 w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <input
                      value={segQuery}
                      onChange={(e) => setSegQuery(e.target.value)}
                      placeholder="Search customer types…"
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSegmentsSafe([])} // [] = All
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/5">
                    {/* All row */}
                    <button
                      type="button"
                      onClick={() => setSegmentsSafe([])} // [] = All
                      className={cn(
                        "flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-xs",
                        segsIsAll ? "text-emerald-200" : "text-slate-200 hover:bg-white/5"
                      )}
                    >
                      <span>All customer types</span>
                      <span className="text-slate-400">{segsIsAll ? "✓" : ""}</span>
                    </button>

                    {filteredSegs.map((seg) => {
                      const active = segs.includes(seg);
                      return (
                        <button
                          key={seg}
                          type="button"
                          onClick={() => toggleSegment(seg)}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-white/5",
                            active ? "text-emerald-200" : "text-slate-200"
                          )}
                        >
                          <span>{SEGMENT_META[seg].label}</span>
                          <span className="text-slate-400">{active ? "✓" : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/*  chips only when user selected something */}
            {segs.slice(0, 6).map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => toggleSegment(seg)}
                className={cn(pillBase, pillActive)}
                title="Click to remove"
              >
                {SEGMENT_META[seg].label} ✕
              </button>
            ))}
            {segs.length > 6 && (
              <span className="text-[11px] text-slate-400">
                +{segs.length - 6} more
              </span>
            )}
          </div>

          {/* Language header */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300">Language</span>
            {selectedLanguages.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeLanguages([])}
                className="text-[11px] font-semibold text-slate-300 hover:text-slate-100"
              >
                Clear ({selectedLanguages.length})
              </button>
            )}
          </div>

          {/* Language row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="relative" ref={langPopRef}>
              <button
                type="button"
                onClick={() => setOpenLanguages((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                )}
              >
                <span>{languagesSummary}</span>
                <span className="text-slate-400">▾</span>
              </button>

              {openLanguages && (
                <div className="absolute z-50 mt-2 w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <input
                      value={languageQuery}
                      onChange={(e) => setLanguageQuery(e.target.value)}
                      placeholder="Search languages..."
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onChangeLanguages([])}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => onChangeLanguages([])}
                      className={cn(
                        "flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-xs",
                        selectedLanguages.length === 0
                          ? "text-emerald-200"
                          : "text-slate-200 hover:bg-white/5"
                      )}
                    >
                      <span>All languages</span>
                      <span className="text-slate-400">
                        {selectedLanguages.length === 0 ? "✓" : ""}
                      </span>
                    </button>

                    {filteredLanguages.map((lang) => {
                      const active = selectedLanguages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-white/5",
                            active ? "text-emerald-200" : "text-slate-200"
                          )}
                        >
                          <span>{lang}</span>
                          <span className="text-slate-400">{active ? "✓" : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedLanguages.slice(0, 6).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={cn(pillBase, pillActive)}
                title="Click to remove"
              >
                {lang} ✕
              </button>
            ))}
            {selectedLanguages.length > 6 && (
              <span className="text-[11px] text-slate-400">
                +{selectedLanguages.length - 6} more
              </span>
            )}
          </div>

          <div className="mt-1 text-[11px] text-slate-400">
            Applies to customer KPIs + customer charts (including language-based
            breakdowns).
          </div>
        </div>

        {/* Period */}
        <div className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-300">Period</span>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onChangePeriodMode("relative")}
              className={cn(pillBase, periodMode === "relative" ? pillActiveTime : pillInactive)}
            >
              Relative
            </button>
            <button
              type="button"
              onClick={() => onChangePeriodMode("absolute")}
              className={cn(pillBase, periodMode === "absolute" ? pillActiveTime : pillInactive)}
            >
              Custom range
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {timeframeOptions.map((o) => {
              const active = timeframe === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onChangeTimeframe(o.value)}
                  className={cn(pillBase, active ? pillActiveTime : pillInactive)}
                  aria-pressed={active}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="mt-1 text-[11px] text-slate-400">
            {periodMode === "relative" ? (
              <>
                Max: {max} {unitLabel}
              </>
            ) : (
              <>Pick Date X → Date Y (then charts bucket by {timeframe})</>
            )}
          </div>
        </div>

        {/* Length / Date range */}
        <div className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-300">
            {periodMode === "relative" ? "Length" : "Date Range"}
          </span>

          {periodMode === "relative" ? (
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
              <button
                type="button"
                onClick={() => onChangeRange(clamp(range - 1, 1, max))}
                className="h-9 w-10 rounded-lg border border-white/10 bg-black/20 text-slate-100 hover:bg-white/10"
                aria-label="Decrease range"
              >
                –
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="text-sm font-semibold text-slate-100">{range}</div>
                <div className="text-[11px] text-slate-400">{unitLabel}</div>
              </div>

              <button
                type="button"
                onClick={() => onChangeRange(clamp(range + 1, 1, max))}
                className="h-9 w-10 rounded-lg border border-white/10 bg-black/20 text-slate-100 hover:bg-white/10"
                aria-label="Increase range"
              >
                +
              </button>
            </div>
          ) : (
            <div className="mt-2 grid gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400">Start</span>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => onChangeStart(e.target.value)}
                    className="h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400">End</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => onChangeEnd(e.target.value)}
                    className="h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default DashboardFiltersBar;
