import React from "react";
import {
  FEEDBACK_TYPE_OPTIONS,
  FEEDBACK_STATUS_OPTIONS,
  FEEDBACK_USER_TYPE_OPTIONS,
  type SurveyFeedbackFiltersState,
} from "./types";

type Props = {
  filters: SurveyFeedbackFiltersState;
  onChange: (partial: Partial<SurveyFeedbackFiltersState>) => void;
  countryOptions: string[];
  languageOptions: string[];
};

const SORT_OPTIONS: { value: SurveyFeedbackFiltersState["sort"]; label: string }[] = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
  { value: "status_open_first", label: "Open first" },
];

const TYPE_LABEL: Record<(typeof FEEDBACK_TYPE_OPTIONS)[number], string> = {
  weeklySurvey: "Weekly Survey",
  askQuestion: "Ask a Question",
};

const STATUS_LABEL: Record<(typeof FEEDBACK_STATUS_OPTIONS)[number], string> = {
  open: "Open",
  resolved: "Resolved",
};

const SurveyFeedbackFiltersBar: React.FC<Props> = ({
  filters,
  onChange,
  countryOptions,
  languageOptions,
}) => {
  const renderSelect = (
    key: keyof SurveyFeedbackFiltersState,
    label: string,
    options: readonly (string | { value: string; label: string })[]
  ) => {
    const id = `surveys-filter-${key}`;
    return (
      <div className="flex min-w-[150px] flex-1 flex-col gap-1">
        <label htmlFor={id} className="text-[11px] font-medium text-white/70 md:text-xs">
          {label}
        </label>
        <select
          id={id}
          value={String(filters[key])}
          onChange={(e) => onChange({ [key]: e.target.value } as Partial<SurveyFeedbackFiltersState>)}
          className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:ring sm:h-10 sm:text-xs md:text-sm"
        >
          {options.map((opt) => {
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
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-white/5 p-2.5 text-xs md:grid-cols-3 md:gap-3 md:p-3 lg:grid-cols-6 md:text-sm">
        {renderSelect("country", "Country", countryOptions)}
        {renderSelect("language", "Language", languageOptions)}
        {renderSelect("type", "Type", [
          "All",
          ...FEEDBACK_TYPE_OPTIONS.map((type) => ({ value: type, label: TYPE_LABEL[type] })),
        ])}
        {renderSelect("userType", "User Type", ["All", ...FEEDBACK_USER_TYPE_OPTIONS])}
        {renderSelect("status", "Status", [
          "All",
          ...FEEDBACK_STATUS_OPTIONS.map((status) => ({ value: status, label: STATUS_LABEL[status] })),
        ])}
        {renderSelect("sort", "Sort", SORT_OPTIONS)}
      </div>
    </div>
  );
};

export default SurveyFeedbackFiltersBar;
