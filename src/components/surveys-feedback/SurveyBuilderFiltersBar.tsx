import React from "react";
import Button from "../../shared/inputs/Button";
import { type SurveysFeedbackFiltersState } from "./types";

type Props = {
  country: string;
  language: string;
  sort: SurveysFeedbackFiltersState["sort"];
  weekFilter: number | "All";
  weekOptions: number[];
  onChange: (
    partial: Partial<Pick<SurveysFeedbackFiltersState, "country" | "language" | "sort">>
  ) => void;
  onWeekFilterChange: (value: number | "All") => void;
  onClear: () => void;
  countryOptions: string[];
  languageOptions: string[];
};

const SORT_OPTIONS: Array<{
  value: SurveysFeedbackFiltersState["sort"];
  label: string;
}> = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
];

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm";

const SurveyBuilderFiltersBar: React.FC<Props> = ({
  country,
  language,
  sort,
  weekFilter,
  weekOptions,
  onChange,
  onWeekFilterChange,
  onClear,
  countryOptions,
  languageOptions,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Country
        </label>
        <select
          value={country}
          onChange={(event) => onChange({ country: event.target.value })}
          className={fieldClassName}
        >
          {countryOptions.map((item) => (
            <option key={item} value={item} className="bg-black">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Language
        </label>
        <select
          value={language}
          onChange={(event) => onChange({ language: event.target.value })}
          className={fieldClassName}
        >
          {languageOptions.map((item) => (
            <option key={item} value={item} className="bg-black">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Week
        </label>
        <select
          value={String(weekFilter)}
          onChange={(event) => {
            const value = event.target.value;
            onWeekFilterChange(value === "All" ? "All" : Number(value));
          }}
          className={fieldClassName}
        >
          <option value="All" className="bg-black">
            All
          </option>
          {weekOptions.map((week) => (
            <option key={week} value={week} className="bg-black">
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Sort
        </label>
        <select
          value={sort}
          onChange={(event) =>
            onChange({
              sort: event.target.value as SurveysFeedbackFiltersState["sort"],
            })
          }
          className={fieldClassName}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-black">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end justify-end sm:col-span-2 xl:col-span-1">
        <Button
          variant="secondary"
          className="h-10 w-full rounded-full border border-white/10 bg-transparent px-4 text-xs font-semibold hover:bg-white/5 sm:w-auto"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SurveyBuilderFiltersBar;
