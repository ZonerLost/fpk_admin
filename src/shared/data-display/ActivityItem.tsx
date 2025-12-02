import React from "react";
import { cn } from "../utils/cn";

type ActivityTone = "success" | "warning" | "danger" | "info";

type ActivityItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeAgo: string;
  tone?: ActivityTone;
  className?: string;
};

const toneClass: Record<ActivityTone, string> = {
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  danger: "bg-red-500/15 text-red-300",
  info: "bg-sky-500/15 text-sky-300",
};

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  description,
  timeAgo,
  tone = "info",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl bg-black/20 p-3",
        className
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs",
          toneClass[tone]
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-slate-100 md:text-sm">
            {title}
          </p>
          <span className="text-[11px] text-slate-500">{timeAgo}</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 md:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
