import React from "react";
import Button from "../../shared/inputs/Button";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import type { WeeklySurveyDefinitionDraft } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  countryOptions: string[];
  languageOptions: string[];
  countryLanguageMap: Record<string, string[]>;
  initialDraft?: WeeklySurveyDefinitionDraft | null;
  mode?: "create" | "edit";
  onSave: (draft: WeeklySurveyDefinitionDraft) => void;
};

type Errors = {
  week?: string;
  question?: string;
  options?: string;
};

const WeeklySurveyEditorSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  countryOptions,
  languageOptions,
  countryLanguageMap,
  initialDraft,
  mode = "create",
  onSave,
}) => {
  const [week, setWeek] = React.useState("1");
  const [country, setCountry] = React.useState(countryOptions[0] || "");
  const [language, setLanguage] = React.useState(languageOptions[0] || "");
  const [responseType, setResponseType] =
    React.useState<WeeklySurveyDefinitionDraft["responseType"]>("multipleChoice");
  const [question, setQuestion] = React.useState("");
  const [optionsInput, setOptionsInput] = React.useState("");
  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    if (!isOpen) return;
    setWeek(String(initialDraft?.week ?? 1));
    setCountry(initialDraft?.country ?? (countryOptions[0] || ""));
    setLanguage(initialDraft?.language ?? (languageOptions[0] || ""));
    setResponseType(initialDraft?.responseType ?? "multipleChoice");
    setQuestion(initialDraft?.question ?? "");
    setOptionsInput((initialDraft?.options ?? []).join(", "));
    setErrors({});
  }, [isOpen, countryOptions, languageOptions, initialDraft]);

  const availableLanguages = React.useMemo(() => {
    return countryLanguageMap[country] ?? languageOptions;
  }, [country, countryLanguageMap, languageOptions]);

  React.useEffect(() => {
    if (!availableLanguages.includes(language)) {
      setLanguage(availableLanguages[0] || "");
    }
  }, [availableLanguages, language]);

  const needsOptions = responseType === "multipleChoice" || responseType === "both";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Errors = {};

    const parsedWeek = Number(week);
    if (!Number.isFinite(parsedWeek) || parsedWeek < 1) {
      nextErrors.week = "Week must be 1 or greater.";
    }

    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      nextErrors.question = "Question is required.";
    }

    const options = optionsInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (needsOptions && options.length < 2) {
      nextErrors.options = "Provide at least 2 options for MCQ/Both.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      week: parsedWeek,
      country,
      language,
      responseType,
      question: cleanQuestion,
      options: needsOptions ? options : [],
    });
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Edit Weekly Survey" : "Add Weekly Survey"}
      description="Create a weekly survey definition by locale and response type."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === "edit" ? "Update Survey" : "Save Survey"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            type="number"
            min={1}
            label="Week"
            value={week}
            onChange={(event) => setWeek(event.target.value)}
            className="h-10"
            error={errors.week}
          />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-200 md:text-sm">
              Response Type
            </label>
            <select
              value={responseType}
              onChange={(event) =>
                setResponseType(
                  event.target.value as WeeklySurveyDefinitionDraft["responseType"]
                )
              }
              className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              <option value="multipleChoice" className="bg-black">
                Multiple Choice
              </option>
              <option value="freeForm" className="bg-black">
                Free Form
              </option>
              <option value="both" className="bg-black">
                Both
              </option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-200 md:text-sm">
              Country
            </label>
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {countryOptions.map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-200 md:text-sm">
              Language
            </label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {availableLanguages.map((option) => (
                <option key={option} value={option} className="bg-black">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-200 md:text-sm">
            Question
          </label>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:ring md:text-sm"
            placeholder="Enter survey question..."
          />
          {errors.question ? (
            <p className="mt-1 text-[11px] text-red-400 md:text-xs">{errors.question}</p>
          ) : null}
        </div>

        {needsOptions ? (
          <TextField
            label="Options (comma-separated)"
            value={optionsInput}
            onChange={(event) => setOptionsInput(event.target.value)}
            placeholder="Option A, Option B, Option C"
            className="h-10"
            error={errors.options}
          />
        ) : null}
      </form>
    </SlideOver>
  );
};

export default WeeklySurveyEditorSlideOver;
