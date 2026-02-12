import React from "react";
import { cn } from "../utils/cn";

type TableToolbarProps = {
  search: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

const TableToolbar: React.FC<TableToolbarProps> = ({
  search,
  filters,
  actions,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">{search}</div>
        {actions && (
          <div className="flex flex-wrap justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
      {filters && (
        <div className="w-full text-xs md:text-sm">
          {filters}
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
