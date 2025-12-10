import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Badge from "../../shared/data-display/Badge";
import TagPill from "../../shared/data-display/TagPill";
import Button from "../../shared/inputs/Button";
import type { RecordingItem } from "./types";

type Props = {
  isOpen: boolean;
  recording: RecordingItem | null;
  onClose: () => void;
  onRemove?: (id: string) => void;
};

const RecordingDetailsSlideOver: React.FC<Props> = ({
  isOpen,
  recording,
  onClose,
  onRemove,
}) => {
  if (!recording) {
    return (
      <SlideOver isOpen={isOpen} onClose={onClose} title="Recording Details">
        <div className="text-xs text-slate-400">No item selected.</div>
      </SlideOver>
    );
  }

  const title = recording.displayTitle || recording.title;

  const bucketLabel =
    recording.bucket === "currentWeek" ? "Current Week" : "Past Recording";

  const accessVariant =
    recording.access === "Pro"
      ? "success"
      : recording.access === "Registered"
      ? "neutral"
      : "warning";

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Recording Details"
      description="Full metadata for this Academy content item."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onRemove && (
            <Button
              variant="danger"
              onClick={() => onRemove(recording.id)}
            >
              Remove
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Title</div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {!!recording.releaseLabel && (
            <div className="mt-1 text-xs text-emerald-200">
              {recording.releaseLabel}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Country / Language</div>
            <div className="text-sm text-slate-100">
              {recording.country} · {recording.language}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Week / Position</div>
            <div className="text-sm text-slate-100">
              Week {recording.week} · #{recording.position}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Host</div>
            <div className="text-sm text-slate-100">{recording.host}</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Date / Duration</div>
            <div className="text-sm text-slate-100">
              {recording.date} · {recording.duration}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={accessVariant}>{recording.access}</Badge>
          <Badge variant="neutral">{bucketLabel}</Badge>
          <Badge variant="neutral">{recording.views} views</Badge>
        </div>

        {!!recording.tags?.length && (
          <div>
            <div className="mb-1 text-xs text-slate-400">Tags</div>
            <div className="flex flex-wrap gap-1">
              {recording.tags.map((t) => (
                <TagPill key={t}>{t}</TagPill>
              ))}
            </div>
          </div>
        )}

        {!!recording.description && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Description</div>
            <div className="text-sm text-slate-200">{recording.description}</div>
          </div>
        )}

        {!!recording.assetUrl && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Asset Link (demo)</div>
            <div className="truncate text-xs text-slate-200">
              {recording.assetUrl}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default RecordingDetailsSlideOver;
