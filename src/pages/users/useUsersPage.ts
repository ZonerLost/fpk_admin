import React from "react";
import { downloadCsv } from "../../shared/utils/downloadCsv";
import type { UserItem, SupportAction } from "../../components/users/types";
import type { UsersFiltersState } from "../../components/users/UsersFiltersBar";

const MAX_ONSCREEN = 5000;
const DISPLAY_LIMIT_OPTIONS = [100, 500, 1000, 5000] as const;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

function daysBetween(aIso?: string, bIso?: string) {
  if (!aIso || !bIso) return 0;
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.floor((b - a) / (1000 * 60 * 60 * 24)));
}

function lastActiveMinutes(label: string): number | null {
  const s = label.toLowerCase().trim();
  const m = s.match(/(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\s*ago/);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2];
  if (unit.startsWith("minute")) return n;
  if (unit.startsWith("hour")) return n * 60;
  if (unit.startsWith("day")) return n * 24 * 60;
  if (unit.startsWith("week")) return n * 7 * 24 * 60;
  return null;
}

function withinWindow(lastActiveLabel: string, windowKey: UsersFiltersState["lastActive"]) {
  if (windowKey === "All Time") return true;

  const mins = lastActiveMinutes(lastActiveLabel);
  if (mins == null) return true;

  const limit =
    windowKey === "24h"
      ? 24 * 60
      : windowKey === "7 days"
      ? 7 * 24 * 60
      : 30 * 24 * 60;

  return mins <= limit;
}

function hasAnyFilterSelected(f: UsersFiltersState) {
  return (
    f.country !== "All" ||
    f.language !== "All" ||
    f.status !== "All" ||
    f.lastActive !== "All Time"
  );
}

function countSelectedFilters(f: UsersFiltersState) {
  return [
    f.country !== "All",
    f.language !== "All",
    f.status !== "All",
    f.lastActive !== "All Time",
  ].filter(Boolean).length;
}

function statusMatches(user: UserItem, status: UsersFiltersState["status"]) {
  if (status === "All") return true;
  if (status === "Registered") return user.registrationStatus === "Registered" && user.accountStatus === "Registered";
  if (status === "PRO 1M") return user.accountStatus === "PRO_1M";
  if (status === "PRO 6M") return user.accountStatus === "PRO_6M";
  return user.accountStatus === "PRO_12M";
}

function getProStart(user: UserItem): string | undefined {
  // Prefer membership history if exists
  const hist = user.membershipHistory ?? [];
  const active = [...hist].sort((a, b) => (a.startedAt > b.startedAt ? -1 : 1))[0];
  if (active?.startedAt) return active.startedAt;

  // fallback: treat join as pro start if user is pro (mock)
  if (user.accountStatus !== "Registered") return user.joinedAt;
  return undefined;
}

const initialUsers: UserItem[] = [
  {
    id: "1",
    userId: "USR-8421",
    name: "Alex Gunnar",
    email: "alex.g@example.com",
    country: "Norway",
    language: "EN",
    registrationStatus: "Registered",
    emailVerified: true,
    accountStatus: "PRO_6M",
    planStatus: "Pro",
    subscriptionState: "Active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
    xpPoints: 12500,
    lastActiveLabel: "2 hours ago",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    evidence: {
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      auditLogCount: 14,
    },
    membershipHistory: [
      {
        id: "m1",
        status: "PRO_6M",
        subscriptionState: "Active",
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
    ],
    paymentHistory: [
      {
        id: "p1",
        amount: 49.99,
        currency: "USD",
        paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        status: "Paid",
        providerRef: "pi_123",
      },
    ],
  },
  {
    id: "2",
    userId: "USR-3198",
    name: "Sofia Rey",
    phone: "+34 123 456 789",
    country: "Spain",
    language: "ES",
    registrationStatus: "Registered",
    emailVerified: false,
    accountStatus: "PRO_1M",
    planStatus: "Pro",
    subscriptionState: "PastDue",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    xpPoints: 4200,
    lastActiveLabel: "1 day ago",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    evidence: {
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
      lastErrorAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      auditLogCount: 3,
    },
  },
];

export function useUsersPage() {
  const [search, setSearch] = React.useState("");

  const [filtersDraft, setFiltersDraft] = React.useState<UsersFiltersState>({
    country: "All",
    language: "All",
    status: "All",
    lastActive: "All Time",
    sort: "joined_desc",
  });

  const [filtersApplied, setFiltersApplied] = React.useState<UsersFiltersState | null>(null);

  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [displayLimit, setDisplayLimit] = React.useState<(typeof DISPLAY_LIMIT_OPTIONS)[number]>(500);

  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const [editUser, setEditUser] = React.useState<UserItem | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const [deleteUser, setDeleteUser] = React.useState<UserItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const [isBrazeOpen, setIsBrazeOpen] = React.useState(false);

  const deferredSearch = React.useDeferredValue(search);

  const handleFiltersChange = (partial: Partial<UsersFiltersState>) => {
    setFiltersDraft((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFiltersApplied(filtersDraft);
    setCurrentPage(1);

    // ✅ Production: fetch backend with filtersDraft (country/language/status/lastActive/sort) + pagination
    if (users.length === 0) setUsers(initialUsers);
  };

  const clearFilters = () => {
    setFiltersDraft({
      country: "All",
      language: "All",
      status: "All",
      lastActive: "All Time",
      sort: "joined_desc",
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

    const q = deferredSearch.trim().toLowerCase();

    let list = users.filter((user) => {
      if (q) {
        const haystack = [
          user.name,
          user.email,
          user.phone,
          user.userId,
          user.country,
          user.language,
          user.accountStatus,
          user.registrationStatus,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (filtersApplied.country !== "All" && user.country !== filtersApplied.country) return false;
      if (filtersApplied.language !== "All" && user.language !== filtersApplied.language) return false;
      if (!statusMatches(user, filtersApplied.status)) return false;
      if (!withinWindow(user.lastActiveLabel, filtersApplied.lastActive)) return false;

      return true;
    });

    // sorting
    const nowIso = new Date().toISOString();
    list = [...list].sort((a, b) => {
      const s = filtersApplied.sort;

      if (s === "joined_desc") return b.joinedAt.localeCompare(a.joinedAt);
      if (s === "joined_asc") return a.joinedAt.localeCompare(b.joinedAt);

      const aStart = getProStart(a);
      const bStart = getProStart(b);
      const aDays = aStart ? daysBetween(aStart, nowIso) : 0;
      const bDays = bStart ? daysBetween(bStart, nowIso) : 0;

      if (s === "pro_days_desc") return bDays - aDays;
      return aDays - bDays;
    });

    return list;
  }, [users, deferredSearch, filtersApplied]);

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
      registrationStatus: u.registrationStatus,
      emailVerified: u.emailVerified ? "Yes" : "No",
      accountStatus: u.accountStatus,
      planStatus: u.planStatus,
      subscriptionState: u.subscriptionState,
      joinedAt: u.joinedAt,
      xpPoints: u.xpPoints,
      lastActive: u.lastActiveLabel,
    }));
    downloadCsv("users-export.csv", rows);
  };

  const selectedCount = countSelectedFilters(filtersDraft);
  const isUnfilteredCohort = filtersApplied ? !hasAnyFilterSelected(filtersApplied) : false;

  const brazePayload = React.useMemo(() => {
    return {
      filters: filtersApplied ?? {},
      userIds: limitedUsers.map((u) => u.id),
    };
  }, [filtersApplied, limitedUsers]);

  const onSupportAction = async (userId: string, action: SupportAction) => {
    //  Production examples:
    // POST /api/admin/users/:id/resend-verification
    // POST /api/admin/users/:id/reset-password
    // POST /api/admin/users/:id/sync-billing
    // POST /api/admin/users/:id/grant-pro { plan: "PRO_1M", days: 30 }
    // POST /api/admin/users/:id/revoke-sessions
    console.log("SUPPORT ACTION:", { userId, action });
  };

  return {
    // state
    search,
    setSearch,
    filtersDraft,
    filtersApplied,

    users,
    setUsers,

    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    displayLimit,
    setDisplayLimit,

    selectedUser,
    isViewOpen,
    setIsViewOpen,

    editUser,
    isEditOpen,
    setIsEditOpen,

    deleteUser,
    isDeleteOpen,
    setIsDeleteOpen,

    isBrazeOpen,
    setIsBrazeOpen,

    // derived
    paginated,
    filteredUsers,
    limitedUsers,
    totalResults,
    totalPages,
    page,
    startIndex,
    overHardCap,
    overDisplayLimit,
    isUnfilteredCohort,
    selectedCount,
    brazePayload,

    // handlers
    handleFiltersChange,
    applyFilters,
    clearFilters,
    handleViewUser,
    handleEditUser,
    handleUpdateUser,
    handleRequestDelete,
    handleConfirmDelete,
    handleDownload,
    onSupportAction,

    // constants
    DISPLAY_LIMIT_OPTIONS,
    PAGE_SIZE_OPTIONS,
    MAX_ONSCREEN,
  };
}
