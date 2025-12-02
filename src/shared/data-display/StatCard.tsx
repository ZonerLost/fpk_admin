import React from "react";
import SectionCard from "../layout/SectionCard";
import { cn } from "../utils/cn";

type StatDelta = {
  value: string;              // "+5.2%"
  direction: "up" | "down";
};

type StatCardProps = {
  label: string;
  value: string | number;
  delta?: StatDelta;
  icon?: React.ReactNode;
  className?: string;
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  icon,
  className,
}) => {
  return (
    <SectionCard
      className={cn("flex flex-col justify-between", className)}
      contentClassName="flex items-center justify-between gap-3"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="text-2xl font-bold text-white md:text-3xl">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "text-xs font-medium",
              delta.direction === "up"
                ? "text-emerald-400"
                : "text-red-400"
            )}
          >
            {delta.value}
          </span>
        )}
      </div>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
          {icon}
        </div>
      )}
    </SectionCard>
  );
};

export default StatCard;
