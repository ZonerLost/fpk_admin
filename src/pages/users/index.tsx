/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import ConfirmDialog from "../../shared/overlay/ConfirmDialog";
import { downloadCsv } from "../../shared/utils/downloadCsv";

import UsersFiltersBar, {
  type UsersFiltersState,
} from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import UserDetailsSlideOver from "../../components/users/UserDetailsSlideOver";
import EditUserSlideOver from "../../components/users/EditUserSlideOver";
import BrazeMessageSlideOver from "../../components/users/BrazeMessageSlideOver";

import type { UserItem } from "../../components/users/types";
import { FiSearch, FiFilter, FiDownload, FiSend } from "react-icons/fi";

const MAX_ONSCREEN = 5000;
const DISPLAY_LIMIT_OPTIONS = [100, 500, 1000, 5000] as const;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const initialUsers: UserItem[] = [
  {
    id: "1",
    userId: "USR-8421",
    name: "Alex Gunnar",
    email: "alex.g@example.com",
    country: "Norway",
    language: "EN",
    role: "Registered",
    xpPoints: 12500,
    lastActive: "2 hours ago",
    proStatus: "Active",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    userId: "USR-3198",
    name: "Sofia Rey",
    phone: "+34 123 456 789",
    country: "Spain",
    language: "ES",
    role: "Registered",
    xpPoints: 4200,
    lastActive: "1 day ago",
    proStatus: "Lapsed",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "3",
    userId: "USR-5540",
    name: "Kenji Tanaka",
    email: "kenji.t@example.jp",
    country: "Japan",
    language: "EN",
    role: "Registered",
    xpPoints: 150,
    lastActive: "3 weeks ago",
    proStatus: "None",
    avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: "4",
    userId: "USR-9123",
    name: "Maria Silva",
    email: "maria.s@example.br",
    country: "Brazil",
    language: "EN",
    role: "Registered",
    xpPoints: 25100,
    lastActive: "5 minutes ago",
    proStatus: "Active",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

function hasAnyFilterSelected(f: UsersFiltersState) {
  return Object.values(f).some((v) => v !== "All" && v !== "All Time");
}

function countSelectedFilters(f: UsersFiltersState) {
  return Object.values(f).filter((v) => v !== "All" && v !== "All Time").length;
}

// lightweight parser for demo data only
function lastActiveMinutes(label: string): number | null {
  const s = label.toLowerCase().trim();
  const m = s.match(
    /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\s*ago/
  );
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2];
  if (unit.startsWith("minute")) return n;
  if (unit.startsWith("hour")) return n * 60;
  if (unit.startsWith("day")) return n * 24 * 60;
  if (unit.startsWith("week")) return n * 7 * 24 * 60;
  return null;
}

function withinWindow(lastActiveLabel: string, windowKey: string) {
  if (windowKey === "All Time") return true;

  const mins = lastActiveMinutes(lastActiveLabel);
  if (mins == null) return true; // if unknown, don't exclude

  const limit =
    windowKey === "24h"
      ? 24 * 60
      : windowKey === "7 days"
      ? 7 * 24 * 60
      : 30 * 24 * 60;

  return mins <= limit;
}

function UsersHeaderActions(props: {
  selectedCount: number;
  canApply: boolean;
  onApply: () => void;
  onClear: () => void;
  onDownload: () => void;
  onBraze: () => void;
  downloadDisabled: boolean;
  brazeDisabled: boolean;
}) {
  const {
    selectedCount,
    canApply,
    onApply,
    onClear,
    onDownload,
    onBraze,
    downloadDisabled,
    brazeDisabled,
  } = props;

  const pillBase =
    "h-10 rounded-full border px-4 text-xs font-semibold transition md:text-sm";
  const pillSecondary =
    `${pillBase} border-white/10 bg-white/5 text-slate-200 hover:bg-white/10`;
  const pillApplyEnabled =
    `${pillBase} border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15`;

  return (
    <div className="w-full">
      {/* Mobile: horizontally scrollable actions row (no ugly wrap). Desktop: clean right-aligned. */}
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible sm:pb-0">
          <Button
            variant="secondary"
            onClick={onApply}
            disabled={!canApply}
            className={[
              "shrink-0",
              canApply ? pillApplyEnabled : pillSecondary,
              "disabled:opacity-50 disabled:hover:bg-white/5",
            ].join(" ")}
          >
            <FiFilter className="mr-2" />
            <span className="hidden sm:inline">Apply Filters</span>
            <span className="sm:hidden">Apply</span>

            {selectedCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black/30 px-1.5 text-[11px] text-slate-200">
                {selectedCount}
              </span>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={onClear}
            className={[pillSecondary, "shrink-0"].join(" ")}
          >
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">Reset</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onDownload}
            disabled={downloadDisabled}
            className={[
              pillSecondary,
              "shrink-0",
              "disabled:opacity-50 disabled:hover:bg-white/5",
            ].join(" ")}
          >
            <FiDownload className="mr-2" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          {/* Braze = a bit more “primary” feeling but still consistent */}
          <Button
            variant="secondary"
            onClick={onBraze}
            disabled={brazeDisabled}
            className={[
              "shrink-0",
              pillSecondary,
              "border-amber-400/20 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15",
              "disabled:opacity-50 disabled:hover:bg-amber-400/10",
            ].join(" ")}
          >
            <FiSend className="mr-2" />
            Braze
          </Button>
        </div>
      </div>
    </div>
  );
}

const UsersPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  // Draft filters (editable)
  const [filtersDraft, setFiltersDraft] = React.useState<UsersFiltersState>({
    country: "All",
    language: "All",
    pro: "All",
    lastActive: "All Time",
  });

  // Applied filters (drives data load)
  const [filtersApplied, setFiltersApplied] =
    React.useState<UsersFiltersState | null>(null);

  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] =
    React.useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [displayLimit, setDisplayLimit] =
    React.useState<(typeof DISPLAY_LIMIT_OPTIONS)[number]>(500);

  // View/Edit/Delete
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const [editUser, setEditUser] = React.useState<UserItem | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const [deleteUser, setDeleteUser] = React.useState<UserItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  // Braze
  const [isBrazeOpen, setIsBrazeOpen] = React.useState(false);

  const handleFiltersChange = (partial: Partial<UsersFiltersState>) => {
    setFiltersDraft((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFiltersApplied(filtersDraft);
    setCurrentPage(1);

    // ✅ Production: fetch from backend using filtersDraft + pagination
    // For demo: load only once after filters applied
    if (users.length === 0) setUsers(initialUsers);
  };

  const clearFilters = () => {
    setFiltersDraft({
      country: "All",
      language: "All",
      pro: "All",
      lastActive: "All Time",
    });
    setFiltersApplied(null);
    setUsers([]);
    setSearch("");
    setCurrentPage(1);
  };

  const handleViewUser = (user: UserItem) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleEditUser = (user: UserItem) => {
    setEditUser(user);
    setIsEditOpen(true);
  };

  const handleUpdateUser = (id: string, updates: Partial<Omit<UserItem, "id">>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const handleRequestDelete = (user: UserItem) => {
    setDeleteUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;

    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setIsDeleteOpen(false);
    setDeleteUser(null);

    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const filteredUsers = React.useMemo(() => {
    if (!filtersApplied) return [];

    return users.filter((user) => {
      const q = search.trim().toLowerCase();

      if (q) {
        const haystack = [
          user.name,
          user.email,
          user.phone,
          user.userId,
          user.country,
          user.language,
          user.proStatus,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (filtersApplied.country !== "All" && user.country !== filtersApplied.country) return false;
      if (filtersApplied.language !== "All" && user.language !== filtersApplied.language) return false;
      if (filtersApplied.pro !== "All" && user.proStatus !== filtersApplied.pro) return false;

      if (!withinWindow(user.lastActive, filtersApplied.lastActive)) return false;

      return true;
    });
  }, [users, search, filtersApplied]);

  const limitedUsers = React.useMemo(() => {
    const cap = Math.min(displayLimit, MAX_ONSCREEN);
    return filteredUsers.slice(0, cap);
  }, [filteredUsers, displayLimit]);

  const totalResults = limitedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const page = Math.min(currentPage, totalPages);

  const startIndex = (page - 1) * pageSize;
  const paginated = limitedUsers.slice(startIndex, startIndex + pageSize);

  const overHardCap = filteredUsers.length > MAX_ONSCREEN;
  const overDisplayLimit = filteredUsers.length > limitedUsers.length;

  const handleDownload = () => {
    const rows = limitedUsers.map((u) => ({
      userId: u.userId,
      name: u.name,
      email: u.email ?? "",
      phone: u.phone ?? "",
      country: u.country,
      language: u.language,
      role: u.role,
      proStatus: u.proStatus,
      xpPoints: u.xpPoints,
      lastActive: u.lastActive,
    }));
    downloadCsv("users-export.csv", rows);
  };

  const brazePayload = React.useMemo(() => {
    return {
      filters: filtersApplied ?? {},
      userIds: limitedUsers.map((u) => u.id),
    };
  }, [filtersApplied, limitedUsers]);

  const isUnfilteredCohort = filtersApplied ? !hasAnyFilterSelected(filtersApplied) : false;

  const sendBraze = async ({
    campaignId,
    messageName,
  }: {
    campaignId: string;
    messageName?: string;
  }) => {
    // ✅ Production:
    // await http.post("/admin/braze/trigger", { campaignId, messageName, ...brazePayload });

    // demo-only:
    console.log("BRAZE TRIGGER:", { campaignId, messageName, ...brazePayload });
  };

  const selectedCount = countSelectedFilters(filtersDraft);

  return (
    <>
      <PageShell>
        <PageHeader
          title="User Management"
          subtitle={
            "Operational view for account support. For very large cohorts (e.g. 500k+) and analytics, use BI dashboards backed by a Data Warehouse (BigQuery/Snowflake/Redshift)."
          }
          actions={
            <UsersHeaderActions
              selectedCount={selectedCount}
              canApply={true}
              onApply={applyFilters}
              onClear={clearFilters}
              onDownload={handleDownload}
              onBraze={() => setIsBrazeOpen(true)}
              downloadDisabled={!filtersApplied || limitedUsers.length === 0}
              brazeDisabled={!filtersApplied || limitedUsers.length === 0}
            />
          }
        />

        {/* Search + filters card */}
        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, phone, user ID..."
                leftIcon={<FiSearch />}
                className="h-10 bg-[#071810]"
              />
            }
            filters={
              <UsersFiltersBar filters={filtersDraft} onChange={handleFiltersChange} />
            }
          />
        </SectionCard>

        {!filtersApplied ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            <div className="text-base font-semibold text-white">Select filters to load users</div>
            <p className="mt-2 text-slate-300">
              To avoid loading too many records, this page requires filters first.
            </p>
            <p className="mt-1 text-slate-400 text-xs">
              Choose Country/Language/Pro/Last Active then click <b>Apply Filters</b>.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Results + controls (better responsive layout) */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-slate-300">
                  Results: <span className="text-slate-100">{filteredUsers.length}</span>
                  {overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Hard cap {MAX_ONSCREEN}; refine filters for full set)
                    </span>
                  )}
                  {overDisplayLimit && !overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Showing first {limitedUsers.length}; increase display limit)
                    </span>
                  )}
                  {isUnfilteredCohort && (
                    <span className="ml-2 text-amber-200">Loading all users (capped)</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Max cohort:</span>
                    <select
                      value={displayLimit}
                      onChange={(e) => setDisplayLimit(Number(e.target.value) as any)}
                      className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none sm:w-auto"
                    >
                      {DISPLAY_LIMIT_OPTIONS.map((n) => (
                        <option key={n} value={n} className="bg-black">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Rows/page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value) as any);
                        setCurrentPage(1);
                      }}
                      className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none sm:w-auto"
                    >
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <option key={n} value={n} className="bg-black">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <UsersTable
              users={paginated}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleRequestDelete}
            />

            {/* Pagination */}
            <div className="flex flex-col items-stretch justify-between gap-3 text-xs text-slate-400 md:flex-row md:items-center">
              <span className="text-center md:text-left">
                Showing{" "}
                <span className="font-semibold text-slate-100">
                  {totalResults === 0 ? 0 : startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-100">
                  {Math.min(startIndex + pageSize, totalResults)}
                </span>{" "}
                of <span className="font-semibold text-slate-100">{totalResults}</span> results
              </span>

              <div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
                <Button
                  variant="secondary"
                  className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10 md:w-auto"
                  disabled={page === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10 md:w-auto"
                  disabled={page === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageShell>

      {/* View User */}
      <UserDetailsSlideOver
        isOpen={isViewOpen}
        user={selectedUser}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Edit User */}
      <EditUserSlideOver
        isOpen={isEditOpen}
        user={editUser}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateUser}
      />

      {/* Braze */}
      <BrazeMessageSlideOver
        isOpen={isBrazeOpen}
        onClose={() => setIsBrazeOpen(false)}
        cohortCount={limitedUsers.length}
        payload={brazePayload}
        onSend={sendBraze}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete user?"
        description={
          deleteUser
            ? `This will permanently remove ${deleteUser.name} (${deleteUser.userId}).`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteUser(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UsersPage;
