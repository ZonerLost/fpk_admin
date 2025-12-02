import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import type { UserItem } from "./types";
import { FiMoreVertical } from "react-icons/fi";

type Props = {
  users: UserItem[];
};

const UsersTable: React.FC<Props> = ({ users }) => {
  const columns: Column<UserItem>[] = [
    {
      id: "userId",
      header: "User ID",
      width: "7rem",
      cell: (row) => (
        <span className="text-xs text-slate-300 md:text-sm">
          {row.userId}
        </span>
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            src={row.avatarUrl}
            name={row.name}
            size="md"
            variant="circle"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-slate-100">
              {row.name}
            </span>
            <span className="truncate text-xs text-slate-400">
              {row.email || row.phone || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "country",
      header: "Country",
      width: "8rem",
      cell: (row) => (
        <span className="text-xs text-slate-200 md:text-sm">
          {row.country}
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      width: "7rem",
      cell: (row) => {
        const variant =
          row.role === "Pro"
            ? "success"
            : row.role === "Basic"
            ? "neutral"
            : "warning";

        return <Badge variant={variant}>{row.role}</Badge>;
      },
    },
    {
      id: "xp",
      header: "XP Points",
      width: "8rem",
      align: "right",
      cell: (row) => (
        <span className="text-xs text-slate-100 md:text-sm">
          {row.xpPoints.toLocaleString()} XP
        </span>
      ),
    },
    {
      id: "lastActive",
      header: "Last Active",
      width: "8rem",
      cell: (row) => (
        <span className="text-xs text-slate-300 md:text-sm">
          {row.lastActive}
        </span>
      ),
    },
    {
      id: "subscription",
      header: "Subscription",
      width: "7rem",
      cell: (row) => {
        const isActive = row.subscription === "Active";
        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isActive ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            <span className="text-xs text-slate-100 md:text-sm">
              {row.subscription}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      width: "3rem",
      align: "right",
      cell: () => (
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
        >
          <FiMoreVertical className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="p-0">
      <DataTable
        columns={columns}
        data={users}
        getRowKey={(row) => row.id}
      />
    </SectionCard>
  );
};

export default UsersTable;
