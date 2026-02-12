import React from "react";
import { FiChevronRight } from "react-icons/fi";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import TextClamp from "../../shared/typography/TextClamp";
import { cn } from "../../shared/utils/cn";
import { type SurveyVariant } from "./types";

type Props = {
  row: SurveyVariant;
  onOpenDetails: (row: SurveyVariant) => void;
};

const DESKTOP_GRID_CLASS =
  "md:grid-cols-[160px_minmax(0,2fr)_minmax(0,1.5fr)_160px_44px]";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function responseTypeLabel(value: SurveyVariant["responseType"]) {
  if (value === "multipleChoice") return "Multiple Choice";
  if (value === "freeForm") return "Free Form";
  return "Both";
}

function languageCode(language: string) {
  const letters = language.match(/[A-Za-z]/g);
  if (!letters || letters.length === 0) return language.slice(0, 2).toUpperCase();
  return letters.slice(0, 2).join("").toUpperCase();
}

function optionsPreview(options: string[]) {
  return Array.isArray(options) && options.length ? options.join(", ") : "No options";
}

const SurveyBuilderListRow: React.FC<Props> = ({ row, onOpenDetails }) => {
  const meta = `Week ${row.week} | ${row.country} | ${languageCode(row.language)}`;
  const created = formatDate(row.createdAt);
  const optionText = optionsPreview(row.options);
  const hasOptions = row.options.length > 0;

  return (
    <article className="px-4 py-3 transition-colors hover:bg-white/[0.04]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 md:hidden">
        <div className="min-w-0 flex flex-wrap items-center gap-1.5">
          <Badge variant="info" className="h-6 px-2.5">
            {responseTypeLabel(row.responseType)}
          </Badge>
          <Badge variant="neutral" className="h-6 px-2.5">
            {row.language}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300">{created}</span>
          <ActionButton onClick={() => onOpenDetails(row)} />
        </div>

        <div className="col-span-2 min-w-0 space-y-1">
          <div title={row.question}>
            <TextClamp lines={2} className="text-sm font-medium leading-5 text-slate-100">
              {row.question}
            </TextClamp>
          </div>
          <p className="truncate text-xs text-slate-400" title={meta}>
            {meta}
          </p>
          <p
            className={cn("truncate text-xs", hasOptions ? "text-slate-300" : "italic text-slate-400")}
            title={optionText}
          >
            {optionText}
          </p>
        </div>
      </div>

      <div className={`hidden items-center gap-3 md:grid ${DESKTOP_GRID_CLASS}`}>
        <div className="min-w-0 flex flex-wrap items-center gap-1.5">
          <Badge variant="info" className="h-6 px-2.5">
            {responseTypeLabel(row.responseType)}
          </Badge>
          <Badge variant="neutral" className="h-6 px-2.5">
            {row.language}
          </Badge>
        </div>

        <div className="min-w-0 space-y-1">
          <div title={row.question}>
            <TextClamp lines={2} className="text-sm font-medium leading-5 text-slate-100">
              {row.question}
            </TextClamp>
          </div>
          <p className="truncate text-xs text-slate-400" title={meta}>
            {meta}
          </p>
        </div>

        <div className="min-w-0">
          <p
            className={cn("truncate text-sm", hasOptions ? "text-slate-300" : "italic text-slate-400")}
            title={optionText}
          >
            {optionText}
          </p>
        </div>

        <div className="min-w-0">
          <span className="text-xs text-slate-300">{created}</span>
        </div>

        <div className="flex justify-end">
          <ActionButton onClick={() => onOpenDetails(row)} />
        </div>
      </div>
    </article>
  );
};

const ActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    variant="secondary"
    className="h-8 w-8 rounded-full border border-white/15 bg-transparent p-0"
    onClick={onClick}
    aria-label="View survey variant details"
    title="View details"
  >
    <FiChevronRight className="h-4 w-4" />
  </Button>
);

export default SurveyBuilderListRow;
