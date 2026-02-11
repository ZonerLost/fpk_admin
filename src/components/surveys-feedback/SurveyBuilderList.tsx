import React from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import { truncateText } from "../../shared/lib/text";
import { type SurveyVariant } from "./types";

type Props = {
  rows: SurveyVariant[];
  weekOptions: number[];
  weekFilter: number | "All";
  onWeekFilterChange: (value: number | "All") => void;
  onAdd: () => void;
  onEdit: (row: SurveyVariant) => void;
  onRemove: (row: SurveyVariant) => void;
  onViewResponses: (row: SurveyVariant) => void;
};

const STICKY_HEADER_CLASS = "sticky top-0 z-10 bg-black/40 backdrop-blur";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function responseTypeLabel(value: SurveyVariant["responseType"]) {
  if (value === "multipleChoice") return "Multiple Choice";
  if (value === "freeForm") return "Free Form";
  return "Both";
}

const SurveyBuilderList: React.FC<Props> = ({
  rows,
  weekOptions,
  weekFilter,
  onWeekFilterChange,
  onAdd,
  onEdit,
  onRemove,
  onViewResponses,
}) => {
  const columns = React.useMemo<Column<SurveyVariant>[]>(
    () => [
      {
        id: "week",
        header: "Week",
        width: "6rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => <Badge variant="neutral">W{row.week}</Badge>,
      },
      {
        id: "country",
        header: "Country",
        width: "9rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => <Badge variant="neutral">{row.country}</Badge>,
      },
      {
        id: "language",
        header: "Language",
        width: "8rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => <Badge variant="neutral">{row.language}</Badge>,
      },
      {
        id: "type",
        header: "Type",
        width: "10rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => <span className="text-xs text-slate-200">{responseTypeLabel(row.responseType)}</span>,
      },
      {
        id: "options",
        header: "Options",
        width: "18rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => (
          <span
            className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-300"
            title={row.options.length ? row.options.join(", ") : "No options"}
          >
            {row.options.length ? truncateText(row.options.join(", "), 84) : "No options"}
          </span>
        ),
      },
      {
        id: "created",
        header: "Created",
        width: "8rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => <span className="text-xs text-slate-300">{formatDate(row.createdAt)}</span>,
      },
      {
        id: "actions",
        header: "",
        width: "14rem",
        align: "right",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="secondary"
              className="h-8 rounded-full border border-white/10 bg-transparent px-2.5 text-xs hover:bg-white/5"
              onClick={() => onViewResponses(row)}
              title="View responses"
            >
              <span className="inline-flex items-center gap-1.5">
                <FiEye className="h-3.5 w-3.5" />
                <span>View</span>
              </span>
            </Button>
            <Button
              variant="secondary"
              className="h-8 rounded-full border border-white/10 bg-transparent px-2.5 text-xs hover:bg-white/5"
              onClick={() => onEdit(row)}
              title="Edit survey"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="secondary"
              className="h-8 rounded-full border border-red-400/30 bg-transparent px-2.5 text-xs text-red-200 hover:bg-red-500/10"
              onClick={() => onRemove(row)}
              title="Remove survey"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onRemove, onViewResponses]
  );

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="space-y-4 p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Week</span>
          <select
            value={String(weekFilter)}
            onChange={(event) => {
              const value = event.target.value;
              onWeekFilterChange(value === "All" ? "All" : Number(value));
            }}
            className="h-9 rounded-lg border border-white/15 bg-black/20 px-2.5 text-xs text-slate-100 outline-none"
          >
            <option value="All" className="bg-black">
              All
            </option>
            {weekOptions.map((week) => (
              <option key={week} value={week} className="bg-black">
                Week {week}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          className="h-10 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
          onClick={onAdd}
        >
          <span className="inline-flex items-center gap-2">
            <FiPlus className="h-4 w-4" />
            <span>+ Add Weekly Survey</span>
          </span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        containerClassName="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin"
        tableClassName="min-w-[860px] md:min-w-full"
      />
    </SectionCard>
  );
};

export default SurveyBuilderList;
