import React from "react";
import { FiChevronRight } from "react-icons/fi";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import {
  getFeedbackUserType,
  type FeedbackStatus,
  type FeedbackType,
  type SurveyFeedbackItem,
} from "./types";

type Props = {
  rows: SurveyFeedbackItem[];
  onView: (row: SurveyFeedbackItem) => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function userTypeVariant(type: ReturnType<typeof getFeedbackUserType>) {
  if (type === "Pro") return "info" as const;
  if (type === "Registered") return "success" as const;
  return "warning" as const;
}

function statusVariant(status: FeedbackStatus) {
  return status === "resolved" ? ("success" as const) : ("warning" as const);
}

function statusLabel(status: FeedbackStatus) {
  return status === "resolved" ? "Resolved" : "Open";
}

function typeVariant(type: FeedbackType) {
  return type === "weeklySurvey" ? ("success" as const) : ("info" as const);
}

function typeLabel(type: FeedbackType) {
  return type === "weeklySurvey" ? "Weekly Survey" : "Ask a Question";
}

const STICKY_HEADER_CLASS = "sticky top-0 z-10 bg-black/40 backdrop-blur";

const FeedbackTable: React.FC<Props> = ({ rows, onView }) => {
  const columns: Column<SurveyFeedbackItem>[] = [
    {
      id: "user",
      header: "User",
      width: "18rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[56px] shrink-0">
            <Avatar src={row.user.avatarUrl} name={row.user.name} size="md" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-slate-100">{row.user.name}</span>
            <span className="truncate text-xs text-slate-400">{row.user.email || row.user.userId}</span>
          </div>
        </div>
      ),
    },
    {
      id: "userType",
      header: "User Type",
      width: "9rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => {
        const type = getFeedbackUserType(row.user);
        return <Badge variant={userTypeVariant(type)}>{type}</Badge>;
      },
    },
    {
      id: "type",
      header: "Type",
      width: "10rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => <Badge variant={typeVariant(row.type)}>{typeLabel(row.type)}</Badge>,
    },
    {
      id: "title",
      header: "Title / Question",
      width: "20rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-slate-100">{row.title}</div>
          <div className="truncate text-xs text-slate-400">
            {row.type === "askQuestion" ? row.askQuestion.message : row.weeklySurvey.question}
          </div>
        </div>
      ),
    },
    {
      id: "created",
      header: "Created",
      width: "8rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => <span className="text-xs text-slate-300 md:text-sm">{formatDate(row.createdAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      width: "7rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>,
    },
    {
      id: "actions",
      header: "",
      width: "4.5rem",
      align: "right",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="h-8 w-8 rounded-full border border-white/15 bg-transparent p-0"
            onClick={() => onView(row)}
            aria-label="View details"
          >
            <FiChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="p-0">
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        containerClassName="max-w-full overflow-x-auto scrollbar-thin"
        tableClassName="min-w-[900px]"
      />
    </SectionCard>
  );
};

export default FeedbackTable;

