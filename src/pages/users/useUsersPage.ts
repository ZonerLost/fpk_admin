/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { downloadCsv } from "../../shared/utils/downloadCsv";
import type { UserItem, SupportAction } from "../../components/users/types";
import type { UsersFiltersState } from "../../components/users/UsersFiltersBar";
import { COUNTRIES, LANGUAGES } from "../../shared/constant/geo";

const MAX_ONSCREEN = 5000;
const DISPLAY_LIMIT_OPTIONS = [100, 500, 1000, 5000] as const;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const DEFAULT_FILTERS: UsersFiltersState = {
  country: "All",
  language: "All",
  status: "All",
  lastActive: "All Time",
  sort: "joined_desc",
};

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
  return f.country !== "All" || f.language !== "All" || f.status !== "All" || f.lastActive !== "All Time";
}

function countSelectedFilters(f: UsersFiltersState) {
  return [f.country !== "All", f.language !== "All", f.status !== "All", f.lastActive !== "All Time"].filter(Boolean)
    .length;
}

function statusMatches(user: UserItem, status: UsersFiltersState["status"]) {
  if (status === "All") return true;
  if (status === "Registered") return user.registrationStatus === "Registered" && user.accountStatus === "Registered";
  if (status === "PRO 1M") return user.accountStatus === "PRO_1M";
  if (status === "PRO 6M") return user.accountStatus === "PRO_6M";
  return user.accountStatus === "PRO_12M";
}

function getProStart(user: UserItem): string | undefined {
  const hist = user.membershipHistory ?? [];
  const active = [...hist].sort((a, b) => (a.startedAt > b.startedAt ? -1 : 1))[0];
  if (active?.startedAt) return active.startedAt;

  if (user.accountStatus !== "Registered") return user.joinedAt;
  return undefined;
}

// ---------- mock users for pagination + default list ----------
const NAMES = [
  "Alex Gunnar",
  "Sofia Rey",
  "Liam Carter",
  "Noah Khan",
  "Emma Stone",
  "Mia Ahmed",
  "Ava Brown",
  "Lucas Silva",
  "Ethan Ali",
  "Olivia Kim",
  "Isabella Noor",
  "James Miller",
  "Benjamin Lee",
  "Amelia Jones",
  "Charlotte Davis",
  "Henry Wilson",
  "Zara Malik",
  "Daniel Taylor",
  "Hannah White",
  "Aiden Walker",
];

function pick<T>(arr: readonly T[], i: number) {
  return arr[i % arr.length];
}

function makeLastActiveLabel(i: number) {
  const presets = ["5 mins ago", "45 mins ago", "2 hours ago", "8 hours ago", "1 day ago", "3 days ago", "1 week ago"];
  return presets[i % presets.length];
}

function makeMockUsers(total = 42): UserItem[] {
  const now = Date.now();

  const safeCountries = COUNTRIES?.length ? COUNTRIES : ["US", "UK", "CA", "AU", "PK"];
  const safeLangs = LANGUAGES?.length ? LANGUAGES : ["EN", "ES", "FR", "DE", "UR"];

  return Array.from({ length: total }).map((_, idx) => {
    const name = pick(NAMES, idx);
    const joinedAt = new Date(now - idx * 1000 * 60 * 60 * 18).toISOString(); // every ~18h older
    const country = pick(safeCountries, idx);
    const language = pick(safeLangs, idx);

    const registrationStatus = idx % 9 === 0 ? "Unregistered" : "Registered";
    const accountStatus: UserItem["accountStatus"] =
      registrationStatus === "Unregistered"
        ? "Registered"
        : idx % 8 === 0
        ? "PRO_12M"
        : idx % 5 === 0
        ? "PRO_6M"
        : idx % 3 === 0
        ? "PRO_1M"
        : "Registered";

    const planStatus: UserItem["planStatus"] = accountStatus === "Registered" ? "Free" : "Pro";

    const subscriptionState: UserItem["subscriptionState"] =
      planStatus === "Free" ? "None" : idx % 7 === 0 ? "PastDue" : "Active";

    const emailVerified = idx % 4 !== 0;

    const lastActiveLabel = makeLastActiveLabel(idx);

    return {
      id: String(idx + 1),
      userId: `USR-${String(1000 + idx).padStart(4, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: idx % 6 === 0 ? `+1 555 00${idx}` : undefined,
      avatarUrl: idx % 3 === 0 ? `https://randomuser.me/api/portraits/${idx % 2 ? "women" : "men"}/${(idx % 70) + 1}.jpg` : undefined,

      country,
      language,

      registrationStatus,
      emailVerified,

      accountStatus,
      planStatus,
      subscriptionState,

      joinedAt,
      xpPoints: 2000 + idx * 210,

      lastActiveLabel,

      evidence: {
        lastLoginAt: new Date(now - idx * 1000 * 60 * 60 * 6).toISOString(),
        lastActiveAt: new Date(now - idx * 1000 * 60 * 60 * 2).toISOString(),
        lastPaymentAt: planStatus === "Pro" ? new Date(now - idx * 1000 * 60 * 60 * 24 * 10).toISOString() : undefined,
        lastErrorAt: idx % 10 === 0 ? new Date(now - idx * 1000 * 60 * 60 * 3).toISOString() : undefined,
        auditLogCount: idx % 9,
      },

      membershipHistory:
        accountStatus !== "Registered"
          ? [
              {
                id: `m-${idx + 1}`,
                status: accountStatus,
                subscriptionState: subscriptionState === "None" ? "Active" : (subscriptionState as any),
                startedAt: new Date(now - idx * 1000 * 60 * 60 * 24 * 30).toISOString(),
              },
            ]
          : [],

      paymentHistory:
        accountStatus !== "Registered"
          ? [
              {
                id: `p-${idx + 1}`,
                amount: accountStatus === "PRO_12M" ? 99.99 : accountStatus === "PRO_6M" ? 59.99 : 12.99,
                currency: "USD",
                paidAt: new Date(now - idx * 1000 * 60 * 60 * 24 * 10).toISOString(),
                status: idx % 7 === 0 ? "Failed" : "Paid",
                providerRef: `pi_${idx + 100}`,
              },
            ]
          : [],
    };
  });
}

export function useUsersPage() {
  const [search, setSearch] = React.useState("");

  const [filtersDraft, setFiltersDraft] = React.useState<UsersFiltersState>(DEFAULT_FILTERS);

  // ✅ IMPORTANT: show users by default (no "apply required" gate)
  const [filtersApplied, setFiltersApplied] = React.useState<UsersFiltersState>(DEFAULT_FILTERS);

  // ✅ Load users immediately so table shows (latest signups view)
  const [users, setUsers] = React.useState<UserItem[]>(() => makeMockUsers(48));

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [displayLimit, setDisplayLimit] = React.useState<(typeof DISPLAY_LIMIT_OPTIONS)[number]>(100);

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

  // ✅ Apply = commit draft -> applied (like before)
  const applyFilters = () => {
    setFiltersApplied(filtersDraft);
    setCurrentPage(1);

    // Production: fetch backend here using filtersDraft + pagination
    // For now: dataset already loaded.
  };

  // ✅ Clear should reset back to latest signups view (not empty)
  const clearFilters = () => {
    setFiltersDraft(DEFAULT_FILTERS);
    setFiltersApplied(DEFAULT_FILTERS);
    setSearch("");
    setCurrentPage(1);

    // keep users available; if empty for any reason, re-seed
    setUsers((prev) => (prev.length ? prev : makeMockUsers(48)));
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
    const q = deferredSearch.trim().toLowerCase();
    const f = filtersApplied;

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

      if (f.country !== "All" && user.country !== f.country) return false;
      if (f.language !== "All" && user.language !== f.language) return false;
      if (!statusMatches(user, f.status)) return false;
      if (!withinWindow(user.lastActiveLabel, f.lastActive)) return false;

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
  const isUnfilteredCohort = !hasAnyFilterSelected(filtersApplied);

  const brazePayload = React.useMemo(() => {
    return {
      filters: filtersApplied ?? {},
      userIds: limitedUsers.map((u) => u.id),
    };
  }, [filtersApplied, limitedUsers]);

  const onSupportAction = async (userId: string, action: SupportAction) => {
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
