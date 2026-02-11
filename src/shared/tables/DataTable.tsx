import React from "react";
import { cn } from "../utils/cn";

export type ColumnAlign = "left" | "center" | "right";

export type Column<T> = {
  id: string;
  header: React.ReactNode;
  /**
   * Prefer cell renderer for complex UI.
   */
  cell?: (row: T) => React.ReactNode;
  /**
   * Simple accessor for basic text values.
   */
  accessor?: keyof T;
  align?: ColumnAlign;
  width?: string;

  /**
   * Optional class hooks for layout control
   */
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string;

  /**
   * Container styles (no horizontal scroll by default)
   */
  containerClassName?: string;
  tableClassName?: string;

  /**
   * Row click (optional)
   */
  onRowClick?: (row: T) => void;
};

function isReactNodeValue(val: unknown): val is React.ReactNode {
  return (
    val === null ||
    val === undefined ||
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean" ||
    React.isValidElement(val) ||
    Array.isArray(val)
  );
}

function renderCellValue<T>(row: T, col: Column<T>) {
  if (col.cell) return col.cell(row);

  if (col.accessor) {
    const value = row[col.accessor];

    // Safe fallback for unknown generic types
    if (isReactNodeValue(value)) return value;
    return value === undefined || value === null ? "N/A" : String(value);
  }

  return "N/A";
}

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  containerClassName,
  tableClassName,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full", containerClassName)}>
      <table className={cn("w-full table-fixed border-separate border-spacing-0", tableClassName)}>
        <thead>
          <tr className="bg-white/5">
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-300",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.headerClassName
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-slate-400"
              >
                No results
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={getRowKey(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-white/5",
                  onRowClick && "cursor-pointer hover:bg-white/[0.04]"
                )}
              >
                {columns.map((col) => {
                  const content = renderCellValue(row, col);

                  return (
                    <td
                      key={col.id}
                      className={cn(
                        "px-4 py-3 align-middle text-xs text-slate-100 md:text-sm",
                        "truncate",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.cellClassName
                      )}
                      style={col.width ? { width: col.width } : undefined}
                      title={typeof content === "string" ? content : undefined}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
