import React from "react";

export type ContentFiltersState = {
  week: string;
  month: string;
  type: string;
  category: string;
  language: string;
  country: string;
  access: string;
  status: string;
  purpose: string;
};

type Props = {
  filters: ContentFiltersState;
  onChange: (partial: Partial<ContentFiltersState>) => void;
};

const ContentFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  const renderSelect = (
    key: keyof ContentFiltersState,
    label: string,
    options: string[]
  ) => (
    <div className="flex min-w-0 flex-1  flex-col gap-1">
      <label className="text-[11px] font-medium   text-slate-300 md:text-xs">
        {label}
      </label>
      <select
        value={filters[key]}
        onChange={(e) => onChange({ [key]: e.target.value })}
        className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:ring  sm:h-10 sm:text-xs md:h-10 md:text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-white/5 p-2.5 text-xs sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-3 md:p-3 lg:gap-4 lg:p-4">
        {renderSelect("month", "Month", ["All", "1", "2", "3"])}
        {renderSelect("week", "Week", ["All", "1", "2", "3", "4", "5", "6", "7", "8"])}
        {renderSelect("type", "Type", ["All", "Train", "Learn", "Live", "Doc", "Survey"])}
        {renderSelect("category", "Category", [
          "All",
          "Mindset",
          "Lifestyle",
          "Tactic",
          "Technique",
          "Survey",
        ])}
        {renderSelect("purpose", "Purpose", ["All", "content", "learn_thumbnail", "intro_asset"])}
        {renderSelect("language", "Language", ["All", "EN", "DE", "FR", "ES", "UR"])}
        {renderSelect("country", "Country", ["All", "USA", "UK", "Germany", "France", "Spain", "Pakistan"])}
        {renderSelect("access", "Access", ["All", "Pro", "Basic", "All Access"])}
        {renderSelect("status", "Status", ["All", "Published", "Scheduled", "Draft"])}
      </div>
    </div>
  );
};

export default ContentFiltersBar;
