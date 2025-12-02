import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import type { RecordingItem } from "./types";

type Props = {
  recordings: RecordingItem[];
};

const AcademyRecordingsTable: React.FC<Props> = ({ recordings }) => {
  const columns: Column<RecordingItem>[] = [
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
      id: "host",
      header: "Host",
      width: "8rem",
      cell: (row) => (
        <span className="text-xs text-slate-200 md:text-sm">
          {row.host}
        </span>
      ),
    },
    {
      id: "date",
      header: "Date",
      width: "7rem",
      cell: (row) => (
        <span className="text-xs text-slate-300 md:text-sm">
          {row.date}
        </span>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      width: "6rem",
      cell: (row) => (
        <span className="text-xs text-slate-300 md:text-sm">
          {row.duration}
        </span>
      ),
    },
    {
      id: "views",
      header: "Views",
      width: "6rem",
      align: "right",
      cell: (row) => (
        <span className="text-xs text-slate-100 md:text-sm">
          {row.views}
        </span>
      ),
    },
  ];

  return (
    <SectionCard
      title="Academy Recordings"
      className="bg-[#04130d]"
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={recordings}
        getRowKey={(row) => row.id}
      />
    </SectionCard>
  );
};

export default AcademyRecordingsTable;
