import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Button from "../../shared/inputs/Button";
import TagPill from "../../shared/data-display/TagPill";
import Badge from "../../shared/data-display/Badge";
import Avatar from "../../shared/data-display/Avatar";
import type { ContentItem } from "./types";
import { normalizePurposeLabel } from "./content.constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;

  onEdit: (item: ContentItem) => void;
  onDeleteRequest: (item: ContentItem) => void;
};

const ContentDetailsSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  onEdit,
  onDeleteRequest,
}) => {
  if (!item) return null;

  const statusLabel =
    item.status === "published"
      ? "Published"
      : item.status === "scheduled"
      ? "Scheduled"
      : "Draft";

  const statusVariant =
    item.status === "published"
      ? "success"
      : item.status === "scheduled"
      ? "warning"
      : "neutral";

  const sourceDisplay =
    item.sourceType === "link"
      ? item.sourceUrl ?? "N/A"
      : item.fileName ?? "N/A";

  const publishDisplay =
    item.status === "scheduled" ? item.publishAt ?? "N/A" : null;

  const deletable = item.isDeletable !== false;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Content Details"
      description="Full metadata for this content item."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          <Button variant="secondary" onClick={() => onEdit(item)}>
            Edit / Replace
          </Button>

          <Button
            variant="secondary"
            className="text-red-200"
            disabled={!deletable}
            onClick={() => deletable && onDeleteRequest(item)}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <Avatar
            src={item.thumbnailUrl}
            name={item.title}
            variant="rounded"
            size="lg"
          />
          <div className="min-w-0">
            <div className="text-lg font-semibold text-white">{item.title}</div>

            <div className="mt-1 text-xs text-slate-400">
              Content ID: <span className="font-mono text-slate-200">{item.contentId}</span>
            </div>

            {item.groupKey && (
              <div className="mt-1 text-xs text-slate-400">
                Group Key: {item.groupKey}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="neutral">{item.type}</Badge>
              <TagPill>{item.category}</TagPill>
              <TagPill>{normalizePurposeLabel(item.purpose)}</TagPill>
              <TagPill>{item.access}</TagPill>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/5 bg-white/5 p-4 sm:grid-cols-2">
          <Detail label="Month / Week / Position" value={`M${item.month} · W${item.week} · #${item.positionInWeek}`} />
          <Detail label="Country" value={item.country} />
          <Detail label="Language" value={item.language} />

          <Detail label="Free for everyone" value={item.isFreeForEveryone ? "Yes" : "No"} />
          <Detail label="Free for registered" value={item.isFreeForRegistered ? "Yes" : "No"} />
          <Detail label="Free for academy" value={item.isAcademyFreeForRegistered ? "Yes" : "No"} />

          <Detail label="Upload Type" value={item.sourceType} />
          <Detail label="Source" value={sourceDisplay} />

          <Detail label="Deletable" value={deletable ? "Yes" : "No (Locked)"} />
          <Detail label="Status" value={statusLabel} />

          {publishDisplay && <Detail label="Publish At" value={publishDisplay} />}
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-300">Tags</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags?.length ? item.tags.map((t) => <TagPill key={t}>{t}</TagPill>) : (
              <span className="text-xs text-slate-500">No tags</span>
            )}
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    <div className="mt-1 text-sm text-slate-100">{value}</div>
  </div>
);

export default ContentDetailsSlideOver;
