import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import IconButton from "../../shared/inputs/IconButton";
import UsersFiltersBar, {
  type UsersFiltersState,
} from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import AddUserSlideOver from "../../components/users/AddUserSlideOver";
import type { UserItem } from "../../components/users/types";
import { FiSearch, FiPlus, FiSliders, FiDownload } from "react-icons/fi";

const initialUsers: UserItem[] = [
  {
    id: "1",
    userId: "USR-8421",
    name: "Alex Gunnar",
    email: "alex.g@example.com",
    country: "Norway",
    role: "Pro",
    xpPoints: 12500,
    lastActive: "2 hours ago",
    subscription: "Active",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    userId: "USR-3198",
    name: "Sofia Rey",
    phone: "+34 123 456 789",
    country: "Spain",
    role: "Basic",
    xpPoints: 4200,
    lastActive: "1 day ago",
    subscription: "Active",
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
    subscription: "Inactive",
    avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: "4",
    userId: "USR-9123",
    name: "Maria Silva",
    email: "maria.s@example.br",
    country: "Brazil",
    role: "Pro",
    xpPoints: 25100,
    lastActive: "5 minutes ago",
    subscription: "Active",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];


const PAGE_SIZE = 10;

const UsersPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<UsersFiltersState>({
    role: "All",
    country: "All",
    subscription: "All",
    lastActive: "All Time",
  });

  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

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
      )
        return false;
      if (
        filters.subscription !== "All" &&
        user.subscription !== filters.subscription
      )
        return false;

      // lastActive can be wired later if needed
      return true;
    });
  }, [users, search, filters]);

  const totalResults = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginated = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <>
      <PageShell>
        <PageHeader
          title="User Management"
          subtitle="Search, filter, and manage all users and their subscriptions."
          actions={
            <Button
              variant="primary"
              leftIcon={<FiPlus />}
              onClick={() => setIsAddOpen(true)}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              Add New User
            </Button>
          }
        />

        {/* Search + filters card */}
        <SectionCard
          className="mt-4 bg-[#04130d]"
          contentClassName="space-y-4"
        >
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, or user ID..."
                leftIcon={<FiSearch />}
                className="bg-[#071810]"
              />
            }
            filters={
              <UsersFiltersBar
                filters={filters}
                onChange={handleFiltersChange}
              />
            }
            actions={
              <div className="flex items-center gap-2">
                <IconButton variant="subtle">
                  <FiSliders className="h-4 w-4" />
                </IconButton>
                <IconButton variant="subtle">
                  <FiDownload className="h-4 w-4" />
                </IconButton>
                <Button
                  variant="primary"
                  className="hidden rounded-full bg-emerald-500 text-black hover:bg-emerald-400 md:inline-flex"
                >
                  Apply Filters
                </Button>
              </div>
            }
          />

          {/* Mobile Apply Filters button (under filters) */}
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

        {/* Table */}
        <div className="mt-6 space-y-4">
          <UsersTable users={paginated} />

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
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg:white/10 hover:bg-white/10"
                disabled={page === totalPages}
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </PageShell>

      {/* Add New User slide-over */}
      <AddUserSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload) => {
          handleCreateUser(payload);
          setIsAddOpen(false);
        }}
      />
    </>
  );
};

export default UsersPage;
