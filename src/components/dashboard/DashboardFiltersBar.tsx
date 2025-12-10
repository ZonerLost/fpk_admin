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

const timeframeOptions: Timeframe[] = ["daily", "weekly", "monthly"];

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
  const toggleCountry = (c: string) => {
    if (selectedCountries.includes(c)) {
      onChangeCountries(selectedCountries.filter((x) => x !== c));
    } else {
      onChangeCountries([...selectedCountries, c]);
    }
  };

  return (
    <SectionCard title={title} className={cn("min-w-0", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Countries */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Country:
          </span>

          <button
            type="button"
            onClick={() => onChangeCountries([])}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs",
              selectedCountries.length === 0
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 text-slate-300 hover:bg-white/5"
            )}
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
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium md:text-xs",
                  active
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Timeframe */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Timeframe:
          </span>
          {timeframeOptions.map((tf) => {
            const active = timeframe === tf;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => onChangeTimeframe(tf)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium capitalize md:text-xs",
                  active
                    ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                )}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Range */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Length:
          </span>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
            <button
              type="button"
              onClick={() => onChangeRange(Math.max(1, range - 1))}
              className="rounded-md px-2 text-slate-200 hover:bg-white/10"
            >
              -
            </button>
            <span className="min-w-[24px] text-center text-xs text-slate-100">
              {range}
            </span>
            <button
              type="button"
              onClick={() => onChangeRange(Math.min(52, range + 1))}
              className="rounded-md px-2 text-slate-200 hover:bg-white/10"
            >
              +
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            ({timeframe === "daily" ? "days" : timeframe === "weekly" ? "weeks" : "months"})
          </span>
        </div>
      </div>
    </SectionCard>
  );
};

export default DashboardFiltersBar;
