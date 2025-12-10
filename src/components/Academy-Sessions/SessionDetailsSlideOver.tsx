import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import type { SessionItem } from "./types";

type Props = {
  isOpen: boolean;
  session: SessionItem | null;
  onClose: () => void;
};

const formatSessionDateTime = (date: string, time: string) => {
  try {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const d = new Date(year, month - 1, day, hour, minute);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
};

const SessionDetailsSlideOver: React.FC<Props> = ({
  isOpen,
  session,
  onClose,
}) => {
  if (!session) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="Session Details"
      >
        <div className="text-xs text-slate-400">No session selected.</div>
      </SlideOver>
    );
  }

  const title = session.displayTitle || session.title;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Session Details"
      description="Full metadata for this upcoming academy session."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Thumbnail */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/3">
          {session.thumbnailUrl ? (
            <img
              src={session.thumbnailUrl}
              alt={title}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-emerald-700 to-emerald-400" />
          )}
        </div>

        {/* Title + Release label */}
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Title</div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {!!session.releaseLabel && (
            <div className="mt-1 text-xs text-emerald-200">
              {session.releaseLabel}
            </div>
          )}
        </div>

        {/* Locale + Week */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Country / Language</div>
            <div className="text-sm text-slate-100">
              {session.country} · {session.language}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Week</div>
            <div className="text-sm text-slate-100">Week {session.week}</div>
          </div>
        </div>

        {/* Host + Type */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Host</div>
            <div className="text-sm text-slate-100">{session.host}</div>
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Session Type</div>
            <div className="text-sm text-slate-100">{session.sessionType}</div>
          </div>
        </div>

        {/* Date/time */}
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Scheduled</div>
          <div className="text-sm text-slate-100">
            {formatSessionDateTime(session.date, session.time)}
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{session.country}</Badge>
          <Badge variant="neutral">{session.language}</Badge>
          <Badge variant="neutral">{session.sessionType}</Badge>
        </div>

        {/* Description */}
        {!!session.description && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Description</div>
            <div className="text-sm text-slate-200">{session.description}</div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default SessionDetailsSlideOver;
