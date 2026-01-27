import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

export type PeriodMode = "relative" | "absolute";
export type Timeframe = "daily" | "weekly" | "monthly" | "yearly";
export type DateRange = { startDate: string; endDate: string };

type Props = {
  countries: string[];
  selectedCountries: string[];
  onChangeCountries: (next: string[]) => void;

  periodMode: PeriodMode;
  onChangePeriodMode: (m: PeriodMode) => void;

  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;

  range: number; // relative length (last N units)
  onChangeRange: (n: number) => void;

  dateRange: DateRange; // absolute
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
  if (tf === "daily") return 365; // allow last 365 days
  if (tf === "weekly") return 104; // 2 years
  if (tf === "monthly") return 48; // 4 years
  return 10; // yearly
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onClose: () => void, when: boolean) {
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
    timeframe === "daily" ? "days" : timeframe === "weekly" ? "weeks" : timeframe === "monthly" ? "months" : "years";

  // keep range valid when timeframe changes
  React.useEffect(() => {
    if (range > max) onChangeRange(max);
    if (range < 1) onChangeRange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const pillBase = "rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs transition";
  const pillActiveCountry = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const pillActiveTime = "border-amber-400/60 bg-amber-400/10 text-amber-200";
  const pillInactive = "border-white/10 text-slate-300 hover:bg-white/5";

  // -------- Country scalable picker (search + multi select) --------
  const popRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  useOutsideClick(popRef, () => setOpen(false), open);

  const filteredCountries = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => c.toLowerCase().includes(s));
  }, [countries, q]);

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

  // -------- Absolute dates: basic validation --------
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
        {/* Countries */}
        <div className="lg:col-span-6">
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

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Summary button opens scalable picker */}
            <div className="relative" ref={popRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                )}
              >
                <span>{countriesSummary}</span>
                <span className="text-slate-400">▾</span>
              </button>

              {open && (
                <div className="absolute z-50 mt-2 w-[320px] max-w-[92vw] rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
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
                        selectedCountries.length === 0 ? "text-emerald-200" : "text-slate-200 hover:bg-white/5"
                      )}
                    >
                      <span>All countries</span>
                      <span className="text-slate-400">{selectedCountries.length === 0 ? "✓" : ""}</span>
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

            {/* Show selected chips (small) */}
            {selectedCountries.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCountry(c)}
                className={cn(pillBase, pillActiveCountry)}
                title="Click to remove"
              >
                {c} ✕
              </button>
            ))}
            {selectedCountries.length > 6 && (
              <span className="text-[11px] text-slate-400">+{selectedCountries.length - 6} more</span>
            )}
          </div>
        </div>

        {/* Period mode + timeframe */}
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

        {/* Length or Date range */}
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
