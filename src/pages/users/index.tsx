/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import ConfirmDialog from "../../shared/overlay/ConfirmDialog";

import UsersFiltersBar from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import UserDetailsSlideOver from "../../components/users/UserDetailsSlideOver";
import EditUserSlideOver from "../../components/users/EditUserSlideOver";
import BrazeMessageSlideOver from "../../components/users/BrazeMessageSlideOver";

import { FiSearch, FiFilter, FiDownload, FiSend } from "react-icons/fi";
import { useUsersPage } from "./useUsersPage";

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
  const { selectedCount, canApply, onApply, onClear, onDownload, onBraze, downloadDisabled, brazeDisabled } = props;

  const pillBase = "h-10 rounded-full border px-4 text-xs font-semibold transition md:text-sm";
  const pillSecondary = `${pillBase} border-white/10 bg-white/5 text-slate-200 hover:bg-white/10`;
  const pillApplyEnabled = `${pillBase} border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15`;

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible sm:pb-0">
          <Button
            variant="secondary"
            onClick={onApply}
            disabled={!canApply}
            className={["shrink-0", canApply ? pillApplyEnabled : pillSecondary, "disabled:opacity-50"].join(" ")}
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

          <Button variant="secondary" onClick={onClear} className={[pillSecondary, "shrink-0"].join(" ")}>
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">Reset</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onDownload}
            disabled={downloadDisabled}
            className={[pillSecondary, "shrink-0", "disabled:opacity-50"].join(" ")}
          >
            <FiDownload className="mr-2" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onBraze}
            disabled={brazeDisabled}
            className={[
              "shrink-0",
              pillSecondary,
              "border-amber-400/20 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15",
              "disabled:opacity-50",
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
  const vm = useUsersPage();

  return (
    <>
      <PageShell>
        <PageHeader
          title="User Management"
          subtitle="Support console: status, verification, billing/subscription state, evidence and actions."
          actions={
            <UsersHeaderActions
              selectedCount={vm.selectedCount}
              canApply={true}
              onApply={vm.applyFilters}
              onClear={vm.clearFilters}
              onDownload={vm.handleDownload}
              onBraze={() => vm.setIsBrazeOpen(true)}
              downloadDisabled={!vm.filtersApplied || vm.limitedUsers.length === 0}
              brazeDisabled={!vm.filtersApplied || vm.limitedUsers.length === 0}
            />
          }
        />

        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={vm.search}
                onChange={vm.setSearch}
                placeholder="Search by name, email, phone, user ID..."
                leftIcon={<FiSearch />}
                className="h-10 bg-[#071810]"
              />
            }
            filters={<UsersFiltersBar filters={vm.filtersDraft} onChange={vm.handleFiltersChange} />}
          />
        </SectionCard>

        {!vm.filtersApplied ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            <div className="text-base font-semibold text-white">Select filters to load users</div>
            <p className="mt-2 text-slate-300">
              To avoid loading too many records, this page requires filters first.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-slate-300">
                  Results: <span className="text-slate-100">{vm.filteredUsers.length}</span>
                  {vm.overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Hard cap {vm.MAX_ONSCREEN}; refine filters)
                    </span>
                  )}
                  {vm.overDisplayLimit && !vm.overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Showing first {vm.limitedUsers.length}; increase display limit)
                    </span>
                  )}
                  {vm.isUnfilteredCohort && <span className="ml-2 text-amber-200">(Large cohort)</span>}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Max cohort:</span>
                    <select
                      value={vm.displayLimit}
                      onChange={(e) => vm.setDisplayLimit(Number(e.target.value) as any)}
                      className="h-9 rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none"
                    >
                      {vm.DISPLAY_LIMIT_OPTIONS.map((n) => (
                        <option key={n} value={n} className="bg-black">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Rows/page:</span>
                    <select
                      value={vm.pageSize}
                      onChange={(e) => {
                        vm.setPageSize(Number(e.target.value) as any);
                        vm.setCurrentPage(1);
                      }}
                      className="h-9 rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none"
                    >
                      {vm.PAGE_SIZE_OPTIONS.map((n) => (
                        <option key={n} value={n} className="bg-black">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <UsersTable users={vm.paginated} onView={vm.handleViewUser} onEdit={vm.handleEditUser} onDelete={vm.handleRequestDelete} />

            <div className="flex flex-col items-stretch justify-between gap-3 text-xs text-slate-400 md:flex-row md:items-center">
              <span className="text-center md:text-left">
                Showing{" "}
                <span className="font-semibold text-slate-100">{vm.totalResults === 0 ? 0 : vm.startIndex + 1}</span> to{" "}
                <span className="font-semibold text-slate-100">
                  {Math.min(vm.startIndex + vm.pageSize, vm.totalResults)}
                </span>{" "}
                of <span className="font-semibold text-slate-100">{vm.totalResults}</span>
              </span>

              <div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
                <Button
                  variant="secondary"
                  className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10 md:w-auto"
                  disabled={vm.page === 1}
                  onClick={() => vm.setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-1 text-xs text-slate-100 hover:bg-white/10 md:w-auto"
                  disabled={vm.page === vm.totalPages}
                  onClick={() => vm.setCurrentPage((p) => Math.min(vm.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageShell>

      <UserDetailsSlideOver
        isOpen={vm.isViewOpen}
        user={vm.selectedUser}
        onClose={() => vm.setIsViewOpen(false)}
        onSupportAction={vm.onSupportAction}
      />

      <EditUserSlideOver
        isOpen={vm.isEditOpen}
        user={vm.editUser}
        onClose={() => vm.setIsEditOpen(false)}
        onUpdate={vm.handleUpdateUser}
      />

      <BrazeMessageSlideOver
        isOpen={vm.isBrazeOpen}
        onClose={() => vm.setIsBrazeOpen(false)}
        cohortCount={vm.limitedUsers.length}
        payload={vm.brazePayload as any}
        onSend={async ({ campaignId, messageName }) => {
          console.log("BRAZE TRIGGER:", { campaignId, messageName, ...vm.brazePayload });
        }}
      />

      <ConfirmDialog
        isOpen={vm.isDeleteOpen}
        title="Delete user?"
        description={
          vm.deleteUser
            ? `This will permanently remove ${vm.deleteUser.name} (${vm.deleteUser.userId}).`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => {
          vm.setIsDeleteOpen(false);
        }}
        onConfirm={vm.handleConfirmDelete}
      />
    </>
  );
};

export default UsersPage;
