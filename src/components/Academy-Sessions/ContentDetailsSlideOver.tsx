import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Badge from "../../shared/data-display/Badge";
import TagPill from "../../shared/data-display/TagPill";
import Button from "../../shared/inputs/Button";
import type { AcademyContentItem } from "./types/types";
import { formatReleaseDisplay } from "./utils/academy.utils";

type Props = {
  isOpen: boolean;
  item: AcademyContentItem | null;
  onClose: () => void;
  onRemove?: (id: string) => void;
};

const ContentDetailsSlideOver: React.FC<Props> = ({ isOpen, item, onClose, onRemove }) => {
  if (!item) {
    return (
      <SlideOver isOpen={isOpen} onClose={onClose} title="Content Details">
        <div className="text-xs text-slate-400">No item selected.</div>
      </SlideOver>
    );
  }

  const title = item.displayTitle || item.title;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Content Details"
      description="Metadata for this weekly release item."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {onRemove && (
            <Button variant="danger" onClick={() => onRemove(item.id)}>
              Remove
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Thumbnail */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/3">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={title} className="h-40 w-full object-cover" />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-emerald-700 to-emerald-400" />
          )}
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Content ID</div>
          <div className="text-sm font-semibold text-white">{item.contentId}</div>
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Title</div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs text-slate-300">Hosted by {item.host}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Country / Language</div>
            <div className="text-sm text-slate-100">
              {item.country} · {item.language}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Week / Position</div>
            <div className="text-sm text-slate-100">
              Week {item.week} · #{item.position}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-slate-400">Release (Local)</div>
          <div className="text-sm text-slate-100">
            {formatReleaseDisplay(item.country, item.releaseDate, item.releaseTime)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={item.access === "Pro" ? "success" : "neutral"}>{item.access}</Badge>
          {item.freeForRegistered && <Badge variant="warning">Free (Registered)</Badge>}
          <Badge variant="neutral">{item.bucket === "currentWeek" ? "Current Week" : "Past Weeks"}</Badge>
          {!!item.views && <Badge variant="neutral">{item.views} views</Badge>}
          {!!item.duration && <Badge variant="neutral">{item.duration}</Badge>}
        </div>

        {!!item.tags?.length && (
          <div>
            <div className="mb-1 text-xs text-slate-400">Tags</div>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => <TagPill key={t}>{t}</TagPill>)}
            </div>
          </div>
        )}

        {!!item.description && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Description</div>
            <div className="text-sm text-slate-200">{item.description}</div>
          </div>
        )}

        {!!item.assetUrl && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-slate-400">Asset Link (demo)</div>
            <div className="truncate text-xs text-slate-200">{item.assetUrl}</div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default ContentDetailsSlideOver;
