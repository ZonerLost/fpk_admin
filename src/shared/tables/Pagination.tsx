import React from "react";
import Button from "../inputs/Button";
import { cn } from "../utils/cn";
import { getPageItems } from "./pagination.utils";

const MAX_ALL_PAGE_SIZE = 5000;

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: Array<number | "All">;
  className?: string;
};

const DEFAULT_PAGE_SIZE_OPTIONS: Array<number | "All"> = [10, 20, 50, 100];

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  const pageItems = React.useMemo(
    () => getPageItems({ page: safePage, totalPages, siblingCount: 2 }),
    [safePage, totalPages]
  );

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === safePage) return;
    onPageChange(nextPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onPageSizeChange) return;

    const nextValue = event.target.value;
    const nextSize = nextValue === "all" ? MAX_ALL_PAGE_SIZE : Number(nextValue);
    if (!Number.isFinite(nextSize) || nextSize <= 0) return;

    onPageSizeChange(nextSize);
    onPageChange(1);
  };

  const selectValue =
    pageSize >= MAX_ALL_PAGE_SIZE && pageSizeOptions.includes("All")
      ? "all"
      : String(pageSize);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-100">{start}</span>-{" "}
        <span className="font-semibold text-slate-100">{end}</span> of{" "}
        <span className="font-semibold text-slate-100">{total}</span>
      </div>

      <div className="flex items-center gap-1">
        {pageItems.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                ...
              </span>
            );
          }

          const isActive = item === safePage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => handlePageChange(item)}
              className={cn(
                "h-9 min-w-9 rounded-full border px-3 text-xs transition-colors",
                isActive
                  ? "border-emerald-400/70 bg-emerald-500 text-black"
                  : "border-white/10 bg-transparent text-slate-100 hover:bg-white/5"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {onPageSizeChange ? (
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span>Rows per page</span>
            <select
              value={selectValue}
              onChange={handlePageSizeChange}
              className="h-9 rounded-lg border border-white/15 bg-black/20 px-2.5 text-xs text-slate-100 outline-none"
            >
              {pageSizeOptions.map((option) => {
                if (option === "All") {
                  return (
                    <option key="all" value="all" className="bg-black">
                      All
                    </option>
                  );
                }

                return (
                  <option key={option} value={option} className="bg-black">
                    {option}
                  </option>
                );
              })}
            </select>
          </label>
        ) : null}

        <Button
          variant="secondary"
          className="h-9 rounded-full border border-white/10 bg-transparent px-3 text-xs hover:bg-white/5"
          disabled={safePage === 1}
          onClick={() => handlePageChange(safePage - 1)}
        >
          Previous
        </Button>

        <Button
          variant="secondary"
          className="h-9 rounded-full border border-white/10 bg-transparent px-3 text-xs hover:bg-white/5"
          disabled={safePage >= totalPages}
          onClick={() => handlePageChange(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
