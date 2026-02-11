import React from "react";
import { FiChevronRight } from "react-icons/fi";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import Button from "../../shared/inputs/Button";
import { truncateText } from "../../shared/lib/text";
import {
  getSubmissionUserType,
  type SubmissionItem,
  type SubmissionType,
} from "./types";

type Props = {
  mode: SubmissionType;
  rows: SubmissionItem[];
  onView: (row: SubmissionItem) => void;
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

function toAnswerSnippet(row: Extract<SubmissionItem, { type: "WeeklySurvey" }>) {
  const selected = row.weeklySurvey.selectedOptions.join(", ");
  const freeForm = row.weeklySurvey.freeFormAnswer?.trim();

  if (row.weeklySurvey.responseType === "multipleChoice") return selected || "-";
  if (row.weeklySurvey.responseType === "freeForm") return freeForm || "-";
  return [selected, freeForm].filter(Boolean).join(" | ") || "-";
}

const SubmissionsTable: React.FC<Props> = ({ mode, rows, onView }) => {
  const columns = React.useMemo(() => {
    const userColumn: Column<SubmissionItem> = {
      id: "user",
      header: "User",
      width: "15rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={row.user.avatarUrl} name={row.user.name} size={36} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">
              {row.user.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {row.user.email || row.user.userId}
            </p>
          </div>
        </div>
      ),
    };

    const userTypeColumn: Column<SubmissionItem> = {
      id: "userType",
      header: "User Type",
      width: "8rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => {
        const type = getSubmissionUserType(row.user);
        return (
          <Badge variant={type === "Pro" ? "info" : type === "Registered" ? "success" : "warning"}>
            {type}
          </Badge>
        );
      },
    };

    const createdColumn: Column<SubmissionItem> = {
      id: "created",
      header: "Created",
      width: "7.5rem",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => <span className="text-xs text-slate-300">{formatDate(row.createdAt)}</span>,
    };

    const actionColumn: Column<SubmissionItem> = {
      id: "action",
      header: "",
      width: "3.75rem",
      align: "right",
      headerClassName: STICKY_HEADER_CLASS,
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="h-8 w-8 rounded-full border border-white/15 bg-transparent p-0"
            onClick={() => onView(row)}
            aria-label="View submission details"
          >
            <FiChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    };

    if (mode === "WeeklySurvey") {
      const weeklyColumns: Column<SubmissionItem>[] = [
        userColumn,
        userTypeColumn,
        {
          id: "question",
          header: "Question",
          width: "18rem",
          headerClassName: STICKY_HEADER_CLASS,
          cell: (row) => {
            if (row.type !== "WeeklySurvey") return null;
            const answerSnippet = truncateText(toAnswerSnippet(row), 84);
            return (
              <div className="min-w-0">
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-100"
                  title={row.weeklySurvey.question}
                >
                  {truncateText(row.weeklySurvey.question, 66)}
                </p>
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-400"
                  title={`Week ${row.weeklySurvey.week}`}
                >
                  Week {row.weeklySurvey.week}
                </p>
                <div className="mt-1 space-y-1 md:hidden">
                  <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-300"
                    title={toAnswerSnippet(row)}
                  >
                    {answerSnippet}
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          id: "answer",
          header: "Answer",
          width: "17.5rem",
          headerClassName: `${STICKY_HEADER_CLASS} hidden md:table-cell`,
          cellClassName: "hidden md:table-cell",
          cell: (row) => {
            if (row.type !== "WeeklySurvey") return null;
            const snippet = toAnswerSnippet(row);
            return (
              <div className="min-w-0">
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-200"
                  title={snippet}
                >
                  {truncateText(snippet, 84)}
                </p>
                <p
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-400"
                  title={row.weeklySurvey.responseType}
                >
                  {row.weeklySurvey.responseType === "multipleChoice"
                    ? "Multiple Choice"
                    : row.weeklySurvey.responseType === "freeForm"
                    ? "Free Form"
                    : "Both"}
                </p>
              </div>
            );
          },
        },
        createdColumn,
        actionColumn,
      ];

      return weeklyColumns;
    }

    const askColumns: Column<SubmissionItem>[] = [
      userColumn,
      userTypeColumn,
      {
        id: "question",
        header: "Question",
        width: "17rem",
        headerClassName: STICKY_HEADER_CLASS,
        cell: (row) => {
          if (row.type !== "AskQuestion") return null;
          return (
            <div className="min-w-0">
              <p
                className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-100"
                title={row.askQuestion.question}
              >
                {truncateText(row.askQuestion.question, 64)}
              </p>
              <p
                className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-300 md:hidden"
                title={row.askQuestion.message}
              >
                {truncateText(row.askQuestion.message, 84)}
              </p>
            </div>
          );
        },
      },
      {
        id: "message",
        header: "Message",
        width: "18rem",
        headerClassName: `${STICKY_HEADER_CLASS} hidden md:table-cell`,
        cellClassName: "hidden md:table-cell",
        cell: (row) => {
          if (row.type !== "AskQuestion") return null;
          return (
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-200"
              title={row.askQuestion.message}
            >
              {truncateText(row.askQuestion.message, 90)}
            </p>
          );
        },
      },
      createdColumn,
      actionColumn,
    ];

    return askColumns;
  }, [mode, onView]);

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="p-0">
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        containerClassName="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin"
        tableClassName="min-w-[760px] md:min-w-full"
      />
    </SectionCard>
  );
};

export default SubmissionsTable;

