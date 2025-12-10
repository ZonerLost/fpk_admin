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
        <Avatar
          src={row.thumbnailUrl}
          name={row.title}
          variant="rounded"
          size="lg"
        />
      ),
    },
    {
      id: "purpose",
      header: "Purpose",
      width: "9rem",
      cell: (row) => (
        <Badge variant="neutral">{row.purpose ?? "content"}</Badge>
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
      id: "countryLang",
      header: "Country / Lang",
      width: "9rem",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-slate-200">{row.country}</span>
          <span className="text-slate-400">{row.language}</span>
        </div>
      ),
    },
    {
      id: "week",
      header: "Week",
      width: "4rem",
      align: "center",
      cell: (row) => <span>{row.week}</span>,
    },
    {
      id: "position",
      header: "Position",
      width: "7rem",
      align: "center",
      cell: (row) => (
        <span className="text-xs text-slate-200">
          W{row.week} #{row.positionInWeek}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "8rem",
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
              <span className="text-[10px] text-slate-400">
                {row.publishAt}
              </span>
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
      {/* Delete confirm */}
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

      {/* Details (single source of truth for actions) */}
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
