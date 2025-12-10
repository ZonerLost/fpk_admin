import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import type { RecordingItem } from "./types";

type Props = {
  recordings: RecordingItem[];
  onView: (row: RecordingItem) => void;
  onRemove?: (id: string) => void;
};

const AcademyRecordingsTable: React.FC<Props> = ({
  recordings,
  onView,
  onRemove,
}) => {
  const columns: Column<RecordingItem>[] = [
    {
      id: "title",
      header: "Title",
      cell: (row) => (
        <div className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-100">
            {row.displayTitle || row.title}
          </span>
          {row.releaseLabel && (
            <span className="block truncate text-[10px] text-emerald-200">
              {row.releaseLabel}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "countryLang",
      header: "Country / Lang",
      width: "10rem",
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
      width: "7.5rem",
      align: "center",
      cell: (row) => (
        <span className="text-xs text-slate-100 md:text-sm">
          W{row.week} #{row.position}
        </span>
      ),
    },
    {
      id: "access",
      header: "Access",
      width: "7rem",
      cell: (row) => {
        const variant =
          row.access === "Pro"
            ? "success"
            : row.access === "Registered"
            ? "neutral"
            : "warning";
        return <Badge variant={variant}>{row.access}</Badge>;
      },
    },
    {
      id: "section",
      header: "Section",
      width: "9rem",
      cell: (row) => (
        <Badge variant="neutral">
          {row.bucket === "currentWeek" ? "Current Week" : "Past"}
        </Badge>
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
      title="Academy Content List"
      subtitle="Admin list for current-week + past recordings, localized by country & language."
      className="bg-[#04130d]"
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={recordings}
        getRowKey={(row) => row.id}
        containerClassName="max-w-full overflow-x-auto scrollbar-thin"
      />
    </SectionCard>
  );
};

export default AcademyRecordingsTable;
