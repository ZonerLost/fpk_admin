import React from "react";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import SlideOver from "../../shared/overlay/SlideOver";
import { type SurveyVariant } from "./types";

type Props = {
  isOpen: boolean;
  variant: SurveyVariant | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewResponses: () => void;
};

function responseTypeLabel(value: SurveyVariant["responseType"]) {
  if (value === "multipleChoice") return "Multiple Choice";
  if (value === "freeForm") return "Free Form";
  return "Both";
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const SurveyVariantDetailsModal: React.FC<Props> = ({
  isOpen,
  variant,
  onClose,
  onEdit,
  onDelete,
  onViewResponses,
}) => {
  if (!variant) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="Survey Variant Details"
        description="No survey variant selected."
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-slate-300">Select a row to view full details.</p>
      </SlideOver>
    );
  }

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Survey Variant Details"
      description="Review the full question, options, and locale metadata."
      footer={
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Button
            variant="secondary"
            className="h-10 rounded-full border border-white/10 bg-transparent px-4 text-xs font-semibold hover:bg-white/5"
            onClick={onViewResponses}
          >
            View Responses
          </Button>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              variant="secondary"
              className="h-10 rounded-full border border-white/10 bg-transparent px-4 text-xs font-semibold hover:bg-white/5"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              className="h-10 rounded-full border border-red-400/30 bg-transparent px-4 text-xs font-semibold text-red-200 hover:bg-red-500/10"
              onClick={onDelete}
            >
              Delete
            </Button>
            <Button variant="secondary" className="h-10 text-xs font-semibold" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{responseTypeLabel(variant.responseType)}</Badge>
            <Badge variant="neutral">{variant.language}</Badge>
            <Badge variant="neutral">Week {variant.week}</Badge>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-base font-semibold text-white">
            {variant.question}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Week {variant.week} | {variant.country} | {variant.language}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">Options</p>
          {variant.options.length ? (
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              {variant.options.map((option) => (
                <li key={option} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No options</p>
          )}
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
          <Detail label="Week" value={String(variant.week)} />
          <Detail label="Country" value={variant.country} />
          <Detail label="Language" value={variant.language} />
          <Detail label="Type" value={responseTypeLabel(variant.responseType)} />
          <Detail label="Created" value={formatDateTime(variant.createdAt)} />
        </div>
      </div>
    </SlideOver>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm text-slate-100">{value}</p>
  </div>
);

export default SurveyVariantDetailsModal;
