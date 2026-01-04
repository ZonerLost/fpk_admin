import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import type { AcademyContentItem } from "./types/types";
import { formatReleaseDisplay } from "./utils/academy.utils";

type Props = {
  title: string;
  subtitle?: string;
  rows: AcademyContentItem[];
  onView: (row: AcademyContentItem) => void;
  onRemove?: (id: string) => void;
};

const AcademyContentTable: React.FC<Props> = ({ title, subtitle, rows, onView, onRemove }) => {
  const columns: Column<AcademyContentItem>[] = [
    {
      id: "contentId",
      header: "Content ID",
      width: "9rem",
      cell: (row) => <span className="text-xs text-slate-100 md:text-sm">{row.contentId}</span>,
    },
    {
      id: "title",
      header: "Title",
      cell: (row) => (
        <div className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-100">
            {row.displayTitle || row.title}
          </span>
          <span className="block truncate text-[10px] text-slate-400">
            Hosted by {row.host}
          </span>
        </div>
      ),
    },
    {
      id: "locale",
      header: "Country / Lang",
      width: "11rem",
      cell: (row) => (
        <div className="text-xs text-slate-200 md:text-sm">
          <div>{row.country}</div>
          <div className="text-[10px] text-slate-400">{row.language}</div>
        </div>
      ),
    },
    {
      id: "weekPos",
      header: "Week / Pos",
      width: "8rem",
      align: "center",
      cell: (row) => (
        <span className="text-xs text-slate-100 md:text-sm">
          W{row.week} #{row.position}
        </span>
      ),
    },
    {
      id: "release",
      header: "Release (Local)",
      width: "16rem",
      cell: (row) => (
        <span className="text-xs text-slate-200 md:text-sm">
          {formatReleaseDisplay(row.country, row.releaseDate, row.releaseTime)}
        </span>
      ),
    },
    {
      id: "access",
      header: "Access",
      width: "9rem",
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={row.access === "Pro" ? "success" : "neutral"}>
            {row.access}
          </Badge>
          {row.freeForRegistered && (
            <Badge variant="warning">Free (Registered)</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      width: "12rem",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs"
            onClick={() => onView(row)}
          >
            View
          </Button>

          {onRemove && (
            <Button
              variant="secondary"
              className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs"
              onClick={() => onRemove(row.id)}
            >
              Remove
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      className="bg-[#04130d]"
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        containerClassName="max-w-full overflow-x-auto no-scrollbar"
      />
    </SectionCard>
  );
};

export default AcademyContentTable;
