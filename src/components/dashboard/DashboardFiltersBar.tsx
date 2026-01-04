import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

export type Timeframe = "daily" | "weekly" | "monthly";

type Props = {
  countries: string[];
  selectedCountries: string[];
  onChangeCountries: (next: string[]) => void;

  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;

  range: number;
  onChangeRange: (n: number) => void;

  title?: string;
  className?: string;
};

const timeframeOptions: { value: Timeframe; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function maxRangeFor(tf: Timeframe) {
  // tweak these as you like (these are sensible defaults)
  if (tf === "daily") return 30;
  if (tf === "weekly") return 52;
  return 24; // monthly
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const DashboardFiltersBar: React.FC<Props> = ({
  countries,
  selectedCountries,
  onChangeCountries,
  timeframe,
  onChangeTimeframe,
  range,
  onChangeRange,
  title = "Filters",
  className,
}) => {
  const [countryPick, setCountryPick] = React.useState<string>("");

  const max = maxRangeFor(timeframe);

  // keep range valid when timeframe changes
  React.useEffect(() => {
    if (range > max) onChangeRange(max);
    if (range < 1) onChangeRange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const toggleCountry = (c: string) => {
    if (selectedCountries.includes(c)) {
      onChangeCountries(selectedCountries.filter((x) => x !== c));
    } else {
      onChangeCountries([...selectedCountries, c]);
    }
  };

  const addPickedCountry = () => {
    const c = countryPick.trim();
    if (!c) return;
    if (selectedCountries.includes(c)) return;
    onChangeCountries([...selectedCountries, c]);
    setCountryPick("");
  };

  const unitLabel =
    timeframe === "daily" ? "days" : timeframe === "weekly" ? "weeks" : "months";

  const pillBase =
    "rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs transition";
  const pillActiveCountry = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const pillActiveTime = "border-amber-400/60 bg-amber-400/10 text-amber-200";
  const pillInactive = "border-white/10 text-slate-300 hover:bg-white/5";

  return (
    <SectionCard title={title} className={cn("min-w-0", className)}>
      {/* Responsive layout:
          - Mobile: stacked sections
          - Desktop: 3 columns-ish */}
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

          {/* Mobile: dropdown multi-add */}
          <div className="mt-2 flex flex-col gap-2 sm:hidden">
            <div className="flex gap-2">
              <select
                value={countryPick}
                onChange={(e) => setCountryPick(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
              >
                <option value="" className="bg-black">
                  Select country…
                </option>
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-black">
                    {c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addPickedCountry}
                disabled={!countryPick}
                className={cn(
                  "h-10 shrink-0 rounded-xl border px-4 text-xs font-semibold transition",
                  countryPick
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15"
                    : "border-white/10 bg-white/5 text-slate-400"
                )}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onChangeCountries([])}
                className={cn(
                  pillBase,
                  selectedCountries.length === 0 ? pillActiveCountry : pillInactive
                )}
              >
                All
              </button>

              {selectedCountries.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCountry(c)}
                  className={cn(pillBase, pillActiveCountry)}
                >
                  {c} ✕
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: chips row */}
          <div className="mt-2 hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            <button
              type="button"
              onClick={() => onChangeCountries([])}
              className={cn(
                pillBase,
                selectedCountries.length === 0 ? pillActiveCountry : pillInactive
              )}
              aria-pressed={selectedCountries.length === 0}
            >
              All countries
            </button>

            {countries.map((c) => {
              const active = selectedCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCountry(c)}
                  className={cn(pillBase, active ? pillActiveCountry : pillInactive)}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe */}
        <div className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-300">Timeframe</span>

          {/* Mobile dropdown */}
          <div className="mt-2 sm:hidden">
            <select
              value={timeframe}
              onChange={(e) => onChangeTimeframe(e.target.value as Timeframe)}
              className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none"
            >
              {timeframeOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-black">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop segmented pills */}
          <div className="mt-2 hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
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
            Max: {max} {unitLabel}
          </div>
        </div>

        {/* Range */}
        <div className="lg:col-span-3">
          <span className="text-xs font-semibold text-slate-300">Length</span>

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
        </div>
      </div>
    </SectionCard>
  );
};

export default DashboardFiltersBar;
