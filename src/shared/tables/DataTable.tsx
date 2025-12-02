import React from "react";
import { cn } from "../utils/cn";

export type Column<T> = {
  id: string;
  header: string;
  width?: string;
  align?: "left" | "right" | "center";
  cell?: (row: T) => React.ReactNode;
  accessor?: keyof T;
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;
  className?: string;
}

function DataTable<T>({
  columns,
  data,
  getRowKey,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-white/5 bg-black/20",
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] divide-y divide-white/5 text-sm">
          <thead className="bg-white/5">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-300 md:px-4 md:py-3",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black/10">
            {data.map((row, idx) => (
              <tr
                key={getRowKey(row, idx)}
                className="transition-colors hover:bg-white/5"
              >
                {columns.map((col) => {
                  let content: React.ReactNode = null;

                  if (col.cell) {
                    content = col.cell(row);
                  } else if (col.accessor) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content = (row as any)[col.accessor];
                  }

                  return (
                    <td
                      key={col.id}
                      className={cn(
                        "px-3 py-2 align-middle text-xs text-slate-100 md:px-4 md:py-3 md:text-sm",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-xs text-slate-500 md:text-sm"
                >
                  No data to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
