import React from "react";

export type AcademyFiltersState = {
  country: string;
  language: string;
  bucket: string; // All | currentWeek | past
};

type Props = {
  filters: AcademyFiltersState;
  onChange: (partial: Partial<AcademyFiltersState>) => void;
};

const OPTIONS = {
  country: ["All", "Germany", "USA", "UK", "Spain"],
  language: ["All", "EN", "DE", "ES", "FR"],
  bucket: ["All", "currentWeek", "past"],
} as const;

const LABELS: Record<string, string> = {
  All: "All",
  currentWeek: "Current Week",
  past: "Past Recordings",
};

const AcademyFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  const renderSelect = (
    key: keyof AcademyFiltersState,
    label: string,
    options: readonly string[]
  ) => {
    const id = `academy-filter-${key}`;
    return (
      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
        <label
          htmlFor={id}
          className="text-[11px] font-medium text-slate-300 md:text-xs"
        >
          {label}
        </label>
        <select
          id={id}
          value={filters[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black">
              {LABELS[opt] ?? opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap gap-3 rounded-xl bg-white/5 p-3 text-xs md:text-sm">
        {renderSelect("country", "Country", OPTIONS.country)}
        {renderSelect("language", "Language", OPTIONS.language)}
        {renderSelect("bucket", "Section", OPTIONS.bucket)}
      </div>
    </div>
  );
};

export default AcademyFiltersBar;
