/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { COUNTRIES, LANGUAGES } from "../../shared/constant/geo";

export type UsersSort =
  | "joined_desc"
  | "joined_asc"
  | "pro_days_desc"
  | "pro_days_asc";

export type UsersFiltersState = {
  country: string;
  language: string;
  status: "All" | "Registered" | "PRO 1M" | "PRO 6M" | "PRO 12M";
  lastActive: "All Time" | "24h" | "7 days" | "30 days";
  sort: UsersSort;
};

type Props = {
  filters: UsersFiltersState;
  onChange: (partial: Partial<UsersFiltersState>) => void;
};

const OPTIONS = {
  country: ["All", ...COUNTRIES],
  language: ["All", ...LANGUAGES],
  status: ["All", "Registered", "PRO 1M", "PRO 6M", "PRO 12M"] as const,
  lastActive: ["All Time", "24h", "7 days", "30 days"] as const,
  sort: [
    { value: "joined_desc", label: "Joined (newest)" },
    { value: "joined_asc", label: "Joined (oldest)" },
    { value: "pro_days_desc", label: "Pro duration (longest)" },
    { value: "pro_days_asc", label: "Pro duration (shortest)" },
  ] as const,
} as const;

const UsersFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  const renderSelect = (
    key: keyof UsersFiltersState,
    label: string,
    options: readonly any[]
  ) => {
    const id = `filter-${key}`;
    return (
      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
        <label htmlFor={id} className="text-[11px] font-medium text-white/70 md:text-xs">
          {label}
        </label>
        <select
          id={id}
          value={filters[key] as any}
          onChange={(e) => onChange({ [key]: e.target.value } as any)}
          className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:ring sm:h-10 sm:text-xs md:text-sm"
        >
          {options.map((opt: any) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const text = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value} className="bg-black">
                {text}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-white/5 p-2.5 text-xs sm:grid-cols-2 md:grid-cols-5 md:gap-3 md:p-3 md:text-sm">
        {renderSelect("country", "Country", OPTIONS.country)}
        {renderSelect("language", "Language", OPTIONS.language)}
        {renderSelect("status", "Status", OPTIONS.status)}
        {renderSelect("lastActive", "Last Active", OPTIONS.lastActive)}
        {renderSelect("sort", "Sort", OPTIONS.sort)}
      </div>
    </div>
  );
};

export default UsersFiltersBar;
