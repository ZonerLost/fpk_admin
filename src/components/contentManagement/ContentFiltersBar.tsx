import React from "react";
import type { ContentType, ContentCategory, ContentPurpose } from "./types";
import { COUNTRIES, LANGUAGES, MONTH_OPTIONS, WEEK_OPTIONS } from "./content.constants";

export type ContentFiltersState = {
  month: string; // "All" | "1..48"
  week: string; // "All" | "1..12"
  type: "All" | ContentType;
  category: "All" | ContentCategory;
  purpose: "All" | ContentPurpose;
  language: string; // "All" | code
  country: string; // "All" | name
  access: "All" | "Pro" | "Basic" | "All";
  status: "All" | "Published" | "Scheduled" | "Draft";
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
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label className="text-[11px] font-medium text-slate-300 md:text-xs">
        {label}
      </label>
      <select
        value={String(filters[key])}
        onChange={(e) => onChange({ [key]: e.target.value } as Partial<ContentFiltersState>)}
        className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:ring sm:h-10 sm:text-xs md:text-sm"
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
        {renderSelect("month", "Month", MONTH_OPTIONS)}
        {renderSelect("week", "Week", WEEK_OPTIONS)}
        {renderSelect("type", "Type", ["All", "PDF", "Image", "Video", "Survey"])}
        {renderSelect("category", "Category", ["All", "Mindset", "Tactic", "Technik", "Fitness"])}
        {renderSelect("purpose", "Purpose", ["All", "learn_thumbnail", "intro_asset", "learn_content", "train_content", "academy_content"])}
        {renderSelect("language", "Language", ["All", ...LANGUAGES])}
        {renderSelect("country", "Country", ["All", ...COUNTRIES])}
        {renderSelect("access", "Access", ["All", "Pro", "Basic", "All"])}
        {renderSelect("status", "Status", ["All", "Published", "Scheduled", "Draft"])}
      </div>
    </div>
  );
};

export default ContentFiltersBar;
