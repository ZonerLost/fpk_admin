import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";

import UsersFiltersBar, {
  type UsersFiltersState,
} from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import AddUserSlideOver from "../../components/users/AddUserSlideOver";
import UserDetailsSlideOver from "../../components/users/UserDetailsSlideOver";
import EditUserSlideOver from "../../components/users/EditUserSlideOver";

import type { UserItem } from "../../components/users/types";
import { FiSearch, FiPlus } from "react-icons/fi";

const initialUsers: UserItem[] = [
  {
    id: "1",
    userId: "USR-8421",
    name: "Alex Gunnar",
    email: "alex.g@example.com",
    country: "Norway",
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
    role: "Registered",
    xpPoints: 4200,
    lastActive: "1 day ago",
    proStatus: "Inactive",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "3",
    userId: "USR-5540",
    name: "Kenji Tanaka",
    email: "kenji.t@example.jp",
    country: "Japan",
    role: "Unregistered",
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
    role: "Registered",
    xpPoints: 25100,
    lastActive: "5 minutes ago",
    proStatus: "Active",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const PAGE_SIZE = 10;

const UsersPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<UsersFiltersState>({
    role: "All",
    country: "All",
    pro: "All",
    lastActive: "All Time",
  });

  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Add User
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // View User
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  // Edit User
  const [editUser, setEditUser] = React.useState<UserItem | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Delete confirm
  const [deleteUser, setDeleteUser] = React.useState<UserItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const handleFiltersChange = (partial: Partial<UsersFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  };

  const handleCreateUser = (payload: Omit<UserItem, "id">) => {
    const newUser: UserItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setUsers((prev) => [newUser, ...prev]);
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

  const handleUpdateUser = (
    id: string,
    updates: Partial<Omit<UserItem, "id">>
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
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

    // If deleting last item on page, adjust page safely
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const q = search.trim().toLowerCase();

      if (q) {
        const haystack = [
          user.name,
          user.email,
          user.phone,
          user.userId,
          user.country,
          user.role,
          user.proStatus,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      if (filters.role !== "All" && user.role !== filters.role) return false;

      if (
        filters.country !== "All" &&
        user.country.toLowerCase() !== filters.country.toLowerCase()
      ) {
        return false;
      }

      if (filters.pro !== "All" && user.proStatus !== filters.pro) return false;

      return true;
    });
  }, [users, search, filters]);

  const totalResults = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginated = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      <PageShell>
        <PageHeader
          title="User Management"
          subtitle={
            "Paginated operational view for account support. " +
            "For very large cohorts (e.g., 500k+) and deep analytics, route to warehouse/BI dashboards."
          }
          actions={
            <Button
              variant="primary"
              leftIcon={<FiPlus />}
              onClick={() => setIsAddOpen(true)}
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold bg-emerald-500 text-black hover:bg-emerald-400"
            >
              Add New User
            </Button>
          }
        />

        {/* Search + filters card */}
        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, phone, or user ID..."
                leftIcon={<FiSearch />}
                className="h-10 bg-[#071810]"
              />
            }
            filters={
              <UsersFiltersBar
                filters={filters}
                onChange={handleFiltersChange}
              />
            }
          />

          {/* Mobile Apply Filters button */}
          <div className="md:hidden">
            <Button
              variant="primary"
              fullWidth
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              Apply Filters
            </Button>
          </div>
        </SectionCard>

        {/* Table + pagination */}
        <div className="mt-6 space-y-4">
          <UsersTable
            users={paginated}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleRequestDelete}
          />

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 md:flex-row">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-100">
                {totalResults === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-100">
                {Math.min(startIndex + PAGE_SIZE, totalResults)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-100">
                {totalResults}
              </span>{" "}
              results
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10"
                disabled={page === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10"
                disabled={page === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </PageShell>

      {/* View User slide-over */}
      <UserDetailsSlideOver
        isOpen={isViewOpen}
        user={selectedUser}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Edit User slide-over */}
      <EditUserSlideOver
        isOpen={isEditOpen}
        user={editUser}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateUser}
      />

      {/* Add New User slide-over */}
      <AddUserSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload) => {
          handleCreateUser(payload);
          setIsAddOpen(false);
        }}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
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

/* -------------------------------------------------------------------------- */
/* Local ConfirmDialog (keep here or move to shared later)                    */
/* -------------------------------------------------------------------------- */

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm",
  description = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-[92%] max-w-sm rounded-2xl border border-white/10 bg-[#071810] p-5 shadow-xl">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-xs text-slate-300">{description}</div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-slate-100 hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
