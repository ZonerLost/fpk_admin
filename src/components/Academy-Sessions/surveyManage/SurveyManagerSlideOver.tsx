import React from "react";
import SlideOver from "../../../shared/overlay/SlideOver";
import TextField from "../../../shared/inputs/TextField";
import Button from "../../../shared/inputs/Button";
import Badge from "../../../shared/data-display/Badge";
import { COUNTRY_CATALOG } from "../../../shared/constants/locale";


export type SurveyResponseType = "multipleChoice" | "freeForm" | "both";

export type SurveyVariant = {
  id: string;
  week: number;
  country: string;
  language: string;
  question: string;
  responseType: SurveyResponseType;
  options?: string[];
  responsesCount: number;
};

export type SurveyVariantDraft = {
  week: number;
  country: string;
  language: string;
  question: string;
  responseType: SurveyResponseType;
  options?: string[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  /** If provided -> edit mode; if null -> create mode */
  editing?: SurveyVariant | null;

  /** Defaults to selected filters from the page (optional) */
  defaultCountry?: string; // "Germany" etc
  defaultLanguage?: string; // "EN" etc

  /**
   * Parent decides whether to create a new record or update an existing one.
   * - For create: parent generates id + sets responsesCount=0
   * - For edit: parent merges changes into existing record
   */
  onSave: (draft: SurveyVariantDraft) => void;
};

const RESPONSE_TYPES: { value: SurveyResponseType; label: string }[] = [
  { value: "multipleChoice", label: "Multiple Choice" },
  { value: "freeForm", label: "Free Form" },
  { value: "both", label: "Both (MCQ + Free Form)" },
];

function parseOptions(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeOptions(options?: string[]) {
  return (options ?? []).join(", ");
}

function isMcqEnabled(t: SurveyResponseType) {
  return t === "multipleChoice" || t === "both";
}

function isFreeFormEnabled(t: SurveyResponseType) {
  return t === "freeForm" || t === "both";
}

const SurveyManagerSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  editing = null,
  defaultCountry,
  defaultLanguage,
  onSave,
}) => {
  const isEdit = !!editing;

  const firstCountry = COUNTRY_CATALOG[0]?.country ?? "Germany";
  const safeDefaultCountry = defaultCountry && defaultCountry !== "All" ? defaultCountry : firstCountry;
  const safeDefaultLanguage =
    defaultLanguage && defaultLanguage !== "All" ? defaultLanguage : "EN";

  // form state
  const [week, setWeek] = React.useState("1");
  const [country, setCountry] = React.useState(safeDefaultCountry);
  const [language, setLanguage] = React.useState(safeDefaultLanguage);
  const [question, setQuestion] = React.useState("");
  const [responseType, setResponseType] = React.useState<SurveyResponseType>("multipleChoice");
  const [optionsRaw, setOptionsRaw] = React.useState("Option A, Option B");

  // validation state
  const [touched, setTouched] = React.useState(false);

  // Keep language options somewhat aligned to country (still allow manual overrides)
  const countryConfig = React.useMemo(
    () => COUNTRY_CATALOG.find((c) => c.country === country),
    [country]
  );
  const countryLanguages = React.useMemo(
    () => (countryConfig?.languages?.length ? countryConfig.languages.map(String) : ["EN"]),
    [countryConfig]
  );

  // Initialize when opening / editing changes
  React.useEffect(() => {
    if (!isOpen) return;

    setTouched(false);

    if (editing) {
      setWeek(String(editing.week));
      setCountry(editing.country);
      setLanguage(editing.language);
      setQuestion(editing.question);
      setResponseType(editing.responseType);
      setOptionsRaw(serializeOptions(editing.options));
      return;
    }

    // create mode defaults (prefer filters)
    setWeek("1");
    setCountry(safeDefaultCountry);
    setLanguage(safeDefaultLanguage);
    setQuestion("");
    setResponseType("multipleChoice");
    setOptionsRaw("Option A, Option B");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editing]);

  // If country changes and current language is not in suggested list, nudge to first suggested
  React.useEffect(() => {
    if (!isOpen) return;
    if (!countryLanguages.includes(language)) {
      setLanguage(countryLanguages[0] ?? "EN");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // If response type changes and MCQ not enabled, options can be cleared (but keep raw for convenience)
  React.useEffect(() => {
    if (!isOpen) return;
    // no-op; we keep optionsRaw to avoid annoying UX
  }, [isOpen, responseType]);

  const options = React.useMemo(() => parseOptions(optionsRaw), [optionsRaw]);

  const weekNum = Math.max(1, Math.floor(Number(week) || 1));
  const questionTrim = question.trim();
  const langTrim = language.trim();
  const needsOptions = isMcqEnabled(responseType);

  const errors = React.useMemo(() => {
    const e: { week?: string; country?: string; language?: string; question?: string; options?: string } =
      {};

    if (!Number.isFinite(Number(week)) || Number(week) < 1) e.week = "Week must be 1 or higher.";
    if (!country.trim()) e.country = "Country is required.";
    if (!langTrim) e.language = "Language is required.";
    if (!questionTrim) e.question = "Question is required.";
    if (needsOptions && options.length < 2) e.options = "At least 2 options are required for MCQ.";
    return e;
  }, [week, country, langTrim, questionTrim, needsOptions, options.length]);

  const canSave = Object.keys(errors).length === 0;

  const handleClose = () => {
    setTouched(false);
    onClose();
  };

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;

    const draft: SurveyVariantDraft = {
      week: weekNum,
      country: country.trim(),
      language: langTrim,
      question: questionTrim,
      responseType,
      options: needsOptions ? options : undefined,
    };

    onSave(draft);
    handleClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Survey Variant" : "Add Survey Variant"}
      description="Create localized survey content per country and language. If no survey exists for a locale, the app should hide the survey for that locale."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave && touched}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Locale */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {COUNTRY_CATALOG.map((c) => (
                <option key={c.id} value={c.country} className="bg-black">
                  {c.country}
                </option>
              ))}
            </select>
            {touched && errors.country && (
              <div className="mt-1 text-[11px] text-rose-200">{errors.country}</div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {countryLanguages.map((l) => (
                <option key={l} value={l} className="bg-black">
                  {l}
                </option>
              ))}
            </select>
            {touched && errors.language && (
              <div className="mt-1 text-[11px] text-rose-200">{errors.language}</div>
            )}
          </div>
        </div>

        {/* Week + Type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Response Type
            </label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value as SurveyResponseType)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {RESPONSE_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-black">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {touched && errors.week && (
          <div className="-mt-2 text-[11px] text-rose-200">{errors.week}</div>
        )}

        {/* Question */}
        <TextField
          label="Question"
          placeholder="Which drill helped you most this week?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {touched && errors.question && (
          <div className="-mt-2 text-[11px] text-rose-200">{errors.question}</div>
        )}

        {/* MCQ options */}
        {isMcqEnabled(responseType) && (
          <>
            <TextField
              label="Multiple Choice Options (comma-separated)"
              placeholder="Option A, Option B, Option C"
              value={optionsRaw}
              onChange={(e) => setOptionsRaw(e.target.value)}
              hint="Minimum 2 options required."
            />
            {touched && errors.options && (
              <div className="-mt-2 text-[11px] text-rose-200">{errors.options}</div>
            )}
          </>
        )}

        {/* Info */}
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">W{weekNum}</Badge>
            <Badge variant="neutral">{country}</Badge>
            <Badge variant="neutral">{language}</Badge>
            <Badge variant="neutral">{responseType}</Badge>
            {isFreeFormEnabled(responseType) && <Badge variant="warning">Free form enabled</Badge>}
            {isMcqEnabled(responseType) && <Badge variant="success">MCQ enabled</Badge>}
          </div>

          <div className="mt-2 text-xs text-slate-300">
            <span className="font-medium text-slate-100">App rule:</span>{" "}
            If there is no survey variant for a user’s country/language, the app should not show the
            survey at all.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default SurveyManagerSlideOver;
