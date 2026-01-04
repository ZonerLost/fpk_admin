import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import Button from "../../../shared/inputs/Button";
import Badge from "../../../shared/data-display/Badge";
import SlideOver from "../../../shared/overlay/SlideOver";
import TextField from "../../../shared/inputs/TextField";
import type { SurveyResponseType, SurveyVariant } from "../types/types";
import { COUNTRY_CATALOG } from "../../../shared/constants/locale";

type Props = {
  variants: SurveyVariant[];
  setVariants: React.Dispatch<React.SetStateAction<SurveyVariant[]>>;
  activeCountry: string; // "All" or specific
  activeLanguage: string; // "All" or specific
};

const RESPONSE_TYPES: { value: SurveyResponseType; label: string }[] = [
  { value: "multipleChoice", label: "Multiple Choice" },
  { value: "freeForm", label: "Free Form" },
  { value: "both", label: "Both" },
];

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const SurveyManagerCard: React.FC<Props> = ({ variants, setVariants, activeCountry, activeLanguage }) => {
  const visible = variants.filter((v) => {
    if (activeCountry !== "All" && v.country !== activeCountry) return false;
    if (activeLanguage !== "All" && v.language !== activeLanguage) return false;
    return true;
  });

  // editor state
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SurveyVariant | null>(null);

  const [week, setWeek] = React.useState("1");
  const [country, setCountry] = React.useState(COUNTRY_CATALOG[0]?.country ?? "Germany");
  const [language, setLanguage] = React.useState("EN");
  const [question, setQuestion] = React.useState("");
  const [responseType, setResponseType] = React.useState<SurveyResponseType>("multipleChoice");
  const [optionsRaw, setOptionsRaw] = React.useState("Option A, Option B");

  const resetEditor = () => {
    setEditing(null);
    setWeek("1");
    setCountry(COUNTRY_CATALOG[0]?.country ?? "Germany");
    setLanguage("EN");
    setQuestion("");
    setResponseType("multipleChoice");
    setOptionsRaw("Option A, Option B");
  };

  const openCreate = () => {
    resetEditor();
    // prefill with filters when not All
    if (activeCountry !== "All") setCountry(activeCountry);
    if (activeLanguage !== "All") setLanguage(activeLanguage);
    setOpen(true);
  };

  const openEdit = (v: SurveyVariant) => {
    setEditing(v);
    setWeek(String(v.week));
    setCountry(v.country);
    setLanguage(v.language);
    setQuestion(v.question);
    setResponseType(v.responseType ?? "multipleChoice");
    setOptionsRaw((v.options ?? []).join(", "));
    setOpen(true);
  };

  const save = () => {
    const w = Number(week) || 1;
    if (!question.trim()) return;

    const options =
      responseType === "multipleChoice" || responseType === "both"
        ? optionsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    if ((responseType === "multipleChoice" || responseType === "both") && (!options || options.length < 2)) {
      return;
    }

    if (!editing) {
      const next: SurveyVariant = {
        id: `sv-${Date.now()}`,
        week: w,
        country,
        language,
        question: question.trim(),
        responseType,
        options,
        responsesCount: 0,
      };
      setVariants((prev) => [next, ...prev]);
    } else {
      setVariants((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                week: w,
                country,
                language,
                question: question.trim(),
                responseType,
                options,
              }
            : x
        )
      );
    }

    setOpen(false);
    resetEditor();
  };

  const remove = (id: string) => setVariants((prev) => prev.filter((x) => x.id !== id));

  const download = (v: SurveyVariant) => {
    downloadCsv(`survey_week${v.week}_${v.country}_${v.language}.csv`, [
      ["Week", "Country", "Language", "Question", "ResponseType", "Options", "ResponsesCount"],
        [
          String(v.week),
          v.country,
          v.language,
          v.question,
          v.responseType ?? v.responseMode ?? "—",
          (v.options ?? []).join(" | "),
          String(v.responsesCount),
        ],
      ]);
  };

  return (
    <>
      <SectionCard
        title="Current Week Survey"
        subtitle="Enter survey content per country & language. If no variant exists for a locale, the app should not show the survey for that locale."
        className="bg-[#04130d]"
        contentClassName="space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 md:text-sm">
            Showing variants matching your filters.
          </div>
          <Button
            variant="primary"
            className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            onClick={openCreate}
          >
            + Add Survey Variant
          </Button>
        </div>

        {visible.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs text-slate-300">
              No survey content entered for this filter selection.
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              App rule: survey should be hidden for this country/language when empty.
            </div>
          </div>
        )}

        <div className="space-y-2">
          {visible.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/3 p-3 md:flex-row md:items-start md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">W{v.week}</Badge>
                  <Badge variant="neutral">{v.country}</Badge>
                  <Badge variant="neutral">{v.language}</Badge>
                  <Badge variant="neutral">{v.responseType}</Badge>
                  <Badge variant="neutral">{v.responsesCount} responses</Badge>
                </div>

                <div className="mt-2 text-sm font-medium text-white">{v.question}</div>

                {(v.responseType === "multipleChoice" || v.responseType === "both") && (
                  <div className="mt-1 text-xs text-slate-300">
                    Options: {(v.options ?? []).join(" · ")}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs"
                  onClick={() => openEdit(v)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs"
                  onClick={() => download(v)}
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs text-rose-200"
                  onClick={() => remove(v.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Editor */}
      <SlideOver
        isOpen={open}
        onClose={() => {
          setOpen(false);
          resetEditor();
        }}
        title={editing ? "Edit Survey Variant" : "Add Survey Variant"}
        description="Create localized survey content. Supports multiple choice, free form, or both."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setOpen(false);
                resetEditor();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={save} disabled={!question.trim()}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Week"
              type="number"
              min={1}
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />

            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">Response Type</label>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">Country</label>
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
            </div>

            <TextField
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              hint="Use codes like EN, DE, ES…"
            />
          </div>

          <TextField
            label="Question"
            placeholder="Which drill helped you most this week?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {(responseType === "multipleChoice" || responseType === "both") && (
            <TextField
              label="Multiple Choice Options (comma-separated)"
              value={optionsRaw}
              onChange={(e) => setOptionsRaw(e.target.value)}
              hint="At least 2 options required."
            />
          )}

          {responseType === "freeForm" || responseType === "both" ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300">
              Free-form responses will be collected in the app and can be exported later.
            </div>
          ) : null}
        </div>
      </SlideOver>
    </>
  );
};

export default SurveyManagerCard;
