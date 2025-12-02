import React from "react";
import { cn } from "../utils/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode; // e.g. <Button> Add item </Button>
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center text-slate-100",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold md:text-lg">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-xs text-slate-400 md:text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
