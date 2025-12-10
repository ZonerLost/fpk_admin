import React from "react";

export type UsersFiltersState = {
  role: string;
  country: string;
  pro: string;
  lastActive: string;
};

type Props = {
  filters: UsersFiltersState;
  onChange: (partial: Partial<UsersFiltersState>) => void;
};

const OPTIONS = {
  role: ["All", "Registered", "Unregistered"],
  country: ["All", "Norway", "Spain", "Japan", "Brazil"],
  pro: ["All", "Active", "Inactive", "None"],
  lastActive: ["All Time", "24h", "7 days", "30 days"],
} as const;

const UsersFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  const renderSelect = (
    key: keyof UsersFiltersState,
    label: string,
    options: readonly string[]
  ) => {
    const id = `filter-${key}`;
    return (
      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
        <label
          htmlFor={id}
          className="text-[11px] font-medium text-white/70 md:text-xs"
        >
          {label}
        </label>
        <select
          id={id}
          value={filters[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:ring sm:h-10 sm:text-xs md:text-sm"
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black">
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-white/5 p-2.5 text-xs sm:grid-cols-2 md:grid-cols-4 md:gap-3 md:p-3 md:text-sm">
        {renderSelect("role", "Status", OPTIONS.role)}
        {renderSelect("country", "Country", OPTIONS.country)}
        {renderSelect("pro", "Pro", OPTIONS.pro)}
        {renderSelect("lastActive", "Last Active", OPTIONS.lastActive)}
      </div>
    </div>
  );
};

export default UsersFiltersBar;
