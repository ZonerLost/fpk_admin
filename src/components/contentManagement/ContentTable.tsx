import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import TagPill from "../../shared/data-display/TagPill";
import Badge from "../../shared/data-display/Badge";
import type { ContentItem } from "./types";

type Props = {
  items: ContentItem[];
};

const ContentTable: React.FC<Props> = ({ items }) => {
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
      id: "title",
      header: "Title",
      cell: (row) => (
        <span className="text-sm font-medium text-slate-100">
          {row.title}
        </span>
      ),
    },
    {
      id: "type",
      header: "Type",
      width: "6rem",
      cell: (row) => <Badge variant="neutral">{row.type}</Badge>,
    },
    {
      id: "week",
      header: "Week",
      width: "4rem",
      align: "center",
      cell: (row) => <span>{row.week}</span>,
    },
    {
      id: "access",
      header: "Access",
      width: "6rem",
      cell: (row) => (
        <TagPill className="bg-[#24201a] text-xs">{row.access}</TagPill>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.map((tag) => (
            <TagPill key={tag}>{tag}</TagPill>
          ))}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "7rem",
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

        return <Badge variant={variant}>{label}</Badge>;
      },
    },
  ];

  return (
    <SectionCard
      className="bg-[#15120e]"
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={items}
        getRowKey={(row) => row.id}
      />
    </SectionCard>
  );
};

export default ContentTable;
