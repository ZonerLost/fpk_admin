import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import TagPill from "../../shared/data-display/TagPill";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import ConfirmDialog from "../../shared/overlay/ConfirmDialog";
import type { ContentItem } from "./types";
import ContentDetailsSlideOver from "./ContentDetailSlideOver";
import { normalizePurposeLabel } from "./content.constants";

type Props = {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
};

const ContentTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  const [selected, setSelected] = React.useState<ContentItem | null>(null);
  const [toDelete, setToDelete] = React.useState<ContentItem | null>(null);

  const columns: Column<ContentItem>[] = [
    {
      id: "thumb",
      header: "Thumbnail",
      width: "5rem",
      cell: (row) => (
        <Avatar src={row.thumbnailUrl} name={row.title} variant="rounded" size="lg" />
      ),
    },
    {
      id: "contentId",
      header: "Content ID",
      width: "7.5rem",
      cell: (row) => <span className="font-mono text-xs text-slate-200">{row.contentId}</span>,
    },
    {
      id: "title",
      header: "Title",
      width: "18rem",
      cell: (row) => (
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-100">{row.title}</div>
          {row.groupKey && <div className="truncate text-[11px] text-slate-400">{row.groupKey}</div>}
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      width: "6rem",
      cell: (row) => <Badge variant="neutral">{row.type}</Badge>,
    },
    {
      id: "category",
      header: "Category",
      width: "8rem",
      cell: (row) => <TagPill>{row.category}</TagPill>,
    },
    {
      id: "purpose",
      header: "Purpose",
      width: "10rem",
      cell: (row) => <Badge variant="neutral">{normalizePurposeLabel(row.purpose)}</Badge>,
    },
    {
      id: "country",
      header: "Country",
      width: "8rem",
      cell: (row) => <span className="text-xs text-slate-200">{row.country}</span>,
    },
    {
      id: "language",
      header: "Language",
      width: "6rem",
      cell: (row) => <span className="text-xs text-slate-200">{row.language}</span>,
    },
    {
      id: "monthWeek",
      header: "M / W / Pos",
      width: "8rem",
      align: "center",
      cell: (row) => (
        <span className="text-xs text-slate-200">
          M{row.month} · W{row.week} · #{row.positionInWeek}
        </span>
      ),
    },
    {
      id: "access",
      header: "Access",
      width: "6rem",
      cell: (row) => <TagPill>{row.access}</TagPill>,
    },
    {
      id: "status",
      header: "Status",
      width: "9rem",
      align: "right",
      cell: (row) => {
        const label =
          row.status === "published"
            ? "Published"
            : row.status === "scheduled"
            ? "Scheduled"
            : "Draft";

        const variant =
          row.status === "published"
            ? "success"
            : row.status === "scheduled"
            ? "warning"
            : "neutral";

        return (
          <div className="flex flex-col items-end gap-1">
            <Badge variant={variant}>{label}</Badge>
            {row.status === "scheduled" && row.publishAt && (
              <span className="text-[10px] text-slate-400">{row.publishAt}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "view",
      header: "Actions",
      width: "8rem",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="h-8 px-3 text-[11px]"
            onClick={() => setSelected(row)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ConfirmDialog
        isOpen={!!toDelete}
        title="Delete content?"
        description={
          toDelete?.isDeletable === false
            ? "This content is locked and cannot be deleted."
            : "This action cannot be undone. Are you sure?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) onDelete(toDelete);
          setToDelete(null);
          setSelected(null);
        }}
      />

      <ContentDetailsSlideOver
        isOpen={!!selected}
        item={selected}
        onClose={() => setSelected(null)}
        onEdit={(item: ContentItem) => {
          setSelected(null);
          onEdit(item);
        }}
        onDeleteRequest={(item: ContentItem) => {
          setSelected(null);
          setTimeout(() => setToDelete(item), 0);
        }}
      />

      <SectionCard className="bg-[#15120e]" contentClassName="p-0">
        <DataTable
          columns={columns}
          data={items}
          getRowKey={(row) => row.id}
          containerClassName="max-w-full overflow-x-auto scrollbar-thin"
        />
      </SectionCard>
    </>
  );
};

export default ContentTable;
