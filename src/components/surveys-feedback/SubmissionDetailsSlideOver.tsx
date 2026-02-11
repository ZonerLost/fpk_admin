import React from "react";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import SlideOver from "../../shared/overlay/SlideOver";
import { getSubmissionUserType, type SubmissionItem } from "./types";

type Props = {
  isOpen: boolean;
  submission: SubmissionItem | null;
  onClose: () => void;
};

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

function responseTypeLabel(value: "multipleChoice" | "freeForm" | "both") {
  if (value === "multipleChoice") return "Multiple Choice";
  if (value === "freeForm") return "Free Form";
  return "Both";
}

const SubmissionDetailsSlideOver: React.FC<Props> = ({
  isOpen,
  submission,
  onClose,
}) => {
  if (!submission) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="Submission Details"
        description="No submission selected."
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-slate-300">
          Select a row to view full details.
        </p>
      </SlideOver>
    );
  }

  const userType = getSubmissionUserType(submission.user);

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Submission Details"
      description="Review full response and user context."
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <Avatar src={submission.user.avatarUrl} name={submission.user.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">
              {submission.user.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {submission.user.email || submission.user.userId}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{submission.user.country}</Badge>
              <Badge variant="neutral">{submission.user.language}</Badge>
              <Badge
                variant={
                  userType === "Pro"
                    ? "info"
                    : userType === "Registered"
                    ? "success"
                    : "warning"
                }
              >
                {userType}
              </Badge>
              <Badge variant="neutral">{formatDateTime(submission.createdAt)}</Badge>
            </div>
          </div>
        </div>

        {submission.type === "AskQuestion" ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Ask a Question
            </h3>
            <p className="mt-3 text-base font-semibold text-white">
              {submission.askQuestion.question}
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="whitespace-pre-wrap text-sm text-slate-200">
                {submission.askQuestion.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Weekly Survey Response
            </h3>
            <p className="text-base font-semibold text-white">
              {submission.weeklySurvey.question}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Week" value={String(submission.weeklySurvey.week)} />
              <Detail
                label="Response Type"
                value={responseTypeLabel(submission.weeklySurvey.responseType)}
              />
              <Detail
                label="Selected Option(s)"
                value={
                  submission.weeklySurvey.selectedOptions.length
                    ? submission.weeklySurvey.selectedOptions.join(", ")
                    : "-"
                }
              />
              <Detail
                label="Free Form Answer"
                value={submission.weeklySurvey.freeFormAnswer || "-"}
              />
            </div>

            {(submission.weeklySurvey.responseType === "multipleChoice" ||
              submission.weeklySurvey.responseType === "both") && (
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-slate-300">
                  All Options
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-200">
                  {submission.weeklySurvey.options.map((option) => (
                    <li key={option}>• {option}</li>
                  ))}
                </ul>
              </div>
            )}

            {submission.weeklySurvey.breakdown?.length ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-slate-300">
                  Option Breakdown
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-200">
                  {submission.weeklySurvey.breakdown.map((item) => (
                    <li key={item.option}>
                      • {item.option}: {item.count} ({item.percent}%)
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
          <Detail label="User ID" value={submission.user.userId} />
          <Detail label="Account Status" value={submission.user.accountStatus} />
          <Detail label="Registration" value={submission.user.registrationStatus} />
          <Detail label="Plan" value={submission.user.planStatus} />
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

export default SubmissionDetailsSlideOver;
