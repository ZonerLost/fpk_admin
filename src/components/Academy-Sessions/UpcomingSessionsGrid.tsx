import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import Badge from "../../shared/data-display/Badge";
import type { SessionItem } from "./types/types";
import { cn } from "../../shared/utils/cn";

type Props = {
  sessions: SessionItem[];
  onView: (session: SessionItem) => void;
};

const formatSessionDateTime = (date: string, time: string) => {
  try {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const d = new Date(year, month - 1, day, hour, minute);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
};

const UpcomingSessionsGrid: React.FC<Props> = ({ sessions, onView }) => {
  return (
    <SectionCard
      title="Upcoming (Current Week)"
      subtitle="Live training sessions scheduled for your players."
      className="bg-[#04130d]"
      contentClassName="pt-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {sessions.length === 0 && (
          <p className="text-xs text-slate-400 md:text-sm">
            No upcoming sessions scheduled yet.
          </p>
        )}

        {sessions.map((session) => {
          const displayTitle = session.displayTitle || session.title;

          return (
            <div
              key={session.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-[#052015] shadow-lg"
            >
              {session.thumbnailUrl ? (
                <div className="h-40 w-full overflow-hidden md:h-44">
                  <img
                    src={session.thumbnailUrl}
                    alt={displayTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-emerald-700 to-emerald-400 md:h-44" />
              )}

              <div className="flex flex-1 flex-col px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-white md:text-lg">
                    {displayTitle}
                  </h3>
                  <Badge variant="neutral">{session.language}</Badge>
                  <Badge variant="neutral">{session.country}</Badge>
                </div>

                <p className="mt-1 text-xs text-emerald-100 md:text-sm">
                  Hosted by {session.host} ·{" "}
                  {formatSessionDateTime(session.date, session.time)}
                </p>

                {!!session.releaseLabel && (
                  <p className="mt-1 text-[11px] text-emerald-200">
                    {session.releaseLabel}
                  </p>
                )}

                {session.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-300 md:text-sm">
                    {session.description}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onView(session)}
                    className={cn(
                      "rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
                    )}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default UpcomingSessionsGrid;
