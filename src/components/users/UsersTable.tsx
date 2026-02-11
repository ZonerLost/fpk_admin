import React from "react";
import ReactDOM from "react-dom";
import SectionCard from "../../shared/layout/SectionCard";
import DataTable, { type Column } from "../../shared/tables/DataTable";
import Avatar from "../../shared/data-display/Avatar";
import Badge from "../../shared/data-display/Badge";
import type { UserItem } from "./types";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

type Props = {
  users: UserItem[];
  onView: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

const MENU_WIDTH = 170;
const GAP = 8;

function formatDateShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

function statusLabel(s: UserItem["accountStatus"]) {
  if (s === "Registered") return "Registered";
  if (s === "PRO_1M") return "PRO 1M";
  if (s === "PRO_6M") return "PRO 6M";
  return "PRO 12M";
}

function statusVariant(s: UserItem["accountStatus"], reg: UserItem["registrationStatus"]) {
  if (reg === "Unregistered") return "warning";
  if (s === "Registered") return "success";
  return "info";
}

function RowActions({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: UserItem;
  onView: (u: UserItem) => void;
  onEdit: (u: UserItem) => void;
  onDelete: (u: UserItem) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  const computePos = React.useCallback(() => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    const leftRaw = rect.right - MENU_WIDTH;
    const left = Math.max(GAP, Math.min(leftRaw, window.innerWidth - MENU_WIDTH - GAP));

    const topRaw = rect.bottom + GAP;
    const top = Math.max(GAP, Math.min(topRaw, window.innerHeight - GAP));

    setPos({ top, left });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    computePos();

    const onScroll = () => computePos();
    const onResize = () => computePos();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, computePos]);

  React.useEffect(() => {
    if (!open) return;

    const handleDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;

      setOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const clickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onView(row);
  };

  const clickEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onEdit(row);
  };

  const clickDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onDelete(row);
  };

  const menu = open
    ? ReactDOM.createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: MENU_WIDTH }}
          className="z-[9999] overflow-hidden rounded-xl border border-white/10 bg-[#071810] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={clickView}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-100 hover:bg-white/5"
          >
            <FiEye className="h-3.5 w-3.5" />
            View
          </button>

          <button
            type="button"
            onClick={clickEdit}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-100 hover:bg-white/5"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            Edit
          </button>

          <div className="h-px bg-white/5" />

          <button
            type="button"
            onClick={clickDelete}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-200 hover:bg-red-500/10"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-300 transition hover:bg-white/10 hover:text-white"
        title="Actions"
      >
        <FiEdit2 className="h-4 w-4" />
      </button>
      {menu}
    </>
  );
}

const UsersTable: React.FC<Props> = ({ users, onView, onEdit, onDelete }) => {
  const columns: Column<UserItem>[] = [
    {
      id: "userId",
      header: "User ID",
      width: "7rem",
      cell: (row) => <span className="text-xs text-slate-300 md:text-sm">{row.userId}</span>,
    },
    {
      id: "name",
      header: "Name",
      width: "18rem",
      cell: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[56px] shrink-0">
            <Avatar src={row.avatarUrl} name={row.name} size={40} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-slate-100">{row.name}</span>
            <span className="truncate text-xs text-slate-400">{row.email || row.phone || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      id: "country",
      header: "Country",
      width: "8rem",
      cell: (row) => <span className="text-xs text-slate-200 md:text-sm">{row.country}</span>,
    },
    {
      id: "language",
      header: "Language",
      width: "7rem",
      cell: (row) => <span className="text-xs text-slate-200 md:text-sm">{row.language}</span>,
    },
    {
      id: "status",
      header: "Status",
      width: "9rem",
      cell: (row) => (
        <Badge variant={statusVariant(row.accountStatus, row.registrationStatus)}>
          {row.registrationStatus === "Unregistered" ? "Unregistered" : statusLabel(row.accountStatus)}
        </Badge>
      ),
    },
    {
      id: "xp",
      header: "XP Points",
      width: "8rem",
      align: "right",
      cell: (row) => <span className="text-xs text-slate-100 md:text-sm">{row.xpPoints.toLocaleString()} XP</span>,
    },
    {
      id: "lastActive",
      header: "Last Active",
      width: "9rem",
      cell: (row) => <span className="text-xs text-slate-300 md:text-sm">{row.lastActiveLabel}</span>,
    },
    {
      id: "memberSince",
      header: "Member since",
      width: "10rem",
      cell: (row) => <span className="text-xs text-slate-300 md:text-sm">{formatDateShort(row.joinedAt)}</span>,
    },
    {
      id: "actions",
      header: "",
      width: "3.5rem",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <RowActions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="p-0">
      <DataTable columns={columns} data={users} getRowKey={(row) => row.id} containerClassName="max-w-full overflow-x-auto scrollbar-thin" />
    </SectionCard>
  );
};

export default UsersTable;
