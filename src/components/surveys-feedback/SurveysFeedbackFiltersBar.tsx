import React from "react";
import Button from "../../shared/inputs/Button";
import {
  SUBMISSION_USER_TYPE_OPTIONS,
  type AskStatusFilter,
  type SurveysFeedbackFiltersState,
} from "./types";
import TagMultiSelect from "./TagMultiSelect";

type Props = {
  filters: SurveysFeedbackFiltersState;
  onChange: (partial: Partial<SurveysFeedbackFiltersState>) => void;
  onClear: () => void;
  countryOptions: string[];
  languageOptions: string[];
  showUserType?: boolean;
  showAskStatus?: boolean;
  showTags?: boolean;
  tagOptions?: string[];
};

const SORT_OPTIONS: Array<{
  value: SurveysFeedbackFiltersState["sort"];
  label: string;
}> = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
];

const ASK_STATUS_OPTIONS: Array<{ value: AskStatusFilter; label: string }> = [
  { value: "All", label: "All" },
  { value: "Unanswered", label: "Unanswered" },
  { value: "Answered", label: "Answered" },
];

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm";

const SurveysFeedbackFiltersBar: React.FC<Props> = ({
  filters,
  onChange,
  onClear,
  countryOptions,
  languageOptions,
  showUserType = true,
  showAskStatus = false,
  showTags = false,
  tagOptions = [],
}) => {
  return (
    <div className="flex w-full flex-wrap items-end gap-3">
      <div className="min-w-[150px] flex-1">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Country
        </label>
        <select
          value={filters.country}
          onChange={(event) => onChange({ country: event.target.value })}
          className={fieldClassName}
        >
          {countryOptions.map((country) => (
            <option key={country} value={country} className="bg-black">
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[120px] flex-1">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Language
        </label>
        <select
          value={filters.language}
          onChange={(event) => onChange({ language: event.target.value })}
          className={fieldClassName}
        >
          {languageOptions.map((language) => (
            <option key={language} value={language} className="bg-black">
              {language}
            </option>
          ))}
        </select>
      </div>

      {showUserType ? (
        <div className="min-w-[150px] flex-1">
          <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
            User Type
          </label>
          <select
            value={filters.userType}
            onChange={(event) =>
              onChange({
                userType: event.target.value as SurveysFeedbackFiltersState["userType"],
              })
            }
            className={fieldClassName}
          >
            <option value="All" className="bg-black">
              All
            </option>
            {SUBMISSION_USER_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type} className="bg-black">
                {type}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showAskStatus ? (
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
            Status
          </label>
          <select
            value={filters.askStatus}
            onChange={(event) =>
              onChange({ askStatus: event.target.value as AskStatusFilter })
            }
            className={fieldClassName}
          >
            {ASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showTags ? (
        <TagMultiSelect
          label="Tags"
          options={tagOptions}
          value={filters.tags}
          onChange={(next) => onChange({ tags: next })}
          className="min-w-[220px]"
        />
      ) : null}

      <div className="min-w-[160px] flex-1">
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          Sort
        </label>
        <select
          value={filters.sort}
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

      <Button
        variant="secondary"
        className="h-10 rounded-full border border-white/10 bg-transparent px-4 text-xs font-semibold hover:bg-white/5"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
};

export default SurveysFeedbackFiltersBar;
