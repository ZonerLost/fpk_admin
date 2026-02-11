import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import { downloadCsv } from "../../shared/utils/downloadCsv";
import { getFeedbackUserType, type SurveyFeedbackItem } from "./types";

type Props = {
  isOpen: boolean;
  feedback: SurveyFeedbackItem | null;
  onClose: () => void;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusVariant(status: SurveyFeedbackItem["status"]) {
  return status === "resolved" ? ("success" as const) : ("warning" as const);
}

function statusLabel(status: SurveyFeedbackItem["status"]) {
  return status === "resolved" ? "Resolved" : "Open";
}

function typeVariant(type: SurveyFeedbackItem["type"]) {
  return type === "weeklySurvey" ? ("success" as const) : ("info" as const);
}

function typeLabel(type: SurveyFeedbackItem["type"]) {
  return type === "weeklySurvey" ? "Weekly Survey" : "Ask a Question";
}

function toCsvFilename(feedback: SurveyFeedbackItem) {
  if (feedback.type !== "weeklySurvey") return "survey-results.csv";

  const { week, localeCountry, localeLanguage } = feedback.weeklySurvey;
  const safeCountry = localeCountry.toLowerCase().replace(/\s+/g, "-");
  const safeLanguage = localeLanguage.toLowerCase().replace(/\s+/g, "-");
  return `weekly-survey-w${week}-${safeCountry}-${safeLanguage}.csv`;
}

const FeedbackDetailsSlideOver: React.FC<Props> = ({ isOpen, feedback, onClose }) => {
  if (!feedback) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="Feedback Details"
        description="No item selected."
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        <div className="text-sm text-slate-300">Select an item from the table to view details.</div>
      </SlideOver>
    );
  }

  const userType = getFeedbackUserType(feedback.user);

  const handleDownloadResults = () => {
    if (feedback.type !== "weeklySurvey") return;

    const data = feedback.weeklySurvey.responsesSummary.map((row) => ({
      week: feedback.weeklySurvey.week,
      country: feedback.weeklySurvey.localeCountry,
      language: feedback.weeklySurvey.localeLanguage,
      question: feedback.weeklySurvey.question,
      option: row.option,
      count: row.count,
      percent: `${row.percent}%`,
      totalResponses: feedback.weeklySurvey.totalResponses,
    }));

    downloadCsv(toCsvFilename(feedback), data);
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Feedback Details"
      description="Review response details and user context."
      footer={
        <>
          {feedback.type === "weeklySurvey" ? (
            <Button
              variant="secondary"
              className="h-9 rounded-full border border-white/15 bg-transparent px-4 text-xs"
              onClick={handleDownloadResults}
            >
              Download Results
            </Button>
          ) : null}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <Avatar src={feedback.user.avatarUrl} name={feedback.user.name} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">{feedback.user.name}</div>
            <div className="truncate text-xs text-slate-400">{feedback.user.email || feedback.user.userId}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{feedback.user.country}</Badge>
              <Badge variant="neutral">{feedback.user.language}</Badge>
              <Badge variant={userType === "Pro" ? "info" : userType === "Registered" ? "success" : "warning"}>
                {userType}
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={typeVariant(feedback.type)}>{typeLabel(feedback.type)}</Badge>
            <Badge variant={statusVariant(feedback.status)}>{statusLabel(feedback.status)}</Badge>
            <Badge variant="neutral">{formatDateTime(feedback.createdAt)}</Badge>
          </div>

          <h3 className="mt-3 text-base font-semibold text-white">{feedback.title}</h3>

          {feedback.type === "askQuestion" ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs font-semibold text-slate-300">Message</div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{feedback.askQuestion.message}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs font-semibold text-slate-300">Survey Question</div>
                <p className="mt-2 text-sm text-slate-100">{feedback.weeklySurvey.question}</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Detail label="Week" value={String(feedback.weeklySurvey.week)} />
                  <Detail
                    label="Locale"
                    value={`${feedback.weeklySurvey.localeCountry} / ${feedback.weeklySurvey.localeLanguage}`}
                  />
                  <Detail
                    label="Selected Option(s)"
                    value={feedback.weeklySurvey.selectedOptions.length ? feedback.weeklySurvey.selectedOptions.join(", ") : "-"}
                  />
                  <Detail
                    label="Free-form Answer"
                    value={feedback.weeklySurvey.freeFormAnswer || "-"}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300">Responses Summary</div>
                  <div className="text-[11px] text-slate-400">Total: {feedback.weeklySurvey.totalResponses}</div>
                </div>

                <div className="mt-3 space-y-2">
                  {feedback.weeklySurvey.responsesSummary.map((row) => (
                    <div key={row.option}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                        <span className="truncate pr-2">{row.option}</span>
                        <span className="shrink-0">
                          {row.count} ({row.percent}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${Math.max(0, Math.min(100, row.percent))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
          <Detail label="User ID" value={feedback.user.userId} />
          <Detail label="Country" value={feedback.user.country} />
          <Detail label="Language" value={feedback.user.language} />
          <Detail label="Account Status" value={feedback.user.accountStatus} />
          <Detail label="Registration" value={feedback.user.registrationStatus} />
          <Detail label="Plan" value={feedback.user.planStatus} />
        </div>
      </div>
    </SlideOver>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    <div className="mt-1 text-sm text-slate-100">{value}</div>
  </div>
);

export default FeedbackDetailsSlideOver;

